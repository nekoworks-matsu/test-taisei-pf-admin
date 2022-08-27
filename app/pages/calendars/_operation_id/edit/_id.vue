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
            <li>{{param.operation}}</li>
            <li>{{param.title}}情報</li>
            <li class="current">{{param.title}}編集画面</li>
          </ol>
        </div>
        <h1 class="ts_content_heading">{{param.title}}編集画面</h1>
      </div>
    </section>
    <!-- <section class="content-header">
      <h1>
        {{this.param.title}}編集
        <small></small>
        <div class="pull-right">
          <button type="button" class="btn btn-default width_140" @click="onTransitionButton('/calendars/' + $route.params.operation_id+ '/details/' + item.id)">キャンセル</button>
        </div>
      </h1>
    </section> -->
    <!-- Main content -->
    <section class="content">
      <div class="box-group">
        <div class="box">
          <!-- <div class="box-header with-border">
            <h3 class="box-title with-border">{{this.param.title}}情報</h3>
          </div> -->
          <!-- /.box-header -->
          <div class="box-body no-paddin">
            <form class="form-horizontal">
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
                    <label class="control-label">開始日時</label>
                  </div>
                  <div class="display_flex">
                    <div class="col-sm-2 max_width_200 min_width_185" style="padding-left: 0px;">
                      <vuejs-datepicker v-bind:disabled="!(this.checkMenuPermission('Security:Schedule:update') || this.checkMenuPermission('Cleaning:Schedule:update'))" class="form-control date_picker_small" :clear-button="(role!='owner')" :format="DatePickerFormat" :language="language" name="datepicker" v-model="item.startdate"  placeholder="YYYY/MM/DD">
                      </vuejs-datepicker>
                    </div>
                    <div class="col-sm-4 date_time" style="width:220px">
                      <select v-bind:disabled="!(this.checkMenuPermission('Security:Schedule:update') || this.checkMenuPermission('Cleaning:Schedule:update'))" class="form-control input_hours_mm" style="width:65px" v-model="item.starthh">
                        <option v-bind:value="n-1" v-for="n in 24">{{timeConverter(n-1)}}</option>
                      </select> 
                      <span class="margin_2">時</span>
                      <select v-bind:disabled="!(this.checkMenuPermission('Security:Schedule:update') || this.checkMenuPermission('Cleaning:Schedule:update'))" class="form-control input_hours_mm" style="width:65px" v-model="item.startmm">
                        <option v-bind:value="n-1" v-for="n in 60">{{timeConverter(n-1)}}</option>
                      </select>
                      <span class="margin_2">分</span>
                    </div>
                  </div>
                </div>
              
                <div class="form-group form_box_group required">
                  <div class="form_box_group_title">
                    <label class="control-label">終了日時</label>
                  </div>
                  <div class="display_flex">
                    <div class="col-sm-2 max_width_200 min_width_185" style="padding-left: 0px;">
                      <vuejs-datepicker v-bind:disabled="!(this.checkMenuPermission('Security:Schedule:update') || this.checkMenuPermission('Cleaning:Schedule:update'))" class="form-control date_picker_small" :clear-button="(role!='owner')" :format="DatePickerFormat" :language="language" name="datepicker" v-model="item.enddate"  placeholder="YYYY/MM/DD">
                      </vuejs-datepicker>
                    </div>
                    <div class="col-sm-4 date_time" style="width:220px">
                      <select v-bind:disabled="!(this.checkMenuPermission('Security:Schedule:update') || this.checkMenuPermission('Cleaning:Schedule:update'))" class="form-control input_hours_mm" style="width:65px" v-model="item.endhh"  v-bind:id="'hh'">
                        <option v-bind:value="n-1" v-for="n in 24">{{timeConverter(n-1)}}</option>
                      </select> 
                      <span class="margin_2">時</span>
                      <select v-bind:disabled="!(this.checkMenuPermission('Security:Schedule:update') || this.checkMenuPermission('Cleaning:Schedule:update'))" class="form-control input_hours_mm" style="width:65px" v-model="item.endmm"  v-bind:id="'mm'">
                        <option v-bind:value="n-1" v-for="n in 60">{{timeConverter(n-1)}}</option>
                      </select>
                      <span class="margin_2">分</span>
                    </div>
                  </div>
                </div>

                <div class="form-group form_box_group required">
                  <div class="form_box_group_title">
                    <label class="control-label">件名</label>
                  </div>
                  <div class="form_box_group_field" v-bind:class="{'item-text':role=='owner'}">
                    <input v-if="(role!='owner')" type="text" maxlength="64" class="form-control" placeholder="件名" v-model="item.title">
                    <span v-if="!(this.checkMenuPermission('Security:Schedule:update') || this.checkMenuPermission('Cleaning:Schedule:update'))">{{item.title}}</span>
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">本文</label>
                  </div>
                  <div class="form_box_group_field flex_textarea">
                    <div class="flex_textarea_dummy" aria-hidden="true">{{item.body}}</div>
                    <textarea id="FlexTextarea" class="flex_textarea_textarea width_calc_30 form-control" v-model="item.body" maxlength="512" placeholder="※改行で複数行入力可" v-if="(role!='owner')"></textarea>
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
              <!-- /.box-body -->
              <div v-if="itemInfo" class="callout callout-success"><p>{{itemInfo}}</p></div>
              <div v-if="error" class="callout callout-danger err-info"><p>{{error}}</p></div>
              
              <!-- <div class="box-footer">
                <div class="no-padding pull-right">
                  <button type="button" class="btn btn-warning " @click="onUpdateButton" v-if="this.checkMenuPermission('Security:Schedule:update') || this.checkMenuPermission('Cleaning:Schedule:update')">更 新</button>
                </div>
                <button type="button" class="btn btn-danger" @click="onDelete(api, '/calendars/' + $route.params.operation_id)" v-if="this.checkMenuPermission('Security:Schedule:delete') || this.checkMenuPermission('Cleaning:Schedule:delete')">削 除</button>
              </div> -->

              <div class="box-footer form_button_flex flex_right border_top">
                <button type="button" class="btn btn-danger global_btn form_button_flex_item margin_right_auto" @click="onDeleteFunc()" v-if="this.checkMenuPermission('Security:Schedule:delete') || this.checkMenuPermission('Cleaning:Schedule:delete')">削除</button>
                <button type="button" class="btn btn-default global_btn form_button_flex_item" @click="onTransitionButton('/calendars/' + $route.params.operation_id+ '/details/' + item.id)">キャンセル</button>
                <button type="button" class="btn btn-warning global_btn form_button_flex_item" @click="onUpdateButton" v-if="this.checkMenuPermission('Security:Schedule:update') || this.checkMenuPermission('Cleaning:Schedule:update')">保存</button>
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
  import { event } from '~/plugins/events.js'
  export default {
    data() {
      return {
        api: '',
        tmpUpdatedAt: '',
        registerKeyApi: '',
        role: localStorage.getItem('role'),
        displayObjectIf_Empty_options: [
          { name: '表示', value: true },
          { name: '非表示', value: false }],
        error: '',
        error2: '',
        itemInfo: '',
        itemInfo2: '',
        item:{},
        fullpage: true,
        param: {
          columns: [
            { name: '件名', column: 'title' },
            { name: '本文', column: 'body' },
            { name: '開始日時', column: 'startDateTime' },
            { name: '終了日時', column: 'endDateTime' },
          ]
        },
        alert: {
          title: 'test',
        },
        language: {
          language: 'Japanese', 
          months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'], 
          monthsAbbr: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'], 
          days: ['日', '月', '火', '水', '木', '金', '土'], 
          rtl: false,
          ymd: "yyyy-MM-dd",
          yearSuffix: "年"
        },
        DatePickerFormat: "yyyy/MM/dd",
      }
    },
    components: {
      ListView,
      ModalAlertView,
      Loading
    },
    methods: {
      getDoubleDigestNumber(number) {
        if ((number == null || number == "") && number != 0){
          return number;
        } 
        return ("00" + number).slice(-2)
      },
      // NOTE:標準時間計算
      hour_utc_converter(value){
        var ret = Number(value);
        if(ret>=9){
            return String(ret-9);
        }else{
            return String(ret-9+24);
        }
      },
      // NOTE:日本時間計算
      hour_jst_converter(value){
        var ret = Number(value);
        if(ret<=14){
          return String(ret+9);
        }else{
          return String(ret+9-24);
        }
      },
      getColumData(val) {
        if (val == null || val == "") {
          return '---'
        }
        if (val.label != null) {
          return val.label;
        }
        if (val.name != null) {
          return val.name;
        }
        //return val;
        if (!isNaN(val)){
          return val; 
        }
            
        return val.replace(/\r?\n/g, '<br>');
      },
      setTitle() {
        var reportList = JSON.parse(localStorage.getItem('report_list'));
        var target = reportList.find((report) => {
          return (report.id == this.$route.params.operation_id);
        });
        this.param.title = "イベント";
        this.param.operation = target.operation_name;
      },
      onUpdateButton() {
        var startDateStr = null;
        var endDateStr = null;  
        startDateStr = this.changeDateFormat(this.item.startdate) + "T" + this.getDoubleDigestNumber(this.item.starthh) + ":" + this.getDoubleDigestNumber(this.item.startmm) + ":00.000+09:00";
        endDateStr = this.changeDateFormat(this.item.enddate) + "T" + this.getDoubleDigestNumber(this.item.endhh) + ":" + this.getDoubleDigestNumber(this.item.endmm) + ":00.000+09:00";

        const request = {
          title: this.item.title,
          body: this.item.body,
          endDateTime: endDateStr,
          startDateTime: startDateStr,
          operationCategoryId: parseInt(this.$route.params.operation_id),
        };
        if (startDateStr != "" && startDateStr != null && endDateStr != "" && endDateStr != null){
          var startDate = new Date(startDateStr);
          var endDate = new Date(endDateStr);
          if (!(isNaN(startDate))&&!(isNaN(endDate))){
            if (endDate<startDate){
              this.error = "終了日時 : 終了日時を開始日時より後の日時に設定してください。"
              return
            }
          }
        }
        this.onUpdate(
          this.api,
          request,
          (err, res) => {
            if (res && res.ok) {
              this.error = '';
              this.itemInfo = '更新完了';
              setTimeout(() => this.itemInfo = '', 3000);
              this.tmpUpdatedAt = res.body.updatedAt;
            } else if(err) {
              this.error = this.getErrorMsg2(res, this.param.columns);
              return;
            }
          }
        );
      },
      flexTextarea(el) {
        const dummy = el.querySelector('.flex_textarea_dummy');
        el.querySelector('.flex_textarea_textarea').addEventListener('input', e => {
          dummy.textContent = e.target.value + '\u200b';
        })
      },
      deleteFunc() {
        this.onDelete(this.api, '/calendars/' + this.$route.params.operation_id)
      },
      onDeleteFunc() {
        this.alert.title = '';
        this.alert.message = 'こちらのデータを削除いたします。<br>よろしいでしょうか？<br>';
        this.alert.note = '※この操作は取り消すことはできません。'
        this.alert.isConfirm = true;
        $('#modal_alert').modal('show')
      }
    },
    mounted(){
    },
    created() {
      const key = (parseInt(this.$route.params.operation_id) == 1) ? "Security:Schedule:update" : "Cleaning:Schedule:update";
      this.checkDisplayPermission(key, () => {
        this.setTitle();
        let buildingId = localStorage.getItem('buildings_id');
        this.api = "/buildings/" + buildingId + "/schedules";
        this.onRead(this.api, '', data => {
          // this.item.id = data.id;
          this.$set(this.item,'id',data.id);
          this.$set(this.item,'title',data.title);
          this.$set(this.item,'body',data.body);
          this.$set(this.item,'createdAt',data.createdAt);
          this.$set(this,'tmpUpdatedAt',data.updatedAt);
          var startDate = new Date(data.startDateTime);
          var endDate = new Date(data.endDateTime);
          this.$set(this.item,'startdate',startDate);
          this.$set(this.item,'starthh',startDate.getHours());
          this.$set(this.item,'startmm',startDate.getMinutes());
          this.$set(this.item,'enddate',endDate);
          this.$set(this.item,'endhh',endDate.getHours());
          this.$set(this.item,'endmm',endDate.getMinutes()); 
        })
      });
    },
    updated() {
      document.querySelectorAll('.flex_textarea').forEach(this.flexTextarea);
    },
  }

</script>
