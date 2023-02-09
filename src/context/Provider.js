import React, { createContext, useState } from 'react'


export const GlobalContext = createContext({})

export const GlobalProvider = ({ children }) => {
    // const [favState, favDispatch] = useReduser(favs, favInitialState)

    const [transaction, setTransaction] = useState(
        {}
    )


    return (
        <GlobalContext.Provider
            value={{ transaction, setTransaction }} >
            {children}
        </GlobalContext.Provider>
    )
}