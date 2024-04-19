<script lang="ts">
  import { onMount } from "svelte";
  import Chart, { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js/auto';
  import ChartDataLabels from 'chartjs-plugin-datalabels';

  export let RRCSetupData: any = null;

  let canvas: HTMLCanvasElement;
  let RegionalRRCAttemptFail23: Chart;

  $: {
    if (RRCSetupData) {
      updateChart();
    }
  };

  const bandColors: Record<string, string> = {
    '2.6GHz': 'rgba(2, 132, 199, 1)',
    '': 'rgba(15, 23, 42, 0.5)',
  }

  function updateChart() {
    const RRCAttemptFail23 = RRCSetupData.rrcconnectionsuccessrate.by_band;
    if (!RRCAttemptFail23) return;
    const bands = ['2.6GHz', '']
    const failratio = [RRCAttemptFail23.failratio[1], 100-RRCAttemptFail23.failratio[1]]

    const backgroundColors = bands.map((itemName: string) => {
      return bandColors[itemName] || '#cccccc'
    });


    if (RegionalRRCAttemptFail23) {
      RegionalRRCAttemptFail23.data.labels = bands;
      RegionalRRCAttemptFail23.data.datasets[0].data = failratio;
      RegionalRRCAttemptFail23.data.datasets[0].backgroundColor = backgroundColors;
      RegionalRRCAttemptFail23.data.datasets[0].borderColor = backgroundColors;
      RegionalRRCAttemptFail23.update();
    }
  }

  onMount(() => {
    const ctx = canvas.getContext("2d");
    if (ctx && !RegionalRRCAttemptFail23) {
      Chart.register(ChartDataLabels);

      RegionalRRCAttemptFail23 = new Chart(ctx, {
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