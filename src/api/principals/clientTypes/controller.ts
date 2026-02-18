import { Router } from 'express';
import { indexHandler } from './handlers';
import { getCountsByStatusHandler } from './handlers/getCountsByStatus';
import { parsePrincipalFromToken } from '../../../middlewares/parsePrincipalFromToken';

const router = Router();

router.use(parsePrincipalFromToken);

router.get('/', indexHandler);
router.get('/counts-by-status', getCountsByStatusHandler);

export default router;
