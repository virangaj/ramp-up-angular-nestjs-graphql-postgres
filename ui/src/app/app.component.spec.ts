import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { AppComponent } from './app.component';
import { FileUploadComponent } from './file-upload/file-upload.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        ApolloTestingModule,
        HttpClientTestingModule,
      ],
      declarations: [AppComponent, FileUploadComponent],
      teardown: { destroyAfterEach: false },
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Student Management'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Student Management');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Student Management'
    );
  });
  describe('onStateChange', () => {
    it('should update gridState with default values when state is empty', () => {
      spyOn(component as any, 'loadData');
      component.onStateChange({});
      expect(component.gridState).toEqual({
        skip: 0,
        take: 5,
      });
      expect(component.loadData).toHaveBeenCalledTimes(1);
    });

    it('should update gridState with provided skip and take values', () => {
      spyOn(component as any, 'loadData');
      const testState = {
        skip: 10,
        take: 20,
      };
      component.onStateChange(testState);
      expect(component.gridState).toEqual({
        skip: 10,
        take: 20,
      });
      expect(component.loadData).toHaveBeenCalledTimes(1);
    });
  });
});
