import crypto from 'crypto';
import { Business } from '../modules/businesses/business.model';

export async function generateBusinessCode() {
  let code: string;
  let exists = true;
  while (exists) {
    code = 'BIZ-' + crypto.randomBytes(4).toString('hex').toUpperCase();
    exists = !!(await Business.findOne({ business_code: code }).lean());
  }
  return code!;
}
