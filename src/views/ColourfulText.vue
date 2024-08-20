<template>
  <div class="container">
    <div>
      <svg class="chart" width="600" height="85" viewBox="0 0 75 40" preserveAspectRatio="xMinYMin">
        <g id="titleContainer" transform="translate(10, -5)">
          <template v-for="(t, i) in title">
            <text class="aminoacid" :x="20 * i" opacity="1" y="25" style="font-size: 22; fill: black; stroke: none">
              {{ t }}
            </text>

          </template>
          <!-- <template v-for="(t, i) in title">
            <path class="line" :d="`M${i*20+ 10},25 L${i*20+ 10},13.5 L${i*20 + 6},6`" opacity="1" style="stroke: rgb(13, 117, 188)"></path>
          </template> -->

        </g>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed, watch } from "vue";
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.container {
  display: flex;
  align-items: center;
  /* margin: 10px auto;
  padding: 10px;
  border: gray 1px solid; */
}

.chart {
  border: gray 1px solid;
  margin: 5px;
  padding: 5px;
}

.line {
  fill: none;
  stroke-width: 2;
}

.aminoacid {
  font-family: 'Inconsolata', monospace;
  text-anchor: middle;
  alignment-baseline: central;
  dominant-baseline: central;
}
</style>
