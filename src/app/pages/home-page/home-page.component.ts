import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import 'rxjs/add/operator/map';
import { Column } from '../../ui-compenents/datagrid/model/column';
import { MessageService } from "../../services/message.service";
import { SharedService } from '../../services/shared.service';
import { Alert } from '../../ui-compenents/alert/alert.model';
import { error } from 'util';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  providers: [MessageService]
})
export class HomePageComponent implements AfterViewInit {
  posts: any[];
  columns: Column[];
  postData: any[];
  isLoading: boolean = false;
  //username: string;
  addMessageEnabled: boolean;
  message: string;

  @ViewChild('postGrid') postGridEl: ElementRef;

  constructor(private http: HttpClient, private messageService: MessageService, private sharedService: SharedService) { }

  ngOnInit() {

  }


  ngAfterViewInit() {
    this.getPosts().subscribe(r => this.posts = r);
  }

  /*onChange(value: any): void {
    //console.log(value);
    //console.log(this.username);
    this.getUserPosts(value);

  }*/

  getPosts() {
    return this.http.get<any[]>('https://jsonplaceholder.typicode.com/users').map(x => x);
  }

  /*getSelectedPostGridItem($event) {
    this.username = $event.title;

  }*/

  /*getUserPosts(userId: any): void {
    this.columns = [
      { Name: "UserID", Value: "userId" },
      { Name: "ID", Value: "id" },
      { Name: "Title", Value: "title" },
      { Name: "Body", Value: "body" }
    ];

    this.isLoading = true;
    var userPosts = this.http.get<any[]>('https://jsonplaceholder.typicode.com/posts?userId=' + userId).map(x => x);
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
  }*/

  saveMessage(message: string) {
    this.addMessageEnabled = true;
    this.messageService.insertMessage(message).then(() => {
      //console.log("asdsa");
      this.addMessageEnabled = false;
      this.message = "";
      this.sharedService.showAlert(new Alert("Yazınız kaydedilmiştir..", 8000, "alert-success"));
    }, error => {
      this.sharedService.showAlert(new Alert("Hata oluştu: " + error, 8000, "alert-danger"));
    });/*.catch(reject => {
      this.addMessageEnabled = false;
      this.sharedService.showAlert(new Alert("Hata oluştu: " + reject.code, 8000, "alert-danger"));
      console.log(reject.code);
    });*/
  }

  ngOnDestroy() {
    this.sharedService.disposeClass(HomePageComponent.name);
  }
}