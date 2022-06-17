import { FormikHelpers } from 'formik/dist/types';

export enum ItemType {
  APETIZER='APETIZER',
  BURGER='BURGER',
  CLUB_SANDWICH='CLUB_SANDWICH',
  WRAP='WRAP',
  DESSERT='DESSERT',
  DRINK='DRINK'
}

export interface Item {
  id: string
  name: string
  price: number
  imageUrl: string
  ingredients: Array<string>
  type: ItemType
}

export interface CartItem {
  id: string
  item: Item
  quantity: number
}

export enum UserRole {
  CUSTOMER='CUSTOMER',
  COOK='COOK',
  ADMIN='ADMIN'
}

export interface LoginVariables {
  email: string
  password: string,
}

export interface SignupVariables {
  firstName: string,
  lastName: string,
  email: string,
  password: string
}

interface UserGeneral {
  id: string
  email: string
}

export interface Customer extends UserGeneral {
  firstName: string
  lastName: string
}

export type Cook = UserGeneral

export interface User {
  role: UserRole
  customer: Customer | null
  cook: Cook | null
}

export enum OrderState {
  PENDING='PENDING',
  TAKEN='TAKEN',
  CLOSED='CLOSED'
}

export interface OrderSummary {
  id: string
  amount: number,
  state: OrderState,
  dateTime: string
}

export interface Order extends OrderSummary {
  customerId: string,
  cook: Cook,
  items: Array<{
    quantity: number,
    item: Item
  }>
}

export interface OrderChangeSocketEvent {
  orderId: string
  state: OrderState
  cookEmail: string
  cookId: string
}

export interface NewOrderSocketEVent {
  orderId: string
  state: OrderState
  amount: number
  dateTime: string
}

export type OnSubmitFunc<T> = (values: T, formikHelpers: FormikHelpers<T>) => void;
