import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ToastController, AlertController, LoadingController, NavController } from '@ionic/angular';
import { AccessProviders } from "../../providers/access-providers";
import { Storage } from "@ionic/storage";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

    datastorage: any;
    name: any;
    
    users: any = [];
    limit: number = 13;
    start: number = 0;

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
  async tryLogout(){
    this.storage.clear();
    this.navctrl.navigateRoot('/login');
    const toast = await this.toastctrl.create({
      message: "Logout Berhasil",
      duration: 1500
    });
    toast.present();
  }

  ionViewDidEnter(){
    this.storage.get('storage_session').then((res) => {
      console.log(res);
      this.datastorage = res;
      this.name = this.datastorage.fullname;
      this.start = 0;
      this.users = [];
      this.loadUsers();
    })
  }
  openCRUD(a){
    this.router.navigate(['/crud/' +a]);
  }
  async loadUsers(){
    return new Promise(resolve => {
      let body = {
        action: 'load_users',
        start: this.start,
        limit: this.limit
      }
      this.accessproviders.postData(body, 'api.php').subscribe((res: any) => 
      {
        for (let data of res.result){
          this.users.push(data);
        }
        resolve(true);
      });
    });
  }
  async doRefresh(event){
    const loading = await this.loadingctrl.create({
      message: 'Tunggu Sebentar...',
    });
    await loading.present();

    this.ionViewDidEnter();
    event.target.complete();

    loading.dismiss();
  }
  loadData(event){
    this.start += this.limit;
    setTimeout(() => {
      this.loadUsers().then(() => {
        event.target.complete();
      });
    }, 500);
  }
}
