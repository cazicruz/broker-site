require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./Config/corsOption');
const { logger } = require('./Middleware/logEvents');
const errorHandler = require('./Middleware/errorHandler');
//const verifyJWT = require('./Middleware/verifyJWT');
const cookieParser = require('cookie-parser');
//const credentials = require('./Middleware/credentials');
const mongoose = require('mongoose');
const connectDB = require('./Config/dbConfig');
const PORT = process.env.PORT || 3500;
const multer = require('multer');
const {multerConfig} = require('./Config/multerConfig');
const ApiError = require('./Utils/apiError');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc')
//multer config
const upload = multer({storage: multerConfig});

const options={
    definition:{
        openapi:'3.0.0',
        info:{
            title:'Task MLM Api',
            version:'1.0.0',
            description:'Task MLM Api'
        },
        servers:[
            {
                url:'https://broker-site.onrender.com/api'
            }
        ],
        components: {
            securitySchemes: {
                ApiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'x-access-token',
                },
            },
        },
    },
    apis:['./Routes/*.js']
}
const swaggerDocs = swaggerJsDoc(options);
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocs));
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

//  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// routes
app.get('/',(req,res)=>{
    res.send('hello')
});
app.use('/api/auth', require('./Routes/auth.route'));
app.use('/api/users', require('./Routes/users.route'));
app.use('/api/payment', require('./Routes/payment.route'));
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/refresh', require('./routes/refresh'));
// app.use('/api/logout', require('./routes/logout'));

// app.use(verifyJWT);
// app.use('/api/employees', require('./routes/api/employees'));
// app.use('/api/users', require('./routes/api/users'));

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(async(err, req, res, next) =>{
  errorHandler(err, res)});

// Error handling middleware
// app.use((err, req, res, next) => {
//     if (err instanceof ApiError) {
//       // If the error is an instance of ApiError, it's a custom structured error
//       res.status(err.statusCode).json({
//         status: err.status,
//         message: err.message,
//       });
//     } else {
//       // Handle other types of errors
//       console.error(err); // Log the error for debugging
//       res.status(500).json({
//         status: 'error',
//         message: 'Internal Server Error',
//       });
//     }
//   });

process.on("uncaughtException", (error) => {
    errorHandler(error);
    if (!errorHandler.isTrustedError(error)) {
      process.exit(1);
    }
  });

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});