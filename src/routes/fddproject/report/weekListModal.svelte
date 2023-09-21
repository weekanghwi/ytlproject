<script lang="ts">
  import { Modal, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
  import Icon from '@iconify/svelte';

  export let WeeklyModal: boolean = false;
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

</script>


<Modal
  title="{name} List (Week{weekNumber})" 
  color="green"
  bind:open={WeeklyModal}
  size="xs" 
  autoclose={false} 
  outsideclose={true}
>
  <div class="flex items-center gap-1">
    <Icon icon="fluent-mdl2:date-time" />
    <p class=" text-xs">{formattedStartOfWeek} ~ {formattedEndOfWeek}</p>
  </div>
  {#if name === 'Installation'}
    <Table shadow={true} hoverable={true} customeColor={'bg-gray-400'} class="w-full">
      <TableHead>
        <TableHeadCell>Site ID</TableHeadCell>
        <TableHeadCell>Install Date</TableHeadCell>
      </TableHead>
      <TableBody>
        {#each data.dashboardData.data.installcomplete_week as item (item.id)}
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
  {:else if name === 'Integration'}
    <Table shadow={true} hoverable={true} customeColor={'bg-gray-400'} class="w-full">
      <TableHead>
        <TableHeadCell>Site ID</TableHeadCell>
        <TableHeadCell>Integration Date</TableHeadCell>
      </TableHead>
      <TableBody>
        {#each data.dashboardData.data.integration_week as item (item.id)}
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
  {:else if name === 'OnAir'}
    <Table shadow={true} hoverable={true} customeColor={'bg-gray-400'} class="w-full">
      <TableHead>
        <TableHeadCell>Site ID</TableHeadCell>
        <TableHeadCell>OnAir Date</TableHeadCell>
      </TableHead>
      <TableBody>
        {#each data.dashboardData.data.onair_week as item (item.id)}
        <TableBodyRow color="green" > 
          <TableBodyCell tdClass="px-6 py-4 whitespace-nowrap text-xs">
            <span class="dark:text-gray-900">{item.sitebasicinfo.siteid}</span>
          </TableBodyCell>
          <TableBodyCell tdClass="px-6 py-4 whitespace-nowrap text-xs">
            <span class="dark:text-gray-900">{item.ssv.oaairdate}</span>
          </TableBodyCell>
        </TableBodyRow>
        {/each}
      </TableBody>
    </Table>
  {:else if name === 'SSV Complete'}
    <Table shadow={true} hoverable={true} customeColor={'bg-gray-400'} class="w-full">
      <TableHead>
        <TableHeadCell>Site ID</TableHeadCell>
        <TableHeadCell>Complete Date</TableHeadCell>
      </TableHead>
      <TableBody>
        {#each data.dashboardData.data.ssvcomplete_week as item (item.id)}
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
  {:else if name === 'BS Submit'}
    <Table shadow={true} hoverable={true} customeColor={'bg-gray-400'} class="w-full">
      <TableHead>
        <TableHeadCell>Site ID</TableHeadCell>
        <TableHeadCell>BS Submit Date</TableHeadCell>
      </TableHead>
      <TableBody>
        {#each data.dashboardData.data.bssubmit_week as item (item.id)}
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
  {:else if name === 'BS Approve'}
    <Table shadow={true} hoverable={true} customeColor={'bg-gray-400'} class="w-full">
      <TableHead>
        <TableHeadCell>Site ID</TableHeadCell>
        <TableHeadCell>Approve Date</TableHeadCell>
      </TableHead>
      <TableBody>
        {#each data.dashboardData.data.bsapprove_week as item (item.id)}
        <TableBodyRow color="green" > 
          <TableBodyCell tdClass="px-6 py-4 whitespace-nowrap text-xs">
            <span class="dark:text-gray-900">{item.sitebasicinfo.siteid}</span>
          </TableBodyCell>
          <TableBodyCell tdClass="px-6 py-4 whitespace-nowrap text-xs">
            <span class="dark:text-gray-900">{item.ssv.bsapprovedate}</span>
          </TableBodyCell>
        </TableBodyRow>
        {/each}
      </TableBody>
    </Table>
  {:else if name === 'OPT Complete'}
    <Table shadow={true} hoverable={true} customeColor={'bg-gray-400'} class="w-full">
      <TableHead>
        <TableHeadCell>Site ID</TableHeadCell>
        <TableHeadCell>Complete Date</TableHeadCell>
      </TableHead>
      <TableBody>
        {#each data.dashboardData.data.optcomplete_week as item (item.id)}
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
  {:else if name === 'OPT Submit'}
    <Table shadow={true} hoverable={true} customeColor={'bg-gray-400'} class="w-full">
      <TableHead>
        <TableHeadCell>Site ID</TableHeadCell>
        <TableHeadCell>Submit Date</TableHeadCell>
      </TableHead>
      <TableBody>
        {#each data.dashboardData.data.optsubmit_week as item (item.id)}
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
  {:else if name === 'OPT Approve'}
    <Table shadow={true} hoverable={true} customeColor={'bg-gray-400'} class="w-full">
      <TableHead>
        <TableHeadCell>Site ID</TableHeadCell>
        <TableHeadCell>Approve Date</TableHeadCell>
      </TableHead>
      <TableBody>
        {#each data.dashboardData.data.optapprove_week as item (item.id)}
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
  {:else if name === 'PAC Submit'}
    <Table shadow={true} hoverable={true} customeColor={'bg-gray-400'} class="w-full">
      <TableHead>
        <TableHeadCell>Site ID</TableHeadCell>
        <TableHeadCell>PAC Submit Date</TableHeadCell>
      </TableHead>
      <TableBody>
        {#each data.dashboardData.data.pacsubmit_week as item (item.id)}
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
  {:else if name === 'FAC Submit'}
    <Table shadow={true} hoverable={true} customeColor={'bg-gray-400'} class="w-full">
      <TableHead>
        <TableHeadCell>Site ID</TableHeadCell>
        <TableHeadCell>FAC Submit Date</TableHeadCell>
      </TableHead>
      <TableBody>
        {#each data.dashboardData.data.facsubmit_week as item (item.id)}
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