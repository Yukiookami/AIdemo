import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.aishiro.vuecapacitor',
  appName: 'Shiro AI Chat',
  webDir: 'dist',
  ios: {
    contentInset: 'always',
  },
}

export default config
