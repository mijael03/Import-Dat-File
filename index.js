import fs from 'fs'
import {
    OTHER_KEYWORD,
    URBAN_CORE_CATEGORIES,
    TIPO_VIA, CODIGOS_RESULTADO,
    TIPO_VIVIENDA,
    SU_VIVIENDA_ES_DE,
    MATERIAL_PAREDES_EXTERIORES,
    MATERIAL_TECHOS, MATERIAL_PISOS,
    TIPO_ALUMBRADO, ABASTECIMIENTO_AGUA,
    SERVICIO_HIGIENICO_CONECTADO,
    HORAS_LLEGADA_CAPITAL,
    COMBUSTIBLE_MAYOR_USO_COCINA,
    BIENES_HOGAR,
    NUMERO_SUMINISTRO_AGUA_LUZ_OPCIONES,
    MOTIVOS_FIRMA_NO_OBTENIDA,
    TIPO_DOCUMENTO,
    PARENTESCO_JEFE_HOGAR,
    SEXO,
    ESTADO_CIVIL,
    SEGURO_SALUD,
    IDIOMA_NIÑEZ,
    NIVEL_EDUCATIVO,
    OCUPACION_ULTIMO_MES,
    SECTOR,
    TIPO_DISCAPACIDAD,
    PROGRAMA_SOCIAL_BENEFICIARIO
} from './constants.js'


fs.readFile('fsu_data_list_copy.DAT', 'utf-8', (err, data) => {
    let data_cur = data.split("\n").join("")
    let new_data = data_cur.split("\r").join("")
    console.log('new_data length', new_data.length)
    let position = 0
    while (position <= new_data.length - 1) {
        let r_no_fsu = new_data.slice(position, position + 9)
        console.log('r_no_fsu', r_no_fsu)
        let no_fsu = r_no_fsu.slice(1)
        console.log('no_fsu', no_fsu)
        let position_fsu = new_data.indexOf(`F${no_fsu}`)
        let first_data = new_data.slice(position, position_fsu + 14)
        let add_position = read_fsu(first_data)
        position += add_position
        console.log('position counter', position)
    }
    //read_fsu(data)

})
function getInt(value){
    if(value.length == 0){
        return null
    }else{
        return parseInt(value)
    }
}
function getBoolean(code) {
    let codeint = parseInt(code)
    if (codeint == 1) {
        return true
    } else if (codeint == 2) {
        return false
    } else {
        return null
    }
}
function getArrayBienes(code, dict) {
    let tiene_bienes = parseInt(code.slice(0, 1))
    let bienes = code.slice(1)
    if (tiene_bienes == 0) {
        let arraybienes = []
        for (let i = 0; i < bienes.length; i++) {
            if (parseInt(bienes[i]) == 1) {
                arraybienes.push({
                    opcion_numero: i + 1,
                    opcion_seleccionada: dict[i + 1]
                })
            }
        }
        return arraybienes
    } else {
        return []
    }
}

function getArraySeguroDiscapacidadPrograma(code, dict) {
    let tiene_seguro = parseInt(code.slice(-1))
    let seguro = code.slice(0, -1)
    if (tiene_seguro == 0) {
        let arrayseguros = []
        for (let i = 0; i < seguro.length; i++) {
            if (parseInt(seguro[i]) == 1) {
                arrayseguros.push({
                    opcion_numero: i + 1,
                    opcion_seleccionada: dict[i + 1]
                })
            }
        }
        return arrayseguros
    } else {
        return []
    }
}

function parseDate(value) {
    try {
        const day = parseInt(value.slice(0, 2));
        const month = parseInt(value.slice(2, 4));
        const year = parseInt(value.slice(4));
        const dateObject = new Date(year, month - 1, day);
        console.log(dateObject)
        const formattedDate = dateObject.toISOString();
        return formattedDate
    } catch {
        return null
    }

}

function getNumeroSuministroStructure(option, value) {
    let optionInt = parseInt(option)
    if (optionInt == 1 || optionInt == 2) {
        return {
            opcion_seleccionada: NUMERO_SUMINISTRO_AGUA_LUZ_OPCIONES[optionInt],
            opcion_numero: optionInt,
            numero_suministro: value
        }
    } else if (optionInt) {
        return {
            opcion_seleccionada: NUMERO_SUMINISTRO_AGUA_LUZ_OPCIONES[optionInt],
            opcion_numero: optionInt,
        }
    } else {
        return null
    }
}

