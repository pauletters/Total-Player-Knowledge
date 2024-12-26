import { Schema, model } from 'mongoose';

interface BasicInfo {
  name: string;
  race: string;
  class: string;
  level: number;
  background: string;
  alignment: string;
}

interface Attributes {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

interface Combat {
  armorClass: number;
  hitPoints: number;
  initiative: number;
  speed: number;
}

interface Skills {
  proficiencies: string[];
  savingThrows: string[];
}

export interface ISpell {
  name: string;
  level: number;
  prepared: boolean;
}

interface CharacterDocument {
  _id: string;
  player: Schema.Types.ObjectId;
  basicInfo: BasicInfo;
  attributes: Attributes;
  combat?: Combat;
  skills?: Skills;
  equipment?: string[];
  spells: ISpell[];
  private: boolean; // New property
  createdAt?: Date;
  updatedAt?: Date;
}

const spellSchema = new Schema({
  name: { type: String, required: true },
  level: { type: Number, required: true },
  prepared: { type: Boolean, required:true, default: false }
}, { 
  _id: false // Disable _id for subdocuments
});

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
    equipment: [{ type: String }],
    spells: [spellSchema],
    private: { type: Boolean, default: true }, // New property with default value
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Character = model<CharacterDocument>('Character', characterSchema);

export default Character;
