import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Column } from './model/column';
import * as Arr from "lodash";

@Component({
  selector: 'app-datagrid',
  templateUrl: './datagrid.component.html',
  styleUrls: ['./datagrid.component.css']
})
export class DatagridComponent implements OnInit {

  @Input() columns: Column[];
  @Input() data: any[];
  @Input() loading: boolean = false;
  selectedItem: any;
  @Output() onSelectItem: EventEmitter<any> = new EventEmitter();

  /*Update*/
  @Input() hasUpdate: boolean = false;
  @Input() hasDelete: boolean = false;
  updateRow: boolean[] = [];
  deleteRow: boolean[] = [];
  @Output() onUpdateCallBackMethod: EventEmitter<any> = new EventEmitter();
  @Output() onDeleteCallBackMethod: EventEmitter<any> = new EventEmitter();
  /*Update*/

  /*Pagination*/
  @Input() hasPaging = false;
  @Input() pageSize: number = 1;
  @Input() pagingKey = "uid";
  @Input() nextKey: any; // for next button
  prevKeys: any[] = []; // for prev button
  @Output() onCallBackMethod: EventEmitter<any> = new EventEmitter();
  @Input() pagingData: any[];
  /*Pagination*/

  @Input() modalName: string;

  constructor() {

  }

  ngOnInit() {
    if (this.hasPaging) {
      this.bindGrid();
    }

    for (let i: number = 0; i < this.pageSize; i++) {
      this.updateRow[i] = false;
      this.deleteRow[i] = false;
    }

  }

  bindGrid() {
    this.onCallBackMethod.emit({ uid: null, pageSize: this.pageSize, pagingKey: this.pagingKey });
  }

  selectGridItem(selectedRow) {
    this.selectedItem = selectedRow;
    this.onSelectItem.emit(selectedRow);
    console.log("SelectedRow");
    console.log(this.selectedItem);
  }

  updateItem(updatedRow) {
    //console.log(updatedRow);
    this.onUpdateCallBackMethod.emit(updatedRow);
  }

  deleteItem(deletedRow) {
    this.onDeleteCallBackMethod.emit(deletedRow);
  }

  nextPage() {

    this.prevKeys.push(Arr.first(this.data)[this.pagingKey]); // set current key as pointer for previous page
    console.log(this.prevKeys);
    this.onCallBackMethod.emit({ uid: this.nextKey, pageSize: this.pageSize, pagingKey: this.pagingKey });
  }

  prevPage() {
    const prevKey = Arr.last(this.prevKeys); // use last key in array
    this.prevKeys = Arr.dropRight(this.prevKeys); // then remove the last key in the array
    console.log(prevKey);
    this.onCallBackMethod.emit({ uid: prevKey, pageSize: this.pageSize, pagingKey: this.pagingKey });
  }

}
