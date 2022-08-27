<template>
<!-- modal -->
  <div class="modal fade" v-bind:id="id">
    <div class="modal-dialog sidebar_scroll">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">×</span>
          </button>
          <h4 class="modal-title modal_floor_title">{{title}}</h4>
        </div>
        <div class="modal-body clearfix">
          <div class="modal_all_btn" v-if="!isNoEdit">
            <button type="button" class="btn btn-default margin_right_30" @click="onAllSetting(true)">チェック</button>
            <button type="button" class="btn btn-default" @click="onAllSetting(false)">クリア</button>
          </div> 
          <template v-for="modalview in param">
            <label class="col-sm-4 control-label modal_label" v-if="modalview.type == 'twoCheckbox'">{{modalview.name}}</label>
            <label class="col-sm-4 control-label modal_label" :for="modalview.id" v-if="modalview.type == 'checkbox'">{{modalview.name}}</label>
            <div class="col-sm-8 modal_two_checkbox" v-if="modalview.type == 'twoCheckbox'">
              <template v-for="cnt in 2">
                <label class="control control_checkbox">
                  <input type="checkbox" v-if="cnt == 1" v-model="item.operations[modalview.id]" v-bind:name="id" v-bind:id="'operation_' + modalview.id">
                  <input type="checkbox" v-if="cnt == 2" v-model="item.reports[modalview.id]" v-bind:name="id" v-bind:id="'report_' + modalview.id">
                  <div class="control_indicator"></div>
                </label>
                <label class="work_position" v-if="cnt == 1" v-bind:for="'operation_' + modalview.id">業務　</label>
                <label class="work_position" v-if="cnt == 2" v-bind:for="'report_' + modalview.id">報告書</label>
              </template>
            </div>
            <div class="col-sm-8 modal_two_checkbox" style="margin-top: 7px; margin-bottom: 7px" v-if="modalview.type == 'checkbox'">
              <label class="control control_checkbox">
                <input type="checkbox" v-model="item.operations[modalview.id]" v-bind:name="id" v-bind:id="modalview.id" checked v-if="modalview.checked">
                <input type="checkbox" v-model="item.operations[modalview.id]" v-bind:name="id" v-bind:id="modalview.id" v-if="!modalview.checked">
                <div class="control_indicator"></div>
              </label>       
            </div>
            <div class="box-body" v-for="(target, targetCnt) of modalview.targetMajorItems" v-if="modalview.type == 'templateInfo'">
              <div class="box-header with-border" style="margin-bottom: 20px;">
                <h3 class="box-title">{{target.reportObjectGroupDefinitionName}}</h3>
              </div>

              <div class="height_40" v-for="majorItem of target.reportObject">
                <label class="col-sm-4 control-label modal_label" :for="majorItem.id">{{majorItem.name}}</label>
                <div class="col-sm-8 modal_template_info">
                  <label class="control control_checkbox">
                    <input type="checkbox" name="continuation" v-model="modalview.templateOperations[majorItem.sort].useAsReport" :id="majorItem.id" checked disabled v-if="modalview.templateOperations[majorItem.sort].useAsReport">
                    <input type="checkbox" name="continuation" v-model="modalview.templateOperations[majorItem.sort].useAsReport" :id="majorItem.id" disabled v-if="!modalview.templateOperations[majorItem.sort].useAsReport">
                    <div class="control_indicator"></div>
                  </label>
                </div>
              </div>
            </div>
          </template>
        </div>
        <div class="modal-footer" style="text-align: center">
          <button type="button" class="btn btn-default global_btn" data-dismiss="modal">閉じる</button>
          <button type="button" class="btn btn-info global_btn" @click="$emit('okbuttonclick', id, column)" v-if="!isNoEdit">OK</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ModalView',
    props: {
      param: Array,
      title: String,
      id: String,
      column: String,
      isNoEdit: Boolean
    },
    data() {
      return {
        item: { 
          operations: [],
          reports: []
        },
      };
    },
    methods: {
      onAllSetting(check) {
        var ele = document.getElementsByName(this.id);
        for (var i = 0; i < ele.length; i++) {
          ele[i].checked = check;
        }
      }
    },
  }
</script>