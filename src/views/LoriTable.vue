<template>
  <div style="">
    <Table
      ref="tableView"
      :columns="columns"
      :data="data"
      width="100%"
      size="small"
      border
    ></Table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { loriAttr } from "@/store";

const data = ref([]);

onMounted(() => {
  for (let i = 0; i < 14; ++i) {
    let line = {
      seq1: "" + (i + 1),
      seq: "" + (i + 1),
      seq2: "" + (i + 1),
    };
    for (let j = 1; j < 4; ++j) {
      line[`a${j}`] = "" + (i + 1);
      line[`b${j}`] = "" + (i + 1);
      line[`c${j}`] = "" + (i + 1);
      line[`x${j}`] = "" + (i + 1);
      line[`y${j}`] = "" + (i + 1);
      if (i >= 2 && i <= 4) {
        line["cellClassName"] = { a1: "info-cell" };
      }

      if (i >= 6 && i <= 8) {
        line["cellClassName"] = { a2: "warn-cell" };
      }
    }
    data.value.push(line);
  }

  for (let i = 0; i < loriAttr.ions.length; i++) {
    let groupName = loriAttr.ions[i].name;
    let groupData = loriAttr.ions[i].data;
    // console.log("groupName:", groupName);
    // console.log("groupData:", groupData);
    for (let j = 0; j < groupData.length; j++) {
      let checked = groupData[j];
      if (checked) {
        let key = groupName + (j + 1);
        tableColumns.push({
          title: j == 0 ? groupName + "+" : groupName + (j + 1) + "+",
          key: groupName + (j + 1),
          align: "center",
          width: 80,
        });
      }
    }
  }
});

const columns = computed(() => {
  let tableColumns = [];
  // console.log("this.loriAttr.ions.group:", this.loriAttr.ions);
  for (let i = 0; i < loriAttr.ions.length; i++) {
    let groupName = loriAttr.ions[i].name;
    let groupData = loriAttr.ions[i].data;
    // console.log("groupName:", groupName);
    // console.log("groupData:", groupData);
    for (let j = 0; j < groupData.length; j++) {
      let checked = groupData[j];
      if (checked) {
        tableColumns.push({
          title: j == 0 ? groupName + "+" : groupName + (j + 1) + "+",
          key: groupName + (j + 1),
          align: "center",
          width: 80,
        });
      }
    }

    if (groupName == "c") {
      tableColumns.push({
        className: "gray-column",
        title: "#",
        key: "seq1",
        align: "center",
        width: 50,
      });
      tableColumns.push({
        className: "blue-column",
        title: "Seq",
        key: "seq",
        align: "center",
        width: 70,
      });
      tableColumns.push({
        className: "gray-column",
        title: "#",
        key: "seq2",
        align: "center",
        width: 50,
      });
    }
  }

  return tableColumns;
});
</script>

<style>
.table table {
  width: 50% !important;
}

.ivu-table td.blue-column {
  background-color: #88baec;
  /* color: white; */
}

.ivu-table td.gray-column {
  background-color: #e8eaec;
  /* color: white; */
}

.ivu-table .info-cell {
  background-color: #65a8f0;
  color: #fff;
}

.ivu-table .warn-cell {
  background-color: #e9c082;
  color: #fff;
}

.ivu-table .demo-table-info-cell-name {
  background-color: #5dbeeb;
  color: #fff;
}

/* .ivu-table-overflowX {
  overflow-x: hidden;
}

.overflowX {
  overflow-x: scrole !important;
} */
</style>

<style scoped>
:deep(table) {
  margin-bottom: 0 !important;
}

:deep(.ivu-table-cell) {
  padding-left: 0;
  padding-right: 0;
}
</style>
