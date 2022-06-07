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

export enum Role {
  CLIENT='CLIENT',
  COOK='COOK',
  ADMIN='ADMIN'
}

export interface LoginVariables {
  email: string
  password: string,
  role: Role
}

export interface SignupVariables {
  firstName: string,
  lastName: string,
  email: string,
  password: string
}


export type OnSubmitFunc<T> = (values: T, formikHelpers: FormikHelpers<T>) => void;
