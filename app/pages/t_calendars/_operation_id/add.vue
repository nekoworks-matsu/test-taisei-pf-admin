<template>
  <t-add-view :param="param"></t-add-view>
</template>

<script>
  import TAddView from '~/components/TAddView'
  
  export default {
    layout: 'everyone',
    data() {
      return {
        param: {
          title: 'イベント登録',
          idLabel: 'イベント',
          isBackButtons: true,
          isHomeButtons: true,
          columns: [
            { name: '開始日時', column: 'startDateTime', placeholder: 'YYYY/MM/DD', required: true,date:"",hh:"1",mm:"1", type: 'datetime'},
            { name: '終了日時', column: 'endDateTime', placeholder: 'YYYY/MM/DD', required: true,date:"",hh:"1",mm:"1" , type: 'datetime'},
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
          success: '/t_calendars/' + this.$route.params.operation_id,
        },
      }
    },
    components: {
      TAddView
    },
    methods: {
      updateView(val) {
      },
      setTitle() {
        var reportList = JSON.parse(localStorage.getItem('report_list'));
        var target = reportList.find((report) => {
          return (report.id == this.$route.params.operation_id);
        });
        this.param.title = target.operation_name + " イベント登録";
      }
    },
    created() {
      const key = (parseInt(this.$route.params.operation_id) == 1) ? "Security:Schedule:create" : "Cleaning:Schedule:create";
      this.checkDisplayPermission(key, () => {
        let buildingId = localStorage.getItem('buildings_id');
        this.param.api = "/buildings/" + buildingId + "/schedules";
        this.setTitle();
        // var now = new Date();
        // this.param.init_val.startDateTime = now;
        $("body").css('background-color', '#FFF');
      });
    },
  }

</script>

<style lang="stylus" scoped>

</style>
