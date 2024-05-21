/**
 * import necessary module
 */
import Vue from 'vue'
import App from './App.vue'
/**
 * import third part module
 */
import ECharts from 'vue-echarts/components/ECharts'
import ViewUI from 'view-design'
import locale from 'view-design/dist/locale/en-US'
import 'view-design/dist/styles/iview.css'

import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/sunburst'
import 'echarts/lib/chart/sankey'
import 'echarts/lib/chart/tree'
import 'echarts/lib/component/polar'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/scatter'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/legend/ScrollableLegendModel.js'
import 'echarts/lib/component/legend/ScrollableLegendView.js'
import 'echarts/lib/component/legend/scrollableLegendAction.js'
import 'echarts/lib/component/dataZoom.js'
import 'echarts/lib/chart/map'
import 'echarts/map/json/world.json'
import 'echarts/map/js/world.js'


Vue.config.productionTip = false
Vue.component('chart', ECharts)
Vue.use(ViewUI, { locale })

new Vue({
  render: h => h(App)
}).$mount('#app')