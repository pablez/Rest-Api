// config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Usa la variable de entorno MONGODB_URI
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log(`MongoDB conectado exitosamente: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error conectando a MongoDB: ${error.message}`);
    process.exit(1); // Salir del proceso con fallo
  }
};

module.exports = connectDB;