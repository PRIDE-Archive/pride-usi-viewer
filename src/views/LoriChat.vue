<template>
  <!-- loriChat.vue -->
  <div ref="containerRef" style="
      padding: 30px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    ">

    <v-chart :option="option" :autoresize="true" :init-options="{ locale: 'en', width: null, height: null }"
      ref="echartRef" style="width: 100%; height: 400px"></v-chart>

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
import { ref, onMounted, nextTick } from "vue";
import { Spin } from 'view-ui-plus'

import { loriData } from "@/store";

import { getUSI } from '@/api/index'

const Peptide = ref<string>("");

const showInput = ref(false);
const inputValue = ref();
const usiType = ref(0);
const containerRef = ref<HTMLElement>();
const echartRef = ref<HTMLElement>();

const option = ref({
  title: [
    {
      text: "",
      left: "center",
      top: "top",
    },
    {
      text: "",
      left: "center",
      bottom: "40",
    },
  ],

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
      right: 0,
      width: 20,
    },
  ],
  grid: {
    containLabel: false,
    show: false,
    bottom: "30%",
  },
  graphic: [
    {
      type: "image",
      right: "35",
      top: "0",
      style: {
        image: "/setting1.svg",
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
        image: "/setting1.svg",
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
      dimensions: ['x', 'y', 'p'],
      source: []
    },
    {
      dimensions: ['x', 'y', 'p'],
      source: []
    }
  ],
  series: [
    {
      name: 'm/z1',
      type: "bar",
      encode: { x: 'x', y: 'p' },
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
            '<h3>Peptide: ' + option.value.title[0].text + ' </h3><hr size=1 style="margin: 3px 0">',
            'X Value: ' + params.data[0] + '<br/>',
            'Y Value: ' + params.data[1] + '<br/>',
            'Y Percent: ' + params.data[2] + '%<br/>'
          ].join('');
        }
      },
    },
    {
      name: 'm/z2',
      type: "bar",
      encode: { x: 'x', y: 'p' },
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
            '<h3>Peptide: '+ option.value.title[1].text + ' </h3><hr size=1 style="margin: 3px 0">',
            'X Value: ' + params.data[0] + '<br/>',
            'Y Value: ' + params.data[1] + '<br/>',
            'Y Percent: ' + params.data[2] + '%<br/>'
          ].join('');
        }
      },
    },
    {
      name: "series name",
      type: "bar",
      symbolSize: 1,
      // showBackground: true,
      barWidth: 2,
      barGap: "-100%",
      itemStyle: {
        color: "rgba(0, 0, 255, 1)",
      },
      data: [],
    },
  ],
});


const queryUSI1 = async (usi: string = 'mzspec:PXD004939:Rice_phos_ABA_3h_20per_F1_R2:scan:2648:DAEKS[UNIMOD:21]PIN[UNIMOD:7]GR/2') => {

  let psm = await getUSI(usi);
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

  let psm = await getUSI(usi);
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
    let temp: number[] = [psm.masses[i], psm.intensities[i], 0-Number(((psm.intensities[i] * 100) / maxY).toFixed(2))];
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
    Peptide.value = option.value.title[0].text;
  } else {
    Peptide.value = option.value.title[1].text;
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
      await queryUSI1(inputValue.value);
    } else {
      await queryUSI2(inputValue.value);
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
      await queryUSI1();
    } catch (e) {
      console.error(e);
    }

    try {
      await queryUSI2();
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
