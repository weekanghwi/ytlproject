<script lang="ts">
  import { onMount } from "svelte";
  import Chart, { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js/auto';
  import ChartDataLabels from 'chartjs-plugin-datalabels';

  export let VoLTESetupData: any = null;

  let canvas: HTMLCanvasElement;
  let RegionalAttachFail26Chart: Chart;

  $: {
    if (VoLTESetupData) {
      updateChart();
    }
  };

  const bandColors: Record<string, string> = {
    '2.6GHz': 'rgba(2, 132, 199, 1)',
    '': 'rgba(15, 23, 42, 0.5)',
  }

  function updateChart() {
    const eRABAttemptFail26 = VoLTESetupData.voltefailandsuccessbybandall.by_band;
    if (!eRABAttemptFail26) return;
    const bands = ['2.6GHz', '']
    const failratio = [eRABAttemptFail26.failratebyband[1], 100-eRABAttemptFail26.failratebyband[1]]

    const backgroundColors = bands.map((itemName: string) => {
      return bandColors[itemName] || '#cccccc'
    });


    if (RegionalAttachFail26Chart) {
      RegionalAttachFail26Chart.data.labels = bands;
      RegionalAttachFail26Chart.data.datasets[0].data = failratio;
      RegionalAttachFail26Chart.data.datasets[0].backgroundColor = backgroundColors;
      RegionalAttachFail26Chart.data.datasets[0].borderColor = backgroundColors;
      RegionalAttachFail26Chart.update();
    }
  }

  onMount(() => {
    const ctx = canvas.getContext("2d");
    if (ctx && !RegionalAttachFail26Chart) {
      Chart.register(ChartDataLabels);

      RegionalAttachFail26Chart = new Chart(ctx, {
        plugins: [ChartDataLabels],
        type: "doughnut",
        data: {
          labels: [],
          datasets: [
            {
              label: "Rate",
              data: [],
              borderColor: [],
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
  }
</style>
<div class="chart-container">
  <canvas id='siteCountChart' bind:this={canvas}></canvas>
</div>