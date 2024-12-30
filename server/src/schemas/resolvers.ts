import User from '../models/User.js';
import Character from '../models/Character.js';
import { ISpell } from '../models/Character.js';
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
  private?: boolean; // Optional field
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
      return User.findById(context.user._id)
        .populate('characters campaigns')
        .exec();
    },

    characters: async (_parent: unknown, _args: unknown, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }
      return Character.find({ player: context.user._id }).exec();
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

      const userCharacters = await Character.find({ player: context.user._id }).select('_id').exec();
      return Campaign.find({
        $or: [
          { createdBy: context.user._id },
          { players: { $in: userCharacters.map((char) => char._id) } },
        ],
      })
        .populate({
          path: 'players',
          populate: { path: 'player', select: 'username' },
        })
        .populate('createdBy', 'username')
        .exec();
    },

    campaign: async (_parent: unknown, { id }: { id: string }, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }
      return Campaign.findById(id)
        .populate({
          path: 'players',
          populate: { path: 'player', select: 'username' },
        })
        .populate('createdBy', 'username')
        .exec();
    },

    searchUsers: async (_parent: unknown, { term }: { term: string }, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }

      const users = await User.find({
        username: { $regex: term, $options: 'i' },
      })
        .populate({ path: 'characters', select: 'basicInfo.name private' })
        .select('-password -__v');

      return users;
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

    addCharacter: async (_parent: unknown, { input }: { input: AddCharacterArgs }, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }

      const newCharacter = await Character.create({
        ...input,
        player: context.user._id,
        private: input.private ?? true, // Default to true if not provided
      });

      await User.findByIdAndUpdate(
        context.user._id,
        { $push: { characters: newCharacter._id } },
        { new: true }
      );

      return newCharacter;
    },

    updateCharacter: async (_parent: unknown, { input }: { input: UpdateCharacterArgs }, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }
      const updatedCharacter = await Character.findOneAndUpdate(
        { _id: input.id, player: context.user._id },
        { $set: input },
        { new: true }
      ).exec();

      if (!updatedCharacter) {
        throw new GraphQLError('Character not found or unauthorized', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      return updatedCharacter;
    },

    updateCharacterEquipment: async (
      _parent: unknown,
      { id, equipment }: { id: string; equipment: any[] },
      context: Context
    ) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }

      const character = await Character.findOneAndUpdate(
        { _id: id, player: context.user._id },
        {
          $set: {
            equipment: equipment.map((item) => ({
              name: item.name,
              category: item.category,
              cost: item.cost,
              weight: item.weight,
              desc: item.desc || [],
              properties: item.properties || [],
            })),
          },
        },
        { new: true, runValidators: true }
      ).populate('player', 'username email');

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
      const character = await Character.findOneAndDelete({ _id: id, player: context.user._id }).exec();

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

      const validCharacters = await Character.find({ _id: { $in: players } }).exec();
      if (validCharacters.length !== players.length) {
        throw new GraphQLError('Some character IDs are invalid', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      const newCampaign = await Campaign.create({
        name,
        description,
        players,
        createdBy: context.user._id,
      });

      await User.findByIdAndUpdate(
        context.user._id,
        { $push: { campaigns: newCampaign._id } },
        { new: true }
      );

      return Campaign.findById(newCampaign._id)
        .populate({
          path: 'players',
          populate: { path: 'player', select: 'username' },
        })
        .populate('createdBy', 'username')
        .exec();
    },

    updateCampaign: async (_parent: unknown, { id, name, description, players }: UpdateCampaignArgs, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }

      const updatedCampaign = await Campaign.findOneAndUpdate(
        { _id: id, createdBy: context.user._id },
        { $set: { name, description, players } },
        { new: true }
      );

      if (!updatedCampaign) {
        throw new GraphQLError('Campaign not found or unauthorized', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      return updatedCampaign;
    },

    deleteCampaign: async (_parent: unknown, { id }: { id: string }, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }

      const deletedCampaign = await Campaign.findOneAndDelete({ _id: id, createdBy: context.user._id }).exec();

      if (deletedCampaign) {
        await User.updateMany(
          { campaigns: deletedCampaign._id },
          { $pull: { campaigns: deletedCampaign._id } }
        );
      }

      return deletedCampaign;
    },
  },

  Campaign: {
    playerCount: (parent: any) => parent.players.length,
  },
};

export default resolvers;
