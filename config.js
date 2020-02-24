module.exports = {
	domain : '*',
	puerto : 8081,
	jwt_secreto : '613f1330104db730cc8190bc8e3d97bf',
	jwt_expiracion : '8h',
	dbconexion: {
		host: '127.0.0.1',
		user: 'admin',
		pass: '',
		dbname: 'prueba'
    },
    correo: {
        "usuario": "correo_origen@gmail.com"
        , "pass": "123"
        , "to": "correo_destino@gmail.com " //se utiliza como respaldo de información
        
    }
}
