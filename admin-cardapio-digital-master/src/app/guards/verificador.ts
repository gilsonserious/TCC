import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Injectable } from '@angular/core';
//import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot,  Route } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {


  constructor(private afAuth: AngularFireAuth) {
  }

  logado(){
    return new Promise((resolve, reject) => {
      this.afAuth.authState.subscribe((user) => {
          if(user){
              resolve(user)
          }
          else {
              reject(user)
          }
      })
    });
  }

}