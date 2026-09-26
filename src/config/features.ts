/**
 * Feature flags for ONE STOP.
 * Roadmap modules stay visible but clearly marked as next-phase until enabled.
 */
export const FEATURES = {
  FOOD_ENABLED: true,
  TIFFIN_ENABLED: true,
  STAY_ENABLED: false,
  TASTE_OF_HOME_ENABLED: false,
  RETURN_LOAD_ENABLED: false,
} as const;

export type FeatureKey = keyof typeof FEATURES;

export const isEnabled = (key: FeatureKey) => FEATURES[key];

export const APP_NAME = "ONE STOP";
export const APP_TAGLINE = "One Place. Every Need.";
export const DELIVERY_FEE = 25;
