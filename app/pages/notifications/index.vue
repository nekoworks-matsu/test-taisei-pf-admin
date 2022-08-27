<template>
  <search-view :param="param" :isRemoveAdd=isRemoveAddButton v-if="isRouterShow"/>
</template>

<script>
  import SearchView from '~/components/SearchView'

  export default {
    data() {
      return {
        isRemoveAddButton: true, 
        isRouterShow: true,
        isSystemApprovalMode: this.toBoolean(localStorage.getItem('is_system_approval_mode')),
        param: {
          title: 'お知らせ',
          operation: 'マスタ情報',
          api: '/notifications',
          search: [
            { name: 'タイトル', column: 'title', maxlength: 128 },
            { name: 'カテゴリー', column: 'category', type: "select", notlike: true, options: [
                { name: "", value: null },
                { name: "更新情報", value: 1 },
                { name: "メンテナンス情報", value: 2 },
                { name: "重要情報", value: 3 },
                { name: "不具合情報", value: 4 },
              ] 
            },
            { name: '表示期間', type: 'twoDateInputPicker', columns: [
                { column: 'reportedStartAt', columnName: 'displayTo', placeholder: 'From YYYY/MM/DD', type: 'date', where: 'gte' },
                { column: 'reportedEndAt', columnName: 'displayFrom', placeholder: 'To YYYY/MM/DD', type: 'date', where: 'lte' }
              ]
            },
          ],
          list: {
            title: '検索結果',
            columns: [
              { name: 'タイトル', column: 'title' },
              { name: 'カテゴリー', column: 'category', fn: this.getCategoryName },
              { name: '表示開始日時', column: 'displayFrom', fn: this.df2 },
              { name: '表示終了日時', column: 'displayTo', fn: this.df2 },
              { name: '登録日時', column: 'createdAt', fn: this.df },
              // { name: '更新日時', column: 'updatedAt', fn: this.df },
            ],
            init_val: {
              connect_type: 0,
            },
            items: [],
            icon: 'fa-dot-circle-o',
            add: '/notifications/add/',
            read: '/notifications/details/',
          }
        },
      }
    },
    components: {
      SearchView
    },
    methods: {
      getCategoryName(id) {
        var categories = this.param.search[1].options;
        var find = categories.find(val => val.value == id);
        if (find != null) {
          return find.name;
        }
      },
    },
    created() {
      if (this.isSystemApprovalMode) {
        this.isRemoveAddButton = false;
      }
    },
  }


</script>

<style lang="stylus" scoped>

</style>
