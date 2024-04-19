import React from 'react'
import { useState } from 'react';

const myArray = [
  ['item1', 'item2'],
  ['item3', 'item4']
];

const Settings  = () => {
  const [hiddenButtons, setHiddenButtons] = useState([]);

  const handleClick = (rowIndex, itemIndex) => {
    const updatedHiddenButtons = [];
    updatedHiddenButtons.push(`${rowIndex}-${itemIndex}`);
    setHiddenButtons(updatedHiddenButtons);
  };

  return (
    <div>
      {myArray.map((row, rowIndex) => (
        <div key={rowIndex}>
          {row.map((item, itemIndex) => (
            <span key={itemIndex}>
              {item}
              {!hiddenButtons.includes(`${rowIndex}-${itemIndex}`) && (
                <button onClick={() => handleClick(rowIndex, itemIndex)}>Нажать</button>
              )}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};


export default Settings