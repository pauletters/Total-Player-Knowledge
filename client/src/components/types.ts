export interface CharacterData {
  _id?: string;
  basicInfo: {
    name: string;
    race: string;
    class: string;
    level: number;
    background: string;
    alignment: string;
    avatar: string;
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
  equipment: Equipment[];
  spells: CharacterSpell[];
}

/*
background: string;
feats: string[];
*/

export interface SectionProps {
  character: CharacterData;
  onInputChange: (category: keyof CharacterData, field: string, value: any) => void;
}

export interface AttributesSectionProps extends SectionProps {
  calculateModifier: (score: number) => number;
}

export interface ApiSpell {
  index: string;
  name: string;
  level: number;
  school: {
    name: string;
  };
  classes: {
    name: string;
  }[];
  desc: string[];
  range?: string;
  casting_time?: string;
  duration?: string;
  components?: string[];
}

export interface CharacterSpell {
  name: string;
  level: number;
  prepared: boolean;
}

export interface Equipment {
  name: string;
  category: string;
  cost?: {
    quantity: number;
    unit: string;
  };
  weight?: number;
  description?: string[];
  properties?: string[];
}