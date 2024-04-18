import express from 'express';


// rodar app - npm run dev

const app = express();

app.use(express.json())

app.listen(3030, () => console.log('Server Running on port: 3030...'))