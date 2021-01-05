import { Component, OnDestroy, OnInit } from '@angular/core';
import { SidenavService } from '@core/services/sidenav/sidenav.service';
import { mainContentAnimation } from '@shared/animations/animations';
import { ITheme } from '@shared/models/theme.model';

@Component({
  selector: 'wid-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    mainContentAnimation(),
  ]
})
export class HomeComponent implements OnInit, OnDestroy {

  sidebarState: string;
  rightSidebarState: boolean;
  listColor: ITheme[];

  constructor(
    private sidebarService: SidenavService,
  ) {

  }

  ngOnDestroy(): void {
  }

  ngOnInit() {
    this.listColor = [{ 'color': 'green', 'status': false },
      { 'color': 'blackYellow', 'status': false },
      { 'color': 'blacGreen', 'status': false },
      { 'color': 'blueBerry', 'status': false },
      { 'color': 'cobalt', 'status': false },
      { 'color': 'blue', 'status': false },
      { 'color': 'evenGreen', 'status': false },
      { 'color': 'greenBlue', 'status': false },
      { 'color': 'lighterPurple', 'status': false },
      { 'color': 'mango', 'status': false },
      { 'color': 'whiteGreen', 'status': false },
      { 'color': 'whiteOrange', 'status': false },
      { 'color': 'whiteRed', 'status': false }];

    this.sidebarService.sidebarStateObservable$
      .subscribe((newState: string) => {
        this.sidebarState = newState;
      });
    this.sidebarService.rightSidebarStateObservable$
      .subscribe((newState: string) => {
        this.rightSidebarState = newState === 'open';
      });
  }

  /**
   * @description Display theme
   * @return theme
   */
  displayClass(): object {
    return {
      'green': this.listColor[0].status, 'blackYellow': this.listColor[1].status, 'blacGreen': this.listColor[2].status,
      'blueBerry': this.listColor[3].status, 'cobalt': this.listColor[4].status, 'blue': this.listColor[5].status,
      'everGreen': this.listColor[6].status, 'greenBlue': this.listColor[7].status, 'lighterPurple': this.listColor[8].status,
      'mango': this.listColor[9].status, 'whiteGreen': this.listColor[10].status, 'whiteOrange': this.listColor[11].status,
      'whiteRed': this.listColor[12].status
    };
  }

  /**
   * @description Get theme
   * @param color: color
   */
  getTheme(color: string): void {
    this.listColor.map(element => {
      if (element.color !== color) {
        element.status = false;
      }
    });
  }
}
