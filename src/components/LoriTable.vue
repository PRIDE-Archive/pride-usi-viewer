<template>
    <div style="background-color: gray;padding: 2px; overflow-x: hidden; width: 100%;">
        <!-- <div>lori table</div>
        <div>{{ loriAttr.title }}</div>
        <Button type="success" @click="submitForm">Submit Table</Button> -->
        <!-- {{ columns }} -->
        <Table :columns="columns" :data="data" size="small" border></Table>
    </div>
</template>

<script>

export default {
    inject: ["loriAttr"],
    data() {
        return {
            columns1: [
                {
                    title: 'Name',
                    key: 'name'
                },
            ],
            data: [

            ]
        }
    },
    computed: {
        columns: function () {
            let tableColumns = [];
            // console.log("this.loriAttr.ions.group:", this.loriAttr.ions);
            for (let i = 0; i < this.loriAttr.ions.length; i++) {
                let groupName = this.loriAttr.ions[i].name;
                let groupData = this.loriAttr.ions[i].data;
                // console.log("groupName:", groupName);
                // console.log("groupData:", groupData);
                for (let j = 0; j < groupData.length; j++) {
                    let checked = groupData[j];
                    if (checked) {
                        tableColumns.push({
                            title: j == 0 ? groupName + '+' : groupName + (j + 1) + '+',
                            key: groupName + (j + 1),
                            align: 'center',
                            width: 80
                        })
                    }
                }

                if (groupName == 'c') {
                    tableColumns.push({
                        title: '#',
                        key: 'seq1',
                        align: 'center',
                        width: 50
                    });
                    tableColumns.push({
                        title: 'Seq',
                        key: 'seq',
                        align: 'center',
                        width: 70
                    });
                    tableColumns.push({
                        title: '#',
                        key: 'seq2',
                        align: 'center',
                        width: 50
                    });
                }

            }
            return tableColumns;
        }
    },
    watch: {
        loriAttr: {
            handler(newValue, oldValue) {
                console.log("loriAttr changed in table:", newValue, oldValue);
            },
            deep: true,
        }
    },
    created() {
        for (let i = 0; i < 14; ++i) {
            let line = {
                seq1: '' + (i + 1),
                seq: '' + (i + 1),
                seq2: '' + (i + 1),
            }
            for (let j = 1; j < 4; ++j) {
                line[`a${j}`] = '' + (i + 1);
                line[`b${j}`] = '' + (i + 1);
                line[`c${j}`] = '' + (i + 1);
                line[`x${j}`] = '' + (i + 1);
                line[`y${j}`] = '' + (i + 1);
            }
            this.data.push(line);
        }

        for (let i = 0; i < this.loriAttr.ions.length; i++) {
            let groupName = this.loriAttr.ions[i].name;
            let groupData = this.loriAttr.ions[i].data;
            // console.log("groupName:", groupName);
            // console.log("groupData:", groupData);
            for (let j = 0; j < groupData.length; j++) {
                let checked = groupData[j];
                if (checked) {
                    let key = groupName + (j + 1);
                    tableColumns.push({
                        title: j == 0 ? groupName + '+' : groupName + (j + 1) + '+',
                        key: groupName + (j + 1),
                        align: 'center',
                        width: 80
                    })
                }
            }

        }

    },
    methods: {
        submitForm() {
            console.log("Form submitted:", this.loriAttr);
            this.loriAttr.title = 'LoriTable Table';
        },
    },
};
</script>

<style scoped>
:deep(table) {
    margin-bottom: 0 !important;
}

:deep(.ivu-table-cell) {
    padding-left: 0;
    padding-right: 0;
}
</style>