import User from '../models/User.js';
import Character from '../models/Character.js';
import Campaign from '../models/Campaign.js';
import { signToken, AuthenticationError } from '../utils/auth.js';
import { GraphQLError } from 'graphql';

// Interfaces
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
  equipment?: string[];
  spells: CharacterSpell[];
  private?: boolean;
}

interface UpdateCharacterArgs extends Partial<AddCharacterArgs> {
  id: string;
}

interface AddCampaignArgs {
  name: string;
  description?: string;
  players: string[];
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

interface CharacterSpell {
  name: string;
  level: number;
  prepared: boolean;
}

interface SpellInput {
  name: string;
  level: number;
  prepared: boolean;
}

interface UpdateSpellsArgs {
  id: string;
  spells: SpellInput[];
}

// Resolvers
const resolvers = {
  Query: {
    me: async (_parent: unknown, _args: unknown, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }
      return User.findById(context.user._id).populate('characters campaigns').exec();
    },

    characters: async (_parent: unknown, _args: unknown, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }
      return Character.find({ player: context.user._id }).exec();
    },

    campaign: async (_parent: unknown, { id }: { id: string }, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }
      return Campaign.findById(id)
        .populate({
          path: 'players',
          populate: {
            path: 'player',
            select: 'username',
          },
        })
        .populate('createdBy', 'username')
        .exec();
    },

    campaigns: async (_parent: unknown, _args: unknown, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }

      const userCharacters = await Character.find({ player: context.user._id }).select('_id').exec();
      return Campaign.find({
        $or: [
          { createdBy: context.user._id },
          { players: { $in: userCharacters.map((char) => char._id) } },
        ],
      })
        .populate({
          path: 'players',
          populate: {
            path: 'player',
            select: 'username',
          },
        })
        .populate('createdBy', 'username')
        .exec();
    },
  },

  Mutation: {
    loginUser: async (_parent: unknown, { email, password }: LoginArgs) => {
      const user = await User.findOne({ email }).exec();
      if (!user || !(await user.isCorrectPassword(password))) {
        throw new AuthenticationError('Incorrect credentials');
      }
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    addUser: async (_parent: unknown, { username, email, password }: AddUserArgs) => {
      if (await User.findOne({ $or: [{ username }, { email }] }).exec()) {
        throw new GraphQLError('Username or email already in use', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }
      const user = await User.create({ username, email, password });
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    addCampaign: async (_parent: unknown, { name, description, players }: AddCampaignArgs, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }

      const validCharacters = await Character.find({ _id: { $in: players } }).exec();
      if (validCharacters.length !== players.length) {
        throw new GraphQLError('Some character IDs are invalid', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      let newCampaign = await Campaign.create({
        name,
        description,
        players,
        createdBy: context.user._id,
      });

      await User.findByIdAndUpdate(
        context.user._id,
        { $push: { campaigns: newCampaign._id } },
        { new: true }
      ).exec();

      const playerOwners = await Character.find({ _id: { $in: players } }).distinct('player').exec();
      await User.updateMany(
        { _id: { $in: playerOwners } },
        { $push: { campaigns: newCampaign._id } },
        { new: true }
      ).exec();

      return Campaign.findById(newCampaign._id)
        .populate({
          path: 'players',
          populate: {
            path: 'player',
            select: 'username',
          },
        })
        .populate('createdBy', 'username')
        .exec();
    },
  },
};

export default resolvers;
