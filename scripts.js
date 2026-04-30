let characterName = "";
let selectedClassKey = null;

let character = {
    name: "",
    level: 1,
    class: null,
    subclass: null,
    species: null,
    background: null,
    pendingBackgroundKey: null,

    abilities: {
        STR: 10,
        DEX: 10,
        CON: 10,
        INT: 10,
        WIS: 10,
        CHA: 10
    },

    proficiencyBonus: 2,
    savingThrows: [],
    skillProficiencies: [],
    armorTraining: [],
    weaponTraining: [],
    toolProficiencies: [],
    languages: [],

    hitDie: "",
    hpMax: 0,
    hpCurrent: 0,
    armorClass: 10,
    initiative: 0,
    speed: 30,
    passivePerception: 10,

    equipment: [],
    classFeatures: [],
    speciesTraits: [],
    feats: [],
    shield: false,

    weapons: [],
    spellcastingAbility: null,
    spellSaveDC: 0,
    spellAttackBonus: 0,
    cantrips: [],
    spells: []
};

const scores = {
    fighter: 0,
    barbarian: 0,
    paladin: 0,
    rogue: 0,
    wizard: 0,
    cleric: 0,
    druid: 0,
    bard: 0,
    ranger: 0
};

const nodes = {
    start: {
        question: "How do you intend to impact the world?",
        options: [
            { text: "With martial prowess and cold steel.", next: "martial_path" },
            { text: "With ancient magic and cosmic secrets.", next: "arcane_path" }
        ]
    },

    martial_path: {
        question: "What role do you see yourself playing in battle?",
        options: [
            {
                text: "Holding the line and protecting others.",
                addScores: { fighter: 2, paladin: 2, barbarian: 1 },
                next: "combat_style"
            },
            {
                text: "Striking fast and ending fights quickly.",
                addScores: { rogue: 2, ranger: 2, fighter: 1 },
                next: "combat_style"
            }
        ]
    },

    arcane_path: {
        question: "What kind of power calls to you most?",
        options: [
            {
                text: "Knowledge, study, and mastery.",
                addScores: { wizard: 3 },
                next: "origin_style"
            },
            {
                text: "Faith, healing, and divine purpose.",
                addScores: { cleric: 3, paladin: 1 },
                next: "origin_style"
            },
            {
                text: "Nature, instinct, and ancient life.",
                addScores: { druid: 3, ranger: 1 },
                next: "origin_style"
            },
            {
                text: "Charm, art, and wit.",
                addScores: { bard: 3, rogue: 1 },
                next: "origin_style"
            }
        ]
    },

    combat_style: {
        question: "What matters more to you in a fight?",
        options: [
            {
                text: "Durability and surviving anything.",
                addScores: { barbarian: 2, fighter: 1, paladin: 1 },
                next: "spec_background"
            },
            {
                text: "Precision, speed, and clean execution.",
                addScores: { rogue: 2, ranger: 1, fighter: 1 },
                next: "spec_background"
            },
            {
                text: "Protecting allies and controlling the front line.",
                addScores: { paladin: 2, fighter: 2 },
                next: "spec_background"
            }
        ]
    },

    origin_style: {
        question: "How do you relate to your power?",
        options: [
            {
                text: "I study it and master it through discipline.",
                addScores: { wizard: 2, cleric: 1 },
                next: "spec_background"
            },
            {
                text: "I channel it through faith or devotion.",
                addScores: { cleric: 2, paladin: 1, druid: 1 },
                next: "spec_background"
            },
            {
                text: "I express it through instinct, art, or personality.",
                addScores: { bard: 2, druid: 1, rogue: 1 },
                next: "spec_background"
            }
        ]
    }
};

