<template>
  <search-view :param="param" :isRemoveAdd=isRemoveAdd v-if="isRouterShow"/>
</template>

<script>
  import SearchView from '~/components/SearchView'
  import ActivatedComponent from '~/components/ActivatedComponent'

  export default {
    data() {
      return {
        isRemoveAdd: false,
        isRouterShow: true,
        isSystemApprovalMode: this.toBoolean(localStorage.getItem('is_system_approval_mode')),
        operationTypes: [],
        param: {
          title: '業務・業務項目',
          api: '/companies/' + localStorage.getItem('company_id') + '/report-object-definitions',
          operation: 'マスタ情報',
          search: [
            { name: '業務種別', column: 'operationTypeId', isQuery: true, type: "select", options: []},
            { name: '業務グループ', column: 'reportObjectGroupDefinitionId', notlike: true, type: "select", options: []},
            { name: '業務名', column: 'name', maxlength: 32 },
            { name: '報告書表示設定', column: 'useAsReport', type: "select", options: [
              { name: "", value: "" },
              { name: "表示", value: true },
              { name: "非表示", value: false },
            ] },
          ],
          include: [{'relation': 'reportObjectGroupDefinition'}],
          list: {
            title: '検索結果',
            columns: [
              { name: '業務種別', column: 'reportObjectGroupDefinition.operationTypeId', fn: this.getOperationName },
              { name: '業務グループ', column: 'reportObjectGroupDefinition.name' },
              { name: '業務名', column: 'name' },
              { name: '報告書表示設定', column: 'useAsReport' , fn: this.getActivated},
              { name: '登録日時', column: 'createdAt', sort: true, fn: this.df },
            ],
            items: [],
            icon: 'fa-dot-circle-o',
            add: '/company_report_object_definitions/add/',
            read: '/company_report_object_definitions/details/',
          }
        },
      }
    },
    components: {
      SearchView
    },
    methods: {
      /**
       * 業務グループ取得(契約会社IDで絞る).
       */
      getReportObjectGroupDefinitions() {
        var api_url = '/companies/' + localStorage.getItem('company_id') + '/report-object-group-definitions';
        var where = {'and':[{'companyId': parseInt(localStorage.getItem('company_id'))}]};
        var that = this;
        this.onSearch(api_url, null, where, res => {
          const list = [{ name: '', display: '', value: '' }];
          res.forEach(function(obj) {
            list.push({ name: that.getOperationName(obj.operationTypeId) + ' : ' +  obj.name, display: obj.name, value: obj.id});
          });
          this.param.search[1].options = list;
        });
      },
      getOperationTypes() {
        var api_url = '/companies/' + localStorage.getItem('company_id') + '/operation-types'
        var that = this;
        this.onSearch(api_url, null, null, res => {
          const list = [{ name: '', display: '', value: '' }];
          res.forEach(function(obj) {
            that.operationTypes.push({name: obj.name, id: obj.id});
            list.push({name: obj.name, value: obj.id});
          });
          this.param.search[0].options = list;
          this.getReportObjectGroupDefinitions();
        });
      },
      getOperationName(id) {
        var find = this.operationTypes.find(val => val.id == id);
        if (find != undefined) {
          return find.name;
        }
      },
      getActivated(isActive) {
        var state = isActive ? '表示' : '非表示';
        return state;
      }
    },
    created() {
      const key = "Master:ReportObjectDefinition:search";
      this.checkDisplayPermission(key, () => {
        this.isRemoveAdd = !this.checkMenuPermission('Master:ReportObjectDefinition:create');
        // this.getReportObjectGroupDefinitions();
        this.getOperationTypes();
      });
    },
    mounted() {
    }
  }


</script>

<style lang="stylus" scoped>

</style>
