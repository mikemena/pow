import React, { useState } from 'react';

const AccordionParent = ({ children }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleToggle = index => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div>
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child, {
          isActive: index === activeIndex,
          onToggle: () => handleToggle(index)
        })
      )}
    </div>
  );
};

export default AccordionParent;
