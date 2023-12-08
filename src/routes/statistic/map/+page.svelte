<script lang="ts">
  import { onMount } from "svelte";
  import type { Map as LeafletMap } from 'leaflet';
  // import * as L from 'leaflet';
  import toast, { Toaster } from 'svelte-french-toast'
  import Basemap from "../../../components/Basemap.svelte";
  import Icon from '@iconify/svelte';
  import TrandChartbyfields from "./TrandChartbyfields.svelte";
	import { Button, Card, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from "flowbite-svelte";

  export let data;
  
  let L: any;
  let map: LeafletMap | null = null;
  let arrowIcon: any;
  let dyfields: string | null = '';
  let bands: string | null = '';
  let regions: string | null = '';

  const fieldMappings: { [key: string]: string } = {
    cell_availability: 'Cell Availability',
    attach_setup_success_rate: 'Attach Setup Success',
    rrc_setup_success_rate: 'RRC Setup Success',
    erab_setup_success_rate_ngbr: 'eRAB Setup Success',
    volte_setup_success_rate_gbr: 'VoLTE Setup Success',
    call_drop_rate_erab_ngbr: 'Call Drop (nGBR)',
    volte_call_drop_rate_erab_gbr: 'VoLTE Call Drop',
    hosr_intra_frequency: 'HSOR Intra Frequency',
    hosr_inter_frequency: 'HSOR Inter Frequency',
    x2_handover_out_success_rate: 'X2 Handover Out',
    x2_handover_in_success_rate: 'X2 Handover In',
    s1_handover_out_success_rate: 'S1 Handover Out',
    s1_handover_in_success_rate: 'S1 Handover In',
    dl_bler: 'DL BLER',
    ul_bler: 'UL BLER'
  }

  function getMappingFieldName(fieldKey: string): string {
    return fieldMappings[fieldKey] || fieldKey
  }

  let mappedFieldName = getMappingFieldName(dyfields)

  //Non pagination api to paginated
  let StatisticFailData: any = [];
  let currentPage = 1;
  let itemsPerPage = 5;
  let paginatedData: any = [];
  let totalpage: number | null;

  //Chart Data
  let StatisticChartData: any = [];

  function goToFirstPage(): void {
    setPage(1);
  }

  function goToLastPage(): void {
    setPage(totalpage);
  }

  function goToPreviousPage(): void {
    if (currentPage > 1) {
      setPage(currentPage - 1);
    }
  }

  function goToNextPage(): void {
    if (currentPage < totalpage) {
      setPage(currentPage + 1);
    }
  }

  function getPaginatedData() {
    const start: number = (currentPage - 1) * itemsPerPage;
    const end: number = start + itemsPerPage;
    if (start >= StatisticFailData.length) {
      return [];
    }
    // const data = StatisticFailData.slice(start, end);
    // return data;
    return StatisticFailData.slice(start, end)
  }

  function setPage(page: number): void {
    currentPage = page;
    paginatedData = getPaginatedData();
  }

  onMount(async () => {
    if (typeof window != 'undefined') {
      const leaflet = await import('leaflet')
      L = leaflet.default

      const urlParams = new URLSearchParams(window.location.search);
      const fields = urlParams.get('fields');
      const band = urlParams.get('band');
      const region = urlParams.get('region');
      dyfields = urlParams.get('fields');
      mappedFieldName = getMappingFieldName(dyfields);
      bands = band;
      regions = region;

      if (fields && band && region) {
        try {
          const response = await fetch(`http://10.24.8.120:8000/api/statisticnonpage/?fields=${fields}&band=${band}&region=${region}`);

          const statisticCalculated = await fetch(`http://10.24.8.120:8000/api/statisticcalculatedchart/?fields=${fields}`);

          if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.error || 'Failed fetch statistic data from server!';
            toast.error(errorMessage);
          }

          StatisticFailData = await response.json();
          totalpage = Math.ceil(StatisticFailData.length / itemsPerPage)
          paginatedData = getPaginatedData();
          StatisticChartData = await statisticCalculated.json()
          

          if (map) {
            addMarkers(StatisticFailData);
          }
        } catch (e) {
          toast.error(`Error: ${e.message}`)
        }
      } else {
        toast.error('Missing query parameters');
      }
    }
  });

  function getDynamicFieldValue(statistic: string, field: string) {
    const value = statistic[field]
    return typeof value === 'number' ? value.toFixed(1) : value;
  }

  function sectorBGColorClass(value: number): string {
    if (value == 0 || value == 3) {
      return 'bg-rose-600';
    } else if (value == 1 || value == 4) {
      return 'bg-green-600';
    } else {
      return 'bg-blue-600'
    }
  }

  function addMarkers(data: any) {
    data.forEach((item: any) => {
      if (map) {
        const iconAnchorX = 9; // 이 값은 아이콘의 너비의 절반입니다.
        const iconAnchorY = 18; // 이 값은 아이콘의 높이입니다.
        const iconRotation = item.sitephyinfo_details?.azimuth;

        const dynamicData = item[dyfields];

        let filterStyle = ''
        if (dynamicData >= 97 && dynamicData < 99) {
          filterStyle = '/azimuth-arrow-2.svg';
        } else if (dynamicData >= 95 && dynamicData < 97) {
          filterStyle = '/azimuth-arrow-3.svg';
        } else if (dynamicData >= 90 && dynamicData < 95) {
          filterStyle = '/azimuth-arrow-4.svg';
        } else if (dynamicData < 90) {
          filterStyle = '/azimuth-arrow-5.svg';
        }
        
        arrowIcon = L.divIcon({
          className: '', // 기본 Leaflet 클래스 이름을 제거하여 기본 스타일을 방지합니다.
          html: `
            <img 
              src="${filterStyle}"
              style="transform: rotate(${iconRotation}deg); width: 18px; height: 18px; transform-origin: ${iconAnchorX}px ${iconAnchorY}px;" />
          `,
          iconSize: [18, 18],
          iconAnchor: [iconAnchorX, iconAnchorY]
        });

        const marker = L.marker([item.sitebasicinfo_details.lat, item.sitebasicinfo_details.lon], {
          icon: arrowIcon
        }).addTo(map);

        marker.bindPopup('Loading data...')

        marker.on('click', () => {
          if (marker.getPopup().getContent() === 'Loading data...') {
            fetch(`http://10.24.8.120:8000/api/statisticdata/?secid=${item.sitephyinfo_details.uid}`)
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json()
            })
            .then(data => {
              let conditionalSection = '';
              if (dyfields === 'cell_availability') {
                conditionalSection = `<div class="flex flex-col">
                  <h1 class="font-bold flex gap-1 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="m13.51 4l-5-3h-1l-5 3l-.49.86v6l.49.85l5 3h1l5-3l.49-.85v-6L13.51 4zm-6 9.56l-4.5-2.7V5.7l4.5 2.45v5.41zM3.27 4.7l4.74-2.84l4.74 2.84l-4.74 2.59L3.27 4.7zm9.74 6.16l-4.5 2.7V8.15l4.5-2.45v5.16z"/></svg>
                    Calculation method
                  </h1>
                  <div class="flex items-center">
                    <h5 class="text-xs">(1-(</h5>
                    <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-rose-400">A</h5>
                    <h5 class="text-xs">-</h5>
                    <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-yellow-600">B</h5>
                    <h5 class="text-xs">)/</h5>
                    <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-slate-700">C</h5>
                    <h5 class="text-xs">)X100</h5>
                  </div>
                </div>
                <hr class="my-4">
                <div class="flex flex-col gap-1">
                  <h1 class="font-bold text-center flex gap-1 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48"><g fill="none"><path d="M14 29h28v12H14V29Zm0-22h28v12H14V7Z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M14 13v6h28V7H14v6Zm0 0H6v22h8m0 0v6h28V29H14v6Z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M14 13H6v22h8m0-6h28v12H14V29Zm0-22h28v12H14V7Z"/></g></svg>
                    Caculation Items                    
                  </h1>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-rose-400">A</h5>
                      <h5 class="text-xs text-rose-400">Cell down time</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].cellunavailabletimedown}
                    </h5>
                  </div>
                  <div class="flex justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-yellow-600">B</h5>
                      <h5 class="text-xs text-yellow-600">Cell lock time</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].cellunavailabletimelock}</h5>
                  </div>
                  <div class="flex justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-slate-700">C</h5>
                      <h5 class="text-xs">Cell available time</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].cellavail_pmperiodtime}</h5>
                  </div>
                </div>
                `;
              } else if (dyfields === 'attach_setup_success_rate') {
                conditionalSection = `
                <div class="flex flex-col">
                  <h1 class="font-bold flex gap-1 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="m13.51 4l-5-3h-1l-5 3l-.49.86v6l.49.85l5 3h1l5-3l.49-.85v-6L13.51 4zm-6 9.56l-4.5-2.7V5.7l4.5 2.45v5.41zM3.27 4.7l4.74-2.84l4.74 2.84l-4.74 2.59L3.27 4.7zm9.74 6.16l-4.5 2.7V8.15l4.5-2.45v5.16z"/></svg>
                    Calculation method
                  </h1>
                  <div class="flex items-center">
                    <h5 class="text-xs">((</h5>
                    <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-green-700">A</h5>
                    <h5 class="text-xs">/</h5>
                    <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-indigo-700">B</h5>
                    <h5 class="text-xs">)X(</h5>
                    <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-green-700">C</h5>
                    <h5 class="text-xs">/</h5>
                    <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-indigo-700">D</h5>
                    <h5 class="text-xs">)X(</h5>
                    <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-green-700">E</h5>
                    <h5 class="text-xs">/</h5>
                    <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-indigo-700">F</h5>
                    <h5 class="text-xs">))X100</h5>
                  </div>
                </div>
                <hr class="my-4">
                <div class="flex flex-col gap-1">
                  <h1 class="font-bold text-center flex gap-1 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48"><g fill="none"><path d="M14 29h28v12H14V29Zm0-22h28v12H14V7Z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M14 13v6h28V7H14v6Zm0 0H6v22h8m0 0v6h28V29H14v6Z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M14 13H6v22h8m0-6h28v12H14V29Zm0-22h28v12H14V7Z"/></g></svg>
                    Caculation Items                    
                  </h1>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-green-700">A</h5>
                      <h5 class="text-xs">Connect estabilish success</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">
                      ${data.results[0].connestabsucc}
                    </h5>
                  </div>
                  <div class="flex justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-indigo-700">B</h5>
                      <h5 class="text-xs">Connect estabilish attempt</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].connestabatt}</h5>
                  </div>
                  <div class="flex justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-green-700">C</h5>
                      <h5 class="text-xs">S1 Connect estabilish success</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].s1connestabsucc}</h5>
                  </div>
                  <div class="flex justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-indigo-700">D</h5>
                      <h5 class="text-xs">S1 Connect estabilish attempt</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].s1connestabatt}</h5>
                  </div>
                  <div class="flex justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-green-700">E</h5>
                      <h5 class="text-xs">Estabilish initial success (NBR)</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].establnitsuccnbr}</h5>
                  </div>
                  <div class="flex justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-indigo-700">F</h5>
                      <h5 class="text-xs">Estabilish initial attempt (NBR)</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].establnitattnbr}</h5>
                  </div>
                </div>
                `;
              } else if (dyfields === 'rrc_setup_success_rate') {
                conditionalSection = `
                <div class="flex flex-col">
                  <h1 class="font-bold flex gap-1 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="m13.51 4l-5-3h-1l-5 3l-.49.86v6l.49.85l5 3h1l5-3l.49-.85v-6L13.51 4zm-6 9.56l-4.5-2.7V5.7l4.5 2.45v5.41zM3.27 4.7l4.74-2.84l4.74 2.84l-4.74 2.59L3.27 4.7zm9.74 6.16l-4.5 2.7V8.15l4.5-2.45v5.16z"/></svg>
                    Calculation method
                  </h1>
                  <div class="flex items-center">
                    <h5 class="text-xs">(</h5>
                    <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-green-700">A</h5>
                    <h5 class="text-xs">/</h5>
                    <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-indigo-700">B</h5>
                    <h5 class="text-xs">)X100</h5>
                  </div>
                </div>
                <hr class="my-4">
                <div class="flex flex-col gap-1">
                  <h1 class="font-bold text-center flex gap-1 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48"><g fill="none"><path d="M14 29h28v12H14V29Zm0-22h28v12H14V7Z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M14 13v6h28V7H14v6Zm0 0H6v22h8m0 0v6h28V29H14v6Z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M14 13H6v22h8m0-6h28v12H14V29Zm0-22h28v12H14V7Z"/></g></svg>
                    Caculation Items                    
                  </h1>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-green-700">A</h5>
                      <h5 class="text-xs">Connect estabilish success</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].connestabsucc}</h5>
                  </div>
                  <div class="flex justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-indigo-700">B</h5>
                      <h5 class="text-xs">Connect estabilish attempt</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].connestabatt}</h5>
                  </div>
                </div>
                `;
              } else if (dyfields === 'erab_setup_success_rate_ngbr') {
                conditionalSection = `
                <div class="flex flex-col">
                  <h1 class="font-bold flex gap-1 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="m13.51 4l-5-3h-1l-5 3l-.49.86v6l.49.85l5 3h1l5-3l.49-.85v-6L13.51 4zm-6 9.56l-4.5-2.7V5.7l4.5 2.45v5.41zM3.27 4.7l4.74-2.84l4.74 2.84l-4.74 2.59L3.27 4.7zm9.74 6.16l-4.5 2.7V8.15l4.5-2.45v5.16z"/></svg>
                    Calculation method
                  </h1>
                  <h5 class="text-xs">((A+B)/(C+D))X100</h5>
                </div>
                <hr class="my-4">
                <div class="flex flex-col gap-1">
                  <h1 class="font-bold text-center flex gap-1 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48"><g fill="none"><path d="M14 29h28v12H14V29Zm0-22h28v12H14V7Z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M14 13v6h28V7H14v6Zm0 0H6v22h8m0 0v6h28V29H14v6Z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M14 13H6v22h8m0-6h28v12H14V29Zm0-22h28v12H14V7Z"/></g></svg>
                    Caculation Items                    
                  </h1>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-slate-700">A</h5>
                      <h5 class="text-xs">Estabilish initial success (NBR) QCI5~9</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].establnitsuccnbr_qci59}</h5>
                  </div>
                  <div class="flex justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-slate-700">B</h5>
                      <h5 class="text-xs">Estabilish add success (NBR) QCI5~9</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].estabaddsuccnbr_qci59}</h5>
                  </div>
                  <div class="flex justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-slate-700">C</h5>
                      <h5 class="text-xs">Estabilish initial attempt (NBR) QCI5~9</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].establnitattnbr_qci59}</h5>
                  </div>
                  <div class="flex justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-slate-700">D</h5>
                      <h5 class="text-xs">Estabilish add attempt (NBR) QCI5~9</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].estabaddattnbr_qci59}</h5>
                  </div>
                </div>
                `;
              } else if (dyfields === 'volte_setup_success_rate_gbr') {
                conditionalSection = `
                <div class="flex flex-col">
                  <h1 class="font-bold flex gap-1 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="m13.51 4l-5-3h-1l-5 3l-.49.86v6l.49.85l5 3h1l5-3l.49-.85v-6L13.51 4zm-6 9.56l-4.5-2.7V5.7l4.5 2.45v5.41zM3.27 4.7l4.74-2.84l4.74 2.84l-4.74 2.59L3.27 4.7zm9.74 6.16l-4.5 2.7V8.15l4.5-2.45v5.16z"/></svg>
                    Calculation method
                  </h1>
                  <h5 class="text-xs">((A+B)/(C+D))X100</h5>
                </div>
                <hr class="my-4">
                <div class="flex flex-col gap-1">
                  <h1 class="font-bold text-center flex gap-1 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48"><g fill="none"><path d="M14 29h28v12H14V29Zm0-22h28v12H14V7Z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M14 13v6h28V7H14v6Zm0 0H6v22h8m0 0v6h28V29H14v6Z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M14 13H6v22h8m0-6h28v12H14V29Zm0-22h28v12H14V7Z"/></g></svg>
                    Caculation Items                    
                  </h1>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-slate-700">A</h5>
                      <h5 class="text-xs">Estabilish initial success (NBR) QCI1</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].establnitsuccnbr_qci1}</h5>
                  </div>
                  <div class="flex justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-slate-700">B</h5>
                      <h5 class="text-xs">Estabilish add success (NBR) QCI1</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].estabaddsuccnbr_qci1}</h5>
                  </div>
                  <div class="flex justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-slate-700">C</h5>
                      <h5 class="text-xs">Estabilish initial attempt (NBR) QCI1</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].establnitattnbr_qci1}</h5>
                  </div>
                  <div class="flex justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-slate-700">D</h5>
                      <h5 class="text-xs">Estabilish add attempt (NBR) QCI1</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].estabaddattnbr_qci1}</h5>
                  </div>
                </div>
                `;
              } else if (dyfields === 'call_drop_rate_erab_ngbr') {
                conditionalSection = `
                <div class="flex flex-col">
                  <h1 class="font-bold flex gap-1 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="m13.51 4l-5-3h-1l-5 3l-.49.86v6l.49.85l5 3h1l5-3l.49-.85v-6L13.51 4zm-6 9.56l-4.5-2.7V5.7l4.5 2.45v5.41zM3.27 4.7l4.74-2.84l4.74 2.84l-4.74 2.59L3.27 4.7zm9.74 6.16l-4.5 2.7V8.15l4.5-2.45v5.16z"/></svg>
                    Calculation method
                  </h1>
                  <h5 class="text-xs">((A+B+C+D+E+F+G+H+I+J)/(K+L+M+N))X100</h5>
                </div>
                <hr class="my-4">
                <div class="flex flex-col gap-1">
                  <h1 class="font-bold text-center flex gap-1 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48"><g fill="none"><path d="M14 29h28v12H14V29Zm0-22h28v12H14V7Z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M14 13v6h28V7H14v6Zm0 0H6v22h8m0 0v6h28V29H14v6Z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M14 13H6v22h8m0-6h28v12H14V29Zm0-22h28v12H14V7Z"/></g></svg>
                    Caculation Items                    
                  </h1>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-slate-700">A</h5>
                      <h5 class="text-xs">DSP audit abnomal release QCI5~9</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].calldropqci_eccbdspauditrlcmaccallrelease_qci59}</h5>
                  </div>
                  <div class="flex justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-slate-700">B</h5>
                      <h5 class="text-xs">Receive reset request from ECMB QCI1~5</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].calldropqci_eccbrcvresetrequestfromecmb_qci59}</h5>
                  </div>
                  <div class="flex justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-slate-700">C</h5>
                      <h5 class="text-xs">Receive cell release from ECMB QCI1~5</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].calldropqci_eccbrcvcellreleaseindfromecmb_qci59}</h5>
                  </div>
                  <div class="flex justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-slate-700">D</h5>
                      <h5 class="text-xs">Radio link failure QCI1~9</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].calldropqci_eccbradiolinkfailure_qci59}</h5>
                  </div>
                  <div class="flex justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-slate-700">E</h5>
                      <h5 class="text-xs">DSP audit MAC call release QCI5~9</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].calldropqci_eccbdspauditmaccallrelease_qci59}</h5>
                  </div>
                  <div class="flex justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-slate-700">F</h5>
                      <h5 class="text-xs">ARQ max retransmission QCI5~9</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].calldropqci_eccbarqmaxretransmission_qci59}</h5>
                  </div>
                  <div class="flex justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-slate-700">G</h5>
                      <h5 class="text-xs">DSP audit RLC call release QCI5~9</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].calldropqci_eccbdspauditrlccallrelease_qci59}</h5>
                  </div>
                  <div class="flex justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-slate-700">H</h5>
                      <h5 class="text-xs">Timeout RRC connection reconfig QCI5~9</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].calldropqci_eccbtmoutrrcconnectionreconfig_qci59}</h5>
                  </div>
                  <div class="flex justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-slate-700">I</h5>
                      <h5 class="text-xs">Timeout RRC connection reestablish QCI5~9</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].calldropqci_eccbtmoutrrcconnectionrestablish_qci59}</h5>
                  </div>
                  <div class="flex justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-slate-700">J</h5>
                      <h5 class="text-xs">Out of service QCI5~9</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].calldropqci_eccbsisctpoutofsevice_qci59}</h5>
                  </div>
                  <div class="flex justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-slate-700">K</h5>
                      <h5 class="text-xs">Establish initial success (NBR) QCI5~9</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].establnitsuccnbr_qci59}</h5>
                  </div>
                  <div class="flex justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-slate-700">L</h5>
                      <h5 class="text-xs">Establish add success (NBR) QCI5~9</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].estabaddsuccnbr_qci59}</h5>
                  </div>
                  <div class="flex justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-slate-700">M</h5>
                      <h5 class="text-xs">Inter X2 in success QCI5~9</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].interx2insucc_qci59}</h5>
                  </div>
                  <div class="flex justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-slate-700">N</h5>
                      <h5 class="text-xs">Inter S1 in success QCI5~9</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].inters1insucc_qci59}</h5>
                  </div>
                </div>
                `;
              } else if (dyfields === 'volte_call_drop_rate_erab_gbr') {
                conditionalSection = `
                <div class="flex flex-col">
                  <h1 class="font-bold flex gap-1 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="m13.51 4l-5-3h-1l-5 3l-.49.86v6l.49.85l5 3h1l5-3l.49-.85v-6L13.51 4zm-6 9.56l-4.5-2.7V5.7l4.5 2.45v5.41zM3.27 4.7l4.74-2.84l4.74 2.84l-4.74 2.59L3.27 4.7zm9.74 6.16l-4.5 2.7V8.15l4.5-2.45v5.16z"/></svg>
                    Calculation method
                  </h1>
                  <h5 class="text-xs">(A/(B+C+D))</h5>
                </div>
                <hr class="my-4">
                <div class="flex flex-col gap-1">
                  <h1 class="font-bold text-center flex gap-1 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48"><g fill="none"><path d="M14 29h28v12H14V29Zm0-22h28v12H14V7Z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M14 13v6h28V7H14v6Zm0 0H6v22h8m0 0v6h28V29H14v6Z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M14 13H6v22h8m0-6h28v12H14V29Zm0-22h28v12H14V7Z"/></g></svg>
                    Caculation Items                    
                  </h1>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-slate-700">A</h5>
                      <h5 class="text-xs">VoLTE call drop</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].sumvoltecalldropqci}</h5>
                  </div>
                  <div class="flex justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-slate-700">B</h5>
                      <h5 class="text-xs">VoLTE establish initial success (NBR)</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].sumvolteestablnitsuccnbr}</h5>
                  </div>
                  <div class="flex justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-slate-700">C</h5>
                      <h5 class="text-xs">VoLTE establish add success (NBR)</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].sumvolteestabaddsuccnbr}</h5>
                  </div>
                  <div class="flex justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-slate-700">D</h5>
                      <h5 class="text-xs">VoLTE eRAB incoming HO success (NBR)</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].sumvolteerablncominghosuccnbr}</h5>
                  </div>
                </div>
                `;
              } else if (dyfields === 'hosr_intra_frequency') {
                conditionalSection = `
                <div class="flex flex-col">
                  <h1 class="font-bold flex gap-1 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="m13.51 4l-5-3h-1l-5 3l-.49.86v6l.49.85l5 3h1l5-3l.49-.85v-6L13.51 4zm-6 9.56l-4.5-2.7V5.7l4.5 2.45v5.41zM3.27 4.7l4.74-2.84l4.74 2.84l-4.74 2.59L3.27 4.7zm9.74 6.16l-4.5 2.7V8.15l4.5-2.45v5.16z"/></svg>
                    Calculation method
                  </h1>
                  <h5 class="text-xs">(A/B)X100</h5>
                </div>
                <hr class="my-4">
                <div class="flex flex-col gap-1">
                  <h1 class="font-bold text-center flex gap-1 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48"><g fill="none"><path d="M14 29h28v12H14V29Zm0-22h28v12H14V7Z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M14 13v6h28V7H14v6Zm0 0H6v22h8m0 0v6h28V29H14v6Z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M14 13H6v22h8m0-6h28v12H14V29Zm0-22h28v12H14V7Z"/></g></svg>
                    Caculation Items                    
                  </h1>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-slate-700">A</h5>
                      <h5 class="text-xs">Intra frequency out success</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].intrafreqoutsucc}</h5>
                  </div>
                  <div class="flex justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-slate-700">B</h5>
                      <h5 class="text-xs">Intra frequency out attempt</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].intrafreqoutatt}</h5>
                  </div>
                </div>
                `;
              } else if (dyfields === 'hosr_inter_frequency') {
                conditionalSection = `
                <div class="flex flex-col">
                  <h1 class="font-bold flex gap-1 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="m13.51 4l-5-3h-1l-5 3l-.49.86v6l.49.85l5 3h1l5-3l.49-.85v-6L13.51 4zm-6 9.56l-4.5-2.7V5.7l4.5 2.45v5.41zM3.27 4.7l4.74-2.84l4.74 2.84l-4.74 2.59L3.27 4.7zm9.74 6.16l-4.5 2.7V8.15l4.5-2.45v5.16z"/></svg>
                    Calculation method
                  </h1>
                  <h5 class="text-xs">((A+B)/(C+D))X100</h5>
                </div>
                <hr class="my-4">
                <div class="flex flex-col gap-1">
                  <h1 class="font-bold text-center flex gap-1 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48"><g fill="none"><path d="M14 29h28v12H14V29Zm0-22h28v12H14V7Z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M14 13v6h28V7H14v6Zm0 0H6v22h8m0 0v6h28V29H14v6Z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M14 13H6v22h8m0-6h28v12H14V29Zm0-22h28v12H14V7Z"/></g></svg>
                    Caculation Items                    
                  </h1>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-slate-700">A</h5>
                      <h5 class="text-xs">Inter frequency measure gap out success </h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].interfreqmeasgapoutsucc}</h5>
                  </div>
                  <div class="flex justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-slate-700">B</h5>
                      <h5 class="text-xs">Inter frequency no measure gap out success</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].interfreqnomeasgapoutsucc}</h5>
                  </div>
                  <div class="flex justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-slate-700">C</h5>
                      <h5 class="text-xs">Inter frequency measure gap out attempt</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].interfreqmeasgapoutatt}</h5>
                  </div>
                  <div class="flex justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-slate-700">D</h5>
                      <h5 class="text-xs">Inter frequency no measure gap out attempt</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].interfreqnomeasgapoutatt}</h5>
                  </div>
                </div>
                `;
              } else if (dyfields === 'x2_handover_out_success_rate') {
                conditionalSection = `
                <div class="flex flex-col">
                  <h1 class="font-bold flex gap-1 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="m13.51 4l-5-3h-1l-5 3l-.49.86v6l.49.85l5 3h1l5-3l.49-.85v-6L13.51 4zm-6 9.56l-4.5-2.7V5.7l4.5 2.45v5.41zM3.27 4.7l4.74-2.84l4.74 2.84l-4.74 2.59L3.27 4.7zm9.74 6.16l-4.5 2.7V8.15l4.5-2.45v5.16z"/></svg>
                    Calculation method
                  </h1>
                  <h5 class="text-xs">(A/B)X100</h5>
                </div>
                <hr class="my-4">
                <div class="flex flex-col gap-1">
                  <h1 class="font-bold text-center flex gap-1 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48"><g fill="none"><path d="M14 29h28v12H14V29Zm0-22h28v12H14V7Z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M14 13v6h28V7H14v6Zm0 0H6v22h8m0 0v6h28V29H14v6Z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M14 13H6v22h8m0-6h28v12H14V29Zm0-22h28v12H14V7Z"/></g></svg>
                    Caculation Items                    
                  </h1>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-slate-700">A</h5>
                      <h5 class="text-xs">Inter X2 out success</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].interx2outsucc}</h5>
                  </div>
                  <div class="flex justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-slate-700">B</h5>
                      <h5 class="text-xs">Inter X2 out attempt</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].interx2outatt}</h5>
                  </div>
                </div>
                `;
              } else if (dyfields === 'x2_handover_in_success_rate') {
                conditionalSection = `
                <div class="flex flex-col">
                  <h1 class="font-bold flex gap-1 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="m13.51 4l-5-3h-1l-5 3l-.49.86v6l.49.85l5 3h1l5-3l.49-.85v-6L13.51 4zm-6 9.56l-4.5-2.7V5.7l4.5 2.45v5.41zM3.27 4.7l4.74-2.84l4.74 2.84l-4.74 2.59L3.27 4.7zm9.74 6.16l-4.5 2.7V8.15l4.5-2.45v5.16z"/></svg>
                    Calculation method
                  </h1>
                  <h5 class="text-xs">(A/B)X100</h5>
                </div>
                <hr class="my-4">
                <div class="flex flex-col gap-1">
                  <h1 class="font-bold text-center flex gap-1 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48"><g fill="none"><path d="M14 29h28v12H14V29Zm0-22h28v12H14V7Z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M14 13v6h28V7H14v6Zm0 0H6v22h8m0 0v6h28V29H14v6Z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M14 13H6v22h8m0-6h28v12H14V29Zm0-22h28v12H14V7Z"/></g></svg>
                    Caculation Items                    
                  </h1>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-slate-700">A</h5>
                      <h5 class="text-xs">Inter X2 in success</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].interx2insucc}</h5>
                  </div>
                  <div class="flex justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-slate-700">B</h5>
                      <h5 class="text-xs">Inter X2 in attempt</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].interx2inatt}</h5>
                  </div>
                </div>
                `;
              } else if (dyfields === 's1_handover_out_success_rate') {
                conditionalSection = `
                <div class="flex flex-col">
                  <h1 class="font-bold flex gap-1 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="m13.51 4l-5-3h-1l-5 3l-.49.86v6l.49.85l5 3h1l5-3l.49-.85v-6L13.51 4zm-6 9.56l-4.5-2.7V5.7l4.5 2.45v5.41zM3.27 4.7l4.74-2.84l4.74 2.84l-4.74 2.59L3.27 4.7zm9.74 6.16l-4.5 2.7V8.15l4.5-2.45v5.16z"/></svg>
                    Calculation method
                  </h1>
                  <h5 class="text-xs">(A/B)X100</h5>
                </div>
                <hr class="my-4">
                <div class="flex flex-col gap-1">
                  <h1 class="font-bold text-center flex gap-1 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48"><g fill="none"><path d="M14 29h28v12H14V29Zm0-22h28v12H14V7Z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M14 13v6h28V7H14v6Zm0 0H6v22h8m0 0v6h28V29H14v6Z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M14 13H6v22h8m0-6h28v12H14V29Zm0-22h28v12H14V7Z"/></g></svg>
                    Caculation Items                    
                  </h1>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-slate-700">A</h5>
                      <h5 class="text-xs">Inter S1 out success</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].inters1insucc}</h5>
                  </div>
                  <div class="flex justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-slate-700">B</h5>
                      <h5 class="text-xs">Inter S1 out attempt</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].inters1inatt}</h5>
                  </div>
                </div>
                `;
              } else if (dyfields === 's1_handover_in_success_rate') {
                conditionalSection = `
                <div class="flex flex-col">
                  <h1 class="font-bold flex gap-1 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="m13.51 4l-5-3h-1l-5 3l-.49.86v6l.49.85l5 3h1l5-3l.49-.85v-6L13.51 4zm-6 9.56l-4.5-2.7V5.7l4.5 2.45v5.41zM3.27 4.7l4.74-2.84l4.74 2.84l-4.74 2.59L3.27 4.7zm9.74 6.16l-4.5 2.7V8.15l4.5-2.45v5.16z"/></svg>
                    Calculation method
                  </h1>
                  <h5 class="text-xs">(A/B)X100</h5>
                </div>
                <hr class="my-4">
                <div class="flex flex-col gap-1">
                  <h1 class="font-bold text-center flex gap-1 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48"><g fill="none"><path d="M14 29h28v12H14V29Zm0-22h28v12H14V7Z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M14 13v6h28V7H14v6Zm0 0H6v22h8m0 0v6h28V29H14v6Z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M14 13H6v22h8m0-6h28v12H14V29Zm0-22h28v12H14V7Z"/></g></svg>
                    Caculation Items                    
                  </h1>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-slate-700">A</h5>
                      <h5 class="text-xs">Inter S1 in success</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].inters1insucc}</h5>
                  </div>
                  <div class="flex justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-slate-700">B</h5>
                      <h5 class="text-xs">Inter S1 in attempt</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].inters1inatt}</h5>
                  </div>
                </div>
                `;
              } else if (dyfields === 'dl_bler') {
                conditionalSection = `
                <div class="flex flex-col">
                  <h1 class="font-bold flex gap-1 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="m13.51 4l-5-3h-1l-5 3l-.49.86v6l.49.85l5 3h1l5-3l.49-.85v-6L13.51 4zm-6 9.56l-4.5-2.7V5.7l4.5 2.45v5.41zM3.27 4.7l4.74-2.84l4.74 2.84l-4.74 2.59L3.27 4.7zm9.74 6.16l-4.5 2.7V8.15l4.5-2.45v5.16z"/></svg>
                    Calculation method
                  </h1>
                  <h5 class="text-xs">(A/B)X100</h5>
                </div>
                <hr class="my-4">
                <div class="flex flex-col gap-1">
                  <h1 class="font-bold text-center flex gap-1 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48"><g fill="none"><path d="M14 29h28v12H14V29Zm0-22h28v12H14V7Z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M14 13v6h28V7H14v6Zm0 0H6v22h8m0 0v6h28V29H14v6Z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M14 13H6v22h8m0-6h28v12H14V29Zm0-22h28v12H14V7Z"/></g></svg>
                    Caculation Items                    
                  </h1>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-slate-700">A</h5>
                      <h5 class="text-xs">DL transmission acked retransmission</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].dltransmissionnackedretrans}</h5>
                  </div>
                  <div class="flex justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-slate-700">B</h5>
                      <h5 class="text-xs">DL transmission retransmission 0~600</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].dltransmissionretrans0_600}</h5>
                  </div>
                </div>
                `;
              } else if (dyfields === 'ul_bler') {
                conditionalSection = `
                <div class="flex flex-col">
                  <h1 class="font-bold flex gap-1 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="m13.51 4l-5-3h-1l-5 3l-.49.86v6l.49.85l5 3h1l5-3l.49-.85v-6L13.51 4zm-6 9.56l-4.5-2.7V5.7l4.5 2.45v5.41zM3.27 4.7l4.74-2.84l4.74 2.84l-4.74 2.59L3.27 4.7zm9.74 6.16l-4.5 2.7V8.15l4.5-2.45v5.16z"/></svg>
                    Calculation method
                  </h1>
                  <h5 class="text-xs">(A/B)X100</h5>
                </div>
                <hr class="my-4">
                <div class="flex flex-col gap-1">
                  <h1 class="font-bold text-center flex gap-1 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48"><g fill="none"><path d="M14 29h28v12H14V29Zm0-22h28v12H14V7Z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M14 13v6h28V7H14v6Zm0 0H6v22h8m0 0v6h28V29H14v6Z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M14 13H6v22h8m0-6h28v12H14V29Zm0-22h28v12H14V7Z"/></g></svg>
                    Caculation Items                    
                  </h1>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-slate-700">A</h5>
                      <h5 class="text-xs">UL transmission acked retransmission</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].ultransmissionnackedretrans}</h5>
                  </div>
                  <div class="flex justify-between">
                    <div class="flex items-center gap-1">
                      <h5 class="text-xs text-center text-slate-50 rounded-full h-4 w-4 bg-slate-700">B</h5>
                      <h5 class="text-xs">UL transmission retransmission 0~600</h5>
                    </div>
                    <h5 class="text-xs font-bold ms-4">${data.results[0].ultransmissionretrans0_600}</h5>
                  </div>
                </div>
                `;
              }


              marker.getPopup().setContent(`
                <div class="flex flex-col">
                  <h1 class="text-sm font-bold text-slate-900 mb-3">${mappedFieldName}</h1>
                  <div class="flex items-center gap-2 mb-4">
                    <h1 class="text-xs text-slate-900">${item.sitebasicinfo_details.siteid}</h1>
                    <h1 class="text-xs text-center text-slate-50 rounded-full ${sectorBGColorClass(item.sitephyinfo_details.secid)} h-5 w-5 flex justify-center items-center">
                      ${item.sitephyinfo_details.secid}
                    </h1>
                    <h1 class="text-xs text-center text-slate-50 rounded-md px-2 py-1 bg-slate-500 flex justify-center items-center">
                      ${item.band}
                    </h1>
                  </div>
                  <div class="flex items-center justify-center gap-4">
                    <h1 class="text-4xl font-bold">${dynamicData.toFixed(1)}<span class="text-xs">%</span></h1>
                    <div class="grid grid-cols-2">
                      <h5 class="text-xs whitespace-nowrap">Avg User</h5>
                      <h5 class="text-xs text-end font-bold">${data.results[0].connectno}</h5>
                      <h5 class="text-xs whitespace-nowrap">Max User</h5>
                      <h5 class="text-xs text-end font-bold">${data.results[0].connectmax}</h5>
                      <h5 class="text-xs whitespace-nowrap">DL PRB</h5>
                      <h5 class="text-xs text-end font-bold">${data.results[0].totalprbdl}</h5>
                      <h5 class="text-xs whitespace-nowrap">UL PRB</h5>
                      <h5 class="text-xs text-end font-bold">${data.results[0].totalprbul}</h5>
                    </div>
                  </div>
                  <hr class="my-4">
                  ${conditionalSection}
                </div>
              `).openPopup();
            })
            .catch(error => {
              console.error('There has been a problem with fetch operation:', error)
              marker.getPopup().setContent('Failed to load data').openPopup();
            });
          }
        });
      }
    });
  }

  function handleMapReady(leafletMap: CustomEvent<L.Map>) {
    map = leafletMap.detail;
    if (StatisticFailData) {
      addMarkers(StatisticFailData);
      
    }
  }

  function handleSiteClickMove(siteId: string) {
    const site = StatisticFailData.find(statistic => statistic.sitebasicinfo_details?.siteid === siteId);
    if (site && map) {
    const lat = site.sitebasicinfo_details.lat; // 'lat' 필드의 정확한 경로를 확인하세요.
    const lng = site.sitebasicinfo_details.lon; // 'lon' 필드의 정확한 경로를 확인하세요.

    map.flyTo([lat, lng], 15); // 맵을 해당 위치로 이동시킵니다.
  }
  }
