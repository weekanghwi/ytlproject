<script lang="ts">
	import { Breadcrumb, BreadcrumbItem, Button, TabItem, Tabs } from "flowbite-svelte";
  import Icon from '@iconify/svelte';

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
        <button on:click={downloadIntegrationReport} class="text-xs py-1 px-2 rounded-md bg-indigo-400 hover:bg-indigo-500 focus:ring-4 focus:ring-indigo-600">Integration Staus Tracker</button>
      </div>
      <div class="grid grid-cols-4 items-center space-x-2 mb-4 bg-indigo-500 text-slate-800 px-4 py-2 rounded-sm">
        <h4 class="col-span-2 font-bold"> Weekly performance for All Work Progress</h4>
        <p class="text-xs col-span-2">Week: {weekNumber} ({formattedStartOfWeek} ~ {formattedEndOfWeek}) </p>
      </div>

      <div class="grid grid-cols-4 space-x-4">
        <div class="flex flex-col rounded-md border border-indigo-500 p-4">
          <h4 class="text-indigo-500 mb-4 font-bold">Install & Integration</h4>
          <div class="grid grid-cols-4 items-center text-slate-400 text-xs">
            <p class="font-bold col-span-2 mb-2">Items</p>
            <p class="font-bold mb-2">Today</p>
            <p class="font-bold mb-2">Week</p>

            <p class="text-slate-400 col-span-2">Installation</p>
            <p class="text-slate-400">Today</p>
            <p class="text-slate-400">Week</p>

            <p class="text-slate-400 col-span-2">Integraion</p>
            <p class="text-slate-400">Today</p>
            <p class="text-slate-400">Week</p>

            <p class="text-slate-400 col-span-2">OnAir</p>
            <p class="text-slate-400">Today</p>
            <p class="text-slate-400">Week</p>

            <p class="text-slate-400 col-span-2">Dismantle</p>
            <p class="text-slate-400">Today</p>
            <p class="text-slate-400">Week</p>
          </div>
        </div>
        
      </div>

    </TabItem>
  </Tabs>
</div>