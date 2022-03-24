import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TestService } from '@core/services/test/test.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ITestQuestionBlocModel } from '@shared/models/testQuestionBloc.model';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UserService } from '@core/services/user/user.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { CryptoService } from '@core/services/crypto/crypto.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { map } from 'rxjs/internal/operators/map';
import { UploadService } from '@core/services/upload/upload.service';
import { BehaviorSubject } from 'rxjs';
import { IViewParam } from '@shared/models/view.model';
import { AppInitializerService } from '@core/services/app-initializer/app-initializer.service';

@Component({
  selector: 'wid-edit-bloc',
  templateUrl: './edit-bloc.component.html',
  styleUrls: ['./edit-bloc.component.scss']
})
export class EditBlocComponent implements OnInit, AfterContentChecked {
  sendUpdateBloc: FormGroup;
  TechList = [];
  testBlocQuestion: ITestQuestionBlocModel;

  applicationId: string;
  companyEmailAddress: string;
  test_question_bloc_title: string;
  test_technology_code: string;
  question_nbr: string;
  test_question_bloc_desc: string;
  test_question_bloc_code: string;
  _id: string;
  displayPrice: boolean;
  formDataImage: FormData;
  free: boolean;
  langList: BehaviorSubject<IViewParam[]>;
  price: string;
  image: string;
  language_id: string;
  selectedTech: string;
  constructor(
    private fb: FormBuilder,
    private testService: TestService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private userService: UserService,
    private utilsService: UtilsService,
    private uploadService: UploadService,
    private appInitializerService: AppInitializerService,
    private cdRef: ChangeDetectorRef,
  ) {
    this.loadData();
  }

  async ngOnInit(): Promise<void> {
    this.applicationId = this.localStorageService.getItem('userCredentials').application_id;
    this.getTechnologiesInfo();
    this.createForm();
    this.getLanguageList();
    this.getConnectedUser();
    await this.getSelectedTechnologie();
  }
  ngAfterContentChecked() {
    this.cdRef.detectChanges();
  }

  /**
   * @description Get connected user
   */
  getConnectedUser() {
    this.userService.connectedUser$
      .subscribe(
        (userInfo) => {
          if (userInfo) {
            this.companyEmailAddress = userInfo['company'][0]['companyKey']['email_address'];          }
        });
  }

  getTechnologiesInfo() {
    this.testService.getTechnologies(`?application_id=${this.applicationId}&company_email=ALL'`)
      .subscribe(
        (response) => {
          if (response['msg_code'] !== '0004') {
            response.forEach(res => {
              this.TechList.push(
                {
                  code: res.TestTechnologyKey.test_technology_code,
                  title: res.technology_title,
                });
            });
          }
        },
        (error) => {
          if (error.error.msg_code === '0004') {
            console.log('empty table');
          }
        },
      );
  }

  createForm() {
    this.sendUpdateBloc = this.fb.group({
      test_question_bloc_title :  [this.test_question_bloc_title, [Validators.required, Validators.pattern('(?!^\\d+$)^.+$')]],
      test_technology_code: [this.test_technology_code, [Validators.required]],
      question_nbr: [this.question_nbr, [Validators.required, Validators.pattern('^[1-9][0-9]?$|^100$')]],
      test_question_bloc_desc: this.test_question_bloc_desc,
      language_id: [this.language_id, [ Validators.required]],
      image:  [this.image, [ Validators.required]],
      free: this.free,
      price: this.price,
    });
  }
  getSelectedTechnologie() {
    return new Promise( (resolve) => {
      this.testService
        .getTechnologies(`?test_technology_code=${this.test_technology_code}&company_email=ALL`)
        .subscribe( (res) => {
          resolve(res[0].technology_title);
        });
    }).then( (result: string) => {
      this.selectedTech = result;
    });

  }
  async UpdateBlocQuestion() {
    this.testBlocQuestion = this.sendUpdateBloc.value;
    this.testBlocQuestion.test_question_bloc_code = this.test_question_bloc_code;
    this.testBlocQuestion.application_id = this.applicationId;
    this.testBlocQuestion.company_email = 'ALL';
    this.testBlocQuestion._id = this._id;
    this.testBlocQuestion.image = this.testBlocQuestion.image === this.image ? this.image : await this.uploadFile(this.formDataImage);
    this.testBlocQuestion.price = this.testBlocQuestion.free ? null : this.testBlocQuestion.price;
    if (this.sendUpdateBloc.valid) {
      this.testService.updateQuestionBloc(this.testBlocQuestion).subscribe(data => {
        console.log('updated', data);
        this.router.navigate(['/manager/settings/bloc-question/']);
      });
    }
  }
  loadData() {
    this.utilsService.verifyCurrentRoute('/manager/settings/bloc-question').subscribe( (data) => {
       this.test_question_bloc_title = data.test_bloc_title;
      this.test_technology_code = data.test_bloc_technology;
       this.question_nbr = data.test_bloc_total_number;
       this.language_id = data.language_id;
       this.test_question_bloc_desc =  data.test_question_bloc_desc;
       this.test_question_bloc_code =  data.test_question_bloc_code;
       this._id =  data.test_bloc_title;
       this.free = data.free === 'true';
       this.price = data.price;
       this.image = data.image;
       this.displayPrice = !this.free;
    });
  }
  async setValueToImageField(event) {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (event.target.files && event.target.files.length) {
      let formData: FormData;
      formData = new FormData(); // CONVERT IMAGE TO FORMDATA
      formData.append('file', fileList[0]);
      formData.append('caption', fileList[0].name);
      this.formDataImage = formData;
      this.sendUpdateBloc.patchValue(
        {
          image: event.target.files[0].name,
        }
      );
    }
  }
  async uploadFile(formData) {
    return await this.uploadService.uploadImage(formData)
      .pipe(
        map(response => response.file.filename)
      )
      .toPromise();
  }
  verifyChecked(event: MatCheckboxChange) {
    if (event.checked) {
      this.displayPrice = false;
      this.sendUpdateBloc.controls.price.disable();
    } else {
      this.displayPrice = true;
      this.sendUpdateBloc.controls.price.enable();
    }
    this.sendUpdateBloc.patchValue(
      {
        free: event.checked,
      }
    );
  }
  /**************************************************************************
   * @description Get Language list from RefData and RefType
   *************************************************************************/
  getLanguageList() {
    this.langList = new BehaviorSubject<IViewParam[]>([]);
    this.langList.next(this.appInitializerService.languageList.map(
      (obj) => {
        return { value: obj.LanguageKey.language_code, viewValue: obj.language_desc};
      }
    ));
  }
}
