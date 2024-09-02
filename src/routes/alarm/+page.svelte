<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageData } from "./$types";

  export let data: PageData;

  let file: File | null = null
  let message = '';
  let error = '';

  function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      file = target.files[0];
    }
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();
    if (!file) {
      error = 'No file selected';
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://10.24.8.120:8000/api/alarmdata/upload_file/', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        message = result.message;
        error = '';
        const dataResponse = await fetch('http://10.24.8.120:8000/api/alarmdata/');
        data.alarmData = await dataResponse.json();
      } else {
        error = result.error || 'An error occurred';
        message = '';
      }
    } catch (err) {
      error = 'An error occurred';
      message = '';
      console.error(err);
    }
  }

  // Find the latest alarm date
  const latestAlarmDate = data.alarms.reduce((latest, alarm) => {
    return new Date(alarm.alarm_date) > new Date(latest) ? alarm.alarm_date : latest;
  }, '1970-01-01');

  // Filter alarms by the latest date
  const latestAlarms = data.alarms.filter(alarm => alarm.alarm_date === latestAlarmDate);
</script>

<div class="container mx-auto p-4">
  <h1 class="text-white text-2xl font-bold mb-4">RAS Folder Alarm Site List</h1>

  <div class="mb-8">
    <h2 class="text-white text-xl font-semibold mb-1">Upload Alarm Data</h2>
    <p class="mb-2 text-xs text-gray-400">Please ensure your file (.xlsx or .csv) includes the following columns: Site ID, Site Name, Folder, Alarm</p>
    <form on:submit={handleSubmit} class="flex items-center space-x-4">
      <input type="file" accept=".csv,.xlsx" on:change={handleFileChange} required class="rounded text-gray-400 text-xs border border-gray-600" />
      <button type="submit" class="bg-blue-500 text-white text-left py-[6px] px-3 rounded hover:bg-blue-600">Upload</button>
    </form>
    {#if message}
      <p class="text-green-600 mt-2 text-xs">{message}</p>
    {/if}
    {#if error}
      <p class="text-red-600 mt-2 text-xs">{error}</p>
    {/if}
  </div>

  <div class="overflow-x-auto">
    <div class="grid grid-cols-4 gap-2">
      {#if latestAlarms && latestAlarms.length > 0}
        {#each latestAlarms as alarms}
          <div class="flex flex-col rounded-md bg-slate-700/50 p-4">
            <div class="flex items-center gap-4">
              <p class="text-md font-bold text-slate-200">{alarms.site_id}</p>
              <div class="flex items-center justify-center text-center gap-2">
                <p class="text-xs text-slate-400">Alarm Duration</p>
                <p class="text-xs text-slate-900 rounded-md bg-yellow-200 px-2">{alarms.duration} Days</p>
              </div>
            </div>
            <p class="text-xs text-slate-200">{alarms.site_name}</p>
            
            <div class="flex items-cneter gap-2">
              <p class="text-xs bg-slate-950 text-slate-200 rounded-md px-2">{alarms.site_config}</p>
              <p class="text-xs bg-slate-950 text-slate-200 rounded-md px-2">{alarms.contracttype}</p>
            </div>

            <div class="flex items-center">
              <p class="text-xs text-slate-400">Alarm Date: {alarms.alarm_date}</p>
            </div>

            <div class="mt-4">
              <p class="text-md text-slate-200">Recent Alarms</p>
              {#each alarms.alarms.recent as alarm, index}
              <div class="flex items-center mt-1 gap-2">
                <p class="text-xs text-slate-600 rounded-full h-[14px] w-[14px] bg-rose-400 text-center">{index + 1}</p>
                <p class="text-[10px] text-slate-400">
                  {#each alarm.split(/,(?=\s*[^,])/g) as part}
                    {part.trim()}<br/>
                  {/each}
                </p>
              </div>
              {/each}
            </div>

            <div class="mt-2">
              <p class="text-md text-slate-200">Previous Alarms</p>
              {#each alarms.alarms.previous as alarm, index}
              <div class="flex items-center mt-1 gap-2">
                <p class="text-xs text-slate-600 rounded-full h-[14px] w-[14px] bg-rose-400 text-center">{index + 1}</p>
                <p class="text-[10px] text-slate-400">
                  {#each alarm.split(/,(?=\s*[^,])/g) as part}
                    {part.trim()}<br/>
                  {/each}
                </p>
              </div>
              {/each}
            </div>
          </div>
        {/each}
      {/if}

    </div>
  </div>

  <!-- <div class="overflow-x-auto">
    <table class="min-w-full bg-gray-200/50 rounded-xl">
      <thead>
        <tr class="bg-gray-600 text-xs text-white rounded-xl">
          <th class="py-2 px-2 text-left border-b border-gray-600">Site ID</th>
          <th class="py-2 px-2 text-left border-b border-gray-600">Site Name</th>
          <th class="py-2 px-2 text-left border-b border-gray-600">Folder</th>
          <th class="py-2 px-2 text-left border-b border-gray-600">Alarm</th>
          <th class="py-2 px-2 text-left border-b border-gray-600">Alarm Date</th>
        </tr>
      </thead>
      <tbody>
        {#if data.alarmData.results && data.alarmData.results.length > 0}
          {#each data.alarmData.results as alarmData}
            <tr class="hover:bg-gray-50 text-xs">
              <td class="py-2 px-2 text-left border-b border-gray-600">{alarmData.sitebasicinfo.siteid}</td>
              <td class="py-2 px-2 text-left border-b border-gray-600">{alarmData.site_name}</td>
              <td class="py-2 px-2 text-left border-b border-gray-600">{alarmData.folder}</td>
              <td class="py-2 px-2 text-left border-b border-gray-600">{alarmData.alarm}</td>
              <td class="py-2 px-2 text-left border-b border-gray-600">{alarmData.alarmdate}</td>
            </tr>
          {/each}
        {:else}
          <tr>
            <td colspan="5" class="py-4 px-2 text-left">No data available</td>
          </tr>
        {/if}
      </tbody>
    </table>
    <p class="text-white">
    </p>
  </div> -->
</div>