import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  AddEvent,
  CancelEvent,
  EditEvent,
  GridComponent,
  GridDataResult,
  PagerPosition,
  PagerType,
  RemoveEvent,
  SaveEvent,
} from '@progress/kendo-angular-grid';
// import { State } from './models';
import { State } from '@progress/kendo-data-query';
import { Observable, Subscription } from 'rxjs';
import { CreateStudent, FetchPaginatedStudentsOutput, Student } from './models';
import { NotificationsService } from './services/notifications.service';
import { SocketService } from './services/socket.service';

import { environment } from '../environments/environment';
import { StudentFacade } from './facades/student.facade';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  loading: boolean = true;
  public gridData: GridDataResult;
  private querySubscription: Subscription;
  constructor(
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationsService,
    private socketService: SocketService,
    private studentFacade: StudentFacade
  ) {}

  public title = 'Student Management';
  public type: PagerType = 'numeric';
  public buttonCount = 5;
  public info = true;
  public pageSizes = [2, 5, 10, 20];
  public previousNext = true;
  public position: PagerPosition = 'bottom';
  public editedRowIndex: number | undefined = undefined;
  public editDataID: number | undefined = undefined;
  public pageSize = 5;
  public skip = 0;
  public formGroup!: FormGroup | any;
  public gridState: any = {
    sort: [],
    skip: 0,
    take: 5,
  };
  public opened = false;
  public deletedId: number;
  uploadSaveUrl = environment.FILE_UPLOAD_API;
  uploadRemoveUrl = 'removeUrl';

  ngOnInit() {
    this.loadData();
    this.socketService.onConnectedMessage((msg: any) => {
      console.debug('socketService : ', msg);
    });
    this.socketService.onFileUploadStatus((msg: any) => {
      console.debug('socketService : ', msg);
      if (msg.status === 400) {
        this.notificationService.showNotification(
          'error',
          'File failed to uploaded'
        );
      } else {
        this.notificationService.showNotification(
          'success',
          'File uploaded successfully'
        );
        this.loadData();
      }
    });
  }
  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }
  public view: Observable<GridDataResult> | undefined;

  public onStateChange(state: State): void {
    console.debug('onStateChange : ', state);

    this.gridState = {
      ...state,
      skip: state.skip ?? 0,
      take: state.take ?? 5,
    };
    this.loadData();
  }
  public genderOptions = [
    { text: 'Male', value: 'Male' },
    { text: 'Female', value: 'Female' },
  ];
  public async loadData(): Promise<void> {
    this.loading = true;
    const data: FetchPaginatedStudentsOutput =
      await this.studentFacade.getPaginatedStudents({
        skip: this.gridState.skip,
        pageSize: this.gridState.take,
      });
    this.gridData = {
      data: data.data,
      total: data.totalPages * data.pageSize,
    };
    this.cdr.detectChanges();
    this.loading = false;
  }
  // hnadle update student
  public editHandler(args: EditEvent): void {
    const { dataItem } = args;
    this.closeEditor(args.sender);
    this.formGroup = new FormGroup({
      name: new FormControl(dataItem.name),
      address: new FormControl(dataItem.address),
      email: new FormControl(dataItem.email),
      gender: new FormControl(dataItem.gender),
      mobileNo: new FormControl(dataItem.mobileNo),
      dob: new FormControl(dataItem.dob),
    });
    this.editedRowIndex = args.rowIndex;
    this.editDataID = dataItem.id;
    args.sender.editRow(args.rowIndex, this.formGroup);
  }
  //  handle create new user
  public addHandler(args: AddEvent): void {
    this.closeEditor(args.sender);

    this.formGroup = new FormGroup({
      name: new FormControl(),
      address: new FormControl(),
      email: new FormControl(),
      gender: new FormControl(),
      mobileNo: new FormControl(),
      dob: new FormControl(),
    });
    args.sender.addRow(this.formGroup);
  }
  // save the data and sync with database
  public async saveHandler({
    sender,
    rowIndex,
    formGroup,
    isNew,
  }: SaveEvent): Promise<void> {
    const student: CreateStudent = formGroup.value;
    console.log(student);
    sender.closeRow(rowIndex);
    if (isNew) {
      try {
        const newStd: Student = await this.studentFacade.createNewStudent(
          student
        );
        if (this.gridData.data.length > 0) {
          this.gridData = {
            data: [newStd, ...this.gridData.data],
            total: this.gridData.total + 1,
          };
          this.notificationService.showNotification('success');
          this.cdr.detectChanges();
        } else {
          this.gridData = { data: [newStd], total: 1 };
        }
      } catch (e: any) {
        console.error(e);
        this.notificationService.showNotification('error', e.message);
      }
    } else {
      try {
        const updatedStd: Student = await this.studentFacade.updateStudent(
          Number(this.editDataID),
          student
        );
        this.gridData.data = this.gridData.data.map((item) => {
          if (item.id === updatedStd?.id) {
            return updatedStd;
          }
          return item;
        });
        this.editDataID = undefined;
        this.cdr.detectChanges();
        this.notificationService.showNotification('success');
      } catch (e: any) {
        console.error(e);
        this.notificationService.showNotification('error', e.message);
      }
    }
  }
  public async removeHandler(args: RemoveEvent): Promise<void> {
    // console.debug('removeHandler : ', args);
    this.deletedId = args.dataItem.id;
    // open the delete confirmation dialog
    this.open();
  }
  public async deleteApprove(): Promise<void> {
    try {
      const deletedStd: Student = await this.studentFacade.removeStudent(
        Number(this.deletedId)
      );
      if (deletedStd != null) {
        this.gridData = {
          data: this.gridData.data.filter((item) => item.id !== this.deletedId),
          total: this.gridData.total - 1,
        };
        this.cdr.detectChanges();
        this.notificationService.showNotification(
          'success',
          'Data has been deleted successfully.'
        );
      }
    } catch (error) {
      console.debug('there was an error sending the query', error);
      this.notificationService.showNotification('error');
    }
    this.opened = false;
  }

  public open(): void {
    this.opened = true;
  }
  public close(): void {
    this.opened = false;
  }
  public cancelHandler(args: CancelEvent): void {
    // close the editor for the given row
    this.closeEditor(args.sender, args.rowIndex);
  }
  public closeEditor(grid: GridComponent, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = null;
  }
}
