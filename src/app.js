const express = require('express');
const app = express();
const paginate = require('express-paginate')

const moviesApisRoutes = require('./routes/api.v1/movies.routes')

app.use(express.json())
app.use(express.urlencoded({ extended: false }));

app.use(paginate.middleware(8,50));

app.use('/api/v1/movies', moviesApisRoutes)

app.use('*', (req,res) => res.status(404).json({
    ok: false,
    status: 404,
    error: 'Not found'
}))

app.listen('3001', () => console.log('Servidor corriendo en el puerto 3001'));
