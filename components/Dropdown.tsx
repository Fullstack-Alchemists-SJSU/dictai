import React, {useEffect, useState} from "react"
import {View, StyleSheet} from "react-native"
import {Menu, Button, Text} from "react-native-paper"
import ThemedButton from "./ThemedButton"
import theme from "@/constants/Theme"
import {ThemedSubtitle} from "./ThemedText"
import {ScreenSize} from "@/hooks/useDevice"

export interface IOption {
	text: string
	value: string
}

interface IDropdown {
	dimension: ScreenSize
	options: IOption[]
	onOptionSelected: (option: IOption) => void
}

const Dropdown = ({dimension, options, onOptionSelected}: IDropdown) => {
	const [visible, setVisible] = useState(false)
	const [selectedOption, setSelectedOption] = useState("Select an option")

	const openMenu = () => {
		console.log("in openMenu")
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
			<Text
				style={{
					...(dimension == ScreenSize.MEDIUM
						? {fontSize: 32}
						: {fontSize: 16}),
					color: "black",
					marginHorizontal: 8,
				}}>
				Gender
			</Text>
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
		<Menu visible={visible} onDismiss={closeMenu} anchor={anchor}>
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
