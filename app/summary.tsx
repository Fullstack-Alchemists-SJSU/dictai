import { useState } from "react";
import Container from "@/components/Container";
import { View } from "react-native";
import { ScreenHeader } from "@/components/ScreenHeader";
import ThemedButton from "@/components/ThemedButton";
import { ThemedHeader, ThemedSubtitle } from "@/components/ThemedText";
import Spacer from "@/components/Spacer";
import { LoadingDialog } from "@/components/LoadingDialog";
import getWindowDimens from "@/utils/getWindowDimens";

const Summary = () => {
  const dimension = getWindowDimens();
  const [summary, setSummary] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const generateSummary = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call to dictai-summary service
      const response = await fetch('YOUR_SUMMARY_API_ENDPOINT');
      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error('Error generating summary:', error);
      // TODO: Add error handling with Toast component
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <ScreenHeader title="Weekly Summary" />
      
      <View style={{ padding: 16 }}>
        <ThemedButton
          text="Generate Summary"
          mode="contained"
          onPress={generateSummary}
        />

        <Spacer direction="vertical" size={24} />

        {summary ? (
          <ThemedSubtitle
            text={summary}
            dimension={dimension}
          />
        ) : (
          <ThemedSubtitle
            text="Click the button above to generate a summary of your last 7 days"
            dimension={dimension}
          />
        )}
      </View>

      <LoadingDialog open={isLoading} />
    </Container>
  );
};

export default Summary; 