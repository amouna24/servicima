
export const sidenavRightMenu = [
  {
    state: '/settings/home-company',
    name: 'Company Profile',
    type: 'link',
    icon: 'wi_company',
    feature: 'company-profile',
  },
  {
    state: '/user/profile',
    name: 'My Account',
    type: 'link',
    icon: 'wi_user',
    feature: 'my-account',
  },
  {
    state: 'settings',
    name: 'Settings',
    type: 'sub',
    icon: 'wi_settings',
    feature: 'settings',
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
        state: 'payment-methods',
        name: 'Payment methods management',
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
    state: 'themes',
    name: 'Themes',
    type: 'sub',
    icon: 'wi_theme',
    feature: 'themes',
    children: [
      {
        state: 'themes',
        name: 'themes',
        icon: '',
        feature: 'SETTINGS_THEMES',
        type: 'link',
      },
     ]
  },
  {
    state: 'logout',
    name: 'Logout',
    type: 'link',
    icon: 'wi_logout',
    feature: 'logout',

  },
];
