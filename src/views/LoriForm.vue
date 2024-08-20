<template>
  <div style="">
    <div style="border: 1px solid #ddd; padding: 10px">
      <div style="font-size: 14px; font-weight: bold">Fragment Icons:</div>
      <Checkbox :label="true" size="small" v-model="loriAttr.b">B</Checkbox>
      <Checkbox :label="true" size="small" v-model="loriAttr.y">Y</Checkbox>
      <!-- <div v-for="icon in loriAttr.ions" :key="icon.name">
        <span style="margin-right: 10px">{{ icon.name }}</span>
        <Checkbox :label="icon.data[index]" size="small" v-model="icon.data[index]" v-for="(item, index) in icon.data"
          :key="index">
          {{ index + 1 }}+</Checkbox>
      </div> -->

      <div style="font-size: 14px; font-weight: bold; margin-top: 8px">
        Neutral Loss:
      </div>
      <Checkbox :label="loriAttr.neutral.nh3" v-model="loriAttr.neutral.nh3">NH3 (*)</Checkbox>
      <Checkbox :label="loriAttr.neutral.h2o" v-model="loriAttr.neutral.h2o">H2O (o)</Checkbox>
      <!-- <Checkbox :label="loriAttr.neutral.immonium" v-model="loriAttr.neutral.immonium">Immonium ions</Checkbox>
      <Checkbox :label="loriAttr.neutral.reporter" v-model="loriAttr.neutral.reporter">Reporter ions</Checkbox> -->
    </div>

    <div style="border: 1px solid #ddd; padding: 10px; margin-top: 4px">
      <!-- <div style="font-size: 14px; font-weight: bold">Mass Type:</div> -->
      <!-- <RadioGroup v-model="loriAttr.mass.type">
        <Radio label="Mono"></Radio>
        <Radio label="Avg"></Radio>
      </RadioGroup> -->
      <div style="
          display: flex;
          justify-content: start;
          align-items: center;
          margin: 4px 0;
        ">
        <div>Mass Tol:</div>
        <Input v-model="loriAttr.mass.tol" placeholder="" type="number" size="small"
          style="max-width: 60px; margin-left: 4px"></Input>
      </div>
      <RadioGroup v-model="loriAttr.mass.tolType">
        <Radio label="Da"></Radio>
        <Radio label="ppm"></Radio>
      </RadioGroup>
      <!-- <div style="display: flex; justify-content: center; align-items: center">
        <Button style="margin-top: 4px" type="primary" @click="onUpdate">Update</Button>
      </div> -->
    </div>

    <!-- <div style="border: 1px solid #ddd; padding: 10px; margin-top: 4px">
      <div style="font-size: 14px; font-weight: bold">Peak Assignment:</div>
      <RadioGroup v-model="loriAttr.peak.type">
        <Radio label="Most Intense"></Radio>
        <Radio label="Nearest Match"></Radio>
      </RadioGroup>
      <Checkbox :label="loriAttr.peak.detect" v-model="loriAttr.peak.detect">Peak Detect</Checkbox>
    </div> -->

    <!-- <div style="border: 1px solid #ddd; padding: 10px; margin-top: 4px">
      <div style="font-size: 14px; font-weight: bold">Peak Labels:</div>
      <RadioGroup v-model="loriAttr.peak.label">
        <Radio label="Icon"></Radio>
        <Radio label="m/z"></Radio>
        <Radio label="None"></Radio>
      </RadioGroup>
    </div> -->

    <div style="padding: 8px; display: flex; justify-content: center; align-items: center; margin-top: 4px; border-bottom: #ddd 1px solid;">
      <Button style="margin: 0 auto;" type="primary" @click="onAnnotation">Generate</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from "vue";
import { loriAttr, loadSpectrumAnnotation1,loadSpectrumAnnotation2 } from "@/store";
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
