import * as firebase from 'firebase/app';
declare var System: any;
export type FirebaseApp = firebase.app.App;
export type FeatureName = 'DATABASE' | 'STORAGE' | 'MESSAGING' | 'AUTH';

export interface FirebaseStatic {
  initializeApp: (config: Object, name: string) => FirebaseApp;
  apps: (FirebaseApp|null)[];
}

/**
 * Container for System.imports
 */
export interface FeaturePromises {
  [key: string]: () => Promise<FirebaseStatic | FirebaseApp>;
  app: () => Promise<FirebaseStatic>;
  auth: () => Promise<FirebaseApp>;
  database: () => Promise<FirebaseApp>;
  storage: () => Promise<FirebaseApp>;
  messaging: () => Promise<FirebaseApp>;
}

export interface AsyncFirebaseAppOptions {
  config: Object;
  appName: string;
  features: FeaturePromises;
  firebase: FirebaseStatic;
}

/**
 * Manages lazy loading of any. The Firebase SDK does not natively support 
 * lazy loading of Firebase features in a any. One an "app" is created it 
 * is effectively immutable, and if another feature is loaded using the "default" app name 
 * it will cause an error. This class works around this issue by create multiple "apps" to 
 * the same Firebase project. 
 */
export class AsyncFirebaseApp {

  private config: Object;
  private appName: string;
  private features: FeaturePromises;
  private firebase: FirebaseStatic;

  constructor(options: AsyncFirebaseAppOptions) {
    this.config = options.config;
    this.appName = options.appName;
    this.features = options.features;
    this.firebase = options.firebase;
  }

  load(...featureNames: FeatureName[]) {
    return new Promise((resolve, reject) => {
      const lowerFeaturesNames = featureNames.map(name => name.toLowerCase());
      const alphaNames = lowerFeaturesNames.sort((a, b) => (a < b) ? -1 : (a > b) ? 1 : 0);
      const featureAppName = this.appName + alphaNames.join('~~');

      // Check for the existence of an already created app 
      // before doing a network call
      const possibleApp = this._checkAppCache(featureAppName);
      if (possibleApp) {
        resolve(possibleApp);
        return;
      }    
      const featurePromises = lowerFeaturesNames.map(feature => this.features[feature]());    
      return Promise.all(featurePromises).then(_ => {
        return this._createApp(this.config, featureAppName);
      });
    });
  }

  private _createApp(config: {}, appName: string): FirebaseApp {
    return firebase.initializeApp(this.config, appName);
  }

  private _checkAppCache(appName: string): FirebaseApp | null {
    return this.firebase.apps.find(app => app.name === appName);
  }
}

export const FEATURES: FeaturePromises = {
  app: () => System.import('firebase/app'),
  auth: () => System.import('firebase/auth'),
  database: () => System.import('firebase/database'),
  storage: () => System.import('firebase/storage'),
  messaging: () => System.import('firebase/messaging')
};
