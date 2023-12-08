<script lang="ts">
  import { onMount } from "svelte";
  import Chart, { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js/auto';
  import ChartDataLabels from 'chartjs-plugin-datalabels';

  export let SitecountChartData: any = null;
  let canvas: HTMLCanvasElement;
  let SiteCount: Chart;



  // selectedBand 또는 allData의 변화를 감지하고 차트를 업데이트
  $: {
    if (SitecountChartData) {
      updateChart();
    }
  };

  function updateChart() {
    const bandData = SitecountChartData.sitecount_by_regionband['20'];
    console.log(bandData)
    if (!bandData) return;
    const { region, count } = bandData;

    const regionColors: Record<string, string> = {
      Central: 'rgba(253, 230, 138, 0.8)',
      Northern: 'rgba(252,211,77, 0.8)',
      Southern: 'rgba(251,191,36, 0.8)',
      Eastern: 'rgba(245,158,11, 0.8)',
      Sabah: 'rgba(217,119,6, 0.8)',
      Sarawak: 'rgba(180,83,9, 0.8)'
    }

    const backgroundColors = region.map(r => regionColors[r]) || 'rgba(255, 255, 255, 0.8)'; // 기본 색상
    const borderColors = backgroundColors

    if (SiteCount) {
      SiteCount.data.labels = region;
      SiteCount.data.datasets[0].data = count;
      SiteCount.data.datasets[0].backgroundColor = backgroundColors;
      SiteCount.data.datasets[0].borderColor = borderColors;
      SiteCount.options.cutout = '50%';
      SiteCount.update();
    }
  }

  onMount(() => {
    const ctx = canvas.getContext("2d");
    if (ctx && !SiteCount) {
      Chart.register(ChartDataLabels);

      SiteCount = new Chart(ctx, {
        plugins: [ChartDataLabels],
        type: "doughnut",
        data: {
          labels: [],
          datasets: [
            {
              label: "Count",
              data: [],
              borderColor: [],
              backgroundColor: [],
              borderWidth: 0,
              cutout: '60%',
              datalabels: {
                labels: {
                  value: {
                    align: 'center',
                    color: function(ctx) {
                      var value = ctx.dataset.data[ctx.dataIndex];
                      return value > 0 ? 'black' : 'white'
                    },
                    fomatter: function(value: any, ctx: any) {
                      return ctx.active ? ctx.chart.data.labels[ctx.dataIndex] : ctx.chart.data.labels[ctx.dataIndex]
                    },
                    padding: 1
                  }
                }
              }
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          indexAxis: 'y',
          plugins: {
            tooltip: {
              enabled: false
            },
            legend: {
              display: false,
            },
            datalabels: {
              color: 'white',
              display: function(ctx) {
                return ctx.dataset.data[ctx.dataIndex] > 10;
              },
              font: {
                weight: 'bolder',
              },
              offset: 0,
              padding: 0
            },
          },
        }
      });
    }
  });
</script>
<style>
  .chart-container {
    height: 160px;
  }
  canvas {
    height: 100% !important;
    width: 100% !important;
  }
</style>
<div class="chart-container">
  <canvas id='siteCountChart' bind:this={canvas}></canvas>
</div>
