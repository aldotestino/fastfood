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
  CLIENT='CLIENT',
  COOK='COOK',
  ADMIN='ADMIN'
}

export interface LoginVariables {
  email: string
  password: string,
  role: UserRole
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

export interface Client extends UserGeneral {
  firstName: string
  lastName: string
}

export type Cook = UserGeneral

export interface User {
  role: UserRole
  client: Client | null
  cook: Cook | null
}

export enum OrderState {
  PENDING='PENDING',
  TAKEN='TAKEN',
  CLOSED='CLOSED'
}

export interface Order {
  id: string
  amount: number,
  state: OrderState,
  dateTime: string
}

export type OnSubmitFunc<T> = (values: T, formikHelpers: FormikHelpers<T>) => void;
