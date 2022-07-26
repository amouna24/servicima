import { Directive, Output, Inject, ElementRef, Input } from '@angular/core';
import { fromEvent } from 'rxjs';
import { switchMap, map, takeUntil } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';

import { ScrollbarComponent } from './scrollbar.component';

@Directive({
  selector: '[draggable]'
})
export class DraggableDirective {
  @Input()
  draggable: 'vertical' | 'horizontal' = 'vertical';

  @Output()
  dragged = fromEvent<TypedMouseEvent<HTMLElement>>(
    this.elementRef.nativeElement,
    'mousedown'
  ).pipe(
    switchMap(event => {
      event.preventDefault();

      const clientRect = event.target.getBoundingClientRect();
      const offsetVertical = getOffsetVertical(event, clientRect);
      const offsetHorizontal = getOffsetHorizontal(event, clientRect);

      return fromEvent<MouseEvent>(this.documentRef, 'mousemove').pipe(
        map(e => this.getScrolled(e, offsetVertical, offsetHorizontal)),
        takeUntil(fromEvent(this.documentRef, 'mouseup'))
      );
    })
  );

  constructor(
    @Inject(ScrollbarComponent) private readonly scrollbar: ScrollbarComponent,
    @Inject(DOCUMENT) private readonly documentRef: Document,
    @Inject(ElementRef) private readonly elementRef: ElementRef<HTMLElement>
  ) { }

  private getScrolled(
    { clientY, clientX }: MouseEvent,
    offsetVertical: number,
    offsetHorizontal: number
  ): number {
    const { offsetHeight, offsetWidth } = this.elementRef.nativeElement;
    const { nativeElement } = this.scrollbar.elementRef;
    const { top, left, width, height } = nativeElement.getBoundingClientRect();

    const maxTop = nativeElement.scrollHeight - height;
    const maxLeft = nativeElement.scrollWidth - width;
    const scrolledTop =
      (clientY - top - offsetHeight * offsetVertical) / (height - offsetHeight);
    const scrolledLeft =
      (clientX - left - offsetWidth * offsetHorizontal) / (width - offsetWidth);

    return this.draggable === 'vertical'
      ? maxTop * scrolledTop
      : maxLeft * scrolledLeft;
  }
}

export type TypedMouseEvent<T extends EventTarget> = MouseEvent & { target: T };

function getOffsetVertical(
  { clientY }: MouseEvent,
  { top, height }: ClientRect
): number {
  return (clientY - top) / height;
}

function getOffsetHorizontal(
  { clientX }: MouseEvent,
  { left, width }: ClientRect
): number {
  return (clientX - left) / width;
}
