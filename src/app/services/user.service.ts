import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { User } from './user.model';
import { HttpClient } from "@angular/common/http";
//import * as firebase from 'firebase/app';
import 'rxjs/add/operator/map';
import { Server } from 'selenium-webdriver/safari';
//import { FirebaseService } from './firebase.service';
import { SharedService } from './shared.service';

@Injectable()
export class UserService {
  userList: any;
  responseList: any[];
  isAdmin: boolean = false;

  userDbPath: string = "Users/";
  adminDbPath: string = "Admin/";

  constructor(private db: AngularFireDatabase, private sharedService: SharedService) {

  }

  ngOnDestroy() {
    this.sharedService.disposeClass(UserService.name);
  }

  getUsersWithPaging(offset, startKey?) {
    //console.log("getUsersWithPaging");
    if (startKey == null) {
      this.userList = this.db.list(this.userDbPath, ref => ref.orderByKey().limitToFirst(offset + 1));
    } else {
      this.userList = this.db.list(this.userDbPath, ref => ref.orderByKey().startAt(startKey).limitToFirst(offset + 1));
    }

    return this.userList;
  }

  isUserAdmin(authId: string) {
    //console.log("isUserAdmin");
    return this.db.object(this.adminDbPath + authId).snapshotChanges();
  }

  registerUser(user: User) {

    this.sharedService.mySubscribe(UserService.name,
      this.db.object(this.userDbPath + user.uid).snapshotChanges(),
      (ref => {
        let isUserExist = ref.payload.exists();

        if (!isUserExist) {
          user.createDate = Date.now();
          user.updateDate = Date.now();
          this.db.object(this.userDbPath + user.uid).set(user);
        }
      })
    );

  }

  updateUser(user: User) {
    //console.log("updateUser");
    user.updateDate = Date.now();

    this.db.list(this.userDbPath).update(user.uid, user).then(resolve => {
      console.log(resolve);
    }, reject => {
      console.log(reject.code);
    })
      .catch(reject => {
        console.log(reject.code);
      });


  }

  deleteUser(uid: string) {
    //console.log("deleteUser");
    this.db.list(this.userDbPath).remove(uid).then(resolve => {
      console.log(resolve);
    }, reject => {
      console.log(reject.code);
    })
      .catch(reject => {
        console.log(reject.code);
      });
  }

}
