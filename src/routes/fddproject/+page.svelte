<script lang="ts">
  import Icon from '@iconify/svelte';

  export let data;
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };


  let image1: string = 'tower-night.jpg';
  let image2: string = 'tower-w.jpg';
  let image3: string = 'telco equpiment.jpg';
  let image4: string = 'report.jpg';
</script>

<div class="p-2 w-full pt-2">
  <div class="flex flex-col rounded-lg items-center justify-center">

    <!-- First image & site contents-->
    <div class="grid grid-cols-2 items-center justify-center px-28 gap-24 mb-20">
      <div class="flex flex-col rounded-lg justify-center">
        <h1 class="text-slate-300 text-2xl font-bold">YTL-<span class="text-blue-600">SAMSUNG</span> LTE FDD PROJECT</h1>
        <h1 class="text-slate-300 text-2xl font-bold mb-2">DEPLOY AND SERVICE MANAGEMENT</h1>
        <h1 class="text-sm text-slate-500">Various data management systems needed for the progression of tasks such as 
          <span class="text-lime-400">DO, Install, SSV, Optimization, and Certification</span> that are essential for the advancement of the YTL FDD project, including issues related to task timelines </h1>
      </div>
      <div class="grid grid-cols-2 items-center">
        <img class="object-cover aspect-content rounded-s-lg" src={`/fddimage/${image1}`} alt="">
        <img class="object-cover aspect-content rounded-e-lg" src={`/fddimage/${image2}`} alt="">
        <img class="object-cover aspect-content rounded-s-lg" src={`/fddimage/${image3}`} alt="">
        <img class="object-cover aspect-content rounded-e-lg" src={`/fddimage/${image4}`} alt="">
      </div>
    </div>

    <!-- lte project simple numbers -->
    <div class="flex justify-center w-full h-16 rounded-lg bg-blue-700 px-28 mr-3 gap-32 mb-20">
      <div class="flex flex-col rounded-lg justify-center">
        <h1 class="text-xl font-bold text-blue-100">{formatNumber(data.lsmStatistic.data.unique_site_count)}</h1>
        <h1 class="text-xs text-blue-100">Total Sites</h1>
      </div>
      <div class="flex flex-col rounded-lg justify-center">
        <h1 class="text-xl font-bold text-blue-100">{formatNumber(data.lsmStatistic.data.unique_site_count_fdd)}</h1>
        <h1 class="text-xs text-blue-100">Total FDD Sites</h1>
      </div>
      <div class="flex flex-col rounded-lg justify-center">
        <h1 class="text-xl font-bold text-blue-100">{formatNumber(data.lsmStatistic.data.cell_count_fdd)}</h1>
        <h1 class="text-xs text-blue-100">Total FDD Cells</h1>
      </div>
      <div class="flex flex-col rounded-lg justify-center">
        <h1 class="text-xl font-bold text-blue-100">{formatNumber(data.weeklyStatistic.data.total_facapprove)}</h1>
        <h1 class="text-xs text-blue-100">Total FAC Approve</h1>
      </div>
    </div>

    <!-- each task numbers -->
    <div class="grid grid-cols-5 space-x-2 gap-2 px-20">
      <div class="flex flex-col col-span-5 justify-center mb-5">
        <p class="text-sm text-slate-400 text-center">Tasks for project progression</p>
        <p class="text-2xl text-slate-50 text-center font-bold">Latest number of each tasks</p>
        <p class="text-2xl text-slate-50 text-center font-bold">for FDD only</p>
      </div>
      <div class="flex flex-col rounded-lg border border-blue-600 p-4">
        <Icon icon="carbon:delivery-add" class="text-3xl text-blue-600 mb-2"/>
        <p class="text-sm text-slate-200 font-bold mb-1">Delivery</p>
        <p class="text-xs text-slate-400 mb-5">DU, RU, and installation meterial delivery process for FDD equipment setup</p>
        <div class="grid grid-cols-2 mt-auto">
          <p class="text-xs text-blue-50">Total Delivery</p>
          <p class="text-xs font-bold text-blue-50 text-end">{formatNumber(data.weeklyStatistic.data.total_doissue)}</p>
        </div>
      </div>
      <div class="flex flex-col rounded-lg border border-purple-600 p-4">
        <Icon icon="ion:construct-outline" class="text-3xl text-purple-600 mb-2"/>
        <p class="text-sm text-slate-200 font-bold mb-1">Installation</p>
        <p class="text-xs text-slate-400 mb-5">Add equipment at the existing TDD location or install at new location</p>
        <div class="grid grid-cols-2 mt-auto">
          <p class="text-xs text-blue-50">Total Install</p>
          <p class="text-xs font-bold text-blue-50 text-end">{formatNumber(data.weeklyStatistic.data.total_doissue)}</p>
        </div>
      </div>
      <div class="flex flex-col rounded-lg border border-rose-600 p-4">
        <Icon icon="ri:taxi-wifi-line" class="text-3xl text-rose-600 mb-2"/>
        <p class="text-sm text-slate-200 font-bold mb-1">SSV site verify</p>
        <p class="text-xs text-slate-400 mb-auto">Performance testing of installed equipment for DL/UL max speed, VoLTE, Ping and Etc.</p>
        <div class="grid grid-cols-2 mt-3">
          <p class="text-xs text-blue-50">Total SSV</p>
          <p class="text-xs font-bold text-blue-50 text-end">{formatNumber(data.weeklyStatistic.data.total_ssvcomplete)}</p>
        </div>
      </div>
      <div class="flex flex-col rounded-lg border border-indigo-600 p-4">
        <Icon icon="clarity:data-cluster-line" class="text-3xl text-indigo-600 mb-2"/>
        <p class="text-sm text-slate-200 font-bold mb-1">Optimization</p>
        <p class="text-xs text-slate-400 mb-auto">Optimization performed by grouping installed sites into clusters is called CLOPT, and individual site optimization is refereed to as SSO.</p>
        <div class="grid grid-cols-2 mt-3">
          <p class="text-xs text-blue-50">Total Optimize</p>
          <p class="text-xs font-bold text-blue-50 text-end">{formatNumber(data.weeklyStatistic.data.total_optcomplete)}</p>
        </div>
      </div>
      <div class="flex flex-col rounded-lg border border-lime-600 p-4">
        <Icon icon="tabler:certificate" class="text-3xl text-lime-600 mb-2"/>
        <p class="text-sm text-slate-200 font-bold mb-1">Certification</p>
        <p class="text-xs text-slate-400 mb-auto">After the final approval is requested for the optimized site, equipment and service costs are billed. </p>
        <div class="grid grid-cols-2 mt-3">
          <p class="text-xs text-blue-50">Total Certi</p>
          <p class="text-xs font-bold text-blue-50 text-end">{formatNumber(data.weeklyStatistic.data.total_facapprove)}</p>
        </div>
      </div>
    </div>
  </div>
</div>