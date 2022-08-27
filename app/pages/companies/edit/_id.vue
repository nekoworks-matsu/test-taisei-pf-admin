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
          <!-- <div class="button_header_btn">
            <button type="button" class="btn btn-info global_btn" @click="onTransitionButton('/attendance/' + $route.params.operation_id + '/edit/' + item.id)">編集</button>
          </div> -->
        </div>
      </div>
    </section>
    <!-- <section class="content-header">
      <h1>
        {{param.title}}編集
        <small></small>
        <div class="pull-right">
          <button type="button" class="btn btn-default width_140" @click="onTransitionButton('/companies/details/' + item.id)">キャンセル</button>
        </div>
      </h1>
    </section> -->

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
                    <label class="control-label">契約会社ID</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">
                      {{item.id}}
                    </div>
                  </div>
                </div>

                <div class="form-group form_box_group required">
                  <div class="form_box_group_title">
                    <label class="control-label">契約会社名</label>
                  </div>
                  <div class="form_box_group_field">
                    <input type="text" maxlength="64" class="form-control" placeholder="契約会社名" v-model="item.name">
                  </div>
                </div>

                <div class="form-group form_box_group required">
                  <div class="form_box_group_title">
                    <label class="control-label">郵便番号</label>
                  </div>
                  <div class="form_box_group_field">
                    <input type="text" maxlength="8" class="form-control" placeholder="郵便番号" v-model="item.zipcode">
                  </div>
                </div>

                <div class="form-group form_box_group required">
                  <div class="form_box_group_title">
                    <label class="control-label">都道府県</label>
                  </div>
                  <div class="form_box_group_field">
                    <select class="form-control" v-model="item.prefectureId">
                      <option v-bind:value="opt.value" v-for="opt in prefectures" >{{opt.name}}</option>
                    </select>
                  </div>
                </div>

                <div class="form-group form_box_group required">
                  <div class="form_box_group_title">
                    <label class="control-label">市区</label>
                  </div>
                  <div class="form_box_group_field">
                    <input type="text" maxlength="64" class="form-control" placeholder="市区" v-model="item.city">
                  </div>
                </div>

                <div class="form-group form_box_group required">
                  <div class="form_box_group_title">
                    <label class="control-label">所在地</label>
                  </div>
                  <div class="form_box_group_field">
                    <input type="text" maxlength="256" class="form-control"  placeholder="所在地" v-model="item.address">
                  </div>
                </div>

                <div class="form-group form_box_group required">
                  <div class="form_box_group_title">
                    <label class="control-label">電話番号</label>
                  </div>
                  <div class="form_box_group_field">
                    <input type="text" maxlength="12" class="form-control"  placeholder="電話番号(半角数字)" v-model="item.tel">
                  </div>
                </div>

                <div class="form-group form_box_group required">
                  <div class="form_box_group_title">
                    <label class="control-label">担当者名</label>
                  </div>
                  <div class="form_box_group_field">
                    <input type="text" maxlength="32" class="form-control"  placeholder="担当者名" v-model="item.officerName">
                  </div>
                </div>

                <div class="form-group form_box_group required">
                  <div class="form_box_group_title">
                    <label class="control-label">担当者メールアドレス</label>
                  </div>
                  <div class="form_box_group_field">
                    <input type="text" maxlength="256" class="form-control"  placeholder="担当者メールアドレス" v-model="item.officerEmail">
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label" for="activated">利用設定</label>
                  </div>   
                  <div class="form_box_group_field">
                    <div class="item-text">
                      <label class="control control_checkbox">
                        <input type="checkbox" id="activated" name="activated" v-model="item.activated">
                        <div class="control_indicator"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label" for="activated">備考</label>
                  </div>   
                  <div class="form_box_group_field flex_textarea">
                    <div class="flex_textarea_dummy" aria-hidden="true">{{item.note}}</div>
                    <textarea id="FlexTextarea" class="flex_textarea_textarea form-control" v-model="item.note" maxlength="512" placeholder="備考(改行で複数行入力可)"></textarea>
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label" for="activated">登録日時</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">
                      {{df(item.createdAt)}}
                    </div>
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label" for="activated">更新日時</label>
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
              <div class="box-footer form_button_flex flex_right border_top">
                <button type="button" class="btn btn-danger global_btn form_button_flex_item margin_right_auto" @click="onDeleteFunc()">削除</button>
                <button type="button" class="btn btn-default global_btn form_button_flex_item" @click="onTransitionButton('/companies/details/' + item.id)">キャンセル</button>
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
  import ModalAlertView from '~/components/ModalAlertView'
  import Loading from 'vue-loading-overlay';
  import 'vue-loading-overlay/dist/vue-loading.css';

  export default {
    data() {
      return {
        api: '/companies',
        error: '',
        fullpage: true,
        prefectures: [
          { name: '北海道', value: 1 },
          { name: '青森県', value: 2 },
          { name: '岩手県', value: 3 },
          { name: '宮城県', value: 4 },
          { name: '秋田県', value: 5 },
          { name: '山形県', value: 6 },
          { name: '福島県', value: 7 },
          { name: '茨城県', value: 8 },
          { name: '栃木県', value: 9 },
          { name: '群馬県', value: 10 },
          { name: '埼玉県', value: 11 },
          { name: '千葉県', value: 12 },
          { name: '東京都', value: 13 },
          { name: '神奈川県', value: 14 },
          { name: '新潟県', value: 15 },
          { name: '富山県', value: 16 },
          { name: '石川県', value: 17 },
          { name: '福井県', value: 18 },
          { name: '山梨県', value: 19 },
          { name: '長野県', value: 20 },
          { name: '岐阜県', value: 21 },
          { name: '静岡県', value: 22 },
          { name: '愛知県', value: 23 },
          { name: '三重県', value: 24 },
          { name: '滋賀県', value: 25 },
          { name: '京都府', value: 26 },
          { name: '大阪府', value: 27 },
          { name: '兵庫県', value: 28 },
          { name: '奈良県', value: 29 },
          { name: '和歌山県', value: 30 },
          { name: '鳥取県', value: 31 },
          { name: '島根県', value: 32 },
          { name: '岡山県', value: 33 },
          { name: '広島県', value: 34 },
          { name: '山口県', value: 35 },
          { name: '徳島県', value: 36 },
          { name: '香川県', value: 37 },
          { name: '愛媛県', value: 38 },
          { name: '高知県', value: 39 },
          { name: '福岡県', value: 40 },
          { name: '佐賀県', value: 41 },
          { name: '長崎県', value: 42 },
          { name: '熊本県', value: 43 },
          { name: '大分県', value: 44 },
          { name: '宮崎県', value: 45 },
          { name: '鹿児島県', value: 46 },
          { name: '沖縄県', value: 47 },
        ],
        alert: {
          title: 'test',
        },
        param: {
          title: "契約会社",
          columns: [
            { name: '契約会社名', column: 'name' },
            { name: '郵便番号', column: 'zipcode'},
            { name: '都道府県', column: 'prefectureId'},
            { name: '市区', column: 'city'},
            { name: '所在地', column: 'address' },
            { name: '電話番号', column: 'tel' },
            { name: '担当者名', column: 'officerName' },
            { name: '担当者メールアドレス', column: 'officerEmail' },
            { name: '利用設定', column: 'activated' },
            { name: '備考', column: 'note'},
          ]
        },
        tmpUpdatedAt: "",
        error: "",
        itemInfo: "",
        item: {
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
      getCompaniesRequest() {
        this.onRead(this.api, "", data => {
          this.item = data;
          this.tmpUpdatedAt = data.updatedAt;
        });
      },
      getRequestData() {
        var activate = this.item.activated ? true : false;
        return {
          name: this.item.name,
          zipcode: this.item.zipcode,
          prefectureId: this.item.prefectureId,
          city: this.item.city,
          address: this.item.address,
          tel: this.item.tel,
          officerName: this.item.officerName,
          officerEmail: this.item.officerEmail,
          activated: activate,
          note: this.item.note,
        }
      },
      onUpdateButton() {
        var request = this.getRequestData();
        this.req("/companies/" + parseInt(this.$route.params.id), 'patch', request, (err, res) => {;
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
            this.tmpUpdatedAt = res.body.updatedAt;
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
      deleteFunc() {
        this.onDelete(this.api, '/companies');
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
      this.getCompaniesRequest();
    }
  }

</script>
