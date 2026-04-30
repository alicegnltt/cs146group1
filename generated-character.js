// generated-character.js

window.addEventListener("load", function () {
  const savedData = localStorage.getItem("dndCharacter");
  if (!savedData) return;

  const character = parseCharacter(savedData);
  if (!character) return;

  const profBonus = safeNumber(character.proficiencyBonus, 2);

  const HIT_DICE = {
    Barbarian: 12,
    Fighter: 10,
    Paladin: 10,
    Ranger: 10,
    Bard: 8,
    Cleric: 8,
    Druid: 8,
    Monk: 8,
    Rogue: 8,
    Warlock: 8,
    Sorcerer: 6,
    Wizard: 6,
  };

  const statNames = [
    "Strength",
    "Dexterity",
    "Constitution",
    "Intelligence",
    "Wisdom",
    "Charisma",
  ];

  const allSkills = [
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
  ];

  function parseCharacter(data) {
    try {
      const parsed = JSON.parse(data);

      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        console.warn("Invalid character data.");
        return null;
      }

      return parsed;
    } catch (error) {
      console.warn("Could not parse character data.");
      return null;
    }
  }

  function safeText(value, maxLength = 200) {
    if (value === null || value === undefined) return "";

    return String(value).replace(/[<>]/g, "").trim().slice(0, maxLength);
  }

  function safeNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function fmt(value) {
    const number = safeNumber(value, 0);
    return number >= 0 ? "+" + number : String(number);
  }

  function setText(id, value, maxLength = 200) {
    const el = document.getElementById(id);
    if (el) el.textContent = safeText(value, maxLength);
  }

  function joinSafe(value) {
    if (Array.isArray(value)) {
      return value.map((item) => safeText(item, 100)).join(" • ");
    }

    return safeText(value, 200);
  }

  function hasEquipment(name) {
    if (!Array.isArray(character.equipment)) return false;

    return character.equipment.some(function (item) {
      return safeText(item, 100) === name;
    });
  }

  // Basic info
  setText("sheet-name", character.name, 100);
  setText("sheet-species", character.species, 60);
  setText("sheet-class", character.charClass, 60);
  setText("sheet-level", character.level, 10);
  setText("sheet-background", character.background, 120);
  setText("sheet-alignment", character.alignment, 60);

  // Ability scores
  statNames.forEach(function (stat) {
    const score = character.stats && character.stats[stat];
    setText("score-" + stat, safeNumber(score, ""), 6);
  });

  // Proficiency bonus
  setText("sheet-prof-bonus", fmt(profBonus), 10);

  // HP and hit dice
  const charClass = safeText(character.charClass, 60);
  const conMod = character.modifiers
    ? safeNumber(character.modifiers.Constitution, 0)
    : 0;

  const hitDie = HIT_DICE[charClass] || 8;
  const level = safeNumber(character.level, 1);
  const toughBonus = character.feat === "Tough" ? 2 * level : 0;

  let maxHp = hitDie + conMod + toughBonus;
  if (maxHp < 1) maxHp = 1;

  setText("sheet-max-hp", maxHp, 10);
  setText("sheet-current-hp", maxHp, 10);
  setText("sheet-hit-dice", "1d" + hitDie, 20);
  setText(
    "sheet-languages",
    character.languages && character.languages.length
      ? character.languages.join(", ")
      : "Common",
    200,
  );

  // Speed, AC, initiative
  const dexMod = character.modifiers
    ? safeNumber(character.modifiers.Dexterity, 0)
    : 0;

  setText("sheet-speed", "30 ft", 20);
  setText("sheet-initiative", fmt(dexMod), 10);

  let ac = 10 + dexMod;

  if (hasEquipment("Chain Mail")) {
    ac = 16;
  } else if (hasEquipment("Scale Mail")) {
    ac = 14 + Math.min(dexMod, 2);
  } else if (hasEquipment("Chain Shirt")) {
    ac = 13 + Math.min(dexMod, 2);
  } else if (hasEquipment("Studded Leather")) {
    ac = 12 + dexMod;
  } else if (hasEquipment("Leather Armor")) {
    ac = 11 + dexMod;
  }

  if (hasEquipment("Shield")) ac += 2;

  setText("sheet-ac", ac, 10);

  // Saving throws
  if (character.savingThrows && typeof character.savingThrows === "object") {
    statNames.forEach(function (stat) {
      const data = character.savingThrows[stat];
      if (!data || typeof data !== "object") return;

      const baseMod = safeNumber(data.baseMod, 0);
      const total = baseMod + (data.proficient ? profBonus : 0);

      setText("st-" + stat, fmt(total), 10);

      const dot = document.getElementById("st-dot-" + stat);
      if (dot && data.proficient) {
        dot.classList.add("dot-filled");
      }
    });
  }

  // Skills
  if (character.skills && typeof character.skills === "object") {
    allSkills.forEach(function (skill) {
      const data = character.skills[skill];
      if (!data || typeof data !== "object") return;

      const baseMod = safeNumber(data.baseMod, 0);
      const total = baseMod + (data.proficient ? profBonus : 0);

      setText("sk-" + skill, fmt(total), 10);

      const dot = document.getElementById("sk-dot-" + skill);
      if (dot && data.proficient) {
        dot.classList.add("dot-filled");
      }
    });
  }

  // Passive perception
  if (character.skills && character.skills.Perception) {
    const perception = character.skills.Perception;
    const percTotal =
      safeNumber(perception.baseMod, 0) +
      (perception.proficient ? profBonus : 0);

    setText("sheet-passive-perception", 10 + percTotal, 10);
  }

  // Personality
  const personality = character.personality || {};

  setText("sheet-traits", joinSafe(personality.traits), 300);
  setText("sheet-ideals", joinSafe(personality.ideals), 300);
  setText("sheet-bonds", joinSafe(personality.bonds), 300);
  setText("sheet-flaws", joinSafe(personality.flaws), 300);

  // Weapon attacks
  const tbody = document.getElementById("attacks-tbody");

  if (tbody) {
    tbody.textContent = "";

    if (Array.isArray(character.weaponAttacks)) {
      character.weaponAttacks.forEach(function (weapon) {
        if (!weapon || typeof weapon !== "object") return;

        const tr = document.createElement("tr");

        const nameTd = document.createElement("td");
        nameTd.textContent = safeText(weapon.name, 80);

        const attackTd = document.createElement("td");
        attackTd.textContent = safeText(weapon.attackBonus, 40);

        const damageTd = document.createElement("td");
        damageTd.textContent =
          safeText(weapon.damage, 40) + " " + safeText(weapon.type, 40);

        tr.appendChild(nameTd);
        tr.appendChild(attackTd);
        tr.appendChild(damageTd);

        tbody.appendChild(tr);
      });
    }
  }

  // Cantrips and spells
  const spellsSection = document.getElementById("spells-section");
  const hasCantrips =
    Array.isArray(character.cantrips) && character.cantrips.length > 0;
  const hasSpells =
    Array.isArray(character.spells) && character.spells.length > 0;

  if (hasCantrips || hasSpells) {
    if (spellsSection) spellsSection.style.display = "block";

    setText(
      "sheet-cantrips",
      hasCantrips
        ? character.cantrips.map((item) => safeText(item, 80)).join(", ")
        : "None",
      500,
    );

    setText(
      "sheet-spells",
      hasSpells
        ? character.spells.map((item) => safeText(item, 80)).join(", ")
        : "None",
      500,
    );
  }

  // Feat
  setText("sheet-feat-name", character.feat, 100);
  setText("sheet-feat-desc", character.featDescription, 300);

  // Equipment
  const equipEl = document.getElementById("sheet-equipment");

  if (equipEl && Array.isArray(character.equipment)) {
    const counts = {};
    const displayItems = [];

    character.equipment.forEach(function (item) {
      const cleanItem = safeText(item, 100);
      if (!cleanItem) return;

      counts[cleanItem] = (counts[cleanItem] || 0) + 1;
    });

    Object.keys(counts).forEach(function (item) {
      displayItems.push(counts[item] > 1 ? item + " x" + counts[item] : item);
    });

    equipEl.innerHTML = displayItems
      .map(function (item) {
        return "<li>" + item + "</li>";
      })
      .join("");
  }
});
