import { Injectable } from '@angular/core';
import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class lockGuard implements CanActivate {
  constructor(private apiService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.apiService.isAuthenticated()) {
      this.router.navigate(['/home']); // Redirige a la página de inicio si ya está autenticado
      return false;
    } else {
      return true;
    }
  }
}
