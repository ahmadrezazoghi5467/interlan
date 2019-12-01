import { Component,ViewChild } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';
import { ConfigService } from '../../services/config';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../tabs/tabs';
import { MultiselectorPage } from '../multiselector/multiselector';



@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html'
})
export class Intro {
  @ViewChild('IntroTabs') introTabs: Slides;
  multiselectorpage = MultiselectorPage;
	tabsPage = TabsPage;
  	constructor(
  		public navCtrl: NavController,
      private config:ConfigService,
  		private storage:Storage) {
  	}
  ngOnInit(){
    console.log(this.config);
  }
  goToHome(){
    if(this.config.multisite.enable_multisite){
       this.navCtrl.push(this.multiselectorpage);
    }else{
        this.storage.set('introShown', true);
        this.config.initialize();
        this.navCtrl.setRoot(this.tabsPage);
    }
   
  
  }
  proceed(){
    let index = this.introTabs.getActiveIndex();
    index++;
    this.introTabs.slideTo(index, 500);
  }
}