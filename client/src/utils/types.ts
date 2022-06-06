import { FormikHelpers } from 'formik/dist/types';

export interface Food {
  name: string
  price: number
  image: string
}

export interface CartItem {
  id: string
  item: Food
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
