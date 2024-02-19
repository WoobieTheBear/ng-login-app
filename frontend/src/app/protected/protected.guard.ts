import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from "@angular/router";
import { inject } from "@angular/core";
import { AuthService } from "../shared/auth.service";


export const protectedGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
): boolean => {
    const authenticated = inject(AuthService).isAuthenticated();
    console.log( 'protectedGuard()', authenticated )
    return authenticated;
}