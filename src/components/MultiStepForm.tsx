import React, { useState } from 'react';
import dishesData from './dishes.json'

type MealCategory = 'breakfast' | 'lunch' | 'dinner';

interface DishSelection {
  [key: string]: number;
}

interface Selections {
  meal: MealCategory;
  people: number;
  restaurant: string;
  dishes: DishSelection;
}

const steps = [
  { id: 'Step1', name: 'Step1', key: 1, },
  { id: 'Step2', name: 'Step2', key: 2, },
  { id: 'Step3', name: 'Step3', key: 3, },
  { id: 'Review', name: 'Review', key: 4, },
];

const getRestaurantsForMeal = (meal: MealCategory) => {
  const restaurants = dishesData
    .filter(dish => dish.availableMeals.includes(meal))
    .map(dish => dish.restaurant);
  return Array.from(new Set(restaurants));
};

const SelectMealComponent = ({ selections, setSelections, goToNextStep }: {
  selections: Selections;
  setSelections: (selections: Selections) => void;
  goToNextStep: () => void;
}) => {
  const [isValidPeople, setIsValidPeople] = useState(true);
  const isNextDisabled = selections.people <= 0 || selections.people > 10;

  const handlePeopleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const peopleCount = parseInt(e.target.value);
    if (peopleCount < 1 || peopleCount > 10) {
      setIsValidPeople(false);
    } else {
      setIsValidPeople(true);
    }
    setSelections({ ...selections, people: peopleCount });
  };

  return (
    <div className="flex flex-col items-center font-mono  "> {/* 容器宽度设为全宽 */}
      <div className="mb-4 w-1/3 ">
        <label className="block text-gray-700 text-sm font-bold mb-2 whitespace-nowrap" htmlFor="meal">
          Please Select a meal
        </label>
        <div className="relative">
          <select
            className="shadow border rounded py-2 pl-3 pr-8 text-gray-700 leading-tight focus:outline-none focus:shadow-outline appearance-none w-full"
            id="meal"
            value={selections.meal}
            onChange={e => setSelections({ ...selections, meal: e.target.value as MealCategory })}
          >
            <option value="" hidden>Select a meal...</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">  {/* 用于在select元素内部定位下拉箭头的icon */}
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M5.5 7L10 11.5L14.5 7H5.5Z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="mb-6 w-1/3">
        <label className="block text-gray-700 text-sm font-bold mb-2 whitespace-nowrap" htmlFor="people">
          Please Enter Number of people
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="people"
          type="number"
          value={selections.people}
          onBlur={handlePeopleChange}
          onChange={handlePeopleChange}
          min={1}
          max={10}
        />
        {!isValidPeople && (
          <p className="text-red-500 text-xs italic mt-2">
            Please enter a number of people between 1 and 10.
          </p>
        )}
      </div>
      <div className='w-1/3 text-end'>
        <button
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline  ${isNextDisabled && 'opacity-50 cursor-not-allowed'}`}
          disabled={isNextDisabled}
          onClick={goToNextStep}
        >
          Next
        </button>
      </div>
    </div>
  );
};


const SelectRestaurantComponent = ({ meal, selections, setSelections, goToNextStep, goToPreviousStep }: {
  meal: MealCategory;
  selections: Selections;
  setSelections: (selections: Selections) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}) => {
  const isNextDisabled = selections.restaurant === '';
  const restaurants = getRestaurantsForMeal(meal);
  return (
    <div className="flex flex-col items-center">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="restaurant">
          Please Select a Restaurant
        </label>
        <div className="relative">
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="restaurant"
            value={selections.restaurant}
            onChange={e => setSelections({ ...selections, restaurant: e.target.value, dishes: {} })}
          >
            <option hidden value="">Select a restaurant...</option>
            {restaurants.map(restaurant => (
              <option key={restaurant} value={restaurant}>
                {restaurant}
              </option>

            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">  {/* 用于在select元素内部定位下拉箭头的icon */}
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M5.5 7L10 11.5L14.5 7H5.5Z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="flex w-9/12 justify-between">
        <button
          className="bg-sky-500 hover:bg-sky-700 mr-5 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={goToPreviousStep}
        >
          Previous
        </button>
        <button
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isNextDisabled && 'opacity-50 cursor-not-allowed'}`}
          onClick={goToNextStep}
          disabled={isNextDisabled}
        >
          Next
        </button>
      </div>
    </div>
  );
};

