import { Component, OnInit, Inject, Input } from '@angular/core';
import { ModalService } from '@core/services/modal/modal.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'wid-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {

  constructor(  private modalService: ModalService,
                public dialogRef: MatDialogRef<ConfirmationModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }
  /**
   * @description CLose Dialog OnNoClick on Cancel Button
   */
  onNoClick(): void {
    this.modalService.emitConfirmationModalResponse('false');
    this.dialogRef.close();
  }

  onSubmitAction(value: string): void {
    this.modalService.emitConfirmationModalResponse(value);
    this.dialogRef.close();
  }
}
