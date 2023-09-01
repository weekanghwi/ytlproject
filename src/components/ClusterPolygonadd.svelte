<script lang="ts">
  import { onMount } from "svelte";
  import type { Map as LeafletMap } from 'leaflet';
  import * as L from 'leaflet';

  export let map: LeafletMap | null = null;
  let drawnItems: L.FeatureGroup;

  onMount(() => {
    if (typeof window !== 'undefined') {
      import('leaflet-draw/dist/leaflet.draw.css');
      import('leaflet-draw').then(() => {
        if (map) {
          drawnItems = new L.FeatureGroup();
          map.addLayer(drawnItems);

          const drawControl = new L.Control.Draw({
            position: 'bottomright',
            draw: {
              polygon: {
                shapeOptions: {
                  color: 'purple'
                }
              },
              polyline: false,
              rectangle: false,
              circle: false,
              marker: false,
            },
            // edit: {
            //   featureGroup: drawnItems,
            //   remove: true
            // }
          });

          map.addControl(drawControl);

          map.on(L.Draw.Event.CREATED, function (event: any) {
            const layer = event.layer;
            drawnItems.addLayer(layer);

            const popupContent = `
              <form id="polygon-info-form">
                <div class="flex flex-col gap-4">
                  <div class="flex flex-col gap-2">
                    <label for="cluster">Cluster</label>
                    <input type="text" name="cluster" id="cluster" class="border border-gray-300 rounded-lg p-2" />
                  </div>

                  <div class="flex flex-col gap-2">
                    <label for="region">region</label>
                    <input type="text" name="region" id="region" class="border border-gray-300 rounded-lg p-2" />
                  </div>

                <button type="submit" class="mt-4 rounded-lg p-2 bg-blue-500 text-white text-sm">Submit</button>
              </form>
            `;


            // layer.on('popupopen popupclose', function(event) {
            //   console.log('An event occurred:', event.type);
            // })

            layer.on('popupopen', () => {
              console.log('An event occurred:', event.type);
              console.log('popup opened');
              const form = document.getElementById('polygon-info-form');
              form?.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(form as HTMLFormElement);
                const cluster = formData.get('cluster');
                const region = formData.get('region');

                const polygonData = {
                  geometry: layer.toGeoJSON().geometry,
                  cluster: cluster,
                  region: region
                };

                sendDataToServer(polygonData);
              });
            });
            
            layer.bindPopup(popupContent).openPopup();
            console.log('popup bound')
          });
        }
      });
    }
  });

  async function sendDataToServer(polygonData: any) {
    try {
      const payload = {
        polygon: polygonData.geometry,
        cluster: polygonData.cluster,
        region: polygonData.region
      };

      const response = await fetch('http://10.24.8.120:8000/api/clusters/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Polygon data sent successfully:', responseData);
    } catch (error) {
      console.error('An error occurred while sending polygon data:', error);
    }
  }
</script>
