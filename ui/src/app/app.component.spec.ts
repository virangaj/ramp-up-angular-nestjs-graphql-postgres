import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { AppComponent } from './app.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { AddEvent, CancelEvent, EditEvent, RemoveEvent } from '@progress/kendo-angular-grid';
import { FormGroup } from '@angular/forms';

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
  describe('editHandler', () => {
    it('should set up form and edit row correctly', () => {
      const mockDataItem = {
        id: 1,
        name: 'John',
        address: '123 St',
        email: 'john@email.com',
        gender: 'Male',
        mobileNo: '1234567890',
        dob: new Date('2000-01-01'),
      };

      const mockEvent: EditEvent = {
        dataItem: mockDataItem,
        rowIndex: 0,
        isNew: false,
        sender: {
          closeRow: jasmine.createSpy('closeRow'),
          editRow: jasmine.createSpy('editRow'),
        } as any,
      };

      component.editHandler(mockEvent);

      expect(component.editedRowIndex).toBe(mockEvent.rowIndex);
      expect(component.editDataID).toBe(mockDataItem.id);

      expect(component.formGroup.get('name')?.value).toBe(mockDataItem.name);
      expect(component.formGroup.get('address')?.value).toBe(
        mockDataItem.address
      );
      expect(component.formGroup.get('email')?.value).toBe(mockDataItem.email);
      expect(component.formGroup.get('gender')?.value).toBe(
        mockDataItem.gender
      );
      expect(component.formGroup.get('mobileNo')?.value).toBe(
        mockDataItem.mobileNo
      );
      expect(component.formGroup.get('dob')?.value).toBe(mockDataItem.dob);

      expect(mockEvent.sender.editRow).toHaveBeenCalledWith(
        mockEvent.rowIndex,
        component.formGroup
      );
    });
  });
  describe('AddHandler', () => {
    it('should set up form and add row correctly', () => {
      const mockEvent: AddEvent = {
        dataItem: {} as any,
        rowIndex: 0,
        isNew: true,
        sender: {
          closeRow: jasmine.createSpy('closeRow'),
          addRow: jasmine.createSpy('addRow'),
        } as any,
      };

      component.addHandler(mockEvent);

      expect(component.formGroup.get('name')?.value).toBe(null);
      expect(component.formGroup.get('address')?.value).toBe(null);
      expect(component.formGroup.get('email')?.value).toBe(null);
      expect(component.formGroup.get('gender')?.value).toBe(null);
      expect(component.formGroup.get('mobileNo')?.value).toBe(null);
      expect(component.formGroup.get('dob')?.value).toBe(null);

      expect(mockEvent.sender.addRow).toHaveBeenCalledWith(component.formGroup);
    });
  });
  describe('cancelHandler and closeEditor', () => {
    it('should cancel editing and close row', () => {
      const mockGrid = {
        closeRow: jasmine.createSpy('closeRow'),
      } as any;

      const mockEvent: CancelEvent = {
        rowIndex: 1,
        sender: mockGrid,
        formGroup: component.formGroup,
        dataItem: undefined,
        isNew: false
      };

      component.editedRowIndex = 1;
      component.formGroup = new FormGroup({});

      component.cancelHandler(mockEvent);

      expect(mockGrid.closeRow).toHaveBeenCalledWith(1);
      expect(component.editedRowIndex).toBeUndefined();
      expect(component.formGroup).toBeNull();
    });

    it('should close editor with default rowIndex', () => {
      const mockGrid = {
        closeRow: jasmine.createSpy('closeRow'),
      } as any;

      component.editedRowIndex = 2;
      component.closeEditor(mockGrid);

      expect(mockGrid.closeRow).toHaveBeenCalledWith(2);
      expect(component.editedRowIndex).toBeUndefined();
      expect(component.formGroup).toBeNull();
    });
  });
  describe('removeHandler', () => {
    it('should set deletedId and open delete dialog', async () => {
      spyOn(component, 'open');
      
      const mockEvent: RemoveEvent = {
        dataItem: { id: 123 },
        sender: {} as any,
        isNew: false,
        rowIndex: 0
      };
   
      await component.removeHandler(mockEvent);
   
      expect(component.deletedId).toBe(123);
      expect(component.open).toHaveBeenCalled();
    });
   });
   describe('Dialog controls', () => {
    it('should open dialog', () => {
      component.open();
      expect(component.opened).toBeTrue();
    });
   
    it('should close dialog', () => {
      component.opened = true;
      component.close();
      expect(component.opened).toBeFalse();
    });
   });
});
