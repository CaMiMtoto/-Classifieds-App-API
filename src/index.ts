import express, {Application, Request, Response} from 'express';
import indexRouter from './routes/index';
import categoriesRoutes from './routes/categories';
import authRoutes from './routes/auth';
import mongoose from 'mongoose';

const app: Application = express();
const port: number = 3000;

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/', indexRouter);
app.use('/api/categories', categoriesRoutes);
app.use('/api/auth', authRoutes);

// connect to mongodb database
mongoose.set("strictQuery", false);
mongoose.connect('mongodb://localhost:27017/classified')
    .then(r => {
        console.log('Connected to MongoDB :', r.connection.name);
    }).catch(err => {
    console.log('Error connecting to MongoDB ', err);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

export default app;