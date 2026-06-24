const router = require('express').Router();
const { autenticar, apenasGestor } = require('../middlewares/auth');
const {
  loginUsuario,
  loginCliente,
  cadastrarCliente,
  cadastrarUsuario,
} = require('../controllers/authController');

router.post('/login/usuario',  loginUsuario);
router.post('/login/cliente',  loginCliente);
router.post('/cadastro/cliente', cadastrarCliente);
router.post('/cadastro/usuario', autenticar, apenasGestor, cadastrarUsuario);

module.exports = router;