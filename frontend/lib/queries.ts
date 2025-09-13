// lib/queries.ts
import { useQuery } from '@tanstack/react-query';
import { api } from './api';

export const useCurrentUser = () =>
  useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const res = await api.get('/auth/me');
      return res.data.user;
    },
    retry: false, // Don't retry if unauthenticated
  });
