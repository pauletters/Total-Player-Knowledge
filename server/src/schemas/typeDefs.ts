const typeDefs = `
    type User {
        _id: ID!
        username: String!
        email: String!
        characters: [Character!]!
        campaigns: [Campaign!]!
    }

    type BasicInfo {
        name: String!
        race: String!
        class: String!
        level: Int!
        background: String
        alignment: String
    }

    type Attributes {
        strength: Int!
        dexterity: Int!
        constitution: Int!
        intelligence: Int!
        wisdom: Int!
        charisma: Int!
    }

    type Combat {
        armorClass: Int!
        hitPoints: Int!
        initiative: Int!
        speed: Int!
    }

    type Skills {
        proficiencies: [String!]!
        savingThrows: [String!]!
    }

    type Spell {
        name: String!
        level: Int!
        prepared: Boolean!
    }

    type Cost {
        quantity: Float!
        unit: String!
    }

    type Equipment {
        name: String!
        category: String!
        cost: Cost
        weight: Float
        description: [String!]
        properties: [String!]
    }

    type Character {
        _id: ID!
        player: User!
        basicInfo: BasicInfo!
        attributes: Attributes!
        combat: Combat
        skills: Skills
        equipment: [Equipment!]
        spells: [Spell!]!
        private: Boolean!
        createdAt: String!
        updatedAt: String!
    }

    type Campaign {
        _id: ID!
        name: String!
        description: String
        players: [Character!]!
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
        campaigns(private: Boolean): [Campaign!]!
        campaign(id: ID!, includePrivate: Boolean = false): Campaign
        searchUsers(term: String!): [User!]!
    }

    type Mutation {
        loginUser(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        addCharacter(input: AddCharacterInput!): Character
        updateCharacter(input: UpdateCharacterInput!): Character
        updateCharacterSpells(id: ID!, spells: [SpellInput]!): Character!
        updateCharacterEquipment(id: ID!, equipment: [EquipmentInput!]!): Character!
        toggleSpellPrepared(id: ID!, spellName: String!): Character!
        deleteCharacter(id: ID!): Character

        addCampaign(
            name: String!
            description: String
            players: [ID!]!
        ): Campaign

        updateCampaign(
            id: ID!
            name: String
            description: String
            players: [ID!]
        ): Campaign

        deleteCampaign(id: ID!): Campaign
    }

    input BasicInfoInput {
        name: String!
        race: String!
        class: String!
        level: Int!
        background: String
        alignment: String
    }

    input AttributesInput {
        strength: Int!
        dexterity: Int!
        constitution: Int!
        intelligence: Int!
        wisdom: Int!
        charisma: Int!
    }

    input CombatInput {
        armorClass: Int!
        hitPoints: Int!
        initiative: Int!
        speed: Int!
    }

    input SkillsInput {
        proficiencies: [String!]!
        savingThrows: [String!]!
    }

    input AddCharacterInput {
        basicInfo: BasicInfoInput!
        attributes: AttributesInput!
        combat: CombatInput
        skills: SkillsInput
        equipment: [EquipmentInput!]!
        spells: [SpellInput!]
        private: Boolean
    }

    input UpdateCharacterInput {
        id: ID!
        basicInfo: BasicInfoInput
        attributes: AttributesInput
        combat: CombatInput
        skills: SkillsInput
        equipment: [EquipmentInput!]!
        spells: [SpellInput!]
        private: Boolean
    }

    input SpellInput {
        name: String!
        level: Int!
        prepared: Boolean!
    }


    type Cost {
        quantity: Float!
        unit: String!
    }

    type Equipment {
        name: String!
        category: String!
        cost: Cost
        weight: Float
        description: [String!]
        properties: [String!]
    }


    input CostInput {
        quantity: Float!
        unit: String!
    }

    input EquipmentInput {
        name: String!
        category: String!
        cost: CostInput
        weight: Float
        description: [String!]
        properties: [String!]
    }

    type Auth {
        token: ID!
        user: User!
    }
`;

export default typeDefs;
