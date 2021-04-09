import { IMenu } from '@shared/models/side-nav-menu/side-nav-menu.model';

export const ManagerSettingMenu: IMenu[] = [
  {
    state: 'users',
    name: 'users',
    type: 'sub',
    icon: 'wi-user',
    feature: 'USERS',
    children: [
      {
        state: 'users',
        name: 'User Management',
        icon: 'assignment',
        feature: 'SETTINGS_USERS_ACCESS',
        type: 'link',
      },
      {
        state: 'role',
        name: 'Role management',
        icon: 'assignment',
        feature: 'SETTINGS_ROLES_ACCESS',
        type: 'link',
      }
      ]
  },
  {
    state: 'Payment',
    name: 'Payment',
    type: 'sub',
    icon: 'wi-credit-card',
    feature: 'PAYMENT',
    children: [
      {
        state: 'licences',
        name: 'Licence',
        icon: 'assignment',
        feature: 'SETTINGS_LICENCE_ACCESS',
        type: 'link',
      },
      {
        state: 'payment-info',
        name: 'Payment info',
        icon: 'assignment',
        feature: 'SETTINGS_PAYMENT_ACCESS',
        type: 'link',
      },
      {
        state: 'invoices',
        name: 'Invoices',
        icon: 'assignment',
        feature: 'SETTINGS_INVOICES_ACCESS',
        type: 'link',
      },
      {
        state: 'timesheet-setting',
        name: 'timesheet Setting',
        icon: 'assignment',
        feature: 'SETTINGS_INVOICES_ACCESS', // à changer
        type: 'link',
      },
      {
        state: 'payment-methods',
        name: 'Payment methods',
        icon: 'assignment',
        feature: 'SETTINGS_PAYMENT_TERMS_ACCESS',
        type: 'link',
      },
      {
        state: 'tax',
        name: 'Tax management',
        icon: 'assignment',
        feature: 'SETTINGS_TAX_ACCESS',
        type: 'link',
      },
    ]
  },
  {
    state: 'other',
    name: 'Other',
    type: 'sub',
    icon: 'wi-three-dots',
    feature: 'OTHER',
    children: [
      {
        state: 'home-company',
        name: 'Company Profile',
        type: 'link',
        icon: 'wi_company',
        //  feature: 'company-profile',
        feature: 'SOURCING_ACCESS' // change feature with correct name
      },
      {
        state: 'departments',
        name: 'Departments',
        icon: 'assignment',
        feature: 'SETTINGS_DEP_ACCESS',
        type: 'link',
      },
      {
        state: 'calendars',
        name: 'Calendars',
        icon: 'assignment',
        feature: 'SETTINGS_CALENDAR_ACCESS',
        type: 'link',
      },
    ]
  }
];
