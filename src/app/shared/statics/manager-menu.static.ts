import { IMenu } from '../models/side-nav-menu/side-nav-menu.model';

export const managerMenu: IMenu[] = [
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
    state: 'timesheet',
    name: 'timesheet',
    type: 'sub',
    icon: 'wi_timesheet',
    feature: 'TIMESHEET_ACCESS',
    children: [
      {
        state: 'PENDING',
        name: 'manager.menu.static.timesheet.pending',
        icon: '',
        feature: 'TIMESHEET_PENDING_ACCESS',
        type: 'link',
      },
      {
        state: 'REJECTED',
        name: 'manager.menu.static.timesheet.rejected',
        icon: '',
        feature: 'TIMESHEET_REJECTED_ACESS',
        type: 'link',
      },
      {
        state: 'APPROVED',
        name: 'manager.menu.static.timesheet.approved',
        icon: '',
        feature: 'TIMESHEET_APPROVED_ACESS',
        type: 'link',
      },
    ]
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
        name: 'manager_collaborator',
        icon: 'wi-recruitment',
        feature: 'HR_ACCESS',
        type: 'link',
      },
      {
        state: 'candidates-list',
        name: 'List des candidates',
        icon: 'wi-recruitment',
        feature: 'HR_ACCESS',
        type: 'link',
      },
      {
        state: 'work-certificate',
        name: 'certification_all',
        icon: 'wi-recruitment',
        feature: 'HR_ACCESS',
        type: 'link',
      },
      {
        state: 'payslip',
        name: 'manager.menu.hr.payslip',
        type: 'link',
        icon: 'wi-recruitment',
        feature: 'SOURCING_ACCESS',
      },
      {
        state: 'training',
        name: 'manager.menu.hr.training',
        type: 'sub',
        icon: 'wi-HR',
        feature: 'SOURCING_ACCESS',
        child: [
          {
            state: 'training-list',
            name: 'manager.menu.hr.training.trainingslist',
            icon: '',
            feature: 'SOURCING_ACCESS',
            type: 'link',
          },
          {
            state: 'request-list',
            name: 'Requests Collaborators',
            icon: '',
            feature: 'SOURCING_ACCESS',
            type: 'link',
          },
        ]
      }
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
                name: 'Contrat en attente',
                icon: 'wi-credit-card',
                feature: 'CONTRACT_ACCESS',
                type: 'link',
                queryParams: { contract_status: 'EX_AW' },
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
                name: 'Contrat en attente',
                icon: 'wi-credit-card',
                feature: 'CONTRACT_ACCESS',
                type: 'link',
                queryParams: { contract_status: 'EX_AW' },
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
            ]
          }
        ]
    },
    {
        state: 'invoices',
        name: 'manager.menu.static.billings',
        type: 'link',
        icon: 'wi-billings',
        feature: 'INVOICING_ACCESS',
    },
    {
    state: 'test',
    name: 'Test management',
    type: 'sub',
    icon: 'wi-billings',
    feature: 'EXPENSES_ACCESS',
    children: [
      {
        state: 'session-list',
        name: 'Sessions list',
        type: 'link',
        icon: 'wi-billings',
        feature: 'EXPENSES_ACCESS',
      },
      {
        state: 'bloc-list',
        name: 'New session',
        type: 'link',
        icon: 'wi-billings',
        feature: 'EXPENSES_ACCESS',
      },
      {
        state: 'candidates-list',
        name: 'Candidates list',
        type: 'link',
        icon: 'wi-billings',
        feature: 'EXPENSES_ACCESS',
      },
    ]
    },
  {
    state: 'resume',
    name: 'resume-management',
    type: 'sub',
    icon: 'wi-billings',
    feature: 'EXPENSES_ACCESS',
    children: [
      {
        state: '',
        name: 'resume-list',
        icon: 'wi_dashboard',
        feature: 'RESUME_LIST_MANAGEMENT',
        type: 'link',
      },
      {
        state: 'history',
        name: 'mailing_history',
        icon: 'wi-user',
        feature: 'RESUME_MAILING_HISTORY',
        type: 'link',
  }
]},
  {
    state: 'linkedin',
    name: 'share-on-social',
    icon: 'wi_dashboard',
    feature: 'EXPENSES_ACCESS',
    type: 'link',
  },
  {
    state: 'expenses',
    name: 'Expenses management',
    type: 'sub',
    icon: 'wi-billings',
    feature: 'EXPENSES_ACCESS',
    children: [
      {
        state: '',
        name: 'Dashboard',
        type: 'link',
        icon: 'wi-billings',
        feature: 'EXPENSES_ACCESS',
      },
      {
        state: 'expenses-normal',
        name: 'Expenses',
        type: 'link',
        icon: 'wi-billings',
        feature: 'EXPENSES_ACCESS',
      },
      {
        state: 'expenses-recurring',
        name: 'Expense recurring',
        type: 'link',
        icon: 'wi-billings',
        feature: 'EXPENSES_ACCESS',
      },
    ]
  }
];
