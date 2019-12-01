import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { Storage } from '@ionic/storage';
import firebase from 'firebase';

@Injectable()
export class ConfigService {

	loading: boolean;
	timestamp: number;
	lastaccess: number; //Last access datetime with website
	fetchedResources: any;
	user: any;
	isLoggedIn: boolean = false;

	homePage: any;

	public baseUrl: string;
	oAuthUrl: string;

	lastCourse: any;
	environment: any;
	settings: any;

	defaultMenu: any;
	per_view: number = 10;
	translations: any;
	directoryFilters: any;

	/*
		IMPORTANT DO NOT TOUCH
	*/
	defaultTrack: any;
	track: any;
	trackSync: any;
	contactinfo: any;
	terms_conditions: any;
	unread_notifications_count: number = 0;
	wallet: any = [];
	per_page_comment = 10;
	chat: any;
	configfirebase: any;
	batch: any;
	forum: any;
	members_directory: any;
	multisite: any;
	site_index = 0;
	attendance: any
	push_notification: any;
	/*== END == */

	constructor(
		private storage: Storage,
		private http: Http
	) {

		this.loading = true;
		this.timestamp = Math.floor(new Date().getTime() / 1000);
		this.environment = {
			'cacheDuration': 86400,
		};

		this.lastaccess = 0;
		this.storage.get('lastaccess').then(res => {
			if (res) {
				this.lastaccess = res;
			}
		});

		this.per_view = 5;
		this.settings = {
			'version': 1,
			'url':'https://interlan.app/',
			'client_id':'vXditm5wrNlTqrkhCQct1iL',
			// 'url': 'http://192.168.5.61/wordpressnew/',
			// 'client_id': 'RDRc53PSL8ncHowchpkBi3O',
			'client_secret': '', //Fetched from API call
			'state': '', // FETCHED from Site
			'access_token': '', // FETCHED on Login
			'registration': 'app',//'app' or 'site' or false
			'login': 'app',//Select from 'app' or 'site' or false
			'facebook': {
				'enable': false,
				'app_id': 491338181212175
			},
			'google': {
				'enable': false,
			},
			'per_view': 5,
			'force_mark_all_questions': true,
			'wallet': true,					// <<----------REQUIRES WPLMS version 3.4
			'inappbrowser_purchases': true, // <<----------REQUIRES WPLMS version 3.4
			'rtl': true,
			'units_in_inappbrowser': true,
			'open_units_in_inappbrowser_auto': false
		};

		this.baseUrl = this.settings.url + 'wp-json/wplms/v1/';
		this.oAuthUrl = this.settings.url + 'wplmsoauth/';

		this.defaultMenu = {
			'home': 'Home',
			'about': 'About',
			'courses': 'Courses',
			'instructors': 'Instructors',
			'contact': 'Contact'
		};

		this.homePage = {
			'featuredCourseSlider': 1,
			'categories': 1,
			'popular': 1,
			'featured': 1,
		};

		this.directoryFilters = {
			'categories': 1,
			'instructors': 1,
			'locations': 1,
			'levels': 1,
			'free_paid': 1,
			'online_offline': 0,
			'start_date': 0,
		};


		/* WALLET RECHARGE : in APP PRODUCT IDS */

		this.wallet = [
			{ 'product_id': 'wplms_r_50', 'points': 50 },
			{ 'product_id': 'sample', 'points': 50 },
		];

		/* Started chat setting */
		this.chat = {
			'enable_chat': false,   // enable or disable chat  set 'true' for enable and 'false' for disable
			'chat_number': 10,   // get pagination for chats
			'message_number': 10,	// get pagination for messages
			'chat_agents': [1, 2, 3, 10], // user id of agents for non-logged in user chat
			'welcome_text': 'به سیستم چت خوش آمدید، \
			ین 	چت با وبسایت همگام خواهد شد ',
			'nonloggedinForm': 1,
			'file_size': 5242880,   // in byte for upload file
			'file_type': [
				'image/jpeg',
				'image/png',
				'text/plain',
				'text/html',
				'text/csv',
				'video/mp4',
				'application/pdf',
				'application/zip',
				'audio/mpeg',
				'image/bmp'
			]
		};
		/* Initialize firebase here */
		this.configfirebase = {
			apiKey: "AIzaSyCB8uvj2TO1w2AGlB0nJPjnkToCTzTwxRw",
				    authDomain: "inter-login-2222.firebaseapp.com",
				    databaseURL: "https://inter-login-2222.firebaseio.com",
				    projectId: "inter-login-2222",
				    storageBucket: "inter-login-2222.appspot.com",
				    messagingSenderId: "987031531350",
				    appId: "1:987031531350:web:745d41b852950ab118b0f7",
				    measurementId: "G-RCZ5E57K3V"
				  };
		firebase.initializeApp(this.configfirebase);

		/* End of Initialize firebase */
		/* Ended chat settings */


		/* Started batch setting */
		this.batch = {
			'enable_batch': true,    // true|false
			'limit': 5,  			// No. of groups,members, activity,news view
			'days': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],  // Translation can be done for days
			'months': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']   // Translation can be done for months

		}



		/* Ended batch settings */

		this.forum = {
			'enable_forum': true,    // true|false
			'limit': 10,			    // No. of
			'paged': 1               // do not edit this
		}
		/* Started members-directory setting */
		this.members_directory = {
			'enable_members_directory': true,		 //enable members directory : enable when buddypress member compomnent is active
			'per_page': 10,		 				 // The number of results to return per page.
			'paged': 1               // do not edit this
		}
		/* Ended members-directory setting */


