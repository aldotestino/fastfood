import create from 'zustand';
import shallow from 'zustand/shallow';
import { Customer, Cook, LoginVariables, User, UserRole } from '../utils/types';
import { API_URL } from '../utils/vars';

interface LoginApiResponse {
  success: boolean
  data: {
    user?: Customer | Cook
    errorMessage?: string
  }
}

interface LoginApiRequest extends LoginVariables {
  role: UserRole
  remember: boolean
}

interface LogoutApiResponse {
  success: boolean
  data?: {
    errorMessage: string
  }
}

interface UserStore {
  user: User | null,
  isAuth: boolean,
  fetch: () => Promise<null>
  login: (values: LoginApiRequest) => Promise<LoginApiResponse>
  logout: () => Promise<LogoutApiResponse>
}

const useStore = create<UserStore>(setState => ({
  user: null,
  isAuth: false,
  fetch: async () => {
    const res = await fetch(`${API_URL}/user/me`, {
      credentials: 'include'
    }).then(r => r.json()); 
    if(res.success) {
      setState({
        isAuth: true,
        user: {
          role: res.data.role,
          customer: res.data.role === UserRole.CUSTOMER ? res.data.user : null,
          cook: res.data.role === UserRole.COOK ? res.data.user : null,
          admin: res.data.role === UserRole.ADMIN ? {
            id: res.data.id
          } : null
        }
      });
    }
    return null;
  },
  login: async ({ role, ...values }) => {
    const userRole = role.toLowerCase();
    const res = await fetch(`${API_URL}/${userRole}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(values)
    }).then(r => r.json());
    if(res.success) {
      setState({
        isAuth: true,
        user: {
          role,
          customer: role === UserRole.CUSTOMER ? res.data.user : null,
          cook: role === UserRole.COOK ? res.data.user: null,
          admin: role === UserRole.ADMIN ? {
            id: res.data.id
          } : null
        }
      });
      return res; 
    }
  },
  logout: async () => {
    const res = await fetch(`${API_URL}/user/logout`, {
      credentials: 'include',
    }).then(r => r.json());
    if(res.success) {
      setState({ user: null, isAuth: false });
    }
    return res;
  }
}));

function useUserStore() {
  return useStore(({ user, isAuth, fetch, login, logout }) => ({ user, isAuth, fetch, login, logout }), shallow);
}

export default useUserStore;