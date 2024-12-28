import { Schema, model } from 'mongoose';

// Basic Information
interface BasicInfo {
  name: string;
  race: string;
  class: string;
  level: number;
  background: string;
  alignment: string;
}

// Attributes
interface Attributes {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

// Combat Information
interface Combat {
  armorClass: number;
  hitPoints: number;
  initiative: number;
  speed: number;
}

// Skills
interface Skills {
  proficiencies: string[];
  savingThrows: string[];
}

// Spells
export interface ISpell {
  name: string;
  level: number;
  prepared: boolean;
}

// Equipment
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

// Character Document Interface
interface CharacterDocument {
  _id: string;
  player: Schema.Types.ObjectId;
  basicInfo: BasicInfo;
  attributes: Attributes;
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
    description: [String],
    properties: [String],
  }
);

// Character Schema
const characterSchema = new Schema<CharacterDocument>(
  {
    player: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    basicInfo: {
      name: { type: String, required: true },
      class: { type: String, required: true },
      race: { type: String, required: true },
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
      proficiencies: [{ type: String }],
      savingThrows: [{ type: String }],
    },
    equipment: [equipmentSchema], // Using structured schema for equipment
    spells: [spellSchema],
    private: { type: Boolean, default: true }, // New property with default value
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Character = model<CharacterDocument>('Character', characterSchema);

export default Character;
