import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../shared/auth.service";

@Component({
    standalone: true,
    templateUrl: './login.component.html',
    imports: [
        ReactiveFormsModule,
    ]
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup = {} as FormGroup;

    constructor(private fb: FormBuilder, private auth: AuthService) {}

    onLogin() {
        // implement
        this.auth.loginUser(this.loginForm.value).subscribe({
            next: data => {
                console.debug('onLogin()', data);
                this.loginForm.reset();
            },
            error: err => console.error('onSend()', err),
        });
    }

    ngOnInit():any {
        this.loginForm = this.fb.group({
            email: ['', Validators.required],
            password: ['', Validators.required],
        });
    }
}
