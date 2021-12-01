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
    feature: 'SOURCING_CAND_FILE_ACCESS',
  },
  {
    state: 'timesheet',
    name: 'timesheet',
    type: 'sub',
    icon: 'wi_timesheet',
    feature: 'HR_FOLDER_ACCESS',
    children: [
      {
        state: 'TIMESHEET',
        name: 'timesheet',
        icon: 'wi_timesheet',
        feature: 'HR_FOLDER_ACCESS',
        type: 'link',
      },
      {
        state: 'TIMESHEET_EXTRA',
        name: 'timesheet extra',
        icon: 'wi_timesheet',
        feature: 'HR_FOLDER_ACCESS',
        type: 'link',
      },
    ]
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
    feature: 'HR_FOLDER_ACCESS',
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
  {
    state: 'resume',
    name: 'cand.menu.static.res-mng',
    type: 'sub',
    icon: 'wi_dashboard',
    feature: 'SOURCING_CAND_FILE_ACCESS',
    children: [
      {
        state: '',
        name: 'cand.menu.static-gen-info',
        icon: 'wi_res_general_info',
        feature: 'CONTRACT_ACCESS',
        type: 'link',
      },
      {
        state: 'certifDiploma',
        name: 'cand.menu.static.diploma',
        icon: 'wi_res_certif',
        feature: 'CONTRACT_ACCESS',
        type: 'link',
      },
      {
        state: 'certifications',
        name: 'cand.menu.static.certif',
        icon: 'wi_certification',
        feature: 'CONTRACT_ACCESS',
        type: 'link',
      },
      {
        state: 'technicalSkills',
        name: 'cand.menu.static.tech-skl',
        icon: 'wi_res_technical_skills',
        feature: 'CONTRACT_ACCESS',
        type: 'link',
      },
      {
        state: 'functionalSkills',
        name: 'cand.menu.static.func-skl',
        icon: 'wi_res_functional_skills',
        feature: 'CONTRACT_ACCESS',
        type: 'link',
      },
      {
        state: 'intervention',
        name: 'cand.menu.static.inter',
        icon: 'wi_res_intervention',
        feature: 'CONTRACT_ACCESS',
        type: 'link',
      },
      {
        state: 'professionalExperience',
        name: 'cand.menu.static.pro-exp',
        icon: 'wi_res_professional_experience',
        feature: 'CONTRACT_ACCESS',
        type: 'link',
      },
      {
        state: 'dynamicSection',
        name: 'cand.menu.static.dyn-sec',
        icon: 'wi_res_custom_section',
        feature: 'CONTRACT_ACCESS',
        type: 'link',
      },
      {
        state: 'language',
        name: 'cand.menu.static.lang',
        icon: 'wi_res_language',
        feature: 'CONTRACT_ACCESS',
        type: 'link',
      },
      {
        state: 'done',
        name: 'cand.menu.static.preview',
        icon: 'wi_res_preview',
        feature: 'CONTRACT_ACCESS',
        type: 'link',
      },
    ]
  },
];
