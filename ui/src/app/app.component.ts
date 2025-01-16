import { Component, Inject } from '@angular/core';
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
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Student Management';
  public gridData: any[] = [
    {
      id: 4,
      name: 'John Doe',
      age: 28,
      email: 'john.doe@example.com',
      gender: 'Male',
      address: '123 Main Street, New York',
      mobileNo: '0123456789',
      dob: '1997-02-07',
    },
    {
      id: 5,
      name: 'Sara Smith',
      age: 30,
      email: 'sara@example.com',
      gender: 'Female',
      address: 'No.45, street, Colombo',
      mobileNo: '0771234567',
      dob: '1995-06-15',
    },
  ];
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
