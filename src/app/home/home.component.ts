import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
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

  mobileQuery: MediaQueryList;
  sidebarState: string;
  listColor: ITheme[];
  private mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private sidebarService: SidenavService,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this.mobileQueryListener);

  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this.mobileQueryListener);
  }

  ngOnInit() {
    this.listColor = [{ 'color': 'green', 'status': false },
      { 'color': 'black', 'status': false },
      { 'color': 'black1', 'status': false },
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
  }

  /**
   * @description Display theme
   * @return theme
   */
  displayClass(): object {
    return {
      'green': this.listColor[0].status, 'black': this.listColor[1].status, 'black1': this.listColor[2].status,
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
