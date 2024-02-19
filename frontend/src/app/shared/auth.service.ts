import { HttpClient, HttpHeaders } from "@angular/common/http";
import { User } from "./user.interface";
import { Injectable } from "@angular/core";
import { EMPTY, Observable, Subject, catchError, map } from "rxjs";
import { origin, baseUrl, authTokenName } from "../app.config";
import { AuthResponse } from "./auth-response.interface";

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private user?: User;
    private token: string | null = null;
    private loggedIn: Subject<boolean> = new Subject<boolean>();
    private headerTemplate: any = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Headers': 'X-Requested-With',
    };

    constructor(private http: HttpClient) {}

    public getToken(): string | null {
        return localStorage.getItem(authTokenName);
    }

    signupUser(user: User): Observable<any>{
        const body = JSON.stringify(user);
        const headers = new HttpHeaders(this.headerTemplate);
        return this.http.post( `${baseUrl}/signup`, body, { headers: headers } ).pipe(
            map( (response) => {
                console.debug( 'signupUser() response:', response);
                return <any>response;
            } ),
            catchError( (err) => {
                const { error: errorObject } = err;
                console.error( 'signupUser() error:', errorObject);
                return EMPTY;
            } )
        );
    }

    loginUser(credentials: User): Observable<any> {
        const body = JSON.stringify(credentials);
        console.log('loginUser()');
        const headers = new HttpHeaders(this.headerTemplate);
        return this.http.post<AuthResponse>( `${baseUrl}/login`, body, { headers: headers } ).pipe(
            map( (response) => {
                console.debug( 'loginUser() response:', response);
                this.user = response.user;
                this.token = response.token;
                this.headerTemplate['Authorization'] = `Bearer ${this.token}`;
                this.loggedIn.next(true);
                return response; 
            } ),
            catchError( (err) => {
                const { error: errorObject } = err;
                console.error( 'loginUser() error:', errorObject);
                this.loggedIn.next(false);
                return EMPTY;
            } )
        );
    }

    logout(): Observable<any> {
        localStorage.getItem(authTokenName);
        console.log('logout()', this.headerTemplate);
        const headers = new HttpHeaders(this.headerTemplate);

        return this.http.get( `${baseUrl}/logout`, { headers: headers, withCredentials: true } ).pipe(
            map( (data) => { 
                this.loggedIn.next(false);
                delete this.headerTemplate['Authorization'];
                this.token = null;
                return <any[]>data;
            } ),
            catchError( (err) => {
                console.error( 'logout() error:', err)
                this.loggedIn.next(false);
                return EMPTY;
            } )
        );
    }

    authState(): Observable<boolean> {
        return this.loggedIn.asObservable();
    }

    isAuthenticated(): boolean {
        console.log( 'isAuthenticated()', this.token )
        return (this.token !== null) ? true : false;
    }
}