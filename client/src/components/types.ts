export interface CharacterData {
  basicInfo: {
    name: string;
    race: string;
    class: string;
    level: number;
    background: string;
    alignment: string;
  };
  attributes: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  combat: {
    armorClass: number;
    hitPoints: number;
    initiative: number;
    speed: number;
  };
  skills: {
    proficiencies: string[];
    savingThrows: string[];
  };
  equipment: any[];
  spells: any[];
}

export interface SectionProps {
  character: CharacterData;
  onInputChange: (category: keyof CharacterData, field: string, value: any) => void;
}

export interface AttributesSectionProps extends SectionProps {
  calculateModifier: (score: number) => number;
}