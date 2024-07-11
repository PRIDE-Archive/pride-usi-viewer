<template>
  <!-- loriChat.vue -->
  <div
    ref="containerRef"
    style="
      padding: 30px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    "
  >
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
    <v-chart
      :option="option"
      :autoresize="true"
      :init-options="{ locale: 'en', width: null, height: null }"
      ref="echartRef"
      style="width: 100%; height: 400px"
    ></v-chart>

    <Modal
      :closable="false"
      okText="OK"
      cancelText="Cancel"
      v-model="showInput"
      title="USI"
      @on-ok="showInput = false"
      @on-cancel="showInput = false"
    >
      <div style="padding: 16px">
        <Input v-model="inputValue" placeholder="Enter the USI..." style="" />
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import * as echarts from "echarts";

import peakData from "../store/peaks.json";
import { loriData } from "@/store";

import { getUSI } from '@/api/index'

const showInput = ref(false);
const inputValue = ref();
const containerRef = ref<HTMLElement>();
const echartRef = ref<HTMLElement>();
const echart = ref<echarts.ECharts>();

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
    //   // point: 鼠标位置
    //   // size: 提示框大小
    //   console.log('size:',size);
    //   var x = point[0] - size.contentSize[0] / 2;
    //   var y = point[1] + 10; // 调整此值以控制提示框与按钮的距离
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
        // point: 鼠标位置
        // size: 提示框大小
        console.log("size:", size);
        var x = point[0] - size.contentSize[0] / 2;
        var y = point[1] + 10; // 调整此值以控制提示框与按钮的距离
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
        // alert("上侧按钮点击");
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
        // alert("上侧按钮点击");
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
      data: [
        [0, 30],
        [100, 20],
        [200, 30],
        [300, 40],
        [400, 50],
      ],
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

const initChart = () => {
  if (!echartRef.value) return;

  echart.value = echarts.init(echartRef.value);

  // 绘制图表
  echart.value.setOption({
    title: {
      text: "ECharts 入门示例",
    },
    tooltip: {},
    xAxis: {
      data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
    },
    yAxis: {},
    series: [
      {
        name: "销量",
        type: "bar",
        data: [5, 20, 36, 10, 10, 20],
      },
    ],
  });
};

const queryUSI = (id: number) => {
  getUSI(id).then(res => {
    console.log(res);
  });
}

onMounted(() => {
  console.log("peakData", peakData);
  console.log("loriData", loriData);
  let maxMZ = 0;
  for (let i = 0; i < peakData.length; i++) {
    let mz = peakData[i][1];
    maxMZ = mz > maxMZ ? mz : maxMZ;
  }

  for (let i = 0; i < peakData.length; i++) {
    let mz = peakData[i][1];
    maxMZ = mz > maxMZ ? mz : maxMZ;
    let temp: number[] = [peakData[i][0], (mz * 100) / maxMZ];
    // loriData.percent.push(temp);
    loriData.peaks1.push(temp);
    loriData.peaks2.push([temp[0], -temp[1]]);
    // loriData.percent.push([temp[0], -temp[1]]);
    // console.log(i,temp[0],temp[1])
  }

  option.value.series[0].data = [...loriData.peaks1, ...loriData.peaks2];
  // option.value.series[1].data = loriData.peaks2;

  nextTick(() => {
    requestAnimationFrame(() => {
      console.log(
        "containerRef width:",
        containerRef.value?.clientWidth,
        containerRef.value?.offsetWidth
      );
      console.log(
        "containerRef rects:",
        containerRef.value?.getClientRects()[0].width
      );
      const width = containerRef.value?.clientWidth;
      if (width) {
        console.log("width", width);
        const height = width * (3 / 4);
        console.log("echartRef", echartRef.value);
        // containerRef.value.style.height = `${height}px`;
        // echartRef.value.style.height = `${height}px`;
        // echartRef.value.style.width = `${width}px`;
        // initChart();
      }
    });
  });
});
</script>

<style></style>
