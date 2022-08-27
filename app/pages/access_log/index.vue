<template>
  <search-view :param="param" :isRemoveAdd="isRemoveAdd" v-if="isRouterShow"/>
</template>

<script>
  import SearchView from '~/components/SearchView'
  import WorkStyleComponent from '~/components/WorkStyleComponent'

  export default {

    data() {
      return {
        isRouterShow: true,
        isRemoveAdd: true,
        isHeadquartersMode: this.toBoolean(localStorage.getItem('is_headquarters_mode')),
        param: {
          title: 'アクセスログ',
          operation: 'マスタ情報',
          api: '/access-logs',
          urlQuery: (this.toBoolean(localStorage.getItem('is_headquarters_mode'))) ? "?companyId=" + localStorage.getItem('company_id') : "?companyId=" + localStorage.getItem('company_id') + "&buildingId=" + localStorage.getItem('buildings_id'),
          search: [
            { name: "ビル", column: "buildingId", type: "select", notlike: true, options: [] },
            { name: 'アクセス日', type: 'twoDateInputPicker', columns: [
                { column: 'accessedStartAt', columnName: 'accessedAt', placeholder: 'カレンダーから選ぶ', type: 'date', where: 'gte' },
                { column: 'accessedEndAt', columnName: 'accessedAt', placeholder: 'カレンダーから選ぶ', type: 'date', where: 'lte' }
              ]
            }
          ],
          list: {
            title: '検索結果',
            columns: [
              { name: 'メンバー', column: 'member.name'},
              { name: 'ビル', column: 'buildingId', fn: this.getBuildingName },
              { name: 'アクセス日時', column: 'accessedAt', fn: this.df }
            ],  
            init_val: {
            },
            items: [  
            ],
            icon: 'fa-dot-circle-o',
          }
        },
      }
    },
    components: {
      SearchView
    },
    methods: {
      getBuildingsListRequest(){
        var buildings = JSON.parse(localStorage.getItem('building_list'));
        var that = this;

        this.onSearch('/buildings', null, null, val => {
          const list = [{ name: '', display: '', value: '' }];
          var inq = [];
          val.forEach(function(obj){
            var value = buildings.find(val => val.id == obj.id);
            if (value != undefined) {
              list.push({ name: obj.name, value: obj.id});
            }
          });

          that.param.search[0].options = list;
        })
      },
      getBuildingName(val) {
        var buildings = JSON.parse(localStorage.getItem('building_list'));
        var buil = buildings.find(function(obj){
          return (obj.id == val);
        });
        if (buil != null){
          return buil.name;
        }
      },
      reload() {
      },
    },
    created() {
      const key = "Master:Member:view";
      this.checkDisplayPermission(key, () => {

      });
      if (!this.isHeadquartersMode) {
        this.param.search.splice(0, 1);
      }else{
        this.getBuildingsListRequest();
      }
    },
    watch: {
      $route: function(route) {
        this.reload();
      }
    }
  }


</script>

<style lang="stylus" scoped>

</style>