function getFirmaInformanteEstructure(value) {
    let opcion_numero = parseInt(value.slice(0, 1))
    let opcion_numero_no = parseInt(value.slice(1))
    if (opcion_numero == 1) {
        return {
            firmado: true
        }
    } else if (opcion_numero == 2) {
        return {
            firmado: false,
            razon: {
                opcion_seleccionada: MOTIVOS_FIRMA_NO_OBTENIDA[opcion_numero_no],
                opcion_numero: opcion_numero_no
            }
        }
    } else {
        return null
    }
}

function getHoursCapitalStructure(code, hours) {
    let codeint = parseInt(code)
    if (codeint == 1 || codeint == 2) {
        return {
            opcion_numero: codeint,
            opcion_seleccionada: HORAS_LLEGADA_CAPITAL[codeint]
        }
    } else if (codeint == 0) {
        return {
            opcion_numero: codeint,
            opcion_seleccionada: HORAS_LLEGADA_CAPITAL[codeint],
            numero_horas: parseInt(hours)
        }
    }
}

function getOtherStructure(code, value, dict) {
    let codeint = parseInt(code)
    let otherKey = Number.MIN_SAFE_INTEGER
    for (const key in dict) {
        if (dict[key] === OTHER_KEYWORD) {
            otherKey = key;
        }
    }
    if (codeint == otherKey) {
        return {
            opcion_numero: codeint,
            opcion_seleccionada: dict[codeint],
            opcion_otro_valor: value
        }
    } else {
        return {
            opcion_numero: codeint,
            opcion_seleccionada: dict[codeint],
        }
    }
}

function getSexoStructure(sexo, gestante) {
    let sexoint = parseInt(sexo)
    if (sexoint == 1) {
        return {
            sexo: SEXO[parseInt(sexo)],
        }
    } else if (sexoint == 2) {
        return {
            sexo: SEXO[parseInt(sexo)],
            gestante: getBoolean(gestante)
        }
    }
}

