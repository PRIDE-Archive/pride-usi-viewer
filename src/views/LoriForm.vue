<template>
  <div
    style="display: flex; justify-content: space-between; align-items: center;border: 1px solid #ddd;margin-top:8px;">
    <table style=" padding: 10px;">
      <tbody>

        <tr>
          <td>
            <span style="font-size: 14px; font-weight: bold; margin-right: 8px;">Fragment Icons:</span>
            <Checkbox :label="true" size="small" v-model="loriAttr.b">B</Checkbox>
            <Checkbox :label="true" size="small" v-model="loriAttr.y">Y</Checkbox>

          </td>
          <td style="padding-left: 32px;">
            <span style="font-size: 14px; font-weight: bold; margin-right:  8px;"> Neutral Loss: </span>
            <Checkbox :label="loriAttr.neutral.nh3" v-model="loriAttr.neutral.nh3">NH3 (*)</Checkbox>
            <Checkbox :label="loriAttr.neutral.h2o" v-model="loriAttr.neutral.h2o">H2O (o)</Checkbox>
          </td>
          <td style="padding-left: 32px; display: flex; align-items: center;">
            <div style=" display: flex; justify-content: start; align-items: center; margin-right: 8px; ">
              <div style="font-size: 14px; font-weight: bold;">Mass Tol:</div>
              <Input v-model="loriAttr.mass.tol" placeholder="" type="number" size="small"
                style="max-width: 60px; margin-left: 4px"></Input>
            </div>
            <RadioGroup v-model="loriAttr.mass.tolType">
              <Radio label="Da"></Radio>
              <Radio label="ppm"></Radio>
            </RadioGroup>

          </td>
          <td style="padding-left: 32px;">
            <span style="font-size: 14px; font-weight: bold; margin-right:  8px;"> Max Ion Charge: </span>
            <Input v-model="loriAttr.max_ion_charge" @input="handleInput" placeholder="" type="number" size="small"
              style="max-width: 60px; margin-left: 4px"></Input>
          </td>

        </tr>
      </tbody>
    </table>
    <div style="padding-left: 64px; display: flex; justify-content: center; align-items: center; ">
      <div style="margin-top: 24x;margin-right: 8px;">
        <Button style="margin: 0 auto;" type="primary" @click="showSetting = true">Settings</Button>
      </div>
      <div style="margin-top: 24x;margin-right: 8px;">
        <Button style="margin: 0 auto;" type="primary" @click="onAnnotation">Generate</Button>
      </div>
    </div>
  </div>

  <Modal :closable="false" v-model="showSetting" title="Settings" @on-cancel="showSetting = false" width="400px">
    <div>
      <div style="padding: 16px; display: flex; align-items: center; ">
        <div style="font-size: 16px;flex:1;">Intensity:</div>
        <Checkbox style="flex:1;" v-model="loriAttr.sqrt">Sqrt</Checkbox>
      </div>
      <div style="padding: 16px; display: flex; align-items: center; ">
        <div style="font-size: 16px;flex:1;">Width:</div>
        <InputNumber style="flex:1;" :max="2" :min="0.1" :step="0.1" v-model="width" placeholder="Enter the Width" />
      </div>
    </div>
    <template #footer>
      <Button @click="showSetting = false">Cancel</Button>
      <Button type="primary" @click="onSettings">OK</Button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from "vue";
import { Message } from 'view-ui-plus'
import { loriAttr, loadDataUp, loadDataDown, echart1Option } from "@/store";
import { Spin } from 'view-ui-plus'
const showSetting = ref(false);
const width = ref(echart1Option.value.series[0].barWidth);
const onSettings = async () => {
  console.log(width.value);
  if (width.value && width.value >= 0.1) {
    for (let i = 0; i < echart1Option.value.series.length; i++) {
      echart1Option.value.series[i].barWidth = width.value;
    }
    showSetting.value = false;
    return;
  }

  Message.warning(`Request correct value!`);

}

const onAnnotation = async () => {
  try {
    Spin.show();
    await loadDataUp();
    await loadDataDown();
  } finally {
    Spin.hide();
  }

};

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = target.value;
  const numValue = Number(value);
  if (numValue < 0) {
    loriAttr.max_ion_charge = 0;
  } else {
    loriAttr.max_ion_charge = numValue;
  }
};


</script>

<style></style>
