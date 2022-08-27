<script>
import { Pie } from 'vue-chartjs';
import { Doughnut } from 'vue-chartjs';
import 'chartjs-plugin-colorschemes';

// Chart.plugins.register({
//     afterDatasetsDraw: function (chart, easing) {
//         // To only draw at the end of animation, check for easing === 1
//         var ctx = chart.ctx;

//         chart.data.datasets.forEach(function (dataset, i) {
//             var meta = chart.getDatasetMeta(i);
//             if (!meta.hidden) {
//                 meta.data.forEach(function (element, index) {
//                     // Draw the text in black, with the specified font
//                     ctx.fillStyle = 'rgb(0, 0, 0)';

//                     var fontSize = 16;
//                     var fontStyle = 'normal';
//                     var fontFamily = 'Helvetica Neue';
//                     ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);

//                     // Just naively convert to string for now
//                     var dataString = dataset.data[index].toString();
//                     var label =  dataset.data[index].toString();
//                     // Make sure alignment settings are correct
//                     ctx.textAlign = 'center';
//                     ctx.textBaseline = 'middle';

                    
//                     var padding = 5;
//                     var position = element.tooltipPosition();
//                     if (dataString != "0") {
//                     ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding);
//                     }
//                 });
//             }
//         });
//     }
// });

export default {
  extends: Doughnut,
  name: 'ciclechart',
  props: {
    param: Object,
  },
  data () {
    return {
      data: {
        labels: [],
        datasets: [
          {
            data: [],
            borderColor: 'transparent',
            backgroundColor: ['#55D8FE','#4DBBAA','#FF8373','#FFC40D','#C4E82D','#F9F98A','#FF8A3B','#499AFC','#9E84EF','#D1CFBF'],
          }
        ]
      },
      options: {
        responsive: false,
        legend: {
          position: 'right',
          labels : {
            fontSize: 14,
          }
        }
      }
    }
  },
  methods: {
    reRenderChart() {
      this.$data._chart.destroy();
      setTimeout(() => this.reRendaer(), 100)
      // this.renderChart(this.data, this.options)
    },
    reRendaer(){
      this.data.datasets[0].data = this.param.data;
      this.renderChart(this.data, this.options)
    }
  },
  mounted () {
    this.addPlugin({
      id: 'my-plugin',
      afterDatasetsDraw: function (chart, easing) {
        // To only draw at the end of animation, check for easing === 1
        var ctx = chart.ctx;
        chart.data.datasets.forEach(function (dataset, i) {
            var meta = chart.getDatasetMeta(i);
            if (!meta.hidden) {
                meta.data.forEach(function (element, index) {
                    // Draw the text in black, with the specified font
                    ctx.fillStyle = 'rgb(0, 0, 0)';

                    var fontSize = 16;
                    var fontStyle = 'normal';
                    var fontFamily = 'Helvetica Neue';
                    ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);

                    // Just naively convert to string for now
                    var dataString = dataset.data[index].toString();
                    var label =  dataset.data[index].toString();
                    // Make sure alignment settings are correct
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    
                    var padding = 5;
                    var position = element.tooltipPosition();
                    if (dataString != "0") {
                      ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding);
                    }
                });
            }
        });
      }
    });
    this.renderChart(this.data, this.options);
  },
  created() {
    var labelArray = [];
    var dataArray = [];
    for (let i=0; i<this.param.labels.length; i++) {
      // if (this.param.data[i] != 0){
        labelArray.push(this.param.labels[i]);
        dataArray.push(this.param.data[i]);
      // }
    }
    this.data.labels = labelArray;
    this.data.datasets[0].data = dataArray;
  }
}
</script>