function read_fsu(data) {

    let position = 0
    let no_fsu = data.slice(position, position += 9)
    //position += 9
    let no_s100 = data.slice(position, position += 8)
    //position +=8
    let department_code = data.slice(position, position += 2)
    let department_name = data.slice(position, position += 35).trimEnd()
    let province_code = data.slice(position, position += 2)
    let province_name = data.slice(position, position += 35).trimEnd()
    let district_code = data.slice(position, position += 2)
    let district_name = data.slice(position, position += 39).trimEnd()
    let populated_center_name = data.slice(position, position += 60).trimEnd()
    let populated_center_code = data.slice(position, position += 4)
    let populated_center_category = data.slice(position, position += 2)
    let urban_core_name = data.slice(position, position += 60).trimEnd()
    let urban_core_category = data.slice(position, position += 2)
    let conglomerate = data.slice(position, position += 6).trimEnd()
    let zona = data.slice(position, position += 4).trimEnd()
    let manzana_no = data.slice(position += 2, position += 4).trimEnd()
    let frente_manzana = data.slice(position += 2, position += 2)
    let vivienda = data.slice(position += 2, position += 5).trimEnd()
    let no_hogares = data.slice(position += 2, position += 1)
    let hogar_no = data.slice(position, position += 2)
    let apellidos_nombres_informante = data.slice(position, position += 60).trimEnd()
    let informante_no_orden = data.slice(position, position += 2)
    let tipo_via = data.slice(position, position += 1)
    let nombre_via = data.slice(position, position += 60).trimEnd()
    let puerta_no = data.slice(position, position += 5).trimEnd()
    let block = data.slice(position, position += 3).trimEnd()
    let piso = data.slice(position, position += 2).trimEnd()
    let interior = data.slice(position, position += 3).trimEnd()
    let manzana = data.slice(position, position += 3).trimEnd()
    let lote = data.slice(position, position += 3).trimEnd()
    let km = data.slice(position, position += 4).trimEnd()
    let telefono_domicilio = data.slice(position, position += 8).trimEnd()
    let dni_empadronador = data.slice(position += 90, position += 10).trimEnd()

    // jefe de brigada, revisor, supervisor, dato 413 desconocido, y N° de FSU
    position += 308

    let primera_visita_empadronador_fecha = data.slice(position, position += 8)
    let primera_visita_empadronador_resultado = data.slice(position += 2, position += 1)

    //visitas restantes y un espaciado de 8 caracteres
    position += 96

    let resultado_final_empadronamiento_fecha = data.slice(position, position += 8)

    //espacios desconocidos
    position += 31

    let reside_permanentemente_vivienda = data.slice(position, position += 1)
    let reside_permanentemente_vivienda_boolean = getBoolean(reside_permanentemente_vivienda)
    let numero_pisos = data.slice(position, position += 2)
    let color_vivienda = data.slice(position, position += 30).trimEnd()
    position += 1
    // PENDIENTE DE REVISAR Y SEGMENTAR DE ACUERDO AL VALOR
    let firma_informante = data.slice(position, position += 2)
    position += 2
    let timestamp = data.slice(position, position += 24)

    //contenido desconocido
    position += 17

    let pc_user = data.slice(position, position += 10)
    let nombre_empadronador = data.slice(position, position += 90).trimEnd()
    let apellido_paterno_empadronador = data.slice(position, position += 90).trimEnd()
    let apellido_materno_empadronador = data.slice(position, position += 90).trimEnd()

    // término desconocido es 0 en el archivo DAT
    position += 2
    // N° de FSU repitiendose
    position += 9

    let tipo_vivienda_code = data.slice(position, position += 1)
    let tipo_vivienda = data.slice(position, position += 16).trimEnd()
    let su_vivienda_es_code = data.slice(position, position += 1)
    let su_vivienda_es = data.slice(position, position += 16).trimEnd()
    let material_paredes_exteriores_code = data.slice(position, position += 1)
    let material_paredes_exteriores = data.slice(position, position += 16).trimEnd()
    let material_techos_code = data.slice(position, position += 1)
    let material_techos = data.slice(position, position += 16).trimEnd()
    let material_pisos_code = data.slice(position, position += 1)
    let material_pisos = data.slice(position, position += 16).trimEnd()
    let tipo_alumbrado_code = data.slice(position, position += 1)
    let tipo_alumbrado = data.slice(position, position += 16).trimEnd()
    let abastecimiento_agua_code = data.slice(position, position += 1)
    let abastecimiento_agua = data.slice(position, position += 16).trimEnd()
    let servicio_higienico_conectado = data.slice(position, position += 31).trimEnd()
    let horas_llegar_capital_opcion = data.slice(position, position += 1)
    let horas_llegar_capital = data.slice(position, position += 2)
    let no_habitaciones = data.slice(position, position += 2)
    let combustible_utilizado_cocina_code = data.slice(position, position += 1)
    let combustible_utilizado_cocina = data.slice(position, position += 16).trimEnd()
    let su_hogar_tiene = data.slice(position, position += 15).trimEnd()
    let suministro_agua_luz_opcion = data.slice(position, position += 1)
    let numero_suministro = data.slice(position, position += 20).trimEnd()
    let total_personas = data.slice(position, position += 2)
    let nro_total_personas = parseInt(total_personas)
    let total_hombres = data.slice(position, position += 2)
    let total_mujeres = data.slice(position, position += 2)

    //desconocido
    position += 1


    let formfsu = {
        "fsu_no_fsu": no_fsu,
        "fsu_solicitud_s100": no_s100,
        "fsu_ubicacion_geografica": {
            "departamento": {
                "nombre": department_name,
                "codigo_ubigeo": department_code,
                "provincia": {
                    "nombre": province_name,
                    "codigo_ubigeo": province_code,
                    "distrito": {
                        "nombre": district_name,
                        "codigo_ubigeo": district_code,
                        "centro_poblado": {
                            'nombre': populated_center_name,
                            "codigo_ubigeo": populated_center_code,
                            'categoria': populated_center_category,
                            "nucleo_urbano": {
                                'nombre': urban_core_name,
                                'categoria_nucleo_urbano': {
                                    opcion_numero: parseInt(urban_core_category),
                                    opcion_seleccionada: URBAN_CORE_CATEGORIES[parseInt(urban_core_category)]
                                },
                            }
                        }
                    }
                }
            }
        },
        "fsu_ubicacion_censal": {
            'ubicacion_censal_conglomerado_no': getInt(conglomerate),
            'ubicacion_censal_zona_no': getInt(zona),
            'ubicacion_censal_manzana_no': getInt(manzana_no),
            'ubicacion_censal_frente_manzana_no': getInt(frente_manzana),
            'ubicacion_censal_vivienda_no': getInt(vivienda),
            'ubicacion_censal_no_hogares': getInt(no_hogares),
            'ubicacion_censal_hogar_no': hogar_no[0],
            "ubicacion_censal_informante": {
                'informante_apellidos_nombres': apellidos_nombres_informante,
                'informante_no_orden': informante_no_orden,
            },
            "ubicacion_censal_direccion_vivienda": {
                'direccion_vivienda_tipo_via': {
                    opcion_numero: parseInt(tipo_via),
                    opcion_seleccionada: TIPO_VIA[parseInt(tipo_via)]
                },
                'direccion_vivienda_nombre_via': nombre_via,
                'direccion_vivienda_puerta_no': puerta_no,
                'direccion_vivienda_block': block,
                'direccion_vivienda_piso': piso,
                'direccion_vivienda_interior': interior,
                'direccion_vivienda_manzana': manzana,
                'direccion_vivienda_lote': lote,
                'direccion_vivienda_km': km,
                'direccion_vivienda_telefono_domicilio': telefono_domicilio,
            }
        },
        "fsu_personal_responsable": {
            "empadronador": {
                'nombre': nombre_empadronador,
                'apellido_paterno': apellido_paterno_empadronador,
                'apellido_materno': apellido_materno_empadronador,
                'dni': dni_empadronador,
            },
            "jefe_de_brigada": {
                'nombre': null,
                'apellido_paterno': null,
                'apellido_materno': null,
                'dni': null,
            },
            "revisor": {
                'nombre': null,
                'apellido_paterno': null,
                'apellido_materno': null,
                'dni': null,
            },
            "supervisor": {
                'nombre': null,
                'apellido_paterno': null,
                'apellido_materno': null,
                'dni': null,
            }

        },
        "fsu_entrevista_supervision": {
            "entrevista_supervision_visita": {
                "empadronador_visitas": {
                    "primera_visita": {
                        'primera_visita_fecha': parseDate(primera_visita_empadronador_fecha),
                        'primera_visita_resultado': {
                            "primera_visita_resultado_codigo": parseInt(primera_visita_empadronador_resultado),
                            "primera_visita_resultado_valor": CODIGOS_RESULTADO[parseInt(primera_visita_empadronador_resultado)]
                        },
                    },
                    "segunda_visita": {
                        'segunda_visita_fecha': null,
                        'segunda_visita_resultado': {
                            "segunda_visita_resultado_codigo": null,
                            "segunda_visita_resultado_valor": null
                        },
                    },
                    "tercera_visita": {
                        'tercera_visita_fecha': null,
                        'tercera_visita_resultado': {
                            "tercera_visita_resultado_codigo": null,
                            "tercera_visita_resultado_valor": null
                        },
                    }
                }
            },
            "entrevista_supervision_resultado_final": {
                'fecha': parseDate(resultado_final_empadronamiento_fecha),
                'resultado': {
                    "resultado_codigo": parseInt(primera_visita_empadronador_resultado),
                    "resultado_valor": CODIGOS_RESULTADO[parseInt(primera_visita_empadronador_resultado)]
                },
            }
        },
        "fsu_conformidad_empadronamiento": {
            "conformidad_empadronamiento_reside_permantemente_vivienda": reside_permanentemente_vivienda_boolean,
            "conformidad_empadronamiento_caracteristicas_vivienda": {
                'caracteristicas_vivienda_numero_pisos': parseInt(numero_pisos),
                'caracteristicas_vivienda_color_vivienda': color_vivienda,
            },
            "conformidad_empadronamiento_firma_empadronador": null,
            "conformidad_empadronamiento_huella_digital_informante": null,
            'conformidad_empadronamiento_firma_informante': getFirmaInformanteEstructure(firma_informante),
        },
        "fsu_caracteristicas_vivienda_preguntas": {
            'caracteristicas_vivienda_tipo_vivienda': getOtherStructure(tipo_vivienda_code, tipo_vivienda, TIPO_VIVIENDA),
            'caracteristicas_vivienda_su_vivienda_es': getOtherStructure(su_vivienda_es_code, su_vivienda_es, SU_VIVIENDA_ES_DE),
            'caracteristicas_vivienda_material_paredes_exteriores': getOtherStructure(material_paredes_exteriores_code, material_paredes_exteriores, MATERIAL_PAREDES_EXTERIORES),
            'caracteristicas_vivienda_material_techos': getOtherStructure(material_techos_code, material_techos, MATERIAL_TECHOS),
            'caracteristicas_vivienda_material_pisos': getOtherStructure(material_pisos_code, material_pisos, MATERIAL_PISOS),
            'caracteristicas_vivienda_tipo_alumbrado': getOtherStructure(tipo_alumbrado_code, tipo_alumbrado, TIPO_ALUMBRADO),
            'caracteristicas_vivienda_abastecimiento_agua': getOtherStructure(abastecimiento_agua_code, abastecimiento_agua, ABASTECIMIENTO_AGUA),
            'caracteristicas_vivienda_servicio_higienico_conectado': {
                opcion_numero: parseInt(servicio_higienico_conectado),
                opcion_seleccionada: SERVICIO_HIGIENICO_CONECTADO[parseInt(servicio_higienico_conectado)]
            },
            'caracteristicas_vivienda_horas_llegada_capital_distrital': getHoursCapitalStructure(horas_llegar_capital_opcion, horas_llegar_capital),
            'caracteristicas_vivienda_no_habitaciones': parseInt(no_habitaciones),
            'caracteristicas_vivienda_combustible_utilizado_cocina': getOtherStructure(combustible_utilizado_cocina_code, combustible_utilizado_cocina, COMBUSTIBLE_MAYOR_USO_COCINA),
            'caracteristicas_vivienda_su_hogar_tiene': getArrayBienes(su_hogar_tiene, BIENES_HOGAR),
            'caracteristicas_vivienda_suministro_agua_luz': getNumeroSuministroStructure(suministro_agua_luz_opcion, numero_suministro),
            'caracteristicas_vivienda_no_personas_hogar': {
                'total': parseInt(total_personas),
                'hombres': parseInt(total_hombres),
                'mujeres': parseInt(total_mujeres),
            }
        },
        'caracteristicas_poblacion': []

    }
    // fs.writeFile("output.json", JSON.stringify(formfsu), (err) => {
    //     if (err) {
    //         console.error('Error writing to file:', err);
    //     } else {
    //         console.log('Content has been written to the file.');
    //     }
    // });
    formfsu['caracteristicas_poblacion'] = []
    for (let i = 0; i < nro_total_personas; i++) {
        // n° fsu
        let numero_fsu_repeat = data.slice(position, position += 9)

        let numero_orden = data.slice(position, position += 2)
        let apellido_paterno = data.slice(position, position += 30).trimEnd()
        let apellido_materno = data.slice(position, position += 30).trimEnd()
        let nombres = data.slice(position, position += 30).trimEnd()
        let apellidos = data.slice(position, position += 30).trimEnd()
        let fecha_nac = data.slice(position, position += 8).trimEnd()
        //fecha_nac repeated
        position += 8
        let edad = data.slice(position, position += 2)
        let meses = data.slice(position, position += 2)
        let tipo_documento = data.slice(position, position += 1)
        let numero_documento = data.slice(position, position += 10).trimEnd()
        let parentesco_jefe_hogar = data.slice(position, position += 2)
        let nucleo_familiar_no = data.slice(position, position += 1)
        let sexo = data.slice(position, position += 1)
        let gestante = data.slice(position, position += 1)
        let estado_civil = data.slice(position, position += 1)

        //unknown
        position += 1

        let tipo_seguro_salud = data.slice(position, position += 6)
        let idioma_niñez = data.slice(position, position += 1)
        let sabe_leer_escribir = data.slice(position, position += 1)
        let nivel_educativo = data.slice(position, position += 1)
        let ultimo_año_aprobado = data.slice(position, position += 1)




        let ocupacion_ultimo_mes = data.slice(position, position += 2)
        //unknown
        let sector = data.slice(position, position += 2)

        let tipo_discapacidad = data.slice(position, position += 6)
        let beneficiario_programa = data.slice(position, position += 11)
        position += 1

        formfsu['caracteristicas_poblacion'].push({
            'caracteristicas_poblacion_numero_orden': numero_orden,
            'caracteristicas_poblacion_apellido_paterno': apellido_paterno,
            'caracteristicas_poblacion_apellido_materno': apellido_materno,
            'caracteristicas_poblacion_nombres': nombres,
            'caracteristicas_poblacion_apellidos': apellidos,
            'caracteristicas_poblacion_fecha_nac': parseDate(fecha_nac),
            'caracteristicas_poblacion_edad': parseInt(edad),
            'caracteristicas_poblacion_meses': parseInt(meses),
            'caracteristicas_poblacion_tipo_documento': getOtherStructure(tipo_documento
                , null, TIPO_DOCUMENTO),
            'caracteristicas_poblacion_numero_documento': numero_documento,
            'caracteristicas_poblacion_preguntas': {
                'preguntas_parentesco_jefe_hogar': {
                    opcion_numero: parseInt(parentesco_jefe_hogar),
                    opcion_seleccionada: PARENTESCO_JEFE_HOGAR[parseInt(parentesco_jefe_hogar)]
                },
                'preguntas_nucleo_familiar_no': nucleo_familiar_no,
                'preguntas_sexo': getSexoStructure(sexo, gestante),
                'preguntas_estado_civil': {
                    opcion_numero: parseInt(estado_civil),
                    opcion_seleccionada: ESTADO_CIVIL[parseInt(estado_civil)]
                },
                'preguntas_seguro_salud': getArraySeguroDiscapacidadPrograma(tipo_seguro_salud, SEGURO_SALUD),
                'preguntas_idioma_niñez': {
                    opcion_numero: parseInt(idioma_niñez),
                    opcion_seleccionada: IDIOMA_NIÑEZ[parseInt(idioma_niñez)]
                },
                'preguntas_sabe_leer_escribir': getBoolean(sabe_leer_escribir),
                'preguntas_nivel_educativo': {
                    opcion_numero: parseInt(nivel_educativo),
                    opcion_seleccionada: NIVEL_EDUCATIVO[parseInt(nivel_educativo)],
                    ultimo_anio_aprobado: ultimo_año_aprobado
                },
                'preguntas_ocupacion_ultimo_mes': {
                    opcion_numero: parseInt(ocupacion_ultimo_mes),
                    opcion_seleccionada: OCUPACION_ULTIMO_MES[parseInt(ocupacion_ultimo_mes)],
                },
                'preguntas_sector': {
                    opcion_numero: parseInt(sector),
                    opcion_seleccionada: SECTOR[parseInt(sector)]
                },
                'preguntas_tipo_discapacidad': getArraySeguroDiscapacidadPrograma(tipo_discapacidad, TIPO_DISCAPACIDAD),
                'preguntas_beneficiario_programa': getArrayBienes(beneficiario_programa, PROGRAMA_SOCIAL_BENEFICIARIO)
            },

        })
    }
    // fs.writeFile("output.json", JSON.stringify(formfsu), (err) => {
    //     if (err) {
    //         console.error('Error writing to file:', err);
    //     } else {
    //         console.log('Content has been written to the file.');
    //     }
    // });
    fs.readFile("output.json", 'utf8', (err, existingContent) => {
        if (err) {
            console.error('Error reading file:', err);
        } else {
            // Combine the existing content and the new JSON content with a newline
            //console.log('existingContent', existingContent)
            const combinedContent = existingContent + ',\n' + JSON.stringify(formfsu)

            // Write the combined content back to the file
            fs.appendFile("output.json", combinedContent, (writeErr) => {
                if (writeErr) {
                    console.error('Error writing file:', writeErr);
                } else {
                    console.log('New JSON content has been added to the file.');
                }
            });
        }
    });

    //fsu number
    position += 9

    let do_firma_informante = data.slice(position, position += 2)
    let informante_firma = data.slice(position, position += 2)
    let unknown = data.slice(position, position += 1)
    console.log('do_firma_informante', do_firma_informante)
    console.log('informante_firma', informante_firma)
    console.log('unknown', unknown)
    return position
}
