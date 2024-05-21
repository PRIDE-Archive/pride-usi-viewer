<template>
  <div id="app">
    <lorikeet></lorikeet>
  </div>
</template>
<script>
import lorikeet from '@/components/Index.vue'
export default {
  name: 'app',
  components: {
    lorikeet
  },

  mounted: function () {
    try {
      if (window != window.top) {
        this.$router.push({ name: '404' });
      }

    }
    catch (e) {
      this.$router.push({ name: '404' });
    }
  },

}
</script>
<style type="text/css">
html,
body {
  min-width: 720px !important;
}
</style>
