//import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { FirebaseService } from '../../providers/firebase'
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.page.html',
  styleUrls: ['./carrinho.page.scss'],
})
export class CarrinhoPage implements OnInit {

  usuario;

  imagem;

  usuariologado = localStorage.getItem('produtos').replace(/"/g, "");

  collectionname : string = "usuarios";

  agendamentos = [];
  total = 0;
  step = 0;
  cliente = {
    nome: null,
    dia: null,
    horario: null,
  }

  constructor(
    public modalController: ModalController,
    public firebase: FirebaseService,
    public toastController: ToastController,
    public alertController: AlertController,
    private http: HttpClient,
    public loadingController: LoadingController,
    private firestore : AngularFirestore
  ) { 

    // console.log(this.nomeUsuario())
    console.log(this.pegaNome())

    this.pegaNome()

    this.pegaImagem()

    this.imagem = localStorage.getItem('usuarioImagem').replace(/"/g, "");

   this.cliente.nome = localStorage.getItem('usuario').replace(/"/g, "");

    // console.log(this.pegaNome())

    //Total
    this.firebase.carrinho.forEach((item) => {
      this.total = this.total + (item.preco * item.quantidade);
    })
  }

  deixarApenasUmMarcado(index) {
    let i = 0;
    for (i; i < this.cliente.horario.length; i++) {
      if(i != index){
        this.cliente.horario[i].checked = false;
      }
    }
  }

  deixarApenasUmMarcadoDia(index) {
    let i = 0;
    for (i; i < this.cliente.dia.length; i++) {
      if(i != index){
        this.cliente.dia[i].checked = false;
      }
    }
  }

  ngOnInit() {

    this.pegaNome()

  }

  fechar() {
    if(this.step > 0){
      this.step = 0;
    }
    else {
      this.modalController.dismiss();
    }
  }

  async remover(i) {
    const alert = await this.alertController.create({
      header: 'Quer mesmo remover esse item?',
      message: 'Essa ação não pode ser desfeita.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
          }
        }, {
          text: 'Remover',
          handler: () => {
            this.firebase.carrinho.splice(i, 1);

            //Atualizar total
            this.firebase.carrinho.forEach((item) => {
              this.total = this.total + (item.preco * item.quantidade);
            })
          }
        }
      ]
    });

    await alert.present();
  }

  finalizar(){
    this.step = 1;
  }

  // calcularCep(){
  //   if(this.cliente.cep.length > 7){
  //     this.http.get('https://viacep.com.br/ws/' + this.cliente.cep + '/json/').subscribe((r) => {
  //       console.log(r)
  //       this.cliente.bairro = r['bairro'];
  //       this.cliente.rua = r['logradouro'];
  //       this.cliente.cidade = r['localidade']
  //     })
  //   }
  // }

