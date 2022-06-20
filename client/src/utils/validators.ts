import * as Yup from 'yup';

export const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Email non valida').required('Questo campo è obbligatorio'),
  password: Yup.string().min(5, 'Passowrd troppo corta').required('Questo campo è obbligatorio')
});

export const CustomerSignupSchema = Yup.object().shape({
  firstName: Yup.string().required('Questo campo è obbligatorio'),
  lastName: Yup.string().required('Questo campo è obbligatorio'),
  email: Yup.string().email('Email non valida').required('Questo campo è obbligatorio'),
  password: Yup.string().min(5, 'Passowrd troppo corta').required('Questo campo è obbligatorio')
});

export const CookSignupSchema = Yup.object().shape({
  email: Yup.string().required('Questo campo è obbligatorio'),
  password: Yup.string().min(5, 'Passowrd troppo corta').required('Questo campo è obbligatorio')
});

export const ItemSchema = Yup.object().shape({
  name: Yup.string().required('Questo campo è obbligatorio'),
  price: Yup.number().min(0, 'Il prezzo deve essere maggiore di 0').required('Questo campo è obbligatorio'),
});
