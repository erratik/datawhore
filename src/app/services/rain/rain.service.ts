import {Injectable} from '@angular/core';
import {Http, Response, RequestOptions, Headers} from '@angular/http';
import {Observable} from 'rxjs';
import {SpaceItemService} from '../../shared/services/space-item/space-item.service';

@Injectable()
export class RainService extends SpaceItemService {

  public type = 'rain';

  constructor(http: Http) {
    super(http);
  }

  public getRain(space: string): Observable<any> {
    return this.http.get(`${this.apiServer}/get/rain/${space}`)
        .map((res: Response) => res.json())
        .catch(this.handleError);
  }

  public update(space: string, rain: any): Observable<any> {
    const bodyString = JSON.stringify({
      data: rain
    });

    const headers = new Headers({'Content-Type': 'application/json'}); // ... Set content type to JSON
    const options = new RequestOptions({headers: headers}); // Create a request option

    return this.http.put(`${this.apiServer}/update/rain/${space}`, bodyString, options).map((res: Response) => {
      return res.json();
    }).catch(this.handleError);
  }

}
