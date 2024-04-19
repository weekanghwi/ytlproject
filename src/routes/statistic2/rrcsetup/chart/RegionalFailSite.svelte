<script lang="ts">
  import { onMount } from "svelte";
  import Chart, { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js/auto';
  import ChartDataLabels from 'chartjs-plugin-datalabels';

  export let RRCSetupData: any = null;

  let canvas: HTMLCanvasElement;
  let RegionalFailSiteChart: Chart;

  $: {
    if (RRCSetupData) {
      updateChart();
    }
  };

  const bandColors: Record<string, string> = {
    '2.3GHz': 'rgba(7, 89, 133, 1)',
    '2.6GHz': 'rgba(2, 132, 199, 1)',
    '800M': 'rgba(56, 189, 248, 1)',
  }

  function updateChart() {
    const RRCSetupFailClusterData = RRCSetupData.fail_site_count_byband;
    if (!RRCSetupFailClusterData) return;
    const band = RRCSetupFailClusterData.band
    const count = RRCSetupFailClusterData.count

    const backgroundColors = band.map((itemName: string) => {
      return bandColors[itemName] || '#cccccc'
    });


    if (RegionalFailSiteChart) {
      RegionalFailSiteChart.data.labels = band;
      RegionalFailSiteChart.data.datasets[0].data = count;
      RegionalFailSiteChart.data.datasets[0].backgroundColor = backgroundColors;
      RegionalFailSiteChart.update();
    }
  }

  onMount(() => {
    const ctx = canvas.getContext("2d");
    if (ctx && !RegionalFailSiteChart) {
      Chart.register(ChartDataLabels);

      RegionalFailSiteChart = new Chart(ctx, {
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
    height: 110px;
  }
  canvas {
    height: 100% !important;
    width: 100% !important;
  }
</style>
<div class="chart-container">
  <canvas id='siteCountChart' bind:this={canvas}></canvas>
</div>