const backgroundData = {
    acolyte: {
        name: "Acolyte",
        abilityOptions: ["INT", "WIS", "CHA"],
        feat: "Magic Initiate (Cleric)",
        skills: ["Insight", "Religion"],
        tool: "Calligrapher's Supplies",
        languages: [],
        equipment: ["Calligrapher's Supplies", "Book (prayers)", "Holy Symbol", "Parchment (10 sheets)", "Robe", "8 GP"]
    },
    artisan: {
        name: "Artisan",
        abilityOptions: ["STR", "DEX", "INT"],
        feat: "Crafter",
        skills: ["Investigation", "Persuasion"],
        tool: "Artisan's Tools",
        languages: [],
        equipment: ["Artisan's Tools", "2 Pouches", "Traveler's Clothes", "32 GP"]
    },
    charlatan: {
        name: "Charlatan",
        abilityOptions: ["DEX", "CON", "CHA"],
        feat: "Skilled",
        skills: ["Deception", "Sleight of Hand"],
        tool: "Forgery Kit",
        languages: [],
        equipment: ["Forgery Kit", "Costume", "Fine Clothes", "15 GP"]
    },
    criminal: {
        name: "Criminal",
        abilityOptions: ["DEX", "CON", "INT"],
        feat: "Alert",
        skills: ["Sleight of Hand", "Stealth"],
        tool: "Thieves' Tools",
        languages: [],
        equipment: ["2 Daggers", "Thieves' Tools", "Crowbar", "2 Pouches", "Traveler's Clothes", "16 GP"]
    },
    entertainer: {
        name: "Entertainer",
        abilityOptions: ["STR", "DEX", "CHA"],
        feat: "Musician",
        skills: ["Acrobatics", "Performance"],
        tool: "Musical Instrument",
        languages: [],
        equipment: ["Musical Instrument", "2 Costumes", "Mirror", "Perfume", "Traveler's Clothes", "11 GP"]
    },
    farmer: {
        name: "Farmer",
        abilityOptions: ["STR", "CON", "WIS"],
        feat: "Tough",
        skills: ["Animal Handling", "Nature"],
        tool: "Carpenter's Tools",
        languages: [],
        equipment: ["Sickle", "Carpenter's Tools", "Healer's Kit", "Iron Pot", "Shovel", "Traveler's Clothes", "30 GP"]
    },
    guard: {
        name: "Guard",
        abilityOptions: ["STR", "INT", "WIS"],
        feat: "Alert",
        skills: ["Athletics", "Perception"],
        tool: "Gaming Set",
        languages: [],
        equipment: ["Spear", "Light Crossbow", "20 Bolts", "Gaming Set", "Hooded Lantern", "Manacles", "Quiver", "Traveler's Clothes", "12 GP"]
    },
    guide: {
        name: "Guide",
        abilityOptions: ["DEX", "CON", "WIS"],
        feat: "Magic Initiate (Druid)",
        skills: ["Stealth", "Survival"],
        tool: "Cartographer's Tools",
        languages: [],
        equipment: ["Shortbow", "20 Arrows", "Cartographer's Tools", "Bedroll", "Quiver", "Tent", "Traveler's Clothes", "3 GP"]
    },
    hermit: {
        name: "Hermit",
        abilityOptions: ["CON", "WIS", "CHA"],
        feat: "Healer",
        skills: ["Medicine", "Religion"],
        tool: "Herbalism Kit",
        languages: [],
        equipment: ["Quarterstaff", "Herbalism Kit", "Bedroll", "Book (philosophy)", "Lamp", "Oil (3 flasks)", "Traveler's Clothes", "16 GP"]
    },
    merchant: {
        name: "Merchant",
        abilityOptions: ["CON", "INT", "CHA"],
        feat: "Lucky",
        skills: ["Animal Handling", "Persuasion"],
        tool: "Navigator's Tools",
        languages: [],
        equipment: ["Navigator's Tools", "2 Pouches", "Traveler's Clothes", "22 GP"]
    },
    noble: {
        name: "Noble",
        abilityOptions: ["STR", "INT", "CHA"],
        feat: "Skilled",
        skills: ["History", "Persuasion"],
        tool: "Gaming Set",
        languages: [],
        equipment: ["Gaming Set", "Fine Clothes", "Perfume", "29 GP"]
    },
    sage: {
        name: "Sage",
        abilityOptions: ["CON", "INT", "WIS"],
        feat: "Magic Initiate (Wizard)",
        skills: ["Arcana", "History"],
        tool: "Calligrapher's Supplies",
        languages: [],
        equipment: ["Quarterstaff", "Calligrapher's Supplies", "Book (history)", "Parchment (8 sheets)", "Robe", "8 GP"]
    },
    sailor: {
        name: "Sailor",
        abilityOptions: ["STR", "DEX", "WIS"],
        feat: "Tavern Brawler",
        skills: ["Acrobatics", "Perception"],
        tool: "Navigator's Tools",
        languages: [],
        equipment: ["Dagger", "Navigator's Tools", "Rope", "Traveler's Clothes", "20 GP"]
    },
    scribe: {
        name: "Scribe",
        abilityOptions: ["DEX", "INT", "WIS"],
        feat: "Skilled",
        skills: ["Investigation", "Perception"],
        tool: "Calligrapher's Supplies",
        languages: [],
        equipment: ["Calligrapher's Supplies", "Fine Clothes", "Lamp", "Oil (3 flasks)", "Parchment (12 sheets)", "23 GP"]
    },
    soldier: {
        name: "Soldier",
        abilityOptions: ["STR", "DEX", "CON"],
        feat: "Savage Attacker",
        skills: ["Athletics", "Intimidation"],
        tool: "Gaming Set",
        languages: [],
        equipment: ["Spear", "Shortbow", "20 Arrows", "Gaming Set", "Healer's Kit", "Quiver", "Traveler's Clothes", "14 GP"]
    },
    wayfarer: {
        name: "Wayfarer",
        abilityOptions: ["DEX", "WIS", "CHA"],
        feat: "Lucky",
        skills: ["Insight", "Stealth"],
        tool: "Thieves' Tools",
        languages: [],
        equipment: ["2 Daggers", "Thieves' Tools", "Gaming Set", "Bedroll", "2 Pouches", "Traveler's Clothes", "16 GP"]
    }
};

const backgroundRecommendations = {
    fighter: ["soldier", "guard", "farmer", "sailor", "artisan", "noble"],
    barbarian: ["soldier", "farmer", "guide", "hermit", "sailor", "wayfarer"],
    paladin: ["acolyte", "soldier", "guard", "noble", "hermit"],
    rogue: ["criminal", "charlatan", "wayfarer", "entertainer", "scribe"],
    wizard: ["sage", "scribe", "acolyte", "hermit", "merchant"],
    cleric: ["acolyte", "hermit", "guard", "sage", "farmer"],
    druid: ["guide", "farmer", "hermit", "wayfarer"],
    bard: ["entertainer", "charlatan", "merchant", "noble", "scribe"],
    ranger: ["guide", "farmer", "guard", "sailor", "wayfarer"]
};

const speciesData = {
    human: {
        name: "Human",
        speed: 30,
        traits: ["Resourceful", "Versatile"],
        languages: ["Common"]
    },
    elf: {
        name: "Elf",
        speed: 30,
        traits: ["Darkvision", "Keen Senses", "Fey Ancestry", "Trance"],
        languages: ["Common", "Elvish"]
    },
    dwarf: {
        name: "Dwarf",
        speed: 30,
        traits: ["Darkvision", "Dwarven Resilience"],
        languages: ["Common", "Dwarvish"]
    },
    halfling: {
        name: "Halfling",
        speed: 30,
        traits: ["Brave", "Halfling Nimbleness", "Luck"],
        languages: ["Common", "Halfling"]
    },
    tiefling: {
        name: "Tiefling",
        speed: 30,
        traits: ["Darkvision", "Fiendish Legacy"],
        languages: ["Common", "Infernal"]
    },
    orc: {
        name: "Orc",
        speed: 30,
        traits: ["Darkvision", "Relentless Endurance", "Adrenaline Rush"],
        languages: ["Common", "Orc"]
    }
};

