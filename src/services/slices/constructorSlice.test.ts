import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor,
  TConstructorState
} from './constructorSlice';
import { mockIngredients } from '../../../tests/ingredients.mock';
import { TConstructorIngredient } from '@utils-types';

describe('Тестирование слайса burgerConstructor / constructorSlice (Юнит-тесты Jest)', () => {
  const initialState: TConstructorState = {
    bun: null,
    ingredients: []
  };

  const testIngredient1: TConstructorIngredient = {
    ...mockIngredients[1],
    id: 'mock-id-1'
  };
  const testIngredient2: TConstructorIngredient = {
    ...mockIngredients[1],
    name: 'Второй соус',
    id: 'mock-id-2'
  };

  test('Должен возвращать начальное состояние при передаче неизвестного экшена (UNKNOWN)', () => {
    const result = reducer(undefined, { type: 'UNKNOWN' });
    expect(result).toEqual(initialState);
  });

  test('Должен добавлять булку в поле bun', () => {
    const bunIngredient = mockIngredients[0];

    const action = addIngredient(bunIngredient);
    const result = reducer(initialState, action);

    expect(result.bun).toEqual(
      expect.objectContaining({
        _id: bunIngredient._id,
        type: 'bun',
        name: bunIngredient.name
      })
    );

    const bunWithId = result.bun as TConstructorIngredient;
    expect(bunWithId?.id).toBeDefined();
    expect(result.ingredients).toHaveLength(0);
  });

  test('Должен добавлять начинку в массив ingredients', () => {
    const mainIngredient = mockIngredients[1];

    const action = addIngredient(mainIngredient);
    const result = reducer(initialState, action);

    expect(result.bun).toBeNull();
    expect(result.ingredients).toHaveLength(1);

    expect(result.ingredients[0]).toEqual(
      expect.objectContaining({
        _id: mainIngredient._id,
        type: 'main',
        name: mainIngredient.name
      })
    );
    expect(result.ingredients[0].id).toBeDefined();
  });

  test('Должен удалять ингредиент из массива по его уникальному id', () => {
    const stateWithIngredients: TConstructorState = {
      bun: null,
      ingredients: [testIngredient1, testIngredient2]
    };

    const action = removeIngredient('mock-id-1');
    const result = reducer(stateWithIngredients, action);

    expect(result.ingredients).toHaveLength(1);
    expect(result.ingredients[0].id).toBe('mock-id-2');
  });

  test('Должен перемещать ингредиент вверх по списку через moveIngredientUp', () => {
    const stateWithIngredients: TConstructorState = {
      bun: null,
      ingredients: [testIngredient1, testIngredient2]
    };

    const action = moveIngredientUp(1);
    const result = reducer(stateWithIngredients, action);

    expect(result.ingredients[0].id).toBe('mock-id-2');
    expect(result.ingredients[1].id).toBe('mock-id-1');
  });

  test('Должен перемещать ингредиент вниз по списку через moveIngredientDown', () => {
    const stateWithIngredients: TConstructorState = {
      bun: null,
      ingredients: [testIngredient1, testIngredient2]
    };

    const action = moveIngredientDown(0);
    const result = reducer(stateWithIngredients, action);

    expect(result.ingredients[0].id).toBe('mock-id-2');
    expect(result.ingredients[1].id).toBe('mock-id-1');
  });

  test('Должен полностью очищать конструктор через clearConstructor', () => {
    const fullState: TConstructorState = {
      bun: mockIngredients[0],
      ingredients: [testIngredient1, testIngredient2]
    };

    const action = clearConstructor();
    const result = reducer(fullState, action);

    expect(result).toEqual(initialState);
  });
});
