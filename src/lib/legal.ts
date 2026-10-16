import 'server-only';
import { z } from 'zod';
import data from '../../content/legal.json';
import { site } from './content';
export const legal = z
  .object({
    operatorLegalName: z.string(),
    mailingAddress: z.string(),
    country: z.string(),
    updatedAt: z.iso.date(),
  })
  .parse(data);
export const operatorName = legal.operatorLegalName || site.name;
export const policyDate = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'long',
  timeZone: 'UTC',
}).format(new Date(`${legal.updatedAt}T12:00:00Z`));
