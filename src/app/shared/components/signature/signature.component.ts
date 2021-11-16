import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad';
import { UtilsService } from '@core/services/utils/utils.service';
import { HumanRessourcesService } from '@core/services/human-ressources/human-resources.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'wid-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.scss']
})
export class SignatureComponent implements OnInit {
  showSig = true;
  selectedFiles: any;
  file: FormData;

  initialForm: FormGroup;
  @Output()  signature  = new EventEmitter<any>();
  constructor(
    private utilsService: UtilsService,
    private hrService: HumanRessourcesService,
    private fb: FormBuilder,

  ) {
  }

  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  files: any[] = [];

  // tslint:disable-next-line:ban-types
  signaturePadOptions: Object = {
    'minWidth': 1,
    'canvasWidth': 400,
    'canvasHeight': 175
  };

  /**
   * @Description : init form
   */
  ngOnInit(): void {

    this.initialForm = this.fb.group({
      file: ['', Validators.required]
    });
  }
  /**
   * @Description : upload signature with signature pad
   * @param event: Event
   */
  sign(event: Event) {
    const mySign = this.signaturePad.toDataURL('image/png');
    const data = atob(mySign.substring('data:image/png;base64,'.length));
    const   asArray = new Uint8Array(data.length);
    for (let i = 0, len = data.length; i < len; ++i) {
      asArray[i] = data.charCodeAt(i);
    }
    const blob = new Blob([asArray], { type: 'image/png' });

    const formData = new FormData();
    formData.append('file', blob);
    formData.append('caption', 'image.png');
    this.signature.emit(formData);
    event.preventDefault();
  }
  /**
   * Reset Drag and drop input
   */
  clear() {

  }
  /**
   * Upload Signature
   */
  async upload(): Promise<void> {
    this.signature.emit(this.file);
  }
  manualSig() {
    this.showSig = !this.showSig;
  }
  openLink(event): void {
    event.preventDefault();
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFiles[0]);
    const formData = new FormData(); // CONVERT IMAGE TO FORMDATA
    formData.append('file', this.selectedFiles[0]);
    formData.append('caption', this.selectedFiles.item(0).name);
    this.file = formData;
    event.preventDefault();
  }

}
