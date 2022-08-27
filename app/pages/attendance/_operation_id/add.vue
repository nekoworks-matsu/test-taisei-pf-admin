<template>
  <add-view :param="param"></add-view>
</template>

<script>
  import AddView from '~/components/AddView'
  
  export default {
    data() {
      return {
        param: {
          title: '勤務スタッフ',
          idLabel: '勤務スタッフ',
          columns: [
            { name: '出勤時間', column: 'attendedAt', placeholder: 'YYYY/MM/DD', type: 'datetime',date:"",hh:"",mi:"",required: true},
            { name: '退勤時間', column: 'leftAt', placeholder: 'YYYY/MM/DD', type: 'datetime',date:"",hh:"",mi:"",required: false},
            { name: 'メンバー', column: 'memberId', type: 'select', options: [], required: true},
            { name: 'シフト', column: 'workShift', type: 'select', required: true, options: this.getWorkShiftList(false)},
            { name: 'ビルID', column: 'buildingId', type: 'hiddenColmun'}
            ,
          ],
          init_val: {
            memberId:null,
            workShift:1,
            attendedAt:null,
            buildingId:null,
            operationCategoryId: parseInt(this.$route.params.operation_id)
          },
          cb: this.updateView,
          api: '/attendances',
          icon: 'fa-user',
          success: '/attendance/' + this.$route.params.operation_id,
        },
      }
    },
    components: {
      AddView
    },
    methods: {
      getMansionList(){
        let buildingId = localStorage.getItem('buildings_id');
        let ownId = localStorage.getItem('member_id');
        let api_for_list = '/buildings/'+ buildingId + '/members';
        var where = {"and":[{"operationTypeId": this.getOperationTypeId(this.$route.params.operation_id)}, {"role":{"neq":3}}]};
        this.onSearch(api_for_list, null, where, val => {
          const list = [];
          val.forEach(function(obj){
            list.push({name: obj.name, value: obj.id});
          });
          if (list.length != 0){
            this.param.init_val.memberId = parseInt(ownId);
          }
          this.param.columns[2].options = list;
          var now = new Date();
          this.param.init_val.attendedAt = now;
          this.param.init_val.buildingId = parseInt(buildingId);
          this.param.columns[0].hh = now.getHours()+1;
          this.param.columns[0].mm = now.getMinutes()+1;
        });
      },
      setTitle() {
        var reportList = JSON.parse(localStorage.getItem('report_list'));
        var target = reportList.find((report) => {
          return (report.id == this.$route.params.operation_id);
        });
        this.param.title = "勤務スタッフ";
        this.param.operation = target.operation_name;
      }
    },
    created() {
      const key = (this.$route.params.operation_id == 1) ? "Security:Attendance:create" : "Cleaning:Attendance:create";
      this.checkDisplayPermission(key,() => {
        this.getMansionList();
        this.setTitle();
      });
    },
  }

</script>

<style lang="stylus" scoped>

</style>
