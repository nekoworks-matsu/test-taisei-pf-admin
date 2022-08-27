<template>
<!-- modal -->
  <div class="modal fade" v-bind:id="id">
    <div class="modal-dialog tablet_modal_dialog">
      <div class="modal-content tablet_modal_content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">×</span>
          </button>
          <h4 class="modal-title modal_floor_title">{{param.title}}</h4>
        </div>
        <div class="modal-body clearfix padding_top_50 padding_bottom_50" style="text-align: center;">
          <span class="tablet_modal_message" v-html="param.message"></span>
          <span class="tablet_modal_caption padding_top_15 padding_bottom_20" v-if="param.note!=null" v-html="param.note"></span>
        </div>
        <div class="modal-footer" style="text-align: center">
          <button id="modal-btn-no" type="button" class="btn btn-default global_btn" data-dismiss="modal" v-if="param.isConfirm">キャンセル</button>
          <button type="button" class="btn btn-info global_btn" data-dismiss="modal" v-if="!param.isConfirm">OK</button>
          <button id="modal-btn-si" type="button" class="btn btn-info global_btn" data-dismiss="modal" @click="$emit('onconfirm')" v-if="param.isConfirm">OK</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ModalAlertView',
    props: {
      param: Object,
      id: String,
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
      
    },
  }
</script>