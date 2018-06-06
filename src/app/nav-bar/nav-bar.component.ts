import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { UserService } from "../services/user.service";
import { SharedService } from '../services/shared.service';
import { User } from '../services/user.model';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
  providers: [UserService]
})
export class NavBarComponent implements OnInit {
  logoutLink?: string;
  isAdmin: boolean = false;
  isAdminLoadingShow: boolean = true;
  isLoggedInLoadingShow: boolean = true;
  isLoggedIn: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private sharedService: SharedService) {

    if (this.authService.callBackUserInfo$ != null) {

      this.sharedService.mySubscribe(NavBarComponent.name,
        this.authService.callBackUserInfo$,
        (user => {
          this.isAdminLoadingShow = true;
          this.isLoggedInLoadingShow = true;
          this.isLoggedIn = this.authService.isLoggedIn();

          if (this.isLoggedIn) {
            this.logoutLink = "[" + user.displayName + "] Çıkış Yap";

            var currentUser = new User();
            currentUser.displayName = user.displayName;
            currentUser.email = user.email;
            currentUser.emailVerified = user.emailVerified;
            currentUser.isAnonymous = user.isAnonymous;
            currentUser.phoneNumber = user.phoneNumber;
            currentUser.photoURL = user.photoURL;
            currentUser.providerId = user.providerId;
            currentUser.uid = user.uid;

            console.log("currentUser");
            console.log(currentUser);

            this.userService.registerUser(currentUser);

            this.sharedService.mySubscribe(NavBarComponent.name,
              this.userService.isUserAdmin(user.uid),
              (ref => {
                this.isAdmin = ref.payload.exists();
                this.isAdminLoadingShow = false;
              })
            );

            this.isLoggedInLoadingShow = false;
          } else {
            this.isAdminLoadingShow = false;
            this.isLoggedInLoadingShow = false;
          }
        })
      );

    }

  }

  ngOnDestroy() {
    this.sharedService.disposeClass(NavBarComponent.name);
  }

  ngOnInit() {
  }

  signInWithFacebook() {
    this.isAdminLoadingShow = true;
    this.isLoggedInLoadingShow = true;

    this.authService.signInWithFacebook()
      .then((res) => {
        //this.router.navigate(['']);
        //this.authService.doLoginOperations();
        this.isAdminLoadingShow = false;
        this.isLoggedInLoadingShow = false;
        console.log(res);
      })
      .catch((err) => {
        this.isAdminLoadingShow = false;
        this.isLoggedInLoadingShow = false;
        console.log(err);
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['']);
    this.isLoggedIn = false;
  }


}
