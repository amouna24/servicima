import { Component, OnInit } from '@angular/core';
import { UserService } from '@core/services/user/user.service';
import { LocalStorageService } from '@core/services/storage/local-storage.service';

import { FingerPrintService, AuthService } from '../../../../../../../../projects/auth-front-lib/src/public-api';

@Component({
  selector: 'wid-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss']
})
export class ConnectionComponent implements OnInit {
  connection: any;
  companyEmailAddress: string;
  currentDevise: string;
  emailAddress: string;
  applicationId: string;
  constructor(private userService: UserService,
              private fingerPrintService: FingerPrintService,
              private localStorageService: LocalStorageService,
              private authService: AuthService, ) { }

  /**
   * @description Get connected user
   */
  getConnectedUser() {
    this.userService.connectedUser$
      .subscribe(
        (userInfo) => {
          if (userInfo) {
            this.companyEmailAddress = userInfo['company'][0]['companyKey']['email_address'];
          }
        });
  }

  getCurrentDate(lastConnection) {
    const DateDiff = {

      inSeconds(da1, da2) {
        const t2 = da2.getTime();
        const t1 = da1.getTime();

        return parseInt(String((t2 - t1) / 1000), 10);
      },

      inMinutes(da1, da2) {
        const t2 = da2.getTime();
        const t1 = da1.getTime();

        return parseInt(String((t2 - t1) / 60000), 10);
      },

      inHours(da1, da2) {
        const t2 = da2.getTime();
        const t1 = da1.getTime();

        return parseInt(String((t2 - t1) / 3600000), 10);
      },

      inDays(da1, da2) {
        const t2 = da2.getTime();
        const t1 = da1.getTime();

        return parseInt(String((t2 - t1) / (24 * 3600 * 1000)), 10);
      },

      inWeeks(da1, da2) {
        const t2 = da2.getTime();
        const t1 = da1.getTime();

        return parseInt(String((t2 - t1) / (24 * 3600 * 1000 * 7)), 10);
      },

      inMonths(da1, da2) {
        const d1Y = da1.getFullYear();
        const d2Y = da2.getFullYear();
        const d1M = da1.getMonth();
        const d2M = da2.getMonth();

        return (d2M + 12 * d2Y) - (d1M + 12 * d1Y);
      },

      inYears(da1, da2) {
        return da2.getFullYear() - da1.getFullYear();
      }
    };
    const d1 = new Date(lastConnection);
    console.log(d1, 'ddd');
    const d2 = new Date();

    let timeLaps = DateDiff.inSeconds(d1, d2);
    let dateOutput = '';

    if (timeLaps < 60) {
      dateOutput = timeLaps + ' seconds';
    } else {
      timeLaps = DateDiff.inMinutes(d1, d2);
      if (timeLaps < 60) {
        dateOutput = timeLaps + ' minutes';
      } else {
        timeLaps = DateDiff.inHours(d1, d2);
        if (timeLaps < 24) {
          dateOutput = timeLaps + ' hours';
        } else {
          timeLaps = DateDiff.inDays(d1, d2);
          if (timeLaps < 7) {
            dateOutput = timeLaps + ' days';
          } else {
            timeLaps = DateDiff.inWeeks(d1, d2);
            if (timeLaps < 4) {
              dateOutput = timeLaps + ' weeks';
            } else {
              timeLaps = DateDiff.inMonths(d1, d2);
              if (timeLaps < 12) {
                dateOutput = timeLaps + ' months';
              } else {
                timeLaps = DateDiff.inYears(d1, d2);
                dateOutput = timeLaps + ' years';
              }
            }
          }
        }
      }
    }
    return dateOutput;
  }
  ngOnInit(): void {
    this.emailAddress = this.localStorageService.getItem('userCredentials')['email_address'];
    this.applicationId = this.localStorageService.getItem('userCredentials')['application_id'];
    this.showConnection();
  }

  showConnection() {
    this.fingerPrintService.generateFingerPrint(btoa(this.localStorageService.getItem('userCredentials')['email_address']))
      .then((result) => {
        this.userService.
        getCredentials(`?company_email=${this.companyEmailAddress}&email_address=${this.emailAddress}&application_id=${this.applicationId}`)
          .subscribe((data) => {
            this.connection = data[0].details;
            data[0].details.map((detail) => {
              detail.last_connection =  this.getCurrentDate(detail.last_connection);
            });
            const currentDevise =  this.connection.findIndex((el => el.finger_print === result.murmur));
            this.currentDevise = currentDevise;
          });
      });
  }

  logout(fingerPrint) {
    this.authService.logout({ murmur: fingerPrint}).subscribe((res) => {
        this.showConnection();
      },
      (err) => {
        console.error(err);
      });
  }

}
