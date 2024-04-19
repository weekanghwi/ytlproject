<script lang="ts">
  import { onMount } from "svelte";
  import Chart, { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js/auto';
  import ChartDataLabels from 'chartjs-plugin-datalabels';

  export let IntraFreqHORegionalData: any = null;
  export let chartKey: string;

  let canvas: HTMLCanvasElement;
  let IntraHOAttemptChart: Chart;

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
    if (IntraFreqHORegionalData) {
      updateChart(chartKey);
    }
  };

  const regionColors: Record<string, string> = {
    '2.3GHz': 'rgba(7, 89, 133, 1)',
    '2.6GHz': 'rgba(2, 132, 199, 1)',
    '800M': 'rgba(56, 189, 248, 1)',
  }

  function updateChart(chartKey: string) {
    const RegionalINTRAHOAttempt = processAPIData(IntraFreqHORegionalData, chartKey)
    if (!RegionalINTRAHOAttempt) return;

    const {band, ratio} = RegionalINTRAHOAttempt
    const backgroundColors = band.map((bandName: string) => {
      return regionColors[bandName] || '#cccccc'
    });


    if (IntraHOAttemptChart) {
      IntraHOAttemptChart.data.labels = band;
      IntraHOAttemptChart.data.datasets[0].data = ratio;
      IntraHOAttemptChart.data.datasets[0].backgroundColor = backgroundColors;
      IntraHOAttemptChart.update();
    }
  }

  onMount(() => {
    const ctx = canvas.getContext("2d");
    if (ctx && !IntraHOAttemptChart) {
      Chart.register(ChartDataLabels);

      IntraHOAttemptChart = new Chart(ctx, {
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