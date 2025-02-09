<template>
  <!-- loriChat.vue -->
  <div ref="containerRef" style="
      /* padding: 30px; */
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    ">
    <ColourfulText :title="loriData.spectrum1.title" :annotations="loriData.annotation1.annotations"></ColourfulText>
    <v-chart ref="echartRef" :autoresize="true" :init-options="{ locale: 'en', width: null, height: null }"
      :option="echart1Option" style="width: 100%; height: 400px;"></v-chart>
    <ColourfulText :title="loriData.spectrum2.title" :annotations="loriData.annotation2.annotations"></ColourfulText>
    <Modal :closable="false" okText="OK" cancelText="Cancel" v-model="showInput" title="USI" @on-ok="onUsi()"
      @on-cancel="showInput = false">
      <div>
        <div style="margin-left:16px;">Peptide: {{ Peptide }}</div>
        <div style="padding: 16px; display: flex; align-items: center; ">
          <div style="font-size: 16px;margin-right: 4px;">usi:</div>
          <Input v-model="inputValue" placeholder="Enter the USI..." style="" />
        </div>
      </div>

    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed, watch } from "vue";
import { Spin } from 'view-ui-plus'
import html2canvas from 'html2canvas';
import ColourfulText from "./ColourfulText.vue";
import { loriData, loadDataUp, loadDataDown } from "@/store";
import { zoomData, zoomName, echart1Ref, echart1Option, echart2Ref, echart2Option } from "@/store";

const Peptide = ref<string>("");

const showInput = ref(false);
const inputValue = ref();
const usiType = ref(0);
const containerRef = ref<HTMLElement>();
const echartRef = ref(null);

const usi1 = 'mzspec:PXD004939:Rice_phos_ABA_3h_20per_F1_R2:scan:2648:DAEKS[UNIMOD:21]PIN[UNIMOD:7]GR/2';
// const usi2 = 'mzspec:PRD000900:CPTAC_CompRef_00_iTRAQ_15_2Feb12_Cougar_11-10-09:scan:12450:[UNIMOD:214]VLHPLEGAVVIIFK[UNIMOD:214]/4';
const usi2 = 'mzspec:PXD000561:Adult_Frontalcortex_bRP_Elite_85_f09:scan:17555:VLHPLEGAVVIIFK/2';


watch(() => loriData.spectrum1, () => {
  // console.log('loriData.spectrum1 changed:', loriData.spectrum1);
  echart1Option.value.dataset[0].source = loriData.spectrum1.peaks;
}, { deep: true })

watch(() => loriData.spectrum2, () => {
  // console.log('loriData.spectrum2 changed:', loriData.spectrum2);
  echart1Option.value.dataset[1].source = loriData.spectrum2.peaks.map(peak => ({
    ...peak,
    percent: -peak.percent
  }));

}, { deep: true })

watch(() => loriData.annotation1, () => {
  // console.log('loriData.annotation1 changed:', loriData.annotation1);
  echart1Option.value.dataset[2].source = loriData.annotation1.peaks;
}, { deep: true })

watch(() => loriData.annotation2, () => {
  // console.log('loriData.annotation2 changed:', loriData.annotation2);
  echart1Option.value.dataset[3].source = loriData.annotation2.peaks.map(peak => ({
    ...peak,
    percent: -peak.percent
  }));
}, { deep: true })


// const option = ref({

