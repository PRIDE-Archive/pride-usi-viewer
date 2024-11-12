<template>
  <!-- loriChat.vue -->
  <div ref="containerRef" style="
      /* padding: 30px; */
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    ">
    <ColourfulText v-if="loriData.annotation1.annotations.length > 0" :title="loriData.spectrum1.title"
      :annotations="loriData.annotation1.annotations"></ColourfulText>
    <v-chart  ref="echartRef" :autoresize="true" :init-options="{ locale: 'en', width: null, height: null }"  :option="option" style="width: 100%; height: 400px;"></v-chart>
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
import ColourfulText from "./ColourfulText.vue";
import { loriData, loadSpectrumData1, loadSpectrumData2, loadSpectrumAnnotation1, loadSpectrumAnnotation2 } from "@/store";

import { getSpectrum } from '@/api/index'

const Peptide = ref<string>("");

const showInput = ref(false);
const inputValue = ref();
const usiType = ref(0);
const containerRef = ref<HTMLElement>();
const echartRef = ref<HTMLElement>();

const usi1 = 'mzspec:PXD004939:Rice_phos_ABA_3h_20per_F1_R2:scan:2648:DAEKS[UNIMOD:21]PIN[UNIMOD:7]GR/2';
// const usi2 = 'mzspec:PRD000900:CPTAC_CompRef_00_iTRAQ_15_2Feb12_Cougar_11-10-09:scan:12450:[UNIMOD:214]VLHPLEGAVVIIFK[UNIMOD:214]/4';
const usi2 = 'mzspec:PXD000561:Adult_Frontalcortex_bRP_Elite_85_f09:scan:17555:VLHPLEGAVVIIFK/2';


watch(() => loriData.spectrum1, () => {
  // console.log('loriData.spectrum1 changed:', loriData.spectrum1);
  // option.value.title[0].text = loriData.spectrum1.title;
  option.value.dataset[0].source = loriData.spectrum1.peaks;
}, { deep: true })

watch(() => loriData.spectrum2, () => {
  // console.log('loriData.spectrum2 changed:', loriData.spectrum2);
  // option.value.title[1].text = loriData.spectrum2.title;
  // option.value.dataset[1].source = loriData.spectrum2.peaks;
  option.value.dataset[1].source = loriData.spectrum2.peaks.map(peak => ({
    ...peak,
    percent: -peak.percent // 取负数
  }));

}, { deep: true })

watch(() => loriData.annotation1, () => {
  // console.log('loriData.annotation1 changed:', loriData.annotation1);
  option.value.dataset[2].source = loriData.annotation1.peaks;
}, { deep: true })

watch(() => loriData.annotation2, () => {
  // console.log('loriData.annotation2 changed:', loriData.annotation2);
  option.value.dataset[3].source = loriData.annotation2.peaks.map(peak => ({
    ...peak,
    percent: -peak.percent // 取负数
  }));
}, { deep: true })

