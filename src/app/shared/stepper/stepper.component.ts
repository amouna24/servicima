import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CdkStepper } from '@angular/cdk/stepper';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'wid-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  // This custom stepper provides itself as CdkStepper so that it can be recognized
  // by other components.
  providers: [{ provide: CdkStepper, useExisting: StepperComponent }]
})
export class StepperComponent extends CdkStepper  implements OnInit {

  /************************************************
   * @description
   * - Input: stepConfig of Stepper
   * - Output: pass formGroup to parent
   ***********************************************/
  @Input() stepperConfig: {
              type: string,
              multiple: {
                nextStep: boolean,
                lastStep: string,
                redirectTo: string,
              }
              single: { }
              style: { }
            };
  @Output() notify: EventEmitter<object> = new EventEmitter<object>();

  /************************************************
   * @description
   * - you can change function name
   * - another desc
   * @param index: number
   * @param step: Step
   * @return status
   ***********************************************/
  onClick(index: number, step): void {
    if (step.stepControl.invalid ) {
      console.log('Form Invalid');
    } else {
      this.selectedIndex = index;
      this.notify.emit({ selectedIndex: index, selectedFormGroup: step.stepControl });
    }

  }

  ngOnInit(): void {
  }

}
