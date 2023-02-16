import express, {Application, Request, Response} from 'express';
import indexRouter from './routes/index';
import categoriesRoutes from './routes/categories';
import authRoutes from './routes/auth';
import productsRoutes from './routes/products';
import mongoose from 'mongoose';
import dotenv from "dotenv";
import logger  from "morgan";

dotenv.config();


const app: Application = express();
const port: any = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
// serve static files from public folder
app.use(express.static('public'));


app.use('/', indexRouter);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/products', productsRoutes);

// connect to mongodb database
mongoose.set("strictQuery", false);
const connectionString = process.env.MONGODB_URI || "mongodb://localhost:27017/your-db-name"
mongoose.connect(connectionString)
    .then(r => {
        console.log('Connected to MongoDB :', r.connection.name);
    }).catch(err => {
    console.log('Error connecting to MongoDB ', err);
});

app.listen(port, /*"192.168.162.112", */() => {
    console.log(`Example app listening at http://localhost:${port}`);
});

export default app;