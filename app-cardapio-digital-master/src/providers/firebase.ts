//import { Injectable } from "@angular/core";
import * as firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/compat/firestore/';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {

    // horario: number;
    // dia: number;
    config;
    carrinho = [];

    constructor(
        private afs: AngularFirestore,
        private afAuth: AngularFireAuth
    ) { }

    iniciar() {
        return new Promise<any>((resolve, reject) => {
            //Login anonimo
            this.afAuth.signInAnonymously().then(() => {
                //Recuperar configurações
                this.afs.firestore.collection('config').doc('config').get().then((r) => {
                    //Atribuir a variavel global (para recuperarmos de outras paginas)
                    this.config = r.data();
                    resolve(this.config);
                })
            })
        })
    }


    agendamentos() {
        return new Promise<any>((resolve, reject) => {
            //Recuperar pedidos
            this.afs.firestore.collection('pedidos').get().then((lista) => {
                let array = [];
                lista.forEach((item) => {
                    //Formatar dado
                    let obj = item.data();
                    obj['id'] = item.id;
                    array.push(obj.cliente);
                });

                console.log(array)
                resolve(array)
            })
        })
    }

    categorias() {
        return new Promise<any>((resolve, reject) => {
            //Recuperar categorias
            this.afs.firestore.collection('categorias').get().then((lista) => {
                let array = [];
                lista.forEach((item) => {
                    //Formatar dado
                    let obj = item.data();
                    obj['id'] = item.id;
                    array.push(obj);
                });

                resolve(array)
            })
        })
    }

    verificaData(data) {
        return new Promise<any>((resolve, reject) => {
            //Recuperar categorias
            this.afs.firestore.collection('pedidos').where('cliente.dia', '==', data).get().then((lista) => {
                let array = [];
                let dia: number;
                lista.forEach((item) => {
                    //Formatar dado
                    let obj = item.data();
                    obj['id'] = item.id;
                    array.push(obj);
                });

                dia = array.length;

                console.log(array.length)

                resolve(array.length)

            })
        })

    }

    verificaHorario(horario) {
        return new Promise<any>((resolve, reject) => {
            //Recuperar categorias
            this.afs.firestore.collection('pedidos').where('cliente.horario', '==', horario).get().then((lista) => {
                let array = [];
                let horario: number;
                lista.forEach((item) => {
                    //Formatar dado
                    let obj = item.data();
                    obj['id'] = item.id;
                    array.push(obj);
                });

                horario = array.length;

                console.log(array.length)

                resolve(array.length)
            })
        })
    }

    usuario(uid) {
        return new Promise<any>((resolve, reject) => {
            //Recuperar categorias
            this.afs.firestore.collection('usuarios').where('uid', '==', uid).get().then((lista) => {
                let array = [];

                lista.forEach((item) => {
                    //Formatar dado
                    let obj = item.data();
                    obj['id'] = item.id;
                    array.push(obj);
                });

                console.log(array[0].username)

                localStorage.setItem('usuario', array[0].username)

                resolve(array[0].username.toString())
            })
        })
    }

    usuarioImagem(uid) {
        return new Promise<any>((resolve, reject) => {
            //Recuperar categorias
            this.afs.firestore.collection('usuarios').where('uid', '==', uid).get().then((lista) => {
                let array = [];

                lista.forEach((item) => {
                    //Formatar dado
                    let obj = item.data();
                    obj['id'] = item.id;
                    array.push(obj);
                });

                console.log(array[0].imagem)

                localStorage.setItem('usuarioImagem', array[0].imagem)

                resolve(array[0].imagem.toString())
            })
        })
    }

    verificaDiaeHorario(dia, horario) {
        return new Promise<any>((resolve, reject) => {
            //Recuperar categorias
            this.afs.firestore.collection('pedidos').where('cliente.dia', '==', dia).get().then((lista) => {
                let array = [];
                let horarioQtde: number;
                let teste: any;
                lista.forEach((item) => {
                    //Formatar dado
                    let obj = item.data();
                    obj['id'] = item.id;
                    array.push(obj);
                });

                console.log(array + ' 132')

                horarioQtde = array.length;

                const horarios = (array) => array.cliente.horario == horario

                const filtro = array.filter(horarios);

                console.log(filtro.length)

                resolve(filtro.length)
            })
        })
    }

    verificaQtdEquipamentos(equipamento) {
        return new Promise<any>((resolve, reject) => {
            //Recuperar categorias
            this.afs.firestore.collection('produtos').where('titulo', '==', equipamento).get().then((lista) => {
                let array = [];
                lista.forEach((item) => {
                    //Formatar dado
                    let obj = item.data();
                    obj['id'] = item.id;
                    array.push(obj);
                });

                resolve(array.find(c => c.quantidade))
                // console.log('Quantidade: ', resolve(array.find(c => c.quantidade)))
            })
        })
    }

    produtosPorCategoria(categoriaId) {
        return new Promise<any>((resolve, reject) => {
            //Recuperar categorias
            this.afs.firestore.collection('produtos').where('categoria', '==', categoriaId).get().then((lista) => {
                let array = [];
                lista.forEach((item) => {
                    //Formatar dado
                    let obj = item.data();
                    obj['id'] = item.id;
                    array.push(obj);
                });

                resolve(array)
            })
        })
    }

    pedir(pedido) {
        return new Promise<any>((resolve, reject) => {
            //Recuperar categorias
            this.afs.firestore.collection('pedidos').add(pedido)
                .then((r) => {
                    resolve(r.id)
                })
                .catch((e) => {
                    reject(e)
                })
        })
    }

    pedido(id) {
        return new Promise<any>((resolve, reject) => {
            //Recuperar categorias
            this.afs.firestore.collection('pedidos').doc(id).get()
                .then((r) => {
                    resolve(r.data())
                })
                .catch((e) => {
                    reject(e)
                })
        })
    }

    users(id) {
        return new Promise<any>((resolve, reject) => {
            //Recuperar categorias
            this.afs.firestore.collection('usuarios').doc(id).get()
                .then((r) => {
                    resolve(r.data())
                })
                .catch((e) => {
                    reject(e)
                })
        })
    }


}