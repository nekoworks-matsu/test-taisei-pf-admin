<template>
  <div class="login-box ts_login ts_login_tablet">
    <div class="login-box-body">
      <div class="login-logo">
        <span class="logo-lg">
          <img class="login_logo" src="~/assets/t_logo.png" />
        </span>
        <p class="login-env-msg-stg font_20" v-if="env=='staging'">【 検証環境 】</p>
        <p class="login-env-msg-dev font_20" v-if="env=='dev_server'">【 開発環境 】</p>
      </div>
      <!-- /.login-logo -->
      <p class="login-box-msg lead">業務対象のビルを選択してください</p>
      
      <form v-on:submit.prevent="selects">
        <div class="form-group has-feedback">
          <select class="form-control input-lg min-height-50" v-model="selectedBuilding">
            <option v-for="category in categories" v-bind:value="category">
              {{ category.name }}
            </option>
          </select>
        </div>
        <div v-if="error" class="callout callout-danger err-info"><p>{{error}}</p></div>
        <div class="form-group margin_top_40 has-feedback">
          <button type="button" v-if="error" @click="back" class="btn btn-default btn-block btn-flat">
            <i v-show="!loading">もどる</i>
          </button>
          <button type="submit" class="btn btn-info btn-block btn_green" v-bind:disabled="this.selectedBuilding.id==null">
            <!-- <i class="fa fa-refresh fa-spin" v-show="loading"></i> -->
            <i v-show="!loading">決定</i>
          </button>
        </div>
      </form>
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
      loginid: '',
      password: '',
      error: '',
      categories: [{'id': null, 'name': '【ビルを選択】', 'value': null}],
      selectedBuilding: {'id': null, 'name': '【ビルを選択】', 'value': null},
      api: '/buildings',
      env: process.env.ENV
    }
  },
  methods: {
    getBusinessStartTimeRequest() {
      const url = process.env.API_SERVER + '/buildings/' + localStorage.getItem('buildings_id');
      this.req(url, 'get', null, (err, res) => {
        localStorage.setItem('business_start_time', moment(res.body.buildingSetting.businessStartTime, 'HH:mm:ss').add(9, 'h').format('HH:mm:ss'));
        localStorage.removeItem('search_item');
        this.getDisplayObjectIfEmpty();
      });
    },
    getCompanyName() {
      var companyId = parseInt(localStorage.getItem('company_id'));
      const url = process.env.API_SERVER + '/companies/' + companyId;
      this.req(url, 'get', null, (err, res) => {
        localStorage.setItem('company_name', res.body.name);
      });
    },
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
            }
            content.reportObjectGroupDefinition.sort = content.sort ?? sort;
            const reportObjectDefinitions = [];
            if (content.reportObjectGroupDefinition.reportObjectDefinitions != null) {
              content.reportObjectGroupDefinition.reportObjectDefinitions.forEach((defenitions) => {
                var definitionFound = disabled.find(val => val == defenitions.id);
                if (!definitionFound) {
                  reportObjectDefinitions.push(defenitions);
                }
              })
            }
            reportObjectDefinitions.sort(function(a,b){
              if(a.sort < b.sort) return -1;
              if(a.sort > b.sort) return 1;
                return 0;
            });
            content.reportObjectGroupDefinition.reportObjectDefinitions = reportObjectDefinitions;
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
     * テンプレートリストをローカルストレージに保存
     */
    saveTemplateListToLocalStorage(val) {
      var templateList = [];
      for (var i = 0; i < val.length; i++) {
        templateList.push({ templateId: val[i].id, operationCategoryId: val[i].operationCategoryId });
      }
      localStorage.setItem('template_list', JSON.stringify(templateList));
      this.$router.push(this.$router.redirect ? this.$router.redirect : '/t_home');
    },
    /**
     * 共通UI表示項目のメンバーごとのフィルタ
     */
    filterMenulistToMemberRequest(api, val, disabled) {
      this.onSearch(api, null, null, (res) => {
        var report_hierarchy = [];
        // NOTE: メンバーごとの業務filter処理追加
        for (var i = 0; i < val.length; i++) {
          if (val[i].operationCategoryContents != null) {
            if (this.checkItemPermission('Common:forSystemApproval')){
              report_hierarchy.push({ operation_type_id: val[i].operationTypeId, name: val[i].reportName, operation_name: val[i].reportName.replace(/報告書/g, ''), id: val[i].id, path: '/report/' + val[i].operationTypeId, majoritems: this.convertReportObjectDefinitions(val[i].operationCategoryContents,disabled)});
            }else{
              for (var j = 0; j < res.memberOperationCategories.length; j++) {
                if (val[i].operationTypeId == res.memberOperationCategories[j].operationTypeId) {
                  report_hierarchy.push({ operation_type_id: val[i].operationTypeId, name: val[i].reportName, operation_name: val[i].reportName.replace(/報告書/g, ''), id: val[i].id, path: '/report/' + val[i].operationTypeId, majoritems: this.convertReportObjectDefinitions(val[i].operationCategoryContents,disabled)});
                }
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
      });
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
    selects() {
      this.loading = true;
      localStorage.setItem('buildings_id', this.selectedBuilding.id);
      localStorage.setItem('buildings_name', this.selectedBuilding.value);
      localStorage.setItem("privious_page", null);

      const url = process.env.API_SERVER + '/access-logs/select-building';
      var send_data = { buildingId: this.selectedBuilding.id };
      this.req(url, 'post', send_data, (err, res) => {

      });

      this.onSearch('/companies/' + localStorage.getItem("company_id") + '/operation-categories', null, null, val => {
        localStorage.setItem('operation_categories', JSON.stringify(val));
      });
      this.getBusinessStartTimeRequest();
    },
    setBuildings() {
      var where = {"and":[{"companyId": parseInt(localStorage.getItem('company_id'))}]};
      var that = this;
      this.onSearch('/buildings', null, where, val => {
        val.forEach(function(obj){
          that.categories.push({id: obj.id,  name: obj.name,value: obj.name});
        });
      })
    },
    getBuildings(){
      var buildings;
      if (this.checkItemPermission('Common:forSystemApproval')) {
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
    getMemberInfo() {
      this.onSearch('/members/' + localStorage.getItem('member_id'), null, null, val => {
        if (!this.checkItemPermission('Common:forSystemApproval')) {
          localStorage.setItem('company_id', JSON.stringify(val.member.companyId));
          this.getCompanyName();
        }
        this.getBuildings();
      }); 
    },
    back(){
      this.$router.push("login")
      $('body').removeClass('skin-black')
      delete this.$router.redirect
      event.emit('login-update')
    },
  },
  created() {
    $("body").removeClass("skin-black");
    $("body").removeClass("skin-black-light");
    $("body").removeClass("fixed");
    $("body").css('background-color', '');
    localStorage.removeItem('search_item');
    this.getMemberInfo();
    this.checkRevision();
  },
};
</script>
<style lang="stylus" scoped></style>
