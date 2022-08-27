<template>
  <search-view :param="param" :isRemoveAdd="isRemoveAdd" v-if="isRouterShow"/>
</template>

<script>
  import SearchView from '~/components/SearchView'
  import WorkStyleComponent from '~/components/WorkStyleComponent'


  export default {

    data() {
      return {
        isRouterShow: true,
        isRemoveAdd: null,
        param: {
          title: '勤務スタッフ',
          operation: '',
          api: '/buildings/'+ localStorage.getItem('buildings_id') + '/attendances',
          searchWhere: [{ operationCategoryId: parseInt(this.$route.params.id) }],
          search: [
            { name: '出勤時間', type: 'twoDateInputPicker', columns: [
                { column: 'attendedStartAt', columnName: 'attendedAt', placeholder: 'カレンダーから選ぶ', type: 'date', where: 'gte' },
                { column: 'attendedEndAt', columnName: 'attendedAt', placeholder: 'カレンダーから選ぶ', type: 'date', where: 'lte' }
              ]
            },
            { name: '退勤時間', type: 'twoDateInputPicker', columns: [
                { column: 'leftStartAt', columnName: 'leftAt', placeholder: 'カレンダーから選ぶ', type: 'date', where: 'gte' },
                { column: 'leftEndAt', columnName: 'leftAt', placeholder: 'カレンダーから選ぶ', type: 'date', where: 'lte' }
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
              { name: '出勤時間', column: 'attendedAt', sort: true, fn: this.df2 },
              { name: '退勤時間', column: 'leftAt', sort: true, fn: this.df2 },
              { name: 'メンバー名', column: 'member.name' },
              { name: 'シフト', column: 'workShift', sort: true, component:WorkStyleComponent},
              { name: '登録日時', column: 'createdAt', sort: true, fn: this.df },
              { name: '更新日時', column: 'updatedAt', sort: true, fn: this.df },
            ],
            init_val: {
            },
            items: [  
            ],
            icon: 'fa-dot-circle-o',
            add: '/attendance/' + this.$route.params.id + '/add',
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
        //MEMO:今後if (localStorage.getItem('role') == 'responsible') で権限別API対応の可能性あり
        // var where = {"and":[{"operationCategoryId": this.$route.params.id}, {"role":{"neq":3}}]};
        var where = {"and":[{"operationTypeId": this.getOperationTypeId(this.$route.params.id)}, {"role":{"neq":3}}]};
        let api_for_list = '/buildings/' + buildingId + '/members';
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
        this.param.title = "勤務スタッフ";
        this.param.operation = target.operation_name;
      },
      reload() {
        const key = (parseInt(this.$route.params.id) == 1) ? "Security:Attendance:search" : "Cleaning:Attendance:search";
        this.checkDisplayPermission(key,() => {
          this.isRouterShow = false;
          this.$nextTick(function() {
            this.setTitle();
            this.getMembersInfo();
            this.isRouterShow = true
          })
        });
      }
    },
    created() {
      const key = (parseInt(this.$route.params.id) == 1) ? "Security:Attendance:search" : "Cleaning:Attendance:search";
      this.checkDisplayPermission(key,() => {
        this.setTitle();
        this.getMembersInfo();
      });
      const addKey = (parseInt(this.$route.params.id) == 1) ? "Security:Attendance:create" : "Cleaning:Attendance:create";
      this.isRemoveAdd = !this.checkMenuPermission(addKey);
      
      // this.search_item = JSON.parse(localStorage.getItem('search_item'));
      // localStorage.removeItem('search_item');
      // window.onpopstate = this.windowBack(event, this.search_item);
    },
    watch: {
      $route: function(route) {
        this.reload();
      }
    }
  }


</script>

<style lang="stylus" scoped>

</style>
