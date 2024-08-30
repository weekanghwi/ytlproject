import type { PageServerLoad } from './$types';

interface AlarmData {
  id: number;
  sitebasicinfo: {
    id: number;
    siteid: string;
  } | null;
  site_name: string;
  folder: string;
  alarm: string;
  material_remark: string;
  created_at: string;
}

export const load: PageServerLoad = async ({ fetch }) => {
  try {
    const [alarmDataResponse, alarmsResponse] = await Promise.all([
      fetch('http://10.24.8.120:8000/api/alarmdata/'),
      fetch('http://10.24.8.120:8000/api/alarms/')
    ])
    if (!alarmDataResponse.ok || !alarmsResponse.ok) {
      throw new Error('Failed to fetch alarm data');
    }
    const alarmData: AlarmData[] = await alarmDataResponse.json();
    const alarms = await alarmsResponse.json();
    return {
      alarmData,
      alarms
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
      return {
        alarmData: [],
        alarms: []
      };
    }
  }
}