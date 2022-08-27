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
        <div class="modal-body clearfix overflow_auto height_400">
          <table class="table table-bordered table-hover multi_table" role="grid">
            <thead>
              <tr role="row">
                <th v-if="isEdit"></th>
                <th>ラベル</th>
                <th v-if="isEdit"></th>
              </tr>
            </thead>
            <tbody>
              <tr role="row" v-for="(item, index) in values" @click="" v-bind:id="index" v-bind:class="{changed_background: (index == changedIndex)}">
                <!-- 表示順 -->
                <td width="10%" v-if="isEdit">
                  <button type="button" class="btn btn-default" @click.stop="onTappedUp(index)"><i class="fa fa-caret-up fa-lg"></i></button>&nbsp;
                  <button type="button" class="btn btn-default" @click.stop="onTappedDown(index)"><i class="fa fa-caret-down fa-lg"></i></button>
                </td>
                <!-- 表示順 -->
                <td width="85%" class="" v-if="isEdit">
                  <input type="text" maxlength="32" class="form-control" :placeholder="item.label" v-model="item.label">
                </td>
                <td width="85%" class="pointer_events_none" v-if="!isEdit">
                  <span v-html="getColumData(item.label)"></span>
                </td>
                <!-- 表示順 -->
                <td width="5%" v-if="isEdit">
                  <button type="button" v-bind:disabled="item.deletable" class="btn btn-danger" @click.stop="onTappedDelete(index)"><i class="fa fa-minus"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="box-body pull-right" v-if="isEdit">
            <button type="button" class="btn btn-success" @click.stop="onTappedAddNew"><i class="fa fa-plus"></i></button>
          </div>
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
    name: 'ModalSelectOptionView',
    props: {
      id: String,
      isEdit: Boolean,
      index: Number,
      title: String,
      values: Array
    },
    data() {
      return {
        changedIndex: null
      };
    },
    methods: {

      /**
       * 順番入れ替え ↑.
       */
      onTappedUp(index) {
        if (index != 0) {
          this.changedIndex = index - 1;
          const orizin = this.values[index];
          const targetOrizin = this.values[index - 1];
          this.values[index] = targetOrizin;
          this.values[index - 1] = orizin;
          this.values.splice();
          setTimeout(() => {
            this.changedIndex = null
          }, 700);
        }
      },

      /**
       * 順番入れ替え ↓.
       */
      onTappedDown(index) {
        if (index != (this.values.length - 1)) {
          this.changedIndex = index + 1;
          const orizin = this.values[index];
          const targetOrizin = this.values[index + 1];
          this.values[index] = targetOrizin;
          this.values[index + 1] = orizin;
          this.values.splice();
          setTimeout(() => {
            this.changedIndex = null
          }, 700);
        }
      },

      /**
       * 削除.
       */
      onTappedDelete(index) {
          this.values.splice(index, 1);
      },

      /**
       * 追加.
       */
      onTappedAddNew() {
        this.values.push({ 'id': '', 'label': '' });
      },
    },
    mounted() {

    },
    updated() {

    }
  }
</script>
