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
            <li>ビル情報</li>
            <li class="current">ビル情報編集画面</li>
          </ol>
        </div>
        <h1 class="ts_content_heading">ビル情報編集画面</h1>
      </div>
    </section>
    <!-- <section class="content-header">
      <h1>
        ビル編集
        <small></small>
        <div class="pull-right">
          <button type="button" class="btn btn-default width_140" @click="onTransitionButton('/buildings/details/' + item.id)">キャンセル</button>
        </div>
      </h1>
    </section> -->
    <!-- Main content -->
    <section class="content">
      <div class="box-group">
        <div class="box">
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

                <div class="form-group form_box_group required" v-if="isSystemApprovalMode">
                  <div class="form_box_group_title">
                    <label class="control-label">契約会社</label>
                  </div>
                  <div class="form_box_group_field">
                    <select class="form-control max_width_390" v-model="item.companyId">
                      <option v-bind:value="opt.value" v-for="opt in companies_id_options" >{{opt.name}}</option>
                    </select>
                  </div>
                </div>

                <div class="form-group form_box_group" v-bind:class="{'required':this.checkItemPermission('Master:Building:update:name')}">
                  <div class="form_box_group_title">
                    <label class="control-label">ビル名</label>
                  </div>
                  <div class="form_box_group_field" v-if="this.checkItemPermission('Master:Building:update:name')">
                    <input type="text" maxlength="64" class="form-control" v-model="item.name">
                  </div>
                  <div class="form_box_group_field" v-if="!this.checkItemPermission('Master:Building:update:name')">
                    <div class="item-text">
                      {{item.name}}
                    </div>
                  </div>
                </div>

                <div class="form-group form_box_group" v-bind:class="{'required':this.checkItemPermission('Master:Building:create:zipcode')}">
                  <div class="form_box_group_title">
                    <label class="control-label">郵便番号</label>
                  </div>
                  <div class="form_box_group_field" v-if="this.checkItemPermission('Master:Building:create:zipcode')">
                    <input type="text" maxlength="8" class="form-control" v-model="item.zipcode">
                  </div>
                  <div class="form_box_group_field" v-if="!this.checkItemPermission('Master:Building:create:zipcode')">
                    <div class="item-text">
                      {{item.zipcode}}
                    </div>
                  </div>
                </div>

                <div class="form-group form_box_group" v-bind:class="{'required':this.checkItemPermission('Master:Building:update:prefectureId')}">
                  <div class="form_box_group_title">
                    <label class="control-label">都道府県</label>
                  </div>
                  <div class="form_box_group_field">
                    <select class="form-control max_width_390" v-model="item.prefectureId" v-if="this.checkItemPermission('Master:Building:update:prefectureId')">
                      <option v-bind:value="opt.value" v-for="opt in prefectures" >{{opt.name}}</option>
                    </select>
                  </div>
                  <div class="form_box_group_field" v-if="!this.checkItemPermission('Master:Building:update:prefectureId')">
                    <div class="item-text">
                      {{item.prefectureId}}
                    </div>  
                  </div>
                </div>

                <div class="form-group form_box_group" v-bind:class="{'required':this.checkItemPermission('Master:Building:update:city')}">
                  <div class="form_box_group_title">
                    <label class="control-label">市区</label>
                  </div>
                  <div class="form_box_group_field" v-if="this.checkItemPermission('Master:Building:update:city')">
                    <input type="text" maxlength="64" class="form-control" v-model="item.city">
                  </div>
                  <div class="form_box_group_field" v-if="!this.checkItemPermission('Master:Building:update:city')">
                    <div class="item-text">
                      {{item.city}}
                    </div>
                  </div>
                </div>
                
                <div class="form-group form_box_group" v-bind:class="{'required':this.checkItemPermission('Master:Building:update:address')}">
                  <div class="form_box_group_title">
                    <label class="control-label">所在地</label>
                  </div>
                  <div class="form_box_group_field" v-if="this.checkItemPermission('Master:Building:update:address')">
                    <input type="text" maxlength="256" class="form-control"  v-model="item.address">
                  </div>
                  <div class="form_box_group_field" v-if="!this.checkItemPermission('Master:Building:update:address')">
                    <div class="item-text">
                      {{item.address}}
                    </div>
                  </div>
                </div>

                <div class="form-group form_box_group" v-bind:class="{'required':this.checkItemPermission('Master:Building:update:tel')}">
                  <div class="form_box_group_title">
                    <label class="control-label">電話番号</label>
                  </div>
                  <div class="form_box_group_field" v-if="this.checkItemPermission('Master:Building:update:tel')">
                    <input type="text" maxlength="12" class="form-control"  placeholder="半角数字" v-model="item.tel">
                  </div>
                  <div class="form_box_group_field" v-if="!this.checkItemPermission('Master:Building:update:tel')">
                    <div class="item-text">
                      {{item.tel}}
                    </div>  
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">所有者</label>
                  </div>
                  <div class="form_box_group_field" v-if="this.checkItemPermission('Master:Building:update:owner')">
                    <input type="text" maxlength="32" class="form-control"  v-model="item.owner">
                  </div>
                  <div class="form_box_group_field" v-if="!this.checkItemPermission('Master:Building:update:owner')">
                    <div class="item-text">
                      {{getColumData(item.owner)}}
                    </div>
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">写真</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="input_file">
                      <label class="input_file_head">
                        <input id="file_select" class="col-sm-8 control-label" style="display:none" type="file" accept="image/*" @change="onAddFile">
                        <div type="button" class="input_file_button">画像を選択</div>
                        <p class="input_file_notes">ファイル容量5MB以下 / Jpg、png形式に対応</p>
                        <!-- <button type="button" class="btn btn-primary margin_left_15" @click="onSelectFileClick">ファイル選択</button><span>&nbsp;&nbsp;&nbsp;※ファイル容量5MB以下</span> -->
                      </label>
                      <div class="input_file_image margin_top_20 margin_bottom_10">
                        <div class="input_file_image_body">
                          <img v-if="image!=''&&image!=null" v-bind:src="getImageUrl(image, 'filePath')" v-bind:id="'img_source'" v-bind:class="{ img_thumbnail: image!='', opacity_0: image==''}" style="margin-left: 0px" data-toggle="modal" v-bind:data-target="'#modal'" @click="onImgClick">
                        </div>
                        <div class="input_file_image_buttonarea">
                          <button type="button" v-if="image!=''&&image!=null" class="btn btn-danger" style="vertical-align: top;" @click="onDeleteFileClick('filePath')"><i class="fa fa-times"></i></button>
                        </div>
                      </div>
                    </div>
                  </div>                
                </div>

                <div class="form-group form_box_group" v-bind:class="{'required':this.checkItemPermission('Master:Building:update:floors')}">
                  <div class="form_box_group_title">
                    <label class="control-label">フロア</label>
                  </div>
                  <div class="form_box_group_field">
                    {{createMultiTypeInputForms('floors')}}
                    <div class="display_flex">
                      <div class="no_border" style="width:150px; display: flex; margin-bottom: 10px;">
                        <button type="button" class="btn btn-default margin_right_10" @click="onAllChangeCheckbox(true)">全選択</button>
                        <button type="button" class="btn btn-default" @click="onAllChangeCheckbox(false)">全解除</button>
                      </div>
                      <div class="no_border floor_width">
                        <button type="button" class="input_file_button width_max cursor_pointer" :class="{add_floor_color: floorCategory==8}" :disabled="floorCategory!=8" @click="onAppendMultiTypeInputFormsButtonClickForSpecial('floors')" v-if="this.checkItemPermission('Master:Building:update:floors')"><i class="fa fa-plus"></i>　フロアを追加</button>
                      </div>
                    </div>
                    <div class="display_flex align_item_normal">
                      <table border="1" class="no_border width_150" style="height: 1px;">
                        <tr style="height: 15px">
                          <td class="no_border"></td>
                        </tr>
                        <tr class="selectradio selectradio_inline" v-for="index in 8">
                          <td class="selectradio_item no_border" style="border-bottom: medium solid #ddd !important;">
                            <input type="radio" name="floors" :id="'floors' + index" style="display:none" @change="onFloorChange(index)" :checked="index==2"></input>
                            <label class="cursor_pointer" :for="'floors' + index">{{getFloorsLabel(index)}}</label>
                          </td>
                        </tr>
                      </table>
                      <div class="floor_width padding_top_15">
                        <template v-for="i in floors" v-if="floorCategory!=8">
                          <label class="control control_checkbox" v-bind:class="{margin_left_30:floorCategory!=1,margin_left_20:floorCategory==1}">
                            <input type="checkbox" :id="'floor_' + i" v-if="floorCategory!=1" @change="onFloorCheckbox(1 , i)">
                            <input type="checkbox" :id="'floor_B' + i" v-if="floorCategory==1" @change="onFloorCheckbox(2, i)">
                            <div class="control_indicator margin_top_0"></div>
                            <div class="item-text font_normal padding_top_20 margin_left_0 floor_label_width" :for="'floor_' + i" v-if="floorCategory!=1">{{i}}F</div>
                            <div class="item-text font_normal padding_top_20 margin_left_0 floor_label_width_b" :for="'floor_B' + i" v-if="floorCategory==1">B{{i}}F</div>                            
                          </label>
                        </template>
                        <template v-if="floorCategory==8">
                          <div class="display_flex" v-for="(floor, index) in item.floors" :class="[{ 'input-group': index!==0 }, { 'margin_top_8': index!==0 }]" style="margin-left: 50px;" v-if="floor.type==3">
                            <button type="button" class="btn btn-default" @click.stop="changedFloorOrder(index,true)"><i class="fa fa-caret-up fa-lg"></i></button>&nbsp;&nbsp;&nbsp;
                            <button type="button" class="btn btn-default" @click.stop="changedFloorOrder(index,false)"><i class="fa fa-caret-down fa-lg"></i></button>&nbsp;&nbsp;&nbsp;
                            <label class="control control_checkbox">
                              <input type="checkbox" v-bind:id="'floors_checkbox_'+index" name="floors_checkbox" @input="onCheckboxMultiTypeInputForms(index, 'floors')" v-if="checkItemPermission('Master:Building:update:floors')">
                              <input type="checkbox" v-bind:id="'floors_checkbox_'+index" name="floors_checkbox" @input="onCheckboxMultiTypeInputForms(index, 'floors')" disabled v-else>
                              <div class="control_indicator" style="margin-top: -10px;"></div>
                            </label>
                            <div class="margin_left_20">
                              <div class="item-text" v-if="!checkItemPermission('Master:Building:update:floors')">
                                {{getFloorType(floor.type)}} {{floor.name}}
                              </div>
                            </div>
                            <div class="margin_left_20 display_flex width_max">
                              <div class="multi_select_body">
                                <input type="text" class="form-control" v-bind:id="'floors_input_'+index" @input="inputTextMultiTypeInputForms(index, 'floors')" :value="floor.name" v-bind:placeholder="placeholder[floor.type]" maxlength="32" v-if="checkItemPermission('Master:Building:update:floors')">
                              </div>
                              <div class="multi_select_buttonarea" v-if="(index!==0)&&(checkItemPermission('Master:Building:update:floors'))">
                                <button type="button" class="btn btn-danger btn-flat square_button" @click="onRemoveSelectBoxButtonClick(index, 'floors')"><i class="fa fa-minus"></i></button>
                              </div>
                            </div>
                          </div>   
                        </template>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-group form_box_group" v-bind:class="{'required':this.checkItemPermission('Master:Building:update:businessStartTime')}">
                  <div class="form_box_group_title">
                    <label class="control-label">業務日付切替時刻</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="display_flex">
                      <div class="input_notes_list">
                        <div class="input_notes_flex">
                          <select class="form-control input_hours_mm width_100" v-model="item.hh" v-bind:id="'hh'" v-if="this.checkItemPermission('Master:Building:update:businessStartTime')">
                            <option v-bind:value="n-1" v-for="n in 24">{{timeConverter(n-1)}}</option>
                          </select>
                          <p class="input_notes_flex_text">時</p>
                        </div>
                        <div class="input_notes_flex">
                          <select class="form-control input_hours_mm width_100"  v-model="item.mm" v-bind:id="'mm'" v-if="this.checkItemPermission('Master:Building:update:businessStartTime')">
                            <option v-bind:value="n-1" v-for="n in 60">{{timeConverter(n-1)}}</option>
                          </select>
                          <p class="input_notes_flex_text">分</p>
                        </div>
                       
                        <div class="item-text" v-if="!this.checkItemPermission('Master:Building:update:businessStartTime')">
                          {{getTimeValue(item.hh)}} : {{getTimeValue(item.mm)}}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="form-group form_box_group" v-bind:class="{'required':this.checkItemPermission('Master:Building:update:displayObjectIfEmpty')}">
                  <div class="form_box_group_title">
                    <label class="control-label">報告事項無し</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="checkbox_list" v-if="this.checkItemPermission('Master:Building:update:displayObjectIfEmpty')">
                      <div>
                        <label class="control control_radio margin_bottom_0">
                          <input type="radio" name="displayObject" id="displayObjectTrue" @click="isRadioButton('displayObjectIfEmpty', true)" :checked="this.item.displayObjectIfEmpty">
                          <div class="control_indicator margin_top_0"></div>
                          <label for="displayObjectTrue" class="search_input_checkbox margin_top_0 margin_bottom_0">表示</label>
                        </label>
                      </div>
                      <div>
                        <label class="control control_radio margin_bottom_0">
                          <input type="radio" name="displayObject" id="displayObjectFalse" @click="isRadioButton('displayObjectIfEmpty', false)" :checked="!this.item.displayObjectIfEmpty">
                          <div class="control_indicator margin_top_0"></div>
                          <label for="displayObjectFalse" class="search_input_checkbox margin_top_0 margin_bottom_0">非表示</label>
                        </label>
                      </div>
                    </div>
                    <div class="item-text" v-if="!this.checkItemPermission('Master:Building:update:displayObjectIfEmpty')">
                      {{getDisplayObjectIfEmpty(item.displayObjectIfEmpty)}}
                    </div>
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">業務報告書</label>
                  </div>
                  <div class="form_box_group_field">
                    <div v-for="(operation, index) in operations">
                      <label class="control control_checkbox">
                        <input type="checkbox" @change="changeOperation4BusinessReportGroup('operation_business_report_group_' + operation.id, operation.id)" name="check_operation_business_report_group" v-bind:id="'operation_business_report_group_' + operation.id" checked v-if="tempOperation4BusinessReportGroup[operation.id].checked">
                        <input type="checkbox" @change="changeOperation4BusinessReportGroup('operation_business_report_group_' + operation.id, operation.id)" name="check_operation_business_report_group" v-bind:id="'operation_business_report_group_' + operation.id" v-if="!tempOperation4BusinessReportGroup[operation.id].checked">
                        <div class="control_indicator"></div>
                      </label>
                      <label class="work_position" v-bind:for="'operations' + operation.id">{{ operation.name }}</label>
                    </div>
                  </div>
                </div>

                <!-- <div class="form-group form_box_group" v-bind:class="{'required':(this.checkItemPermission('Master:Building:update:securityOperationTemplates') || this.checkItemPermission('Master:Building:update:cleaningOperationTemplates'))}">
                  {{setOptionsSelectes2(item.companyId, 'operationTemplates', operations)}}
                  <div class="form_box_group_title">
                    <label class="control-label">業務カテゴリ</label>
                  </div>
                  <div class="form_box_group_field">
                    <div v-bind:class="{margin_bottom_15: (index != operations.length-1)}" v-for="(operation, index) in operations">
                      <div class="display_flex">
                        <label class="selectes_position width_100">{{operation.name}}　</label>
                        <button type="button" class="btn btn-default" data-toggle="modal" v-bind:data-target="'#modal_' + setOperationTemplate(operation.id)" @click="onTemplateDetail(setOperationTemplate(operation.id), operation.id)" v-if="getSelectTemplateValue(operation.id)!=''" v-bind:disabled="item.companyId==null">詳細</button>
                        <button type="button" class="btn btn-default" disabled v-if="getSelectTemplateValue(operation.id)==''">詳細</button>
                        <select class="form-control margin_left_10" :value="getSelectTemplateValue(operation.id)" @input="createSlectesRequestData($event, operation.id, 'operationTemplates')" @change="updateSelect($event.target.value, operation.id)" v-if="(checkItemPermission('Master:Building:update:securityOperationTemplates') || checkItemPermission('Master:Building:update:cleaningOperationTemplates'))" v-bind:disabled="item.companyId==null">
                          <option v-for="opt in selectesOptions[index]" :value="opt.id">{{opt.name}}</option>
                        </select>
                      </div>
                      <div class="item-text" v-if="!(checkItemPermission('Master:Building:update:securityOperationTemplates') || checkItemPermission('Master:Building:update:cleaningOperationTemplates'))">
                        <button type="button" class="btn btn-default" data-toggle="modal" v-bind:data-target="'#modal_' + setOperationTemplate(operation.id)" @click="onTemplateDetail(setOperationTemplate(operation.id), operation.id)" v-if="getColumData(getTemplateName(setOperationTemplate(operation.id), index)) != '---'">詳細</button>
                        {{getColumData(getTemplateName(setOperationTemplate(operation.id), index))}}
                      </div>
                    </div>
                  </div>
                </div> -->

                <div class="form-group form_box_group" v-bind:class="{'required':this.checkItemPermission('Master:Building:update:approveNotificationActive')}">
                  <div class="form_box_group_title">
                    <label class="control-label">オーナーメール送信</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="checkbox_list" v-if="this.checkItemPermission('Master:Building:update:displayObjectIfEmpty')">
                      <div>
                        <label class="control control_radio margin_bottom_0">
                          <input type="radio" name="approveNotificationActive" id="approveNotificationActiveTrue" @click="isRadioButton('approveNotificationActive', true)" :checked="this.item.approveNotificationActive">
                          <div class="control_indicator margin_top_0"></div>
                          <label for="approveNotificationActiveTrue" class="search_input_checkbox margin_top_0 margin_bottom_0">あり</label>
                        </label>
                      </div>
                      <div>
                        <label class="control control_radio margin_bottom_0">
                          <input type="radio" name="approveNotificationActive" id="approveNotificationFalse" @click="isRadioButton('approveNotificationActive', false)" :checked="!this.item.approveNotificationActive">
                          <div class="control_indicator margin_top_0"></div>
                          <label for="approveNotificationFalse" class="search_input_checkbox margin_top_0 margin_bottom_0">なし</label>
                        </label>
                      </div>
                      <div class="item-text" v-if="!this.checkItemPermission('Master:Building:update:approveNotificationActive')">
                        {{getColumData(getReportOptions(item.approveNotificationActive))}}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-group form_box_group" v-for="(operation, index) in operations">
                  <div class="form_box_group_title">
                    <label class="control-label">現場通知メール {{operation.name}}</label>
                  </div>
                  <div class="form_box_group_field" v-if="(checkItemPermission('Master:Building:update:securityApproveNotificationDefinitions') || checkItemPermission('Master:Building:update:cleaningApproveNotificationDefinitions'))">
                    <input type="text" maxlength="256" class="form-control" id :placeholder="'メールアドレス('+operation.name+')※メーリングリストを推奨'" v-model="notificationEmails[index].destination"/> 
                  </div>
                  <div class="form_box_group_field" v-if="!(checkItemPermission('Master:Building:update:securityApproveNotificationDefinitions') || checkItemPermission('Master:Building:update:cleaningApproveNotificationDefinitions'))">
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
              <!-- /.box-body -->
              <div v-if="itemInfo" class="callout callout-success"><p>{{itemInfo}}</p></div>
              <div v-if="error" class="callout callout-danger err-info"><p>{{error}}</p></div>

              <div class="box-footer form_button_flex flex_right border_top">
                <button type="button" class="btn btn-danger global_btn form_button_flex_item margin_right_auto" @click="onDeleteFunc()" v-if="(this.checkMenuPermission('Master:Building:delete'))&&(isHeadquartersMode||isSystemApprovalMode)">削除</button>
                <button type="button" class="btn btn-default global_btn form_button_flex_item" @click="onTransitionButton('/buildings/details/' + item.id)">キャンセル</button>
                <button type="button" v-if="this.checkMenuPermission('Master:Building:update')" class="btn btn-warning global_btn form_button_flex_item" @click="onUpdateButton">保存</button>
              </div>
              <!-- /.box-footer -->
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
  import { event } from '~/plugins/events.js'
  import Loading from 'vue-loading-overlay';
  import ModalView from '~/components/ModalView'
  import ModalImgView from '~/components/ModalImgView'
  import ModalAlertView from '~/components/ModalAlertView'
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
        targetMajorItems:[],
        templateOperations: [],
        selectTemplates: [],
        operation4BusinessReportGroup: [],
        tempOperation4BusinessReportGroup: [],
        fullpage: true,
        image: '',
        isHeadquartersMode: this.toBoolean(localStorage.getItem('is_headquarters_mode')),
        isSystemApprovalMode: this.toBoolean(localStorage.getItem('is_system_approval_mode')),
        role: localStorage.getItem('role'),
        alert: {
          title: 'test',
        },
        placeholder: [
          "",
          "地上階(半角数字)",
          "地下階(半角数字)",
          "特殊階(文字列)"
        ],
        floorCategory: 2,
        floors: [],
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
      Loading,
      ModalView,
      ModalImgView,
      ModalAlertView,
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
          reqFloors.push({id: floors[i].id,activated: floors[i].activated, type: floors[i].type, name: floors[i].name,sort: i});
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
          companyId: this.item.companyId,
          zipcode: this.item.zipcode,
          prefectureId: this.item.prefectureId,
          city: this.item.city,
          address: this.item.address,
          owner: this.item.owner==null? "":this.item.owner,
          filePath: this.item.filePath,
          tel: this.item.tel,
          displayObjectIfEmpty: this.item.displayObjectIfEmpty,
          businessStartTime: time,
          operationTemplates: this.getRequestTemplates(),
          operationBusinessReportGroups: this.tempOperation4BusinessReportGroup.filter((obj) => obj.checked).map((obj) => {return obj.operationTypeId}),
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
                this.getOperation4BusinessReportGroup();
                // var templateList = JSON.parse(localStorage.getItem('template_list'));
                // var newList = [];
                // templateList.forEach(function(template) {
                //   var find = res.body.buildingOperationReports.find((operationReport) => {
                //     return (operationReport.active == true) && (template.operationCategoryId == operationReport.operationReportTemplate.operationCategoryId);
                //   });
                //   newList.push({templateId: find.operationReportTemplateId, operationCategoryId: find.operationReportTemplate.operationCategoryId});
                // });
                // localStorage.setItem('template_list', JSON.stringify(newList));
                // var historyTemplates = res.body.buildingOperationReports.map(function(row) {
                //   return {id: row.operationReportTemplateId, operationId: row.operationReportTemplate.operationCategoryId};
                // })
                // var setHistoryTemplates = Array.from(new Set(historyTemplates));
                // localStorage.setItem('history_templates', JSON.stringify(setHistoryTemplates));
                event.emit('login-update');
              }
            } else if(err) {
              this.error = this.getErrorMsg2(res, this.param.columns);
              return;
            }
          }
        );
      },
      getOperation4BusinessReportGroup() {
        this.onSearch('/business-report-group-definitions?companyId='+parseInt(localStorage.getItem('company_id'))+"&buildingId="+this.$route.params.id, null, null, (res) => {
          this.operation4BusinessReportGroup = [];
          console.dir(res);
          res.forEach((val, index) => {
            if (val.buildingHasBusinessReports != null) {
              const businessReportDefinitions = [];
              val.buildingHasBusinessReports.forEach((val2) => {
                businessReportDefinitions.push({id: val2.id, name: val2.businessReportDefinition.name})
              })
              this.operation4BusinessReportGroup.push({id: val.id, name: val.name, operationTypeId: val.operationTypeId});
            }
          });
        })
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
        this.req("/operation-categories", 'get', null, (err, res) => {
          this.setOperationCategoryList(res);
          this.getBuildingRequest();
          this.setOperationReportTemplatesRequest(res);
        });
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
      createMultiForm(key) {
        if (this.item[key] === undefined) {
          this.$set(this.item, key,[""]);
        }
      },
      getRequestTemplates() {
        var list = [];
        for (var i = 0; i < this.selectTemplates.length; i++) {
          var find = list.find(val => val == this.selectTemplates[i].value);
          if (find == undefined) {
            if (this.selectTemplates[i].value != "") {
              list.push(parseInt(this.selectTemplates[i].value));
            }
          }
        }
        return list;
      },
      /**
       * 業務ごとのテンプレートリストの取得
       */
      getTemplateList(id, templates) {
        var list = [{ name: "", id: ""}];
        for (var i = 0; i < templates.length; i++) {
          if (id == templates[i].operationCategoryId) {
            list.push({ name: "ID " + templates[i].id + " : " + templates[i].name, id: templates[i].id, operationCategoryId: templates[i].operationCategoryId})
          }
        }
        return list
      },
      setOptionsSelectes2(companyId, column, operations) {
        if (!this.isSystemApprovalMode) {
          if (this.item.companyId != null || operations.length == 0) {
            return;
          }
          companyId = localStorage.getItem('company_id');
          this.item.companyId = parseInt(companyId);
        } else {
          if (this.selectCompanyId != companyId) {
            this.selectTemplates = [];
            this.item.operationTemplates = [""];
          } else {
            return;
          }
        }
        this.selectCompanyId = companyId;
        var that = this;
        var where = {"and":[{"companyId": companyId}]};
        this.onSearch('/operation-report-templates', null, where, (val) => {
          var list = [];
          for (var i = 0; i < operations.length; i++) {
            list.push(that.getTemplateList(operations[i].id, val));
          }
          that.selectesOptions = list;
        })
      },
      /**
       * マスタデータに定義されている業務をセット
       */
      setOperationCategoryList(operationTypes, res ,data) {
        var operations = [];
        for (var i = 0; i < res.length; i++) {
          const operationType = operationTypes.body.find(val => val.id == res[i].operationTypeId);
          operations.push({ id: res[i].id, name: operationType.name, reportName: res[i].reportName});
          this.notificationEmails.push({"operationCategoryId": res[i].id, "destination": ""});
          // 業務報告書を利用する業務種別のチェック
          this.tempOperation4BusinessReportGroup[res[i].id] = { 'operationTypeId': res[i].operationTypeId, 'checked': 0 < this.operation4BusinessReportGroup.filter((obj) => obj.operationTypeId == res[i].operationTypeId).length };
        }
        this.operations = operations;
        this.getNotificationEmail(data.approveNotificationDefinitions);
      },
      /**
       * create時の設定されている業務テンプレートを取得
       */
      getOperationTemplates(data, key) {
        var list = [];
        this.selectTemplates = [];
        this.selectesItem[key] = [];
        for (var i = 0; i < data.length; i++) {
          if (data[i].active == true) {
            list.push(data[i].operationReportTemplateId);
            this.selectTemplates.push({id: data[i].operationReportTemplate.operationCategoryId, value: data[i].operationReportTemplateId});
            // this.$set(this.selectTemplates, data[i].operationReportTemplate.operationCategoryId, parseInt(data[i].operationReportTemplateId));
            this.selectesItem[key].push({"index": data[i].operationReportTemplate.operationCategoryId, "id": parseInt(data[i].operationReportTemplateId)})
          }
        }
        var that = this;
        this.operations.forEach(function(val) {
          var find = that.selectTemplates.find(operation => operation.id == val.id);
          if (find == undefined) {
            that.selectTemplates.push({id: val.id, value: ""});
          }
        });
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
      getSelectTemplateValue(operationId) {
        var find = this.selectTemplates.find(val => val.id == operationId);
        if (find != undefined) {
          return find.value
        } else {
          return "";
        }
      },
      updateSelect(value, id) {
        for (var i = 0; i < this.selectTemplates.length; i++) {
          if (this.selectTemplates[i].id == id) {
            this.$set(this.selectTemplates, i, {id: id, value: value});
            return;
          }
        }
        //this.selectTemplates.push({id: id, value: value});
      },
      onTemplateDetail(templateId, operationId) {
        this.req("/operation-report-templates/" + templateId, 'get', null, (err, res) => {
          this.getMajorItemsRequest(res.body.operations, operationId); 
        });
      },
      getMajorItemsRequest(operations, operationId) {
        this.req("/operation-categories", 'get', null, (err, res) => {
          var find = res.body.find(val => val.id == operationId);
          this.setMajorItemsInfo(find.reportObjectDefinitions, operations);
        });
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
          this.$set(this.item, 'companyId', data.companyId);
          this.selectCompanyId = data.companyId;
          this.item.zipcode = data.zipcode;
          this.item.prefectureId = (data.prefectureId == 0) ? '' : data.prefectureId;
          this.item.city = data.city;
          this.item.filePath = data.filePath;
          this.image = data.filePath;
          this.item.owner = data.owner;
          this.item.tel = data.tel;
          this.item.owner = data.owner;
          this.item.updatedAt = data.buildingSetting.updatedAt;
          this.item.displayObjectIfEmpty = data.buildingSetting.displayObjectIfEmpty;
          this.item.hh = parseInt(this.hour_jst_converter(data.buildingSetting.businessStartTime.substr(0,2)));
          this.item.mm = parseInt(data.buildingSetting.businessStartTime.substr(3,2));
          // this.item.operationTemplates = this.getOperationTemplates(data.buildingOperationReports, 'operationTemplates');
          this.getOperationCategories(data);
          this.getOperation4BusinessReportGroup();
          this.tmpUpdatedAt = this.item.updatedAt;
          this.item.floors = this.sortFloors(data.floors);

          this.templates = data.buildingOperationReports;
          this.item.approveNotificationActive = data.buildingSetting.approveNotificationActive;
          this.getNotificationEmail(data.approveNotificationDefinitions);

          this.onFloorChange(2);
        });
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
        return val.replace(/\r?\n/g, '<br>');
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
          if (name == null) {
            return "";
          }
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
      onAppendMultiTypeInputFormsButtonClickForSpecial(key) {
        var length = this.item[key].length
        this.item[key].push({ activated: true, type: 3, sort: length});
        this.$nextTick(function() {
          document.getElementById("floors_checkbox_" + length).checked = true;
        });
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
          // this.setOperationCategoriesRequest();
          this.getBuildingRequest();
        });
      },
      getCompanyName(id) {
        var name = this.companies_id_options.find(val => val.value == id);
        if (name != undefined) {
          return name.name;
        }
      },
      changedFloorOrder(index,up){
        var column = this.item.floors;
        const orizin = column[index];
        if (up){
          if (index != 0){
            column[index] = column[index-1];
            column[index-1] = orizin;
          }
        }else{
          if (index != (column.length-1)){
            column[index] = column[index+1];
            column[index+1] = orizin;
          }
        }
        column.splice();
      },
      onSelectFileClick(){
        document.getElementById("file_select").click();
      },
      onAddFile(event){
        var reader = new FileReader();
        var files = event.target.files;
        if (files[0]){
          if (files[0].size > 5000000) {
            var inputs = document.getElementById("file_select");
            inputs.value = "";
            this.alert.title = '';
            this.alert.message = '5MB以下のファイル容量のファイルを選択してください。';
            this.alert.isConfirm = false;
            $('#modal_alert').modal('show')
           // alert("5MB以下のファイル容量のファイルを選択してください");
            return
          }
        }

        var image = document.getElementById("img_source");
        var resizeImage = new Image();

        this.multipartReq(
          "/files", 
          'post', 
          null,
          files[0], 
          (err, res) => {
          if (err) {
            this.error = "imageError";
          } else if (res.body) {
            setTimeout(() => this.image = res.body.fileId, 1000);
          }
        });
        reader.onload = function (event) {   
          resizeImage.onload = function (){
            this.ImgB64Resize(reader.result, resizeImage.width, resizeImage.height, 0,
              function(img_b64) {
                // Destination Image
                image.src = img_b64;
              }
            );
          }.bind(this);

          image.onload = function (){
          }; 
    
             
          image.onerror  = function (){           
            // alert('この画像は読み込めません。');  
          };
          resizeImage.src = reader.result;
          image.src = reader.result;

        }.bind(this);
        
        reader.onerror = function (){  
          // alert('このファイルは読み込めません。');  
        }
        
        if (files[0]){
          reader.readAsDataURL(files[0]);
        }
      },
      onImgClick(){
        var images = document.getElementById("img_source");
        var imgSrc = images.src
        this.$refs.child.showImage(imgSrc)
      },
      onDeleteFileClick(colum){
        this.isPreview = false;
        var image = document.getElementById("img_source");
        image.src = null;
        var inputs = document.getElementById("file_select");
        inputs.value = "";
        this.image = '';
        this.item[colum] = '';
      },
      ImgB64Resize(imgB64_src, width, height, rotate, callback) {
        // Image Type
        var img_type = imgB64_src.substring(5, imgB64_src.indexOf(";"));
        // Source Image
        var img = new Image();
        img.onload = function() {
            // New Canvas
            var canvas = document.createElement('canvas');
            if(rotate == 90 || rotate == 270) {
                // swap w <==> h
                canvas.width = height;
                canvas.height = width;
            } else {
                canvas.width = width;
                canvas.height = height;
            }
            // Draw (Resize)
            var ctx = canvas.getContext('2d');
            if(0 < rotate && rotate < 360) {
                ctx.rotate(rotate * Math.PI / 180);
                if(rotate == 90)
                    ctx.translate(0, -height);
                else if(rotate == 180)
                    ctx.translate(-width, -height);
                else if(rotate == 270)
                    ctx.translate(-width, 0);
            }
            ctx.drawImage(img, 0, 0, width, height);
            // Destination Image
            var imgB64_dst = canvas.toDataURL(img_type);
            callback(imgB64_dst);
        };
        img.src = imgB64_src;
      },
      getImageUrl(fileId, column){
        if (fileId != null){
          if (fileId.filePath != null){
            this.item[column] = fileId.filePath;
            return this.imageHeaderUrl + fileId.filePath;
          } else if (fileId != ""){
            if (fileId.slice(0, 8) == 'https://') {
              this.item[column] = fileId;
              return fileId;
            }
            this.item[column] = fileId;
            return this.imageHeaderUrl + fileId;
          }
        }
        return "";
      },
      isRadioButton(column, value) {
        this.item[column] = value;
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
      onAllChangeCheckbox(isCheck) {
        // var isCheck = document.getElementById("all_change").checked;
        if (this.floorCategory != 8) {
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
        }　else {
          var list, filter;
          this.$nextTick(function() {
            list = document.getElementsByName('floors_checkbox');
            list.forEach(value => {
              value.checked = isCheck;
            });
            filter = this.item.floors.filter(val => val.type == 3);
            filter.forEach(value => {
              value.activated = isCheck;
            });
          });
        }
      },
      deleteFunc() {
        this.onDelete(this.api, '/buildings');
      },
      onDeleteFunc() {
        this.alert.title = '';
        this.alert.message = 'こちらのデータを削除いたします。<br>よろしいでしょうか？<br>';
        this.alert.note = '※この操作は取り消すことはできません。'
        this.alert.isConfirm = true;
        $('#modal_alert').modal('show')
      },

      /**
       * 業務報告書のチェック処理
       *   どの業務種別で利用するかチェックする
       */
      changeOperation4BusinessReportGroup(id, operationId) {
        var checkbox = document.getElementById(id);
        this.tempOperation4BusinessReportGroup[operationId].checked = checkbox == null ? false : checkbox.checked; // データ
        return;
      },
    },
    created() {
      const key = "Master:Building:update";
      this.checkDisplayPermission(key, () => {
        this.setFloorType();
        this.getCompaniesListRequest('/companies');
      });
    },
    updated() {
      this.setFloorsCheckbox(this.item.floors);
    }
  }

</script>
