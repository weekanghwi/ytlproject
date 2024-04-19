<script lang="ts">
  import Icon from '@iconify/svelte';
  import { Progressbar } from 'flowbite-svelte';
  import Circleprogress from '../../components/Circleprogress.svelte';

  

  export let data;

  let availability_23 = data.statisticData.data.statistics_by_band['2.3G'][0].cell_availability.toFixed(2);
  let availability_26 = data.statisticData.data.statistics_by_band['2.6G'][0].cell_availability.toFixed(2);
  let availability_800 = data.statisticData.data.statistics_by_band['800M'][0].cell_availability.toFixed(2);
  let availability_ALL = data.statisticData.data.statistics_by_band['All'][0].cell_availability.toFixed(2);
  let attachsetup_23 = data.statisticData.data.statistics_by_band['2.3G'][0].attach_setup_success_rate.toFixed(2);
  let attachsetup_26 = data.statisticData.data.statistics_by_band['2.6G'][0].attach_setup_success_rate.toFixed(2);
  let attachsetup_800 = data.statisticData.data.statistics_by_band['800M'][0].attach_setup_success_rate.toFixed(2);
  let attachsetup_ALL = data.statisticData.data.statistics_by_band['All'][0].attach_setup_success_rate.toFixed(2);
  let rrcsetup_23 = data.statisticData.data.statistics_by_band['2.3G'][0].rrc_setup_success_rate.toFixed(2);
  let rrcsetup_26 = data.statisticData.data.statistics_by_band['2.6G'][0].rrc_setup_success_rate.toFixed(2);
  let rrcsetup_800 = data.statisticData.data.statistics_by_band['800M'][0].rrc_setup_success_rate.toFixed(2);
  let rrcsetup_ALL = data.statisticData.data.statistics_by_band['All'][0].rrc_setup_success_rate.toFixed(2);
  let erabsetup_23 = data.statisticData.data.statistics_by_band['2.3G'][0].erab_setup_success_rate_ngbr.toFixed(2);
  let erabsetup_26 = data.statisticData.data.statistics_by_band['2.6G'][0].erab_setup_success_rate_ngbr.toFixed(2);
  let erabsetup_800 = data.statisticData.data.statistics_by_band['800M'][0].erab_setup_success_rate_ngbr.toFixed(2);
  let erabsetup_ALL = data.statisticData.data.statistics_by_band['All'][0].erab_setup_success_rate_ngbr.toFixed(2);
  let voltesetup_23 = data.statisticData.data.statistics_by_band['2.3G'][0].volte_setup_success_rate_gbr.toFixed(2);
  let voltesetup_26 = data.statisticData.data.statistics_by_band['2.6G'][0].volte_setup_success_rate_gbr.toFixed(2);
  let voltesetup_800 = data.statisticData.data.statistics_by_band['800M'][0].volte_setup_success_rate_gbr.toFixed(2);
  let voltesetup_ALL = data.statisticData.data.statistics_by_band['All'][0].volte_setup_success_rate_gbr.toFixed(2);
  let calldropdata_23 = data.statisticData.data.statistics_by_band['2.3G'][0].call_drop_rate_erab_ngbr.toFixed(2);
  let calldropdata_26 = data.statisticData.data.statistics_by_band['2.6G'][0].call_drop_rate_erab_ngbr.toFixed(2);
  let calldropdata_800 = data.statisticData.data.statistics_by_band['800M'][0].call_drop_rate_erab_ngbr.toFixed(2);
  let calldropdata_ALL = data.statisticData.data.statistics_by_band['All'][0].call_drop_rate_erab_ngbr.toFixed(2);
  let calldropvolte_23 = data.statisticData.data.statistics_by_band['2.3G'][0].volte_call_drop_rate_erab_gbr.toFixed(2);
  let calldropvolte_26 = data.statisticData.data.statistics_by_band['2.6G'][0].volte_call_drop_rate_erab_gbr.toFixed(2);
  let calldropvolte_800 = data.statisticData.data.statistics_by_band['800M'][0].volte_call_drop_rate_erab_gbr.toFixed(2);
  let calldropvolte_ALL = data.statisticData.data.statistics_by_band['All'][0].volte_call_drop_rate_erab_gbr.toFixed(2);
  let intrafreqho_23 = data.statisticData.data.statistics_by_band['2.3G'][0].hosr_intra_frequency.toFixed(2);
  let intrafreqho_26 = data.statisticData.data.statistics_by_band['2.6G'][0].hosr_intra_frequency.toFixed(2);
  let intrafreqho_800 = data.statisticData.data.statistics_by_band['800M'][0].hosr_intra_frequency.toFixed(2);
  let intrafreqho_ALL = data.statisticData.data.statistics_by_band['All'][0].hosr_intra_frequency.toFixed(2);

  let interfreqho_23 = data.statisticData.data.statistics_by_band['2.3G'][0].hosr_inter_frequency.toFixed(2);
  let interfreqho_26 = data.statisticData.data.statistics_by_band['2.6G'][0].hosr_inter_frequency.toFixed(2);
  let interfreqho_800 = data.statisticData.data.statistics_by_band['800M'][0].hosr_inter_frequency.toFixed(2);
  let interfreqho_ALL = data.statisticData.data.statistics_by_band['All'][0].hosr_inter_frequency.toFixed(2);

  let x2outho_23 = data.statisticData.data.statistics_by_band['2.3G'][0].x2_handover_out_success_rate.toFixed(2);
  let x2outho_26 = data.statisticData.data.statistics_by_band['2.6G'][0].x2_handover_out_success_rate.toFixed(2);
  let x2outho_800 = data.statisticData.data.statistics_by_band['800M'][0].x2_handover_out_success_rate.toFixed(2);
  let x2outho_ALL = data.statisticData.data.statistics_by_band['All'][0].x2_handover_out_success_rate.toFixed(2);

  let x2inho_23 = data.statisticData.data.statistics_by_band['2.3G'][0].x2_handover_in_success_rate.toFixed(2);
  let x2inho_26 = data.statisticData.data.statistics_by_band['2.6G'][0].x2_handover_in_success_rate.toFixed(2);
  let x2inho_800 = data.statisticData.data.statistics_by_band['800M'][0].x2_handover_in_success_rate.toFixed(2);
  let x2inho_ALL = data.statisticData.data.statistics_by_band['All'][0].x2_handover_in_success_rate.toFixed(2);

  let s1outho_23 = data.statisticData.data.statistics_by_band['2.3G'][0].s1_handover_out_success_rate.toFixed(2);
  let s1outho_26 = data.statisticData.data.statistics_by_band['2.6G'][0].s1_handover_out_success_rate.toFixed(2);
  let s1outho_800 = data.statisticData.data.statistics_by_band['800M'][0].s1_handover_out_success_rate.toFixed(2);
  let s1outho_ALL = data.statisticData.data.statistics_by_band['All'][0].s1_handover_out_success_rate.toFixed(2);

  let s1inho_23 = data.statisticData.data.statistics_by_band['2.3G'][0].s1_handover_in_success_rate.toFixed(2);
  let s1inho_26 = data.statisticData.data.statistics_by_band['2.6G'][0].s1_handover_in_success_rate.toFixed(2);
  let s1inho_800 = data.statisticData.data.statistics_by_band['800M'][0].s1_handover_in_success_rate.toFixed(2);
  let s1inho_ALL = data.statisticData.data.statistics_by_band['All'][0].s1_handover_in_success_rate.toFixed(2);

  let dlbler_23 = data.statisticData.data.statistics_by_band['2.3G'][0].dl_bler.toFixed(2);
  let dlbler_26 = data.statisticData.data.statistics_by_band['2.6G'][0].dl_bler.toFixed(2);
  let dlbler_800 = data.statisticData.data.statistics_by_band['800M'][0].dl_bler.toFixed(2);
  let dlbler_ALL = data.statisticData.data.statistics_by_band['All'][0].dl_bler.toFixed(2);

  let ulbler_23 = data.statisticData.data.statistics_by_band['2.3G'][0].ul_bler.toFixed(2);
  let ulbler_26 = data.statisticData.data.statistics_by_band['2.6G'][0].ul_bler.toFixed(2);
  let ulbler_800 = data.statisticData.data.statistics_by_band['800M'][0].ul_bler.toFixed(2);
  let ulbler_ALL = data.statisticData.data.statistics_by_band['All'][0].ul_bler.toFixed(2);


  let centerTexts_availability = [
    { text: availability_ALL, size: '25px', lineHeight: 40 }, // main text
    { text: 'All Band', size: '12px' } // additional text
  ];
  let centerTexts_attachsetup = [
    { text: attachsetup_ALL, size: '25px', lineHeight: 40 }, // main text
    { text: 'All Band', size: '12px' } // additional text
  ];
  let centerTexts_rrcsetup = [
    { text: rrcsetup_ALL, size: '25px', lineHeight: 40 }, // main text
    { text: 'All Band', size: '12px' } // additional text
  ];
  let centerTexts_erabsetup = [
    { text: erabsetup_ALL, size: '25px', lineHeight: 40 }, // main text
    { text: 'All Band', size: '12px' } // additional text
  ];
  let centerTexts_voltesetup = [
    { text: voltesetup_ALL, size: '25px', lineHeight: 40 }, // main text
    { text: 'All Band', size: '12px' } // additional text
  ];
  let centerTexts_calldrop_data = [
    { text: calldropdata_ALL, size: '25px', lineHeight: 40 }, // main text
    { text: 'All Band', size: '12px' } // additional text
  ];
  let centerTexts_calldrop_volte = [
    { text: calldropvolte_ALL, size: '25px', lineHeight: 40 }, // main text
    { text: 'All Band', size: '12px' } // additional text
  ];
  let centerTexts_intrafreqho = [
    { text: intrafreqho_ALL, size: '25px', lineHeight: 40 }, // main text
    { text: 'All Band', size: '12px' } // additional text
  ];
  let centerTexts_interfreqho = [
    { text: interfreqho_ALL, size: '25px', lineHeight: 40 }, // main text
    { text: 'All Band', size: '12px' } // additional text
  ];
  let centerTexts_x2outho = [
    { text: x2outho_ALL, size: '25px', lineHeight: 40 }, // main text
    { text: 'All Band', size: '12px' } // additional text
  ];
  let centerTexts_x2inho = [
    { text: x2inho_ALL, size: '25px', lineHeight: 40 }, // main text
    { text: 'All Band', size: '12px' } // additional text
  ];
  let centerTexts_s1outho = [
    { text: s1outho_ALL, size: '25px', lineHeight: 40 }, // main text
    { text: 'All Band', size: '12px' } // additional text
  ];
  let centerTexts_s1inho = [
    { text: s1inho_ALL, size: '25px', lineHeight: 40 }, // main text
    { text: 'All Band', size: '12px' } // additional text
  ];
  let centerTexts_dlbler = [
    { text: dlbler_ALL, size: '25px', lineHeight: 40 }, // main text
    { text: 'All Band', size: '12px' } // additional text
  ];
  let centerTexts_ulbler = [
    { text: ulbler_ALL, size: '25px', lineHeight: 40 }, // main text
    { text: 'All Band', size: '12px' } // additional text
  ];

