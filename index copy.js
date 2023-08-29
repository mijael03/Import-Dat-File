import fs from 'fs'

fs.readFile('fsu_data_list.DAT', 'utf-8', (err, data) => {
    let data_cur = data.split("\n").join("")
    let new_data = data_cur.split("\r").join("")
    let position = 0
    while (position <= new_data.length) {
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
    let conglomerate = data.slice(position, position += 6)
    let zona = data.slice(position, position += 4)
    let manzana_no = data.slice(position += 2, position += 4)
    let frente_manzana = data.slice(position += 2, position += 2)
    let vivienda = data.slice(position += 2, position += 5)
    let no_hogares = data.slice(position += 2, position += 1)
    let hogar_no = data.slice(position, position += 2)
    let apellidos_nombres_informante = data.slice(position, position += 60).trimEnd()
    let informante_no_orden = data.slice(position, position += 2)
    let tipo_via = data.slice(position, position += 1)
    let nombre_via = data.slice(position, position += 60).trimEnd()
    let puerta_no = data.slice(position, position += 5)
    let block = data.slice(position, position += 3)
    let piso = data.slice(position, position += 2)
    let interior = data.slice(position, position += 3)
    let manzana = data.slice(position, position += 3)
    let lote = data.slice(position, position += 3)
    let km = data.slice(position, position += 4)
    let telefono_domicilio = data.slice(position, position += 8)
    let dni_empadronador = data.slice(position += 90, position += 10)

    // jefe de brigada, revisor, supervisor, dato 413 desconocido, y N° de FSU
    position += 309

    let primera_visita_empadronador_fecha = data.slice(position, position += 8)
    let primera_visita_empadronador_resultado = data.slice(position += 2, position += 1)

    //visitas restantes y un espaciado de 8 caracteres
    position += 96

    let resultado_final_empadronamiento_fecha = data.slice(position, position += 8)

    //espacios desconocidos
    position += 31

    let reside_permanentemente_vivienda = data.slice(position, position += 1)
    let numero_pisos = data.slice(position, position += 2)
    let color_vivienda = data.slice(position, position += 30).trimEnd()
    let firma_informante = data.slice(position, position += 5)
    let timestamp = data.slice(position, position += 24)

    //contenido desconocido
    position += 18

    let pc_user = data.slice(position, position += 10)
    let nombre_empadronador = data.slice(position, position += 90).trimEnd()
    let apellido_paterno_empadronador = data.slice(position, position += 90).trimEnd()
    let apellido_materno_empadronador = data.slice(position, position += 90).trimEnd()

    // término desconocido es 0 en el archivo DAT
    position += 2
    // N° de FSU repitiendose
    position += 9

    let tipo_vivienda = data.slice(position, position += 17)
    let su_vivienda_es = data.slice(position, position += 17)
    let material_paredes_exteriores = data.slice(position, position += 17)
    let material_techos = data.slice(position, position += 17)
    let material_pisos = data.slice(position, position += 17)
    let tipo_alumbrado = data.slice(position, position += 17)
    let abastecimiento_agua = data.slice(position, position += 17)
    let servicio_higienico_conectado = data.slice(position, position += 31)
    let horas_llegar_capital_opcion = data.slice(position, position += 1)
    let horas_llegar_capital = data.slice(position, position += 2)
    let no_habitaciones = data.slice(position, position += 2)
    let combustible_utilizado_cocina = data.slice(position, position += 17)
    let su_hogar_tiene = data.slice(position, position += 15)
    let suministro_agua_luz_opcion = data.slice(position, position += 1)
    let numero_suministro = data.slice(position, position += 19)
    let total_personas = data.slice(position, position += 2)
    let nro_total_personas = parseInt(total_personas)
    let total_hombres = data.slice(position, position += 2)
    let total_mujeres = data.slice(position, position += 2)

    //desconocido
    position += 2

    const formfsu = {
        "no_fsu": no_fsu,
        "no_s100": no_s100,
        "department_code": department_code,
        "department_name": department_code,
        'province_code': province_code,
        'province_name': province_name,
        'district_code': district_code,
        'district_name': district_name,
        'populated_center_name': populated_center_name,
        'N° de FSU': no_fsu,
        'no_s100': no_s100,
        'department_code': department_code,
        'department_name': department_name,
        'province_code': province_code,
        'province_name': province_name,
        'district_code': district_code,
        'district_name': district_name,
        'populated_center_name': populated_center_name,
        'populated_center_code': populated_center_code,
        'populated_center_category': populated_center_category,
        'urban_core_name': urban_core_name,
        'urban_core_category': urban_core_category,
        'conglomerate': conglomerate,
        'zona': zona,
        'manzana': manzana_no,
        'frente_manzana': frente_manzana,
        'vivienda': vivienda,
        'no_hogares': no_hogares,
        'hogar_no': hogar_no,
        'apellidos_nombres_informante': apellidos_nombres_informante,
        'informante_no_orden': informante_no_orden,
        'tipo_via': tipo_via,
        'nombre_via': nombre_via,
        'puerta_no': puerta_no,
        'block': block,
        'piso': piso,
        'interior': interior,
        'manzana': manzana,
        'lote': lote,
        'km': km,
        'telefono_domicilio': telefono_domicilio,
        'dni_empadronador': dni_empadronador,
        'primera_visita_empadronador_fecha': primera_visita_empadronador_fecha,
        'primera_visita_empadronador_resultado': primera_visita_empadronador_resultado,
        'resultado_final_empadronamiento_fecha': resultado_final_empadronamiento_fecha,
        'reside_permanentemente_vivienda': reside_permanentemente_vivienda,
        'numero_pisos': numero_pisos,
        'color_vivienda': color_vivienda,
        'firma_informante': firma_informante,
        'timestamp': timestamp,
        'pc_user': pc_user,
        'nombre_empadronador': nombre_empadronador,
        'apellido_paterno_empadronador': apellido_paterno_empadronador,
        'apellido_materno_empadronador': apellido_materno_empadronador,
        'tipo_vivienda': tipo_vivienda,
        'su_vivienda_es': su_vivienda_es,
        'material_paredes_exteriores': material_paredes_exteriores,
        'material_techos': material_techos,
        'material_pisos': material_pisos,
        'tipo_alumbrado': tipo_alumbrado,
        'abastecimiento_agua': abastecimiento_agua,
        'servicio_higienico_conectado': servicio_higienico_conectado,
        'horas_llegar_capital_opcion': horas_llegar_capital_opcion,
        'horas_llegar_capital': horas_llegar_capital,
        'no_habitaciones': no_habitaciones,
        'combustible_utilizado_cocina': combustible_utilizado_cocina,
        'su_hogar_tiene': su_hogar_tiene,
        'suministro_agua_luz_opcion': suministro_agua_luz_opcion,
        'numero_suministro': numero_suministro,
        'total_personas': total_personas,
        'total_hombres': total_hombres,
        'total_mujeres': total_mujeres
    }
    console.log('N° de FSU', no_fsu)
    console.log('no_s100', no_s100)
    console.log('department_code', department_code)
    console.log('department_name', department_name)
    console.log('province_code', province_code)
    console.log('province_name', province_name)
    console.log('district_code', district_code)
    console.log('district_name', district_name)
    console.log('populated_center_name', populated_center_name)
    console.log('populated_center_code', populated_center_code)
    console.log('populated_center_category', populated_center_category)
    console.log('urban_core_name', urban_core_name)
    console.log('urban_core_category', urban_core_category)
    console.log('conglomerate', conglomerate)
    console.log('zona', zona)
    console.log('manzana', manzana_no)
    console.log('frente_manzana', frente_manzana)
    console.log('vivienda', vivienda)
    console.log('no_hogares', no_hogares)
    console.log('hogar_no', hogar_no)
    console.log('apellidos_nombres_informante', apellidos_nombres_informante)
    console.log('informante_no_orden', informante_no_orden)
    console.log('tipo_via', tipo_via)
    console.log('nombre_via', nombre_via)
    console.log('puerta_no', puerta_no)
    console.log('block', block)
    console.log('piso', piso)
    console.log('interior', interior)
    console.log('manzana', manzana)
    console.log('lote', lote)
    console.log('km', km)
    console.log('telefono_domicilio', telefono_domicilio)
    console.log('dni_empadronador', dni_empadronador)
    console.log('primera_visita_empadronador_fecha', primera_visita_empadronador_fecha)
    console.log('primera_visita_empadronador_resultado', primera_visita_empadronador_resultado)
    console.log('resultado_final_empadronamiento_fecha', resultado_final_empadronamiento_fecha)
    console.log('reside_permanentemente_vivienda', reside_permanentemente_vivienda)
    console.log('numero_pisos', numero_pisos)
    console.log('color_vivienda', color_vivienda)
    console.log('firma_informante', firma_informante)
    console.log('timestamp', timestamp)
    console.log('pc_user', pc_user)
    console.log('nombre_empadronador', nombre_empadronador)
    console.log('apellido_paterno_empadronador', apellido_paterno_empadronador)
    console.log('apellido_materno_empadronador', apellido_materno_empadronador)
    console.log('tipo_vivienda', tipo_vivienda)
    console.log('su_vivienda_es', su_vivienda_es)
    console.log('material_paredes_exteriores', material_paredes_exteriores)
    console.log('material_techos', material_techos)
    console.log('material_pisos', material_pisos)
    console.log('tipo_alumbrado', tipo_alumbrado)
    console.log('abastecimiento_agua', abastecimiento_agua)
    console.log('servicio_higienico_conectado', servicio_higienico_conectado)
    console.log('horas_llegar_capital_opcion', horas_llegar_capital_opcion)
    console.log('horas_llegar_capital', horas_llegar_capital)
    console.log('no_habitaciones', no_habitaciones)
    console.log('combustible_utilizado_cocina', combustible_utilizado_cocina)
    console.log('su_hogar_tiene', su_hogar_tiene)
    console.log('suministro_agua_luz_opcion', suministro_agua_luz_opcion)
    console.log('numero_suministro', numero_suministro)
    console.log('total_personas', total_personas)
    console.log('total_hombres', total_hombres)
    console.log('total_mujeres', total_mujeres)
    fs.appendFile("output.json", JSON.stringify(formfsu), (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log('Content has been written to the file.');
        }
    });
    
    for (let i = 0; i < nro_total_personas; i++) {
        // n° fsu
        let numero_fsu_repeat = data.slice(position, position += 10)

        let numero_orden = data.slice(position, position += 2)
        let apellido_paterno = data.slice(position, position += 30)
        let apellido_materno = data.slice(position, position += 30)
        let nombres = data.slice(position, position += 30)
        let apellidos = data.slice(position, position += 30)
        let fecha_nac = data.slice(position, position += 16)
        let edad = data.slice(position, position += 2)
        let meses = data.slice(position, position += 2)
        let tipo_documento = data.slice(position, position += 1)
        let numero_documento = data.slice(position, position += 10)
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

        //unknown
        position += 1

        let ocupacion_ultimo_mes = data.slice(position, position += 2)
        let sector = data.slice(position, position += 2)
        let tipo_discapacidad = data.slice(position, position += 6)
        let beneficiario_programa = data.slice(position, position += 11)
        console.log('numero_FSU', numero_fsu_repeat)
        console.log('numero_FSU')
        console.log(numero_fsu_repeat)
        console.log('numero_orden', numero_orden)
        console.log('apellido_paterno', apellido_paterno)
        console.log('apellido_materno', apellido_materno)
        console.log('nombres', nombres)
        console.log('apellidos', apellidos)
        console.log('fecha_nac', fecha_nac)
        console.log('edad', edad)
        console.log('meses', meses)
        console.log('tipo_documento', tipo_documento)
        console.log('numero_documento', numero_documento)
        console.log('parentesco_jefe_hogar', parentesco_jefe_hogar)
        console.log('nucleo_familiar_no', nucleo_familiar_no)
        console.log('sexo', sexo)
        console.log('gestante', gestante)
        console.log('estado_civil', estado_civil)
        console.log('tipo_seguro_salud', tipo_seguro_salud)
        console.log('idioma_niñez', idioma_niñez)
        console.log('sabe_leer_escribir', sabe_leer_escribir)
        console.log('nivel_educativo', nivel_educativo)
        console.log('ultimo_año_aprobado', ultimo_año_aprobado)
        console.log('ocupacion_ultimo_mes', ocupacion_ultimo_mes)
        console.log('sector', sector)
        console.log('tipo_discapacidad', tipo_discapacidad)
        console.log('beneficiario_programa', beneficiario_programa)
    }

    //fsu number
    position += 11

    let do_firma_informante = data.slice(position, position += 2)
    let informante_firma = data.slice(position, position += 2)
    let unknown = data.slice(position, position += 1)
    console.log('do_firma_informante', do_firma_informante)
    console.log('informante_firma', informante_firma)
    console.log('unknown', unknown)
    return position
}
