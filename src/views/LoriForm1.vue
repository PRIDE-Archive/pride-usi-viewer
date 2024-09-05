<template>
  <div style="display: flex; justify-content: space-between; align-items: center;border: 1px solid #ddd;margin-top:8px;">
    <table style=" padding: 10px;">
      <tr>
        <td >
            <span style="font-size: 14px; font-weight: bold; margin-right: 8px;">Fragment Icons:</span>
            <Checkbox :label="true" size="small" v-model="loriAttr.b">B</Checkbox>
            <Checkbox :label="true" size="small" v-model="loriAttr.y">Y</Checkbox>

        </td>
        <td style="padding-left: 32px;">
            <span style="font-size: 14px; font-weight: bold; margin-right:  8px;">  Neutral Loss: </span>
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

      </tr>
    </table>
    <div style="padding-left: 64px; display: flex; justify-content: center; align-items: center; ">
      <div style="margin-top: 24x;margin-right: 8px;">
        <Button style="margin: 0 auto;" type="primary" @click="onAnnotation">Generate</Button>
      </div>
    </div>
  </div>


</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from "vue";
import { loriAttr, loadSpectrumAnnotation1, loadSpectrumAnnotation2 } from "@/store";
import { Spin } from 'view-ui-plus'

const onUpdate = async () => {
  // console.log(loriAttr);

  // let data = await spectrumAnnotations(send);
  // console.log(data);

};

const onAnnotation = async () => {
  try {
    Spin.show();
    await loadSpectrumAnnotation1();
    await loadSpectrumAnnotation2();
  } finally {
    Spin.hide();
  }

};

// watch(() => loriAttr, () => {
//   console.log(loriAttr);
//   loadSpectrumAnnotation1();
// }, { deep: true });
</script>

<style></style>
