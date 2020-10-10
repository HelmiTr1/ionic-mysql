import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

import { ToastController, AlertController, LoadingController } from '@ionic/angular';

import { AccessProviders } from '../../providers/access-providers';
import { HAMMER_LOADER } from '@angular/platform-browser';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {

  fullname: string = "";
  gender: string = "";
  datebirth: string = "";
  email: string = "";
  password: string = "";
  passwordconfirm: string = "";

  disabledbutton;

  constructor(
    private router: Router,
    private toastctrl: ToastController,
    private alertctrl: AlertController,
    private loadingctrl: LoadingController,
    private accessproviders: AccessProviders
  ) { }

  ngOnInit() {
  }
  ionViewDidEnter() {
    this.disabledbutton = false;
  }

  async tryRegistration() {
    if (this.fullname == '') {
      this.presentToast('Nama Lengkap Harus Diisi');
    } else if (this.gender == '') {
      this.presentToast('Jenis Kelamin Harus Diisi');
    } else if (this.datebirth == '') {
      this.presentToast('Tanggal Lahir Harus Diisi');
    } else if (this.email == '') {
      this.presentToast('Email Harus Diisi');
    } else if (this.password == '') {
      this.presentToast('Password Harus Diisi');
    } else if (this.password != this.passwordconfirm) {
      this.presentToast('Password Harus Sama');
    } else {
      this.disabledbutton = true;
      const loading = await this.loadingctrl.create({
        message: 'Tunggu Sebentar...',
      });
      await loading.present();
      return new Promise(resolve => {
        let body = {
          action: 'registration_progress',
          fullname: this.fullname,
          gender: this.gender,
          datebirth: this.datebirth,
          email: this.email,
          password: this.password
        }
        this.accessproviders.postData(body, 'api.php').subscribe((res: any) => {
          if (res.success == true) {
            loading.dismiss();
            this.disabledbutton = false;
            this.presentToast(res.msg);
            this.router.navigate(['/login']);
          } else {
            loading.dismiss();
            this.disabledbutton = false;
            this.presentToast(res.msg);
          }
        }, (err) => {
          console.log(err);
          
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
            this.tryRegistration();
          }
        }
      ]
    });
    await alert.present();
  }

}
