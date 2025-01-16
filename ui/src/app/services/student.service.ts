import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, tap } from 'rxjs/operators';
import { GET_ALL_STUDENT } from './query';
import { BehaviorSubject } from 'rxjs';
@Injectable()
export class StudentService extends BehaviorSubject<any> {
  data: any[] = [];

  constructor(private apollo: Apollo) {
    super(null);
  }

  fetch() {
    this.apollo
      .watchQuery<any>({
        query: GET_ALL_STUDENT,
      })
      .valueChanges.pipe(
        tap((result) => {
          this.data = result.data.getAllStudent;
          console.log(this.data);
        }),
        map((result) => result.data.getAllStudent)
      )
      .subscribe((data) => {
      });
  }
}
