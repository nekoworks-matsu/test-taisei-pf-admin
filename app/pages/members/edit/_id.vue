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
            <li>メンバー一覧</li>
            <li>メンバー詳細</li>
            <li class="current">メンバー編集</li>
          </ol>
        </div>
        <h1 class="ts_content_heading">メンバー編集</h1>
      </div>
    </section>
    <!-- <section class="content-header">
      <h1>
        メンバー編集
        <small></small>
        <div class="pull-right">
          <button type="button" class="btn btn-default width_140" @click="onTransitionButton('/members/details/' + item.id)">キャンセル</button>
        </div>
      </h1>
    </section> -->

    <!-- Main content -->
    <section class="content">
      <div class="box-group">
        <div class="box">
          <!-- <div class="box-header with-border">
            <h3 class="box-title with-border">詳細情報</h3>
          </div> -->
          <!-- /.box-header -->
          <div class="box-body no-paddin">
            <form class="form-horizontal" style="margin:0;">
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

                <div class="form-group form_box_group required">
                  <div class="form_box_group_title">
                    <label class="control-label">権限</label>
                  </div>
                  <div class="form_box_group_field">
                    {{setRoleOptionSelect()}}
                    <select class="form-control" v-model="item.role" v-if="this.checkItemPermission('Master:Member:update:role')">
                      <option v-bind:value="opt.value" v-for="opt in authority_id_options" >{{opt.name}}</option>
                    </select>
                    <select class="form-control" v-model="item.role" v-else-if="!this.checkItemPermission('Master:Member:update:role')" disabled>
                      <option v-bind:value="opt.value" v-for="opt in authority_id_options" >{{opt.name}}</option>
                    </select>
                  </div>
                </div>

                <div class="form-group form_box_group required" v-if="isSystemApprovalMode&&item.role!=5">
                  <div class="form_box_group_title">
                    <label class="control-label">契約会社</label>
                  </div>
                  <div class="form_box_group_field">
                    <select class="form-control" v-model="item.companyId" @change=changedCompany>
                      <option v-bind:value="opt.value" v-for="opt in companies_id_options" >{{opt.name}}</option>
                    </select>
                  </div>
                </div>

                <div class="form-group form_box_group required">
                  <div class="form_box_group_title">
                    <label class="control-label">メンバー名</label>
                  </div>
                  <div class="form_box_group_field">
                    <input type="text" maxlength="32" class="form-control" id v-model="item.name"/>
                  </div>
                </div>

                <div class="form-group form_box_group required" v-if="item.role!=5">
                  <div class="form_box_group_title">
                    <label class="control-label">業務カテゴリ</label>
                  </div>
                  <div class="form_box_group_field">
                    <div  v-for="cnt in operations">
                      <label class="control control_checkbox">
                        <input type="checkbox" @change="createRequestMultiCheckbox('operations', cnt.id)" name="operations" v-bind:id="'operations' + cnt.id">
                        <div class="control_indicator"></div>
                      </label>
                      <label class="work_position" v-bind:for="'operations' + cnt.id">{{cnt.name}}</label>
                    </div>
                  </div>
                </div>

                <div class="form-group form_box_group required" v-if="item.role!=5">
                  <div class="form_box_group_title">
                    <label class="control-label">業務対象ビル</label>
                  </div>
                  <div class="form_box_group_field">
                    {{createMultiForm('buildingIds')}}
                    {{setOptionsSelectes(item.companyId, 'buildingIds')}}
                    <div v-for="(foo, index) in getIndexNum(item.buildingIds)" :class="[{'display_flex': index!==0}, {'margin_top_8': index!==0}]">
                      <select class="form-control" v-model="item['buildingIds'][index]" @input="inputForm($event, index, 'buildingIds')" v-if="checkItemPermission('Master:Member:update:buildingIds')"  v-bind:disabled="item.companyId==null">
                        <option :value="opt.value" v-for="opt in building_id_options" >{{opt.name}}</option>
                      </select>
                      <span class="input-group-btn width_auto">
                        <button type="button" class="btn btn-danger btn-flat height_max" @click="onRemoveForm(index, 'buildingIds')" v-if="index!==0&&checkItemPermission('Master:Member:update:buildingIds')"  v-bind:disabled="item.companyId==null">
                          <i class="fa fa-minus"></i>
                        </button>
                      </span>

                      <select class="form-control" v-model="item['buildingIds'][index]" @input="inputForm($event, index, 'buildingIds')" disabled v-if="!checkItemPermission('Master:Member:update:buildingIds')">
                        <option :value="opt.value" v-for="opt in building_id_options" >{{opt.name}}</option>
                      </select>
                    </div>
                    <button type="button" class="btn btn-success pull-right margin_top_8" @click="onAddForm('buildingIds')" v-if="checkItemPermission('Master:Member:update:buildingIds')" v-bind:disabled="item.companyId==null">
                      <i class="fa fa-plus"></i>
                    </button>
                  </div>
                </div>

                <div class="form-group form_box_group required">
                  <div class="form_box_group_title">
                    <label class="control-label">アカウントID</label>
                  </div>
                  <div class="form_box_group_field">
                    <input type="text" maxlength="256" class="form-control" id placeholder="半角英数字" v-model="item.loginId"/>
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">パスワード</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">
                      ***********
                      （<router-link :to="'/members/change_pw/'+$route.params.id">変更</router-link>）
                    </div>
                  </div>
                  
                </div>
                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">メールアドレス</label>
                  </div>
                  <div class="form_box_group_field">
                    <input type="text" maxlength="256" class="form-control" id v-model="item.email"/>
                  </div>
                </div>

                <div class="form-group form_box_group required">
                  <div class="form_box_group_title">
                    <label class="control-label">利用設定</label>
                  </div>
                  <div class="form_box_group_field">
                    <select class="form-control" v-model="item.activated" v-if="this.checkItemPermission('Master:Member:update:activated')">
                      <option v-bind:value="opt.value" v-for="opt in use_setup_options">{{opt.name}}</option>
                    </select>
                    <select class="form-control" v-model="item.activated" v-else-if="!this.checkItemPermission('Master:Member:update:activated')" disabled>
                      <option v-bind:value="opt.value" v-for="opt in use_setup_options">{{opt.name}}</option>
                    </select>
                  </div>
                </div>

                <div class="form-group form_box_group" v-if="item.role==3">
                  <div class="form_box_group_title">
                    <label class="control-label" for="requestSet_approveNotificationDefinition">報告書申請通知メール受信設定</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">
                      <label class="control control_checkbox">
                        <input type="checkbox" name="continuation" v-bind:id="'requestSet_approveNotificationDefinition'" v-model="continuationValue" @change="createRequestSetCheckbox('requestSet_approveNotificationDefinition', 'approveNotificationDefinition', 'notificationActive')">
                        <div class="control_indicator"></div>
                      </label>
                    </div>
                  </div>
                </div>
                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">登録日時</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">{{df(item.createdAt)}}</div>
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">更新日時</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">{{df(this.tmpUpdatedAt)}}</div>
                  </div>
                  
                </div>
              </div>
              <!-- /.box-body -->
              <div v-if="itemInfo" class="callout callout-success">
                <p>{{itemInfo}}</p>
              </div>
              <div v-if="error" class="callout callout-danger err-info">
                <p>{{error}}</p>
              </div>
              <div class="box-footer form_button_flex flex_right border_top">
                <button type="button" class="btn btn-danger global_btn form_button_flex_item margin_right_auto" @click="onDeleteFunc()" v-if="(this.checkMenuPermission('Master:Member:delete'))&&memberId!=item.id">削除</button>
                <button type="button" class="btn btn-default global_btn form_button_flex_item" @click="onTransitionButton('/members/details/' + $route.params.id)">キャンセル</button>
                <button type="button" class="btn btn-warning global_btn form_button_flex_item" @click="onUpdateButton" v-if="this.checkMenuPermission('Master:Member:update')">保存</button>
              </div>
              <!-- /.box-footer -->
            </form>
          </div>
          <!-- /.box-body -->
        </div>
        <!-- /.box -->
      </div>
      <template>
        <modal-alert-view　ref="alert" :id="'modal_alert'" :param="alert" @onconfirm="deleteFunc"></modal-alert-view>
      </template>
      <!-- /.box-group -->
    </section>
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->
</template>

