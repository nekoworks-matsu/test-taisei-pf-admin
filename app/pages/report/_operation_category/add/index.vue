<template>
  <add-report-view :param="param" />
</template>

<script>
import AddReportView from "~/components/AddReportView";

export default {
  data() {
    return {
      error: '',
      itemInfo: '',
      tmpUpdatedAt: '',
      param: {
        title: '',
        member: '',
        columns: [
          { name: '報告日', column: 'reportedAt', type: 'datePicker', required: true },
          { name: '天候', column: 'weather', required: true, maxlength: 32 },
          { name: 'ビルオーナー', column: 'buildingOwner', maxlength: 64},
          { name: '報告責任者', column: 'reportedBy', type: 'select' ,required: true, options: [] },
          { name: '特記事項', column: 'notice', type: 'textarea', maxlength: 512 },
          { name: '依頼事項', column: 'comment', type: 'textarea', maxlength: 512 },
          { name: '報告書定義ID', column: 'reportDefinitionId', type: 'hiddenColmun'},
        ],
        init_val: {
          reportedAt: new Date(),
          reportedBy: parseInt(localStorage.getItem('member_id')),
          reportDefinitionId: parseInt(this.$route.params.operation_category),
        },
        api: '/reports',
      },
    };
  },
  components: {
    AddReportView
  },
  methods: {
    setReportTitle() {
      var report_list = JSON.parse(localStorage.getItem('report_list'));
      for (var i = 0; i < report_list.length; i++) {
        if (report_list[i].id == this.$route.params.operation_category) {
          this.param.title = '日報';
          this.param.operation = report_list[i].name.replace(/報告書/g, '');
          break;
        }
      }
    },
    getMembersInfoRequest() {
      let buildingId = localStorage.getItem('buildings_id');
      let api = '/buildings/'+ buildingId +'/members';
      var where = {"and":[{"operationTypeId": this.getOperationTypeId(this.$route.params.operation_category)}, {"role":{"neq":3}}]};
      var member = [];
      this.onSearch(api, null, where, val => {
        val.forEach(function(obj){
          // member.push({ name: obj.name,value: obj.id});
          member.push({name: obj.name, value: obj.id});
        });
        this.param.columns[3].options = member;
      }); 
    },
  },
  created() {
    const key = (parseInt(this.$route.params.operation_category) == 1) ? "Security:Report:create" : "Cleaning:Report:create";
    this.checkDisplayPermission(key, () => {
      this.setReportTitle();
      this.getMembersInfoRequest();
    });
  }
};
</script>
