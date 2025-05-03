import { useContext } from 'react';
import { AuthContext } from '../app/auth/providers/AuthProvider';

export const useAuth = () => {
    return useContext(AuthContext);
};