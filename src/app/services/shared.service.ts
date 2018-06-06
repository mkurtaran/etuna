import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Router } from "@angular/router";

export class MySubscription {
  subscription: Subscription;
  name: string;
}

@Injectable()
export class SharedService {
  subscriptions: MySubscription[] = [];

  constructor(private router: Router) {
  }

  // Observable string sources
  private emitChangeSource = new Subject<any>();

  // Observable string streams
  changeEmitted$ = this.emitChangeSource.asObservable();

  // Service message commands
  showAlert(change: any) {
    this.emitChangeSource.next(change);
  }

  forceDispose() {
    this.subscriptions.forEach(sub => sub.subscription.unsubscribe());
  }

  disposeClass(className: string) {
    this.subscriptions.filter(r => r.name == className).forEach(sub => sub.subscription.unsubscribe());
    this.subscriptions = this.subscriptions.filter(r => r.name != className);
  }

  mySubscribe(className: string, q: Observable<any>, next?, error?, complete?): Subscription {
    //this.disposeOldSub(className);
    let res = q.subscribe(next, error, complete);
    this.subscriptions.push({
      subscription: res,
      name: className
    });

    //console.log(this.subscriptions);
    return res;
  }

}
