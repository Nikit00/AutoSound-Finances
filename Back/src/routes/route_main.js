import { Router } from "express";
import {router as user_route} from './user_company_route'

const router = Router();

router.use(user_route)

export { router };