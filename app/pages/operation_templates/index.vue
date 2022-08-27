<template>
  <search-view :param="param" :isRemoveAdd="isRemoveAdd" v-if="isRouterShow" />
</template>

<script>
  import SearchView from '~/components/SearchView'

  export default {
    data() {
      return {
        isRouterShow: true,
        isRemoveAdd: false,
        isSystemApprovalMode: this.toBoolean(localStorage.getItem('is_system_approval_mode')),
        param: {
          title: '業務テンプレート',
          operation: 'マスタ情報',
          api: '',
          searchWhere: [{operationCategoryId: {"inq":[]}}],
          search: [
            { name: "契約会社", column: "companyId", type: "select", notlike: true, options: [] },
            { name: '業務テンプレート名', column: 'name', maxlength: 64 },
            { name: '業務カテゴリ', column: 'operationCategoryId', type: "select", notlike: true, options: [] },
          ],
          list: {
            title: '検索結果',
            columns: [
              { name: '契約会社', column: 'companyId', sort: true, fn: this.getCompanyName },
              { name: '業務テンプレート名', column: 'name' },
              { name: '業務カテゴリ', column: 'operationCategoryId', sort: true, fn: this.getOperationName },
              { name: '登録日時', column: 'createdAt', sort: true, fn: this.df },
              // { name: '更新日時', column: 'updatedAt', fn: this.df },
            ],
            init_val: {
              connect_type: 0,
            },
            items: [],
            icon: 'fa-dot-circle-o',
            add: '/operation_templates/add/',
            read: '/operation_templates/details/',
          }
        },
      }
    },
    components: {
      SearchView
    },
    methods: {
      getOperationName(id) {
        var operations = JSON.parse(localStorage.getItem("report_list"));
        var find = operations.find(val => val.id == id);
        if (find != null) {
          return find.operation_name;
        }
      },
      setOperations() {
        var operations = JSON.parse(localStorage.getItem("report_list"));
        const list = [{ name: "", value: "" }];
        const ids = [];
        operations.forEach(function(val) {
          list.push({name: val.operation_name, value: val.id});
          ids.push(val.id);
        });
        this.param.search[2].options = list;
        this.param.searchWhere[0].operationCategoryId.inq = ids;
      },
      setOperationsAll() {
        var that = this;
        this.onSearch('/operation-categories', null, null, val => {
          const list = [{name: null, value: null}];
          const ids = [];
          val.forEach(function(obj){
            list.push({name: obj.operationName, value: obj.id});
            ids.push(obj.id);
          });
          that.$set(this.param.search[2], 'options', list);
        });
      },
      getCompaniesListRequest(api) {
        this.onSearch(api, null, null, val => {
          const list = [{name: null, value: null}];
          val.forEach(function(obj){
            list.push({ name: obj.name, display: obj.name, value: obj.id});
          });
          this.param.search[0].options = list;
          this.setOperationsAll();
        });
      },
      getCompanyName(id) {
        var name = this.param.search[0].options.find(val => val.value == id);
        if (name != undefined) {
          return name.display;
        }
      }
    },
    created() {
      const key = "Master:OperationReportTemplate:search";
      this.checkDisplayPermission(key, () => {
        this.param.api = '/operation-report-templates';
         if (this.isSystemApprovalMode) {
          this.param.searchWhere.splice(0, 1);
          this.getCompaniesListRequest('/companies');
        } else {
          this.param.searchWhere.push({ companyId: parseInt(localStorage.getItem('company_id'))});
          this.setOperations();
          this.param.search.splice(0, 1);
          this.param.list.columns.splice(0, 1);
        }
      });
      const addKey = "Master:OperationReportTemplate:create";
      this.isRemoveAdd = !this.checkMenuPermission(addKey);
    },
  }


</script>

<style lang="stylus" scoped>

</style>
