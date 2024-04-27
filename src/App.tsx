import React from 'react';
import MultiStepForm from './components/MultiStepForm';
import './components/stepStyle.css'
const App: React.FC = () => {
  return (
    <div className='bigBox'>
      <MultiStepForm />
    </div>
  );
};

export default App;