const option = ref({
  // title: [
  //   {
  //     text: '',
  //     left: "center",
  //     top: "top",
  //   },
  //   {
  //     text: "",
  //     left: "center",
  //     bottom: "40",
  //   },
  // ],

  toolbox: {
    orient: "vertical",
    showTitle: true,
    // itemGap: 20,
    feature: {
      dataZoom: {
        title: {
          back: "Reset",
        },
        // yAxisIndex: "none",
        // title: 'Save As Image',
      },
      // restore: {},
      saveAsImage: {
        title: "Save",
      },
    },
    bottom: "47%",
    right: "30",
  },
  axisPointer: {
    link: [
      {
        xAxisIndex: "all",
      },
    ],
  },
  dataZoom: [
    {
      id: "dataZoomX",
      type: "slider",
      xAxisIndex: [0],
      filterMode: "filter",
      height: 10,
      bottom: "10",
    },
    {
      id: "dataZoomY",
      type: "slider",
      yAxisIndex: [0],
      filterMode: "none",
      right: 20,
      width: 10,
    },
  ],
  grid: {
    containLabel: false,
    show: false,
    top: "10%",
    bottom: "15%",
    left: "5%",
    right: "5%",
  },
  graphic: [
    {
      type: "image",
      right: "35",
      top: "0",
      style: {
        image: "./setting1.svg",
        width: 20,
        height: 20,
      },
      onclick: function () {
        onShowType(1);
      },
    },
    {
      type: "image",
      right: "35",
      bottom: "50",
      style: {
        image: "./setting1.svg",
        width: 20,
        height: 20,
      },
      onclick: function () {
        onShowType(2);
      },
    },
  ],
  xAxis: [
    {
      // name: 'intensity',
      type: "value",
      min: 0,
      max: 1400,
      position: "bottom",
      interval: 200,
    },
  ],
  yAxis: [
    {
      name: 'm/z',
      type: "value",
      position: "left",
      min: -100,
      max: 100,
      interval: 20,
      axisLabel: {
        show: true,
        formatter: "{value} %",
      },
    },
  ],
  tooltip: {

  },
  dataset: [
    {
      dimensions: ['mz', 'intensity', 'percent'],
      source: []
    },
    {
      dimensions: ['mz', 'intensity', 'percent'],
      source: []
    },
    {
      dimensions: ['mz', 'intensity', 'percent', 'icon'],
      source: []
    },
    {
      dimensions: ['mz', 'intensity', 'percent', 'icon'],
      source: []
    }
  ],
  series: [
    {
      name: 'm/z1',
      type: "bar",
      encode: { x: 'mz', y: 'percent' },
      datasetIndex: 0,
      barWidth: 2,
      itemStyle: {
        color: "rgba(180, 180, 180, 1)",

      },
      barGap: '-100%',
      tooltip: {
        show: true,
        trigger: 'item',
        formatter: function (params) {
          return [
            '<h3>Peptide: ' + loriData.spectrum1.title + ' </h3><hr size=1 style="margin: 3px 0">',
            'X Value: ' + params.data.mz + '<br/>',
            'Y Value: ' + params.data.intensity + '<br/>',
            'Y Percent: ' + params.data.percent + '%<br/>'
          ].join('');
        }
      },
    },
    {
      name: 'm/z2',
      type: "bar",
      encode: { x: 'x', y: 'percent' },
      datasetIndex: 1,
      barWidth: 2,
      itemStyle: {
        color: "rgba(180, 180, 180, 1)",
      },
      barGap: '-100%',
      tooltip: {
        show: true,
        trigger: 'item',
        formatter: function (params) {
          return [
            '<h3>Peptide: ' + loriData.spectrum2.title + ' </h3><hr size=1 style="margin: 3px 0">',
            'X Value: ' + params.data.mz + '<br/>',
            'Y Value: ' + params.data.intensity + '<br/>',
            'Y Percent: ' + params.data.percent + '%<br/>'
          ].join('');
        }
      },
    },
    {
      name: "Annotation",
      type: "bar",
      encode: { x: 'mz', y: 'percent' },
      datasetIndex: 2,
      symbolSize: 1,
      // showBackground: true,
      barWidth: 2,
      barGap: "-100%",
      itemStyle: {
        color: function (params) {
          return params.data.type == 'b' ? 'blue' : 'red';
        },
      },
      label: {
        normal: {
          show: true,
          position: 'top',
          rich: {
            main: {
              fontSize: 16,
              color: '#000',
              align: 'left',
              verticalAlign: 'middle',
            
              padding: [0, 0, 0, 0]
            },
            topRight: {
              fontSize: 10,
              color: '#000',
              align: 'right',
              verticalAlign: 'top',
              padding: [0, 0, 0, 0]
            },
            bottomRight: {
              fontSize: 10,
              color: '#000',
              align: 'right',
              verticalAlign: 'bottom',
              padding: [0, 0, 0, 15]
            }
          },
          formatter: function (param) {
            const label = param.data.label;
            const neutrals = param.data.neutrals;

            // 使用特殊字符来创建垂直布局
            return [
              '{topRight|' + (neutrals[1] || '') + '  }',
              '{main|' + label + '}',
              '{bottomRight|' + (neutrals[0] || '') + '}'
            ].join('\n');
          },
          textStyle: {
            color: '#000'
          }
        }
        // 结束 normal 配置
      },
    },
    {
      name: "Annotation",
      type: "bar",
      encode: { x: 'mz', y: 'percent' },
      datasetIndex: 3,
      symbolSize: 1,
      // showBackground: true,
      barWidth: 2,
      barGap: "-100%",
      itemStyle: {
        color: function (params) {
          return params.data.type == 'b' ? 'blue' : 'red';
        },
      },
      label: {
        normal: {
          show: true,
          position: 'bottom',
          rich: {
            main: {
              fontSize: 16,
              color: '#000',
              align: 'left',
              verticalAlign: 'middle',
            
              padding: [0, 0, 0, 0]
            },
            topRight: {
              fontSize: 10,
              color: '#000',
              align: 'right',
              verticalAlign: 'top',
              padding: [0, 0, 0, 0]
            },
            bottomRight: {
              fontSize: 10,
              color: '#000',
              align: 'right',
              verticalAlign: 'bottom',
              padding: [0, 0, 0, 15]
            }
          },
          formatter: function (param) {
            const label = param.data.label;
            const neutrals = param.data.neutrals;

            // 使用特殊字符来创建垂直布局
            return [
              '{topRight|' + (neutrals[1] || '') + '  }',
              '{main|' + label + '}',
              '{bottomRight|' + (neutrals[0] || '') + '}'
            ].join('\n');
          },
          textStyle: {
            color: '#000'
          }
        }
        // 结束 normal 配置
      },
    },
  ],
});


