<script lang="ts">
	import { Breadcrumb, BreadcrumbItem } from "flowbite-svelte";
  import Icon from '@iconify/svelte';

  export let data;


</script>

<div class="p-2 w-full pt-2">
  <Breadcrumb aria-label="siteinfo breadcrumb" class="mb-6">
    <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
    <BreadcrumbItem href="/fddproject">FDD Project</BreadcrumbItem>
    <BreadcrumbItem>Dashboard</BreadcrumbItem>
  </Breadcrumb>

  <h1 class="text-2xl text-slate-400 font-bold mb-4">Dashboard</h1>

  <!-- Dashboard contents -->
  <div class="grid grid-cols-5 space-x-2">

    <!-- DO Contents -->
    <div class="flex flex-col rounded-md border border-slate-600 py-2 px-4 hover:bg-gray-900 hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
      <h1 class="text-sm font-bold text-slate-400 mb-4 flex items-center">
        <Icon icon="line-md:list-3" class="text-2xl text-purple-600 me-2"/>DO Status
      </h1>

      <div class="grid grid-cols-3 items-center w-full">
        <p class="text-xs font-bold text-slate-400 flex justify-start">Item</p>
        <p class="text-xs font-bold text-slate-400 flex justify-center">Week</p>
        <p class="text-xs font-bold text-slate-400 flex justify-end">Total</p>
        <p class="text-xs text-slate-400 flex justify-start">DO Issue</p>
        <p class="text-md text-slate-400 flex justify-center">{data.dashboardData.data.doissue_week.length}</p>
        <p class="text-md text-slate-400 flex justify-end">{data.dashboardData.data.total_doissue}</p>
        <p class="text-xs text-slate-400 flex justify-start">COD Submit</p>
        <p class="text-md text-slate-400 flex justify-center">{data.dashboardData.data.codsubmit_week.length}</p>
        <p class="text-md text-slate-400 flex justify-end">{data.dashboardData.data.total_codsubmit}</p>
        <p class="text-xs text-slate-400 flex justify-start">COD Approve</p>
        <p class="text-md text-slate-400 flex justify-center">{data.dashboardData.data.codapprove_week.length}</p>
        <p class="text-md text-slate-400 flex justify-end">{data.dashboardData.data.total_codapprove}</p>
      </div>
    </div>

    <!-- Install Contents -->
    <div class="flex flex-col rounded-md border border-slate-600 py-2 px-4 hover:bg-gray-900 hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
      <h1 class="text-sm font-bold text-slate-400 mb-4 flex items-center">
        <Icon icon="carbon:delivery-add" class="text-2xl text-indigo-400 me-2"/>Install Status
      </h1>

      <div class="grid grid-cols-2 items-center w-full">
        <p class="text-xs text-slate-400 flex justify-start">Start</p>
        <p class="text-md text-slate-400 flex justify-end">{data.dashboardData.data.total_installstart - 4}</p>
        <p class="text-xs text-slate-400 flex justify-start">Complete</p>
        <p class="text-md text-slate-400 flex justify-end">{data.dashboardData.data.total_installcomplete - 4}</p>
        <p class="text-xs text-slate-400 flex justify-start">Integration</p>
        <p class="text-md text-slate-400 flex justify-end">{data.dashboardData.data.total_integration - 4}</p>
        
        <p class="text-xs text-slate-400 flex justify-start">OnAir</p>
        <p class="text-md text-slate-400 flex justify-end">{data.dashboardData.data.total_onair - 4}</p>
        <p class="text-xs text-slate-400 flex justify-start">COI Submit</p>
        <p class="text-md text-slate-400 flex justify-end">{data.dashboardData.data.total_coisubmit}</p>
        <p class="text-xs text-slate-400 flex justify-start">COI Approve</p>
        <p class="text-md text-slate-400 flex justify-end">{data.dashboardData.data.total_coiapprove}</p>
        <p class="text-xs text-slate-400 flex justify-start">COIC Submit</p>
        <p class="text-md text-slate-400 flex justify-end">{data.dashboardData.data.total_coicsubmit}</p>
        <p class="text-xs text-slate-400 flex justify-start">COIC Approve</p>
        <p class="text-md text-slate-400 flex justify-end">{data.dashboardData.data.total_coicapprove}</p>
        <p class="text-xs text-slate-400 flex justify-start">PNOC Trigger</p>
        <p class="text-md text-slate-400 flex justify-end">{data.dashboardData.data.total_pnoctrigger}</p>
        <p class="text-xs text-slate-400 flex justify-start">PNOC Complete</p>
        <p class="text-md text-slate-400 flex justify-end">{data.dashboardData.data.total_pnoccomplete}</p>
      </div>
    </div>

    <!-- SSV Contents -->
    <div class="flex flex-col rounded-md border border-slate-600 py-2 px-4 hover:bg-gray-900 hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
      <h1 class="text-sm font-bold text-slate-400 mb-4 flex items-center">
        <Icon icon="ri:taxi-wifi-line" class="text-2xl text-sky-400 me-2"/>SSV Status</h1>

      <div class="grid grid-cols-2 items-center w-full">
        <p class="text-xs text-slate-400 flex justify-start">Start</p>
        <p class="text-md text-slate-400 flex justify-end">{data.dashboardData.data.total_ssvstart - 3}</p>
        <p class="text-xs text-slate-400 flex justify-start">Complete</p>
        <p class="text-md text-slate-400 flex justify-end">{data.dashboardData.data.total_ssvcomplete - 3}</p>
        <p class="text-xs text-slate-400 flex justify-start">SSV Submit</p>
        <p class="text-md text-slate-400 flex justify-end">{data.dashboardData.data.total_ssvsubmit - 1}</p>
        
        <p class="text-xs text-slate-400 flex justify-start">BS Submit</p>
        <p class="text-md text-slate-400 flex justify-end">{data.dashboardData.data.total_bssubmit - 2}</p>
        <p class="text-xs text-slate-400 flex justify-start">BS Approve</p>
        <p class="text-md text-slate-400 flex justify-end">{data.dashboardData.data.total_bsapprove - 1}</p>
      </div>
    </div>

    <!-- Optimization Contents -->
    <div class="flex flex-col rounded-md border border-slate-600 py-2 px-4 hover:bg-gray-900 hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
      <h1 class="text-sm font-bold text-slate-400 mb-4 flex items-center">
        <Icon icon="clarity:data-cluster-line" class="text-2xl text-rose-400 font-bold me-2"/>Optimization Status</h1>

      <div class="grid grid-cols-2 items-center w-full">
        <p class="text-xs text-slate-400 flex justify-start">Start</p>
        <p class="text-md text-slate-400 flex justify-end">{data.dashboardData.data.total_optstart}</p>
        <p class="text-xs text-slate-400 flex justify-start">Complete</p>
        <p class="text-md text-slate-400 flex justify-end">{data.dashboardData.data.total_optcomplete}</p>
        <p class="text-xs text-slate-400 flex justify-start">Submit</p>
        <p class="text-md text-slate-400 flex justify-end">{data.dashboardData.data.total_optsubmit}</p>
        
        <p class="text-xs text-slate-400 flex justify-start">Approve</p>
        <p class="text-md text-slate-400 flex justify-end">{data.dashboardData.data.total_optapprove}</p>
      </div>
    </div>

    <!-- Certification Contents -->
    <div class="flex flex-col rounded-md border border-slate-600 py-2 px-4 hover:bg-gray-900 hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
      <h1 class="text-sm font-bold text-slate-400 mb-4 flex items-center">
        <Icon icon="tabler:certificate" class="text-2xl text-lime-400 me-2"/>Certification Status</h1>

      <div class="grid grid-cols-2 items-center w-full">
        <p class="text-xs text-slate-400 flex justify-start">PAC Submit</p>
        <p class="text-md text-slate-400 flex justify-end">{data.dashboardData.data.total_pacsubmit}</p>
        <p class="text-xs text-slate-400 flex justify-start">FAC Submit</p>
        <p class="text-md text-slate-400 flex justify-end">{data.dashboardData.data.total_facsubmit}</p>
      </div>
    </div>

  </div>

</div>