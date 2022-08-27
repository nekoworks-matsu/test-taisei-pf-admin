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
        operationTypes: [],
        param: {
          title: 'ビル別業務非表示設定',
          api: '/companies/' + localStorage.getItem('company_id') + '/disabled-group-contents',
          operation: 'マスタ情報',
          search: [
            { name: '業務種別', column: 'operationTypeId', isQuery: true, type: "select", options: []},
            { name: 'ビル', column: 'buildingId', notlike: true, type: "select", options: []},
          ],
          include: [{'relation': 'building'}, {'relation': 'reportObjectGroupDefinition'}],
          list: {
            title: '検索結果',
            columns: [
              { name: '業務種別', column: 'reportObjectGroupDefinition.operationTypeId', fn: this.getOperationName },
              { name: 'ビル', column: 'building.name' },
              { name: '業務グループ', column: 'reportObjectGroupDefinition.name' },
              { name: '登録日時', column: 'createdAt', sort: true, fn: this.df },
            ],
            items: [],
            icon: 'fa-dot-circle-o',
            add: '/company_disabled_group_contents/add/',
            //read: '/company_disabled_group_contents/details/',
            readFn: this.readFn
          }
        },
      }
    },
    components: {
      SearchView
    },
    methods: {
      readFn(item) {
        return '/company_disabled_group_contents/' + item.building.id + '/details/' + item.reportObjectGroupDefinition.id;
      },
      /**
       * ビル情報取得(契約会社IDで絞る)
       */
      getBuildings() {
        var api_url = '/buildings'
        var where = {'and':[{'companyId': parseInt(localStorage.getItem('company_id'))}]};
        this.onSearch(api_url, null, where, res => {
          const list = [{ name: '', display: '', value: '' }];
          res.forEach(function(obj) {
            list.push({ name: obj.name, display: obj.name, value: obj.id});
          });
          this.param.search[1].options = list;
        });
      },
      getOperationTypes() {
        var api_url = '/companies/' + localStorage.getItem('company_id') + '/operation-types'
        var that = this;
        this.onSearch(api_url, null, null, res => {
          const list = [{ name: '', display: '', value: '' }];
          res.forEach(function(obj) {
            that.operationTypes.push({name: obj.name, id: obj.id});
            list.push({name: obj.name, value: obj.id});
          });
          this.param.search[0].options = list;
        });
      },
      getOperationName(id) {
        var find = this.operationTypes.find(val => val.id == id);
        if (find != undefined) {
          return find.name;
        }
      }
    },
    created() {
      const key = "Master:DisabledGroupContent:search";
      this.checkDisplayPermission(key, () => {
        this.isRemoveAdd = !this.checkMenuPermission('Master:DisabledGroupContent:create');
        this.getBuildings();
        this.getOperationTypes();
      });
    },
    mounted() {
    }
  }


</script>

<style lang="stylus" scoped>

</style>
