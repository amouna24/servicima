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

const defaultDuration = '200ms';
const defaultMinWidth = '50px';
const defaultMaxWidth = '250px';
const defaultMinFontSize = '20px';
const defaultMaxFontSize = '20px';
const defaultMaxPosition = '230px';
const defaultMinPosition = '30px';

export function mainContentAnimation(animationDuration: string = defaultDuration,
  minWidth: string = defaultMinWidth, maxWidth: string = defaultMaxWidth): AnimationTriggerMetadata {
  return trigger('onSideNavChange', [
    state('close', style({ 'margin-left': minWidth })),
    state('open', style({ 'margin-left': maxWidth })),
    transition('close => open', animate(`${animationDuration} ease-in`)),
    transition('open => close', animate(`${animationDuration} ease-out`)),
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

export function buttonAnimation(animationDuration: string = defaultDuration,
  minWidth: string = defaultMinWidth, maxWidth: string = defaultMaxWidth): AnimationTriggerMetadata {
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
    state('close', style({ fontSize: minFontSize })),
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
    state('close', style({ color: 'white' })),
    transition('close => open', animate(`${animationDuration} ease-in-out`)),
    transition('open => close', animate(`${animationDuration} ease-in-out`)),
  ]);
}
