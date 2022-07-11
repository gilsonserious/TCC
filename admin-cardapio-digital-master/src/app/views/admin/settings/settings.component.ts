import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";
import { AngularFirestore } from '@angular/fire/compat/firestore/';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { map, finalize } from "rxjs/operators";
import { Observable } from "rxjs";
import { AuthGuard } from "src/app/guards/auth-guard.service";
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { timingSafeEqual } from "crypto";
// import {AlertModalService} from '../../shared/alert-modal.service';
// import { EventEmitter } from "stream";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
})
export class SettingsComponent implements OnInit {

  @Input()
  get color(): string {
    return this._color;
  }
  set color(color: string) {
    this._color = color !== "light" && color !== "dark" ? "light" : color;
  }
  private _color = "light";

  novo: boolean = false;
  listar: boolean = false;
  perfil:  boolean = false;

  dados = [];
  usuarios = [];
  categorias = [];

  usuario = {
    nome: null,
    senha: null,
    email: null,
    imagem: null,
    celular: null,
    username: null,
    uid: null
  }

  title = "cloudsSorage";
  selectedFile: File = null;
  fb;
  downloadURL: Observable<string>;
  opcional: string = null;


  constructor( private storage: AngularFireStorage,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    public auth: AuthGuard) {}

    carregar() {
      //Listar Usuarios
      this.afs.firestore.collection('usuarios').get()
        .then((r) => {
          let users = [];
          r.forEach((rr) => {
            let obj = rr.data();
            obj['id'] = rr.id;
            users.push(obj);
          });
  
          this.usuarios = users;
          console.log(this.usuarios);
        })
    }
  
    ngOnInit(): void {
      // this.afAuth.signInAnonymously();
      this.carregar()
    }
  
    testandoo(id) {
  
      this.perfil = true;
  
      var teste = (cliente) => cliente.uid == id
  
      this.dados = this.usuarios.filter(teste);
  
      console.log(this.dados)
  
    }
  
    listarUsers() {
      this.listar = true;
    }

    voltarListar() {
      this.listar = false;
      this.perfil = false;
    }
  
    //Upload de imagem
    onFileSelected(event) {
      var n = Date.now();
      const file = event.target.files[0];
      const filePath = `imagems/${n}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(`imagems/${n}`, file);
      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            this.downloadURL = fileRef.getDownloadURL();
            this.downloadURL.subscribe(url => {
              //Salva a URL gerada para o arquivo
              if (url) {
                this.fb = url;
                this.usuario.imagem = this.fb;
              }
            });
          })
        )
        .subscribe(url => {
          if (url) {
            console.log(url);
          }
        });
    }
  
  
    salvar() {
      if (
        this.usuario.nome && this.usuario.email && this.usuario.senha && this.usuario.username
      ) {
        this.auth.signup({ email: this.usuario.email, password: this.usuario.senha }).then(res => {
          if (res.user.uid) {
            this.carregar();
            this.novo = false;
            this.auth.saveDetails(this.usuario = {
              nome: this.usuario.nome,
              email: this.usuario.email,
              senha: this.usuario.senha,
              celular: this.usuario.celular,
              imagem: this.usuario.imagem,
              username: this.usuario.username,
              uid: res.user.uid
            }).then(res => {
              alert('Conta Criada!');
              this.usuario = {
                nome: null,
                email: null,
                senha: null,
                celular: null,
                imagem: null,
                username: null,
                uid: null
              }
            }, err => {
              console.log(this.auth.verificarErro(err));
              alert(this.auth.verificarErro(err.error));
            })
          }
        }, err => {
          let str = err.toString().replace(/.*\(|\).*/g, '');
          console.log(str) // Pega o que está entre parenteses
          alert(this.auth.verificarErro(str));
        })
      }
      else {
        alert('Por favor, preencha todos os campos');
      }
    }
  }
  