import * as Yup from 'yup';

export const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Email non valida').required('Questo campo è obbligatorio'),
  password: Yup.string().min(5, 'Passowrd troppo corta').required('Questo campo è obbligatorio')
});

export const SignupSchema = Yup.object().shape({
  firstName: Yup.string().required('Questo campo è obbligatorio'),
  lastName: Yup.string().required('Questo campo è obbligatorio'),
  email: Yup.string().email('Email non valida').required('Questo campo è obbligatorio'),
  password: Yup.string().min(5, 'Passowrd troppo corta').required('Questo campo è obbligatorio')
});
