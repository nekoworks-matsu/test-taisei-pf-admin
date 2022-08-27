<template>
  <monthly-report-view></monthly-report-view>
</template>

<script>
  import MonthlyReportView from '~/components/MonthlyReportView'
  
  export default {
    components: {
      MonthlyReportView
    },
    created() {
      const key = "Report:Monthly:view";
      this.checkDisplayPermission(key, () => {
      });
    },
  }

</script>

<style lang="stylus" scoped>

</style>
