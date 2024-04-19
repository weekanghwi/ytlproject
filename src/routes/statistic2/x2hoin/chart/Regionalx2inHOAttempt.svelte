<script lang="ts">
  import { onMount } from "svelte";
  import Chart, { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js/auto';
  import ChartDataLabels from 'chartjs-plugin-datalabels';

  export let x2InHORegionalData: any = null;
  export let chartKey: string;

  let canvas: HTMLCanvasElement;
  let x2InHOAttemptChart: Chart;

  function processAPIData(data: any, key: string): { band: string[], ratio: number[], counts: number[]} | null {
    const { by_band } = data[key];
    if (!by_band) return null;

    return {
      band: by_band.band,
      ratio: by_band.ratio,
      counts: by_band.counts,
    }
  }

  $: {
    if (x2InHORegionalData) {
      updateChart(chartKey);
    }
  };

  const regionColors: Record<string, string> = {
    '2.3GHz': 'rgba(7, 89, 133, 1)',
    '2.6GHz': 'rgba(2, 132, 199, 1)',
    '800M': 'rgba(56, 189, 248, 1)',
  }

  function updateChart(chartKey: string) {
    const RegionalData = processAPIData(x2InHORegionalData, chartKey)
    if (!RegionalData) return;

    const {band, ratio} = RegionalData
    const backgroundColors = band.map((bandName: string) => {
      return regionColors[bandName] || '#cccccc'
    });


    if (x2InHOAttemptChart) {
      x2InHOAttemptChart.data.labels = band;
      x2InHOAttemptChart.data.datasets[0].data = ratio;
      x2InHOAttemptChart.data.datasets[0].backgroundColor = backgroundColors;
      x2InHOAttemptChart.update();
    }
  }

  onMount(() => {
    const ctx = canvas.getContext("2d");
    if (ctx && !x2InHOAttemptChart) {
      Chart.register(ChartDataLabels);

      x2InHOAttemptChart = new Chart(ctx, {
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
  }
</style>
<div class="chart-container">
  <canvas id='siteCountChart' bind:this={canvas}></canvas>
</div>