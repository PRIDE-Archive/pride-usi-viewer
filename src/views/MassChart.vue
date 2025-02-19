<template>
  <div style="max-width: 2000px; position: relative;">
    <Select v-model="massType" @on-change="massChange" style="width:160px;right:80px;top:10px;position: absolute;z-index: 1;">
      <Option value="Top USI">Top USI</Option>
      <Option value="Mirror USI" :disabled="!mirrorEnable">Mirror USI</Option>
    </Select>
    <v-chart ref="echartRef" :autoresize="true" :init-options="{ locale: 'en', width: null, height: null }"
      :option="echart2Option" style="width: 100%; height: 300px;border: 1px solid #ddd;"></v-chart>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, computed } from "vue";
import { loriAttr, loriData, isUsi, loadMassData } from "@/store";
import { zoomName, echart1Ref, echart1Option, echart2Ref, echart2Option, massType } from "@/store";
const echartRef = ref(null);

// watch(() => loriData.annotation1, () => {
//   // console.log('loriData.annotation1 changed:', loriData.annotation1);
//   echart2Option.value.dataset[0].source = loriData.annotation1.peaks;
// }, { deep: true })

// watch(() => loriData.annotation2, () => {
//   // console.log('loriData.annotation1 changed:', loriData.annotation1);
//   echart2Option.value.dataset[1].source = loriData.annotation2.peaks.map(peak => ({
//     ...peak,
//     mass: -peak.mass // 取负数
//   }));
// }, { deep: true })

const mirrorEnable = computed(() => {
  return isUsi(loriData.spectrum2.usi);
})

const massChange = async () => {
  await loadMassData();
}

// watch(() => loriAttr.mass.tol, () => {
//   if (loriAttr.mass.tol && loriAttr.mass.tol > 1) {
//     echart2Option.value.yAxis.max = Number(loriAttr.mass.tol) + 5;
//     echart2Option.value.yAxis.min = -echart2Option.value.yAxis.max;
//   }
// })

const onDataZoom = (param: any) => {

  console.log('zoomData', param);
  if (!zoomName.value) {
    zoomName.value = 'massChat';
  }

  if (!echart1Ref.value) {
    return;
  }

  if (zoomName.value != 'massChat') {
    return;
  }
  const { start, end, dataZoomId, batch } = param;
  if (start && end && dataZoomId) {
    const dataZoomIndex = echart1Option.value.dataZoom.findIndex(item => item.id === dataZoomId);
    let params = {
      type: 'dataZoom',
      dataZoomIndex: dataZoomIndex,
      start: start,
      end: end
    }
    console.log(params);
    echart1Ref.value.dispatchAction(params);
  }
  if (batch) {
    let params = {
      type: 'dataZoom',
      batch: [{
        // startValue: batch[0].startValue,
        // endValue: batch[0].endValue,
        start: batch[0].startValue / echart2Option.value.xAxis.max,
        end: batch[0].endValue / echart2Option.value.xAxis.max,
      }, {
        dataZoomIndex: 1,
        // startValue: batch[1].startValue,
        // endValue: batch[1].endValue,
        start: batch[1].startValue / echart2Option.value.xAxis.max,
        end: batch[1].endValue / echart2Option.value.xAxis.max,
      }]
    }
    echart1Ref.value.dispatchAction(params);


  }

  zoomName.value = null;

}

onMounted(async () => {
  nextTick(async () => {
    if (echartRef.value.chart) {
      echart2Ref.value = echartRef.value;
      echartRef.value.chart.on('datazoom', onDataZoom)
    }
  });
});
</script>

<style></style>