</script>

<div class="flex items-center p-2 gap-4">
  <div class="w-[540px] h-[calc(100vh-100px)] border-r border-slate-600 p-4">
    <div class="flex items-center mb-4">
      <h1 class="text-md text-slate-400 font-bold">{mappedFieldName}</h1>
      <p class="rounded-md text-slate-200 text-xs bg-slate-600 py-0.5 px-2 ms-4">{regions}</p>
      <p class="rounded-md text-slate-900 text-xs bg-rose-400 py-0.5 px-2 ms-1">{bands}</p>
    </div>

    <div class="flex mb-4">
      <p class="text-xs text-slate-400">Total {data.statisticpagedData.cellCountbyBand} cells are exist in {regions} region for {bands} and {data.statisticpagedData.StaitsticFailCount} cells are not meet KPI threshold (99%) </p>
    </div>

    <Table shadow={true} hoverable={true} customeColor={'bg-gray-400'} class="w-full">
      <TableHead>
        <TableHeadCell>SITE ID</TableHeadCell>
        <TableHeadCell>SEC ID</TableHeadCell>
        <TableHeadCell>VALUE</TableHeadCell>
        <TableHeadCell>ACTION</TableHeadCell>
      </TableHead>
      <TableBody>
        {#each paginatedData  as statistic}
        <TableBodyRow color="red">
          <TableBodyCell tdClass="py-1 pl-6 text-xs text-slate-400">
            {statistic.sitebasicinfo_details?.siteid}
          </TableBodyCell>
          <TableBodyCell tdClass="py-1 pl-6 text-xs text-slate-400">
            {statistic.sitephyinfo_details?.secid}
          </TableBodyCell>
          <TableBodyCell tdClass="py-1 pl-6 text-xs text-slate-400">
            {getDynamicFieldValue(statistic, dyfields)}
          </TableBodyCell>
          <TableBodyCell tdClass="py-1 pl-6 text-xs text-slate-400">
            <Button size="xs" color="dark" class="py-1 text-slate-50 text-xs"
              on:click={() => handleSiteClickMove(statistic.sitebasicinfo_details?.siteid)}>Show</Button>
          </TableBodyCell>
        </TableBodyRow>
        {/each}
      </TableBody>
    </Table>

    <div class="flex items-center justify-center mt-2">
      <button class="border border-slate-600 text-xs text-slate-400 px-2 py-1 hover:bg-slate-400 hover:text-slate-900 focus:ring-4 focus:ring-rose-900" on:click={goToFirstPage}>
        First
      </button>
      <button class="border border-slate-600 text-xs text-slate-400 px-2 py-1 hover:bg-slate-400 hover:text-slate-900 focus:ring-4 focus:ring-rose-900" on:click={goToPreviousPage}>
        &lt&lt
      </button>
      <span class="text-slate-400 text-xs font-bold px-4">{currentPage} of {totalpage} Entries</span>
      <button class="border border-slate-600 text-xs text-slate-400 px-2 py-1 hover:bg-slate-400 hover:text-slate-900 focus:ring-4 focus:ring-rose-900" on:click={goToNextPage}>
        &gt&gt
      </button>
      <button class="border border-slate-600 text-xs text-slate-400 px-2 py-1 hover:bg-slate-400 hover:text-slate-900 focus:ring-4 focus:ring-rose-900" on:click={goToLastPage}>
       Last
      </button>
    </div>

    <div class="flex flex-col mt-4">
      <h1 class="text-slate-400 text-sm font-bold mb-2">{mappedFieldName} Trend</h1>
      <Card padding="none">
        <TrandChartbyfields {StatisticChartData} {bands} {regions} {dyfields} />
      </Card>

    </div>

  </div>
  
  <div class="w-full h-[calc(100vh-100px)] rounded-lg flex flex-col">
    <Basemap on:ready={handleMapReady} />
  </div>
</div>

<Toaster />