const speciesRecommendations = {
    fighter: ["human", "dwarf", "orc"],
    barbarian: ["orc", "human", "dwarf"],
    paladin: ["human", "dwarf", "tiefling"],
    rogue: ["elf", "halfling", "human", "tiefling"],
    wizard: ["elf", "human", "tiefling"],
    cleric: ["human", "dwarf", "elf"],
    druid: ["elf", "human", "halfling"],
    bard: ["human", "elf", "tiefling", "halfling"],
    ranger: ["elf", "human", "halfling"]
};

const classData = {
    fighter: {
        name: "Fighter",
        subclass: "Champion",
        hitDie: "1d10",
        savingThrows: ["Strength", "Constitution"],
        armorTraining: ["Light", "Medium", "Heavy", "Shield"],
        weaponTraining: ["Simple", "Martial"],
        classFeatures: ["Second Wind", "Fighting Style"],
        startingEquipment: ["Chain Mail", "Shield", "Longsword"],
        abilities: { STR: 15, DEX: 12, CON: 14, INT: 10, WIS: 11, CHA: 8 },
        skillChoices: ["Acrobatics", "Animal Handling", "Athletics", "History", "Insight", "Intimidation", "Perception", "Survival"],
        skillChoiceCount: 2,
        spellcastingAbility: null
    },

    barbarian: {
        name: "Barbarian",
        subclass: "Berserker",
        hitDie: "1d12",
        savingThrows: ["Strength", "Constitution"],
        armorTraining: ["Light", "Medium", "Shield"],
        weaponTraining: ["Simple", "Martial"],
        classFeatures: ["Rage", "Unarmored Defense"],
        startingEquipment: ["Greataxe", "Handaxe", "Explorer's Pack"],
        abilities: { STR: 15, DEX: 13, CON: 14, INT: 8, WIS: 12, CHA: 10 },
        skillChoices: ["Animal Handling", "Athletics", "Intimidation", "Nature", "Perception", "Survival"],
        skillChoiceCount: 2,
        spellcastingAbility: null
    },

    paladin: {
        name: "Paladin",
        subclass: "Oath of Devotion",
        hitDie: "1d10",
        savingThrows: ["Wisdom", "Charisma"],
        armorTraining: ["Light", "Medium", "Heavy", "Shield"],
        weaponTraining: ["Simple", "Martial"],
        classFeatures: ["Divine Sense", "Lay on Hands"],
        startingEquipment: ["Chain Mail", "Shield", "Longsword", "Holy Symbol"],
        abilities: { STR: 15, DEX: 10, CON: 13, INT: 8, WIS: 12, CHA: 14 },
        skillChoices: ["Athletics", "Insight", "Intimidation", "Medicine", "Persuasion", "Religion"],
        skillChoiceCount: 2,
        spellcastingAbility: "CHA"
    },

    rogue: {
        name: "Rogue",
        subclass: "Assassin",
        hitDie: "1d8",
        savingThrows: ["Dexterity", "Intelligence"],
        armorTraining: ["Light"],
        weaponTraining: ["Simple", "Hand Crossbows", "Longswords", "Rapiers", "Shortswords"],
        classFeatures: ["Sneak Attack", "Thieves' Cant"],
        startingEquipment: ["Leather Armor", "Dagger", "Shortbow", "Thieves' Tools"],
        abilities: { STR: 8, DEX: 15, CON: 13, INT: 14, WIS: 12, CHA: 10 },
        skillChoices: ["Acrobatics", "Athletics", "Deception", "Insight", "Intimidation", "Investigation", "Perception", "Persuasion", "Sleight of Hand", "Stealth"],
        skillChoiceCount: 4,
        spellcastingAbility: null
    },

    wizard: {
        name: "Wizard",
        subclass: "Evocation",
        hitDie: "1d6",
        savingThrows: ["Intelligence", "Wisdom"],
        armorTraining: [],
        weaponTraining: ["Daggers", "Darts", "Slings", "Quarterstaffs", "Light Crossbows"],
        classFeatures: ["Spellcasting", "Arcane Recovery"],
        startingEquipment: ["Spellbook", "Quarterstaff", "Scholar's Pack"],
        abilities: { STR: 8, DEX: 13, CON: 14, INT: 15, WIS: 12, CHA: 10 },
        skillChoices: ["Arcana", "History", "Insight", "Investigation", "Medicine", "Nature", "Religion"],
        skillChoiceCount: 2,
        spellcastingAbility: "INT"
    },

    cleric: {
        name: "Cleric",
        subclass: "Life Domain",
        hitDie: "1d8",
        savingThrows: ["Wisdom", "Charisma"],
        armorTraining: ["Light", "Medium", "Shield"],
        weaponTraining: ["Simple"],
        classFeatures: ["Spellcasting", "Divine Domain"],
        startingEquipment: ["Scale Mail", "Shield", "Mace", "Holy Symbol"],
        abilities: { STR: 14, DEX: 8, CON: 14, INT: 10, WIS: 15, CHA: 12 },
        skillChoices: ["History", "Insight", "Medicine", "Persuasion", "Religion"],
        skillChoiceCount: 2,
        spellcastingAbility: "WIS"
    },

    druid: {
        name: "Druid",
        subclass: "Circle of the Moon",
        hitDie: "1d8",
        savingThrows: ["Intelligence", "Wisdom"],
        armorTraining: ["Light", "Medium", "Shield (nonmetal)"],
        weaponTraining: ["Clubs", "Daggers", "Darts", "Javelins", "Maces", "Quarterstaffs", "Scimitars", "Sickles", "Slings", "Spears"],
        classFeatures: ["Spellcasting", "Druidic"],
        startingEquipment: ["Leather Armor", "Shield", "Druidic Focus"],
        abilities: { STR: 10, DEX: 12, CON: 14, INT: 12, WIS: 15, CHA: 8 },
        skillChoices: ["Arcana", "Animal Handling", "Insight", "Medicine", "Nature", "Perception", "Religion", "Survival"],
        skillChoiceCount: 2,
        spellcastingAbility: "WIS"
    },

    bard: {
        name: "Bard",
        subclass: "College of Lore",
        hitDie: "1d8",
        savingThrows: ["Dexterity", "Charisma"],
        armorTraining: ["Light"],
        weaponTraining: ["Simple", "Hand Crossbows", "Longswords", "Rapiers", "Shortswords"],
        classFeatures: ["Spellcasting", "Bardic Inspiration"],
        startingEquipment: ["Leather Armor", "Dagger", "Lute"],
        abilities: { STR: 8, DEX: 14, CON: 13, INT: 12, WIS: 10, CHA: 15 },
        skillChoices: [
            "Acrobatics", "Animal Handling", "Arcana", "Athletics", "Deception",
            "History", "Insight", "Intimidation", "Investigation", "Medicine",
            "Nature", "Perception", "Performance", "Persuasion", "Religion",
            "Sleight of Hand", "Stealth", "Survival"
        ],
        skillChoiceCount: 3,
        spellcastingAbility: "CHA"
    },

    ranger: {
        name: "Ranger",
        subclass: "Hunter",
        hitDie: "1d10",
        savingThrows: ["Strength", "Dexterity"],
        armorTraining: ["Light", "Medium", "Shield"],
        weaponTraining: ["Simple", "Martial"],
        classFeatures: ["Favored Enemy", "Natural Explorer"],
        startingEquipment: ["Studded Leather", "Longbow", "Shortsword"],
        abilities: { STR: 12, DEX: 15, CON: 13, INT: 10, WIS: 14, CHA: 8 },
        skillChoices: ["Animal Handling", "Athletics", "Insight", "Investigation", "Nature", "Perception", "Stealth", "Survival"],
        skillChoiceCount: 3,
        spellcastingAbility: "WIS"
    }
};

