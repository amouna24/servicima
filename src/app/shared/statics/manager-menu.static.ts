import { IMenu } from '../models/side-nav-menu/side-nav-menu.model';

export const managerMenu: IMenu[] = [

    {
    state: 'timesheet',
    name: 'timesheet',
    type: 'sub',
    icon: 'wi_timesheet',
    feature: 'CONTRACT_ACCESS',
    children: [
      {
        state: 'Pending',
        name: 'Pending',
        icon: '',
        feature: 'CONTRACT_ACCESS',
        type: 'link',
      },
      {
        state: 'Rejected',
        name: 'Rejected',
        icon: '',
        feature: 'CONTRACT_ACCESS',
        type: 'link',
      },
      {
        state: 'Approved',
        name: 'Approved',
        icon: '',
        feature: 'CONTRACT_ACCESS',
        type: 'link',
      },
    ]
  },

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
            icon: 'wi_dashboard',
            feature: 'CONTRACT_ACCESS',
            type: 'link',
          },
          {
            state: 'suppliers-contracts',
            name: 'suppliers management',
            icon: 'wi-user',
            feature: 'CONTRACT_ACCESS',
            type: 'sub',
            child: [
              {
                state: 'suppliers-list',
                name: 'Suppliers',
                icon: 'wi_add_user',
                feature: 'CONTRACT_ACCESS',
                type: 'link',
              },
              {
                state: 'contracts-list',
                name: 'Contracts',
                icon: 'wi-credit-card',
                feature: 'CONTRACT_ACCESS',
                type: 'link',
              },
              {
                state: 'contracts-list',
                name: 'In progress',
                icon: 'wi-credit-card',
                feature: 'CONTRACT_ACCESS',
                type: 'link',
                queryParams: { contract_status: 'RUN' },
              },
              {
                state: 'contracts-list',
                name: 'Expired',
                icon: 'wi-credit-card',
                feature: 'CONTRACT_ACCESS',
                type: 'link',
                queryParams: { contract_status: 'EXPIRED' },

              },
              {
                state: 'projects-list',
                name: 'Projects ',
                icon: 'wi-credit-card',
                feature: 'CONTRACT_ACCESS',
                type: 'link',
              },
              {
                state: 'collaborators-list',
                name: 'Collaborators ',
                icon: 'wi_settings',
                feature: 'CONTRACT_ACCESS',
                type: 'link',
              },
            ]
          },
          {
            state: 'clients-contracts',
            name: 'Clients management',
            icon: 'wi-user',
            feature: 'CONTRACT_ACCESS',
            type: 'sub',
            child: [
              {
                state: 'clients-list',
                name: 'Clients',
                icon: 'wi_add_user',
                feature: 'CONTRACT_ACCESS',
                type: 'link',
              },
              {
                state: 'contracts-list',
                name: 'Contracts',
                icon: 'wi-credit-card',
                feature: 'CONTRACT_ACCESS',
                type: 'link',
              },
              {
                state: 'contracts-list',
                name: 'Contracts in progress',
                icon: 'wi-credit-card',
                feature: 'CONTRACT_ACCESS',
                type: 'link',
                queryParams: { contract_status: 'RUN' },
              },
              {
                state: 'contracts-list',
                name: 'Expired contracts ',
                icon: 'wi-credit-card',
                feature: 'CONTRACT_ACCESS',
                type: 'link',
                queryParams: { contract_status: 'EXPIRED' },
              },
              {
                state: 'contracts-list',
                name: 'Export ',
                icon: 'wi_upload',
                feature: 'CONTRACT_ACCESS',
                type: 'link',
              },
              {
                state: 'contracts-list',
                name: 'Settings ',
                icon: 'wi_settings',
                feature: 'CONTRACT_ACCESS',
                type: 'link',
              },
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
