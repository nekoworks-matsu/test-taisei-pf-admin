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
            <li>お知らせ一覧</li>
            <li>お知らせ詳細</li>
            <li class="current">お知らせ編集</li>
          </ol>
        </div>
        <h1 class="ts_content_heading">お知らせ編集</h1>
      </div>
      <!-- <h1>
        {{param.title}}編集
        <small></small>
        <div class="pull-right">
          <button type="button" class="btn btn-default width_140" @click="onTransitionButton('/notifications/details/' + item.id)">キャンセル</button>
        </div>
      </h1> -->
    </section>

    <!-- Main content -->
    <section class="content">
      <div class="box-group">
        <div class="box">
          <!-- <div class="box-header with-border">
            <h3 class="box-title with-border">{{param.title}}詳細情報</h3>
          </div> -->
          <!-- /.box-header -->
          <div class="box-body no-paddin">
            <form class="form-horizontal" autocomplete="off">
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

                <div class="form-group form_box_group required">
                  <div class="form_box_group_title">
                    <label class="control-label">更新日</label>
                  </div>
                  <div class="form_box_group_field">
                    <vuejs-datepicker class="form-control date_picker" :clear-button="true" :format="DatePickerFormat" :language="language" :value="item.updatedAtForDisplay" name="datepicker" v-model="item.updatedAtForDisplay"  placeholder="更新日時">
                    </vuejs-datepicker>
                  </div>
                </div>

                <div class="form-group form_box_group required">
                  <div class="form_box_group_title">
                    <label class="control-label">タイトル</label>
                  </div>
                  <div class="form_box_group_field">
                   <input type="text" maxlength="128" class="form-control" placeholder="タイトル" v-model="item.title"/>
                  </div>
                </div>

                <div class="form-group form_box_group required">
                  <div class="form_box_group_title">
                    <label class="control-label">カテゴリー</label>
                  </div>
                  <div class="form_box_group_field">
                   <select class="form-control max_width_390" v-model="item.category">
                      <option v-bind:value="opt.value" v-for="opt in category_id_options" >{{opt.name}}</option>
                    </select>
                  </div>
                </div>
                <div class="form-group form_box_group required">
                  <div class="form_box_group_title">
                    <label class="control-label">本文</label>
                  </div>
                  <div class="form_box_group_field flex_textarea">
                    <div class="flex_textarea_dummy" aria-hidden="true">{{item.body}}</div>
                    <textarea id="FlexTextarea" class="flex_textarea_textarea form-control" v-model="item.body" maxlength="1024" placeholder="本文(改行で複数行入力可)"></textarea>
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label" for="display">表示設定</label>
                  </div>
                  <div class="form_box_group_field flex_textarea">
                    <label class="control control_checkbox">
                      <input type="checkbox" id="display" name="display" v-model="item.display">
                      <div class="control_indicator"></div>
                    </label>
                  </div>
                </div>
                <div class="form-group form_box_group required">
                  <div class="form_box_group_title">
                    <label class="control-label">表示開始日時</label>
                  </div>
                  <div class="form_box_group_field display_flex">
                    <div class="col-sm-2 max_width_200 min_width_180" style="padding-left: 0px;">
                      <vuejs-datepicker class="form-control date_picker_small" :clear-button="true" :format="DatePickerFormat" :language="language" :value="item.displayFrom" name="datepicker" v-model="item.displayFrom"  placeholder="表示開始日時"></vuejs-datepicker>
                    </div>
                    <div class="col-sm-4 date_time" style="width: 220px;">
                      <select class="form-control input_hours_mm" v-model="item.displayFromHH" style="width:65px;display:inline;">
                        <option v-bind:value="n" v-for="n in 24">{{timeConverter(n-1)}}</option>
                      </select> 
                      <select class="form-control input_hours_mm"  v-model="item.displayFromMM" style="width:65px;display:inline;">
                        <option v-bind:value="n" v-for="n in 60">{{timeConverter(n-1)}}</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="form-group form_box_group required">
                  <div class="form_box_group_title">
                    <label class="control-label">表示終了日時</label>
                  </div>
                  <div class="form_box_group_field display_flex">
                    <div class="col-sm-2 max_width_200 min_width_180" style="padding-left: 0px;">
                      <vuejs-datepicker class="form-control date_picker_small" :clear-button="true" :format="DatePickerFormat" :language="language" :value="item.displayTo" name="datepicker" v-model="item.displayTo"  placeholder="表示終了日時"></vuejs-datepicker>
                    </div>
                    <div class="col-sm-4 date_time" style="width: 220px;">
                      <select class="form-control input_hours_mm" v-model="item.displayToHH" style="width:65px;display:inline;">
                        <option v-bind:value="n" v-for="n in 24">{{timeConverter(n-1)}}</option>
                      </select> 
                      <select class="form-control input_hours_mm"  v-model="item.displayToMM" style="width:65px;display:inline;">
                        <option v-bind:value="n" v-for="n in 60">{{timeConverter(n-1)}}</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">登録日時</label>
                  </div>
                  <div class="form_box_group_field">
                    {{df(item.createdAt)}}
                  </div>
                </div>
                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">更新日時</label>
                  </div>
                  <div class="form_box_group_field">
                    {{df(this.tmpUpdatedAt)}}
                  </div>
                </div>
              </div>
              <!-- /.box-body -->
              <div v-if="itemInfo" class="callout callout-success"><p>{{itemInfo}}</p></div>
              <div v-if="error" class="callout callout-danger err-info"><p>{{error}}</p></div>
              <div class="box-footer form_button_flex flex_right border_top">
                <button type="button" class="btn btn-danger global_btn form_button_flex_item margin_right_auto" @click="onDeleteFunc()">削除</button>
                <button type="button" class="btn btn-default global_btn form_button_flex_item" @click="onTransitionButton('/notifications/details/' + $route.params.id)">キャンセル</button>
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
      <template>
        <modal-alert-view　ref="alert" :id="'modal_alert'" :param="alert" @onconfirm="deleteFunc"></modal-alert-view>
      </template>
    </section>
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->
</template>

