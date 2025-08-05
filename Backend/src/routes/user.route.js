import {Router} from 'express';
import { signIn, getStats } from '../controller/user.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router();

router.route("/login").post(signIn)
router.route('/stats').get(verifyJWT, getStats)

export default router;