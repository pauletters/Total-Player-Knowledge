const typeDefs = `
    type User {
        _id: ID!
        username: String!
        email: String!
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

    type Character {
        _id: ID!
        player: User!
        basicInfo: BasicInfo!
        attributes: Attributes!
        combat: Combat
        skills: Skills
        equipment: [String!]
        spells: [String!]
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
        addCharacter(input: AddCharacterInput!): Character
        updateCharacter(input: UpdateCharacterInput!): Character
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
        equipment: [String!]
        spells: [String!]
    }

    input UpdateCharacterInput {
        id: ID!
        basicInfo: BasicInfoInput
        attributes: AttributesInput
        combat: CombatInput
        skills: SkillsInput
        equipment: [String!]
        spells: [String!]
    }

    type Auth {
        token: ID!
        user: User!
    }
`;

export default typeDefs;