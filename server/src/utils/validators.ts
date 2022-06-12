import * as Yup from 'yup';

export const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Email non valida').required('Campo "email" obbligatorio'),
  password: Yup.string().min(5, 'Passowrd troppo corta').required('Campo "password" obbligatorio')
});

export const CustomerSignupSchema = Yup.object().shape({
  firstName: Yup.string().required('Campo "firstName" obbligatorio'),
  lastName: Yup.string().required('Campo "lastName" obbligatorio'),
  email: Yup.string().email('Email non valida').required('Campo "email" obbligatorio'),
  password: Yup.string().min(5, 'Passowrd troppo corta').required('Campo "password" obbligatorio')
});

export const CookSignupSchema = Yup.object().shape({
  email: Yup.string().email('Email non valida').required('Campo "email" obbligatorio'),
  password: Yup.string().min(5, 'Passowrd troppo corta').required('Campo "password" obbligatorio')
});
