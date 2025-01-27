<template>
  <div class="container">
    <div>
      <svg class="chart" :width="title.length * 50" height="100" viewBox="0 0 75 40" preserveAspectRatio="xMinYMin">
        <g id="titleContainer" transform="translate(10, -5)">
          <template v-for="(t, i) in title">
            <text class="aminoacid" :x="20 * i" opacity="1" y="25" style="font-size: 20; fill: black; stroke: none">
              {{ t }}
            </text>
          </template>
          <template v-for="(annotation, i) in annotations">
            <template v-if="annotation.type == 'b'">
              <text class="aminoacid" :x="20 * (annotation.sequence - 0.5)" opacity="1" :y="8" style="font-size: 8; fill: black; stroke: none">
                {{ annotation.label }}
              </text>
              <!-- <path class="line" :d="`M${(annotation.sequence - 1)*20+ 10},25 L${(annotation.sequence - 1)*20+ 10},13.5 L${(annotation.sequence - 1)*20 + 6},6`" opacity="1" style="stroke: rgb(0, 0, 255)"></path> -->
              <path class="line" :d="`M${(annotation.sequence - 1)*20+ 10},25 L${(annotation.sequence - 1)*20+ 10},13.5 L${(annotation.sequence - 1)*20 + 10},12`" opacity="1" style="stroke: rgb(0, 0, 255)"></path>
            </template>
            <template v-if="annotation.type == 'y'">
              <text class="aminoacid" :x="20 * (title.length - annotation.sequence - 0.5)" opacity="1" :y="40" style="font-size: 8; fill: black; stroke: none">
                {{ annotation.label }}
              </text>
                <!-- <path class="line" :d="`M${(title.length - annotation.sequence -1) * 20 + 10},25 L${(title.length - annotation.sequence -1) * 20 + 10},37 L${(title.length - annotation.sequence -1) * 20 + 14},43`" opacity="1"
                style="stroke: rgb(255, 0, 0)"></path> -->
              <path class="line" :d="`M${(title.length - annotation.sequence -1) * 20 + 10},25 L${(title.length - annotation.sequence -1) * 20 + 10},37 L${(title.length - annotation.sequence -1) * 20 + 10},37`" opacity="1"
              style="stroke: rgb(255, 0, 0)"></path>
            </template>
            
          </template>

          <!-- <path class="line" :d="`M${0 * 20 + 10},25 L${0 * 20 + 10},13 L${0 * 20 + 6},6`" opacity="1"
            style="stroke: rgb(13, 117, 188)">
          </path> 

          <path class="line" :d="`M${1 * 20 + 10},25 L${1 * 20 + 10},37 L${1 * 20 + 14},43`" opacity="1"
            style="stroke: rgb(13, 117, 188)"></path>

          <path class="line" :d="`M${2 * 20 + 10},25 L${2 * 20 + 10},13 L${2 * 20 + 6},6`" opacity="1"
            style="stroke: rgb(13, 117, 188)">
          </path>
          <path class="line" :d="`M${2 * 20 + 10},25 L${2 * 20 + 10},37 L${2 * 20 + 14},43`" opacity="1"
            style="stroke: rgb(13, 117, 188)"></path>

          <path class="line" :d="`M${3 * 20 + 10},25 L${3 * 20 + 10},13 L${3 * 20 + 5},6`" opacity="1"
            style="stroke: rgb(13, 117, 188)">
          </path>
          <path class="line" :d="`M${3 * 20 + 10},18 L${3 * 20 + 5},11`" opacity="1" style="stroke: rgb(130, 12, 173)">
          </path>

          <path class="line" :d="`M${4 * 20 + 10},25 L${4 * 20 + 10},37 L${4 * 20 + 14},43`" opacity="1"
            style="stroke: rgb(13, 117, 188)"></path>
          <path class="line" :d="`M${4 * 20 + 10},33 L${4 * 20 + 14},39`" opacity="1" style="stroke: rgb(130, 12, 173)">
          </path>  -->

        </g>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed, watch } from "vue";
import type { Annotation } from "../store";
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  annotations: {
    type: Array as () => Annotation[],
    required: true,
  },
});

onMounted(async () => {
  console.log('props.annotations:', props.annotations)
})



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
  /* border: gray 1px solid; */
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
