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
                <li>{{param.title}}詳細</li>
                <li class="current">{{param.title}}編集</li>
              </ol>
            </div>
            <h1 class="ts_content_heading">{{param.title}}編集</h1>
          </section>
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
                    {{ getNameByValue(item.buildingId, this.buildings) }}
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">業務種別</label>
                  </div>
                  <div class="form_box_group_field">
                    {{ getNameByValue(this.reportObjectGroupDefinition.operationTypeId, this.operationTypes) }}
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">業務グループ</label>
                  </div>
                  <div class="form_box_group_field">
                    {{ this.reportObjectGroupDefinition.name }}
                  </div>
                </div>

              </div>
              <!-- /.box-body -->

              <div class="box-body">
                <div class="box-header with-border" style="margin-bottom: 20px;">
                  <h3 class="box-title">業務</h3>
                </div>

                <div class="form-group form_box_group" v-for="(obj, index) in reportObjectDefinitions">
                  <div class="form_box_group_title">
                    <label class="control-label" :for="obj.id">{{obj.name}}</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">
                      <label class="control control_checkbox">
                        <input type="checkbox" name="continuation" v-model="tempReportObjectDefinitions[obj.id]" :id="obj.id" checked v-if="checkReportObjectDefinition(obj.id)">
                        <input type="checkbox" name="continuation" v-model="tempReportObjectDefinitions[obj.id]" :id="obj.id" v-if="!checkReportObjectDefinition(obj.id)">
                        <div class="control_indicator"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="itemInfo" class="callout callout-success"><p>{{itemInfo}}</p></div>
              <div v-if="error" class="callout callout-danger err-info"><p>{{error}}</p></div>
              <div class="box-footer form_button_flex flex_right border_top">
                <!-- <button type="button" class="btn btn-danger global_btn form_button_flex_item margin_right_auto" v-if="checkMenuPermission('Master:DisabledGroupContent:delete')" @click="onDeleteFunc()">削 除</button> -->
                <button type="button" class="btn btn-default global_btn form_button_flex_item" @click="onTransitionButton('/company_disabled_group_contents/' + item.buildingId + '/details/' + reportObjectGroupDefinition.id)">キャンセル</button>
                <button type="button" class="btn btn-warning global_btn form_button_flex_item" @click="onUpdateButton">保存</button>
              </div>
              <!-- /.box-footer -->
            </form>

          </div>
          <!-- /.box-body -->
        </div>
        <!-- /.box -->

      </div>
      <!-- /.box-group -->
      <!-- 
      <template>
        <modal-alert-view　ref="alert" :id="'modal_alert'" :param="alert" @onconfirm="deleteFunc"></modal-alert-view>
      </template>
       -->
    </section>
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->
</template>

