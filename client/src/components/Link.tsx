import { Link as CLink, LinkProps as CLinkProps } from '@chakra-ui/react';
import { Link as RLink } from 'react-router-dom';

interface LinkProps extends CLinkProps {
  to: string
  children: string
}

function Link({ to, children, ...rest }: LinkProps) {
  return (
    <CLink 
      {...rest}
      _hover={{ color: 'yellow.400', textDecoration: 'underline' }} 
      as={RLink}
      to={to}>
      {children}
    </CLink>
  );
}

export default Link;