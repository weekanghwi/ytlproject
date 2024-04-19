<script lang="ts">
  import { onMount } from "svelte";
  import Chart, { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js/auto';
  import ChartDataLabels from 'chartjs-plugin-datalabels';

  export let OverallData: any = null;

  let canvas: HTMLCanvasElement;
  let CellAvailOverallChartByBand: Chart;

  $: {
    if (OverallData) {
      updateChart();
    }
  };

  const regionColors: Record<string, string> = {
    '2.3GHz': 'rgba(7, 89, 133, 1)',
    '2.6GHz': 'rgba(2, 132, 199, 1)',
    '800M': 'rgba(56, 189, 248, 1)',
  }

  function updateChart() {
    const OverallChartData = OverallData.cellavaildownbyband.by_band;
    if (!OverallChartData) return;
    const {band, ratio} = OverallChartData

    const backgroundColors = band.map((bandName: string) => {
      return regionColors[bandName] || '#cccccc'
    });


    if (CellAvailOverallChartByBand) {
      CellAvailOverallChartByBand.data.labels = band;
      CellAvailOverallChartByBand.data.datasets[0].data = ratio;
      CellAvailOverallChartByBand.data.datasets[0].backgroundColor = backgroundColors;
      CellAvailOverallChartByBand.update();
    }
  }

  onMount(() => {
    const ctx = canvas.getContext("2d");
    if (ctx && !CellAvailOverallChartByBand) {
      Chart.register(ChartDataLabels);

      CellAvailOverallChartByBand = new Chart(ctx, {
        plugins: [ChartDataLabels],
        type: "doughnut",
        data: {
          labels: [],
          datasets: [
            {
              label: "Rate",
              data: [],
              borderColor: 'rgba(163, 230, 53, 0.1)',
              backgroundColor: [],
              borderRadius: 50,
              spacing: 3,
            },
          ],
        },
        options: {
          maintainAspectRatio: true,
          responsive: true,
          cutout: '90%',
          plugins: {
            legend: {
              display: false,
            },
            datalabels: {
              display: false,
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
    height: 130px;
  }
  canvas {
    height: 100% !important;
    width: 100% !important;
    z-index: 1000 !important;
  }
</style>
<div class="chart-container">
  <canvas id='siteCountChart' bind:this={canvas}></canvas>
</div>