<template>
  <!-- <div class="login-box" :class="{two_login_box: headquarter, ts_login: !headquarter}"> -->
  <div class="login-box wide ts_login">
    <!-- /.login-logo -->
    <div class="login-box-body" v-if="!headquarter">
      <div class="login-logo">
        <span class="logo-lg">
          <img class="login_logo" src="~/assets/t_logo.png" />
        </span>
        <p class="login-env-msg-stg" v-if="env=='staging'">【 検証環境 】</p>
        <p class="login-env-msg-dev" v-if="env=='dev_server'">【 開発環境 】</p>
      </div>
      <p class="login-box-msg">業務対象のビルを選択してください</p>
     
      <form v-on:submit.prevent="selects">
        <div class="form-group has-feedback form_selectbox">
          <select class="form-control" v-model="selectedBuilding">
            <option v-for="category in categories" v-bind:value="category">
              {{ category.name }}
            </option>
          </select>
        </div>
        <div v-if="error" class="callout callout-danger err-info"><p>{{error}}</p></div>
        <div class="form-group ts_mt90">
          <div class="pull-left col-xs-4">
            <button type="button" v-if="error" @click="back" class="btn btn-default btn-block">
              <i v-show="!loading">もどる</i>
            </button>
          </div>

          <!-- /.col -->
          <div>
            <button type="submit" class="btn btn-info btn-block btn_green" v-bind:disabled="this.selectedBuilding.id==null">
              <i v-show="loading"></i>
              <i v-show="!loading">決定</i>
            </button>
          </div>
          <!-- /.col -->
        </div>
      </form>
    </div>

    <div class="display_flex two_login" v-if="headquarter">
      <div class="login-box-body two_login_select_box">
        <div class="login-logo">
          <span class="logo-lg">
            <img class="login_logo" src="~/assets/t_logo.png" />
          </span>
          <p class="login-env-msg-stg" v-if="env=='staging'">【 検証環境 】</p>
          <p class="login-env-msg-dev" v-if="env=='dev_server'">【 開発環境 】</p>
        </div>
        <p class="login-box-msg ts_mt60">業務対象のビルを選択してください</p>
          
        <form v-on:submit.prevent="selects">
          <div class="form-group has-feedback form_selectbox">
            <select class="form-control" v-model="selectedBuilding">
              <option v-for="category in categories" v-bind:value="category">
                {{ category.name }}
              </option>
            </select>
          </div>
          <div v-if="error" class="callout callout-danger err-info"><p>{{error}}</p></div>
          <div class="form-group ts_mt90">
            <div class="pull-left col-xs-4">
              <button type="button" v-if="error" @click="back" class="btn btn-default btn-block btn-flat">
                <i v-show="!loading">もどる</i>
              </button>
            </div>

                <!-- /.col -->
            <div>
              <button type="submit" class="btn btn-info btn-block btn_green" v-bind:disabled="this.selectedBuilding.id==null">
                <i v-show="loading"></i>
                <i v-show="!loading">決定</i>
              </button>
            </div>
                <!-- /.col -->
          </div>
        </form>

        <div class="two_login_btn" v-if="isCompanyMode">
          <a class="ts_login_onHeadquartersMode" @click="onHeadquartersMode()">
            <i v-show="!loading">「契約会社 管理者」に切り替える方はこちら</i>
          </a>
        </div>
          <!-- <div class="two_login_box_btn two_login_btn"> 
            <button @click="onHeadquartersMode()" class="btn btn-info btn-block height_max">
              <i v-show="!loading">契約会社 管理者</i>
            </button>
          </div> -->
      </div>
    </div>
    <!-- /.login-box-body -->
  </div>
  <!-- /.login-box -->
</template>

<script>
import request from 'superagent'
import moment from 'moment'
import { event } from '~/plugins/events.js'

