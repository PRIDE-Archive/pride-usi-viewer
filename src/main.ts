import './assets/main.css'
import ViewUIPlus from 'view-ui-plus'
import 'view-ui-plus/dist/styles/viewuiplus.css'

import { createApp } from 'vue'
import App from './App.vue'

import 'echarts'
import ECharts from 'vue-echarts'

const app = createApp(App)

app.use(ViewUIPlus)
app.component('v-chart', ECharts)

app.mount('#app')
