import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FirebaseService } from '../providers/firebase';
import { CarrinhoPage } from './carrinho/carrinho.page';
import { HistoricoPage } from './historico/historico.page';
import { FireserviceService } from './services/fireservice.service';
import { Router } from '@angular/router';
import { Storage } from '@capacitor/storage';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public firebase: FirebaseService,
    public modalController: ModalController,
    private FireserviceService: FireserviceService,
    public router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  async carrinho(){
    const modal = await this.modalController.create({
      component: CarrinhoPage,
    });
    return await modal.present();
  }

  sair(){
    this.FireserviceService.signOut();
    localStorage.setItem('produtos', JSON.stringify(''));
    Storage.set({
      key: 'produtos',
      value: JSON.stringify(''),
    });
    Storage.set({
      key: 'usuario',
      value: JSON.stringify(''),
    },);
    Storage.set({
      key: 'historicoPedidos',
      value: JSON.stringify(''),
    },);
    this.router.navigateByUrl('login');
  }


  async pedidos(){
    const modal = await this.modalController.create({
      component: HistoricoPage,
    });
    return await modal.present();
  }

  ngOnInit() {
   
  }
}
