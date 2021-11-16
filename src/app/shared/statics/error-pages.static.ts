import { IError } from '@shared/models/error.model';

export  const errorPages: IError[] = [
  {
    code: '404',
    title: 'ERROR 404',
    subtitle: 'Ooops!! PAGE NOT FOUND',
    description: 'The link you followed us probably broken or the page has been removed',
    img: '404illustration.png',
    backBtn: true
  },
  {
    code: '500',
    title: 'ERROR 500',
    subtitle: 'Internal Server Error',
    description: 'The server has been deserted for a while. Please be patient or try again',
    img: '500illustration.png',
    backBtn: true
  },
  {
    code: '0005',
    title: 'ERROR 403',
    subtitle: 'Access Denied/Forbidden',
    description: 'The page or resource you were trying to reach is absolutely forbidden for some reason',
    img: '403illustration.png',
    backBtn: true
  },
  {
    code: '0002',
    title: 'ERROR 400',
    subtitle: 'Bad Request',
    description: 'Your browser has issued a malformed or illegal request',
    img: '400illustration.png',
    backBtn: true
  },
  {
    code: '0011',
    title: 'ERROR',
    subtitle: 'Validation Code Exipired',
    description: 'Your validation code has expired, Please try again',
    img: '0011illustration.png',
    backBtn: true
  }
];
