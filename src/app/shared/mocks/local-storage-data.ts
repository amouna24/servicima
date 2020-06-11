export const LocalStorageDataMock = {
  'companyall': [
    {
      'status': 'A',
      '_id': '5eac547eb3fbee0f5cad418d',
      'CompanyKey': {
        'application_id': '5eac544a92809d7cd5dae21e',
        'email_adress': 'ALL'
      },
      'company_name': 'ALL',
      'reg_nbr': 'ALL',
      'legal_form': 'ALL',
      'activity_code': 'ALL',
      'vat_nbr': 'ALL',
      'adress': 'ALL',
      'city': 'ALL',
      'zip_code': 'ALL',
      'country_id': 'ALL',
      'phone_nbr': 'ALL',
      'currency_id': 'ALL',
      'employee_nbr': 0,
      'creation_date': '1-5-2020 17:55:26',
      'update_date': '1-5-2020 17:55:26',
      '__v': 0
    }
  ],
  'applications': [
    {
      'status': 'A',
      '_id': '5eac544a92809d7cd5dae21e',
      'ApplicationKey': {
        'application_code': 'ALL'
      },
      'application_desc': 'ALL',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac544a92809d7cd5dae21f',
      'ApplicationKey': {
        'application_code': 'SERVICIMA'
      },
      'application_desc': 'Servicima',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac544a92809d7cd5dae220',
      'ApplicationKey': {
        'application_code': 'ADMINISTRATION'
      },
      'application_desc': 'Administration des données',
      '__v': 0
    },
    {
      'status': 'D',
      '_id': '5eb7dc36a9e00c21a7c02bdf',
      'ApplicationKey': {
        'application_code': 'test'
      },
      'application_desc': 'test',
      '__v': 0
    }
  ],
  'licences': [
    {
      '_id': '5ec4fec37c4f426f5d21fd2f',
      'LicenceKey': {
        'application_id': '5eac544a92809d7cd5dae21f',
        'licence_code': 'ENTREPRISE'
      },
      'licence_desc': 'Entreprise Licence',
      'level': 2,
      'pack_annual_price': 1000,
      'pack_monthly_price': 150,
      'price_currency_id': 'EUR',
      'free_user_nbr': 10,
      'annual_extra_user_price': 200,
      'monthly_extra_user_price': 20,
      'trial_days': 30,
      'licence_start_date': '2020-01-01T00:00:00.000Z',
      'licence_end_date': '2099-12-31T23:59:59.000Z',
      '__v': 0
    },
    {
      '_id': '5ec4fec37c4f426f5d21fd2e',
      'LicenceKey': {
        'application_id': '5eac544a92809d7cd5dae21f',
        'licence_code': 'BASIC'
      },
      'licence_desc': 'Basic Licence',
      'level': 1,
      'pack_annual_price': 300,
      'pack_monthly_price': 30,
      'price_currency_id': 'EUR',
      'free_user_nbr': 5,
      'annual_extra_user_price': 70,
      'monthly_extra_user_price': 10,
      'trial_days': 30,
      'licence_start_date': '2020-01-01T00:00:00.000Z',
      'licence_end_date': '2099-12-31T23:59:59.000Z',
      '__v': 0
    },
    {
      '_id': '5ec4fec37c4f426f5d21fd30',
      'LicenceKey': {
        'application_id': '5eac544a92809d7cd5dae21f',
        'licence_code': 'PREMIUM'
      },
      'licence_desc': 'Premium Licence',
      'level': 3,
      'pack_annual_price': 1500,
      'pack_monthly_price': 200,
      'price_currency_id': 'EUR',
      'free_user_nbr': 15,
      'annual_extra_user_price': 200,
      'monthly_extra_user_price': 20,
      'trial_days': 30,
      'licence_start_date': '2020-01-01T23:00:00.000Z',
      'licence_end_date': '2099-12-31T23:00:00.000Z',
      '__v': 0
    }
  ],
  'moduleauth': [
    {
      'status': 'A',
      '_id': '5eac5486a0cdc666e9948d16',
      'ModuleKey': {
        'application_id': '5eac544a92809d7cd5dae21e',
        'module_code': 'AUTH'
      },
      'module_desc': 'Authentication',
      '__v': 0
    }
  ],
  'languages': [
    {
      'status': 'A',
      '_id': '5eac544ad4cb666637fe1352',
      'LanguageKey': {
        'language_code': 'IT'
      },
      'language_desc': 'Italiano',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac544ad4cb666637fe1353',
      'LanguageKey': {
        'language_code': 'FR'
      },
      'language_desc': 'Français',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac544ad4cb666637fe1354',
      'LanguageKey': {
        'language_code': 'EN'
      },
      'language_desc': 'English',
      '__v': 0
    },
    {
      'status': null,
      '_id': '5eb8122e8e3f8b6f4c3c89b3',
      'LanguageKey': {
        'language_code': 'DE'
      },
      'language_desc': 'Deutsch',
      '__v': 0
    }
  ],
  'reftypes': [
    {
      'status': 'A',
      '_id': '5eac219fe1202b7a383433db',
      'RefTypeKey': {
        'ref_type_code': 'LEGAL_FORM'
      },
      'ref_type_desc': 'Legal Form',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac219fe1202b7a383433dc',
      'RefTypeKey': {
        'ref_type_code': 'PROF_TITLES'
      },
      'ref_type_desc': 'Professional Titles',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac219fe1202b7a383433dd',
      'RefTypeKey': {
        'ref_type_code': 'PAYMENT_MODE'
      },
      'ref_type_desc': 'All Payments modes',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac219fe1202b7a383433e0',
      'RefTypeKey': {
        'ref_type_code': 'GENDER'
      },
      'ref_type_desc': 'Genders',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac219fe1202b7a383433df',
      'RefTypeKey': {
        'ref_type_code': 'UNIT'
      },
      'ref_type_desc': 'Units Like Year / Month / Days',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac219fe1202b7a383433de',
      'RefTypeKey': {
        'ref_type_code': 'ROLE'
      },
      'ref_type_desc': 'APPLICATION ROLE',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eb7dc3f034eaa220b5fb731',
      'RefTypeKey': {
        'ref_type_code': 'test'
      },
      'ref_type_desc': 'test',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eb86843f6180d7eec70ef32',
      'RefTypeKey': {
        'ref_type_code': 'cors'
      },
      'ref_type_desc': 'cors',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eb869bd31828e01e9a66922',
      'RefTypeKey': {
        'ref_type_code': 'cors2'
      },
      'ref_type_desc': 'cors1',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eb8768ae9cded0ddd0e0b6d',
      'RefTypeKey': {
        'ref_type_code': 'cors3'
      },
      'ref_type_desc': 'cors3',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eb87721e9cded0ddd0e0b6e',
      'RefTypeKey': {
        'ref_type_code': 'cors4'
      },
      'ref_type_desc': 'clrs4',
      '__v': 0
    }
  ],
  'refdataall': [
    {
      'status': 'A',
      '_id': '5eac549c1cb2a867dbd0abd1',
      'RefDataKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'ref_type_id': '5eac219fe1202b7a383433e0',
        'ref_data_code': 'M',
        'language_id': '5eac544ad4cb666637fe1353'
      },
      'ref_data_desc': 'Homme',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac549c1cb2a867dbd0abd2',
      'RefDataKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'ref_type_id': '5eac219fe1202b7a383433e0',
        'ref_data_code': 'M',
        'language_id': '5eac544ad4cb666637fe1354'
      },
      'ref_data_desc': 'Male',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac549c1cb2a867dbd0abd4',
      'RefDataKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'ref_type_id': '5eac219fe1202b7a383433e0',
        'ref_data_code': 'F',
        'language_id': '5eac544ad4cb666637fe1354'
      },
      'ref_data_desc': 'Female',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac549c1cb2a867dbd0abd3',
      'RefDataKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'ref_type_id': '5eac219fe1202b7a383433e0',
        'ref_data_code': 'F',
        'language_id': '5eac544ad4cb666637fe1353'
      },
      'ref_data_desc': 'Femme',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac549c1cb2a867dbd0abd6',
      'RefDataKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'ref_type_id': '5eac219fe1202b7a383433db',
        'ref_data_code': 'EURL',
        'language_id': '5eac544ad4cb666637fe1354'
      },
      'ref_data_desc': 'EURL',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac549c1cb2a867dbd0abd5',
      'RefDataKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'ref_type_id': '5eac219fe1202b7a383433db',
        'ref_data_code': 'EURL',
        'language_id': '5eac544ad4cb666637fe1353'
      },
      'ref_data_desc': 'EURL',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac549c1cb2a867dbd0abd7',
      'RefDataKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'ref_type_id': '5eac219fe1202b7a383433db',
        'ref_data_code': 'SARL',
        'language_id': '5eac544ad4cb666637fe1353'
      },
      'ref_data_desc': 'SARL',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac549c1cb2a867dbd0abd8',
      'RefDataKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'ref_type_id': '5eac219fe1202b7a383433db',
        'ref_data_code': 'SARL',
        'language_id': '5eac544ad4cb666637fe1354'
      },
      'ref_data_desc': 'SARL',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac549c1cb2a867dbd0abd9',
      'RefDataKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'ref_type_id': '5eac219fe1202b7a383433db',
        'ref_data_code': 'SAS',
        'language_id': '5eac544ad4cb666637fe1353'
      },
      'ref_data_desc': 'SAS',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac549c1cb2a867dbd0abda',
      'RefDataKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'ref_type_id': '5eac219fe1202b7a383433db',
        'ref_data_code': 'SAS',
        'language_id': '5eac544ad4cb666637fe1354'
      },
      'ref_data_desc': 'SAS',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac549c1cb2a867dbd0abdc',
      'RefDataKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'ref_type_id': '5eac219fe1202b7a383433db',
        'ref_data_code': 'SASU',
        'language_id': '5eac544ad4cb666637fe1354'
      },
      'ref_data_desc': 'SASU',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac549c1cb2a867dbd0abdb',
      'RefDataKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'ref_type_id': '5eac219fe1202b7a383433db',
        'ref_data_code': 'SASU',
        'language_id': '5eac544ad4cb666637fe1353'
      },
      'ref_data_desc': 'SASU',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac549c1cb2a867dbd0abdd',
      'RefDataKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'ref_type_id': '5eac219fe1202b7a383433db',
        'ref_data_code': 'EIRL',
        'language_id': '5eac544ad4cb666637fe1353'
      },
      'ref_data_desc': 'EIRL',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac549c1cb2a867dbd0abdf',
      'RefDataKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'ref_type_id': '5eac219fe1202b7a383433db',
        'ref_data_code': 'SA',
        'language_id': '5eac544ad4cb666637fe1353'
      },
      'ref_data_desc': 'SA',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac549c1cb2a867dbd0abde',
      'RefDataKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'ref_type_id': '5eac219fe1202b7a383433db',
        'ref_data_code': 'EIRL',
        'language_id': '5eac544ad4cb666637fe1354'
      },
      'ref_data_desc': 'EIRL',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac549c1cb2a867dbd0abe0',
      'RefDataKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'ref_type_id': '5eac219fe1202b7a383433db',
        'ref_data_code': 'SA',
        'language_id': '5eac544ad4cb666637fe1354'
      },
      'ref_data_desc': 'SA',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac549c1cb2a867dbd0abe1',
      'RefDataKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'ref_type_id': '5eac219fe1202b7a383433dc',
        'ref_data_code': 'PRS',
        'language_id': '5eac544ad4cb666637fe1353'
      },
      'ref_data_desc': 'Président',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac549c1cb2a867dbd0abe2',
      'RefDataKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'ref_type_id': '5eac219fe1202b7a383433dc',
        'ref_data_code': 'PRS',
        'language_id': '5eac544ad4cb666637fe1354'
      },
      'ref_data_desc': 'President',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac549c1cb2a867dbd0abe3',
      'RefDataKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'ref_type_id': '5eac219fe1202b7a383433dc',
        'ref_data_code': 'MAN',
        'language_id': '5eac544ad4cb666637fe1353'
      },
      'ref_data_desc': 'Gérant',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac549c1cb2a867dbd0abe5',
      'RefDataKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'ref_type_id': '5eac219fe1202b7a383433dc',
        'ref_data_code': 'DIR',
        'language_id': '5eac544ad4cb666637fe1353'
      },
      'ref_data_desc': 'Directeur',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac549c1cb2a867dbd0abe4',
      'RefDataKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'ref_type_id': '5eac219fe1202b7a383433dc',
        'ref_data_code': 'MAN',
        'language_id': '5eac544ad4cb666637fe1354'
      },
      'ref_data_desc': 'Manager',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac549c1cb2a867dbd0abe6',
      'RefDataKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'ref_type_id': '5eac219fe1202b7a383433dc',
        'ref_data_code': 'DIR',
        'language_id': '5eac544ad4cb666637fe1354'
      },
      'ref_data_desc': 'Director',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac549c1cb2a867dbd0abe7',
      'RefDataKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'ref_type_id': '5eac219fe1202b7a383433dc',
        'ref_data_code': 'ADM',
        'language_id': '5eac544ad4cb666637fe1353'
      },
      'ref_data_desc': 'Responsable Administratif',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac549c1cb2a867dbd0abe8',
      'RefDataKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'ref_type_id': '5eac219fe1202b7a383433dc',
        'ref_data_code': 'ADM',
        'language_id': '5eac544ad4cb666637fe1354'
      },
      'ref_data_desc': 'Administration Manager',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac549d1cb2a867dbd0abe9',
      'RefDataKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'ref_type_id': '5eac219fe1202b7a383433dc',
        'ref_data_code': 'BA',
        'language_id': '5eac544ad4cb666637fe1353'
      },
      'ref_data_desc': 'Business Developer',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac549d1cb2a867dbd0abea',
      'RefDataKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'ref_type_id': '5eac219fe1202b7a383433dc',
        'ref_data_code': 'BA',
        'language_id': '5eac544ad4cb666637fe1354'
      },
      'ref_data_desc': 'Business Developer',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac549d1cb2a867dbd0abfc',
      'RefDataKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'ref_type_id': '5eac219fe1202b7a383433de',
        'ref_data_code': 'ADMIN',
        'language_id': '5eac544ad4cb666637fe1354'
      },
      'ref_data_desc': 'Administrator',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac549d1cb2a867dbd0abfd',
      'RefDataKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'ref_type_id': '5eac219fe1202b7a383433de',
        'ref_data_code': 'MAN',
        'language_id': '5eac544ad4cb666637fe1353'
      },
      'ref_data_desc': 'Manageur',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac549d1cb2a867dbd0abfb',
      'RefDataKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'ref_type_id': '5eac219fe1202b7a383433de',
        'ref_data_code': 'ADMIN',
        'language_id': '5eac544ad4cb666637fe1353'
      },
      'ref_data_desc': 'Administrateur',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac549d1cb2a867dbd0abfe',
      'RefDataKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'ref_type_id': '5eac219fe1202b7a383433de',
        'ref_data_code': 'MAN',
        'language_id': '5eac544ad4cb666637fe1354'
      },
      'ref_data_desc': 'Manager',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac549d1cb2a867dbd0abff',
      'RefDataKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'ref_type_id': '5eac219fe1202b7a383433de',
        'ref_data_code': 'ASSIST',
        'language_id': '5eac544ad4cb666637fe1353'
      },
      'ref_data_desc': 'Administratif',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac549d1cb2a867dbd0ac00',
      'RefDataKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'ref_type_id': '5eac219fe1202b7a383433de',
        'ref_data_code': 'ASSIST',
        'language_id': '5eac544ad4cb666637fe1354'
      },
      'ref_data_desc': 'Administration',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac549d1cb2a867dbd0ac01',
      'RefDataKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'ref_type_id': '5eac219fe1202b7a383433de',
        'ref_data_code': 'SALES',
        'language_id': '5eac544ad4cb666637fe1353'
      },
      'ref_data_desc': 'Business Developer',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac549d1cb2a867dbd0ac02',
      'RefDataKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'ref_type_id': '5eac219fe1202b7a383433de',
        'ref_data_code': 'COLLAB',
        'language_id': '5eac544ad4cb666637fe1353'
      },
      'ref_data_desc': 'Collaborateur',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac549d1cb2a867dbd0ac03',
      'RefDataKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'ref_type_id': '5eac219fe1202b7a383433de',
        'ref_data_code': 'SALES',
        'language_id': '5eac544ad4cb666637fe1354'
      },
      'ref_data_desc': 'Business Developer',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac549d1cb2a867dbd0ac04',
      'RefDataKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'ref_type_id': '5eac219fe1202b7a383433de',
        'ref_data_code': 'COLLAB',
        'language_id': '5eac544ad4cb666637fe1354'
      },
      'ref_data_desc': 'Collaborator',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac549d1cb2a867dbd0ac06',
      'RefDataKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'ref_type_id': '5eac219fe1202b7a383433de',
        'ref_data_code': 'CAND',
        'language_id': '5eac544ad4cb666637fe1354'
      },
      'ref_data_desc': 'Candidate',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac549d1cb2a867dbd0ac05',
      'RefDataKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'ref_type_id': '5eac219fe1202b7a383433de',
        'ref_data_code': 'CAND',
        'language_id': '5eac544ad4cb666637fe1353'
      },
      'ref_data_desc': 'Candidat',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eb037bcdfcb1e2b68b440da',
      'RefDataKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'ref_type_id': '5eac219fe1202b7a383433dc',
        'ref_data_code': 'test',
        'language_id': '5eac544ad4cb666637fe1353'
      },
      'ref_data_desc': 'test',
      '__v': 0
    }
  ],
  'translateall': [
    {
      'status': 'A',
      '_id': '5eac5d3c99b4ae67413348f4',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'login.sellanguage'
      },
      'translate_content': 'Langue',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3c99b4ae67413348f5',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'login.loginto'
      },
      'translate_content': 'Connectez-vous à votre compte',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3c99b4ae67413348f6',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'login.loginto'
      },
      'translate_content': 'Login to your account',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3c99b4ae67413348f7',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'login.loginnow'
      },
      'translate_content': 'Connecte-toi maintenant',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3c99b4ae67413348f9',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'login.loginnow'
      },
      'translate_content': 'Login now',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3c99b4ae67413348f8',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'login.sellanguage'
      },
      'translate_content': 'Language',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3c99b4ae67413348fa',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'login.email'
      },
      'translate_content': 'Adresse mail',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3c99b4ae67413348fb',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'login.email'
      },
      'translate_content': 'Email adress',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3c99b4ae67413348fc',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'login.password'
      },
      'translate_content': 'Mot de passe',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3c99b4ae67413348fd',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'login.password'
      },
      'translate_content': 'Password',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3c99b4ae67413348fe',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'login.lostpwd'
      },
      'translate_content': 'Mot de passe oublié',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3c99b4ae67413348ff',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'login.lostpwd'
      },
      'translate_content': 'Forget password',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3c99b4ae6741334900',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'login.noaccount'
      },
      'translate_content': 'Je n`\'ai pas de compte',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3c99b4ae6741334901',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'login.noaccount'
      },
      'translate_content': 'Don\'t have an account',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3c99b4ae6741334902',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'login.signin'
      },
      'translate_content': 'Se connecter',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3c99b4ae6741334903',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'login.signin'
      },
      'translate_content': 'Sign In',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3c99b4ae6741334904',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'login.invalidemail'
      },
      'translate_content': 'Email invalide',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3c99b4ae6741334905',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'login.invalidemail'
      },
      'translate_content': 'Invalid Email',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3c99b4ae6741334906',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'login.invalidpwd'
      },
      'translate_content': 'Mot de passe invalide',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3d99b4ae6741334907',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'login.invalidpwd'
      },
      'translate_content': 'Invalid Password',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3d99b4ae6741334908',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'login.reqfield'
      },
      'translate_content': 'Champ obligatoire',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3d99b4ae6741334909',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'login.reqfield'
      },
      'translate_content': 'Required field',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3d99b4ae674133490a',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'login.getstarted'
      },
      'translate_content': 'Commencez gratuitement',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3d99b4ae674133490b',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'login.getstarted'
      },
      'translate_content': 'Get started for free',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3d99b4ae674133490c',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'login.get3free'
      },
      'translate_content': 'Obtenez 3 fonctionnalités gratuites',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3d99b4ae674133490d',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'login.createacc'
      },
      'translate_content': 'Créer un compte',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3d99b4ae674133490e',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'login.get3free'
      },
      'translate_content': 'Get 3 free features',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3d99b4ae674133490f',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'login.createacc'
      },
      'translate_content': 'Create Account',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3d99b4ae6741334911',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'login.haveaccount'
      },
      'translate_content': 'Already have account?',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3d99b4ae6741334910',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'login.haveaccount'
      },
      'translate_content': 'Vous avez déjà un compte?',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3d99b4ae6741334912',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'forgotpwd.recovery'
      },
      'translate_content': 'Récuperation de mot de passe',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3d99b4ae6741334913',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'forgotpwd.recovery'
      },
      'translate_content': 'Password Recovery',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3d99b4ae6741334914',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'forgotpwd.receivemail'
      },
      'translate_content': 'Recevoir un mail pour récupérer le mot de passe',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3d99b4ae6741334915',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'forgotpwd.receivemail'
      },
      'translate_content': 'Receive a mail to recover forgot password',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3d99b4ae6741334916',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'forgotpwd.email'
      },
      'translate_content': 'Adresse mail',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3d99b4ae6741334917',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'forgotpwd.email'
      },
      'translate_content': 'Email adress',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3d99b4ae6741334918',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'forgotpwd.invalidmail'
      },
      'translate_content': 'Email invalide',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3d99b4ae6741334919',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'forgotpwd.invalidmail'
      },
      'translate_content': 'Invalid mail',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3d99b4ae674133491a',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'forgotpwd.recoverpw'
      },
      'translate_content': 'Récupérer mon mot de passe',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3d99b4ae674133491b',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'forgotpwd.recoverpw'
      },
      'translate_content': 'Recover my password',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3d99b4ae674133491c',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'forgotpwd.back'
      },
      'translate_content': 'Retour',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3d99b4ae674133491d',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'forgotpwd.back'
      },
      'translate_content': 'Back',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3d99b4ae674133491e',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'forgotpwd.reqfield'
      },
      'translate_content': 'Champ obligatoire',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3d99b4ae674133491f',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'forgotpwd.reqfield'
      },
      'translate_content': 'Required field',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3d99b4ae6741334920',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'register.getstarted'
      },
      'translate_content': 'Commencez gratuitement',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3d99b4ae6741334921',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'register.getstarted'
      },
      'translate_content': 'Get started for free',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3d99b4ae6741334922',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'register.get3free'
      },
      'translate_content': 'Obtenez 3 fonctionnalités gratuites',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3d99b4ae6741334923',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'register.get3free'
      },
      'translate_content': 'Get 3 free features',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3d99b4ae6741334924',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'register.company'
      },
      'translate_content': 'Nom de la companie',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3d99b4ae6741334926',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'register.email'
      },
      'translate_content': 'Adresse mail',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3d99b4ae6741334925',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'register.company'
      },
      'translate_content': 'Company name',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3d99b4ae6741334927',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'register.email'
      },
      'translate_content': 'Email adress',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3d99b4ae6741334928',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'register.pw'
      },
      'translate_content': 'Mot de passe',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3d99b4ae6741334929',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'register.pw'
      },
      'translate_content': 'Password',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3d99b4ae674133492a',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'register.reqfield'
      },
      'translate_content': 'Champ obligatoire',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3e99b4ae674133492b',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'register.reqfield'
      },
      'translate_content': 'Required field',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3e99b4ae674133492c',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'register.createacct'
      },
      'translate_content': 'Crée un compte',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3e99b4ae674133492d',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'register.createacct'
      },
      'translate_content': 'Create an account',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3e99b4ae674133492e',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'register.haveaccount'
      },
      'translate_content': 'Vous avez déja un compte ?',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3e99b4ae674133492f',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'register.haveaccount'
      },
      'translate_content': 'Already have an account  ?',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3e99b4ae6741334930',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'register.signin'
      },
      'translate_content': 'Se connecter',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3e99b4ae6741334931',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'register.signin'
      },
      'translate_content': 'Sign in',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3e99b4ae6741334932',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'register.invalidemail'
      },
      'translate_content': 'Email invalide',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3e99b4ae6741334933',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'register.invalidemail'
      },
      'translate_content': 'Invalid mail',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3e99b4ae6741334934',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'register.registeraccount'
      },
      'translate_content': 'Merci d\'avoir enregistré votre compte servicima !',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3e99b4ae6741334935',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'register.registeraccount'
      },
      'translate_content': 'Thank you for registering your servicima account !',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3e99b4ae6741334936',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'register.followinstruc'
      },
      'translate_content': 'Veuillez suivre les instructions que nous venons de vous envoyer par mail à',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3e99b4ae6741334937',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'register.followinstruc'
      },
      'translate_content': 'Please follow the instructions we just emailed to',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3e99b4ae6741334939',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'activation.valid'
      },
      'translate_content': 'Activation code validation',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3e99b4ae6741334938',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'activation.valid'
      },
      'translate_content': 'Validation du code d\'activation',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3e99b4ae674133493a',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'activation.subconfirm'
      },
      'translate_content': 'Confirmez votre abonnement',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3e99b4ae674133493b',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'activation.subconfirm'
      },
      'translate_content': 'Confirm your subscription',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3e99b4ae674133493c',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'activation.entercode'
      },
      'translate_content': 'Veuillez entrer votre code d\'activation',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3e99b4ae674133493d',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'activation.entercode'
      },
      'translate_content': 'Please enter your activation code',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3e99b4ae674133493e',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'activation.notreceivecode'
      },
      'translate_content': 'Not receiving the verification code ?',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3e99b4ae674133493f',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'activation.notreceivecode'
      },
      'translate_content': 'Ne pas recevoir le code de vérification ?',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3e99b4ae6741334940',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'activation.tryagain'
      },
      'translate_content': 'Réessayer',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3e99b4ae6741334941',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'activation.tryagain'
      },
      'translate_content': 'Try again',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3e99b4ae6741334942',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'activation.confirm'
      },
      'translate_content': 'Confirmer',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3e99b4ae6741334943',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'activation.confirm'
      },
      'translate_content': 'Confirm',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3e99b4ae6741334944',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'general.email'
      },
      'translate_content': 'Courriel',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3e99b4ae6741334945',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'general.email'
      },
      'translate_content': 'Email',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3e99b4ae6741334946',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'general.companyname'
      },
      'translate_content': 'Nom de l\'entreprise',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3e99b4ae6741334947',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'general.companyname'
      },
      'translate_content': 'Company name',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3e99b4ae6741334948',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'general.registcountry'
      },
      'translate_content': 'Pays d\'enregistrement',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3e99b4ae6741334949',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'general.registcountry'
      },
      'translate_content': 'Registration country',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3e99b4ae674133494a',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'general.registnbr'
      },
      'translate_content': 'Matricule',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3e99b4ae674133494b',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'general.registnbr'
      },
      'translate_content': 'Registration number',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3f99b4ae674133494c',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'general.activitycode'
      },
      'translate_content': 'Code d\'activité',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3f99b4ae674133494d',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'general.activitycode'
      },
      'translate_content': 'Activity code',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3f99b4ae674133494e',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'general.activitydesc'
      },
      'translate_content': 'Description d\'activité',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3f99b4ae674133494f',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'general.activitydesc'
      },
      'translate_content': 'Activity description',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3f99b4ae6741334950',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'general.address'
      },
      'translate_content': 'Adresse',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3f99b4ae6741334951',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'general.address'
      },
      'translate_content': 'Address',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3f99b4ae6741334952',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'general.legalform'
      },
      'translate_content': 'Forme juridique',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3f99b4ae6741334953',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'general.legalform'
      },
      'translate_content': 'Legal form',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3f99b4ae6741334954',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'general.currency'
      },
      'translate_content': 'Devise',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3f99b4ae6741334955',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'general.currency'
      },
      'translate_content': 'Currency',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3f99b4ae6741334956',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'general.vatnumber'
      },
      'translate_content': 'Numéro TVA',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3f99b4ae6741334957',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'general.vatnumber'
      },
      'translate_content': 'VAT number',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3f99b4ae6741334958',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'general.capital'
      },
      'translate_content': 'Capital',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3f99b4ae6741334959',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'general.capital'
      },
      'translate_content': 'Capital',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3f99b4ae674133495a',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'general.zipcode'
      },
      'translate_content': 'Code postale',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3f99b4ae674133495b',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'general.zipcode'
      },
      'translate_content': 'ZIP code',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3f99b4ae674133495c',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'general.country'
      },
      'translate_content': 'Pays',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3f99b4ae674133495d',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'general.country'
      },
      'translate_content': 'Country',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3f99b4ae674133495e',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'general.city'
      },
      'translate_content': 'Ville',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3f99b4ae6741334960',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'general.employeenbr'
      },
      'translate_content': 'Nombre d\'employés',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3f99b4ae674133495f',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'general.city'
      },
      'translate_content': 'City',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3f99b4ae6741334961',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'general.employeenbr'
      },
      'translate_content': 'Employee number',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3f99b4ae6741334962',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'general.next'
      },
      'translate_content': 'Suivant',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3f99b4ae6741334963',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'general.next'
      },
      'translate_content': 'Next',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3f99b4ae6741334964',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'contact.email'
      },
      'translate_content': 'Email de contact',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3f99b4ae6741334965',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'contact.email'
      },
      'translate_content': 'Contact email',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3f99b4ae6741334966',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'contact.website'
      },
      'translate_content': 'Site web',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3f99b4ae6741334967',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'contact.website'
      },
      'translate_content': 'Web site',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3f99b4ae6741334968',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'contact.phone'
      },
      'translate_content': 'Télephone',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3f99b4ae6741334969',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'contact.phone'
      },
      'translate_content': 'Phone',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3f99b4ae674133496a',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'contact.fax'
      },
      'translate_content': 'Fax',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3f99b4ae674133496b',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'contact.fax'
      },
      'translate_content': 'Fax',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3f99b4ae674133496c',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'contact.youtubech'
      },
      'translate_content': 'Chaine youtube',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d3f99b4ae674133496d',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'contact.youtubech'
      },
      'translate_content': 'Youtube channel',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d4099b4ae674133496e',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'contact.linkedinpg'
      },
      'translate_content': 'Page linkedin',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d4099b4ae674133496f',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'contact.linkedinpg'
      },
      'translate_content': 'Linkedin page',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d4099b4ae6741334970',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'contact.fbpage'
      },
      'translate_content': 'Page facebook',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d4099b4ae6741334971',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'contact.fbpage'
      },
      'translate_content': 'Facebook page',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d4099b4ae6741334972',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'contact.twitteracc'
      },
      'translate_content': 'Compte twitter',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d4099b4ae6741334973',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'contact.twitteracc'
      },
      'translate_content': 'Twitter account',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d4099b4ae6741334974',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'contact.previous'
      },
      'translate_content': 'Précedant',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d4099b4ae6741334975',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'contact.previous'
      },
      'translate_content': 'Previous',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d4099b4ae6741334976',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'contact.next'
      },
      'translate_content': 'Suivant',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d4099b4ae6741334977',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'contact.next'
      },
      'translate_content': 'Next',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d4099b4ae6741334978',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'staff.commercial'
      },
      'translate_content': 'Contact commercial',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d4099b4ae6741334979',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'staff.commercial'
      },
      'translate_content': 'Commercial contact',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d4099b4ae674133497a',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'staff.lastname'
      },
      'translate_content': 'Nom',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d4099b4ae674133497b',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'staff.lastname'
      },
      'translate_content': 'Last name',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d4099b4ae674133497c',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'staff.firstname'
      },
      'translate_content': 'First name',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d4099b4ae674133497d',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'staff.firstname'
      },
      'translate_content': 'Prénom',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d4099b4ae674133497e',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'staff.gender'
      },
      'translate_content': 'Sexe',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d4099b4ae674133497f',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'staff.gender'
      },
      'translate_content': 'Gender',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d4099b4ae6741334980',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'staff.cellphone'
      },
      'translate_content': 'Portable',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d4099b4ae6741334981',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'staff.cellphone'
      },
      'translate_content': 'Cellphone',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d4099b4ae6741334982',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'staff.email'
      },
      'translate_content': 'Courriel',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d4099b4ae6741334983',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'staff.email'
      },
      'translate_content': 'Email',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d4099b4ae6741334984',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'staff.administrative'
      },
      'translate_content': 'Contact administratif',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d4099b4ae6741334985',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'staff.administrative'
      },
      'translate_content': 'Administrative contact',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d4099b4ae6741334986',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'staff.phone'
      },
      'translate_content': 'Télephone fixe',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d4099b4ae6741334987',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'staff.phone'
      },
      'translate_content': 'Phone',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d4099b4ae6741334988',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'staff.mailaddress'
      },
      'translate_content': 'Adresse mail',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d4099b4ae6741334989',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'staff.mailaddress'
      },
      'translate_content': 'Mail address',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d4099b4ae674133498a',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'staff.previous'
      },
      'translate_content': 'Précedant',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d4099b4ae674133498b',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'staff.previous'
      },
      'translate_content': 'Previous',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d4099b4ae674133498c',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1353',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'staff.next'
      },
      'translate_content': 'Suivant',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5eac5d4099b4ae674133498d',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'language_id': '5eac544ad4cb666637fe1354',
        'module_id': '5eac5486a0cdc666e9948d16',
        'translate_code': 'staff.next'
      },
      'translate_content': 'Next',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5ed90b93b57db5595c1a09ff',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'module_id': '5eac5486a0cdc666e9948d16',
        'language_id': '5eac544ad4cb666637fe1353',
        'translate_code': 'manager.create'
      },
      'translate_content': 'Créer votre compte manager',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5ed90b9ab57db5595c1a0a00',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'module_id': '5eac5486a0cdc666e9948d16',
        'language_id': '5eac544ad4cb666637fe1354',
        'translate_code': 'manager.create'
      },
      'translate_content': 'Create your manager account',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5ed90ba6b57db5595c1a0a01',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'module_id': '5eac5486a0cdc666e9948d16',
        'language_id': '5eac544ad4cb666637fe1353',
        'translate_code': 'manager.reqfield'
      },
      'translate_content': 'Champ obligatoire',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5ed90bb1b57db5595c1a0a02',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'module_id': '5eac5486a0cdc666e9948d16',
        'language_id': '5eac544ad4cb666637fe1354',
        'translate_code': 'manager.reqfield'
      },
      'translate_content': 'Required field',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5ed90bbeb57db5595c1a0a03',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'module_id': '5eac5486a0cdc666e9948d16',
        'language_id': '5eac544ad4cb666637fe1353',
        'translate_code': 'contact.create'
      },
      'translate_content': 'Créer votre contact d\'entreprise',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5ed90bd0b57db5595c1a0a04',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'module_id': '5eac5486a0cdc666e9948d16',
        'language_id': '5eac544ad4cb666637fe1354',
        'translate_code': 'contact.create'
      },
      'translate_content': 'Create your contact company',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5ed90bdeb57db5595c1a0a05',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'module_id': '5eac5486a0cdc666e9948d16',
        'language_id': '5eac544ad4cb666637fe1353',
        'translate_code': 'contact.invalidnbr'
      },
      'translate_content': 'Télephone invalide',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5ed90be7b57db5595c1a0a06',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'module_id': '5eac5486a0cdc666e9948d16',
        'language_id': '5eac544ad4cb666637fe1354',
        'translate_code': 'contact.invalidnbr'
      },
      'translate_content': 'Invalid phone',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5ed9111db57db5595c1a0a07',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'module_id': '5eac5486a0cdc666e9948d16',
        'language_id': '5eac544ad4cb666637fe1353',
        'translate_code': 'manager.previous'
      },
      'translate_content': 'Précedant',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5ed91123b57db5595c1a0a08',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'module_id': '5eac5486a0cdc666e9948d16',
        'language_id': '5eac544ad4cb666637fe1354',
        'translate_code': 'manager.previous'
      },
      'translate_content': 'Previous',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5ed9112eb57db5595c1a0a09',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'module_id': '5eac5486a0cdc666e9948d16',
        'language_id': '5eac544ad4cb666637fe1353',
        'translate_code': 'manager.next'
      },
      'translate_content': 'Valider',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5ed91137b57db5595c1a0a0a',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'module_id': '5eac5486a0cdc666e9948d16',
        'language_id': '5eac544ad4cb666637fe1354',
        'translate_code': 'manager.next'
      },
      'translate_content': 'Done',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5edf9c5e4662b426644333ae',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'module_id': '5eac5486a0cdc666e9948d16',
        'language_id': '5eac544ad4cb666637fe1354',
        'translate_code': 'manager.search'
      },
      'translate_content': 'Search',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5edf9c6f4662b426644333af',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'module_id': '5eac5486a0cdc666e9948d16',
        'language_id': '5eac544ad4cb666637fe1353',
        'translate_code': 'manager.search'
      },
      'translate_content': 'chercher',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5edf9c8b4662b426644333b0',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'module_id': '5eac5486a0cdc666e9948d16',
        'language_id': '5eac544ad4cb666637fe1353',
        'translate_code': 'general.search'
      },
      'translate_content': 'chercher',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5edf9c974662b426644333b1',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'module_id': '5eac5486a0cdc666e9948d16',
        'language_id': '5eac544ad4cb666637fe1354',
        'translate_code': 'general.search'
      },
      'translate_content': 'search',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5edf9ccf4662b426644333b2',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'module_id': '5eac5486a0cdc666e9948d16',
        'language_id': '5eac544ad4cb666637fe1354',
        'translate_code': 'login.invalidcredentials'
      },
      'translate_content': ' Email / password invalid',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5edf9cfe4662b426644333b3',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'module_id': '5eac5486a0cdc666e9948d16',
        'language_id': '5eac544ad4cb666637fe1353',
        'translate_code': 'login.invalidcredentials'
      },
      'translate_content': ' Email / mot de passe non incorrect',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5edf9d1a4662b426644333b4',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'module_id': '5eac5486a0cdc666e9948d16',
        'language_id': '5eac544ad4cb666637fe1353',
        'translate_code': 'activation.codeInvalid'
      },
      'translate_content': ' code de validation incorrect',
      '__v': 0
    },
    {
      'status': 'A',
      '_id': '5edf9d274662b426644333b5',
      'TranslateKey': {
        'company_id': '5eac547eb3fbee0f5cad418d',
        'application_id': '5eac544a92809d7cd5dae21e',
        'module_id': '5eac5486a0cdc666e9948d16',
        'language_id': '5eac544ad4cb666637fe1354',
        'translate_code': 'activation.codeInvalid'
      },
      'translate_content': ' code invalid',
      '__v': 0
    }
  ],
  'messageall': []
};
