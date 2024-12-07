import {View} from "react-native"

const Container = ({children}: any) => {
	return (
		<View
			style={{
				backgroundColor: "#FFFFFF",
				width: "100%",
				height: "100%",
				padding: 16,
			}}>
			{children}
		</View>
	)
}

export default Container
