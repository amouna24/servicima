import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { TranslateService } from '@ngx-translate/core';

import { LocalStorageDataMock, TranslateMockModule } from '@shared/mocks';

import { TranslationCustomLoaderService } from './translation-custom-loader.service';

fdescribe('TanslationCustomLoaderService', () => {
  let service: TranslationCustomLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateMockModule
      ],
      providers: [
        TranslateService,
      ],
    });
    service = TestBed.inject(TranslationCustomLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should check get selected language', () => {
    spyOn(service, 'getLanguages').and.returnValue(LocalStorageDataMock.languages);
    const lang = service.checkForLanguage('IT');
    expect(lang._id).toBe('5eac544ad4cb666637fe1352');
    expect(lang.language_desc).toBe('Italiano');
  });

  it('should return EN if the selected language is not among the list', () => {
    spyOn(service, 'getLanguages').and.returnValue(LocalStorageDataMock.languages);
    const lang = service.checkForLanguage('PR');
    expect(lang._id).toBe('5eac544ad4cb666637fe1354');
    expect(lang.language_desc).toBe('English');
  });

  it('should set the navigator language as a default language', () => {
    spyOn(service, 'checkForLanguage').and.returnValue(LocalStorageDataMock.languages[0]);
    const spy = spyOn(service.translateService, 'use');

    service.setTranslationLanguage();
    expect(spy).toHaveBeenCalledWith('5eac544ad4cb666637fe1352');
  });
});
