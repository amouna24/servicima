import {
  animate,
  animateChild,
  AnimationTriggerMetadata,
  group,
  query,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';

const defaultDuration = '300ms';
const defaultMinWidth = '71px';
const defaultMaxWidth = '248px';
const rightSideNavWidth = '350px';
const defaultMinFontSize = '20px';
const defaultMaxFontSize = '20px';
const defaultMaxPosition = '230px';
const defaultMinPosition = '51px';

export function mainContentAnimation(animationDuration: string = defaultDuration,
  minWidth: string = defaultMinWidth, maxWidth: string = defaultMaxWidth): AnimationTriggerMetadata {
  return trigger('mainContent', [
    state('close', style({ 'margin-left': minWidth })),
    state('open', style({ 'margin-left': maxWidth })),
   /* transition('close => open', animate(`${animationDuration} ease-in`)),
    transition('open => close', animate(`${animationDuration} ease-out`)),*/
  ]);
}

export function sidebarAnimation(animationDuration: string = defaultDuration,
  minWidth: string = defaultMinWidth, maxWidth: string = defaultMaxWidth): AnimationTriggerMetadata {
  return trigger('onSideNavChange', [
    state('close', style({ width: minWidth })),
    state('open', style({ width: maxWidth })),
    transition('close => open', group([
      query('@iconAnimation', animateChild(), { optional: true }),
      query('@labelAnimation', animateChild(), { optional: true }),
      animate(`${animationDuration} ease-in-out`)
    ])),
    transition('open => close', group([
      query('@iconAnimation', animateChild(), { optional: true }),
      query('@labelAnimation', animateChild(), { optional: true }),
      animate(`${animationDuration} ease-in-out`)
    ])),
  ]);
}

export function buttonAnimation(animationDuration: string = defaultDuration)
  : AnimationTriggerMetadata {
  return trigger('buttonAnimation', [
    state('close', style({ left: defaultMinPosition })),
    state('open', style({ left: defaultMaxPosition })),
    transition('close => open', group([
      animate(`${animationDuration} ease-in-out`)
    ])),
    transition('open => close', group([
      animate(`${animationDuration} ease-in-out`)
    ])),
  ]);
}

export function iconAnimation(animationDuration: string = defaultDuration,
  minFontSize: string = defaultMinFontSize, maxFontSize: string = defaultMaxFontSize): AnimationTriggerMetadata {
  return trigger('iconAnimation', [
    state('open', style({ fontSize: maxFontSize })),
    state('close', style({ fontSize: minFontSize, margin: 'auto'})),
    transition('close => open', animate(`${animationDuration} ease-in-out`)),
    transition('open => close', animate(`${animationDuration} ease-in-out`)),
  ]);
}

export function labelAnimation(animationDuration: string = defaultDuration): AnimationTriggerMetadata {
  return trigger('labelAnimation', [
    state('open', style({ display: 'inline', opacity: 1 })),
    state('close', style({ display: 'none', opacity: 0 })),
    transition('close => open', animate(`${animationDuration} ease-in-out`)),
    transition('open => close', animate(`${animationDuration} ease-in-out`)),
  ]);
}

export function nameAnimation(animationDuration: string = defaultDuration): AnimationTriggerMetadata {
  return trigger('nameAnimation', [
    state('close', style({ fontSize: '16px', 'margin-bottom': '20px'})),
    transition('close => open', animate(`${animationDuration} ease-in-out`)),
    transition('open => close', animate(`${animationDuration} ease-in-out`)),
  ]);
}
export let slideView = trigger(
  'slideView',
  [
    state('true', style({ transform: 'translateX(100%)', opacity: 0 })),
    state('false', style({ transform: 'translateX(0)', opacity: 1 })),
    transition('0 => 1', animate('500ms', style({ transform: 'translateX(0)', 'opacity': 1 }))),
    transition('1 => 1', animate('500ms', style({ transform: 'translateX(100%)', 'opacity': 0 }))),
  ]);
export let slideInOut = trigger('slideInOut',
  [
    transition(':enter', [
      style({ transform: 'translateY(100%)', opacity: 0 }),
      animate('600ms ease-in', style({ transform: 'translateX(0%)', 'opacity': 1 }))
    ]),
    transition(':leave', [
      style({ transform: 'translateY(0%)', opacity: 1 }),
      animate('0ms ease-in', style({ transform: 'translateX(100%)', 'opacity': 0 }))
    ])
  ]);
