import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

import { ToastController, AlertController, LoadingController, NavController } from '@ionic/angular';
import { AccessProviders } from '../../providers/access-providers';
import { Storage } from "@ionic/storage";
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = "";
  password: string = "";

  disabledbutton;

  constructor(
    private router: Router,
    private toastctrl: ToastController,
    private alertctrl: AlertController,
    private loadingctrl: LoadingController,
    private accessproviders: AccessProviders,
    private navctrl: NavController,
    private storage: Storage
  ) { }

  ngOnInit() {
  }
  
  ionViewDidEnter() {
    this.disabledbutton = false;
  }

  openRegistration() {
    this.router.navigate(['/registration']);
  }

  async tryLogin() {
    if (this.email == '') {
      this.presentToast('Email Harus Diisi');
    } else if (this.password == '') {
      this.presentToast('Kata Sandi Harus Diisi');
    } else {
      this.disabledbutton = true;
      const loading = await this.loadingctrl.create({
        message: 'Tunggu Sebentar...',
      });
      await loading.present();
      return new Promise(resolve => {
        let body = {
          action: 'login_progress',
          email: this.email,
          password: this.password
        }
        this.accessproviders.postData(body, 'api.php').subscribe((res: any) => {
          if (res.success == true) {
            loading.dismiss();
            this.disabledbutton = false;
            this.presentToast('Login Berhasil');
            this.storage.set('storage_session', res.result);
            this.navctrl.navigateRoot(['/home']);
          } else {
            loading.dismiss();
            this.disabledbutton = false;
            this.presentToast('Email atau Kata Sandi Salah');
          }
        }, (err) => {
          loading.dismiss();
          this.disabledbutton = false;
          this.presentAlertConfirm('Timeout');
        });
      });
    }
  }
  async presentToast(a) {
    const toast = await this.toastctrl.create({
      message: a,
      duration: 1500
    });
    toast.present();
  }
  async presentAlertConfirm(a) {
    const alert = await this.alertctrl.create({
      header: a,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Batal',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Coba Lagi',
          handler: () => {
            this.tryLogin();
          }
        }
      ]
    });
    await alert.present();
  }
}
