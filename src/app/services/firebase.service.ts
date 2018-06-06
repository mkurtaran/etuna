import { Injectable, EventEmitter } from '@angular/core';
import { AngularFireDatabase, QueryFn, AngularFireList, AngularFireObject, AngularFireAction } from 'angularfire2/database';
import { HttpClient } from "@angular/common/http";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase/app';


@Injectable()
export class FirebaseService {

  public serviceCallBack$ = new EventEmitter();
  responses = [];
  subscriptions: any[] = [];

  constructor(private db: AngularFireDatabase) { }

  list<T>(pathOrRef: string, queryFn?: QueryFn): any[] {
    let result = [];

    this.subscriptions.push(this.db.list(pathOrRef, queryFn).snapshotChanges()
      .map(ref => {
        return ref.map(record => {
          let data = record.payload.val();
          let key = record.key;

          if (record.payload.hasChildren()) {
            result = data;
            result["_key"] = key;
            return result;
          } else {
            let row = {};
            row[record.payload.key] = data;
            return row;
          }
        });
      })
      .subscribe(response => {
        this.responses[pathOrRef] = response;
        this.serviceCallBack$.emit(this.responses);
      },
        error => {
          console.log(error);
        }));

    return null;
  };

  object<T>(pathOrRef: string): AngularFireObject<T> {
    return this.db.object(pathOrRef);
  }

  dispose() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
  }

  ngOnDestroy() {
    this.responses = [];
    this.dispose();
  }

}
