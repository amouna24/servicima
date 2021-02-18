
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
    state: '/settings/users',
    name: 'Settings',
    type: 'link',
    icon: 'wi_settings',
    feature: 'settings'
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