<script>
  import ListView from '~/components/ListView'
  import Loading from 'vue-loading-overlay';
  import ModalAlertView from '~/components/ModalAlertView'
  import 'vue-loading-overlay/dist/vue-loading.css';

  export default {
    data() {
      return {
        api: '/notifications',
        error: '',
        fullpage: true,
        alert: {
          title: 'test',
          message: '',
          note: '',
          isConfirm: false,
        },
        category_id_options: [
          { name: "更新情報", value: 1 },
          { name: "メンテナンス情報", value: 2 },
          { name: "重要情報", value: 3 },
          { name: "不具合情報", value: 4 },
        ],
        param: {
          columns: [
            { name: '更新日', column: 'updatedAtForDisplay', type: 'datePicker', required: true},
            { name: 'タイトル', column: 'title', required: true, maxlength: 128},
            { name: 'カテゴリー', column: 'category', type: 'select', required: true, options: [
                { name: "", value: null },
                { name: "更新情報", value: 1 },
                { name: "メンテナンス情報", value: 2 },
                { name: "重要情報", value: 3 },
                { name: "不具合情報", value: 4 },
              ] 
            },
            { name: '本文', column: 'body', type: 'textarea',　required: true, maxlength: 1024},
            { name: '表示設定', column: 'display', type: 'checkbox', required: true},
            { name: '表示開始日', column: 'displayFrom', type: 'datePicker', required: true},
            { name: '表示終了日', column: 'displayTo', type: 'datePicker', required: true},
          ]
        },
        tmpUpdatedAt: "",
        error: "",
        itemInfo: "",
        item: {
          updatedAtForDisplay: "",
          updatedAtForDisplayHH: "",
          updatedAtForDisplayMM: "",
          title: "",
          category: "",
          body: "",
          display: "",
          displayFrom: "",
          displayFromHH: "",
          displayFromMM: "",
          displayTo: "",
          displayToHH: "",
          displayToMM: ""
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
      ListView,
      ModalAlertView,
      Loading
    },
    methods: {
      getNotificationRequest() {
        this.onRead(this.api, "", data => {
          this.item.id = data.id;
          this.item.updatedAtForDisplay = new Date(data.updatedAtForDisplay);
          this.item.updatedAtForDisplayHH = this.item.updatedAtForDisplay.getHours() + 1;
          this.item.updatedAtForDisplayMM = this.item.updatedAtForDisplay.getMinutes() + 1;
          this.item.title = data.title;
          this.item.category = data.category;
          this.item.body = data.body;
          this.item.display = data.display;
          this.item.displayFrom = new Date(data.displayFrom);
          this.item.displayFromHH = this.item.displayFrom.getHours() + 1;
          this.item.displayFromMM = this.item.displayFrom.getMinutes() + 1;
          this.item.displayTo = new Date(data.displayTo);
          this.item.displayToHH = this.item.displayTo.getHours() + 1;
          this.item.displayToMM = this.item.displayTo.getMinutes() + 1;
          this.item.createdAt = data.createdAt;
          this.tmpUpdatedAt = data.updatedAt;
        });
      },
      getRequestData() {
        return {
          updatedAtForDisplay: this.item.updatedAtForDisplay,
          title: this.item.title,
          category: this.item.category,
          body: this.item.body,
          display: this.item.display,
          displayFrom: this.changeDateFormat(this.item.displayFrom) + "T" + this.getDoubleDigestNumber(this.item.displayFromHH - 1) + ":" + this.getDoubleDigestNumber(this.item.displayFromMM - 1) + ":00.000+09:00",
          displayTo: this.changeDateFormat(this.item.displayTo) + "T" + this.getDoubleDigestNumber(this.item.displayToHH - 1) + ":" + this.getDoubleDigestNumber(this.item.displayToMM - 1) + ":00.000+09:00",
        }
      },
      onUpdateButton() {
        var request = this.getRequestData();
        if (request.displayFrom != "" && request.displayTo != "") {
          var displayFrom = new Date(request.displayFrom);
          var displayTo = new Date(request.displayTo);
          if (displayTo < displayFrom) {
            this.error  = "表示終了日 : 表示終了日を表示開始日より後の日付に設定してください。"
            return
          }
        }
        this.req("/notifications/" + parseInt(this.$route.params.id), 'patch', request, (err, res) => {;
          if (err) {
            const errorColm = {};
            for(const key in this.param.columns){
              errorColm[this.param.columns[key].column] = this.param.columns[key].name;
            }
            this.error = this.getErrorMsg2(res, this.param.columns);
            //this.error = this.getErrorMsg(res && res.body && res.body.error, errorColm, this.param.errorCode);
          } else {
            this.error = "";
            this.itemInfo = "更新完了";
            this.getNotificationRequest();
            setTimeout(() => this.itemInfo = '', 3000);
          }
        });
      },
      getDoubleDigestNumber(number) {
        return ('00' + number).slice(-2)
      },
      getCategoryName(id) {
        var find = this.category_id_options.find(val => val.value == id);
        if (find != undefined) {
          return find.name;
        }
      },
      setTitle() {
        this.param.title = "お知らせ";
      },
      deleteFunc() {
        this.onDelete(this.api, '/notifications');
      },
      onDeleteFunc() {
        this.alert.title = '';
        this.alert.message = 'こちらのデータを削除いたします。<br>よろしいでしょうか？<br>';
        this.alert.note = '※この操作は取り消すことはできません。'
        this.alert.isConfirm = true;
        $('#modal_alert').modal('show')
      }
    },
    created() {
      this.getNotificationRequest();
      this.setTitle();
    }
  }

</script>
