const { obtenerJoyas, filtrarJoyas } = require('./consultas')
const { handleErrors } = require('./errors')
const express = require('express')
const app = express()

app.listen (3000, console.log("Servidor encendido en puerto 3000"))

const reportarConsulta = async(req, res, next) =>{
    const parametros = req.query
    const url = req.url
    if(Object.keys(parametros).length === 0){

        console.log(`
        Fecha: ${new Date()}
        Ruta de la consulta: ${url}
        Parámetros utilizados: No se usaron parametros
        `)

    }else{
        
        console.log(`
        Fecha: ${new Date()}
        Ruta de la consulta: ${url}
        Parámetros utilizados:
        `)
        Object.keys(parametros).forEach(key => {
            console.log(`${key}: ${parametros[key]}`)})
        }

    next()
}

const prepararHATEOAS = (inventario) =>{
    const results = inventario.map((m)=>{
        return {
            name: m.nombre,
            href: `/joyas/joya/${m.id}`
        }
    }).slice(0,4)
    const total = inventario.length
    const HATEOAS ={
        total,
        results
    }
    return HATEOAS
}


app.get("/joyas", reportarConsulta, async(req, res) =>{
    try{
        const queryString = req.query
        const inventario = await obtenerJoyas(queryString)
        const HATEOAS = prepararHATEOAS(inventario)
        return res.json(HATEOAS)
    } catch (error) {
        console.log(error)
        const { status, message } = handleErrors(error.code)
        return res.status(status).json({ok: false, result: message})
    }
});

app.get('/joyas/filtros', reportarConsulta, async (req, res) => {
    try{
        const queryStrings = req.query
        const inventario = await filtrarJoyas(queryStrings)
        res.json(inventario)
    } catch (error) {
        console.log(error)
        const { status, message } = handleErrors(error.code)
        return res.status(status).json({ok: false, result: message})
    }
})
