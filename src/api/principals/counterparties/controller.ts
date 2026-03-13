import { Router } from 'express';
import { indexHandler } from './handlers';
import { listHandler } from './handlers/list';
import { getCountsByStatusHandler } from './handlers/getCountsByStatus';
import { parsePrincipalFromToken } from '../../../middlewares/parsePrincipalFromToken';

const router = Router();

router.use(parsePrincipalFromToken);

router.get('/', indexHandler);
router.get('/counts-by-status', getCountsByStatusHandler);
router.get('/list', listHandler);

export default router;
