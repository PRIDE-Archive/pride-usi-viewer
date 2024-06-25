<template>
    <div style="display: flex;max-width: 1553px; margin: 32px auto; color: black; overflow-x: auto;">
        <div style="width: 200px; min-width: 200px;;border: 1px solid #ddd; padding: 10px;" v-show="true">
            <loriForm></loriForm>
        </div>
        <div
            style="flex-grow: 1; border: 1px solid #ddd; padding: 10px;margin: 0 20px; min-width: 800px;">
            <!-- <Button type="success" @click="submitForm">Submit Index</Button>
            {{ loriAttr.title }} -->
            <loriChart></loriChart>
            <massChart></massChart>
        </div>
        <div style="min-width: 100px; flex-grow: 1; border: 1px solid #ddd; padding: 10px;" v-show="true">
            <loriTable></loriTable>
        </div>
    </div>
</template>

<script>
import loriForm from './LoriForm.vue';
import loriTable from './LoriTable.vue';
import loriChart from './LoriChart.vue';
import massChart from './MassChart.vue';
import peakData from './peaks.json';
export default {
    components: {
        loriForm,
        loriTable,
        loriChart,
        massChart
    },
    data() {
        return {
            message: 'Hello Vue!',
            loriAttr: {
                title: 'index',
                ions: [
                    {
                        name: 'a',
                        data: [false, false, false]
                    },
                    {
                        name: 'b',
                        data: [false, false, false]
                    },
                    {
                        name: 'c',
                        data: [false, false, false]
                    },
                    {
                        name: 'x',
                        data: [false, false, false]
                    },
                    {
                        name: 'y',
                        data: [false, false, false]
                    },
                    {
                        name: 'z',
                        data: [false, false, false]
                    },

                ],
                neutral: {
                    nh3: false,
                    h2o: false,
                    immonium: false,
                    reporter: false,
                },
                mass: {
                    type: 'Mono',
                    tol: 20,
                    tolType: 'Th'
                },
                peak: {
                    type: 'Most Intense',
                    detect: false,
                    label: 'Icon'
                }

            },
            loriData: {
                peaks: [],
                percent: [],
            }
        };
    },
    provide() {
        return {
            loriAttr: this.loriAttr,
            loriData: this.loriData,
        }
    },
    created() {
        console.log('lori created');
        console.log('peakData:', typeof peakData, peakData[0]);
        let maxMZ = 0;
        for (let i = 0; i < peakData.length; i++) {
            let mz = peakData[i][1];
            maxMZ = mz > maxMZ ? mz : maxMZ;
        }

        for (let i = 0; i < peakData.length; i++) {
            let mz = peakData[i][1];
            maxMZ = mz > maxMZ ? mz : maxMZ;
            let temp = [peakData[i][0], (mz * 100 / maxMZ).toFixed(4)];
            this.loriData.percent.push(temp);
            this.loriData.percent.push([temp[0], -temp[1]]);
            // console.log(i,temp[0],temp[1])
        }


        //this.loriData.peaks = peakData;

    },
    methods: {
        submitForm() {
            console.log("Form submitted:", this.loriAttr);
            this.loriAttr.title = 'LoriTable Index';
        },
    },
};
</script>

<style scoped></style>