//   toolbox: {
//     orient: "vertical",
//     showTitle: true,
//     // itemGap: 20,
//     feature: {
//       dataZoom: {
//         title: {
//           back: "Reset",
//         },
//         // yAxisIndex: "none",
//         // title: 'Save As Image',
//       },
//       // restore: {},
//       // saveAsImage: {
//       //   title: "Save",
//       // },
//       myCustomTool: {
//         show: true,
//         title: 'Save',
//         icon: 'path://M505.7 661c3.2 4.1 9.4 4.1 12.6 0l112-141.7c4.1-5.2 0.4-12.9-6.3-12.9h-74.1V168c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v338.3H400c-6.7 0-10.4 7.7-6.3 12.9l112 141.8zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z',
//         onclick: function (event, instance) {
//           saveChartAsImage();
//         }
//       }
//     },
//     bottom: "47%",
//     right: "30",
//   },
//   axisPointer: {
//     link: [
//       {
//         xAxisIndex: "all",
//       },
//     ],
//   },
//   dataZoom: [
//     {
//       id: "dataZoomX",
//       type: "slider",
//       xAxisIndex: [0],
//       filterMode: "filter",
//       height: 10,
//       bottom: "10",
//     },
//     {
//       id: "dataZoomY",
//       type: "slider",
//       yAxisIndex: [0],
//       filterMode: "none",
//       right: 20,
//       width: 10,
//     },
//   ],
//   grid: {
//     containLabel: false,
//     show: false,
//     top: "10%",
//     bottom: "15%",
//     left: "5%",
//     right: "5%",
//   },
//   graphic: [
//     {
//       type: "image",
//       right: "35",
//       top: "0",
//       style: {
//         image: "/setting1.svg",
//         width: 20,
//         height: 20,
//       },
//       onclick: function () {
//         onShowType(1);
//       },
//     },
//     {
//       type: "image",
//       right: "35",
//       bottom: "50",
//       style: {
//         image: "/setting1.svg",
//         width: 20,
//         height: 20,
//       },
//       onclick: function () {
//         onShowType(2);
//       },
//     },
//   ],
//   xAxis: [
//     {
//       // name: 'intensity',
//       type: "value",
//       min: 0,
//       max: 1400,
//       position: "bottom",
//       interval: 200,
//     },
//   ],
//   yAxis: [
//     {
//       name: 'm/z',
//       type: "value",
//       position: "left",
//       min: -100,
//       max: 100,
//       interval: 20,
//       axisLabel: {
//         show: true,
//         formatter: "{value} %",
//       },
//     },
//   ],
//   tooltip: {

//   },
//   dataset: [
//     {
//       dimensions: ['mz', 'intensity', 'percent'],
//       source: []
//     },
//     {
//       dimensions: ['mz', 'intensity', 'percent'],
//       source: []
//     },
//     {
//       dimensions: ['mz', 'intensity', 'percent', 'icon'],
//       source: []
//     },
//     {
//       dimensions: ['mz', 'intensity', 'percent', 'icon'],
//       source: []
//     }
//   ],
//   series: [
//     {
//       name: 'm/z1',
//       type: "bar",
//       encode: { x: 'mz', y: 'percent' },
//       datasetIndex: 0,
//       barWidth: 2,
//       itemStyle: {
//         color: "rgba(180, 180, 180, 1)",

//       },
//       barGap: '-100%',
//       tooltip: {
//         show: true,
//         trigger: 'item',
//         formatter: function (params) {
//           return [
//             '<h3>Peptide: ' + loriData.spectrum1.title + ' </h3><hr size=1 style="margin: 3px 0">',
//             'X Value: ' + params.data.mz + '<br/>',
//             'Y Value: ' + params.data.intensity + '<br/>',
//             'Y Percent: ' + params.data.percent + '%<br/>'
//           ].join('');
//         }
//       },
//     },
//     {
//       name: 'm/z2',
//       type: "bar",
//       encode: { x: 'x', y: 'percent' },
//       datasetIndex: 1,
//       barWidth: 2,
//       itemStyle: {
//         color: "rgba(180, 180, 180, 1)",
//       },
//       barGap: '-100%',
//       tooltip: {
//         show: true,
//         trigger: 'item',
//         formatter: function (params) {
//           return [
//             '<h3>Peptide: ' + loriData.spectrum2.title + ' </h3><hr size=1 style="margin: 3px 0">',
//             'X Value: ' + params.data.mz + '<br/>',
//             'Y Value: ' + params.data.intensity + '<br/>',
//             'Y Percent: ' + params.data.percent + '%<br/>'
//           ].join('');
//         }
//       },
//     },
//     {
//       name: "Annotation",
//       type: "bar",
//       encode: { x: 'mz', y: 'percent' },
//       datasetIndex: 2,
//       symbolSize: 1,
//       // showBackground: true,
//       barWidth: 2,
//       barGap: "-100%",
//       itemStyle: {
//         color: function (params) {
//           return params.data.type == 'b' ? 'blue' : 'red';
//         },
//       },
//       label: {
//         normal: {
//           show: true,
//           position: 'top',
//           formatter: function (param) {
//             // console.log('param:', param.data);
//             return (param.data.label);
//           },
//           textStyle: {
//             color: '#000'
//           }
//         }
//         // 结束 normal 配置
//       },
//     },
//     {
//       name: "Annotation",
//       type: "bar",
//       encode: { x: 'mz', y: 'percent' },
//       datasetIndex: 3,
//       symbolSize: 1,
//       // showBackground: true,
//       barWidth: 2,
//       barGap: "-100%",
//       itemStyle: {
//         color: function (params) {
//           return params.data.type == 'b' ? 'blue' : 'red';
//         },
//       },
//       label: {
//         normal: {
//           show: true,
//           position: 'bottom',
//           formatter: function (param) {
//             // console.log('param:', param.data);
//             return (param.data.label);
//           },
//           textStyle: {
//             color: '#000'
//           }
//         }
//         // 结束 normal 配置
//       },
//     },
//   ],
// });

