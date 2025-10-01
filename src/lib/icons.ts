export const Icons = {
  CLEAN_INPUT: 'icons/ic-clean-input',
  CLOSE_POPUP: 'icons/ic-close-popup',
  EYE_CLOSE: 'icons/ic-eye-close',
  EYE_OPEN: 'icons/ic-eye-open',
  BRAND: 'icons/sideMenu/ic-brand',
  PRODUCT: 'icons/sideMenu/ic-product',
  STORE: 'icons/sideMenu/ic-store',
} as const;

export type IconName = (typeof Icons)[keyof typeof Icons];

export const iconNames = Object.values(Icons);