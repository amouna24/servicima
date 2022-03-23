import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[widBlockCopyPaste]'
})
export class BlockCopyPasteDirective {
  @Input('widBlockCopyPaste') copyPaste: any;
  constructor() { }
  @HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
    if (this.copyPaste) {
      e.preventDefault();
    }
  }

  @HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
    if (this.copyPaste) {
      e.preventDefault();
    }  }

  @HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
    if (this.copyPaste) {
      e.preventDefault();
    }  }

}
