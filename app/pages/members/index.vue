<template>
  <search-view :param="param" :isRemoveAdd="isRemoveAdd" />
</template>

<script>
  import SearchView from '~/components/SearchView'
  import ActivatedComponent from '~/components/ActivatedComponent'
  import StatusComponent from '~/components/StatusComponent'

  export default {
    data() {
      return {
        isRemoveAdd: false,
        isHeadquartersMode: this.toBoolean(localStorage.getItem('is_headquarters_mode')),
        isSystemApprovalMode: this.toBoolean(localStorage.getItem('is_system_approval_mode')),
        param: {
          searchWhere: [],
          title: 'メンバー',
          operation: 'マスタ情報',
          api: '/buildings/'+ localStorage.getItem('buildings_id') + '/members',
          search: [
            { name: "権限", column: "role", type: "select", options: [] },
            { name: "契約会社", column: "companyId", type: "select", notlike: true, options: [] },
            { name: "メンバー名", column: "name", placeholder: "メンバー名", maxlength: 32 },
            { name: "業務対象ビル", column: "buildingId", type: "select", notlike: true, options: [] },
            { name: "利用設定", column: "activated", type: "select", options: [
                { name: "", value: "" }, 
                { name: "利用可能", value: true }, 
                { name: "利用不可", value: false }, 
              ] 
            },
          ],
          list: {
            title: '検索結果',
            columns: [
              // { name: 'ID', column: 'id', component: StatusComponent }, ステータス表示の色付けサンプル
              { name: 'ID',column: 'id' ,sort: true},
              { name: '契約会社', column: 'companyId', sort: true, fn: this.getCompanyName },
              { name: 'メンバー名', column: 'name' },
              { name: '権限', column: 'role', sort: true, fn: this.getRoleName },
              { name: '利用設定', column: 'activated' , sort: true, component: ActivatedComponent },
              { name: '登録日時', column: 'createdAt', sort: true, fn: this.df },
              // { name: '更新日時', column: 'updatedAt', fn: this.df },
            ],
            init_val: {
            },
            items: [
            ],
            icon: 'fa-user',
            add: '/members/add',
            read: '/members/details/',
          }
        },
      }
    },
    components: {
      SearchView
    },
    methods: {
      getBuildingsList(api){
        var where = {};
        if (!this.isSystemApprovalMode) {
          where = {"and":[{"companyId": parseInt(localStorage.getItem('company_id'))}]};
        }
        this.onSearch(api, null, where, val => {
          const list = [{name: '', value: ''}];
          val.forEach(function(obj){
            list.push({ name: obj.name, display: obj.name, value: obj.id});
          });
          this.param.search[3].options = list;
          if (!this.isSystemApprovalMode&&!this.isHeadquartersMode) {
            this.param.search.splice(1, 1);
            this.param.search.splice(2, 1);
          } else if (this.isHeadquartersMode) {
            this.param.search.splice(1, 1);
          }
        })
      },
      getCompaniesListRequest(api) {
        this.onSearch(api, null, null, val => {
          const list = [{name: null, value: null}];
          val.forEach(function(obj){
            list.push({ name: obj.name, display: obj.name, value: obj.id});
          });
          this.param.search[1].options = list;
          this.getBuildingsList('/buildings');
        });
      },
      getCompanyName(id) {
        var name = this.param.search[1].options.find(val => val.value == id);
        if (name != undefined) {
          return name.display;
        }
      },
      getRoleName(id) {
        var op = this.param.search[0].options.find(val => val.value == id);
        if (op != undefined) {
          return op.name;
        }
      },
      getRoleListRequest() {
        this.onSearch('/members/roles', null, null, res => {
          const list = [{name: null, value: null}];
          res.roles.forEach(function(role){
            list.push({name: role.name, value: role.id});
          });
          this.param.search[0].options = list;
        });
      },
    },
    created() {
      const key = "Master:Member:search";
      this.checkDisplayPermission(key, () => {
        if(this.isSystemApprovalMode || this.isHeadquartersMode) {
          this.param.api = '/members';
          if (this.isHeadquartersMode) {
            this.param.searchWhere = [{ companyId: parseInt(localStorage.getItem('company_id'))}];
            this.param.list.columns.splice(1, 1);
            this.getBuildingsList('/buildings');
          } else {
            this.getCompaniesListRequest('/companies')
          }
          //this.param.search.splice(2, 1);
        } else {
          this.param.searchWhere = [{ companyId: parseInt(localStorage.getItem('company_id'))}];
          this.getBuildingsList('/buildings');
          this.param.list.columns.splice(1, 1);
        }
        this.getRoleListRequest();

        // this.search_item = JSON.parse(localStorage.getItem('search_item'));
        // localStorage.removeItem('search_item');
        // window.onpopstate = this.windowBack(event, this.search_item);
      });
      const addKey = "Master:Member:create";
      this.isRemoveAdd = !this.checkMenuPermission(addKey);
    }
  }
</script>

<style lang="stylus" scoped>

</style>
