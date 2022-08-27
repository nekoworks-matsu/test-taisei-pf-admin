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
                <li>{{param.operation}}</li>
                <li class="current">{{param.title}}詳細</li>
              </ol>
            </div>
            <h1 class="ts_content_heading">{{param.title}}詳細</h1>
          </section>
          <div class="button_header_btn" v-if="!isRemoveEdit">
            <button type="button" class="btn btn-info global_btn" @click="onTransitionButton('/calendars/' + $route.params.operation_id + '/edit/' + item.id)">編 集</button>
          </div>
        </div>  
      </div>
    </section>

    <!-- <section class="ts_content_head">
      <h1>
        {{param.title}}詳細
        <small></small>
        <div class="pull-right" v-if="!isRemoveEdit">
          <button type="button" class="btn btn-info width_140" @click="onTransitionButton('/calendars/' + $route.params.operation_id + '/edit/' + item.id)">編 集</button>
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
            <form class="form-horizontal form_box">
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

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">開始日時</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">
                      {{df2(item.startdate)}}
                    </div>
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">終了日時</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">
                      {{df2(item.enddate)}}
                    </div>
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">件名</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">
                      {{item.title}}
                    </div>
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">本文</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">
                      <span v-html="getColumData(item.body)"></span>
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
              <!-- /.box-body -->
              <div v-if="itemInfo" class="callout callout-success"><p>{{itemInfo}}</p></div>
              <div v-if="error" class="callout callout-danger err-info"><p>{{error}}</p></div>

              <div class="box-footer form_button_flex flex_center border_top">
                <button type="button" class="btn btn-default global_btn form_button_flex_item" @click="onTransitionButton('/calendars/' + $route.params.operation_id)">戻る</button>
              </div>
              <!-- /.box-footer -->
            </form>
            <!-- <div class="box-footer">
              <button type="button" class="btn btn-default pull-right" onclick="window.history.back()">戻る</button>
            </div> -->
          </div>
          <!-- /.box-body -->
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
  import ListView from '~/components/ListView'
  import Loading from 'vue-loading-overlay';
  import 'vue-loading-overlay/dist/vue-loading.css';
  import { event } from '~/plugins/events.js'
  export default {
    data() {
      return {
        isRemoveEdit: false,
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
        var topic = this.topicTitle;
        // if (topic == "") {
        //   topic = "イベント"
        // }
        this.topicTitle = topic + "(" +  target.operation_name + ")";
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
    },
    created() {
      const key = (parseInt(this.$route.params.operation_id) == 1) ? "Security:Schedule:view" : "Cleaning:Schedule:view";
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
      const editKey = (parseInt(this.$route.params.id ) == 1) ? "Security:Schedule:update" : "Cleaning:Schedule:update";
      this.isRemoveEdit = !this.checkMenuPermission(editKey);
    },
    updated() {
      document.querySelectorAll('.flex_textarea').forEach(this.flexTextarea);
    },
  }

</script>
