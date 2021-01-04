import { Component, OnInit , Input } from '@angular/core';
import { closeAlertAnimation } from '@shared/animations/animations';

@Component({
  selector: 'wid-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  animations: [
    closeAlertAnimation()
  ]
})
export class AlertComponent implements OnInit {
  @Input() type: string;
  @Input() message: string;
  param: any ;
  constructor() { }

  ngOnInit(): void {
    this.param = {
      type : this.type,
      message: this.message,
      icon: this.displayIcon(),
      style: this.displayClasses(),
      state: 'open'
    };
  }

  displayClasses() {
    switch (this.type) {
      case 'error': {
        return 'bg-error-red';
        break;
      }
      case 'success': {
        return 'bg-topaz';
        break;
      }
      case 'warning': {
        return 'bg-warning-yellow';
        break;
      }
      case 'info': {
        return 'bg-info-blue';
        break;
      }
      case 'help': {
        return 'bg-help-blue';
        break;
      }
      default: {
        return '';
      }
    }
  }
  displayIcon() {
    switch (this.type) {
      case 'error': {
        return 'wi_alert_error';
        break;
      }
      case 'success': {
        return 'wi_alert_success';
        break;
      }
      case 'warning': {
        return 'wi_alert_warning';
        break;
      }
      case 'info': {
        return 'wi_alert_info';
        break;
      }
      case 'help': {
        return 'wi_alert_help';
        break;
      }
      default: {
        return '';
      }
    }
  }
}
