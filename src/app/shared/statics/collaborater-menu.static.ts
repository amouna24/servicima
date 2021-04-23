import { IMenu } from '../models/side-nav-menu/side-nav-menu.model';

export const collaboraterMenu: IMenu[] = [
    {
        state: 'annual-interviews',
        name: 'annual interviews',
        type: 'link',
        icon: 'wi_dashboard',
        feature: 'COLLAB_INTERVIEW_ACCESS',
    },
    {
        state: 'expatriation-certificates',
        name: 'expatriation-certificates',
        type: 'link',
        icon: 'wi_dashboard',
        feature: 'COLLAB_CERT_EXPAT_ACCESS',
    },
    {
        state: 'expenses',
        name: 'expenses',
        type: 'link',
        icon: 'wi_dashboard',
        feature: 'COLLAB_EXPENSE_ACCESS',
    },
    {
        state: 'hr-records',
        name: 'hr-records',
        type: 'link',
        icon: 'wi_dashboard',
        feature: 'HR_FOLDER_ACCESS',
    },
    {
      state: 'timesheet',
      name: 'timesheet',
      type: 'link',
      icon: 'wi_timesheet',
      feature: 'HR_FOLDER_ACCESS',
    },
    {
        state: 'salary-slips',
        name: 'salary-slips',
        type: 'link',
        icon: 'wi_dashboard',
        feature: 'COLLAB_SLIPS_ACCESS',
    },
    {
        state: 'training',
        name: 'training',
        type: 'link',
        icon: 'wi_dashboard',
        feature: 'COLLAB_TRAIN_ACCESS',
    },
    {
        state: 'work-certificates',
        name: 'work-certificates',
        type: 'link',
        icon: 'wi_dashboard',
        feature: 'COLLAB_CERT_WORK_ACCESS',
    },
    {
        state: 'placements',
        name: 'placements',
        type: 'link',
        icon: 'wi_dashboard',
        feature: 'COLLAB_OUTSOURCING_ACCESS',
    },
    {
        state: 'cv',
        name: 'cv',
        type: 'link',
        icon: 'wi_dashboard',
        feature: 'COLLAB_CV_ACCESS',
    },
];
