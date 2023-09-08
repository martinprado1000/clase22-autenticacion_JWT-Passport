const jwt = require("jsonwebtoken");

const PRIVATE_KEY = "LlaveSecreta";

const generateToken = (payload) => {  // Esta funcion genera el token con los datos que le mande mas la clave secreta que le pasamos.
  const token = jwt.sign({ user: payload }, PRIVATE_KEY, { expiresIn: "24h" }); //expiresIn: "24", tiempo en que expira el token
  return token;
};
// Esta funcion genera el token con los datos que le mande mas la clave secreta.

const verifyToken = (token) => {
  console.log(token)
  return new Promise((resolve, reject) => {
    jwt.verify(token, PRIVATE_KEY, (err, payload) => {  //
      if (err) {
        console.log("ERROR EN EL TOKEN")
        return reject(err);
      }
      return resolve(payload);
    });
  });
};
 
module.exports = {
  generateToken,
  verifyToken,
};
