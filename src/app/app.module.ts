import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { HeaderInterceptor } from './app.http.headerInterceptor'
import { ResponseInterceptor } from './app.http.responseInterceptor'

import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { AdminPageComponent } from './admin/admin.component';
import { DropdownComponent } from './ui-compenents/dropdown/dropdown.component';
import { DatagridComponent } from './ui-compenents/datagrid/datagrid.component';

import { AngularFireModule } from 'angularfire2';
import { FirebaseConfig } from '../environments/firebase.config';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { LoadingspinnerComponent } from './ui-compenents/loadingspinner/loadingspinner.component';

import { AuthService } from './services/auth.service';
import { AlertComponent } from './ui-compenents/alert/alert.component';
import { SharedService } from './services/shared.service';
import { FirebaseService } from './services/firebase.service';
import { MessagePageComponent } from './pages/message-page/message-page.component';
import { HtmlPipe } from './pipes/html.pipe';

const appRoutes: Routes = [
  {
    path: '', component: HomePageComponent
  },
  {
    path: 'Admin', component: AdminPageComponent
  },
  {
    path: 'Messages', component: MessagePageComponent
  },
  {
    path: 'Messages/:uid', component: MessagePageComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HomePageComponent,
    AdminPageComponent,
    DropdownComponent,
    DatagridComponent,
    LoadingspinnerComponent,
    AlertComponent,
    MessagePageComponent,
    HtmlPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    RouterModule.forRoot(appRoutes, { enableTracing: false }),
    FormsModule,
    AngularFireModule.initializeApp(FirebaseConfig.firebase, 'angular-auth-firebase'),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    AngularFireDatabaseModule
  ],
  providers: [AuthService, SharedService, FirebaseService,
    { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
