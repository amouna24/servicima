import { Component, OnDestroy, OnInit } from '@angular/core';
import { SidenavService } from '@core/services/sidenav/sidenav.service';
import { mainContentAnimation } from '@shared/animations/animations';
import { ITheme } from '@shared/models/theme.model';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UserService } from '@core/services/user/user.service';
import { Subject } from 'rxjs';
import { listColor } from '@shared/statics/list-color.static';
import { UtilsService } from '@core/services/utils/utils.service';
import { IDynamicMenu } from '@shared/models/dynamic-component/menu-item.model';
import { FieldsAlignment, IDynamicForm } from '@shared/models/dynamic-component/form.model';

import { Router } from '@angular/router';

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
  email: string;
  classColor: object;
  isLoading$ = new Subject<boolean>();
  /**************************************************************************
   * @description Menu Items List
   *************************************************************************/
  menuItems: IDynamicMenu[] = [
    {
      title: 'General information',
      titleKey: 'GENERAL_INFORMATION',
      child: [
        {
          title: 'Address',
          titleKey: 'ADDRESS',
        },
        {
          title: 'General Contact',
          titleKey: 'GENERAL_CONTACT',
        },
        {
          title: 'Organisation',
          titleKey: 'ORGANISATION',
        },
        ]
    },
    {
      title: 'Contact',
      titleKey: 'CONTACT',
      child: []
    },
  ];
  dynamicForm: IDynamicForm[] = [
    {
      titleRef: 'GENERAL_INFORMATION',
      fieldsLayout: FieldsAlignment.tow_items_with_textarea,
      fields: [
        {
          label: 'FirstName',
          placeholder: 'FirstName',
          type: 'input',
        },
        {
          label: 'LastName',
          placeholder: 'LastName',
          type: 'input',
        },
        {
          label: 'Textarea',
          placeholder: 'Textarea',
          type: 'textarea',
        },
      ],
    },
    {
      titleRef: 'GENERAL_INFORMATION',
      fieldsLayout: FieldsAlignment.tow_items_with_image_at_right,
      fields: [
        {
          label: 'FirstName',
          placeholder: 'FirstName',
          type: 'input',
        },
        {
          label: 'LastName',
          placeholder: 'LastName',
          type: 'input',
        },
        {
          type: 'image',
          imageInputs: {
            avatar: '',
            haveImage: '',
            modelObject: [],
          }
        },
      ],
    },
    {
      titleRef: 'GENERAL_INFORMATION',
      fieldsLayout: FieldsAlignment.tow_items_with_image_at_left,
      fields: [
        {
          label: 'FirstName',
          placeholder: 'FirstName',
          type: 'input',
        },
        {
          label: 'LastName',
          placeholder: 'LastName',
          type: 'input',
        },
        {
          type: 'image',
          imageInputs: {
            avatar: '',
            haveImage: '',
            modelObject: [],
          }
        },
      ],
    },
    {
      titleRef: 'GENERAL_INFORMATION',
      fieldsLayout: FieldsAlignment.one_item_at_center,
      fields: [
        {
          label: 'FirstName',
          placeholder: 'FirstName',
          type: 'input',
        },
      ],
    },
    {
      titleRef: 'GENERAL_INFORMATION',
      fieldsLayout: FieldsAlignment.one_item_at_left,
      fields: [
        {
          label: 'FirstName',
          placeholder: 'FirstName',
          type: 'input',
        },
      ],
    },
    {
      titleRef: 'GENERAL_INFORMATION',
      fieldsLayout: FieldsAlignment.one_item_stretch,
      fields: [
        {
          label: 'FirstName',
          placeholder: 'FirstName',
          type: 'input',
        },
      ],
    },
    {
      titleRef: 'GENERAL_INFORMATION',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'FirstName',
          placeholder: 'FirstName',
          type: 'input',
        },
        {
          label: 'LastName',
          placeholder: 'LastName',
          type: 'input',
        },
      ],
    },
    {
      titleRef: 'ADDRESS',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'TEST',
          placeholder: 'TEST',
          type: 'input',
        },
        {
          label: 'TEST',
          placeholder: 'TEST',
          type: 'input',
        },
      ],
    },
    {
      titleRef: 'GENERAL_CONTACT',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'TEST',
          placeholder: 'TEST',
          type: 'input',
        },
        {
          label: 'TEST',
          placeholder: 'TEST',
          type: 'input',
        },
      ],
    },
    {
      titleRef: 'ORGANISATION',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'Gender',
          placeholder: 'Gender',
          type: 'select',
          selectFieldList: [
            { value: 'Male', viewValue: 'Male'},
            { value: 'Female', viewValue: 'Female'},
          ]
        },
        {
          label: 'TEST',
          placeholder: 'TEST',
          type: 'input',
        },
      ],
    },
    {
      titleRef: 'CONTACT',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'Gender',
          placeholder: 'Gender',
          type: 'select',
          selectFieldList: [
            { value: 'Male', viewValue: 'Male'},
            { value: 'Female', viewValue: 'Female'},
          ]
        },
        {
          label: 'TEST',
          placeholder: 'TEST',
          type: 'input',
        },
      ],
    }
  ];
  constructor(
    private sidebarService: SidenavService,
    private localStorageService: LocalStorageService,
    private userService: UserService,
    private utilService: UtilsService,
    private router: Router
  ) {
  }

  ngOnDestroy(): void {
  }

  ngOnInit() {
    const cred = this.localStorageService.getItem('userCredentials');
    this.email = cred['email_address'];
    this.listColor = listColor;
    if (this.localStorageService.getItem(this.utilService.hashCode(this.email))) {
      this.listColor.map(element => {
        if (element.color === this.localStorageService.getItem(this.utilService.hashCode(this.email))) {
          element.status = true;
        }
      });
    //  this.displayClass();
    }

    this.displayClass();
    this.userService.isLoadingAction$.subscribe(
      (res) => {
        this.isLoading$.next(res);
      },
      error => this.isLoading$.next(true)
    );
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
  displayClass(): void {
    this.classColor = {
      'green': this.listColor[0].status, 'blackYellow': this.listColor[1].status, 'blackGreen': this.listColor[2].status,
      'blueBerry': this.listColor[3].status, 'cobalt': this.listColor[4].status, 'blue': this.listColor[5].status,
      'everGreen': this.listColor[6].status, 'greenBlue': this.listColor[7].status, 'lighterPurple': this.listColor[8].status,
      'mango': this.listColor[9].status, 'whiteGreen': this.listColor[10].status, 'whiteOrange': this.listColor[11].status,
      'whiteRed': this.listColor[12].status
    };
    this.userService.classSubject$.subscribe((col) => {
      this.classColor = col;
    });
  }

  /**
   * @description display sidanev setting
   * @return boolean
   */
  displaySidenavSetting(): boolean {
    return this.router.url.startsWith('/manager/settings');
  }
}
