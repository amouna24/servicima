import { IHeaderMenu } from '@shared/models/header-menu/header-menu.model';

export const headerMenu: IHeaderMenu[] = [
  {
    state: '',
    name: 'Parrainage',
    type: 'link',
    icon: 'card_giftcard',
    feature: 'DASHBOARD',
  },
  {
    state: '',
    name: 'Assistance',
    type: 'link',
    icon: 'assistant',
    feature: 'SOURCING_ACCESS',
  },
  {
    state: '',
    name: 'Notifications',
    type: 'link',
    icon: 'notifications_none',
    feature: 'SOURCING_ACCESS',
  },
  {
    state: 'settings',
    name: 'Settings',
    type: 'sub',
    icon: 'settings',
    feature: 'DASHBOARD',
    children: [
      {
        state: 'users-list',
        name: 'User management',
        icon: 'wi_dashboard',
        feature: 'SETTINGS_USERS_ACCESS',
        type: 'link',
      },
      {
        state: '',
        name: 'Role management',
        type: 'link',
        icon: 'assignment',
        feature: 'SETTINGS_ROLES_ACCESS',
      },
      {
        state: '',
        name: 'Departments',
        type: 'link',
        icon: 'assignment',
        feature: 'SETTINGS_DEP_ACCESS',
      },   {
        state: '',
        name: 'Calendars',
        type: 'link',
        icon: 'assignment',
        feature: 'SETTINGS_CALENDAR_ACCESS',
      },   {
        state: '',
        name: 'Licence',
        type: 'link',
        icon: 'assignment',
        feature: 'SETTINGS_LICENCE_ACCESS',
      },   {
        state: '',
        name: 'Payment info',
        type: 'link',
        icon: 'assignment',
        feature: 'SETTINGS_PAYMENT_ACCESS',
      },   {
        state: '',
        name: 'Invoices',
        type: 'link',
        icon: 'assignment',
        feature: 'SETTINGS_INVOICES_ACCESS',
      },
      {
        state: '',
        name: 'Payment methods management',
        type: 'link',
        icon: 'assignment',
        feature: 'SETTINGS_PAYMENT_TERMS_ACCESS',
      },
      {
        state: '',
        name: 'Tax management',
        type: 'link',
        icon: 'assignment',
        feature: 'SETTINGS_TAX_ACCESS',
      },
    ]
  },
];
