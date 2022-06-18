import { Flex } from '@chakra-ui/react';
import { Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './views/Home';
import Menu from './views/Menu';
import Checkout from './views/Checkout';
import Login from './views/Login';
import Signup from './views/Signup';
import useUserStore from './store/userStore';
import { useEffect, useState } from 'react';
import CustomerProfile from './views/customerProfile';
import { UserRole } from './utils/types';
import CookProfile from './views/cookProfile';
import OrderView from './views/OrderView';
import LoadingPage from './components/LoadingPage';
import Cooks from './views/Cooks';
import Transactions from './views/Transactions';

function App() {

  const [isLoading, setIsLoading] = useState(true);
  const { fetch, user, isAuth } = useUserStore();
  useEffect(() => {
    fetch().then(() => setIsLoading(false));
  }, []);

  return (
    <Flex minH="100vh" direction="column">
      <NavBar />
      {!isLoading ? 
        <Routes>
          {!isAuth || user?.role === UserRole.CUSTOMER ? 
            <>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/profile" element={<CustomerProfile />} />
            </>
            : user?.role === UserRole.COOK ?
              <>
                <Route path="/" element={<CookProfile />} />
              </> :
              <>
                <Route path="/" element={<Transactions />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/cooks" element={<Cooks />} />
              </>
          }
          <Route path="order/:orderId" element={<OrderView />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes> : 
        <LoadingPage />
      }
    </Flex> 
  );
}

export default App;
