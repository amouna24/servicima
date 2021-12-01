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
        name: 'manager.menu.static.dashboard',
        type: 'link',
        icon: 'wi_dashboard',
        feature: 'DASHBOARD',
    },
    {
        state: 'recruitment',
        name: 'manager.menu.static.recruitment',
        type: 'link',
        icon: 'wi-recruitment',
        feature: 'SOURCING_ACCESS',
    },
  {
    state: 'human-ressources',
    name: 'manager.menu.static.human.ressources',
    type: 'sub',
    icon: 'wi-HR',
    feature: 'HR_ACCESS',
    children: [
      {
        state: 'collaborator-list',
        name: 'Collaborator List',
        icon: '',
        feature: 'HR_ACCESS',
        type: 'link',
      },
      {
        state: 'work-certificate',
        name: 'Work Certificate',
        icon: '',
        feature: 'HR_ACCESS',
        type: 'link',
      },
    ]
  },

    {
        state: 'placements',
        name: 'manager.menu.static.placements',
        type: 'link',
        icon: 'wi-placement',
        feature: 'OUTSOURCING_ACCESS',
    },
    {
        state: 'activity-reports',
        name: 'manager.menu.static.activity.reports',
        type: 'link',
        icon: 'wi-activity-reports',
        feature: 'TIMESHEET_ACCESS',
    },
    {
        state: 'contract-management',
        name: 'manager.menu.static.contract.management',
        type: 'sub',
        icon: 'wi-contract-management',
        feature: 'CONTRACT_ACCESS',
        children: [
          {
            state: '',
            name: 'manager.menu.static.contract.management.dashboard',
            icon: 'wi_dashboard',
            feature: 'CONTRACT_ACCESS',
            type: 'link',
          },
          {
            state: 'suppliers-contracts',
            name: 'manager.menu.static.contract.management.suppliers.management',
            icon: 'wi-user',
            feature: 'CONTRACT_ACCESS',
            type: 'sub',
            child: [
              {
                state: 'suppliers-list',
                name: 'manager.menu.static.contract.management.suppliers.management.suppliers',
                icon: 'wi_add_user',
                feature: 'CONTRACT_ACCESS',
                type: 'link',
              },
              {
                state: 'contracts-list',
                name: 'manager.menu.static.contract.management.suppliers.management.contracts',
                icon: 'wi-credit-card',
                feature: 'CONTRACT_ACCESS',
                type: 'link',
              },
              {
                state: 'contracts-list',
                name: 'manager.menu.static.contract.management.suppliers.management.inprogress',
                icon: 'wi-credit-card',
                feature: 'CONTRACT_ACCESS',
                type: 'link',
                queryParams: { contract_status: 'RUN' },
              },
              {
                state: 'contracts-list',
                name: 'manager.menu.static.contract.management.suppliers.management.expired',
                icon: 'wi-credit-card',
                feature: 'CONTRACT_ACCESS',
                type: 'link',
                queryParams: { contract_status: 'EXPIRED' },

              },
              {
                state: 'projects-list',
                name: 'manager.menu.static.contract.management.suppliers.management.projects',
                icon: 'wi-credit-card',
                feature: 'CONTRACT_ACCESS',
                type: 'link',
              },
              {
                state: 'collaborators-list',
                name: 'manager.menu.static.contract.management.suppliers.management.collaborators',
                icon: 'wi_settings',
                feature: 'CONTRACT_ACCESS',
                type: 'link',
              },
            ]
          },
          {
            state: 'clients-contracts',
            name: 'manager.menu.static.contract.management.clients.management',
            icon: 'wi-user',
            feature: 'CONTRACT_ACCESS',
            type: 'sub',
            child: [
              {
                state: 'clients-list',
                name: 'manager.menu.static.contract.management.clients.management.clients',
                icon: 'wi_add_user',
                feature: 'CONTRACT_ACCESS',
                type: 'link',
              },
              {
                state: 'contracts-list',
                name: 'manager.menu.static.contract.management.clients.management.contracts',
                icon: 'wi-credit-card',
                feature: 'CONTRACT_ACCESS',
                type: 'link',
              },
              {
                state: 'contracts-list',
                name: 'manager.menu.static.contract.management.clients.management.inprogress',
                icon: 'wi-credit-card',
                feature: 'CONTRACT_ACCESS',
                type: 'link',
                queryParams: { contract_status: 'RUN' },
              },
              {
                state: 'contracts-list',
                name: 'manager.menu.static.contract.management.clients.management.expired.contracts',
                icon: 'wi-credit-card',
                feature: 'CONTRACT_ACCESS',
                type: 'link',
                queryParams: { contract_status: 'EXPIRED' },
              },
              {
                state: 'contracts-list',
                name: 'manager.menu.static.contract.management.clients.management.export',
                icon: 'wi_upload',
                feature: 'CONTRACT_ACCESS',
                type: 'link',
              },
              {
                state: 'contracts-list',
                name: 'manager.menu.static.contract.management.clients.management.settings',
                icon: 'wi_settings',
                feature: 'CONTRACT_ACCESS',
                type: 'link',
              },
            ]
          }
        ]
    },
    {
        state: 'invoices',
        name: 'manager.menu.static.billings',
        type: 'link',
        icon: 'wi-billings',
        feature: 'EXPENSES_ACCESS',
    },
  {
    state: 'resume',
    name: 'Resume management',
    type: 'sub',
    icon: 'wi-billings',
    feature: 'CONTRACT_ACCESS',
    children: [
      {
        state: '',
        name: 'Resume List',
        icon: 'wi_dashboard',
        feature: 'CONTRACT_ACCESS',
        type: 'link',
      },
      {
        state: 'history',
        name: 'Mailing history',
        icon: 'wi-user',
        feature: 'CONTRACT_ACCESS',
        type: 'link',
  }
]},
  {
    state: 'linkedin',
    name: 'Share on Social Network',
    icon: 'wi_dashboard',
    feature: 'CONTRACT_ACCESS',
    type: 'link',
  }
];
