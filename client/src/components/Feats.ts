export interface FeatPrerequisite {
    ability?: string[];
    race?: string[];
    other?: string[];
  }
  
  export interface Feat {
    name: string;
    description: string;
    prerequisites?: FeatPrerequisite;
    benefits: string[];
  }
  
  export const feats: Feat[] = [
    {
      name: "Alert",
      description: "Always on the lookout for danger, you gain the following benefits:",
      benefits: [
        "+5 bonus to initiative",
        "Can't be surprised while you are conscious",
        "Other creatures don't gain advantage on attack rolls against you as a result of being hidden from you"
      ]
    },
    {
      name: "Athlete",
      description: "You have undergone extensive physical training to gain the following benefits:",
      prerequisites: {
        ability: ["Strength 13 or Dexterity 13"]
      },
      benefits: [
        "Increase your Strength or Dexterity score by 1, to a maximum of 20",
        "When you are prone, standing up uses only 5 feet of your movement",
        "Climbing doesn't halve your speed",
        "You can make a running long jump or a running high jump after moving only 5 feet on foot, rather than 10 feet"
      ]
    },
    {
      name: "Actor",
      description: "Skilled at mimicry and dramatics, you gain the following benefits:",
      benefits: [
        "Increase your Charisma score by 1, to a maximum of 20",
        "You have advantage on Charisma (Deception) and Charisma (Performance) checks when trying to pass yourself off as a different person",
        "You can mimic the speech of another person or the sounds made by other creatures that you have heard for at least 1 minute"
      ]
    },
    {
      name: "Charger",
      description: "When you use your action to Dash, you can use a bonus action to make one melee weapon attack or to shove a creature.",
      benefits: [
        "If you move at least 10 feet in a straight line immediately before taking this bonus action, you either gain a +5 bonus to the attack's damage roll (if you chose to make a melee attack and hit) or push the target up to 10 feet away from you (if you chose to shove)"
      ]
    },
    {
      name: "Crossbow Expert",
      description: "Thanks to extensive practice with crossbows, you gain the following benefits:",
      benefits: [
        "You ignore the loading quality of crossbows with which you are proficient",
        "Being within 5 feet of a hostile creature doesn't impose disadvantage on your ranged attack rolls",
        "When you use the Attack action and attack with a one-handed weapon, you can use a bonus action to attack with a loaded hand crossbow you are holding"
      ]
    },
    {
      name: "Defensive Duelist",
      description: "When you are wielding a finesse weapon with which you are proficient and another creature hits you with a melee attack, you can use your reaction to add your proficiency bonus to your AC for that attack, potentially causing the attack to miss you.",
      prerequisites: {
        ability: ["Dexterity 13"]
      },
      benefits: [
        "Add proficiency bonus to AC as reaction against one melee attack while wielding a finesse weapon"
      ]
    },
    {
      name: "Dual Wielder",
      description: "You master fighting with two weapons, gaining the following benefits:",
      benefits: [
        "+1 bonus to AC while wielding a separate melee weapon in each hand",
        "You can use two-weapon fighting even when the one-handed melee weapons you are wielding aren't light",
        "You can draw or stow two one-handed weapons when you would normally be able to draw or stow only one"
      ]
    },
    {
      name: "Dungeon Delver",
      description: "Alert to the hidden traps and secret doors found in many dungeons, you gain the following benefits:",
      benefits: [
        "Advantage on Wisdom (Perception) and Intelligence (Investigation) checks made to detect the presence of secret doors",
        "Advantage on saving throws made to avoid or resist traps",
        "Resistance to damage dealt by traps",
        "You can search for traps while traveling at a normal pace, instead of only at a slow pace"
      ]
    },
    {
      name: "Durable",
      description: "Hardy and resilient, you gain the following benefits:",
      benefits: [
        "Increase your Constitution score by 1, to a maximum of 20",
        "When you roll a Hit Die to regain hit points, the minimum number of hit points you regain from the roll equals twice your Constitution modifier (minimum of 2)"
      ]
    },
    {
      name: "Elemental Adept",
      description: "When you cast a spell that deals damage of the chosen type, you can treat any 1 on a damage die as a 2.",
      prerequisites: {
        ability: ["Spellcasting ability"],
        other: ["The ability to cast at least one spell"]
      },
      benefits: [
        "Spells you cast ignore resistance to damage of the chosen type",
        "When you roll damage for a spell you cast that deals damage of that type, you can treat any 1 on a damage die as a 2"
      ]
    },
    {
      name: "Grappler",
      description: "You've developed the skills necessary to hold your own in close-quarters grappling.",
      prerequisites: {
        ability: ["Strength 13"]
      },
      benefits: [
        "You have advantage on attack rolls against a creature you are grappling",
        "You can use your action to try to pin a creature grappled by you. To do so, make another grapple check. If you succeed, you and the creature are both restrained until the grapple ends"
      ]
    },
    {
      name: "Great Weapon Master",
      description: "You've learned to put the weight of a weapon to your advantage, letting its momentum empower your strikes.",
      benefits: [
        "On your turn, when you score a critical hit with a melee weapon or reduce a creature to 0 hit points with one, you can make one melee weapon attack as a bonus action",
        "Before you make a melee attack with a heavy weapon that you are proficient with, you can choose to take a -5 penalty to the attack roll. If the attack hits, you add +10 to the attack's damage"
      ]
    },
    {
      name: "Healer",
      description: "You are an able physician, allowing you to mend wounds quickly and get your allies back in the fight.",
      benefits: [
        "When you use a healer's kit to stabilize a dying creature, that creature also regains 1 hit point",
        "As an action, you can spend one use of a healer's kit to tend to a creature and restore 1d6 + 4 hit points to it, plus additional hit points equal to the creature's maximum number of Hit Dice. The creature can't regain hit points from this feat again until it finishes a short or long rest"
      ]
    },
    {
      name: "Heavily Armored",
      description: "You have trained to master the use of heavy armor, gaining the following benefits:",
      prerequisites: {
        other: ["Proficiency with medium armor"]
      },
      benefits: [
        "Increase your Strength score by 1, to a maximum of 20",
        "You gain proficiency with heavy armor"
      ]
    },
    {
      name: "Heavy Armor Master",
      description: "You can use your armor to deflect strikes that would kill others.",
      prerequisites: {
        other: ["Proficiency with heavy armor"]
      },
      benefits: [
        "Increase your Strength score by 1, to a maximum of 20",
        "While you are wearing heavy armor, bludgeoning, piercing, and slashing damage that you take from nonmagical weapons is reduced by 3"
      ]
    },
    {
      name: "Inspiring Leader",
      description: "You can spend 10 minutes inspiring your companions, shoring up their resolve to fight.",
      prerequisites: {
        ability: ["Charisma 13"]
      },
      benefits: [
        "Up to six friendly creatures who can see or hear you can gain temporary hit points equal to your level + your Charisma modifier"
      ]
    },
    {
      name: "Keen Mind",
      description: "You have a mind that can track time, direction, and detail with uncanny precision.",
      benefits: [
        "Increase your Intelligence score by 1, to a maximum of 20",
        "You always know which way is north",
        "You always know the number of hours left before the next sunrise or sunset",
        "You can accurately recall anything you have seen or heard within the past month"
      ]
    },
    {
      name: "Lightly Armored",
      description: "You have trained to master the use of light armor, gaining the following benefits:",
      benefits: [
        "Increase your Strength or Dexterity score by 1, to a maximum of 20",
        "You gain proficiency with light armor"
      ]
    },
    {
      name: "Linguist",
      description: "You have studied languages and codes, gaining the following benefits:",
      benefits: [
        "Increase your Intelligence score by 1, to a maximum of 20",
        "You learn three languages of your choice",
        "You can ably create written ciphers. Others can't decipher a code you create unless you teach them, they succeed on an Intelligence check (DC equal to your Intelligence score + your proficiency bonus), or they use magic to decipher it"
      ]
    },
    {
      name: "Lucky",
      description: "You have inexplicable luck that seems to kick in at just the right moment.",
      benefits: [
        "You have 3 luck points. Whenever you make an attack roll, ability check, or saving throw, you may spend 1 luck point to roll an additional d20",
        "You can use this ability after the original roll, but before the outcome is revealed",
        "You choose which of the d20s is used for the attack roll, ability check, or saving throw",
        "You can also spend one luck point when an attack roll is made against you. Roll a d20, and choose whether the attacker's roll uses their d20 roll or yours",
        "Any expended luck points are regained when you finish a long rest"
      ]
    },
    {
      name: "Mage Slayer",
      description: "You have practiced techniques useful in melee combat against spellcasters.",
      benefits: [
        "When a creature within 5 feet of you casts a spell, you can use your reaction to make a melee weapon attack against that creature",
        "When you damage a creature that is concentrating on a spell, that creature has disadvantage on the saving throw it makes to maintain its concentration",
        "You have advantage on saving throws against spells cast by creatures within 5 feet of you"
      ]
    },
    {
      name: "Magic Initiate",
      description: "Choose a class: bard, cleric, druid, sorcerer, warlock, or wizard. You learn two cantrips of your choice from that class's spell list and one 1st-level spell from that same list.",
      benefits: [
        "Learn 2 cantrips from chosen class spell list",
        "Learn 1 1st-level spell from chosen class spell list",
        "You can cast the 1st-level spell once per long rest at its lowest level. If the class you chose was one that has spellcasting ability, you use that ability for these spells"
      ]
    },
    {
      name: "Martial Adept",
      description: "You have martial training that allows you to perform special combat maneuvers.",
      benefits: [
        "You learn two maneuvers of your choice from among those available to the Battle Master archetype in the fighter class",
        "If a maneuver you use requires your target to make a saving throw to resist the maneuver's effects, the saving throw DC equals 8 + your proficiency bonus + your Strength or Dexterity modifier (your choice)",
        "You gain one superiority die, which is a d6 (this die is added to any superiority dice you have from another source). This die is used to fuel your maneuvers. A superiority die is expended when you use it. You regain your expended superiority dice when you finish a short or long rest"
      ]
    },
    {
      name: "Medium Armor Master",
      description: "You have practiced moving in medium armor to gain the following benefits:",
      prerequisites: {
        other: ["Proficiency with medium armor"]
      },
      benefits: [
        "Wearing medium armor doesn't impose disadvantage on your Dexterity (Stealth) checks",
        "When you wear medium armor, you can add 3, rather than 2, to your AC if you have a Dexterity of 16 or higher"
      ]
    },
    {
      name: "Mobile",
      description: "You are exceptionally speedy and agile.",
      benefits: [
        "Your speed increases by 10 feet",
        "When you use the Dash action, difficult terrain doesn't cost you extra movement on that turn",
        "When you make a melee attack against a creature, you don't provoke opportunity attacks from that creature for the rest of the turn, whether you hit or not"
      ]
    },
    {
      name: "Mounted Combatant",
      description: "You are a dangerous foe to face while mounted.",
      benefits: [
        "You have advantage on melee attack rolls against any unmounted creature that is smaller than your mount",
        "You can force an attack targeted at your mount to target you instead",
        "If your mount is subjected to an effect that allows it to make a Dexterity saving throw to take only half damage, it instead takes no damage if it succeeds on the saving throw, and only half damage if it fails"
      ]
    },
    {
      name: "Observant",
      description: "Quick to notice details of your environment, you gain the following benefits:",
      benefits: [
        "Increase your Intelligence or Wisdom score by 1, to a maximum of 20",
        "+5 bonus to passive Wisdom (Perception) and passive Intelligence (Investigation) scores",
        "You can read lips if you can see a creature's mouth and it is speaking a language you understand"
      ]
    },
    {
      name: "Polearm Master",
      description: "You can keep your enemies at bay with reach weapons.",
      benefits: [
        "When you take the Attack action and attack with only a glaive, halberd, quarterstaff, or spear, you can use a bonus action to make a melee attack with the opposite end of the weapon",
        "While wielding a glaive, halberd, pike, quarterstaff, or spear, other creatures provoke an opportunity attack from you when they enter your reach"
      ]
    },
    {
      name: "Resilient",
      description: "Choose one ability score. You gain the following benefits:",
      benefits: [
        "Increase the chosen ability score by 1, to a maximum of 20",
        "You gain proficiency in saving throws using the chosen ability"
      ]
    },
    {
      name: "Ritual Caster",
      description: "You have learned a number of spells that you can cast as rituals.",
      prerequisites: {
        ability: ["Intelligence or Wisdom 13"]
      },
      benefits: [
        "You learn two 1st-level spells that have the ritual tag from the chosen class's spell list",
        "You can cast these spells as rituals",
        "You can also copy ritual spells you find into your ritual book, if they are of a level you can cast and from your chosen class"
      ]
    },
    {
      name: "Savage Attacker",
      description: "Once per turn when you roll damage for a melee weapon attack, you can reroll the weapon's damage dice and use either total.",
      benefits: [
        "Reroll melee weapon damage dice once per turn and use either result"
      ]
    },
    {
      name: "Sentinel",
      description: "You have mastered techniques to take advantage of every drop in any enemy's guard, gaining the following benefits:",
      benefits: [
        "When you hit a creature with an opportunity attack, the creature's speed becomes 0 for the rest of the turn",
        "Creatures provoke opportunity attacks from you even if they take the Disengage action before leaving your reach",
        "When a creature within 5 feet of you makes an attack against a target other than you (and that target doesn't have this feat), you can use your reaction to make a melee weapon attack against the attacking creature"
      ]
    },
    {
      name: "Sharpshooter",
      description: "You have mastered ranged weapons and can make shots that others find impossible.",
      benefits: [
        "Attacking at long range doesn't impose disadvantage on your ranged weapon attack rolls",
        "Your ranged weapon attacks ignore half cover and three-quarters cover",
        "Before you make an attack with a ranged weapon that you are proficient with, you can choose to take a -5 penalty to the attack roll. If the attack hits, you add +10 to the attack's damage"
        ]
    },
    {
      name: "Shield Master",
      description: "You use shields not just for protection but also for offense.",
      benefits: [
        "If you take the Attack action on your turn, you can use a bonus action to try to shove a creature within 5 feet of you with your shield",
        "If you aren't incapacitated, you can add your shield's AC bonus to any Dexterity saving throw you make against a spell or other harmful effect that targets only you",
        "If you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you can use your reaction to take no damage if you succeed on the saving throw, interposing your shield between yourself and the source of the effect"
      ]
    },
    {
      name: "Skilled",
      description: "You gain proficiency in any combination of three skills or tools of your choice.",
      benefits: [
        "Gain proficiency in 3 skills or tools of your choice"
      ]
    },
    {
      name: "Skulker",
      description: "You are expert at slinking through shadows.",
      benefits: [
        "You can try to hide when you are lightly obscured from the creature from which you are hiding",
        "When you are hidden from a creature and miss it with a ranged weapon attack, making the attack doesn't reveal your position",
        "Dim light doesn't impose disadvantage on your Wisdom (Perception) checks relying on sight"
      ]
    },
    {
      name: "Spell Sniper",
      description: "You have learned techniques to enhance your attacks with certain kinds of spells, gaining the following benefits:",
        benefits: [
            "When you cast a spell that requires you to make an attack roll, the spell's range is doubled",
            "Your ranged spell attacks ignore half cover and three-quarters cover",
            "You learn one cantrip that requires an attack roll. Choose the cantrip from the bard, cleric, druid, sorcerer, warlock, or wizard spell list. Your spellcasting ability for this cantrip depends on the spell list you chose from"
        ]
    },
    {
      name: "Tavern Brawler",
      description: "You are accustomed to rough-and-tumble fighting using whatever weapons happen to be at hand.",
      benefits: [
        "Increase your Strength or Constitution score by 1, to a maximum of 20",
        "You are proficient with improvised weapons",
        "Your unarmed strike uses a d4 for damage",
        "When you hit a creature with an unarmed strike or an improvised weapon on your turn, you can use a bonus action to attempt to grapple the target"
      ]
    },
    {
      name: "Tough",
      description: "Your hit point maximum increases by an amount equal to twice your level when you gain this feat. Whenever you gain a level thereafter, your hit point maximum increases by an additional 2 hit points.",
      benefits: [
        "Increase hit point maximum by twice your level",
        "Increase hit point maximum by 2 for each level gained thereafter"
      ]
    },
    {
      name: "War Caster",
      description: "You have practiced casting spells in the midst of combat, learning techniques that grant you the following benefits:",
      benefits: [
        "You have advantage on Constitution saving throws that you make to maintain your concentration on a spell when you take damage",
        "You can perform the somatic components of spells even when you have weapons or a shield in one or both hands",
        "When a hostile creature's movement provokes an opportunity attack from you, you can use your reaction to cast a spell at the creature, rather than making an opportunity attack. The spell must have a casting time of 1 action and must target only that creature"
      ]
    },
    {
      name: "Weapon Master",
      description: "You have practiced extensively with a variety of weapons, gaining the following benefits:",
      benefits: [
        "Increase your Strength or Dexterity score by 1, to a maximum of 20",
        "You gain proficiency with four weapons of your choice"
      ]
    }
];

export default feats;