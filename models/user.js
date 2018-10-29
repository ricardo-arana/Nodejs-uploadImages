var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.connect("mongodb://localhost/fotos",{useNewUrlParser: true});

var posibles_valores = ["M","F"];
var match_correo = [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,"Colocar un email valido"];

var user_schema = new Schema({
	name: String,
	username: {type:String, required: true, maxlength: [50,"Username muy grande"]},
	password: {type:String, minlength:[8,"Password es muy corto"],
				validate: {
					validator: validar_password_confirmation,
					message: "contranseñas no son iguales"
				}
},
	age: {type: Number, min:[5,"La edad menor que 5"],max:[100,"La edad no puedo ser mayor a 100"]},
	email: {type: String, required: "El correo es obligatorio", match: match_correo},
	date_of_birth: Date,
	sex: {type:String,enum : {values: posibles_valores , message:"Opción no válida" }}
});

user_schema.virtual("password_confirmation").get(function(){
	return this.pc;
}).set(function(password){
	this.pc = password;
});

var User = mongoose.model("User",user_schema);
module.exports.User = User;

//validaciones
function validar_password_confirmation(p){
	return this.password_confirmation == p;
	}
/*
String
Number
Date
Buffer
Boolean
Mixed
Objectid
Array
*/