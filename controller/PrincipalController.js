let Seguridad = require('./SeguridadController')

var retornaObjeto = x => ( Object.keys(x.params).length === 0 ? x.body : x.params)

function ejecutaSP (nombre, params, res) {
	try {
		sp.exec(nombre, params).then(result=>{
			console.log(result.recordset)
			Seguridad.formatoRespuesta(1, 200, result.recordset, 1, res);
		}).catch(error=>{
            console.log(error);
			Seguridad.formatoRespuesta(0, 400, [], error, res);
		})
	} catch (ex) {
        console.log(ex);
		Seguridad.formatoRespuesta(0, 500, [], ex, res);
	}
}
exports.autentica = (req, res) => {
	
	sp.exec('spSel_ValidaUsuario_Movil', {
		 "par_usuario" : retornaObjeto(req).correo
		, "par_clave" : retornaObjeto(req).contrasena
		, "par_IMEI" : retornaObjeto(req).imei
	}).then(result=>{
		if(result.recordset[0].id_usuario > 0){
			return res.status(200).json({ "ok": 1, "token": Seguridad.generarToken(result.recordset)})
		} else {
			return res.status(400).json({ "ok": result.recordset[0].id_usuario, "mensaje": result.recordset[0].descripcion })
		}
	}).catch(error=>{
		Seguridad.formatoRespuesta(0, 400, [], error, res);
	})
}

///////////////////////////// Prueba Ionic ///////////////////////////////////////
exports.autentica2 = (req, res) => {
	sp.exec('spSel_ValidaUsuario_Movil', {
		 "par_usuario" : retornaObjeto(req).correo
		, "par_clave" : retornaObjeto(req).contrasena
		, "par_IMEI" : retornaObjeto(req).imei
	}).then(result=>{
		if(result.recordset[0].id_usuario > 0){
			return res.status(200).json({ "ok": 1, "data":result.recordset[0].id_usuario, "mensaje": result.recordset[0].descripcion, "token": Seguridad.generarToken(result.recordset)})
		} else {
			return res.status(200).json({ "": result.recordset[0].id_usuario, "mensaje": result.recordset[0].descripcion })
		}
	}).catch(error=>{
		Seguridad.formatoRespuesta(0, 400, [], error, res);
	})
}

exports.cantidadInventarios = (req, res) => {
	ejecutaSP('spSel_Inventarios_idUsuario', {
		"id_usuario" : retornaObjeto(req).id_usuario
	}, res)
}

exports.cantidadProductos = (req, res) => {
	ejecutaSP('spSel_Productos_idUsuario', {
		"id_usuario" : retornaObjeto(req).id_usuario
	}, res)
}

///////////////////////////// Prueba Ionic ///////////////////////////////////////


///////////////////////////// Prueba Ionic ///////////////////////////////////////


////////////////////////////////////////////////////////////////////////
/**
 * Realiza autenticación exclusiva para escritorio
 */
exports.autenticarDSKTP = (req, res) => {
    try {
        // console.log(retornaObjeto(req).usuario + " + " + retornaObjeto(req).pass + " " + retornaObjeto(req).MAC)
        // console.log(req);
        sp.exec('spSel_ValidaUsuario_PC', {
            par_usuario: retornaObjeto(req).usuario
            , par_clave: retornaObjeto(req).pass
            , par_MAC: retornaObjeto(req).MAC
        }).then(result => {
            if (result.recordset[0].id_usuario > 0) {
                Seguridad.formatoRespuesta(1, 200, { data: result.recordset[0], token: Seguridad.generarToken(result.recordset[0]) }, 1, res);
            } else {
                Seguridad.formatoRespuesta(1, 200, { data: result.recordset[0] }, 1, res);
            }
        }).catch(error => {
            Seguridad.formatoRespuesta(0, 400, [], error, res);
        })
    } catch (ex) {
        Seguridad.formatoRespuesta(0, 500, [], ex, res);
    }
}
exports.listaPuntosRFID = (req, res) => {
        ejecutaSP('spSel_ListaPuntosRFID', {
            par_idUsuario: retornaObjeto(req).idUsuario,
            par_idCliente: retornaObjeto(req).idCliente,
            par_idProyecto: retornaObjeto(req).idProyecto,
            par_idLocacion: retornaObjeto(req).idLocacion,
            par_idArea: retornaObjeto(req).idArea,
            par_idTipoIngreso: retornaObjeto(req).idTipoIngreso,
            par_IMEI_MAC: retornaObjeto(req).IMEI_MAC
        },res)
}


