import { Center, Spinner } from '@chakra-ui/react';

function LoadingPage() {
  return (
    <Center minH="100vh">
      <Spinner color="yellow.400" size="xl" />
    </Center>
  );
}

export default LoadingPage;