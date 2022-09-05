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
            <li>{{param.title}}一覧</li>
            <li class="current">{{param.title}}登録</li>
          </ol>
        </div>
        <h1 class="ts_content_heading">{{param.title}}登録</h1>
      </div>
    </section>

    <!-- Main content -->
    <section class="content">
      <div class="box-group">
        <div class="box">
          <!-- /.box-header -->
          <div class="box-body no-paddin">
            <form class="form-horizontal" style="margin:0;" onsubmit="return false;">
              <div class="box-body">
                <div class="form-group form_box_group" v-if="param.title != '業務/報告書定義'">
                  <div class="form_box_group_title">
                    <label class="control-label">ID</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="tem-text">
                      ※自動採番
                    </div>
                  </div>
                </div>
                
                <div class="form-group form_box_group" v-if="col.type!='hiddenColmun'" v-for="col in param.columns" v-bind:class='{required:col.required} '>
                  <div class="box-header with-border" v-if="col.title">
                    <h3 class="box-title with-border">{{col.name}}</h3>
                  </div>
                  <div class="form_box_group_title" v-if="!col.title&&col.type!='threeTextInput'&&col.type!='hiddenColmun'&&col.type!='file'&&col.type!='texts'&&col.type!='requestText'&&col.type!='requestCheckbox'&&col.type!='checkbox'">
                    <label class="control-label">{{col.name}}</label>
                  </div>
                  <div class="form_box_group_field" v-if="!col.title && !col.type">
                    <input type="text" v-bind:maxlength="col.maxlength" class="form-control" v-bind:id="col.column" v-bind:placeholder="col.placeholder" v-model="item[col.column]" v-bind:disabled="col.disabled">
                    <span v-if="col.text">{{col.text}}</span>
                  </div>
                  <div class="form_box_group_field" v-if="col.type=='date'">
                    <input type="date" class="form-control" v-bind:id="col.column" v-bind:placeholder="col.placeholder" v-model="item[col.column]">
                    <span v-if="col.text">{{col.text}}</span>
                  </div>
                  
                  <div class="form_box_group_field" v-if="col.type=='datePicker'">
                    <vuejs-datepicker class="form-control date_picker" :clear-button="true" :format="DatePickerFormat" :language="language" :value="col.text" name="datepicker" v-model="item[col.column]"  v-bind:placeholder="col.placeholder">
                    </vuejs-datepicker>
                  </div>

                  <div class="display_flex" v-if="col.type=='datetime'">
                    <div class="col-sm-2 max_width_200 width_50_per" style="padding-left: 0px;">
                      <vuejs-datepicker class="form-control date_picker_small" :clear-button="true" :format="DatePickerFormat" :language="language" :value="col.date" name="datepicker" v-model="item[col.column]"  v-bind:placeholder="col.placeholder">
                      </vuejs-datepicker>
                    </div>
                    <div class="col-sm-4 date_time" style="width: 220px;">
                      <select class="form-control input_hours_mm" style="width: 65px;" v-model="col.hh">
                        <option v-bind:value="n" v-for="n in 24">{{timeConverter(n-1)}}</option>
                      </select>
                      <span class="margin_2">時</span>
                      <select class="form-control input_hours_mm" style="width: 65px;" v-model="col.mm">
                        <option v-bind:value="n" v-for="n in 60">{{timeConverter(n-1)}}</option>
                      </select>
                      <span class="margin_2">分</span>
                    </div>
                  </div>

                  <div class="form_box_group_field"  v-if="col.type=='businesstime'">
                    <div class="display_flex">
                      <div class="input_notes_list">
                        <div class="input_notes_flex">
                          <select class="form-control input_hours_mm width_100" v-model="col.hh">
                            <option v-bind:value="n-1" v-for="n in 24">{{timeConverter(n-1)}}</option>
                          </select>
                          <p class="input_notes_flex_text">時</p>
                        </div>
                        <div class="input_notes_flex">
                          <select class="form-control input_hours_mm width_100" v-model="col.mm">
                            <option v-bind:value="n-1" v-for="n in 60">{{timeConverter(n-1)}}</option>
                          </select>
                          <p class="input_notes_flex_text">分</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="form_box_group_field" v-if="col.type=='select'">
                  {{setRoleOptionSelect(col.column)}}
                    <select class="form-control max_width_390" v-bind:id="col.column" v-model="item[col.column]" v-bind:disabled="col.disabled">
                      <option v-bind:value="opt.value" v-for="opt in col.options">{{opt.name}}</option>
                    </select>
                  </div>

                  <div class="form_box_group_field" v-if="col.type=='selectValue'">
                    <select class="form-control" v-bind:id="col.column" v-model="item[col.column]=col.value" v-bind:disabled="col.disabled">
                      <option v-bind:value="opt.value" v-for="opt in col.options">{{opt.name}}</option>
                    </select>
                  </div>

                  <div class="form_box_group_field" v-if="col.type=='multiSelect'">
                    {{createMultiSelectBox(item, col.column)}}
                    {{setOptionsSelectes(item.companyId, col.column)}}
                    <div v-for="(foo, index) in getIndexNum(item[col.column])" :class="[{ 'display_flex': index!==0 }, { 'margin_top_8': index!==0 }]">
                      <select class="form-control" :value="displayValue(index, col.column)" @input="onMultiSelectBoxInput($event, index, col.column)" v-bind:disabled="item.companyId==null">
                        <option v-bind:value="opt.value" v-for="opt in col.options">{{opt.name}}</option>
                      </select>
                      <span class="input-group-btn width_auto" v-if="index!==0">
                        <button type="button" class="btn btn-danger btn-flat height_max" @click="onRemoveSelectBoxButtonClick(index, col.column)" v-bind:disabled="item.companyId==null"><i class="fa fa-minus"></i></button>
                      </span>
                    </div>
                    <button type="button" class="btn btn-success pull-right margin_top_8" @click="onAppendSelectBoxButtonClick(col.column)" v-bind:disabled="item.companyId==null"><i class="fa fa-plus"></i></button>
                  </div>

                  <!-- (textarea追加部分)start -->
                  <!-- <div class="col-sm-8" v-if="col.type=='textarea'">
                    <textarea class="form-control" v-model="item[col.column]" :rows="getRows(item[col.column])"></textarea>
                  </div> -->
                  <!-- end -->

                  <div class="form_box_group_field flex_textarea" v-if="col.type=='textarea'">
                    <div class="flex_textarea_dummy" aria-hidden="true"></div>
                    <textarea id="FlexTextarea" class="flex_textarea_textarea form-control" v-model="item[col.column]=col.value" v-bind:maxlength="col.maxlength" v-bind:placeholder="(col.placeholder ? col.placeholder + '\n' : '') + '※改行で複数行入力可'"></textarea>
                  </div>

                  <div class="form_box_group_field" v-if="col.type=='radio'">
                    <label v-bind:for="col.column+opt.value" v-for="opt in col.options"><input type="radio" v-bind:name="col.column" v-bind:id="col.column+opt.value" v-bind:value="opt.value" v-model="item[col.column]" v-bind:disabled="opt.disabled" />
                    {{opt.name}}&nbsp;&nbsp;&nbsp;&nbsp;</label>
                  </div>
                  <div class="form_box_group_field item-text" v-if="col.title">
                    {{col.text}}
                  </div>
                  <div class="form_box_group_field item-text" v-if="col.type=='hidden'">
                    <input type="hidden" class="form-control" v-model="item[col.column]=col.value">
                  </div>
                  <div class="form_box_group_field item-text" v-if="col.type=='fixedText'">
                    {{col.text}}
                  </div>
                  <label class="form_box_group_field control-label" v-if="col.type=='threeTextInput'">{{col.name}}</label>
                  <div class="form_box_group_field" v-if="col.type=='threeTextInput'" v-for="obj in col.columns">
                    <input type="text" v-bind:maxlength="obj.maxlength" class="form-control" v-bind:id="obj.column" v-bind:placeholder="obj.placeholder" v-model="item[obj.column]">
                  </div>
                  <div v-if="col.type=='file'">
                    <div id="pdf_header">
                      <label class="font_normal control-label">{{col.name}}</label>
                      <input id="file_select" type="file" style="display:none" @change="onSelectFile">
                      <button type="button" class="btn btn-primary pull-right" @click="onSelectFileClick">ファイル選択</button>
                    </div>
                    <div id="preview_div" class="preview_frame">
                      <!-- <span id="preview" class="preview">プレビュー</span> -->
                      <embed id="pdf_preview" type="application/pdf">
                    </div>
                  </div>
                  <div class="form_box_group_field" v-if="col.type=='dynamicCheckbox'">
                    <div v-for="(operation, index) in col.operations">
                      <label class="control control_checkbox">
                        <input type="checkbox" name="operations" v-bind:id="col.column + index" @change="checkOperation(col.column + index, index)">
                        <div class="control_indicator"></div>
                      </label>
                      <label class="work_position" v-bind:for="col.column + index">{{operation.name}}　</label>
                      <button type="button" class="btn btn-sm" data-toggle="modal" v-bind:data-target="'#modal'+index">詳細</button>
                    </div>
                  </div>
                  <div class="form_box_group_field" v-if="col.type=='twoCheckbox'">
                    <template v-for="cnt in 2">
                      <label class="control control_checkbox">
                        <input type="checkbox" v-model="item[col.column + cnt]" v-bind:id="col.column + cnt">
                        <div class="control_indicator"></div>
                      </label>
                      <label class="work_position" v-if="cnt == 1" v-bind:for="col.column + cnt">業務　</label>
                      <label class="work_position" v-if="cnt == 2" v-bind:for="col.column + cnt">報告書</label>
                    </template>
                  </div>
                  <div class="form_box_group_field" v-if="col.type=='multiCheckbox'">
                    <div v-for="cnt in col.options">
                      <label class="control control_checkbox">
                        <input type="checkbox" @change="createRequestMultiCheckbox(col.column, cnt.id)" v-bind:id="col.column + cnt.id" v-bind:disabled="col.disabled">
                        <div class="control_indicator"></div>
                      </label>
                      <label class="work_position" v-bind:for="col.column + cnt.id">{{cnt.name}}　</label>
                    </div>
                  </div>
                  <div class="form_box_group_field" v-if="col.type=='selectes'">
                    {{setOperationInit(col)}}
                    {{setOptionsSelectes2(item.companyId, col.column, col.options1)}}
                    <div v-bind:class="{margin_bottom_15: (index != col.options1.length-1)}" v-for="(operation, index) in col.options1">
                      <!-- <label class="selectes_position">{{operation.name}}</label> -->
                      <div class="display_flex">
                        <label class="selectes_position width_100">{{operation.name}}</label>
                        <button type="button" class="btn btn-default" data-toggle="modal" v-bind:data-target="'#modal_' + setOperationTemplate(operation.id)" @click="onTemplateDetail(setOperationTemplate(operation.id), operation.id)" v-if="getSelectTemplateValue(operation.id)!=''" v-bind:disabled="item.companyId==null">詳細</button>
                        <button type="button" class="btn btn-default" disabled v-if="getSelectTemplateValue(operation.id)==''">詳細</button>
                        <select class="form-control margin_left_10" v-bind:id="col.column" :value="displaySelectes(operation.id)" @input="createSlectesRequestData($event, operation.id, col.column)" @change="updateSelect($event.target.value, operation.id)" v-bind:disabled="item.companyId==null">
                          <option v-for="opt in col.options2[index]" v-bind:value="opt.id">{{opt.name}}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <!-- <div class="form_box_group_field" v-if="col.type=='multiTypeInputForms'">
                    {{createMultiTypeInputForms(item, col.column)}}
                    <div class="display_flex" v-for="(num, index) in getIndexNum(item[col.column])" :class="[{ 'input-group': index!==0 }, { 'margin_top_8': index!==0 }]">
                      <button type="button" class="btn btn-default" @click.stop="changedFloorOrder(col.column,index,true)"><i class="fa fa-caret-up fa-lg"></i></button>&nbsp;&nbsp;&nbsp;
                      <button type="button" class="btn btn-default" @click.stop="changedFloorOrder(col.column,index,false)"><i class="fa fa-caret-down fa-lg"></i></button>&nbsp;&nbsp;&nbsp;
                      <label class="control control_checkbox">
                        <input type="checkbox" v-bind:id="col.column+'_checkbox_'+index" @input="onCheckboxMultiTypeInputForms(index, col.column)" checked>
                        <div class="control_indicator"></div>
                      </label>
                      <div class="col-sm-3 margin_left_20 min_width_130">
                        <select class="form-control" v-bind:id="col.column+'_select_'+index" v-model="item[col.column][index].type" @input="onSelectMultiTypeInputForms($event, index, col.column)" v-bind:disabled="col.disabled">
                          <option v-bind:value="opt.value" v-for="opt in col.options">{{opt.name}}</option>
                        </select>
                      </div>
                      <div class="display_flex width_max">
                        <input type="text" v-bind:maxlength="col.maxlength" class="form-control" v-bind:id="col.column+'_input_'+index" @input="inputTextMultiTypeInputForms(index, col.column)" v-model="item[col.column][index].name" v-bind:placeholder="''" v-bind:disabled="col.disabled">
                        <span class="input-group-btn width_auto" v-if="index!==0">
                          <button type="button" class="btn btn-danger btn-flat height_max" @click="onRemoveSelectBoxButtonClick(index, col.column)"><i class="fa fa-minus"></i></button>
                        </span>
                      </div>
                    </div>
                    <button type="button" class="btn btn-success pull-right margin_top_8" @click="onAppendMultiTypeInputFormsButtonClick(col.column)"><i class="fa fa-plus"></i></button>
                  </div> -->

                  <div class="form_box_group_field" v-if="col.type=='multiTypeInputForms'">
                    {{createMultiTypeInputForms(item, col.column)}}
                    <div class="display_flex">
                      <div class="no_border" style="width:150px; display: flex; margin-bottom: 10px;">
                        <button type="button" class="btn btn-default margin_right_10" @click="onAllChangeCheckbox(true)">全選択</button>
                        <button type="button" class="btn btn-default" @click="onAllChangeCheckbox(false)">全解除</button>
                      </div>
                      <!-- <div class="no_border" style="width:150px">
                        <label class="control control_checkbox">
                          <input type="checkbox" :id="'all_change'" @click="onAllChangeCheckbox()">
                          <div class="control_indicator" style="margin-top: -10px;"></div>
                        </label>
                        <label class="item-text font_normal margin_left_20" for="all_change">全て選択/解除</label>
                      </div> -->
                      <div class="no_border floor_width">
                        <button type="button" class="input_file_button width_max cursor_pointer" :class="{add_floor_color: floorCategory==8}" :disabled="floorCategory!=8" @click="onAppendMultiTypeInputFormsButtonClickForSpecial('floors')"><i class="fa fa-plus"></i>　フロアを追加</button>
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
                            <button type="button" class="btn btn-default" @click.stop="changedFloorOrder(col.column,index,true)"><i class="fa fa-caret-up fa-lg"></i></button>&nbsp;&nbsp;&nbsp;
                            <button type="button" class="btn btn-default" @click.stop="changedFloorOrder(col.column,index,false)"><i class="fa fa-caret-down fa-lg"></i></button>&nbsp;&nbsp;&nbsp;
                            <label class="control control_checkbox">
                              <input type="checkbox" v-bind:id="'floors_checkbox_'+index" name="floors_checkbox" @input="onCheckboxMultiTypeInputForms(index, 'floors')" checked>
                              <div class="control_indicator" style="margin-top: -10px;"></div>
                            </label>
                            <div class="margin_left_20">
                            </div>
                            <div class="margin_left_20 display_flex width_max">
                              <div class="multi_select_body">
                                <input type="text" class="form-control" v-bind:id="'floors_input_'+index" @input="inputTextMultiTypeInputForms(index, 'floors')" :value="floor.name" v-bind:placeholder="placeholder[floor.type]" maxlength="32">
                              </div>
                              <div class="multi_select_buttonarea">
                                <button type="button" class="btn btn-danger btn-flat square_button" @click="onRemoveSelectBoxButtonClick(index, 'floors')"><i class="fa fa-minus"></i></button>
                              </div>
                            </div>
                          </div>   
                        </template>
                      </div>
                    </div>
                  </div>


                  <template v-if="col.type=='requestText'">
                    <div class="form_box_group_title">
                      <label class="control-label" :for="col.type+'_'+col.column">{{col.name}}</label>
                    </div>
                    <div class="form_box_group_field">
                      <input type="text" v-bind:maxlength="col.maxlength" class="form-control" v-bind:id="col.column" v-bind:placeholder="col.placeholder || col.name" @input="inputRequestSetText($event.target.value, col)" v-bind:disabled="col.disabled">
                      <span v-if="col.text">{{col.text}}</span>
                    </div>
                  </template>

                  <template v-if="(col.type=='requestCheckbox')&&(item.role==3)">
                    <div class="form_box_group_title">
                      <label class="control-label" :for="col.type+'_'+col.column">{{col.name}}</label>
                    </div>
                    <div class="form_box_group_field">
                      <label class="control control_checkbox">
                        <input type="checkbox" name="continuation" v-bind:id="col.type+'_'+col.column" @change="createRequestSetCheckbox(col.type+'_'+col.column, col.column, col.column2)" v-bind:disabled="col.disabled">
                        <div class="control_indicator"></div>
                      </label>
                    </div>
                  </template>
                  <div class="form_box_group_field" v-if="col.type=='image'">
                    <div class="input_file">
                      <label class="input_file_head">
                        <input id="file_select" class="col-sm-8 control-label" style="display:none" type="file" accept="image/*" @change="onAddFile">
                        <div type="button" class="input_file_button">画像を選択</div>
                        <p class="input_file_notes">ファイル容量5MB以下 / Jpg、png形式に対応</p>
                      </label>

                      <div class="input_file_image margin_top_20 margin_bottom_10">
                        <div class="input_file_image_body">
                          <img v-if="image!=''&&image!=null"  v-bind:src="getImageUrl(image, col.column)" v-bind:id="'img_source'" v-bind:class="{ img_thumbnail: image!='', opacity_0: image==''}" style="margin-left: 0px" data-toggle="modal" v-bind:data-target="'#modal'" @click="onImgClick">
                        </div>
                        <div class="input_file_image_buttonarea">
                          <button type="button" v-if="image!=''&&image!=null" class="btn btn-danger" style="vertical-align: top;" @click="onDeleteFileClick(col.colum)"><i class="fa fa-times"></i></button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <template v-if="col.type=='checkbox'">
                    {{createCheckbox(col.type+'_'+col.column, col.column, col.initval)}}
                    <div class="form_box_group_title">
                      <label class="control-label" :for="col.type+'_'+col.column">{{col.name}}</label>
                    </div>
                    <div class="form_box_group_field item-text" style="padding-top:0px;">
                      <label class="control control_checkbox">
                        <input type="checkbox" name="continuation" v-bind:id="col.type+'_'+col.column" @change="createCheckbox(col.type+'_'+col.column, col.column)" checked v-if="col.initval">
                        <input type="checkbox" name="continuation" v-bind:id="col.type+'_'+col.column" @change="createCheckbox(col.type+'_'+col.column, col.column)" v-if="!col.initval">
                        <div class="control_indicator"></div>
                      </label>
                    </div>
                  </template>
                  <div class="form_box_group_field" v-if="col.type=='radioButton'">
                    <div class="checkbox_list">
                      <div v-for="(operation, index) in col.options">
                        <label class="control control_radio margin_bottom_0">
                          <input type="radio" :name="col.column" :id="col.column + index" @click="isRadioButton(col.column, operation.value)">
                          <div class="control_indicator margin_top_0"></div>
                          <label :for="col.column + index" class="search_input_checkbox margin_top_0 margin_bottom_0">{{operation.name}}</label>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="error" class="callout callout-danger err-info"><p>{{error}}</p></div>
              <!-- /.box-body -->
              <div class="box-footer form_button_flex flex_right border_top">
                <button type="button" class="btn btn-default global_btn form_button_flex_item" onclick="window.history.back()">キャンセル</button>
                <button type="button" class="btn btn-warning global_btn form_button_flex_item" @click="onAddButtonClick">登 録</button>
              </div>
              <!-- /.box-footer -->
            </form>
          </div>
          <!-- /.box-body -->
        </div>
        <!-- /.box -->

      </div>
      <template v-for="(num, index) in getWorkListNum()" v-if="isModalView()">
        <modal-view :param="getModalViewContent(index)" :title="getModalViewTitle(index)+'業務/報告書定義登録'" :id="'modal'+index" @okbuttonclick="onOKButtonClick"></modal-view>
      </template>
      <template v-for="(operation, index) in setOperations">
        <modal-view :param="getModalViewContent(setOperationTemplate(operation.id), targetMajorItems, templateOperations)"  :title="getTemplateName(setOperationTemplate(operation.id), index)" :id="'modal_' + setOperationTemplate(operation.id)" :isNoEdit="true"></modal-view>
      </template>
      <template>
        <modal-img-view　ref="child" :id="'modal'" :title="'拡大プレビュー'"></modal-img-view>
      </template>
      <template>
        <modal-alert-view　ref="alert" :id="'modal_alert'" :param="alert"></modal-alert-view>
      </template>
    </section>
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->
</template>

