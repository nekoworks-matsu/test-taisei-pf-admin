<template>
  <div class="content-wrapper ts_content_wrapper">
    <loading
      :active.sync="loading"
      :can-cancel=false
      :is-full-page="fullpage"></loading>
    <!-- Content Header (Page header) -->
    <section class="content_head">
      <div class="ts_content_head">
        <div class="ts_breadcrumb">
          <ol>
          </ol>
        </div>
      </div>
    </section>
    <Sensor></Sensor>
  </div>
</template>

<script>
  import Sensor from '~/components/Sensor'
  import Loading from 'vue-loading-overlay';
  
  export default {
    data() {
      return {
        fullpage:true
      }
    },
    components: {
      Sensor,
      Loading
    },
    methods: {
    },
    mounted() {
    },
    created() {
    },
    updated() {
    }
  }

</script>

<style lang="stylus" scoped>

</style>
