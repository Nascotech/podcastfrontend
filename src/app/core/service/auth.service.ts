import { Injectable } from '@angular/core';
import { of, Observable, throwError } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

//   login(loginContext: LoginContextInterface): Observable<User> {
//     if (
//       loginContext.username === defaultUser.username &&
//       loginContext.password === defaultUser.password
//     ) {
//         return of(defaultUser);
//     }

//     return throwError('Invalid username or password');
//   }

}