import * as firebase from 'firebase/app';
import { firebaseLazy } from './index';

const lazyApp = firebaseLazy({
  firebase,
  config: {},
  appName: 'app'
});

lazyApp.auth()
  .then(authApp => {
    
  });