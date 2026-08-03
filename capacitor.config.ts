import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.moradetec.app',
  appName: 'Moradetec',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
