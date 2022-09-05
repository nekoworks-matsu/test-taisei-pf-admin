<template>
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper ts_content_wrapper">
    <loading
      :active.sync="loading"
      :can-cancel=false
      :is-full-page="fullpage"></loading>
    <!-- Content Header (Page header) -->
    <section class="content_head">
      <div class="ts_content_head" v-if="checkMenuPermission('Master:Member:create')">
        <div class="button_header">
          <section>
            <div class="ts_breadcrumb">
              <ol>
                <li>マスタ情報</li>
                <li>メンバー一覧</li>
                <li class="current">メンバー詳細</li>
              </ol>
            </div>
            <h1 class="ts_content_heading">メンバー詳細</h1>
          </section>
          <div class="button_header_btn">
            <button type="button" class="btn btn-info global_btn" @click="onTransitionButton('/members/edit/' + item.id)">編集</button>
          </div>
        </div>  
      </div>
      <div class="ts_content_head" v-if="!checkMenuPermission('Master:Member:create')">
        <div class="button_header">
          <section>
            <div class="ts_breadcrumb">
              <ol>
                <li>マスタ情報</li>
                <li class="current">メンバー情報</li>
              </ol>
            </div>
            <h1 class="ts_content_heading">メンバー情報</h1>
          </section>
          <div class="button_header_btn" v-if="!isRemoveEdit">
            <button type="button" class="btn btn-info global_btn" @click="onTransitionButton('/members/edit/' + item.id)">編集</button>
          </div>
        </div>  
      </div>
    </section>

    <!-- <section class="content-header">
      <h1 v-if="checkMenuPermission('Master:Member:create')">
        メンバー詳細
        <small></small>
        <div class="pull-right" v-if="isEdit">
          <button type="button" class="btn btn-info width_140" @click="onTransitionButton('/members/edit/' + item.id)">編 集</button>
        </div>
      </h1>
      <h1 v-if="!checkMenuPermission('Master:Member:create')">
        メンバー情報
        <small></small>
        <div class="pull-right">
          <button type="button" class="btn btn-info width_140" @click="onTransitionButton('/members/edit/' + item.id)">編 集</button>
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
            <form class="form-horizontal　form_box">
              <div class="box-body">
                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">ID</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">{{item.id}}</div>
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">権限</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">{{getRolesName(item.role)}}</div>
                  </div>
                </div>

                <div class="form-group form_box_group" v-if="isSystemApprovalMode&&item.role!=5">
                  <div class="form_box_group_title">
                    <label class="control-label">契約会社</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">{{getCompanyName(item.companyId)}}</div>
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">メンバー名</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">{{item.name}}</div>
                  </div>
                </div>

                <div class="form-group form_box_group" v-if="item.role!=5">
                  <div class="form_box_group_title">
                    <label class="control-label">業務カテゴリ</label>
                  </div>
                  <div class="form_box_group_field">
                    <div  v-for="cnt in operations">
                      <label class="control control_checkbox">
                        <input type="checkbox" @change="createRequestMultiCheckbox('operations', cnt.id)" name="operations" v-bind:id="'operations' + cnt.id" disabled>
                        <div class="control_indicator"></div>
                      </label>
                      <label class="work_position" v-bind:for="'operations' + cnt.id">{{cnt.name}}</label>
                    </div>
                  </div>
                </div> 

                <div class="form-group form_box_group" v-if="item.role!=5">
                  <div class="form_box_group_title">
                    <label class="control-label">業務対象ビル</label>
                  </div>
                  <div class="form_box_group_field">
                    {{createMultiForm('buildingIds')}} 
                    <div v-for="(item, index) in item.buildingIds" :class="[{'display_flex': index!==0}, {'margin_top_8': index!==0}]">
                      <div class="item-text">{{getBuildingName(item)}}</div>
                    </div>
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">アカウントID</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">{{item.loginId}}</div>
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">パスワード</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">
                      ***********
                    </div>
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">メールアドレス</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">{{getColumData(item.email)}}</div>
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">利用設定</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">{{getActivatedName(item.activated)}}</div>
                  </div>
                </div>

                <div class="form-group form_box_group" v-if="item.role==3">
                  <div class="form_box_group_title">
                    <label class="control-label" for="requestSet_approveNotificationDefinition">報告書申請通知メール受信設定</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">
                      <label class="control control_checkbox">
                        <input type="checkbox" name="continuation" v-bind:id="'requestSet_approveNotificationDefinition'" v-model="continuationValue" @change="createRequestSetCheckbox('requestSet_approveNotificationDefinition', 'approveNotificationDefinition', 'notificationActive')" disabled>
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
              <!-- /.box-footer -->
              <div class="box-footer form_button_flex flex_center border_top" v-if="isHeadquartersMode || isSystemApprovalMode">
                <button type="button" class="btn btn-default global_btn form_button_flex_item" @click="onTransitionButton('/members')">戻る</button>
              </div>
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
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import { event } from '~/plugins/events.js'
export default {
  data() {
    return {
      api: "/members",
      tmpUpdatedAt: "",
      isHeadquartersMode: this.toBoolean(localStorage.getItem('is_headquarters_mode')),
      isSystemApprovalMode: this.toBoolean(localStorage.getItem('is_system_approval_mode')),
      isEdit: true,
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
      param: {
          columns: [
            { name: 'メンバー名', column: 'name' },
            { name: '権限', column: 'role' },
            { name: '業務カテゴリ', column: 'operations' },
            { name: 'メールアドレス', column: 'email' },
            { name: 'アカウントID', column: 'loginId' },
            { name: '業務対象ビル', column: 'buildingIds' },
            { name: '利用設定', column: 'activated' }
          ]
        },
      item: {}
    };
  },
  components: {
    Loading
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
        this.item.companyId = data.member.companyId;
        this.item.buildingIds = this.normalizationRequestList(data.buildings, "id");
        this.item.approveNotificationDefinition = {notificationActive: this.inputNotificationCheck(data.approveNotificationDefinition)};
         this.onSearch('/companies/'+this.item.companyId+'/operation-types', null, null, op => {
            this.inputOperationCheck(this.normalizationRequestList(data.memberOperationCategories, "operationType"));
        });
        if (!this.isSystemApprovalMode && data.member.role == 5) {
          this.isEdit = false;
        }
      });
    },
    getBuildingsRequest(api) {
      this.onSearch(api, null, null, val => {
        const list = [{ name: "", value: "" }];
        val.forEach(function(obj) {
          list.push({ name: obj.name,value: obj.id });
        });
        this.building_id_options = list;

        this.getMemberInfoRequest();
      });
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
        this.getBuildingsRequest("/buildings");
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
    getBuildingName(id) {
      var name = this.building_id_options.find(val => val.value == id);
      if (name != undefined) {
        return name.name;
      }
    },
    getCompanyName(id) {
      var name = this.companies_id_options.find(val => val.value == id);
      if (name != undefined) {
        return name.name;
      }
    },
    getActivatedName(flag) {
      if (flag) {
        return '利用可能';
      } else {
        return '利用不可';
      }
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
    getOperationCategoriesRequest(api) {
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
        this.getCompaniesListRequest('/companies');  
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
      var operations_list = document.getElementsByName("operations");
      for (var i = 0; i < operations_list.length; i++) {
        for (var j = 0; j < state.length; j++) {
          if (("operations" + state[j].id) == operations_list[i].id) {
            operations_list[i].checked = true;
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
    getRoleListRequest() {
      this.onSearch('/members/roles', null, null, res => {
        const list = [];
        res.roles.forEach(function(role){
          list.push({name: role.name, value: role.id});
        });
        this.authority_id_options = list;
      });
    },
    getRolesName(id) {
      var op = this.authority_id_options.find(val => val.value == id);
      if (op != undefined) {
        return op.name;
      }
    }
  },
  created() {
    const key = "Master:Member:view";
    this.checkDisplayPermission(key, () => {
      var api_url = "/members/" + this.$route.params.id;
      this.getOperationCategoriesRequest('/companies/'+localStorage.getItem("company_id")+'/operation-categories');
      this.getCompaniesListRequest('/companies');  
      this.getRoleListRequest();
    });
  }
};
</script>