exports.listaMenu = (req, res) => {
    ejecutaSP('spSel_listaMenu', {
        par_idUsuario: retornaObjeto(req).id_usuario
        , par_idCliente: retornaObjeto(req).id_cliente
        , par_idProyecto: retornaObjeto(req).id_proyecto
        , par_idLocacion: retornaObjeto(req).id_locacion
    }, res)
}





//////////////////////////////////////////////////////////////////////////







///////////////////////////// ubicaciones generales ///////////////////////////////////////

exports.listaCliente = (req, res) => {
	ejecutaSP('spSel_listaCliente_idUsuario', {
		"par_idUsuario" : retornaObjeto(req).id_usuario
	}, res)
}

exports.listaProyectos = (req, res) => {
	ejecutaSP('spSel_listaProyectos_idUsuario', {
		"par_idUsuario" : retornaObjeto(req).id_usuario,
		"par_idCliente" : retornaObjeto(req).id_cliente
	}, res)
}

exports.listaLocaciones = (req, res) => {
	ejecutaSP('spSel_listaLocaciones_idUsuario', {
		"par_idUsuario" : retornaObjeto(req).id_usuario,
		"par_idCliente" : retornaObjeto(req).id_cliente,
		"par_idProyecto" : retornaObjeto(req).id_proyecto
	}, res)
}

exports.listaAreas = (req, res) => {
	ejecutaSP('spSel_listaAreas_idUsuario', {
		"par_idUsuario" : retornaObjeto(req).id_usuario,
		"par_idCliente" : retornaObjeto(req).id_cliente,
		"par_idProyecto" : retornaObjeto(req).id_proyecto,
		"par_idlocacion" : retornaObjeto(req).id_locacion
	}, res)
}

///////////////////////////// Todos los productos de la base de datos ///////////////////////////////////////

exports.maestraItem = (req, res) => {
	ejecutaSP('spSel_MaestraItem', {
		"par_idUsuario" : retornaObjeto(req).id_usuario,
		"par_idCliente" : retornaObjeto(req).id_cliente,
		"par_idProyecto" : retornaObjeto(req).id_proyecto,
		"par_idlocacion" : retornaObjeto(req).id_locacion
	}, res)
}

///////////////////////////// Permiso para los botones ///////////////////////////////////////


exports.selPermisos = (req, res) => {
	ejecutaSP('spSel_Permisos', {
		"par_idUsuario" : retornaObjeto(req).id_usuario,
		"par_idTipo" : retornaObjeto(req).id_tipo,
		"par_idVista" : retornaObjeto(req).id_vista
	}, res)
}

///////////////////////////// Enlace de productos ///////////////////////////////////////

exports.insEnlazar = (req, res) => {
	
	ejecutaSP('spIns_Enlazar', {
		"par_idUsuario" : retornaObjeto(req).id_usuario,
		"par_idCliente" : retornaObjeto(req).id_cliente,
		"par_idProyecto" : retornaObjeto(req).id_proyecto,
		"par_idlocacion" : retornaObjeto(req).id_locacion,
		"par_idArea" : retornaObjeto(req).id_area,
		"par_codigoBarra" : retornaObjeto(req).sku,
		"par_idItem" : retornaObjeto(req).id_item,
		"par_RFID" : retornaObjeto(req).rfid,
		"par_tipo" : retornaObjeto(req).tipo,
		"par_idTipoIngreso": retornaObjeto(req).tipo_ingreso,
		"par_IMEI_MAC" : retornaObjeto(req).imei_mac,
		"par_contenedor" : retornaObjeto(req).contenedor
	}, res)
	
}

