<template>
<!-- modal -->
  <div class="modal fade" v-bind:id="id">
    <div class="modal-dialog sidebar_scroll">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">×</span>
          </button>
          <h4 class="modal-title">{{title}}</h4>
        </div>
        <div class="modal-body clearfix">
          <div class="margin_bottom_20">
            <button type="button" class="btn btn-lg btn-default btn-block" @click="onAllSetting(true)">すべてチェック</button>
            <button type="button" class="btn btn-lg btn-default btn-block  margin_top_20" @click="onAllSetting(false)">すべてクリア</button>
          </div> 
          <template v-for="modalview in param">
            <label class="col-sm-4 control-label t_modal_label font_18 margin_bottom_0" v-if="modalview.type == 'twoCheckbox'">{{modalview.name}}</label>
            <label class="col-sm-4 control-label t_modal_label font_18 margin_bottom_0" :for="modalview.id" v-if="modalview.type == 'checkbox'">{{modalview.name}}</label>
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
            <div class="col-sm-8 modal_two_checkbox" style="margin-top: 10px; margin-bottom: 14px" v-if="modalview.type == 'checkbox'">
              <label class="control control_checkbox">
                <input type="checkbox" v-model="item.operations[modalview.id]" v-bind:name="id" v-bind:id="modalview.id" checked v-if="modalview.checked">
                <input type="checkbox" v-model="item.operations[modalview.id]" v-bind:name="id" v-bind:id="modalview.id" v-if="!modalview.checked">
                <div class="t_control_indicator t_modal_control_indicator"></div>
              </label>       
            </div>
          </template>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-lg btn-primary btn-block" @click="$emit('okbuttonclick', id, column)">OK</button>
          <button type="button" class="btn btn-lg btn-default btn-block margin_top_20" data-dismiss="modal">閉じる</button>
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
      column: String
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