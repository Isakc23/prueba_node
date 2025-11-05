const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req,res) => {
    res.send('Hola Mundo!');
});


//app.get('/usuarios',);
//Express 4
/*app.get('/usuarios/:id', (req,res) => {
    const user = usuarios.find(u => u.id == req.params.id);
    res.send(user);
});

app.listen(port,() => {
    console.log(`Servidor listo en http://localhost:${port}`);
});*/

//Express 5
//app.get(/^\/usuarios\/(?<id>\d+)$/, );

const usuariosRouter = require('./routers/usuarios');
app.use('/usuarios', usuariosRouter);

app.listen(port,() => {
    console.log(`Servidor listo en http://localhost:${port}`);
});