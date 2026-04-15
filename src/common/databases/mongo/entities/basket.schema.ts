import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { BasketStatus } from '../../../enums/basket-status.enum';
import { SaleType } from '../../../enums/sale-type.enum';

export type BasketDocument = HydratedDocument<Basket>;

export class BasketItem {
  @Prop({ required: true })
  productId: string;

  @Prop({ required: true })
  productName: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;

  @Prop()
  quantityTypeCode: string;

  @Prop()
  categoryCode: string;
}

// Note: versionKey is not used for optimistic locking. In this project, status-based control is preferred, so versionKey has been disabled.
@Schema({ timestamps: true, versionKey: false })
export class Basket {
  @Prop({
    type: String,
    required: true,
  })
  _id: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String })
  pumpNo: string;

  @Prop({ type: Number, default: 0 })
  totalAmount: number;

  @Prop({ type: [BasketItem] })
  items: BasketItem[];

  @Prop({ type: Number })
  zNo: number;

  @Prop({ type: Number })
  receiptNo: number;

  @Prop({ type: String, enum: SaleType })
  saleType: SaleType;

  @Prop({
    type: [Object],
    default: undefined,
  })
  paymentItems: any[];

  @Prop({
    type: String,
    required: false,
  })
  paymentSlips?: string;

  @Prop({
    type: String,
    enum: BasketStatus,
    default: BasketStatus.CREATED,
  })
  status: BasketStatus;

  @Prop({ type: String })
  createdBy: string;

  @Prop({ type: String })
  lockedBy: string;

  @Prop({ type: String })
  paidBy: string;

  @Prop({ type: String })
  completedBy: string;

  @Prop({ type: Date })
  lockedAt: Date | null;

  @Prop({ type: Date })
  paidAt: Date | null;

  @Prop({ type: Date })
  completedAt: Date | null;

  @Prop({ type: Date })
  receiptDate: Date | null;

  @Prop({ type: String })
  distributionCompanyId: string;

  @Prop({ type: String })
  merchantId: string;

  @Prop({ type: String })
  branchId: string;

  @Prop({ type: String })
  fiscalId: string;

  // ======== METADATA PART ========
  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const BasketSchema = SchemaFactory.createForClass(Basket);

BasketSchema.index({ branchId: 1, _id: 1 });
BasketSchema.index({ branchId: 1, status: 1 });
BasketSchema.index({ branchId: 1, status: 1, _id: 1 });
