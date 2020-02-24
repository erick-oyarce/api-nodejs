let express = require('express')
let bodyParser = require('body-parser')
let cors = require('cors')
let sqlsp = require('sqlstoreprocedure')

require('events').EventEmitter.defaultMaxListeners = Infinity;
let config = require('./config')
sp = new sqlsp(config.dbconexion.user, config.dbconexion.host, config.dbconexion.dbname, config.dbconexion.pass);

let Principal = require('./controller/PrincipalController')
let Seguridad = require('./controller/SeguridadController')
let EnvioCorreo = require('./controller/EnvioCorreoInventario')

var app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(cors())
app.set('port', config.puerto)

app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', config.domain)
	res.setHeader('Access-Control-Allow-Methods', 'POST,GET')
	res.setHeader('Content-Type', 'application/json')
	next()
});

let rutas = express.Router()

rutas.get('/', function(req, res) {
	res.send({
		'Mensaje': 'Bienvenido a la API REST!'
	})
})

rutas.route('/Autentica/').post(Principal.autentica)

///////////////////////////// Prueba Ionic ///////////////////////////////////////
rutas.route('/Autentica2/').post(Principal.autentica2)
rutas.route('/InventariosUsuario/').post(Principal.cantidadInventarios)
rutas.route('/ProductosUsuario/').post(Principal.cantidadProductos)
///////////////////////////// Prueba Ionic ///////////////////////////////////////

///////////////////////////// Desktop ///////////////////////////////////////
rutas.route('/AutenticarDsktp').post(Principal.autenticarDSKTP)
rutas.route('/ListaCliente/:id_usuario?').get(Principal.listaCliente)
rutas.route('/ListaMenu').post(Seguridad.protegeRuta, Principal.listaMenu)
rutas.route('/listaPuntosRFID').post(Principal.listaPuntosRFID)

///////////////////////////// Desktop ///////////////////////////////////////


///////////////////////////// Datos generales para la aplicación ///////////////////////////////////////
rutas.route('/ListaCliente/').post(Seguridad.protegeRuta, Principal.listaCliente) 
rutas.route('/ListaProyectos/').post(Seguridad.protegeRuta, Principal.listaProyectos)
rutas.route('/ListaLocaciones/').post(Seguridad.protegeRuta, Principal.listaLocaciones)
rutas.route('/ListaAreas/').post(Seguridad.protegeRuta, Principal.listaAreas)
rutas.route('/MaestraItem/').post(Seguridad.protegeRuta, Principal.maestraItem)
rutas.route('/SeleccionarPermisos/').post(Seguridad.protegeRuta, Principal.selPermisos) //permisos para los botones
rutas.route('/ListaRFID').post(Seguridad.protegeRuta, Principal.listaRFID) // devuelve una lista rfid de productos asociados a un sku
rutas.route('/FichaProyecto').post(Seguridad.protegeRuta, Principal.fichaProyecto)
rutas.route('/TextoMovil').post(Seguridad.protegeRuta, Principal.textoMovil) //textos que no recuerdo para que son


///////////////////////////// Enlace - descenlace de productos ///////////////////////////////////////
rutas.route('/Enlazar/').post(Seguridad.protegeRuta, Principal.insEnlazar)
rutas.route('/DesenlazarRfid').post(Seguridad.protegeRuta, Principal.desenlazarRfid)
rutas.route('/NombreItemRfid').post(Seguridad.protegeRuta, Principal.nombreItemRfid)
rutas.route('/BuscarNombreMaestra').post(Principal.buscarNombreItem)
rutas.route('/EpcItemGrabar').post(Principal.epcItemGrabar)
rutas.route('/ListaItemMaestra').post(Principal.listaItemMaestra)



///////////////////////////// Inventario ///////////////////////////////////////
rutas.route('/InventarioArea').post(Seguridad.protegeRuta, Principal.inventarioArea)
rutas.route('/ListaRFIDLeidos').post(Seguridad.protegeRuta, Principal.listaRFIDLeidos)
rutas.route('/ListaRFIDInventario').post(Seguridad.protegeRuta, EnvioCorreo.listaRFIDInventario)


///////////////////////////// Movimiento ///////////////////////////////////////
rutas.route('/ListaLocacionesOriDes').post(Seguridad.protegeRuta, Principal.listaLocacionesOriDes)
rutas.route('/FiltroGenerico').post(Seguridad.protegeRuta, Principal.filtroGenerico)
rutas.route('/ListaRFIDLeidosMovimiento').post(Seguridad.protegeRuta, Principal.listaRfidLeidosMovimiento) 
//rutas.route('/NombreItemRfid').post(Principal.nombreItemRfid)  se reutiliza la dirección solo para ver los datelles de los productos
//rutas.route('/ListaRFIDLeidos').post(Principal.listaRFIDLeidos) se utiliza nuevamente la dirección
rutas.route('/ListaRfidSalida').post(Seguridad.protegeRuta, Principal.listaRfidSalida)
rutas.route('/ListaRfidMovimiento').post(Seguridad.protegeRuta, Principal.listaRfidMovimiento)


///////////////////////////// Salida ///////////////////////////////////////
rutas.route('/ListaDocSalidaArea').post(Seguridad.protegeRuta, Principal.listaDocSalida)
rutas.route('/ListaRfidLeidosDespacho').post(Seguridad.protegeRuta, Principal.listaRfidLeidosDespacho)
//rutas.route('/ListaLocacionesOriDes').post( Principal.listaLocacionesOriDes) se reutiliza para llenar un spinner y elegir una ubicación diferente
rutas.route('/ListaRfidDespacho').post(Seguridad.protegeRuta, Principal.listaRfidDespacho)

///////////////////////////// Entrada ////////////////////////////////////
rutas.route('/ListaDocumentosInOut').post(Principal.listoDocumentosInOut)
rutas.route('/ListaRfidDocInOut').post(Principal.listaRfidDocInOut)
rutas.route('/PermisosUsuarioAdmin').post(Principal.validaPermisoUsuario)
rutas.route('/ListaRfidDocInOutEnviar').post(Principal.lisaRfidDocInOutEnviar)

///////////////////////////// Búsqueda ////////////////////////////////////
rutas.route('/BusquedaEpcCentury').post(Principal.busquedaEpc_Century)


app.use(rutas)
app.listen(config.puerto, function() {
	console.log(`http://localhost:${config.puerto}`)
})

