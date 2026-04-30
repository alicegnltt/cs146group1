// ============================================================
//  D&D Character Creator Quiz - quiz.js (2024 PHB)
// ============================================================

// --------------------
// DATA
// --------------------

let STATS = [
  "Strength",
  "Dexterity",
  "Constitution",
  "Intelligence",
  "Wisdom",
  "Charisma",
];

// All 18 skills mapped to their governing ability score
let SKILL_STAT_MAP = {
  Acrobatics: "Dexterity",
  "Animal Handling": "Wisdom",
  Arcana: "Intelligence",
  Athletics: "Strength",
  Deception: "Charisma",
  History: "Intelligence",
  Insight: "Wisdom",
  Intimidation: "Charisma",
  Investigation: "Intelligence",
  Medicine: "Wisdom",
  Nature: "Intelligence",
  Perception: "Wisdom",
  Performance: "Charisma",
  Persuasion: "Charisma",
  Religion: "Intelligence",
  "Sleight of Hand": "Dexterity",
  Stealth: "Dexterity",
  Survival: "Wisdom",
};

// Each class: which 2 saving throws they're proficient in,
// how many skills they pick, and which skills they may choose from.
let CLASS_DATA = {
  Barbarian: {
    savingThrows: ["Strength", "Constitution"],
    skillCount: 2,
    skillChoices: [
      "Animal Handling",
      "Athletics",
      "Intimidation",
      "Nature",
      "Perception",
      "Survival",
    ],
  },
  Bard: {
    savingThrows: ["Dexterity", "Charisma"],
    skillCount: 3,
    skillChoices: [
      "Acrobatics",
      "Animal Handling",
      "Arcana",
      "Athletics",
      "Deception",
      "History",
      "Insight",
      "Intimidation",
      "Investigation",
      "Medicine",
      "Nature",
      "Perception",
      "Performance",
      "Persuasion",
      "Religion",
      "Sleight of Hand",
      "Stealth",
      "Survival",
    ],
  },
  Cleric: {
    savingThrows: ["Wisdom", "Charisma"],
    skillCount: 2,
    skillChoices: ["History", "Insight", "Medicine", "Persuasion", "Religion"],
  },
  Druid: {
    savingThrows: ["Intelligence", "Wisdom"],
    skillCount: 2,
    skillChoices: [
      "Arcana",
      "Animal Handling",
      "Insight",
      "Medicine",
      "Nature",
      "Perception",
      "Religion",
      "Survival",
    ],
  },
  Fighter: {
    savingThrows: ["Strength", "Constitution"],
    skillCount: 2,
    skillChoices: [
      "Acrobatics",
      "Animal Handling",
      "Athletics",
      "History",
      "Insight",
      "Intimidation",
      "Perception",
      "Survival",
    ],
  },
  Monk: {
    savingThrows: ["Strength", "Dexterity"],
    skillCount: 2,
    skillChoices: [
      "Acrobatics",
      "Athletics",
      "History",
      "Insight",
      "Religion",
      "Stealth",
    ],
  },
  Paladin: {
    savingThrows: ["Wisdom", "Charisma"],
    skillCount: 2,
    skillChoices: [
      "Athletics",
      "Insight",
      "Intimidation",
      "Medicine",
      "Persuasion",
      "Religion",
    ],
  },
  Ranger: {
    savingThrows: ["Strength", "Dexterity"],
    skillCount: 3,
    skillChoices: [
      "Animal Handling",
      "Athletics",
      "Insight",
      "Investigation",
      "Nature",
      "Perception",
      "Stealth",
      "Survival",
    ],
  },
  Rogue: {
    savingThrows: ["Dexterity", "Intelligence"],
    skillCount: 4,
    skillChoices: [
      "Acrobatics",
      "Athletics",
      "Deception",
      "Insight",
      "Intimidation",
      "Investigation",
      "Perception",
      "Performance",
      "Persuasion",
      "Sleight of Hand",
      "Stealth",
    ],
  },
  Sorcerer: {
    savingThrows: ["Constitution", "Charisma"],
    skillCount: 2,
    skillChoices: [
      "Arcana",
      "Deception",
      "Insight",
      "Intimidation",
      "Persuasion",
      "Religion",
    ],
  },
  Warlock: {
    savingThrows: ["Wisdom", "Charisma"],
    skillCount: 2,
    skillChoices: [
      "Arcana",
      "Deception",
      "History",
      "Intimidation",
      "Investigation",
      "Nature",
      "Religion",
    ],
  },
  Wizard: {
    savingThrows: ["Intelligence", "Wisdom"],
    skillCount: 2,
    skillChoices: [
      "Arcana",
      "History",
      "Insight",
      "Investigation",
      "Medicine",
      "Religion",
    ],
  },
};

// Each background auto-grants exactly 2 fixed skill proficiencies (2024 PHB).
// These do NOT count against the class skill limit.
let BACKGROUND_SKILLS = {
  Acolyte: ["Insight", "Religion"],
  Artisan: ["Investigation", "Persuasion"],
  Charlatan: ["Deception", "Sleight of Hand"],
  Criminal: ["Deception", "Stealth"],
  Entertainer: ["Acrobatics", "Performance"],
  Farmer: ["Animal Handling", "Nature"],
  Guard: ["Athletics", "Perception"],
  Guide: ["Stealth", "Survival"],
  Hermit: ["Medicine", "Religion"],
  Merchant: ["Animal Handling", "Persuasion"],
  Noble: ["History", "Persuasion"],
  Sage: ["Arcana", "History"],
  Sailor: ["Acrobatics", "Perception"],
  Scribe: ["Investigation", "Perception"],
  Soldier: ["Athletics", "Intimidation"],
  Wayfarer: ["Insight", "Stealth"],
};

