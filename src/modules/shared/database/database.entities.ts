import { ModelDefinition } from '@nestjs/mongoose';

import { Waitlist, WaitlistSchema } from '../../internal/waitlist/waitlist.schema';

export const DATABASE_ENTITIES: ModelDefinition[] = [{ name: Waitlist.name, schema: WaitlistSchema }];