  async verificarDias() {
    const dia = await this.firebase.verificaData(this.cliente.dia).then( function(valor){
      console.log(valor)
      valor
    } )
    return dia
}

// async nomeUsuario() {
//   const usuario = await this.firebase.usuario(this.usuariologado);
//   return usuario;
// }

async pegaNome(){
 
  let usuario = await this.firebase.usuario(this.usuariologado);

  this.usuario = localStorage.getItem('usuario').replace(/"/g, "");

  return usuario;

}

async pegaImagem(){
 
  let imagem = await this.firebase.usuarioImagem(this.usuariologado);

  this.imagem = localStorage.getItem('usuarioImagem').replace(/"/g, "");

  return imagem;

}


async verificarHorarios() {
  const horario = this.firebase.verificaHorario(this.cliente.horario).then( function(valor){
    console.log(valor)
    valor
  } )
  return horario
}

  //Finalizar pedido
  async enviar(){

    this.cliente.dia = this.cliente.dia.split('T')[0]; 

    // const horario = await this.firebase.verificaHorario(this.cliente.horario).then( function(valor){
    //   valor
    // } )

    // const dia = await this.firebase.verificaData(this.cliente.dia).then( function(valor){
    //   valor
    // } )
    
    // console.log(horario, dia)

  //  console.log(this.verificarDias());
   
  //  console.log(this.verificarHorarios());

//  const pegaDia = this.firebase.agendamentos()
//   .then(async (data) => {
//     this.agendamentos = data;
//     let i = 0;
//     for (i; i < this.agendamentos.length; i++) {
//      let produtos = await this.firebase.verificaData(this.cliente.dia);
//     }

//   })

//   const pegaHorario = this.firebase.agendamentos()
//   .then(async (data) => {
//     this.agendamentos = data;
//     let i = 0;
//     for (i; i < this.agendamentos.length; i++) {
//      let produtos = await this.firebase.verificaHorario(this.cliente.horario);
//     }
//   })

// const horario = await this.firebase.verificaHorario(this.cliente.horario);

// const dia = await this.firebase.verificaData(this.cliente.dia);

const teste = await this.firebase.verificaDiaeHorario(this.cliente.dia, this.cliente.horario);
const arrayQtd = await this.firebase.verificaQtdEquipamentos(this.firebase.carrinho[0].titulo);
// const quantidade = await arrayQtd.quantidade;

console.log(await this.firebase.carrinho[0].titulo)
console.log(arrayQtd.quantidade)

// console.log('Testando: ' + teste )

//  if ( horario < 5){
//   console.log(dia + 'Agendado' + horario + 'Hora Agendada' + 'Pode agendar')
//  } else {
//   console.log(dia + 'Agendado' + horario + 'Hora Agendada' + 'Não pode agendar')
//  }

// this.firebase.verificaData(this.cliente.dia)

if(teste < arrayQtd.quantidade){

  if(this.cliente.nome){
    let pedido = {
      cliente: this.cliente,
      itens: this.firebase.carrinho,
      status: 'Agendado',
      data: new Date(),
      total: this.total
    };

    const alert = await this.alertController.create({
      header: 'Deseja finalizar o pedido?',
      message: 'Finalizar agendamento.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
          }
        }, {
          text: 'Fazer pedido',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Finalizando...',
            });
            await loading.present();

            
            //Enviar para o firebase
            this.firebase.pedir(pedido)
            .then(async (id) => {
              
              //Adicionar no localstorage
              let historicoPedidos = JSON.parse(localStorage.getItem('historicoPedidos'));
              if(!historicoPedidos) {
                historicoPedidos = [];
                historicoPedidos.push(id);
                localStorage.setItem('historicoPedidos', JSON.stringify(historicoPedidos));
              }
              else {
                historicoPedidos.push(id);
                localStorage.setItem('historicoPedidos', JSON.stringify(historicoPedidos));
              }

              const toast = await this.toastController.create({
                message: 'Tudo certo! Você pode acompanhar tudo na aba Meus Agendamentos',
                duration: 2000
              });
              toast.present();
          
              //Voltar para home
              await loading.dismiss();
              this.firebase.carrinho = []
              this.step = 0;
              this.fechar();
            })
            .catch(async () => {
              await loading.dismiss();

              const alert = await this.alertController.create({
                header: 'Ops!',
                message: 'Algo deu errado. Por favor, tente novamente.',
                buttons: [
                  {
                    text: 'Voltar',
                    role: 'cancel',
                    handler: () => {
                    }
                  }
                ]
              });
          
              await alert.present();
            })
            
          }
        }
      ]
    });

    await alert.present();

  }
  else {
    const alert = await this.alertController.create({
      header: 'Ops!',
      message: 'Por favor, preencha todos os campos.',
      buttons: [
        {
          text: 'Entendi',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });

    await alert.present();
  }

} else {
  const alert = await this.alertController.create({
    header: 'Ops!',
    message:  `Não existem mais vagas para ${this.firebase.carrinho[0].titulo} no horário de ${this.cliente.horario} para o dia escolhido.` ,
    buttons: [
      {
        text: 'Entendi',
        role: 'cancel',
        handler: () => {
        }
      }
    ]
  });

  await alert.present();
}
}
  }
