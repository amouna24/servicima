import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'wid-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  ELEMENT_DATA: any[] = [
    {
      'status': 'ACTIVE',
      '_id': '5ee760a4a82d9a4fc4849b45',
      'userKey': {
        'application_id': '5eac544a92809d7cd5dae21f',
        'email_address': 'walid.tenniche@widigital-group.com'
      },
      'company_email': 'walid.tenniche@widigital-group.com',
      'user_type': 'COMPANY',
      'first_name': 'WALID',
      'last_name': 'TENNICHE',
      'gender_id': 'M',
      'prof_phone': '',
      'cellphone_nbr': '',
      'language_id': '5eac544ad4cb666637fe1353',
      'title_id': 'PRS',
      'linkedin_url': '',
      'twitter_url': '',
      'youtube_url': '',
      'creation_date': '2020-06-15T11:51:00.890Z',
      'created_by': 'walid.tenniche@widigital-group.com',
      'update_date': '2020-06-19T10:26:12.322Z',
      'updated_by': 'walid.tenniche@widigital-group.com',
      '__v': 0
    },
    {
      'photo': {
        'data': null,
        'contentType': null
      },
      'status': 'ACTIVE',
      '_id': '5ee8daf7c02e7ccb6e8def59',
      'userKey': {
        'application_id': '5eac544a92809d7cd5dae21f',
        'email_address': 'imen.ammar@widigital-group.com'
      },
      'company_email': 'imen.ammar@widigital-group.com',
      'user_type': 'COMPANY',
      'first_name': 'AMMAR',
      'last_name': 'IMEN',
      'gender_id': 'F',
      'prof_phone': '525869741',
      'cellphone_nbr': '526895471',
      'language_id': '5eac544ad4cb666637fe1353',
      'title_id': 'PRS',
      'linkedin_url': 'www.linkedin.com',
      'twitter_url': 'www.twitter.com',
      'youtube_url': 'www.youtube.com',
      'creation_date': '2020-06-15T11:51:00.890Z',
      'created_by': 'imen.ammar@widigital-group.com',
      'update_date': '2020-06-19T09:48:08.746Z',
      'updated_by': 'imen.ammar@widigital-group.com',
      '__v': 0
    },
    {
      'status': 'ACTIVE',
      '_id': '5eeb8ca27611db7b1aeb097a',
      'userKey': {
        'application_id': '5eac544a92809d7cd5dae21f',
        'email_address': 'hsdfhdfsjdf@dkjsdfhsjdf.com'
      },
      'company_email': 'walid.tenniche@widigital-group.com',
      'user_type': 'COLLABORATOR',
      'first_name': 'dfsdf',
      'last_name': 'sdfsdf',
      'gender_id': 'M',
      'prof_phone': 'ddfsdfdq',
      'cellphone_nbr': 'sqdfqsdqsd',
      'language_id': '5eac544ad4cb666637fe1353',
      'title_id': 'PRS',
      'linkedin_url': 'sdfsdf',
      'twitter_url': '',
      'youtube_url': '',
      'creation_date': '2020-06-18T15:47:46.743Z',
      'created_by': 'walid.tenniche@widigital-group.com',
      'update_date': '2020-06-19T09:48:08.737Z',
      'updated_by': 'walid.tenniche@widigital-group.com',
      '__v': 0
    },
    {
      'status': 'ACTIVE',
      '_id': '5eec9e375184e16690cf8039',
      'userKey': {
        'application_id': '5eac544a92809d7cd5dae21f',
        'email_address': 'test@test.com'
      },
      'company_email': 'walid.tenniche@widigital-group.com',
      'user_type': 'CANDIDATE',
      'first_name': 'test',
      'last_name': 'test',
      'gender_id': 'M',
      'prof_phone': '5869',
      'cellphone_nbr': '5869',
      'language_id': '5eac544ad4cb666637fe1354',
      'title_id': 'BA',
      'linkedin_url': 'test',
      'twitter_url': 'test',
      'youtube_url': 'test',
      'creation_date': '2020-06-19T11:15:03.695Z',
      'created_by': 'walid.tenniche@widigital-group.com',
      'update_date': '2020-06-19T11:15:03.695Z',
      'updated_by': 'walid.tenniche@widigital-group.com',
      '__v': 0
    },
    {
      'photo': {
        'data': null,
        'contentType': null
      },
      'status': 'ACTIVE',
      '_id': '5ef3598811d5de1e5ca56718',
      'userKey': {
        'application_id': '5eac544a92809d7cd5dae21f',
        'email_address': 'dhia.othmen@widigital-group.com'
      },
      'company_email': 'dhia.othmen@widigital-group.com',
      'user_type': 'COMPANY',
      'first_name': 'Othmen',
      'last_name': 'Dhia',
      'gender_id': 'M',
      'prof_phone': '52020393',
      'cellphone_nbr': '',
      'language_id': '5eac544ad4cb666637fe1353',
      'title_id': 'MAN',
      'linkedin_url': '',
      'twitter_url': '',
      'youtube_url': '',
      'creation_date': '2020-06-24T13:47:52.565Z',
      'created_by': 'dhia.othmen@widigital-group.com',
      'update_date': '2020-07-02T08:17:10.674Z',
      'updated_by': 'dhia.othmen@widigital-group.com',
      '__v': 0
    },
    {
      'photo': {
        'data': null,
        'contentType': null
      },
      'status': 'ACTIVE',
      '_id': '5ef359a711d5de1e5ca56719',
      'userKey': {
        'application_id': '5eac544a92809d7cd5dae21f',
        'email_address': 'othmendhia@hotmail.fr'
      },
      'company_email': 'othmendhia@hotmail.fr',
      'user_type': 'COMPANY',
      'first_name': 'Dhia20',
      'last_name': 'Othmen',
      'gender_id': 'F',
      'prof_phone': '52020393',
      'cellphone_nbr': '',
      'language_id': '5eac544ad4cb666637fe1354',
      'title_id': 'DIR',
      'linkedin_url': 'linkedin',
      'twitter_url': '',
      'youtube_url': '',
      'creation_date': '2020-06-24T13:48:23.218Z',
      'created_by': 'othmendhia@hotmail.fr',
      'update_date': '2020-07-02T10:39:33.398Z',
      'updated_by': 'othmendhia@hotmail.fr',
      '__v': 0
    },
    {
      'status': 'ACTIVE',
      '_id': '5ef5fd3eb0cbad3d98b4a2ee',
      'userKey': {
        'application_id': '5eac544a92809d7cd5dae21f',
        'email_address': 'amine.sboui.1@esprit.tn'
      },
      'company_email': 'amine.sboui.1@esprit.tn',
      'user_type': 'COMPANY',
      'first_name': 'Amine',
      'last_name': 'Sboui',
      'gender_id': 'M',
      'prof_phone': '50783037',
      'cellphone_nbr': '',
      'language_id': '5eac544ad4cb666637fe1353',
      'title_id': 'PRS',
      'linkedin_url': '',
      'twitter_url': '',
      'youtube_url': '',
      'creation_date': '2020-06-26T13:50:54.667Z',
      'created_by': 'amine.sboui.1@esprit.tn',
      'update_date': '2020-06-26T13:50:54.667Z',
      'updated_by': 'amine.sboui.1@esprit.tn',
      '__v': 0
    },
    {
      'photo': {
        'data': null,
        'contentType': null
      },
      'status': 'ACTIVE',
      '_id': '5ef88f693e95bb1ab8c9478a',
      'userKey': {
        'application_id': '5eac544a92809d7cd5dae21f',
        'email_address': 'this.form.value.emailAddress'
      },
      'company_email': 'dhia.othmen@widigital-group.com',
      'user_type': 'COMPANY',
      'first_name': 'Dhia00',
      'last_name': 'o',
      'gender_id': 'M',
      'prof_phone': '',
      'cellphone_nbr': '',
      'language_id': '',
      'title_id': 'PRS',
      'linkedin_url': '',
      'twitter_url': '',
      'youtube_url': '',
      'creation_date': '2020-06-28T12:39:05.563Z',
      'created_by': 'dhia.othmen@widigital-group.com',
      'update_date': '2020-07-01T14:16:34.930Z',
      'updated_by': 'dhia.othmen@widigital-group.com',
      '__v': 0
    },
    {
      'photo': {
        'data': null,
        'contentType': null
      },
      'status': 'ACTIVE',
      '_id': '5efa0d30d5922048a03d5b2f',
      'userKey': {
        'application_id': '5eac544a92809d7cd5dae21f',
        'email_address': 'user212@yahoo.fr'
      },
      'company_email': 'dhia.othmen@widigital-group.com',
      'user_type': 'COMPANY',
      'first_name': 'User22',
      'last_name': '12',
      'gender_id': 'M',
      'prof_phone': '52020393',
      'cellphone_nbr': '',
      'language_id': '5eac544ad4cb666637fe1353',
      'title_id': 'MAN',
      'linkedin_url': '',
      'twitter_url': '',
      'youtube_url': '',
      'creation_date': '2020-06-29T15:48:00.454Z',
      'created_by': 'dhia.othmen@widigital-group.com',
      'update_date': '2020-07-01T09:06:07.586Z',
      'updated_by': 'dhia.othmen@widigital-group.com',
      '__v': 0
    },
    {
      'photo': {
        'data': null,
        'contentType': null
      },
      'status': 'ACTIVE',
      '_id': '5efa0db5d5922048a03d5b30',
      'userKey': {
        'application_id': '5eac544a92809d7cd5dae21f',
        'email_address': 'dhia.101@yahoo.fr'
      },
      'company_email': 'othmendhia@hotmail.fr',
      'user_type': 'COMPANY',
      'first_name': 'Dhia',
      'last_name': '1234',
      'gender_id': 'M',
      'prof_phone': '',
      'cellphone_nbr': '',
      'language_id': '5eac544ad4cb666637fe1352',
      'title_id': 'PRS',
      'linkedin_url': '',
      'twitter_url': '',
      'youtube_url': '',
      'creation_date': '2020-06-29T15:50:13.919Z',
      'created_by': 'othmendhia@hotmail.fr',
      'update_date': '2020-07-02T09:44:49.124Z',
      'updated_by': 'othmendhia@hotmail.fr',
      '__v': 0
    },
    {
      'photo': {
        'data': null,
        'contentType': null
      },
      'status': 'ACTIVE',
      '_id': '5efa0decd5922048a03d5b31',
      'userKey': {
        'application_id': '5eac544a92809d7cd5dae21f',
        'email_address': 'user103103@yahoo.fr'
      },
      'company_email': 'othmendhia@hotmail.fr',
      'user_type': 'COMPANY',
      'first_name': 'user',
      'last_name': '103',
      'gender_id': 'M',
      'prof_phone': '',
      'cellphone_nbr': '',
      'language_id': '5eac544ad4cb666637fe1353',
      'title_id': 'PRS',
      'linkedin_url': '',
      'twitter_url': '',
      'youtube_url': '',
      'creation_date': '2020-06-29T15:51:08.065Z',
      'created_by': 'othmendhia@hotmail.fr',
      'update_date': '2020-06-30T12:38:40.997Z',
      'updated_by': 'othmendhia@hotmail.fr',
      '__v': 0
    },
    {
      'photo': {
        'data': null,
        'contentType': null
      },
      'status': 'ACTIVE',
      '_id': '5efa1262d5922048a03d5b32',
      'userKey': {
        'application_id': '5eac544a92809d7cd5dae21f',
        'email_address': 'user83@yahoo.fr'
      },
      'company_email': 'dhia.othmen@widigital-group.com',
      'user_type': 'COMPANY',
      'first_name': 'user',
      'last_name': '83',
      'gender_id': 'M',
      'prof_phone': '',
      'cellphone_nbr': '',
      'language_id': '5eac544ad4cb666637fe1353',
      'title_id': 'PRS',
      'linkedin_url': '',
      'twitter_url': '',
      'youtube_url': '',
      'creation_date': '2020-06-29T16:10:10.808Z',
      'created_by': 'dhia.othmen@widigital-group.com',
      'update_date': '2020-07-02T08:17:29.650Z',
      'updated_by': 'dhia.othmen@widigital-group.com',
      '__v': 0
    },
    {
      'photo': {
        'data': null,
        'contentType': null
      },
      'status': 'ACTIVE',
      '_id': '5efb53cf0510c73860591361',
      'userKey': {
        'application_id': '5eac544a92809d7cd5dae21f',
        'email_address': 'dhia.othmanee@yahoo.fr'
      },
      'company_email': 'othmendhia@hotmail.fr',
      'user_type': 'COMPANY',
      'first_name': 'Dhia',
      'last_name': 'othmanee',
      'gender_id': 'M',
      'prof_phone': '',
      'cellphone_nbr': '',
      'language_id': '5eac544ad4cb666637fe1353',
      'title_id': 'PRS',
      'linkedin_url': '',
      'twitter_url': '',
      'youtube_url': '',
      'creation_date': '2020-06-30T15:01:35.118Z',
      'created_by': 'othmendhia@hotmail.fr',
      'update_date': '2020-07-02T09:27:42.029Z',
      'updated_by': 'othmendhia@hotmail.fr',
      '__v': 0
    },
    {
      'status': 'ACTIVE',
      '_id': '5efc625d7c49793bec9317c7',
      'userKey': {
        'application_id': '5eac544a92809d7cd5dae21f',
        'email_address': 'user400@yahoo.fr'
      },
      'company_email': 'othmendhia@hotmail.fr',
      'user_type': 'COLLABORATOR',
      'first_name': 'user',
      'last_name': '4000',
      'gender_id': 'M',
      'prof_phone': '',
      'cellphone_nbr': '',
      'language_id': '5eac544ad4cb666637fe1353',
      'title_id': 'MAN',
      'linkedin_url': '',
      'twitter_url': '',
      'youtube_url': '',
      'creation_date': '2020-07-01T10:15:57.783Z',
      'created_by': 'othmendhia@hotmail.fr',
      'update_date': '2020-07-01T10:15:57.783Z',
      'updated_by': 'othmendhia@hotmail.fr',
      '__v': 0
    },
    {
      'photo': {
        'data': null,
        'contentType': null
      },
      'status': 'ACTIVE',
      '_id': '5efc64167c49793bec9317cb',
      'userKey': {
        'application_id': '5eac544a92809d7cd5dae21f',
        'email_address': 'dhia.othmen^outlokk.fr'
      },
      'company_email': 'othmendhia@hotmail.fr',
      'user_type': 'CANDIDATE',
      'first_name': 'Dhia14',
      'last_name': 'OTHMEN',
      'gender_id': 'M',
      'prof_phone': '',
      'cellphone_nbr': '',
      'language_id': '5eac544ad4cb666637fe1353',
      'title_id': 'PRS',
      'linkedin_url': '',
      'twitter_url': '',
      'youtube_url': '',
      'creation_date': '2020-07-01T10:23:18.773Z',
      'created_by': 'othmendhia@hotmail.fr',
      'update_date': '2020-07-02T09:40:31.853Z',
      'updated_by': 'othmendhia@hotmail.fr',
      '__v': 0
    },
    {
      'status': 'ACTIVE',
      '_id': '5efc64547c49793bec9317cc',
      'userKey': {
        'application_id': '5eac544a92809d7cd5dae21f',
        'email_address': 'othmendhia@yahoo.fr'
      },
      'company_email': 'othmendhia@hotmail.fr',
      'user_type': 'STAFF',
      'first_name': 'dhia',
      'last_name': 'othmen',
      'gender_id': 'M',
      'prof_phone': '',
      'cellphone_nbr': '',
      'language_id': '5eac544ad4cb666637fe1353',
      'title_id': 'DIR',
      'linkedin_url': '',
      'twitter_url': '',
      'youtube_url': '',
      'creation_date': '2020-07-01T10:24:20.747Z',
      'created_by': 'othmendhia@hotmail.fr',
      'update_date': '2020-07-01T10:24:20.747Z',
      'updated_by': 'othmendhia@hotmail.fr',
      '__v': 0
    },
    {
      'photo': {
        'data': null,
        'contentType': null
      },
      'status': 'ACTIVE',
      '_id': '5efc659f7c49793bec9317cd',
      'userKey': {
        'application_id': '5eac544a92809d7cd5dae21f',
        'email_address': 'user5@yahoo.fr'
      },
      'company_email': 'dhia.othmen@widigital-group.com',
      'user_type': 'CANDIDATE',
      'first_name': 'user',
      'last_name': '5',
      'gender_id': 'M',
      'prof_phone': '',
      'cellphone_nbr': '',
      'language_id': '5eac544ad4cb666637fe1353',
      'title_id': 'MAN',
      'linkedin_url': '',
      'twitter_url': '',
      'youtube_url': '',
      'creation_date': '2020-07-01T10:29:51.557Z',
      'created_by': 'dhia.othmen@widigital-group.com',
      'update_date': '2020-07-01T12:36:24.241Z',
      'updated_by': 'dhia.othmen@widigital-group.com',
      '__v': 0
    },
    {
      'status': 'ACTIVE',
      '_id': '5efc67737c49793bec9317d0',
      'userKey': {
        'application_id': '5eac544a92809d7cd5dae21f',
        'email_address': 'user22@gmail.com'
      },
      'company_email': 'othmendhia@hotmail.fr',
      'user_type': 'CANDIDATE',
      'first_name': 'user22',
      'last_name': '00',
      'gender_id': 'M',
      'prof_phone': '',
      'cellphone_nbr': '',
      'language_id': '5eac544ad4cb666637fe1353',
      'title_id': 'MAN',
      'linkedin_url': '',
      'twitter_url': '',
      'youtube_url': '',
      'creation_date': '2020-07-01T10:37:39.590Z',
      'created_by': 'othmendhia@hotmail.fr',
      'update_date': '2020-07-01T10:37:39.590Z',
      'updated_by': 'othmendhia@hotmail.fr',
      '__v': 0
    },
    {
      'status': 'ACTIVE',
      '_id': '5efc82557c49793bec9317d3',
      'userKey': {
        'application_id': '5eac544a92809d7cd5dae21f',
        'email_address': 'aminesboui@yahoo.fr'
      },
      'company_email': 'othmendhia@hotmail.fr',
      'user_type': 'COLLABORATOR',
      'first_name': 'amine ',
      'last_name': 'sboui',
      'gender_id': 'M',
      'prof_phone': '',
      'cellphone_nbr': '',
      'language_id': '5eac544ad4cb666637fe1353',
      'title_id': 'MAN',
      'linkedin_url': '',
      'twitter_url': '',
      'youtube_url': '',
      'creation_date': '2020-07-01T12:32:21.792Z',
      'created_by': 'othmendhia@hotmail.fr',
      'update_date': '2020-07-01T12:32:21.792Z',
      'updated_by': 'othmendhia@hotmail.fr',
      '__v': 0
    },
    {
      'status': 'ACTIVE',
      '_id': '5efc827a7c49793bec9317d4',
      'userKey': {
        'application_id': '5eac544a92809d7cd5dae21f',
        'email_address': 'ghaziaabdallah@yahoo.fr'
      },
      'company_email': 'othmendhia@hotmail.fr',
      'user_type': 'CANDIDATE',
      'first_name': 'ghazi',
      'last_name': 'abdallah',
      'gender_id': 'M',
      'prof_phone': '',
      'cellphone_nbr': '',
      'language_id': '5eac544ad4cb666637fe1353',
      'title_id': 'MAN',
      'linkedin_url': '',
      'twitter_url': '',
      'youtube_url': '',
      'creation_date': '2020-07-01T12:32:58.252Z',
      'created_by': 'othmendhia@hotmail.fr',
      'update_date': '2020-07-01T12:32:58.252Z',
      'updated_by': 'othmendhia@hotmail.fr',
      '__v': 0
    },
    {
      'status': 'ACTIVE',
      '_id': '5efc97317698023af8774a36',
      'userKey': {
        'application_id': '5eac544a92809d7cd5dae21f',
        'email_address': 'user.200@hotmail.fr'
      },
      'company_email': 'dhia.othmen@widigital-group.com',
      'user_type': 'COLLABORATOR',
      'first_name': 'user',
      'last_name': '220',
      'gender_id': 'M',
      'prof_phone': '',
      'cellphone_nbr': '',
      'language_id': '5eac544ad4cb666637fe1353',
      'title_id': 'PRS',
      'linkedin_url': '',
      'twitter_url': '',
      'youtube_url': '',
      'creation_date': '2020-07-01T14:01:21.635Z',
      'created_by': 'dhia.othmen@widigital-group.com',
      'update_date': '2020-07-01T14:01:21.635Z',
      'updated_by': 'dhia.othmen@widigital-group.com',
      '__v': 0
    },
    {
      'status': 'ACTIVE',
      '_id': '5efd8c0d594e450f3cb60efb',
      'userKey': {
        'application_id': '5eac544a92809d7cd5dae21f',
        'email_address': 'amine.sboui@hotmail.fr'
      },
      'company_email': 'othmendhia@hotmail.fr',
      'user_type': 'COLLABORATOR',
      'first_name': 'Amine',
      'last_name': 'Sboui',
      'gender_id': 'M',
      'prof_phone': '',
      'cellphone_nbr': '',
      'language_id': '5eac544ad4cb666637fe1353',
      'title_id': 'PRS',
      'linkedin_url': '',
      'twitter_url': '',
      'youtube_url': '',
      'creation_date': '2020-07-02T07:26:05.543Z',
      'created_by': 'othmendhia@hotmail.fr',
      'update_date': '2020-07-02T07:26:05.543Z',
      'updated_by': 'othmendhia@hotmail.fr',
      '__v': 0
    },
    {
      'status': 'ACTIVE',
      '_id': '5efda8fe594e450f3cb60efc',
      'userKey': {
        'application_id': '5eac544a92809d7cd5dae21f',
        'email_address': 'user300@yahoo.fr'
      },
      'company_email': 'othmendhia@hotmail.fr',
      'user_type': 'COLLABORATOR',
      'first_name': 'User',
      'last_name': '300',
      'gender_id': 'M',
      'prof_phone': '',
      'cellphone_nbr': '',
      'language_id': '5eac544ad4cb666637fe1353',
      'title_id': 'MAN',
      'linkedin_url': '',
      'twitter_url': '',
      'youtube_url': '',
      'creation_date': '2020-07-02T09:29:34.639Z',
      'created_by': 'othmendhia@hotmail.fr',
      'update_date': '2020-07-02T09:29:34.639Z',
      'updated_by': 'othmendhia@hotmail.fr',
      '__v': 0
    },
    {
      'status': 'ACTIVE',
      '_id': '5efdbbca594e450f3cb60efd',
      'userKey': {
        'application_id': '5eac544a92809d7cd5dae21f',
        'email_address': 'hamzajridi@yahoo.fr'
      },
      'company_email': 'othmendhia@hotmail.fr',
      'user_type': 'COLLABORATOR',
      'first_name': 'Hamza',
      'last_name': 'jridi',
      'gender_id': 'M',
      'prof_phone': '',
      'cellphone_nbr': '',
      'language_id': '5eac544ad4cb666637fe1353',
      'title_id': 'DIR',
      'linkedin_url': '',
      'twitter_url': '',
      'youtube_url': '',
      'creation_date': '2020-07-02T10:49:46.448Z',
      'created_by': 'othmendhia@hotmail.fr',
      'update_date': '2020-07-02T10:49:46.448Z',
      'updated_by': 'othmendhia@hotmail.fr',
      '__v': 0
    }
  ];

  constructor() {
  }

  ngOnInit(): void {
  }

}
