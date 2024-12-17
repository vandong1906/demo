const express = require('express');
const router = express.Router();
const transport=require('./infras/transport/index');
const middleware=require('../../mildware/Authenciance');
router.get('/', transport.get);
router.put('/:id', transport.updateUser);
/*-----------------------------------------Register/singIn----------------------- */
router.post('/register',transport.sendMail);
router.post('/register/verify',transport.verifyMail);
router.post('/logout', transport.logout);
router.delete('/remove/:id',transport.Remove);
/*--------------------get user All -------------------- */
router.post('/', transport.findUser);
router.get('/getAll',middleware.authenticateBearerToken,transport.get);
router.get('/getAllCookies',middleware.authenticateCookiesToken,transport.get);

module.exports = router;