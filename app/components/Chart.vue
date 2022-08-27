<script>
import { Bar } from 'vue-chartjs';

export default {
  extends: Bar,
  name: 'chart',
  props: {
    param: Object,
  },
  data () {
    return {
      data: {
        labels: ['1日 月','2日 火','3日 水','4日 木','5日 金','6日 土','7日 日','8日 月','9日 火','10日 水','11日 木','12日 金','13日 土','14日 日','15日 月','16日 火','17日 水','18日 木','19日 金','20日 土','21日 日','22日 月','23日 火','24日 水','25日 木','26日 金','27日 土','28日 日','29日 月','30日 火','31日 水'],
        datasets: [
          {
            label: '日次件数',
            data: [10, 5, 10, 2, 22, 8,4,4,5,0,2,12,5,20,2,4,5,6,0,0,0,2,4,5,1,5,12,0,1,3,2,0,20,10,11,2,4],
            backgroundColor: '#4DBBAA',
            borderColor: '#4DBBAA',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: false,
        scales: {
          xAxes: [{
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true,
              stepSize: 5,
            }
          }]
        }
      }
    }
  },
  mounted () {
    this.addPlugin({
      id: 'bar-plugin',
      afterDatasetsDraw: function (chart, easing) {
        // To only draw at the end of animation, check for easing === 1
        var ctx = chart.ctx;
        chart.data.datasets.forEach(function (dataset, i) {
            var meta = chart.getDatasetMeta(i);
            if (!meta.hidden) {
                meta.data.forEach(function (element, index) {
                    // Draw the text in black, with the specified font
                    ctx.fillStyle = 'rgb(0, 0, 0)';

                    var fontSize = 14;
                    var fontStyle = 'normal';
                    var fontFamily = 'Helvetica Neue';
                    ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);

                    // Just naively convert to string for now
                    var dataString = dataset.data[index].toString();
                    var label =  dataset.data[index].toString();
                    // Make sure alignment settings are correct
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';
                    
                    var padding = 5;
                    var position = element.tooltipPosition();
                    var positionY = position.y;
                    if (positionY < 334) {
                      positionY += 30;
                    }
                    ctx.fillText(dataString, position.x, positionY - (fontSize / 2) - padding);
                });
            }
        });
      }
    });
    this.renderChart(this.data, this.options)
  },
  created() {
     var labelArray = [];
    var dataArray = [];
    var mixArray = [];
    for (let i=0; i<this.param.labels.length; i++) {
      mixArray.push({"label":this.param.labels[i].replace("B","-"),"data":this.param.data[i]});
    }

    mixArray.sort(function(a,b){
      if (parseInt(a.label.replace("F","")) < parseInt(b.label.replace("F",""))) return -1;
      if (parseInt(a.label.replace("F","")) > parseInt(b.label.replace("F",""))) return 1;
      return 0;
    });

    for (let j=0; j<mixArray.length; j++) {
        labelArray.push(mixArray[j].label.replace("-","B"));
        dataArray.push(mixArray[j].data);
    }
    var labelCorrectArray = [];
    if (labelArray.length > 0) {
      if (labelArray[0].match("日")){
        for (let k=0; k<labelArray.length; k++) {
          if (k == labelArray.length-1) {
            labelCorrectArray.push(labelArray[k]);
          }else{
            if (k%2 == 0){
              labelCorrectArray.push(labelArray[k]);
            }else{
              labelCorrectArray.push("");
            }
          }
        }
      }else{
        labelCorrectArray = labelArray;
      }
    }
    this.data.labels = labelCorrectArray;
    this.data.datasets[0].data = dataArray;

    // this.data.labels = this.param.labels;
    // this.data.datasets[0].data = this.param.data;
  }
}
</script>