exports.buscarNombreItem = (req, res) =>  {
	ejecutaSP('spSel_BuscarItemMaestra',{
		"par_idUsuario" : retornaObjeto(req).id_usuario,
		"par_idCliente" : retornaObjeto(req).id_cliente,
		"par_idProyecto" : retornaObjeto(req).id_proyecto,
		"par_idLocacion" : retornaObjeto(req).id_locacion,
		"par_idArea" : retornaObjeto(req).id_area,
		"par_codigoBarra" : retornaObjeto(req).sku,

	}, res)
}

exports.epcItemGrabar = (req, res) => {
	ejecutaSP('spSel_EPCItemGrabar',{
		"par_idUsuario" : retornaObjeto(req).id_usuario,
		"par_idCliente" : retornaObjeto(req).id_cliente,
		"par_idProyecto" : retornaObjeto(req).id_proyecto,
		"par_idLocacion" : retornaObjeto(req).id_locacion,
		"par_idArea" : retornaObjeto(req).id_area,
		"par_idItem" : retornaObjeto(req).id_item

	}, res)
}

exports.listaItemMaestra = (req, res) => {
	ejecutaSP('spSel_ListaItemMaestra',{
		"par_idUsuario" : retornaObjeto(req).id_usuario,
		"par_idCliente" : retornaObjeto(req).id_cliente,
		"par_idProyecto" : retornaObjeto(req).id_proyecto,
		"par_idLocacion" : retornaObjeto(req).id_locacion,
		"par_idArea" : retornaObjeto(req).id_area,
		"par_NombreItem" : retornaObjeto(req).nombre_item,
		"par_idTipoLista" : retornaObjeto(req).id_tipolista

	}, res)
}

///////////////////////////// Desenlace de productos ///////////////////////////////////////

exports.desenlazarRfid = (req, res) => {
	console.log("----- desenlace -----")
	console.log(req.body)
	console.log("----- desenlace -----")
	ejecutaSP('spSel_Desenlazar_RFID', {
		"par_idUsuario" : retornaObjeto(req).id_usuario,
		"par_idCliente" : retornaObjeto(req).id_cliente,
		"par_idProyecto" : retornaObjeto(req).id_proyecto,
		"par_idlocacion" : retornaObjeto(req).id_locacion,
		"par_RFID" : retornaObjeto(req).rfid,
		"par_tipo" : retornaObjeto(req).tipo,
		"par_idTipoIngreso": retornaObjeto(req).tipo_ingreso,
		"par_IMEI_MAC" : retornaObjeto(req).imei_mac
	}, res)
}

exports.nombreItemRfid = (req, res) => {
	ejecutaSP('spSel_NombreItem_RFID', {
		"par_idUsuario" : retornaObjeto(req).id_usuario,
		"par_idCliente" : retornaObjeto(req).id_cliente,
		"par_idProyecto" : retornaObjeto(req).id_proyecto,
		"par_idlocacion" : retornaObjeto(req).id_locacion,
		"par_RFID" : retornaObjeto(req).rfid,
		"par_tipo" : retornaObjeto(req).tipo,
		"par_idTipoIngreso": retornaObjeto(req).tipo_ingreso,
		"par_IMEI_MAC" : retornaObjeto(req).imei_mac
	}, res)
}



///////////////////////////// Lista rfid de productos asociados a un sku ///////////////////////////////////////

exports.listaRFID = (req, res) => {
	ejecutaSP('spSel_listaRFID_item', {
		"par_idUsuario" : retornaObjeto(req).id_usuario,
		"par_idCliente" : retornaObjeto(req).id_cliente,
		"par_idProyecto" : retornaObjeto(req).id_proyecto,
		"par_idlocacion" : retornaObjeto(req).id_locacion,
		"par_codigoItem" : retornaObjeto(req).item
	}, res)
}

