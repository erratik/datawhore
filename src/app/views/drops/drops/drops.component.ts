import { SpacesService } from '../../../services/spaces.service';
import { RainService } from '../../../services/rain/rain.service';
import { Space } from '../../../models/space.model';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'datawhore-drops',
  templateUrl: './drops.component.html',
  styleUrls: ['./drops.component.less']
})
export class DropsComponent implements OnInit, OnDestroy {

  @Input() public space: Space;
  protected drops;
  protected dropTypes;
  protected rainSchemas;
  protected isLoading = false;
  public getDrops$: Observable<any> = new Observable<any>();
  public moreDrops$: Observable<any> = new Observable<any>();
  public deleteDrops$: Observable<any> = new Observable<any>();
  protected activeTab;
  public model;


  constructor(private rainService: RainService, private spacesService: SpacesService) { }

  ngOnDestroy() {
    this.rainService.drops[this.space.name] = this.drops = null;
  }

  ngOnInit() {
    this.dropTypes = this.rainService.rainSchemas.map((rain, i) => rain.type);
    this.getSomeDrops(this.dropTypes[0]);

  }

  private getSomeDrops(dropType = null): any {

    const options = { limit: 10, after: Date.now() };
    if (dropType) {
      options['type'] = dropType;
    }

    this.getDrops$ = this.rainService.getDrops(this.space.name, options).do((drops) => {
      this.drops = _.groupBy(drops, 'type');
      this.activeTab =  dropType;
    });

    this.getDrops$.subscribe();

  }

  private getMoreDrops(type: string): any {
    this.isLoading = !this.isLoading;
    const after = _.minBy(this.drops[type], (o) => o['timestamp'])['timestamp'];

    this.moreDrops$ = this.rainService.getDrops(this.space.name, { limit: 3, type: type, after: after }).do((drops) => {
      this.drops = _.groupBy(drops, 'type');
    });


    this.moreDrops$.subscribe((newDrops) => {
      this.isLoading = !this.isLoading;
    });
  }

  public setActiveTab(dropType: string): void {
    this.activeTab = this.rainService.type = dropType;
    this.rainService.drops[this.space.name] = null;
    this.getSomeDrops(dropType);

  }

  protected deleteDrop(drop): any {

    this.deleteDrops$ = this.rainService.deleteDrops([drop], this.space.name).do((drops) => {
      // this.drops = _.groupBy(drops, 'type');
      console.log(drops)
    debugger;
    });

    this.deleteDrops$.subscribe((newDrops) => {
      this.isLoading = !this.isLoading;
    });
  }


}
