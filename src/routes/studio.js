import { Router } from "express";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";

const routerStudio = Router();

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const studioFilePath = path.join(__dirname, '../../data/studio.json');

const readStudioFile = () => {
    const studios = fs.readFileSync(studioFilePath, 'utf8');
    return JSON.parse(studios)
};

const writeStudioFile = (studios) => {
    fs.writeFileSync(studioFilePath, JSON.stringify(studios, null, 2));
};


routerStudio.post('/', (req,res) => {
    const studios = readStudioFile();
    const newStudio = {
        id: studios.length + 1,
        nameStudio: req.body.nameStudio
    }
    studios.push(newStudio);
    writeStudioFile(studios);
    res.status(201).json({"message": "Studio has been created successfully", "newStudio": newStudio});

});

routerStudio.get('/', (req, res) => {
    const studios = readStudioFile();
    res.status(200).json(studios);
});

routerStudio.get('/:id', (req, res) => {
    const studios = readStudioFile();
    const studio = studios.find(s => s.id === parseInt(req.params.id));
    if(!studio) return res.status(404).json({"error": "Studio not found"});
    res.status(200).json(studio);
    
});

routerStudio.put('/:id', (req, res) => {
    const studios = readStudioFile();
    const studioIndex = studios.findIndex(s => s.id === parseInt(req.params.id));
    const updateStudio = {
        ...studios[studioIndex],
        nameStudio: req.body.nameStudio
    }
    if(studioIndex === -1) return res.status(404).json({"error": "Studio not found"});
    studios[studioIndex] = updateStudio;
    writeStudioFile(studios);
    res.status(200).json({"message": "Studio has been updated successfully", "updatedStudio": updateStudio});
});

export default routerStudio;