///////////////////////////// Inventario ///////////////////////////////////////

exports.inventarioArea = (req, res) => {
	ejecutaSP('spSel_listaInventarios_area', {
		"par_idUsuario" : retornaObjeto(req).id_usuario,
		"par_idCliente" : retornaObjeto(req).id_cliente,
		"par_idProyecto" : retornaObjeto(req).id_proyecto,
		"par_idlocacion" : retornaObjeto(req).id_locacion,
		"par_idArea" : retornaObjeto(req).id_area,
		"par_idTipoIngreso": retornaObjeto(req).tipo_ingreso,
		"par_IMEI_MAC" : retornaObjeto(req).imei_mac
	}, res)
}

exports.listaRFIDLeidos = (req, res) => {
	//console.log("procedimiento_lista_rfid_leidos");
	ejecutaSP('spSel_listaRFID_Leidos', {
		"par_idUsuario" : retornaObjeto(req).id_usuario,
		"par_idCliente" : retornaObjeto(req).id_cliente,
		"par_idProyecto" : retornaObjeto(req).id_proyecto,
		"par_idlocacion" : retornaObjeto(req).id_locacion,
		"par_idArea" : retornaObjeto(req).id_area,
		"par_idInventario" : retornaObjeto(req).id_inventario,
		"par_lecturaRFID" : retornaObjeto(req).rfid,
		"par_idTipoIngreso": retornaObjeto(req).tipo_ingreso,
		"par_IMEI_MAC" : retornaObjeto(req).imei_mac
		
	}, res)
}



/////////////////////////////////// Entrada ////////////////////////////////////////////////

exports.listoDocumentosInOut = (req, res) => {
	ejecutaSP('spSel_listaDocumentos_InOut', {
		"par_idUsuario" : retornaObjeto(req).id_usuario,
		"par_idCliente" : retornaObjeto(req).id_cliente,
		"par_idProyecto" : retornaObjeto(req).id_proyecto,
		"par_idLocacion" : retornaObjeto(req).id_locacion,
		"par_idArea" : retornaObjeto(req).id_area,
		"par_idTipo" : retornaObjeto(req).id_tipo
	}, res)
}

exports.listaRfidDocInOut = (req, res) => {
	ejecutaSP('spSel_listaRFID_Documentos_InOut', {
		"par_idUsuario" : retornaObjeto(req).id_usuario,
		"par_idCliente" : retornaObjeto(req).id_cliente,
		"par_idProyecto" : retornaObjeto(req).id_proyecto,
		"par_idLocacion" : retornaObjeto(req).id_locacion,
		"par_idArea" : retornaObjeto(req).id_area,
		"par_idDcto" : retornaObjeto(req).id_documento,
		"par_TipoDcto": retornaObjeto(req).tipo_documento,
		"par_NumDcto" : retornaObjeto(req).numero_documento,
		"par_IdProveedor" : retornaObjeto(req).id_proveedor,
		"par_LecturaRFID" : retornaObjeto(req).lectura_rfid
	}, res)
}

exports.validaPermisoUsuario = (req, res) => {
	ejecutaSP('spSel_ValidaUsuario_permisos', {
		"par_usuario" : retornaObjeto(req).id_usuario,
		"par_clave" : retornaObjeto(req).clave,
		"par_IMEI_MAC" : retornaObjeto(req).imei_mac,
		"par_tipoRFID" : retornaObjeto(req).tipoRfid,
		"par_parametro1" : retornaObjeto(req).tipoMovimiento
	
	}, res)
}


