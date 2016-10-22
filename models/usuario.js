var mongoose = require('mongoose');

var UsuarioSchema = new mongoose.Schema({
  "id":  {type: Number, default: 0},
  "id_str": String,
  "phone_number": String,
  "nombre":String,
  "apellido":String,  
  "fecha_nacimiento":String, 
  "sexo": String  // M o F
});

module.exports = mongoose.model('Usuario',UsuarioSchema,'usuario');



