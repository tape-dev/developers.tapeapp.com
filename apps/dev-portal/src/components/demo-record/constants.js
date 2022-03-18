export const DEMO_RECORD_STATE_KEY = 'demoRecord';

// Defaults
export const DEFAULT_RECORD_TITLE = 'Demo Record';
export const DEFAULT_RECORD_ID = 123;

export function getDemoRecordState(config) {
  return config[DEMO_RECORD_STATE_KEY] || {};
}
export function setDemoRecordState(config, state) {
  config[DEMO_RECORD_STATE_KEY] = state ?? {};
}

// Title
export function getDemoRecordTitle(config) {
  return getDemoRecordState(config).title;
}

// ID
export function getDemoRecordId(config) {
  return getDemoRecordState(config).id;
}
