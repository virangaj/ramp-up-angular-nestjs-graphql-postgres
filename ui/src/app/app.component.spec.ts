import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { AppComponent } from './app.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import {
  AddEvent,
  CancelEvent,
  EditEvent,
  RemoveEvent,
} from '@progress/kendo-angular-grid';
import { FormControl, FormGroup } from '@angular/forms';
import { NotificationsService } from './services/notifications.service';
import { SocketService } from './services/socket.service';
import { CreateStudent, Student } from './models';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let notificationService: NotificationsService;
  let socketService: SocketService;
  beforeEach(async () => {
    const notificationSpy = jasmine.createSpyObj('NotificationsService', [
      'showNotification',
    ]);
    await TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        ApolloTestingModule,
        HttpClientTestingModule,
      ],
      providers: [{ provide: NotificationsService, useValue: notificationSpy }],
      declarations: [AppComponent, FileUploadComponent],
      teardown: { destroyAfterEach: false },
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    notificationService = TestBed.inject(
      NotificationsService
    ) as jasmine.SpyObj<NotificationsService>;
    socketService = TestBed.inject(
      SocketService
    ) as jasmine.SpyObj<SocketService>;
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
        isNew: false,
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
        rowIndex: 0,
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
  describe('ngOnInit', () => {
    let fileStatusCallback: (msg: any) => void;
    let connectedCallback: (msg: any) => void;

    beforeEach(() => {
      spyOn(component, 'loadData');

      spyOn(socketService, 'onFileUploadStatus').and.callFake(
        (callback: (msg: any) => void) => {
          fileStatusCallback = callback;
        }
      );

      spyOn(socketService, 'onConnectedMessage').and.callFake(
        (callback: (msg: any) => void) => {
          connectedCallback = callback;
        }
      );

      component.ngOnInit();
    });

    it('should initialize correctly', () => {
      expect(component.loadData).toHaveBeenCalled();
      expect(socketService.onConnectedMessage).toHaveBeenCalled();
      expect(socketService.onFileUploadStatus).toHaveBeenCalled();
    });
    it('should handle successful file upload', () => {
      fileStatusCallback({ status: 200 });

      expect(notificationService.showNotification).toHaveBeenCalledWith(
        'success',
        'File uploaded successfully'
      );
      expect(component.loadData).toHaveBeenCalled();
    });
    it('should handle failed file upload', () => {
      fileStatusCallback({ status: 400 });

      expect(notificationService.showNotification).toHaveBeenCalledWith(
        'error',
        'File failed to uploaded'
      );
    });
  });
  describe('Remove student approve', () => {
    it('should delete student successfully and update gridData', async () => {
      spyOn(component.studentFacade, 'removeStudent').and.returnValue(
        Promise.resolve({ id: 1 } as Student)
      );
      component.deletedId = 1;
      component.gridData = {
        data: [
          { id: 1, name: 'John Doe' },
          { id: 2, name: 'Jane Doe' },
        ],
        total: 2,
      };

      await component.deleteApprove();

      expect(component.studentFacade.removeStudent).toHaveBeenCalledWith(1);
      expect(component.gridData.data.length).toBe(1);
      expect(
        component.gridData.data.find((item) => item.id === 1)
      ).toBeUndefined();
      expect(component.gridData.total).toBe(1);
      fixture.detectChanges();
      expect(notificationService.showNotification).toHaveBeenCalledWith(
        'success',
        'Data has been deleted successfully.'
      );
      expect(component.opened).toBeFalse();
    });
    it('should handle error and show error notification', async () => {
      spyOn(component.studentFacade, 'removeStudent').and.throwError(
        'Deletion failed'
      );

      await component.deleteApprove();

      expect(notificationService.showNotification).toHaveBeenCalledWith(
        'error'
      );
      expect(component.opened).toBeFalse();
    });
  });
  describe('saveHandler', () => {
    let senderMock: any;
    let formGroupMock: any;
    let studentMock: CreateStudent;
    let newStudentMock: Student;
    let updatedStudentMock: Student;
    beforeEach(() => {
      senderMock = { closeRow: jasmine.createSpy('closeRow') };
      studentMock = {
        name: 'John Doe',
        email: 'john@example.com',
        gender: 'Male',
        address: '123 Street',
        mobileNo: '1234567890',
        courseId: 1,
        dob: new Date(),
      };
      newStudentMock = { id: 1, ...studentMock };
      updatedStudentMock = { id: 1, ...studentMock };

      formGroupMock = new FormGroup({
        name: new FormControl(studentMock.name),
        email: new FormControl(studentMock.email),
        gender: new FormControl(studentMock.gender),
        address: new FormControl(studentMock.address),
        mobileNo: new FormControl(studentMock.mobileNo),
        dob: new FormControl(studentMock.dob),
        courseId: new FormControl(studentMock.courseId),
      });
    });
    it('should create a new student and update gridData', async () => {
      spyOn(component.studentFacade, 'createNewStudent').and.returnValue(
        Promise.resolve(newStudentMock)
      );
      component.gridData = { data: [], total: 0 };

      await component.saveHandler({
        sender: senderMock,
        rowIndex: 0,
        formGroup: formGroupMock,
        isNew: true,
        dataItem: null,
      });

      expect(component.studentFacade.createNewStudent).toHaveBeenCalledWith(
        studentMock
      );
      expect(component.gridData.data.length).toBe(1);
      expect(component.gridData.total).toBe(1);
      // expect(notificationService.showNotification).toHaveBeenCalledWith(
      //   'success'
      // );
      fixture.detectChanges();
      expect(senderMock.closeRow).toHaveBeenCalledWith(0);
    });
    it('should handle error when creating a new student', async () => {
      spyOn(component.studentFacade, 'createNewStudent').and.throwError(
        'Creation failed'
      );

      await component.saveHandler({
        sender: senderMock,
        rowIndex: 0,
        formGroup: formGroupMock,
        isNew: true,
        dataItem: null,
      });

      // expect(notificationService.showNotification).toHaveBeenCalledWith(
      //   'error',
      //   'Creation failed'
      // );
      expect(senderMock.closeRow).toHaveBeenCalledWith(0);
    });
    it('should update an existing student and update gridData', async () => {
      spyOn(component.studentFacade, 'updateStudent').and.returnValue(
        Promise.resolve(updatedStudentMock)
      );
      component.gridData = { data: [{ id: 1, name: 'Old Name' }], total: 1 };
      component.editDataID = 1;

      await component.saveHandler({
        sender: senderMock,
        rowIndex: 0,
        formGroup: formGroupMock,
        isNew: false,
        dataItem: null,
      });

      expect(component.studentFacade.updateStudent).toHaveBeenCalledWith(
        1,
        studentMock
      );
      expect(component.gridData.data.find((item) => item.id === 1)?.name).toBe(
        'John Doe'
      );
      // expect(notificationService.showNotification).toHaveBeenCalledWith(
      //   'success'
      // );
      fixture.detectChanges();
      expect(senderMock.closeRow).toHaveBeenCalledWith(0);
    });
    it('should handle error when updating an existing student', async () => {
      spyOn(component.studentFacade, 'updateStudent').and.throwError(
        'Update failed'
      );
      component.editDataID = 1;

      await component.saveHandler({
        sender: senderMock,
        rowIndex: 0,
        formGroup: formGroupMock,
        isNew: false,
        dataItem: null,
      });

      // expect(
      //   component.notificationService.showNotification
      // ).toHaveBeenCalledWith('error', 'Update failed');
      expect(senderMock.closeRow).toHaveBeenCalledWith(0);
    });
  });
});
