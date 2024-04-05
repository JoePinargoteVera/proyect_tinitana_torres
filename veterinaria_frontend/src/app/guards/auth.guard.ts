import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../Service/auth.service';
import { Observable } from 'rxjs';

// export const AuthGuard: CanActivateFn = (
//   route: ActivatedRouteSnapshot,
//   state: RouterStateSnapshot
// ):
//   Observable<boolean | UrlTree> 
//   | Promise<boolean | UrlTree> 
//   | boolean 
//   | UrlTree=> {
//   return inject(AuthService).isAuthenticated()
//     ? true
//     : inject(Router).createUrlTree(['/login']);
// };

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

}