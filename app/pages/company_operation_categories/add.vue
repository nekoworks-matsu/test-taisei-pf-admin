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
              <div class="form-group form_box_group" v-if="col.type!='hiddenColmun'" v-for="col in param.columns" v-bind:class='{required:col.required} '>
                <div class="box-header with-border" v-if="col.title">
                  <h3 class="box-title with-border">{{col.name}}</h3>
                </div>
                <div class="form_box_group_title" v-if="!col.title&&col.type!='threeTextInput'&&col.type!='hiddenColmun'&&col.type!='file'&&col.type!='texts'&&col.type!='requestText'&&col.type!='requestCheckbox'&&col.type!='checkbox'">
                  <label class="control-label">{{col.name}}</label>
                </div>
                <div class="form_box_group_field" v-if="!col.title && !col.type">
                  <input type="text" v-bind:maxlength="col.maxlength" class="form-control" v-bind:id="col.column" v-bind:placeholder="col.placeholder || col.name" v-model="item[col.column]" v-bind:disabled="col.disabled">
                  <span v-if="col.text">{{col.text}}</span>
                </div>
                <div class="form_box_group_field" v-if="col.type=='select'">
                  <select class="form-control max_width_390" v-bind:id="col.column" v-model="item[col.column]" v-bind:disabled="col.disabled">
                    <option v-bind:value="opt.value" v-for="opt in col.options">{{opt.name}}</option>
                  </select>
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
        api: '/companies/' + localStorage.getItem('company_id') + '/operation-categories',
        fullpage: true,
        loading: true,
        isButtonDisabled: false,
        error: '',
        param: {
          title: 'ビル別業務グループ',
          operation: 'マスタ情報',
          idLabel: 'ビル別業務グループ',
          columns: [
            { name: '契約会社ID', column: 'companyId', type: 'hiddenColmun'},
            { name: 'ビル', column: 'buildingId', required: true, type: 'select', options: []},
            { name: '業務種別', column: 'operationTypeId', required: true, type: 'select', options: []},
          ],
          init_val: {
            companyId: parseInt(localStorage.getItem('company_id')),
          },
          cb: this.updateView,
          icon: 'fa-user',
          success: '/company_operation_categories',
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
       * ビル情報取得(契約会社IDで絞る).
       */
      getBuildings() {
        var api_url = '/buildings'
        var where = {'and':[{'companyId': parseInt(localStorage.getItem('company_id'))}]};
        this.onSearch(api_url, null, where, res => {
          const list = [{ name: '', display: '', value: '' }];
          res.forEach(function(obj) {
            list.push({ name: obj.name, display: obj.name, value: obj.id});
          });
          this.param.columns[1].options = list;
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
          this.param.columns[2].options = list;
        });
      },

      /**
       * 登録ボタン押下時処理.
       */
      onAddButton() {
        this.error = ''
        this.addRequest()
      },
      addRequest() {
        var send_data = this.getPostData();
        this.req(this.api, 'post', send_data, (err, res) => {
          if (err) {
            this.error = this.getErrorMsg2(res, this.param.columns)
            return;
          } else if (res.body) {
            this.$router.push("/company_operation_categories/");
          }
        });
      },
      getPostData() {
        const find = this.param.columns[2].options.find(op =>(op.value === this.item.operationTypeId));
        console.log("are:"+JSON.stringify(find));
        return {
          buildingId: this.item.buildingId,
          operationTypeId: this.item.operationTypeId,
          name: find.name,
          reportName: find.name
        }
      },
    },
    created() {
      const key = "Master:OperationCategory:create";
      this.checkDisplayPermission(key, () => {
        this.getBuildings();
        this.getOperationTypes();
      });
    },
  }

</script>

<style lang="stylus" scoped>

</style>
