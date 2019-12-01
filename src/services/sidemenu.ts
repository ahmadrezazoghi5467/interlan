import { Injectable } from '@angular/core';
import { ConfigService } from "./config";
import { Intro } from '../pages/intro/intro';
import { TabsPage } from '../pages/tabs/tabs';
import { ContactPage } from '../pages/contact/contact';
import { BlogPage } from '../pages/blog/blog';
import { DirectoryPage } from '../pages/directory/directory';
import { GroupdirectoryPage } from '../pages/groupdirectory/groupdirectory';
import { MembersDirectoryPage } from '../pages/membersdirectory/membersdirectory';
import { ForumdirectoryPage } from '../pages/forumdirectory/forumdirectory';
import { InstructorsPage } from '../pages/instructors/instructors';

@Injectable()
export class SideMenuService {

    pages: any =[];

    constructor(
        private config: ConfigService
    ){ 
    }

    set_Pages(){
        this.pages = [
            { title: this.config.get_translation('home_menu_title'), component: TabsPage, index: 0, hide: false },
            { title: this.config.get_translation('directory_menu_title'), component: DirectoryPage, index: 2, hide: false },
            { title: this.config.get_translation('instructors_menu_title'), component: InstructorsPage, index: 3, hide: false },
            { title: this.config.get_translation('blog_menu_title'), component: BlogPage, index: 1, hide: false },
            { title: this.config.get_translation('contact_menu_title'), component: ContactPage, index: 4, hide: false }
        ];

        if (this.config.batch.enable_batch) {
            this.pages.push({ title: this.config.get_translation('group_directory'), component: GroupdirectoryPage, index: 5, hide: false });

        }

        if (this.config.members_directory.enable_members_directory) {
            this.pages.push({ title: this.config.get_translation('members_directory'), component: MembersDirectoryPage, index: 6, hide: false });
        }

        if (this.config.forum.enable_forum) {
            this.pages.push({ title: this.config.get_translation('forum_directory'), component: ForumdirectoryPage, index: 6, hide: false });
        }
    }


}        