let date = new Date();

let nodemailer = require("nodemailer")
let fs = require('fs')
const pathExcel = 'C:\\ApiCenturyCloudHandheldDsktp\\reporteinventario.xlsx'
const nombreExcel = 'inventario '+date+'.xlsx'
let Seguridad = require('./SeguridadController')
let config = require('../config')

var excel = require ( 'excel4node' );





var retornaObjeto = x => ( Object.keys(x.params).length === 0 ? x.body : x.params)

// const enviarCorreo =  async function(correoTo, correoCC, asunto) {
// 	let transporter = nodemailer.createTransport({
// 		host: 'smtp.office365.com',
// 		port: 587,
// 		secure: false,
// 		auth: {
// 			user: config.correo.usuario
// 			, pass: config.correo.pass
// 		}, tls: {
// 			rejectUnauthorized: false
// 		}
//     });
    
// 	let info = await transporter.sendMail({
//         from: config.correo.usuario,
// 		to: correoTo, // list of receivers
//         subject: asunto, // Subject line
//         cc: correoCC,
// 		html: `<p>Se adjunta Excel con inventario Century Cloud</p>`, // html body
// 		attachments: [{filename: nombreExcel, path:pathExcel}]
// 	});
// }
const borrarArchivoInventario = () => {
    if(fs.existsSync(pathExcel)) {
        fs.unlink(pathExcel, (err)=>{ 
            if(err){
                throw err;

            }else{
                console.log("archivo century cloud eliminado");
            }
        })
    }
}
 const guardaArchivoInventario = (data) => {
     fs.appendFile(pathExcel, data, (err) => {
         if (err) throw err;
     });
 }

exports.listaRFIDInventario = async function(req, res) {

	var data = await sp.exec('spIns_listaRFID_Inventario', {
		"par_idUsuario" : retornaObjeto(req).id_usuario,
		"par_idCliente" : retornaObjeto(req).id_cliente,
		"par_idProyecto" : retornaObjeto(req).id_proyecto,
		"par_idlocacion" : retornaObjeto(req).id_locacion,
		"par_idArea" : retornaObjeto(req).id_area,
		"par_idInventario" : retornaObjeto(req).id_inventario,
        "par_lecturaRFID" : retornaObjeto(req).rfid,
        "par_observaciones": retornaObjeto(req).observaiones,
        "par_idTipoIngreso": retornaObjeto(req).tipo_ingreso,
		"par_IMEI_MAC" : retornaObjeto(req).imei_mac
	})
		
		if(data.recordset[0].id_msj > 0){
			borrarArchivoInventario();
			Seguridad.formatoRespuesta(1, 200, data.recordset, 1, res);
			//console.log("-----------------------")
			//console.log(req.params)
			//console.log("-----------------------")
			//console.log(req.body)
			sp.exec('spSel_listaRFID_InventarioExcel',{
				"par_idUsuario" : retornaObjeto(req).id_usuario,
				"par_idCliente" : retornaObjeto(req).id_cliente,
				"par_idProyecto" : retornaObjeto(req).id_proyecto,
				"par_idlocacion" : retornaObjeto(req).id_locacion,
				"par_idArea" : retornaObjeto(req).id_area,
                "par_idInventario" : retornaObjeto(req).id_inventario,
                "par_observaciones": retornaObjeto(req).observaiones,
                "par_idTipoIngreso": retornaObjeto(req).tipo_ingreso,
                "par_IMEI_MAC" : retornaObjeto(req).imei_mac
			}).then(result=>{
				 if(result.recordset[0].id_segmento > 0){
				 	//console.log("-----------------------")
				 	//console.log(result.recordset)
				 	guardarExcel(result.recordset)
				
				 }
			}).catch(error=>{
				Seguridad.formatoRespuesta(0, 400, [], error, res);
			})
				
				
		} else {
			Seguridad.formatoRespuesta(1, 400, data.recordset, 1, res);
		}
	
}


const guardarExcel = (datos) => {
	var workbook =  new excel.Workbook ();
	var worksheet = workbook.addWorksheet ( 'ReporteEspecifico' );
	var worksheet2 = workbook.addWorksheet ( 'ReporteGeneral' );

	console.log("guarda excel century cloud")
	//console.log(datos)
    var j = 1;
    var x = 1;
    for (var i = 0; i < datos.length; i++) {
        if(datos[i].id_segmento == 4){
            worksheet.cell(x, j).string(datos[i].c1);
            worksheet.cell(x, j+1).string(datos[i].c2);
            worksheet.cell(x, j+2).string(datos[i].c3);
            worksheet.cell(x, j+3).string(datos[i].c4);
            worksheet.cell(x, j+4).string(datos[i].c5);
            x++;
        }
    }

    for (var i = 0; i < datos.length; i++) {
        if(datos[i].id_segmento == 5){
            worksheet.cell(x, j).string(datos[i].c1);
            worksheet.cell(x, j+1).string(datos[i].c2);
            worksheet.cell(x, j+2).number( parseInt(datos[i].c3));
            worksheet.cell(x, j+3).number( parseInt(datos[i].c4));
            worksheet.cell(x, j+4).number(parseInt(datos[i].c5));
            x++;
        }
    }
    x = 1;
    for (var i = 0; i < datos.length; i++) {
        if(datos[i].id_segmento == 6){
            worksheet2.cell(x, j).string(datos[i].c1);
            worksheet2.cell(x, j+1).string(datos[i].c2);
            worksheet2.cell(x, j+2).string(datos[i].c3);
            worksheet2.cell(x, j+3).string(datos[i].c4);
            x++;
        }
    }

    for (var i = 0; i < datos.length; i++) {
        if(datos[i].id_segmento == 7){
            worksheet2.cell(x, j).string(datos[i].c1);
            worksheet2.cell(x, j+1).string(datos[i].c2);
            worksheet2.cell(x, j+2).string(datos[i].c3);
            worksheet2.cell(x, j+3).string(datos[i].c4);
            x++;
        }
    
    }

    for (var i = 0; i < datos.length; i++) {
        if(datos[i].id_segmento == 1){
            var correoTo = datos[i].c2;
        }
        if(datos[i].id_segmento == 2){
            var correoCC = datos[i].c2;
        }
        if(datos[i].id_segmento == 3){
            var asunto = datos[i].c2;
        }

    }
    
    
    workbook.write ( 'reporteinventario.xlsx' );
	//enviarCorreo(correoTo, correoCC, asunto);
    //guardaArchivoInventario(data);

    
    let transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        auth: {
            user: config.correo.usuario
            , pass: config.correo.pass
        }, tls: {
            rejectUnauthorized: false
        }
    });
    
    let info = transporter.sendMail({
        from: config.correo.usuario,
        to: correoTo, // list of receivers
        subject: asunto, // Subject line
        cc: correoCC,
        html: `<p>Se adjunta Excel con inventario Century Cloud</p>`, // html body
        attachments: [{filename: nombreExcel, path:pathExcel}]
    });
    
}