import {Router} from 'express';
import { analyzeGame } from '../controller/game.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router();

router.route('/analyze').get(verifyJWT, analyzeGame)

export default router;