const queryUSI1 = async (usi: string = 'mzspec:PXD004939:Rice_phos_ABA_3h_20per_F1_R2:scan:2648:DAEKS[UNIMOD:21]PIN[UNIMOD:7]GR/2') => {

  let psm = await getSpectrum(usi);
  // console.log('psm:', psm);
  if (!psm.intensities) {
    console.error('have not intensities')
    return;
  }
  if (psm.intensities.length != psm.masses.length) {
    console.error('intensities.length != masses.length')
    return;
  }
  // intensities y轴， masses x轴
  let maxY = 0;
  for (let i = 0; i < psm.intensities.length; i++) {
    let y = psm.intensities[i];
    maxY = y > maxY ? y : maxY;
  }

  // loriData.peaks1 = [];
  option.value.dataset[0].source = [];
  for (let i = 0; i < psm.intensities.length; i++) {
    let temp: number[] = [psm.masses[i], psm.intensities[i], Number(((psm.intensities[i] * 100) / maxY).toFixed(2))];
    option.value.dataset[0].source.push(temp);
  }

  if (psm.peptideSequence) {
    option.value.title[0].text = psm.peptideSequence;
  }

}

const queryUSI2 = async (usi: string = 'mzspec:PRD000900:CPTAC_CompRef_00_iTRAQ_15_2Feb12_Cougar_11-10-09:scan:12450:[UNIMOD:214]VLHPLEGAVVIIFK[UNIMOD:214]/4') => {

  let psm = await getSpectrum(usi);
  // console.log('psm:', psm);
  if (!psm.intensities) {
    console.error('have not intensities')
    return;
  }
  if (psm.intensities.length != psm.masses.length) {
    console.error('intensities.length != masses.length')
    return;
  }
  // intensities y， masses x
  let maxY = 0;
  for (let i = 0; i < psm.intensities.length; i++) {
    let y = psm.intensities[i];
    maxY = y > maxY ? y : maxY;
  }

  option.value.dataset[1].source = [];
  for (let i = 0; i < psm.intensities.length; i++) {
    let temp: number[] = [psm.masses[i], psm.intensities[i], 0 - Number(((psm.intensities[i] * 100) / maxY).toFixed(2))];
    option.value.dataset[1].source.push(temp);
  }

  if (psm.peptideSequence) {
    option.value.title[1].text = psm.peptideSequence;
  }

  // option.value.series[0].data = [...loriData.peaks1, ...loriData.peaks2];
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
      await loadSpectrumData1(inputValue.value);
      await loadSpectrumAnnotation1();
    } else {
      await loadSpectrumData2(inputValue.value);
      await loadSpectrumAnnotation2();
    }
  } finally {
    showInput.value = false;
    Spin.hide();
  }
}

onMounted(async () => {

  nextTick(async () => {

    Spin.show();
    try {
      // await queryUSI1();
      await loadSpectrumData1(usi1);
      await loadSpectrumAnnotation1();

    } catch (e) {
      console.error(e);
    }

    try {
      await loadSpectrumData2(usi2);
      await loadSpectrumAnnotation2();
    } catch (e) {
      console.error(e);
    }

    Spin.hide();

  });



  // console.log("peakData", peakData);
  // console.log("loriData", loriData);
  // let maxMZ = 0;
  // for (let i = 0; i < peakData.length; i++) {
  //   let mz = peakData[i][1];
  //   maxMZ = mz > maxMZ ? mz : maxMZ;
  // }

  // for (let i = 0; i < peakData.length; i++) {
  //   let mz = peakData[i][1];
  //   maxMZ = mz > maxMZ ? mz : maxMZ;
  //   let temp: number[] = [peakData[i][0], (mz * 100) / maxMZ];
  //   // loriData.percent.push(temp);
  //   loriData.peaks1.push(temp);
  //   loriData.peaks2.push([temp[0], -temp[1]]);
  //   // loriData.percent.push([temp[0], -temp[1]]);
  //   // console.log(i,temp[0],temp[1])
  // }

  // option.value.series[1].data = loriData.peaks2;

  // nextTick(() => {
  //   requestAnimationFrame(() => {
  //     console.log(
  //       "containerRef width:",
  //       containerRef.value?.clientWidth,
  //       containerRef.value?.offsetWidth
  //     );
  //     console.log(
  //       "containerRef rects:",
  //       containerRef.value?.getClientRects()[0].width
  //     );
  //     const width = containerRef.value?.clientWidth;
  //     if (width) {
  //       console.log("width", width);
  //       const height = width * (3 / 4);
  //       console.log("echartRef", echartRef.value);
  //       // containerRef.value.style.height = `${height}px`;
  //       // echartRef.value.style.height = `${height}px`;
  //       // echartRef.value.style.width = `${width}px`;
  //       // initChart();
  //     }
  //   });
  // });
});
</script>

<style></style>async async
