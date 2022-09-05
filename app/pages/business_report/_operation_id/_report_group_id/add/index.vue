<template>
  <div class="content-wrapper ts_content_wrapper">
    <loading
    :active.sync="fixedLoading"
    :can-cancel=false
    :on-cancel="onCancel"
    :is-full-page="fullpage"></loading>

    <section class="content_head">
      <div class="ts_content_head">
        <div class="button_header">
          <section>
            <div class="ts_breadcrumb">
              <ol>
                <li>{{ fixedOperation }}</li>
                <li>{{ fixedTitle }}一覧</li>
                <li class="current">{{ param.title }}登録</li>
              </ol>
            </div>
            <h1 class="ts_content_heading">{{ fixedTitle }}登録</h1>
          </section>
        </div>
      </div>
    </section>

    <section class="content">
      <div class="box">
        <div class="box-body no-paddin">

          <ul class="tab">
            <li @click="changeTab($event)" class="tab__item on"><span class="tab__link on" data-tab-body="1">{{ fixedTitle }}情報</span></li>
            <li @click="changeTab($event)" class="tab__item"><span class="tab__link" data-tab-body="2">画像</span></li>
            <li @click="changeTab($event)" class="tab__item"><span class="tab__link" data-tab-body="3">過去データ</span></li>
            <li @click="changeTab($event)" class="tab__item"><span class="tab__link" data-tab-body="4">PDF</span></li>
            <li @click="changeTab($event)" class="tab__item"><span class="tab__link" data-tab-body="5">動画</span></li>
          </ul>

          <div class="tab-body">
            <div class="tab-body__item tab-body__item--1 on">
              <form class="form-horizontal" name="report_form">
                <div class="box-body">
                  <business-report-view ref='businessReportView'
                    @updateChildParam="updateChildParam($event, childParam)"
                    @updateParam="updateParam($event, param)"
                    @updateImageValues="updateImageValues($event, images)"
                    @updateBusinessReportFieldDefinitions="updateBusinessReportFieldDefinitions($event, businessReportFieldDefinitions)"
                    @updateBusinessReportFields="updateBusinessReportFields($event, businessReportFields)"
                    :isAddView="true"
                    :isEdit="true"
                    :businessReportFields="businessReportFields">
                  </business-report-view>
                </div>

                <div v-if="error" class="callout callout-danger err-info"><p>{{error}}</p></div>

                <div class="box-footer form_button_flex flex_right border_top">
                  <button type="button" class="btn btn-default global_btn form_button_flex_item" onclick="window.history.back()" v-bind:disabled="this.isButtonDisabled" >キャンセル</button>
                  <button type="button" class="btn btn-warning global_btn form_button_flex_item" @click="onAddButton" v-bind:disabled="this.isButtonDisabled">登 録</button>
                </div>
              </form>
            </div>

            <div class="tab-body__item tab-body__item--2">
              <business-report-image-view ref='businessReportImageView'
                @updateImageValues="updateImageValues($event, images)"
                :isAddView="true"
                :isEdit="true"
                :list="images">
              </business-report-image-view>
            </div>

            <div class="tab-body__item tab-body__item--3">
              <list-view-2 @onImgClick="onImgClick" :list="param.items" :param="param.list" :limit="param.limit" :offset="param.offset"></list-view-2>
            </div>

            <div class="tab-body__item tab-body__item--4">
              
            </div>

            <div class="tab-body__item tab-body__item--5">
              
            </div>
          </div>

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
  import BusinessReportView from '~/components/BusinessReportView'
  import BusinessReportImageView from '~/components/BusinessReportImageView'
  import ModalAlertView from '~/components/ModalAlertView'
  import ListView2 from '~/components/ListView2';
  import moment from 'moment';
  import Loading from 'vue-loading-overlay';
    // Import stylesheet
  import 'vue-loading-overlay/dist/vue-loading.css';

  export default {
    data() {
      return {
        api: '/business-report/',
        fullpage: true,
        isButtonDisabled: false,
        error: '',
        childParam: {
          loading: true,
          title: '',
          operation: '',
          columns: [], // POSTパラメータでエラー表示するために必要(子コンポーネントから取得)
        },
        param: {
          limit: 5,
          offset: 0,
          items: [], // 過去データのリスト(現在日から1年前のデータ)
          list: {
            isIncludeImage: false,
            title: '',
            columns: [], // 過去データで表示する項目
            init_val: {
              connect_type: 0
            },
            items: [],
            icon: 'fa-dot-circle-o',
          },
          cb: this.updateView,
          icon: 'fa-user',
          success: '/business_report/' + this.$route.params.operation_id + '/' + this.$route.params.report_group_id,
        },
        images: [], // 画像は別タブで表示するため切り出し
        businessReportFieldDefinitions: [    // 各フェーズで表示する項目の定義情報
          { 'index': 0, 'definitions': [] },
          { 'index': 1, 'definitions': [] },
          { 'index': 2, 'definitions': [] },
        ],
        businessReportFields: [              // 各フェーズで表示する項目のデータ情報(登録画面では空配列を渡して子コンポーネントで必要な形式に整形する)
          { 'index': 0, 'data': {} },
          { 'index': 1, 'data': {} },
          { 'index': 2, 'data': {} },
        ],
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
      BusinessReportView,
      BusinessReportImageView,
      ModalAlertView,
      Loading,
      ListView2,
    },
    computed: {
      fixedLoading() {
        return this.childParam.loading;
      },
      fixedTitle() {
        return this.childParam.title;
      },
      fixedOperation() {
        return this.childParam.operation;
      }
    },
    methods: {

      updateView(val) {},
      onCancel() {},
      onImgClick() {
        var images = document.getElementById("img_source");
        var imgSrc = images.src;
        this.$refs.child.showImage(imgSrc);
      },

      /**
       * タブ切り替え処理.
       */
      changeTab(e) {
        var tabItems = document.getElementsByClassName('tab__item');
        var tabLinks = document.getElementsByClassName('tab__link');
        var tabBodyItems = document.getElementsByClassName('tab-body__item');

        for (var i = 0; i < tabItems.length; i++) {
          tabItems[i].classList.remove('on');
        }
        e.currentTarget.classList.add('on');

        for (var i = 0; i < tabLinks.length; i++) {
          tabLinks[i].classList.remove('on');
        }
        e.target.classList.add('on');

        for (var i = 0; i < tabBodyItems.length; i++) {
          tabBodyItems[i].classList.remove('on');
        }
        document.getElementsByClassName('tab-body__item--' + e.target.dataset.tabBody)[0].classList.add('on');
      },


      // 登録処理関連

      /**
       * 登録ボタン押下時イベントハンドラ.
       */
      onAddButton() {
        this.error = ''
        this.addRequest();
      },

      /**
       * 登録ボタン押下時処理（本処理）.
       */
      addRequest() {
        console.log('this.businessReportFields');
        console.dir(this.businessReportFields);
        //console.log('this.images');
        //console.dir(this.images);
        var send_data = this.getPostData();
        console.log('send_data');
        console.dir(send_data);

        if (send_data) {
          this.req(this.api, 'post', send_data, (err, res) => {
            if (err) {
              // console.dir(err);
              // console.dir(res);
              this.error = this.getBusinessReportErrorMsg(res, this.childParam.columns)
              return;
            } else if (res.body) {
              this.$router.push('/business_report/' + this.$route.params.operation_id + '/' + this.$route.params.report_group_id);
            }
          });
        }
      },

      /**
       * POSTデータ整形.
       */
      getPostData() {
        var selectedBusinessReportDefinitionId = '';
        var tempFields = [];
        var tempStatusObj = {};

        for (const phase in this.businessReportFields) {
          const fields = this.businessReportFields[phase].data;
          for (const id in fields) {

            const field = fields[id];

            if (id == 'business_report_type') {
              selectedBusinessReportDefinitionId = field.value;
              continue;
            }
            if (String(id).indexOf('status_') !== -1) {
              // 各ステータスを一時的に保持して、後続でチェック処理後、最終ステータスを決める
              const statusId = String(id).substr(7);
              tempStatusObj[statusId] = field.value;
              continue;
            }
            if (String(id).indexOf('status_') === -1 && (!field.value && field.selected.length == 0)) {
              // ステータス以外で値がない場合はスキップ
              // ステータスはチェックfalseの場合、値がないと判断してしまうため、ここでステータスは対象外としている
              continue;
            }

            switch(field.type) {
              case 1:
              case 6:
              case 12:
                tempFields.push({
                  'businessReportFieldDefinitionId': parseInt(id),
                  'commonFlg': Number(field.commonFlg),
                  'textValue': field.value
                });
                break;
              case 2:
                const hours = (field.hours.length < 2) ? '0' + field.hours : field.hours;
                const minutes = (field.minutes.length < 2) ? '0' + field.minutes : field.minutes;
                console.dir(moment(field.value).format('YYYY-MM-DDT') + hours + ':' + minutes + ':00.000Z');
                const date = this.df_utc(moment(field.value).format('YYYY-MM-DDT') + hours + ':' + minutes + ':00.000Z');
                tempFields.push({
                  'businessReportFieldDefinitionId': parseInt(id),
                  'commonFlg': Number(field.commonFlg),
                  'dateValue': date
                });
                break;
              case 3:
                tempFields.push({
                  'businessReportFieldDefinitionId': parseInt(id),
                  'commonFlg': Number(field.commonFlg),
                  'numberValue': parseInt(field.value)
                });
                break;
              case 4:
                tempFields.push({
                  'businessReportFieldDefinitionId': parseInt(id),
                  'commonFlg': Number(field.commonFlg),
                  'selectOptionDefinitionId': parseInt(field.value)
                });
                break;
              case 5:
                tempFields.push({
                  'businessReportFieldDefinitionId': parseInt(id),
                  'commonFlg': Number(field.commonFlg),
                  'memberId': parseInt(field.value)
                });
                break;
              case 7:
                for (const index in this.images) {
                  const obj = this.images[index];
                  if (obj.value) { // コメントのみの場合は登録されない(画像必須)
                    tempFields.push({
                      'businessReportFieldDefinitionId': parseInt(id),
                      'commonFlg': Number(field.commonFlg),
                      'textValue': obj.value,
                      'captionValue': obj.captionValue
                    });
                  }
                }
                break;
              case 9:
                tempFields.push({
                  'businessReportFieldDefinitionId': parseInt(id),
                  'commonFlg': Number(field.commonFlg),
                  'floors': [ parseInt(field.value) ]
                });
                break;
              case 13:
                for (const index in field.selected) {
                  const value = field.selected[index];
                  if (!value) {
                    continue;
                  }
                  tempFields.push({
                    'businessReportFieldDefinitionId': parseInt(id),
                    'commonFlg': Number(field.commonFlg),
                    'numberValue': parseInt(value)
                  });
                }
                break;
              default:
                break;
            }
          }
        }

        // ステータスのチェック
        const obj = this.checkBusinessReportStatus(tempStatusObj);
        if (!obj.check) {
          this.error = obj.status.text + 'の前のステータス(状態)が完了してません。ステータスを確認してください。'
          return null;
        }

        var results = {
          'buildingId': parseInt(localStorage.getItem('buildings_id')),
          'businessReportGroupDefinitionId': parseInt(this.$route.params.report_group_id),
          'reportedAt': new Date().toISOString(),
          'reportedBy': Number(localStorage.getItem('member_id')),
          'status': obj.status.value,
          'fields' : tempFields
        };

        // 業務報告書種別
        if (selectedBusinessReportDefinitionId) {
          results['businessReportDefinitionId'] = parseInt(selectedBusinessReportDefinitionId);
        } else {
          results['businessReportDefinitionId'] = null;
        }

        return results;
      },


      // 子コンポーネントから呼び出される処理

      /**
       * タイトル, パンくずリスト, カラム情報(filedsのみ), loading状態の更新.
       */
      updateChildParam(childParam) {
        this.childParam = childParam;
      },

      /**
       * 過去データを含むparamの更新.
       */
      updateParam(param) {
        this.param = param;
      },

      /**
       * 画像データの更新.
       */
      updateImageValues(images) {
        this.images = images;
      },

      /**
       * 各フェーズで表示する項目の定義情報の更新.
       */
      updateBusinessReportFieldDefinitions(businessReportFieldDefinitions) {
        this.businessReportFieldDefinitions = businessReportFieldDefinitions;
      },

      /**
       * 各フェーズで表示する項目のデータ情報の更新.
       */
      updateBusinessReportFields(businessReportFields) {
        this.businessReportFields = businessReportFields;
      },

    },

    created() {
      //console.log('AddView - created');
      //console.log('this.businessReportFields');
      //console.dir(this.businessReportFields);

      const key = 'Equipment:BusinessReport:create';
      this.checkDisplayPermission(key, () => {
        // loading は子コンポーネントでの取得処理が完了後に更新される
      });
    },

    mounted() {
      //console.log('AddView - mounted');
      //console.log('this.businessReportFields');
      //console.dir(this.businessReportFields);
      //console.log('this.childParam');
      //console.dir(this.childParam);
      //console.log('this.images');
      //console.dir(this.images);
    },

    updated() {
      //console.log('AddView - updated');
      //console.log('this.businessReportFields');
      //console.dir(this.businessReportFields);
      //console.log('this.childParam');
      //console.dir(this.childParam);
    },
  }

</script>
