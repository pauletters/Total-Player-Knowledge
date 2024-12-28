const API_BASE_URL = 'https://www.dnd5eapi.co/api';

export interface ApiResponse<T> {
  count?: number;
  results?: T[];
  [key: string]: any;
}

async function fetchFromApi<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log('Making API request to:', url);
  
  try {
    const response = await fetch(url);
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      console.error('API error - Status:', response.status);
      console.error('Response:', response);
      throw new Error(`API call failed: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    console.log('Content-Type:', contentType);

    const data = await response.json();
    console.log('API response data:', data);
    return data;
  } catch (error) {
    console.error('Error in fetchFromApi:', error);
    throw error;
  }
}

export const dndApi = {
  // Character-related endpoints
  getRaces: () => fetchFromApi('/races'),
  getRace: (index: string) => fetchFromApi(`/races/${index}`),
  getClasses: () => fetchFromApi('/classes'),
  getClass: (index: string) => fetchFromApi(`/classes/${index}`),
  getBackgrounds: () => fetchFromApi('/backgrounds'),
  getBackground: (index: string) => fetchFromApi(`/backgrounds/${index}`),

  // Equipment endpoints
  getEquipment: () => fetchFromApi('/equipment'),
  getEquipmentItem: (index: string) => fetchFromApi(`/equipment/${index}`),
  getEquipmentCategories: () => fetchFromApi('/equipment-categories'),
  getMagicItems: () => fetchFromApi('/magic-items'),
  
  // Spells and magic
  async getSpells() {
    console.log('getSpells called');
    try {
      console.log('Fetching all spells from /spells endpoint');
      const data = await fetchFromApi<ApiResponse<any>>('/spells');
      console.log('All spells response data:', data);
      return data;
    } catch (error) {
      console.error('Error in getSpells:', error);
      throw error;
    }
  },
  
  async getSpell(index: string) {
    console.log('getSpell called with index:', index);
    try {
      const data = await fetchFromApi<any>(`/spells/${index}`);
      console.log('Individual spell data:', data);
      return data;
    } catch (error) {
      console.error('Error in getSpell:', error);
      throw error;
    }
  },

    async getSpellsByClass(className: string) {
      try {
        const formattedClassName = className.toLowerCase();
        const response = await fetchFromApi<ApiResponse<any>>(`/classes/${formattedClassName}/spells`);
        return response;
      } catch (error) {
        console.error(`Error fetching spells for class ${className}:`, error);
        throw error;
      }
    },

  // Rules and mechanics
  getConditions: () => fetchFromApi('/conditions'),
  getRules: () => fetchFromApi('/rules'),
  getRuleSections: () => fetchFromApi('/rule-sections'),

  // Features and traits
  getFeatures: () => fetchFromApi('/features'),
  getTraits: () => fetchFromApi('/traits'),

  // Abilities and skills
  getAbilityScores: () => fetchFromApi('/ability-scores'),
  getSkills: () => fetchFromApi('/skills'),

  // Reference data
  getLanguages: () => fetchFromApi('/languages'),
  getProficiencies: () => fetchFromApi('/proficiencies'),
};