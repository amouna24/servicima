import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TestService } from '@core/services/test/test.service';
import { ITestQuestionBlocModel } from '@shared/models/testQuestionBloc.model';
import { Router } from '@angular/router';
import { LocalStorageService } from '@core/services/storage/local-storage.service';
import { UserService } from '@core/services/user/user.service';
import { map } from 'rxjs/internal/operators/map';
import { UploadService } from '@core/services/upload/upload.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { RefdataService } from '@core/services/refdata/refdata.service';
import { UtilsService } from '@core/services/utils/utils.service';
import { AppInitializerService } from '@core/services/app-initializer/app-initializer.service';

@Component({
  selector: 'wid-bloc-questions-add',
  templateUrl: './bloc-questions-add.component.html',
  styleUrls: ['./bloc-questions-add.component.scss']
})
export class BlocQuestionsAddComponent implements OnInit {
  sendAddTestBloc: FormGroup;
  TechList = [];
  testBlocQuestion: ITestQuestionBlocModel;
  applicationId: string;
  companyEmailAddress: string;
  formDataImage: FormData;
  displayPrice: boolean;
  free: boolean;
  constructor(
    private fb: FormBuilder,
    private testService: TestService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private userService: UserService,
    private uploadService: UploadService,
    private appInitializerService: AppInitializerService,
  ) { }

  ngOnInit(): void {
    this.applicationId = this.localStorageService.getItem('userCredentials').application_id;
    this.displayPrice = false;
    this.getConnectedUser();
    this.createForm();
    this.getTechnologiesInfo();
  }

  /**
   * @description Get connected user
   */
  getConnectedUser() {
    this.userService.connectedUser$
      .subscribe(
        (userInfo) => {
          if (userInfo) {
            console.log(userInfo['company'][0]);
            this.companyEmailAddress = userInfo['company'][0]['companyKey']['email_address'];          }
        });
  }

  getTechnologiesInfo() {
    this.testService.getTechnologies(`?application_id=${this.applicationId}&company_email=${this.companyEmailAddress}`)
      .subscribe(
        (response) => {
          if (response['msg_code'] !== '0004') {
            response.forEach( (res) => {
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
  async createBlocQuestion() {
    this.testBlocQuestion = this.sendAddTestBloc.value;
    this.testBlocQuestion.test_question_bloc_code = `WID-${Math.floor(Math.random() * (99999 - 10000) + 10000)}-TEST-QUESTION_BLOC`;
    this.testBlocQuestion.application_id = this.applicationId;
    this.testBlocQuestion.company_email = this.companyEmailAddress;
    this.testBlocQuestion.image =  this.formDataImage ? await this.uploadFile(this.formDataImage) : undefined;
    if (this.sendAddTestBloc.valid) {
      this.testService.addQuestionBloc(this.testBlocQuestion).subscribe(data => {
        this.router.navigate(['/manager/settings/bloc-question/']);
      });
    }
  }
  createForm() {
    this.sendAddTestBloc = this.fb.group({
      test_question_bloc_title :  ['', [Validators.required, Validators.pattern('(?!^\\d+$)^.+$')]],
      test_technology_code: ['', [Validators.required]],
      question_nbr: ['', [Validators.required, Validators.pattern('^[1-9][0-9]?$|^100$')]],
      image: '',
      test_question_bloc_desc: '',
      free: true,
      price: null,
    });
  }
  async setValueToImageField(event) {
    const reader = new FileReader();
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (event.target.files && event.target.files.length) {
      let formData: FormData;
      formData = new FormData(); // CONVERT IMAGE TO FORMDATA
      formData.append('file', fileList[0]);
      formData.append('caption', fileList[0].name);
      this.formDataImage = formData;
      this.sendAddTestBloc.patchValue(
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
      this.sendAddTestBloc.controls.price.disable();
    } else {
      this.displayPrice = true;
        this.sendAddTestBloc.controls.price.enable();
    }
    this.sendAddTestBloc.patchValue(
      {
        free: event.checked,
      }
    );
  }
}
