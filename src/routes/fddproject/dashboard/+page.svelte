<script>
  import { Breadcrumb, BreadcrumbItem } from "flowbite-svelte";

  import { LineChart } from '@carbon/charts-svelte'
  import '@carbon/styles/css/styles.css'
  import '@carbon/charts-svelte/styles.css'

  
</script>

<div class="p-2 w-full pt-2">
  <!-- Breadcrumb -->
  <Breadcrumb aria-label="siteinfo breadcrumb" class="mb-6">
    <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
    <BreadcrumbItem href="/fddproject">FDD Project</BreadcrumbItem>
    <BreadcrumbItem>Dashboard</BreadcrumbItem>
  </Breadcrumb>

  <!-- Dashboard Contents -->
  <div class="grid grid-cols-5 items-center justify-center text-slate-800 dark:text-slate-400 border border-indigo-500 gap-4">
    <div class="flex items-center justify-center col-span-2 text-white">
    </div>
    <div class="flex items-center justify-center">Monthly</div>
    <div class="flex items-center justify-center">Yearly</div>
    <div class="flex items-center justify-center">4</div>
    <div class="flex items-center justify-center">5</div>

    <div class="flex items-center justify-center">Weekly fomance</div>
    <div class="flex items-center justify-center">Monthly</div>
    <div class="flex items-center justify-center">Yearly</div>
    <div class="flex items-center justify-center">4</div>
    <div class="flex items-center justify-center">5</div>
  </div>
</div>