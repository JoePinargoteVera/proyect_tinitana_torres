import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { catchError, tap } from 'rxjs';
import { AuthService } from 'src/app/Service/auth.service';
import { ServiceStorage } from 'src/app/Service/storage.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {

  loginForm: FormGroup;
  errorMessage!: string;
  isInputFocused: boolean = false;

  constructor(private formBuilder: FormBuilder, private appComponent: AppComponent,
    private serviceStorage: ServiceStorage, private auth: AuthService, private router: Router, 
    private cookieService: CookieService){

      this.appComponent.showNavbar = false;
      this.loginForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
      });
    }

    get email() {
      return this.loginForm.get('email');
    }
    get password() {
      return this.loginForm.get('password');
    }

    

onInputFocus(): void {
    this.isInputFocused = true;
}

onInputBlur(): void {
    this.isInputFocused = false;
}

    onSubmit(form: any) {
      this.auth.login(form).pipe(
        tap(dato => {
          this.cookieService.set('token', dato.token);
      
          if (dato.status == '200' && form?.email) {
            // this.store.dispatch(loginSuccess(form));
            console.log(dato.user);
            this.serviceStorage.guardarObjeto('user', dato.user);
            this.router.navigate(['/home']);
          }
        }),
        catchError(error => {
          this.errorMessage = error.error.message;
          console.log(error.error.message);
          setTimeout(() => {
            this.errorMessage = '';
          }, 5000);
          throw error;
        })
      ).subscribe();
      
  
    }

}
