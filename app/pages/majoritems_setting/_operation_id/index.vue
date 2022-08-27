<template>
  <search-view :param="param" :isRemoveAdd="isRemoveAdd" v-if="isRouterShow"/>
</template>

<script>
  import SearchView from '~/components/SearchView'
  import RolesComponent from '~/components/RolesComponent'
  import ActivatedComponent from '~/components/ActivatedComponent'

  export default {
    data() {
      return {
        buildings: [],
        isRouterShow: true,
        isRemoveAdd: false,
        param: {
          title: '業務 自動設定',
          operation: '',
          api: '/autocreation-schedule-operation-category',
          searchWhere: [{operationCategoryId: {"inq":[]}}, {buildingId:{"inq":[]}}],
          // searchWhere: [{ operationCategoryId: parseInt(this.$route.params.operation_id) }],
          search: [
            { name: "ビル", column: "buildingId", type: "select", notlike: true, options: [] },
          ],
          list: {
            title: '検索結果',
            columns: [
              { name: 'ID', column: 'id' , sort: true},
              { name: 'ビル', column: 'buildingId', sort: true, fn: this.getBuildingName },
              { name: '登録日時', column: 'createdAt', sort: true, fn: this.df },
              { name: '更新日時', column: 'updatedAt', sort: true, fn: this.df },
            ],
            init_val: {
            },
            items: [
            ],
            icon: 'fa-user',
            add: '/majoritems_setting/' + this.$route.params.operation_id + '/add',
            read: '/majoritems_setting/' + this.$route.params.operation_id + '/details/',
          }
        },
      }
    },
    components: {
      SearchView
    },
    methods: {
      init() {
        const key = (parseInt(this.$route.params.operatiion_id) == 1) ? "Security:AutocreationScheduleOperationCategory:search" : "Cleaning:AutocreationScheduleOperationCategory:search";
        this.checkDisplayPermission(key,() => {
          this.isRouterShow = false;
          this.$nextTick(function() {
            this.getBuildingsList('/buildings');
            this.setTitle();
            this.isRouterShow = true
          })
        });
        const addKey = (parseInt(this.$route.params.operatiion_id) == 1) ? "Security:AutocreationScheduleOperationCategory:create" : "Cleaning:AutocreationScheduleOperationCategory:create";;
        this.isRemoveAdd = !this.checkMenuPermission(addKey);
      },
      setTitle() { 
        var reportList = JSON.parse(localStorage.getItem('report_list'));
        var target = reportList.find((report) => {
          return (report.id == this.$route.params.operation_id);
        });
        this.param.title = "業務 自動設定";
        this.param.operation = target.operation_name ;
      },
      // getBuildingsList() {
      //   var buildings = JSON.parse(localStorage.getItem('building_list'));
      //   const list = [{name: '', value: ''}];
      //   var that = this;
      //   buildings.forEach(function(obj){
      //     list.push({ name: obj.name, value: obj.id});
      //     that.param.searchWhere[1].buildingId.inq.push(obj.id);
      //   });
      //   this.param.search[0].options = list;
      //   this.buildings = buildings;
      // },
       getBuildingsList(api){
        var buildings = JSON.parse(localStorage.getItem('building_list'));
        const operationCategories = JSON.parse(localStorage.getItem('operation_categories'));
        const currentCategory = operationCategories.find(val => val.id == parseInt(this.$route.params.operation_id));

        var that = this;
        buildings.forEach(function(obj){
          that.param.searchWhere[1].buildingId.inq.push(obj.id);
          const find = operationCategories.find(val => (val.buildingId == obj.id && val.operationTypeId == currentCategory.operationTypeId));
          if (find) {
            that.param.searchWhere[0].operationCategoryId.inq.push(find.id); 
          }
        });
        var where = {"operationCategoryId": parseInt(this.$route.params.operation_id)};
        this.onSearch(api, null, where, val => {
          const list = [{name: '', value: ''}];
          const buils = [];
          val.forEach(function(obj){
            var value = buildings.find(val => val.id == obj.id);
            if (value != undefined) {
              list.push({ name: obj.name, value: obj.id});
              buils.push({name: obj.name, id: obj.id});
            }

          });
          this.param.search[0].options = list;
          this.buildings = buils;
        })
      },
      getBuildingName(id) {
        var res = this.buildings.filter(function (value) {
          return value.id == id;
        })

        if (res.length != 0) {
          return res[0].name;
        }
      }
    },
    created() {
      const key = (parseInt(this.$route.params.operatiion_id) == 1) ? "Security:AutocreationScheduleOperationCategory:search" : "Cleaning:AutocreationScheduleOperationCategory:search";
      this.checkDisplayPermission(key,() => {
        this.getBuildingsList('/buildings');
        this.setTitle();
      });
      const addKey = (parseInt(this.$route.params.operatiion_id) == 1) ? "Security:AutocreationScheduleOperationCategory:create" : "Cleaning:AutocreationScheduleOperationCategory:create";;
      this.isRemoveAdd = !this.checkMenuPermission(addKey);
    },
    watch: {
      $route: function(route) {
        this.init();
      }
    }
  }
</script>

<style lang="stylus" scoped>

</style>
