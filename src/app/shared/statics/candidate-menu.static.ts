import { IMenu } from '../models/side-nav-menu/side-nav-menu.model';

export const candidateMenu: IMenu[] = [
    {
        state: 'evaluations',
        name: 'evaluations',
        type: 'sub',
        icon: 'dashboard',
        feature: 'CANDIDATE_TESTS_ACCESS',
        children: [
            {
                state: 'test-sub',
                name: 'test-sub',
                icon: 'dashboard',
                feature: 'test-sub',
                type: 'test-sub',
            }
        ]
    },
    {
        state: 'files',
        name: 'files',
        type: 'link',
        icon: 'dashboard',
        feature: 'CANDIDATE_FILE_ACCESS',
    },
    {
        state: 'visa-files',
        name: 'visa files',
        type: 'link',
        icon: 'dashboard',
        feature: 'CANDIDATE_VISA_FILE_ACCESS',
    },
    {
        state: 'cv',
        name: 'cv',
        type: 'link',
        icon: 'dashboard',
        feature: 'CANDIDATE_CV_ACCESS',
    },
];
