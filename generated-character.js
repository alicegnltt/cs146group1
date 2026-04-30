// generated-character.js
// Populates generated-character.html using the character saved by quiz.js

window.addEventListener("load", function () {
    const savedData = localStorage.getItem("dndCharacter");
    if (!savedData) return;

    const character = JSON.parse(savedData);
    const profBonus = character.proficiencyBonus || 2;

    function fmt(n) {
        return (n >= 0 ? "+" : "") + n;
    }

    function safeText(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = value || "";
    }

    function joinPersonality(value) {
        if (!value) return "";
        if (Array.isArray(value)) return value.join(" • ");
        return value;
    }

    // ---- Basic info ----
    safeText("sheet-name", character.name);
    safeText("sheet-species", character.species);
    safeText("sheet-class", character.charClass);
    safeText("sheet-level", character.level);
    safeText("sheet-background", character.background);
    safeText("sheet-alignment", character.alignment);

    // ---- Ability scores ----
    const statNames = [
        "Strength",
        "Dexterity",
        "Constitution",
        "Intelligence",
        "Wisdom",
        "Charisma"
    ];

    statNames.forEach(function (stat) {
        safeText("score-" + stat, character.stats ? character.stats[stat] : "");
    });

    // ---- Proficiency Bonus ----
    safeText("sheet-prof-bonus", fmt(profBonus));

    // ---- Max HP ----
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
        Wizard: 6
    };

    const conMod = character.modifiers ? character.modifiers.Constitution || 0 : 0;
    const hitDie = HIT_DICE[character.charClass] || 8;
    const toughBonus = character.feat === "Tough" ? 2 : 0;

    let maxHp = hitDie + conMod + toughBonus;
    if (maxHp < 1) maxHp = 1;

    safeText("sheet-max-hp", maxHp);
    safeText("sheet-current-hp", maxHp);
    safeText("sheet-hit-dice", character.hitDie || "");

    // ---- Speed / AC / Initiative ----
    const dexMod = character.modifiers ? character.modifiers.Dexterity || 0 : 0;

    safeText("sheet-speed", "30 ft");

    let ac = 10 + dexMod;

    if (character.equipment) {
        const equip = character.equipment;

        if (equip.indexOf("Chain Mail") !== -1) {
            ac = 16;
        } else if (equip.indexOf("Scale Mail") !== -1) {
            ac = 14 + Math.min(dexMod, 2);
        } else if (equip.indexOf("Chain Shirt") !== -1) {
            ac = 13 + Math.min(dexMod, 2);
        } else if (equip.indexOf("Leather Armor") !== -1) {
            ac = 11 + dexMod;
        } else if (equip.indexOf("Studded Leather") !== -1) {
            ac = 12 + dexMod;
        }

        if (equip.indexOf("Shield") !== -1) {
            ac += 2;
        }
    }

    safeText("sheet-ac", ac);
    safeText("sheet-initiative", fmt(dexMod));

    // ---- Saving Throws ----
    if (character.savingThrows) {
        statNames.forEach(function (stat) {
            const stData = character.savingThrows[stat];
            if (!stData) return;

            const total = stData.baseMod + (stData.proficient ? profBonus : 0);

            safeText("st-" + stat, fmt(total));

            const dot = document.getElementById("st-dot-" + stat);
            if (dot && stData.proficient) {
                dot.classList.add("dot-filled");
            }
        });
    }

    // ---- Skills ----
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
        "Survival"
    ];

    if (character.skills) {
        allSkills.forEach(function (skill) {
            const skData = character.skills[skill];
            if (!skData) return;

            const total = skData.baseMod + (skData.proficient ? profBonus : 0);

            safeText("sk-" + skill, fmt(total));

            const dot = document.getElementById("sk-dot-" + skill);
            if (dot && skData.proficient) {
                dot.classList.add("dot-filled");
            }
        });
    }

    // ---- Passive Perception ----
    if (character.skills && character.skills.Perception) {
        const perception = character.skills.Perception;
        const perceptionTotal =
            perception.baseMod + (perception.proficient ? profBonus : 0);

        safeText("sheet-passive-perception", 10 + perceptionTotal);
    }

    // ---- Personality ----
    if (character.personality) {
        safeText("sheet-traits", joinPersonality(character.personality.traits));
        safeText("sheet-ideals", joinPersonality(character.personality.ideals));
        safeText("sheet-bonds", joinPersonality(character.personality.bonds));
        safeText("sheet-flaws", joinPersonality(character.personality.flaws));
    }

    // ---- Weapon Attacks ----
    const tbody = document.getElementById("attacks-tbody");
    if (tbody) {
        tbody.innerHTML = "";

        if (character.weaponAttacks && character.weaponAttacks.length > 0) {
            character.weaponAttacks.forEach(function (weapon) {
                const row = document.createElement("tr");

                row.innerHTML =
                    "<td>" + weapon.name + "</td>" +
                    "<td>" + weapon.attackBonus + "</td>" +
                    "<td>" + weapon.damage + " " + weapon.type + "</td>";

                tbody.appendChild(row);
            });
        }
    }

    // ---- Cantrips & Spells ----
    const spellsSection = document.getElementById("spells-section");
    const hasCantrips = character.cantrips && character.cantrips.length > 0;
    const hasSpells = character.spells && character.spells.length > 0;

    if (hasCantrips || hasSpells) {
        if (spellsSection) spellsSection.style.display = "block";

        safeText(
            "sheet-cantrips",
            hasCantrips ? character.cantrips.join(", ") : "None"
        );

        safeText(
            "sheet-spells",
            hasSpells ? character.spells.join(", ") : "None"
        );
    }

    // ---- Feat ----
    safeText("sheet-feat-name", character.feat);
    safeText("sheet-feat-desc", character.featDescription);

    // ---- Equipment ----
    const equipEl = document.getElementById("sheet-equipment");

    if (equipEl && character.equipment && character.equipment.length > 0) {
        const counts = {};
        const displayItems = [];
        const seen = {};

        character.equipment.forEach(function (item) {
            counts[item] = (counts[item] || 0) + 1;
        });

        character.equipment.forEach(function (item) {
            if (seen[item]) return;

            seen[item] = true;

            if (counts[item] > 1) {
                displayItems.push(item + " x" + counts[item]);
            } else {
                displayItems.push(item);
            }
        });

        equipEl.textContent = displayItems.join(", ");
    }
});