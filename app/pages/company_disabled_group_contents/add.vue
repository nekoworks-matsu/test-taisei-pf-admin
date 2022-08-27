<template>
  <div class="content-wrapper ts_content_wrapper">
    <loading
    :active.sync="loading"
    :can-cancel=false
    :on-cancel="onCancel"
    :is-full-page="fullpage"></loading>

    <section class="content_head">
      <div class="ts_content_head">
        <div class="button_header">
          <section>
            <div class="ts_breadcrumb">
              <ol>
                <li>{{param.operation}}</li>
                <li>{{param.title}}一覧</li>
                <li class="current">{{param.title}}登録</li>
              </ol>
            </div>
            <h1 class="ts_content_heading">{{param.title}}登録</h1>
          </section>
        </div>
      </div>
    </section>

    <section class="content">
      <div class="box">
        <div class="box-header with-border box_head">
          <h2 class="box-title with-border">{{param.title}}情報</h2>
        </div>
        <div class="box-body no-paddin">
          <form class="form-horizontal" name="report_form">
            <div class="box-body">

              <div class="form-group form_box_group required">
                <div class="form_box_group_title">
                  <label class="control-label">ビル</label>
                </div>
                <div class="form_box_group_field">
                  <select class="form-control max_width_390" v-model="item.buildingId" v-on:change="fetchReportObjectGroupDefinitions">
                    <option v-bind:value="opt.value" v-for="opt in buildings" >{{opt.name}}</option>
                  </select>
                </div>
              </div>

              <div class="form-group form_box_group">
                <div class="form_box_group_title">
                  <label class="control-label">業務種別</label>
                </div>
                <div class="form_box_group_field">
                  <select class="form-control max_width_390" v-model="operationType" v-on:change="fetchReportObjectGroupDefinitions">
                    <option v-bind:value="opt.value" v-for="opt in operationTypes" >{{opt.name}}</option>
                  </select>
                </div>
              </div>

              <div class="form-group form_box_group required">
                <div class="form_box_group_title">
                  <label class="control-label">業務グループ</label>
                </div>
                <div class="form_box_group_field">
                  <select class="form-control max_width_390" v-model="item.reportObjectGroupDefinitionId" v-on:change="fetchReportObjectDefinitions">
                    <option v-bind:value="opt.value" v-for="opt in reportObjectGroupDefinitions" >{{opt.name}}</option>
                  </select>
                </div>
              </div>
            </div>

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
                      <input type="checkbox" name="continuation" v-model="item.reportObjectDefinitions[obj.id]" :id="obj.id">
                      <div class="control_indicator"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="error" class="callout callout-danger err-info">
              <p>{{ error }}</p>
            </div>

            <div class="box-footer form_button_flex flex_right border_top">
              <button type="button" class="btn btn-default global_btn form_button_flex_item" onclick="window.history.back()" v-bind:disabled="this.isButtonDisabled" >キャンセル</button>
              <button type="button" class="btn btn-warning global_btn form_button_flex_item" @click="onAddButton" v-bind:disabled="this.isButtonDisabled">登 録</button>
            </div>
            <!-- /.box-footer -->

          </form>
          <!-- /.form-horizontal -->
        </div>
        <!-- /.box-body -->
      </div>
      <!-- /.box -->
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
        fullpage: true,
        loading: true,
        isButtonDisabled: false,
        error: '',
        buildings: [],
        operationType: '',
        operationTypes: [],
        reportObjectGroupDefinitions: [],
        reportObjectDefinitions: [],
        param: {
          title: 'ビル別業務非表示設定',
          operation: 'マスタ情報',
          idLabel: 'ビル別業務非表示設定',
          columns: [
            { name: 'ビル', column: 'buildingId' },
            { name: '業務グループ', column: 'reportObjectGroupDefinitionId' },
            { name: '業務', column: 'reportObjectDefinitions' },
          ],
          init_val: {
            buildingId: null,
            reportObjectGroupDefinitionId: null,
            reportObjectDefinitions: []
          },
          cb: this.updateView,
          icon: 'fa-user',
          success: '/company_disabled_group_contents',
        },
        DatePickerFormat: 'yyyy/MM',
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
      updateView(val) {},
      onCancel() {},

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
       * 業務グループ取得(ビル変更時の処理).
       */
      fetchReportObjectGroupDefinitions() {
        if (this.item.buildingId) {
          var api_url = '/companies/' + localStorage.getItem('company_id') + '/operation-categories';
          var filter = {
            'include': [{
              'relation': 'operationCategoryContents',
              'scope': {
                 'include': [{
                   'relation': 'reportObjectGroupDefinition',
                   'scope': {'include': [{'relation': 'reportObjectDefinitions'}]}
                 }]
              }
            }]
          };
          var where = { 'and': [{ 'buildingId': this.item.buildingId}] };
          if (this.operationType != '') {
            where.and[0].operationTypeId = this.operationType;
          }
          this.onSearch(api_url, filter, where, res => {
            const list = [];
            res.forEach((operationCategory) => {
              if (operationCategory.operationCategoryContents != undefined) {
                operationCategory.operationCategoryContents?.forEach(function(obj) {
                  var reportObjectGroupDefinition = obj.reportObjectGroupDefinition;
                  if (reportObjectGroupDefinition != null){
                    list.push({
                      name: 'ID ' + reportObjectGroupDefinition.id + ' : ' + reportObjectGroupDefinition.name,
                      display: reportObjectGroupDefinition.name,
                      value: reportObjectGroupDefinition.id
                    });
                  }
                });
              }
            });
            // 重複削除
            this.reportObjectGroupDefinitions = this.filterUniqueItemsById(list);
          });
        } else {
          this.reportObjectGroupDefinitions = [];
          this.reportObjectDefinitions = [];
        }
      },

      /**
       * 業務取得(業務グループ変更時の処理).
       */
      fetchReportObjectDefinitions() {
        if (this.item.reportObjectGroupDefinitionId) {
          var api_url = '/companies/' + localStorage.getItem('company_id') + '/report-object-group-definitions'
          var where = {'and': [{ 'id': this.item.reportObjectGroupDefinitionId }]};
          var filter = {
            'include': [{ 'relation': 'reportObjectDefinitions' }]
          };
          this.onSearch(api_url, filter, where, res => {
            if (0 < res.length) {
              var reportObjectGroupDefinition = res[0]; // ID指定しているため1件しか取得できない

              const list = [];
              reportObjectGroupDefinition.reportObjectDefinitions?.forEach(function(obj) {
                list.push({ id: obj.id, name: obj.name });
              });
              this.reportObjectDefinitions = list;
            }
          });
        } else {
          this.reportObjectDefinitions = [];
        }
      },

      /**
       * 重複削除.
       */
      filterUniqueItemsById(array) {
        // idを集約した配列を作成
        const itemIds = array.map(function(item) {
          return item.value;
        });
        return array.filter(function(item, index) {
          return itemIds.indexOf(item.value) === index;
        });
      },

      /**
       * 登録ボタン押下時処理.
       */
      onAddButton() {
        this.error = '';
        this.addRequest();
      },
      addRequest() {
        var send_data = this.getPostData();
        this.req(this.api, 'post', send_data, (err, res) => {
          if (err) {
            this.error = this.getErrorMsg2(res, this.param.columns);
            return;
          } else if (res.body) {
            this.$router.push("/company_disabled_group_contents/");
          }
        });
      },
      getPostData() {
        return {
          buildingId: this.item.buildingId,
          reportObjectGroupDefinitionId: this.item.reportObjectGroupDefinitionId,
          reportObjectDefinitionIds: this.item.reportObjectDefinitions.map((v, key) => {return { id: key }}).filter((v) => v).map((v) => v.id)
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
      const key = "Master:DisabledGroupContent:create";
      this.checkDisplayPermission(key, () => {
        this.getBuildings();
        this.getOperationTypes();
        this.fetchReportObjectGroupDefinitions();
        this.loading = false;
        if (this.param.init_val){
          this.item = this.param.init_val;
        }
      });
    },
    watch: {
      item: {
        handler(val) {
          this.param.columns.forEach( e => {
            if (this.item[e.column] === '') {
              this.item[e.column] = undefined;
            }
          })
          if(this.param.cb != null) {
            this.param.cb(val);
          }
        },
        deep: true,
      },
    },
  }

</script>

<style lang="stylus" scoped>

</style>
