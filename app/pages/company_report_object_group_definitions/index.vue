<template>
  <search-view :param="param" :isRemoveAdd=isRemoveAdd v-if="isRouterShow"/>
</template>

<script>
  import SearchView from '~/components/SearchView'

  export default {
    data() {
      return {
        isRemoveAdd: false,
        isRouterShow: true,
        isSystemApprovalMode: this.toBoolean(localStorage.getItem('is_system_approval_mode')),
        param: {
          title: '業務グループ',
          api: '/companies/' + localStorage.getItem('company_id') + '/report-object-group-definitions',
          operation: 'マスタ情報',
          search: [
            { name: '業務種別', column: 'operationTypeId', notlike: true, type: "select", options: []},
            { name: '業務グループ名', column: 'name', maxlength: 32 },
            { name: '自動登録設定', column: 'autoCreate', type: "select", options: [
              { name: "", value: "" },
              { name: "利用可能", value: true },
              { name: "利用不可", value: false },
            ] },
          ],
          include: [{'relation': 'operationType'}],
          list: {
            title: '検索結果',
            columns: [
              { name: '業務種別', column: 'operationType.name' },
              { name: '業務グループ名', column: 'name' },
              { name: '自動登録設定', column: 'autoCreate' , fn: this.getActivated },
              { name: '登録日時', column: 'createdAt', sort: true, fn: this.df },
            ],
            items: [],
            icon: 'fa-dot-circle-o',
            add: '/company_report_object_group_definitions/add/',
            read: '/company_report_object_group_definitions/details/',
          }
        },
      }
    },
    components: {
      SearchView
    },
    methods: {
      /**
       * 業務種別取得(契約会社IDで絞る).
       */
      getOperationTypes() {
        var api_url = '/companies/' + localStorage.getItem('company_id') + '/operation-types';
        var where = {};
        this.onSearch(api_url, null, where, res => {
          const list = [{ name: '', display: '', value: '' }];
          res.forEach(function(obj) {
            list.push({name:　obj.name, display: obj.name, value: obj.id});
          });
          this.param.search[0].options = list;
        });
      },
      getRoleName(id) {
        var op = this.param.search[2].options.find(val => val.value == id);
        if (op != undefined) {
          return op.name;
        }
      },
      getActivated(isActive) {
        var state = isActive ? '利用可能' : '利用不可';
        return state;
      }
    },
    created() {
      const key = "Master:ReportObjectGroupDefinition:search";
      this.checkDisplayPermission(key, () => {
        this.isRemoveAdd = !this.checkMenuPermission('Master:ReportObjectGroupDefinition:create');
        this.getOperationTypes();
      });
    },
    mounted() {
    }
  }


</script>

<style lang="stylus" scoped>

</style>
