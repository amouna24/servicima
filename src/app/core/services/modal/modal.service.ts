import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, Observable } from 'rxjs';

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
    console.log(this.appModals)
  }

  // get modal component reference using modal component name
  getModalComponentRef(modalName: string) {
    const modal = this.appModals.find(modalElement => modalElement.modalName === modalName);
    return modal.modalComponent;
  }

  displayModal(modalName: string, modalData?: object, modalWidth?: string, modalHeight?: string): Observable<any> {
    const modalComponent = this.getModalComponentRef(modalName);
    const initialState = modalData;
    if (modalWidth === undefined || modalWidth === null) {
      modalWidth = '50%';
    }
    if (modalHeight === undefined || modalHeight === null) {
      modalHeight = '80%';
    }
    const dialogRef = this.dialog.open(modalComponent, {
      height: modalHeight,
      width: modalWidth,
      data: initialState,
      disableClose: true
    });
    return dialogRef.afterClosed();
  }

  // display global confirmation modal
  displayConfirmationModal(modalData: object): Subject<string> {
    const modalComponent = this.getModalComponentRef('confirmation');
    this.dialog.open(modalComponent, {
      data: modalData
    });
    return this.confirmationModalResponse$;
  }

  emitConfirmationModalResponse(confirmationResponse: string) {
    this.confirmationModalResponse$.next(confirmationResponse);
  }
}
