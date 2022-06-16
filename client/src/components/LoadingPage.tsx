import { Center, Spinner } from '@chakra-ui/react';

function LoadingPage() {
  return (
    <Center h="calc(100vh - 80px)">
      <Spinner color="yellow.400" size="xl" />
    </Center>
  );
}

export default LoadingPage;