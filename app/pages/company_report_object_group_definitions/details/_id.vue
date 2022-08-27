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
            <button type="button" class="btn btn-info global_btn" v-if="checkMenuPermission('Master:ReportObjectGroupDefinition:update')" @click="onTransitionButton('/company_report_object_group_definitions/edit/' + item.id)">編集</button>
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
                    <label class="control-label">業務種別</label>
                  </div>
                  <div class="form_box_group_field">
                    {{ getNameByValue(item.operationTypeId, this.operationTypes) }}
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">業務グループ名</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">
                      {{item.name}}
                    </div>
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">自動登録設定</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">
                      <label class="control control_checkbox">
                        <input type="checkbox" name="display" v-model="item.autoCreate" disabled>
                        <div class="control_indicator"></div>
                      </label>
                    </div>
                  </div>
                </div>

              </div>
              <!-- /.box-body -->

              <div name="report_body">
                <report-object-view :param="reportObjectParam" :list="reportObjects" :isEdit="false"></report-object-view>
              </div>

              <div v-if="itemInfo" class="callout callout-success"><p>{{itemInfo}}</p></div>
              <div v-if="error" class="callout callout-danger err-info"><p>{{error}}</p></div>
              <div class="box-footer form_button_flex flex_center border_top">
                <button type="button" class="btn btn-default global_btn form_button_flex_item" @click="onTransitionButton('/company_report_object_group_definitions/')">戻る</button>
              </div>
              <!-- /.box-footer -->
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
  import ReportObjectView from '~/components/ReportObjectView'
  import ModalAlertView from '~/components/ModalAlertView'
  import Loading from 'vue-loading-overlay';
  import 'vue-loading-overlay/dist/vue-loading.css';

  export default {
    data() {
      return {
        api: '/companies/' + localStorage.getItem('company_id') + '/report-object-group-definitions',
        error: '',
        loading: true,
        fullpage: true,
        operationTypes: [],
        param: {
          title: "業務グループ",
          columns: [
          ]
        },
        updatedAt: '',
        item: {},
        reportObjectParam: {
          contentTitle: '業務',
          columnName: ['業務名'],
          maxlength:32,
          options: []
        },
        reportObjects:[],
      }
    },
    components: {
      ReportObjectView,
      ModalAlertView,
      Loading
    },
    methods: {

      /**
       * 表示対象の業務グループとそれに紐づく業務を取得.
       */
      getReportObjectGroupDefinition() {
        var filter = {
          'include': [{ relation: 'reportObjectDefinitions' }]
        };
        this.onRead(this.api, filter, data => {
          this.item = data;
          this.reportObjects = (data.reportObjectDefinitions) ? data.reportObjectDefinitions : []; // 関連テーブルに登録済みデータ
          this.reportObjects.sort(function(a,b){
            if(a.sort < b.sort) return -1;
            if(a.sort > b.sort) return 1;
              return 0;
          });


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
      },
    },
    created() {
      const key = "Master:ReportObjectGroupDefinition:view";
      this.checkDisplayPermission(key, () => {
        this.loading = false;
        this.getOperationTypes();
        this.getReportObjectGroupDefinition();
      });
    },
    watch: {
      $route: function(route) {
        this.getReportObjectGroupDefinition();
      }
    }
  }

</script>
