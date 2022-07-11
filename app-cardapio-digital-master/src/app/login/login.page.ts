import { Component, NgZone, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { FireserviceService } from '../services/fireservice.service';
import { Storage } from '@capacitor/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public email: any;
  public password: any;

  public usuariologado: any;

  public logado: Observable<any[]>;

  private collectionname : string = "produtos";

  constructor(private firestore: AngularFirestore,
    public router: Router,
    private ngZone: NgZone,
    private FireserviceService: FireserviceService,
    public authService: AuthService
  ) { }

  ngOnInit() {
    localStorage.setItem('produtos', JSON.stringify(""));
    Storage.set({
      key: 'produtos',
      value: JSON.stringify('null')});
  }

  loginUsuario() {
    this.FireserviceService.loginwithEmail({ email: this.email, password: this.password }).then(res=>{
      console.log(res);
      if(res.user.uid){
         Storage.set({
          key: 'produtos',
          value: JSON.stringify(res.user.uid)
        });
        localStorage.setItem('produtos', JSON.stringify(res.user.uid));
        this.FireserviceService.getDetails({uid:res.user.uid}).subscribe(res=>{
          console.log(res + 'linha 47');
          localStorage.getItem('produtos').replace(/"/g, "");
          this.usuariologado = localStorage.getItem('produtos').replace(/"/g, "");
          console.log(localStorage.getItem('produtos').replace(/"/g, "") + ' linha 53' );
           this.irParatab1();
        })
      }
  }, err=>{
    let str = err.toString().replace(/.*\(|\).*/g, '');
    console.log(str) // Pega o que está entre parenteses
    alert(this.authService.verificarErro(str));
  })
}

irParatab1(): void {
  this.router.navigateByUrl('inicio');
}

public getFromFirestore1(){
  //const usuariologado: any = localStorage.getItem('usuarios').replace(/"/g, "");
console.log(this.usuariologado + ' linha 73')
 return this.firestore.collection(this.collectionname + '/' + this.usuariologado).valueChanges({idField: 'id'});
}
}
