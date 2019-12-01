import { Injectable, OnInit } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';


import { Storage } from '@ionic/storage';
import { AuthenticationService } from "./authentication";
import { ConfigService } from "./config";
import { ArrayType } from '@angular/compiler/src/output/output_ast';

@Injectable() 
export class AttendanceService implements OnInit{  
    my_courses:any;
    course_attendance={};
    current_course = 0;;
    constructor(private http:Http,
        private storage: Storage,
        private auth: AuthenticationService,
        private config:ConfigService) {
    }
    
    ngOnInit(){}

    get_my_course(body,paged){
        if(body.status){
            if(body.data && body.data.length){
                this.my_courses =  body.data;
            }
        }
        console.log('my_courses for attendance');
        console.log(this.my_courses);
    }
    
    get_user_course_attendance(course_id:any){
        let $this = this;
        this.course_attendance[course_id] ={};
        this.current_course = course_id;
        return new Promise((resolve)=>{
            if ($this.config.isLoggedIn && course_id) {
                let opt = $this.getUserAuthorizationHeaders();
                $this.http.get(`${$this.config.baseUrl}attendance/app/course/`+course_id,opt)
                    .map(res => res.json())
                    .subscribe(res => {
                        if (res.status) {
                            if (res.data) {
                                this.course_attendance[this.current_course] = res.data;
                                console.log('Attendance of course_id = ' +this.current_course);
                                console.log(this.course_attendance);
                            }
                        }
                        resolve(res);
                    });
            }
        });
    }

    marktodays_attendance(user_id:any){
        let $this =  this;
        return new Promise((resolve)=>{
            if ($this.config.isLoggedIn && this.current_course && user_id) {
                let opt = $this.getUserAuthorizationHeaders();
                let data = {
                    "course_ids" : [this.current_course],
                    "user_id" : user_id
                };
                $this.http.post(`${$this.config.baseUrl}attendance/app/course/mark`,data,opt)
                    .map(res => res.json())
                    .subscribe(res => {
                        if (res.status) {
                            if (res.data) {
                                if(Array.isArray(res.data.marked_attendance_ids)){
                                    if(res.data.marked_attendance_ids.indexOf(this.current_course) >=0){
                                        // push to mark
                                        if(!(this.course_attendance[this.current_course].marked.date_format && Array.isArray(this.course_attendance[this.current_course].marked.date_format))){
                                            this.course_attendance[this.current_course].marked.date_format = [];
                                        }
                                        this.course_attendance[this.current_course].marked.date_format.push(res.data.date);

                                        // removing from unmark
                                        if(this.course_attendance[this.current_course].unmarked.date_format && Array.isArray(this.course_attendance[this.current_course].unmarked.date_format)){
                                            let index = this.course_attendance[this.current_course].unmarked.date_format.indexOf(res.data.date);
                                            console.log('index= '+index);
                                            if(index>=0){
                                                this.course_attendance[this.current_course].unmarked.date_format.splice(index,1);
                                            }
                                        }else{
                                            this.course_attendance[this.current_course].unmarked.date_format = [];
                                        }  
                                    }
                                }
                            }
                        }
                        resolve(res);
                    });
            }
        });    
    }


    public getUserAuthorizationHeaders() {
		var userheaders = new Headers();
		userheaders.append('Authorization', this.config.settings.access_token);
		return new RequestOptions({ headers: userheaders });
	}
}