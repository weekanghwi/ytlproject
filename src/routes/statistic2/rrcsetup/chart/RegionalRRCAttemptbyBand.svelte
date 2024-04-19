<script lang="ts">
  import { onMount } from "svelte";
  import Chart, { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js/auto';
  import ChartDataLabels from 'chartjs-plugin-datalabels';

  export let RRCSetupData: any = null;

  let canvas: HTMLCanvasElement;
  let RegionalRRCAttemptChartbyBand: Chart;

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
    const RRCAttemptCountData = RRCSetupData.rrcattemptcoutbyband.by_band;
    if (!RRCAttemptCountData) return;
    const bands = RRCAttemptCountData.band
    const values = RRCAttemptCountData.values

    const backgroundColors = bands.map((itemName: string) => {
      return bandColors[itemName] || '#cccccc'
    });


    if (RegionalRRCAttemptChartbyBand) {
      RegionalRRCAttemptChartbyBand.data.labels = bands;
      RegionalRRCAttemptChartbyBand.data.datasets[0].data = values;
      RegionalRRCAttemptChartbyBand.data.datasets[0].backgroundColor = backgroundColors;
      RegionalRRCAttemptChartbyBand.update();
    }
  }

  onMount(() => {
    const ctx = canvas.getContext("2d");
    if (ctx && !RegionalRRCAttemptChartbyBand) {
      Chart.register(ChartDataLabels);

      RegionalRRCAttemptChartbyBand = new Chart(ctx, {
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
              backgroundColor: function(context) {
                return context.hovered ? context.dataset.backgroundColor: 'white';
              },
              borderColor: function(context) {
                return context.dataset.backgroundColor
              },
              borderRadius: 16,
              borderWidth: 3,
              color: function(context) {
                return context.hovered ? 'white' : context.dataset.backgroundColor;
              },
              font: {
                weight: 'bold',
                size: 12,
                family: 'Halvetica, Arial, sans-serif',
              },
              offset: 8,
              formatter: function(value, context) {
                return value.toFixed(1)
              },
              listeners: {
                enter: function(context) {
                  context.hovered = true;
                  return true;
                },
                leave: function(context) {
                  context.hovered = false;
                  return true;
                }
              }
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