<script lang="ts">
  import { onMount } from 'svelte';
  import Chart, { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js/auto';
  import ChartDataLabels from 'chartjs-plugin-datalabels';

  export let OverallData: any = null; // 부모 컴포넌트에서 전달받은 데이터

  let canvas: HTMLCanvasElement;
  let x2OutHOOverallTrendChart: Chart;

  // selectedBand 또는 allData의 변화를 감지하고 차트를 업데이트
  $: {
    if (OverallData) {
      updateChart();
    }
  };

  function updateChart() {
    const TrendData = OverallData.x2outho_trend_all;
    if (!TrendData) return;
    const { weeknums, values } = TrendData;

    if (x2OutHOOverallTrendChart) {
      x2OutHOOverallTrendChart.data.labels = weeknums;
      x2OutHOOverallTrendChart.data.datasets[0].data = values;
      x2OutHOOverallTrendChart.update();
    }
  }

  onMount(() => {
    const ctx = canvas.getContext("2d");
    if (ctx && !x2OutHOOverallTrendChart) {
      Chart.register(ChartDataLabels);

      x2OutHOOverallTrendChart = new Chart(ctx, {
        plugins: [ChartDataLabels],
        type: "line",
        data: {
          labels: [],
          datasets: [
            {
              label: "Trend",
              data: [],
              fill: true,
              borderColor: 'rgba(7, 89, 133, 1)',
              backgroundColor: 'rgba(7, 89, 133, 0.1)',
              tension: 0.4,
              pointRadius: 0,
              pointHoverRadius: 8,
              pointHoverBackgroundColor: 'rgba(255, 255, 255, 1)',
              pointHoverBorderColor: 'rgba(7, 89, 133, 1)',
              datalabels: {
                display: false // 이 데이터셋의 라벨을 숨깁니다.
              }
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          scales: {
            x: {
              display: false
            },
            y: {
              display: false
            }
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              usePointStyle: true,
            },
          },
          hover: {
            mode: 'nearest',
            intersect: false,
          },
          interaction: {
            mode: 'x',
            intersect: false
          },
          elements: {
            line: {
              borderWidth: 2
            },
            point: {
              radius: 0,
              hoverRadius: 8,
              hoverBorderWidth: 3
            }
          }
        }
      });
    } else {
      console.error("Canvas context is not available or Chart is already initialized.")
    }
  });
  
</script>

<style>
  .chart-container {
    height: 150px;
  }
  canvas {
    height: 100% !important;
    width: 100% !important;
  }
</style>
<div class="chart-container">
  <canvas id='siteCountChart' bind:this={canvas}></canvas>
</div>
