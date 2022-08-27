<template>
  <add-view :param="param"></add-view>
</template>

<script>
  import AddView from '~/components/AddView'

  export default {
    data() {
      return {
        param: {
          title: '業務種別',
          operation: 'マスタ情報',
          idLabel: '業務種別',
          isBackButtons: true,
          isHomeButtons: true,
          columns: [
            // { name: '契約会社ID', column: 'companyId', type: 'hiddenColmun'}, // POSTパラメータとして指定不要
            { name: '業務種別名', column: 'name', required: true, placeholder: '例）警備', maxlength: 32}
          ],
          init_val: {
            name: null
          },
          cb: this.updateView,
          api: '/companies/' + localStorage.getItem('company_id') + '/operation-types',
          icon: 'fa-user',
          success: '/company_operation_types',
        },
      }
    },
    components: {
      AddView
    },
    methods: {

    },
    created() {
      const key = "Master:OperationType:create";
      this.checkDisplayPermission(key, () => {
      });
    },
  }

</script>

<style lang="stylus" scoped>

</style>