const SelectDishesComponent = ({
  selections,
  setSelections,
  goToNextStep,
  goToPreviousStep,
}: {
  selections: Selections;
  setSelections: (selections: Selections) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}) => {
  const [selectedDish, setSelectedDish] = useState('');
  const [isValidDishes, setIsValidDishes] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const dishesOptions = dishesData.filter(
    dish =>
      dish.restaurant === selections.restaurant &&
      dish.availableMeals.includes(selections.meal) &&
      !selections.dishes[dish.id] // Filter out already selected dishes
  );

  const totalDishesCount = Object.values(selections.dishes).reduce((sum, qty) => sum + qty, 0);
  const isNextDisabled = totalDishesCount < selections.people;

  const addDish = () => {
    if (selectedDish && quantity > 0) {
      setIsValidDishes(true);
      const dishId = dishesOptions.find(dish => dish.name === selectedDish)?.id;
      if (dishId) {
        setSelections({
          ...selections,
          dishes: { ...selections.dishes, [dishId]: (selections.dishes[dishId] || 0) + quantity },
        });
        setSelectedDish(''); // Reset selection
        setQuantity(1); // Reset quantity
      }
    } else {
      setIsValidDishes(false);
    }
  };

  const selectedDishesEntries = Object.entries(selections.dishes);

  return (
    <div className="flex flex-col items-center">
      {selectedDishesEntries.length > 0 && (
        <div className="mb-4" data-testid="dish-quantity">
          {selectedDishesEntries.map(([id, quantity]) => {
            const dish = dishesData.find(dish => dish.id.toString() === id);
            return (
              <div key={id} className="flex items-center py-2">
                <span className="text-gray-700 inline-block min-w-56">{dish?.name}</span>
                <span className="text-gray-700 inline-block">x {quantity}</span>
              </div>
            );
          })}
        </div>
      )}
      <div className="flex space-x-4 mb-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor='dishesSelect'>
            Please Select a Dish
          </label>
          <select
            id="dishesSelect"
            className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={selectedDish}
            onChange={(e) => setSelectedDish(e.target.value)}
          >
            <option hidden value="">---</option>
            {dishesOptions.map((dish) => (
              <option key={dish.id} value={dish.name}>
                {dish.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor='servings'>
            Please enter no. of servings
          </label>
          <input
            id="servings"
            className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            min={1}
          />
        </div>
      </div>
      <div className='w-9/12 flex mb-4 justify-end'>
        <button
          className="flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-lg shadow-sm transform transition-colors duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={addDish}
          disabled={!selectedDish || quantity <= 0}
          aria-label="Add"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
      {!isValidDishes && (
        <p className="text-red-500 text-xs italic mt-2 mb-2">
          Please select a dish and specify the quantity before adding.
        </p>
      )}
      {isNextDisabled && (
        <p className="text-red-500 text-xs italic mt-2 mb-4">
          The total number of dishes must be greater than the number of people.
        </p>
      )}
      <div className="flex justify-between w-9/12 mt-4">
        <button
          className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={goToPreviousStep}
        >
          Previous
        </button>
        <button
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isNextDisabled && 'opacity-50 cursor-not-allowed'}`}
          onClick={goToNextStep}
          disabled={isNextDisabled}
        >
          Next
        </button>
      </div>
    </div>
  );
};

const ReviewComponent = ({
  selections,
  goToPreviousStep,
}: {
  selections: Selections;
  goToPreviousStep: () => void;
}) => {
  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-full md:w-9/12"> {/* 使用 md:w-9/12 而不是 w-9/12，以便在中等尺寸及以上设备上限制宽度 */}
        <div className="flex justify-between text-gray-700 text-sm font-bold mb-4">
          <span>Meal:</span>
          <span className="text-gray-800">{selections.meal}</span>
        </div>
        <div className="flex justify-between text-gray-700 text-sm font-bold mb-4">
          <span>No. of People:</span>
          <span className="text-gray-800">{selections.people}</span>
        </div>
        <div className="flex justify-between text-gray-700 text-sm font-bold mb-4">
          <span>Restaurant:</span>
          <span className="text-gray-800">{selections.restaurant}</span>
        </div>
        <div className="text-gray-700 text-sm font-bold mb-4">
          Dishes:
          <div className="bg-gray-100 p-3 rounded-md mt-2">
            {Object.entries(selections.dishes).map(([id, quantity]) => {
              const dish = dishesData.find(dish => dish.id.toString() === id);
              return (
                <div key={id} className="flex justify-between my-1">
                  <span> - {dish?.name}</span>
                  <span className="text-gray-600">x {quantity}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex justify-between w-full md:w-9/12 mt-4"> {/* 同样适用于按钮 */}
        <button
          className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={goToPreviousStep}
        >
          Previous
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={() => console.log(selections)}
        >
          Submit
        </button>
      </div>
    </div>
  );
};


// Main MultiStepForm component
const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selections, setSelections] = useState<Selections>({
    meal: 'lunch',
    people: 1,
    restaurant: '',
    dishes: {},
  });

  const goToNextStep = () => setCurrentStep(current => current + 1);
  const goToPreviousStep = () => setCurrentStep(current => current - 1);
  
  // 头部步骤条
  const headStep = () => {
    let stepList = steps.map(i => {
      // 当前步骤使用加深的背景色和边框来突出显示
      if (currentStep == i.key) {
        return (
          <span
            className='bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg'
            key={i.key}
          >
            {i.name}
          </span>
        );
      } else {
        // 其他步骤则使用更轻的背景色和文本颜色
        return (
          <span
            className='bg-blue-200 text-blue-800 px-4 py-2 rounded-full shadow'
            key={i.key}
          >
            {i.name}
          </span>
        );
      }
    });
    return (
      <div className='flex space-x-4 justify-center'>{stepList}</div> // 使用 flex 布局来排列步骤指示器
    );
  };

  return (
    <div className="container mx-auto p-6 font-mono min-w-96">
      {headStep()}
      <div className="flex flex-col bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          {currentStep === 1 && (
            <SelectMealComponent selections={selections} setSelections={setSelections} goToNextStep={goToNextStep} />
          )}
          {currentStep === 2 && (
            <SelectRestaurantComponent
              meal={selections.meal}
              selections={selections}
              setSelections={setSelections}
              goToNextStep={goToNextStep}
              goToPreviousStep={goToPreviousStep}
            />
          )}
          {currentStep === 3 && (
            <SelectDishesComponent
              selections={selections}
              setSelections={setSelections}
              goToNextStep={goToNextStep}
              goToPreviousStep={goToPreviousStep}
            />
          )}
          {currentStep === 4 && <ReviewComponent selections={selections} goToPreviousStep={goToPreviousStep} />}
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm;

