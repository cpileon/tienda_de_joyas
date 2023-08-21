const { obtenerJoyas, filtrarJoyas } = require('./consultas')
const express = require('express')
const app = express()

app.listen (3000, console.log("Servidor encendido en puerto 3000"))

const reportarConsulta = async(req, res, next) =>{
    const parametros = req.query
    const url = req.url
    console.log(`
    Fecha: ${new Date()}
    Ruta de la consulta: ${url}
    Parámetros utilizados:
    `, parametros)
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
    const queryString = req.query
    const inventario = await obtenerJoyas(queryString)
    const HATEOAS = prepararHATEOAS(inventario)

    return res.json(HATEOAS)
});

app.get('/joyas/filtros', reportarConsulta, async (req, res) => {
    const queryStrings = req.query
    const inventario = await filtrarJoyas(queryStrings)
    res.json(inventario)
})
