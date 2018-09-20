import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';

import {
  MAT_DIALOG_DEFAULT_OPTIONS,
} from '@angular/material';

import { SessionService } from '@app/services/session.service';
import { StorageService } from '@app/services/storage.service';
import { ApiService } from '@app/services/api.service';
import { ErrorHandlerService } from '@app/services/error-handler.service';

import { AuthGuard } from '@app/guards/auth.guard';
import { AdminGuard } from '@app/guards/admin.guard';

import { AppMaterialModule } from '@app/app-material';
import { AppComponent } from '@app/app.component';
import { LoginComponent } from '@app/views/+login/login/login.component';
import { ProfileComponent } from '@app/views/+profile/profile/profile.component';
import { Error404Component } from '@app/views/+errors/error404/error404.component';
import { LayoutComponent } from '@app/views/layout/layout.component';
import { HomeComponent } from '@app/views/+home/home/home.component';
import { AdminComponent } from '@app/views/+admin/admin/admin.component';
import { AdminUsersComponent } from '@app/views/+admin/admin-users/admin-users.component';
import { AdminAreasComponent } from '@app/views/+admin/admin-areas/admin-areas.component';
import { AdminAreaComponent } from '@app/views/+admin/admin-area/admin-area.component';
import { AdminLocalsComponent } from '@app/views/+admin/admin-locals/admin-locals.component';
import { CreateAreaDialogComponent } from './views/+admin/create-area-dialog/create-area-dialog.component';

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
    component: AdminUsersComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/areas',
    component: AdminAreasComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/area/:id',
    component: AdminAreaComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/locals',
    component: AdminLocalsComponent,
    canActivate: [AdminGuard]
  },
  {
    path: '**',
    component: Error404Component
  }
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
    AdminUsersComponent,
    AdminAreasComponent,
    AdminLocalsComponent,
    LoginComponent,
    ProfileComponent,
    Error404Component,
    AdminAreaComponent,
    CreateAreaDialogComponent,
  ],
  providers: [
    StorageService,
    SessionService,
    ApiService,
    ErrorHandlerService,

    AuthGuard,
    AdminGuard,

    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}},
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    CreateAreaDialogComponent,
  ],
})
export class AppModule { }
