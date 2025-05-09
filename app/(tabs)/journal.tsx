import {useState, useEffect} from "react"
import Container from "@/components/Container"
import getWindowDimens, {ScreenSize} from "@/utils/getWindowDimens"
import {useRouter} from "expo-router"
import {Image, View, TouchableOpacity, StyleSheet, ActivityIndicator} from "react-native"
import {SmallThemedHeader, SmallThemedSubtitle} from "@/components/ThemedText"
import theme from "@/constants/Theme"
const journal = require("../../assets/images/journal.png")
import { ScreenHeader } from "@/components/ScreenHeader";
import vapi from "@/vapi/vapi.sdk"
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Journal = () => {
    const dimension = getWindowDimens()
	const router = useRouter()
    const [isRecording, setIsRecording] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [audio, setAudio] = useState<string | null>(null);

    useEffect(() => {
        // Listen for call end event
        const handleCallEnd = () => {
            setIsRecording(false);
        };

        // Listen for call start event
        const handleCallStart = () => {
            setIsConnecting(false);
            setIsRecording(true);
        };

        // Add event listeners
        vapi.on('call-end', handleCallEnd);
        vapi.on('call-start', handleCallStart);

        // Cleanup
        return () => {
            vapi.off('call-end', handleCallEnd);
            vapi.off('call-start', handleCallStart);
        };
    }, []);

    const toggleRecording = async () => {
        if(!isRecording){
            try {
                setIsConnecting(true);
                await vapi.start("6edb3577-1bf6-4ae5-924a-6966c16f831e");
            } catch (error) {
                console.error('Failed to start recording:', error);
                setIsConnecting(false);
            }
        } else {
            try {
                await vapi.stop();
            } catch (error) {
                console.error('Failed to stop recording:', error);
            }
        }
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

                {/* Custom Recording Button */}
                <TouchableOpacity
                    onPress={toggleRecording}
                    disabled={isConnecting}
                    style={[
                        styles.recordingButton,
                        isRecording ? styles.stopButton : styles.recordButton
                    ]}
                >
                    {isConnecting ? (
                        <ActivityIndicator size="large" color="white" />
                    ) : isRecording ? (
                        <MaterialCommunityIcons name="stop" size={40} color="white" />
                    ) : (
                        <MaterialCommunityIcons name="microphone" size={40} color="white" />
                    )}
                </TouchableOpacity>

            </View>


        </Container>



    );
    }

const styles = StyleSheet.create({
    recordingButton: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    recordButton: {
        backgroundColor: '#2196F3', // Blue color
    },
    stopButton: {
        backgroundColor: '#FF5252', // Red color
    }
});

export default Journal;