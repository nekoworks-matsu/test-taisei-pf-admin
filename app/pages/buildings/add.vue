<template>
  <add-view :param="param"></add-view>
</template>

<script>
  import AddView from '~/components/AddView'
  
  export default {
    data() {
      return {
        isSystemApprovalMode: this.toBoolean(localStorage.getItem('is_system_approval_mode')),
        param: {
          title: 'ビル',
          operation: 'マスタ情報',
          columns: [
            { name: '契約会社', column: 'companyId', type: 'select', required: true, options: [], disabled: !this.checkItemPermission('Master:Member:create:company')},
            { name: 'ビル名', column: 'name', required: true, maxlength: 64, disabled: !this.checkItemPermission('Master:Building:create:name') },
            { name: '郵便番号', column: 'zipcode', required: true, maxlength: 8, disabled: !this.checkItemPermission('Master:Building:create:zipcode') },
            { name: '都道府県', column: 'prefectureId', required: true, type: 'select', options: [
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
            ], disabled: !this.checkItemPermission('Master:Building:create:prefectureId') },
            { name: '市区', column: 'city', required: true, maxlength: 64, disabled: !this.checkItemPermission('Master:Building:create:city') },
            { name: '所在地', column: 'address', required: true, maxlength: 256, disabled: !this.checkItemPermission('Master:Building:create:address') },
            { name: '電話番号', column: 'tel', placeholder: '半角数字', required: true, maxlength: 12, disabled: !this.checkItemPermission('Master:Building:create:tel') },
            { name: '所有者', column: 'owner', maxlength: 32, disabled: !this.checkItemPermission('Master:Building:create:owner') },
            { name: '写真', column:'filePath', type: 'image'},
            { name: 'フロア', column: 'floors', type: 'multiTypeInputForms', required: true, maxlength: 32, options:[], isActive: "", select: [], text:"", disabled: !this.checkItemPermission('Master:Building:create:floors') },
            { name: '業務日付切替時刻', column: 'businessStartTime' , required: true, type: 'businesstime', hh:0, mm:0, disabled: !this.checkItemPermission('Master:Building:create:businessStartTime') },
            { name: '報告事項無し', column: 'displayObjectIfEmpty', type: 'radioButton', required: true, options: [
             { name: '表示', value: true },
             { name: '非表示', value: false }
            ], disabled: !this.checkItemPermission('Master:Building:create:displayObjectIfEmpty') },
            { name: 'オーナーメール送信', column: 'approveNotificationActive', type: 'radioButton', required: true, value: true, options: [
             { name: 'あり', value: true },
             { name: 'なし', value: false }
            ], disabled: !this.checkItemPermission('Master:Building:create:approveNotificationActive') },
          ],
          init_val: {
            
          },
          cb: this.updateView,
          api: '/buildings',
          icon: 'fa-user',
          success: '/buildings',
        },
      }
    },
    components: {
      AddView
    },
    methods: {
      /**
       * マスタデータに定義されている業務およびテンプレートをcolumnにセット
       */
      setOperationsAndTemplatesRequest() {
        this.req('/companies/'+localStorage.getItem("company_id")+'/operation-categories', 'get', null, (err, res) => {
          var operations = [];
          var find;
          res.body.forEach(value => {
            find = operations.find(val => val.id == value.operationTypeId);
            if (find == undefined) {
              operations.push({name: value.reportName.replace("報告書", ""), id: value.operationTypeId});
            }
          });
          this.param.columns[12].options1 = operations;
          // this.setOperationCategoryList(res);
          // if (this.isSystemApprovalMode) {
          //   this.getCompaniesListRequest('/companies');
          // } else {
          //   this.param.columns.splice(0, 1);
          // }
          //this.setTemplatedsOfOperationsRequest(res);
        });
      },
      /**
       * 業務ごとのテンプレートリストの取得
       */
      getTemplateList(id, templates) {
        var list = [{ name: "", id: ""}];
        for (var i = 0; i < templates.length; i++) {
          if (id == templates[i].operationCategoryId) {
            list.push({ name: "ID " + templates[i].id + " : " + templates[i].name, id: templates[i].id, operationCategoryId: templates[i].operationCategoryId})
          }
        }
        return list
      },
      /**
       * 業務ごとのテンプレートをセット
       */
      setTemplatedsOfOperationsRequest(res) {
        var templates, list = [];
        this.req("/operation-report-templates", 'get', null, (err, response) => {
          for (var i = 0; i < res.body.length; i++) {
            this.param.columns[11].options2.push(this.getTemplateList(res.body[i].id, response.body));
          }
          if (this.isSystemApprovalMode) {
            this.getCompaniesListRequest('/companies');
          } else {
            this.param.columns.splice(0, 1);
          }
        });
      },
      /**
       * マスタデータに定義されている業務をセット
       */
      setOperationCategoryList(res) {
        var operations = [];
        for (var i = 0; i < res.body.length; i++) {
          operations.push({ id: res.body[i].id, name: res.body[i].operationName });

          this.param.columns.push({ name: '現場通知メール ' + res.body[i].operationName.replace("業務", ""), column: 'approveNotificationDefinitions', column2: 'destination', column3: 'operationCategoryId',type: 'requestText', placeholder: 'メールアドレス', operationCategoryId: res.body[i].id, maxlength: 255, options: [] });
        }
        this.param.columns[12].options1 = operations;
      },
      /**
       * フロアタイプをセット
       */
      setFloorType() {
        this.param.columns[9].options = [
          { name: "", value: "" },
          { name: "地上階", value: 1 },
          { name: "地下階", value: 2 },
          { name: "特殊階", value: 3 },
        ]
      },
      getCompaniesListRequest(api) {
        var where = {"and":[{"activated": {"eq": true}}]};
        this.onSearch(api, null, where, val => {
          const list = [{name: null, value: null}];
          val.forEach(function(obj){
            list.push({ name: obj.name, value: obj.id});
          });
          this.param.columns[0].options = list;
        });
      }
    },
    created() {
      const key = "Master:Building:search";
      this.isRouterShow = false;
      this.checkDisplayPermission(key, () => {
        this.setOperationsAndTemplatesRequest();
        if (this.isSystemApprovalMode) {
          this.getCompaniesListRequest('/companies');
        } else {
          this.param.columns.splice(0, 1);
        }
        this.setFloorType();
      });
    },
  }

</script>

<style lang="stylus" scoped>

</style>
