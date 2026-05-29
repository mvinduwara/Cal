import { Router } from 'express';
import { create, all } from 'mathjs';

const math = create(all, { number: 'BigNumber', precision: 14 });
const router = Router();

const ALLOWED = /^[0-9+\-*/.×÷%() e]+$/i;

router.post('/', (req, res) => {
  const { expression } = req.body as { expression?: string };

  if (!expression || typeof expression !== 'string') {
    res.status(400).json({ message: 'expression is required' });
    return;
  }

  const sanitized = expression.trim().replace(/×/g, '*').replace(/÷/g, '/');

  if (!ALLOWED.test(sanitized)) {
    res.status(400).json({ message: 'Invalid characters in expression' });
    return;
  }

  try {
    const result = math.evaluate(sanitized);
    const formatted = math.format(result, { notation: 'auto', precision: 12 });
    res.json({ result: String(formatted), expression });
  } catch {
    res.status(422).json({ message: 'Could not evaluate expression' });
  }
});

export default router;