<template>
  <section class="ts_index_member">
    <h2 class="ts_heading" :class="{ts_homme_top: isHeadquartersMode||isSystemApprovalMode}">メンバー</h2>
    <div class="ts_index_buildings_container">
      <div class="ts_index_wrap cursor_pointer" @click="$router.push('/members/details/' + param.id)">
        <dl>
          <dt>メンバー名</dt>
          <dd>{{param.name}}</dd>
        </dl>
        <dl>
          <dt>権限</dt>
          <dd>{{getRoleName(param.role)}}</dd>
        </dl>
        <dl v-if="param.role!=5">
          <dt>業務カテゴリ</dt>
          <dd>
            <ul class="ts_index_member_links">
              <li v-if="getOperation(1)">
                <img src="~/assets/ts_index-member_links01.svg" alt="">
                <p>警備</p>
              </li>
              <li v-if="getOperation(2)">
                <img src="~/assets/ts_index-member_links02.svg" alt="">
                <p>清掃</p>
              </li>
              <!-- <li>
                <img src="~/assets/ts_index-member_links03.svg" alt="">
                <p>その他</p>
              </li> -->
            </ul>
          </dd>
        </dl>
      </div>
    </div>
  </section>
</template>
<script>
  export default {
    data() {
      return {
        roles: [],
        isHeadquartersMode: this.toBoolean(localStorage.getItem('is_headquarters_mode')),
        isSystemApprovalMode: this.toBoolean(localStorage.getItem('is_system_approval_mode')),
      }
    },
    props: {
      param: Object,
    },
    methods: {
      getOperation(id) {
        if (this.param.operations == '') {
          return false;
        }
        var op = this.param.operations.find(val => val.operationCategoryId == id);
        if (op != undefined) {
          return true;
        }
        return false;

      },
      getRoleName(id) {
        var op = this.roles.find(val => val.value == id);
        if (op != undefined) {
          return op.name;
        }
      },
      getRoleListRequest() {
        this.onSearch('/members/roles', null, null, res => {
          const list = [{name: null, value: null}];
          res.roles.forEach(function(role){
            list.push({name: role.name, value: role.id});
          });
          this.roles = list;
        });
      },
    },
    created() {
      this.getRoleListRequest();
    }
  }
</script>