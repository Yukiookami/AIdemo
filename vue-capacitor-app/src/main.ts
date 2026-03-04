import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'vant/lib/index.css'

import './utils/viewport' // 动态注入 --vh，修复 iOS 真机视口高度

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
