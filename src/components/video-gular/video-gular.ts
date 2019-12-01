import { Component, Input, OnInit } from '@angular/core';
import { ConfigService } from '../../services/config';
import { VgAPI } from 'videogular2/core';

@Component({
    selector: 'VideoGularBlock',
    templateUrl: 'video-gular.html'
})
export class VideoGularBlock implements OnInit {

    @Input('meta') meta;
    api: VgAPI;

    constructor(
        private config: ConfigService
    ) {

    }
    ngOnInit() {
    }

    isObject(obj) {
        return typeof obj === 'object';
    }

    onPlayerReady(api: VgAPI) {
        this.api = api;

        this.api.getDefaultMedia().subscriptions.ended.subscribe(
            () => {
                // Set the video to the beginning
                this.api.getDefaultMedia().currentTime = 0;
                console.log('ended');
            }
        );
    }

}



