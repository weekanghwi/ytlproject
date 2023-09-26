<script lang="ts">
  import { Modal, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
  import Icon from '@iconify/svelte';

  export let DailyModal: boolean = false;
  export let data: any;
  export let name: string;

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
  const formattedToday = formatDate(now)
</script>

<Modal
  title="{name} List (Week{weekNumber})" 
  color="indigo"
  bind:open={DailyModal}
  size="xs" 
  autoclose={false} 
  outsideclose={true}
>
  <div class="flex items-center gap-1">
    <Icon icon="fluent-mdl2:date-time" />
    <p class=" text-xs">{formattedToday} {dayNames}</p>
  </div>

  {#if name === 'Installation Day'}
    <Table shadow={true} hoverable={true} customeColor={'bg-gray-400'} class="w-full">
      <TableHead>
        <TableHeadCell>Site ID</TableHeadCell>
        <TableHeadCell>Complete Date</TableHeadCell>
      </TableHead>
      <TableBody>
        {#each data.dashboardData.data.installcomplete_today as item (item.id)}
        <TableBodyRow color="green" > 
          <TableBodyCell tdClass="px-6 py-4 whitespace-nowrap text-xs">
            <span class="dark:text-gray-900">{item.sitebasicinfo.siteid}</span>
          </TableBodyCell>
          <TableBodyCell tdClass="px-6 py-4 whitespace-nowrap text-xs">
            <span class="dark:text-gray-900">{item.ssv.completedate}</span>
          </TableBodyCell>
        </TableBodyRow>
        {/each}
      </TableBody>
    </Table>

  {:else if name === 'Integration Day'}
    <Table shadow={true} hoverable={true} customeColor={'bg-gray-400'} class="w-full">
      <TableHead>
        <TableHeadCell>Site ID</TableHeadCell>
        <TableHeadCell>Integration Date</TableHeadCell>
      </TableHead>
      <TableBody>
        {#each data.dashboardData.data.integration_today as item (item.id)}
        <TableBodyRow color="green" > 
          <TableBodyCell tdClass="px-6 py-4 whitespace-nowrap text-xs">
            <span class="dark:text-gray-900">{item.sitebasicinfo.siteid}</span>
          </TableBodyCell>
          <TableBodyCell tdClass="px-6 py-4 whitespace-nowrap text-xs">
            <span class="dark:text-gray-900">{item.ssv.integrationondate}</span>
          </TableBodyCell>
        </TableBodyRow>
        {/each}
      </TableBody>
    </Table>

  {:else if name === 'OnAir Day'}
    <Table shadow={true} hoverable={true} customeColor={'bg-gray-400'} class="w-full">
      <TableHead>
        <TableHeadCell>Site ID</TableHeadCell>
        <TableHeadCell>OnAir Date</TableHeadCell>
      </TableHead>
      <TableBody>
        {#each data.dashboardData.data.onair_today as item (item.id)}
        <TableBodyRow color="green" > 
          <TableBodyCell tdClass="px-6 py-4 whitespace-nowrap text-xs">
            <span class="dark:text-gray-900">{item.sitebasicinfo.siteid}</span>
          </TableBodyCell>
          <TableBodyCell tdClass="px-6 py-4 whitespace-nowrap text-xs">
            <span class="dark:text-gray-900">{item.ssv.onairdate}</span>
          </TableBodyCell>
        </TableBodyRow>
        {/each}
      </TableBody>
    </Table>
  
  {:else if name === 'SSV Complete Day'}
    <Table shadow={true} hoverable={true} customeColor={'bg-gray-400'} class="w-full">
      <TableHead>
        <TableHeadCell>Site ID</TableHeadCell>
        <TableHeadCell>Complete Date</TableHeadCell>
      </TableHead>
      <TableBody>
        {#each data.dashboardData.data.ssvcomplete_today as item (item.id)}
        <TableBodyRow color="green" > 
          <TableBodyCell tdClass="px-6 py-4 whitespace-nowrap text-xs">
            <span class="dark:text-gray-900">{item.sitebasicinfo.siteid}</span>
          </TableBodyCell>
          <TableBodyCell tdClass="px-6 py-4 whitespace-nowrap text-xs">
            <span class="dark:text-gray-900">{item.ssv.ssvcompletedate}</span>
          </TableBodyCell>
        </TableBodyRow>
        {/each}
      </TableBody>
    </Table>
  {:else if name === 'BS Submit Day'}
    <Table shadow={true} hoverable={true} customeColor={'bg-gray-400'} class="w-full">
      <TableHead>
        <TableHeadCell>Site ID</TableHeadCell>
        <TableHeadCell>Submit Date</TableHeadCell>
      </TableHead>
      <TableBody>
        {#each data.dashboardData.data.bssubmit_today as item (item.id)}
        <TableBodyRow color="green" > 
          <TableBodyCell tdClass="px-6 py-4 whitespace-nowrap text-xs">
            <span class="dark:text-gray-900">{item.sitebasicinfo.siteid}</span>
          </TableBodyCell>
          <TableBodyCell tdClass="px-6 py-4 whitespace-nowrap text-xs">
            <span class="dark:text-gray-900">{item.ssv.bssubmitdate}</span>
          </TableBodyCell>
        </TableBodyRow>
        {/each}
      </TableBody>
    </Table>
    {:else if name === 'OPT Complete Day'}
    <Table shadow={true} hoverable={true} customeColor={'bg-gray-400'} class="w-full">
      <TableHead>
        <TableHeadCell>Site ID</TableHeadCell>
        <TableHeadCell>Complete Date</TableHeadCell>
      </TableHead>
      <TableBody>
        {#each data.dashboardData.data.optcomplete_today as item (item.id)}
        <TableBodyRow color="green" > 
          <TableBodyCell tdClass="px-6 py-4 whitespace-nowrap text-xs">
            <span class="dark:text-gray-900">{item.sitebasicinfo.siteid}</span>
          </TableBodyCell>
          <TableBodyCell tdClass="px-6 py-4 whitespace-nowrap text-xs">
            <span class="dark:text-gray-900">{item.optimization.optcompletedate}</span>
          </TableBodyCell>
        </TableBodyRow>
        {/each}
      </TableBody>
    </Table>
  {:else if name === 'OPT Submit Day'}
    <Table shadow={true} hoverable={true} customeColor={'bg-gray-400'} class="w-full">
      <TableHead>
        <TableHeadCell>Site ID</TableHeadCell>
        <TableHeadCell>Submit Date</TableHeadCell>
      </TableHead>
      <TableBody>
        {#each data.dashboardData.data.optsubmit_today as item (item.id)}
        <TableBodyRow color="green" > 
          <TableBodyCell tdClass="px-6 py-4 whitespace-nowrap text-xs">
            <span class="dark:text-gray-900">{item.sitebasicinfo.siteid}</span>
          </TableBodyCell>
          <TableBodyCell tdClass="px-6 py-4 whitespace-nowrap text-xs">
            <span class="dark:text-gray-900">{item.optimization.optsubmitdate}</span>
          </TableBodyCell>
        </TableBodyRow>
        {/each}
      </TableBody>
    </Table>
  {:else if name === 'OPT Approve Day'}
    <Table shadow={true} hoverable={true} customeColor={'bg-gray-400'} class="w-full">
      <TableHead>
        <TableHeadCell>Site ID</TableHeadCell>
        <TableHeadCell>Approve Date</TableHeadCell>
      </TableHead>
      <TableBody>
        {#each data.dashboardData.data.optapprove_today as item (item.id)}
        <TableBodyRow color="green" > 
          <TableBodyCell tdClass="px-6 py-4 whitespace-nowrap text-xs">
            <span class="dark:text-gray-900">{item.sitebasicinfo.siteid}</span>
          </TableBodyCell>
          <TableBodyCell tdClass="px-6 py-4 whitespace-nowrap text-xs">
            <span class="dark:text-gray-900">{item.optimization.optapprovedate}</span>
          </TableBodyCell>
        </TableBodyRow>
        {/each}
      </TableBody>
    </Table>
  {:else if name === 'PAC Submit Day'}
    <Table shadow={true} hoverable={true} customeColor={'bg-gray-400'} class="w-full">
      <TableHead>
        <TableHeadCell>Site ID</TableHeadCell>
        <TableHeadCell>PAC Submit Date</TableHeadCell>
      </TableHead>
      <TableBody>
        {#each data.dashboardData.data.pacsubmit_today as item (item.id)}
        <TableBodyRow color="green" > 
          <TableBodyCell tdClass="px-6 py-4 whitespace-nowrap text-xs">
            <span class="dark:text-gray-900">{item.sitebasicinfo.siteid}</span>
          </TableBodyCell>
          <TableBodyCell tdClass="px-6 py-4 whitespace-nowrap text-xs">
            <span class="dark:text-gray-900">{item.certification.pacsubmitdate}</span>
          </TableBodyCell>
        </TableBodyRow>
        {/each}
      </TableBody>
    </Table>
  {:else if name === 'FAC Submit Day'}
    <Table shadow={true} hoverable={true} customeColor={'bg-gray-400'} class="w-full">
      <TableHead>
        <TableHeadCell>Site ID</TableHeadCell>
        <TableHeadCell>FAC Submit Date</TableHeadCell>
      </TableHead>
      <TableBody>
        {#each data.dashboardData.data.facsubmit_today as item (item.id)}
        <TableBodyRow color="green" > 
          <TableBodyCell tdClass="px-6 py-4 whitespace-nowrap text-xs">
            <span class="dark:text-gray-900">{item.sitebasicinfo.siteid}</span>
          </TableBodyCell>
          <TableBodyCell tdClass="px-6 py-4 whitespace-nowrap text-xs">
            <span class="dark:text-gray-900">{item.certification.facsubmitdate}</span>
          </TableBodyCell>
        </TableBodyRow>
        {/each}
      </TableBody>
    </Table>
  {/if}
</Modal>