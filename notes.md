# API

peer dependency of firebase/app.

```ts
import * as firebase from 'firebase/app';
import * as firebaseLazy from 'firebase-lazy-load';

const config = {}:
const appName = 'app';
const asyncApp = firebaseLazy.asyncApp({ firebase, config, appName });
```
