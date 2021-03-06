import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import {Space} from '../../../models/space.model';
import {ActivatedRoute, Router} from '@angular/router';
import {SpacesService} from '../../../services/spaces.service';
import {SpaceOauthSettings} from '../../../models/space-settings.model';
import {Paths} from '../../../classes/paths.class';
import {Observable} from 'rxjs';
import {OauthSettingsService} from '../../../services/oauth-settings.service';
import {ProfileService} from '../../../services/profile.service';
import {Profile} from '../../../models/profile.model';
import {SpaceItemComponent} from '../space-item/space-item.component';
import {SpaceItemService} from '../../services/space-item/space-item.service';
import {RainService} from '../../../services/rain.service';
import {FileUploader} from 'ng2-file-upload';


@Component({
    selector: 'datawhore-space-config',
    templateUrl: 'space-config.component.html',
    styleUrls: ['space-config.component.less']
})
export class SpaceConfigComponent implements OnInit {

    @Input() public space: Space;
    @Input() public spaceOauthSettings;
    public uploader: FileUploader;
    public isPassportCapable = true;
    public isLegacy = true;

    public retrieveSpace$: Observable<SpaceOauthSettings> = new Observable<SpaceOauthSettings>();
    @Output() public gotOauthSettings: EventEmitter<SpaceOauthSettings> = new EventEmitter<SpaceOauthSettings>();
    @Output() public onUpdateSpace: EventEmitter<any> = new EventEmitter<any>();
    @Output() public onRemoveSpace: EventEmitter<any> = new EventEmitter<any>();
    @Output() public onToggleEditSpace: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild(SpaceItemComponent) public spaceItemComponent;

    constructor(public spacesService: SpacesService,
                public spaceItemService?: SpaceItemService,
                public activatedRoute?: ActivatedRoute,
                public rainService?: RainService,
                public profileService?: ProfileService,
                public oauthService?: OauthSettingsService,
                public router?: Router) {

        this.retrieveSpace$ = this.activatedRoute.params.do(params => params)
            .mergeMap(params => this.spacesService.getSpace(params['space']))
            .switchMap(space => this.oauthService.getOauthSettings(space.name))
            .do(oauth => {
                this.space = this.spacesService.space;
                this.space.oauth = oauth;
                this.gotOauthSettings.emit(this.space.oauth);
            });
    }

    ngOnInit() {
        this.setSpace();

        this.uploader = new FileUploader({url: `${Paths.DATAWHORE_API_URL}/upload/${this.space.name}/space/icon`});
        this.uploader.onCompleteItem = (item, response, status) => {
            if (status === 200) {
                const res = JSON.parse(response);
                this.space.icon = res.icon;
                this.space.modified = res.modified;
            }
        };

    }

    public setSpace(): void {
        this.space = this.spacesService.space;
        // this.space.display = !!this.space.display ? { color: '#' + Math.floor(Math.random() * 16777215).toString(16) } : this.space.display;
    }


    public addLegacySettings(): void {
        this.space.oauth.addLegacySettings(this.isPassportCapable);
    }

    public updateSpaceSettings(): any {
        this.oauthService.updateSpaceSettings(this.space).subscribe((settings) => {
            this.space.oauth = settings;
            this.space.inEditMode = false;
        });
    }

    public newDimensions(data, rainType): any {
        if (data[1] === 'profile') {
            this[data[1]].properties = data[0];
            console.log(this[data[1]].properties);
            this.profileService.findSpaceLinks(this[data[1]].properties, this.space);
        } else {
            const dimRain = this.rainService.rain.filter(r => r.rainType === rainType)[0];
            dimRain.properties = data[0];
        }
    }

    public changeSpaceColor(color): void {

        console.log(color);
        this.space.display = { color };
        this.spacesService.updateSpace(this.space).subscribe();

    }

}
