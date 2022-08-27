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
                <li class="current">{{param.title}}詳細</li>
              </ol>
            </div>
            <h1 class="ts_content_heading">{{param.title}}詳細</h1>
          </section>
          <div class="button_header_btn">
            <button type="button" class="btn btn-info global_btn" v-if="checkMenuPermission('Master:OperationCategory:update')" @click="onTransitionButton('/company_operation_categories/edit/' + item.id)">編集</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Main content -->
    <section class="content">
      <div class="box-group">
        <div class="box">
          <!-- /.box-header -->
          <div class="box-body no-paddin">
            <form class="form-horizontal" autocomplete="off">
              <div class="box-body">

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">ビル</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">
                      {{ getNameByValue(item.buildingId, this.buildings) }}
                    </div>
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">業務種別</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">
                      {{ getNameByValue(item.operationTypeId, this.operationTypes) }}
                    </div>
                  </div>
                </div>

              </div>
              <!-- /.box-body -->

              <div name="report_body">
                <report-object-group-view :param="reportObjectGroupParam" :list="reportObjectGroups" :isEdit="false"></report-object-group-view>
              </div>

              <div v-if="itemInfo" class="callout callout-success"><p>{{itemInfo}}</p></div>
              <div v-if="error" class="callout callout-danger err-info"><p>{{error}}</p></div>
              <div class="box-footer form_button_flex flex_center border_top">
                <button type="button" class="btn btn-default global_btn form_button_flex_item"  @click="onTransitionButton('/company_operation_categories')">戻る</button>
              </div>

            </form>
          </div>
          <!-- /.box-body no-paddin -->
        </div>
        <!-- /.box -->

      </div>
      <!-- /.box-group -->

    </section>
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->
</template>

<script>
  import ReportObjectGroupView from '~/components/ReportObjectGroupView'
  import ModalAlertView from '~/components/ModalAlertView'
  import Loading from 'vue-loading-overlay';
  import 'vue-loading-overlay/dist/vue-loading.css';

  export default {
    data() {
      return {
        api: '/companies/' + localStorage.getItem('company_id') + '/operation-categories',
        error: '',
        loading: true,
        fullpage: true,
        buildings: [],
        operationTypes: [],
        param: {
          title: "ビル別業務グループ",
          columns: [
          ]
        },
        updatedAt: '',
        item: {},
        reportObjectGroupParam: {
          contentTitle: '業務グループ',
          columnName: ['業務グループ名'],
          maxlength:32,
          options: []
        },
        reportObjectGroups:[],
      }
    },
    components: {
      ReportObjectGroupView,
      ModalAlertView,
      Loading
    },
    methods: {

      /**
       * 表示対象の業務カテゴリとそれに紐づく業務グループを取得.
       */
      getOperationCategory() {
        var filter = {
          'include': [{
            'relation': 'operationCategoryContents',
            'scope': {
              'include': [{
                'relation': 'reportObjectGroupDefinition'
              }]
            }
          }]
        };
        var where = { 'and': [{ 'id': this.$route.params.id }] };
        this.onSearch(this.api, filter, where, res => {
          if (0 < res.length) {
            var operationCategory = res[0];

            this.item = {
              'id': operationCategory.id,
              'companyId': operationCategory.companyId,
              'buildingId': operationCategory.buildingId,
              'operationTypeId': operationCategory.operationTypeId,
              'name': operationCategory.name,
              'reportName': operationCategory.reportName,
              'createdAt': operationCategory.createdAt,
              'updatedAt': operationCategory.updatedAt,
              'deletedAt': operationCategory.deletedAt
            };

            const list = [];
            if (operationCategory.operationCategoryContents != undefined) {
              operationCategory.operationCategoryContents?.forEach(function(obj) {
                var reportObjectGroupDefinition = obj.reportObjectGroupDefinition;
                list.push({
                  id: reportObjectGroupDefinition.id,
                  name: reportObjectGroupDefinition.name,
                  sort: obj.sort
                });
              });
            }

            list.sort(function(a,b){
              if(a.sort < b.sort) return -1;
              if(a.sort > b.sort) return 1;
              return 0;
            });
            this.reportObjectGroups = list;
          }
        });
      },

      /**
       * ビル情報取得(契約会社IDで絞る).
       */
      getBuildings() {
        var api_url = '/buildings'
        var where = {'and':[{'companyId': parseInt(localStorage.getItem('company_id'))}]};
        this.onSearch(api_url, null, where, res => {
          const list = [{ name: '', display: '', value: '' }];
          res.forEach(function(obj) {
            list.push({ name: obj.name, display: obj.name, value: obj.id });
          });
          this.buildings = list;
        });
      },

      /**
       * 業務種別取得(契約会社IDで絞る).
       */
      getOperationTypes() {
        var api_url = '/companies/' + localStorage.getItem('company_id') + '/operation-types';
        var where = {};
        this.onSearch(api_url, null, where, res => {
          const list = [{ name: '', display: '', value: '' }];
          res.forEach(function(obj) {
            list.push({ name: obj.name, display: obj.name, value: obj.id});
          });
          this.operationTypes = list;
        });
      },

      /**
       * 一覧からIDを元に名称を返却する.
       */
      getNameByValue(id, list) {
        var obj = list.find(obj => obj.value === id);
        return (obj != undefined) ? obj.name : '';
      }
    },
    created() {
      const key = "Master:OperationCategory:view";
      this.checkDisplayPermission(key, () => {
        this.loading = false;
        this.getBuildings();
        this.getOperationTypes();
        this.getOperationCategory();
      });
    },
    watch: {
      $route: function(route) {
        this.getOperationCategory();
      }
    }
  }

</script>
