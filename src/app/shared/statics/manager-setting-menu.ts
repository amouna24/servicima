import { IMenu } from '@shared/models/side-nav-menu/side-nav-menu.model';

export const ManagerSettingMenu: IMenu[] = [
  {
    state: 'users',
    name: 'manager-setting-menu.users.management',
    type: 'sub',
    icon: 'wi-user',
    feature: 'USERS',
    children: [
      {
        state: 'users',
        name: 'manager-setting-menu.users.management.users',
        icon: 'assignment',
        feature: 'SETTINGS_USERS_ACCESS',
        type: 'link',
      },
      {
        state: 'role',
        name: 'manager-setting-menu.users.management.role.management',
        icon: 'assignment',
        feature: 'SETTINGS_ROLES_ACCESS',
        type: 'link',
      }
      ]
  },
  {
    state: 'Payment',
    name: 'manager-setting-menu.users.management.payment',
    type: 'sub',
    icon: 'wi-credit-card',
    feature: 'PAYMENT',
    children: [
      {
        state: 'licences',
        name: 'manager-setting-menu.payment.License',
        icon: 'assignment',
        feature: 'SETTINGS_LICENCE_ACCESS',
        type: 'link',
      },
      {
        state: 'payment-info',
        name: 'manager-setting-menu.payment.payment.info',
        icon: 'assignment',
        feature: 'SETTINGS_PAYMENT_ACCESS',
        type: 'link',
      },
      {
        state: 'invoices',
        name: 'manager-setting-menu.payment.invoices',
        icon: 'assignment',
        feature: 'SETTINGS_INVOICES_ACCESS',
        type: 'link',
      },

      {
        state: 'timesheet-setting',
        name: 'manager-setting-menu.payment.timesheet.setting',
        icon: 'assignment',
        feature: 'SETTINGS_INVOICES_ACCESS', // à changer
        type: 'link',
      },
      {
        state: 'payment-methods',
        name: 'manager-setting-menu.payment.payment.methods',
        icon: 'assignment',
        feature: 'SETTINGS_PAYMENT_TERMS_ACCESS',
        type: 'link',
      },
      {
        state: 'tax',
        name: 'manager-setting-menu.payment.tax.management',
        icon: 'assignment',
        feature: 'SETTINGS_TAX_ACCESS',
        type: 'link',
      },
    ]
  },
  {
    state: 'other',
    name: 'manager-setting-menu.others',
    type: 'sub',
    icon: 'wi-three-dots',
    feature: 'OTHER',
    children: [
      {
        state: 'home-company',
        name: 'manager-setting-menu.companyprofile',
        type: 'link',
        icon: 'wi_company',
        //  feature: 'company-profile',
        feature: 'SOURCING_ACCESS' // change feature with correct name
      },
      {
        state: 'company-banking-info',
        name: 'manager-setting-menu.company.banking.info',
        type: 'link',
        icon: 'wi_company',
        //  feature: 'company-profile',
        feature: 'SOURCING_ACCESS' // change feature with correct name
      },
      {
        state: 'departments',
        name: 'manager-setting-menu.departments',
        icon: 'assignment',
        feature: 'SETTINGS_DEP_ACCESS',
        type: 'link',
      },
      {
        state: 'calendars',
        name: 'manager-setting-menu.calendars',
        icon: 'assignment',
        feature: 'SETTINGS_CALENDAR_ACCESS',
        type: 'link',
      },
    ]
  }
];