function validateName() {
    const nameInput = document.getElementById("player-name");
    const errorMessage = document.getElementById("name-error");

    if (nameInput.value.trim() === "") {
        errorMessage.textContent = "Please enter your character's name first.";
        return false;
    }

    errorMessage.textContent = "";
    return true;
}

function validateAndStartQuiz() {
    if (validateName()) {
        startCharacterQuiz();
    }
}

// Attach event listeners AFTER DOM loads
document.addEventListener("DOMContentLoaded", () => {
    const quizButton = document.getElementById("auto-quiz-btn");

    quizButton.addEventListener("click", validateAndStartQuiz);
});

function getModifier(score) {
    return Math.floor((score - 10) / 2);
}

function getProficiencyBonus(level) {
    return Math.ceil(level / 4) + 1;
}

function getHitDieValue(hitDie) {
    return parseInt(hitDie.replace("1d", ""), 10);
}

function mergeUnique(arr1, arr2) {
    return [...new Set([...(arr1 || []), ...(arr2 || [])])];
}

function applyBackgroundAbilityBonuses(baseAbilities, abilityOptions) {
    const updated = { ...baseAbilities };
    updated[abilityOptions[0]] += 2;
    updated[abilityOptions[1]] += 1;
    return updated;
}

function chooseClassSkills(cls, backgroundSkills) {
    const available = cls.skillChoices.filter(skill => !(backgroundSkills || []).includes(skill));
    return available.slice(0, cls.skillChoiceCount);
}

function calculateAC(character) {
    const dexMod = getModifier(character.abilities.DEX);

    if (character.equipment.includes("Chain Mail")) return character.shield ? 18 : 16;
    if (character.equipment.includes("Scale Mail")) return (character.shield ? 16 : 14) + Math.min(dexMod, 2);
    if (character.equipment.includes("Leather Armor")) return (character.shield ? 13 : 11) + dexMod;
    if (character.equipment.includes("Studded Leather")) return (character.shield ? 14 : 12) + dexMod;

    return 10 + dexMod + (character.shield ? 2 : 0);
}

function buildWeapons(character) {
    const weapons = [];
    const dexMod = getModifier(character.abilities.DEX);
    const strMod = getModifier(character.abilities.STR);
    const prof = character.proficiencyBonus;

    if (character.equipment.includes("Dagger")) {
        weapons.push({
            name: "Dagger",
            attackBonus: `+${dexMod + prof}`,
            damage: `1d4+${dexMod}`,
            type: "Piercing",
            notes: "Finesse, Light, Thrown"
        });
    }

    if (character.equipment.includes("Shortbow")) {
        weapons.push({
            name: "Shortbow",
            attackBonus: `+${dexMod + prof}`,
            damage: `1d6+${dexMod}`,
            type: "Piercing",
            notes: "Ammunition, Range"
        });
    }

    if (character.equipment.includes("Longbow")) {
        weapons.push({
            name: "Longbow",
            attackBonus: `+${dexMod + prof}`,
            damage: `1d8+${dexMod}`,
            type: "Piercing",
            notes: "Ammunition, Heavy, Range, Two-Handed"
        });
    }

    if (character.equipment.includes("Longsword")) {
        weapons.push({
            name: "Longsword",
            attackBonus: `+${strMod + prof}`,
            damage: `1d8+${strMod}`,
            type: "Slashing",
            notes: "Versatile"
        });
    }

    if (character.equipment.includes("Mace")) {
        weapons.push({
            name: "Mace",
            attackBonus: `+${strMod + prof}`,
            damage: `1d6+${strMod}`,
            type: "Bludgeoning",
            notes: ""
        });
    }

    if (character.equipment.includes("Quarterstaff")) {
        weapons.push({
            name: "Quarterstaff",
            attackBonus: `+${strMod + prof}`,
            damage: `1d6+${strMod}`,
            type: "Bludgeoning",
            notes: "Versatile"
        });
    }

    if (character.equipment.includes("Spear")) {
        weapons.push({
            name: "Spear",
            attackBonus: `+${strMod + prof}`,
            damage: `1d6+${strMod}`,
            type: "Piercing",
            notes: "Thrown, Versatile"
        });
    }

    if (character.equipment.includes("Greataxe")) {
        weapons.push({
            name: "Greataxe",
            attackBonus: `+${strMod + prof}`,
            damage: `1d12+${strMod}`,
            type: "Slashing",
            notes: "Heavy, Two-Handed"
        });
    }

    if (character.equipment.includes("Handaxe")) {
        weapons.push({
            name: "Handaxe",
            attackBonus: `+${strMod + prof}`,
            damage: `1d6+${strMod}`,
            type: "Slashing",
            notes: "Light, Thrown"
        });
    }

    return weapons;
}

