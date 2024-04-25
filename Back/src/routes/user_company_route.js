import { Router } from "express";

const ct_user_company = require('../controller/user_company_controller');
const router = Router();

//rotas destinados usuarios.
router.post('/user_company/new_user', ct_user_company.newUser)
router.put('/user_company/:id/update_user', ct_user_company.editUser)

router.post('/user_company/:user_company_id/new_client', ct_user_company.newClient)

export {router}