		/*
			Started configuring multisite
		    Translation can be for specific key also support
			other wise it will get translation from this.translation
		*/
		this.multisite = {
			'enable_multisite': false,
			'sites': [
				{
					'site_name': 'Site 1',
					'logo': 'assets/images/multisite_logo.png',
					'translation': {
						'home_title': 'HOME PAGE 1',
						'home_subtitle': 'Featured Items 1',
					},
					'all_settings': {
						'settings': {
							'version': 1,
							'url': 'http://localhost/multisitewplms/',
							'client_id': 'M5u7Hr9gSAFihb44yRAHAys',
							'rtl': false
						},
						'configfirebase': {
							apiKey: "AIzaSyC0eCOfddQ_II4EeFm0X_AKUzU3vkYdVfQ",
							authDomain: "fir-chat-f8c3f.firebaseapp.com",
							databaseURL: "https://fir-chat-f8c3f.firebaseio.com",
							projectId: "fir-chat-f8c3f",
							storageBucket: "fir-chat-f8c3f.appspot.com",
							messagingSenderId: "346813030464"
						},
						'batch': {
							'enable_batch': true,    // true|false
							'limit': 5,  			 // No. of groups,members, activity,news view
							'days': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],  // Translation can be done for days
							'months': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']   // Translation can be done for months
						}
					}
				},
				{
					'site_name': 'Site 2',
					'logo': 'assets/images/multisite_logo.png',
					'translation': {
						'home_title': 'HOME PAGE 2',
						'home_subtitle': 'Featured Items 2',
					},
					'all_settings': {
						'settings': {
							'version': 1,
							'url': 'http://localhost/multisitewplms/site2/',
							'client_id': 'CwnH6u8BgDEiENScXlgMMA3',
							'rtl': true
						},
						'configfirebase': {
							apiKey: "AIzaSyC0eCOfddQ_II4EeFm0X_AKUzU3vkYdVfQ",
							authDomain: "fir-chat-f8c3f.firebaseapp.com",
							databaseURL: "https://fir-chat-f8c3f.firebaseio.com",
							projectId: "fir-chat-f8c3f",
							storageBucket: "fir-chat-f8c3f.appspot.com",
							messagingSenderId: "346813030464"
						},
						'batch': {
							'enable_batch': false,    // true|false
							'limit': 5,  			 // No. of groups,members, activity,news view
							'days': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],  // Translation can be done for days
							'months': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']   // Translation can be done for months
						}
					}
				},
				{
					'site_name': 'Site 3 wordpressnew',
					'logo': 'assets/images/multisite_logo.png',
					'translation': {
						'home_title': 'HOME PAGE 3',
						'home_subtitle': 'Featured Items 3',
					},
					'all_settings': {
						'settings': {
							'version': 1,
							'url': 'http://localhost/wordpressnew/',
							'client_id': 'RDRc53PSL8ncHowchpkBi3O',
							'rtl': true
						},
						'configfirebase': {
							apiKey: "AIzaSyC0eCOfddQ_II4EeFm0X_AKUzU3vkYdVfQ",
							authDomain: "fir-chat-f8c3f.firebaseapp.com",
							databaseURL: "https://fir-chat-f8c3f.firebaseio.com",
							projectId: "fir-chat-f8c3f",
							storageBucket: "fir-chat-f8c3f.appspot.com",
							messagingSenderId: "346813030464"
						},
						'batch': {
							'enable_batch': false,    // true|false
							'limit': 5,  			 // No. of groups,members, activity,news view
							'days': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],  // Translation can be done for days
							'months': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']   // Translation can be done for months
						}
					}
				},
				{
					'site_name': 'Site 4 Wplms.io',
					'logo': 'assets/images/multisite_logo.png',
					'translation': {
						'home_title': 'HOME PAGE 4',
						'home_subtitle': 'Featured Items 4',
					},
					'all_settings': {
						'settings': {
							'version': 1,
							'url': 'https://wplms.io/',
							'client_id': '9gWLZgmn45Es4cjoAUPopRX',
							'rtl': true
						},
						'configfirebase': {
							apiKey: "AIzaSyC0eCOfddQ_II4EeFm0X_AKUzU3vkYdVfQ",
							authDomain: "fir-chat-f8c3f.firebaseapp.com",
							databaseURL: "https://fir-chat-f8c3f.firebaseio.com",
							projectId: "fir-chat-f8c3f",
							storageBucket: "fir-chat-f8c3f.appspot.com",
							messagingSenderId: "346813030464"
						},
						'batch': {
							'enable_batch': false,    // true|false
							'limit': 5,  			 // No. of groups,members, activity,news view
							'days': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],  // Translation can be done for days
							'months': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']   // Translation can be done for months
						}
					}
				},
				{
					'site_name': 'Site 5 multiste2 site 2',
					'logo': 'assets/images/multisite_logo.png',
					'translation': {
						'home_title': 'HOME PAGE 5',
						'home_subtitle': 'Featured Items 5',
					},
					'all_settings': {
						'settings': {
							'version': 1,
							'url': 'http://localhost/multisitewplms2/site2/',
							'client_id': 'YkAYGnws2zP1OHfZa3Uo9aT',
							'rtl': true
						},
						'configfirebase': {
							apiKey: "AIzaSyC0eCOfddQ_II4EeFm0X_AKUzU3vkYdVfQ",
							authDomain: "fir-chat-f8c3f.firebaseapp.com",
							databaseURL: "https://fir-chat-f8c3f.firebaseio.com",
							projectId: "fir-chat-f8c3f",
							storageBucket: "fir-chat-f8c3f.appspot.com",
							messagingSenderId: "346813030464"
						},
						'batch': {
							'enable_batch': false,    // true|false
							'limit': 5,  			 // No. of groups,members, activity,news view
							'days': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],  // Translation can be done for days
							'months': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']   // Translation can be done for months
						}
					}
				}
			]
		};
		/* Ended configuring multisite */



		/* Started attendance setting */
		this.attendance = {
			'enable_attendance': false,
			'enable_mark_attendance': true  //mark work when attendance is enable
		}
		/* Ended attendance setting */

		/* Started Push notification settings*/
		this.push_notification = {
			'enable_push_notification': false,
			'senderID': '987031531350',  // here enter your sendedr ID
			'duration': 2000,
			'registrationId': ''  // fetch from device
		}
		/* Ended Push notification settings */

		/* TRACKS LOADED COMPONENTS
			STATUS :
				0 NOT LOADED
				1 LOADED
				In array : Loaded
		*/
		this.defaultTrack = {
			'version': 1,
			'counter': 0,
			'user': 0,
			'featured': 0,// Check if there is any change in featured courses
			'popular': 0,// Check if there is any change in popular courses
			'allcoursecategories': 0,
			'allcourselocations': 0,
			'allcourselevels': 0,
			'allcourses': 0,
			'allposts': 0,
			'transactions': 0,
			'posts': [],
			'dashboardCharts': [],
			'courses': [], // if loaded it exists here
			'stats': 0, // Check if any need to reload student statistics
			'notifications': 0, // Check if any new notifications are added.
			'announcements': 0, // Check if any new announcements are added for user
			'allinstructors': 0,//track if new instructor is added in site
			'instructors': [], //if loaded it exists here
			'profile': 0,
			'profiletabs': [],//if loaded it exists here
			'reviews': [],
			'course_status': [], //load course curriclum & statuses
			'statusitems': [],
			'saved_results': [],
			'comments': [],
			'assignments': [],
			'members': []
		};
		this.track = this.defaultTrack;

		if (this.batch.enable_batch) {
			this.track['allgroups'] = 0;
			this.track['groups'] = [];
		}

		this.unread_notifications_count = 0;

		this.translations = {
			'home_title':'صفحه خانه',
			'home_subtitle':'آیتم های ویژه',
			'start_course': 'شروع',
			'search_title':'درحال جستجو',
			'continue_course': 'ادامه',
			'completed_course': 'تکمیل شد',
			'expired_course': 'منقضی شد',
			'evaluation_course':'تحت سنجش',
			'no_reviews':'هیچ نقد و برسی برای این دوره نیست',
			'year': 'سال',
			'years': 'سال',
			'month': 'ماه',
			'months': 'ماه',
			'week':'هفته',
			'weeks':'هفته',
			'day':'روز',
			'days':'روز',
			'hour':'ساعت',
			'hours':'ساعت',
			'minute':'دقیقه',
			'minutes':'دقیقه',
			'second':'ثانیه',
			'seconds':'ثانیه',
			'expired':'منقضی شد',
			'completed':'تکمیل شد',
			'start_quiz':'شروع آزمون',
			'save_quiz':'ذخیره آزمون',
			'submit_quiz':'ثبت آزمون',
			'marks': 'نمرات',
			'marks_obtained':'نمرات کسب شده',
			'max_marks':'بیشترین نمرات',
			'true':'درست',
			'false':'غلط',
			'checkanswer':'برسی پاسخ',
			'score':'امتیاز',
			'progress': 'پیشرفت',
			'time': 'زمان',
			'filter_options':'گزینه فیلتر ',
			'sort_options':'گزینه ترتیب ',
			'popular':'رایج',
			'recent':'اخیر',
			'alphabetical':'الفبایی',
			'rated':'بیشترین رتبه',
			'start_date':'پیش رو',
			'okay':'خب',
			'dismiss':'رد کردن',
			'select_category':'انتخاب دسته',
			'select_location':'انتخاب منطقه',
			'select_level':'انتخاب سطح',
			'select_instructor':'انتخاب مدرس',
			'free_paid':'انتخاب قیمت دوره',
			'price':'قیمت',
			'apply_filters':'اعمال فیلتر',
			'close':'بستن',
			'not_found':'دوره ای با این معیار یافت نشد',
			'no_courses':'بدون دوره',
			'course_directory_title':'تمام دوره ها',
			'course_directory_sub_title':'دوره ها',
			'all':'همه',
			'all_free':'رایگان',
			'all_paid':'پرداخت شده',
			'select_online_offline':'انتخاب نوع دوره',
			'online':'آنلاین',
			'offline':'آفلاین',
			'after_start_date':'شروع بعد تاریخ',
			'before_start_date':'شروع قبل تاریخ',
			'instructors_page_title':'تمام اساتید',
			'instructors_page_description':'لیست اساتید',
			'no_instructors':'مدرسی یافت نشد',
			'get_all_course_by_instructor':' نمایش دوره ها بر مبنای اساتید ',
			'profile':'پروفایل',
			'about':'درباره',
			'courses':'دوره ها',
			'marked_answer':'پاسخ های انتخابی',
			'correct_answer':'پاسخ درست',
			'explanation': 'توضیح',
			'awaiting_results':'منتظر پاسخ آزمون',
			'quiz_results':'نتیجه آزمون',
			'retake_quiz':'آزمون مجدد',
			'quiz_start':'آزمون شروع شد',
			'quiz_start_content':'آزمون را شروع کردید',
			'quiz_submit':'آزمون ثبت شد',
			'quiz_submit_content':'آزمون شما ثبت شد',
			'quiz_evaluate':'آزمون برسی شد',
			'quiz_evaluate_content':'آزمون سنجیده شد',
			'certificate':'گواهی',
			'badge':'مدال',
			'no_notification_found':'اعلانی یافت نشد',
			'no_activity_found' :'فعالیتی یافت نشد',
			'back_to_course':'بازگشت به دوره',
			'review_course':'نقد و برسی دوره',
			'finish_course':'پایان دوره',
			'login_heading':'ورود',
			'login_title':'شروع کنیم',
			'login_content':'دوره های شما در گوشی شما در دسترس خواهد بود',
			'login_have_account':'از قبل حساب کاربری دارم',
			'login_signin':'ورود',
			'login_signup':'ثبت نام',
			'login_terms_conditions':'شرایط و قوانین',
			'signin_username':'نام کاربری یا ایمیل',
			'signin_password':'کلمه عبور',
			'signup_username':'نام کاربری',
			'signup_email':'ایمیل',
			'signup_password':'کلمه عبور',
			'signup':'ثبت نام',
			'login_back':'بازگشت به ورود',
			'post_review':'ارسال نقد و برسی برای این دوره',
			'review_title':'عنوان نقد و برسی',
			'review_rating': 'رتبه دهی به نقد و برسی',
			'review_content': 'محتوای نقد و برسی',
			'submit_review': 'ارسال نقد و برسی',
			'rating1star':'دوره بد',
			'rating2star':'نه راضی کننده',
			'rating3star':'راضی کننده',
			'rating4star':'دوره خوب',
			'rating5star':'عالی',
			'failed':'ناموفق',
			'user_started_course':'دوره شما شروع شد',
			'user_submitted_quiz':'آزمون شما ثبت شد',
			'user_quiz_evaluated':'آزمون سنجیده شد',
			'course_incomplete':'دوره تکمیل شد',
			'finish_this_course':'لطفا تمامی جلسات این دوره را علامت بزنید',
			'ok':'خب',
			'update_title':'آپدیت ها',
			'update_read':'خوانده شده',
			'update_unread':'خوانده نشده',
			'no_updates':'آپدیتی یافت نشد',
			'wishlist_title': 'لیست علاقه',
			'no_wishlist':'دوره مورد علاقه یافت نشد',
			'no_finished_courses':'هیچ دوره تکمیل شده نیست!',
			'no_results':'نتیجه ای یافت نشد',
			'loadingresults':'لطفا منتظر باشید',
			'signup_with_email_button_label':'ثبت نام با ایمیل',
			'clear_cache':'حذف داده های آفلاین',
			'cache_cleared':'داده های آفلاین حذف شد',
			'sync_data':'همگام سازی داده',
			'data_synced':'داده ها همگام شد',
			'logout':'خروج',
			'loggedout':'شما با موفقیت خارج شدید',
			'register_account':'برای ادامه وارد شوید یا ثبت نام کنید',
			'email_certificates':'گواهی های ایمیل',
			'manage_data':'مدیریت داده های ذخیره شده',
			'saved_information':'اطلاعات ذخیره شده',
			'client_id':'کلید سایت',
			'saved_quiz_results':'نتایج ذخیره شده','اتمام زمان':'اتمام زمان',
			'app_quiz_results':'نتایج',
			'change_profile_image':'تغییر عکس پروفایل',
			'pick_gallery':'تنظیم عکس از گالری',
			'take_photo':'عکس گرفتن',
			'cancel':'لغو',
			'blog_page':'صفحه وبلاگ',
			'course_chart':'آمار دوره',
			'quiz_chart':'آمار آزمون ها',
			'percentage':'درصد',
			'scores':'امتیازات',
			'edit':'ویرایش',
			'change':'تغییر',
			'edit_profile_field':'ویرایش گزینه های پروفایل',
			'pull_to_refresh':'کشیدن برای بارگزاری مجدد',
			'refreshing':'درحال بارگزاری مجدد',
			'contact_page':'تماس',
			'contact_name':'نام',
			'contact_email':'ایمیل',
			'contact_message':'پیام',
			'contact_follow_us':'مارا دنبال کنید',
			'invalid_url':'آدرس نامعتبر',
			'read_notifications':'اعلانات خوانده شده',
			'unread_notifications':'اعلانات خوانده نشده',
			'logout_from_device':'قصد خروج دارید؟',
			'accept_continue':'قبول و ادامه',
			'finished':'پایان یافت',
			'active':'فعال',
			'open_results_on_site':'لطفا برای دیدن نتایج از مرورگر خود استفاده کنید',
			'show_more':'بیشتر',
			'show_less':'کمتر',

			'buy':'Buy',
			'pricing_options':'گزینه های قیمت',
			'pricing_options_title':'گزینه های قیمت (برای دیدن کلیک کنید)',
			'home_menu_title':'خانه',
			'directory_menu_title':'دوره ها',
			'instructors_menu_title':'اساتید',
			'blog_menu_title':'وبلاگ',
			'contact_menu_title':'تماس با ما',
			'popular_courses_title_home_page':'دوره های رایج',
			'popular_courses_subtitle_home_page':'دوره های رایج و ترند',
			'categories_title_home_page':'دسته ها',
			'categories_subtitle_home_page':'مرور دوره ها با دسته بندی',
			'directory_search_placeholder':'جستجو',
			'featured_courses':'دوره های ویژه',
			'selected_courses':'دوره های انتخاب شده',
			'markallquestions':'لطفا اول همه سوالات را جواب دهید',

			'credit':'اعتبار',
			'debit':'دبیت',
			'wallet_no_products':'برای ایجاد کیف پول محصول با پشتبان تماس بگیرید',
			'wallet_no_transactions': 'هیچ تراکنشی یافت نشد',
			'pay_from_wallet': 'پرداخت با کیف پول',
			'use_wallet':'استفاده از کیف پول در پرداخت',
			'pay':'پرداخت',
			'login_to_buy':'برای خرید دوره لطفا وارد شوید',
			'login_again':'لطفا برای خرید این دوره مجدد وارد شوید',
			'insufficient_funds':'موجودی کیف پول کافی نیست، لطفا اعتبار را افزایش دهید',
			'buy_from_site': 'خرید از طریق سایت',
			'description':'توضیح',
			'curriculum':'برنامه درسی',
			'reviews':'نقد و برسی ها',
			'instructors':'اساتید',
			'retakes_remaining':'انجام مجدد مانده',
			'open_in_new_window':'باز کردن در پنجره جدید',
			'show_notes':'نمایش مباحث & یادداشت ها',
			'unit_attachments': 'پیوست های جلسات',
			'Adding_new_comment':'افزودن نظر جدید',
			'Replying_to_comment':'پاسخ به',
			'Editing_comment':'ویرایش نظر',
			'Submit_Comment' :'ثبت نظر',
			'Reply_comment' :'پاسخ',
			'Edit_comment':'ویرایش',
			'Show_children':'نمایش فرزند',
			'Hide_children':'مخفی سازی فرزند',
			'Unitcomment':'نظرات جلسه',
			'No_comment_avail':'نظری دیگر وجود ندارد',
			'Add_comment':'افزودن نظر',
			'Load_comment':'بارگزاری نظر',
			'Enter_your_comment':'نظر خود را وارد کنید',
			'Cancel':'لغو',
			'insufficient_content':'متن بیشتری برای ذخیره وارد کنید',
			'start_assignment':'شروع تکالیف',
			'upload_assignment':'ارسال تکالیف',
			'your_attachment':'پیوست شما',
			'your_attachment_comment':'نظر شما',
			'assignment_content':'محتوای تکالیف',
			'all_assignment':'تمام تکالیف',
			'Not_match_size_or_type':'نوع یا اندازه فایل درست نیست',
			'Allowed_file_size':'بیشترین اندازه مجاز',
			'Allowed_extensions':'فایل های مجاز',
			'You_have_2_minutes_remaining': 'شما 2 دقیقه زمان دارید',
			'file_not_selected_comment_not_entered':'فایل انتخاب نشده یا نظر وارد نشده',
			'Timer_expired':'تایمر منقضی شد',
			'start_now': 'شروع اکنون',
			'mychats': 'چت های من',
			'members': 'اعضا',
			'chat':'چت',
			'start_chat':'شروع چت',
			'start_new_chat':'شروع چت جدید',
			'chat_message':'پیام چت',
			'chat_email':'شناسه ایمیل',
			'chat_name':'نام',
			'notification_send':'اعلان ارسال شد',
			'just_now':'اکنون',
			'search_user_from_website':'جستجو از سایت',
			'more':'بیشتر',
			'is_typing':'درحال نوشتن',
			'search_user_from_firebase':'کاربران آنلاین',
			'online_user_to_initiate_new_chat':'شروع چت با کاربران آنلاین',
			'user_from_site_you_can_not_chat':'اکنون با کاربران میتوانید چت کنید',
			'chat_initialized':'چت آغاز شد',
			'Lenght_greater_than3':'بیش از 3 حرف بنویسید',
			'type_here':'برای فیلتر کاربران اینجا بنویسید',
			'send_message':'ارسال',
			'type_message':'اینجا بنویسید',
			'back_to_chat':'بازگشت به پیام ها',
			'file_not_valid':'اندازه فایل غیر مجاز یا نا معتبر برای ارسال',
			'type_something':'چیزی بنویسید',
			'file_selected':'فایل انتخاب شده بنویسید',
			'file_not_selected':'فایل انتخاب نشد بنویسید',
			'load_new_messages':'بارگزاری بیشتر ',
			'group_directory':'گروه زبان',
			'no_batches_in_course':'اتاقی برای این دوره وجود ندارد',
			'batch':'اتاق ها',
			'money_refunded':'پول بازگشت شد',
			'money_deducted':'پول کسر شد',
			'not_enough_money_to_purchase_batch':'برای خرید این اتقاق پول کافی ندارید',
			'transaction_failed':'تراکنش ناموفق',
			'money_deducted_joined':'پول کسر شد و به اتاق ملحق شدید',
			'buy_batch':'خرید اتاق',
			'login_buy_batch':'لطفا به خرید اتاق وارد شوید',
			'no_access_from_batch':'شما از اتاق دوره به این دوره دسترسی ندارید',
			'group_name':'نام گروه',
			'group_description':'توضیح گروه',
			'total_members':'اعضای کل',
			'batch_seats':'سندلی های اتاق',
			'start_batch_date':'تاریخ شروع',
			'end_batch_date':'تاریخ پایان',
			'batch_start_time':'زمان شروع',
			'batch_end_time':'زمان پایان',
			'weekly_schedule_off':'برنامه ریزی هفتگی خاموش',
			'now_to':'اکنون به',
			'not_set':'تنظیم نشده',
			'continue':'ادامه',
			'no_member_found':'عضوی یافت نشد',
			'no_news_found':'اخباری یافت نشد',
			'groups':'گروه ها',
			'batches':'اتاق ها',
			'Please_buy_batch_first':'لطفا ابتدا یک اتاق بخرید',
			'newlyCreated':'جدیدا ساخته شده',
			'lastActive':'آخرین فعال',
			'mostMembers':'بیشترین اعضا',
			'upComing':'پیش رو',
			'Batches_not_enable_in_app':'افزونه اتاق در اپلیکیشن فعال نیست',
			'members_directory':'لیست اعضا',
			'topic_directory':'لیست موضوعات',
			'reply_directory':'لیست پاسخ ها',
			'no_member':'عضوی یافت نشد',
			'no_group':'گروهی یافت نشد',
			'reply_not_found':'پاسخی یافت نشد',
			'ascending':'نزولی',
			'descending':'صعودی',
			'topic_title':'عنوان موضوع',
			'topic_content':'عنوان محتوا',
			'reply_content':'محتوای پاسخ',
			'create_topic':'ایجاد موضوع',
			'create_reply':'افزودن پاسخ',
			'edit_content':'ویرایش محتوا',
			'edit_reply':'ویرایش نمایش',
			'delete_reply' : 'حذف پاسخ',
			'create' : 'ساختن',
			'update' : 'آپدیت',
			'updating':'درحال آپدیت',
			'creating':'درحال ساخت',
			'sure_to_delete_reply' : 'دکمه خب را بزنید تا پاسخ حذف شود',
			'forum_not_enable_in_app':'انجمن داخل اپ فعال نیست',
			'limit_reached_to_get_reward':'محدودیت برای گرفتن پاداش',
			'points_added':'امتیازات افزوده شد',
			'forum_directory':'انجمن زبان',
			'forum_not_found':'انجمنی یافت نشد',
			'topic_not_found':'موضوعی یافت نشد',
			'oldest_post_first':'اول قدیمی تر',
			'latest_post_first':'اول جدیدترین',
			'login_to_access':'برای دسترسی وارد شوید',
			'join_to_access':'برای دسترسی ملحق شوید',
			'marked_attendance': 'علامت',
			'unmarked_attendance': 'بدون',
			'mark_today_attendance': 'علامت زدن حضور امروز',
			'scanning_barcode': 'اسکن بارکد',
			'marking_attendance': 'علامت زدن حضور',
			'getting_course_attendance': 'دریافت حضور غیاب دوره',
			'attendance_not_enable': 'حضور غیاب فعال نیست',
			'select_site': 'انتخاب سایت',
			'select_language': 'انتخاب زبان',
			'admins':'ادمین',
			'mods':'مادها',
			'public':'عمومی',
			'private':'خصوصی',
			'hidden':'مخفی',
			'start_end_dates':'شروع - پایان تاریخ'
		};



		this.contactinfo = {
			'title':'تماس با اینترلن',
			'message':'به اپلیکیشن تخصصی آموزش زبان اینترلن خوش آمدید! مجموعه اینترلن آماده پاسخ گویی به تمام سوالات شما عزیزان می باشد',
			'address':'تهران، سهروردی شمالی، خیابان مهاجر',
			'email':'info@interlan.app',
			'phone':'09039525777',
			'twitter':'',
			'facebook':'',
		};
		this.terms_conditions = 'These are app terms and conditions. Any user using this app must have\
		an account on site <a href="https://interlan.app/">Interlan</a>. You must not distribute videos in this app to third parties.';
	}

	set_multisite(i: any) {
		if (this.multisite.enable_multisite && this.multisite.sites[i] && this.multisite.sites[i].all_settings) {

			// override config.setting for specific key
			if (this.multisite.sites[i].all_settings.settings) {
				Object.keys(this.multisite.sites[i].all_settings.settings).map((key) => {
					this.settings[key] = this.multisite.sites[i].all_settings.settings[key];
				});
			}

			// override config.chat and call chat object
			if (this.multisite.sites[i].all_settings.configfirebase) {
				this.configfirebase = this.multisite.sites[i].all_settings.configfirebase;
				let firebaseconfig = this.configfirebase;
				// reinitialize firebase app
				firebase.app().delete().then(function () {
					firebase.initializeApp(firebaseconfig);
				});

			}

			// override config.batch
			if (this.multisite.sites[i].all_settings.batch) {
				this.batch = this.multisite.sites[i].all_settings.batch;
			}

			// override config.forum
			if (this.multisite.sites[i].all_settings.forum) {
				this.forum = this.multisite.sites[i].all_settings.forum;
			}

			// override config.attendance
			if (this.multisite.sites[i].all_settings.attendance) {
				this.attendance = this.multisite.sites[i].all_settings.attendance;
			}

			// override config.attendance
			if (this.multisite.sites[i].all_settings.push_notification) {
				this.attendance = this.multisite.sites[i].all_settings.push_notification;
			}

		}
		// set base url with config.settings url
		this.set_base_url();
		this.site_index = i;
		this.storage.get('track').then((track) => {
			if (track) {
				this.track = track;
			}

		});
		this.storage.get('user').then((user) => {
			if (user) {
				this.user = user;
			}

		})
		console.log('$$$$$$$$$$$$$$$$$$$$$$ After mutisite $$$$$$$$$');
		console.log(this);
	}


	// this will be call after set_multisite and set_multilanguage : first clear things then set with new one
	set_multi_setting(i: any) {
		this.track = this.defaultTrack;
		this.storage.clear();
		this.storage.set('track', this.track);
		this.storage.set('introShown', true);
		this.storage.set('settings', this.settings);
		this.site_index = i;
		this.storage.set('site_index', i);
	}

	// set base url with setting.url
	set_base_url() {
		this.baseUrl = this.settings.url + 'wp-json/wplms/v1/';
	}

	get_translation(key: string) {
		if (this.multisite.enable_multisite) {
			if (this.multisite.sites[this.site_index].translation && this.multisite.sites[this.site_index].translation[key]) {
				return this.multisite.sites[this.site_index].translation[key];
			} else {
				if (this.translations[key]) {
					return this.translations[key];
				}
			}
		} else {
			if (this.translations[key]) {
				return this.translations[key];
			}
		}
	}

	trackComponents(key: string) {
		return this.track[key];
	}

	updateComponents(key, value) {
		if (Array.isArray(this.track[key])) {
			this.track[key].push(value);
			this.storage.set('track', this.track);
		} else {
			this.track[key] = value;
			this.storage.set('track', this.track);
		}
	}

	//Only for arrays
	removeFromTracker(key, value) {
		if (Array.isArray(this.track[key])) {
			if (this.track[key].length) {
				if (this.track[key].indexOf(value) != -1) {
					let k = this.track[key].indexOf(value);
					this.track[key].splice(k, 1);
					this.storage.set('track', this.track);
				}
			}
		}
	}
	addToTracker(key, value) {
		if (Array.isArray(this.track[key])) {
			if (this.track[key].indexOf(value) == -1) {
				console.log('in add to tracker array');
				this.track[key].push(value);
			}
		} else {
			console.log('in add to tracker single value');
			this.track[key] = value;
		}
		console.log(this.track);
		this.storage.set('track', this.track);
	}

	public set_settings(key, value) {
		this.settings[key] = value;
		this.storage.set('settings', this.settings);
	}
	save_settings() {
		this.storage.set('settings', this.settings);
	}

	initialize() {
		this.storage.get('track').then(res => {
			if (res) {
				this.track = res;
			}
		});

		this.storage.get('settings').then(res => {
			if (res) {
				this.settings = res;
			}
		});

		this.storage.get('user').then(res => {
			if (res) {
				this.user = res;
				if (this.user['id']) {
					this.isLoggedIn = true;
					/* make firebase login from storage */
					this.firebase_login_from_storage(this.user);
				}
			}
			this.getTracker();
		});

		this.storage.get('lastcourse').then((d) => {
			this.lastCourse = d;
		});
	}

	firebase_login_from_storage(user) {
		// make firebase hit here to register new user
		if (this.chat.enable_chat) {
			this.register_new_user(user);// make login to user or register
		}
		// end of registration
	}

	register_new_user(new_user_obj) {
		let $this = this;
		let type = 'student';  // get type here admin or  student

		firebase.database()
			.ref(`/users/${new_user_obj.id}`)
			.once('value', function (snapdata) {
				if (snapdata.val() == null) {
					let user = {
						'email': new_user_obj.email,
						'id': new_user_obj.id,
						'image': new_user_obj.avatar,
						'name': new_user_obj.name,
						'status': 1
					}

					firebase.database().ref(`/users/${new_user_obj.id}/id`).set(new_user_obj.id);
					firebase.database().ref(`/users/${new_user_obj.id}/image`).set(new_user_obj.avatar);
					firebase.database().ref(`/users/${new_user_obj.id}/name`).set(new_user_obj.name);
					firebase.database().ref(`/users/${new_user_obj.id}/status`).set(1);
					firebase.database().ref(`/users/${new_user_obj.id}/type`).set(type);



					firebase.database().ref(`/users/${new_user_obj.id}/base`).set(user)
						.then((value) => {
							user.id = value.key; //new creted user id

							// some onDisconnect operational event
							firebase.database().ref(`/users/${user.id}/status`).onDisconnect().set(0);
							firebase.database().ref(`/users/${user.id}/lastActive`).onDisconnect().set(Date.now());
							firebase.database().ref(`/users/${user.id}/base/status`).onDisconnect().set(0);
							firebase.database().ref(`/users/${user.id}/base/lastActive`).onDisconnect().set(Date.now());

							//set base->id=new created user id and new chat assign
							firebase.database().ref(`/users/${user.id}/base/`).set(user).then((new_value) => {
								console.log('new user registered');
							});
						});
				} else {
					/*set status of user 1 if user logged_in int App also make
						user status 0 if user not disconnect
					*/
					// $this.config.user.id
					firebase.database().ref(`/users/${new_user_obj.id}/status`).set(1);
					firebase.database().ref(`/users/${new_user_obj.id}/status`).onDisconnect().set(0);
					firebase.database().ref(`/users/${new_user_obj.id}/lastActive`).onDisconnect().set(Date.now());
					firebase.database().ref(`/users/${new_user_obj.id}/base/status`).onDisconnect().set(0);
					firebase.database().ref(`/users/${new_user_obj.id}/base/lastActive`).onDisconnect().set(Date.now());
				}
			});
	}


	isLoading() {
		return this.storage.get('track');
	}

	updateUser() {
		this.storage.get('user').then(res => {
			if (res) {
				this.user = res;
				if (this.user['id']) {
					this.isLoggedIn = true;
				}
			} else {
				this.isLoggedIn = false;
				this.user = 0;
				this.storage.remove('user');
			}
		});
	}
	getLastCourse() {
		this.storage.get('lastcourse').then((d) => {
			this.lastCourse = d;
		});
	}
	matchObj(big: any, small: any) {

		for (let i = 0; i < big.length; i++) {
			if (big[i].time == small.time && big[i].content == small.content) {
				return true;
			}
		}
		return false;
	}






	getTracker() {
		let $this = this;

		console.log('FETCH STORED TRACKER');


		if (this.isLoggedIn) {



			this.http.get(`${this.baseUrl}track/` + this.user.id + `?access=` + this.lastaccess)
				.map(response => {
					return response.json();
				}).subscribe(res => {
					if (res) {
						console.log('Version compare : ' + res.version + ' == ' + this.track.version);
						if (res.version != this.track.version) {
							//Re-record all cached data.
							this.defaultTrack.version = res.version;
							this.track = this.defaultTrack;
						} else {

							if (res.counter != this.track.counter || !res.counter) {

								var keys = Object.keys(res);
								if (keys.length) {
									keys.map((key) => {
										if (key in this.track) {
											if (Array.isArray(this.track[key])) {
												if (typeof res[key] === 'object') {
													Object.keys(res[key]).map((r) => {
														let c = $this.track[key].indexOf(parseInt(r));
														if (c > -1) {
															console.log('splicing...' + key)
															$this.track[key].splice(c, 1)
															console.log($this.track[key]);
														}
													});
												} else if (Array.isArray(res[key])) {
													res[key].map((r) => {
														let c = $this.track[key].indexOf(parseInt(r));
														if (c > -1) {
															console.log('splicing...' + key)
															$this.track[key].splice(c, 1)
															console.log($this.track[key]);
														}
													});
												}
											} else {
												if (key !== 'version') {
													if (!isNaN(res[key]) && res[key] > 1) {
														$this.track[key] = res[key];
													}
												}
											}
										}

										if (key == 'updates') {
											this.storage.get('updates').then(storedupdates => {
												if (!storedupdates) { storedupdates = []; }

												for (let k = 0; k < res[key].length; k++) {
													if (!this.matchObj(storedupdates, res[key][k])) {
														storedupdates.push(res[key][k]);
													}
												}
												this.storage.set('updates', storedupdates);
											});
										}
									});
								}

								this.storage.set('track', this.track);
								this.storage.set('lastaccess', this.timestamp);
							}
						}
					}
				});

			this.storage.get('updates').then(storedupdates => {
				if (storedupdates) {
					this.unread_notifications_count = storedupdates.length;
					this.storage.get('readupdates').then(readupdates => {
						if (readupdates) {
							this.unread_notifications_count = storedupdates.length - readupdates.length;
						}
					});
				}
			});
		} else {

			var url = `${this.baseUrl}track/?access=` + this.lastaccess;

			if (!this.settings.client_secret.length) {
				url = `${this.baseUrl}track/?client_id=` + this.settings.client_id + `&access=` + this.lastaccess;
			}

			this.http.get(url)
				.map(response => {
					return response.json();
				}).subscribe(res => {

					if (res) {
						if (res.version != this.track.version) {
							//Re-record all cached data.
							this.defaultTrack.version = res.version;
							this.track = this.defaultTrack;

						} else {

							if ((res.counter != this.track.counter || !res.counter)) {

								var keys = Object.keys(res);
								if (keys.length) {
									keys.map((key) => {
										if (key in this.track) {
											if (Array.isArray(this.track[key])) {
												if (typeof res[key] === 'object') {
													Object.keys(res[key]).map((r) => {
														let c = $this.track[key].indexOf(parseInt(r));
														if (c > -1) {
															console.log('splicing...' + key)
															$this.track[key].splice(c, 1)
															console.log($this.track[key]);
														}
													});
												} else if (Array.isArray(res[key])) {
													res[key].map((r) => {
														let c = $this.track[key].indexOf(parseInt(r));
														if (c > -1) {
															console.log('splicing...' + key)
															$this.track[key].splice(c, 1)
															console.log($this.track[key]);
														}
													});
												}
											} else {
												if (key !== 'version') {
													if (!isNaN(res[key]) && res[key] > 1) {
														$this.track[key] = res[key];
													}
												}
											}
										}

										if (key == 'updates') {

											this.storage.get('updates').then(storedupdates => {
												if (!storedupdates) { storedupdates = []; }

												for (let k = 0; k < res[key].length; k++) {
													if (!this.matchObj(storedupdates, res[key][k])) {
														storedupdates.push(res[key][k]);
													}
												}
												this.storage.set('updates', storedupdates);
											});
										}
									});
								}

								this.storage.set('track', this.track);
								this.storage.set('lastaccess', this.timestamp);
							}
						}

						if ('client_secret' in res) {
							console.log('Fetching client_secret');
							this.settings.client_secret = res.client_secret;
							this.settings.state = res.state;
							this.save_settings();
						}


						this.storage.get('updates').then(storedupdates => {
							if (storedupdates) {
								this.unread_notifications_count = storedupdates.length;
								this.storage.get('readupdates').then(readupdates => {
									if (readupdates) {
										this.unread_notifications_count = storedupdates.length - readupdates.length;
									}
								});
							}
						});
					}
				});

		}
	}
	isString(val) { return typeof val === 'string'; }
	isArray(obj: any): boolean { return Array.isArray(obj); }

	//convert 02/13/2009 23:31:30  to timestamp
	toTimestamp(strDate) {
		var datum = Date.parse(strDate);
		return datum;
	}

	public getUserAuthorizationHeaders() {
		var userheaders = new Headers();
		userheaders.append('Authorization', this.settings.access_token);
		return new RequestOptions({ headers: userheaders });
	}
}
