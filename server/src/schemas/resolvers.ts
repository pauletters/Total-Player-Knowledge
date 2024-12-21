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
  basicInfo: {
    name: string;
    race: string;
    class: string;
    level: number;
    background?: string;
    alignment?: string;
  };
  attributes: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  combat?: {
    armorClass: number;
    hitPoints: number;
    initiative: number;
    speed: number;
  };
  skills?: {
    proficiencies: string[];
    savingThrows: string[];
  };
  equipment?: any[];
  spells?: any[];
}

interface UpdateCharacterArgs extends Partial<AddCharacterArgs> {
  id: string;
}

interface AddCampaignArgs {
  name: string;
  description?: string;
  players: string[]; // Character IDs
}

interface UpdateCampaignArgs {
  id: string;
  name?: string;
  description?: string;
  players?: string[];
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

      // Find all character IDs associated with the signed-in user
      const userCharacters = await Character.find({ player: context.user._id }).select('_id');

      // Return campaigns where the user is the creator OR their characters are in the players array
      return Campaign.find({
        $or: [
          { createdBy: context.user._id },
          { players: { $in: userCharacters.map((char) => char._id) } },
        ],
      }).populate('players createdBy');
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

    searchUsers: async (_parent: unknown, { term }: { term: string }, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }

      if (!term || term.trim() === '') {
        return [];
      }

      return User.find({
        username: { $regex: term, $options: 'i' }, // Case-insensitive regex search
      })
        .populate('characters') // Populate characters for the users
        .select('-password -__v'); // Exclude sensitive fields like password
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

    addCharacter: async (_parent: unknown, { input }: {input: AddCharacterArgs}, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }
      return Character.create({ ...input, player: context.user._id });
    },

    updateCharacter: async (_parent: unknown, { input }: {input: UpdateCharacterArgs}, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }
      const character = await Character.findOneAndUpdate(
        { _id: input.id, player: context.user._id },
        { $set: input },
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

    addCampaign: async (_parent: unknown, { name, description, players }: AddCampaignArgs, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }

      // Validate players' character IDs
      const validCharacters = await Character.find({ _id: { $in: players } });
      if (validCharacters.length !== players.length) {
        throw new GraphQLError('Some character IDs are invalid', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      // Create the campaign
      const newCampaign = await Campaign.create({
        name,
        description,
        players,
        createdBy: context.user._id,
      });

      // Add the campaign to the creator's campaigns array
      await User.findByIdAndUpdate(
        context.user._id,
        { $push: { campaigns: newCampaign._id } },
        { new: true }
      );

      // Optionally, update other users who own the characters in the campaign
      const playerOwners = await Character.find({ _id: { $in: players } }).distinct('player');
      await User.updateMany(
        { _id: { $in: playerOwners } },
        { $push: { campaigns: newCampaign._id } },
        { new: true }
      );

      return newCampaign.populate('players createdBy'); // Populate references for the response
    },

    updateCampaign: async (
      _parent: unknown,
      { id, name, description, players }: UpdateCampaignArgs,
      context: Context
    ) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }
      const campaign = await Campaign.findOneAndUpdate(
        { _id: id, createdBy: context.user._id },
        { $set: { name, description, players } },
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

      // Remove the campaign from all users' campaigns arrays
      await User.updateMany(
        { campaigns: campaign._id },
        { $pull: { campaigns: campaign._id } }
      );

      return campaign;
    },
  },

  Campaign: {
    playerCount: (parent: any) => parent.players.length,
  },
};

export default resolvers;