let BACKGROUNDS = {
  Acolyte: { stats: ["Intelligence", "Wisdom", "Charisma"] },
  Artisan: { stats: ["Strength", "Dexterity", "Intelligence"] },
  Charlatan: { stats: ["Dexterity", "Constitution", "Charisma"] },
  Criminal: { stats: ["Dexterity", "Constitution", "Intelligence"] },
  Entertainer: { stats: ["Strength", "Dexterity", "Charisma"] },
  Farmer: { stats: ["Strength", "Constitution", "Wisdom"] },
  Guard: { stats: ["Strength", "Intelligence", "Wisdom"] },
  Guide: { stats: ["Dexterity", "Constitution", "Wisdom"] },
  Hermit: { stats: ["Constitution", "Wisdom", "Charisma"] },
  Merchant: { stats: ["Constitution", "Intelligence", "Charisma"] },
  Noble: { stats: ["Strength", "Wisdom", "Charisma"] },
  Sage: { stats: ["Constitution", "Intelligence", "Wisdom"] },
  Sailor: { stats: ["Strength", "Dexterity", "Wisdom"] },
  Scribe: { stats: ["Dexterity", "Intelligence", "Wisdom"] },
  Soldier: { stats: ["Strength", "Dexterity", "Constitution"] },
  Wayfarer: { stats: ["Dexterity", "Wisdom", "Charisma"] },
};

let SPECIES = [
  "Aasimar",
  "Dragonborn",
  "Dwarf",
  "Elf",
  "Gnome",
  "Goliath",
  "Halfling",
  "Human",
  "Orc",
  "Tiefling",
];

let SPECIES_LANGUAGES = {
  Aasimar: ["Common", "Celestial"],
  Dragonborn: ["Common", "Draconic"],
  Dwarf: ["Common", "Dwarvish"],
  Elf: ["Common", "Elvish"],
  Gnome: ["Common", "Gnomish"],
  Goliath: ["Common", "Giant"],
  Halfling: ["Common", "Halfling"],
  Human: ["Common"],
  Orc: ["Common", "Orc"],
  Tiefling: ["Common", "Infernal"],
};

let CLASSES = [
  "Barbarian",
  "Bard",
  "Cleric",
  "Druid",
  "Fighter",
  "Monk",
  "Paladin",
  "Ranger",
  "Rogue",
  "Sorcerer",
  "Warlock",
  "Wizard",
];

let ALIGNMENTS = [
  "Lawful Good",
  "Neutral Good",
  "Chaotic Good",
  "Lawful Neutral",
  "True Neutral",
  "Chaotic Neutral",
  "Lawful Evil",
  "Neutral Evil",
  "Chaotic Evil",
];

// --------------------
// EQUIPMENT DATA
// --------------------
// Each class gets a set of equipment "packs" — groups of related items.
// The player picks ONE option from each pack.
// Items that match weapon names in buildWeapons() will auto-generate attack rows.
let CLASS_EQUIPMENT = {
  Barbarian: [
    { pick: 1, options: [["Greataxe"], ["Handaxe", "Handaxe"]] },
    {
      pick: 1,
      options: [
        ["Handaxe", "Handaxe"],
        ["Dagger", "Dagger"],
      ],
    },
    { always: ["Explorer's Pack", "4 Javelins"] },
  ],
  Bard: [
    { pick: 1, options: [["Longsword"], ["Dagger"]] },
    { pick: 1, options: [["Diplomat's Pack"], ["Entertainer's Pack"]] },
    { pick: 1, options: [["Lute"], ["Any musical instrument"]] },
    { always: ["Leather Armor", "Dagger"] },
  ],
  Cleric: [
    { pick: 1, options: [["Mace"], ["Quarterstaff"]] },
    { pick: 1, options: [["Scale Mail"], ["Leather Armor"], ["Chain Mail"]] },
    { pick: 1, options: [["Crossbow, Light", "20 Bolts"], ["Shield"]] },
    { pick: 1, options: [["Priest's Pack"], ["Explorer's Pack"]] },
    { always: ["Holy Symbol"] },
  ],
  Druid: [
    { pick: 1, options: [["Wooden Shield"], ["Simple weapon"]] },
    { pick: 1, options: [["Scimitar"], ["Quarterstaff"]] },
    { always: ["Leather Armor", "Explorer's Pack", "Druidic Focus"] },
  ],
  Fighter: [
    {
      pick: 1,
      options: [["Chain Mail"], ["Leather Armor", "Longbow", "20 Arrows"]],
    },
    {
      pick: 1,
      options: [
        ["Longsword", "Shield"],
        ["Handaxe", "Handaxe"],
      ],
    },
    { pick: 1, options: [["Crossbow, Light", "20 Bolts"], ["Handaxe"]] },
    { pick: 1, options: [["Dungeoneer's Pack"], ["Explorer's Pack"]] },
  ],
  Monk: [
    { pick: 1, options: [["Shortsword"], ["Any simple weapon"]] },
    { pick: 1, options: [["Dungeoneer's Pack"], ["Explorer's Pack"]] },
    { always: ["10 Darts"] },
  ],
  Paladin: [
    {
      pick: 1,
      options: [
        ["Longsword", "Shield"],
        ["Spear", "Shield"],
      ],
    },
    {
      pick: 1,
      options: [
        ["Handaxe", "Handaxe"],
        ["Javelin", "Javelin", "Javelin", "Javelin", "Javelin"],
      ],
    },
    { pick: 1, options: [["Priest's Pack"], ["Explorer's Pack"]] },
    { always: ["Chain Mail", "Holy Symbol"] },
  ],
  Ranger: [
    { pick: 1, options: [["Scale Mail"], ["Leather Armor"]] },
    {
      pick: 1,
      options: [
        ["Shortsword", "Shortsword"],
        ["Longsword", "Dagger"],
      ],
    },
    { pick: 1, options: [["Dungeoneer's Pack"], ["Explorer's Pack"]] },
    { always: ["Longbow", "20 Arrows"] },
  ],
  Rogue: [
    { pick: 1, options: [["Rapier"], ["Shortsword"]] },
    { pick: 1, options: [["Shortbow", "20 Arrows"], ["Shortsword"]] },
    {
      pick: 1,
      options: [["Burglar's Pack"], ["Dungeoneer's Pack"], ["Explorer's Pack"]],
    },
    { always: ["Leather Armor", "Dagger", "Dagger", "Thieves' Tools"] },
  ],
  Sorcerer: [
    {
      pick: 1,
      options: [
        ["Crossbow, Light", "20 Bolts"],
        ["Dagger", "Dagger"],
      ],
    },
    { pick: 1, options: [["Arcane Focus"], ["Component Pouch"]] },
    { pick: 1, options: [["Explorer's Pack"], ["Dungeoneer's Pack"]] },
    { always: ["Dagger", "Dagger"] },
  ],
  Warlock: [
    {
      pick: 1,
      options: [
        ["Crossbow, Light", "20 Bolts"],
        ["Dagger", "Dagger"],
      ],
    },
    { pick: 1, options: [["Arcane Focus"], ["Component Pouch"]] },
    { pick: 1, options: [["Scholar's Pack"], ["Dungeoneer's Pack"]] },
    { always: ["Leather Armor", "Dagger", "Dagger"] },
  ],
  Wizard: [
    { pick: 1, options: [["Quarterstaff"], ["Dagger"]] },
    { pick: 1, options: [["Arcane Focus"], ["Component Pouch"]] },
    { pick: 1, options: [["Scholar's Pack"], ["Explorer's Pack"]] },
    { always: ["Spellbook"] },
  ],
};

