<script lang="ts">
  import { onMount } from "svelte";
  import Chart, { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js/auto';
  import ChartDataLabels from 'chartjs-plugin-datalabels';

  export let eRABSetupData: any = null;

  let canvas: HTMLCanvasElement;
  let RegionalAttachFail800Chart: Chart;

  $: {
    if (eRABSetupData) {
      updateChart();
    }
  };

  const bandColors: Record<string, string> = {
    '800M': 'rgba(56, 189, 248, 1)',
    '': 'rgba(15, 23, 42, 0.5)',
  }

  function updateChart() {
    const eRABAttemptFail800 = eRABSetupData.erabfailandsuccessbybandall.by_band;
    if (!eRABAttemptFail800) return;
    const bands = ['800M', '']
    const failratio = [eRABAttemptFail800.failratebyband[2], 100-eRABAttemptFail800.failratebyband[2]]

    const backgroundColors = bands.map((itemName: string) => {
      return bandColors[itemName] || '#cccccc'
    });


    if (RegionalAttachFail800Chart) {
      RegionalAttachFail800Chart.data.labels = bands;
      RegionalAttachFail800Chart.data.datasets[0].data = failratio;
      RegionalAttachFail800Chart.data.datasets[0].backgroundColor = backgroundColors;
      RegionalAttachFail800Chart.data.datasets[0].borderColor = backgroundColors;
      RegionalAttachFail800Chart.update();
    }
  }

  onMount(() => {
    const ctx = canvas.getContext("2d");
    if (ctx && !RegionalAttachFail800Chart) {
      Chart.register(ChartDataLabels);

      RegionalAttachFail800Chart = new Chart(ctx, {
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