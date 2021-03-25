const dotenv = require('dotenv');
dotenv.config({
    path: './config.env'
});

const app = require('./app');

// start the server
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Application is running on port ${port}`);
});

process.on('unhandledRejection', err => {
    console.log('Unhandled rejection shutting down');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});