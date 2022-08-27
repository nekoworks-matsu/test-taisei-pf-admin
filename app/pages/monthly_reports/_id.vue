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
        isRemoveAdd: false,
        isHeadquartersMode: this.toBoolean(localStorage.getItem('is_headquarters_mode')),
        param: {
          title: '月次報告書',
          operation: '',
          api: '/monthly-reports',
          searchWhere: [{ operationCategoryId: {"inq":[]}, buildingId:{"inq":[]}}],
          search: [
            { name: "ビル", column: "buildingId", type: "select", notlike: true, options: [] },
            { name: '報告年月', type: 'twoDateInputPickerMonth', columns: [
                { column: 'reportYearMonthStart', columnName: 'reportYearMonth', placeholder: 'カレンダーから選ぶ', type: 'date', where: 'gte' },
                { column: 'reportYearMonthEnd', columnName: 'reportYearMonth', placeholder: 'カレンダーから選ぶ', type: 'date', where: 'lte' }
              ]
            },
          ],
          list: {
            title: '検索結果',
            columns: [
              { name: 'ビル', column: 'buildingId', sort: true, fn: this.getBuildingName },
              { name: '年', column: 'reportYear' , sort: true},
              { name: '月', column: 'reportMonth' , sort: true},
              { name: '登録日時', column: 'createdAt', sort: true, fn: this.df },
              { name: '更新日時', column: 'updatedAt', sort: true, fn: this.df },
            ],
            init_val: {
            },
            items: [  
            ],
            icon: 'fa-dot-circle-o',
            add: '/monthly_reports/' + this.$route.params.id + '/add',
            read: '/monthly_reports/' + this.$route.params.id + '/details/',
          }
        },
      }
    },
    components: {
      SearchView
    },
    methods: {
      getBuildingsListRequest(){
        var buildings = JSON.parse(localStorage.getItem('building_list'));
        var where = {"operationReportTemplateId": parseInt(this.$route.params.id)};
        var that = this;
        that.param.searchWhere[0].buildingId.inq = [];
        that.param.searchWhere[0].operationCategoryId.inq = [];
        const operationCategories = JSON.parse(localStorage.getItem('operation_categories'));
        const currntCategory = operationCategories.find(val => val.id == parseInt(this.$route.params.id));
        buildings.forEach(function(obj){
          that.param.searchWhere[0].buildingId.inq.push(obj.id);
          const find = operationCategories.find(val => (val.buildingId == obj.id && val.operationTypeId == currntCategory.operationTypeId));
          if (find) {
            that.param.searchWhere[0].operationCategoryId.inq.push(find.id); 
          }
        });

        this.onSearch('/buildings', null, where, val => {
          const list = [{name: '', value: ''}];
          var inq = [];
          val.forEach(function(obj){
            var value = buildings.find(val => val.id == obj.id);
            if (value != undefined) {
              list.push({ name: obj.name, value: obj.id});
            }
          });
          that.param.search[0].options = list;
        });
      },
      getBuildingsList(){
        this.param.searchWhere[0].buildingId.inq.push(parseInt(localStorage.getItem('buildings_id')));
      },
      getBuildingName(val) {
        var buildings = JSON.parse(localStorage.getItem('building_list'));
        var buil = buildings.find(function(obj){
          return (obj.id == val);
        });
        return buil.name;
      },
      setTitle() { 
        var reportList = JSON.parse(localStorage.getItem('report_list'));
        var target = reportList.find((report) => {
          return (report.id == this.$route.params.id);
        });
        this.param.title = "月次報告書";
        this.param.operation = target.operation_name;
      },
      reload() {
        const key = (parseInt(this.$route.params.id) == 1) ? "Security:MonthlyReport:search" : "Cleaning:MonthlyReport:search";
        this.checkDisplayPermission(key, () => {
          this.isRouterShow = false;
          this.$nextTick(function() {
            this.setTitle();
            this.everyRoleDisplayConfig();
            this.isRouterShow = true
          })
        });
        const addKey = (parseInt(this.$route.params.id) == 1) ? "Security:MonthlyReport:create" : "Cleaning:MonthlyReport:create";
        this.isRemoveAdd = !this.checkMenuPermission(addKey);
        if (this.isHeadquartersMode) {
          this.isRemoveAdd = true;
        }
      },
      getOperationReportTemplates(id) {
        var reportTemplates = JSON.parse(localStorage.getItem("history_templates"));
        var res = reportTemplates.filter(function( val ) {
          return val.operationId == id;
        });
        var list = [];
        for (var i = 0; i < res.length; i++) {
          list.push(res[i].id);
        }
        return list;
      },
      setTemplates() {
        var templates = JSON.parse(localStorage.getItem('company_templates'));
        this.param.searchWhere[0].operationReportTemplateId.inq = [];
        var find = templates.filter(ele => ele.operationCategoryId == parseInt(this.$route.params.id));
        var that = this;
        find.forEach(function(obj){
          that.param.searchWhere[0].operationReportTemplateId.inq.push(obj.id);
        });
      },
      everyRoleDisplayConfig() {
        if (this.isHeadquartersMode) {
          this.isRemoveAdd = true;
          //this.setTemplates();
          this.getBuildingsListRequest();
        } else {
          this.param.searchWhere[0].operationCategoryId.inq = [parseInt(this.$route.params.id)];
          this.getBuildingsList();
        }
      },
    },
    created() {
      const key = (parseInt(this.$route.params.id) == 1) ? "Security:MonthlyReport:search" : "Cleaning:MonthlyReport:search";
      this.checkDisplayPermission(key, () => { 
        this.isRouterShow = false;
        this.$nextTick(function() {
          this.setTitle();
          this.everyRoleDisplayConfig();
          this.isRouterShow = true
        })
      });
      const addKey = (parseInt(this.$route.params.id) == 1) ? "Security:MonthlyReport:create" : "Cleaning:MonthlyReport:create";
      this.isRemoveAdd = !this.checkMenuPermission(addKey);
      if (!this.isHeadquartersMode) {
        this.param.search.splice(0, 1);
        this.param.list.columns.splice(0, 1);
      } else {
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
