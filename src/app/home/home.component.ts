import { Component, OnDestroy, OnInit } from '@angular/core';
import { SidenavService } from '@core/services/sidenav/sidenav.service';
import { mainContentAnimation } from '@shared/animations/animations';
import { ITheme } from '@shared/models/theme.model';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UserService } from '@core/services/user/user.service';
import { Subject } from 'rxjs';
import { UtilsService } from '@core/services/utils/utils.service';
import { IDynamicMenu } from '@shared/models/dynamic-component/menu-item.model';
import { FieldsAlignment, FieldsType, IDynamicForm, InputType } from '@shared/models/dynamic-component/form.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ThemeService } from '@core/services/themes/theme.service';

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
  d_c_Form: FormGroup;

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
      titleRef: 'ADDRESS',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'FirstName',
          placeholder: 'FirstName',
          type: FieldsType.INPUT,
          formControlName: 'firstname',
        },
        {
          label: 'LastName',
          placeholder: 'LastName',
          type: FieldsType.INPUT,
          formControlName: 'lastname',
        },
      ],
    },
    /*
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
    },*/

/*    {
      titleRef: 'ADDRESS',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'TEST',
          placeholder: 'TEST',
          type: 'input',
          inputType: InputType.TEXT,
        },
        {
          label: 'TEST',
          placeholder: 'TEST',
          type: 'input',
          inputType: InputType.TEXT,
        },
      ],
    },*/

    {
      titleRef: 'CONTACT',
      fieldsLayout: FieldsAlignment.tow_items,
      fields: [
        {
          label: 'FirstName',
          placeholder: 'FirstName',
          type: FieldsType.INPUT,
          formControlName: 'firstnamee',
        },
        {
          label: 'LastName',
          placeholder: 'LastName',
          type: FieldsType.INPUT,
          formControlName: 'lastnamee',
        },
      ],
    }
  ];
  constructor(
    private sidebarService: SidenavService,
    private localStorageService: LocalStorageService,
    private userService: UserService,
    private utilService: UtilsService,
    private formBuilder: FormBuilder,
    private router: Router,
    private themeService: ThemeService,
  ) {
    this.d_c_Form = this.formBuilder.group({
        ADDRESS: this.formBuilder.group({
        firstname: [],
        lastname: [],
      }),
      CONTACT: this.formBuilder.group({
        firstnamee: [],
        lastnamee: [],
    }),
  },
    );

  }

  ngOnDestroy(): void {
  }

  ngOnInit() {
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
    this.listColor = this.themeService.getTheme();
    this.userService.classSubject$.subscribe((col) => {
      this.classColor = col;
    });
    this.classColor = {
      'blackGreen': this.listColor[0].status, 'blueBerry': this.listColor[1].status,
      'blue': this.listColor[2].status, 'everGreen': this.listColor[3].status,
      'greenBlue': this.listColor[4].status, 'mango': this.listColor[5].status,
      'whiteRed': this.listColor[6].status, 'setting': this.listColor[7].status
    };
  }

  submit(data: FormGroup) {
    console.log('data', data.controls);
  }

  /**
   * @description display sidanev setting
   * @return boolean
   */
  displaySidenavSetting(): boolean {
    return this.router.url.startsWith('/manager/settings');
  }
}
