import { Link as CLink, LinkProps as CLinkProps } from '@chakra-ui/react';
import { Link as RLink } from 'react-router-dom';

interface LinkProps extends CLinkProps {
  to: string,
  noColor?: boolean
  children: string
}

function Link({ to, children, noColor=false, ...rest }: LinkProps) {
  return (
    <CLink 
      {...rest}
      _hover={{ color: `${!noColor && 'yellow.400'}`, textDecoration: 'underline' }} 
      as={RLink}
      to={to}>
      {children}
    </CLink>
  );
}

export default Link;