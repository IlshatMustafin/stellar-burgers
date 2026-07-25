import reducer, {
  fetchIngredients,
  TIngredientsState
} from './ingredientsSlice';
import { mockIngredients } from '../../../tests/ingredients.mock';

describe('Тестирование слайса ingredientsSlice (Юнит-тесты Jest)', () => {
  const initialState: TIngredientsState = {
    ingredients: [],
    isIngredientsLoading: false,
    error: null
  };

  test('Должен возвращать начальное состояние при передаче неизвестного экшена (UNKNOWN)', () => {
    const result = reducer(undefined, { type: 'UNKNOWN' });
    expect(result).toEqual(initialState);
  });

  test('Должен переключать флаг загрузки при экшене fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const result = reducer(initialState, action);

    expect(result.isIngredientsLoading).toBe(true);
    expect(result.error).toBeNull();
  });

  test('Должен сохранять ингредиенты и выключать лоадер при экшене fetchIngredients.fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const result = reducer(initialState, action);

    expect(result.isIngredientsLoading).toBe(false);
    expect(result.ingredients).toEqual(mockIngredients);
  });

  test('Должен записывать ошибку и выключать лоадер при экшене fetchIngredients.rejected', () => {
    const errorMessage = 'Ошибка сети';
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: errorMessage }
    };
    const result = reducer(initialState, action);

    expect(result.isIngredientsLoading).toBe(false);
    expect(result.error).toBe(errorMessage);
  });
});
