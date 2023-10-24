<script lang="ts">
  import L from 'leaflet'
  import { curve } from 'leaflet'; // for TypeScript
  import '@elfalem/leaflet-curve'
  import type { Map as LeafletMap } from 'leaflet'
  import Papa from 'papaparse';

  export let map: LeafletMap | null = null;
  export let testdataUrl: string = '';
  export let selected_btsManagerData: any[];

  interface GpsData {
    lon: number;
    lat: number;
    RSRP: number;
    SINR: number;
    Serving: number;
    TOP1_PCI?: number;
    TOP1_RSRP?: number;
    TOP2_PCI?: number;
    TOP2_RSRP?: number;
    TOP3_PCI?: number;
    TOP3_RSRP?: number;
    TOP4_PCI?: number;
    TOP4_RSRP?: number;
    TOP5_PCI?: number;
    TOP5_RSRP?: number;
    [key: string]: number | undefined;
  } 

  interface PciInfo {
    pci: number;
    averageRSRP: number;
    count: number;
    curveLines: L.Polyline[];  // 수정된 부분
  }
  interface TopAndPciInfo {
    top: string;
    pcis: PciInfo[];
  }

  let TopAndPciInfo: TopAndPciInfo[] = [];

  function getFillColorBySINR(sinr: number): string {
    if (sinr >= 2 ) {
      return 'green';
    } else if (sinr >= 0) {
      return 'yellow';
    } else if (sinr >= -2) {
      return 'blue';
    } else {
      return 'red';
    }
  }

  const colorMapping: { [key: string]: string } = {
    PCI: 'gray',
    TOP1_PCI: 'red',
    TOP2_PCI: 'blue',
    TOP3_PCI: 'green',
    TOP4_PCI: 'yellow',
    TOP5_PCI: 'purple'
  }

  async function fetchCSV(url: string): Promise<GpsData[]> {
    const response = await fetch(url);
    const text = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (result) => {
          if (result.errors.length > 0) {
            reject(result.errors);
            return;
          }
          const gpsData: GpsData[] = result.data.map((row: any) => ({
            lon: row['Lon'],
            lat: row['Lat'],
            RSRP: row['RSRP'],
            SINR: row['SINR'],
            Serving: row['PCI'],
            TOP1_PCI: row['TOP1_PCI'],
            TOP1_RSRP: row['TOP1_RSRP'],
            TOP2_PCI: row['TOP2_PCI'],
            TOP2_RSRP: row['TOP2_RSRP'],
            TOP3_PCI: row['TOP3_PCI'],
            TOP3_RSRP: row['TOP3_RSRP'],
            TOP4_PCI: row['TOP4_PCI'],
            TOP4_RSRP: row['TOP4_RSRP'],
            TOP5_PCI: row['TOP5_PCI'],
            TOP5_RSRP: row['TOP5_RSRP'],
          }));
          resolve(gpsData);
        }
      });
    });
  }

  let markers: L.Layer[] = [];

  async function displayTestResults() {
    const gpsData = await fetchCSV(testdataUrl);

    gpsData.forEach(data => {
      const fillColor = getFillColorBySINR(data.SINR);
      const marker = L.circleMarker([data.lat, data.lon], {
        radius: 5,
        fillColor: fillColor,
        color: '#000',
        weight: 0,
        opacity: 0.1,
        fillOpacity: 0.7,
      }).addTo(map!);
      markers.push(marker);
    });
  }

  function drawLinesBetweenTestAndBTS(gpsData: GpsData[]): TopAndPciInfo[] {
    const topAndPciInfo: TopAndPciInfo[] = [];
    const pciKeys = ['Serving', 'TOP1_PCI', 'TOP2_PCI', 'TOP3_PCI', 'TOP4_PCI', 'TOP5_PCI'];
    const rsrpKeys = ['RSRP', 'TOP1_RSRP', 'TOP2_RSRP', 'TOP3_RSRP', 'TOP4_RSRP', 'TOP5_RSRP'];

    pciKeys.forEach((pciKey, index) => {
      const rsrpKey = rsrpKeys[index];
      const pciInfoArray: PciInfo[] = [];

      const uniquePcis = Array.from(new Set(gpsData.map(data => data[pciKey])));

      uniquePcis.forEach(pci => {
        if (pci !== undefined) {
          const filteredData = gpsData.filter(data => data[pciKey] === pci && data[rsrpKey] !== 999 && data[rsrpKey] !== null);
          const averageRSRP = filteredData.reduce((sum, data) => sum + data[rsrpKey]!, 0) / filteredData.length;
          const count = filteredData.length;
  
          const curveLines: L.Polyline[] = [];
  
          filteredData.forEach(data => {
            const correspondingBTSData = selected_btsManagerData.find(btsData => btsData.pci === pci);
            if (correspondingBTSData) {
              const controlPointLat = (data.lat + correspondingBTSData.lat) / 2;
              const controlPointLon = data.lon;
              const curveArray = [
                'M', [data.lat, data.lon],
                'Q', [controlPointLat, controlPointLon],
                [correspondingBTSData.lat, correspondingBTSData.lon]
              ];
              const options = {
                color: colorMapping[pciKey],
                weight: 1,
                opacity: 0.1
              };
              const curvedLine = curve(curveArray, options);
              curveLines.push(curvedLine);
            }
          });
  
          pciInfoArray.push({
            pci: pci,
            averageRSRP,
            count,
            curveLines
          });
        }
      });

      topAndPciInfo.push({
        top: pciKey,
        pcis: pciInfoArray
      });
    });

    return topAndPciInfo;
  }

  let selectedTops: Set<string> = new Set();
  let selectedPcis: Set<number> = new Set();

  function renderDataAndDrawCurve(topAndPciInfo: TopAndPciInfo[]) {
    const container = document.querySelector('.testresult-container');
    if (!container) return; // container가 없으면 종료
    
    // 먼저 이전 데이터를 모두 제거합니다.
    container.innerHTML = '';

    topAndPciInfo.forEach(data => {
      // HTML 동적 생성
      const topElement = document.createElement('div');
      const title = document.createElement('button');
      title.textContent = data.top;
      title.className = 'text-sm rounded-md bg-slate-50/60 text-center py-1 w-full'
      topElement.appendChild(title);

      // top select event hendler
      title.addEventListener('click', () => {
        if (selectedTops.has(data.top)) {
          selectedTops.delete(data.top);
        } else {
          selectedTops.add(data.top);
        }
        renderDataAndDrawCurve(topAndPciInfo);
      });

      const pciList = document.createElement('ul');
      data.pcis.forEach(pciInfo => {
        // condition rendering
        if (selectedTops.has(data.top) && selectedPcis.has(pciInfo.pci)) {
          const pciItem = document.createElement('li');
          pciItem.textContent = `P: ${pciInfo.pci}, R: ${pciInfo.averageRSRP.toFixed(1)}, C: ${pciInfo.count}`;
          pciItem.className = 'text-xs'

          // pci select event hendler
          pciItem.addEventListener('click', () => {
            if (selectedPcis.has(pciInfo.pci)) {
              selectedPcis.delete(pciInfo.pci)
            } else {
              selectedPcis.add(pciInfo.pci)
            }
            renderDataAndDrawCurve(topAndPciInfo);
          });
          pciList.appendChild(pciItem);
        }
      });
      topElement.appendChild(pciList);
      container.appendChild(topElement);

      if (selectedTops.has(data.top)) {
        data.pcis.forEach(pciInfo => {
          if (selectedPcis.has(pciInfo.pci)) {
            pciInfo.curveLines.forEach(curveLine => {
              map?.removeLayer(curveLine);
              curveLine.addTo(map!);
            });
          }
        });
      }
    });
  }

  $: if (map && testdataUrl) {
    async function updateMarkers() {
      try {
        markers.forEach(marker => map!.removeLayer(marker));
        markers = []
  
        const gpsData = await fetchCSV(testdataUrl);

        await displayTestResults();
        const topAndPciInfo = drawLinesBetweenTestAndBTS(gpsData);
  
        renderDataAndDrawCurve(topAndPciInfo);
        // topAndPciInfo.forEach(data => {
        //   if (selectedTops.has(data.top)) {
        //     data.pcis.forEach(pciInfo => {
        //       if (selectedPcis.has(pciInfo.pci)) {
        //         pciInfo.curveLines.forEach(curveLine => {
        //           if (map) {
        //             map.removeLayer(curveLine);
        //             curveLine.addTo(map);
        //           }
        //         });
        //       }
        //     });
        //   }
        // });

      } catch (err) {
        console.error('Failed to update markers:', err);
      }

    }
    updateMarkers().catch(err => console.error('Failed to update markers:', err));
  }

</script>