import {
  AfterViewInit,
  Directive,
  Host,
  Optional,
  Renderer2,
  Self,
  ViewContainerRef,
  Input, EventEmitter, Output
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
@Directive({
  selector: '[widPagination]'
})
export class PaginationDirective  implements AfterViewInit {
  private _currentPage = 1;
  private _pageGapTxt = '...';
  private _rangeStart;
  private _rangeEnd;
  private _buttons = [];

  @Input() _showTotalPages = this.matPag.length ;
  @Output() loadData  = new EventEmitter<number>();
  constructor(
    @Host() @Self() @Optional() private readonly matPag: MatPaginator,
    private vr: ViewContainerRef,
    private ren: Renderer2
  ) {
    // Sub to rerender buttons when next page and last page is used
    this.matPag.page.subscribe((v) => {
      this.switchPage(v.pageIndex - 1);
    });
  }

  private buildPageNumbers() {
    const actionContainer = this.vr.element.nativeElement.querySelector(
      'div.mat-paginator-range-actions'
    );
    const nextPageNode = this.vr.element.nativeElement.querySelector(
      'button.mat-paginator-navigation-next'
    );

    if (this._buttons.length > 0) {
      this._buttons.forEach(button => {
        this.ren.removeChild(actionContainer, button);
      });
      this._buttons.length = 0;
    }

    if (this._buttons.length === 0) {
      const nodeArray = this.vr.element.nativeElement.childNodes[0].childNodes[0]
        .childNodes[2].childNodes;
      setTimeout(() => {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < nodeArray.length; i++) {
          if (nodeArray[i].nodeName === 'BUTTON') {

            this.ren.removeClass(nodeArray[i], 'mat-icon-button');
            this.ren.addClass(nodeArray[i], 'button-paginator');
            this.ren.addClass(nodeArray[i], 'mat-raised-button');

            if (nodeArray[i].disabled) {
              this.ren.setStyle(
                nodeArray[i],
                'background-color',
                '#ebedf2'
              );

              this.ren.setStyle(nodeArray[i], 'color', '#2b2b2b');
              this.ren.setStyle(nodeArray[i], 'margin', '.3%');
            } else {
              this.ren.setStyle(
                nodeArray[i],
                'background-color',
                '#ebedf2'
              );
              this.ren.setStyle(nodeArray[i], 'color', '#2b2b2b');
              this.ren.setStyle(nodeArray[i], 'margin', '.5%');
            }
          }
        }
      });
    }

    const dots = false;
    for (let i = 1; i <= this.matPag.length + 1 ; i = i + 1) {
      if (
        (i <= this.matPag.length && this._currentPage <= this.matPag.length && i > this._rangeStart) ||
        (i >= this._rangeStart && i < this._rangeEnd)
      ) {
        this.ren.insertBefore(
          actionContainer,
          this.createButton(i - 1, this.matPag.pageIndex),
          nextPageNode
        );

      }
    }
  }

  private createButton(i: any, pageIndex: number): any {
    const linkBtn = this.ren.createElement('mat-button');
    this.ren.addClass(linkBtn, 'mat-raised-button');
    this.ren.setStyle(linkBtn, 'background-color', '#ebedf2');
    this.ren.addClass(linkBtn, 'paginator-button');
    this.ren.removeAttribute(linkBtn, 'disabled');
    this.ren.setStyle(linkBtn, 'color', 'black');
    this.ren.setStyle(linkBtn, 'margin', '1%');
    this.ren.setStyle(linkBtn, 'padding', '0');
    const pagingTxt = isNaN(i) ? this._pageGapTxt : +(i + 1);
    const text = this.ren.createText(pagingTxt + '');

    this.ren.addClass(linkBtn, 'mat-custom-page');
    this.ren.addClass(linkBtn, 'button-paginator');
    switch (i) {
      case pageIndex:
        this.ren.setAttribute(linkBtn, 'disabled', 'disabled');
        this.ren.addClass(linkBtn, 'bg-theme');
        this.ren.setStyle(linkBtn, 'color', 'white');
        this.loadData.emit(pageIndex);

        break;
      case this._pageGapTxt:
        this.ren.listen(linkBtn, 'click', () => {
          console.log(this.matPag.length);
          this.switchPage(this.matPag.length);
          console.log(i);
          this.loadData.emit(this.matPag.length - 1);
        });
        break;
      default:
        this.ren.listen(linkBtn, 'click', () => {
          this.switchPage(i);

        });
        break;
    }

    this.ren.appendChild(linkBtn, text);
    this._buttons.push(linkBtn);
    return linkBtn;
  }

  private initPageRange(): void {
    this._rangeStart = this._currentPage;
    this._rangeEnd = Math.round(this._currentPage + this.matPag.length / 2) ;
    this.buildPageNumbers();
  }

  private switchPage(i: number): void {
    this._currentPage = i ;
    this.matPag.pageIndex = i;
    this.initPageRange();
  }
  public ngAfterViewInit() {
    this.initPageRange();
  }

}
