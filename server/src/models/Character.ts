import { Schema, model } from 'mongoose';

// Attributes Interface
interface Attributes {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

// Skills Interface
interface Skills {
  acrobatics?: number;
  animalHandling?: number;
  arcana?: number;
  athletics?: number;
  deception?: number;
  history?: number;
  insight?: number;
  intimidation?: number;
  investigation?: number;
  medicine?: number;
  nature?: number;
  perception?: number;
  performance?: number;
  persuasion?: number;
  religion?: number;
  sleightOfHand?: number;
  stealth?: number;
  survival?: number;
  proficiencies?: string[];
  savingThrows?: string[];
}

// Combat Interface
interface Combat {
  armorClass: number;
  hitPoints: number;
  initiative: number;
  speed: number;
}

// Basic Info Interface
interface BasicInfo {
  name: string;
  race: string;
  class: string;
  level: number;
  background: string;
  alignment: string;
}

// Spells Interface
export interface ISpell {
  name: string;
  desc?: string[];
  level: number;
  damage?: any;
  range?: string;
  prepared: boolean;
}


interface Equipment {
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

interface CharacterDocument {
  _id: string;
  player: Schema.Types.ObjectId;
  basicInfo?: BasicInfo;
  attributes?: Attributes;
  combat?: Combat;
  skills?: Skills;
  equipment?: Equipment[];

  spells: ISpell[];

  private: boolean; // New property
  createdAt?: Date;
  updatedAt?: Date;
}

// Spell Schema
const spellSchema = new Schema(
  {
    name: { type: String, required: true },
    level: { type: Number, required: true },
    prepared: { type: Boolean, required: true, default: false },
    desc: [String], // Using `desc` field from GitHub
    damage: Schema.Types.Mixed,
    range: String,
  },
  {
    _id: false, // Disable _id for subdocuments
  }
);

// Equipment Schema
const equipmentSchema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    cost: {
      quantity: Number,
      unit: String,
    },
    weight: Number,
    desc: [String], // Using `desc` field from GitHub
    properties: [String],
  }
);


const equipmentSchema = new Schema({
  name: { type: String, required: true },
      category: { type: String, required: true },
      cost: {
        quantity: Number,
        unit: String
      },
      weight: Number,
      description: [String],
      properties: [String]
    });

const characterSchema = new Schema<CharacterDocument>(
  {
    player: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    basicInfo: {
      name: { type: String, required: true },
      race: { type: String, required: true },
      class: { type: String, required: true },
      level: { type: Number, required: true, min: 1, max: 20 },
      background: { type: String },
      alignment: { type: String },
    },
    attributes: {
      strength: { type: Number, default: 10 },
      dexterity: { type: Number, default: 10 },
      constitution: { type: Number, default: 10 },
      intelligence: { type: Number, default: 10 },
      wisdom: { type: Number, default: 10 },
      charisma: { type: Number, default: 10 },
    },
    combat: {
      armorClass: { type: Number, default: 10 },
      hitPoints: { type: Number, default: 10 },
      initiative: { type: Number, default: 0 },
      speed: { type: Number, default: 30 },
    },
    skills: {
      acrobatics: Number,
      animalHandling: Number,
      arcana: Number,
      athletics: Number,
      deception: Number,
      history: Number,
      insight: Number,
      intimidation: Number,
      investigation: Number,
      medicine: Number,
      nature: Number,
      perception: Number,
      performance: Number,
      persuasion: Number,
      religion: Number,
      sleightOfHand: Number,
      stealth: Number,
      survival: Number,
      proficiencies: [String],
      savingThrows: [String],
    },
    equipment: [equipmentSchema],
    spells: [spellSchema],
    weapons: [
      {
        name: String,
        desc: String,
        damage: String,
        damageType: String,
        range: String,
      },
    ],
    feats: [
      {
        name: String,
        desc: [String],
      },
    ],
    inventory: [
      {
        name: String,
        desc: String,
      },
    ],
    biography: {
      alignment: String,
      background: String,
      languages: [String],
    },
    currency: {
      copperPieces: { type: Number, default: 0 },
      silverPieces: { type: Number, default: 0 },
      electrumPieces: { type: Number, default: 0 },
      goldPieces: { type: Number, default: 0 },
      platinumPieces: { type: Number, default: 0 },
    },
    private: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Character = model<CharacterDocument>('Character', characterSchema);

export default Character;
