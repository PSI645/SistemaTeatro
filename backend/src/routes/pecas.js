const router = require('express').Router();
const { autenticar, apenasGestor } = require('../middlewares/auth');
const c = require('../controllers/pecasController');

router.get('/',     c.listar);
router.get('/:id',  c.buscarPorId);
router.post('/',    autenticar, apenasGestor, c.criar);
router.put('/:id',  autenticar, apenasGestor, c.atualizar);
router.delete('/:id', autenticar, apenasGestor, c.remover);

module.exports = router;