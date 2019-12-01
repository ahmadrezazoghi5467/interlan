import { Component, OnInit, ViewChild } from '@angular/core';
import { App, Platform, NavController, MenuController, LoadingController } from 'ionic-angular';

//import { StatusBar, Splashscreen } from 'ionic-native';

import { SplashScreen } from '@ionic-native/splash-screen';
import { Intro } from '../pages/intro/intro';
import { TabsPage } from '../pages/tabs/tabs';
import { ContactPage } from '../pages/contact/contact';
import { BlogPage } from '../pages/blog/blog';
import { DirectoryPage } from '../pages/directory/directory';
import { GroupdirectoryPage } from '../pages/groupdirectory/groupdirectory';
import { MembersDirectoryPage } from '../pages/membersdirectory/membersdirectory';
import { ForumdirectoryPage } from '../pages/forumdirectory/forumdirectory';

import { InstructorsPage } from '../pages/instructors/instructors';
import { ConfigService } from '../services/config';
import { PushNotificationService } from '../services/push_notification';
import { SideMenuService } from '../services/sidemenu';
import { Storage } from '@ionic/storage';
import { ImgcacheService } from '../services/imageCache';
// import { AdMob } from "ionic-admob";

// import { OneSignal } from '@ionic-native/onesignal';
import { Push, PushObject, PushOptions } from '@ionic-native/push';


@Component({
    templateUrl: 'app.html'
})
export class MyApp implements OnInit {

   styles: any;
    intro: Intro;
    pages: any[] = [];

    rootPage: any ;
    loader: any;

    @ViewChild('nav') nav: NavController;

    constructor(private config: ConfigService,
        private platform: Platform,
        private menuCtrl: MenuController,
        private loadingCtrl: LoadingController,
        private app: App,
        private storage: Storage,
        private imgcacheService: ImgcacheService,
        // private admob: AdMob,
        public splashScreen: SplashScreen,
        public sidemenu : SideMenuService,
        public push_notification:PushNotificationService
    ) {
        this.presentLoading();

        this.platform.ready().then(() => {
            if (this.config.settings.rtl) {
                this.platform.setDir('rtl', true);
            }
            this.push_notification.push_notifcation_firebase();
            /* check here storage:
               if introShown found then RootPage = TabsPage
               else RootPage = IntroPage
               And navRoot set
            */


            this.storage.get('introShown').then((result) => {
                this.splashScreen.hide();

                if (result) {
                    this.rootPage = TabsPage;
                    let nav = this.app.getRootNav();
                    this.imgcacheService.initImgCache().subscribe(() => {
                        this.initialize().then((res)=>{
                            this.config.initialize();
                            this.sidemenu.set_Pages();
                            nav.setRoot(this.rootPage);

                        });

                        this.loader.dismiss();
                    });


                } else {
                    this.rootPage = Intro;
                    let nav = this.app.getRootNav();
                    this.imgcacheService.initImgCache().subscribe(() => {
                        this.initialize().then((res)=>{
                            this.sidemenu.set_Pages();
                            nav.setRoot(this.rootPage);

                        });
                        this.loader.dismiss();
                    });

                }
            });
        });
    }


    // intro already shown
    initialize() {
        let $this = this;
        return new Promise((resolve)=>{
            // select site from storage then override config variables
            let promise1 = new Promise((resolve1)=>{
                $this.storage.get('site_index').then((site_index)=>{
                    if(site_index){
                       $this.config.set_multisite(site_index);
                    }
                    resolve1();
                });
            })
            // select setting from storage then override to config.settings
            let promise2 = new Promise((resolve2)=>{
                $this.storage.get('settings').then((settings) => {
                    if(settings){
                        $this.config.settings =  settings;
                        $this.config.set_base_url();
                    }
                    resolve2();
                });
            });

            let promise3 = new Promise((resolve3)=>{
                $this.storage.get('user').then(res => {
                    if (res) {
                        $this.config.user = res;
                        if ($this.config.user['id']) {
                            $this.config.isLoggedIn = true;
                        }
                    }
                    resolve3();
                });
            })
            // resolve function when all promise resolves
            Promise.all([promise1, promise2,promise3]).then(function(values) {
                console.log('allPromise resolved');
                resolve();
            });
        });
    }
    

    ngOnInit() {

    }

    presentLoading() {
        this.loader = this.loadingCtrl.create({
            content: '<img src="assets/images/bubbles.svg">',
            duration: 5000,//this.config.get_translation('loadingresults'),
            spinner: 'hide',
            showBackdrop: true,
        });
        this.loader.present();
    }

    onLoad(page: any) {
        let nav = this.app.getRootNav();

        nav.setRoot(page.component, { index: page.index });
        //nav.push(page);
        //this.app.getRootNav().push(page);
        //this.nav.push(page);
        //this.nav.setRoot(page);
        this.menuCtrl.close();
    }
}