<script>
  import ModalView from './ModalView'
  import ModalImgView from '~/components/ModalImgView'
  import ModalAlertView from '~/components/ModalAlertView'
  import Loading from 'vue-loading-overlay';
  import 'vue-loading-overlay/dist/vue-loading.css';
  export default {
    name: 'AddView',
    props: {
      param: Object,
    },
    data() {
      return {
        item: {},
        selectesItem: {},
        addItems: [],
        placeholderMessages: [],
        file: '',
        error: '',
        roleDisable: false,
        image: '',
        selectesOptions: [],
        targetMajorItems:[],
        templateOperations: [],
        selectTemplates: [],
        fullpage: true,
        setOperations: [],
        DatePickerFormat: 'yyyy/MM/dd',
        selectCompanyId: '',
        floorCategory: 2,
        floors: [],
        placeholder: [
          "",
          "地上階(半角数字)",
          "地下階(半角数字)",
          "特殊階(文字列)"
        ],
        alert: {
          title: 'test',
          message: '',
          note: '',
          isConfirm: false,
        },
        isSystemApprovalMode: this.toBoolean(localStorage.getItem('is_system_approval_mode')),
        language:{
          language: 'Japanese', 
          months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'], 
          monthsAbbr: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'], 
          days: ['日', '月', '火', '水', '木', '金', '土'], 
          rtl: false, 
          ymd: 'yyyy-MM-dd', 
          yearSuffix: '年'
        },
      };
    },
    components: {
      ModalView,
      ModalImgView,
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
        if(value>=9){
            return value-9;
        }else{
            return value-9+24;
        }
      },
      joinDate() {
        if (this.param.api == "/attendances"){
          if((this.param.columns[0].hh == null || this.param.columns[0].hh == "") || (this.param.columns[0].mm == null || this.param.columns[0].mm == "")){
            this.item.attendedAt = "";
          }else{
            this.item.attendedAt =  this.changeDateFormat(this.item.attendedAt) + "T" + this.getDoubleDigestNumber(this.param.columns[0].hh-1) + ":" + this.getDoubleDigestNumber(this.param.columns[0].mm-1) + ":00.000+09:00";
          }

          if((this.param.columns[1].hh == null || this.param.columns[1].hh == "") || (this.param.columns[1].mm == null || this.param.columns[1].mm == "")){
            this.item.leftAt = "";
          }else{
            this.item.leftAt =  this.changeDateFormat(this.item.leftAt) + "T" + this.getDoubleDigestNumber(this.param.columns[1].hh-1) + ":" + this.getDoubleDigestNumber(this.param.columns[1].mm-1) + ":00.000+09:00";
          }
        } else if (this.param.api == '/buildings'){
          if (this.isSystemApprovalMode) {
            this.item.businessStartTime =  this.getDoubleDigestNumber(this.hour_utc_converter(this.param.columns[10].hh)) + ":" + this.getDoubleDigestNumber(this.param.columns[10].mm) + ":00";
          } else {
            this.item.businessStartTime =  this.getDoubleDigestNumber(this.hour_utc_converter(this.param.columns[9].hh)) + ":" + this.getDoubleDigestNumber(this.param.columns[9].mm) + ":00";
          }
        } else if (this.param.api.match("/schedules")){
          if((this.param.columns[0].hh == null || this.param.columns[0].hh == "") || (this.param.columns[0].mm == null || this.param.columns[0].mm == "")){
            this.item.startDateTime = "";
          }else{
            this.item.startDateTime = this.changeDateFormat(this.item.startDateTime) + "T" + this.getDoubleDigestNumber(this.param.columns[0].hh-1) + ":" + this.getDoubleDigestNumber(this.param.columns[0].mm-1) + ":00.000+09:00";
          }

          if((this.param.columns[1].hh == null || this.param.columns[1].hh == "") || (this.param.columns[1].mm == null || this.param.columns[1].mm == "")){
            this.item.endDateTime = "";
          }else{
            this.item.endDateTime = this.changeDateFormat(this.item.endDateTime) + "T" + this.getDoubleDigestNumber(this.param.columns[1].hh-1) + ":" + this.getDoubleDigestNumber(this.param.columns[1].mm-1) + ":00.000+09:00";
          }
        } else if (this.param.api == '/notifications'){
          if((this.param.columns[5].hh == null || this.param.columns[5].hh == "") || (this.param.columns[5].mm == null || this.param.columns[5].mm == "")){
            this.item.displayFrom = "";
          }else{
            this.item.displayFrom = this.changeDateFormat(this.item.displayFrom) + "T" + this.getDoubleDigestNumber(this.param.columns[5].hh - 1) + ":" + this.getDoubleDigestNumber(this.param.columns[5].mm - 1) + ":00.000+09:00";
          }

          if((this.param.columns[6].hh == null || this.param.columns[6].hh == "") || (this.param.columns[6].mm == null || this.param.columns[6].mm == "")){
            this.item.displayTo = "";
          }else{
            this.item.displayTo = this.changeDateFormat(this.item.displayTo) + "T" + this.getDoubleDigestNumber(this.param.columns[6].hh-1) + ":" + this.getDoubleDigestNumber(this.param.columns[6].mm-1) + ":00.000+09:00";
          }
        }
      },
      postDatas() {
        var items = [];
        if (this.item.title != null && this.item.title != "") items.title = this.item.title;
        if (this.item.order != null && this.item.order != "") items.order = this.item.order;
        if (this.item.startShowAt != null && this.item.startShowAt != "") items.startShowAt = this.item.startShowAt;
        if (this.item.endShowAt != null && this.item.endShowAt != "")  items.endShowAt = this.item.endShowAt;
        if (this.item.startSpecialShowAt != null && this.item.startSpecialShowAt != "") items.startSpecialShowAt = this.item.startSpecialShowAt;
        if (this.item.endSpecialShowAt != null && this.item.endSpecialShowAt != "") items.endSpecialShowAt = this.item.endSpecialShowAt;
        return items;
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
        var reqItem = this.item;
        for (var i = 0; i < reqItem[key].length; i++) {
          if ((!isNaN(reqItem[key][i])) && (reqItem[key][i] != "")) {
            item.push(reqItem[key][i]);
          }
        }
        if (item.length == 0) {
          delete reqItem[key];
        } else {
          reqItem[key] = this.castInt(item);
        }
        return reqItem;
      },
      normalizationRequestData(item) {
        var req = {};
        var ids = [];
        for (var i = 0; i < Object.keys(item).length; i++) {
          if (Array.isArray(item[Object.keys(item)[i]])) {
            if ((item[Object.keys(item)[i]].length != 0) && item[Object.keys(item)[i]][0] && typeof item[Object.keys(item)[i]][0] != "object") {
              ids = [];
              for (var j = 0; j < item[Object.keys(item)[i]].length; j++) {
                // NOTE: リクエストデータがnullのデータを取り除く
                if (!isNaN(item[Object.keys(item)[i]][j]) && item[Object.keys(item)[i]][j] != "") {
                  ids.push(parseInt(item[Object.keys(item)[i]][j]));
                }
              }
              req[Object.keys(item)[i]] = ids;
            } else if (typeof item[Object.keys(item)[i]][0] == "object"){
              req[Object.keys(item)[i]] = item[Object.keys(item)[i]];
            }
          } else {
            req[Object.keys(item)[i]] = item[Object.keys(item)[i]];
          }
        }
        return req;
      },
      addRequest() {
        this.joinDate();
        var dateError = "";
        if (this.param.api.match("/schedules")){
          if (this.item.startDateTime != "" && this.item.endDateTime != null){
            var startDate = new Date(this.item.startDateTime);
            var endDate = new Date(this.item.endDateTime);
            if (!(isNaN(startDate))&&!(isNaN(endDate))){
              if (endDate<startDate){
                dateError = "終了日時 : 終了日時を開始日時より後の日時に設定してください。"
                this.error = dateError;
                return
              }
            }
          }
        }
        if (this.param.api.match("/attendances")){
          if (this.item.attendedAt != "" && this.item.leftAt != "") {
            var attenedDate = new Date(this.item.attendedAt);
            var leftDate = new Date(this.item.leftAt);
            if (leftDate < attenedDate) {
              dateError = "退勤時間 : 退勤時間を出勤時間より後の時間に設定してください。"
              this.error = dateError;
              return
            }
          }
        }
        if (this.param.api.match("/notifications")){
          if (this.item.displayFrom != "" && this.item.displayTo != "") {
            var displayFrom = new Date(this.item.displayFrom);
            var displayTo = new Date(this.item.displayTo);
            if (displayTo < displayFrom) {
              dateError = "表示終了日 : 表示終了日を表示開始日より後の日付に設定してください。"
              this.error = dateError;
              return
            }
          }
        }
        if (this.param.api.match("/members")){
          if (this.item.role != "3") {
            this.item.approveNotificationDefinition = {notificationActive: false};
          }
        }
        if (this.param.api.match("/buildings") && (this.param.api.match("/schedules") == null)){
          if (!this.toBoolean(localStorage.getItem('is_system_approval_mode'))) {
            this.item.companyId = parseInt(localStorage.getItem('company_id'));
          }
          this.item.operationTemplates = this.getRequestTemplates();
          if (this.item.floors != null){
            for (var i = 0; i < this.item.floors.length; i++) {
              var floor = this.item.floors[i];
              floor["sort"] = i;
            }
          }
        }

        this.req(this.param.api, 'post', this.normalizationRequestData(this.item), (err, res) => {
          if (err) {
            const errorColm = {};
            for(const key in this.param.columns){
              errorColm[this.param.columns[key].column] = this.param.columns[key].name;
            }
            this.error = this.getErrorMsg2(res, this.param.columns)
            //this.error = this.getErrorMsg(res && res.body && res.body.error, errorColm, this.param.errorCode);
          } else if (res.body) {
            this.$router.push(this.param.success);
          }
        });
      },
      addFileRequest() {
        this.joinDate();
        this.multipartReq(
          this.param.api, 
          'post', 
          this.postDatas(),
          this.file, 
          (err, res) => {
          if (err) {
            const errorColm = {};
            for(const key in this.param.columns){
              errorColm[this.param.columns[key].column] = this.param.columns[key].name;
            }
            this.error = this.getErrorMsg2(res, this.param.columns);
          } else if (res.body) {
            this.$router.push(this.param.success + '/' + res.body.id);
          }
        });
      },
      onAddButtonClick() {
        this.error = '';
        this.addRequest();
      },
      onSelectFileClick(){
        document.getElementById("file_select").click();
      },
      fileValidation(fileData) {
        if (fileData.type != "application/pdf" || fileData.size > 2000000) {
          document.getElementById("preview_div").style.border = "";
          document.getElementById("preview").style.display = "";
          document.getElementById("pdf_preview").style.visibility = "hidden";
          this.file = null;
          if(fileData.type != "application/pdf") {
            // alert('PDFファイルを選択してください');
            this.alert.title = '';
            this.alert.message = 'PDFファイルを選択してください。';
            this.alert.note = '';
            this.alert.isConfirm = false;
            $('#modal_alert').modal('show')
          } else {
            this.alert.title = '';
            this.alert.message = '5MB以下のファイル容量のファイルを選択してください。';
            this.alert.note = '';
            this.alert.isConfirm = false;
            $('#modal_alert').modal('show')
            // alert("2MB以下のファイル容量のファイルを選択してください");
          }
          return false;
        }
        return true;
      },
      onSelectFile(ele){
        // ファイル情報を取得
        var fileData = ele.target.files[0];
        if(!this.fileValidation(fileData)) return;
        this.file = fileData;
        //サムネイル表示エリアのエレメント取得
        var embed =  document.getElementById("pdf_preview");

        // FileReaderオブジェクトを使ってファイル読み込み
        var reader = new FileReader();
        // ファイル読取り成功時処理
        reader.onload = function() {
          document.getElementById("pdf_preview").style.visibility = "";
          document.getElementById("preview_div").style.border = "none";
          document.getElementById("preview").style.display = "none";
          //ノードの複製
          var cln = embed.cloneNode(true);
          //複製したノードのdata要素をにFileAPIの読み込み結果をセット
          cln.setAttribute("src",URL.createObjectURL(fileData));
          this.file = reader.result;
          embed.parentNode.replaceChild(cln, embed);
        };
        reader.readAsDataURL(fileData);
      },
      createMultiSelectBox(column, key) {
        if (column[key] === undefined) {
          this.$set(column, key,[""]);
        }
      },
      createMultiTypeInputForms(column, key) {
        if (column[key] === undefined) {
          this.$set(column, key, [{ activated: true }]);
        }
      },
      onAppendSelectBoxButtonClick(key) {
        this.item[key].push("");
      },
      onAppendMultiTypeInputFormsButtonClickForSpecial(key) {
        if (this.item[key].length == 1 && this.item[key][0].type == undefined) {
          this.item[key].length = 0;
        }
        this.item[key].push({ activated: true, type: 3});
      },
      onAppendMultiTypeInputFormsButtonClick(key) {
        this.item[key].push({ activated: true });
      },
      onRemoveSelectBoxButtonClick(index, key) {
        this.item[key].splice(index, 1);
      },
      onMultiSelectBoxInput(ele, index, key) {
        this.item[key].splice(index, 1, ele.target.value);
      },
      getIndexNum(columns) {
        if (columns.length !== 0) {
          return columns.length;
        }
        return 0;
      },
      displayValue(index, key) {
        return this.item[key][index];
      },
      // (textarea追加部分)start 
      getRows(text) {
        if (text == undefined || text == null) {
          return 1;
        }
        return text.split("\n").length;
      },
      /**
       * モーダルウィンドウのokボタン押下時の処理
       */
      onOKButtonClick(id) {
        var modal_content = document.getElementsByName(id);
        var operations = [];
        var checkFlag = false;
        for (var i = 0; i < modal_content.length; i++) {
          if (i % 2 == 0) {
            if (modal_content[i].checked) {
              operations.push(parseInt(modal_content[i].id.replace(/operation_/g, "")));
              document.getElementById(id.replace(/modal/g, "buildingOperations")).checked = true;
              checkFlag = true;
            }
	        }
        }
        if (!checkFlag) document.getElementById(id.replace(/modal/g, "buildingOperations")).checked = false;
        this.item.buildingOperations = operations;
      },
      /**
       * ログイン中ビルに紐づく業務数の取得
       */
      getWorkListNum() {
        for (var i = 0; i < this.param.columns.length; i++) {
          if (this.param.columns[i].modalview != undefined) {
            return this.param.columns[i].worklist.length;
          }
        }
      },
      /**
       * 表示するcolumnがモーダルウィンドウを使用するか否か
       */
      isModalView() {
        for (var i = 0; i < this.param.columns.length; i++) {
          if (this.param.columns[i].modalview != undefined) {
            return true;
          }
        }
        return false;
      },
      /**
       * モーダルウィンドウのbodyに表示する内容の取得
       */
      getModalViewContent(index) {
        for (var i = 0; i < this.param.columns.length; i++) {
          if (this.param.columns[i].modalview != undefined) {
            return this.param.columns[i].modalview[index];
          }
        }
      },
      /**
       * モーダルウィンドウのheaderに表示する内容の取得
       */
      getModalViewTitle(index) {
        for (var i = 0; i < this.param.columns.length; i++) {
          if (this.param.columns[i].modalview != undefined) {
            return this.param.columns[i].worklist[index].name.replace(/日報/g, "");
          }
        }
      },
      /**
       * すべての大項目にチェックを入れるor外す
       */
      operationAllCheck(id, state) {
        var modal_content = document.getElementsByName("modal" + id);
        for (var i = 0; i < modal_content.length; i++) {
          modal_content[i].checked = state;
        }
      },
      /**
       * 業務項目のチェック時動作
       */
      checkOperation(elementId, id) {
        if (document.getElementById(elementId).checked) {
          this.operationAllCheck(id, true);
        } else {
          this.operationAllCheck(id, false);
        }
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
       * type = multiCheckboxのリクエスト作成
       */
      createRequestMultiCheckbox(key, id) {
        if (!Array.isArray(this.item[key])) {
          this.$set(this.item, key, [id]);
          return;
        }
        var value = this.item[key];
        for (var i = 0; i < this.item[key].length; i++) {
          if (value[i] == id && !document.getElementById(key + id).checked) {
            this.item[key].splice(i, 1);
            return;
          }
        }
        this.item[key].push(id);
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
      /**
       * type = requestSetのチェックボックスのリクエスト作成
       */
      createRequestSetCheckbox(id, key1, key2) {
        if (this.item[key1] == undefined) {
          this.item[key1] = {[key2]: document.getElementById(id).checked};
        } else {
          if (this.item[key1][key2] != undefined) {
            this.item[key1][key2] = document.getElementById(id).checked
          }
        }
      },
      /**
       * type = checkboxのチェックボックスのリクエスト作成
       */
      createCheckbox(id, key, value) {
        if (value != undefined) {
          this.item[key] = value;
          // if (this.param.api.match("/companies")) {
          //   this.item[key] = value ? 1 : 0;
          // } else {
          //   this.item[key] = value;
          // }
        } else {
          if (this.param.api.match("/companies")) {
            if (document.getElementById(id) == null || document.getElementById(id).checked) {
              this.item[key] = true;
            } else {
              this.item[key] = false;
            }
          } else {
            this.item[key] = document.getElementById(id) == null ? false : document.getElementById(id).checked;
          }
        }
      },
      inputRequestSetText(value, columns) {
        if (this.item[columns.column] == undefined) {
          this.item[columns.column] = [{[columns.column2]: value, [columns.column3]: columns.operationCategoryId}]
        } else {
          var item = this.item[columns.column].find(value => value[columns.column3] == columns.operationCategoryId)
          if (item != undefined) {
            item[columns.column2] = value;
          } else {
            this.item[columns.column].push({[columns.column2]: value, [columns.column3]: columns.operationCategoryId})
          }
        }
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
      flexTextarea(el) {
        const dummy = el.querySelector('.flex_textarea_dummy');
        el.querySelector('.flex_textarea_textarea').addEventListener('input', e => {
          dummy.textContent = e.target.value + '\u200b';
        })
      },
      getSelectTemplateValue(operationId) {
        var find = this.selectTemplates.find(val => val.id == operationId);
        if (find != undefined) {
          return find.value
        }
        return "";
      },
      updateSelect(value, id) {
        for (var i = 0; i < this.selectTemplates.length; i++) {
          if (this.selectTemplates[i].id == id) {
            this.$set(this.selectTemplates, i, {id: id, value: value});
            return;
          }
        }
        this.selectTemplates.push({id: id, value: value});
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
      setOperationInit(operations) {
        this.setOperations = operations.options1;
        this.selectesOptions = operations.options2;
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
      setRoleOptionSelect(column){
        if (column == "role"){
          if (this.item[column] == 5) {
            if (!this.roleDisable) {
              this.roleDisable = true;
              if (!this.isSystemApprovalMode) {
                this.param.columns[2].type = 'hiddenColmun';
              }else{
                this.param.columns[1].type = 'hiddenColmun';                                
                this.param.columns[4].type = 'hiddenColmun';                
              }
              this.param.columns[3].type = 'hiddenColmun';
              this.item.buildingIds = [];
              this.item.companyId = null;
              this.item.operations = [];
            }
          }else{
            if (this.roleDisable) {
              this.roleDisable = false;
              if (this.isSystemApprovalMode) {
                this.param.columns[1].type = 'select';
                this.param.columns[3].type = 'multiCheckbox';
                this.param.columns[4].type = 'multiSelect';
              }else{
                this.param.columns[2].type = 'multiCheckbox';
                this.param.columns[3].type = 'multiSelect';
              }
            }
          }
        }
      },
      setOptionsSelectes2(companyId, column, options) {
        if (!this.isSystemApprovalMode) {
          if (this.item.companyId != null || options.length == 0) {
            return;
          }
          companyId = localStorage.getItem('company_id');
          this.item.companyId = parseInt(companyId);
        } else {
          if (this.selectCompanyId != companyId) {
            this.item[column] = [""];
            this.selectTemplates = [];
          } else {
            return;
          }
        }
        this.selectCompanyId = companyId;
        var that = this;
        var where = {"and":[{"companyId": companyId}]};
        // this.onSearch('/operation-report-templates', null, where, (val) => {
        //   this.param.columns.forEach(function(item){
        //     if (item.column == column) {
        //       var list = [];
        //       for (var i = 0; i < options.length; i++) {
        //         list.push(that.getTemplateList(options[i].id, val));
        //       }
        //       item.options2 = list;
        //       return;
        //     }
        //   });
        // })
      },
      getRequestTemplates() {
        var list = [];
        for (var i = 0; i < this.selectTemplates.length; i++) {
          var find = list.find(val => val == this.selectTemplates[i].value);
          if (find == undefined) {
            list.push(parseInt(this.selectTemplates[i].value));
          }
        }
        return list;
      },
      displaySelectes(operation) {
        var find = this.selectTemplates.find(val => val.id == operation);
        if (find != undefined) {
          return find.value;
        } else {
          return null;
        }
      },
      getTemplateName(id, operation) {
        if (this.selectesOptions[operation] != undefined) {
          var name = this.selectesOptions[operation].find(val => {
            return val.id == id;
          });
          if (name != undefined) {
            return name.name;
          }   
        }
      },
      setOptionsSelectes(companyId, column) {
        if (!this.isSystemApprovalMode) {
          if (this.item.companyId != null) {
            return;
          }
          companyId = localStorage.getItem('company_id');
          this.item.companyId = parseInt(companyId);
        } else {
          if (this.selectCompanyId != companyId) {
            this.item[column] = [""];
          } else {
            return;
          }
        }
        this.selectCompanyId = companyId;
        if (companyId != null){
          if (this.isSystemApprovalMode) {
            this.onSearch('/companies/'+companyId+'/operation-types', null, null, (val) => {
              this.param.columns[3].options = [];
              val.forEach(function(item){
                this.param.columns[3].options.push({name: item.name,id: item.id});
              }.bind(this));
            });
          }
        }else{
          this.param.columns[3].options = [];
        }

        var where = {"and":[{"companyId": companyId}]};
        this.onSearch('/buildings', null, where, (val) => {
          this.param.columns.forEach(function(item){
            if (item.column == "buildingIds") {
              var list = [{name: "", value: ""}];
              val.forEach(function(obj){
                // list.push({ name: obj.name, value: obj.id});
                list.push({name: obj.name, value: obj.id});
              });
              item.options = list;
              return;
            }
          });
        });
      },
      changedFloorOrder(columns,index,up){
        var column = this.item[columns];
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
      onAddFile(event){
        var reader = new FileReader();
        var files = event.target.files;
        if (files[0]){
          if (files[0].size > 5000000) {
            var inputs = document.getElementById("file_select");
            inputs.value = "";
            // alert("5MB以下のファイル容量のファイルを選択してください");
            this.alert.title = '';
            this.alert.message = '5MB以下のファイル容量のファイルを選択してください。';
            this.alert.note = '';
            this.alert.isConfirm = false;
            $('#modal_alert').modal('show')
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
          }else if (fileId != ""){
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
        } else {

        }
        if (this.floorCategory != 8) {
          this.setFloorCheckbox();
        } else {
          this.setFloorSpecialCheckbox();
        }
      },
      onFloorCheckbox(type, name) {
        if (this.item.floors.length == 1 && this.item.floors[0].name == undefined) {
          this.item.floors.length = 0;
        }
        var find = this.item.floors.findIndex(val => val.type == type && val.name == name);
        if (find == -1) {
          this.item.floors.push({activated: true, type: type, name: String(name), sort: this.item.floors.length + 1});
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
        if (this.item.floors.length == 1 && this.item.floors[0].type == undefined) {
          this.item.floors.length = 0;
        }
        // var isCheck = document.getElementById("all_change").checked;
        if (this.floorCategory != 8) {
          // var isCheck = document.getElementById("all_change").checked;
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
        } else {
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
      }
    },
    created() {
      if (this.param.init_val){
        this.item = this.param.init_val;
      } 
    },
    mounted() {
      if (this.param.api == "/BulletinBoards" || this.param.api == "/ResidentialManuals") {
        document.getElementById("pdf_preview").style.visibility = "hidden";
      }
      if (this.param.api == "/buildings") {
        this.onFloorChange(2)
      }
    },
    updated() {
      document.querySelectorAll('.flex_textarea').forEach(this.flexTextarea);
    },
    watch: {
      item: {
        handler(val) {
          this.param.columns.forEach( e => {
            if (this.item[e.column] === '') {
              this.item[e.column] = undefined;
            }
          })
          if(this.param.cb != null) {
            this.param.cb(val);
          }
        },
        deep: true,
      },
    },
  }
</script>
