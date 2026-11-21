import { registerRootComponent } from 'expo';
import * as Updates from 'expo-updates';

import App from './App.tsx';

// Check for updates on startup
if (__DEV__ === false) {
  Updates.checkForUpdateAsync().then((update) => {
    if (update.isAvailable) {
      Updates.fetchUpdateAsync().then(() => {
        Updates.reloadAsync();
      });
    }
  });
}

registerRootComponent(App);