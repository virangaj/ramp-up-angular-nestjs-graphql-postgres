import { TestBed } from '@angular/core/testing';

import { StudentFacade } from './student.facade';
import { Apollo } from 'apollo-angular';

describe('StudentFacade', () => {
  let service: StudentFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: Apollo, useValue: {} }],
    });
    service = TestBed.inject(StudentFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
