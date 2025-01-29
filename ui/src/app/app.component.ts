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
import { Apollo } from 'apollo-angular';
import { Observable, Subscription } from 'rxjs';
import {
  CREATE_STUDENT,
  DELETE_STUDENT,
  FETCH_PAGINATED_STUDENTS,
  GET_ALL_STUDENTS,
  UPDATE_STUDENT,
} from './query/students.gql';
import {
  CreateStudent,
  CreateStudentResponse,
  FetchPaginatedStudentsOutput,
  Student,
  UpdateStudentResponse,
} from './models';
import { NotificationsService } from './services/notifications.service';
import { SocketService } from './services/socket.service';

import { FileRestrictions } from '@progress/kendo-angular-upload';
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
    private readonly apollo: Apollo,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationsService,
    private socketService: SocketService,
    private studentFacade: StudentFacade
  ) {}

  title = 'Student Management';
  public type: PagerType = 'numeric';
  public buttonCount = 5;
  public info = true;
  public pageSizes = [2, 5, 10, 20];
  public previousNext = true;
  public position: PagerPosition = 'bottom';
  private editedRowIndex: number | undefined = undefined;
  public editDataID: number | undefined = undefined;
  public pageSize = 5;
  public skip = 0;
  public formGroup!: FormGroup | any;
  public gridState: any = {
    sort: [],
    skip: 0,
    take: 5,
  };
  uploadSaveUrl = environment.FILE_UPLOAD_API;
  uploadRemoveUrl = 'removeUrl';

  ngOnInit() {
    this.loadData();
    this.socketService.onConnectedMessage((msg: any) => {
      console.debug('socketService : ', msg);
    });
    this.socketService.onFilUploadStatus((msg: any) => {
      console.debug('socketService : ', msg);
      this.notificationService.showNotification(
        'success',
        'File uploaded successfully'
      );
      this.loadData();
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
    const student: CreateStudent[] = formGroup.value;
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
      } catch (e) {
        console.error(e);
        this.notificationService.showNotification('error');
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
      } catch (e) {
        console.error(e);
        this.notificationService.showNotification('error');
      }
    }
  }
  public removeHandler(args: RemoveEvent): void {
    // console.debug('removeHandler : ', args);
    this.apollo
      .mutate({
        mutation: DELETE_STUDENT,
        variables: {
          id: Number(args.dataItem.id),
        },
      })
      .subscribe(
        ({ data }) => {
          this.gridData = {
            data: this.gridData.data.filter(
              (item) => item.id !== args.dataItem.id
            ),
            total: this.gridData.total - 1,
          };
          this.cdr.detectChanges();
          this.notificationService.showNotification(
            'success',
            'Data has been deleted successfully.'
          );
        },
        (error) => {
          console.debug('there was an error sending the query', error);
          this.notificationService.showNotification('error');
        }
      );
  }
  public cancelHandler(args: CancelEvent): void {
    // close the editor for the given row
    this.closeEditor(args.sender, args.rowIndex);
  }
  private closeEditor(grid: GridComponent, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = null;
  }
}
