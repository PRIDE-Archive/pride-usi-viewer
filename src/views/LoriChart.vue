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

    <div style="position: relative;display: flex; align-items: center;gap: 10px;">
      <div style="position: absolute; left: -80px;text-align: right;width: 80px; font-weight: bold;">{{ downUsiType }}</div>
      <ColourfulText :title="loriData.spectrum2.title" :annotations="loriData.annotation2.annotations"></ColourfulText>
    </div>

    <Modal :closable="false" v-model="showUp" title="USI" @on-ok="onUpUsi()" @on-cancel="showUp = false">
      <div>
        <div style="padding: 16px; display: flex; align-items: center; justify-content: space-between;">
          <div style="">Peptide: {{ Peptide }}</div>
          <Icon type="ios-redo" size="20" @click="onPeptidofrom"/>
        </div>
        <div style="padding: 16px; display: flex; align-items: center; ">
          <div style="font-size: 16px;margin-right: 4px;">usi:</div>
          <Input v-model="inputUp" placeholder="Enter the USI..." style="" />
        </div>
      </div>
      <template #footer>
        <Button @click="showUp = false">Cancel</Button>
        <Button type="primary" @click="onUpUsi">OK</Button>
      </template>

    </Modal>

    <Modal :closable="false" v-model="showDown" title="USI/Peptidoform" @on-cancel="showDown = false">
      <div>
        <div style="margin-left:16px;">Peptide: {{ Peptide }}</div>
        <div style="margin-left: 16px;margin-top: 8px;">
          <RadioGroup v-model="usiType" type="button">
            <Radio label="USI"></Radio>
            <Radio label="Peptidoform"></Radio>
          </RadioGroup>
        </div>
        <div style="padding: 16px; ">
          <Input v-model="inputDown" placeholder="Enter the Content" style="" />
        </div>
      </div>
      <template #footer>
        <Button @click="showDown = false">Cancel</Button>
        <Button type="primary" @click="onDownUsi">OK</Button>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed, watch } from "vue";
import { Spin, Message } from 'view-ui-plus'
import html2canvas from 'html2canvas';
import ColourfulText from "./ColourfulText.vue";
import { loriData, loadDataUp, loadDataDown, isUsi, loadMassData } from "@/store";
import { zoomName, echart1Ref, echart1Option, echart2Ref, echart2Option, downUsiType } from "@/store";

const isPeptidofrom = ref(false);
const Peptide = ref<string>("");

const showUp = ref(false);
const inputUp = ref();

const showDown = ref(false);
const inputDown = ref();
const usiType = ref<"USI" | "Peptidoform">("Peptidoform");

const containerRef = ref<HTMLElement>();
const echartRef = ref(null);

const onPeptidofrom = () => {
  isPeptidofrom.value = true;
  Message.success('Peptidofrom Ready!');
}
const onDataZoom = (param: any) => {
  console.log('zoomData', param);
  // return;
  if (!zoomName.value) {
    zoomName.value = 'loriChat';
  }

  if (!echart2Ref.value) {
    return;
  }

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
  if (batch && batch[0].startValue && batch[0].endValue) {
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


const onShowUp = () => {
  Peptide.value = loriData.spectrum1.title;
  inputUp.value = loriData.spectrum1.usi;
  showUp.value = true;
}

const onShowDown = () => {
  Peptide.value = loriData.spectrum2.title;
  inputDown.value = loriData.spectrum2.usi;
  usiType.value = downUsiType.value;
  showDown.value = true;
  if (isUsi(inputDown.value)) {
    usiType.value = 'USI';
  } else {
    usiType.value = 'Peptidoform';
  }

}

const onUpUsi = async () => {

  if (!inputUp.value) {
    Message.warning('Please enter the USI');
    return;
  }

  if (!isUsi(inputUp.value)) {
    Message.warning('Please enter the correct USI');
    return;
  }

  try {
    Spin.show();
    await loadDataUp(inputUp.value);

    if (!loriData.spectrum1.response) {
      Message.warning('No data found');
      return;
    }
    let peptidoform = loriData.spectrum1.response.peptidoform;
    if (!peptidoform) {
      Message.warning('No peptidoform found');
      return;
    }

    if(isPeptidofrom.value){
      await loadDataDown(peptidoform);
    }

    await loadMassData();
    showUp.value = false;

  } finally {
    // showInput.value = false;
    Spin.hide();
  }
}

const onDownUsi = async () => {

  if (!inputDown.value) {
    Message.warning('Please enter the Content');
    return;
  }

  if (usiType.value == 'USI' && !isUsi(inputDown.value)) {
    Message.warning('Please enter the correct USI');
    return;
  }
  if (usiType.value == 'Peptidoform' && isUsi(inputDown.value)) {
    Message.warning('Please enter the correct Peptidoform');
    return; 
  }

  try {
    Spin.show();
    await loadDataDown(inputDown.value);
    await loadMassData();
    showDown.value = false;
  } finally {
    // showInput.value = false;
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

onMounted(async () => {
  nextTick(async () => {

    Spin.show();
    try {
      await loadDataUp();
      await loadDataDown();
      await loadMassData();
    } catch (e) {
      console.error(e);
    }

    Spin.hide();

    if (echartRef.value.chart) {
      echart1Ref.value = echartRef.value;
      echart1Option.value.toolbox.feature.myCustomTool.onclick = saveChartAsImage;
      echart1Option.value.graphic[0].onclick = () => onShowUp();
      echart1Option.value.graphic[1].onclick = () => onShowDown();
      echartRef.value.chart.on('datazoom', onDataZoom)
    }

  });
});
</script>

<style></style>async async
