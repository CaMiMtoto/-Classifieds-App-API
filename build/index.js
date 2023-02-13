"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./routes/index"));
const categories_1 = __importDefault(require("./routes/categories"));
const auth_1 = __importDefault(require("./routes/auth"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use('/', index_1.default);
app.use('/api/categories', categories_1.default);
app.use('/api/auth', auth_1.default);
// connect to mongodb database
mongoose_1.default.set("strictQuery", false);
const connectionString = process.env.MONGODB_URI || "mongodb://localhost:27017/your-db-name";
mongoose_1.default.connect(connectionString)
    .then(r => {
    console.log('Connected to MongoDB :', r.connection.name);
}).catch(err => {
    console.log('Error connecting to MongoDB ', err);
});
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
exports.default = app;
