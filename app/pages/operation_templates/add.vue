<template>
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper ts_content_wrapper">
    <loading
      :active.sync="loading"
      :can-cancel=false
      :is-full-page="fullpage"></loading>
    <!-- Content Header (Page header) -->
    <section class="content_head">
      <div class="ts_content_head">
        <div class="ts_breadcrumb">
          <ol>
            <li>マスタ情報</li>
            <li>{{param.title}}一覧</li>
            <li class="current">{{param.title}}登録</li>
          </ol>
        </div>
        <h1 class="ts_content_heading">{{param.title}}登録</h1>
      </div>
    </section>
<!-- 
    <section class="content-header">
      <h1>
        {{param.title}}登録
        <small></small>
      </h1>
    </section> -->

    <!-- Main content -->
    <section class="content">
      <div class="box-group">
        <div class="box">
          <!-- <div class="box-header with-border">
            <h2 class="box-title with-border">{{param.title}}情報</h2>
          </div> -->
          <!-- /.box-header -->
          <div class="box-body no-paddin">
            <form class="form-horizontal" style="margin:0;">
              <div class="box-body">
                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">ID</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">
                      ※自動採番
                    </div>
                  </div>
                </div>

                <div class="form-group form_box_group required" v-if="isSystemApprovalMode">
                  <div class="form_box_group_title">
                    <label class="control-label">契約会社</label>
                  </div>
                  <div class="form_box_group_field">
                    <select class="form-control" v-model="item.companyId">
                      <option v-bind:value="opt.value" v-for="opt in companies_id_options" >{{opt.name}}</option>
                    </select>
                  </div>
                </div>

                <div class="form-group form_box_group required">
                  <div class="form_box_group_title">
                    <label class="control-label">業務テンプレート名</label>
                  </div>
                  <div class="form_box_group_field">
                    <input type="text" v-bind:maxlength="64" class="form-control" placeholder="業務テンプレート名" v-model="item.templateName">
                  </div>
                </div>

                <div class="form-group form_box_group required">
                  <div class="form_box_group_title">
                    <label class="control-label">業務カテゴリ</label>
                  </div>
                  <div class="form_box_group_field">
                    <select class="form-control" v-model="item.operationId" @change="updateSelect">
                      <option v-bind:value="operation.value" v-for="operation of this.operationList">{{operation.name}}</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="box-body" v-for="(target, targetCnt) of targetMajorItems" v-if="onReadMajorItemsFlag">
                <div class="box-header with-border" style="margin-bottom: 20px;">
                  <h3 class="box-title">{{target.reportObjectGroupDefinitionName}}</h3>
                </div>

                <div class="form-group form_box_group" v-for="(majorItem, reportObjectCnt) of target.reportObject">
                  <div class="form_box_group_title">
                    <label class="control-label" :for="majorItem.id">{{majorItem.name}}</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">
                      <label class="control control_checkbox">
                        <input type="checkbox" name="continuation" v-model="operations[majorItem.sort].useAsReport" :id="majorItem.id" checked v-if="operations[majorItem.sort].useAsReport">
                        <input type="checkbox" name="continuation" v-model="operations[majorItem.sort].useAsReport" :id="majorItem.id" v-if="!operations[majorItem.sort].useAsReport">
                        <div class="control_indicator"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <!-- /.box-body -->
              <div v-if="itemInfo" class="callout callout-success">
                <p>{{itemInfo}}</p>
              </div>
              <div v-if="error" class="callout callout-danger err-info">
                <p>{{error}}</p>
              </div>
              <div class="box-footer form_button_flex flex_right border_top">
                <button type="button" class="btn btn-default global_btn form_button_flex_item" onclick="window.history.back()">キャンセル</button>
                <button type="button" class="btn btn-warning global_btn form_button_flex_item" @click="onAddButtonClick">登 録</button>
              </div>
              <!-- /.box-footer -->
            </form>
          </div>
          <!-- /.box-body -->
        </div>
      <!-- /.box -->
      </div>
    </section>
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->
</template>

