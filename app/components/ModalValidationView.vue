<template>
  <!-- modal -->
  <div class="modal fade" v-bind:id="id">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">×</span>
          </button>
          <h4 class="modal-title modal_floor_title">{{ title }}</h4>
        </div>
        <div class="modal-body clearfix">
          <table class="table table-bordered table-hover multi_table" role="grid">
            <thead>
              <!-- 必ず1件しかないが、Backend側で配列で受けるようになっているため合わせている -->
              <tr role="row" v-for="(item, index) in values">
                <th>{{ getLabel(item.type) }}</th>
              </tr>
            </thead>
            <tbody>
              <!-- 必ず1件しかないが、Backend側で配列で受けるようになっているため合わせている -->
              <tr role="row" v-for="(item, index) in values" @click="">
                <td width="100%" v-if="isEdit">
                  <input type="text" maxlength="32" class="form-control" :placeholder="getPlaceholder(item.type)" v-model="item.numberValue">
                </td>
                <td width="100%" class="pointer_events_none" v-if="!isEdit">
                  <input type="text" maxlength="32" class="form-control" :placeholder="getPlaceholder(item.type)" v-model="item.numberValue">
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="modal-footer" style="text-align: center">
          <button type="button" class="btn btn-default global_btn" data-dismiss="modal">閉じる</button>
          <button type="button" class="btn btn-info global_btn" @click="$emit('okButtonClick', index, values)" v-if="isEdit">OK</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ModalValidationView',
    props: {
      id: String,
      isEdit: Boolean,
      index: Number,
      title: String,
      type: Number,
      values: Array
    },
    data() {
      return {
        isUpdated: false
      };
    },
    methods: {

      /**
       * ラベル表示.
       *   FieldValidation.type によって判別する.
       */
      getLabel(type) {
        var result = '';
        switch(type) {
          case 1:
            result = '最大値';
            break;
          case 3:
            result = '最大文字数';
            break;
          default:
            break;
        }
        return result;
      },

      /**
       * プレースフォルダ表示.
       *   FieldValidation.type によって判別する.
       */
      getPlaceholder(type) {
        var result = '';
        switch(type) {
          case 1:
            result = '例）999999999';
            break;
          case 3:
            result = '例）512';
            break;
          default:
            break;
        }
        return result;
      },

      /**
       * バリデーション種別(1:MAX/2:MIN/3:MaxLength/4:MinLength/6:Pattern).
       *   ReportFieldDefinition.type によって判別する.
       */
      getType(type) {
        var result = 0;
        switch(type) {
          case 1:
          case 6:
          case 7:
            result = 3;
            break;
          case 3:
          case 9:
            result = 1;
            break;
          default:
            break;
        }
        return result;
      },

      /**
       * 初期設定.
       */
      init(type) {
        if (this.values) {
          this.values[0].type = this.getType(type);
        }
      },

      /**
       * 親コンポーネントから呼び出されるメソッド.
       */
      changeSelect(type) {
        this.init(type);
      }
    },
    mounted() {
      this.init(this.type);
    },
    updated() {
      if (!this.isUpdated) {
        this.init(this.type);
        this.isUpdated = true;
      }
    }
  }
</script>
