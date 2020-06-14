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
        name: 'human ressources',
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
        type: 'link',
        icon: 'folder_shared',
        feature: 'CONTRACT_ACCESS',
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
        type: 'link',
        icon: 'settings',
        feature: 'CONFIG_ACCESS',
    },
];
