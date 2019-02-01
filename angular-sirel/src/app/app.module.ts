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
  FeedbackHandlerService
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
import { LocalAdminsComponent } from './views/+locals/common/local-admins/local-admins.component';
import { AreaOneComponent } from './views/+areas/area-one/area-one.component';
import { AreaAllComponent } from './views/+areas/area-all/area-all.component';
import { AreaProfileComponent } from './views/+areas/common/area-profile/area-profile.component';
import { AreaFormComponent } from './views/+areas/common/area-form/area-form.component';
import { AreasTableComponent } from './views/+areas/common/areas-table/areas-table.component';
import { LocalAllComponent } from './views/+locals/local-all/local-all.component';
import { LocalOneComponent } from './views/+locals/local-one/local-one.component';
import { LocalsTableComponent } from './views/+locals/common/locals-table/locals-table.component';
import { LocalInfoFormComponent } from './views/+locals/common/local-info-form/local-info-form.component';
import { LocalProfileComponent } from './views/+locals/common/local-profile/local-profile.component';
import { LocalLaboralTimeFormComponent } from './views/+locals/common/local-laboral-time-form/local-laboral-time-form.component';
import { LocalsFilterFormComponent } from './views/+locals/common/locals-filter-form/locals-filter-form.component';
import { UserOneComponent } from './views/+users/user-one/user-one.component';
import { UserAllComponent } from './views/+users/user-all/user-all.component';
import { UserProfileComponent } from './views/+users/common/user-profile/user-profile.component';
import { UsersFilterComponent } from './views/+users/common/users-filter/users-filter.component';
import { UsersTableComponent } from './views/+users/common/users-table/users-table.component';
import { ReservationAllComponent } from './views/+reservations/reservation-all/reservation-all.component';
import { ReservationOneComponent } from './views/+reservations/reservation-one/reservation-one.component';
import { ReservationsFilterComponent } from './views/+reservations/common/reservations-filter/reservations-filter.component';
import { ReservationsTableComponent } from './views/+reservations/common/reservations-table/reservations-table.component';
import { ReservationFormComponent } from './views/+reservations/common/reservation-form/reservation-form.component';
import { ReservationProfileComponent } from './views/+reservations/common/reservation-profile/reservation-profile.component';
import { UserNotificationsTableComponent } from './views/+users/common/user-notifications-table/user-notifications-table.component';
import { CustomMatPaginatorIntl } from '@app/views/common/CustomMatPaginatorIntl';
import { CustomSnackbarComponent } from './shared/custom-snackbar/custom-snackbar.component';
import { PublicReservationAllComponent } from './views/+reservations/public-reservation-all/public-reservation-all.component';
import { PublicReservationFilterComponent } from './views/+reservations/public-reservation-filter/public-reservation-filter.component';
import { NewAreaDialogComponent } from './views/+areas/common/new-area-dialog/new-area-dialog.component';
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
    component: UserAllComponent,
    canActivate: [SuperadminGuard],
    canLoad: [SuperadminGuard]
  },
  {
    path: 'user/:id',
    component: UserOneComponent,
    canActivate: [SuperadminGuard],
    canLoad: [SuperadminGuard]
  },
  {
    path: 'areas',
    component: AreaAllComponent
  },
  {
    path: 'area/:id',
    component: AreaOneComponent
  },
  {
    path: 'locals',
    component: LocalAllComponent
  },
  {
    path: 'local/:id',
    component: LocalOneComponent
  },
  {
    path: 'reservations',
    component: ReservationAllComponent,
    canActivate: [AdminGuard],
    canLoad: [AdminGuard],
  },
  {
    path: 'reservation/:id',
    component: ReservationOneComponent,
    canActivate: [AdminGuard],
    canLoad: [AdminGuard],
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
    // AmazingTimePickerModule,

    AppMaterialModule,
  ],
  declarations: [
    AppComponent,
    LayoutComponent,
    LoginComponent,
    LocalInfoFormComponent,
    LocalAdminsComponent,
    LocalAllComponent,
    LocalOneComponent,
    LocalsTableComponent,
    LocalProfileComponent,
    LocalLaboralTimeFormComponent,
    LocalsFilterFormComponent,
    AreaProfileComponent,
    AreaFormComponent,
    AreaOneComponent,
    AreaAllComponent,
    AreasTableComponent,
    ReservationsFilterComponent,
    ReservationsTableComponent,
    ReservationAllComponent,
    ReservationOneComponent,
    UserOneComponent,
    UserAllComponent,
    UserProfileComponent,
    UsersFilterComponent,
    UsersTableComponent,
    ReservationFormComponent,
    ReservationProfileComponent,
    UserNotificationsTableComponent,
    CustomSnackbarComponent,
    PublicReservationAllComponent,
    PublicReservationFilterComponent,
    PublicReserveDialogComponent,
    NewAreaDialogComponent,
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
  ],
  providers: [
    DatePipe,
    StorageService,
    SessionService,
    ApiService,
    ErrorHandlerService,
    FeedbackHandlerService,

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
    NewAreaDialogComponent,
    EditProfileDialogComponent,

    InfoDialogComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