// --------------------
// FEAT DATA
// --------------------
// Origin feats available at level 1 (2024 PHB).
// Each feat lists what it grants (for display/export); applyFeatEffects() on
// the sheet side handles mechanical changes.
let FEATS = [
  {
    name: "Alert",
    description: "+5 initiative. Can't be surprised while conscious.",
  },
  {
    name: "Crafter",
    description: "Tool proficiency with 3 artisan tools. Items cost 20% less.",
  },
  {
    name: "Healer",
    description:
      "Heal with healer's kit as an action, stabilise and restore HP.",
  },
  {
    name: "Lucky",
    description:
      "3 luck points per long rest. Reroll attack, ability, or saving throw.",
  },
  {
    name: "Magic Initiate (Cleric)",
    description:
      "Gain Sacred Flame, Thaumaturgy cantrips and Cure Wounds spell.",
  },
  {
    name: "Magic Initiate (Druid)",
    description: "Gain Guidance, Druidcraft cantrips and Entangle spell.",
  },
  {
    name: "Magic Initiate (Wizard)",
    description: "Gain Fire Bolt, Mage Hand cantrips and Magic Missile spell.",
  },
  {
    name: "Savage Attacker",
    description:
      "Once per turn, reroll weapon damage dice and use either result.",
  },
  {
    name: "Skilled",
    description: "Gain proficiency in any 3 skills or tools of your choice.",
  },
  {
    name: "Tavern Brawler",
    description:
      "Proficient with improvised weapons. Unarmed strike deals 1d4.",
  },
  {
    name: "Tough",
    description:
      "HP maximum increases by 2 per level (currently +2 at level 1).",
  },
];

// --------------------
// MAGIC DATA (by class)
// --------------------
let CLASS_MAGIC = {
  Barbarian: { cantrips: [], spells: [] },
  Bard: {
    cantrips: ["Vicious Mockery", "Mage Hand"],
    spells: ["Healing Word", "Dissonant Whispers", "Charm Person"],
  },
  Cleric: {
    cantrips: ["Sacred Flame", "Thaumaturgy", "Guidance"],
    spells: ["Cure Wounds", "Bless", "Guiding Bolt"],
  },
  Druid: {
    cantrips: ["Guidance", "Produce Flame", "Druidcraft"],
    spells: ["Entangle", "Cure Wounds", "Faerie Fire"],
  },
  Fighter: { cantrips: [], spells: [] },
  Monk: { cantrips: [], spells: [] },
  Paladin: { cantrips: [], spells: ["Divine Sense", "Lay on Hands"] },
  Ranger: { cantrips: [], spells: [] },
  Rogue: { cantrips: [], spells: [] },
  Sorcerer: {
    cantrips: ["Fire Bolt", "Mage Hand", "Prestidigitation", "Minor Illusion"],
    spells: ["Magic Missile", "Shield", "Burning Hands"],
  },
  Warlock: {
    cantrips: ["Eldritch Blast", "Mage Hand"],
    spells: ["Hex", "Armor of Agathys"],
  },
  Wizard: {
    cantrips: ["Fire Bolt", "Mage Hand", "Prestidigitation"],
    spells: ["Magic Missile", "Shield", "Sleep", "Detect Magic"],
  },
};

// Weapon definitions matching buildWeapons() — used to build attack rows on sheet
let WEAPON_STATS = {
  Dagger: {
    stat: "Dexterity",
    damage: "1d4",
    type: "Piercing",
    notes: "Finesse, Light, Thrown",
  },
  Shortbow: {
    stat: "Dexterity",
    damage: "1d6",
    type: "Piercing",
    notes: "Ammunition, Range",
  },
  Longbow: {
    stat: "Dexterity",
    damage: "1d8",
    type: "Piercing",
    notes: "Ammunition, Heavy, Range",
  },
  Longsword: {
    stat: "Strength",
    damage: "1d8",
    type: "Slashing",
    notes: "Versatile",
  },
  Shortsword: {
    stat: "Dexterity",
    damage: "1d6",
    type: "Piercing",
    notes: "Finesse, Light",
  },
  Mace: { stat: "Strength", damage: "1d6", type: "Bludgeoning", notes: "" },
  Quarterstaff: {
    stat: "Strength",
    damage: "1d6",
    type: "Bludgeoning",
    notes: "Versatile",
  },
  Spear: {
    stat: "Strength",
    damage: "1d6",
    type: "Piercing",
    notes: "Thrown, Versatile",
  },
  Greataxe: {
    stat: "Strength",
    damage: "1d12",
    type: "Slashing",
    notes: "Heavy, Two-Handed",
  },
  Handaxe: {
    stat: "Strength",
    damage: "1d6",
    type: "Slashing",
    notes: "Light, Thrown",
  },
  Rapier: {
    stat: "Dexterity",
    damage: "1d8",
    type: "Piercing",
    notes: "Finesse",
  },
  Scimitar: {
    stat: "Dexterity",
    damage: "1d6",
    type: "Slashing",
    notes: "Finesse, Light",
  },
};

// --------------------
// MATH HELPERS
// --------------------

// Ability modifier: floor((score - 10) / 2)
function abilityModifier(score) {
  return Math.floor((score - 10) / 2);
}

