import { INetworkSocial } from '@shared/models/social-network.model';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class SocialNetwork {
  showList: INetworkSocial[];

    /**************************************************************************
   * @description get list
   * @param list: get all list of network social
   * @param showList: get list of network social when is not null
   * @param pairList: show pair list
   * @param impairList: show impair list
   *************************************************************************/
  getList(list: INetworkSocial[] ,  pairList: INetworkSocial[] , impairList: INetworkSocial[] ): void {
    this.showList = [];
    list.map((element) => {
      if (element.value) {
        this.showList.push(element);
      }
    } );
    for (let i = 0; i < this.showList.length; i++) {
    if (i % 2 ) {
      pairList.push((this.showList[i]));
    } else {
      impairList.push((this.showList[i]));
    }
  }
  }
    /**************************************************************************
     * @description get list network
     * @param value: value
     * @param placeholder: placeholder
     * @return list social network
     *************************************************************************/
  getListNetwork(value, placeholder) {
    return[
      { placeholder: placeholder + '.linkedinacc',
        value: value?.linkedin_url ,
        lien: 'https://www.linkedin.com/in/' + value?.linkedin_url,
        icon: 'wi_linkedin',
        color: '#0459bc',
      },
      { placeholder: placeholder + '.whatsappacc',
        value: value?.whatsapp_url,
        icon: 'wi_whatsapp',
        color: '#25D366',
        lien: null,
      },
      { placeholder: placeholder + '.facebookacc',
        value: value?.facebook_url,
        lien: 'https://www.facebook.com/' + value?.facebook_url,
        icon: 'wi_facebook',
        color: '#4267B2'},
      { placeholder: placeholder + '.skypeacc',
        value: value?.skype_url,
        lien: 'https://www.skype.com/' + value?.skype_url,
        icon: 'wi_skype',
        color: '#00AFF0'},
      { placeholder: placeholder + '.otheracc',
        value: value?.other_url,
        icon: 'wi_other',
        color: 'red'},
      { placeholder: placeholder + '.instagramacc',
        value: value?.instagram_url,
        lien: 'https://www.instagram.com/' + value?.instagram_url,
        icon: 'wi_instagram',
        color: '#C13584'},
      { placeholder: placeholder + '.twitteracc',
        value: value?.twitter_url,
        lien: 'https://www.twitter.com/' + value?.twitter_url,
        icon: 'wi_twitter',
        color: '#89caef'},
      { placeholder: placeholder + '.youtubeacc',
        value: value?.youtube_url,
        lien: 'https://www.youtube.com/' + value?.youtube_url,
        color: '#d24d57',
        icon: 'wi_youtube'},
      { placeholder: placeholder + '.viberacc',
        value: value?.viber_url,
        color: '#665CAC',
        icon: 'wi_viber',
        lien: null},
      { placeholder: placeholder + '.addlink',
        value: 'link'},
    ];
  }
    /**************************************************************************
     * @description update network social
     * @param oldValue: old value
     * @param newValue: new value
     *************************************************************************/
  updateNetworkSocial(oldValue, newValue): void {
    oldValue['youtube_url'] = newValue['youtube_url'];
    oldValue['linkedin_url'] = newValue['linkedin_url'];
    oldValue['twitter_url'] = newValue['twitter_url'];
    oldValue['facebook_url'] = newValue['facebook_url'];
    oldValue['instagram_url'] = newValue['instagram_url'];
    oldValue['whatsapp_url'] = newValue['whatsapp_url'];
    oldValue['viber_url'] = newValue['viber_url'];
    oldValue['skype_url'] = newValue['skype_url'];
    oldValue['other_url'] = newValue['other_url'];
  }
}
