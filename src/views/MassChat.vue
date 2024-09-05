<template>
  <div style="max-width: 2000px;">
    <v-chart ref="chart" :autoresize="true" :init-options="{ locale: 'en', width: null, height: null }" :option="option"
      style="width: 100%; height: 300px;border: 1px solid #ddd;"></v-chart>
  </div>
</template>

<script setup lang="ts">
import { loriAttr, loriData } from "@/store";
import { ref, onMounted, watch } from "vue";


watch(() => loriData.annotation1, () => {
  // console.log('loriData.annotation1 changed:', loriData.annotation1);
  option.value.dataset[0].source = loriData.annotation1.peaks;
}, { deep: true })

watch(() => loriData.annotation2, () => {
  // console.log('loriData.annotation1 changed:', loriData.annotation1);
  option.value.dataset[1].source = loriData.annotation2.peaks.map(peak => ({
    ...peak,
    mass: -peak.mass // 取负数
  }));
}, { deep: true })

watch(() => loriAttr.mass.tol, () => {
  if (loriAttr.mass.tol && loriAttr.mass.tol > 1) {
    option.value.yAxis.max = Number(loriAttr.mass.tol) + 5;
    option.value.yAxis.min = -option.value.yAxis.max;
  }
})

const option = ref({
  grid: {
    containLabel: false,
    show: true,
    left: "5%",
    right: "5%",
  },
  xAxis: {
    type: "value",
    min: 0,
    max: 1400,
    position: "bottom",
    interval: 200,
  },
  yAxis: {
    name: 'm/z',
    type: "value",
    position: "left",
    max: 20,
    min: -20,
    // interval: 20,
    axisLabel: {
      show: true,
      formatter: "{value} ",
    },
  },
  dataset: [
    {
      dimensions: ['mz', 'intensity', 'percent', 'icon', 'mass'],
      source: []
    },
    {
      dimensions: ['mz', 'intensity', 'percent', 'icon', 'mass'],
      source: []
    }
  ],
  series: [
    {
      symbolSize: 10,
      datasetIndex: 0,
      encode: { x: 'mz', y: 'mass' },
      itemStyle: {
        color: function (params) {
          return params.data.type == 'b' ? 'blue' : 'red';
        },
      },
      type: "scatter",
    },
    {
      symbolSize: 10,
      datasetIndex: 1,
      encode: { x: 'mz', y: 'mass' },
      itemStyle: {
        color: function (params) {
          return params.data.type == 'b' ? 'blue' : 'red';
        },
      },
      type: "scatter",
    },
  ],
});
</script>

<style></style>
