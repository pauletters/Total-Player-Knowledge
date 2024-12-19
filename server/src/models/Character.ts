import { Schema, model } from 'mongoose';

interface Attributes {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
}

interface Skills {
    acrobatics: number;
    animalHandling: number;
    arcana: number;
    athletics: number;
    deception: number;
    history: number;
    insight: number;
    intimidation: number;
    investigation: number;
    medicine: number;
    nature: number;
    perception: number;
    performance: number;
    persuasion: number;
    religion: number;
    sleightOfHand: number;
    stealth: number;
    survival: number;
}

interface SavingThrows {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
}

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

interface Biography {
    alignment: string;
    background: string;
    languages: string[];
}

interface Currency {
    copperPieces: number;
    silverPieces: number;
    electrumPieces: number;
    goldPieces: number;
    platinumPieces: number;
}

interface CharacterDocument {
    _id: string;
    player: Schema.Types.ObjectId;
    name: string;
    class: string;
    race: string;
    level: number;
    maximumHealth: number;
    currentHealth: number;
    armorClass: number;
    attributes?: Attributes;
    skills?: Skills;
    savingThrows?: SavingThrows;
    weapons?: Weapon[];
    equipment?: Equipment[];
    feats?: Feat[];
    inventory?: Item[];
    spells?: Spell[];
    biography?: Biography;
    currency?: Currency;

    createdAt?: Date;
    updatedAt?: Date;
}

const characterSchema = new Schema<CharacterDocument>({
    player: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    class: { type: String, required: true },
    race: { type: String, required: true },
    level: { type: Number, required: true, min: 1, max: 20 },
    maximumHealth: { type: Number, required: true },
    currentHealth: { type: Number, required: true },
    armorClass: { type: Number, required: true },
    attributes: {
        strength: Number,
        dexterity: Number,
        constitution: Number,
        intelligence: Number,
        wisdom: Number,
        charisma: Number,
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
    },
    savingThrows: {
        strength: Number,
        dexterity: Number,
        constitution: Number,
        intelligence: Number,
        wisdom: Number,
        charisma: Number,
    },
    weapons: [{
        name: String,
        desc: String,
        damage: String,
        damageType: String,
        range: String,
    }],
    equipment: [{
        name: String,
        desc: String,
    }],
    feats: [{
        name: String,
        desc: [String],
    }],
    inventory: [{
        name: String,
        desc: String,
    }],
    spells: [{
        name: String,
        desc: [String],
        level: Number,
        damage: Schema.Types.Mixed,
        range: String,
    }],
    biography: {
        alignment: String,
        background: String,
        languages: [String],
    },
    currency: {
        copperPieces: { type: Number, default: 0},
        silverPieces: { type: Number, default: 0},
        electrumPieces: { type: Number, default: 0},
        goldPieces: { type: Number, default: 0},
        platinumPieces: { type: Number, default: 0},
    },
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
},
{timestamps: true}
);

const Character = model<CharacterDocument>('Character', characterSchema);

export default Character;