import { ModelDefinition } from '@nestjs/mongoose';
import { Mongo } from '@token-org/tokenx-energy-util';

import { Waitlist, WaitlistSchema } from '../../internal/waitlist/waitlist.schema';

export const DATABASE_ENTITIES: ModelDefinition[] = [...Mongo.entities, { name: Waitlist.name, schema: WaitlistSchema }];
