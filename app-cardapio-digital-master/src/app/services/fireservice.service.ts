import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from '@firebase/app-compat';

@Injectable({
  providedIn: 'root'
})
export class FireserviceService {

  public entradas: Observable<any[]>;
  public saidas: Observable<any[]>;
  public valorentradas: any = [];
  public valorsaidas: any = [];

  // currentUser: firebase.User;

  constructor(public firestore: AngularFirestore, public auth: AngularFireAuth, public angularFire: AngularFireAuth
  ) { // Salvar os dados do usuário no armazenamento local quando conectado e configurando nulo quando desconectado
    /*   this.angularFire.onAuthStateChanged((user) => {
         if (user) {
           // O usuário está conectado.
           this.currentUser = user;
           localStorage.setItem('user', JSON.stringify(this.currentUser));
           JSON.parse(localStorage.getItem('user'));
           //this.verificaUserAdmin();
         } else {
           // Nenhum usuário está conectado.
           this.currentUser = null;
           localStorage.removeItem('isAdmin');
           JSON.parse(localStorage.getItem('user'));
         }
       });
      }
 */
  }

  loginwithEmail(data) {
    return this.auth.signInWithEmailAndPassword(data.email, data.password);
  }

  /*
  logout(data){
    return this.auth.signOut();
  }
*/

  // Sign out
  signOut() {
    this.angularFire.signOut();
  }


  // signup(data){
  //   return this.auth.createUserWithEmailAndPassword(data.email, data.password);
  // }
  saveDetails(data) {
    return this.firestore.collection("produtos").doc(data.uid).set(data);
  }
  getDetails(data) {
    return this.firestore.collection("produtos").doc(data.uid).valueChanges();
  }

  getUsers(data) {
    return this.firestore.collection("usuarios").doc(data).valueChanges();
  }

}
