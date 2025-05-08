import { useState } from "react";
import Container from "@/components/Container";
import { View, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { ScreenHeader } from "@/components/ScreenHeader";
import ThemedButton from "@/components/ThemedButton";
import { ThemedHeader, ThemedSubtitle, SmallThemedSubtitle } from "@/components/ThemedText";
import Spacer from "@/components/Spacer";
import { LoadingDialog } from "@/components/LoadingDialog";
import getWindowDimens from "@/utils/getWindowDimens";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { generateSummary } from "@/redux/summary/summarySlice";
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from 'expo-linear-gradient';

const Summary = () => {
  const dimension = getWindowDimens();
  const dispatch = useAppDispatch();
  const { entries } = useAppSelector(state => state.callLogs);
  const { summaries, loading, error } = useAppSelector(state => state.summary);
  const [expandedSummary, setExpandedSummary] = useState<string | null>(null);

  const handleGenerateSummary = async () => {
    if (entries.length === 0) return;
    dispatch(generateSummary(entries));
  };

  const toggleSummary = (id: string) => {
    setExpandedSummary(expandedSummary === id ? null : id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Container>
      <LinearGradient
        colors={['#f8f9fa', '#ffffff']}
        style={styles.container}
      >
        <ScreenHeader title="Weekly Summary" />
        
        <View style={styles.content}>
          <ThemedButton
            text="Generate New Summary"
            mode="contained"
            onPress={handleGenerateSummary}
            textColor={entries.length === 0 || loading ? "#888" : undefined}
          />

          {error && (
            <View style={styles.errorContainer}>
              <SmallThemedSubtitle 
                dimension={dimension}
                text={error}
                color="#d32f2f"
              />
            </View>
          )}

          <Spacer direction="vertical" size={24} />

          {summaries.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="document-text-outline" size={48} color="#888" />
              <ThemedSubtitle
                text="No summaries generated yet"
                dimension={dimension}
                color="#888"
              />
              <SmallThemedSubtitle
                text="Click the button above to generate your first summary"
                dimension={dimension}
                color="#888"
              />
            </View>
          ) : (
            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {summaries.map((summary) => (
                <View key={summary.id} style={styles.summaryCard}>
                  {/* Header Section */}
                  <View style={styles.summaryHeader}>
                    <SmallThemedSubtitle 
                      dimension={dimension}
                      text={formatDate(summary.date)}
                      style={{ fontWeight: 'bold', fontSize: 16 }}
                    />
                    <View style={styles.statusBadge}>
                      <SmallThemedSubtitle 
                        dimension={dimension}
                        text="Weekly Summary"
                        color="#4CAF50"
                      />
                    </View>
                  </View>

                  {/* Metadata Section */}
                  <View style={styles.metadataContainer}>
                    <Icon name="time-outline" size={16} color="#666" />
                    <SmallThemedSubtitle 
                      dimension={dimension}
                      text={`${summary.entries.length} entries`}
                      color="#666"
                      style={{ marginLeft: 4 }}
                    />
                    <Icon name="calendar-outline" size={16} color="#666" style={{ marginLeft: 12 }} />
                    <SmallThemedSubtitle 
                      dimension={dimension}
                      text={new Date(summary.date).toLocaleDateString()}
                      color="#666"
                      style={{ marginLeft: 4 }}
                    />
                  </View>

                  {/* Content Section */}
                  <TouchableOpacity 
                    onPress={() => toggleSummary(summary.id)}
                    style={styles.contentContainer}
                  >
                    <SmallThemedSubtitle
                      text={summary.content}
                      dimension={dimension}
                      color="#333"
                      numberOfLines={expandedSummary === summary.id ? undefined : 3}
                      style={{ textAlign: 'left' }}
                    />
                    <SmallThemedSubtitle 
                      dimension={dimension}
                      text={expandedSummary === summary.id ? "Show less" : "Show more"}
                      color="#2196F3"
                      style={{ marginTop: 8, textAlign: 'left' }}
                    />
                  </TouchableOpacity>

                  {/* Footer Section */}
                  <View style={styles.footerContainer}>
                    <View style={styles.footerBadge}>
                      <Icon name="document-text-outline" size={16} color="#666" />
                      <SmallThemedSubtitle 
                        dimension={dimension}
                        text={`${summary.entries.length} Journal Entries`}
                        color="#666"
                        style={{ marginLeft: 4 }}
                      />
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        <LoadingDialog open={loading} />
      </LinearGradient>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  errorContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(211, 47, 47, 0.1)',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
    padding: 20,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  metadataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
  contentContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  footerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
});

export default Summary; 