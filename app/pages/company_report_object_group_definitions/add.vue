<template>
  <add-view :param="param"></add-view>
</template>

<script>
  import AddView from '~/components/AddView'

  export default {
    data() {
      return {
        param: {
          title: '業務グループ',
          operation: 'マスタ情報',
          idLabel: '業務グループ',
          columns: [
            // { name: '契約会社ID', column: 'companyId', type: 'hiddenColmun'},
            { name: '業務種別', column: 'operationTypeId', required: true, type: 'select', options: []},
            { name: '業務グループ名', column: 'name', required: true, placeholder: '例）防災センター業務', maxlength: 32},
            { name: '自動登録設定', column: 'autoCreate', required: false, type: 'checkbox', initval: true}
          ],
          init_val: {},
          cb: this.updateView,
          api: '/companies/' + localStorage.getItem('company_id') + '/report-object-group-definitions',
          icon: 'fa-user',
          success: '/company_report_object_group_definitions',
        },
      }
    },
    components: {
      AddView
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
            list.push({ name: obj.name, display: obj.name, value: obj.id});
          });
          this.param.columns[0].options = list;
        });
      },
    },
    created() {
      const key = "Master:ReportObjectGroupDefinition:create";
      this.checkDisplayPermission(key, () => {
        this.getOperationTypes();
      });
    },
  }

</script>

<style lang="stylus" scoped>

</style>
