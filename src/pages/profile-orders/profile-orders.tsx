import { useEffect, FC } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUserOrdersThunk } from '../../services/slices/feedSlice';
import { ProfileOrdersUI } from '@ui-pages';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const { userOrders } = useSelector((state) => state.feed);

  useEffect(() => {
    dispatch(fetchUserOrdersThunk());
  }, [dispatch]);

  return <ProfileOrdersUI orders={userOrders} />;
};
