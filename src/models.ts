export interface Meal {
    id: string;
    name: string;
  }
  
  export interface Restaurant {
    id: string;
    name: string;
    availableMeals: string[];
  }
  
  export interface Dish {
    id: string;
    name: string;
    restaurantId: string;
  }
  