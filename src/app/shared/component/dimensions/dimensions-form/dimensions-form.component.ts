import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {SpacesService} from '../../../../services/spaces.service';
import {Space} from '../../../../models/space.model';
import {Dimension} from '../../../../models/profile.model';
import {ProfileService} from '../../../../services/profile/profile.service';

@Component({
    selector: 'datawhore-dim-form',
    templateUrl: './dimensions-form.component.html',
    styleUrls: ['./dimensions-form.component.less']
})
export class DimensionFormComponent {

    public initialModel: string;
    public dims: Array<Dimension> = [];
    @Input() public space: Space;
    @Input() public model: any;
    @Input() public dimType: string;
    @Output() public onNewDimensions = new EventEmitter<any>();

    constructor(public profileService: ProfileService) {
    }

    public haveDimsChanged(): boolean {
        return JSON.stringify(this.model) !== this.initialModel;
    }

    public saveDimensions(): any {

        this.dims = [];

        const dimensions$ = this[`${this.dimType}Service`].updateProfile(this.space.name, this.prepareDimensions()).do((dims) => {
            this.dims = dims.map(dim => new Dimension(dim.friendlyName, dim.schemaPath));
            this.onNewDimensions.emit([this.dims, this.dimType]);

        });

        dimensions$.subscribe();

    }

    private prepareDimensions(): any {

        const groupEnabled = (dimensions) => {
            dimensions.forEach(dim => {
                if (dim) {
                    if (dim.grouped) {
                        groupEnabled(dim.content.value);
                    } else if (dim.content.enabled) {
                        this.dims.push(dim.content);
                    }
                }
            });
            return this.dims;
        };

        return groupEnabled(this.model).map(dims => {
            return {
                friendlyName: dims.friendlyName,
                schemaPath: dims.schemaPath
            };
        });

    }


}