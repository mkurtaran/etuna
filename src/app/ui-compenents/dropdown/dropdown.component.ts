import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';



@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent implements OnInit {

  @Input() data: any[];
  @Input() dataKey: string;
  @Input() dataValue: string;
  @Input() width: string;

  @Output() change: EventEmitter<any> = new EventEmitter();

  selectedText: string;
  selectedValue: string;

  constructor() {
  }

  selectItem(value, text) {
    this.change.emit(value);
    this.selectedText = text;
    this.selectedValue = value;
    //console.log(value);
  }

  ngOnInit() {
    this.selectedText = "Seçiniz";

    //console.log(this.key);
    //console.log(this.data);
    //console.log(this.width);
  }

}
