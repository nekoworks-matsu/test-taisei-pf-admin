<template>
  <t-search-view :param="param"/>
</template>

<script>
  import TSearchView from '~/components/TSearchView'
  import WorkStyleComponent from '~/components/WorkStyleComponent'

  export default {
    layout: 'everyone',
    data() {
      return {
        param: {
          title: '勤務スタッフ一覧',
          isBackButtons: true,
          isHomeButtons: true,
          backPath: '/t_home',
          api: '/buildings/'+ localStorage.getItem('buildings_id') + '/attendances',
          searchWhere: [{ operationCategoryId: parseInt(this.$route.params.id) }],
          search: [
            { name: '出勤時間', type: 'twoDateInputPicker', id: 'attendedAt' ,columns: [
                { column: 'attendedStartAt', columnName: 'attendedAt', placeholder: 'カレンダーから選択', type: 'date', where: 'gte' },
                { column: 'attendedEndAt', columnName: 'attendedAt', placeholder: 'カレンダーから選択', type: 'date', where: 'lte' }
              ]
            },
            { name: '退勤時間', type: 'twoDateInputPicker', id: 'leftAt', columns: [
                { column: 'leftStartAt', columnName: 'leftAt', placeholder: 'カレンダーから選択', type: 'date', where: 'gte' },
                { column: 'leftEndAt', columnName: 'leftAt', placeholder: 'カレンダーから選択', type: 'date', where: 'lte' }
              ]
            },
            { name: 'メンバー', column: 'memberId', type: 'select', notlike: true,
              options:[
                { name: '',value: ''}
              ]
            },
            {name: 'シフト' , column: 'workShift', type: 'select', notlike: true,
              options: this.getWorkShiftList(true)
            },
          ],
          list: {
            title: '検索結果',
            columns: [
              { name: '出勤時間', column: 'attendedAt', fn: this.df2 },
              { name: '退勤時間', column: 'leftAt', fn: this.df2 },
              { name: 'メンバー名', column: 'member.name' },
              { name: 'シフト', column: 'workShift',component:WorkStyleComponent},
            ],
            init_val: {
            },
            items: [  
            ],
            icon: 'fa-dot-circle-o',
            add: '/t_attendance/' + this.$route.params.id + '/add',
            read: '/t_attendance/' + this.$route.params.id + '/details/',
          }
        },
      }
    },
    components: {
      TSearchView
    },
    methods: {
      getMembersInfo(){
        let buildingId = localStorage.getItem('buildings_id');
        let api_for_list = '/buildings/'+buildingId+'/members';
        var where = {"and":[{"operationTypeId": this.getOperationTypeId(this.$route.params.id)}, {"role":{"neq":3}}]};
        this.onSearch(api_for_list, null, where, val => {
          const list = [{ name: "", value: "" }];
          val.forEach(function(obj){
            list.push({name: obj.name, value: obj.id});
          });
          this.param.search[2].options = list;
        });
      },
      setTitle() { 
        var reportList = JSON.parse(localStorage.getItem('report_list'));
        var target = reportList.find((report) => {
          return (report.id == this.$route.params.id);
        });
        this.param.title = target.operation_name + " 勤務スタッフ一覧";
      },
    },
    created() {
      const key = (parseInt(this.$route.params.id) == 1) ? "Security:Attendance:search" : "Cleaning:Attendance:search";
      this.checkDisplayPermission(key,() => {
        this.setTitle();
        this.getMembersInfo();
      });
      localStorage.setItem("privious_page", null);
      $("body").css('background-color', '#FFF');
    },
  }


</script>

<style lang="stylus" scoped>

</style>
