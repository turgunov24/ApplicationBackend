import { Router } from 'express';
import { bundleHandler } from './handlers/bundle';
import { parsePrincipalFromToken } from '../../../middlewares/parsePrincipalFromToken';

const router = Router();

router.use(parsePrincipalFromToken);

router.get('/bundle/:lang/:ns', bundleHandler);

export default router;
