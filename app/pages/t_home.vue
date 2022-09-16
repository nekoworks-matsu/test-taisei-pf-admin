<template>
  <div align="left">
    <!-- Main Header -->
    <tablet-header-view ref="header" :param="param"></tablet-header-view>

    <div class="box ctm_menu box_padding" v-bind:style="{'margin-top':tabletHeight+'px'}">
      <section class="sidebar">
        <ul class="sidebar-menu t_sidebar-menu" data-widget="tree">
          {{activeTree()}}
          <div class="common_ui_head t_common_ui_head"><span class="margin_left_5 t_login_font">ホーム</span></div>
          <li class="treeview cursor_pointer" data-toggle="modal" v-bind:data-target="'#modal'">
            <a><i class="fa fa-bell"></i><span>お知らせ</span></a>
          </li>
          <template v-for="report_menu in menuList.report">
            <div class="common_ui_head t_common_ui_head"><span class="margin_left_5 t_login_font">{{report_menu.operation_name}}</span></div>
            <li class="treeview cursor_pointer" @click="removeSearchItem('/t_calendars/'+report_menu.id)">
              <a><i class="fa fa-calendar-alt"></i><span>イベント</span></a>
            </li>

            <li class="treeview cursor_pointer" @click="removeSearchItem('/t_attendance/'+report_menu.id)">
              <a><i class="fa fa-clock"></i><span>勤務スタッフ</span></a>
            </li>
            <li class="treeview" v-for="majoritems_group in report_menu.majoritems" :key="majoritems_group.name" v-if="(majoritems_group.name!='センサーログ')">
              <a><i class="fa fa-edit"></i><span>{{majoritems_group.name}}</span><span class="pull-right-container t_angle_icon"><i class="fa fa-angle-left pull-right"></i></span></a>
              <ul class="treeview-menu">
                <!-- <nuxt-link tag="li" v-for="majoritem in majoritems_group.reportObjectDefinitions" v-bind:to="majoritem.path" :class="{ active: path===majoritem.path }" :key="majoritem.name">
                  <a class="t_font"><i class="fa fa-circle-o t_icon margin_left_20"></i>{{majoritem.name}}</a>
                </nuxt-link> -->
                <li class="cursor_pointer" v-for="majoritem in majoritems_group.reportObjectDefinitions" @click="removeSearchItem('/t_majoritems/' + report_menu.id + '/' + majoritem.id)" :class="{ active: path==='/t_majoritems/' + report_menu.id + '/' + majoritem.id }" :key="majoritem.name">
                  <a class=""><i class="fa fa-circle margin_left_20"></i>{{majoritem.name}}</a>
                </li>
              </ul>
            </li>
          </template>
        </ul>
      </section>
    </div>
    <template>
      <t-modal-information :id="'modal'"></t-modal-information>
    </template>
  </div>
</template>

