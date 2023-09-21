<script lang="ts">
	import { Breadcrumb, BreadcrumbItem, Button, TabItem, Tabs } from "flowbite-svelte";
  import Icon from '@iconify/svelte';
  import WeekListModal from "./weekListModal.svelte";
  import DayListModal from "./dayListModal.svelte";

  export let data;
  let name = '';
  // Modal
  let WeeklyModal = false
  let DailyModal = false

  const openWeekModal = (dynamicName: string) => {
    name = dynamicName;
    WeeklyModal = true;
  };

  const openDayModal = (dynamicName: string) => {
    name = dynamicName;
    DailyModal = true;
  }

  const downloadInternaldailReport = () => {
    window.location.href = 'http://10.24.8.120:8000/api/fddmastertracker/'
  }

  const downloadIntegrationReport = () => {
    window.location.href = 'http://10.24.8.120:8000/api/integrationstatus/'
  }

  function getCustomWeekInfo(d: Date) {
    const target = new Date(d);
    const dayNr = (d.getDay() + 1) % 7;  // Convert Sunday from 0 to 7

    target.setDate(target.getDate() - dayNr + 5);  // Add 3 days to get to Thursday, and set the target to that date

    const thursday = target.valueOf();

    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }

    const weekNumber = 1 + Math.ceil((thursday - target.valueOf()) / 604800000);

    const startOfWeek = new Date(thursday);
    startOfWeek.setDate(startOfWeek.getDate() - 6);  // Thursday - 6 days = last Friday

    const endOfWeek = new Date(thursday);
    endOfWeek.setDate(endOfWeek.getDate());  // The week ends on Thursday

    return {
      weekNumber,
      startOfWeek,
      endOfWeek,
    };
  }

  function formatDate(d: Date): string {
    const day = d.getDate();
    const month = d.toLocaleString('en-US', {month: 'short'});
    const year = d.getFullYear();
    return `${day} ${month} ${year}`
  }

  const now = new Date();
  const dateString = now.toLocaleString();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const dayName = dayNames[now.getDay()]
  const { weekNumber, startOfWeek, endOfWeek } = getCustomWeekInfo(now);
  const formattedStartOfWeek = formatDate(startOfWeek);
  const formattedEndOfWeek = formatDate(endOfWeek);




