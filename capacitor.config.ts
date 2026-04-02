import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.homewatch.app',
  appName: 'HomeWatch',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    AndroidHttp: {
      enabled: true,
      allowCrossOriginAccessControl: true
    }
  }
};

export default config;