exports.lisaRfidDocInOutEnviar = (req, res) => {
	ejecutaSP('spIns_listaRFID_Documentos_InOut', {
		"par_idUsuario" : retornaObjeto(req).id_usuario,
		"par_idCliente" : retornaObjeto(req).id_cliente,
		"par_idProyecto" : retornaObjeto(req).id_proyecto,
		"par_idLocacion" : retornaObjeto(req).id_locacion,
		"par_idArea" : retornaObjeto(req).id_area,
		"par_idDcto" : retornaObjeto(req).id_documento,
		"par_TipoDcto": retornaObjeto(req).tipo_documento,
		"par_NumDcto" : retornaObjeto(req).numero_documento,
		"par_IdProveedor" : retornaObjeto(req).id_proveedor,
		"par_LecturaRFID" : retornaObjeto(req).lectura_rfid,
		"par_observacion" : retornaObjeto(req).observacion,
		"par_idUsuario_envio": retornaObjeto(req).id_usuario_envio,
		"par_id_tipo_lector" : retornaObjeto(req).tipo_lector,
		"par_IMEI_MAC" : retornaObjeto(req).imei_mac
	}, res)
}








///////////////////////////// Salida - metodos se utilizan en otras funciones///////////////////////////////////////

exports.listaDocSalida = (req, res) => {
	ejecutaSP('spSel_listaDctoSalida_area', {
		"par_idUsuario" : retornaObjeto(req).id_usuario,
		"par_idCliente" : retornaObjeto(req).id_cliente,
		"par_idProyecto" : retornaObjeto(req).id_proyecto,
		"par_idlocacion" : retornaObjeto(req).id_locacion,
		"par_idArea" : retornaObjeto(req).id_area
	}, res)
}

exports.listaLocacionesOriDes = (req, res) => {
	ejecutaSP('spSel_lista_locaciones_OriDes', {
		"par_idUsuario" : retornaObjeto(req).id_usuario,
		"par_idCliente" : retornaObjeto(req).id_cliente,
		"par_idProyecto" : retornaObjeto(req).id_proyecto,
		"par_idlocacion" : retornaObjeto(req).id_locacion,
		"par_idArea" : retornaObjeto(req).id_area,
		"par_idTipoMovimiento" : retornaObjeto(req).movimiento
	}, res)
}

exports.filtroGenerico = (req, res) => {
	ejecutaSP('spSel_filtroGenerico', {
		"par_idUsuario" : retornaObjeto(req).id_usuario,
		"par_idCliente" : retornaObjeto(req).id_cliente,
		"par_idProyecto" : retornaObjeto(req).id_proyecto,
		"par_idlocacion" : retornaObjeto(req).id_locacion,
		"par_tipoFiltro" : retornaObjeto(req).tipo_filtro,
		"par_segmento" : retornaObjeto(req).segmento
	}, res)
}

exports.listaRfidLeidosDespacho = (req, res) => {
	ejecutaSP('spSel_listaRFID_Leidos_Despacho', {
		"par_idUsuario" : retornaObjeto(req).id_usuario,
		"par_idCliente" : retornaObjeto(req).id_cliente,
		"par_idProyecto" : retornaObjeto(req).id_proyecto,
		"par_idlocacion" : retornaObjeto(req).id_locacion,
		"par_idArea" : retornaObjeto(req).id_area,
		"par_lecturaRFID" : retornaObjeto(req).rfid,
		"par_idDctoSalida" : retornaObjeto(req).id_documento,
		"par_idLocacionDst" : retornaObjeto(req).id_locDestino,
		"par_idPkg" : retornaObjeto(req).id_pkg
	}, res)
}

exports.listaRfidDespacho = (req, res) => {
	ejecutaSP('spIns_listaRFID_Despacho', {
		"par_idUsuario" : retornaObjeto(req).id_usuario,
		"par_idCliente" : retornaObjeto(req).id_cliente,
		"par_idProyecto" : retornaObjeto(req).id_proyecto,
		"par_idLocacion" : retornaObjeto(req).id_locacion,
		"par_idArea" : retornaObjeto(req).id_area,
		"par_lecturaRFID" : retornaObjeto(req).rfid,
		"par_idDctoSalida" : retornaObjeto(req).id_documento,
		"par_idLocacionDst" : retornaObjeto(req).id_locDestino,
		"par_idPkg" : retornaObjeto(req).id_pkg
	}, res)
}