</script>

<div class="flex flex-col p-1 w-full">
  <h1 class="font-semibold text-slate-400 ms-1 mb-4">
    {data.statisticData.data.lastweeknum} Statistics for 15 KPI Items
  </h1>

  <div class="flex w-full">
    <div class="grid grid-cols-5 gap-4 w-full">

      <!-- Cell Avilability -->
      <div class="flex flex-col rounded-xl border border-slate-700 p-4 w-full">
        <div class="flex items-center justify-center mb-6 gap-2">
          <Icon icon="pajamas:status" class="text-2xl font-bold text-slate-400"/>
          <h1 class="text-slate-400 text-sm font-semibold">Cell Availability</h1>
        </div>

        <div class="flex gap-3 mb-4">
          <Circleprogress progress={availability_ALL} size={100} stroke={3} centerTexts={centerTexts_availability} />
          <div class="grid grid-cols-2 items-center justify-center">
            <h1 class="text-xs text-slate-400">2.3G</h1>
            <div class={`rounded-md text-xs font-semibold px-1 py-[1px] ${availability_23 < 99 ? 'bg-rose-400' : 'bg-green-400'}`}>
              {availability_23}
            </div>
            <h1 class="text-xs text-slate-400">2.6G</h1>
            <div class={`rounded-md text-xs font-semibold px-1 py-[1px] ${availability_26 < 99 ? 'bg-rose-400' : 'bg-green-400'}`}>
              {availability_26}
            </div>
            <h1 class="text-xs text-slate-400">800M</h1>
            <div class={`rounded-md text-xs font-semibold px-1 py-[1px] ${availability_800 < 99 ? 'bg-rose-400' : 'bg-green-400'}`}>
              {availability_800}
            </div>
          </div>
        </div>
      </div>

      <!-- Attach Setup -->
      <div class="flex flex-col rounded-xl border border-slate-700 p-4 w-full">
        <div class="flex items-center justify-center mb-6 gap-2">
          <Icon icon="ic:outline-phonelink-setup" class="text-2xl font-bold text-slate-400"/>
          <h1 class="text-slate-400 text-sm font-semibold">Attach Setup Success</h1>
        </div>

        <div class="flex gap-3 mb-4">
          <Circleprogress progress={attachsetup_ALL} size={100} stroke={3} centerTexts={centerTexts_attachsetup} />
          <div class="grid grid-cols-2 items-center justify-center">
            <h1 class="text-xs text-slate-400">2.3G</h1>
            <div class={`rounded-md text-xs font-semibold px-1 py-[1px] ${attachsetup_23 < 99 ? 'bg-rose-400' : 'bg-green-400'}`}>
              {attachsetup_23}
            </div>
            <h1 class="text-xs text-slate-400">2.6G</h1>
            <div class={`rounded-md text-xs font-semibold px-1 py-[1px] ${attachsetup_26 < 99 ? 'bg-rose-400' : 'bg-green-400'}`}>
              {attachsetup_26}
            </div>
            <h1 class="text-xs text-slate-400">800M</h1>
            <div class={`rounded-md text-xs font-semibold px-1 py-[1px] ${attachsetup_800 < 99 ? 'bg-rose-400' : 'bg-green-400'}`}>
              {attachsetup_800}
            </div>
          </div>
        </div>
      </div>

      <!-- RRC Setup -->
      <div class="flex flex-col rounded-xl border border-slate-700 p-4 w-full">
        <div class="flex items-center justify-center mb-6 gap-2">
          <Icon icon="ic:outline-phonelink-setup" class="text-2xl font-bold text-slate-400"/>
          <h1 class="text-slate-400 text-sm font-semibold">RRC Setup Success</h1>
        </div>

        <div class="flex gap-3 mb-4">
          <Circleprogress progress={rrcsetup_ALL} size={100} stroke={3} centerTexts={centerTexts_rrcsetup} />
          <div class="grid grid-cols-2 items-center justify-center">
            <h1 class="text-xs text-slate-400">2.3G</h1>
            <div class={`rounded-md text-xs font-semibold px-1 py-[1px] ${rrcsetup_23 < 99 ? 'bg-rose-400' : 'bg-green-400'}`}>
              {rrcsetup_23}
            </div>
            <h1 class="text-xs text-slate-400">2.6G</h1>
            <div class={`rounded-md text-xs font-semibold px-1 py-[1px] ${rrcsetup_26 < 99 ? 'bg-rose-400' : 'bg-green-400'}`}>
              {rrcsetup_26}
            </div>
            <h1 class="text-xs text-slate-400">800M</h1>
            <div class={`rounded-md text-xs font-semibold px-1 py-[1px] ${rrcsetup_800 < 99 ? 'bg-rose-400' : 'bg-green-400'}`}>
              {rrcsetup_800}
            </div>
          </div>
        </div>
      </div>

      <!-- eRAB Setup -->
      <div class="flex flex-col rounded-xl border border-slate-700 p-4 w-full">
        <div class="flex items-center justify-center mb-6 gap-2">
          <Icon icon="ic:outline-phonelink-setup" class="text-2xl font-bold text-slate-400"/>
          <h1 class="text-slate-400 text-sm font-semibold">eRAB Setup Success</h1>
        </div>

        <div class="flex gap-3 mb-4">
          <Circleprogress progress={erabsetup_ALL} size={100} stroke={3} centerTexts={centerTexts_erabsetup} />
          <div class="grid grid-cols-2 items-center justify-center">
            <h1 class="text-xs text-slate-400">2.3G</h1>
            <div class={`rounded-md text-xs font-semibold px-1 py-[1px] ${erabsetup_23 < 99 ? 'bg-rose-400' : 'bg-green-400'}`}>
              {erabsetup_23}
            </div>
            <h1 class="text-xs text-slate-400">2.6G</h1>
            <div class={`rounded-md text-xs font-semibold px-1 py-[1px] ${erabsetup_26 < 99 ? 'bg-rose-400' : 'bg-green-400'}`}>
              {erabsetup_26}
            </div>
            <h1 class="text-xs text-slate-400">800M</h1>
            <div class={`rounded-md text-xs font-semibold px-1 py-[1px] ${erabsetup_800 < 99 ? 'bg-rose-400' : 'bg-green-400'}`}>
              {erabsetup_800}
            </div>
          </div>
        </div>
      </div>

      <!-- VoLTE Setup -->
      <div class="flex flex-col rounded-xl border border-slate-700 p-4 w-full">
        <div class="flex items-center justify-center mb-6 gap-2">
          <Icon icon="ic:outline-phonelink-setup" class="text-2xl font-bold text-slate-400"/>
          <h1 class="text-slate-400 text-sm font-semibold">VoLTE Setup Success</h1>
        </div>

        <div class="flex gap-3 mb-4">
          <Circleprogress progress={voltesetup_ALL} size={100} stroke={3} centerTexts={centerTexts_voltesetup} />
          <div class="grid grid-cols-2 items-center justify-center">
            <h1 class="text-xs text-slate-400">2.3G</h1>
            <div class={`rounded-md text-xs font-semibold px-1 py-[1px] ${voltesetup_23 < 99 ? 'bg-rose-400' : 'bg-green-400'}`}>
              {voltesetup_23}
            </div>
            <h1 class="text-xs text-slate-400">2.6G</h1>
            <div class={`rounded-md text-xs font-semibold px-1 py-[1px] ${voltesetup_26 < 99 ? 'bg-rose-400' : 'bg-green-400'}`}>
              {voltesetup_26}
            </div>
            <h1 class="text-xs text-slate-400">800M</h1>
            <div class={`rounded-md text-xs font-semibold px-1 py-[1px] ${voltesetup_800 < 99 ? 'bg-rose-400' : 'bg-green-400'}`}>
              {voltesetup_800}
            </div>
          </div>
        </div>
      </div>

      <!-- Call Drop (Data) -->
      <div class="flex flex-col rounded-xl border border-slate-700 p-4 w-full">
        <div class="flex items-center justify-center mb-6 gap-2">
          <Icon icon="material-symbols:signal-disconnected" class="text-2xl font-bold text-slate-400"/>
          <h1 class="text-slate-400 text-sm font-semibold">Call Drop (Data)</h1>
        </div>

        <div class="flex gap-3 mb-4">
          <Circleprogress progress={calldropdata_ALL} size={100} stroke={3} centerTexts={centerTexts_calldrop_data} />
          <div class="grid grid-cols-2 items-center justify-center">
            <h1 class="text-xs text-slate-400">2.3G</h1>
            <div class={`rounded-md text-xs font-semibold px-1 py-[1px] ${calldropdata_23 > 1 ? 'bg-rose-400' : 'bg-green-400'}`}>
              {calldropdata_23}
            </div>
            <h1 class="text-xs text-slate-400">2.6G</h1>
            <div class={`rounded-md text-xs font-semibold px-1 py-[1px] ${calldropdata_26 > 1 ? 'bg-rose-400' : 'bg-green-400'}`}>
              {calldropdata_26}
            </div>
            <h1 class="text-xs text-slate-400">800M</h1>
            <div class={`rounded-md text-xs font-semibold px-1 py-[1px] ${calldropdata_800 > 1 ? 'bg-rose-400' : 'bg-green-400'}`}>
              {calldropdata_800}
            </div>
          </div>
        </div>
      </div>

      <!-- Call Drop (VoLTE) -->
      <div class="flex flex-col rounded-xl border border-slate-700 p-4 w-full">
        <div class="flex items-center justify-center mb-6 gap-2">
          <Icon icon="material-symbols:signal-disconnected" class="text-2xl font-bold text-slate-400"/>
          <h1 class="text-slate-400 text-sm font-semibold">Call Drop (VoLTE)</h1>
        </div>

        <div class="flex gap-3 mb-4">
          <Circleprogress progress={calldropvolte_ALL} size={100} stroke={3} centerTexts={centerTexts_calldrop_volte} />
          <div class="grid grid-cols-2 items-center justify-center">
            <h1 class="text-xs text-slate-400">2.3G</h1>
            <div class={`rounded-md text-xs font-semibold px-1 py-[1px] ${calldropvolte_23 > 1 ? 'bg-rose-400' : 'bg-green-400'}`}>
              {calldropvolte_23}
            </div>
            <h1 class="text-xs text-slate-400">2.6G</h1>
            <div class={`rounded-md text-xs font-semibold px-1 py-[1px] ${calldropvolte_26 > 1 ? 'bg-rose-400' : 'bg-green-400'}`}>
              {calldropvolte_26}
            </div>
            <h1 class="text-xs text-slate-400">800M</h1>
            <div class={`rounded-md text-xs font-semibold px-1 py-[1px] ${calldropvolte_800 > 1 ? 'bg-rose-400' : 'bg-green-400'}`}>
              {calldropvolte_800}
            </div>
          </div>
        </div>
      </div>

      <!-- Intra Frequency Handover -->
      <div class="flex flex-col rounded-xl border border-slate-700 p-4 w-full">
        <div class="flex items-center justify-center mb-6 gap-2">
          <Icon icon="vaadin:connect-o" class="text-2xl font-bold text-slate-400"/>
          <h1 class="text-slate-400 text-sm font-semibold">Intra Frequency HO</h1>
        </div>

        <div class="flex gap-3 mb-4">
          <Circleprogress progress={intrafreqho_ALL} size={100} stroke={3} centerTexts={centerTexts_intrafreqho} />
          <div class="grid grid-cols-2 items-center justify-center">
            <h1 class="text-xs text-slate-400">2.3G</h1>
            <div class={`rounded-md text-xs font-semibold px-1 py-[1px] ${intrafreqho_23 < 99 ? 'bg-rose-400' : 'bg-green-400'}`}>
              {intrafreqho_23}
            </div>
            <h1 class="text-xs text-slate-400">2.6G</h1>
            <div class={`rounded-md text-xs font-semibold px-1 py-[1px] ${intrafreqho_26 < 99 ? 'bg-rose-400' : 'bg-green-400'}`}>
              {intrafreqho_26}
            </div>
            <h1 class="text-xs text-slate-400">800M</h1>
            <div class={`rounded-md text-xs font-semibold px-1 py-[1px] ${intrafreqho_800 < 99 ? 'bg-rose-400' : 'bg-green-400'}`}>
              {intrafreqho_800}
            </div>
          </div>
        </div>
      </div>

      <!-- Inter Frequency Handover -->
      <div class="flex flex-col rounded-xl border border-slate-700 p-4 w-full">
        <div class="flex items-center justify-center mb-6 gap-2">
          <Icon icon="vaadin:connect-o" class="text-2xl font-bold text-slate-400"/>
          <h1 class="text-slate-400 text-sm font-semibold">Intra Frequency HO</h1>
        </div>

        <div class="flex gap-3 mb-4">
          <Circleprogress progress={interfreqho_ALL} size={100} stroke={3} centerTexts={centerTexts_interfreqho} />
          <div class="grid grid-cols-2 items-center justify-center">
            <h1 class="text-xs text-slate-400">2.3G</h1>
            <div class={`rounded-md text-xs font-semibold px-1 py-[1px] ${interfreqho_23 < 99 ? 'bg-rose-400' : 'bg-green-400'}`}>
              {interfreqho_23}
            </div>
            <h1 class="text-xs text-slate-400">2.6G</h1>
            <div class={`rounded-md text-xs font-semibold px-1 py-[1px] ${interfreqho_26 < 99 ? 'bg-rose-400' : 'bg-green-400'}`}>
              {interfreqho_26}
            </div>
            <h1 class="text-xs text-slate-400">800M</h1>
            <div class={`rounded-md text-xs font-semibold px-1 py-[1px] ${interfreqho_800 < 99 ? 'bg-rose-400' : 'bg-green-400'}`}>
              {interfreqho_800}
            </div>
          </div>
        </div>
      </div>

      <!-- X2 Out Handover -->
      <div class="flex flex-col rounded-xl border border-slate-700 p-4 w-full">
        <div class="flex items-center justify-center mb-6 gap-2">
          <Icon icon="vaadin:connect-o" class="text-2xl font-bold text-slate-400"/>
          <h1 class="text-slate-400 text-sm font-semibold">X2 Out HO</h1>
        </div>

        <div class="flex gap-3 mb-4">
          <Circleprogress progress={x2outho_ALL} size={100} stroke={3} centerTexts={centerTexts_x2outho} />
          <div class="grid grid-cols-2 items-center justify-center">
            <h1 class="text-xs text-slate-400">2.3G</h1>
            <div class={`rounded-md text-xs font-semibold px-1 py-[1px] ${x2outho_23 < 99 ? 'bg-rose-400' : 'bg-green-400'}`}>
              {x2outho_23}
            </div>
            <h1 class="text-xs text-slate-400">2.6G</h1>
            <div class={`rounded-md text-xs font-semibold px-1 py-[1px] ${x2outho_26 < 99 ? 'bg-rose-400' : 'bg-green-400'}`}>
              {x2outho_26}
            </div>
            <h1 class="text-xs text-slate-400">800M</h1>
            <div class={`rounded-md text-xs font-semibold px-1 py-[1px] ${x2outho_800 < 99 ? 'bg-rose-400' : 'bg-green-400'}`}>
              {x2outho_800}
            </div>
          </div>
        </div>
      </div>

      <!-- X2 In Handover -->
      <div class="flex flex-col rounded-xl border border-slate-700 p-4 w-full">
        <div class="flex items-center justify-center mb-6 gap-2">
          <Icon icon="vaadin:connect-o" class="text-2xl font-bold text-slate-400"/>
          <h1 class="text-slate-400 text-sm font-semibold">X2 In HO</h1>
        </div>

        <div class="flex gap-3 mb-4">
          <Circleprogress progress={x2inho_ALL} size={100} stroke={3} centerTexts={centerTexts_x2inho} />
          <div class="grid grid-cols-2 items-center justify-center">
            <h1 class="text-xs text-slate-400">2.3G</h1>
            <div class={`rounded-md text-xs font-semibold px-1 py-[1px] ${x2inho_23 < 99 ? 'bg-rose-400' : 'bg-green-400'}`}>
              {x2inho_23}
            </div>
            <h1 class="text-xs text-slate-400">2.6G</h1>
            <div class={`rounded-md text-xs font-semibold px-1 py-[1px] ${x2inho_26 < 99 ? 'bg-rose-400' : 'bg-green-400'}`}>
              {x2inho_26}
            </div>
            <h1 class="text-xs text-slate-400">800M</h1>
            <div class={`rounded-md text-xs font-semibold px-1 py-[1px] ${x2inho_800 < 99 ? 'bg-rose-400' : 'bg-green-400'}`}>
              {x2inho_800}
            </div>
          </div>
        </div>
      </div>

      <!-- S1 Out Handover -->
      <div class="flex flex-col rounded-xl border border-slate-700 p-4 w-full">
        <div class="flex items-center justify-center mb-6 gap-2">
          <Icon icon="vaadin:connect-o" class="text-2xl font-bold text-slate-400"/>
          <h1 class="text-slate-400 text-sm font-semibold">S1 Out HO</h1>
        </div>

        <div class="flex gap-3 mb-4">
          <Circleprogress progress={s1outho_ALL} size={100} stroke={3} centerTexts={centerTexts_s1outho} />
          <div class="grid grid-cols-2 items-center justify-center">
            <h1 class="text-xs text-slate-400">2.3G</h1>
            <div class={`rounded-md text-xs font-semibold px-1 py-[1px] ${s1outho_23 < 99 ? 'bg-rose-400' : 'bg-green-400'}`}>
              {s1outho_23}
            </div>
            <h1 class="text-xs text-slate-400">2.6G</h1>
            <div class={`rounded-md text-xs font-semibold px-1 py-[1px] ${s1outho_26 < 99 ? 'bg-rose-400' : 'bg-green-400'}`}>
              {s1outho_26}
            </div>
            <h1 class="text-xs text-slate-400">800M</h1>
            <div class={`rounded-md text-xs font-semibold px-1 py-[1px] ${s1outho_800 < 99 ? 'bg-rose-400' : 'bg-green-400'}`}>
              {s1outho_800}
            </div>
          </div>
        </div>
      </div>

      <!-- S1 In Handover -->
      <div class="flex flex-col rounded-xl border border-slate-700 p-4 w-full">
        <div class="flex items-center justify-center mb-6 gap-2">
          <Icon icon="vaadin:connect-o" class="text-2xl font-bold text-slate-400"/>
          <h1 class="text-slate-400 text-sm font-semibold">S1 In HO</h1>
        </div>

        <div class="flex gap-3 mb-4">
          <Circleprogress progress={s1inho_ALL} size={100} stroke={3} centerTexts={centerTexts_s1inho} />
          <div class="grid grid-cols-2 items-center justify-center">
            <h1 class="text-xs text-slate-400">2.3G</h1>
            <div class={`rounded-md text-xs font-semibold px-1 py-[1px] ${s1inho_23 < 99 ? 'bg-rose-400' : 'bg-green-400'}`}>
              {s1inho_23}
            </div>
            <h1 class="text-xs text-slate-400">2.6G</h1>
            <div class={`rounded-md text-xs font-semibold px-1 py-[1px] ${s1inho_26 < 99 ? 'bg-rose-400' : 'bg-green-400'}`}>
              {s1inho_26}
            </div>
            <h1 class="text-xs text-slate-400">800M</h1>
            <div class={`rounded-md text-xs font-semibold px-1 py-[1px] ${s1inho_800 < 99 ? 'bg-rose-400' : 'bg-green-400'}`}>
              {s1inho_800}
            </div>
          </div>
        </div>
      </div>

      <!-- DL BLER -->
      <div class="flex flex-col rounded-xl border border-slate-700 p-4 w-full">
        <div class="flex items-center justify-center mb-6 gap-2">
          <Icon icon="material-symbols-light:error-med-outline" class="text-2xl font-bold text-slate-400"/>
          <h1 class="text-slate-400 text-sm font-semibold">DL BLER</h1>
        </div>

        <div class="flex gap-3 mb-4">
          <Circleprogress progress={dlbler_800} size={100} stroke={3} centerTexts={centerTexts_dlbler} />
          <div class="grid grid-cols-2 items-center justify-center">
            <h1 class="text-xs text-slate-400">2.3G</h1>
            <div class={`rounded-md text-xs font-semibold px-1 py-[1px] ${dlbler_23 > 1 ? 'bg-rose-400' : 'bg-green-400'}`}>
              {dlbler_23}
            </div>
            <h1 class="text-xs text-slate-400">2.6G</h1>
            <div class={`rounded-md text-xs font-semibold px-1 py-[1px] ${dlbler_26 > 1 ? 'bg-rose-400' : 'bg-green-400'}`}>
              {dlbler_26}
            </div>
            <h1 class="text-xs text-slate-400">800M</h1>
            <div class={`rounded-md text-xs font-semibold px-1 py-[1px] ${dlbler_800 > 1 ? 'bg-rose-400' : 'bg-green-400'}`}>
              {dlbler_800}
            </div>
          </div>
        </div>
      </div>

      <!-- UL BLER -->
      <div class="flex flex-col rounded-xl border border-slate-700 p-4 w-full">
        <div class="flex items-center justify-center mb-6 gap-2">
          <Icon icon="material-symbols-light:error-med-outline" class="text-2xl font-bold text-slate-400"/>
          <h1 class="text-slate-400 text-sm font-semibold">UL BLER</h1>
        </div>

        <div class="flex gap-3 mb-4">
          <Circleprogress progress={ulbler_800} size={100} stroke={3} centerTexts={centerTexts_ulbler} />
          <div class="grid grid-cols-2 items-center justify-center">
            <h1 class="text-xs text-slate-400">2.3G</h1>
            <div class={`rounded-md text-xs font-semibold px-1 py-[1px] ${ulbler_23 > 1 ? 'bg-rose-400' : 'bg-green-400'}`}>
              {ulbler_23}
            </div>
            <h1 class="text-xs text-slate-400">2.6G</h1>
            <div class={`rounded-md text-xs font-semibold px-1 py-[1px] ${ulbler_26 > 1 ? 'bg-rose-400' : 'bg-green-400'}`}>
              {ulbler_26}
            </div>
            <h1 class="text-xs text-slate-400">800M</h1>
            <div class={`rounded-md text-xs font-semibold px-1 py-[1px] ${ulbler_800 > 1 ? 'bg-rose-400' : 'bg-green-400'}`}>
              {ulbler_800}
            </div>
          </div>
        </div>
      </div>

      
    </div>
  </div>
</div>