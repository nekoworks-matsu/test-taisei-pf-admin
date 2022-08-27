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
          title: '業務種別',
          api: '/companies/' + localStorage.getItem('company_id') + '/operation-types',
          operation: 'マスタ情報',
          search: [
            { name: '業務種別名', column: 'name', maxlength: 32 },
          ],
          list: {
            title: '検索結果',
            columns: [
              { name: '業務種別名', column: 'name' },
              { name: '登録日時', column: 'createdAt', sort: true, fn: this.df },
            ],
            items: [],
            icon: 'fa-dot-circle-o',
            add: '/company_operation_types/add/',
            read: '/company_operation_types/details/',
          }
        },
      }
    },
    components: {
      SearchView
    },
    methods: {
    },
    created() {
      const key = "Master:OperationType:search";
      this.checkDisplayPermission(key, () => {
        this.isRemoveAdd = !this.checkMenuPermission('Master:OperationType:create');
      });
    }
  }


</script>

<style lang="stylus" scoped>

</style>
