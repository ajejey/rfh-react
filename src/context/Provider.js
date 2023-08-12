import React, { createContext, useState } from 'react'


export const GlobalContext = createContext({})

export const GlobalProvider = ({ children }) => {
    // const [favState, favDispatch] = useReduser(favs, favInitialState)

    const [transaction, setTransaction] = useState(
        {}
    )
    const [volunteeringEvent, setVolunteeringEvent] = useState("")


    return (
        <GlobalContext.Provider
            value={{
                transaction, setTransaction,
                volunteeringEvent, setVolunteeringEvent
            }} >
            {children}
        </GlobalContext.Provider>
    )
}