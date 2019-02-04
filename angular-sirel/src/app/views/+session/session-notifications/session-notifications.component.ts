import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ApiService, ErrorHandlerService, NotificationsService } from '@app/services/core';
import { Notification } from '@app/models/core';

@Component({
  selector: 'app-session-notifications',
  templateUrl: './session-notifications.component.html',
  styleUrls: ['./session-notifications.component.scss']
})
export class SessionNotificationsComponent implements OnInit {

  @Input() notifications: Notification[];
  @Output() ReadNotification = new EventEmitter<Notification>();
  @Output() ReadAllNotifications = new EventEmitter();

  constructor(private ntfs: NotificationsService) { }

  ngOnInit() {}
}
