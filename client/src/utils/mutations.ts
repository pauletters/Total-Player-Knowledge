import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation loginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const ADD_CHARACTER = gql`
  mutation AddCharacter($input: AddCharacterInput!) {
    addCharacter(input: $input) {
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
      spells
    }
  }
`;
