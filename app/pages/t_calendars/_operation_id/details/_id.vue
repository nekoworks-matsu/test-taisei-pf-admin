<template>
  <!-- Content Wrapper. Contains page content -->
  <div class="left">
    <tablet-header-view ref="header" :param="param"></tablet-header-view>
    <loading
      :active.sync="loading"
      :can-cancel=false
      :is-full-page="fullpage"></loading>
    <!-- Content Header (Page header) -->
    <div class="box content ctm_subtitle margin_bottom_0 box_shadow_none" v-bind:style="{'margin-top':tabletHeight+'px'}">
    <!-- Main content -->
      <div class="box-body no-paddin">
      <form class="form-horizontal" autocomplete="off">
          <div class="box-header with-border box_head t_box_head">
            <button type="button" class="btn global_btn global_btn_border t_main_button" style="display: block !important; font-size: 16px;" @click="onTransitionButton('/t_calendars/' + $route.params.operation_id + '/edit/' + item.id)">編集</button>
          </div>
          <div class="box-body text_align_center">
            <!-- <div class="margin_bottom_20">
              <button type="button" class="btn btn-info btn-lg btn-block" @click="onTransitionButton('/t_calendars/' + $route.params.operation_id + '/edit/' + item.id)">編 集</button>
            </div> -->
            <div class="form-group t_form_box_group">
              <div class="t_form_box_group_title">
                <label>ID</label>
              </div>
              <div class="form_box_group_field">
                <div class="item-text">{{item.id}}</div>
              </div>
            </div>

             <div class="form-group t_form_box_group">
               <div class="t_form_box_group_title">
                <label>開始日時</label>
              </div>
              <div class="form_box_group_field">
                {{df2(item.startdate)}}
              </div>
            </div>
              
            <div class="form-group t_form_box_group">
              <div class="t_form_box_group_title">
                <label>終了日時</label>
              </div>
              <div class="form_box_group_field">
                {{df2(item.enddate)}}
              </div>
            </div>

            <div class="form-group t_form_box_group">
              <div class="t_form_box_group_title">
                <label>件名</label>
              </div>
              <div class="form_box_group_field">
                {{item.title}}
              </div>
            </div>

            <div class="form-group t_form_box_group">
              <div class="t_form_box_group_title">
                <label>本文</label>
              </div>
            <div class="form_box_group_field">
                <span v-html="getColumData(item.body)"></span>
              </div>
            </div>

          <div class="form-group t_form_box_group">
              <div class="t_form_box_group_title">
                <label>登録日時</label>
              </div>
              <div class="form_box_group_field">
                {{df(item.createdAt)}}
              </div>
          </div>
            <div class="form-group t_form_box_group">
              <div class="t_form_box_group_title">
                <label>更新日時</label>
              </div>
              <div class="form_box_group_field">
              {{df(this.tmpUpdatedAt)}}
              </div>
            </div>
          </div>
          <!-- /.box-body -->
          <div v-if="itemInfo" class="callout callout-success font_18"><p>{{itemInfo}}</p></div>
          <div v-if="error" class="callout callout-danger err-info font_18"><p>{{error}}</p></div>
          <div class="box-footer with-border t_box_footer">
            <button type="button" class="btn global_btn global_btn_border t_main_button" style="display: block !important; font-size: 16px;" @click="onTransitionButton('/t_calendars/' + $route.params.operation_id + '/edit/' + item.id)">編集</button>
          </div>
          <!-- <div class="box-footer">
            <button type="button" class="btn btn-default btn-lg btn-block" onclick="window.history.back()">戻る</button>
          </div> -->
          <!-- /.box-footer -->
        </form>
      </div>
      <!-- /.box-body -->
    </div>
    <!-- /.box -->
  </div>
  <!-- /.box-group -->
  <!-- /.content-wrapper -->
</template>
<script>
  import ListView from '~/components/ListView'
  import TabletHeaderView from '~/components/TabletHeaderView'
  import Loading from 'vue-loading-overlay';
  import 'vue-loading-overlay/dist/vue-loading.css';
  import { event } from '~/plugins/events.js'
  export default {
    layout: 'everyone',
    data() {
      return {
        api: '',
        tmpUpdatedAt: '',
        registerKeyApi: '',
        displayObjectIf_Empty_options: [
          { name: '表示', value: true },
          { name: '非表示', value: false }],
        error: '',
        error2: '',
        itemInfo: '',
        itemInfo2: '',
        fullpage: true,
        tabletHeight: 0,
        item:{},
        param: {
          isBackButtons: true,
          isHomeButtons: true,
          title: 'イベント詳細',
          columns: [
            { name: '件名', column: 'title' },
            { name: '本文', column: 'body' },
            { name: '開始日時', column: 'startDateTime' },
            { name: '終了日時', column: 'endDateTime' },
          ]
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
      TabletHeaderView,
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
      setTitle() {
        var reportList = JSON.parse(localStorage.getItem('report_list'));
        var target = reportList.find((report) => {
          return (report.id == this.$route.params.operation_id);
        });
        this.param.title = target.operation_name + " イベント詳細";
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
    },
    mounted(){
      this.tabletHeight = this.$refs.header.$el.clientHeight;
      document.querySelectorAll('.flex_textarea').forEach(this.flexTextarea);
    },
    created() {
      const key = (parseInt(this.$route.params.operation_id) == 1) ? "Security:Schedule:view" : "Cleaning:Schedule:view";
      this.checkDisplayPermission(key, () => {
        let buildingId = localStorage.getItem('buildings_id');
        this.api = "/buildings/" + buildingId + "/schedules";
        this.setTitle();
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
        $("body").css('background-color', '#FFF');
      });
    },
    updated() {
      document.querySelectorAll('.flex_textarea').forEach(this.flexTextarea);
    },
  }

</script>