let timeoutId: ReturnType<typeof setTimeout> | null = null;
const onDataZoom = (param: any) => {
  console.log('zoomData', param);
  // return;
  if(!zoomName.value){
    zoomName.value = 'loriChat';
  }
  // zoomData.value = param;

  if (!echart2Ref.value) {
    return;
  }

  // if (timeoutId) {
  //   clearTimeout(timeoutId);
  // }

  // timeoutId = setTimeout(() => {

    if (zoomName.value != 'loriChat') {
      return;
    }
    const { start, end, dataZoomId, batch } = param;
    if (start && end && dataZoomId) {
      const dataZoomIndex = echart2Option.value.dataZoom.findIndex(item => item.id === dataZoomId);
      let params = {
        type: 'dataZoom',
        dataZoomIndex: dataZoomIndex,
        start: start,
        end: end
      }
      console.log(params);
      echart2Ref.value.dispatchAction(params);
    }
    if (batch) {
      let params = {
        type: 'dataZoom',
        batch: [{
          // startValue: batch[0].startValue,
          // endValue: batch[0].endValue,
          start: batch[0].startValue / echart1Option.value.xAxis[0].max,
          end: batch[0].endValue / echart1Option.value.xAxis[0].max,
        }, {
          dataZoomIndex: 1,
          // startValue: batch[1].startValue,
          // endValue: batch[1].endValue,
          start: batch[1].startValue / echart1Option.value.xAxis[0].max,
          end: batch[1].endValue / echart1Option.value.xAxis[0].max,
        }]
      }
      echart2Ref.value.dispatchAction(params);

      
    }
    zoomName.value = null;
  // }, 50);

}

const onShowType = (type: number) => {
  usiType.value = type;
  if (usiType.value == 1) {
    Peptide.value = loriData.spectrum1.title;
    inputValue.value = loriData.spectrum1.usi;
  } else {
    Peptide.value = loriData.spectrum2.title;
    inputValue.value = loriData.spectrum2.usi;
  }
  showInput.value = true;
}

const onUsi = async () => {

  if (!inputValue.value) {
    return;
  }
  try {
    Spin.show();
    if (usiType.value == 1) {
      await loadDataUp(inputValue.value);
    } else {
      await loadDataDown(inputValue.value);
    }
  } finally {
    showInput.value = false;
    Spin.hide();
  }
}

const saveChartAsImage = async () => {
  console.log('saveChartAsImage');
  if (containerRef.value) {
    try {
      const canvas = await html2canvas(containerRef.value);

      const image = canvas.toDataURL('image/png');

      const link = document.createElement('a');
      link.href = image;
      link.download = 'echarts-screenshot.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('html2canvas failed:', error);
    }
  } else {
    console.error('can`t find containerRef');
  }
};

// watch(() => zoomData, (newValue, oldValue) => {
//   if (zoomName.value == 'loriChat') {
//     return;
//   }
//   const { start, end, dataZoomId, batch } = zoomData.value;
//   if (start && end && dataZoomId) {
//     const dataZoomIndex = option.value.dataZoom.findIndex(item => item.id === dataZoomId);
//     let params = {
//       type: 'dataZoom',
//       dataZoomIndex: dataZoomIndex,
//       start: start,
//       end: end
//     }
//     console.log(params);
//     echartRef.value.dispatchAction(params);
//     return;
//   }
//   if (batch) {
//     let params = {
//       type: 'dataZoom',
//       batch: [{
//         startValue: batch[0].startValue,
//         endValue: batch[0].endValue
//       }, {
//         dataZoomIndex: 1,
//         startValue: batch[1].startValue,
//         endValue: batch[1].endValue
//       }]
//     }
//     console.log(params);
//     echartRef.value.dispatchAction(params);
//   }

// }, { deep: true })


onMounted(async () => {
  nextTick(async () => {

    Spin.show();
    try {
      await loadDataUp();
    } catch (e) {
      console.error(e);
    }

    try {
      await loadDataDown();
    } catch (e) {
      console.error(e);
    }

    Spin.hide();

    if (echartRef.value.chart) {
      echart1Ref.value = echartRef.value;
      echart1Option.value.toolbox.feature.myCustomTool.onclick = saveChartAsImage;
      echart1Option.value.graphic[0].onclick = () => onShowType(1);
      echart1Option.value.graphic[1].onclick = () => onShowType(2);
      echartRef.value.chart.on('datazoom', onDataZoom)
    }

  });
});
</script>

<style></style>async async
