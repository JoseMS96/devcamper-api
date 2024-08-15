const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Carregamento das variaveis de ambiente
dotenv.config({ path: './config/config.env' });

// Carregamento dos models
const Bootcamp = require('./models/Bootcamp');

// Conexão ao BD
mongoose.connect(process.env.MONGO_URI);

// Leitura dos arquivos JSON
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);

// Importando ao BD
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);

    console.log('Data imported...'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();

    console.log('Data Obliterated...'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
