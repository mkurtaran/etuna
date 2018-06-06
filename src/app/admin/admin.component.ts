import { Component, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import 'rxjs/add/operator/map';
import { Column } from '../ui-compenents/datagrid/model/column';
import { DatagridComponent } from '../ui-compenents/datagrid/datagrid.component';

import { Observable } from 'rxjs/Observable';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

import { AngularFireList } from 'angularfire2/database'
import * as Arr from "lodash";
import { error } from 'util';
import 'rxjs/add/operator/map';

import { SharedService } from '../services/shared.service';
import { Alert } from '../ui-compenents/alert/alert.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  providers: [UserService]
})

export class AdminPageComponent implements AfterViewInit {

  columns: Column[];
  postData: any[];
  isLoading: boolean = false;

  name: string = "";
  surname: string = "";

  userGridColumns: Column[];
  userGridData: any[];

  showUserArea: boolean = false;

  @ViewChild('userGrid') userGrid: DatagridComponent;

  constructor(private http: HttpClient,
    private userService: UserService,
    private cdRef: ChangeDetectorRef,
    private authService: AuthService,
    private sharedService: SharedService,
    private router: Router) {

    this.userGridColumns = [
      { Name: "Ad Soyad", Value: "displayName" },
      { Name: "Email", Value: "email", IsEditable: true },
      { Name: "Kayıt Tarihi", Value: "createDate", IsDate: true },
      { Name: "Değişiklik Tarihi", Value: "updateDate", IsDate: true }
      //{ Name: "isAnonymous", Value: "isAnonymous" },
      //{ Name: "phoneNumber", Value: "phoneNumber" },
      //{ Name: "photoURL", Value: "photoURL" },
      //{ Name: "providerId", Value: "providerId" }
    ];
  }

  getUsers($event) {
    this.userGrid.loading = true;


    this.sharedService.mySubscribe(AdminPageComponent.name,
      this.userService.getUsersWithPaging($event.pageSize, $event.uid).snapshotChanges()
        .map(ref => {
          return ref.map(record => record.payload.val())
        }),
      (userListArr => {
        //console.log(userListArr);
        this.userGridData = Arr.slice(userListArr, 0, $event.pageSize);
        this.userGrid.nextKey = Arr.get(userListArr[$event.pageSize], $event.pagingKey);
        this.userGrid.loading = false;
      }));

    //return this.userGridData;
  }

  updateUser($event) {
    this.userService.updateUser($event);
    console.log($event);
  }

  deleteUser($event) {
    this.userService.deleteUser($event.uid);
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    //this.sharedService.showAlert(new Alert("Deneme"));
  }

  ngOnDestroy() {
    this.sharedService.disposeClass(AdminPageComponent.name);
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  selectUser($event) {
    this.showUserArea = true;
    //var $: any;
    //$("#exampleModal").modal('show');
    //console.log($event);
    this.router.navigate(['Messages', $event.uid]);
  }

  getUserTodoList() {
    this.columns = [
      { Name: "UserID", Value: "userId" },
      { Name: "ID", Value: "id" },
      { Name: "Title", Value: "title" },
      { Name: "Completed", Value: "completed" }
    ];

    this.isLoading = true;
    var userPosts = this.http.get<any[]>('https://jsonplaceholder.typicode.com/todos').map(x => x);

    userPosts.subscribe(
      val => {
        this.postData = val;
      },
      error => {
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }

}
