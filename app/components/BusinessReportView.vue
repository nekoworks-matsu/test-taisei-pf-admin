<template>

  <div class="box-body">
    <business-report-phase-view ref='businessReportPhaseView'
      v-for="phase in accordionPhases"
      @updateOpenAccordions="updateOpenAccordions($event, isOpens)"
      @updateBusinessReportFieldsPerPhase="updateBusinessReportFieldsPerPhase"
      :title="phase.text"
      :index="phase.index"
      :isOpens="isOpens"
      :fieldDefinitions="businessReportFieldDefinitions[phase.index].definitions"
      :fields="businessReportFields[phase.index].data"
      :isAddView="isAddView"
      :isEdit="isEdit">
    </business-report-phase-view>
  </div>

</template>

<script>
  import BusinessReportPhaseView from '~/components/BusinessReportPhaseView'

  export default {
    name: 'BusinessReportView',
    props: {
      isAddView: Boolean,         // 登録画面かどうか
      isEdit: Boolean,            // 登録・編集するかどうか.
      businessReportFields: Array // フィールドデータ(そのまま子コンポーネントへ渡す).
    },
    data() {
      return {
        isOpens: [ false, false, false ],      // アコーディオン開閉を制御するための情報
        accordionPhases: [                     // アコーディオンを各フェーズ管理するための情報
          { 'index': 0, 'text': this.getBusinessReportStatus().Request.text },
          { 'index': 1, 'text': this.getBusinessReportStatus().Check.text },
          { 'index': 2, 'text': this.getBusinessReportStatus().WorkReport.text + '・' + this.getBusinessReportStatus().Complete.text },
        ],
        businessReportFieldDefinitions: [      // 各フェーズで表示する項目の定義情報
          { 'index': 0, 'definitions': [] },
          { 'index': 1, 'definitions': [] },
          { 'index': 2, 'definitions': [] },
        ],
        childParam: {
          loading: true,
          title: '',
          operation: '',
          columns: []
        },
        search: {
          item: {
            endShowAt: { value: new Date() },
            end_hh: Number(localStorage.getItem('business_start_time').slice(0, 2)),
            end_mm: Number(localStorage.getItem('business_start_time').slice(3, 5)),
            search_field: 0,
          },
        },
        // localStorageからbusinessReportGroupDefinitionを取得
        businessReportGroupDefinition: JSON.parse(localStorage.getItem('business_report_group_definitions')).filter((v) => v.id === Number(this.$route.params.report_group_id))[0],
        param: {
          limit: 5,
          offset: 0,
          order: [{
            'direction': 'DESC',
            'inputType': 2,
            'businessReportFieldDefinitionId': 0
          }],
          items: [], // 過去データのリスト
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
      }
    },
    components: {
      BusinessReportPhaseView,
    },
    methods: {

      // 定義情報

      /**
       * テキストエリアで改行した場合の高さ自動調整.
       */
      flexTextarea(el) {
        const dummy = el.querySelector('.flex_textarea_dummy');
        el.querySelector('.flex_textarea_textarea').addEventListener('input', e => {
          dummy.textContent = e.target.value + '\u200b';
        });
      },

      /**
       * 以下データを取得し表示用に整形.
       *   BusinessReportDefinition
       *   BusinessReportFieldDefinition
       **/
      getBusinessReportFieldDefinition() {

        return new Promise((resolve) => {

          var api_url = '/business-report-group-definitions/business-report-field-definitions';
          var query = `?companyId=${parseInt(localStorage.getItem('company_id'))}&buildingId=${parseInt(localStorage.getItem('buildings_id'))}&businessReportGroupDefinitionId=${this.$route.params.report_group_id}`

          this.onSearch(api_url + query, null, null, res => {

            // タイトル
            this.setTitle(res.name);
            // パンくずリスト
            this.setBreadCrumbList(res.operationTypeId);

            const promise1 = this.setBusinessReportDefinitions(res.buildingHasBusinessReports);
            const promise2 = this.getMembers(res.operationTypeId);
            const promise3 = this.getFloors();

            Promise.all([promise1, promise2, promise3]).then((lists) => {

              const businessReportDefinitions = lists[0];
              const members = lists[1];
              const floors = lists[2];

              const businessReportFieldDefinitions = res.businessReportFieldDefinitions;

              if (businessReportFieldDefinitions && 0 < businessReportFieldDefinitions.length) {
                // 定義情報

                const operationTypeId = this.businessReportGroupDefinition.operationTypeId;

                switch(operationTypeId) {
                  case 4:  // 業務種別が設備(4)の場合
                    this.setDefinitions4Equipment(businessReportFieldDefinitions, businessReportDefinitions, members, floors);
                    break;
                  default: // 上記以外
                    this.setDefinitions(businessReportFieldDefinitions, businessReportDefinitions, members, floors);
                    break;
                }

                const searchForms = businessReportFieldDefinitions.filter((fieldDefinition) => (fieldDefinition.availableForSearch));
                this.setSearchForms(searchForms);

                // 過去データの表示項目(検索結果画面と同じ処理にしています)
                const listColumns = businessReportFieldDefinitions.filter((businessReportFieldDefinition) => (businessReportFieldDefinition.displayIndex != null));
                this.setListColumns(listColumns, businessReportDefinitions, members, floors);
              }

              // sort項目でソート
              this.businessReportFieldDefinitions.forEach((obj) => {
                obj.definitions.sort((a, b) => {
                  return a.sort - b.sort;
                });
              });

              resolve();
            });
          });
        });
      },


      // ------------------------------
      // 業務種別：設備(4)以外
      // ------------------------------

      /**
       * 設備以外の定義情報.
       **/
      setDefinitions(businessReportFieldDefinitions, businessReportDefinitions, members, floors) {

        this.accordionPhases = [ { 'index': 0, 'text': '入力項目' } ]

        let idx = 1;

        let definition = {
          'sort': 0,
          'businessReportDefinitionId': null,
          'group': '',
          'columns': []
        };

        // 業務報告書種別はBusinessReportFieldDefinitionではないため、ここで作成する(必要最低限の項目のみで作成)
        definition.columns.push({
          'id': 'business_report_type',
          'type': 0,
          'required': false,
          'selectOptionDefinitions': businessReportDefinitions,
          'businessReportDefinitionId': null,
          'commonFlg': true
        });
        definition = this.setDefinition(idx++, '業務報告書種別', definition);

        // fieldIndexでソート
        businessReportFieldDefinitions.sort((a, b) => {
          return Number(a.fieldIndex) - Number(b.fieldIndex);
        });

        businessReportFieldDefinitions.forEach((businessReportFieldDefinition) => {

          // バリデーションエラー項目を表示するために必要
          // Backendからの返却時はfieldIndexで返却される
          this.childParam.columns.push({
            'name': businessReportFieldDefinition.name,
            'path': '.fields[' + businessReportFieldDefinition.fieldIndex + ']'
          });

          switch (businessReportFieldDefinition.type) {
            case 5: // プルダウン(メンバ)
            case 13: // マルチセレクト(メンバ)
              businessReportFieldDefinition.selectOptionDefinitions = members;
              definition.columns.push(businessReportFieldDefinition);
              definition = this.setDefinition(idx++, businessReportFieldDefinition.name, definition);
              break;
            case 7: // 画像
              definition.columns.push(businessReportFieldDefinition);
              definition = this.setDefinition(idx++, businessReportFieldDefinition.name, definition);
              break;
            case 9: // プルダウン(フロア)
              businessReportFieldDefinition.selectOptionDefinitions = floors;
              definition.columns.push(businessReportFieldDefinition);
              definition = this.setDefinition(idx++, businessReportFieldDefinition.name, definition);
              break;
            default:
              definition.columns.push(businessReportFieldDefinition);
              definition = this.setDefinition(idx++, businessReportFieldDefinition.name, definition);
              break;
          }
        });

        // 完了(状態)のチェックボックスをまとめて設定.
        definition.columns.push({
          'id': 'status_' + this.getBusinessReportStatus().WorkReport.value,
          'type': 20,
          'required': false,
          'name': 'work_report_status',
          'businessReportDefinitionId': null,
          'commonFlg': true
        });
        definition = this.setDefinition(idx++, this.getBusinessReportStatus().WorkReport.text + ' 完了', definition);

        definition.columns.push({
          'id': 'status_' + this.getBusinessReportStatus().Complete.value,
          'type': 20,
          'required': false,
          'name': 'complete_status',
          'businessReportDefinitionId': null,
          'commonFlg': true
        });
        definition = this.setDefinition(idx++, this.getBusinessReportStatus().Complete.text + ' 完了', definition);
      },

      /**
       * フィールド項目を生成して内部変数に追加後、リセットして返却.
       *   sort         : 表示順
       *   group        : form_box_group_title に表示するラベル文字列
       *   definition   : form_box_group_field に表示する項目（BusinessReportFieldDefinitionの情報）
       */
      setDefinition(sort, group, definition) {

        // ここで v-model 設定するための形式に整形する
        definition.columns.forEach((col) => {
          var tempValue   = '';
          var tempHours   = '';
          var tempMinutes = '';
          switch (col.type) { // 登録画面の初期設定用
            case 2: // 日付(年月日)
              tempValue   = new Date();
              tempHours   = tempValue.getHours();
              tempMinutes = tempValue.getMinutes();
              break;
            case 5: // プルダウン(メンバ)
              // ログインユーザが業務に紐づいていなければ一覧にない場合があるためコメントアウト
              // tempValue = localStorage.getItem('member_id');
              break;
            case 7: // 画像
              // 登録／更新処理で値が入っていなければスルーするようにしているため、ダミーデータを入れておく
              // 画像に関しては別タブ表示しているため、仕方なくこのようにしています
              tempValue = 'dummy';
              break;
            case 12: // テキスト(ビル)
              // ログイン時のビルを設定
              tempValue = localStorage.getItem('buildings_name');
              break;
          }
          this.businessReportFields[0].data[col.id] = {
            'id'          : '',
            'type'        : col.type,
            'value'       : tempValue,
            'selected'    : [],
            'hours'       : tempHours,
            'minutes'     : tempMinutes,
            'captionValue': '',
            'commonFlg'   : col.commonFlg
          };
        });

        // セット
        this.$set(definition, 'sort', sort);
        this.$set(definition, 'businessReportDefinitionId', (definition.columns.length == 0) ? null : definition.columns[0].businessReportDefinitionId); // 先頭のbusinessReportDefinitionIdをセット
        this.$set(definition, 'group', group);
        this.businessReportFieldDefinitions[0].definitions.push(definition);
        // リセットして返却
        return {
          'sort': 0,
          'businessReportDefinitionId': null,
          'group': '',
          'columns': []
        };
      },


      // ------------------------------
      // 業務種別：設備(4)専用
      // ------------------------------

      /**
       * 設備用の定義情報.
       *   設備のみレイアウトが異なるため独自仕様となっています.
       **/
      setDefinitions4Equipment(businessReportFieldDefinitions, businessReportDefinitions, members, floors) {

        let definition = {
          'sort': 0,
          'businessReportDefinitionId': null,
          'group': '',
          'columns': []
        };

        // 業務報告書種別はBusinessReportFieldDefinitionではないため、ここで作成する(必要最低限の項目のみで作成)
        definition.columns.push({
          'id': 'business_report_type',
          'type': 0,
          'required': false,
          'selectOptionDefinitions': businessReportDefinitions,
          'businessReportDefinitionId': null,
          'commonFlg': true
        });
        definition = this.setDefinition4Equipment(1, 0, '業務報告書種別', definition);

        // 完了(状態)のチェックボックス
        definition = this.setStatus4Equipment(definition);

        // fieldIndexでソート
        businessReportFieldDefinitions.sort((a, b) => {
          return Number(a.fieldIndex) - Number(b.fieldIndex);
        });

        businessReportFieldDefinitions.forEach((businessReportFieldDefinition) => {

          // バリデーションエラー項目を表示するために必要
          // Backendからの返却時はfieldIndexで返却される
          this.childParam.columns.push({
            'name': businessReportFieldDefinition.name,
            'path': '.fields[' + businessReportFieldDefinition.fieldIndex + ']'
          });

          // businessReportFieldDefinition.id で判別
          //   1行に複数項目を表示するものもあるため、IDで固定するしかなさそう
          switch (businessReportFieldDefinition.fieldIndex) {

            // this.businessReportFieldDefinitions[0]
            case 2: // 受付（作成）日時
              definition.columns.push(businessReportFieldDefinition);
              if (definition.columns.length == 1) {
                definition = this.setDefinition4Equipment(0, 0, '受付（作成）日時', definition);
              }
              break;
            case 3: // 受付者
              businessReportFieldDefinition.selectOptionDefinitions = members;
              definition.columns.push(businessReportFieldDefinition);
              if (definition.columns.length == 1) {
                definition = this.setDefinition4Equipment(0, 1, '受付者', definition);
              }
              break;
            case 4: // 申込テナント名
            case 5: // 申込部署名
              definition.columns.push(businessReportFieldDefinition);
              if (definition.columns.length == 2) {
                definition = this.setDefinition4Equipment(0, 2, '申込者情報', definition);
              }
              break;
            case 6: // 申込経由
            case 7: // 申込者名
            case 8: // 電話番号
              definition.columns.push(businessReportFieldDefinition);
              if (definition.columns.length == 3) {
                definition = this.setDefinition4Equipment(0, 3, '', definition);
              }
              break;
            case 9:  // フロア
            case 10: // 場所
              if (businessReportFieldDefinition.fieldIndex == 9) {
                businessReportFieldDefinition.selectOptionDefinitions = floors;
              }
              definition.columns.push(businessReportFieldDefinition);
              if (definition.columns.length == 2) {
                definition = this.setDefinition4Equipment(0, 4, '場所', definition);
              }
              break;
            case 11: // 依頼内容
              definition.columns.push(businessReportFieldDefinition);
              if (definition.columns.length == 1) {
                definition = this.setDefinition4Equipment(0, 5, '依頼内容', definition);
              }
              break;
            case 12: // 作業区分
              definition.columns.push(businessReportFieldDefinition);
              if (definition.columns.length == 1) {
                definition = this.setDefinition4Equipment(0, 6, '作業区分', definition);
              }
              break;

            // this.businessReportFieldDefinitions[1]
            case 13: // 対応開始時間
              definition.columns.push(businessReportFieldDefinition);
              if (definition.columns.length == 1) {
                definition = this.setDefinition4Equipment(1, 1, '対応開始時間', definition);
              }
              break;
            case 14: // 空調機・外調機・給排気ファン・FCU名称
              definition.columns.push(businessReportFieldDefinition);
              if (definition.columns.length == 1) {
                definition = this.setDefinition4Equipment(1, 2, '空調機・外調機・給排気ファン・FCU名称', definition);
              }
              break;
            case 15: // 設定吸気温度
            case 16: // 設定環気温度
            case 17: // 設定湿度
              definition.columns.push(businessReportFieldDefinition);
              if (definition.columns.length == 3) {
                definition = this.setDefinition4Equipment(1, 3, '設定値', definition);
              }
              break;
            case 18: // 計測給気温度
            case 19: // 計測環気温度
            case 20: // 計測湿度
              definition.columns.push(businessReportFieldDefinition);
              if (definition.columns.length == 3) {
                definition = this.setDefinition4Equipment(1, 4, '計測値', definition);
              }
              break;
            case 21: // 実測室温
            case 22: // 実測給気温度
            case 23: // 実測風速
            case 24: // 実測周波数
            case 25: // 実測電流値
              definition.columns.push(businessReportFieldDefinition);
              if (definition.columns.length == 5) {
                definition = this.setDefinition4Equipment(1, 4, '実測値', definition);
              }
              break;
            case 26: // VAV・CAV
              definition.columns.push(businessReportFieldDefinition);
              if (definition.columns.length == 1) {
                definition = this.setDefinition4Equipment(1, 6, 'VAV・CAV', definition);
              }
              break;
            case 27: // 設定温度
            case 28: // 計測湿度
            case 29: // 計測風量
              definition.columns.push(businessReportFieldDefinition);
              if (definition.columns.length == 3) {
                definition = this.setDefinition4Equipment(1, 7, '設定・計測値', definition);
              }
              break;
            case 30: // 実測室温
            case 31: // 実測給気温度
            case 32: // 実測風速
              definition.columns.push(businessReportFieldDefinition);
              if (definition.columns.length == 3) {
                definition = this.setDefinition4Equipment(1, 8, '実測値', definition);
              }
              break;
            case 33: // スケジュール機器番号
            case 34: // スケジュール該当区画
              definition.columns.push(businessReportFieldDefinition);
              if (definition.columns.length == 2) {
                definition = this.setDefinition4Equipment(1, 9, 'スケジュール', definition);
              }
              break;
            case 35: // 盤名
              definition.columns.push(businessReportFieldDefinition);
              if (definition.columns.length == 1) {
                definition = this.setDefinition4Equipment(1, 10, '盤名', definition);
              }
              break;
            case 36: // ブレーカNo
            case 37: // 回路名
              definition.columns.push(businessReportFieldDefinition);
              if (definition.columns.length == 2) {
                definition = this.setDefinition4Equipment(1, 11, 'ブレーカNo・回路名', definition);
              }
              break;
            case 38: // 原因要素
              definition.columns.push(businessReportFieldDefinition);
              if (definition.columns.length == 1) {
                definition = this.setDefinition4Equipment(1, 12, '原因要素', definition);
              }
              break;
            case 39: // 測定負荷（漏洩）電流値
            case 40: // 測定絶縁抵抗値
              definition.columns.push(businessReportFieldDefinition);
              if (definition.columns.length == 2) {
                definition = this.setDefinition4Equipment(1, 13, '測定値', definition);
              }
              break;
            case 41: // 状況（各作業報告書で項目が存在する）
            case 42:
            case 43:
            case 44:
            case 45:
            case 46:
              definition.columns.push(businessReportFieldDefinition);
              if (definition.columns.length == 1) {
                definition = this.setDefinition4Equipment(1, 14, '状況', definition);
              }
              break;
            case 47: // 画像（と画像コメント）
              definition.columns.push(businessReportFieldDefinition);
              if (definition.columns.length == 1) {
                definition = this.setDefinition4Equipment(1, 15, '画像', definition);
              }
              break;
            case 48: // 影響範囲
              definition.columns.push(businessReportFieldDefinition);
              if (definition.columns.length == 1) {
                definition = this.setDefinition4Equipment(1, 16, '影響範囲', definition);
              }
              break;
            case 49: // 処理内容（各作業報告書で項目が存在する）
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
              definition.columns.push(businessReportFieldDefinition);
              if (definition.columns.length == 1) {
                definition = this.setDefinition4Equipment(1, 17, '処理内容', definition);
              }
              break;
            //case 55: // 欠番
            //  break;

            // this.businessReportFieldDefinitions[2]
            case 56: // 作業実施（完了）日時
              definition.columns.push(businessReportFieldDefinition);
              if (definition.columns.length == 1) {
                definition = this.setDefinition4Equipment(2, 0, '作業実施（完了）日時', definition);
              }
              break;
            case 57: // 担当者
              definition.columns.push(businessReportFieldDefinition);
              if (definition.columns.length == 1) {
                definition = this.setDefinition4Equipment(2, 1, '担当者', definition);
              }
              break;
            case 58: // 処置後の状況
              definition.columns.push(businessReportFieldDefinition);
              if (definition.columns.length == 1) {
                definition = this.setDefinition4Equipment(2, 2, '処置後の状況', definition);
              }
              break;
            //case 59: // 欠番
            //  break;
            case 60: // 今後の対応
              definition.columns.push(businessReportFieldDefinition);
              if (definition.columns.length == 1) {
                definition = this.setDefinition4Equipment(2, 3, '今後の対応', definition);
              }
              break;
            case 61: // 実害の有無
              definition.columns.push(businessReportFieldDefinition);
              if (definition.columns.length == 1) {
                definition = this.setDefinition4Equipment(2, 4, '実害の有無', definition);
              }
              break;
            case 62: // 当該事案に係る当社責任の有無
              definition.columns.push(businessReportFieldDefinition);
              if (definition.columns.length == 1) {
                definition = this.setDefinition4Equipment(2, 5, '当該事案に係る当社責任の有無', definition);
              }
              break;
            case 63: // 原因
              definition.columns.push(businessReportFieldDefinition);
              if (definition.columns.length == 1) {
                definition = this.setDefinition4Equipment(2, 6, '原因', definition);
              }
              break;
            case 64: // 完了状態
              definition.columns.push(businessReportFieldDefinition);
              if (definition.columns.length == 1) {
                definition = this.setDefinition4Equipment(2, 7, '完了状態', definition);
              }
              break;
            case 65: // 備考
              definition.columns.push(businessReportFieldDefinition);
              if (definition.columns.length == 1) {
                definition = this.setDefinition4Equipment(2, 8, '備考', definition);
              }
              break;
            default:
              break;
          }
        });
      },

      /**
       * 完了(状態)のチェックボックスをまとめて設定.
       */
      setStatus4Equipment(definition) {

        // 依頼欄
        definition.columns.push({
          'id': 'status_' + this.getBusinessReportStatus().Request.value,
          'type': 20, // 内部で処理するために20に設定している
          'required': false,
          'name': 'request_status',
          'businessReportDefinitionId': null,
          'commonFlg': true
        });
        definition = this.setDefinition4Equipment(0, 7, this.getBusinessReportStatus().Request.text + ' 完了', definition);

        // 状況確認欄
        definition.columns.push({
          'id': 'status_' + this.getBusinessReportStatus().Check.value,
          'type': 20,
          'required': false,
          'name': 'check_status',
          'businessReportDefinitionId': null,
          'commonFlg': true
        });
        definition = this.setDefinition4Equipment(1, 19, this.getBusinessReportStatus().Check.text + ' 完了', definition);

        definition.columns.push({
          'id': 'status_' + this.getBusinessReportStatus().WorkRequest.value,
          'type': 20,
          'required': false,
          'name': 'work_request_status',
          'businessReportDefinitionId': null,
          'commonFlg': true
        });
        definition = this.setDefinition4Equipment(1, 20, this.getBusinessReportStatus().WorkRequest.text + ' 完了', definition);

        // 作業・完了欄
        definition.columns.push({
          'id': 'status_' + this.getBusinessReportStatus().WorkReport.value,
          'type': 20,
          'required': false,
          'name': 'work_report_status',
          'businessReportDefinitionId': null,
          'commonFlg': true
        });
        definition = this.setDefinition4Equipment(2, 9, this.getBusinessReportStatus().WorkReport.text + ' 完了', definition);

        definition.columns.push({
          'id': 'status_' + this.getBusinessReportStatus().Complete.value,
          'type': 20,
          'required': false,
          'name': 'complete_status',
          'businessReportDefinitionId': null,
          'commonFlg': true
        });
        definition = this.setDefinition4Equipment(2, 10, this.getBusinessReportStatus().Complete.text + ' 完了', definition);

        return definition;
      },

      /**
       * フィールド項目を生成して内部変数に追加後、リセットして返却.
       *   phase        : { 0:依頼, 1:状況確認, 2:作業・完了 }
       *   sort         : 表示順
       *   group        : form_box_group_title に表示するラベル文字列
       *   definition   : form_box_group_field に表示する項目（BusinessReportFieldDefinitionの情報）
       */
      setDefinition4Equipment(phase, sort, group, definition) {

        // ここで v-model 設定するための形式に整形する
        definition.columns.forEach((col) => {
          var tempValue   = '';
          var tempHours   = '';
          var tempMinutes = '';
          switch (col.type) { // 登録画面の初期設定用
            case 2: // 日付(年月日)
              tempValue   = new Date();
              tempHours   = tempValue.getHours();
              tempMinutes = tempValue.getMinutes();
              break;
            case 5: // プルダウン(メンバ)
              // ログインユーザが業務に紐づいていなければ一覧にない場合があるためコメントアウト
              // tempValue = localStorage.getItem('member_id');
              break;
            case 7: // 画像
              // 登録／更新処理で値が入っていなければスルーするようにしているため、ダミーデータを入れておく
              // 画像に関しては別タブ表示しているため、仕方なくこのようにしています
              tempValue = 'dummy';
              break;
          }
          this.businessReportFields[phase].data[col.id] = {
            'id'          : '',
            'type'        : col.type,
            'value'       : tempValue,
            'selected'    : [],
            'hours'       : tempHours,
            'minutes'     : tempMinutes,
            'captionValue': '',
            'commonFlg'   : col.commonFlg
          };
        });

        // セット
        this.$set(definition, 'sort', sort);
        this.$set(definition, 'businessReportDefinitionId', (definition.columns.length == 0) ? null : definition.columns[0].businessReportDefinitionId); // 先頭のbusinessReportDefinitionIdをセット
        this.$set(definition, 'group', group);
        this.businessReportFieldDefinitions[phase].definitions.push(definition);
        // リセットして返却
        return {
          'sort': 0,
          'businessReportDefinitionId': null,
          'group': '',
          'columns': []
        };
      },

      /**
       * 業務報告書種別.
       */
      setBusinessReportDefinitions(buildingHasBusinessReports) {
        return new Promise((resolve) => {
          const list = [{ label: '業務報告書種別を選択してください', id: '' }];
          buildingHasBusinessReports.forEach((buildingHasBusinessReport) => {
            const obj = buildingHasBusinessReport.businessReportDefinition;
            list.push({ label: obj.name, id: obj.id});
          });
          resolve(list);
        });
      },

      /**
       * メンバー情報.
       */
      getMembers(operationId) {
        return new Promise((resolve) => {
          const list = [{ label: '対象者を選択してください', id: '' }];
          var member_api = '/buildings/' + localStorage.getItem('buildings_id') + '/members';
          var where = { 'and': [{ 'operationTypeId': operationId }] };
          this.onSearch(member_api, null, where, (res) => {
            res.forEach((obj) => {
              list.push({ label: obj.name, id: obj.id });
            });
            resolve(list);
          });
        });
      },

      /**
       * フロア情報.
       */
      getFloors() {
        return new Promise((resolve) => {
          const list = [{ label: 'フロアを選択してください。', id: '' }];
          var floor_api = '/buildings/' + localStorage.getItem('buildings_id');
          this.onSearch(floor_api, null, null, (res) => {
            const floors = this.displayFloorFormat(res.floors, null, false);
            floors.forEach((obj) => {
              list.push({ label: obj.name + 'F', id: obj.id });
            });
            resolve(list);
          });
        });
      },

      /**
       * タイトル.
       */
      setTitle(name) {
        this.childParam.title = name;
      },

      /**
       * パンくずリスト.
       */
      setBreadCrumbList(operationId) {
        var report_list = JSON.parse(localStorage.getItem('report_list'));
        var find = report_list.find(val => val.operation_type_id == operationId);
        this.childParam.operation = find.operation_name;
      },

      /**
       * 過去データ検索のキーとなる検索条件項目の取得.
       */
      setSearchForms(searchForms) {
        // type=2:日付(年月日時分)の検索条件フィールド
        // reportExtractField=true のフィールドは1つしか定義されていないことが前提
        //   だが、複数存在することも想定して先頭のフィールドを保持する
        var idx = 0;
        searchForms
          .filter((form) => (form.reportExtractField))
          .forEach((searchForm) => {
            if (idx == 0) {
              var tempSearch = {
                'id': String(searchForm.id),
                'type': searchForm.type,
                'reportExtractField': searchForm.reportExtractField,
                'availableForSearch': searchForm.availableForSearch,
                'name': searchForm.name,
                'fieldIndex': searchForm.fieldIndex,
              }
              this.search.item.search_field = searchForm.id;
              this.param.order[0].businessReportFieldDefinitionId = searchForm.id;
            }
            idx++;
          });
      },

      /**
       * 定義情報から検索結果一覧の表示項目を設定.
       */
      setListColumns(listColumns, businessReportDefinitions, members, floors) {

        // 業務報告書種別はここで設定
        this.param.list.columns.push({
          'column'                 : String('business_report_type'),
          'type'                   : 0,
          'name'                   : '業務報告書種別',
          'selectOptionDefinitions': businessReportDefinitions
        });
        // ステータスはここで設定
        this.param.list.columns.push({
          'column'                 : String('status'),
          'type'                   : 0,
          'name'                   : 'ステータス',
          'selectOptionDefinitions': this.getBusinessReportStatusList()
        });

        listColumns.forEach((listColumn) => {
          var tempColumn = {
            'column': String(listColumn.id),
            'type'  : listColumn.type,
            'name'  : listColumn.name,
          }
          if (listColumn.selectOptionDefinitions) {
            tempColumn['selectOptionDefinitions'] = listColumn.selectOptionDefinitions;
          }
          switch(listColumn.type) {
            case 2:
              tempColumn['sort'] = true;
              tempColumn['fn'] = this.df;
              break;
            case 5:
              tempColumn['selectOptionDefinitions'] = members;
              break;
            case 7:
              this.param.list.isIncludeImage = true;
              break;
            case 9:
              tempColumn['selectOptionDefinitions'] = floors;
              break;
            default:
              break;
          }
          this.param.list.columns.push(tempColumn);
        });
      },


      // 過去データのための検索処理.

      /**
       * 検索.
       */
      getPastData() {

        var searchConditions = this.setOnSearchConditions();
        var apiUrl = '/business-report';

        this.onSearch(apiUrl, searchConditions, null, (searchRes) => {
          this.setItems(searchRes.businessReports);
        });

      },

      /**
       * onSearch の検索条件.
       */
      setOnSearchConditions() {
        var conditions = this.setInnerConditions();
        var results = {
          'buildingId' : localStorage.getItem('buildings_id'),
          'businessReportGroupDefinitionId': this.$route.params.report_group_id,
          'conditions' : conditions,
        };
        results['order']  = this.param.order;
        results['limit']  = this.param.limit;
        results['offset'] = this.param.offset;
        return results;
      },

      /**
       * InnerConditions含めたconditionsを設定
       *   {
       *     'conditions': [{ 'businessReportFieldDefinitionId': 0, 'inputType':2, 'innerConditions': [{}] }]
       *   }
       */
      setInnerConditions() {
        return this.getConditionTime();
      },

      /**
       * 日付範囲での検索条件.
       *   現在日から1年前のデータに絞ってます
       */
      getConditionTime() {
        var dt = new Date();
        dt.setUTCFullYear(this.search.item.endShowAt.value.getUTCFullYear() - 1);
        var start = this.getShowAtDateTime(dt, this.search.item.end_hh, this.search.item.end_mm);
        var end   = this.getShowAtDateTime(this.search.item.endShowAt.value, this.search.item.end_hh, this.search.item.end_mm);
        var conditions = [
          {
            'businessReportFieldDefinitionId': this.search.item.search_field,
            'inputType': 2,
            'innerConditions':[{
              'searchType': 4, // GT(<)
              'dateValue': this.getDateRemoveMinutes(this.df_utc(start))
            }]
          },
          {
            'businessReportFieldDefinitionId': this.search.item.search_field,
            'inputType': 2,
            'innerConditions':[{
              'searchType': 3, // LT(>)
              'dateValue': this.df_utc(end)
            }]
          }
        ];
        return conditions;
      },

      /** 
       * 日付変換(YYYY/MM/DD HH:MM)
       */
      getShowAtDateTime(showAt, hh, mm) {
        return this.convertShowAtDate(showAt) +' '+ this.convertTime(hh) + ':' + this.convertTime(mm) + ':59';
      },
      /**
       * 日付変換(YYYY/MM/DD)
       */
      convertShowAtDate(showAt) {
        if(showAt){
          return showAt.getFullYear() + "/" +  parseInt(showAt.getMonth() + 1) + "/"+ showAt.getDate();
        } 
        return "";
      },
      /**
       * 時間変換
       */
      convertTime(time) {
        if (time == "-1") return "00"
        if (String(time).length == 1) return "0" + time; 
        return time;
      },

      /**
       * 検索結果の格納.
       */
      setItems(businessReports) {
        this.param.items = [];
        const businessReportType = this.param.list.columns.filter((column) => column.column == 'business_report_type')[0];
        businessReports?.forEach((businessReport) => {
          var item = {
            'id': businessReport.id,
            'business_report_type': businessReportType?.selectOptionDefinitions?.find((v) => v.id == businessReport.businessReportDefinitionId)?.label,
            'status': this.getBusinessReportStatusList().find((v) => v.id == businessReport.status)?.label,
          };

          businessReport.businessReportFields?.forEach((businessReportField) => {
            const filters = this.param.list.columns.filter((column) => column.column == String(businessReportField.businessReportFieldDefinitionId));
            filters.forEach((filter) => { // 1件しか該当しないが0件の分岐処理が煩わしいためforEachで記載
              switch(filter.type) {
                case 1: // テキスト
                  item[filter.column] = businessReportField.textValue;
                  break;
                case 2: // 日付(年月日時分)
                  item[filter.column] = businessReportField.dateValue;
                  break;
                case 3: // テキスト(数字)
                  item[filter.column] = businessReportField.numberValue;
                  break;
                case 4: // セレクトボックス
                  item[filter.column] = filter.selectOptionDefinitions?.find((v) => v.id == businessReportField.selectOptionDefinitionId)?.label;
                  break;
                case 5: // セレクトボックス(メンバー)
                  item[filter.column] = filter.selectOptionDefinitions?.find((v) => v.id == businessReportField.memberId)?.label;
                  break;
                case 6: // テキスト(複数行)
                  item[filter.column] = businessReportField.textValue;
                  break;
                case 7: // 画像
                  item[filter.column] = businessReportField.textValue;
                  break;
                case 9: // セレクトボックス(フロア)
                  var floors = filter.businessReportFieldFloors;
                  item[filter.column] = filter.selectOptionDefinitions?.find((v) => v.id == floors[0].floorId)?.label;
                  break;
                default:
                  break;
              }
            });
          });
          this.param.items.push(item);
        });
      },


      // 詳細情報表示のためのデータ情報

      /**
       * 各フェーズで表示する項目のデータ情報の取得.
       * 
       *   Promiseを返却する.
       */
      getBusinessReportFields() {

        return new Promise((resolve) => {

          var api_url = '/business-report/' + this.$route.params.id;
          var filter, where = {}; // 条件は特になし

          this.onSearch(api_url, filter, where, res => {

            const report = res.businessReport;
            const fields = report?.businessReportFields;

            if (0 < fields.length) {
              const operationTypeId = this.businessReportGroupDefinition.operationTypeId;

              // 業務報告書種別、ステータスはここで設定する
              // 冗長な記載なってしまったが、ステータスに関しては登録されているデータから該当する画面上のチェック全てをtrueにする
              switch(operationTypeId) {
                case 4:  // 業務種別が設備(4)の場合
                  this.businessReportFields[1].data['business_report_type'].value = report.businessReportDefinitionId;

                  switch(report.status) {
                    case this.getBusinessReportStatus().Request.value:
                      this.businessReportFields[0].data['status_' + this.getBusinessReportStatus().Request.value].value = true;
                      break;
                    case this.getBusinessReportStatus().Check.value:
                      this.businessReportFields[0].data['status_' + this.getBusinessReportStatus().Request.value].value = true;
                      this.businessReportFields[1].data['status_' + this.getBusinessReportStatus().Check.value].value = true;
                      break;
                    case this.getBusinessReportStatus().WorkRequest.value:
                      this.businessReportFields[0].data['status_' + this.getBusinessReportStatus().Request.value].value = true;
                      this.businessReportFields[1].data['status_' + this.getBusinessReportStatus().Check.value].value = true;
                      this.businessReportFields[1].data['status_' + this.getBusinessReportStatus().WorkRequest.value].value = true;
                      break;
                    case this.getBusinessReportStatus().WorkReport.value:
                      this.businessReportFields[0].data['status_' + this.getBusinessReportStatus().Request.value].value = true;
                      this.businessReportFields[1].data['status_' + this.getBusinessReportStatus().Check.value].value = true;
                      this.businessReportFields[1].data['status_' + this.getBusinessReportStatus().WorkRequest.value].value = true;
                      this.businessReportFields[2].data['status_' + this.getBusinessReportStatus().WorkReport.value].value = true;
                      break;
                    case this.getBusinessReportStatus().Complete.value:
                      this.businessReportFields[0].data['status_' + this.getBusinessReportStatus().Request.value].value = true;
                      this.businessReportFields[1].data['status_' + this.getBusinessReportStatus().Check.value].value = true;
                      this.businessReportFields[1].data['status_' + this.getBusinessReportStatus().WorkRequest.value].value = true;
                      this.businessReportFields[2].data['status_' + this.getBusinessReportStatus().WorkReport.value].value = true;
                      this.businessReportFields[2].data['status_' + this.getBusinessReportStatus().Complete.value].value = true;
                      break;
                  }
                  break;
                default: // 上記以外
                  this.businessReportFields[0].data['business_report_type'].value = report.businessReportDefinitionId;

                  switch(report.status) {
                    case this.getBusinessReportStatus().WorkReport.value:
                      this.businessReportFields[0].data['status_' + this.getBusinessReportStatus().WorkReport.value].value = true;
                      break;
                    case this.getBusinessReportStatus().Complete.value:
                      this.businessReportFields[0].data['status_' + this.getBusinessReportStatus().WorkReport.value].value = true;
                      this.businessReportFields[0].data['status_' + this.getBusinessReportStatus().Complete.value].value = true;
                      break;
                  }
                  break;
              }


              for (const phase in this.businessReportFieldDefinitions) {
                const definitions = this.businessReportFieldDefinitions[phase].definitions;
                definitions.forEach((definition) => {
                  definition.columns.forEach((col) => {
                    const filters = fields.filter((field) => field.businessReportFieldDefinitionId == col.id);
                    filters.forEach((filter) => { // 1件しか該当しないが0件の分岐処理が煩わしいためforEachで記載
                      switch(col.type) {
                        case 1:
                          this.businessReportFields[phase].data[col.id].id = filter.id; // ID設定
                          this.businessReportFields[phase].data[col.id].value = filter.textValue;
                          break;
                        case 2:
                          const dateTime = new Date(filter.dateValue);
                          this.businessReportFields[phase].data[col.id].id = filter.id;
                          this.businessReportFields[phase].data[col.id].value = filter.dateValue;
                          this.businessReportFields[phase].data[col.id].hours = dateTime.getHours();
                          this.businessReportFields[phase].data[col.id].minutes = dateTime.getMinutes();
                          break;
                        case 3:
                          this.businessReportFields[phase].data[col.id].id = filter.id;
                          this.businessReportFields[phase].data[col.id].value = filter.numberValue;
                          break;
                        case 4:
                          this.businessReportFields[phase].data[col.id].id = filter.id;
                          this.businessReportFields[phase].data[col.id].value = filter.selectOptionDefinitionId;
                          break;
                        case 5:
                          this.businessReportFields[phase].data[col.id].id = filter.id;
                          this.businessReportFields[phase].data[col.id].value = filter.memberId;
                          break;
                        case 6:
                          this.businessReportFields[phase].data[col.id].id = filter.id;
                          this.businessReportFields[phase].data[col.id].value = filter.textValue;
                          break;
                        case 7:
                          let tempImageValues = {
                            'id': filter.id,
                            'businessReportFieldDefinitionId': col.id,
                            'type': col.type,
                            'value': filter.textValue,
                            'captionValue': filter.captionValue,
                            'commonFlg': col.commonFlg
                          }
                          this.images.push(tempImageValues);
                          this.businessReportFields[phase].data[col.id].id = filter.id;
                          this.businessReportFields[phase].data[col.id].value = 'dummy';
                          break;
                        case 9:
                          this.businessReportFields[phase].data[col.id].id = filter.id;
                          var floors = filter.businessReportFieldFloors;
                          this.businessReportFields[phase].data[col.id].value = (floors && 0 < floors.length) ? floors[0].floorId : null;
                          break;
                        case 13:
                          this.businessReportFields[phase].data[col.id].id = filter.id;
                          this.businessReportFields[phase].data[col.id].selected.push(filter.numberValue);
                          break;
                        default:
                          break;
                      }
                    });
                  });
                });
              }
            }
          });

          resolve();
        });
      },


      // 子コンポーネントから呼び出される処理

      /**
       * アコーディオン開閉の制御情報.
       */
      updateOpenAccordions(isOpens) {
        this.isOpens = isOpens;
      },

      /**
       * 各フェーズで表示する項目のデータ情報の更新.
       */
      updateBusinessReportFieldsPerPhase(index, fields) {
        this.businessReportFields[index].data = fields;
      },

    },

    created() {
      //console.log('BusinessReportView - created');

      const promise1 = this.getBusinessReportFieldDefinition();
      promise1.then(() => {

        this.getPastData();

        if (!this.isAddView) {
          // 編集・詳細画面の場合

          const promise2 = this.getBusinessReportFields();
          promise2.then(() => {

            setTimeout(() => {
              // プレビューON/OFFと画像の設定
              const businessReportImageView = this.$refs.businessReportPhaseView[0].$parent.$parent.$refs.businessReportImageView;
              businessReportImageView.$nextTick(() => { // DOM更新後の処理
                businessReportImageView.list.forEach((obj, index) => {
                  businessReportImageView.isPreviews[index] = true;
                  businessReportImageView.imageSources[index] = '';
                  if (obj.value) {
                    businessReportImageView.setImages(index, obj.value);
                  }
                });
              });

              // アコーディンを開いた状態にする
              this.$nextTick(() => { // DOM更新後の処理
                this.$refs.businessReportPhaseView.forEach((view) => {
                  view.handleToggle();
                });
              });

              this.childParam.loading = false;
            }, 1000);
          });

        } else {
          // 登録画面の場合

          setTimeout(() => {
            // プレビューON/OFFと画像の初期設定
            const businessReportImageView = this.$refs.businessReportPhaseView[0].$parent.$parent.$refs.businessReportImageView;
            businessReportImageView.$nextTick(() => { // DOM更新後の処理
              businessReportImageView.addNew();
              businessReportImageView.list.forEach((obj, index) => {
                businessReportImageView.isPreviews[index] = false;
                businessReportImageView.imageSources[index] = '';
              });
            });

            this.childParam.loading = false;
          }, 1000);
        }
      });
    },

    mounted() {
      //console.log('BusinessReportView - mounted');

      // 親コンポーネントへ情報を渡す
      this.$emit('updateChildParam', this.childParam);
      this.$emit('updateParam', this.param);
      this.$emit('updateImageValues', this.images);
      this.$emit('updateBusinessReportFieldDefinitions', this.businessReportFieldDefinitions);
    },

    updated() {
      //console.log('BusinessReportView - updated');

      if (this.isEdit) {
        document.querySelectorAll('.flex_textarea').forEach(this.flexTextarea);
      }

      // 親コンポーネントへ情報を渡す
      this.$emit('updateBusinessReportFields', this.businessReportFields);
    },

  }
</script>
