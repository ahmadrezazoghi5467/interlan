import { Component, ViewChild, OnInit } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';
import { ConfigService } from '../../services/config';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../tabs/tabs';
import { SideMenuService } from '../../services/sidemenu';
import { PushNotificationService } from '../../services/push_notification';




@Component({
    selector: 'page-multiselector',
    templateUrl: 'multiselector.html'
})
export class MultiselectorPage implements OnInit {
    SelectOptionsSite: any;
    SelectOptionsLanguage: any;

    site_index = 0;

    tabsPage = TabsPage;

    constructor(
        public navCtrl: NavController,
        private config: ConfigService,
        private storage: Storage,
        public sidemenu: SideMenuService,
        public push_notification:PushNotificationService
        ){
    }

    ionViewDidLoad() {
        this.SelectOptionsSite = {
            title: this.config.get_translation('select_site'),
            okText: this.config.get_translation('okay'),
            cancelText: this.config.get_translation('dismiss'),
        };
        this.SelectOptionsLanguage = {
            title: this.config.get_translation('select_language'),
            okText: this.config.get_translation('okay'),
            cancelText: this.config.get_translation('dismiss'),
        };
    }
    ngOnInit() {
        console.log('multiselector page');
    }

    onSite_select($event: any) {
        console.log($event);
        this.site_index = $event;
    }

    goToHome(i) {
        // clear storage first then do any thing ..
        this.config.set_multisite(i);
        this.config.set_multi_setting(i);
        this.sidemenu.set_Pages();
        this.config.initialize();
        this.navCtrl.setRoot(this.tabsPage);

        //set push notification for multisite
        setTimeout(function(){ 
            this.push_notification.push_notifcation_firebase();
        }, 8000);
    }

}