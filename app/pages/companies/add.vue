<template>
  <add-view :param="param"></add-view>
</template>

<script>
  import AddView from '~/components/AddView'
  
  export default {
    data() {
      return {
        param: {
          title: '契約会社',
          operation: 'マスタ情報',
          columns: [
            { name: '契約会社名', column: 'name', placeholder: '契約会社名', required: true, maxlength: 64 },
            { name: '郵便番号', column: 'zipcode', placeholder: '郵便番号', required: true, maxlength: 8 },
            { name: '都道府県', column: 'prefectureId', placeholder: '都道府県', required: true, type: 'select', options: [
              { name: '', value: '' },
              { name: '北海道', value: 1 },
              { name: '青森県', value: 2 },
              { name: '岩手県', value: 3 },
              { name: '宮城県', value: 4 },
              { name: '秋田県', value: 5 },
              { name: '山形県', value: 6 },
              { name: '福島県', value: 7 },
              { name: '茨城県', value: 8 },
              { name: '栃木県', value: 9 },
              { name: '群馬県', value: 10 },
              { name: '埼玉県', value: 11 },
              { name: '千葉県', value: 12 },
              { name: '東京都', value: 13 },
              { name: '神奈川県', value: 14 },
              { name: '新潟県', value: 15 },
              { name: '富山県', value: 16 },
              { name: '石川県', value: 17 },
              { name: '福井県', value: 18 },
              { name: '山梨県', value: 19 },
              { name: '長野県', value: 20 },
              { name: '岐阜県', value: 21 },
              { name: '静岡県', value: 22 },
              { name: '愛知県', value: 23 },
              { name: '三重県', value: 24 },
              { name: '滋賀県', value: 25 },
              { name: '京都府', value: 26 },
              { name: '大阪府', value: 27 },
              { name: '兵庫県', value: 28 },
              { name: '奈良県', value: 29 },
              { name: '和歌山県', value: 30 },
              { name: '鳥取県', value: 31 },
              { name: '島根県', value: 32 },
              { name: '岡山県', value: 33 },
              { name: '広島県', value: 34 },
              { name: '山口県', value: 35 },
              { name: '徳島県', value: 36 },
              { name: '香川県', value: 37 },
              { name: '愛媛県', value: 38 },
              { name: '高知県', value: 39 },
              { name: '福岡県', value: 40 },
              { name: '佐賀県', value: 41 },
              { name: '長崎県', value: 42 },
              { name: '熊本県', value: 43 },
              { name: '大分県', value: 44 },
              { name: '宮崎県', value: 45 },
              { name: '鹿児島県', value: 46 },
              { name: '沖縄県', value: 47 },
            ] },
            { name: '市区', column: 'city', placeholder: '市区', required: true, maxlength: 64 },
            { name: '所在地', column: 'address', placeholder: '所在地', required: true, maxlength: 256 },
            { name: '電話番号', column: 'tel', placeholder: '電話番号(半角数字)', required: true, maxlength: 12 },
            { name: '担当者名', column: 'officerName', placeholder: '担当者名', required: true, maxlength: 32 },
            { name: '担当者メールアドレス', column: 'officerEmail', placeholder: '担当者メールアドレス', required: true, maxlength: 256 },
            { name: '利用設定', column: 'activated', type: 'checkbox', initval: true },
            { name: '備考', column: 'note', placeholder: '備考', type:"textarea", maxlength: 512 },
          ],
          cb: this.updateView,
          api: '/companies',
          icon: 'fa-user',
          success: '/companies',
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
