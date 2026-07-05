import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '@ui';
import { IngredientDetailsUI } from '../ui/ingredient-details';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { ingredients } = useSelector((state) => state.ingredients);
  const ingredientData = ingredients.find((item) => item._id === id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        width: '100%',
        textAlign: 'center',
        marginTop: '40px'
      }}
    >
      <h1 className='text text_type_main-large mb-4'>Детали ингредиента</h1>

      <IngredientDetailsUI ingredientData={ingredientData} />
    </div>
  );
};
