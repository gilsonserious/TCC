//import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../providers/firebase';
import { ModalController, AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.page.html',
  styleUrls: ['./historico.page.scss'],
})
export class HistoricoPage implements OnInit {

  pedidos = [];

  constructor(
    public firebase: FirebaseService,
    public modalController: ModalController,
    public alertController: AlertController
  ) { }

  fechar() {
    this.modalController.dismiss();
  }

  async ngOnInit() {
    //Recuperar detalhes dos pedidos
    let items = JSON.parse(localStorage.getItem('historicoPedidos'));
    console.log(items);
    if (items) {
      items.forEach(async item => {
        console.log(item)
        this.firebase.pedido(item).then((r) => {
          console.log(r + 'Teste')
          this.pedidos.push(r)
        })
      });
    }
  }

  async remover(index: number) {
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
            
            // localStorage.removeItem(index)

            console.log('Removeu')

          }
        }
      ]
    });

    await alert.present();
  }

}
