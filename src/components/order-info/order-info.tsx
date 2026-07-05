import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchFeedThunk,
  fetchUserOrdersThunk
} from '../../services/slices/feedSlice';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { Preloader } from '@ui';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();
  const orderNumber = Number(number);
  const { ingredients } = useSelector((state) => state.ingredients);
  const { orders, userOrders } = useSelector((state) => state.feed);

  useEffect(() => {
    if (!orders.length) dispatch(fetchFeedThunk());
    if (!userOrders.length) dispatch(fetchUserOrdersThunk());
  }, [dispatch, orders.length, userOrders.length]);

  const orderData = useMemo(() => {
    const allOrders = [...orders, ...userOrders];
    return allOrders.find((item) => item.number === orderNumber) || null;
  }, [orders, userOrders, orderNumber]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce<TIngredientsWithCount>(
      (acc, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
