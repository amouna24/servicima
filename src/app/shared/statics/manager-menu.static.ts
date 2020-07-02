import { IMenu } from '../models/side-nav-menu/side-nav-menu.model';

export const managerMenu: IMenu[] = [
    {
        state: 'dashboard',
        name: 'dashboard',
        type: 'link',
        icon: 'dashboard',
        feature: 'DASHBOARD',
    },
    {
        state: 'recruitment',
        name: 'recruitment',
        type: 'link',
        icon: 'sync_alt',
        feature: 'SOURCING_ACCESS',
    },
    {
        state: 'human-ressources',
        name: 'template.rh',
        type: 'link',
        icon: 'recent_actors',
        feature: 'RH_ACCESS',
    },
    {
        state: 'placements',
        name: 'placements',
        type: 'link',
        icon: 'person_pin_circle',
        feature: 'OUTSOURCING_ACCESS',
    },
    {
        state: 'activity-reports',
        name: 'activity reports',
        type: 'link',
        icon: 'event_note',
        feature: 'TIMESHEET_ACCESS',
    },
    {
        state: 'contract-management',
        name: 'contract management',
        type: 'sub',
        icon: 'folder_shared',
        feature: 'CONTRACT_ACCESS',
        children: [
          {
            state: '',
            name: 'dashboard',
            icon: 'assignment',
            feature: 'CONTRACT_ACCESS',
            type: 'link',
          },
          {
            state: 'suppliers-contracts',
            name: 'suppliers contracts',
            icon: 'library_books',
            feature: 'CONTRACT_ACCESS',
            type: 'sub',
            child: [
              {
                state: 'list',
                name: 'supplier list',
                icon: 'assignment',
                feature: 'CONTRACT_ACCESS',
                type: 'link',
              },
              {
                state: 'create',
                name: 'supplier contracts',
                icon: 'create',
                feature: 'CONTRACT_ACCESS',
                type: 'link',
              }
            ]
          },
          {
            state: 'clients-contracts',
            name: 'clients contracts',
            icon: 'assignment_ind',
            feature: 'CONTRACT_ACCESS',
            type: 'sub',
            child: [
              {
                state: 'clients-list',
                name: 'clients list',
                icon: 'assignment',
                feature: 'CONTRACT_ACCESS',
                type: 'link',
              },
              {
                state: 'clients-contracts',
                name: 'clients contracts',
                icon: 'create',
                feature: 'CONTRACT_ACCESS',
                type: 'link',
              }
            ]
          }
        ]
    },
    {
        state: 'billings',
        name: 'billings',
        type: 'link',
        icon: 'show_chart',
        feature: 'EXPENSES_ACCESS',
    },
    {
        state: 'settings',
        name: 'settings',
        type: 'sub',
        icon: 'settings',
        feature: 'CONFIG_ACCESS',
        children: [
            {
              state: 'users-list',
              name: 'User Management',
              icon: 'assignment',
              feature: 'SETTINGS_USERS_ACCESS',
              type: 'link',
            },
            {
                state: '',
                name: 'Role management',
                icon: 'assignment',
                feature: 'SETTINGS_ROLES_ACCESS',
                type: 'link',
              },
              {
                state: '',
                name: 'Departments',
                icon: 'assignment',
                feature: 'SETTINGS_DEP_ACCESS',
                type: 'link',
              },
              {
                state: '',
                name: 'Calendars',
                icon: 'assignment',
                feature: 'SETTINGS_CALENDAR_ACCESS',
                type: 'link',
              },
              {
                state: '',
                name: 'Licence',
                icon: 'assignment',
                feature: 'SETTINGS_LICENCE_ACCESS',
                type: 'link',
              },
              {
                state: '',
                name: 'Payment info',
                icon: 'assignment',
                feature: 'SETTINGS_PAYMENT_ACCESS',
                type: 'link',
              },
              {
                state: '',
                name: 'Invoices',
                icon: 'assignment',
                feature: 'SETTINGS_INVOICES_ACCESS',
                type: 'link',
              },
              {
                state: '',
                name: 'Payment methods management',
                icon: 'assignment',
                feature: 'SETTINGS_PAYMENT_TERMS_ACCESS',
                type: 'link',
              },
              {
                state: '',
                name: 'Tax management',
                icon: 'assignment',
                feature: 'SETTINGS_TAX_ACCESS',
                type: 'link',
              },
        ]
    },
];
