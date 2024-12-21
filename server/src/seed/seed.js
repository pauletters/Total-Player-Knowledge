import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Character from '../models/Character.js';
import Campaign from '../models/Campaign.js';

// Load environment variables
dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/TPK';
console.log('MONGODB_URI:', mongoUri);

const seedDatabase = async () => {
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Database connected!');

    // Clear existing data, but preserve users whose username starts with '@'
    await User.deleteMany({ username: { $not: /^@/ } }); // This keeps users whose username starts with '@'
    await Character.deleteMany({});
    await Campaign.deleteMany({});
    console.log('Existing data cleared except users starting with "@"!');

    // Create users and characters
    const users = [];
    const characters = [];

    for (let i = 1; i <= 10; i++) {
      // Create a user
      const user = await User.create({
        username: `TestUser${i}`,
        email: `testuser${i}@example.com`,
        password: 'password123',
      });
      users.push(user);

      // Create 2 characters for each user
      const char1 = await Character.create({
        player: user._id,
        name: `Test${i}Char1`,
        class: 'Fighter',
        race: 'Human',
        level: 5,
        maximumHealth: 50,
        currentHealth: 50,
        armorClass: 16,
        attributes: { strength: 15, dexterity: 12, constitution: 14, intelligence: 10, wisdom: 10, charisma: 8 },
        skills: { athletics: 3, perception: 2, intimidation: 2 },
        biography: { alignment: 'Neutral Good', background: 'Soldier', languages: ['Common'] },
        currency: { goldPieces: 30, silverPieces: 15 },
      });
      const char2 = await Character.create({
        player: user._id,
        name: `Test${i}Char2`,
        class: 'Wizard',
        race: 'Elf',
        level: 4,
        maximumHealth: 30,
        currentHealth: 30,
        armorClass: 14,
        attributes: { strength: 8, dexterity: 14, constitution: 10, intelligence: 18, wisdom: 12, charisma: 10 },
        skills: { arcana: 4, investigation: 3, perception: 2 },
        biography: { alignment: 'Chaotic Good', background: 'Sage', languages: ['Common', 'Elvish'] },
        currency: { goldPieces: 50, silverPieces: 25 },
      });

      characters.push(char1, char2);
      user.characters.push(char1._id, char2._id);
      await user.save(); // Save user with populated characters
    }

    console.log(`Users created: ${users.length}`);
    console.log(`Characters created: ${characters.length}`);

    // Create campaigns
    const campaign1Players = characters.slice(0, 5).map((char) => char._id); // Characters from TestUsers 1-5
    const campaign2Players = characters.slice(5, 10).map((char) => char._id); // Characters from TestUsers 6-10

    const campaign1 = await Campaign.create({
      name: 'Campaign One',
      description: 'Adventure with TestUsers1-5.',
      players: campaign1Players,
      milestones: ['Started the quest', 'Reached the first dungeon'],
      createdBy: users[0]._id, // TestUser1
    });

    const campaign2 = await Campaign.create({
      name: 'Campaign Two',
      description: 'Adventure with TestUsers6-10.',
      players: campaign2Players,
      milestones: ['Gathered the party', 'Slayed the dragon'],
      createdBy: users[5]._id, // TestUser6
    });

    // Add campaigns to relevant users
    const linkCampaignsToUsers = async (campaign, playerIds) => {
      for (const playerId of playerIds) {
        const character = characters.find((char) => char._id.equals(playerId));
        if (character) {
          const user = users.find((u) => u._id.equals(character.player));
          if (user && !user.campaigns.includes(campaign._id)) {
            user.campaigns.push(campaign._id);
            await user.save(); // Save user with campaign reference
          }
        }
      }
    };

    await linkCampaignsToUsers(campaign1, campaign1Players);
    await linkCampaignsToUsers(campaign2, campaign2Players);

    console.log('Campaigns created:', [campaign1, campaign2]);

    // Disconnect from the database
    await mongoose.disconnect();
    console.log('Database seeded and disconnected!');
  } catch (error) {
    console.error('Error seeding the database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
