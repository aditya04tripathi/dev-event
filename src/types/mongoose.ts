import { Document } from 'mongoose';

export type HydratedModel<T> = Document & T;
