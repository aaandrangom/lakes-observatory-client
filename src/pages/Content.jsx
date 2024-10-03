import React from 'react';

const Content = ({ children }) => {
    return (
        <div className="flex flex-col space-y-4">
            {children}
        </div>
    );
};

export default Content;

