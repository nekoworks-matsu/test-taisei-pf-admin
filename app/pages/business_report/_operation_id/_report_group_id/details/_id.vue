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
                <li class="current">{{ fixedTitle }}詳細</li>
              </ol>
            </div>
            <h1 class="ts_content_heading">{{ fixedTitle }}詳細</h1>
          </section>
          <div class="button_header_btn pdf">
            <button type="button" class="btn btn-info global_btn" @click="tappedPdfDownload()">PDFダウンロード</button>
            <button type="button" class="btn btn-info global_btn" @click="onTransitionButton('/business_report/' + $route.params.operation_id + '/' + $route.params.report_group_id + '/edit/' + $route.params.id)">編集</button>
          </div>
        </div>
      </div>
    </section>

    <section class="content">
      <div class="box" id="pdf">
        <div class="box-body no-paddin">
          <div class="form-group form_box_group" v-if="isHeadquartersMode">
            <label class="col-sm-2 control-label padding_left_40">ビル</label>
            <div class="col-sm-10">
              {{ fixedBuildingName }}
            </div>
          </div>

          <ul class="tab" v-if="!loading">
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
                    :isAddView="false"
                    :isEdit="false"
                    :businessReportFields="businessReportFields">
                  </business-report-view>
                </div>

                <div v-if="itemInfo" class="callout callout-success"><p>{{itemInfo}}</p></div>
                <div v-if="error" class="callout callout-danger err-info"><p>{{error}}</p></div>

                <div class="box-footer form_button_flex flex_center border_top">
                  <button v-if="!loading" type="button" class="btn btn-default global_btn form_button_flex_item" @click="onTransitionButton('/business_report/' + $route.params.operation_id + '/' + $route.params.report_group_id)">戻る</button>
                </div>
              </form>
              <pdf-1 id="pdf1" :data="pdfData" :definitions="businessReportFieldDefinitions" :childParam="childParam" v-if="pdfVisible&&$route.params.report_group_id==1"></pdf-1>
            </div>

            <div class="tab-body__item tab-body__item--2">
              <business-report-image-view ref='businessReportImageView'
                @updateImageValues="updateImageValues($event, images)"
                :isAddView="false"
                :isEdit="false"
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
  import Pdf1 from '~/components/PDFs/FacilityReport/PdfComponent';
  import Loading from 'vue-loading-overlay';
    // Import stylesheet
  import 'vue-loading-overlay/dist/vue-loading.css';
  import { jsPDF } from 'jspdf'
  import * as html2canvas from 'html2canvas'


  export default {
    data() {
      return {
        api: '/business-report/' + this.$route.params.id,
        fullpage: true,
        isButtonDisabled: false,
        isHeadquartersMode: this.toBoolean(localStorage.getItem('is_headquarters_mode')),
        loading: false,
        pdfVisible:true,
        pdfData: {},
        error: '',
        childParam: {
          loading: true,
          title: '',
          operation: '',
          buildingId: null,
          buildingName: '',
          columns: [], // POSTパラメータでエラー表示するために必要(子コンポーネントから取得)
        },
        param: {
          limit: 5,
          offset: 0,
          order: [],
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
        businessReportFields: [              // 各フェーズで表示する項目のデータ情報
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
      Pdf1
    },
    computed: {
      fixedLoading() {
        if (this.loading) {
          return this.loading
        } else {
          return this.childParam.loading;
        }
      },
      fixedTitle() {
        return this.childParam.title;
      },
      fixedOperation() {
        return this.childParam.operation;
      },
      fixedBuildingName() {
        return this.childParam.buildingName;
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


      // ↓↓ PDFダウンロードに関する処理

      /**
       * PDFダウンロード処理.
       */
      tappedPdfDownload(){
        this.pdfVisible = true;
        this.loading = true;
        setTimeout(() => {
          this.generatePdf();
        }, 100)
      },
      generatePdf(){
        const self = this;
        const source = (this.$route.params.report_group_id == 1) ? document.getElementById('pdf1'):document.getElementById('pdf');
        let height = source.offsetHeight-100;
        let width = 900;//source.offsetWidth;
        console.log("width:"+width);
        console.log("height:"+height);
        html2canvas(source,{
          width: width,
          height: height,
          scale : 2,
          scrollX: 0,
          scrollY: -window.scrollY,
        }).then(capture => {
          const imgData = capture.toDataURL('image/png');
          const doc = new jsPDF({
            unit: "px",
            format: [width,height],
            compress: true
          });
          doc.addImage(imgData, 'PNG', 0, 10, width*0.95, height*0.95);
          doc.save("報告書.pdf");
          self.loading = false;
          // self.pdfVisible = false;
        });
      },

      // ↑↑ PDFダウンロードに関する処理


      // ↓↓ タブ切り替えに関する処理

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

      // ↑↑ タブ切り替えに関する処理


      // ↓↓ 子コンポーネントから呼び出される処理

      /**
       * タイトル, パンくずリスト, カラム情報(filedsのみ), loading状態の更新.
       */
      updateChildParam(childParam) {
        // console.log("child:"+JSON.stringify(childParam));
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
      updateBusinessReportFieldDefinitions(fieldDefinitions) {
        // console.log("定義:"+JSON.stringify(fieldDefinitions));
        this.businessReportFieldDefinitions = fieldDefinitions;
      },

      /**
       * 各フェーズで表示する項目のデータ情報の更新.
       */
      updateBusinessReportFields(fields) {
        // console.log("フィールド:"+JSON.stringify(fields));
        if (fields.length > 0) {
          this.pdfData = fields[0].data;
        }

        this.businessReportFields = fields;
      }

      // ↑↑ 子コンポーネントから呼び出される処理

    },

    created() {
      // console.log('DetailView - created');
      // console.log('this.businessReportFieldDefinitions');
      // console.dir(this.businessReportFieldDefinitions);
      // console.log('this.businessReportFields');
      // console.dir(this.businessReportFields);

      const key = 'Equipment:BusinessReport:view';
      this.checkDisplayPermission(key, () => {
        //this.loading = false;
      });
    },

    mounted() {
      // console.log('DetailView - mounted');
      // console.log('this.businessReportFieldDefinitions');
      // console.dir(this.businessReportFieldDefinitions);
      // console.log('this.businessReportFields');
      // console.dir(this.businessReportFields);
    },

    updated() {
      // console.log('DetailView - updated');
      // console.log('this.businessReportFieldDefinitions');
      // console.dir(this.businessReportFieldDefinitions);
      // console.log('this.businessReportFields');
      // console.dir(this.businessReportFields);
    },

    watch: {
    }
  }

</script>
