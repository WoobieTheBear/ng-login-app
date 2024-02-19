import { RouterModule, Routes } from "@angular/router";
import { SignupComponent } from "./unprotected/signup.component";
import { LoginComponent } from "./unprotected/login.component";
import { ProtectedComponent } from "./protected/protected.component";
import { StartComponent } from "./unprotected/start.component";
import { protectedGuard } from "./protected/protected.guard";

const APP_ROUTES: Routes = [
    { path: '', component: StartComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'login', component: LoginComponent },
    { path: 'protected', component: ProtectedComponent, canActivate: [ protectedGuard ] }
]

export const routing = RouterModule.forRoot(APP_ROUTES);