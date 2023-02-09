const favs = (state, action) => {
    switch (action.type) {
        case "SET_TRANSACTION_ID":
            return { ...state, merchantTransactionId: action.payload }


        default:
            return state;
    }


}

export default favs