import { Router } from 'express';

import { indexHandler } from './handlers';
import { parseUserFromToken } from '../../../../middlewares/parseUserFromToken';
import { authorizeUser } from '../../../../middlewares/authorizeUser';

const router = Router();

router.use(parseUserFromToken, authorizeUser);

router.get('/', indexHandler);

export default router;
