<template>
  <search-view :param="param" :isRemoveAdd="isRemoveAdd" v-if="isRouterShow" />
</template>

<script>
  import SearchView from '~/components/SearchView'
  import StatusComponent from '~/components/StatusComponent'
  import NoticeComponent from '~/components/NoticeComponent'
  import HeadquartersComment from '~/components/HeadquartersComment'

  export default {
    data() {
      return {
        isRouterShow: true,
        isRemoveAdd: false,
        report_name: '',
        isHeadquartersMode: this.toBoolean(localStorage.getItem('is_headquarters_mode')),
        param: {
          title: '',
          operation: '',
          api: '/buildings/' + localStorage.getItem('buildings_id') + '/reports',
          include: [{relation: 'member'}, {relation: 'headquartersComments'}],
          searchWhere: [{ operationCategoryId: {"inq":[]}, buildingId:{"inq":[]}}],
          search: [
            { name: 'ステータス', type: 'multiCheckbox', columns: [  { label: '未申請', value: 0, column: 'reportStatus'}, {label: '申請中', value: 1, column: 'reportStatus'}, { label: '差戻し', value: 2, column: 'reportStatus'}, { label: '再申請中', value: 3, column: 'reportStatus'}, { label: '承認済', value: 4, column: 'reportStatus'}]},
            { name: '報告日', type: 'twoDateInputPicker', columns: [
                { column: 'reportedStartAt', columnName: 'reportedAt', placeholder: 'カレンダーから選ぶ', type: 'date', where: 'gte' },
                { column: 'reportedEndAt', columnName: 'reportedAt', placeholder: 'カレンダーから選ぶ', type: 'date', where: 'lte' }
              ]
            },
            { name: "報告責任者", column: "reportedBy", type: "select", notlike: true, options:[
                { name: '',value: ''}
              ]
            },
            { name: "ビル", column: "buildingId", type: "select", notlike: true, options: [] },
            { name: "特記事項", type: 'twoCheckbox', columns: [ {label: 'あり', value: '{"like":"%"}', column: 'notice'}, { label: 'なし', value: '{"eq":null}', column: 'notice'}]},
            { name: "本部コメント", type: 'twoCheckbox', columns: [ {label: 'あり', value: true, column: 'hasHeadquartersComment'}, { label: 'なし', value: false, column: 'hasHeadquartersComment'}]},
            // { name: "特記事項", column: "notice", type: "isTextSelect", notlike: true, options: [
            //     { name: "", value: "" }, 
            //     { name: "あり", value: '{"like":"%"}' }, 
            //     { name: "なし", value: '{"eq":null}' }, 
            //   ] 
            // },
            // { name: "本部コメント", column: "hasHeadquartersComment", type: "select", notlike: true, options: [
            //     { name: "", value: "" }, 
            //     { name: "あり", value: true }, 
            //     { name: "なし", value: false }, 
            //   ] 
            // },
          ],
          list: {
            title: '検索結果',
            columns: [
              { name: '報告日', column: 'reportedAt', sort: true, fn: this.df3, width: '125' },
              { name: '報告責任者', column: 'member.name' },
              { name: 'ビル', column: 'buildingId', fn: this.getBuildingName },
              { name: 'ステータス', column: 'approveReport.reportStatus', component: StatusComponent, width: '115'},
              { name: '特記事項', column: 'notice', component: NoticeComponent, width: '100' },
              { name: '本部コメント', column: 'headquartersComments', component: HeadquartersComment, width: '130'},
              { name: '登録日時', column: 'createdAt', sort: true, fn: this.df, width: '200' },
              { name: '更新日時', column: 'updatedAt', sort: true, fn: this.df, width: '200' },
            ],
            icon: 'fa-dot-circle-o',
            read: '/report/' + this.$route.params.operation_category + '/details/',
            add: '/report/' + this.$route.params.operation_category + '/add',
          },
        },
      }
    },
    components: {
      SearchView,
      StatusComponent,
      NoticeComponent
    },
    methods: {
      getBuildingName(val) {
        var buildings = JSON.parse(localStorage.getItem('building_list'));
        var buil = buildings.find(function(obj){
          return (obj.id == val);
        });
        return buil.name;
      },
      getBuildingsList(api){
        var buildings = JSON.parse(localStorage.getItem('building_list'));
        var where = {"operationCategoryId": parseInt(this.$route.params.operation_category)};
        var that = this;
        that.param.searchWhere[0].buildingId.inq = [];
        that.param.searchWhere[0].operationCategoryId.inq = [];
        const operationCategories = JSON.parse(localStorage.getItem('operation_categories'));
        const currntCategory = operationCategories.find(val => val.id == parseInt(this.$route.params.operation_category));
        buildings.forEach(function(obj){
          that.param.searchWhere[0].buildingId.inq.push(obj.id);
          const find = operationCategories.find(val => (val.buildingId == obj.id && val.operationTypeId == currntCategory.operationTypeId));
          if (find) {
            that.param.searchWhere[0].operationCategoryId.inq.push(find.id); 
          }
        });

        this.onSearch(api, null, where, val => {
          const list = [{name: '', value: ''}];
          var inq = [];
          val.forEach(function(obj){
            var value = buildings.find(val => val.id == obj.id);
            if (value != undefined) {
              list.push({ name: obj.name, value: obj.id});
            }
          });
          that.param.search[3].options = list;
        })
      },
      setReportTitle() {
        var report_list = JSON.parse(localStorage.getItem('report_list'));
        for (var i = 0; i < report_list.length; i++) {
          if (report_list[i].id == this.$route.params.operation_category) {
            this.param.title = '日報';
            this.param.operation = report_list[i].name.replace(/報告書/g, '');
            // this.param.title = report_list[i].name;
            break;
          }
        }
      },
      getMembersInfo(){
        var where = {"and":[{"operationTypeId": this.getOperationTypeId(this.$route.params.operation_category)}, {"role":{"neq":3}}, {"companyId": localStorage.getItem('company_id')}]};
        var api = '';
        if (this.isHeadquartersMode) {
          api = '/members'
        } else {
          api = '/buildings/'+ localStorage.getItem('buildings_id') + '/members';
        }
        this.onSearch(api, null, where, val => {
          const list = [{ name: "", value: "" }];
          val.forEach(function(obj){
            list.push({name: obj.name, value: obj.id});
          });
          if (this.isHeadquartersMode) {
            this.param.search[2].options = list;
          }else{
            this.param.search[1].options = list;
          }

        });
      },
      everyRoleDisplayConfig() {
        if (this.isHeadquartersMode) {
          this.param.api = '/reports';
          this.getBuildingsList('/buildings');
          this.isRemoveAdd = true;
        } else {
          this.param.api = '/buildings/' + localStorage.getItem('buildings_id') + '/reports';
          this.param.search.splice(3, 1);
          this.param.list.columns.splice(2, 1);
          this.param.searchWhere.splice(1, 1);
        }
      },
      reload() {
        this.isRouterShow = false;
        this.$nextTick(function() {
          this.everyRoleDisplayConfig();
          this.setReportTitle();
          this.getMembersInfo();
          if (!this.isHeadquartersMode) {
            this.setOperationTemplateIds(parseInt(this.$route.params.operation_category));
          }
          this.isRouterShow = true
        })
      },
      setOperationTemplateIds(operationCategoryId) {
        this.param.searchWhere[0].operationCategoryId.inq.push(operationCategoryId);
        delete this.param.searchWhere[0]['buildingId'];


        // if (this.isHeadquartersMode) {
        //   var templateList = JSON.parse(localStorage.getItem('template_list'));
        //   for (var i = 0; i < templateList.length; i++) {
        //     if (templateList[i].operationCategoryId == operationCategoryId) {
        //       this.param.searchWhere[0].operationReportTemplateId.inq.push(templateList[i].templateId);
        //     }
        //   }
        // } else {
        //   var historicalTemplates = JSON.parse(localStorage.getItem('history_templates'));
        //   var setInq = historicalTemplates.filter(val => val.operationId == operationCategoryId);
        //   for (var j = 0; j < setInq.length; j++) {
        //     if (!this.param.searchWhere[0].operationReportTemplateId.inq.some(ele => ele == setInq[j].id)) {
        //       this.param.searchWhere[0].operationReportTemplateId.inq.push(setInq[j].id);
        //     }
        //   }
        // }
      },
    },
    created() {
      const key = (parseInt(this.$route.params.operation_category) == 1) ? "Security:Report:search" : "Cleaning:Report:search";
      this.checkDisplayPermission(key, () => {
        localStorage.removeItem('add_reported_at');
        this.everyRoleDisplayConfig();
        this.setReportTitle();
        this.getMembersInfo();
        if (!this.isHeadquartersMode) {
          this.setOperationTemplateIds(parseInt(this.$route.params.operation_category));
        }
      
        // this.search_item = JSON.parse(localStorage.getItem('search_item'));
        // localStorage.removeItem('search_item');
        // window.onpopstate = this.windowBack(event, this.search_item);
      });
      const addKey = (parseInt(this.$route.params.operation_category) == 1) ? "Security:Report:create" : "Cleaning:Report:create";
      this.isRemoveAdd = !this.checkMenuPermission(addKey);
      if (this.isHeadquartersMode) {
        this.isRemoveAdd = true;
      }
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
