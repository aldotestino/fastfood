import { Flex } from '@chakra-ui/react';
import { Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './views/Home';
import Menu from './views/Menu';
import Checkout from './views/Checkout';

function App() {
  return (
    <Flex minH="100vh" direction="column">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />}/>
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </Flex>
  );
}

export default App;
