import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

import {
  MAT_DIALOG_DEFAULT_OPTIONS, MatPaginatorIntl,
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
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
  ErrorHandlerService,
  FeedbackHandlerService,
  NotificationsService,
} from '@app/services/core';

import {
  AuthGuard,
  AdminGuard,
  SuperadminGuard,
} from '@app/guards/core';

import { AppMaterialModule } from '@app/app-material';
import { AppComponent } from '@app/app.component';
import { LoginComponent } from '@app/views/+login/login/login.component';
import { LayoutComponent } from '@app/views/layout/layout.component';
import { LocalAdminsComponent } from './views/+locals/local-admins/local-admins.component';
import { LocalProfileComponent } from './views/+locals/local-profile/local-profile.component';
import { LocalListComponent } from './views/+locals/local-list/local-list.component';
import { LocalDashboardComponent } from './views/+locals/local-dashboard/local-dashboard.component';
import { LocalFormComponent } from './views/+locals/local-form/local-form.component';
import { LocalNewDialogComponent } from './views/+locals/local-new-dialog/local-new-dialog.component';
import { LocalsFilterFormComponent } from './views/+locals/locals-filter-form/locals-filter-form.component';
import { AreaFormComponent } from './views/+areas/area-form/area-form.component';
import { UserProfileComponent } from './views/+users/user-profile/user-profile.component';
import { ReservationAllComponent } from './views/+reservations/reservation-all/reservation-all.component';
import { ReservationOneComponent } from './views/+reservations/reservation-one/reservation-one.component';
import { ReservationsFilterComponent } from './views/+reservations/common/reservations-filter/reservations-filter.component';
import { ReservationFormComponent } from './views/+reservations/common/reservation-form/reservation-form.component';
import { ReservationProfileComponent } from './views/+reservations/common/reservation-profile/reservation-profile.component';
import { CustomMatPaginatorIntl } from '@app/views/common/CustomMatPaginatorIntl';
import { CustomSnackbarComponent } from './shared/custom-snackbar/custom-snackbar.component';
import {
  PublicReservationsDashboardComponent
} from './views/+public-reservations/public-reservations-dashboard/public-reservations-dashboard.component';
import {
  PublicReservationsOfDayComponent
} from './views/+public-reservations/public-reservations-of-day/public-reservations-of-day.component';
import { PublicReserveDialogComponent } from './views/+public-reservations/public-reserve-dialog/public-reserve-dialog.component';
import {
  PublicReservationDetailsDialogComponent
} from './views/+public-reservations/public-reservation-details-dialog/public-reservation-details-dialog.component';
import {
  PublicLocalDetailsDialogComponent
} from './views/+public-reservations/public-local-details-dialog/public-local-details-dialog.component';
import { SessionDashboardComponent } from './views/+session/session-dashboard/session-dashboard.component';
import { SessionNotificationsComponent } from './views/+session/session-notifications/session-notifications.component';
import { SessionProfileComponent } from './views/+session/session-profile/session-profile.component';
import { SessionReservationsComponent } from '@app/views/+session/session-reservations/session-reservations.component';
import { EditProfileDialogComponent } from './views/+session/edit-profile-dialog/edit-profile-dialog.component';
import { InfoDialogComponent } from './shared/info-dialog/info-dialog.component';
import { SessionNotificationsMenuComponent } from './views/+session/session-notifications-menu/session-notifications-menu.component';
import { CheckDeleteDialogComponent } from './shared/check-delete-dialog/check-delete-dialog.component';
import { AreaListComponent } from './views/+areas/area-list/area-list.component';
import { AreaNewDialogComponent } from './views/+areas/area-new-dialog/area-new-dialog.component';
import { AreasFilterFormComponent } from './views/+areas/areas-filter-form/areas-filter-form.component';
import { AreaDashboardComponent } from './views/+areas/area-dashboard/area-dashboard.component';
import { AreaProfileComponent } from './views/+areas/area-profile/area-profile.component';
import { UserListComponent } from './views/+users/user-list/user-list.component';
import { UsersFilterFormComponent } from './views/+users/users-filter-form/users-filter-form.component';
import { UserDashboardComponent } from './views/+users/user-dashboard/user-dashboard.component';
import { UserFormComponent } from './views/+users/user-form/user-form.component';
/*
import {
  AmazingTimePickerModule
} from 'amazing-time-picker';
*/

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'reserve',
  },
  {
    path: 'reserve',
    component: PublicReservationsDashboardComponent,
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'session',
    pathMatch: 'full',
    redirectTo: 'session/0',
  },
  {
    path: 'session/:tab',
    component: SessionDashboardComponent,
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
  },
  {
    path: 'users',
    component: UserListComponent,
    canActivate: [SuperadminGuard],
    canLoad: [SuperadminGuard]
  },
  {
    path: 'users/:id',
    pathMatch: 'full',
    redirectTo: 'users/:id/profile'
  },
  {
    path: 'users/:id/:tab',
    component: UserDashboardComponent,
    canActivate: [SuperadminGuard],
    canLoad: [SuperadminGuard]
  },
  {
    path: 'areas',
    component: AreaListComponent,
    canActivate: [SuperadminGuard],
    canLoad: [SuperadminGuard]
  },
  {
    path: 'areas/:id',
    pathMatch: 'full',
    redirectTo: 'areas/:id/profile'
  },
  {
    path: 'areas/:id/:tab',
    component: AreaDashboardComponent,
    canActivate: [SuperadminGuard],
    canLoad: [SuperadminGuard]
  },
  {
    path: 'locals',
    component: LocalListComponent,
    canActivate: [SuperadminGuard],
    canLoad: [SuperadminGuard]
  },
  {
    path: 'locals/:id',
    pathMatch: 'full',
    redirectTo: 'locals/:id/profile'
  },
  {
    path: 'locals/:id/:tab',
    component: LocalDashboardComponent,
    canActivate: [SuperadminGuard],
    canLoad: [SuperadminGuard]
  },
  {
    path: 'reservations',
    component: ReservationAllComponent,
    canActivate: [AdminGuard],
    canLoad: [AdminGuard],
  },
  /*
  {
    path: 'reservations/showone/:id',
    component: ReservationOneComponent,
    canActivate: [AdminGuard],
    canLoad: [AdminGuard],
  },
  */
];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    RouterModule.forRoot(routes, { useHash: true }),
    HttpModule,
    ReactiveFormsModule,
    // AmazingTimePickerModule,

    AppMaterialModule,
  ],
  declarations: [
    AppComponent,
    LayoutComponent,
    LoginComponent,
    AreaFormComponent,
    ReservationsFilterComponent,
    ReservationAllComponent,
    ReservationOneComponent,
    UserProfileComponent,
    ReservationFormComponent,
    ReservationProfileComponent,
    CustomSnackbarComponent,
    PublicReserveDialogComponent,
    PublicReservationsDashboardComponent,
    PublicReservationsOfDayComponent,
    PublicReservationDetailsDialogComponent,
    PublicLocalDetailsDialogComponent,
    SessionDashboardComponent,
    SessionNotificationsComponent,
    SessionProfileComponent,
    SessionReservationsComponent,
    EditProfileDialogComponent,
    InfoDialogComponent,
    SessionNotificationsMenuComponent,
    CheckDeleteDialogComponent,
    LocalListComponent,
    LocalDashboardComponent,
    LocalFormComponent,
    LocalNewDialogComponent,
    LocalsFilterFormComponent,
    LocalAdminsComponent,
    LocalProfileComponent,
    AreaListComponent,
    AreaNewDialogComponent,
    AreasFilterFormComponent,
    AreaDashboardComponent,
    AreaProfileComponent,
    UserListComponent,
    UsersFilterFormComponent,
    UserDashboardComponent,
    UserFormComponent,
  ],
  providers: [
    DatePipe,
    StorageService,
    SessionService,
    ApiService,
    ErrorHandlerService,
    FeedbackHandlerService,
    NotificationsService,

    AuthGuard,
    AdminGuard,
    SuperadminGuard,

    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 4000}},

    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {
      width: '400px',
      hasBackdrop: true,
      disableClose: true,
    }},

    {provide: MAT_DATE_LOCALE, useValue: 'es-SP'},
    {provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl},
    // {provide: DateAdapter, useClass: NativeDateAdapter, deps: [MAT_DATE_LOCALE]},
    // {provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS},
  ],
  entryComponents: [
    CustomSnackbarComponent,
    PublicReserveDialogComponent,
    PublicReservationDetailsDialogComponent,
    PublicLocalDetailsDialogComponent,
    AreaNewDialogComponent,
    EditProfileDialogComponent,
    LocalNewDialogComponent,

    InfoDialogComponent,
    CheckDeleteDialogComponent
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
