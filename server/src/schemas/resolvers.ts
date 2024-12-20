import User from '../models/User.js';
import Character from '../models/Character.js';
import Campaign from '../models/Campaign.js';
import { signToken, AuthenticationError } from '../utils/auth.js';
import { GraphQLError } from 'graphql';

interface AddUserArgs {
  username: string;
  email: string;
  password: string;
}

interface LoginArgs {
  email: string;
  password: string;
}

interface AddCharacterArgs {
  name: string;
  class: string;
  race: string;
  level: number;
  maximumHealth: number;
  currentHealth: number;
  armorClass: number;
  attributes?: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  skills?: {
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
  };
  savingThrows?: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  weapons?: {
    name: string;
    desc: string;
    damage: string;
    damageType: string;
    range: string;
  }[];
  equipment?: {
    name: string;
    desc: string;
  }[];
  feats?: {
    name: string;
    desc: string[];
  }[];
  inventory?: {
    name: string;
    desc: string;
  }[];
  spells?: {
    name: string;
    desc: string[];
    level: number;
    damage: any;
    range: string;
  }[];
  biography?: {
    alignment: string;
    background: string;
    languages: string[];
  };
  currency?: {
    copperPieces: number;
    silverPieces: number;
    electrumPieces: number;
    goldPieces: number;
    platinumPieces: number;
  };
}

interface UpdateCharacterArgs extends Partial<AddCharacterArgs> {
  id: string;
}

interface AddCampaignArgs {
  name: string;
  description?: string;
  members: string[]; // Character IDs
}

interface UpdateCampaignArgs {
  id: string;
  name?: string;
  description?: string;
  members?: string[];
}

interface Context {
  user?: {
    _id: string;
    username: string;
    email: string;
  };
}

const resolvers = {
  Query: {
    me: async (_parent: unknown, _args: unknown, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }
      const user = await User.findById(context.user._id).select('-__v -password');
      return user;
    },

    characters: async (_parent: unknown, _args: unknown, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }
      return Character.find({ player: context.user._id });
    },

    character: async (_parent: unknown, { id }: { id: string }, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }
      const character = await Character.findOne({ _id: id, player: context.user._id });
      if (!character) {
        throw new GraphQLError('Character not found or unauthorized', {
          extensions: { code: 'NOT_FOUND' },
        });
      }
      return character;
    },

    campaigns: async (_parent: unknown, _args: unknown, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }
      return Campaign.find({ createdBy: context.user._id });
    },

    campaign: async (_parent: unknown, { id }: { id: string }, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }
      const campaign = await Campaign.findOne({ _id: id, createdBy: context.user._id });
      if (!campaign) {
        throw new GraphQLError('Campaign not found or unauthorized', {
          extensions: { code: 'NOT_FOUND' },
        });
      }
      return campaign;
    },
  },

  Mutation: {
    loginUser: async (_parent: unknown, { email, password }: LoginArgs) => {
      const user = await User.findOne({ email });
      if (!user || !(await user.isCorrectPassword(password))) {
        throw new AuthenticationError('Incorrect credentials');
      }
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    addUser: async (_parent: unknown, { username, email, password }: AddUserArgs) => {
      if (await User.findOne({ $or: [{ username }, { email }] })) {
        throw new GraphQLError('Username or email already in use', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }
      const user = await User.create({ username, email, password });
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    addCharacter: async (_parent: unknown, args: AddCharacterArgs, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }
      return Character.create({ ...args, player: context.user._id });
    },

    updateCharacter: async (_parent: unknown, { id, ...updateData }: UpdateCharacterArgs, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }
      const character = await Character.findOneAndUpdate(
        { _id: id, player: context.user._id },
        { $set: updateData },
        { new: true }
      );
      if (!character) {
        throw new GraphQLError('Character not found or unauthorized', {
          extensions: { code: 'NOT_FOUND' },
        });
      }
      return character;
    },

    deleteCharacter: async (_parent: unknown, { id }: { id: string }, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }
      const character = await Character.findOneAndDelete({ _id: id, player: context.user._id });
      if (!character) {
        throw new GraphQLError('Character not found or unauthorized', {
          extensions: { code: 'NOT_FOUND' },
        });
      }
      return character;
    },

    addCampaign: async (_parent: unknown, { name, description, members }: AddCampaignArgs, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }
      return Campaign.create({
        name,
        description,
        members,
        createdBy: context.user._id,
      });
    },

    updateCampaign: async (
      _parent: unknown,
      { id, name, description, members }: UpdateCampaignArgs,
      context: Context
    ) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }
      const campaign = await Campaign.findOneAndUpdate(
        { _id: id, createdBy: context.user._id },
        { $set: { name, description, members } },
        { new: true }
      );
      if (!campaign) {
        throw new GraphQLError('Campaign not found or unauthorized', {
          extensions: { code: 'NOT_FOUND' },
        });
      }
      return campaign;
    },

    deleteCampaign: async (_parent: unknown, { id }: { id: string }, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }
      const campaign = await Campaign.findOneAndDelete({ _id: id, createdBy: context.user._id });
      if (!campaign) {
        throw new GraphQLError('Campaign not found or unauthorized', {
          extensions: { code: 'NOT_FOUND' },
        });
      }
      return campaign;
    },
  },

  Campaign: {
    playerCount: (parent: any) => parent.members.length,
  },
};

export default resolvers;
