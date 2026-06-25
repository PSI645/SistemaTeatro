const router = require('express').Router();
const { autenticar, apenasGestor } = require('../middlewares/auth');
const c = require('../controllers/ingressosController');

router.get('/sessao/:sessao_id',  c.listarPorSessao);
router.post('/',                  autenticar, apenasGestor, c.criar);
router.put('/:id',                autenticar, apenasGestor, c.atualizar);
router.post('/comprar',           autenticar, c.comprar);
router.get('/meus-pedidos',       autenticar, c.meusPedidos);

module.exports = router;