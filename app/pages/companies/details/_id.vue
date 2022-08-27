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
            <button type="button" class="btn btn-info global_btn" @click="onTransitionButton('/companies/edit/' + item.id)">編集</button>
          </div>
        </div>
      </div>
    </section>
    <!-- <section class="content-header">
      <h1>
        {{param.title}}詳細
        <small></small>
        <div class="pull-right" v-if="isSystemApprovalMode">
          <button type="button" class="btn btn-info width_140" @click="onTransitionButton('/companies/edit/' + item.id)">編 集</button>
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

              <div class="form-group form_box_group">
                <div class="form_box_group_title">
                  <label class="control-label">契約会社名</label>
                </div>
                <div class="form_box_group_field">
                  <div class="item-text">
                    {{item.name}}
                  </div>
                </div>     
              </div>
              <div class="form-group form_box_group">
                <div class="form_box_group_title">
                  <label class="control-label">郵便番号</label>
                </div>
                <div class="form_box_group_field">
                  <div class="item-text">
                    {{item.zipcode}}
                  </div>
                </div>
              </div>

              <div class="form-group form_box_group">
                <div class="form_box_group_title">
                  <label class="control-label">都道府県</label>
                </div>
                <div class="form_box_group_field">
                  <div class="item-text">
                    {{getPrefectureName(item.prefectureId)}}
                  </div>
                </div>
              </div>

              <div class="form-group form_box_group">
                <div class="form_box_group_title">
                  <label class="control-label">市区</label>
                </div>
                <div class="form_box_group_field">
                  <div class="item-text">
                    {{item.city}}
                  </div>
                </div>
              </div>

              <div class="form-group form_box_group">
                <div class="form_box_group_title">
                  <label class="control-label">所在地</label>
                </div>
                <div class="form_box_group_field">
                  <div class="item-text">
                    {{item.address}}
                  </div>
                </div>
              </div>

              <div class="form-group form_box_group">
                <div class="form_box_group_title">
                  <label class="control-label">電話番号</label>
                </div>
                <div class="form_box_group_field">
                  <div class="item-text">
                    {{item.tel}}
                  </div>
                </div>
              </div>

              <div class="form-group form_box_group">
                <div class="form_box_group_title">
                  <label class="control-label">担当者名</label>
                </div>
                <div class="form_box_group_field">
                  <div class="item-text">
                    {{getColumData(item.officerName)}}
                  </div>
                </div>
              </div>

              <div class="form-group form_box_group">
                <div class="form_box_group_title">
                  <label class="control-label">担当者メールアドレス</label>
                </div>
                <div class="form_box_group_field">
                  <div class="item-text">
                    {{getColumData(item.officerEmail)}}
                  </div>
                </div>
              </div>

              <div class="form-group form_box_group">
                <div class="form_box_group_title">
                  <label class="control-label">利用設定</label>
                </div>
                <div class="form_box_group_field">
                  <div class="item-text">
                    <label class="control control_checkbox">
                      <input type="checkbox" name="display" v-model="item.activated" disabled>
                      <div class="control_indicator"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div class="form-group form_box_group">
                <div class="form_box_group_title">
                  <label class="control-label">備考</label>
                </div>
                <div class="form_box_group_field">
                  <div class="item-text">
                    <span v-html="getColumData(item.note)"></span>
                  </div>
                </div>
              </div>
            </div>
            <!-- /.box-body -->
            <div v-if="itemInfo" class="callout callout-success"><p>{{itemInfo}}</p></div>
            <div v-if="error" class="callout callout-danger err-info"><p>{{error}}</p></div>
            <div class="box-footer form_button_flex flex_center border_top">
              <button type="button" class="btn btn-default global_btn form_button_flex_item" @click="onTransitionButton('/companies')">戻る</button>
            </div>
              <!-- /.box-footer -->
          </form>
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

  export default {
    data() {
      return {
        api: '/companies',
        error: '',
        isSystemApprovalMode: this.toBoolean(localStorage.getItem('is_system_approval_mode')),
        fullpage: true,
        prefectures: [
          { name: '', value: ''},
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
        param: {
          title: "契約会社",
          columns: [
          ]
        },
        updatedAt: '',
        item: {},
      }
    },
    components: {
      ListView,
      Loading
    },
    methods: {
      getCompaniesRequest() {
        this.onRead(this.api, "", data => {
          this.item = data;
        });
      },
    },
    created() {
      this.getCompaniesRequest();
    },
    watch: {
      $route: function(route) {
        this.getCompaniesRequest();
      }
    }
  }

</script>
