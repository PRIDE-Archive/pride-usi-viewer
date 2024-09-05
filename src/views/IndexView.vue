<template>
  <!-- index.vue -->
  <div class="container">
    <!-- <div class="column left">
      <loriForm />
    </div> -->
    <div class="column middle" style="">
      <!-- <ColourfulText></ColourfulText> -->
      <loriForm1 />
      <loriChat style="border: 1px solid #ddd;margin-top:8px;"/>
      <!-- <div style="height:4px; background-color: #ddd; margin: 32px 0;"></div> -->
      <massChat style="margin-top:8px;"/>

    </div>
    <!-- <div class="column right">
      <loriTable />
    </div> -->
  </div>
</template>

<script setup lang="ts">
import loriForm from "./LoriForm.vue";
import loriForm1 from "./LoriForm1.vue";
import loriChat from "./LoriChat.vue";
import massChat from "./MassChat.vue";
import loriTable from "./LoriTable.vue";
// import ColourfulText from "./ColourfulText.vue";
import { ref, type Ref } from "vue";

// const value: Ref<number[]> = ref([20, 50])
const value = ref([20, 50]);
</script>

<style scoped>
.container {
  display: flex;
  margin: 0;
  padding: 0;
  width: 100%;
}

.column {
  /* padding: 10px; */
  box-sizing: border-box;
  /* border: 1px solid #ddd; */
  /* margin: 10px; */
}

.left {
  min-width: 210px;
  width: 210px;
  /* background-color: #f8d7da; */
}

.middle {
  flex-grow: 2;
  /* background-color: #d1ecf1; */
  min-width: 800px;

  /* width: 1000px; */
}

.right {
  /* width: 200px; */
  /* min-width: 200px; */
  max-width: 500px;
  /* background-color: #d4edda; */
  flex-grow: 1;
}
</style>
