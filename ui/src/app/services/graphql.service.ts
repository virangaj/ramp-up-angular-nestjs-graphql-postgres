import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GraphqlService {
  constructor(private apollo: Apollo) {}

  async executeQuery(query: any) {
    return this.apollo.watchQuery(query).valueChanges.pipe(take(1)).toPromise();
  }
  
  async mutateQuery(mutation: any) {
    return this.apollo.mutate(mutation).toPromise();
  }
}
