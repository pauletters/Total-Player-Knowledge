import User from '../models/User.js';
import Character from '../models/Character.js';
import { ISpell } from '../models/Character.js';
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
  equipment?: string[];
  spells: CharacterSpell[];
  private?: boolean; // New optional field
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

const resolvers = {
  Query: {
    me: async (_parent: unknown, _args: unknown, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }
      return User.findById(context.user._id).populate('characters campaigns');
    },

    characters: async (_parent: unknown, _args: unknown, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }
      const characters = await Character.find({ player: context.user._id });
      return characters;
    },

    character: async (_parent: unknown, { id }: { id: string }, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }
      return Character.findOne({ _id: id, player: context.user._id });
    },

    campaigns: async (_parent: unknown, _args: unknown, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }

      const userCharacters = await Character.find({ player: context.user._id }).select('_id');
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
        .populate('createdBy', 'username');
    },

    campaign: async (_parent: unknown, { id }: { id: string }, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }
      return Campaign.findById(id)
        .populate({
          path: 'players',
          match: { private: false }, // Include only public characters
          populate: {
            path: 'player',
            select: 'username',
          },
        })
        .populate('createdBy', 'username');
    },

    searchUsers: async (_parent: unknown, { term }: { term: string }, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }

      const users = await User.find({
        username: { $regex: term, $options: 'i' },
      })
        .populate({
          path: 'characters',
          select: 'basicInfo.name private',
        })
        .select('-password -__v');

      console.log('Search results:', users);
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
      return Character.findOneAndUpdate(
        { _id: input.id, player: context.user._id },
        { $set: input },
        { new: true }
      );
    },

    updateCharacterSpells: async (
      _parent: unknown,
      { id, spells }: UpdateSpellsArgs,
      context: Context
    ) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }

      const character = await Character.findOneAndUpdate(
        { _id: id, player: context.user._id },
        { $set: { spells } },
        { new: true }
      ).lean();

      if (!character) {
        throw new GraphQLError('Character not found or unauthorized', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      return character;
    },

    toggleSpellPrepared: async (
      _parent: unknown,
      { id, spellName }: { id: string; spellName: string },
      context: Context
    ) => {
      console.log('1. Starting toggleSpellPrepared:', { id, spellName });
    
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }
    
      try {
        console.log('2. Finding character...');
        const character = await Character.findOne({ 
          _id: id, 
          player: context.user._id 
        });
    
        if (!character) {
          throw new GraphQLError('Character not found', {
            extensions: { code: 'NOT_FOUND' },
          });
        }
    
        console.log('3. Character found:', character._id);
        console.log('4. Current spells:', character.spells);
    
        // Find the spell
        const spellToUpdate = character.spells.find(spell => spell.name === spellName);
        if (!spellToUpdate) {
          throw new GraphQLError('Spell not found', {
            extensions: { code: 'NOT_FOUND' },
          });
        }
    
        console.log('5. Found spell to update:', spellToUpdate);
        console.log('6. Current prepared status:', spellToUpdate.prepared);
    
        // Update the spell's prepared status directly
        spellToUpdate.prepared = !spellToUpdate.prepared;
        console.log('7. New prepared status:', spellToUpdate.prepared);
    
        // Save the character
        console.log('8. Saving character...');
        await character.save();
        console.log('9. Character saved successfully');
    
        // Return the updated character
        const updatedCharacter = await Character.findById(id);
        console.log('10. Final character state:', updatedCharacter);
        return updatedCharacter;
    
      } catch (error) {
        console.error('ERROR in toggleSpellPrepared:', error);
        throw new GraphQLError('Error updating spell', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },

    deleteCharacter: async (_parent: unknown, { id }: { id: string }, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }
      return Character.findOneAndDelete({ _id: id, player: context.user._id });
    },

    addCampaign: async (_parent: unknown, { name, description, players }: AddCampaignArgs, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }

      const validCharacters = await Character.find({ _id: { $in: players } });
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
      );

      const playerOwners = await Character.find({ _id: { $in: players } }).distinct('player');
      await User.updateMany(
        { _id: { $in: playerOwners } },
        { $push: { campaigns: newCampaign._id } },
        { new: true }
      );

      newCampaign = await (await newCampaign
        .populate({
          path: 'players',
          populate: {
            path: 'player',
            select: 'username',
          },
        }))
        .populate('createdBy', 'username');

      return newCampaign;
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
        throw new GraphQLError('Campaign not found', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      return (await updatedCampaign
        .populate({
          path: 'players',
          populate: {
            path: 'player',
            select: 'username',
          },
        }))
        .populate('createdBy', 'username');
    },

    deleteCampaign: async (_parent: unknown, { id }: { id: string }, context: Context) => {
      if (!context.user) {
        throw new AuthenticationError('Not logged in');
      }
      const campaign = await Campaign.findOneAndDelete({ _id: id, createdBy: context.user._id });

      if (campaign) {
        await User.updateMany(
          { campaigns: campaign._id },
          { $pull: { campaigns: campaign._id } }
        );
      }

      return campaign;
    },
  },

  Campaign: {
    playerCount: (parent: any) => parent.players.length,
  },
};

export default resolvers;
