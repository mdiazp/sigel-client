import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';

import {
  MAT_DIALOG_DEFAULT_OPTIONS,
} from '@angular/material';

import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MAT_NATIVE_DATE_FORMATS,
  NativeDateAdapter,
} from '@angular/material/core';

import {
  SessionService,
  StorageService,
  ApiService,
  ErrorHandlerService
} from '@app/services/core';

import {
  AuthGuard,
  AdminGuard,
} from '@app/guards/core';

import { AppMaterialModule } from '@app/app-material';
import { AppComponent } from '@app/app.component';
import { LoginComponent } from '@app/views/+login/login/login.component';
import { ProfileComponent } from '@app/views/+profile/profile/profile.component';
import { Error404Component } from '@app/views/+errors/error404/error404.component';
import { LayoutComponent } from '@app/views/layout/layout.component';
import { HomeComponent } from '@app/views/+home/home/home.component';
import { AdminComponent } from '@app/views/+admin/admin/admin.component';
import { ReservationsComponent } from '@app/views/+reservations/reservations/reservations.component';
import { LocalProfileComponent } from './views/LocalCommon/local-profile/local-profile.component';
import { LocalFormComponent } from './views/LocalCommon/local-form/local-form.component';
import { LocalAdminsComponent } from './views/LocalCommon/local-admins/local-admins.component';
import { AdminLocalOneComponent } from './views/+admin/Local/admin-local-one/admin-local-one.component';
import { AdminLocalListComponent } from './views/+admin/Local/admin-local-list/admin-local-list.component';
import { LocalNewDialogComponent } from './views/+admin/Local/local-new-dialog/local-new-dialog.component';
import { AdminAreaListComponent } from './views/+admin/Area/admin-area-list/admin-area-list.component';
import { AreaNewDialogComponent } from './views/+admin/Area/area-new-dialog/area-new-dialog.component';
import { AdminAreaOneComponent } from './views/+admin/Area/admin-area-one/admin-area-one.component';
import { AreaProfileComponent } from './views/AreaCommon/area-profile/area-profile.component';
import { AreaFormComponent } from './views/AreaCommon/area-form/area-form.component';
import { AdminReservationListComponent } from './views/+admin/Reservation/admin-reservation-list/admin-reservation-list.component';
import { AdminUserListComponent } from './views/+admin/User/admin-user-list/admin-user-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'reservations',
    component: ReservationsComponent
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/users',
    component: AdminUserListComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/areas',
    component: AdminAreaListComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/area/:id',
    component: AdminAreaOneComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/locals',
    component: AdminLocalListComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/local/:id',
    component: AdminLocalOneComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/reservations',
    component: AdminReservationListComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'test/admin/local/:id',
    component: AdminLocalOneComponent,
    canActivate: [AdminGuard]
  },
  {
    path: '**',
    component: Error404Component
  },
];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    RouterModule.forRoot(routes, { useHash: true }),
    HttpModule,
    ReactiveFormsModule,

    AppMaterialModule,
  ],
  declarations: [
    AppComponent,
    LayoutComponent,
    HomeComponent,
    AdminComponent,
    LoginComponent,
    ProfileComponent,
    Error404Component,
    ReservationsComponent,
    LocalProfileComponent,
    LocalFormComponent,
    LocalAdminsComponent,
    AdminLocalOneComponent,
    AdminLocalListComponent,
    LocalNewDialogComponent,
    AdminAreaListComponent,
    AreaNewDialogComponent,
    AdminAreaOneComponent,
    AreaProfileComponent,
    AreaFormComponent,
    AdminUserListComponent,
    AdminReservationListComponent,
  ],
  providers: [
    StorageService,
    SessionService,
    ApiService,
    ErrorHandlerService,

    AuthGuard,
    AdminGuard,

    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}},

    {provide: MAT_DATE_LOCALE, useValue: 'es-SP'},
    // {provide: DateAdapter, useClass: NativeDateAdapter, deps: [MAT_DATE_LOCALE]},
    // {provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS},
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    LocalNewDialogComponent,
    AreaNewDialogComponent,
  ],
})
export class AppModule { }
