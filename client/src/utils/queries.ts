import { gql } from '@apollo/client';

export const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
    }
  }
`;

export const GET_CHARACTERS = gql`
  query GetCharacters {
    characters {
      _id
      basicInfo {
        name
        class
        level
      }
    }
  }
`;

export const GET_CHARACTER = gql`
  query GetCharacter($id: ID!) {
    character(id: $id) {
      _id
      basicInfo {
        name
        class
        race
        level
        background
        alignment
      }
      attributes {
        strength
        dexterity
        constitution
        intelligence
        wisdom
        charisma
      }
      combat {
        armorClass
        hitPoints
        initiative
        speed
      }
      skills {
        proficiencies
        savingThrows
      }
      equipment
      spells {
        name
        level
        prepared
      }
    }
  }
`;