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
          title: 'メンバー',
          operation: 'マスタ情報',
          columns: [
            { name: '権限', column: 'role', type: 'select', required: true, options: [], disabled: !this.checkItemPermission('Master:Member:create:role')},
            { name: '契約会社', column: 'companyId', type: 'select', required: true, options: [], disabled: !this.checkItemPermission('Master:Member:create:company')},
            { name: 'メンバー名', column: 'name', required: true, maxlength: 32, disabled: !this.checkItemPermission('Master:Member:create:name') },
            { name: '業務カテゴリ', column: 'operations', type: 'multiCheckbox', required: true , options: [], disabled: !this.checkItemPermission('Master:Member:create:operations')},
            { name: '業務対象ビル', column: 'buildingIds', type: 'multiSelect', required: true, options: [], disabled: !this.checkItemPermission('Master:Member:create:buildingIds')},
            { name: 'アカウントID', column: 'loginId', placeholder: "半角英数字", required: true, maxlength: 256, disabled: !this.checkItemPermission('Master:Member:create:loginId') },
            { name: 'パスワード', column: 'password', placeholder: "7文字以上32文字以下、半角英数字", required: true, maxlength: 60, disabled: !this.checkItemPermission('Master:Member:create:password') },
            { name: 'メールアドレス', column: 'email', maxlength: 256, disabled: !this.checkItemPermission('Master:Member:create:email') },
            { name: '利用設定', column: 'activated', type: 'select', required: true, options: [
                { name: "利用可能", value: true },
                { name: "利用不可", value: false }, 
              ], disabled: !this.checkItemPermission('Master:Member:create:activated')
            },
            { name: '報告書申請通知メール受信設定', column: 'approveNotificationDefinition', column2: 'notificationActive', type: 'requestCheckbox', type2: 'checkbox', show: !this.checkItemPermission('Master:Member:create:approveNotificationDefinition'), placeholder: "メールアドレス", maxlength: 256 },
          ],
          init_val: {
            role: 2,
            activated: true
          },
          cb: this.updateView,
          api: '/members',
          icon: 'fa-user',
          success: '/members',
        },
      }
    },
    components: {
      AddView
    },
    methods: {
      /**
       * 登録可能なロールの取得
       */
      getRoleListRequest(api) {
        this.onSearch(api, null, null, res => {
          const list = [{name: null, value: null}];
          res.roles.forEach(function(role){
            list.push({name: role.name, value: role.id});
          });
          this.param.columns[0].options = list;
        });
      },
      /**
       * 業務名取得
       */
      getOperationName(api, operations, operationCategories, cnt) {
        if (operationCategories.length == cnt) {
          if (this.isSystemApprovalMode) {
            this.param.columns[3].options = operations;
          } else {
            this.param.columns[2].options = operations;
          }
        } else {
          this.req(api + '/' + operationCategories[cnt].operationTypeId, 'get', null, (err, res) => {
            var find = operations.find(val => val.id == operationCategories[cnt].operationTypeId);
            if (find == undefined) {
              operations.push({name: res.body.name, id: operationCategories[cnt].operationTypeId});
            }
            this.getOperationName(api, operations, operationCategories, cnt + 1);
          });
        }
      },
      /**
       * マスタデータに定義されている業務の取得
       */
      getOperationCategoryListRequest(api) {
        this.req(api, 'get', null, (err, res) => {
          if (this.isSystemApprovalMode) {
          } else {
            var companyId = localStorage.getItem("company_id")
          }
          this.getOperationName('/companies/'+localStorage.getItem("company_id")+'/operation-types', [], res.body, 0);
        });
      },
      /**
       * 登録ビルの取得
       */
      getBuildingsListRequest(api) {
        this.onSearch(api, null, null, val => {
          const list = [{name: null, value: null}];
          val.forEach(function(obj){
            list.push({ name: obj.name, value: obj.id});
          });
          this.param.columns[4].options = list;
        });
      },
      /**
       * 登録契約会社の取得
       */
      getCompaniesListRequest(api) {
        var where = {"and":[{"activated": {"eq": true}}]};
        this.onSearch(api, null, where, val => {
          const list = [{name: null, value: null}];
          val.forEach(function(obj){
            list.push({ name: obj.name, value: obj.id});
          });
          this.param.columns[1].options = list;
          this.getRoleListRequest('/members/roles');
          this.param.columns[4].disabled = true;
        });
      }
    },
    created() {
      const key = "Master:Member:create";
      this.checkDisplayPermission(key, () => {
        if (this.isSystemApprovalMode) {
          this.getCompaniesListRequest('/companies');  
        } else {
          this.getOperationCategoryListRequest('/companies/'+localStorage.getItem("company_id")+'/operation-categories');
          this.getRoleListRequest('/members/roles');
          this.param.columns.splice(1, 1);
        }
        
      });
    },
  }

</script>

<style lang="stylus" scoped>

</style>
