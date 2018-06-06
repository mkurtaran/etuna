import { Injectable, EventEmitter } from '@angular/core';
import { Router } from "@angular/router";
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { SharedService } from './shared.service';

@Injectable()
export class AuthService {
  private user: Observable<firebase.User>;
  public userDetails: firebase.User = null;
  public callBackUserInfo$: EventEmitter<any> = new EventEmitter();

  constructor(private fauth: AngularFireAuth, private router: Router, private sharedService: SharedService) {
    this.fauth.auth.languageCode = "tr_TR";
    this.doLoginOperations();
  }


  doLoginOperations() {
    this.user = this.fauth.authState;
    this.sharedService.mySubscribe(AuthService.name,
      this.user,
      ((user) => {
        if (user) {
          this.userDetails = user;
          this.callBackUserInfo$.emit(this.userDetails);
        }
        else {
          this.userDetails = null;
          this.callBackUserInfo$.emit(null);
        }
      }
      ));
  }

  signInWithTwitter() {
    return this.fauth.auth.signInWithPopup(
      new firebase.auth.TwitterAuthProvider()
    )
  }

  signInWithFacebook() {
    var provider = new firebase.auth.FacebookAuthProvider();
    //provider.addScope('user_hometown');
    return this.fauth.auth.signInWithPopup(provider);
  }

  signInWithGoogle() {
    return this.fauth.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    )
  }

  isLoggedIn() {
    if (this.userDetails == null) {
      return false;
    } else {
      return true;
    }
  }



  ngOnDestroy() {

  }

  logout() {
    //console.log(this.sharedService.subscriptions);
    this.sharedService.forceDispose();
    this.fauth.auth.signOut();
  }

}

