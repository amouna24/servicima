import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  appModals: Array<{ modalName: string, modalComponent: any }> = [];
  confirmationModalResponse$ = new Subject<boolean>();
  constructor(public dialog: MatDialog) { }

  openModal(): void {
  }

  // register modal component reference and name
  registerModals(modalsList: { modalName: string, modalComponent: any }) {
    this.appModals.push(modalsList) ;
  }

  // get modal component reference using modal component name
  getModalComponentRef(modalName: string) {
    const modal = this.appModals.find(modalElement => modalElement.modalName === modalName);
    return modal.modalComponent;
  }

  displayModal(modalName: string, modalData?: object, modalWidth?: string, modalHeight?: string, panelClass?: any, position?: any): Observable<any> {
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
      panelClass,
      position,
      disableClose: true
    });
    return dialogRef.afterClosed();
  }

  // display global confirmation modal
  displayConfirmationModal(modalData: object, modalWidth?: string, modalHeight?: string): Subject<boolean> {
    const modalComponent = this.getModalComponentRef('confirmation');
    this.dialog.open(modalComponent, {
      data: modalData,
      height: modalHeight,
      width: modalWidth,
    });
    return this.confirmationModalResponse$;
  }

  emitConfirmationModalResponse(confirmationResponse: boolean) {
    this.confirmationModalResponse$.next(confirmationResponse);
  }
}