function applyFeatEffects(character, featName) {
    if (featName === "Skilled") {
        const allSkills = [
            "Acrobatics", "Animal Handling", "Arcana", "Athletics", "Deception",
            "History", "Insight", "Intimidation", "Investigation", "Medicine",
            "Nature", "Perception", "Performance", "Persuasion", "Religion",
            "Sleight of Hand", "Stealth", "Survival"
        ];

        const availableSkills = allSkills.filter(
            skill => !character.skillProficiencies.includes(skill)
        );

        character.skillProficiencies = mergeUnique(
            character.skillProficiencies,
            availableSkills.slice(0, 3)
        );
    }

    if (featName === "Tough") {
        character.hpMax += 2 * character.level;
        character.hpCurrent = character.hpMax;
    }

    if (featName === "Magic Initiate (Wizard)") {
        character.cantrips = mergeUnique(character.cantrips, ["Fire Bolt", "Mage Hand"]);
        character.spells = mergeUnique(character.spells, ["Magic Missile"]);
    }

    if (featName === "Magic Initiate (Cleric)") {
        character.cantrips = mergeUnique(character.cantrips, ["Sacred Flame", "Thaumaturgy"]);
        character.spells = mergeUnique(character.spells, ["Cure Wounds"]);
    }

    if (featName === "Magic Initiate (Druid)") {
        character.cantrips = mergeUnique(character.cantrips, ["Guidance", "Druidcraft"]);
        character.spells = mergeUnique(character.spells, ["Entangle"]);
    }
}

function addBaseClassMagic(character, cls) {
    if (cls.name === "Wizard") {
        character.cantrips = mergeUnique(character.cantrips, ["Fire Bolt", "Mage Hand", "Prestidigitation"]);
        character.spells = mergeUnique(character.spells, ["Magic Missile", "Shield", "Sleep", "Detect Magic"]);
    }

    if (cls.name === "Cleric") {
        character.cantrips = mergeUnique(character.cantrips, ["Sacred Flame", "Thaumaturgy", "Guidance"]);
        character.spells = mergeUnique(character.spells, ["Cure Wounds", "Bless", "Guiding Bolt"]);
    }

    if (cls.name === "Druid") {
        character.cantrips = mergeUnique(character.cantrips, ["Guidance", "Produce Flame", "Druidcraft"]);
        character.spells = mergeUnique(character.spells, ["Entangle", "Cure Wounds", "Faerie Fire"]);
    }

    if (cls.name === "Bard") {
        character.cantrips = mergeUnique(character.cantrips, ["Vicious Mockery", "Mage Hand"]);
        character.spells = mergeUnique(character.spells, ["Healing Word", "Dissonant Whispers", "Charm Person"]);
    }

    if (cls.name === "Paladin") {
        character.spells = mergeUnique(character.spells, ["Divine Sense", "Lay on Hands"]);
    }

    if (cls.name === "Ranger") {
        character.spells = mergeUnique(character.spells, []);
    }
}

function updateDerivedStats(character) {
    character.proficiencyBonus = getProficiencyBonus(character.level);
    character.initiative = getModifier(character.abilities.DEX);

    character.passivePerception =
        10 +
        getModifier(character.abilities.WIS) +
        (character.skillProficiencies.includes("Perception") ? character.proficiencyBonus : 0);

    character.hpMax = getHitDieValue(character.hitDie) + getModifier(character.abilities.CON);
    character.hpCurrent = character.hpMax;
    character.armorClass = calculateAC(character);

    if (character.spellcastingAbility) {
        const mod = getModifier(character.abilities[character.spellcastingAbility]);
        character.spellSaveDC = 8 + character.proficiencyBonus + mod;
        character.spellAttackBonus = character.proficiencyBonus + mod;
    } else {
        character.spellSaveDC = 0;
        character.spellAttackBonus = 0;
    }

}

function getBackgroundFlavor(key) {
    const flavors = {
        acolyte: "faith, temples, and sacred knowledge",
        artisan: "crafting, trade, and practical skill",
        charlatan: "tricks, disguises, and deception",
        criminal: "stealth, danger, and street smarts",
        entertainer: "performance, charm, and creativity",
        farmer: "hard work, animals, and survival",
        guard: "protection, discipline, and watchfulness",
        guide: "wilderness, travel, and survival",
        hermit: "solitude, healing, and hidden wisdom",
        merchant: "business, travel, and persuasion",
        noble: "status, politics, and influence",
        sage: "books, history, and arcane study",
        sailor: "ships, travel, and sea life",
        scribe: "writing, records, and careful observation",
        soldier: "battle, discipline, and endurance",
        wayfarer: "wandering, luck, and street survival"
    };

    return flavors[key] || "a unique past before adventuring";
}

