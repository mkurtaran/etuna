import { Component, OnInit } from '@angular/core';
import { MessageService } from "../../services/message.service";
import { AuthService } from "../../services/auth.service";
import { Message } from '../../services/message.model';
import * as Arr from "lodash";
import { SharedService } from '../../services/shared.service';
import { Alert } from '../../ui-compenents/alert/alert.model';
import { DatePipe } from '@angular/common';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-message-page',
  templateUrl: './message-page.component.html',
  styleUrls: ['./message-page.component.css'],
  providers: [MessageService, DatePipe]
})
export class MessagePageComponent implements OnInit {
  messageList: any;
  loading: boolean;

  pagingKey: string = "createDate";
  pageSize: number = 5;
  nextKey: string;
  prevKeys: any[] = [];

  selectedMessage: Message = new Message();
  selectedMessageKey: string;

  showWarn: boolean = false;
  warningMessage: string;

  constructor(private messageService: MessageService, private authService: AuthService, private sharedService: SharedService, private datePipe: DatePipe, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit() {

    this.getMessages();

  }

  getMessages() {
    this.sharedService.mySubscribe(MessagePageComponent.name,
      this.activatedRoute.params,
      param => {
        let uid: string;

        if (param != null && param.uid != null) {
          uid = param.uid;
          this.getMessagesByPaging(uid);
        }
        else {
          if (this.authService.isLoggedIn()) {
            uid = this.authService.userDetails.uid;
            this.getMessagesByPaging(uid);
          }
          else {
            this.sharedService.mySubscribe(MessagePageComponent.name,
              this.authService.callBackUserInfo$,
              user => {
                uid = user.uid;
                this.getMessagesByPaging(uid);
              }
            );
          }
        }
      });
  }

  getMessagesByPaging(uid: string, startKey?) {
    this.loading = true;

    this.sharedService.mySubscribe(MessagePageComponent.name,
      this.messageService.getMessagesWithPaging(uid, this.pageSize, startKey).snapshotChanges()
        .map(ref => {
          return ref.map(record => {
            let data = record.payload.val();
            data["parentKey"] = record.key;
            return data;
          })
        }), (r => {
          //console.log(r);
          this.messageList = Arr.slice(r, 0, this.pageSize);
          this.nextKey = Arr.get(r[this.pageSize], this.pagingKey);
          //console.log(this.nextKey);
          this.loading = false;

          if (this.messageList.length == 0) {
            this.showWarningMessage("Görüntülenecek yazı bulunamadı!");
          }
        })
    );

  }

  getSelectedMessageForUpdate(message: any) {
    this.selectedMessage = message;
    this.selectedMessageKey = message.parentKey;
    console.log(message);
  }

  updateMessage() {
    this.messageService.updateMessage(this.selectedMessageKey, this.selectedMessage).then(resolve => {
      //console.log(resolve);
      this.sharedService.showAlert(new Alert("Yazınız güncellenmiştir", 8000, "alert-success"));
    }, reject => {
      //console.log(reject.code);
      this.sharedService.showAlert(new Alert("Hata : " + reject.code, 8000, "alert-danger"));
    })
      .catch(reject => {
        //console.log(reject.code);
        this.sharedService.showAlert(new Alert("Hata : " + reject.code, 8000, "alert-danger"));
      });
  }

  deleteMessage(msg: any) {
    this.loading = true;
    this.messageService.deleteMessage(msg.parentKey, msg)
      .then(resolve => {
        this.sharedService.showAlert(new Alert(this.datePipe.transform(msg.createDate, 'dd/MM/y hh:mm') + " tarihli yazınız silinmiştir", 8000, "alert-success"));
        this.loading = false;
        //console.log(resolve);
      }, reject => {
        this.sharedService.showAlert(new Alert("Hata : " + reject.code, 8000, "alert-danger"));
        this.loading = false;
        //console.log(reject.code);
      })
      .catch(reject => {
        this.sharedService.showAlert(new Alert("Hata : " + reject.code, 8000, "alert-danger"));
        this.loading = false;
        //console.log(reject.code);
      });

    return false;
  }

  nextPage() {
    this.prevKeys.push(Arr.first(this.messageList)[this.pagingKey]); // set current key as pointer for previous page
    console.log(this.prevKeys);
    this.getMessagesByPaging(this.authService.userDetails.uid, this.nextKey);

    //this.getMessagesByPaging()
    //this.onCallBackMethod.emit({ uid: this.nextKey, pageSize: this.pageSize, pagingKey: this.pagingKey });
  }

  prevPage() {
    const prevKey = Arr.last(this.prevKeys); // use last key in array
    this.prevKeys = Arr.dropRight(this.prevKeys); // then remove the last key in the array
    console.log(prevKey);
    this.getMessagesByPaging(this.authService.userDetails.uid, prevKey);
    //this.onCallBackMethod.emit({ uid: prevKey, pageSize: this.pageSize, pagingKey: this.pagingKey });
  }

  getMessagedByUid(uid: string) {
    this.loading = true;

    this.sharedService.mySubscribe(MessagePageComponent.name,
      this.messageService.getMessages(this.authService.userDetails.uid).snapshotChanges()
        .map(ref => { return ref.map(record => record.payload.val()) })
      , (r => {
        this.messageList = r;
        this.loading = false;
      })
    );
  }


  ngOnDestroy() {
    this.sharedService.disposeClass(MessagePageComponent.name);
  }

  showWarningMessage(msg: string) {
    this.warningMessage = msg;
    this.showWarn = true;
  }

  getLiveTime(startDate: number, endDate: number) {
    //2017-04-01T14:20:00.000Z
    if (endDate == 0) {
      endDate = new Date().getTime();
    }

    let bTstap = (endDate - startDate);
    let liveDays = Math.round(bTstap / (24 * 60 * 60 * 1000));
    let year = 0;
    let month = 0;
    let day = 0;
    let str = "";

    if (liveDays >= 365) {
      year = Math.floor(liveDays / 365);
      liveDays = liveDays % 365;
      str += year + " yıl ";
    }

    if (liveDays >= 30) {
      month = Math.floor(liveDays / 30);
      liveDays = liveDays % 30;
      str += month + " ay ";
    }

    if (liveDays > 0) {
      day = Math.floor(liveDays);
      str += day + " gün ";
    }

    if (str != "") {
      str += " önce yazıldı"
    } else {
      str = "Bugün yazıldı"
    }

    return str;
  }

}
