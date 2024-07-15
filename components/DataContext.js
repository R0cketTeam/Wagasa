import React, { createContext, useState, useRef } from 'react';

// Context oluştur
export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [data, setData] = useState(null);
    const [cata, setCata] = useState(false)

    return (
        <DataContext.Provider value={{ data, setData, cata, setCata }}>
            {children}
        </DataContext.Provider>
    );
};
