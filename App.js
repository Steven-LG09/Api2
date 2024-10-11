const express = require('express')
const req = require('express/lib/request')
const res = require('express/lib/response')
const app = express()
const port = 3000

app.use(express.json())

//app: Contiene toda la info de la app
//get: Metodo para obetner la informacion
//ruta: Ruta
//(req, res)=> request and response

let db= [{ 
  id: 1,
  nombre: 'Steven'
},{
  id: 2,
  nombre: 'Valerie'
},{
  id: 3,
  nombre: "Val"
}]
//examples

app.get('/ruta/:id', (req, res) => {
  console.log(req.params.id)
  res.json({mensaje: req.params.id})
})
app.post('/ruta/', (req, res) => {
  console.log(req.body)
  res.json(req.body)
})
//real Info

app.get('/users',(req,res) => {
  res.json(db)
})
app.post('/users', (req, res) => {
  console.log(req.body)
  db.push(req.body)
  res.json({mensaje: "Usuario creado"})
})

app.delete('/users/:id',(req,res) => {
  console.log(req.params.id)
  db= db.filter((user) => user.id != req.params.id) 
  res.json({mensaje: "Usuario Eliminado"})
})

//getOneElement

app.get('/users/:id',(req,res) => {
  db= db.find((user) => user.id == req.params.id) 
  res.json(db)
})

//UpdateOneElement

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}/ruta/:123`)
})