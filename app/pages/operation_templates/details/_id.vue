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
        <div class="button_header">
          <section>
            <div class="ts_breadcrumb">
              <ol>
                <li>マスタ情報</li>
                <li>{{param.title}}一覧</li>
                <li class="current">{{param.title}}詳細</li>
              </ol>
            </div>
            <h1 class="ts_content_heading">{{param.title}}詳細</h1>
          </section>
          <div class="button_header_btn">
            <button type="button" class="btn btn-info global_btn" @click="onTransitionButton('/operation_templates/edit/' + item.id)">編集</button>
          </div>
        </div>
      </div>
    </section>

    <!-- <section class="content-header">
      <h1>
        {{param.title}}詳細
        <small></small>
        <div class="pull-right">
          <button type="button" class="btn btn-info width_140" @click="onTransitionButton('/operation_templates/edit/' + item.id)">編 集</button>
        </div>
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
                      {{item.id}}
                    </div>
                  </div>
                </div>

                <div class="form-group form_box_group" v-if="isSystemApprovalMode">
                  <div class="form_box_group_title">
                    <label class="control-label">契約会社</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">{{getColumData(getCompanyName(item.companyId))}}</div>
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">業務テンプレート名</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">
                      {{getColumData(item.name)}}
                    </div>
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">業務カテゴリ</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">
                      {{getOperationName(item.operationId)}}
                    </div>
                  </div> 
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">登録日時</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">
                      {{df(item.createdAt)}}
                    </div>
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">更新日時</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">
                      {{df(this.tmpUpdatedAt)}}
                    </div>
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
                        <input type="checkbox" name="continuation" v-model="operations[majorItem.sort].useAsReport" :id="majorItem.id" checked disabled v-if="operations[majorItem.sort].useAsReport">
                        <input type="checkbox" name="continuation" v-model="operations[majorItem.sort].useAsReport" :id="majorItem.id" disabled v-if="!operations[majorItem.sort].useAsReport">
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
              <div class="box-footer form_button_flex flex_center border_top">
                <button type="button" class="btn btn-default global_btn form_button_flex_item" onclick="window.history.back()">戻る</button>
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
        api: '/operation-report-templates',
        tmpUpdatedAt: "",
        buildingName: "",
        targetMajorItems:[],
        isDown: [],
        isSetting: [],
        targetOperation: '',
        operationList: [],
        operations: [],
        item: {},
        displayItem: [],
        floors: [],
        itemInfo: '',
        fullpage: true,
        error: '',
        companies_id_options: [],
        isSystemApprovalMode: this.toBoolean(localStorage.getItem('is_system_approval_mode')),
        param: {
          title: '業務テンプレート',
        }
      }
    },
    components: {
      MonthlyReportView,
      Loading
    },
    methods: {
      setMajorItemsInfo(reportObjectDefinitions, getOperations) {
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
          var findOpe = getOperations.find(val => val.reportObjectDefinitionId == reportObjectDefinitions[i].id);
          if (findOpe != undefined) {
            itemOperations.push({reportObjectDefinitionId: reportObjectDefinitions[i].id, useAsReport: findOpe.useAsReport});
          } else {
            itemOperations.push({reportObjectDefinitionId: reportObjectDefinitions[i].id, useAsReport: false});
          }
        }
        this.targetMajorItems = operations;
        this.operations = itemOperations;
      },
      getMajorItemsRequest(id, operations) {
        this.req("/operation-categories", 'get', null, (err, res) => {
          var find = res.body.find(val => val.id == id);
          this.setMajorItemsInfo(find.reportObjectDefinitions, operations);
        });
      },
      onReadMajorItems(operations) {
        if (this.item.operationId == null || this.item.operationId == "") {
          alert("業務を選択してから再度実行してください")
          return;
        }
        this.getMajorItemsRequest(this.item.operationId, operations);
        this.onReadMajorItemsFlag = true;  
      },
      setOperationList(){
        var operations = JSON.parse(localStorage.getItem("report_list"));
        const list = [{ name: "", value: "" }];
        operations.forEach(function(val) {
          list.push({name: val.operation_name, value: val.id});
        });
        this.operationList = list;
      },
      getReportObjectDefinition(item) {
        return {
          id: item.id,
          name: item.name,
          operationCategoryId: item.operationCategoryId,
          sort: item.sort,
          path: '/majoritems/' + item.id
        }
      },
      getOperationName(id) {
        var find = this.operationList.find(val => val.value == id);
        if (find != undefined) {
          return find.name;
        }
      },
      getCompanyName(id) {
        var name = this.companies_id_options.find(val => val.value == id);
        if (name != undefined) {
          return name.name;
        }
      },
      getOperationTemplateRequest(api) {
        this.onRead(api, null, data => {
          this.$set(this.item, "id", data.id);
          this.$set(this.item, "name", data.name);
          this.$set(this.item, "companyId", data.companyId);
          this.$set(this.item, "operationId", data.operationCategoryId);
          this.item.createdAt = data.createdAt;
          this.tmpUpdatedAt = data.updatedAt;
          this.onReadMajorItems(data.operations);
        });
      },
      onUpdateButton() {
        var request =  {"name": this.item.name, "operationCategoryId": this.item.operationId, "operations": this.operations};
        this.req("/operation-report-templates/" + parseInt(this.$route.params.id), 'patch', request, (err, res) => {;
          if (err) {
            const errorColm = {};
            for(const key in this.param.columns){
              errorColm[this.param.columns[key].column] = this.param.columns[key].name;
            }
            this.error = this.getErrorMsg2(res, this.param.columns);
            //this.error = this.getErrorMsg(res && res.body && res.body.error, errorColm, this.param.errorCode);
          } else if (res.body) {
            this.error = "";
            this.itemInfo = "更新完了";
            setTimeout(() => this.itemInfo = '', 3000);
            this.tmpUpdatedAt = res.body.updatedAt;
          }
        });
      },
      /**
      * 登録契約会社の取得
      */
      getCompaniesListRequest(api) {
        this.onSearch(api, null, null, val => {
          const list = [{name: null, value: null}];
          val.forEach(function(obj){
            list.push({ name: obj.name, value: obj.id});
          });
          this.companies_id_options = list;
          this.getOperationTemplateRequest('/operation-report-templates');
        });
      },
    },
    created() {
      const key = "Master:OperationReportTemplate:view";
      this.checkDisplayPermission(key, () => {
        //this.setTitle();
        this.setOperationList();
        this.getCompaniesListRequest('/companies');
      });
    },
    watch: {
      $route: function(route) {
        this.targetMajorItems = [];
        this.itemInfo = "";
        this.setOperationList();
        this.getCompaniesListRequest('/companies');
      }
    }
  };
</script>

<style lang="stylus" scoped>

</style>