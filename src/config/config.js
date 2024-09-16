const dotenv = require("dotenv");
const { Command } = require("commander");
const path = require("path");

const program = new Command();

// Define las opciones de línea de comandos
program
  .option("-d, --debug", "Enable debug mode", false)
  .option("-p, --port <port>", "Server port", 8080)
  .option("--mode <mode>", "Operating mode", "develop");

// Parsea las opciones de línea de comandos
program.parse(process.argv);

const options = program.opts();
const environment = options.mode;

// Carga el archivo de variables de entorno según el modo seleccionado
dotenv.config({
  path: path.resolve(
    __dirname,
    environment === "production" ? ".env.production" : ".env.development"
  ),
});

module.exports = {
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.PORT_DB,
    database: process.env.DB_NAME
  },
  EMAIL_USER:process.env.EMAIL_USER,
  EMAIL_PASS:process.env.EMAIL_PASS,
  FRONTEND_URL:process.env.FRONTEND_URL,
  BACKEND_URL: process.env.BACKEND_URL,
  STRIPE_SECRET_KEY:process.env.STRIPE_SECRET_KEY
};
