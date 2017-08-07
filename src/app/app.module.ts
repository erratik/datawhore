import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule, Routes} from '@angular/router';
import {MomentModule} from 'angular2-moment';
import * as _ from "lodash";

import {FileSelectDirective, FileDropDirective} from 'ng2-file-upload';

import {SpacesService} from './services/spaces.service';
import {OauthSettingsService} from './services/space/oauth-settings.service';
import {ProfileService} from './services/profile/profile.service';
import {SpaceItemService} from './shared/services/space-item/space-item.service';
import {RainService} from './services/rain/rain.service';

import {AppComponent} from './app.component';
import {HeaderComponent} from './wrapper/header/header.component';
import {ContainerComponent} from './wrapper/container/container.component';
import {FooterComponent} from './wrapper/footer/footer.component';

import {SettingsViewComponent} from './views/settings/settings.component';
import {EditSpacesComponent} from './views/spaces/edit-spaces/edit-spaces.component';

import {ValuesPipe} from './shared/pipes/values-pipe.pipe';
import {SpaceViewComponent} from './views/spaces/view-space/view-space.component';
import {SpaceConfigComponent} from './shared/component/space-config/space-config.component';
import {DimensionListComponent} from './shared/component/dimensions/dimensions-list/dimensions-list.component';
import {DimensionFormComponent} from './shared/component/dimensions/dimensions-form/dimensions-form.component';
import {SpaceItemComponent} from './shared/component/space-item/space-item.component';
import {SchemaValuePipe} from './shared/pipes/schema-value.pipe';
import {ProfileFormComponent} from './views/profile/profile-form/profile-form.component';
import {OrderByPipe} from './shared/pipes/order-by.pipe';
import {AddSpaceComponent} from './views/spaces/add-space/add-space.component';
import {PopulateMatchesPipe} from './shared/pipes/populate-matches.pipe';
import {RainFormComponent} from './views/rain/rain-form/rain-form.component';
import { RainConfigsComponent } from './views/rain/rain-configs/rain-configs/rain-configs.component';
import { DropsComponent } from './views/drops/drops/drops.component';
import { DropAtomicComponent } from './views/drops/drop-atomic/drop-atomic.component';
import { KeyPipe } from './shared/pipes/key-pipe.pipe';
import { OrderDropByPipe } from './shared/pipes/order-drop-by.pipe';
import { ImageFigureComponent } from './shared/directives/image-figure/image-figure.component';

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: 'spaces',
        pathMatch: 'full'
    },
    {
        path: 'login', component: EditSpacesComponent
    },
    {
        path: 'spaces', component: EditSpacesComponent
    },
    {
        path: 'space/:space', component: SpaceViewComponent
    },
    {
        path: 'settings', component: SettingsViewComponent
    },
];

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        MomentModule,
        // NgSemanticModule,
        RouterModule.forRoot(appRoutes)
    ],
    declarations: [
        AppComponent,
        HeaderComponent,
        ContainerComponent,
        FooterComponent,
        SettingsViewComponent,
        FileSelectDirective,
        EditSpacesComponent,
        SpaceViewComponent,
        SpaceConfigComponent,
        DimensionListComponent,
        DimensionFormComponent,
        SpaceItemComponent,
        SchemaValuePipe,
        ProfileFormComponent,
        OrderByPipe,
        AddSpaceComponent,
        PopulateMatchesPipe,
        RainFormComponent,
        RainConfigsComponent,
        DropsComponent,
        DropAtomicComponent,
        ValuesPipe,
        KeyPipe,
        OrderDropByPipe,
        ImageFigureComponent
    ],
    providers: [
        SpacesService,
        OauthSettingsService,
        SpaceItemService,
        ProfileService,
        RainService,
        SchemaValuePipe
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
