import express from 'express';
import dotenv from 'dotenv';
import errorHandler from './middlewares/error-handler.js';
import routerAnime from './routes/animes.js';
import routerStudio from './routes/studio.js';
import routerCharacter from './routes/characters.js';
import routerDirector from './routes/directors.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/animes", routerAnime);
app.use("/studios", routerStudio);
app.use("/characters", routerCharacter);
app.use("/directors", routerDirector);
app.use(errorHandler);


app.listen(PORT, () => {
    console.log(`Listen on port ${PORT}`);
})