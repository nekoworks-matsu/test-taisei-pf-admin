<template>

  <div class="box-body">
    <div v-for="(obj, index) in list" class="form-group form_box_group">
      <div class="form_box_group_field">
        <!-- 画像 -->
        <div v-if="isEdit" class="input_file">
          <label class="input_file_head">
            <input v-bind:id="'file_select_' + index" class="col-sm-8 control-label" style="display:none" type="file" accept="image/*" @change="onAddFile(index, $event)">
            <button type="button" class="input_file_button" @click="onSelectFileClick(index)">ファイル選択</button>
            <p class="input_file_notes">ファイル容量5MB以下 / Jpg、png形式に対応</p>
          </label>
          <div class="input_file_image margin_top_20 margin_bottom_10">
            <div class="input_file_image_body">
              <img v-bind:id="'img_source_' + index" v-bind:class="{ img_thumbnail: isPreviews[index], opacity_0: !isPreviews[index]}" data-toggle="modal_preview" v-bind:data-target="'#modal_preview'" @click="onImgClick(index)">
            </div>
            <div class="input_file_image_buttonarea">
              <button type="button" v-bind:id="'img_button_' + index" v-show="isPreviews[index]" class="btn btn-danger" style="vertical-align: top;" @click="onDeleteFileClick(index)"><i class="fa fa-times"></i></button>
            </div>
          </div>
        </div>
        <div v-if="!isEdit" class="padding_top_10">
          <img v-bind:id="'img_source_' + index" v-bind:class="{ img_thumbnail: isPreviews[index], opacity_0: !isPreviews[index]}" data-toggle="modal_preview" v-bind:data-target="'#modal_preview'" @click="onImgClick(index)">
        </div>
      </div>

      <div class="form_box_group_field flex_textarea">
        <!-- 画像コメント -->
        <div v-if="isEdit" class="flex_textarea_dummy" aria-hidden="true">{{obj.captionValue}}</div>
        <textarea v-if="isEdit" id="FlexTextarea" class="flex_textarea_textarea form-control" v-model="obj.captionValue" maxlength="512" placeholder="※改行で複数行入力可">{{obj.captionValue}}</textarea>
        <div v-if="(obj.captionValue && !isEdit)" class="item-text">
          <span v-html="getColumData(obj.captionValue)"></span>
        </div>
      </div>

    </div>

    <div class="box-body pull-right" v-if="isEdit">
      <button type="button" class="btn btn-success" @click.stop="onTappedAddNew"><i class="fa fa-plus"></i></button>
    </div>

    <template>
      <modal-img-view ref="child" :id="'modal_preview'" :title="'拡大プレビュー'"></modal-img-view>
    </template>
    <template>
      <modal-alert-view ref="alert" :id="'modal_image'" :param="alert" @onconfirm="onOKButtonForTransition"></modal-alert-view>
    </template>

  </div>

</template>

