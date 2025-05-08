import React, { useState } from "react"
import { View } from "react-native"
import { Menu } from "react-native-paper"
import ThemedButton from "./ThemedButton"
import theme from "@/constants/Theme"
import { ScreenSize } from "@/utils/getWindowDimens"
export interface IOption {
	text: string
	value: string
}

interface IDropdown {
	dimension: ScreenSize
	options: IOption[]
	onOptionSelected: (option: IOption) => void
	defaultSelection: string
	label?: string
}

const Dropdown = ({ dimension, options, onOptionSelected, defaultSelection, label }: IDropdown) => {
	const [visible, setVisible] = useState(false)
	const [selectedOption, setSelectedOption] = useState(defaultSelection ?? "Select")

	const openMenu = () => {
		setVisible(true)
	}
	const closeMenu = () => setVisible(false)

	const handleSelect = (option: IOption) => {
		setSelectedOption(option.text)
		onOptionSelected(option)
		closeMenu()
	}

	const anchor = (
		<View>
			<ThemedButton
				mode='outlined'
				onPress={openMenu}
				text={selectedOption}
				textColor={theme.colors.subtitle}
				textAlign='left'
			/>
		</View>
	)

	return (
		<Menu visible={visible} onDismiss={closeMenu} anchor={anchor} anchorPosition="bottom">
			{options.map((option: IOption) => (
				<Menu.Item
					onPress={() => handleSelect(option)}
					title={option.text}
					key={option.value}
				/>
			))}
		</Menu>
	)
}

export default Dropdown
