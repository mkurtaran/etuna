import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Message } from './message.model';
import { HttpClient } from "@angular/common/http";
import { AuthService } from "./auth.service";
import 'rxjs/add/operator/map';

@Injectable()
export class MessageService {
  //messageDbPath: string = "Messages/";

  constructor(private db: AngularFireDatabase, private authService: AuthService) { }

  getMessages(uid: string) {
    return this.db.list(this.getPath(uid), ref => ref.orderByChild("userUid").equalTo(uid));
  }

  getMessagesWithPaging(uid: string, offset: number, startKey?) {

    if (startKey == null) {
      return this.db.list(this.getPath(uid), ref => ref.orderByChild("createDate").limitToFirst(offset + 1));
    } else {
      return this.db.list(this.getPath(uid), ref => ref.orderByChild("createDate").startAt(startKey).limitToFirst(offset + 1));
    }
  }

  insertMessage(msg: string) {
    let message = new Message();
    message.createDate = Date.now();
    message.updateDate = Date.now();
    message.userUid = this.authService.userDetails.uid;
    message.message = msg;
    //message.key = "";

    //return this.db.object(this.messageDbPath + message.key).set(message);
    return this.db.list(this.getPath(message.userUid)).push(message);

    /*.then(() => {
      console.log("Message added!");
      return true;
    })
    .catch(reject => {
      console.log(reject.code);
      return false;
    });*/
  }

  updateMessage(key: string, msg: Message) {
    return this.db.list(this.getPath(msg.userUid)).update(key, msg);
  }

  deleteMessage(key: string, msg: Message) {
    return this.db.list(this.getPath(msg.userUid)).remove(key);
  }

  getPath(userId: string) {
    return "/Messages/" + userId;
  }




}
