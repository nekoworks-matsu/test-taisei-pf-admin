<template>
  <add-view :param="param"></add-view>
</template>

<script>
  import AddView from '~/components/AddView'
  
  export default {
    data() {
      return {
        param: {
          title: 'お知らせ',
          operation: 'マスタ情報',
          columns: [
            { name: '更新日', column: 'updatedAtForDisplay', type: 'datePicker', required: true},
            { name: 'タイトル', column: 'title', required: true, maxlength: 128},
            { name: 'カテゴリー', column: 'category', type: 'select', required: true, options: [
                { name: "", value: null },
                { name: "更新情報", value: 1 },
                { name: "メンテナンス情報", value: 2 },
                { name: "重要情報", value: 3 },
                { name: "不具合情報", value: 4 },
              ] 
            },
            { name: '本文', column: 'body', type: 'textarea',　required: true, maxlength: 1024},
            { name: '表示設定', column: 'display', type: 'checkbox', initval: true },
            { name: '表示開始日時', column: 'displayFrom', type: 'datetime', required: true},
            { name: '表示終了日時', column: 'displayTo', type: 'datetime', required: true},
          ],
          cb: this.updateView,
          api: '/notifications',
          icon: 'fa-user',
          success: '/notifications',
        },
      }
    },
    components: {
      AddView
    },
    methods: {
    },
    created() {
    },
  }

</script>

<style lang="stylus" scoped>

</style>
