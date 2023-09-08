const express = require("express");
const app = express();
const { generateToken, verifyToken } = require("./utils/jwt.js");
// Recordar que en jwt no manejamos sessiones, las sessiones las maneja el frontend.
// No me funcione con ThunderCliente, si con postman

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

let users = [];

app.get("/", (req, res) => {
  res.json({
    status: "runing",
    Date: new Date(),
  });
});

app.post("/register", (req, res) => {
  let user = users.find((email) => email == req.body.email);
  if (user) {
    return res
      .status(401)
      .json({ error: `El usuario ${req.body.email} ya existe` });
  }
  newUser = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };
  users.push(newUser);
  const token = generateToken({
    // Llamamos a nuestra funcion que genera el token pero NO le mandamos el password
    name: req.body.name,
    email: req.body.email,
  });
  res.status(201).json({ ...newUser, access_token: token }); // Al arreglo del nuevo usuario le agrego la propiedad access_token con el token que generamos y retornamos un objeto con los datos del usuario mas el token.
});

const authMiddleware = async (req, res, next) => {
  //console.log(req.headers.authorization) // Este es el token
  const token =
    req.headers.authorization &&
    req.headers.authorization.replace("Bearer ", "");
  // Obtenemos el token que nos envian desde el front, el token viaja en el headers de la peticion como Authorization
  // Al valor Authorization por convencion se le agrega 'Bearer ' es por eso que en la linea de arriba al req.headers.authorization le sacamos el 'Bearer ' .
  // y de esta manera obtenemos el toquen que nos enviaron.
  if (!token) {
    return res.status(401).json({ error: "Necesitas enviar un token" });
  }
  try {
    const payload = await verifyToken(token); // En esta linea pasamos el token obtenido por la funcion verifyToken para chequear que le token sea el correcto
    req.user = payload.user; // Al req le inyectamos la propiedad user con el valor obtenido en la linea anterior.
  } catch (e) {
    return res.status(401).json({ error: "Token invalido" });
  }
  return next();
};

app.get("/profile", authMiddleware, (req, res) => {  // Cuando hacemos el post a profile recordad enviarle el 'Bearer xxxx' en el header Authorization.
  // cuando vamos a la ruta profile ejecutamos el middleware para obtener los datos y corroborar que el token sea el correcto.
  return res.json(req.user); // El req.user no tiene nada que ver con el de session cuando trabajabamos con sesiones.
});

const PORT = 8080;
app.listen(PORT, () =>
  console.log(`Servidor express corriendo en el puerto ${PORT}`)
); // Al server de express lo guardamos en una variable

//Ruta incorrecta
app.use((req, res) => {
  res.status(404).send({ Error: "La ruta deseada no existe" });
});
