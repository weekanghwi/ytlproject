<script lang="ts">
  import { onMount } from "svelte";
  import Chart from 'chart.js/auto';
  import ChartDataLabels from 'chartjs-plugin-datalabels';
  import { getLabelSettings } from "./labelsSettings";

  export let selectedBand: string = '800M';
  export let chartdata: any = null;
  let canvas: HTMLCanvasElement;
  let Availability: Chart;

  // selectedBand 또는 allData의 변화를 감지하고 차트를 업데이트
  $: {
    if (chartdata && selectedBand) {
      updateChart();
    }
  };

  function updateChart() {
    const bandData = chartdata.x2_handover_in_success_rate_by_region.band[selectedBand];
    if (!bandData) return;
    const { region, avg } = bandData;

    const backgroundColors = avg.map(value => value < 99 ? 'rgba(245, 40, 45, 0.8)' : 'rgba(30, 166, 236, 0.8)')
    const borderColors = avg.map(value => value < 99 ? 'rgba(245, 40, 145, 0.8)' : 'rgba(61, 233, 177, 0.8)');

    const minYValue = Math.min(...avg) - 5;

    if (Availability) {
        Availability.data.labels = region;
        Availability.data.datasets[0].data = avg;
        Availability.data.datasets[0].backgroundColor = backgroundColors;
        Availability.data.datasets[0].borderColor = borderColors;
        Availability.options.scales.y.min = minYValue;
        Availability.update();
    }
  }

  onMount(() => {
    const ctx = canvas.getContext("2d");
    if (ctx && !Availability) {
      Chart.register(ChartDataLabels);

      Availability = new Chart(ctx, {
        plugins: [ChartDataLabels],
        type: "bar",
        data: {
          labels: [],
          datasets: [
            {
              label: "Avg",
              data: [],
              borderColor: [],
              backgroundColor: [],
              borderWidth: 0,
              datalabels: {
                anchor: 'start',
                clamp: true,
                rotation: 270,
                labels: getLabelSettings()
              }
            },
          ],
        },
        options: {
          plugins: {
            tooltip: {
              enabled: false
            },
            datalabels: {
              color: 'white',
              display: function(ctx) {
                return ctx.dataset.data[ctx.dataIndex] > 10;
              },
              font: {
                weight: 'bolder',
              },
              offset: 0,
              padding: 0
            },
            legend: {
              display: false,
            }
          },
          scales: {
            x: {
              display: false
            },
            y: {
              max: 100,
            }
          }
        }
      });
    }
  });
</script>

<div class="chart-container">
  <canvas bind:this={canvas}></canvas>
</div>