export default {
  layout: 'everyone',
  data() {
    return {
      headquarter: false,
      loginid: '',
      password: '',
      error: '',
      isCompanyMode: true,
      categories: [{id: null, name: '【ビルを選択】', value: null}],
      selectedBuilding: {id: null, name: '【ビルを選択】', value: null},
      api: '/buildings',
      env: process.env.ENV
    }
  },
  methods: {
    /**
     * APIから取得した業務及び大項目のデータを変換
     */
    convertReportObjectDefinitions(operationCategoryContents,disabled) {
      var reportObjectGroupDefinitions = [];
      var reportObject;
      var find;
      if (operationCategoryContents == null){
        return reportObjectGroupDefinitions;
      }
      operationCategoryContents.forEach((content) => {
        find = reportObjectGroupDefinitions.find(val => val.id == content.reportObjectGroupDefinitionId);
        if (find == undefined) {
          var sort = 999;
          if (content.reportObjectGroupDefinition != null){
            if (content.reportObjectGroupDefinition.reportObjectDefinitions != null){
              if (content.reportObjectGroupDefinition.reportObjectDefinitions.length > 0) {
                sort = content.reportObjectGroupDefinition.reportObjectDefinitions[0].sort;
              }
            
              content.reportObjectGroupDefinition.sort = content.sort ?? sort;
              const reportObjectDefinitions = [];
              content.reportObjectGroupDefinition.reportObjectDefinitions.forEach((defenitions) => {
                var definitionFound = disabled.find(val => val == defenitions.id);
                if (!definitionFound) {
                  reportObjectDefinitions.push(defenitions);
                }
              })
              reportObjectDefinitions.sort(function(a,b){
                if(a.sort < b.sort) return -1;
                if(a.sort > b.sort) return 1;
                  return 0;
              });
              content.reportObjectGroupDefinition.reportObjectDefinitions = reportObjectDefinitions;
            }
            reportObjectGroupDefinitions.push(content.reportObjectGroupDefinition);
          }
        }
      });
      reportObjectGroupDefinitions.sort(function(a,b){
        if(a.sort < b.sort) return -1;
        if(a.sort > b.sort) return 1;
          return 0;
      });
      return reportObjectGroupDefinitions;
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
          res.push({name: reportObjectDefinitions[i].name, sort: reportObjectDefinitions[i].sort, id: reportObjectDefinitions[i].id, path: '/majoritems/' + reportObjectDefinitions[i].id, operationCategoryId: reportObjectDefinitions[i].operationCategoryId});
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
     * 共通UI表示項目のメンバーごとのフィルタ
     */
    filterMenulistToMemberRequest(api, val, disabled) {
      this.onSearch(api, null, null, (res) => {
        var report_hierarchy = [];
        // NOTE: メンバーごとの業務filter処理追加
        for (var i = 0; i < val.length; i++) {
          if (this.checkItemPermission('Common:forSystemApproval')){
            report_hierarchy.push({ name: val[i].reportName, operation_name: val[i].operationType.name, operation_type_id: val[i].operationTypeId, id: val[i].id, path: '/report/' + val[i].operationTypeId + '/' + val[i].id, majoritems: this.convertReportObjectDefinitions(val[i].operationCategoryContents,disabled)});
          }else{
            for (var j = 0; j < res.memberOperationCategories.length; j++) {
              if (val[i].operationTypeId == res.memberOperationCategories[j].operationTypeId) {
                report_hierarchy.push({ name: val[i].reportName, operation_name: val[i].operationType.name, operation_type_id: val[i].operationTypeId, id: val[i].id, path: '/report/' + val[i].operationTypeId + '/' + val[i].id, majoritems: this.convertReportObjectDefinitions(val[i].operationCategoryContents,disabled)});
              }
            }
          }
        }
        report_hierarchy.sort(function(a,b){
          if(a.operation_type_id < b.operation_type_id) return -1;
          if(a.operation_type_id > b.operation_type_id) return 1;
          return 0;
        });
        localStorage.setItem('report_list', JSON.stringify(report_hierarchy));
        this.saveTemplateListToLocalStorage(val);
        // this.businessReportDefinitionsRequest(val);
      });
    },
    /**
     * 作業報告書情報取得
     */
    businessReportDefinitionsRequest(val) {
      this.onSearch('/business-report-group-definitions', {companyId: parseInt(localStorage.getItem('company_id')), buildingId: this.selectedBuilding.id}, null, (res) => {
        var businessReportGroupDefinitions = [];
        res.forEach((val, index) => {
          businessReportGroupDefinitions.push({id: val.id, name: val.name, operationTypeId: val.operationTypeId, businessReportDefinitions: []});
          val.businessReportDefinitions.forEach((val2) => {
            businessReportGroupDefinitions[index].businessReportDefinitions.push({id: val2.id, name: val2.name})
          })
        })
        localStorage.setItem('business_report_group_definitions', JSON.stringify(businessReportGroupDefinitions));
        this.saveTemplateListToLocalStorage(val);
      })
    },
    /**
     * テンプレートリストをローカルストレージに保存
     */
    saveTemplateListToLocalStorage(val) {
      var templateList = [];
      for (var i = 0; i < val.length; i++) {
        templateList.push({ templateId: val[i].id, operationCategoryId: val[i].operationCategoryId });
      }
      localStorage.setItem('template_list', JSON.stringify(templateList));
      this.$router.push(this.$router.redirect ? this.$router.redirect : '/');
    },
    /**
     * 共通UI表示項目の作成
     */
    createMenulistRequest(api) {
      let disalbedApi = '/companies/' + localStorage.getItem('company_id') + '/disabled-group-contents';
      let disalbedParam = { where: {buildingId: localStorage.getItem('buildings_id')}};
      this.onSearch(disalbedApi, disalbedParam, null, (disables) => {      
        var disabledDefinitions = [];
        disables.forEach(defitnitions => {
          disabledDefinitions = disabledDefinitions.concat(defitnitions.reportObjectDefinitionIds);
        });
        var parameter = { where: {buildingId: localStorage.getItem('buildings_id')} ,include: [{relation: 'operationType'},{relation: 'operationCategoryContents',scope:{include:[{relation: 'reportObjectGroupDefinition',scope:{include:[{relation: 'reportObjectDefinitions'}]}}]}}] };
        this.onSearch(api, parameter, null, (val) => {
          if (this.checkItemPermission('Common:forSystemApproval')) {
            var memberOperation = [];
            val.forEach(operation => {
              memberOperation.push({'operationCategoryId': operation.operationTypeId, 'operationCategory': operation})
            });
            localStorage.setItem('member_operation', JSON.stringify(memberOperation));
          }
          this.filterMenulistToMemberRequest('/members/' + localStorage.getItem('member_id'), val, disabledDefinitions);
        });
      });
    },
    getHeadquartersMenu() {
      var memberOperations = JSON.parse(localStorage.getItem("member_operation"));
      var menuList = [];
      for (var i = 0; i < memberOperations.length; i++) {
        menuList.push({
          name: memberOperations[i].operationCategory.reportName, 
          operation_name: memberOperations[i].operationCategory.operationName,
          id: memberOperations[i].operationCategoryId,
          path: '/report/' + memberOperations[i].operationCategoryId,
        });
      }
      menuList.sort(function(a,b){
        if(a.id < b.id) return -1;
        if(a.id > b.id) return 1;
        return 0;
      });
      return menuList;
    },
    getDisplayObjectIfEmpty() {
      const url = process.env.API_SERVER + '/buildings/' + localStorage.getItem('buildings_id');
      this.req(url, 'get', null, (err, res) => {
        localStorage.setItem('display_object_if_empty', res.body.buildingSetting.displayObjectIfEmpty);
        localStorage.setItem('business_start_time', moment(res.body.buildingSetting.businessStartTime, 'HH:mm:ss').add(9, 'h').format('HH:mm:ss'));
        
        localStorage.removeItem('search_item');

        // var historyTemplates = res.body.buildingOperationReports.map(function(row) {
        //   return {id: row.operationReportTemplateId, operationId: row.operationReportTemplate.operationCategoryId};
        // })
        // var setHistoryTemplates = Array.from(new Set(historyTemplates));
        // localStorage.setItem('history_templates', JSON.stringify(setHistoryTemplates));
        this.createMenulistRequest('/companies/'+localStorage.getItem("company_id")+'/operation-categories');
      });
    },
    getCompanyName() {
      var companyId = parseInt(localStorage.getItem('company_id'));
      const url = process.env.API_SERVER + '/companies/' + companyId;
      this.req(url, 'get', null, (err, res) => {
        localStorage.setItem('company_name', res.body.name);
      });
    },
    selects() {
      localStorage.setItem('buildings_id', this.selectedBuilding.id);
      localStorage.setItem('buildings_name', this.selectedBuilding.value);
      localStorage.setItem("is_headquarters_mode", false);

      const url = process.env.API_SERVER + '/access-logs/select-building';
      var send_data = { buildingId: this.selectedBuilding.id };
      this.req(url, 'post', send_data, (err, res) => {

      });

      this.onSearch('/companies/' + localStorage.getItem("company_id") + '/operation-categories', null, null, val => {
        localStorage.setItem('operation_categories', JSON.stringify(val));
      });

      this.getDisplayObjectIfEmpty();
      // location.href = "/members";
    },
    setBuildings() {
      var where = {"and":[{"companyId": parseInt(localStorage.getItem('company_id'))}]};
      var that = this;
      this.onSearch('/buildings', null, where, val => {
        val.forEach(function(obj){
          that.categories.push({id: obj.id,  name: obj.name, value: obj.name});
        });
      })
    },
    getBuildings(){
      var buildings;
      if (localStorage.getItem('role') == 'systemApproval') {
        this.setBuildings();
      } else {
        buildings = JSON.parse(localStorage.getItem('building_list'));
        for (var i = 0; i < buildings.length; i++) {
          const biru = buildings[i];
          this.categories[i+1] = {id: biru.id, name: biru.name, value: biru.name};
        }
        if (buildings.length == 0){
          this.error = "選択できるビルがありません";
        }
      }
    },
    back(){
      this.$router.push("login")
      $('body').removeClass('skin-black')
      delete this.$router.redirect
      event.emit('login-update')
    },
    onHeadquartersMode() {
      localStorage.removeItem('search_item');
      localStorage.setItem("is_headquarters_mode", true);
      var parameter = {include: [{relation: 'operationType'}]};
      this.onSearch('/companies/'+localStorage.getItem("company_id")+'/operation-categories', parameter, null, val => {
        var reportList = [];
        var find;
        val.forEach(function(operation_category){
          find = reportList.find(list => list.operation_type_id == operation_category.operationTypeId);
          if (find == undefined) {
            reportList.push({operation_type_id: operation_category.operationTypeId, id: operation_category.id, name: operation_category.reportName, operation_name: operation_category.operationType.name, path: "/report/" + operation_category.operationTypeId})
          } 
        });

        reportList.sort(function(a,b){
          if(a.operation_type_id < b.operation_type_id) return -1;
          if(a.operation_type_id > b.operation_type_id) return 1;
          return 0;
        });
        localStorage.setItem('report_list', JSON.stringify(reportList));
        localStorage.setItem('operation_categories', JSON.stringify(val));
        this.$router.push(this.$router.redirect ? this.$router.redirect : '/');
      });
    },
    isHeadquartersMode() {
      this.isCompanyMode = true;
      this.onSearch('/companies/'+localStorage.getItem("company_id")+'/operation-categories', null, null, val => {
        if (val[0] == 'error') {
          this.isCompanyMode = false;
        }
      });
    },
    getMemberOperationRequest() {
      this.onSearch('/members/' + localStorage.getItem('member_id'), null, null, val => {
        if (!this.checkItemPermission('Common:forSystemApproval')) {
          localStorage.setItem('member_operation', JSON.stringify(val.memberOperationCategories));
          localStorage.setItem('company_id', JSON.stringify(val.member.companyId));
          this.getCompanyName();
        }else{
          // this.onSearch('/operation-categories', null, null, vals => {
          //   var operationCategories = [];
          //   for (var i = 0; i < vals.length; i++) {
          //     const operationCategory = vals[i];
          //     operationCategory.reportObjectDefinitions = null;
          //     operationCategories.push({ operationCategoryId: operationCategory.id, operationCategory: operationCategory });
          //   }
          //   localStorage.setItem('member_operation', JSON.stringify(operationCategories));
          // });
        
        }
        this.headquarter = this.checkItemPermission('Common:SelectBuilding:view:forHeadquarters');
      }); 
    },
    getTemplates() {
      var where = {"and":[{"companyId": parseInt(localStorage.getItem('company_id'))}]};
      var list = [];
      this.getMemberOperationRequest();
      // this.onSearch('/operation-report-templates', null, where, res => {
      //   for (var i = 0; i < res.length; i++) {
      //     list.push({id: res[i].id, operationCategorreyId: res[i].operationCategoryId});
      //   }
      //   localStorage.setItem('company_templates', JSON.stringify(list));
      //   this.getMemberOperationRequest();
      // });
    },
  },
  created() {
    $("body").removeClass("skin-black");
    $("body").removeClass("skin-black-light");
    $("body").removeClass("fixed");
    this.role = localStorage.getItem("role");
    localStorage.setItem("is_system_approval_mode", false);
    localStorage.removeItem('search_item');
    this.getBuildings();
    if (this.role != 'owner') {
      this.getTemplates();
      this.isHeadquartersMode();
    } else {
      this.getMemberOperationRequest();
    }
  } 
};
</script>
<style lang="stylus" scoped></style>
