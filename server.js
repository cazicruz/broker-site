require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./Config/corsOption');
const { logger } = require('./Middleware/logEvents');
//const errorHandler = require('./Middleware/errorHandler');
//const verifyJWT = require('./Middleware/verifyJWT');
const cookieParser = require('cookie-parser');
//const credentials = require('./Middleware/credentials');
const mongoose = require('mongoose');
const connectDB = require('./Config/dbConfig');
const PORT = process.env.PORT || 3500;
const multer = require('multer');
const {multerConfig} = require('./Config/multerConfig');

//multer config
const upload = multer({storage: multerConfig});

// Connect to MongoDB
connectDB();

// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
//app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors('*'));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static files
app.use('/public', express.static(path.join(__dirname, '/public')));

// routes
app.get('/',(req,res)=>{
    res.send('hello')
});
app.use('/api/auth', require('./Routes/auth.route'));
app.use('/api/task', require('./Routes/task.route'));
app.use('/api/users', require('./Routes/users.route'));
app.use('api/vip', require('./Routes/vip.route'))
app.use('/api/payment', require('./Routes/payment.route'));
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/refresh', require('./routes/refresh'));
// app.use('/api/logout', require('./routes/logout'));

// app.use(verifyJWT);
// app.use('/api/employees', require('./routes/api/employees'));
// app.use('/api/users', require('./routes/api/users'));

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

//app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});