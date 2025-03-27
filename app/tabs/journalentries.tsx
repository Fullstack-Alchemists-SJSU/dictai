import Container from "@/components/Container";
import { View, FlatList } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import ThemedButton from "@/components/ThemedButton";
import Spacer from "@/components/Spacer";
import {SmallThemedSubtitle}  from "@/components/ThemedText";
import useDevice, {ScreenSize} from "@/hooks/useDevice"
import ThemedInput from "@/components/ThemedInput";
import { ScreenHeader } from "@/components/ScreenHeader";

interface JournalEntry {
  id: string;
  title: string;
  date: string;
  content: string;
}

const mockData: JournalEntry[] = [
  { id: "1", title: "AI Generated Title", date: "08/08/2024", content: "I had an amazing day, today I presented a feature to a client and it got approved instantly..." },
  { id: "2", title: "AI Generated Title", date: "08/08/2024", content: "I had an amazing day, today I presented a feature to a client and it got approved instantly..." },
  { id: "3", title: "AI Generated Title", date: "08/08/2024", content: "I had an amazing day, today I presented a feature to a client and it got approved instantly..." },
];

const JournalEntries = () => {
    const dimension = useDevice()
  return (
    <Container>
      {/* Screen Header */}
      <ScreenHeader title="Journal Entries" />

      {/* Search Input */}
      <ThemedInput label="Search" value="" />

      <Spacer direction="vertical" size={12} />

      {/* Record New Journal Button */}
      <ThemedButton
        text="Record New Journal"
        mode="contained"
        textColor="white"
        onPress={() => console.log("Start Recording")}
      />

      <Spacer direction="vertical" size={12} />

      {/* Journal List */}
      <FlatList
        data={mockData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{
            flexDirection: "row",
            backgroundColor: "#f9f9f9",
            padding: 12,
            borderRadius: 10,
            marginBottom: 10,
          }}>
            <Icon name="play-circle-outline" size={24} color="#888" />
            <View style={{
                flex: 1,
                marginLeft: 10,
            }}>
              <SmallThemedSubtitle 
              dimension={dimension}
              text={item.title} />
              <SmallThemedSubtitle 
              dimension={dimension}
              text={item.date} color="#888" />
              <SmallThemedSubtitle 
              dimension={dimension}
              text={item.content} color="#555" />
            </View>
            <Icon name="ellipsis-vertical" size={20} color="#888" />

            
          </View>
        )}
      />

    </Container>
  );
};

export default JournalEntries;
