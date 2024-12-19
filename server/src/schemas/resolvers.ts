import User from '../models/User.js';
import Character from '../models/Character.js';
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
    }
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
    }
    savingThrows?: {
        strength: number;
        dexterity: number;
        constitution: number;
        intelligence: number;
        wisdom: number;
        charisma: number;    
    }
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
    feats?:{
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
    }
    currency?: {
        copperPieces: number;
        silverPieces: number;
        electrumPieces: number;
        goldPieces: number;
        platinumPieces: number;    
    }
}

interface UpdateCharacterArgs extends Partial<AddCharacterArgs> {
    id: string;
}

interface Context {
    user?: {
        _id: string;
        username: string;
        email: string;
    };
}

class UserInputError extends GraphQLError {
    constructor(message: string) {
      super(message, {
        extensions: {
          code: 'BAD_USER_INPUT',
        },
      });
    }
  }

 const resolvers = {
    Query: {
        me: async (_parent: unknown, _args: unknown, context: Context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')

                return userData;
            }
            throw new AuthenticationError('Not logged in');
        },
        characters: async (_parent: unknown, _args: unknown, context: Context) => {
            if (context.user) {
                const characters = await Character.find({ player: context.user._id });
                return characters;
            }
            throw new AuthenticationError('Not logged in');
        },
        character: async (_parent: unknown, {id}: {id: string}, context: Context) => {
            if (context.user) {
                const character = await Character.findById(id);
                if (!character) {
                    throw new GraphQLError('Character not found', {
                        extensions: { code: 'NOT_FOUND'},
                    });
                }
                return character;
            }
            throw new AuthenticationError('Not logged in');
        }
    },
    Mutation: {
        loginUser: async (_parent: unknown, { email, password }: LoginArgs) => {
            try{
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user.username, user.email, user._id);

            return { token, user };
        } catch (err) {
            if (err instanceof AuthenticationError) {
                throw err;
            }
            console.error('Error logging in user:', err);
            throw new GraphQLError('Error logging in user', {
                extensions: { code: 'INTERNAL_SERVER_ERROR' }
            });
        }
        },

        addUser: async (_parent: unknown, { username, email, password }: AddUserArgs) => {
            try {
                const existingUser = await User.findOne({
                    $or: [{ username }, { email }],
                });

                if (existingUser) {
                    if (existingUser.email === email) {
                    throw new UserInputError(
                           'This email is already in use'); 
                    }
                     throw new UserInputError('This username is already taken');
                    }

            const user = await User.create({ username, email, password });
            
            if (!user) {
                throw new GraphQLError('Failed to create user');
            }

            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        } catch (err) {
            console.error('Add user error:', err);

            if (err instanceof UserInputError || err instanceof GraphQLError) {
                throw err;
            }
            
            throw new GraphQLError('Error creating user', {
                extensions: { code: 'INTERNAL_SERVER_ERROR' }
            });
        }
    },
    addCharacter: async (_parent: unknown, args: AddCharacterArgs, context: Context) => {
        if (!context.user) {
            throw new AuthenticationError('Not logged in');
        }
        try {
            const newCharacter = await Character.create({
                ...args,
                player: context.user._id,
            });
            return newCharacter;
        } catch (err) {
            console.error('Error creating character', err);
            throw new GraphQLError('Error creating character', {
                extensions: { code: 'INTERNAL_SERVER_ERROR'},
            });
        }
    },
    updateCharacter: async (_parent: unknown, {id, ...updateData}: UpdateCharacterArgs, context: Context) => {
        if (!context.user) {
            throw new AuthenticationError('Not logged in');
        }
        try {
            const character = await Character.findOneAndUpdate(
                {_id: id, player: context.user._id},
                {$set: updateData},
                {new: true}
            );
            if (!character) {
                throw new GraphQLError ('Character not found or unauthorized', {
                    extensions: {code: 'NOT_FOUND'},
                });
            }
            return character;
        } catch (err) {
            console.error('Error updating character', err);
            throw new GraphQLError('Error updating character', {
                extensions: { code: 'INTERNAL_SERVER_ERROR'},
            });
        }
    },
    deleteCharacter: async (_parent: unknown, {id}: {id: string}, context: Context) => {
        if (!context.user) {
            throw new AuthenticationError('Not logged in');
        }
        try {
            const character = await Character.findOneAndDelete(
                {_id: id, player: context.user._id}
            );
            if (!character) {
                throw new GraphQLError ('Character not found or unauthorized', {
                    extensions: {code: 'NOT_FOUND'},
                });
            }
            return character;
        } catch (err) {
            console.error('Error deleting character', err);
            throw new GraphQLError('Error deleting character', {
                extensions: { code: 'INTERNAL_SERVER_ERROR'},
            });
        }
    }
  },
};

export default resolvers;