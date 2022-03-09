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
        name: 'cand.menu.static.files',
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
    name: 'cand.menu.static.res-mng',
    type: 'sub',
    icon: 'wi_dashboard',
    feature: 'RESUME_MANAGEMENT_ACCESS',
    children: [
      {
        state: '',
        name: 'cand.menu.static-gen-info',
        icon: 'wi_res_general_info',
        feature: 'SOURCING_CAND_FILE_ACCESS',
        type: 'link',
      },
      {
        state: 'certifDiploma',
        name: 'cand.menu.static.diploma',
        icon: 'wi_res_certif',
        feature: 'SOURCING_CAND_FILE_ACCESS',
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
