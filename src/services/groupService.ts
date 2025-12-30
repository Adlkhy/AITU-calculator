
export interface GroupData {
  Group: string;
  Name: string;
  Email: string;
}

const JSON_FILES = [
  'BDA.json', 'CS_SST.json', 'DJ.json', 'IIOT_EE.json', 
  'ITM_ITE_AIB_DPA.json', 'IT_MCS.json', 'MT.json', 'SE.json', 'ST.json'
];

let groupMap: Record<string, string> | null = null;

export async function fetchGroupData(): Promise<Record<string, string>> {
  if (groupMap) return groupMap;

  const map: Record<string, string> = {};
  
  try {
    const fetchPromises = JSON_FILES.map(async (file) => {
      try {
        const response = await fetch(`/data/${file}`);
        if (!response.ok) throw new Error(`Failed to fetch ${file}`);
        const data: GroupData[] = await response.json();
        data.forEach(item => {
          if (item.Email) {
            map[item.Email.toLowerCase()] = item.Group;
          }
        });
      } catch (error) {
        console.error(`Error loading group data from ${file}:`, error);
      }
    });

    await Promise.all(fetchPromises);
    groupMap = map;
    return groupMap;
  } catch (error) {
    console.error('Error fetching group data:', error);
    return {};
  }
}

export function getGroupName(email: string | undefined | null, map: Record<string, string>): string {
  if (!email) return 'None';
  return map[email.toLowerCase()] || 'None';
}
