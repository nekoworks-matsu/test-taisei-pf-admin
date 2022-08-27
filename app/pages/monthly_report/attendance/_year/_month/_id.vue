<template>
  <search-view :param="param" :isRemoveAdd="true" />
</template>

<script>
  import SearchView from '~/components/SearchView'
  import WorkStyleComponent from '~/components/WorkStyleComponent'

  export default {

    data() {
      return {
        param: {
          title: '月次件数:勤務スタッフ',
          operation: 'データ分析',
          api: '/buildings/' + localStorage.getItem('buildings_id') + '/monthly-attendances',
          search: [
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
              { name: '出勤時間', column: 'attendedAt', fn: this.df },
              { name: '退勤時間', column: 'leftAt', fn: this.df },
              { name: 'メンバー名', column: 'member.name' },
              { name: 'シフト', column: 'workShift',component:WorkStyleComponent},
              { name: '登録日時', column: 'createdAt', fn: this.df },
              { name: '更新日時', column: 'updatedAt', fn: this.df },
            ],
            init_val: {
            },
            items: [  
            ],
            icon: 'fa-dot-circle-o',
            read: '/attendance/' + this.$route.params.id + '/details/',
          }
        },
      }
    },
    components: {
      SearchView
    },
    methods: {
      getMembersInfo(){
        let buildingId = localStorage.getItem('buildings_id');
        let api_for_list = '/buildings/' + buildingId + '/members';
        this.onSearch(api_for_list, null, null, val => {
          const list = [{ name: "", value: "" }];
          val.forEach(function(obj){
            list.push({ name: obj.name, value: obj.id});
          });
          this.param.search[0].options = list;
        });
      },
      setTitle() { 
        var reportList = JSON.parse(localStorage.getItem('report_list'));
        var target = reportList.find((report) => {
          return (report.id == this.$route.params.id);
        });
        this.param.title = "月次件数:" + target.operation_name + " 勤務スタッフ";
      },
    },
    created() {
      const key = "Report:Monthly:view";
      this.checkDisplayPermission(key, () => {
        this.getMembersInfo();
        this.setTitle();
        this.param.addFilter = { year: this.$route.params.year, month: this.$route.params.month, operationCategoryId: this.$route.params.id };
      });
    },
  }
</script>

<style lang="stylus" scoped>

</style>
