<template>
    <div style="">
        <chart style="width: 100%;height:450px;" class="scatter-pride" :options="option" :auto-resize="true"></chart>
    </div>
</template>

<script>

export default {
    data() {
        return {
            option: {
                title: {
                    text: 'VLHPLEGAVVIIFK',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        animation: false
                    }
                },
                // legend: {
                // data: ['Evaporation', 'Rainfall'],
                //     left: 10
                // },
                toolbox: {
                    feature: {
                        dataZoom: {
                            yAxisIndex: 'none'
                        },
                        restore: {},
                        saveAsImage: {}
                    }
                },
                axisPointer: {
                    link: [
                        {
                            xAxisIndex: 'all'
                        }
                    ]
                },
                // dataZoom: [
                //     {
                //         show: true,
                //         realtime: true,
                //         start: 0,
                //         end: 100,
                //     },
                //     {
                //         type: 'inside',
                //         realtime: true,
                //         start: 0,
                //         end: 100,
                //     }
                // ],
                dataZoom: [
                    {
                        id: 'dataZoomX',
                        type: 'slider',
                        xAxisIndex: [0],
                        filterMode: 'filter',
                        height: 20,
                    },
                    {
                        id: 'dataZoomY',
                        type: 'slider',
                        yAxisIndex: [0],
                        filterMode: 'none',
                        width: 20,
                    }
                ],
                grid: {
                    containLabel: false,
                    show: false,
                },
                xAxis: [
                    {
                        // name: 'intensity',
                        type: 'value',
                        min: 0,
                        max: 1400,
                        position: 'bottom',
                        interval: 200,
                        // axisLabel: {
                        //     interval: '200'
                        // }
                    },
                ],
                yAxis: [
                    {
                        // name: 'm/z',
                        type: 'value',
                        splitLine: {
                            // show: false
                        },

                        position: 'left',
                        min: -100,
                        max: 100,
                        interval: 20,
                        axisLabel:{
                            show: true,
                            formatter: '{value} %'
                        }
                    },
                ],
                series: [
                    {
                        // name: 'm/z',
                        type: 'bar',
                        barWidth: 2,
                        // showBackground: true,
                        itemStyle: {
                            color: 'rgba(180, 180, 180, 1)',
                        },
                        // prettier-ignore
                        barGap: '-100%',
                        data: [
                            [0, 30],
                            [100, 20],
                            [200, 30],
                            [300, 40],
                            [400, 50]
                        ]
                    },
                    {
                        name: 'series name',
                        type: 'bar',
                        symbolSize: 1,
                        // showBackground: true,
                        barWidth: 2,
                        barGap: '-100%',
                        itemStyle: {
                            color: 'rgba(0, 0, 255, 1)',
                        },
                        // prettier-ignore
                        data: [
                            [400, 40],
                            [740, 40],
                            [850, 50]
                        ]
                    },
                ]
            }
        }
    },
    inject: ["loriData"],
    created() {
        console.log('loriData in chart', this.loriData)
        this.option.series[0].data = this.loriData.percent;

    },
    mounted() {
        // console.log(this.loriAttr)
    },
    methods: {

    }
};
</script>

<style scoped></style>