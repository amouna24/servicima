import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  appModals: Array<{ modalName: string, modalComponent: any }>;
  confirmationModalResponse$ = new Subject<string>();
  constructor(public dialog: MatDialog) { }

  openModal(): void {
  }

  // registre modal component reference and name
  registerModals(modalsList: Array<{ modalName: string, modalComponent: any }>) {
    this.appModals = modalsList;
  }

  // get modal component reference using modal component name
  getModalComponentRef(modalName: string) {
    const modal = this.appModals.find(modalElement => modalElement.modalName === modalName);
    return modal.modalComponent;
  }

  displayModal(modalName: string, modalData?: object, width?: string, height?: string) {
    const modalComponent = this.getModalComponentRef(modalName);
    const initialState = modalData;
    if (width === undefined || width === null) {
      width = '50%';
    }
    if (height === undefined || height === null) {
      height = '80%';
    }
    const dialogRef = this.dialog.open(modalComponent, {
      height: height,
      width: width,
      data: initialState,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  // display global confirmation modal
  displayConfirmationModal(data: Object): Subject<string> {
    const modalComponent = this.getModalComponentRef('confirmation');
    this.dialog.open(modalComponent, {
      data: data
    });
    return this.confirmationModalResponse$;
  }

  emitConfirmationModalResponse(confirmationResponse: string) {
    this.confirmationModalResponse$.next(confirmationResponse);
  }
}
