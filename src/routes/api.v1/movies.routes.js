const { list, detail, create, update } = require('../../controllers/moviesController')

const router = require('express').Router();

/* /api/v1/movies */

router
 .get('/',list)
 .get('/:id', detail)
 .post('/', create)
 .put('/:id', update)

module.exports = router
