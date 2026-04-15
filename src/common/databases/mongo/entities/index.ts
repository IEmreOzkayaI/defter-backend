export type { BasketDocument } from './basket.schema';
export { Basket, BasketItem, BasketSchema } from './basket.schema';

import { Basket, BasketSchema } from './basket.schema';

export const entities = [{ name: Basket.name, schema: BasketSchema }];