<script>
import TabletHeaderView from '~/components/TabletHeaderView'
import TModalInformation from '~/components/TModalInformatiion'
  export default {
    layout: 'everyone',
    data() {
      return {
        role: localStorage.getItem('role'),
        path: '',
        menuList: {
          report:[]
        },
        error: '',
        id: '',
        pass: '',
        isSpecialFlag: false,
        refreshTimeSeconds: 3000,
        getBulletinBoardInterval: 900,
        tabletHeight: 0,
        param: {
          title: 'ホーム画面',
          isBackButtons: false,
          isHomeButtons: false,
        }
      }
    },
    components: {
      TabletHeaderView,
      TModalInformation
    },
    methods: {
      setActiveIndex(categories, index, path){
        if (categories) {
          for (var i = 0; i < categories.length; i++) {
            if (categories[i].path === path) {
              this.activeIndex = index;
            }
          }
        }
      },
      activeTree() {
        $("ul.sidebar-menu").tree();
      },
      getMenulist(api) {
        this.onSearch(api, null, null, (val) => {
          // NOTE:メニュー整形
          var report_hierarchy = []
          var majoritems_hierarchy = []
          var majoritems_group = []

          var reportObjectGroupDefinitionId = 0;
          var cnt = 0;

          /*NOTE:グループ階層*/
          var group_name;
          var group_id;

          val.reportDefinitions.forEach(function(reportDefinitions_obj) {
            reportDefinitions_obj.reportObjectDefinitions.forEach(function( majoritems_obj ) {
            cnt++;
            if (cnt==1) {
              //NOTE:大項目階層
              majoritems_hierarchy.push({ name: majoritems_obj.name, id: majoritems_obj.id, path: '/t_majoritems/' + majoritems_obj.id })
              reportObjectGroupDefinitionId = majoritems_obj.reportObjectGroupDefinitionId

              /*NOTE:グループ階層*/
              group_name = majoritems_obj.reportObjectGroupDefinition.name;
              group_id = majoritems_obj.reportObjectGroupDefinition.id;
              majoritems_group.push({ name:group_name, id:group_id, reportObjectDefinitions:majoritems_hierarchy});
            } else {
              if (reportObjectGroupDefinitionId != majoritems_obj.reportObjectGroupDefinitionId) {
                //NOTE:新しいグループ
                cnt=0;
                majoritems_hierarchy = [];
                reportObjectGroupDefinitionId = majoritems_obj.reportObjectGroupDefinitionId;
                majoritems_hierarchy.push({ name: majoritems_obj.name, id: majoritems_obj.id, path: '/t_majoritems/' + majoritems_obj.id })
              } else {
                //NOTE:大項目階層
                majoritems_hierarchy.push({ name: majoritems_obj.name, id: majoritems_obj.id, path: '/t_majoritems/' + majoritems_obj.id })
              }
            }
          });

          /*報告書階層*/
          report_hierarchy.push({ name: reportDefinitions_obj.name, id: reportDefinitions_obj.id, path: '/t_report/' + reportDefinitions_obj.id, majoritems:majoritems_group });
          majoritems_hierarchy = [];
          majoritems_group =[];
          })
          localStorage.setItem('report_list', JSON.stringify(report_hierarchy));
          this.menuList.report = report_hierarchy;
          report_hierarchy.activeTree;
        });
      },
      updateLogin() {
        this.logined = true
        //this.refreshToken(true)
      },
      getMajoritems(id, majoritems) {
        for (var i = 0; i < majoritems.length; i++) {
          for (var j = 0; j < majoritems[i].reportObjectDefinitions.length; j++) {
            if (id == majoritems[i].reportObjectDefinitions[j].id) {
              return i;
            }
          }
        }
        return 999;
      },
      getReportObject(id) {
        var majoritems = 0;
        for (var i = 0; i < this.menuList.report.length; i++) {
          var ret = this.getMajoritems(id, this.menuList.report[i].majoritems);
          if (ret != 999) {
            break;
          }
          majoritems += this.menuList.report[i].majoritems.length;
        }

        return 1 + ret + majoritems + (2+i*2);
      },
      openAccordion() {
        var privious_page = localStorage.getItem("privious_page");
        if (privious_page != null) {
          var reportObject = this.getReportObject(localStorage.getItem("privious_page"));
          if (reportObject != NaN) {
            var result = document.getElementsByClassName("treeview");
            if (result[reportObject] != undefined) {
              result[reportObject].classList.add('menu-open');
              result[reportObject].children[1].style.display = "block";
            }
          }
        }
      },
      /**
      * 大項目定義グループの重複チェック
      */
      isReportObjectGroupDefinitionsExists(reportObjectDefinitions, reportObjectGroupDefinitions) {
        for (var i = 0; i < reportObjectGroupDefinitions.length; i++) {
          if (reportObjectGroupDefinitions[i].id == reportObjectDefinitions.reportObjectGroupDefinition.id) {
            return true;
          }
        }
        return false;
      },
      /**
      * 大項目の表示チェック
      */
      isReportObjectDefinition(reportObjectDefinitionsId, buildingOperations) {
        for (var i = 0; i < buildingOperations.length; i++) {
          if ((reportObjectDefinitionsId == buildingOperations[i].reportObjectDefinitionId) && buildingOperations[i].useAsReport) return true;
        }
        return false;
      },
      /**
      * 特定(id)の大項目定義グループの大項目取得
      */
      getReportObjectDefinitionOfGroup(reportObjectDefinitions, id, buildingOperations) {
        var res = [];
        for (var i = 0; i < reportObjectDefinitions.length; i++) {
          if (reportObjectDefinitions[i].reportObjectGroupDefinitionId == id  && this.isReportObjectDefinition(reportObjectDefinitions[i].id, buildingOperations ) ) {
            res.push({name: reportObjectDefinitions[i].name, sort: reportObjectDefinitions[i].sort, id: reportObjectDefinitions[i].id, path: '/t_majoritems/' + reportObjectDefinitions[i].operationCategoryId + '/' +  reportObjectDefinitions[i].id});
          }
        }
        res.sort(function(a,b){
          if(a.sort < b.sort) return -1;
          if(a.sort > b.sort) return 1;
            return 0;
        });
        return res;
      },
      /**
      * APIから取得した業務及び大項目のデータを変換
      */
      convertReportObjectDefinitions(reportObjectDefinitions, buildingOperations) {
        var reportObjectGroupDefinitions = [];
        var reportObjects;
        for (var i = 0; i < reportObjectDefinitions.length; i++) {
          if (reportObjectGroupDefinitions.length == 0) {
            reportObjects = this.getReportObjectDefinitionOfGroup(reportObjectDefinitions, reportObjectDefinitions[i].reportObjectGroupDefinition.id, buildingOperations);
            if (reportObjects.length != 0) {
              reportObjectGroupDefinitions.push({ name: reportObjectDefinitions[i].reportObjectGroupDefinition.name, id: reportObjectDefinitions[i].reportObjectGroupDefinition.id, reportObjectDefinitions: reportObjects});
            }
          }
          if(!this.isReportObjectGroupDefinitionsExists(reportObjectDefinitions[i], reportObjectGroupDefinitions)) {
            reportObjects = this.getReportObjectDefinitionOfGroup(reportObjectDefinitions, reportObjectDefinitions[i].reportObjectGroupDefinition.id, buildingOperations);
            if (reportObjects.length != 0) {
              reportObjectGroupDefinitions.push({ name: reportObjectDefinitions[i].reportObjectGroupDefinition.name, id: reportObjectDefinitions[i].reportObjectGroupDefinition.id, reportObjectDefinitions: reportObjects});
            }
          }
        }
        return reportObjectGroupDefinitions;
      },
      /**
      * 共通UI表示項目のメンバーごとのフィルタ
      */
      filterMenulistToMemberRequest(api, val, operations) {
        this.onSearch(api, null, null, (res) => {
          var report_hierarchy = [];
          // NOTE: メンバーごとの業務filter処理追加
          for (var i = 0; i < val.length; i++) {
            if (this.checkItemPermission('Common:forSystemApproval')){
              var operation = operations.find((ope) => {
                return (ope.id == val[i].operationCategoryId)
              });
              report_hierarchy.push({ name: val[i].operationCategory.reportName, operation_name: val[i].operationCategory.operationName, id: val[i].operationCategoryId, path: '/report/' + val[i].operationCategoryId, majoritems: this.convertReportObjectDefinitions(operation.reportObjectDefinitions, val[i].operations)});
            }else{
              for (var j = 0; j < res.memberOperationCategories.length; j++) {
                if (val[i].operationCategoryId == res.memberOperationCategories[j].operationCategoryId) {
                  var operation = operations.find((ope) => {
                    return (ope.id == val[i].operationCategoryId)
                  });
                  report_hierarchy.push({ name: val[i].operationCategory.reportName, operation_name: val[i].operationCategory.operationName, id: val[i].operationCategoryId, path: '/report/' + val[i].operationCategoryId, majoritems: this.convertReportObjectDefinitions(operation.reportObjectDefinitions, val[i].operations)});
                }
              }
            }
          }
          localStorage.setItem('report_list', JSON.stringify(report_hierarchy));
          this.menuList.report = report_hierarchy;
          this.menuList.report.sort(function(a,b){
            if(a.id < b.id) return -1;
            if(a.id > b.id) return 1;
            return 0;
          });
          report_hierarchy.activeTree;
        });
      },
      /**
      * 業務項目の詳細取得
      */
      operationCategoriesRequest(api, val) {
        this.onSearch(api, null, null, (operation) => {
          this.filterMenulistToMemberRequest('/members/' + localStorage.getItem('member_id'), val, operation);
        });
      },
      /**
      * 共通UI表示項目の作成
      */
      createMenulistRequest(api, operationReports) {
        this.onSearch(api, null, null, (val) => {
          var targetOperationReports = operationReports.filter(operation => operation.active == true);

          var targetTemplate = [];
          for (var i = 0; i < val.length; i++) {
            for (var j = 0; j < targetOperationReports.length; j++) {
              if (val[i].id == targetOperationReports[j].operationReportTemplateId) {
                targetTemplate.push(val[i]);
              }
            }
          }
          this.operationCategoriesRequest('/operation-categories', targetTemplate);
        });
      },
      getDisplayObjectIfEmpty() {
        this.onSearch('/buildings/' + localStorage.getItem('buildings_id'), null, null, res => {
        //  this.createMenulistRequest('/building/' + localStorage.getItem('buildings_id') +  '/report-definitions', res.buildingOperationReports);
          this.createMenulistRequest('/buildings/' + localStorage.getItem('buildings_id') +  '/operation-categories');
        });
      },
      /**
      * localStorageに保存している検索条件の削除
      */
      removeSearchItem(path) {
        localStorage.removeItem('search_item');
        this.$router.push(path);
      },
    },
    created() {
      let api = "/building/" + localStorage.getItem("buildings_id") + "/report-definitions";
      var report_hierarchy = JSON.parse(localStorage.getItem('report_list'));
      this.menuList.report = report_hierarchy;
      report_hierarchy.activeTree;
      this.updateLogin();
    },
    mounted() {
      $("body").css('background-color', '#FFF');
      var isInfo = this.toBoolean(localStorage.getItem('isInfoRead'));
      if (isInfo != true) {
        localStorage.setItem('isInfoRead', true);
        $('#modal').modal('show')
      }
      this.tabletHeight = this.$refs.header.$el.clientHeight;
    },
    updated() {
      this.openAccordion();
    },
    watch: {
      $route: function(route) {
        this.activeIndex = "";
        // this.updateLogin();
        window.bodywrapper.scrollTop = 0;
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
