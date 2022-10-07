import { configureStore } from '@reduxjs/toolkit'
import { userReducder } from './Reducers/User'

const store = configureStore({
    reducer: {
        user:userReducder
    }
})
export default store
