import express from 'express';
import { router } from './routes/route_main';


// rodar app - npm run dev

const app = express();

app.use(express.json())
app.use(router)

app.listen(3030, () => console.log('Server Running on port: 3030...'))