///////////////////////////// Movimiento - parte final ///////////////////////////////////////

exports.listaRfidLeidosMovimiento = (req, res) => {
	ejecutaSP('spSel_listaRFID_Leidos_Movimientos', {
		"par_idUsuario" : retornaObjeto(req).id_usuario,
		"par_idCliente" : retornaObjeto(req).id_cliente,
		"par_idProyecto" : retornaObjeto(req).id_proyecto,
		"par_idLocacion" : retornaObjeto(req).id_locacion,
		"par_idArea" : retornaObjeto(req).id_area,
		"par_idTipoMovimiento" : retornaObjeto(req).movimiento,
		"par_idLocacionOriDes" : retornaObjeto(req).locacion_orides,
		"par_idAreaOriDes" : retornaObjeto(req).area_orides,
		"par_IMEI_MAC" : retornaObjeto(req).imei_mac,
		"par_lecturaRFID" : retornaObjeto(req).rfid
	}, res)
}
exports.listaRfidSalida = (req, res) => {
	ejecutaSP('spIns_listaRFID_Salida', {
		"par_idUsuario" : retornaObjeto(req).id_usuario,
		"par_idCliente" : retornaObjeto(req).id_cliente,
		"par_idProyecto" : retornaObjeto(req).id_proyecto,
		"par_idLocacion" : retornaObjeto(req).id_locacion,
		"par_idArea" : retornaObjeto(req).id_area,
		"par_idTipoMovimiento" : retornaObjeto(req).movimiento,
		"par_idLocacionOriDes" : retornaObjeto(req).locacionOriDes,
		"par_lecturaRFID" : retornaObjeto(req).rfid
	}, res)
}

exports.listaRfidMovimiento = (req, res) => {
	ejecutaSP('spIns_listaRFID_Movimiento', {
		"par_idUsuario" : retornaObjeto(req).id_usuario,
		"par_idCliente" : retornaObjeto(req).id_cliente,
		"par_idProyecto" : retornaObjeto(req).id_proyecto,
		"par_idLocacion" : retornaObjeto(req).id_locacion,
		"par_idArea" : retornaObjeto(req).id_area,
		"par_idTipoMovimiento" : retornaObjeto(req).movimiento,
		"par_idLocacionOriDes" : retornaObjeto(req).locacionOriDes,
		"par_idAreaOriDes" : retornaObjeto(req).areaOriDes,
		"par_lecturaRFID" : retornaObjeto(req).rfid,
		"par_IMEI_MAC" : retornaObjeto(req).imei_mac,
		"par_id_lector_RFID" : retornaObjeto(req).id_lector_rfid

	}, res)
}

///////////////////////////// no recuerdo su uso ///////////////////////////////////////

exports.fichaProyecto = (req, res) => {
	ejecutaSP('spSel_FichaProyecto', {
		"par_idUsuario" : retornaObjeto(req).id_usuario,
		"par_idCliente" : retornaObjeto(req).id_cliente,
		"par_idProyecto" : retornaObjeto(req).id_proyecto,
		"par_idlocacion" : retornaObjeto(req).id_locacion,
		"par_idArea" : retornaObjeto(req).id_area
		
	}, res)
}


///////////////////////////// Textos utilizados en la aplicacion ///////////////////////////////////////

exports.textoMovil = (req, res) => {
	ejecutaSP('spSel_textos_Movil', {
		"par_IMEI" : retornaObjeto(req).imei,
		"par_idIdioma" : retornaObjeto(req).idioma
		
	}, res)
}

///////////////////////////// Búsqueda /////////////////////////////////

exports.busquedaEpc_Century = (req, res) =>{
	ejecutaSP('spSel_BusquedaEPC_Century', {
		"par_idUsuario" : retornaObjeto(req).id_usuario,
		"par_idCliente" : retornaObjeto(req).id_cliente,
		"par_idProyecto" : retornaObjeto(req).id_proyecto,
		"par_Codigo_Item" : retornaObjeto(req).item
	}, res)
}