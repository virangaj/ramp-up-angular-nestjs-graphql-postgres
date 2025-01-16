import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  AddEvent,
  CancelEvent,
  CreateFormGroupArgs,
  EditEvent,
  GridComponent,
  GridDataResult,
  PagerPosition,
  PagerType,
  RemoveEvent,
  SaveEvent,
} from '@progress/kendo-angular-grid';
// import { State } from './models';
import { process, State } from '@progress/kendo-data-query';
import { CreateStudent } from './models';
import { map, Observable, Subscription } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { GET_ALL_STUDENT } from './graphql.operations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  loading: boolean = true;
  public gridData: any[] = [];

  private querySubscription: Subscription;
  constructor(private readonly apollo: Apollo) {}

  ngOnInit() {
    this.querySubscription = this.apollo
      .watchQuery<any>({
        query: GET_ALL_STUDENT,
      })
      .valueChanges.subscribe(({ data, loading }) => {
        console.log(loading);
        this.loading = loading;
        this.gridData = data.getAllStudent;
      });
  }
  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }
  title = 'Student Management';

  public type: PagerType = 'numeric';
  public buttonCount = 5;
  public info = true;
  public pageSizes = [2, 5, 10, 20];
  public previousNext = true;
  public position: PagerPosition = 'bottom';
  private editedRowIndex: number | undefined = undefined;
  public pageSize = 5;
  public skip = 0;
  public formGroup!: FormGroup | any;
  public gridState: any = {
    sort: [],
    skip: 0,
    take: 5,
  };
  public view: Observable<GridDataResult> | undefined;

  public onStateChange(state: State): void {
    console.log('onStateChange : ', state);

    this.gridState = {
      ...state,
      skip: state.skip ?? 0,
      take: state.take ?? 5,
    };

    // this.editService.read();
  }

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
    args.sender.editRow(args.rowIndex, this.formGroup);
    console.log('editHandler : ', args);
    console.log('this.editedRowIndex : ', this.editedRowIndex);
  }
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
    console.log('addHandler : ', args);
  }
  public saveHandler({ sender, rowIndex, formGroup, isNew }: SaveEvent): void {
    const student: CreateStudent[] = formGroup.value;

    // this.editService.save(product, isNew);
    sender.closeRow(rowIndex);
    console.log('saveHandler : ', student);
  }
  public removeHandler(args: RemoveEvent): void {
    // remove the current dataItem from the current data source,
    // `editService` in this example
    // this.editService.remove(args.dataItem);
    console.log('removeHandler : ', args);
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
