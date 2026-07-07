import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { logoutUserThunk, logout } from '../../services/slices/userSlice';
import { ProfileMenuUI } from '@ui';

export const ProfileMenu: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => {
    dispatch(logoutUserThunk())
      .unwrap()
      .then(() => {
        dispatch(logout());
        navigate('/login', { replace: true });
      })
      .catch(() => {});
  };

  return (
    <ProfileMenuUI handleLogout={handleLogout} pathname={location.pathname} />
  );
};
