<template>
  <add-view :param="param"></add-view>
</template>

<script>
  import AddView from '~/components/AddView'
  
  export default {
    data() {
      return {
        param: {
          title: 'イベント',
          idLabel: 'イベント',
          columns: [
            { name: '開始日時', placeholder: 'YYYY/MM/DD', column: 'startDateTime', required: true,date:"",hh:"1",mm:"1", type: 'datetime'},
            { name: '終了日時', placeholder: 'YYYY/MM/DD', column: 'endDateTime', required: true,date:"",hh:"1",mm:"1" , type: 'datetime'},
            { name: '件名', column: 'title', required: true, maxlength: 64 },
            { name: '本文', column: 'body', type: 'textarea', maxlength: 512 },
          ],
          init_val: {
            startDateTime:null,
            endDateTime:null,
            operationCategoryId: parseInt(this.$route.params.operation_id)
          },
          cb: this.updateView,
          api: '',
          icon: 'fa-user',
          success: '/calendars/' + this.$route.params.operation_id,
        },
      }
    },
    components: {
      AddView
    },
    methods: {
      updateView(val) {
      },
      setTitle() {
        var reportList = JSON.parse(localStorage.getItem('report_list'));
        var target = reportList.find((report) => {
          return (report.id == this.$route.params.operation_id);
        });
        this.param.title = "イベント";
        this.param.operation = target.operation_name;
      }
    },
    created() {
      const key = (parseInt(this.$route.params.operation_id) == 1) ? "Security:Schedule:create" : "Cleaning:Schedule:create";
      this.checkDisplayPermission(key, () => {
        let buildingId = localStorage.getItem('buildings_id');
        this.param.api = "/buildings/" + buildingId + "/schedules";

        // var now = new Date();
        // this.param.init_val.startDateTime = now;
        this.setTitle();
      });
    },
  }

</script>

<style lang="stylus" scoped>

</style>
