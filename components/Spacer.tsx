import {View} from "react-native"
interface ISpacer {
	direction: "vertical" | "horizontal"
	size: number
}

const Spacer = ({direction, size}: ISpacer) => (
	<View
		style={
			direction == "vertical"
				? {marginVertical: size}
				: {marginHorizontal: size}
		}
	/>
)

export default Spacer
