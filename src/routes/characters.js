import { Router } from "express";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";

const routerCharacter = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const charactersFilePath = path.join(__dirname, '../../data/characters.json');


const readCharactersFile = () => {
    const characters = fs.readFileSync(charactersFilePath, 'utf8');
    return JSON.parse(characters)
};


const writeCharacterFile = (characters) => {
    fs.writeFileSync(charactersFilePath, JSON.stringify(characters, null, 2));
};

routerCharacter.post('/', (req, res) => {
    const characters = readCharactersFile();
    const newCharacter = {
        id: characters.length + 1,
        name: req.body.name,
        animeId: req.body.animeId
    }
    characters.push(newCharacter);
    writeCharacterFile(characters);
    res.status(201).json({"message": "Character added successfully!!", "character": newCharacter});
});

routerCharacter.get('/', (req, res) => {
    const characters = readCharactersFile();
    res.json(characters);
});

routerCharacter.get('/:id', (req, res) => {
    const characters = readCharactersFile();
    const character = characters.find(a => a.id === parseInt(req.params.id));
    if(!character) return res.status(400).send("Character not found");
    res.status(200).json(character);
});

routerCharacter.put('/:id', (req, res) => {
    const characters = readCharactersFile();
    const characterIndex = characters.findIndex(a => a.id === parseInt(req.params.id));
    if(characterIndex === -1) return res.status(400).send("Character not found");
    const updatedCharacter = {
        ...characters[characterIndex],
        name: req.body.name,       // Obtener el nombre del cuerpo de la solicitud
        animeId: req.body.animeId  
    }
    characters[characterIndex] = updatedCharacter;
    writeCharacterFile(characters);
    res.status(200).json({"message": "The character has been updated successfully", "character": updatedCharacter});

});

routerCharacter.delete('/:id', (req, res) => {
    let characters = readCharactersFile();
    const character = characters.find(a => a.id === parseInt(req.params.id));
    if(!character) return res.status(400).send("Character not found");
    characters = characters.filter(a => a.id !== character.id);
    writeCharacterFile(characters);
    res.json({"message": "Character has been deleted successfully"})

});


export default routerCharacter;