<script>
  import ModalAlertView from '~/components/ModalAlertView'
  import Loading from 'vue-loading-overlay';
    // Import stylesheet
  import 'vue-loading-overlay/dist/vue-loading.css';

  export default {
    data() {
      return {
        api: '/companies/' + localStorage.getItem('company_id') + '/disabled-group-contents',
        now: ~~(Date.now() / 10000),
        fullpage: true,
        loading: true,
        buildings: [],
        operationTypes: [],
        reportObjectGroupDefinition: {},
        reportObjectDefinitions: [],
        tempReportObjectDefinitions: [],
        alert: {
          title: 'test',
        },
        param: {
          title: "ビル別業務非表示設定",
          columns: [
            { name: 'ビル', column: 'buildingId' },
            { name: '業務グループ', column: 'reportObjectGroupDefinitionId' },
            { name: '業務', column: 'reportObjectDefinitions' },
          ]
        },
        tmpUpdatedAt: '',
        error: '',
        itemInfo: '',
        item: {
          buildingId: '',
          reportObjectDefinitionIds: []
        },
        DatePickerFormat: 'yyyy/MM/dd',
        language:{
          language: 'Japanese', 
          months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'], 
          monthsAbbr: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'], 
          days: ['日', '月', '火', '水', '木', '金', '土'], 
          rtl: false, 
          ymd: 'yyyy-MM-dd', 
          yearSuffix: '年'
        },
      }
    },
    components: {
      ModalAlertView,
      Loading,
    },
    methods: {
      /**
       * 表示対象のビル別業務設定取得.
       */
      getOperationGroupContent() {
        var where   = { 'and':[{'buildingId': this.$route.params.building_id}, {'reportObjectGroupDefinitionId': this.$route.params.id}] };
        var filter  = { 'include': [{ relation: 'building' }, { relation: 'reportObjectGroupDefinition' }] };
        this.onSearch(this.api, filter, where, res => {
          if (res && res[0] != 'error') {
            var data = res[0]; // buildingId と reportObjectGroupDefinitionId で1件に絞れる
            var tempReportObjectGroupDefinitionId = data.reportObjectGroupDefinition.id;
            this.item.buildingId = data.building.id;
            this.item.reportObjectDefinitionIds = data.reportObjectDefinitionIds;

            var api_url = '/companies/' + localStorage.getItem('company_id') + '/report-object-group-definitions/' + tempReportObjectGroupDefinitionId;
            var filter  = { 'include': [{ relation: 'reportObjectDefinitions' }] };
            this.req(api_url + '?filter=' + JSON.stringify(filter) + '&' + this.now, 'get', null, (err, res) => {
              setTimeout(() => {
                if (res && res.ok) {
                  this.reportObjectGroupDefinition = res.body;
                  // 対象業務グループに紐づく業務(チェック対象にできる業務)
                  this.reportObjectDefinitions = (res.body.reportObjectDefinitions) ? res.body.reportObjectDefinitions : [];

                  // OperationGroupContentに登録されているデータをチェック済みとして初期設定する
                  this.item.reportObjectDefinitionIds.forEach((id) => {
                    this.tempReportObjectDefinitions[id] = this.checkReportObjectDefinition(id);
                  });
                }
              }, 1);
            });
          }
        });
      },

      /**
       * ビル取得(契約会社[companyId]で絞る).
       */
      getBuildings() {
        var api_url = '/buildings'
        var where = {'and':[{'companyId': parseInt(localStorage.getItem('company_id'))}]};
        this.onSearch(api_url, null, where, res => {
          const list = [{ name: '', display: '', value: '' }];
          res.forEach(function(obj) {
            list.push({ name: obj.name, display: obj.name, value: obj.id});
          });
          this.buildings = list;
        });
      },

      /**
       * 業務が個別設定されているかどうか判別する.
       */
      checkReportObjectDefinition(id) {
        var obj = this.item.reportObjectDefinitionIds.find(obj => obj === id);
        return obj != undefined;
      },

      /**
       * 一覧からIDを元に名称を返却する.
       */
      getNameByValue(id, list) {
        var obj = list.find(obj => obj.value === id);
        return (obj != undefined) ? obj.name : '';
      },

      /**
       * 削除ボタン押下時の処理.
       */
      // onDeleteFunc() {
      //   this.alert.title = '';
      //   this.alert.message = 'こちらのデータを削除いたします。<br>よろしいでしょうか？<br>';
      //   this.alert.note = '※この操作は取り消すことはできません。'
      //   this.alert.isConfirm = true;
      //   $('#modal_alert').modal('show')
      // },
      // deleteFunc() {
      //   this.onDelete(this.api, '/company_disabled_group_contents');
      // },

      /**
       * 更新ボタン押下時の処理.
       */
      onUpdateButton() {
        this.error = ''
        this.updateRequest()
      },
      updateRequest() {
        var send_data = this.getPostData();
        this.req(this.api, 'patch', send_data, (err, res) => {
          if (err) {
            this.error = this.getErrorMsg2(res, this.param.columns);
            return;
          } else if (res.body) {
            this.error = '';
            this.itemInfo = "更新完了";
            this.tmpUpdatedAt = res.body.updatedAt;
            setTimeout(() => this.itemInfo = '', 3000);
          }
        });
      },
      getPostData() {
        return {
          buildingId: this.item.buildingId,
          reportObjectGroupDefinitionId: this.reportObjectGroupDefinition.id,
          reportObjectDefinitionIds: this.tempReportObjectDefinitions.map((v,key) => {return {id: key, value: v}}).filter((v) => v.value).map((v) => v.id)
        }
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
      }
    },
    created() {
      const key = "Master:DisabledGroupContent:update";
      this.checkDisplayPermission(key, () => {
        this.loading = false;
        this.getBuildings();
        this.getOperationTypes();
        this.getOperationGroupContent();
      });
    }
  }

</script>
