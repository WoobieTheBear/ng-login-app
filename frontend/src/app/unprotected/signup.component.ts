import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../shared/auth.service";

@Component({
    standalone: true,
    templateUrl: './signup.component.html',
    imports: [
        ReactiveFormsModule,
    ]
})
export class SignupComponent implements OnInit {
    signupForm: FormGroup = {} as FormGroup;

    constructor(private fb: FormBuilder, private auth: AuthService) {}

    onSignup() {
        // implement$
        this.auth.signupUser(this.signupForm.value).subscribe({
            next: data => {
                console.debug('onSignup()', data);
            },
            error: err => console.error('onSend()', err),
        });
    }

    ngOnInit(): any {
        this.signupForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required], 
            email: ['', Validators.required],
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required],
        });
    }
}