// Format modifier as "+3" or "-1"
function formatMod(n) {
  return (n >= 0 ? "+" : "") + n;
}

// Level 1 proficiency bonus is always +2
let PROFICIENCY_BONUS = 2;

// --------------------
// DICE ROLLING HELPERS
// --------------------

function rollD6() {
  return Math.floor(Math.random() * 6) + 1;
}

function roll4d6DropLowest() {
  let rolls = [rollD6(), rollD6(), rollD6(), rollD6()];
  let min = Math.min.apply(null, rolls);
  let minDropped = false;
  let kept = [];

  for (let i = 0; i < rolls.length; i++) {
    if (!minDropped && rolls[i] === min) {
      minDropped = true;
      continue;
    }
    kept.push(rolls[i]);
  }

  let total = kept.reduce(function (a, b) {
    return a + b;
  }, 0);

  return { rolls: rolls, kept: kept, dropped: min, total: total };
}

function rollAllScores() {
  let results = [];
  for (let i = 0; i < 6; i++) {
    results.push(roll4d6DropLowest());
  }
  return results;
}
//FIX STUFF
window.addEventListener("load", function () {
  let setupScreen = document.getElementById("setup-screen");
  let quizScreen = document.getElementById("quiz-screen");

  // CHANGE THIS LINE to be specific:
  let startButton = document.getElementById("manual-btn");

  let nameInput = document.getElementById("player-name");

  // This listener will now ONLY trigger for the manual button
  if (startButton) {
    startButton.addEventListener("click", function () {
      if (validateName()) {
        let characterName = nameInput.value.trim();

        setupScreen.style.display = "none";
        quizScreen.style.display = "block";
        quizScreen.dataset.characterName = characterName;

        let form = document.createElement("form");
        form.id = "character-form";

        quizScreen.innerHTML =
          "<h2>Manual Character Creation: " + characterName + "</h2>";
        quizScreen.appendChild(form);

        // ---- Helper: labelled dropdown ----
        function makeDropdown(labelText, id, name, optionList, isObject) {
          let lbl = document.createElement("label");
          lbl.textContent = labelText;
          lbl.htmlFor = id;
          form.appendChild(lbl);

          let sel = document.createElement("select");
          sel.id = id;
          sel.name = name;

          let def = document.createElement("option");
          def.value = "";
          def.textContent = "-- Select --";
          sel.appendChild(def);

          if (isObject) {
            for (let key in optionList) {
              let opt = document.createElement("option");
              opt.value = key;
              opt.textContent =
                key + " (+" + optionList[key].stats.join(", +") + ")";
              sel.appendChild(opt);
            }
          } else {
            for (let i = 0; i < optionList.length; i++) {
              let opt2 = document.createElement("option");
              opt2.value = optionList[i];
              opt2.textContent = optionList[i];
              sel.appendChild(opt2);
            }
          }

          form.appendChild(sel);
          return sel;
        }

        // ---- SECTION 1-4: Basic dropdowns ----
        let speciesSelect = makeDropdown(
          "Choose Your Species:",
          "species-select",
          "species",
          SPECIES,
          false,
        );
        let classSelect = makeDropdown(
          "Choose Your Class:",
          "class-select",
          "characterClass",
          CLASSES,
          false,
        );
        let bgSelect = makeDropdown(
          "Choose Your Background:",
          "background-select",
          "background",
          BACKGROUNDS,
          true,
        );
        let alignSelect = makeDropdown(
          "Choose Your Alignment:",
          "alignment-select",
          "alignment",
          ALIGNMENTS,
          false,
        );

        // ---- SECTION 5: Class Skill Selection ----
        // Shown/updated whenever the player changes their class selection.
        // The player picks exactly skillCount skills from their class's allowed list.
        // Background-granted skills are shown as already checked and locked.

        let skillHeading = document.createElement("h3");
        skillHeading.textContent = "Choose Your Skill Proficiencies";
        form.appendChild(skillHeading);

        let skillNote = document.createElement("p");
        skillNote.className = "prototype-note";
        skillNote.id = "skill-note";
        skillNote.textContent =
          "Select a class above to see your available skill choices.";
        form.appendChild(skillNote);

        let skillPickerDiv = document.createElement("div");
        skillPickerDiv.id = "skill-picker";
        form.appendChild(skillPickerDiv);

        // Rebuild skill checkboxes whenever class or background changes
        function rebuildSkillPicker() {
          skillPickerDiv.innerHTML = "";

          let chosenClass = classSelect.value;
          let chosenBg = bgSelect.value;

          if (!chosenClass) {
            skillNote.textContent =
              "Select a class above to see your available skill choices.";
            return;
          }

          let classInfo = CLASS_DATA[chosenClass];
          let bgSkills = chosenBg ? BACKGROUND_SKILLS[chosenBg] : [];
          let pool = classInfo.skillChoices;
          let count = classInfo.skillCount;

          skillNote.textContent =
            "Your background grants: " +
            (bgSkills.length ? bgSkills.join(", ") : "none") +
            ". " +
            "Now pick " +
            count +
            " skill" +
            (count > 1 ? "s" : "") +
            " from your class list below (max " +
            count +
            "):";

          // Track how many class skills are checked
          function updateCheckboxStates() {
            let checkboxes = skillPickerDiv.querySelectorAll(
              "input[type=checkbox].class-skill",
            );
            let checkedCount = 0;
            checkboxes.forEach(function (cb) {
              if (cb.checked) checkedCount++;
            });

            checkboxes.forEach(function (cb) {
              // Disable unchecked boxes once limit is reached
              cb.disabled = !cb.checked && checkedCount >= count;
            });

            // Update the counter label
            let counter = document.getElementById("skill-counter");
            if (counter) {
              counter.textContent = checkedCount + " / " + count + " selected";
              counter.style.color =
                checkedCount === count ? "green" : "inherit";
            }
          }

          // Counter display
          let counter = document.createElement("p");
          counter.id = "skill-counter";
          counter.style.fontWeight = "bold";
          counter.textContent = "0 / " + count + " selected";
          skillPickerDiv.appendChild(counter);

          // Render each skill in the class pool as a checkbox
          for (let i = 0; i < pool.length; i++) {
            let skillName = pool[i];
            let isBgGranted = bgSkills.indexOf(skillName) !== -1;

            let row = document.createElement("div");
            row.style.cssText =
              "display:flex;align-items:center;gap:8px;margin:4px 0;";

            let cb = document.createElement("input");
            cb.type = "checkbox";
            cb.value = skillName;
            cb.id = "skill-cb-" + skillName.replace(/\s/g, "-");

            if (isBgGranted) {
              // Background-granted: pre-checked and locked, visually distinct
              cb.checked = true;
              cb.disabled = true;
              cb.classList.add("bg-skill");
            } else {
              cb.classList.add("class-skill");
              cb.addEventListener("change", updateCheckboxStates);
            }

            let lbl = document.createElement("label");
            lbl.htmlFor = cb.id;
            lbl.textContent =
              skillName +
              " (" +
              SKILL_STAT_MAP[skillName].slice(0, 3).toUpperCase() +
              ")";
            if (isBgGranted) {
              lbl.style.cssText = "color:#888;font-style:italic;";
              lbl.textContent += " — from background";
            }

            row.appendChild(cb);
            row.appendChild(lbl);
            skillPickerDiv.appendChild(row);
          }

          // Also show background skills that aren't in the class pool (locked, informational)
          for (let b = 0; b < bgSkills.length; b++) {
            if (pool.indexOf(bgSkills[b]) === -1) {
              let extraRow = document.createElement("div");
              extraRow.style.cssText =
                "display:flex;align-items:center;gap:8px;margin:4px 0;";

              let extraCb = document.createElement("input");
              extraCb.type = "checkbox";
              extraCb.checked = true;
              extraCb.disabled = true;
              extraCb.classList.add("bg-skill");

              let extraLbl = document.createElement("label");
              extraLbl.textContent =
                bgSkills[b] +
                " (" +
                SKILL_STAT_MAP[bgSkills[b]].slice(0, 3).toUpperCase() +
                ")" +
                " — from background";
              extraLbl.style.cssText = "color:#888;font-style:italic;";

              extraRow.appendChild(extraCb);
              extraRow.appendChild(extraLbl);
              skillPickerDiv.appendChild(extraRow);
            }
          }

          updateCheckboxStates();
        }

        classSelect.addEventListener("change", rebuildSkillPicker);
        bgSelect.addEventListener("change", rebuildSkillPicker);

        // ---- SECTION 6: Equipment Selection ----
        // Shown/rebuilt when class changes. Each "pack" is a choice group;
        // always-items are shown locked. Player picks one option per group.

        let equipHeading = document.createElement("h3");
        equipHeading.textContent = "Choose Your Starting Equipment";
        form.appendChild(equipHeading);

        let equipNote = document.createElement("p");
        equipNote.className = "prototype-note";
        equipNote.id = "equip-note";
        equipNote.textContent =
          "Select a class above to see your equipment options.";
        form.appendChild(equipNote);

        let equipPickerDiv = document.createElement("div");
        equipPickerDiv.id = "equip-picker";
        form.appendChild(equipPickerDiv);

        // Track the radio group containers so we can collect values at submit
        let equipGroups = []; // [{type:"pick", radios:[...]}, {type:"always", items:[...]}]

        function rebuildEquipPicker() {
          equipPickerDiv.innerHTML = "";
          equipGroups = [];

          let chosenClass = classSelect.value;
          if (!chosenClass) {
            equipNote.textContent =
              "Select a class above to see your equipment options.";
            return;
          }

          equipNote.textContent = "Choose one option from each group below:";
          let packs = CLASS_EQUIPMENT[chosenClass];
          if (!packs) return;

          for (let p = 0; p < packs.length; p++) {
            let pack = packs[p];

            let groupDiv = document.createElement("div");
            groupDiv.style.cssText =
              "border:1px solid #ccc;border-radius:6px;padding:10px;margin:8px 0;";

            if (pack.always) {
              // Always-granted items — just show them, no choice needed
              let alwaysLabel = document.createElement("p");
              alwaysLabel.style.cssText = "font-weight:bold;margin:0 0 4px 0;";
              alwaysLabel.textContent = "Always included:";
              groupDiv.appendChild(alwaysLabel);

              let alwaysList = document.createElement("p");
              alwaysList.style.margin = "0";
              alwaysList.textContent = pack.always.join(", ");
              groupDiv.appendChild(alwaysList);

              equipGroups.push({ type: "always", items: pack.always });
            } else {
              // Pick-one group — render as radio buttons
              let pickLabel = document.createElement("p");
              pickLabel.style.cssText = "font-weight:bold;margin:0 0 6px 0;";
              pickLabel.textContent = "Choose one:";
              groupDiv.appendChild(pickLabel);

              let groupName = "equip-group-" + p;
              let radios = [];

              for (let o = 0; o < pack.options.length; o++) {
                let optionItems = pack.options[o];
                let row = document.createElement("div");
                row.style.cssText =
                  "display:flex;align-items:center;gap:8px;margin:4px 0;";

                let rb = document.createElement("input");
                rb.type = "radio";
                rb.name = groupName;
                rb.value = JSON.stringify(optionItems);
                rb.id = groupName + "-opt-" + o;
                if (o === 0) rb.checked = true; // default to first option

                let rbl = document.createElement("label");
                rbl.htmlFor = rb.id;
                rbl.textContent = optionItems.join(" + ");

                row.appendChild(rb);
                row.appendChild(rbl);
                groupDiv.appendChild(row);
                radios.push(rb);
              }

              equipGroups.push({ type: "pick", radios: radios });
            }

            equipPickerDiv.appendChild(groupDiv);
          }
        }

        // Rebuild equipment picker whenever class changes
        classSelect.addEventListener("change", rebuildEquipPicker);

        // ---- SECTION 7: Feat Selection ----
        let featHeading = document.createElement("h3");
        featHeading.textContent = "Choose Your Origin Feat";
        form.appendChild(featHeading);

        let featNote = document.createElement("p");
        featNote.className = "prototype-note";
        featNote.textContent =
          "At level 1, every character gains one Origin Feat. Pick one from the list below.";
        form.appendChild(featNote);

        let featPickerDiv = document.createElement("div");
        featPickerDiv.id = "feat-picker";
        featPickerDiv.style.cssText = "display:grid;gap:6px;";
        form.appendChild(featPickerDiv);

        for (let f = 0; f < FEATS.length; f++) {
          let feat = FEATS[f];
          let row = document.createElement("div");
          row.style.cssText =
            "display:flex;align-items:flex-start;gap:10px;border:1px solid #ccc;border-radius:6px;padding:8px;";

          let rb = document.createElement("input");
          rb.type = "radio";
          rb.name = "feat-choice";
          rb.value = feat.name;
          rb.id = "feat-" + f;
          if (f === 0) rb.checked = true;

          let lbl = document.createElement("label");
          lbl.htmlFor = rb.id;
          lbl.innerHTML =
            "<strong>" + feat.name + "</strong> — " + feat.description;
          lbl.style.cursor = "pointer";

          row.appendChild(rb);
          row.appendChild(lbl);
          featPickerDiv.appendChild(row);
        }

        // ---- SECTION 8: Dice Rolling ----
        let diceHeading = document.createElement("h3");
        diceHeading.textContent = "Roll Your Ability Scores";
        form.appendChild(diceHeading);

        let diceNote = document.createElement("p");
        diceNote.className = "prototype-note";
        diceNote.textContent =
          'Click "Roll Dice" to roll 4d6 for each ability score — the lowest die is dropped and the remaining three are summed. Then assign each result to a stat.';
        form.appendChild(diceNote);

        let rollResultsDiv = document.createElement("div");
        rollResultsDiv.id = "roll-results";
        rollResultsDiv.style.cssText =
          "background:rgba(0,0,0,0.05);border:1px solid #ccc;border-radius:8px;padding:12px;margin:10px 0;display:none;";
        form.appendChild(rollResultsDiv);

        let rollBtn = document.createElement("button");
        rollBtn.type = "button";
        rollBtn.className = "button";
        rollBtn.textContent = "🎲 Roll Dice";
        rollBtn.style.marginBottom = "16px";
        form.appendChild(rollBtn);

        let statAssignDiv = document.createElement("div");
        statAssignDiv.id = "stat-assign";
        statAssignDiv.style.display = "none";
        form.appendChild(statAssignDiv);

        let rolledScores = [];
        let statSelects = {};

        rollBtn.addEventListener("click", function () {
          rolledScores = rollAllScores();

          rollResultsDiv.style.display = "block";
          rollResultsDiv.innerHTML = "<strong>Your Rolls:</strong><br>";

          for (let i = 0; i < rolledScores.length; i++) {
            let r = rolledScores[i];
            let line = document.createElement("p");
            line.style.margin = "4px 0";
            let markedDrop = false;
            let diceDisplay = r.rolls
              .map(function (d) {
                if (!markedDrop && d === r.dropped) {
                  markedDrop = true;
                  return "<s style='color:#999'>" + d + "</s>";
                }
                return "<strong>" + d + "</strong>";
              })
              .join(" + ");
            line.innerHTML =
              "Roll " +
              (i + 1) +
              ": [" +
              diceDisplay +
              "] &rarr; <strong>" +
              r.total +
              "</strong>";
            rollResultsDiv.appendChild(line);
          }

          statAssignDiv.style.display = "block";
          statAssignDiv.innerHTML =
            "<h3>Assign Scores to Stats</h3>" +
            "<p class='prototype-note'>Each roll can only be assigned to one stat. " +
            "If you rolled the same number twice, you may assign it twice.</p>";

          statSelects = {};

          for (let s = 0; s < STATS.length; s++) {
            let statName = STATS[s];
            let lbl = document.createElement("label");
            lbl.textContent = statName + ":";
            lbl.htmlFor = "stat-" + statName;
            statAssignDiv.appendChild(lbl);

            let sel = document.createElement("select");
            sel.id = "stat-" + statName;
            sel.name = "stat-" + statName;
            sel.className = "stat-select";

            let defOpt = document.createElement("option");
            defOpt.value = "";
            defOpt.textContent = "-- Assign a score --";
            sel.appendChild(defOpt);

            // value = "rollIndex:total" so two rolls of 12 stay distinguishable
            for (let j = 0; j < rolledScores.length; j++) {
              let opt = document.createElement("option");
              opt.value = j + ":" + rolledScores[j].total;
              opt.textContent = rolledScores[j].total;
              sel.appendChild(opt);
            }

            statAssignDiv.appendChild(sel);
            statSelects[statName] = sel;
          }

          rollBtn.textContent = "🎲 Re-Roll Dice";
        });

        // ---- SECTION 7: Personality (multi-entry, max 3 each) ----
        let personalityHeading = document.createElement("h3");
        personalityHeading.textContent = "Character Personality";
        form.appendChild(personalityHeading);

        function makeMultiEntry(labelText, fieldId, maxEntries) {
          maxEntries = maxEntries || 3;
          let wrapper = document.createElement("div");
          wrapper.className = "multi-entry-group";
          wrapper.style.marginBottom = "16px";

          let groupLabel = document.createElement("p");
          groupLabel.style.fontWeight = "bold";
          groupLabel.style.marginBottom = "4px";
          groupLabel.textContent = labelText;
          wrapper.appendChild(groupLabel);

          let entriesDiv = document.createElement("div");
          entriesDiv.id = fieldId + "-entries";
          wrapper.appendChild(entriesDiv);

          let addBtn = document.createElement("button");
          addBtn.type = "button";
          addBtn.className = "button";
          addBtn.style.cssText =
            "font-size:0.8em;padding:4px 10px;margin-top:6px;";
          addBtn.textContent = "+ Add Another";
          wrapper.appendChild(addBtn);

          form.appendChild(wrapper);

          function addEntry() {
            if (entriesDiv.querySelectorAll("textarea").length >= maxEntries)
              return;
            let ta = document.createElement("textarea");
            ta.name = fieldId + "[]";
            ta.rows = 2;
            ta.placeholder = "Write a short description...";
            ta.style.cssText =
              "display:block;width:100%;margin-bottom:6px;box-sizing:border-box;";
            entriesDiv.appendChild(ta);
            if (entriesDiv.querySelectorAll("textarea").length >= maxEntries) {
              addBtn.style.display = "none";
            }
          }

          addEntry();
          addBtn.addEventListener("click", addEntry);

          return function getValues() {
            let values = [];
            entriesDiv.querySelectorAll("textarea").forEach(function (ta) {
              let v = ta.value.trim();
              if (v) values.push(v);
            });
            return values;
          };
        }

        let getTraits = makeMultiEntry(
          "Personality Traits:",
          "personality-traits",
          3,
        );
        let getIdeals = makeMultiEntry("Ideals:", "ideals", 3);
        let getBonds = makeMultiEntry("Bonds:", "bonds", 3);
        let getFlaws = makeMultiEntry("Flaws:", "flaws", 3);

        // ---- ERROR + SUBMIT ----
        let errorMsg = document.createElement("p");
        errorMsg.id = "error-message";
        errorMsg.style.cssText = "color:red;font-weight:bold;";
        errorMsg.textContent = "";
        form.appendChild(errorMsg);

        let submitBtn = document.createElement("button");
        submitBtn.type = "button";
        submitBtn.className = "button";
        submitBtn.textContent = "Generate My Character!";
        form.appendChild(submitBtn);

        // --------------------
        // EVENT LISTENERS
        // --------------------

        submitBtn.addEventListener("click", function () {
          errorMsg.textContent = "";

          let characterName = quizScreen.dataset.characterName;
          let species = speciesSelect.value;
          let charClass = classSelect.value;
          let background = bgSelect.value;
          let alignment = alignSelect.value;

          if (!species) {
            errorMsg.textContent = "Please choose a Species.";
            return;
          }
          if (!charClass) {
            errorMsg.textContent = "Please choose a Class.";
            return;
          }
          if (!background) {
            errorMsg.textContent = "Please choose a Background.";
            return;
          }
          if (!alignment) {
            errorMsg.textContent = "Please choose an Alignment.";
            return;
          }

          // ---- Validate skill selection ----
          let classInfo = CLASS_DATA[charClass];
          let bgSkills = BACKGROUND_SKILLS[background].slice();
          let requiredCount = classInfo.skillCount;

          let checkedClassSkills = [];
          let classCheckboxes = skillPickerDiv.querySelectorAll(
            "input.class-skill:checked",
          );
          classCheckboxes.forEach(function (cb) {
            checkedClassSkills.push(cb.value);
          });

          if (checkedClassSkills.length !== requiredCount) {
            errorMsg.textContent =
              "Please select exactly " +
              requiredCount +
              " skill" +
              (requiredCount > 1 ? "s" : "") +
              " from your class list. " +
              "You have selected " +
              checkedClassSkills.length +
              ".";
            return;
          }

          // ---- Validate dice were rolled ----
          if (rolledScores.length === 0) {
            errorMsg.textContent = "Please roll your ability scores first.";
            return;
          }

          // ---- Collect & validate stat assignments ----
          let assignedStats = {};
          let usedRollIndices = [];

          for (let s = 0; s < STATS.length; s++) {
            let statName = STATS[s];
            let val = statSelects[statName] ? statSelects[statName].value : "";
            if (!val) {
              errorMsg.textContent =
                "Please assign a score to " + statName + ".";
              return;
            }
            let parts = val.split(":");
            let rollIndex = parts[0];
            let scoreTotal = parseInt(parts[1]);

            if (usedRollIndices.indexOf(rollIndex) !== -1) {
              errorMsg.textContent =
                "You assigned the same roll to " +
                statName +
                " that you already used! Each roll can only go to one stat.";
              return;
            }
            usedRollIndices.push(rollIndex);
            assignedStats[statName] = scoreTotal;
          }

          // Apply background stat bonuses (+1 to each of the three eligible stats)
          let bgStatBonuses = BACKGROUNDS[background].stats;
          for (let b = 0; b < bgStatBonuses.length; b++) {
            assignedStats[bgStatBonuses[b]] += 1;
          }

          // ---- Calculate ability modifiers ----
          // formula: floor((score - 10) / 2)
          let modifiers = {};
          for (let m = 0; m < STATS.length; m++) {
            modifiers[STATS[m]] = abilityModifier(assignedStats[STATS[m]]);
          }

          // ---- Determine all proficient skills ----
          // Background skills are auto-granted; class skills are what the player just picked.
          // Merge them, no duplicates.
          let skillProficiencies = bgSkills.slice();
          for (let ck = 0; ck < checkedClassSkills.length; ck++) {
            if (skillProficiencies.indexOf(checkedClassSkills[ck]) === -1) {
              skillProficiencies.push(checkedClassSkills[ck]);
            }
          }

          // Saving throw proficiencies: auto-assigned by class (fixed in 2024 PHB)
          let savingThrowProficiencies = classInfo.savingThrows.slice();

          // ---- Calculate saving throw modifiers ----
          // Saved as raw modifier (stat mod) + a proficient flag.
          // The proficiency bonus (+2) is stored separately on the character object
          // so the sheet can display it independently and add it where needed.
          let savingThrows = {};
          for (let st = 0; st < STATS.length; st++) {
            let sName = STATS[st];
            savingThrows[sName] = {
              baseMod: modifiers[sName], // stat modifier alone
              proficient: savingThrowProficiencies.indexOf(sName) !== -1,
              // total = baseMod + (proficient ? proficiencyBonus : 0)
              // calculated on the sheet so proficiency bonus is visible separately
            };
          }

          // ---- Calculate skill modifiers ----
          // Same pattern: store the base modifier and proficiency flag separately.
          let skills = {};
          let allSkillNames = Object.keys(SKILL_STAT_MAP);
          for (let sk = 0; sk < allSkillNames.length; sk++) {
            let skillName = allSkillNames[sk];
            let linkedStat = SKILL_STAT_MAP[skillName];
            skills[skillName] = {
              baseMod: modifiers[linkedStat], // ability modifier only
              proficient: skillProficiencies.indexOf(skillName) !== -1,
              linkedStat: linkedStat,
              // total = baseMod + (proficient ? proficiencyBonus : 0)
            };
          }

          // ---- Collect equipment choices ----
          let chosenEquipment = [];
          for (let eg = 0; eg < equipGroups.length; eg++) {
            let group = equipGroups[eg];
            if (group.type === "always") {
              // Merge always-items (may include duplicates like "Dagger", "Dagger")
              for (let ai = 0; ai < group.items.length; ai++) {
                chosenEquipment.push(group.items[ai]);
              }
            } else {
              // Find which radio is checked in this pick group
              for (let ri = 0; ri < group.radios.length; ri++) {
                if (group.radios[ri].checked) {
                  let picked = JSON.parse(group.radios[ri].value);
                  for (let pi = 0; pi < picked.length; pi++) {
                    chosenEquipment.push(picked[pi]);
                  }
                  break;
                }
              }
            }
          }

          // ---- Collect feat choice ----
          let chosenFeat = "";
          let featRadios = featPickerDiv.querySelectorAll("input[type=radio]");
          for (let fr = 0; fr < featRadios.length; fr++) {
            if (featRadios[fr].checked) {
              chosenFeat = featRadios[fr].value;
              break;
            }
          }

          // ---- Build weapon attack rows from equipment ----
          // For each piece of equipment that matches a weapon in WEAPON_STATS,
          // generate an attack entry. Duplicate weapons (e.g. two Daggers) each
          // get their own row.
          let weaponsSeen = {};
          let weaponAttacks = [];
          for (let we = 0; we < chosenEquipment.length; we++) {
            let itemName = chosenEquipment[we];
            let wStats = WEAPON_STATS[itemName];
            if (!wStats) continue;

            // Count duplicates so we can label "Dagger 1", "Dagger 2"
            weaponsSeen[itemName] = (weaponsSeen[itemName] || 0) + 1;
            let displayName =
              weaponsSeen[itemName] > 1
                ? itemName + " " + weaponsSeen[itemName]
                : itemName;

            let statMod = modifiers[wStats.stat];
            let attackBonus = statMod + PROFICIENCY_BONUS;
            let damageMod = statMod >= 0 ? "+" + statMod : "" + statMod;

            weaponAttacks.push({
              name: displayName,
              attackBonus: (attackBonus >= 0 ? "+" : "") + attackBonus,
              damage: wStats.damage + damageMod,
              type: wStats.type,
              notes: wStats.notes,
            });
          }

          // Reset seen count so duplicate labels on second pass are correct
          weaponsSeen = {};
          for (let wa2 = 0; wa2 < weaponAttacks.length; wa2++) {
            // Strip " 2" suffix if there was only ever one of that weapon
            let baseName = weaponAttacks[wa2].name.replace(/ \d+$/, "");
            weaponsSeen[baseName] = (weaponsSeen[baseName] || 0) + 1;
          }
          for (let wa3 = 0; wa3 < weaponAttacks.length; wa3++) {
            let bn = weaponAttacks[wa3].name.replace(/ \d+$/, "");
            if (weaponsSeen[bn] === 1) {
              weaponAttacks[wa3].name = bn; // remove trailing " 1" if only one copy
            }
          }

          // ---- Apply feat effects to skills (Skilled feat) ----
          if (chosenFeat === "Skilled") {
            let allSkillNames2 = Object.keys(SKILL_STAT_MAP);
            let addedCount = 0;
            for (
              let sf = 0;
              sf < allSkillNames2.length && addedCount < 3;
              sf++
            ) {
              let sn = allSkillNames2[sf];
              if (skillProficiencies.indexOf(sn) === -1) {
                skillProficiencies.push(sn);
                skills[sn].proficient = true;
                addedCount++;
              }
            }
          }

          // ---- Collect cantrips + spells (class magic + feat magic) ----
          let classMagic = CLASS_MAGIC[charClass] || {
            cantrips: [],
            spells: [],
          };
          let cantrips = classMagic.cantrips.slice();
          let spells = classMagic.spells.slice();

          function mergeUnique(arr, additions) {
            for (let mu = 0; mu < additions.length; mu++) {
              if (arr.indexOf(additions[mu]) === -1) arr.push(additions[mu]);
            }
            return arr;
          }

          if (chosenFeat === "Magic Initiate (Wizard)") {
            mergeUnique(cantrips, ["Fire Bolt", "Mage Hand"]);
            mergeUnique(spells, ["Magic Missile"]);
          }
          if (chosenFeat === "Magic Initiate (Cleric)") {
            mergeUnique(cantrips, ["Sacred Flame", "Thaumaturgy"]);
            mergeUnique(spells, ["Cure Wounds"]);
          }
          if (chosenFeat === "Magic Initiate (Druid)") {
            mergeUnique(cantrips, ["Guidance", "Druidcraft"]);
            mergeUnique(spells, ["Entangle"]);
          }

          let HIT_DICE_LABELS = {
            Barbarian: "1d12",
            Fighter: "1d10",
            Paladin: "1d10",
            Ranger: "1d10",
            Bard: "1d8",
            Cleric: "1d8",
            Druid: "1d8",
            Monk: "1d8",
            Rogue: "1d8",
            Warlock: "1d8",
            Sorcerer: "1d6",
            Wizard: "1d6",
          };

          // ---- Build and save character object ----
          let characterData = {
            name: characterName,
            species: species,
            charClass: charClass,
            background: background,
            alignment: alignment,
            level: 1,
            proficiencyBonus: PROFICIENCY_BONUS,
            stats: assignedStats,
            modifiers: modifiers,
            savingThrows: savingThrows,
            skills: skills,
            skillProficiencies: skillProficiencies,
            savingThrowProficiencies: savingThrowProficiencies,
            equipment: chosenEquipment,
            weaponAttacks: weaponAttacks,
            feat: chosenFeat,
            featDescription: (function () {
              for (let fd = 0; fd < FEATS.length; fd++) {
                if (FEATS[fd].name === chosenFeat) return FEATS[fd].description;
              }
              return "";
            })(),
            cantrips: cantrips,
            spells: spells,
            personality: {
              traits: getTraits(),
              ideals: getIdeals(),
              bonds: getBonds(),
              flaws: getFlaws(),
            },
            languages: SPECIES_LANGUAGES[species] || ["Common"],
            hitDie: HIT_DICE_LABELS[charClass] || "1d8",
          };

          localStorage.setItem("dndCharacter", JSON.stringify(characterData));
          window.location.href = "generated-character.html";
        });
      }
    });
  }
});
