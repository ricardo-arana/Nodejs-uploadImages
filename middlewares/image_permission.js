var Imagen = require("../models/imagenes");

module.exports = function(imagen,req,res){
	if(req.method === "GET" && req.path.indexOf("edit") < 0){
		return true;
	}

	if(imagen.creator._id.toString() == res.locals.user._id){
		//esta imagen yo la subi
		return true;
	}

	return true;
}