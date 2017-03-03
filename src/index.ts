import { AsyncFirebaseApp, FEATURES as features, FeaturePromises, FirebaseStatic } from './async-firebase';

export interface FirebaseLazyOptions {
  appName: string;
  config: {};
  firebase: FirebaseStatic; 
}

export function asyncApp(options: FirebaseLazyOptions) {
  const { config, appName, firebase } = options;
  return new AsyncFirebaseApp({ config, appName, features, firebase });
}