<script>
import Loading from 'vue-loading-overlay';
import ModalAlertView from '~/components/ModalAlertView'
import 'vue-loading-overlay/dist/vue-loading.css';
import { event } from '~/plugins/events.js'
export default {
  data() {
    return {
      api: "/members",
      tmpUpdatedAt: "",
      isHeadquartersMode: this.toBoolean(localStorage.getItem('is_headquarters_mode')),
      isSystemApprovalMode: this.toBoolean(localStorage.getItem('is_system_approval_mode')),
      role: Number(localStorage.getItem('role')),
      memberId: localStorage.getItem('member_id'),
      authority_id_options: [],
      use_setup_options: [
        { name: "利用可能", value: true },
        { name: "利用不可", value: false },
      ],
      companies_id_options: [],
      building_id_options: [],
      operations: [],
      error: "",
      itemInfo: "",
      fullpage: true,
      continuationValue: true,
      selectCompanyId: '',
      beforeCompanyId: null,
      alert: {
        title: 'test',
        message: '',
        note: '',
        isConfirm: false,
      },
      param: {
          columns: [
            { name: 'メンバー名', column: 'name' },
            { name: '権限', column: 'role' },
            { name: '業務カテゴリ', column: 'operations' },
            { name: '契約会社', column: 'companyId' },
            { name: '業務対象ビル', column: 'buildingIds' },
            { name: 'メールアドレス', column: 'email' },
            { name: 'アカウントID', column: 'loginId' },
            { name: '利用設定', column: 'activated' }
          ]
        },
      item: {}
    };
  },
  components: {
    Loading,
    ModalAlertView
  },
  methods: {
    /**
     * メンバー情報取得
     */
    getMemberInfoRequest() {
      this.onRead(this.api, "", data => {
        this.item.email = data.member.email;
        this.item.loginId = data.member.loginId;
        this.item.name = data.member.name;
        this.item.id = data.member.id;
        this.$set(this.item, 'role', data.member.role);
        this.item.activated = data.member.activated;
        this.tmpUpdatedAt = data.member.updatedAt;
        this.item.createdAt = data.member.createdAt;
        this.$set(this.item, 'companyId', data.member.companyId);
        this.selectCompanyId = data.member.companyId;
        if (this.selectCompanyId != null) {
          if (this.operations.length <= 0) {
            this.getOperationCategoriesRequest('/companies/'+this.selectCompanyId+'/operation-categories', true);            
          }
        }
        this.item.buildingIds = this.normalizationRequestList(data.buildings, "id");
        this.item.approveNotificationDefinition = {notificationActive: this.inputNotificationCheck(data.approveNotificationDefinition)};
        this.onSearch('/companies/'+this.item.companyId+'/operation-types', null, null, op => {
            this.inputOperationCheck(this.normalizationRequestList(data.memberOperationCategories, "operationType"));
        });
        if (!this.isSystemApprovalMode){
          this.getBuildingsRequest("/buildings");
        }

      });
    },
    getBuildingsRequest(api) {
      var companyId = localStorage.getItem('company_id');
      if (!this.isSystemApprovalMode) {
        if (this.item.companyId != null) {
          return;
        }
        this.item.companyId = parseInt(companyId);
      } else {
        if (this.selectCompanyId != companyId) {
          // this.item[column] = [""];
        } else {
          return;
        }
      }
      this.selectCompanyId = companyId;
      var where = {"and":[{"companyId": companyId}]};
      this.onSearch(api, null, where, val => {
        const list = [{ name: "", value: "" }];
        val.forEach(function(obj) {
          list.push({ name: obj.name,value: obj.id });
        });
        this.building_id_options = list;
      });
    },
    changedCompany(){
      this.operations = [];
      if (this.item.companyId != null) {
        this.getOperationCategoriesRequest('/companies/'+this.item.companyId+'/operation-categories',false);
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
        this.getMemberInfoRequest();
      });
    },
    onUpdateButton() {
      const operations_list = [];
      if (this.item.operations != undefined) {
        for (var i = 0; i < this.item.operations.length; i++) {
          if(this.item.operations[i] > 0){
            operations_list.push(this.item.operations[i]);
          }
        }
      }

      this.onUpdate(this.api, this.normalizationRequestData(), (err, res) => {
        if (res && res.ok) {
          this.error = "";
          this.itemInfo = "更新完了";
          setTimeout(() => (this.itemInfo = ""), 3000);
          this.item.buildingIds = Array.from(new Set(this.item.buildingIds));
          this.tmpUpdatedAt = res.body.member.updatedAt;
          //画面リロード
          if(res.body.member.loginId == localStorage.getItem('userid') ){
            localStorage.setItem('username', res.body.member.name);
            localStorage.setItem('role', this.getAuthority(res.body.member.role));
            event.emit('login-update');
          }
        } else if (err) {
          this.error = this.getErrorMsg2(res, this.param.columns);
          return;
        }
      });
    },
    createMultiForm(key) {
      if (this.item[key] === undefined) {
        this.$set(this.item, key,[""]);
      }
    },
    onAddForm(key) {
      this.item[key].push("");
    },
    onRemoveForm(index, key) {
      this.item[key].splice(index, 1);
    },
    inputForm(ele, index, key) {
      this.item[key].splice(index, 1, Number(ele.target.value));
    },
    getIndexNum(columns) {
      if (columns === undefined) {
        return 0;
      }
      if (columns.length !== 0) {
        return columns.length;
      }
      return 1;
    },
    displayValue(index, key) {
      return this.item[key][index];
    },
    /**
     * 業務名取得
     */
    getOperationName(api, operations, operationCategories, cnt) {
      if (operationCategories.length == cnt) {
        this.operations = operations;
        this.operations.splice();
      } else {
        this.req(api + '/' + operationCategories[cnt].operationTypeId, 'get', null, (err, res) => {
          var find = operations.find(val => val.id == operationCategories[cnt].operationTypeId);
          if (find == undefined) {
            operations.push({name: res.body.name, id: operationCategories[cnt].operationTypeId});
          }
          this.getOperationName(api, operations, operationCategories, cnt + 1);
        });
      }
    },
    /**
      * マスタデータに定義されている業務の取得
      */
    getOperationCategoriesRequest(api, getCompany) {
      var operations = [];
      this.req(api, 'get', null, (err, res) => {
        this.getOperationName('/companies/'+localStorage.getItem("company_id")+'/operation-types', [], res.body, 0);
        var find;
        for (var i = 0; i < res.body.length; i++) {
          find = operations.find(val => val.id == res.body[i].operationTypeId);
          if (find == undefined) {
            operations.push({ id: res.body[i].operationTypeId, name: res.body[i].reportName.replace('報告書', '') });
          }
        }
        this.operations = operations;
        if (getCompany) {
          this.getCompaniesListRequest('/companies');          
        }
      });
    },
    /**
      * type = multiCheckboxのリクエスト作成
      */
    createRequestMultiCheckbox(key, id) {
      if (!Array.isArray(this.item[key])) {
        this.item[key] = [];
        this.item[key].push(id);
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
      return;
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
     * 配列でリクエストするデータの正規化
     */
    normalizationRequestList(data, name) {
      var list = [];
      data.forEach(function(obj) {
        list.push(obj[name])
      })
      return list;
    },
    /**
      * 業務にチェックを入れる(get時)
      */
    inputOperationCheck(state) {
      this.item.operations = [];
      var operations_list = document.getElementsByName("operations");
      for (var i = 0; i < operations_list.length; i++) {
        for (var j = 0; j < state.length; j++) {
          if (("operations" + state[j].id) == operations_list[i].id) {
            operations_list[i].checked = true;
            this.item.operations.push(state[j].id);
          }
        }
      }
    },
    inputNotificationCheck(state) {
      if (this.item.role == 3) {
        if (state == undefined) {
          this.continuationValue = false;
          return false;
        } else {
          this.continuationValue = state.notificationActive;
          return state.notificationActive;
        }
      } else {
        this.continuationValue = false;
        return false;
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
    normalizationRequestData() {
      if (this.item.role != "3") {
        this.item.approveNotificationDefinition = {notificationActive: false};
        this.continuationValue = false;
      }
      for (var i = 0; i < Object.keys(this.item).length; i++) {
        if (this.item[Object.keys(this.item)[i]] != null && Array.isArray(this.item[Object.keys(this.item)[i]])) {
          this.removeNullDataFromRequestData(Object.keys(this.item)[i])
        }
      }
      var sendItems = Object.assign({}, this.item);
      delete sendItems["createdAt"];
      return sendItems;
    },
    setOptionsSelectes(companyId, column) {
      if (!this.isSystemApprovalMode) {
        if (this.item.companyId != null) {
          return;
        }
        companyId = localStorage.getItem('company_id');
        this.item.companyId = parseInt(companyId);
      } else {
        if (companyId == undefined) {
          // this.item[column] = [""];
          return;
        }
        if (this.selectCompanyId != companyId) {
          this.item[column] = [""];
        } else {
          if (!((this.beforeCompanyId == undefined) && (companyId != undefined))) {
            this.beforeCompanyId = companyId;
            return;
          }
          this.beforeCompanyId = companyId;
        }
      }
      this.selectCompanyId = companyId;
      var that = this;
      var where = {"and":[{"companyId": companyId}]};
      this.onSearch('/buildings', null, where, (val) => {
        this.param.columns.forEach(function(item){
          if (item.column == column) {
            var list = [{name: "", value: ""}];
            val.forEach(function(obj){
              list.push({ name: obj.name, value: obj.id});
            });
            that.building_id_options = list;
           // item.options = list;
            return;
          }
        });
      })
    },
    setRoleOptionSelect(){
      if(this.item.role == 5) {
        this.item.buildingIds = [];
        this.item.companyId = null;
        this.item.operations = [];
      }
    },
    getRoleListRequest() {
      this.onSearch('/members/roles', null, null, res => {
        const list = [];
        res.roles.forEach(function(role){
          list.push({name: role.name, value: role.id});
        });
        this.authority_id_options = list;
      });
    },
    deleteFunc() {
      this.onDelete(this.api, '/members');
    },
    onDeleteFunc() {
      this.alert.title = '';
      this.alert.message = 'こちらのデータを削除いたします。<br>よろしいでしょうか？<br>';
      this.alert.note = '※この操作は取り消すことはできません。'
      this.alert.isConfirm = true;
      $('#modal_alert').modal('show')
    }
  },
  created() {
    const key = "Master:Member:update";
    this.checkDisplayPermission(key, () => {
      var api_url = "/members/" + this.$route.params.id;
      this.getCompaniesListRequest('/companies')
      this.getRoleListRequest();
    });
  }
};
</script>
