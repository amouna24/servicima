import { IMenu } from '../models/side-nav-menu/side-nav-menu.model';

export const managerMenu: IMenu[] = [
    {
        state: 'dashboard',
        name: 'dashboard',
        type: 'link',
        icon: 'wi_dashboard',
        feature: 'DASHBOARD',
    },
    {
        state: 'recruitment',
        name: 'recruitment',
        type: 'link',
        icon: 'wi-recruitment',
        feature: 'SOURCING_ACCESS',
    },
    {
        state: 'human-ressources',
        name: 'template.rh',
        type: 'link',
        icon: 'wi-HR',
        feature: 'HR_ACCESS',
    },
    {
        state: 'placements',
        name: 'placements',
        type: 'link',
        icon: 'wi-placement',
        feature: 'OUTSOURCING_ACCESS',
    },
    {
        state: 'activity-reports',
        name: 'activity reports',
        type: 'link',
        icon: 'wi-activity-reports',
        feature: 'TIMESHEET_ACCESS',
    },
    {
        state: 'contract-management',
        name: 'contract management',
        type: 'sub',
        icon: 'wi-contract-management',
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
            name: 'supplier',
            icon: 'library_books',
            feature: 'CONTRACT_ACCESS',
            type: 'sub',
            child: [
              {
                state: 'suppliers-list',
                name: 'suppliers',
                icon: 'assignment',
                feature: 'CONTRACT_ACCESS',
                type: 'link',
              },
              {
                state: 'contracts-list',
                name: 'contracts',
                icon: 'assignment',
                feature: 'CONTRACT_ACCESS',
                type: 'link',
              }
            ]
          },
          {
            state: 'clients-contracts',
            name: 'customer',
            icon: 'assignment_ind',
            feature: 'CONTRACT_ACCESS',
            type: 'sub',
            child: [
              {
                state: 'clients-list',
                name: 'customers',
                icon: 'assignment',
                feature: 'CONTRACT_ACCESS',
                type: 'link',
              },
              {
                state: 'clients-contracts',
                name: 'contracts',
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
        icon: 'wi-billings',
        feature: 'EXPENSES_ACCESS',
    },
];
