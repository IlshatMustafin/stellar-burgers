import { FC, memo } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '@ui';

import { TProtectedRouteProps } from './type';

export const ProtectedRoute: FC<TProtectedRouteProps> = memo(
  ({ onlyUnAuth = false, children }) => {
    const { user, isInit } = useSelector((state) => state.user);
    const location = useLocation();
    if (!isInit) {
      return <Preloader />;
    }

    if (onlyUnAuth && user) {
      const from =
        (location.state as { from?: Location })?.from?.pathname || '/';
      return <Navigate to={from} replace />;
    }

    if (!onlyUnAuth && !user) {
      return <Navigate to='/login' state={{ from: location }} replace />;
    }

    return children ? <>{children}</> : <Outlet />;
  }
);
