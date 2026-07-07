import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from '../../services/store';

import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

import uiStyles from '../ui/app-header/app-header.module.css';

export const AppHeader: FC = () => {
  const { user } = useSelector((state) => state.user);
  const userName = user?.name || '';

  const setActiveClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? `${uiStyles.link || ''} text text_type_main-default ${uiStyles.link_active || ''}`
      : `${uiStyles.link || ''} text text_type_main-default text_color_inactive`;

  return (
    <header className={uiStyles.header}>
      <nav className={`${uiStyles.menu} p-4`}>
        <div className={uiStyles.menu_part_left}>
          <NavLink to='/' className={setActiveClass}>
            {({ isActive }) => (
              <>
                <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
                <span className='ml-2 mr-10'>Конструктор</span>
              </>
            )}
          </NavLink>

          <NavLink to='/feed' className={setActiveClass}>
            {({ isActive }) => (
              <>
                <ListIcon type={isActive ? 'primary' : 'secondary'} />
                <span className='ml-2'>Лента заказов</span>
              </>
            )}
          </NavLink>
        </div>

        <div className={uiStyles.logo}>
          <NavLink to='/'>
            <Logo className='' />
          </NavLink>
        </div>

        <div className={uiStyles.link_position_last}>
          <NavLink to='/profile' className={setActiveClass}>
            {({ isActive }) => (
              <>
                <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
                <span className='ml-2'>{userName || 'Личный кабинет'}</span>
              </>
            )}
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