</script>
<div class="p-2 w-full pt-2">
  <!-- Breadcrumb -->
  <Breadcrumb aria-label="siteinfo breadcrumb" class="mb-6">
    <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
    <BreadcrumbItem href="/fddproject">FDD Project</BreadcrumbItem>
    <BreadcrumbItem>Report</BreadcrumbItem>
  </Breadcrumb>

  <!-- Report Contents -->
  <Tabs style="underline">
    <!-- Daily Report -->

    <!-- Weekly Report -->
    <TabItem open>
      <div slot="title" class="flex items-center gap-2">
        <Icon icon="formkit:week" />
        Weekly Report
      </div>
      <div class="grid grid-cols-4 space-x-4 mb-4">
        <button on:click={downloadInternaldailReport} class="text-xs py-1 px-2 rounded-md bg-lime-400 hover:bg-lime-500 focus:ring-4 focus:ring-lime-600">FDD Master Tracker</button>
        <button on:click={downloadIntegrationReport} class="text-xs py-1 px-2 rounded-md bg-indigo-500 hover:bg-indigo-500 focus:ring-4 focus:ring-indigo-600">Integration Staus Tracker</button>
      </div>

      <!-- Dailly & Weekly Report Title -->
      <div class="flex items-center gap-4 mb-4 bg-indigo-500 text-slate-800 px-4 py-2 rounded-sm">
        <h4 class="col-span-2 font-bold"> Weekly performance for All Work Progress</h4>
        <p class="text-xs col-span-2">Week: {weekNumber} ({formattedStartOfWeek} ~ {formattedEndOfWeek}) </p>
      </div>

      <!-- Dailly & Weekly Data -->
      <div class="grid grid-cols-3 gap-4">

        <!-- Install & OnAir-->
        <div class="flex flex-col border rounded-lg border-slate-700 p-4">
          <div class="flex items-center mb-3 gap-2">
            <Icon icon="ion:construct-outline" class="text-xl text-fuchsia-400"/>
            <h1 class="font-bold text-xl text-slate-400">Install & OnAir</h1>
          </div>

          <div class="grid grid-cols-4 items-center justify-start">
            <h1 class="text-sm text-slate-400 font-bold mb-1">Items</h1>
            <h1 class="text-sm text-slate-400 font-bold mb-1">Total</h1>
            <h1 class="text-sm text-slate-400 font-bold mb-1">Week({weekNumber})</h1>
            <h1 class="text-sm text-slate-400 font-bold mb-1">Day({dayName})</h1>

            <hr class="col-span-4 border border-slate-700 mb-2">

            <h1 class="text-xs text-slate-400 mb-1">Installation</h1>
            <h1 class="text-xs text-slate-400 mb-1">{data.dashboardData.data.total_installcomplete}</h1>
            {#if data.dashboardData.data.installcomplete_week.length > 0}
            <button 
              class="text-xs mb-1 rounded-md flex items-center justify-center w-8 {data.dashboardData.data.installcomplete_week.length > 0 ? 'bg-fuchsia-400 text-slate-900': 'bg-slate-700 text-slate-900'}"
              on:click={() => openWeekModal("Installation")}>
              {data.dashboardData.data.installcomplete_week.length}
            </button>
            {:else}
            <h1 class="text-xs mb-1 rounded-md flex items-center justify-center w-8 {data.dashboardData.data.installcomplete_week.length > 0 ? 'bg-fuchsia-400 text-slate-900': 'bg-slate-700 text-slate-900'}">
              {data.dashboardData.data.installcomplete_week.length}
            </h1>
            {/if}
            {#if data.dashboardData.data.installcomplete_today.length > 0}
            <button
              class="text-xs mb-1 rounded-md flex items-center justify-center w-8 {data.dashboardData.data.installcomplete_today.length > 0 ? 'bg-fuchsia-400 text-slate-900': 'bg-slate-700 text-slate-900'}"
              on:click={() => openDayModal("Installation Day")}>
              {data.dashboardData.data.installcomplete_today.length}
            </button>
            {:else}
            <h1 class="text-xs mb-1 rounded-md flex items-center justify-center w-8 {data.dashboardData.data.installcomplete_today.length > 0 ? 'bg-fuchsia-400 text-slate-900': 'bg-slate-700 text-slate-900'}">
              {data.dashboardData.data.installcomplete_today.length}
            </h1>
            {/if}

            <h1 class="text-xs text-slate-400 mb-1">Integration</h1>
            <h1 class="text-xs text-slate-400 mb-1">{data.dashboardData.data.total_integration}</h1>
            {#if data.dashboardData.data.integration_week.length > 0}
            <button 
              class="text-xs mb-1 rounded-md flex items-center justify-center w-8 {data.dashboardData.data.integration_week.length > 0 ? 'bg-fuchsia-400 text-slate-900': 'bg-slate-700 text-slate-900'}"
              on:click={() => openWeekModal("Integration")}>
              {data.dashboardData.data.integration_week.length}
            </button>
            {:else}
            <h1 class="text-xs mb-1 rounded-md flex items-center justify-center w-8 {data.dashboardData.data.integration_week.length > 0 ? 'bg-fuchsia-400 text-slate-900': 'bg-slate-700 text-slate-900'}">
              {data.dashboardData.data.integration_week.length}
            </h1>
            {/if}
            {#if data.dashboardData.data.integration_today.length > 0}
            <button
              class="text-xs mb-1 rounded-md flex items-center justify-center w-8 {data.dashboardData.data.integration_today.length > 0 ? 'bg-fuchsia-400 text-slate-900': 'bg-slate-700 text-slate-900'}"
              on:click={() => openDayModal("Installation Day")}>
              {data.dashboardData.data.integration_today.length}
            </button>
            {:else}
            <h1 class="text-xs mb-1 rounded-md flex items-center justify-center w-8 {data.dashboardData.data.integration_today.length > 0 ? 'bg-fuchsia-400 text-slate-900': 'bg-slate-700 text-slate-900'}">
              {data.dashboardData.data.integration_today.length}
            </h1>
            {/if}

            <h1 class="text-xs text-slate-400 mb-1">OnAir</h1>
            <h1 class="text-xs text-slate-400 mb-1">{data.dashboardData.data.total_onair}</h1>
            {#if data.dashboardData.data.onair_week.length > 0}
            <button 
              class="text-xs mb-1 rounded-md flex items-center justify-center w-8 {data.dashboardData.data.onair_week.length > 0 ? 'bg-fuchsia-400 text-slate-900': 'bg-slate-700 text-slate-900'}"
              on:click={() => openWeekModal("OnAir")}>
              {data.dashboardData.data.onair_week.length}
            </button>
            {:else}
            <h1 class="text-xs mb-1 rounded-md flex items-center justify-center w-8 {data.dashboardData.data.onair_week.length > 0 ? 'bg-fuchsia-400 text-slate-900': 'bg-slate-700 text-slate-900'}">
              {data.dashboardData.data.onair_week.length}
            </h1>
            {/if}
            {#if data.dashboardData.data.onair_today.length > 0}
            <button
              class="text-xs mb-1 rounded-md flex items-center justify-center w-8 {data.dashboardData.data.onair_today.length > 0 ? 'bg-fuchsia-400 text-slate-900': 'bg-slate-700 text-slate-900'}"
              on:click={() => openDayModal("OnAir Day")}>
              {data.dashboardData.data.onair_today.length}
            </button>
            {:else}
            <h1 class="text-xs mb-1 rounded-md flex items-center justify-center w-8 {data.dashboardData.data.onair_today.length > 0 ? 'bg-fuchsia-400 text-slate-900': 'bg-slate-700 text-slate-900'}">
              {data.dashboardData.data.onair_today.length}
            </h1>
            {/if}
          </div>
        </div>

        <!-- BS Report-->
        <div class="flex flex-col border rounded-lg border-slate-700 p-4">
          <div class="flex items-center mb-3 gap-2">
            <Icon icon="ri:taxi-wifi-line" class="text-xl text-purple-600"/>
            <h1 class="font-bold text-xl text-slate-400">BS Report</h1>
          </div>

          <div class="grid grid-cols-4 items-center justify-start">
            <h1 class="text-xs text-slate-400 font-bold mb-1">Items</h1>
            <h1 class="text-xs text-slate-400 font-bold mb-1">Total</h1>
            <h1 class="text-xs text-slate-400 font-bold mb-1">Week({weekNumber})</h1>
            <h1 class="text-xs text-slate-400 font-bold mb-1">Day({dayName})</h1>

            <hr class="col-span-4 border border-slate-700 mb-2">

            <h1 class="text-xs text-slate-400 mb-1">SSV Complete</h1>
            <h1 class="text-xs text-slate-400 mb-1">{data.dashboardData.data.total_ssvcomplete}</h1>
            {#if data.dashboardData.data.ssvcomplete_week.length > 0}
            <button 
              class="text-xs mb-1 rounded-md flex items-center justify-center w-8 {data.dashboardData.data.ssvcomplete_week.length > 0 ? 'bg-purple-400 text-slate-900': 'bg-slate-700 text-slate-900'}"
              on:click={() => openWeekModal("SSV Complete")}>
              {data.dashboardData.data.ssvcomplete_week.length}
            </button>
            {:else}
            <h1 class="text-xs mb-1 rounded-md flex items-center justify-center w-8 {data.dashboardData.data.ssvcomplete_week.length > 0 ? 'bg-purple-600 text-slate-900': 'bg-slate-700 text-slate-900'}">
              {data.dashboardData.data.ssvcomplete_week.length}
            </h1>
            {/if}
            {#if data.dashboardData.data.ssvcomplete_today.length > 0}
            <button
              class="text-xs mb-1 rounded-md flex items-center justify-center w-8 {data.dashboardData.data.ssvcomplete_today.length > 0 ? 'bg-purple-400 text-slate-900': 'bg-slate-700 text-slate-900'}"
              on:click={() => openDayModal("SSV Complete Day")}>
              {data.dashboardData.data.ssvcomplete_today.length}
            </button>
            {:else}
            <h1 class="text-xs mb-1 rounded-md flex items-center justify-center w-8 {data.dashboardData.data.ssvcomplete_today.length > 0 ? 'bg-purple-600 text-slate-900': 'bg-slate-700 text-slate-900'}">
              {data.dashboardData.data.ssvcomplete_today.length}
            </h1>
            {/if}

            <h1 class="text-xs text-slate-400 mb-1">BS Submit</h1>
            <h1 class="text-xs text-slate-400 mb-1">{data.dashboardData.data.total_bssubmit}</h1>
            {#if data.dashboardData.data.bssubmit_week.length > 0}
            <button 
              class="text-xs mb-1 rounded-md flex items-center justify-center w-8 {data.dashboardData.data.bssubmit_week.length > 0 ? 'bg-purple-600 text-slate-900': 'bg-slate-700 text-slate-900'}"
              on:click={() => openWeekModal("BS Submit")}>
              {data.dashboardData.data.bssubmit_week.length}
            </button>
            {:else}
            <h1 class="text-xs mb-1 rounded-md flex items-center justify-center w-8 {data.dashboardData.data.bssubmit_week.length > 0 ? 'bg-purple-600 text-slate-900': 'bg-slate-700 text-slate-900'}">
              {data.dashboardData.data.bssubmit_week.length}
            </h1>
            {/if}
            {#if data.dashboardData.data.bssubmit_today.length > 0}
            <button
              class="text-xs mb-1 rounded-md flex items-center justify-center w-8 {data.dashboardData.data.bssubmit_today.length > 0 ? 'bg-purple-400 text-slate-900': 'bg-slate-700 text-slate-900'}"
              on:click={() => openDayModal("BS Submit Day")}>
              {data.dashboardData.data.bssubmit_today.length}
            </button>
            {:else}
            <h1 class="text-xs mb-1 rounded-md flex items-center justify-center w-8 {data.dashboardData.data.bssubmit_today.length > 0 ? 'bg-purple-600 text-slate-900': 'bg-slate-700 text-slate-900'}">
              {data.dashboardData.data.bssubmit_today.length}
            </h1>
            {/if}

            <h1 class="text-xs text-slate-400 mb-1">BS Approve</h1>
            <h1 class="text-xs text-slate-400 mb-1">{data.dashboardData.data.total_bsapprove}</h1>
            {#if data.dashboardData.data.bsapprove_week.length > 0}
            <button 
              class="text-xs mb-1 rounded-md flex items-center justify-center w-8 {data.dashboardData.data.bsapprove_week.length > 0 ? 'bg-purple-600 text-slate-900': 'bg-slate-700 text-slate-900'}"
              on:click={() => openWeekModal("BS Approve")}>
              {data.dashboardData.data.bsapprove_week.length}
            </button>
            {:else}
            <h1 class="text-xs mb-1 rounded-md flex items-center justify-center w-8 {data.dashboardData.data.bsapprove_week.length > 0 ? 'bg-purple-600 text-slate-900': 'bg-slate-700 text-slate-900'}">
              {data.dashboardData.data.bsapprove_week.length}
            </h1>
            {/if}
            {#if data.dashboardData.data.bsapprove_today.length > 0}
            <button
              class="text-xs mb-1 rounded-md flex items-center justify-center w-8 {data.dashboardData.data.bsapprove_today.length > 0 ? 'bg-purple-400 text-slate-900': 'bg-slate-700 text-slate-900'}"
              on:click={() => openDayModal("BS Approve Day")}>
              {data.dashboardData.data.bsapprove_today.length}
            </button>
            {:else}
            <h1 class="text-xs mb-1 rounded-md flex items-center justify-center w-8 {data.dashboardData.data.bsapprove_today.length > 0 ? 'bg-purple-600 text-slate-900': 'bg-slate-700 text-slate-900'}">
              {data.dashboardData.data.bsapprove_today.length}
            </h1>
            {/if}
          </div>
        </div>

        <!-- Optimization-->
        <div class="flex flex-col border rounded-lg border-slate-700 p-4">
          <div class="flex items-center mb-3 gap-2">
            <Icon icon="clarity:data-cluster-line" class="text-xl text-indigo-500"/>
            <h1 class="font-bold text-xl text-slate-400">Optimization</h1>
          </div>

          <div class="grid grid-cols-4 items-center justify-start">
            <h1 class="text-xs text-slate-400 font-bold mb-1">Items</h1>
            <h1 class="text-xs text-slate-400 font-bold mb-1">Total</h1>
            <h1 class="text-xs text-slate-400 font-bold mb-1">Week({weekNumber})</h1>
            <h1 class="text-xs text-slate-400 font-bold mb-1">Day({dayName})</h1>

            <hr class="col-span-4 border border-slate-700 mb-2">

            <h1 class="text-xs text-slate-400 mb-1">OPT Complete</h1>
            <h1 class="text-xs text-slate-400 mb-1">{data.dashboardData.data.total_optcomplete}</h1>
            {#if data.dashboardData.data.optcomplete_week.length > 0}
            <button 
              class="text-xs mb-1 rounded-md flex items-center justify-center w-8 {data.dashboardData.data.optcomplete_week.length > 0 ? 'bg-indigo-400 text-slate-900': 'bg-slate-700 text-slate-900'}"
              on:click={() => openWeekModal("OPT Complete")}>
              {data.dashboardData.data.optcomplete_week.length}
            </button>
            {:else}
            <h1 class="text-xs mb-1 rounded-md flex items-center justify-center w-8 {data.dashboardData.data.optcomplete_week.length > 0 ? 'bg-indigo-500 text-slate-900': 'bg-slate-700 text-slate-900'}">
              {data.dashboardData.data.optcomplete_week.length}
            </h1>
            {/if}
            {#if data.dashboardData.data.optcomplete_today.length > 0}
            <button
              class="text-xs mb-1 rounded-md flex items-center justify-center w-8 {data.dashboardData.data.optcomplete_today.length > 0 ? 'bg-indigo-400 text-slate-900': 'bg-slate-700 text-slate-900'}"
              on:click={() => openDayModal("OPT Complete Day")}>
              {data.dashboardData.data.optcomplete_today.length}
            </button>
            {:else}
            <h1 class="text-xs mb-1 rounded-md flex items-center justify-center w-8 {data.dashboardData.data.optcomplete_today.length > 0 ? 'bg-indigo-500 text-slate-900': 'bg-slate-700 text-slate-900'}">
              {data.dashboardData.data.optcomplete_today.length}
            </h1>
            {/if}

            <h1 class="text-xs text-slate-400 mb-1">OPT Submit</h1>
            <h1 class="text-xs text-slate-400 mb-1">{data.dashboardData.data.total_optsubmit}</h1>
            {#if data.dashboardData.data.optsubmit_week.length > 0}
            <button 
              class="text-xs mb-1 rounded-md flex items-center justify-center w-8 {data.dashboardData.data.optsubmit_week.length > 0 ? 'bg-indigo-400 text-slate-900': 'bg-slate-700 text-slate-900'}"
              on:click={() => openWeekModal("OPT Submit")}>
              {data.dashboardData.data.optsubmit_week.length}
            </button>
            {:else}
            <h1 class="text-xs mb-1 rounded-md flex items-center justify-center w-8 {data.dashboardData.data.optsubmit_week.length > 0 ? 'bg-indigo-500 text-slate-900': 'bg-slate-700 text-slate-900'}">
              {data.dashboardData.data.optsubmit_week.length}
            </h1>
            {/if}
            {#if data.dashboardData.data.optsubmit_today.length > 0}
            <button
              class="text-xs mb-1 rounded-md flex items-center justify-center w-8 {data.dashboardData.data.optsubmit_today.length > 0 ? 'bg-indigo-400 text-slate-900': 'bg-slate-700 text-slate-900'}"
              on:click={() => openDayModal("OPT Submit Day")}>
              {data.dashboardData.data.optsubmit_today.length}
            </button>
            {:else}
            <h1 class="text-xs mb-1 rounded-md flex items-center justify-center w-8 {data.dashboardData.data.optsubmit_today.length > 0 ? 'bg-indigo-500 text-slate-900': 'bg-slate-700 text-slate-900'}">
              {data.dashboardData.data.optsubmit_today.length}
            </h1>
            {/if}

            <h1 class="text-xs text-slate-400 mb-1">OPT Approve</h1>
            <h1 class="text-xs text-slate-400 mb-1">{data.dashboardData.data.total_optapprove}</h1>
            {#if data.dashboardData.data.optapprove_week.length > 0}
            <button 
              class="text-xs mb-1 rounded-md flex items-center justify-center w-8 {data.dashboardData.data.optapprove_week.length > 0 ? 'bg-indigo-400 text-slate-900': 'bg-slate-700 text-slate-900'}"
              on:click={() => openWeekModal("OPT Approve")}>
              {data.dashboardData.data.optapprove_week.length}
            </button>
            {:else}
            <h1 class="text-xs mb-1 rounded-md flex items-center justify-center w-8 {data.dashboardData.data.optapprove_week.length > 0 ? 'bg-indigo-500 text-slate-900': 'bg-slate-700 text-slate-900'}">
              {data.dashboardData.data.optapprove_week.length}
            </h1>
            {/if}
            {#if data.dashboardData.data.optapprove_today.length > 0}
            <button
              class="text-xs mb-1 rounded-md flex items-center justify-center w-8 {data.dashboardData.data.optapprove_today.length > 0 ? 'bg-indigo-400 text-slate-900': 'bg-slate-700 text-slate-900'}"
              on:click={() => openDayModal("OPT Approve Day")}>
              {data.dashboardData.data.optapprove_today.length}
            </button>
            {:else}
            <h1 class="text-xs mb-1 rounded-md flex items-center justify-center w-8 {data.dashboardData.data.optapprove_today.length > 0 ? 'bg-indigo-500 text-slate-900': 'bg-slate-700 text-slate-900'}">
              {data.dashboardData.data.optapprove_today.length}
            </h1>
            {/if}
          </div>
        </div>

        <!-- Certification-->
        <div class="flex flex-col border rounded-lg border-slate-700 p-4">
          <div class="flex items-center mb-3 gap-2">
            <Icon icon="tabler:certificate" class="text-xl text-lime-400"/>
            <h1 class="font-bold text-xl text-slate-400">Certification</h1>
          </div>

          <div class="grid grid-cols-4 items-center justify-start">
            <h1 class="text-xs text-slate-400 font-bold mb-1">Items</h1>
            <h1 class="text-xs text-slate-400 font-bold mb-1">Total</h1>
            <h1 class="text-xs text-slate-400 font-bold mb-1">Week({weekNumber})</h1>
            <h1 class="text-xs text-slate-400 font-bold mb-1">Day({dayName})</h1>

            <hr class="col-span-4 border border-slate-700 mb-2">

            <h1 class="text-xs text-slate-400 mb-1">PAC Submit</h1>
            <h1 class="text-xs text-slate-400 mb-1">{data.dashboardData.data.total_pacsubmit}</h1>
            {#if data.dashboardData.data.pacsubmit_week.length > 0}
            <button 
              class="text-xs mb-1 rounded-md flex items-center justify-center w-8 {data.dashboardData.data.pacsubmit_week.length > 0 ? 'bg-lime-400 text-slate-900': 'bg-slate-700 text-slate-900'}"
              on:click={() => openWeekModal("PAC Submit")}>
              {data.dashboardData.data.pacsubmit_week.length}
            </button>
            {:else}
            <h1 class="text-xs mb-1 rounded-md flex items-center justify-center w-8 {data.dashboardData.data.pacsubmit_week.length > 0 ? 'bg-lime-500 text-slate-900': 'bg-slate-700 text-slate-900'}">
              {data.dashboardData.data.pacsubmit_week.length}
            </h1>
            {/if}
            {#if data.dashboardData.data.pacsubmit_today.length > 0}
            <button
              class="text-xs mb-1 rounded-md flex items-center justify-center w-8 {data.dashboardData.data.pacsubmit_today.length > 0 ? 'bg-lime-400 text-slate-900': 'bg-slate-700 text-slate-900'}"
              on:click={() => openDayModal("PAC Submit Day")}>
              {data.dashboardData.data.pacsubmit_today.length}
            </button>
            {:else}
            <h1 class="text-xs mb-1 rounded-md flex items-center justify-center w-8 {data.dashboardData.data.pacsubmit_today.length > 0 ? 'bg-lime-500 text-slate-900': 'bg-slate-700 text-slate-900'}">
              {data.dashboardData.data.pacsubmit_today.length}
            </h1>
            {/if}

            <h1 class="text-xs text-slate-400 mb-1">FAC Submit</h1>
            <h1 class="text-xs text-slate-400 mb-1">{data.dashboardData.data.total_facsubmit}</h1>
            {#if data.dashboardData.data.facsubmit_week.length > 0}
            <button 
              class="text-xs mb-1 rounded-md flex items-center justify-center w-8 {data.dashboardData.data.facsubmit_week.length > 0 ? 'bg-fuchsia-400 text-slate-900': 'bg-slate-700 text-slate-900'}"
              on:click={() => openWeekModal("FAC Submit")}>
              {data.dashboardData.data.facsubmit_week.length}
            </button>
            {:else}
            <h1 class="text-xs mb-1 rounded-md flex items-center justify-center w-8 {data.dashboardData.data.facsubmit_week.length > 0 ? 'bg-lime-500 text-slate-900': 'bg-slate-700 text-slate-900'}">
              {data.dashboardData.data.facsubmit_week.length}
            </h1>
            {/if}
            {#if data.dashboardData.data.facsubmit_today.length > 0}
            <button
              class="text-xs mb-1 rounded-md flex items-center justify-center w-8 {data.dashboardData.data.facsubmit_today.length > 0 ? 'bg-lime-400 text-slate-900': 'bg-slate-700 text-slate-900'}"
              on:click={() => openDayModal("FAC Submit Day")}>
              {data.dashboardData.data.facsubmit_today.length}
            </button>
            {:else}
            <h1 class="text-xs mb-1 rounded-md flex items-center justify-center w-8 {data.dashboardData.data.facsubmit_today.length > 0 ? 'bg-lime-500 text-slate-900': 'bg-slate-700 text-slate-900'}">
              {data.dashboardData.data.facsubmit_today.length}
            </h1>
            {/if}

            <h1 class="text-xs text-slate-400 mb-1">P/F Approve</h1>
            <h1 class="text-xs text-slate-400 col-span-3 mb-1">
              {data.dashboardData.data.total_facapprove}/{data.dashboardData.data.total_facapprove}
            </h1>
          </div>
        </div>

      </div>


    </TabItem>
  </Tabs>
</div>

<WeekListModal bind:WeeklyModal={WeeklyModal} {data} {name} />
<DayListModal bind:DailyModal={DailyModal} {data} {name} />
