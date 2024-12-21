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
    savingThrows: string [];
}

/*
interface Weapon {
    name: string;
    desc: string;
    damage: string;
    damageType: string;
    range: string;
}

interface Equipment {
    name: string;
    desc: string;
}

interface Feat {
    name: string;
    desc: string[];
}

interface Item {
    name: string;
    desc: string;
}

interface Spell {
    name: string;
    desc: string[];
    level: number;
    damage: any;
    range: string;
}

interface Currency {
    copperPieces: number;
    silverPieces: number;
    electrumPieces: number;
    goldPieces: number;
    platinumPieces: number;
}
*/

interface CharacterDocument {
    _id: string;
    player: Schema.Types.ObjectId;
    basicInfo: BasicInfo;
    attributes: Attributes;
    combat?: Combat;
    skills?: Skills;
    equipment?: String[];
    spells?: String[];

    createdAt?: Date;
    updatedAt?: Date;
}

const characterSchema = new Schema<CharacterDocument>({
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
    spells: [{ type: String }],
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
},
{timestamps: true}
);

const Character = model<CharacterDocument>('Character', characterSchema);

export default Character;