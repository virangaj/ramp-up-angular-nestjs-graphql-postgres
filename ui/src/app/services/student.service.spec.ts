import { TestBed } from '@angular/core/testing';

import { StudentService } from './student.service';
import { Apollo } from 'apollo-angular';

describe('StudentService', () => {
  let service: StudentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: Apollo, useValue: {} }],
    });
    service = TestBed.inject(StudentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
