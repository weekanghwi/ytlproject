<script lang="ts">
  import { onMount } from "svelte";
  import Chart, { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js/auto';
  import ChartDataLabels from 'chartjs-plugin-datalabels';

  export let CallDropGBRData: any = null;

  let canvas: HTMLCanvasElement;
  let CallDropFailSiteCellCountChart: Chart;

  $: {
    if (CallDropGBRData) {
      updateChart();
    }
  };

  const regionColors: Record<string, string> = {
    '2.3GHz': 'rgba(7, 89, 133, 1)',
    '2.6GHz': 'rgba(2, 132, 199, 1)',
    '800M': 'rgba(56, 189, 248, 1)',
  }

  function updateChart() {
    const RegionalTrendData = CallDropGBRData.fail_cell_count_byband;
    if (!RegionalTrendData) return;
    const {band, count} = RegionalTrendData

    const backgroundColors = band.map((bandName: string) => {
      return regionColors[bandName] || '#cccccc'
    });


    if (CallDropFailSiteCellCountChart) {
      CallDropFailSiteCellCountChart.data.labels = band;
      CallDropFailSiteCellCountChart.data.datasets[0].backgroundColor = backgroundColors;
      
      // first doughnut
      CallDropFailSiteCellCountChart.data.datasets[0] = {
        label: 'Cell',
        data: count,
        borderColor: 'rgba(15, 23, 42, 0.3)',
        backgroundColor: backgroundColors,
        cutout: '70%',
        borderRadius: 3,
        spacing: 1,
      };

      // second doughnut
      const secondData = CallDropGBRData.fail_site_count_byband;
      CallDropFailSiteCellCountChart.data.datasets[1] = {
        label: 'Site',
        data: secondData.count,
        borderColor: 'rgba(15, 23, 42, 0.3)',
        backgroundColor: backgroundColors,
        cutout: '70%',
        spacing: 1,
      };

      CallDropFailSiteCellCountChart.update();
    }
  }

  onMount(() => {
    const ctx = canvas.getContext("2d");
    if (ctx && !CallDropFailSiteCellCountChart) {
      Chart.register(ChartDataLabels);

      CallDropFailSiteCellCountChart = new Chart(ctx, {
        plugins: [ChartDataLabels],
        type: "doughnut",
        data: {
          labels: [],
          datasets: [
            {
              label: "Cell",
              data: [],
            },
            {
              label: "Site",
              data: [],
            },
          ],
        },
        options: {
          maintainAspectRatio: true,
          responsive: true,
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
    height: 140px;
  }
  canvas {
    height: 100% !important;
    width: 100% !important;
  }
</style>
<div class="chart-container">
  <canvas id='siteCountChart' bind:this={canvas}></canvas>
</div>