<script>
  import ModalImgView from '~/components/ModalImgView'
  import ModalAlertView from '~/components/ModalAlertView'

  export default {
    name: 'BusinessReportImageView',
    props: {
      isAddView: Boolean, // 登録画面かどうか
      isEdit: Boolean,    // 登録・編集するかどうか.
      list: Array,        // 画像データ.
    },
    data() {
      return {
        error: '',
        fullpage: true,
        alert: {
          title: 'test',
          message: '',
          note: '',
          isConfirm: false,
        },
        isPreviews: {},   // 画像プレビュー制御
        imageSources: {}, // 画像src情報
      }
    },
    components: {
      ModalImgView,
      ModalAlertView
    },
    methods: {

      // 画像関連のボタン押下時の処理

      /**
       * 画面表示上での画像追加.
       */
      onAddFile(index, event) {
        var reader = new FileReader();
        var files = event.target.files;
        if (files[0]) {
          if (files[0].size > 5000000) {
            var inputs = document.getElementById('file_select_' + index);
            inputs.value = "";
            this.alert.title = '';
            this.alert.message = '5MB以下のファイル容量のファイルを選択してください。';
            this.alert.note = '';
            this.alert.isConfirm = false;
            $('#modal_image').modal('show')
            // alert("5MB以下のファイル容量のファイルを選択してください");
            return
          }
        }
        var image = document.getElementById('img_source_' + index);
        var imm = new Image();
        this.multipartReq(
          "/files",
          'post',
          'business',
          files[0],
          (err, res) => {
          if (err) {
            this.error = "imageError";
          } else if (res.body) {
            setTimeout(() => {
              image.src = this.imageHeaderUrl + res.body.fileId;
              this.$set(this.imageSources, index, image.src);
              var imagesSplit = image.src.split(this.imageHeaderUrl);
              this.list[index].value = imagesSplit[1];
              // ↓DOM更新されないため仕方なくこのようにしている
              image.className = 'img_thumbnail';
              var button = document.getElementById('img_button_' + index);
              button.style.display = 'block';
              // ↑DOM更新されないため仕方なくこのようにしている
            }, 500);
          }
        });
        this.$set(this.isPreviews, index, true);
        reader.onload = function (event) {
          imm.onload = function () {
          }.bind(this);
          image.onload = function () {
          };
          image.onerror  = function () {
            // alert('この画像は読み込めません。');
          };
          imm.src = reader.result;
          image.src = reader.result;
        }.bind(this);

        reader.onerror = function () {
          // alert('このファイルは読み込めません。');
        }

        if (files[0]) {
          reader.readAsDataURL(files[0]);
        }
      },

      /**
       * ファイル選択ボタン押下時の処理.
       */
      onSelectFileClick(index) {
        document.getElementById('file_select_' + index).click();
      },

      /**
       * 画像拡大表示.
       */
      onImgClick(index) {
        var image = document.getElementById('img_source_' + index);
        var imgSrc = image.src;
        this.$refs.child.showImage(imgSrc);
        $('#modal_preview').modal('show');
      },

      /**
       * 画像設定.
       */
      setImages(index, src) {
        var image = document.getElementById('img_source_' + index);
        if (image) {
          image.src = this.imageHeaderUrl + src;
          image.className = 'img_thumbnail'; // DOM更新されないため仕方なくこのようにしている
          this.$set(this.imageSources, index, src);
          this.$set(this.isPreviews, index, true);
          if (this.isEdit) {
            var button = document.getElementById('img_button_' + index);
            button.style.display = 'block';  // DOM更新されないため仕方なくこのようにしている
          }
        }
      },

      /**
       * 画面表示上での画像削除.
       */
      onDeleteFileClick(index) {
        var image = document.getElementById('img_source_' + index);
        image.src = null;
        image.className = 'opacity_0'; // DOM更新されないため仕方なくこのようにしている
        var inputs = document.getElementById('file_select_' + index);
        inputs.value = '';
        var button = document.getElementById('img_button_' + index);
        button.style.display = 'none'; // DOM更新されないため仕方なくこのようにしている
        this.$set(this.imageSources, index, image.src);
        this.$set(this.isPreviews, index, false);
        this.list[index].value = '';
      },

      /**
       * モーダルのOKボタン押下時の処理.
       */
      onOKButtonForTransition() {
        this.next();
      },

      /**
       * 削除ボタン押下時の処理.
       *   未使用
       */
      onTappedDelete(index) {
      },

      /**
       * 追加ボタン押下時の処理.
       */
      onTappedAddNew() {
        this.addNew();
      },
      addNew() {
        this.list.push({
          'id': '',
          'type': 7,
          'value': '',
          'captionValue': '',
          'commonFlg': true
        });
      }
    },

    created() {
      //console.log('BusinessReportImageView - created');
      //console.log('this.list');
      //console.dir(this.list);
    },

    mounted() {
      //console.log('BusinessReportImageView - mounted');
    },

    updated() {
      //console.log('BusinessReportImageView - updated');
      //console.log('this.list');
      //console.dir(this.list);

      // 親コンポーネントへ更新されたデータを渡す
      this.$emit('updateImageValues', this.list);
    },

  }
</script>
