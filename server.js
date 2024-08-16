const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// Carrega variáveis de ambiente(desenvolvimento/produção)
dotenv.config({ path: './config/config.env' });

// Conecta ao banco de dados
connectDB();

// Arquivos de rota
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');

const app = express();

// Body parser
app.use(express.json());

// Middleware para registros em ambiente de desenvolvimento
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Monta as rotas
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);

//Has to be after bootcamps to be used in bootcamps
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Fecha o server e finaliza o processo
  server.close(() => process.exit(1));
});
