const typeDefs = `
    type User {
        _id: ID!
        username: String!
        email: String!
    }

    type Attributes {
        strength: Int!
        dexterity: Int!
        constitution: Int!
        intelligence: Int!
        wisdom: Int!
        charisma: Int!
    }

    type Skills {
        acrobatics: Int!
        animalHandling: Int!
        arcana: Int!
        athletics: Int!
        deception: Int!
        history: Int!
        insight: Int!
        intimidation: Int!
        investigation: Int!
        medicine: Int!
        nature: Int!
        perception: Int!
        performance: Int!
        persuasion: Int!
        religion: Int!
        sleightOfHand: Int!
        stealth: Int!
        survival: Int!
    }

    type SavingThrows {
        strength: Int!
        dexterity: Int!
        constitution: Int!
        intelligence: Int!
        wisdom: Int!
        charisma: Int!
    }

    type Weapon {
        name: String!
        desc: String!
        damage: String!
        damageType: String!
        range: String!
    }

    type Equipment {
        name: String!
        desc: String!
    }

    type Feat {
        name: String!
        desc: [String!]!
    }

    type Item {
        name: String!
        desc: String!
    }

    type Spell {
        name: String!
        desc: [String!]!
        level: Int!
        damage: String
        range: String!
    }

    type Biography {
        alignment: String!
        background: String!
        languages: [String!]!
    }

    type Currency {
        copperPieces: Int!
        silverPieces: Int!
        electrumPieces: Int!
        goldPieces: Int!
        platinumPieces: Int!
    }

    type Character {
        _id: ID!
        player: User!
        name: String!
        class: String!
        race: String!
        level: Int!
        maximumHealth: Int!
        currentHealth: Int!
        armorClass: Int!
        attributes: Attributes
        skills: Skills
        savingThrows: SavingThrows
        weapons: [Weapon!]!
        equipment: [Equipment!]!
        feats: [Feat!]!
        inventory: [Item!]!
        spells: [Spell!]!
        biography: Biography
        currency: Currency
        createdAt: String!
        updatedAt: String!
    }

    type Campaign {
        _id: ID!
        name: String!
        description: String
        members: [Character!]!
        milestones: [String!]!
        createdBy: User!
        playerCount: Int!
        createdAt: String!
        updatedAt: String!
    }

    type Query {
        me: User
        characters: [Character!]!
        character(id: ID!): Character
        campaigns: [Campaign!]!
        campaign(id: ID!): Campaign
    }

    type Mutation {
        loginUser(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth

        addCharacter(
            player: ID!
            name: String!
            class: String!
            race: String!
            level: Int!
            maximumHealth: Int!
            currentHealth: Int!
            armorClass: Int!
            attributes: AttributesInput
            skills: SkillsInput
            savingThrows: SavingThrowsInput
            weapons: [WeaponInput]
            equipment: [EquipmentInput]
            feats: [FeatInput]
            inventory: [ItemInput]
            spells: [SpellInput]
            biography: BiographyInput
            currency: CurrencyInput
        ): Character

        updateCharacter(
            id: ID!
            name: String
            class: String
            race: String
            level: Int
            maximumHealth: Int
            currentHealth: Int
            armorClass: Int
            attributes: AttributesInput
            skills: SkillsInput
            savingThrows: SavingThrowsInput
            weapons: [WeaponInput]
            equipment: [EquipmentInput]
            feats: [FeatInput]
            inventory: [ItemInput]
            spells: [SpellInput]
            biography: BiographyInput
            currency: CurrencyInput
        ): Character

        deleteCharacter(id: ID!): Character

        addCampaign(
            name: String!
            description: String
            members: [ID!]!
        ): Campaign

        updateCampaign(
            id: ID!
            name: String
            description: String
            members: [ID!]
        ): Campaign

        deleteCampaign(id: ID!): Campaign
    }

    input AttributesInput {
        strength: Int
        dexterity: Int
        constitution: Int
        intelligence: Int
        wisdom: Int
        charisma: Int
    }

    input SkillsInput {
        acrobatics: Int
        animalHandling: Int
        arcana: Int
        athletics: Int
        deception: Int
        history: Int
        insight: Int
        intimidation: Int
        investigation: Int
        medicine: Int
        nature: Int
        perception: Int
        performance: Int
        persuasion: Int
        religion: Int
        sleightOfHand: Int
        stealth: Int
        survival: Int
    }

    input SavingThrowsInput {
        strength: Int
        dexterity: Int
        constitution: Int
        intelligence: Int
        wisdom: Int
        charisma: Int
    }

    input WeaponInput {
        name: String
        desc: String
        damage: String
        damageType: String
        range: String
    }

    input EquipmentInput {
        name: String
        desc: String
    }

    input FeatInput {
        name: String
        desc: [String!]
    }

    input ItemInput {
        name: String
        desc: String
    }

    input SpellInput {
        name: String
        desc: [String!]
        level: Int
        damage: String
        range: String
    }

    input BiographyInput {
        alignment: String
        background: String
        languages: [String!]
    }

    input CurrencyInput {
        copperPieces: Int
        silverPieces: Int
        electrumPieces: Int
        goldPieces: Int
        platinumPieces: Int
    }

    type Auth {
        token: ID!
        user: User!
    }
`;

export default typeDefs;