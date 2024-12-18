const API_BASE_URL = 'https://www.dnd5eapi.co/api';

export interface ApiResponse<T> {
  count?: number;
  results?: T[];
  [key: string]: any;
}

async function fetchFromApi<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }
  return response.json();
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
  getEquipmentCategories: () => fetchFromApi('/equipment-categories'),
  getMagicItems: () => fetchFromApi('/magic-items'),
  
  // Spells and magic
  getSpells: () => fetchFromApi('/spells'),
  getSpell: (index: string) => fetchFromApi(`/spells/${index}`),

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