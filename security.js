//security.js
//This file contains functions related to security, such as sanitizing user input to prevent XSS attacks.

//escape HTML special characters in a string to prevent XSS attacks
function escapeHTML(str){
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

//Sanitize user input by removing any HTML tags and trimming whitespace
function sanitizeInput(input){
    // remove any HTML tags and trim surrounding whitespace
    return String(input)
        .replace(/<[^>]*>/g, "")
        .trim();
}

//limits user input length to prevent abuse / overflow
function validateLength(str, maxLength){
    return String(str).substring(0, maxLength);
}

//parses json input from local storage
//should prevent crashing / other malicious tampering
function parseJSON(jsonString){
    try{
        return JSON.parse(jsonString);
    }catch (e){
        return null;
    }
}

//ensures all required fields are present and of the correct type in a character object
function validateCharacter(character){
    return character &&
        typeof character.name === "string" &&
        Array.isArray(character.abilityScores) &&
        Array.isArray(character.savingThrows) &&
        Array.isArray(character.skills) &&
        Array.isArray(character.weaponAttacks);
}