<template>
<!-- modal -->
  <div class="modal fade" v-bind:id="id">
    <div v-bind:class="{ 'modal_image_dialog': (isTablet==null), 'modal_image_dialog_tablet':  (isTablet!=null) }">
      <div class="modal-content">
        <div class="modal-header padding_10">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true"><i class="fa fa-times"></i></span>
          </button>
          <h4 class="modal-title">{{title}}</h4>
        </div>
        <img id="img_sources" class="two_date_picker">
        <div class="modal-footer padding_10">
          <button type="button" class="btn btn-default pull-left" data-dismiss="modal">閉じる</button>
          <button v-if="transition" type="button" class="btn btn-info pull-right" @click="toDetails()" data-dismiss="modal">詳細</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ModalImgView',
    props: {
      id: String,
      title: String,
      transition: Boolean,
      isTablet: String,
    },
    data() {
      return {
      };
    },
    methods: {
      showImage(img){
        var image = document.getElementById("img_sources");
        image.src = img;
      },
      toDetails(){
        this.$emit('toDetails');
      }
    }
  }
</script>