function buildBackgroundNode() {
    const recommended = backgroundRecommendations[selectedClassKey] || Object.keys(backgroundData);

    return {
        question: `What was your life before adventuring? These backgrounds fit a ${classData[selectedClassKey]?.name || "character"} best.`,
        options: recommended.map(key => {
            const bg = backgroundData[key];
            return {
                text: `${bg.name} — ${getBackgroundFlavor(key)}`,
                next: key
            };
        })
    };
}

function buildSpeciesNode() {
    const recommended = speciesRecommendations[selectedClassKey] || Object.keys(speciesData);

    return {
        question: `What kind of being are you? These species fit a ${classData[selectedClassKey]?.name || "character"} well.`,
        options: recommended.map(key => {
            const sp = speciesData[key];
            return {
                text: `${sp.name} — ${sp.traits.join(", ")}`,
                next: key
            };
        })
    };
}

function showNode(nodeId) {
    let node;

    if (nodeId === "spec_background") {
        node = buildBackgroundNode();
    } else if (nodeId === "spec_species") {
        node = buildSpeciesNode();
    } else {
        node = nodes[nodeId];
    }

    if (!node) {
        console.error("Node not found:", nodeId);
        return;
    }

    document.getElementById("question-text").innerText = node.question;
    const container = document.getElementById("options-container");
    container.innerHTML = "";

    node.options.forEach(opt => {
        const btn = document.createElement("button");
        btn.innerText = opt.text;

        btn.onclick = () => {
            if (opt.addScores) {
                Object.entries(opt.addScores).forEach(([cls, val]) => {
                    if (scores[cls] !== undefined) {
                        scores[cls] += val;
                    }
                });
            }

            if (opt.next === "spec_background") {
                selectedClassKey = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
                showNode("spec_background");
            } else if (backgroundData[opt.next]) {
                character.pendingBackgroundKey = opt.next;
                showNode("spec_species");
            } else if (speciesData[opt.next]) {
                finalizeCharacter(character.pendingBackgroundKey, opt.next);
            } else if (nodes[opt.next]) {
                showNode(opt.next);
            } else {
                console.error("Unknown next target:", opt.next);
            }
        };

        container.appendChild(btn);
    });
}

function finalizeCharacter(bgKey, speciesKey) {
    const bg = backgroundData[bgKey];
    const cls = classData[selectedClassKey];
    const species = speciesData[speciesKey];

    if (!bg) {
        console.error("Background not found:", bgKey);
        return;
    }

    if (!cls) {
        console.error("Selected class not found:", selectedClassKey);
        return;
    }

    if (!species) {
        console.error("Species not found:", speciesKey);
        return;
    }

    character.background = bg.name;
    character.class = cls.name;
    character.subclass = cls.subclass;
    character.species = species.name;

    character.abilities = applyBackgroundAbilityBonuses(cls.abilities, bg.abilityOptions);
    character.hitDie = cls.hitDie;
    character.savingThrows = [...cls.savingThrows];

    const classSkills = chooseClassSkills(cls, bg.skills);
    character.skillProficiencies = mergeUnique(bg.skills, classSkills);

    character.armorTraining = [...cls.armorTraining];
    character.weaponTraining = [...cls.weaponTraining];
    character.toolProficiencies = bg.tool ? [bg.tool] : [];

    character.languages = mergeUnique(species.languages || [], bg.languages || []);
    character.equipment = [...cls.startingEquipment, ...bg.equipment];
    character.classFeatures = [...cls.classFeatures];
    character.speciesTraits = [...species.traits];
    character.feats = [bg.feat];
    character.speed = species.speed;
    character.shield = character.equipment.includes("Shield");
    character.spellcastingAbility = cls.spellcastingAbility;

    character.weapons = buildWeapons(character);
    character.cantrips = [];
    character.spells = [];

    addBaseClassMagic(character, cls);
    updateDerivedStats(character);
    applyFeatEffects(character, bg.feat);
    // updateDerivedStats(character);

    updateDerivedStats(character);

    localStorage.setItem("dndCharacter", JSON.stringify(character));
    window.location.href = "generated-from-quiz.html";
}

function saveAndRedirect(finalChar) {
    // Translate your script's keys to Lucas's sheet keys
    const exportedCharacter = {
        name: finalChar.name,
        species: finalChar.species,
        charClass: finalChar.class,
        level: finalChar.level,
        background: finalChar.background,
        alignment: "Neutral", // Defaulting since quiz doesn't ask
        stats: {
            Strength: finalChar.abilities.STR,
            Dexterity: finalChar.abilities.DEX,
            Constitution: finalChar.abilities.CON,
            Intelligence: finalChar.abilities.INT,
            Wisdom: finalChar.abilities.WIS,
            Charisma: finalChar.abilities.CHA
        },
        personality: {
            traits: finalChar.classFeatures.join(", "),
            ideals: "Adventure and Glory",
            bonds: "My starting equipment: " + finalChar.equipment.slice(0, 2).join(", "),
            flaws: "None (yet)"
        }
    };

    // Save for the generated-character.html page
    localStorage.setItem("dndCharacter", JSON.stringify(exportedCharacter));

    // Redirect to the sheet page
    window.location.href = "generated-character.html";
}

