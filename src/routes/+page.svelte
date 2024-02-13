<script lang="ts">
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';
	import { Card } from "flowbite-svelte"; 
  import toast, { Toaster } from 'svelte-french-toast'

  import FDDcountchart from './chart/FDDcountchart.svelte';
  import Tdd23countchart from './chart/TDD23countchart.svelte';
  import Tdd26countchart from './chart/TDD26countchart.svelte';

  export let data;

  let SitecountChartData: any = null;

  onMount(async () => {
    try {
      SitecountChartData = data.statisticData.lsmStatistic
    } catch (error) {
      const errorMessage = error.message || 'An error occurred while fetching chart data!';
      toast.error(errorMessage);
    }
  });
</script>

<div class="flex flex-col items-center justify-center w-full py-10">
  <div class="flex flex-col mb-20">
    <h1 class="text-2xl text-slate-300 font-bold">YTL-<span class="text-blue-600">SAMSUNG</span> LTE PROJECT</h1>
    <h1 class="text-2xl text-slate-500 font-bold mb-4">DEPLOY AND SERVICE DATA MANAGEMENT SYSTEM</h1>
    <p class="text-sm text-slate-500">
      This system is for the management of meterial delivery, site installation, services, and various certification data in the LTE project currently being conducted at YTL.
    </p>
    <p class="text-sm text-slate-500 mb-4">
      It updates the LSM soft parameters and LTE statistical data on a weekly basis.
    </p>
    
  </div>

  <div class="grid grid-cols-4 gap-4">
    <Card size="lg">
      <div class="flex items-center gap-2 mb-14">
        <p class="text-xs font-bold">YTL LTE SITE TOTAL COUNT</p>
        <p class="text-xs text-slate-600">{data.statisticData.endOfWeek?.toISOString().split('T')[0]}</p>
      </div>
      <div class="flex items-center justify-center gap-3 mb-4">
        <div class="h-10 w-10 rounded-full bg-slate-900/40 flex items-center justify-center">
          <Icon icon="codicon:radio-tower" class="text-3xl text-lime-400" />
        </div>
        <div class="flex flex-col">
          <h1 class="text-lg text-slate-300 font-bold flex items-center gap-1">{data.statisticData.lsmStatistic.unique_site_count}
            <span class="text-xs">Sites</span>
          </h1>
          <p class="text-xs text-slate-500 flex items-center gap-1">{data.statisticData.lsmStatistic.cell_count}
            <span class="text-xs">Cells</span>
          </p>
        </div>
      </div>

      <p class="text-xs text-center font-bold mb-2 mt-auto">SITE & Cell Count by band</p>
      <div class="flex items-center justify-between">
        <div class="flex items-center rounded-md bg-slate-700/20 p-2 gap-2">
          <div class="h-8 w-8 rounded-full bg-amber-400 flex items-center justify-center">
            <p class="text-xs text-slate-950 text-center">800</p>
          </div>
          <div class="flex flex-col items-center">
            <h1 class="text-md text-slate-300 font-bold">{data.statisticData.lsmStatistic.sitecount_byband.count[1]}</h1>
            <p class="text-xs text-slate-400">{data.statisticData.lsmStatistic.cellcount_byband.count[1]}</p>
          </div>
        </div>
        <div class="flex items-center rounded-md bg-slate-700/20 p-2 gap-2">
          <div class="h-8 w-8 rounded-full bg-indigo-400 flex items-center justify-center">
            <p class="text-xs text-slate-950 text-center">2.3G</p>
          </div>
          <div class="flex flex-col items-center">
            <h1 class="text-md text-slate-300 font-bold">{data.statisticData.lsmStatistic.sitecount_byband.count[0]}</h1>
            <p class="text-xs text-slate-400">{data.statisticData.lsmStatistic.cellcount_byband.count[0]}</p>
          </div>
        </div>
        <div class="flex items-center rounded-md bg-slate-700/20 p-2 gap-2">
          <div class="h-8 w-8 rounded-full bg-sky-400 flex items-center justify-center">
            <p class="text-xs text-slate-950 text-center">2.6G</p>
          </div>
          <div class="flex flex-col items-center">
            <h1 class="text-md text-slate-300 font-bold">{data.statisticData.lsmStatistic.sitecount_byband.count[2]}</h1>
            <p class="text-xs text-slate-400">{data.statisticData.lsmStatistic.cellcount_byband.count[2]}</p>
          </div>
        </div>
      </div>
    </Card>

    <div class="flex flex-col rounded-lg border border-amber-400 hover:shadow-xl hover:shadow-amber-900 p-4">
      <h1 class="text-xs text-amber-400 font-bold mb-6">FDD 800M SITE COUNT</h1>

      <div class="flex items-center gap-3 mb-6">
        <div class="h-10 w-10 rounded-full bg-amber-400 flex items-center justify-center">
          <Icon icon="codicon:radio-tower" class="text-2xl text-slate-900" />
        </div>
        <div class="flex flex-col">
          <h1 class="text-lg text-slate-300 font-bold flex items-center gap-1">
            {data.statisticData.lsmStatistic.sitecount_byband.count[1]}
            <span class="text-xs">Sites</span>
          </h1>
          <p class="text-xs text-slate-500 flex items-center gap-1">{data.statisticData.lsmStatistic.cellcount_byband.count[1]}
            <span class="text-xs">Cells</span>
          </p>
        </div>
      </div>

      <div class="flex items-center justify-center gap-6">
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-2">
            <div class="h-4 w-4 rounded-sm bg-amber-200"></div>
            <p class="text-xs text-slate-400">Central</p>
          </div>
          <div class="flex items-center gap-2">
            <div class="h-4 w-4 rounded-sm bg-amber-300"></div>
            <p class="text-xs text-slate-400">Northern</p>
          </div>
          <div class="flex items-center gap-2">
            <div class="h-4 w-4 rounded-sm bg-amber-400"></div>
            <p class="text-xs text-slate-400">Southern</p>
          </div>
          <div class="flex items-center gap-2">
            <div class="h-4 w-4 rounded-sm bg-amber-500"></div>
            <p class="text-xs text-slate-400">Eastern</p>
          </div>
          <div class="flex items-center gap-2">
            <div class="h-4 w-4 rounded-sm bg-amber-600"></div>
            <p class="text-xs text-slate-400">Sabah</p>
          </div>
          <div class="flex items-center gap-2">
            <div class="h-4 w-4 rounded-sm bg-amber-700"></div>
            <p class="text-xs text-slate-400">Sarawak</p>
          </div>
        </div>

        <FDDcountchart {SitecountChartData} />
      </div>
    </div>

    <div class="flex flex-col rounded-lg border border-indigo-400 hover:shadow-xl hover:shadow-indigo-900 p-4">
      <h1 class="text-xs text-indigo-400 font-bold mb-6">TDD2.3 SITE COUNT</h1>

      <div class="flex items-center gap-3 mb-6">
        <div class="h-10 w-10 rounded-full bg-indigo-400 flex items-center justify-center">
          <Icon icon="codicon:radio-tower" class="text-3xl text-slate-950" />
        </div>
        <div class="flex flex-col">
          <h1 class="text-lg text-slate-300 font-bold flex items-center gap-1">
            {data.statisticData.lsmStatistic.sitecount_byband.count[0]}
            <span class="text-xs">Sites</span>
          </h1>
          <p class="text-xs text-slate-500 flex items-center gap-1">{data.statisticData.lsmStatistic.cellcount_byband.count[0]}
            <span class="text-xs">Cells</span>
          </p>
        </div>
      </div>

      <div class="flex items-center justify-center gap-6">
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-2">
            <div class="h-4 w-4 rounded-sm bg-indigo-200"></div>
            <p class="text-xs text-slate-400">Central</p>
          </div>
          <div class="flex items-center gap-2">
            <div class="h-4 w-4 rounded-sm bg-indigo-300"></div>
            <p class="text-xs text-slate-400">Northern</p>
          </div>
          <div class="flex items-center gap-2">
            <div class="h-4 w-4 rounded-sm bg-indigo-400"></div>
            <p class="text-xs text-slate-400">Southern</p>
          </div>
          <div class="flex items-center gap-2">
            <div class="h-4 w-4 rounded-sm bg-indigo-500"></div>
            <p class="text-xs text-slate-400">Eastern</p>
          </div>
          <div class="flex items-center gap-2">
            <div class="h-4 w-4 rounded-sm bg-indigo-600"></div>
            <p class="text-xs text-slate-400">Sabah</p>
          </div>
          <div class="flex items-center gap-2">
            <div class="h-4 w-4 rounded-sm bg-indigo-700"></div>
            <p class="text-xs text-slate-400">Sarawak</p>
          </div>
        </div>

        <Tdd23countchart {SitecountChartData} />
      </div>
    </div>

    <div class="flex flex-col rounded-lg border border-sky-400 hover:shadow-xl hover:shadow-sky-900 p-4">
      <h1 class="text-xs text-sky-400 font-bold mb-6">TDD2.6 SITE COUNT</h1>

      <div class="flex items-center gap-3 mb-6">
        <div class="h-10 w-10 rounded-full bg-sky-400 flex items-center justify-center">
          <Icon icon="codicon:radio-tower" class="text-3xl text-slate-950" />
        </div>
        <div class="flex flex-col">
          <h1 class="text-lg text-slate-300 font-bold flex items-center gap-1">
            {data.statisticData.lsmStatistic.sitecount_byband.count[2]}
            <span class="text-xs">Sites</span>
          </h1>
          <p class="text-xs text-slate-500 flex items-center gap-1">{data.statisticData.lsmStatistic.cellcount_byband.count[2]}
            <span class="text-xs">Cells</span>
          </p>
        </div>
      </div>

      <div class="flex items-center justify-center gap-6">
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-2">
            <div class="h-4 w-4 rounded-sm bg-sky-200"></div>
            <p class="text-xs text-slate-400">Central</p>
          </div>
          <div class="flex items-center gap-2">
            <div class="h-4 w-4 rounded-sm bg-sky-300"></div>
            <p class="text-xs text-slate-400">Northern</p>
          </div>
          <div class="flex items-center gap-2">
            <div class="h-4 w-4 rounded-sm bg-sky-400"></div>
            <p class="text-xs text-slate-400">Southern</p>
          </div>
          <div class="flex items-center gap-2">
            <div class="h-4 w-4 rounded-sm bg-sky-500"></div>
            <p class="text-xs text-slate-400">Eastern</p>
          </div>
          <div class="flex items-center gap-2">
            <div class="h-4 w-4 rounded-sm bg-sky-600"></div>
            <p class="text-xs text-slate-400">Sabah</p>
          </div>
          <div class="flex items-center gap-2">
            <div class="h-4 w-4 rounded-sm bg-sky-700"></div>
            <p class="text-xs text-slate-400">Sarawak</p>
          </div>
        </div>

        <Tdd26countchart {SitecountChartData} />
      </div>
    </div>
  </div>
</div>

<Toaster />