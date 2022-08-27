<template>
  <search-view :param="param" :isRemoveAdd="true" v-if="isRouterShow"/>
</template>

<script>
  import SearchView from '~/components/SearchView'
  import StatusComponent from '~/components/StatusComponent'
  import ActivatedComponent from '~/components/ActivatedComponent'

  export default {
    data() {
      return {
        isRouterShow: true,
        members: '',
        param: {
          title: '報告書承認',
          operatiion: '',
          api: '/approve-reports',
          searchWhere: [{operationCategoryId: parseInt(this.$route.params.id)}, {buildingId: parseInt(localStorage.getItem('buildings_id'))}, {reportDefinitionId: this.$route.params.id}],
          search: [
            // { type: 'checkbox', name: '承認待ち'},
            { name: 'ステータス', type: 'multiCheckbox', columns: [ {label: '申請中', value: 1, column: 'reportStatus'}, { label: '差戻し', value: 2, column: 'reportStatus'}, { label: '再申請中', value: 3, column: 'reportStatus'}, { label: '承認済', value: 4, column: 'reportStatus'}]},
            { name: '報告日', type: 'twoDateInputPicker', columns: [
                { column: 'attendedStartAt', columnName: 'reportedAt', placeholder: 'カレンダーから選ぶ', type: 'date', where: 'gte' },
                { column: 'attendedEndAt', columnName: 'reportedAt', placeholder: 'カレンダーから選ぶ', type: 'date', where: 'lte' }
              ]
            },
          ],
          list: {
            title: '検索結果',
            columns: [
              { name: 'ID', column: 'reportId', sort: true, width: '100'},
              { name: '報告日', column: 'reportedAt', sort: true, fn: this.df3 ,width: '125'},
              { name: '報告責任者', column: 'reportedBy', fn: this.getMembersName},
              { name: 'ステータス', column: 'reportStatus', component: StatusComponent, width: '115'},
              { name: '登録日', column: 'createdAt', sort: true, fn: this.df , width: '200'},
              { name: '更新日時', column: 'updatedAt', sort: true, fn: this.df, width: '200' },
            ],
            init_val: {
            },
            items: [
            ],
            icon: 'fa-user',
            read: '/report_approval/details/' + this.$route.params.id + '/',
            add: '/report/add/'+ this.$route.params.id,
          }
        },
      }
    },
    components: {
      SearchView,
      StatusComponent
    },
    methods: {
      reload() {
        this.isRouterShow = false;
        const key = (parseInt(this.$route.params.id) == 1) ? "Security:ApproveReport:search" : "Cleaning:ApproveReport:search";
        this.checkDisplayPermission(key, () => {
          this.$nextTick(function() {
            this.setTitle();
            this.getMembersInfo();
            this.param.searchWhere[0].operationCategoryId = parseInt(this.$route.params.id);
            // this.param.searchWhere[0].operationReportTemplateId = this.getOperationTemplateId(parseInt(this.$route.params.id));
            this.isRouterShow = true
            // this.param.searchWhere[0].operationReportTemplateId.inq = [];
            // var historicalTemplates = JSON.parse(localStorage.getItem('history_templates'));
            // var setInq = historicalTemplates.filter(val => val.operationId == this.$route.params.id);
            // for (var j = 0; j < setInq.length; j++) {
            //   if (!this.param.searchWhere[0].operationReportTemplateId.inq.some(ele => ele == setInq[j].id)) {
            //     this.param.searchWhere[0].operationReportTemplateId.inq.push(setInq[j].id);
            //   }
            // }
          });
        });
      },
      setTitle() { 
        var reportList = JSON.parse(localStorage.getItem('report_list'));
        var target = reportList.find((report) => {
          return (report.id == this.$route.params.id);
        });
        this.param.title = '日報承認';
        this.param.operation = target.name.replace(/報告書/g, '');
      },
      getMembersInfo(){
        var list = [];
        this.onSearch("/members", null, null, val => {
          val.forEach(function(obj){
            list.push({name: obj.name, id: obj.id});
          });
        });
        this.members = list;
      },
      getMembersName(id) {
        if (this.members == '') return;
        for (var i = 0; i < this.members.length; i++) {
          if (this.members[i].id == id) {
            return this.members[i].name;
          }
        }
      }
    },
    created() {
      const key = (parseInt(this.$route.params.id) == 1) ? "Security:ApproveReport:search" : "Cleaning:ApproveReport:search";
      this.checkDisplayPermission(key, () => {
        this.setTitle();
        this.getMembersInfo();
        // this.param.searchWhere[0].operationReportTemplateId.inq = [];
        // var historicalTemplates = JSON.parse(localStorage.getItem('history_templates'));
        // var setInq = historicalTemplates.filter(val => val.operationId == this.$route.params.id);
        // for (var j = 0; j < setInq.length; j++) {
        //   if (!this.param.searchWhere[0].operationReportTemplateId.inq.some(ele => ele == setInq[j].id)) {
        //     this.param.searchWhere[0].operationReportTemplateId.inq.push(setInq[j].id);
        //   }
        // }
      });
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
