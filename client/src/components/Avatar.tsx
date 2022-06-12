import { Avatar as CAvatar, AvatarProps as CAvatarProps } from '@chakra-ui/react';
import { User, UserRole } from '../utils/types';

const getImageUrl = (firstName: string, lastName: string) => `https://avatars.dicebear.com/api/personas/${firstName}${lastName}.svg`;

interface AvatarProps extends CAvatarProps {
  user: User | null
}

function Avatar({ user, ...rest }: AvatarProps) {
  return (
    <CAvatar {...rest}
      src={
        user && user.role === UserRole.CUSTOMER && user.customer ? getImageUrl(user.customer?.firstName, user.customer?.lastName) : ''
      }
      name={user && user.role === UserRole.COOK && user.cook ? user.cook && user.cook?.email : ''} />
  );
}

export default Avatar;