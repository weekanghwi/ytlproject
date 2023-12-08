<script lang="ts">
  import { onMount } from "svelte";
  import Chart, { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js/auto';
  import ChartDataLabels from 'chartjs-plugin-datalabels';

  export let selectedBand: string = '800M';
  export let SitecountChartData: any = null;
  let canvas: HTMLCanvasElement;
  let SiteCount: Chart;



  // selectedBand 또는 allData의 변화를 감지하고 차트를 업데이트
  $: {
    if (SitecountChartData && selectedBand) {
      updateChart();
    }
  };

  function updateChart() {
    const bandData = SitecountChartData.total_statistic_site_by_band.band[selectedBand];
    if (!bandData) return;
    const { region, count } = bandData;

    const regionColors: Record<string, string> = {
      Central: 'rgba(245, 40, 45, 0.8)',
      Northern: 'rgba(61,233,177, 0.8)',
      Southern: 'rgba(0,123,255, 0.8)',
      Eastern: 'rgba(120,123,255, 0.8)',
      Sabah: 'rgba(250,123,255, 0.8)',
      Sarawak: 'rgba(0,250,5, 0.8)'
    }

    const backgroundColors = region.map(r => regionColors[r]) || 'rgba(255, 255, 255, 0.8)'; // 기본 색상
    const borderColors = backgroundColors

    if (SiteCount) {
      SiteCount.data.labels = region;
      SiteCount.data.datasets[0].data = count;
      SiteCount.data.datasets[0].backgroundColor = backgroundColors;
      SiteCount.data.datasets[0].borderColor = borderColors;
      SiteCount.update();
    }
  }

  onMount(() => {
    const ctx = canvas.getContext("2d");
    if (ctx && !SiteCount) {
      Chart.register(ChartDataLabels);

      const centerTextPlugin = {
        id: 'centerText',
        afterDraw: (chart: Chart) => {
          if (chart.canvas.id !== 'siteCountChart') return;

          const { ctx } = chart;
          ctx.save();
          const centerX = chart.width / 2;
          const centerY = chart.height / 2;

          ctx.font = 'bold 16px Roboto';
          ctx.fillStyle = 'gray';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          ctx.fillText(selectedBand, centerX, centerY - 15);
          ctx.fillText('Site Count', centerX, centerY + 10);

          ctx.restore();
        }
      };

      // Chart.register(centerText)

      SiteCount = new Chart(ctx, {
        plugins: [ChartDataLabels, centerTextPlugin],
        type: "doughnut",
        data: {
          labels: [],
          datasets: [
            {
              label: "Site Count",
              data: [],
              borderColor: [],
              backgroundColor: [],
              borderWidth: 0,
              cutout: '60%',
              datalabels: {
                labels: {
                  value: {
                    align: 'center',
                    backgroundColor: function(ctx) {
                      var value = ctx.dataset.data[ctx.dataIndex];
                      return value > 0 ? 'white' : null
                    },
                    borderColor: 'white',
                    borderWidth: 2,
                    borderRadius: 2,
                    color: function(ctx) {
                      var value = ctx.dataset.data[ctx.dataIndex];
                      return value > 0 ? ctx.dataset.backgroundColor : 'white'
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
                weight: 'lighter',
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
    height: 200px;
  }
  canvas {
    height: 100% !important;
    width: 100% !important;
  }
</style>
<div class="chart-container">
  <canvas id='siteCountChart' bind:this={canvas}></canvas>
</div>