<script>
  import MonthlyReportView from '~/components/MonthlyReportView'
  import Loading from 'vue-loading-overlay';
  import 'vue-loading-overlay/dist/vue-loading.css';
  
  export default {
    data() {
      return {
        buildingList: [],
        targetMajorItems:[],
        isDown: [],
        isSetting: [],
        targetOperation: '',
        operationList: [],
        operations: [],
        onReadMajorItemsFlag: false,
        item: [],
        floors: [],
        itemInfo: '',
        fullpage: true,
        error: '',
        companies_id_options: [],
        isSystemApprovalMode: this.toBoolean(localStorage.getItem('is_system_approval_mode')),
        param: {
          title: '業務テンプレート',
          success: '/operation_templates/',
          columns: [
            { name: '契約会社', column: 'companyId', type: 'select', required: true, options: [] },
            { name: '業務テンプレート名', column: 'name', maxlength: 64 },
            { name: '業務カテゴリ', column: 'operationCategoryId', type: "select", notlike: true, options: [] },
          ]
        }
      }
    },
    components: {
      MonthlyReportView,
      Loading
    },
    methods: {
      updateSelect() {
        this.error = '';
        this.onReadMajorItems();
      },
      setOperationList(){
        var operations = JSON.parse(localStorage.getItem("report_list"));
        const list = [{ name: "", value: "" }];
        operations.forEach(function(val) {
          list.push({name: val.operation_name, value: val.id});
        });
        this.operationList = list;
      },
      setMajorItemsInfo(reportObjectDefinitions) {
        reportObjectDefinitions.sort(function(a,b){
          if(a.sort < b.sort) return -1;
          if(a.sort > b.sort) return 1;
          return 0;
        });
        
        var operations = [];
        var itemOperations = [];
        for (var i = 0; i < reportObjectDefinitions.length; i++) {
          var find = operations.find(val => val.reportObjectGroupDefinitionId == reportObjectDefinitions[i].reportObjectGroupDefinitionId);
          if (find == undefined) {
            operations.push({reportObjectGroupDefinitionName: reportObjectDefinitions[i].reportObjectGroupDefinition.name ,
                             reportObjectGroupDefinitionId: reportObjectDefinitions[i].reportObjectGroupDefinitionId, 
                             reportObject: [{id: reportObjectDefinitions[i].id, name: reportObjectDefinitions[i].name, sort: i}]});
          } else {
            find.reportObject.push({id: reportObjectDefinitions[i].id, name: reportObjectDefinitions[i].name, sort: i});
          }
          itemOperations.push({reportObjectDefinitionId: reportObjectDefinitions[i].id, useAsReport: true});
        }
        this.targetMajorItems = operations;
        this.operations = itemOperations;
      },
      getMajorItemsRequest(id) {
        this.req("/operation-categories", 'get', null, (err, res) => {
          var find = res.body.find(val => val.id == id);
          this.setMajorItemsInfo(find.reportObjectDefinitions);
        });
      },
      onReadMajorItems() {
        if (this.item.operationId == null || this.item.operationId == "") {
          this.onReadMajorItemsFlag = false;  
          return;
        }
        this.getMajorItemsRequest(this.item.operationId );
        this.onReadMajorItemsFlag = true;  
      },
      getRequestData() {
        if (!this.isSystemApprovalMode) {
          this.item.companyId = parseInt(localStorage.getItem('company_id'));
        }
        return {
          "name": this.item.templateName,
          "companyId": this.item.companyId, 
          "operationCategoryId": this.item.operationId, 
          "operations": this.operations
        };
      },
      onAddButtonClick() {
        this.error = '';
        var request = this.getRequestData();

        this.req("/operation-report-templates", 'post', request, (err, res) => {;
          if (err) {
            const errorColm = {};
            for(const key in this.param.columns){
              errorColm[this.param.columns[key].column] = this.param.columns[key].name;
            }
            this.error = this.getErrorMsg2(res, this.param.columns);
            //this.error = this.getErrorMsg(res && res.body && res.body.error, errorColm, this.param.errorCode);
          } else if (res.body) {
            this.$router.push(this.param.success);
          }
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
          this.companies_id_options = list;
        });
      },
    },
    created() {
      const key = "Master:OperationReportTemplate:create";
      this.checkDisplayPermission(key, () => {
        this.getCompaniesListRequest('/companies');
        this.setOperationList();
      });
    },
    watch: {
      targetBuilding: {
        handler(val) {
          this.targetMajorItems = [];
        },
        deep: true,
      }
    }
  }
</script>

<style lang="stylus" scoped>

</style>