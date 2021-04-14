import { IMenu } from '../models/side-nav-menu/side-nav-menu.model';

export const candidateMenu: IMenu[] = [
    {
        state: 'evaluations',
        name: 'evaluations',
        type: 'sub',
        icon: 'wi_dashboard',
        feature: 'CANDIDATE_TESTS_ACCESS',
        children: [
            {
                state: 'test-sub',
                name: 'test-sub',
                icon: 'wi_dashboard',
                feature: 'test-sub',
                type: 'test-sub',
            }
        ]
    },
    {
        state: 'files',
        name: 'files',
        type: 'link',
        icon: 'wi_dashboard',
        feature: 'SOURCING_CAND_FILE_ACCESS',
    },
    {
        state: 'visa-files',
        name: 'visa files',
        type: 'link',
        icon: 'wi_dashboard',
        feature: 'CANDIDATE_VISA_FILE_ACCESS',
    },
  {
    state: 'resume',
    name: 'Resume management',
    type: 'sub',
    icon: 'wi_dashboard',
    feature: 'SOURCING_CAND_FILE_ACCESS',
    children: [
      {
        state: '',
        name: 'General informations',
        icon: 'wi_dashboard',
        feature: 'CONTRACT_ACCESS',
        type: 'link',
      },
      {
        state: 'professionalExperience',
        name: 'Professional experience',
        icon: 'wi-user',
        feature: 'CONTRACT_ACCESS',
        type: 'sub',
        child: [
          {
            state: 'projects',
            name: 'Projects',
            icon: 'wi_add_user',
            feature: 'CONTRACT_ACCESS',
            type: 'link',
          }
        ]
      },
      {
        state: 'technicalSkills',
        name: 'Technical skills',
        icon: 'wi_dashboard',
        feature: 'CONTRACT_ACCESS',
        type: 'link',
      },
      {
        state: 'functionalSkills',
        name: 'Functional skills ',
        icon: 'wi_dashboard',
        feature: 'CONTRACT_ACCESS',
        type: 'link',
      },
      {
        state: 'intervention',
        name: 'Level of interventions',
        icon: 'wi_dashboard',
        feature: 'CONTRACT_ACCESS',
        type: 'link',
      },
      {
        state: 'language',
        name: 'Language ',
        icon: 'wi_dashboard',
        feature: 'CONTRACT_ACCESS',
        type: 'link',
      },
      {
        state: 'dynamicSection',
        name: 'Dynamic section',
        icon: 'wi_dashboard',
        feature: 'CONTRACT_ACCESS',
        type: 'link',
      },

    ]
  },
];
