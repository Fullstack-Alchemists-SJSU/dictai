import {combineReducers, configureStore} from "@reduxjs/toolkit"
import userReducer from "../redux/user/userSlice"
import callLogsReducer from "../redux/callLogs/callLogsSlice"
import summaryReducer from "../redux/summary/summarySlice"
import todosReducer from "../redux/todos/todosSlice"
import {useDispatch, useSelector} from "react-redux"
import AsyncStorage from "@react-native-async-storage/async-storage"
import {persistReducer} from "redux-persist"

const reducers = combineReducers({
	user: userReducer,
	callLogs: callLogsReducer,
	summary: summaryReducer,
	todos: todosReducer,
})

const persistConfig = {
	key: "dict",
	storage: AsyncStorage,
}

const persistedReducer = persistReducer(persistConfig, reducers)

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({serializableCheck: false}),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store
export type AppThunk = (dispatch: AppDispatch, state: RootState) => void

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
