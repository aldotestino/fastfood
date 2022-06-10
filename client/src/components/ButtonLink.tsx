import { Link as CLink, LinkProps as CLinkProps } from '@chakra-ui/react';

interface ButtonLinkProps extends CLinkProps {
  action: () => void
  children: string
}

function ButtonLink({ action, children, ...rest }: ButtonLinkProps) {
  return (
    <CLink 
      {...rest}
      _hover={{ color: 'yellow.400', textDecoration: 'underline' }} 
      onClick={action}
    >
      {children}
    </CLink>
  );
}

export default ButtonLink;