function startManualCreation() {
    const nameInput = document.getElementById("player-name").value.trim();
    character.name = nameInput || "The Nameless Adventurer";

    // Hide the name entry
    document.getElementById("setup-screen").style.display = "none";
    document.getElementById("quiz-screen").style.display = "block";

    // We skip the personality questions and go straight to Class selection
    document.getElementById("question-text").innerText = "Choose your Path:";
    const container = document.getElementById("options-container");
    container.innerHTML = "";

    // Generate buttons for every class in your classData
    Object.keys(classData).forEach(key => {
        const btn = document.createElement("button");
        btn.className = "button";
        btn.innerText = classData[key].name;
        btn.onclick = () => {
            selectedClassKey = key;
            showNode("spec_background"); // Jump straight to Background selection
        };
        container.appendChild(btn);
    });
}

function startCharacterQuiz() {
    resetQuizState();
    const nameInput = document.getElementById("player-name").value.trim();
    characterName = nameInput || "The Nameless Adventurer";
    character.name = characterName;

    document.getElementById("setup-screen").style.display = "none";
    document.getElementById("quiz-screen").style.display = "block";

    showNode("start");
}

function renderCharacterSheet() {
    document.getElementById("quiz-screen").style.display = "none";
    document.getElementById("result-screen").style.display = "block";

    const sheet = document.getElementById("character-sheet");

    sheet.innerHTML = `
        <div class="final-sheet">
            <h1>${character.name}</h1>
            <h2>Level ${character.level} ${character.class} (${character.subclass})</h2>
            <p><strong>Species:</strong> ${character.species}</p>
            <p><strong>Background:</strong> ${character.background}</p>

            <div class="sheet-section">
                <p><strong>Armor Class:</strong> ${character.armorClass}</p>
                <p><strong>Hit Points:</strong> ${character.hpCurrent}/${character.hpMax}</p>
                <p><strong>Hit Die:</strong> ${character.hitDie}</p>
                <p><strong>Initiative:</strong> ${character.initiative >= 0 ? "+" : ""}${character.initiative}</p>
                <p><strong>Speed:</strong> ${character.speed} ft.</p>
                <p><strong>Passive Perception:</strong> ${character.passivePerception}</p>
                <p><strong>Proficiency Bonus:</strong> +${character.proficiencyBonus}</p>
            </div>

            <div class="sheet-section">
                <p><strong>Saving Throws:</strong> ${character.savingThrows.join(", ")}</p>
                <p><strong>Skills:</strong> ${character.skillProficiencies.join(", ")}</p>
                <p><strong>Armor Training:</strong> ${character.armorTraining.join(", ") || "None"}</p>
                <p><strong>Weapon Training:</strong> ${character.weaponTraining.join(", ") || "None"}</p>
                <p><strong>Tools:</strong> ${character.toolProficiencies.join(", ") || "None"}</p>
                <p><strong>Languages:</strong> ${character.languages.join(", ") || "Common"}</p>
            </div>

            <div class="ability-scores-container">
                ${Object.entries(character.abilities).map(([stat, val]) => {
        const mod = getModifier(val);
        const modSign = mod >= 0 ? "+" : "";
        return `
                        <div class="stat-block">
                            <label>${stat}</label>
                            <div class="score">${val}</div>
                            <div class="modifier">${modSign}${mod}</div>
                        </div>
                    `;
    }).join("")}
            </div>

            <div class="sheet-section">
                <p><strong>Class Features:</strong> ${character.classFeatures.join(", ") || "None"}</p>
                <p><strong>Species Traits:</strong> ${character.speciesTraits.join(", ") || "None"}</p>
                <p><strong>Feats:</strong> ${character.feats.join(", ") || "None"}</p>
                <p><strong>Equipment:</strong> ${character.equipment.join(", ") || "None"}</p>
            </div>

            <div class="sheet-section">
                <p><strong>Weapons:</strong></p>
                ${character.weapons.length
            ? `<ul>${character.weapons.map(w => `<li>${w.name} — ${w.attackBonus} to hit, ${w.damage} ${w.type}${w.notes ? ` (${w.notes})` : ""}</li>`).join("")}</ul>`
            : `<p>None</p>`
        }
            </div>

            <div class="sheet-section">
                <p><strong>Cantrips:</strong> ${character.cantrips.join(", ") || "None"}</p>
                <p><strong>Spells:</strong> ${character.spells.join(", ") || "None"}</p>
                ${character.spellcastingAbility
            ? `<p><strong>Spellcasting Ability:</strong> ${character.spellcastingAbility}</p>
                           <p><strong>Spell Save DC:</strong> ${character.spellSaveDC}</p>
                           <p><strong>Spell Attack Bonus:</strong> +${character.spellAttackBonus}</p>`
            : ""
        }
            </div>
        </div>
    `;
}

function resetQuizState() {
    selectedClassKey = null;

    Object.keys(scores).forEach(function (key) {
        scores[key] = 0;
    });

    character = {
        name: "",
        level: 1,
        class: null,
        subclass: null,
        species: null,
        background: null,
        pendingBackgroundKey: null,

        abilities: {
            STR: 10,
            DEX: 10,
            CON: 10,
            INT: 10,
            WIS: 10,
            CHA: 10
        },

        proficiencyBonus: 2,
        savingThrows: [],
        skillProficiencies: [],
        armorTraining: [],
        weaponTraining: [],
        toolProficiencies: [],
        languages: [],

        hitDie: "",
        hpMax: 0,
        hpCurrent: 0,
        armorClass: 10,
        initiative: 0,
        speed: 30,
        passivePerception: 10,

        equipment: [],
        classFeatures: [],
        speciesTraits: [],
        feats: [],
        shield: false,

        weapons: [],
        spellcastingAbility: null,
        spellSaveDC: 0,
        spellAttackBonus: 0,
        cantrips: [],
        spells: []
    };
}

// ===============================
// Generated Character Page Logic
// ===============================

