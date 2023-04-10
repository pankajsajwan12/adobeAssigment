import express from 'express';
import bodyParser  from 'body-parser';
import cors from   'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import {register} from './controllers/auth.js'
import {createUserPost} from './controllers/userPosts.js'
import  {loginRoutes} from './routes/loginRoutes.js';
import  {userRoutes} from './routes/usersRoutes.js';
import  {postRoutes} from './routes/postRoutes.js';
import { verifyToken } from './middleware/middleware.js';


dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit : '30mb' , extended : true}));
app.use(bodyParser.urlencoded({ limit : '30mb', extended : true}));
app.use(cors());


// ROUTES WITH 
app.post("/auth/register",register)
app.post("/posts" , verifyToken  ,createUserPost)

// ROUTES
app.use("/auth", loginRoutes);
app.use("/user", userRoutes);
app.use("/post", postRoutes);


// MONGOOSE SETUP
const PORT = process.env.PORT || 3001
mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser : true,
    useUnifiedTopology : true
}).then(() => {
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
})
.catch((err) => console.log(`${err} is not connected`));
