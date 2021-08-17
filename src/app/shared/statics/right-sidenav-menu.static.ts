
export const sidenavRightMenu = [
  /*{
    state: '/settings/home-company',
    name: 'Company Profile',
    type: 'link',
    icon: 'wi_company',
  //  feature: 'company-profile',
    feature: 'SOURCING_ACCESS' // change feature with correct name
  },*/
  {
    state: '/user/profile',
    name: 'right-sidenav-menu.static.myaccount',
    type: 'link',
    icon: 'wi_user',
    // feature: 'my-account',
    feature:  'SOURCING_CAND_FILE_ACCESS'  || 'SOURCING_ACCESS'  // change feature with correct name
  },
  {
    state: '/settings',
    name: 'right-sidenav-menu.static.settings',
    type: 'link',
    icon: 'wi_settings',
    // feature: 'settings'
    feature: 'SOURCING_ACCESS' // change feature with correct name
  },
  {
    state: 'themes',
    name: 'right-sidenav-menu.static.themes',
    type: 'sub',
    icon: 'wi_theme',
   //  feature: 'themes',
    feature: 'SOURCING_CAND_FILE_ACCESS', // change feature with correct name
    children: [
      {
        state: 'themes',
        name: 'right-sidenav-menu.static.theme',
        icon: '',
        feature: 'SETTINGS_THEMES',
        type: 'link',
      },
     ]
  },
  {
    state: 'logout',
    name: 'right-sidenav-menu.static.logout',
    type: 'link',
    icon: 'wi_logout',
    feature: 'logout',

  },
];
