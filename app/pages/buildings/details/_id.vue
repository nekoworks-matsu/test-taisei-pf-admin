<template>
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper ts_content_wrapper">
    <loading
      :active.sync="loading"
      :can-cancel=false
      :is-full-page="fullpage"></loading>
    <!-- Content Header (Page header) -->
    <section class="content_head">
      <div class="ts_content_head" v-if="checkMenuPermission('Master:Building:update') && (isHeadquartersMode)">
        <div class="button_header">
          <section>
            <div class="ts_breadcrumb">
              <ol>
                <li>マスタ情報</li>
                <li class="current">ビル詳細</li>
              </ol>
            </div>
            <h1 class="ts_content_heading">ビル詳細</h1>
          </section>
          <div class="button_header_btn">
            <button type="button" class="btn btn-info global_btn" @click="onTransitionButton('/buildings/edit/' + item.id)">編集</button>
          </div>
        </div>  
      </div>
      <div class="ts_content_head" v-if="!(checkMenuPermission('Master:Building:update') && (isHeadquartersMode))">
        <div class="button_header">
          <section>
            <div class="ts_breadcrumb">
              <ol>
                <li>マスタ情報</li>
                <li class="current">ビル情報</li>
              </ol>
            </div>
            <h1 class="ts_content_heading">ビル情報</h1>
          </section>
          <div class="button_header_btn" v-if="!isRemoveEdit">
            <button type="button" class="btn btn-info global_btn" @click="onTransitionButton('/buildings/edit/' + item.id)">編集</button>
          </div>
        </div>  
      </div>
    </section>

    <!-- <section class="content-header">
      <h1 v-if="checkMenuPermission('Master:Building:update') && (isHeadquartersMode)">
        ビル詳細
        <small></small>
        <div class="pull-right">
          <button type="button" class="btn btn-info width_140" @click="onTransitionButton('/buildings/edit/' + item.id)">編 集</button>
        </div>
      </h1>
      <h1 v-if="!(checkMenuPermission('Master:Building:update') && (isHeadquartersMode))">
        ビル情報
        <small></small>
        <div class="pull-right" v-if="!isRemoveEdit">
          <button type="button" class="btn btn-info width_140" @click="onTransitionButton('/buildings/edit/' + item.id)">編 集</button>
        </div>
      </h1>
    </section> -->
    <!-- Main content -->
    <section class="content">
      <div class="box-group">
        <div class="box">
          <!-- <div class="box-header with-border">
            <h3 class="box-title with-border">詳細情報</h3>
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

                <div class="form-group form_box_group" v-if="isSystemApprovalMode">
                  <div class="form_box_group_title">
                    <label class="control-label">契約会社名</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">
                      {{getCompanyName(item.companyId)}}
                    </div>
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">ビル名</label>
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
                    <label class="control-label">所有者</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">
                    {{getColumData(item.owner)}}
                    </div>
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">写真</label>
                  </div>
                  <div class="form_box_group_field" v-bind:class="{padding_top_10: item.filePath!=null}">
                    <img v-if="item.filePath!=null" v-bind:src="item.filePath" v-bind:id="'img_source'" v-bind:class="{ img_thumbnail: item.filePath!='', opacity_0: item.filePath==''}" style="margin-left: 0px" data-toggle="modal" v-bind:data-target="'#modal'" @click="onImgClick">
                    <span v-else class="tem-text">---</span>
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">フロア</label>
                  </div>
                  <div class="form_box_group_field display_flex align_item_normal">
                    {{createMultiTypeInputForms('floors')}}
                    <table border="1" class="no_border width_150" style="height: 1px;">
                      <tr class="selectradio selectradio_inline" v-for="index in 8">
                        <td class="selectradio_item no_border" style="border-bottom: medium solid #ddd !important;">
                          <input type="radio" name="floors" :id="'floors' + index" style="display:none" @change="onFloorChange(index)" :checked="index==2"></input>
                          <label class="cursor_pointer" :for="'floors' + index">{{getFloorsLabel(index)}}</label>
                        </td>
                      </tr>
                    </table>
                    <div class="floor_width">
                      <template v-for="i in floors" v-if="floorCategory!=8">
                        <label class="control control_checkbox" v-bind:class="{margin_left_30:floorCategory!=1,margin_left_20:floorCategory==1}">
                          <input type="checkbox" :id="'floor_' + i" v-if="floorCategory!=1" @change="onFloorCheckbox(1 , i)" disabled>
                          <input type="checkbox" :id="'floor_B' + i" v-if="floorCategory==1" @change="onFloorCheckbox(2, i)" disabled>
                          <div class="control_indicator margin_top_0"></div>
                          <div class="item-text font_normal padding_top_20 margin_left_0 floor_label_width" :for="'floor_' + i" v-if="floorCategory!=1" style="display: block;">{{i}}F</div>
                          <div class="item-text font_normal padding_top_20 margin_left_0 floor_label_width_b" :for="'floor_B' + i" v-if="floorCategory==1">B{{i}}F</div>    
                        </label>
                      </template>
                      <template v-if="floorCategory==8">
                        <div class="display_flex" v-for="(floor, index) in item.floors" :class="[{ 'input-group': index!==0 }, { 'margin_top_8': index!==0 }]" style="margin-left: 50px; align-items: unset;" v-if="floor.type==3">
                          <label class="control control_checkbox">
                            <input type="checkbox" v-bind:id="'floors_checkbox_'+index" name="floors_checkbox" @input="onCheckboxMultiTypeInputForms(index, 'floors')" disabled v-if="checkItemPermission('Master:Building:update:floors')">
                            <div class="control_indicator margin_top_0"></div>
                          </label>
                          <div class="margin_left_30">
                            <div class="item-text" v-if="!checkItemPermission('Master:Building:update:floors')">
                              {{getFloorType(floor.type)}} {{floor.name}}
                            </div>
                          </div>
                          <div class="margin_left_20 display_flex width_max">
                            <div class="multi_select_body">
                              {{floor.name}}
                            </div>
                          </div>
                        </div>   
                      </template>
                    </div>
                  </div>
                </div>
                
                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">業務日付切替時刻</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">
                       {{getTimeValue(item.hh)}} : {{getTimeValue(item.mm)}}
                    </div>
                  </div>
                </div>


                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">報告事項無し</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">
                       {{getDisplayObjectIfEmpty(item.displayObjectIfEmpty)}}
                    </div>
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">業務カテゴリ</label>
                  </div>
                  <div class="form_box_group_field">
                    <div v-bind:class="{margin_bottom_15: (index != operations.length-1)}" v-for="(operation, index) in operations">
                      <div class="item-text padding_top_0">
                        <label class="selectes_position">{{operation.name}}　</label>
                        <button type="button" class="btn btn-default" data-toggle="modal" v-bind:data-target="'#modal_' + setOperationTemplate(operation.id)" @click="onTemplateDetail(setOperationTemplate(operation.id), operation.id)" v-if="getColumData(getTemplateName(setOperationTemplate(operation.id), index)) != '---'">詳細</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">オーナーメール送信</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">
                      {{getColumData(getReportOptions(item.approveNotificationActive))}}
                    </div>
                  </div>
                </div>
                <div class="form-group form_box_group" v-for="(operation, index) in operations">
                  <div class="form_box_group_title">
                    <label class="control-label">現場通知メール {{operation.name}}</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">
                      {{getColumData(notificationEmails[index].destination)}}
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

              <div class="box-footer form_button_flex flex_center border_top" v-if="isHeadquartersMode || isSystemApprovalMode">
                <button type="button" class="btn btn-default global_btn form_button_flex_item" @click="onTransitionButton('/buildings')">戻る</button>
              </div>
              <!-- <div class="box-footer">
                <button type="button" class="btn btn-default pull-right" onclick="window.history.back()">戻る</button>
              </div> -->
            </form>
          </div>
          <!-- /.box-body -->
        </div>
        <!-- /.box -->
      </div>
      <!-- /.box-group -->
      <template v-for="(operation, index) in operations">
        <modal-view :param="getModalViewContent(setOperationTemplate(operation.id), targetMajorItems, templateOperations)"  :title="getTemplateName(setOperationTemplate(operation.id), index)" :id="'modal_' + setOperationTemplate(operation.id)" :isNoEdit="true"></modal-view>
      </template>
      <template>
        <modal-img-view　ref="child" :id="'modal'" :title="'拡大プレビュー'"></modal-img-view>
      </template>
    </section>
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->
</template>
<script>
  import ListView from '~/components/ListView'
  import { event } from '~/plugins/events.js'
  import Loading from 'vue-loading-overlay';
  import ModalView from '~/components/ModalView'
  import ModalImgView from '~/components/ModalImgView'
  import 'vue-loading-overlay/dist/vue-loading.css';
  import moment from 'moment'
  export default {
    data() {
      return {
        api: '/buildings',
        tmpUpdatedAt: '',
        registerKeyApi: '',
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
        displayObjectIf_Empty_options: [
          { name: '表示', value: true },
          { name: '非表示', value: false }
        ],
        reportOptions: [
          { name: 'あり', value: true },
          { name: 'なし', value: false }
        ],
        companies_id_options: [],
        error: '',
        error2: '',
        itemInfo: '',
        itemInfo2: '',
        item:{},
        templates: [],
        floorTypes: [],
        selectesOptions: [],
        operations: [],
        selectesItem: [],
        notificationEmails: [],
        fullpage: true,
        targetMajorItems:[],
        templateOperations: [],
        isRemoveEdit: false,
        isHeadquartersMode: this.toBoolean(localStorage.getItem('is_headquarters_mode')),
        isSystemApprovalMode: this.toBoolean(localStorage.getItem('is_system_approval_mode')),
        placeholder: [
          "",
          "地上階(半角数字)",
          "地下階(半角数字)",
          "特殊階(文字列)"
        ],
        floors: [],
        floorCategory: 2,
        param: {
          columns: [
            { name: '契約会社名', column: 'companyId'},
            { name: 'ビル名', column: 'name' },
            { name: '郵便番号', column: 'zipcode'},
            { name: '都道府県', column: 'prefectureId'},
            { name: '市区', column: 'city'},
            { name: '所在地', column: 'address' },
            { name: '電話番号', column: 'tel' },
            { name: '所有者', column: 'owner' },
            { name: 'フロア', column: 'floors' },
            { name: '業務日付切替時刻', column: 'businessStartTime' },
            { name: '日次データ未登録時ラベル表示', column: 'displayObjectIfEmpty' },
            { name: '業務カテゴリ', column: 'operationTemplates', type: 'selectes', options1: [], options2: []},
          ]
        },
      }
    },
    components: {
      ListView,
      ModalView,
      ModalImgView,
      Loading
    },
    methods: {
      // NOTE:標準時間計算
      hour_utc_converter(value){
        var ret = Number(value);
        if (ret >= 9) {
          return String(ret - 9);
        }else{
          return String(ret - 9 + 24);
        }
      },
      // NOTE:日本時間計算
      hour_jst_converter(value){
        var ret = Number(value);
        if (ret <= 14) {
          return String(ret + 9);
        } else {
          return String(ret + 9 - 24);
        }
      },
      /**
       * リクエスト用フロアデータ
       */
      convertFloors(floors) {
        var reqFloors = [];
        for (var i = 0; i < floors.length; i++) {
          reqFloors.push({id: floors[i].id, activated: floors[i].activated, type: floors[i].type, name: floors[i].name});
        }
        return reqFloors;
      },
      /** 
       * リクエストデータ取得
       */
      getRequestData() {
        let time = document.getElementById('hh').value
        time = this.hour_utc_converter(time);
        if (time.length < 2) time = '0' + time
        if (document.getElementById('mm').value.length < 2) {
           time = time + ':0' + document.getElementById('mm').value + ':00'
        } else {
          time = time + ':' + document.getElementById('mm').value + ':00'
        }
        this.normalizationRequestData(this.item);
        return {
          name: this.item.name,
          zipcode: this.item.zipcode,
          prefectureId: this.item.prefectureId,
          city: this.item.city,
          address: this.item.address,
          owner: this.item.owner==null? "":this.item.owner,
          tel: this.item.tel,
          displayObjectIfEmpty: this.item.displayObjectIfEmpty,
          businessStartTime: time,
          operationTemplates: this.item.operationTemplates,
          floors: this.convertFloors(this.item.floors),
          approveNotificationActive: this.item.approveNotificationActive,
          approveNotificationDefinitions: this.notificationEmails
        };
      },
      onUpdateButton() {
        this.onUpdate(
          this.api,
          this.getRequestData(),
          (err, res) => {
            if (res && res.ok) {
              this.error = '';
              this.itemInfo = '更新完了';
              setTimeout(() => this.itemInfo = '', 3000);
              this.tmpUpdatedAt = res.body.buildingSetting.updatedAt;
              // NOTE: 選択中ビルが更新された時の処理
              if (res.body.buildingSetting.buildingId == localStorage.getItem('buildings_id')) {
                localStorage.setItem('buildings_name', res.body.name);
                localStorage.setItem('display_object_if_empty', res.body.buildingSetting.displayObjectIfEmpty);
                localStorage.setItem('business_start_time', moment(res.body.buildingSetting.businessStartTime, 'HH:mm:ss').add(9, 'h').format('HH:mm:ss'));
                var templateList = JSON.parse(localStorage.getItem('template_list'));
                var newList = [];
                templateList.forEach(function(template) {
                  var find = res.body.buildingOperationReports.find((operationReport) => {
                    return (operationReport.active == true) && (template.operationCategoryId == operationReport.operationReportTemplate.operationCategoryId);
                  });
                  newList.push({templateId: find.operationReportTemplateId, operationCategoryId: find.operationReportTemplate.operationCategoryId});
                });
                localStorage.setItem('template_list', JSON.stringify(newList));
                var historyTemplates = res.body.buildingOperationReports.map(function(row) {
                  return {id: row.operationReportTemplateId, operationId: row.operationReportTemplate.operationCategoryId};
                })
                var setHistoryTemplates = Array.from(new Set(historyTemplates));
                localStorage.setItem('history_templates', JSON.stringify(setHistoryTemplates));
                event.emit('login-update');
              }
            } else if(err) {
              this.error = this.getErrorMsg2(res, this.param.columns);
              return;
            }
          }
        );
      },
       /**
       * マスタデータに定義されている業務の取得
       */
      getOperationCategoryList(res) {
        var operations = [];
        for (var i = 0; i < res.body.length; i++) {
          operations.push({ id: res.body[i].id, name: res.body[i].operationName });
        }
        this.selectesNames = operations;
      },
      /**
       * selectes用リクエストデータ正規化
       */
      normalizationSelectesRequest(selectesItem, key) {
        var data = [];
        selectesItem[key].forEach(function(item) {
          data.push(item.id);
        });
        this.item[key] = data;
      },
      /**
       * selectes用リクエストデータ
       */
      createSlectesRequestData(ele, index, key) {
        // NOTE: テンプレート変更時に表示用の値を選択されたものに変更
        for (var a = 0; a < this.templates.length; a++) {
          if (this.templates[a].operationReportTemplate.operationCategoryId == index) {
            this.templates[a].operationReportTemplateId = ele.target.value;
          }
        }
        if (!Array.isArray(this.selectesItem[key])) {
          this.selectesItem[key] = [];
          this.selectesItem[key].push({"index": index, "id": parseInt(ele.target.value)});
        } else {
          var value = this.selectesItem[key];
          for (var i = 0; i < this.selectesItem[key].length; i++) {
            if (value[i].index == index) {
              this.selectesItem[key].splice(i, 1);
              break;
            }
          }
          if (ele.target.value != "") {
            this.selectesItem[key].push({"index": index, "id": parseInt(ele.target.value)});
          }
        }
        this.normalizationSelectesRequest(this.selectesItem, key);
      },
      /**
       * マスタデータに定義されている業務およびテンプレートをcolumnにセット
       */
      setOperationCategoriesRequest() {
        // this.req("/operation-categories", 'get', null, (err, res) => {
        //   this.setOperationCategoryList(res);
        //   this.setOperationReportTemplatesRequest(res);
        // });

        this.getBuildingRequest();
      },
      /**
       * 業務ごとのテンプレートリストの取得
       */
      getTemplateList(id, templates) {
        var list = [{ name: "", id: null}];
        for (var i = 0; i < templates.length; i++) {
          if (id == templates[i].operationCategoryId) {
            list.push({ id: templates[i].id, name: "ID " + templates[i].id + " : " + templates[i].name, operationCategoryId: templates[i].operationCategoryId})
          }
        }
        return list
      },
      /**
       * 業務ごとのテンプレートをセット後ビル情報を取得
       */
      setOperationReportTemplatesRequest(res) {
        var templates, list = [];
        this.req("/operation-report-templates", 'get', null, (err, response) => {
          for (var i = 0; i < res.body.length; i++) {
            this.selectesOptions.push (this.getTemplateList(res.body[i].id, response.body));
          }
          this.getBuildingRequest();
        });
      },
      /**
       * マスタデータに定義されている業務をセット
       */
      setOperationCategoryList(operationTypes, res, data) {
        var operations = [];
        for (var i = 0; i < res.length; i++) {
          const operationType = operationTypes.body.find(val => val.id == res[i].operationTypeId);
          operations.push({ id: res[i].id, name: operationType.name, reportName: res[i].reportName});
          this.notificationEmails.push({"operationCategoryId": res[i].id, "destination": ""});
        }
        this.operations = operations;
        this.getNotificationEmail(data.approveNotificationDefinitions);
      },
      /**
       * create時の設定されている業務テンプレートを取得
       */
      getOperationTemplates(data, key) {
        var list = [];
        this.selectesItem[key] = [];
        for (var i = 0; i < data.length; i++) {
          if (data[i].active) {
            list.push(data[i].operationReportTemplateId);
            this.selectesItem[key].push({"index": data[i].operationReportTemplate.operationCategoryId, "id": parseInt(data[i].operationReportTemplateId)})
          }
        }
        return list;
      },
      /**
       * 取得したテンプレートIDをセット
       */
      setOperationTemplate(operationId) {
        if (this.selectesItem.operationTemplates == undefined) return null;
        for (var i = 0; i < this.selectesItem.operationTemplates.length; i++) {
          if (this.selectesItem.operationTemplates[i].index == operationId) {
            return this.selectesItem.operationTemplates[i].id;
          }
        }
        return null;
      },
      getNotificationEmail(approveNotificationDefinitions) {
        var res = [];
        this.notificationEmails.forEach(function(value) {
          var item = approveNotificationDefinitions.find(val => val.operationCategoryId == value.operationCategoryId);
          if (item != undefined) {
            value.destination = item.destination
          }
        });
      },
      onTemplateDetail(templateId, operationId) {
        this.req("/operation-report-templates/" + templateId, 'get', null, (err, res) => {
          this.getMajorItemsRequest(res.body.operations, operationId); 
        });
       
      },
      getMajorItemsRequest(operations, operationId) {
        // this.req("/operation-categories", 'get', null, (err, res) => {
        //   var find = res.body.find(val => val.id == operationId);
        //   this.setMajorItemsInfo(find.reportObjectDefinitions, operations);
        // });
      },
      setMajorItemsInfo(reportObjectDefinitions, getOperations) {
        reportObjectDefinitions.sort(function(a,b){
          if(a.sort < b.sort) return -1;
          if(a.sort > b.sort) return 1;
          return 0;
        });
        
        var operations = [];
        var itemOperations = [];
        for (var i = 0; i < reportObjectDefinitions.length; i++) {
          var find = operations.find(val => val.reportObjectGroupDefinitionId == reportObjectDefinitions[i].reportObjectGroupDefinitionId);
          if (find == undefined) {
            operations.push({reportObjectGroupDefinitionName: reportObjectDefinitions[i].reportObjectGroupDefinition.name ,
                             reportObjectGroupDefinitionId: reportObjectDefinitions[i].reportObjectGroupDefinitionId, 
                             reportObject: [{id: reportObjectDefinitions[i].id, name: reportObjectDefinitions[i].name, sort: i}]});
          } else {
            find.reportObject.push({id: reportObjectDefinitions[i].id, name: reportObjectDefinitions[i].name, sort: i});
          }
          var findOpe = getOperations.find(val => val.reportObjectDefinitionId == reportObjectDefinitions[i].id);
          if (findOpe != undefined) {
            itemOperations.push({reportObjectDefinitionId: reportObjectDefinitions[i].id, useAsReport: findOpe.useAsReport});
          } else {
            itemOperations.push({reportObjectDefinitionId: reportObjectDefinitions[i].id, useAsReport: false});
          }
        }
        this.targetMajorItems = operations;
        this.templateOperations = itemOperations;
      },
      /**
       * モーダルウィンドウのbodyに表示する内容の取得
       */
      getModalViewContent(id, targetMajorItems, templateOperations) {
        var content = [];
        if (targetMajorItems.length != 0) {
          content.push({name: "テスト", value: 1, type: "templateInfo", targetMajorItems: targetMajorItems, templateOperations: templateOperations});
          return content;
        }  
      },
      getOperationCategories(data) {
        this.req('/companies/'+this.item.companyId+'/operation-types', 'get', null, (err, res0) => {
          var parameter = { where: {buildingId: this.item.id} ,include: [{relation: 'operationCategoryContents',scope:{include:[{relation: 'reportObjectGroupDefinition',scope:{include:[{relation: 'reportObjectDefinitions'}]}}]}}] };
          this.onSearch('/companies/'+this.item.companyId+'/operation-categories', parameter, null, (res1) => {
            if (res1.length > 0) {
              this.setOperationCategoryList(res0, res1, data);
            }
          });
        });
      },
      /**
       * ビル情報を取得
       */
      getBuildingRequest() {
        this.onRead(this.api, '', data => {
          this.item.address = data.address;
          this.item.createdAt = data.buildingSetting.createdAt;
          this.item.deletedAt = data.buildingSetting.deletedAt;
          this.item.id = data.id;
          this.item.name = data.name;
          this.item.companyId = data.companyId;
          this.item.zipcode = data.zipcode;
          this.item.prefectureId = (data.prefectureId == 0) ? '' : data.prefectureId;
          this.item.city = data.city;
          this.item.owner = data.owner;
          this.item.filePath = (data.filePath == null) ?  data.filePath : this.imageHeaderUrl + data.filePath;
          this.item.tel = data.tel;
          this.item.updatedAt = data.buildingSetting.updatedAt;
          this.item.displayObjectIfEmpty = data.buildingSetting.displayObjectIfEmpty;
          this.item.hh = parseInt(this.hour_jst_converter(data.buildingSetting.businessStartTime.substr(0,2)));
          this.item.mm = parseInt(data.buildingSetting.businessStartTime.substr(3,2));
          // this.item.operationTemplates = this.getOperationTemplates(data.buildingOperationReports, 'operationTemplates');
          this.getOperationCategories(data);
          this.tmpUpdatedAt = this.item.updatedAt;
          this.item.floors = this.sortFloors(data.floors);

          this.templates = data.buildingOperationReports;
          this.item.approveNotificationActive = data.buildingSetting.approveNotificationActive;
          // this.getNotificationEmail(data.approveNotificationDefinitions);

          this.onFloorChange(2);
        });
      },
      getFloorType(val) {
        switch(val) {
          case 1:
            return "地上階";
          case 2:
            return "地下階"
          case 3:
            return "特殊階"
        }
        return "---"
      },
      getTimeValue(val) {
        return ("00" + val).slice(-2);
      },
      getDisplayObjectIfEmpty(val) {
        if (val) {
          return "表示";
        } else {
          return "非表示"
        }
      },
      getTemplateName(id, operation) {
        if (this.selectesOptions[operation] != undefined) {
          var name = this.selectesOptions[operation].find(val => {
            return val.id == id;
          });
          return name.name;
        }
      },
      getReportOptions(val) {
        if (val) {
          return "あり";
        } else {
          return "なし"
        }
      },
      castInt(data) {
        for (var i = 0; i < data.length; i++) {
          data[i] = parseInt(data[i]);
        }
        return data;
      },
      /**
       * リクエストデータがnullのデータを取り除く
       */
      removeNullDataFromRequestData(key) {
        var item = [];
        for (var i = 0; i < this.item[key].length; i++) {
          if ((!isNaN(this.item[key][i])) && (this.item[key][i] != "")) {
            item.push(this.item[key][i]);
          }
        }
        if (item.length == 0) {
          delete this.item[key];
        } else {
          this.item[key] = this.castInt(item);
        }
      },
      normalizationRequestData(item) {
        for (var i = 0; i < Object.keys(item).length; i++) {
          if (item[Object.keys(item)[i]] != null && Array.isArray(item[Object.keys(item)[i]]) && typeof item[Object.keys(item)[i]] != "object") {
            this.removeNullDataFromRequestData(Object.keys(item)[i])
          }
        }
        return this.item;
      },
      getIndexNum(columns) {
        if (columns === undefined) {
          return 0;
        }
        if (columns.length !== 0) {
          return columns.length;
        }
        return 0;
      },
      createMultiTypeInputForms(key) {
        if (this.item[key] === undefined) {
          this.$set(this.item, key,[{ activated: true }]);
        }
      },
      onAppendMultiTypeInputFormsButtonClick(key) {
        this.item[key].push({ activated: true });
      },
      onRemoveSelectBoxButtonClick(index, key) {
        this.item[key].splice(index, 1);
      },
      /**
       * type = multipleInputFormsのチェックボックスのリクエスト作成
       */
      onCheckboxMultiTypeInputForms(index, key) {
        this.item[key][index].activated = document.getElementById(key + "_checkbox_" + index).checked;
      },
      /**
       * type = multipleInputFormsのセレクトボックスのリクエスト作成
       */
      onSelectMultiTypeInputForms(ele, index, key) { 
        this.item[key][index].type = parseInt(ele.target.value);
        document.getElementById(key + "_input_" + index).placeholder = this.getPlaceholderMessage(parseInt(ele.target.value));
      },
      /**
       * type = multipleInputFormsのテキストのリクエスト作成
       */
      inputTextMultiTypeInputForms(index, key){
        this.item[key][index].name = document.getElementById(key + "_input_" + index).value;
      },
      getPlaceholderMessage(value) {
        var msg = "";
        switch(value) {
          case 1:
            msg = "地上階(半角数字)";
            break;
          case 2:
            msg = "地下階(半角数字)";
            break;
          case 3:
            msg = "特殊階(文字列)";
            break;
          default:
            msg = "";
            break;
        }
        return msg;
      },
      /**
       * フロアタイプをセット
       */
      setFloorType() {
         this.floorTypes = [
          { name: "", value: "" },
          { name: "地上階", value: 1 },
          { name: "地下階", value: 2 },
          { name: "特殊階", value: 3 },
        ]
      },
      /**
       * チェックボックスの初期状態設定
       */
      setFloorsCheckbox(floors) {
        var floorsElement = document.getElementsByName("floors_checkbox");
        for (var i = 0; i < floorsElement.length; i++) {
          floorsElement[i].checked = floors[i].activated;
        }
      },
      /**
      * 登録契約会社の取得
      */
      getCompaniesListRequest(api) {
        this.onSearch(api, null, null, val => {
          const list = [{name: null, value: null}];
          val.forEach(function(obj){
            list.push({ name: obj.name, value: obj.id});
          });
          this.companies_id_options = list;
          this.setOperationCategoriesRequest();
        });
      },
      getCompanyName(id) {
        var name = this.companies_id_options.find(val => val.value == id);
        if (name != undefined) {
          return name.name;
        }
      },
      onImgClick(){
        var images = document.getElementById("img_source");
        var imgSrc = images.src
        this.$refs.child.showImage(imgSrc)
      },
      getFloorsLabel(index) {
        switch(index) {
          case 1:
            return '地下1~10F';
          case 2:
            return '1~10F';
          case 3:
            return '11~20F';
          case 4:
            return '21~30F';
          case 5:
            return '31~40F';
          case 6:
            return '41~50F';
          case 7:
            return '51~60F';
          case 8:
            return '特殊階';
        }
      },
      getFloorsCheckbox() {
        if (this.floorCategory <= 7 && this.floorCategory != '') {
          var floors = [];
          var val;
          if (this.floorCategory > 2) {
            val = 1 + (this.floorCategory - 2) * 10;
          } else {
            val = 1;
          }
          for (var i = 1 ; i <= 10; i++) {
            floors.push(val);
            val++;
          }
          this.floors = floors;
        } else {

        }
        if (this.floorCategory != 8) {
          this.setFloorCheckbox();
        } else {
          this.setFloorSpecialCheckbox();
        }
      },
      onFloorCheckbox(type, name) {
        var find = this.item.floors.findIndex(val => val.type == type && val.name == name);
        if (find == -1) {
          this.item.floors.push({activated: true, type: type, name: String(name), sort: this.item.floors.length});
          return;
        }
        this.item.floors[find].activated = !this.item.floors[find].activated;
      },
      setFloorSpecialCheckbox() {
        this.$nextTick(function() {
          var ele;
          var filter = this.item.floors.filter(val => val.type == 3);
          filter.forEach(value => {
            ele = document.getElementById("floors_checkbox_" + value.sort);
            ele.checked = value.activated;
          });
        });
      },
      setFloorCheckbox() {
        var isBreak = false;
        this.$nextTick(function() {
          this.floors.forEach(value => {
            var find, ele;
            if (this.floorCategory == 1) {
              ele = document.getElementById("floor_B" + value);
              find = this.item.floors.find(val => val.name == value && val.type == 2);  
            } else if (this.floorCategory >=2 && this.floorCategory <= 7) {
              ele = document.getElementById("floor_" + value);
              find = this.item.floors.find(val => val.name == value && val.type == 1);
            }
            if (find != undefined && find.activated) {
              ele.checked = true;
            } else {
              ele.checked = false;
            }
          })
        });
      },
      onFloorChange(index) {
        this.floorCategory = index;
        this.getFloorsCheckbox();
      },
      onAllChangeCheckbox() {
        if (this.floorCategory != 8) {
          var isCheck = document.getElementById("all_change").checked;
          this.$nextTick(function() {
            this.floors.forEach(value => {
              var find, ele, type;
              if (this.floorCategory == 1) {
                ele = document.getElementById("floor_B" + value);
                type = 2;
                find = this.item.floors.find(val => val.name == value && val.type == 2);  
              } else if (this.floorCategory >=2 && this.floorCategory <= 7) {
                ele = document.getElementById("floor_" + value);
                type = 1;
                find = this.item.floors.find(val => val.name == value && val.type == 1);
              }
              ele.checked = isCheck;
              if (find == undefined) {
                this.item.floors.push({activated: isCheck, type: type, name: String(value), sort: this.item.floors.length});
              } else {
                find.activated = isCheck;
              }
            })
          });
        }
      }
    },
    created() {
      const key = "Master:Building:view";
      this.checkDisplayPermission(key, () => {
        this.setFloorType();
        this.getCompaniesListRequest('/companies')
        const editKey = "Master:Building:update";
        this.isRemoveEdit = !this.checkMenuPermission(editKey);
      });
    },
    updated() {
      this.setFloorsCheckbox(this.item.floors);
    }
  }

</script>
