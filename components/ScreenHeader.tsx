import {Stack} from "expo-router"

interface Props {
	title: string
}
export function ScreenHeader({title}: Props) {
	return <Stack.Screen options={{title}} />
}
