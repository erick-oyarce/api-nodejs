let jwt = require('jsonwebtoken')
let config = require('../config')

exports.protegeRuta = function (req, res, next) {
	let token = req.body.token || req.query.token || req.headers['x-api-key'];
	if (token) {
		if (!validarToken(token)) {
			formatoRespuesta(0, 403, [],'Token invalido', res)
		} else {
            next();
		}
	} else {
		return res.status(403).send({
            "error": true
            , "message": "TOKEN INVALIDO"
		});
	}
}
function validarToken (tkn) {
	var salida = false;
	jwt.verify(tkn, config.jwt_secreto, function (err) {
		if (!err) {
			salida = true;
		}
	});
	return salida;
}
exports.generarToken = function (datos, expiracion = config.jwt_expiracion) {
	let token = jwt.sign({
		data: datos
	}, config.jwt_secreto, { expiresIn: expiracion })
	return token;
}
exports.formatoRespuesta = function (exitoP, status, data, mensajeP = true, res) {
	var datos = {
		exito: exitoP,
		mensaje: mensajeP == true ? "Ejecutado correctamente" : mensajeP,
		resultado: data
	}
	return res.status(status).json({ datos });
} 

formatoRespuesta = function (exitoP, status, data, mensajeP = true, res) {
	var datos = {
		exito: exitoP,
		mensaje: mensajeP == true ? "Ejecutado correctamente" : mensajeP,
		resultado: data
	}
	return res.status(status).json({ datos });
} 
