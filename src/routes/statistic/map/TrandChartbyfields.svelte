<script lang="ts">
  import { onMount } from "svelte";
  import Chart from 'chart.js/auto';
  import ChartDataLabels from 'chartjs-plugin-datalabels';

  export let StatisticChartData: any = null;
  export let bands: string;
  export let regions: string;
  export let dyfields: string;

  let category: string = 'Region';
  let canvas: HTMLCanvasElement;
  let StatisticTrendChart: Chart;

  $: {
    if (StatisticChartData) {
      updateChart();
    }
  };

  function getChartDataBand(bandsData, bandParam) {
    const bandPrefix = bandParam.substring(0, 4);

    for (const key in bandsData) {
      if (key === bandPrefix) {
        return bandsData[key]
      }
    }
    return null;
  }

  function formatLabel(label) {
    return 'W' + label.split(' ').pop().slice(-2);
  }

  function updateChart() {
    if (!dyfields || !bands || !regions) return;
    const basedata = StatisticChartData[dyfields][category];
    const chartData = getChartDataBand(basedata, bands)[regions];
    if (!chartData) return;

    const backgroundColors = chartData.value.map(value => value < 99 ? 'rgba(245, 40, 45, 0.8)' : 'rgba(61, 233, 177, 0.8)')
    const borderColors = chartData.value.map(value => value < 99 ? 'rgba(245, 40, 145, 0.8)' : 'rgba(61, 233, 177, 0.8)');

    // const minYValue = Math.min(...chartData.value) - 4;

    if (StatisticTrendChart) {
      StatisticTrendChart.data.labels = chartData.weeknum.map(formatLabel);
      StatisticTrendChart.data.datasets[0].data = chartData.value;
      StatisticTrendChart.data.datasets[0].backgroundColor = backgroundColors;
      StatisticTrendChart.data.datasets[0].borderColor = borderColors;
      // StatisticTrendChart.options.scales.x.min = minYValue;
      StatisticTrendChart.update();
    }
  }

  onMount(() => {
    const ctx = canvas.getContext("2d");
    if (ctx && !StatisticTrendChart) {
      Chart.register(ChartDataLabels);

      StatisticTrendChart = new Chart(ctx, {
        plugins: [ChartDataLabels],
        type: "line",
        data: {
          labels: [],
          datasets: [
            {
              label: "Avg",
              data: [],
              borderColor: 'red',
              backgroundColor: 'white',
              pointStyle: 'circle',
              pointRadius: 14,
              pointHoverRadius: 18

            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            datalabels: {
              color: '#000000',
              font: {
                size: 10
              },
              formatter: function(value, context) {
                return value.toFixed(2);
              }
            }
          }
        }
      });
    }
  });
</script>

<style>
  .chart-container {
    height: 150px;
  }
  canvas {
    height: 100% !important;
  }
</style>
<div class="chart-container">
  <canvas bind:this={canvas}></canvas>
</div>