window.addEventListener("load", function () {
    const savedData = localStorage.getItem("dndCharacter");

    if (!savedData) {
        alert("No character found. Please create a character first.");
        window.location.href = "create-character.html";
        return;
    }

    const character = JSON.parse(savedData);

    function getModifier(score) {
        return Math.floor((score - 10) / 2);
    }

    function formatBonus(num) {
        return num >= 0 ? "+" + num : "" + num;
    }

    function safeHTML(id, value) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = value || "None";
    }

    function safeText(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = value || "None";
    }

    function listHTML(value) {
        if (Array.isArray(value)) {
            return value.length
                ? value.map(item => `<div>${item}</div>`).join("")
                : "None";
        }
        return value || "None";
    }

    const abilityMap = {
        Strength: "STR",
        Dexterity: "DEX",
        Constitution: "CON",
        Intelligence: "INT",
        Wisdom: "WIS",
        Charisma: "CHA"
    };

    const skillMap = {
        Acrobatics: "DEX",
        "Animal Handling": "WIS",
        Arcana: "INT",
        Athletics: "STR",
        Deception: "CHA",
        History: "INT",
        Insight: "WIS",
        Intimidation: "CHA",
        Investigation: "INT",
        Medicine: "WIS",
        Nature: "INT",
        Perception: "WIS",
        Performance: "CHA",
        Persuasion: "CHA",
        Religion: "INT",
        "Sleight of Hand": "DEX",
        Stealth: "DEX",
        Survival: "WIS"
    };

    // Saving Throws
    const savingThrowList = document.getElementById("sheet-saving-throws-list");
    if (savingThrowList) {
        savingThrowList.innerHTML = "";

        Object.keys(abilityMap).forEach(abilityName => {
            const abilityKey = abilityMap[abilityName];
            const isProficient = character.savingThrows.includes(abilityName);

            let bonus = getModifier(character.abilities[abilityKey]);
            if (isProficient) bonus += character.proficiencyBonus;

            const li = document.createElement("li");
            li.textContent =
                (isProficient ? "● " : "○ ") +
                formatBonus(bonus) +
                " " +
                abilityName;

            savingThrowList.appendChild(li);
        });
    }

    // Skills
    const skillsList = document.getElementById("sheet-skills-list");
    if (skillsList) {
        skillsList.innerHTML = "";

        Object.keys(skillMap).forEach(skillName => {
            const abilityKey = skillMap[skillName];
            const isProficient = character.skillProficiencies.includes(skillName);

            let bonus = getModifier(character.abilities[abilityKey]);
            if (isProficient) bonus += character.proficiencyBonus;

            const li = document.createElement("li");
            li.textContent =
                (isProficient ? "● " : "○ ") +
                formatBonus(bonus) +
                " " +
                skillName +
                " (" + abilityKey + ")";

            skillsList.appendChild(li);
        });
    }

    function abilityScoreHTML(score) {
        return `
            <div class="ability-score-number">${score}</div>
        `;
    }

    // Ability scores
    const abilityIds = {
        "score-Strength": "STR",
        "score-Dexterity": "DEX",
        "score-Constitution": "CON",
        "score-Intelligence": "INT",
        "score-Wisdom": "WIS",
        "score-Charisma": "CHA"
    };

    Object.entries(abilityIds).forEach(([id, key]) => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = abilityScoreHTML(character.abilities[key]);
    });

    // Basic info
    safeText("sheet-name", character.name);
    safeText("sheet-species", character.species);
    safeText("sheet-class", character.class);
    safeText("sheet-subclass", character.subclass);
    safeText("sheet-level", character.level);
    safeText("sheet-background", character.background);
    safeText("sheet-alignment", character.alignment || "Neutral");

    // Stats
    safeText("sheet-max-hp", character.hpMax);
    safeText("sheet-current-hp", character.hpCurrent);
    safeText("sheet-hit-dice", character.hitDie);
    safeText("sheet-armor-class", character.armorClass);
    safeText("sheet-speed", character.speed + " ft.");

    const initiative =
        character.initiative >= 0
            ? "+" + character.initiative
            : character.initiative;
    safeText("sheet-initiative", initiative);

    safeText("sheet-passive-perception", character.passivePerception);
    safeText("sheet-proficiency", "+" + character.proficiencyBonus);

    // Lists
    safeHTML("sheet-languages", listHTML(character.languages));
    safeHTML("sheet-tools", listHTML(character.toolProficiencies));
    safeHTML("sheet-armor-training", listHTML(character.armorTraining));
    safeHTML("sheet-weapon-training", listHTML(character.weaponTraining));

    safeHTML("sheet-class-features", listHTML(character.classFeatures));
    safeHTML("sheet-species-traits", listHTML(character.speciesTraits));
    safeHTML("sheet-feats", listHTML(character.feats));
    safeHTML("sheet-equipment", listHTML(character.equipment));

    // Spells
    safeText("sheet-spell-ability", character.spellcastingAbility || "None");
    safeText("sheet-spell-save-dc", character.spellSaveDC || "None");
    safeText(
        "sheet-spell-attack",
        character.spellAttackBonus
            ? "+" + character.spellAttackBonus
            : "None"
    );

    safeText(
        "sheet-cantrips",
        character.cantrips?.length
            ? character.cantrips.join(", ")
            : "None"
    );

    safeText(
        "sheet-spells",
        character.spells?.length
            ? character.spells.join(", ")
            : "None"
    );

    // Weapons
    const weaponsTable = document.getElementById("sheet-weapons");
    if (weaponsTable) {
        weaponsTable.innerHTML = "";

        if (character.weapons?.length) {
            character.weapons.forEach(weapon => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${weapon.name}</td>
                    <td>${weapon.attackBonus}</td>
                    <td>${weapon.damage} ${weapon.type}</td>
                `;

                weaponsTable.appendChild(row);
            });
        } else {
            weaponsTable.innerHTML = `<tr><td colspan="3">None</td></tr>`;
        }
    }
});