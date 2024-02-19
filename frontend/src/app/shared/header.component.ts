import { Component } from "@angular/core";
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";

@Component({
    selector: 'my-header',
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
})
export class HeaderComponent {
    isAuthenticated: boolean = false;
    constructor(private router: Router, private auth: AuthService) {
        this.auth.authState().subscribe({
            next: status => {
                this.isAuthenticated = status;
            },
            error: err => console.error('HeaderComponent().constructor()', err),
        })
    }
    onLogout(){
        this.auth.logout().subscribe({
            next: response => {
                console.debug('HeaderComponent.onLogout()', response);
                this.isAuthenticated = false;
                this.router.navigate(['/']);
            },
            error: err => console.error('HeaderComponent().constructor()', err),
        });
    }
}
