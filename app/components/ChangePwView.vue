<template>
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper ts_content_wrapper">
    <!-- Content Header (Page header) -->
    <section class="content_head">
      <div class="ts_content_head">
        <div class="ts_breadcrumb">
          <ol>
            <li>マスタ情報</li>
            <li>メンバー一覧</li>
            <li>メンバー詳細</li>
            <li>メンバー編集</li>
            <li class="current">パスワード変更</li>
          </ol>
        </div>
        <h1 class="ts_content_heading">パスワード変更</h1>
      </div>
    </section>
    <!-- <section class="content-header">
      <h1>
        パスワード変更
        <small></small>
      </h1>
    </section> -->

    <!-- Main content -->
    <section class="content">

      <div class="box-group">

        <div class="box">
          <div class="box-body no-paddin">
            <form class="form-horizontal" style="margin:0;" autocomplete="off">
              <div v-if="itemInfo" class="callout callout-success"><p>{{itemInfo}}</p></div>
              <div class="box-body">
                <div class="form-group form_box_group required">
                  <div class="form_box_group_title">
                    <label class="control-label">新しいパスワード</label>
                  </div>
                  
                  <div class="form_box_group_field">
                    <input type="password" maxlength="32" class="form-control" id="pass_new" placeholder="パスワード（7文字以上32文字以下、半角英数字）" v-model="pass1" autocomplete="off">
                  </div>
                </div>
                <div class="form-group form_box_group required">
                  <div class="form_box_group_title">
                    <label class="control-label">新しいパスワード（確認）</label>
                  </div>
                  <div class="form_box_group_field">
                    <input type="password" maxlength="32" class="form-control" id="pass_confirm" placeholder="パスワード（確認）" v-model="pass2" autocomplete="off">
                  </div>
                </div>
              </div>
              <!-- /.box-body -->
              <div v-if="error" class="callout callout-danger err-info"><p>{{error}}</p></div>

              <div class="box-footer form_button_flex flex_right border_top">
                <button type="button" class="btn btn-default global_btn form_button_flex_item margin_right_auto" onclick="history.back()">キャンセル</button>
                <button type="button" class="btn btn-warning global_btn form_button_flex_item" @click="save">変更</button>
              </div>
              <!-- <div class="box-footer">
                <div class="no-padding pull-right">
                  <button type="button" class="btn btn-warning " @click="save">変 更</button>
                </div>
                <button type="button" class="btn btn-default" onclick="history.back()">キャンセル</button>
              </div> -->
              <!-- /.box-footer -->
            </form>
          </div>
          <!-- /.box-body -->
        </div>
        <!-- /.box -->

      </div>
      <!-- /.box-group -->

    </section>
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->
</template>

<script>
  export default {
    data() {
      return {
        pass1: '',
        pass2: '',
        error: '',
        itemInfo: ''
      }
    },
    props: {
      api: String,
      ok: String,
    },
    components: {
    },
    methods: {
      save() {
        let msg = [];
        if (this.pass1 === '') {
          msg.push('新しいパスワード ： 必須項目です');
        }
        if (this.pass2 === '') {
          msg.push('新しいパスワード（確認） : 必須項目です');
        }
        if ((this.pass1 !== '' && this.pass2 !== '') && this.pass1 !== this.pass2) {
          msg.push('パスワードが一致しません');
        }
        
        if (msg.length != 0) {
          this.error = msg.join('\n');
          return;
        }
        this.onPasswordUpdate(this.api, { password: this.pass1 }, (err, res) => {
          if (res && res.ok) {
            this.itemInfo = '更新完了';
            setTimeout(() => this.itemInfo = '', 1000);
            this.$router.push(this.ok);
          } else {
            this.error = this.getErrorMsg(res.body && res.body.error);
          }
        });
      },
    },
    created() {
      let pass_new = document.getElementById('pass_new');
      let pass_confirm = document.getElementById('pass_confirm');
      if(pass_new && pass_new.value) {
        pass_new.value = '';
      }
      if(pass_confirm && pass_confirm.value) {
        pass_confirm.value = '';
      }

    }
  }

</script>