<template>
  <!-- loriChat.vue -->
  <div ref="containerRef" style="
      padding: 30px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    ">
    <!-- 
    <div
      style="
        display: flex;
        justify-content: start;
        align-items: center;
        width: 100%;
      "
    >
      <div style="font-weight: bold; font-size: 18px">VLHPLEGAVVIIFK</div>
      <Button type="primary" style="margin-left: 8px" @click="showInput = true"
        >input</Button
      >
    </div>
    -->
    <v-chart :option="option" :autoresize="true" :init-options="{ locale: 'en', width: null, height: null }"
      ref="echartRef" style="width: 100%; height: 400px"></v-chart>

    <Modal :closable="false" okText="OK" cancelText="Cancel" v-model="showInput" title="USI" @on-ok="onUsi()"
      @on-cancel="showInput = false">
      <div style="padding: 16px">
        <Input v-model="inputValue" placeholder="Enter the USI..." style="" />
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import * as echarts from "echarts";
import { Spin } from 'view-ui-plus'

// import peakData from "../store/peaks.json";
import { loriData } from "@/store";

import { getUSI } from '@/api/index'

const showInput = ref(false);
const inputValue = ref();
const usiType = ref(0);
const containerRef = ref<HTMLElement>();
const echartRef = ref<HTMLElement>();
// const echart = ref<echarts.ECharts>();

const option = ref({
  title: [
    {
      text: "VLHPLEGAVVIIFK",
      left: "center",
      top: "top",
    },
    {
      text: "VLHPLEGAVVIIFK",
      left: "center",
      bottom: "40",
    },
  ],
  // tooltip: {
  //     trigger: 'axis',
  //     axisPointer: {
  //         animation: false
  //     }
  // },
  // legend: {
  // data: ['Evaporation', 'Rainfall'],
  //     left: 10
  // },
  tooltip: {
    show: true,
    // trigger: "item",
    // formatter: function (param) {
    //   console.log(param);
    //   if (param.componentType === "toolbox") {
    //     // return param.title;
    //     // return '<div style="width: 100px; height: 20px; text-align: center;">' + param.title + 'new' + '</div>';
    //   }
    // },
    // position: function (point, params, dom, rect, size) {
    //   // point: mouse positon
    //   // size: size
    //   console.log('size:',size);
    //   var x = point[0] - size.contentSize[0] / 2;
    //   var y = point[1] + 10; 
    //   return [x, y];
    // },
  },
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
      restore: {},
      saveAsImage: {
        title: "Save",
      },
    },
    bottom: "40%",
    right: "30",
    tooltip: {
      show: false,
      formatter: function (param) {
        console.log(param);
        if (param.componentType === "toolbox") {
          // return param.title;
          return (
            '<div style="width: auto; height: 20px; padding: 0 8px; margin: 0; text-align: center; font-size: 12px; line-height: 20px;">' +
            param.title +
            "</div>"
          );
        }
      },
      position: function (point, params, dom, rect, size) {
        console.log("size:", size);
        var x = point[0] - size.contentSize[0] / 2;
        var y = point[1] + 10;
        return [x, y];
      },
    },
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
        usiType.value = 1;
        showInput.value = true;
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
        usiType.value = 2;
        showInput.value = true;
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
      // axisLabel: {
      //     interval: '200'
      // }
    },
  ],
  yAxis: [
    {
      // name: 'm/z',
      type: "value",
      splitLine: {
        // show: false
      },

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
  series: [
    {
      // name: 'm/z',
      type: "bar",
      barWidth: 2,
      // showBackground: true,
      itemStyle: {
        color: "rgba(180, 180, 180, 1)",
      },
      // prettier-ignore
      barGap: '-100%',
      data: [],
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
      // prettier-ignore
      data: [
        [400, 40],
        [740, 40],
        [850, 50]
      ],
    },
  ],
});


const queryUSI1 = async (usi: string = 'mzspec:PXD004939:Rice_phos_ABA_3h_20per_F1_R2:scan:2648:DAEKS[UNIMOD:21]PIN[UNIMOD:7]GR/2') => {

  let psm = await getUSI(usi);
  console.log('psm:', psm);
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

  loriData.peaks1 = [];
  for (let i = 0; i < psm.intensities.length; i++) {
    let temp: number[] = [psm.masses[i], (psm.intensities[i] * 100) / maxY];
    loriData.peaks1.push(temp);
  }

  if (psm.peptideSequence) {
    option.value.title[0].text = psm.peptideSequence;
  }


  // option.value.series[0].data = [...loriData.peaks1, ...loriData.peaks2];
}

const queryUSI2 = async (usi: string = 'mzspec:PRD000900:CPTAC_CompRef_00_iTRAQ_15_2Feb12_Cougar_11-10-09:scan:12450:[UNIMOD:214]VLHPLEGAVVIIFK[UNIMOD:214]/4') => {

  let psm = await getUSI(usi);
  console.log('psm:', psm);
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

  loriData.peaks2 = [];
  for (let i = 0; i < psm.intensities.length; i++) {
    let temp: number[] = [psm.masses[i], -(psm.intensities[i] * 100) / maxY];
    loriData.peaks2.push(temp);
  }

  if (psm.peptideSequence) {
    option.value.title[1].text = psm.peptideSequence;
  }

  // option.value.series[0].data = [...loriData.peaks1, ...loriData.peaks2];
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

  // option.value.series[0].data = [...loriData.peaks1, ...loriData.peaks2];
  // option.value.series[1].data = loriData.peaks2;
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

    option.value.series[0].data = [...loriData.peaks1, ...loriData.peaks2];

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
