import { TestBed } from '@angular/core/testing';

import { GraphqlService } from './graphql.service';
import { Apollo } from 'apollo-angular';

describe('GraphqlService', () => {
  let service: GraphqlService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: Apollo, useValue: {} }],
    });
    service = TestBed.inject(GraphqlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
