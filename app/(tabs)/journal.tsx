import {useState} from "react"
import Container from "@/components/Container"
import ThemedButton from "@/components/ThemedButton"
import getWindowDimens, {ScreenSize} from "@/utils/getWindowDimens"
import {useRouter} from "expo-router"
import {Image, View} from "react-native"
import {SmallThemedHeader, SmallThemedSubtitle} from "@/components/ThemedText"
import theme from "@/constants/Theme"
const journal = require("../../assets/images/journal.png")
import { IconButton } from "react-native-paper";
import { ScreenHeader } from "@/components/ScreenHeader";

const Journal = () => {
    const dimension = getWindowDimens()
	const router = useRouter()
    const [isRecording, setIsRecording] = useState(false);
    const [audio, setAudio] = useState<string | null>(null);

    const toggleRecording = () => {
        setIsRecording((prev) => !prev); // Toggle recording state
    };

    const handleAudio = (audio: string) => {
        setAudio(audio);
    };

    const onJournalScreen = () => {
		router.push("/records")
	}

    return (

        <Container>
            <ScreenHeader title="Journal" />
            <View
            style={{ alignItems: "center" }}>

                <SmallThemedHeader 
                    dimension={dimension} 
                    text='Lets get your journal started' /> 

                <SmallThemedSubtitle
					dimension={dimension}
					text='Your voice will bring this space to life.'
					color={theme.colors.subtitle}

				/>

                <Image
					source={journal}
					style={{
						marginHorizontal: "auto",
						marginVertical: "auto",
						width: dimension == ScreenSize.MEDIUM ? 600 : 350,
						height: dimension == ScreenSize.MEDIUM ? 600 : 300,
						resizeMode: "contain",
					}}
				/>



             {/* Mic Button for Recording */}
             <IconButton
                    icon={isRecording ? "microphone-off" : "microphone"} // Change icon dynamically
                    size={40}
                    onPress={toggleRecording} // Toggle function
                    style={{ marginTop: 20 }}
                />

                <ThemedButton
					onPress={onJournalScreen}
					text='See Journal Entries'
					mode='outlined'
					textColor='black'
				/>

            </View>


        </Container>



    );
    }

    export default Journal;