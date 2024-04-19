<script lang="ts">
  import { onMount } from 'svelte';
  import Chart, { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js/auto';
  import ChartDataLabels from 'chartjs-plugin-datalabels';

  export let OverallData: any = null; // 부모 컴포넌트에서 전달받은 데이터

  let canvas: HTMLCanvasElement;
  let eRABConnectionOverallTrendChartbyBand: Chart;

  // selectedBand 또는 allData의 변화를 감지하고 차트를 업데이트
  $: {
    if (OverallData) {
      updateChart();
    }
  };

  function formatWeeknum(weeknumArray: string[]): string[] {
    return weeknumArray.map((week) => {
      const parts = week.match(/(\d{2})Week\s(\d{2})/); 
      if (parts && parts.length === 3) {
        return `${parts[1]}/${parts[2]}`;
      }
      return week; // 일치하지 않으면 원본 문자열 반환
    });
  }


  function updateChart() {
    const TrendData = OverallData.erabsetup_trend_23;
    if (!TrendData) return;
    let { weeknums, values } = TrendData;

    weeknums = formatWeeknum(weeknums);

    const datasets = [
      OverallData.erabsetup_trend_23,
      OverallData.erabsetup_trend_26,
      OverallData.erabsetup_trend_800,
    ].filter(Boolean);

    const allValues = datasets.reduce((acc, data) => acc.concat(data.values), []);
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);

    const yAxisMin = minValue - 0.1;
    const yAxisMax = maxValue + 0.1;


    if (eRABConnectionOverallTrendChartbyBand) {
      eRABConnectionOverallTrendChartbyBand.options.scales.y = {
        display: true,
        beginAtZero: false,
        min: yAxisMin,
        // max: yAxisMax,
        ticks: {
          color: 'rgba(255, 255, 255)'
        }
      };
      eRABConnectionOverallTrendChartbyBand.data.labels = weeknums;
      eRABConnectionOverallTrendChartbyBand.data.datasets[0] = {
        label: "2.3G Trend",
        data: values,
        borderColor: 'rgba(7, 89, 133, 1)',
        backgroundColor: 'rgba(7, 89, 133, 1)',
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: 'rgba(255, 255, 255, 1)',
        pointHoverBorderColor: 'rgba(7, 89, 133, 1)',
        datalabels: {
          display: false // 이 데이터셋의 라벨을 숨깁니다.
        }
      };

      // 두 번째 데이터셋 추가 (임의의 데이터)
      const secondLineData = OverallData.erabsetup_trend_26; // 
      const secondDataset = {
        label: "2.6G Trend",
        data: secondLineData.values,
        borderColor: 'rgba(2, 132, 199, 1)',
        backgroundColor: 'rgba(2, 132, 199, 1)',
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: 'rgba(255, 255, 255, 1)',
        pointHoverBorderColor: 'rgba(2, 132, 199, 1)',
        datalabels: {
          display: false // 이 데이터셋의 라벨을 숨깁니다.
        }
      };

      // 세 번째 데이터셋 추가 (임의의 데이터)
      const thirdLineData = OverallData.erabsetup_trend_800;
      const thirdDataset = {
        label: "800M Trend",
        data: thirdLineData.values,
        borderColor: 'rgba(56, 189, 248, 1)',
        backgroundColor: 'rgba(56, 189, 248, 1)',
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: 'rgba(255, 255, 255, 1)',
        pointHoverBorderColor: 'rgba(56, 189, 248, 1)',
        datalabels: {
          display: false // 이 데이터셋의 라벨을 숨깁니다.
        }
      };

      // 데이터셋 배열 업데이트
      eRABConnectionOverallTrendChartbyBand.data.datasets = [eRABConnectionOverallTrendChartbyBand.data.datasets[0], secondDataset, thirdDataset];

      // 차트 업데이트
      eRABConnectionOverallTrendChartbyBand.update();
    }
  }

  onMount(() => {
    const ctx = canvas.getContext("2d");
    if (ctx && !eRABConnectionOverallTrendChartbyBand) {
      Chart.register(ChartDataLabels);

      eRABConnectionOverallTrendChartbyBand = new Chart(ctx, {
        plugins: [ChartDataLabels],
        type: "bar",
        data: {
          labels: [],
          datasets: [
            {
              label: "Trend",
              data: [],
              tension: 0.4
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          scales: {
            x: {
              display: true,
              ticks: {
                color: 'rgba(255, 255, 255)',
                font: {
                  size: 10
                }
              }
            },
            y: {
              display: true
            }
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              usePointStyle: true,
            },
          },
          hover: {
            mode: 'nearest',
            intersect: false,
            axis: 'x'
          },
          interaction: {
            mode: 'nearest',
            intersect: false,
            axis: 'x'
          },
          elements: {
            line: {
              borderWidth: 2
            },
            point: {
              radius: 0,
              hoverRadius: 8,
              hoverBorderWidth: 3
            }
          },
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
