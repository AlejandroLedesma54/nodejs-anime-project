import { Router } from "express";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";

const routerDirector = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const directorsFilePath = path.join(__dirname, '../../data/directors.json');


const readDirectorsFile = () => {
    const directors = fs.readFileSync(directorsFilePath, 'utf8');
    return JSON.parse(directors)
};


const writeDirectorFile = (directors) => {
    fs.writeFileSync(directorsFilePath, JSON.stringify(directors, null, 2));
};

routerDirector.post('/', (req, res) => {
    const directors = readDirectorsFile();
    const newDirector = {
        id: directors.length + 1,
        name: req.body.name,
    }
    directors.push(newDirector);
    writeDirectorFile(directors);
    res.status(201).json({"message": "Director added successfully!!", "Director": newDirector});
});

routerDirector.get('/', (req, res) => {
    const directors = readDirectorsFile();
    res.json(directors);
});

routerDirector.get('/:id', (req, res) => {
    const directors = readDirectorsFile();
    const Director = directors.find(a => a.id === parseInt(req.params.id));
    if(!Director) return res.status(400).send("Director not found");
    res.status(200).json(Director);
});

routerDirector.put('/:id', (req, res) => {
    const directors = readDirectorsFile();
    const DirectorIndex = directors.findIndex(a => a.id === parseInt(req.params.id));
    if(DirectorIndex === -1) return res.status(400).send("Director not found");
    const updatedDirector = {
        ...directors[DirectorIndex],
        name: req.body.name,       // Obtener el nombre del cuerpo de la solicitud
    }
    directors[DirectorIndex] = updatedDirector;
    writeDirectorFile(directors);
    res.status(200).json({"message": "The Director has been updated successfully", "Director": updatedDirector});

});

routerDirector.delete('/:id', (req, res) => {
    let directors = readDirectorsFile();
    const Director = directors.find(a => a.id === parseInt(req.params.id));
    if(!Director) return res.status(400).send("Director not found");
    directors = directors.filter(a => a.id !== Director.id);
    writeDirectorFile(directors);
    res.json({"message": "Director has been deleted successfully"})

});


export default routerDirector;