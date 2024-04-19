import { Router } from "express";

const ct_user_company = require('../controller/user_company_controller');
const router = Router();

//rotas destinados usuarios.
router.post('/user_company/new', ct_user_company.newUser)

export {router}