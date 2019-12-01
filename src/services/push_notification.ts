import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { Storage } from '@ionic/storage';

import { ConfigService } from "./config";

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Platform } from 'ionic-angular';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import {  ToastController } from 'ionic-angular';


@Injectable()
export class PushNotificationService {
	constructor(
		private http: Http,
		public config: ConfigService,
		public storage: Storage,
		private push: Push,
		private platform: Platform,
		private toastCtrl: ToastController,
	) {
	}



	push_notifcation_firebase() {
		// check if cordova and enable push notification
		if (this.platform.is('cordova') && this.config.push_notification && this.config.push_notification.enable_push_notification) {
			this.push.hasPermission().then((res: any) => {
				if (res.isEnabled) {
					console.log('We have permission to send push notifications');
				} else {
					console.log('We do not have permission to send push notifications');
				}
			});
			const options: PushOptions = {
				android: {
					'senderID': this.config.push_notification.senderID
				},
				ios: {
					alert: 'true',
					badge: true,
					sound: 'false'
				}
			};
			const pushObject: PushObject = this.push.init(options);
			pushObject.on('notification').subscribe((notification: any) => 
				{
					console.log('Received a notification', notification);
					if(notification.message){
						let toast = this.toastCtrl.create({
							message:notification.message ,
								duration: this.config.push_notification.duration,
								position: 'bottom'
							});
							
							toast.present();
					}
				
				}
			);
			pushObject.on('registration').subscribe((registration: any) => 
				{
					console.log('Device registered', registration)
					if(registration.registrationId){
						this.config.push_notification.registrationId = registration.registrationId;
						this.storage.set('registrationId', registration.registrationId);
						let toast = this.toastCtrl.create({
							message:'Device registered for Push Notification',
							duration: this.config.push_notification.duration,
							position: 'bottom'
						});
						toast.present();	
					}
				
				}
			);
			pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
		}
	}

	add_user_to_user_notification_list(user: any) {
		console.log('add_user_to_user_notification_list');
		this.platform.ready().then(() => {
			if (this.config.push_notification && this.config.push_notification.enable_push_notification) {
				if (this.config.isLoggedIn) {
					let opt = this.config.getUserAuthorizationHeaders();
					console.log('#1');
					this.storage.get('registrationId').then((registrationId) => {
						if(registrationId){
							let data = {
								'registrationId': registrationId
							}
							this.http.post(`${this.config.baseUrl}user/add-registrationId`, data, opt)
								.map(res => res.json())
								.subscribe(res => {
									if (res.status) {
										console.log(res);
										if(res.message){
											let toast = this.toastCtrl.create({
													message:res.message ,
													duration: this.config.push_notification.duration,
													position: 'bottom'
												});
												
												toast.present();
										}
									}
								});
						}else{
							if(this.config.push_notification.registrationId){
								let data = {
									'registrationId': this.config.push_notification.registrationId
								}
								this.http.post(`${this.config.baseUrl}user/add-registrationId`, data, opt)
									.map(res => res.json())
									.subscribe(res => {
										if (res.status) {
											console.log(res);
											if(res.message){
												let toast = this.toastCtrl.create({
														message:res.message ,
														duration: this.config.push_notification.duration,
														position: 'bottom'
													});
													
													toast.present();
											}
										}
									});
							}
						}
					});
				
				}
			}
		});
	}
	delete_user_to_user_notification_list(){
		let opt = this.config.getUserAuthorizationHeaders();
		this.storage.get('registrationId').then((registrationId) => {
			let data = {
				'registrationId': registrationId
			}
			this.http.post(`${this.config.baseUrl}user/delete-registrationId`, data, opt)
						.map(res => res.json())
						.subscribe(res => {
							if (res.status) {
								console.log(res);
								if(res.message){
									let toast = this.toastCtrl.create({
										message:res.message ,
											duration: this.config.push_notification.duration,
											position: 'bottom'
										});
										
										toast.present();
								}
							}
						});
		});
		
	}

	


}



