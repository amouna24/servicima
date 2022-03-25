import { IError } from '@shared/models/error.model';

export  const errorPages: IError[] = [
  {
    code: '404',
    title: 'error.error404.name',
    subtitle: 'error.error404.typeerror',
    description: 'error.error404.link',
    img: '404illustration.png',
    backBtn: true
  },
  {
    code: '500',
    title: 'error.error500.name',
    subtitle: 'error.error500.typeerror',
    description: 'error.error500.link',
    img: '500illustration.png',
    backBtn: true
  },
  {
    code: '0005',
    title: 'error.error403.name',
    subtitle: 'error.error403.typeerror',
    description: 'error.error403.link',
    img: '403illustration.png',
    backBtn: true
  },
  {
    code: '0002',
    title: 'error.error400.name',
    subtitle: 'error.error400.typeerror',
    description: 'error.error400.link',
    img: '400illustration.png',
    backBtn: true
  },
  {
    code: '0011',
    title: 'error.error.name',
    subtitle: 'error.error.typeerror',
    description: 'error.error.link',
    img: '0011illustration.png',
    backBtn: true
  }
];
