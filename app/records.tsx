import { useState, useEffect } from "react";
import Container from "@/components/Container";
import { View, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import ThemedButton from "@/components/ThemedButton";
import Spacer from "@/components/Spacer";
import {SmallThemedSubtitle}  from "@/components/ThemedText";
import getWindowDimens, {ScreenSize} from "@/utils/getWindowDimens"
import ThemedInput from "@/components/ThemedInput";
import { ScreenHeader } from "@/components/ScreenHeader";
import { fetchCallLogs, fetchCallDetails } from "@/vapi/vapi.sdk";
import { useRouter } from "expo-router";
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

interface JournalEntry {
    id: string;
    title: string;
    date: string;
    duration: number;
    status: string;
    audioUrl: string;
    transcript: string;
    cost: number;
    endedReason?: string;
}

const Records = () => {
    const dimension = getWindowDimens();
    const router = useRouter();
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [initialLoad, setInitialLoad] = useState(true);
    const [expandedTranscripts, setExpandedTranscripts] = useState<Set<string>>(new Set());

    useEffect(() => {
        loadCallLogs();
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, []);

    const loadCallLogs = async (pageNum: number = 1, shouldRefresh: boolean = false) => {
        try {
            setError(null);
            if (shouldRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            console.log('Fetching call logs...');
            const calls = await fetchCallLogs();
            console.log('API Response:', calls);
            
            if (!calls) {
                console.error('No calls data received');
                throw new Error('No data received from API');
            }

            // Transform Vapi call data into journal entries
            const transformedEntries = calls.map((call: any) => {
                console.log('Processing call:', call);
                
                // Calculate duration in seconds
                const startTime = call.startedAt ? new Date(call.startedAt).getTime() : 0;
                const endTime = call.endedAt ? new Date(call.endedAt).getTime() : 0;
                const duration = Math.floor((endTime - startTime) / 1000);

                return {
                    id: call.id || 'unknown',
                    title: `Journal Entry - ${new Date(call.createdAt || Date.now()).toLocaleDateString()}`,
                    date: new Date(call.createdAt || Date.now()).toLocaleDateString(),
                    duration: duration,
                    status: call.status || 'unknown',
                    audioUrl: call.recordingUrl || call.artifact?.recordingUrl || '',
                    transcript: call.transcript || call.artifact?.transcript || "No transcript available",
                    cost: call.cost || 0,
                    endedReason: call.endedReason
                };
            });

            console.log('Transformed entries:', transformedEntries);

            // Always replace entries when refreshing or searching
            if (shouldRefresh || searchQuery) {
                setEntries(transformedEntries);
            } else {
                // Only append new entries when loading more
                setEntries(prev => {
                    // Filter out any duplicates by id
                    const existingIds = new Set(prev.map(entry => entry.id));
                    const newEntries = transformedEntries.filter((entry: JournalEntry) => !existingIds.has(entry.id));
                    return [...prev, ...newEntries];
                });
            }

            setHasMore(transformedEntries.length > 0);
            setInitialLoad(false);
        } catch (error) {
            console.error('Error loading call logs:', error);
            setError(error instanceof Error ? error.message : 'Failed to load call logs');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setPage(1);
        loadCallLogs(1, true);
    };

    const loadMore = () => {
        if (!loading && hasMore) {
            setPage(prev => prev + 1);
            loadCallLogs(page + 1);
        }
    };

    const handleSearch = (text: string) => {
        setSearchQuery(text);
        if (text) {
            loadCallLogs(1, true);
        } else {
            loadCallLogs(1, true);
        }
    };

    const filteredEntries = entries.filter(entry => 
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.transcript.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handlePlayAudio = async (entryId: string, audioUrl?: string) => {
        if (!audioUrl) return;

        try {
            // Stop currently playing audio if any
            if (sound) {
                await sound.unloadAsync();
            }

            // If clicking the same entry that's currently playing, stop it
            if (currentlyPlaying === entryId) {
                setCurrentlyPlaying(null);
                return;
            }

            // Load and play the new audio
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: audioUrl },
                { shouldPlay: true }
            );
            
            setSound(newSound);
            setCurrentlyPlaying(entryId);

            // Clean up when playback finishes
            newSound.setOnPlaybackStatusUpdate(async (status) => {
                if (status.isLoaded && status.didJustFinish) {
                    await newSound.unloadAsync();
                    setCurrentlyPlaying(null);
                }
            });
        } catch (error) {
            console.error('Error playing audio:', error);
        }
    };

    const toggleTranscript = (id: string) => {
        setExpandedTranscripts(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    return (
        <Container>
            <LinearGradient
                colors={['#f8f9fa', '#ffffff']}
                style={{ flex: 1 }}
            >
                <ScreenHeader title="Journal Entries" />

                {/* Search Bar */}
                <View style={{ margin: 16 }}>
                    <ThemedInput 
                        label="Search entries" 
                        value={searchQuery}
                        onChangeText={handleSearch}
                        mode="outlined"
                        returnKeyType="search"
                    />
                </View>

                <Spacer direction="vertical" size={12} />

                {/* Error Message */}
                {error && (
                    <View style={{ 
                        margin: 16,
                        padding: 12,
                        backgroundColor: 'rgba(211, 47, 47, 0.1)',
                        borderRadius: 8,
                        borderLeftWidth: 4,
                        borderLeftColor: '#d32f2f'
                    }}>
                        <SmallThemedSubtitle 
                            dimension={dimension}
                            text={error}
                            color="#d32f2f"
                        />
                    </View>
                )}

                {/* Loading State */}
                {initialLoad && loading ? (
                    <View style={{ 
                        flex: 1, 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        marginTop: 20 
                    }}>
                        <ActivityIndicator size="large" color="#2196F3" />
                        <SmallThemedSubtitle 
                            dimension={dimension}
                            text="Loading your journal entries..."
                            style={{ marginTop: 10 }}
                        />
                    </View>
                ) : (
                    <FlatList
                        data={filteredEntries}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ padding: 16 }}
                        renderItem={({ item }) => (
                            <View style={{
                                backgroundColor: "#ffffff",
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
                            }}>
                                {/* Header Section */}
                                <View style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: 12,
                                }}>
                                    <SmallThemedSubtitle 
                                        dimension={dimension}
                                        text={item.title} 
                                        style={{ 
                                            fontWeight: 'bold',
                                            fontSize: 16,
                                            textAlign: 'left'
                                        }}
                                    />
                                    <View style={{
                                        backgroundColor: item.status === 'ended' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 193, 7, 0.1)',
                                        paddingHorizontal: 12,
                                        paddingVertical: 6,
                                        borderRadius: 20,
                                    }}>
                                        <SmallThemedSubtitle 
                                            dimension={dimension}
                                            text={item.status} 
                                            color={item.status === 'ended' ? '#4CAF50' : '#FFC107'}
                                            style={{ textTransform: 'capitalize' }}
                                        />
                                    </View>
                                </View>

                                {/* Metadata Section */}
                                <View style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginBottom: 12,
                                    backgroundColor: '#f8f9fa',
                                    padding: 12,
                                    borderRadius: 8,
                                }}>
                                    <Icon name="time-outline" size={16} color="#666" />
                                    <SmallThemedSubtitle 
                                        dimension={dimension}
                                        text={`${Math.floor(item.duration / 60)}m ${item.duration % 60}s`}
                                        style={{ marginLeft: 4, textAlign: 'left' }}
                                        color="#666"
                                    />
                                    <Icon name="calendar-outline" size={16} color="#666" style={{ marginLeft: 12 }} />
                                    <SmallThemedSubtitle 
                                        dimension={dimension}
                                        text={item.date}
                                        style={{ marginLeft: 4, textAlign: 'left' }}
                                        color="#666"
                                    />
                                </View>

                                {/* Transcript Section */}
                                {item.transcript && (
                                    <TouchableOpacity 
                                        onPress={() => toggleTranscript(item.id)}
                                        style={{
                                            backgroundColor: '#f8f9fa',
                                            padding: 12,
                                            borderRadius: 8,
                                            marginBottom: 12,
                                        }}
                                    >
                                        <SmallThemedSubtitle 
                                            dimension={dimension}
                                            text={item.transcript}
                                            numberOfLines={expandedTranscripts.has(item.id) ? undefined : 2}
                                            style={{ marginBottom: 8, textAlign: 'left' }}
                                        />
                                        <SmallThemedSubtitle 
                                            dimension={dimension}
                                            text={expandedTranscripts.has(item.id) ? "Show less" : "Show more"}
                                            color="#2196F3"
                                            style={{ marginTop: 4, textAlign: 'left' }}
                                        />
                                    </TouchableOpacity>
                                )}

                                {/* Footer Section */}
                                <View style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    borderTopWidth: 1,
                                    borderTopColor: '#f0f0f0',
                                    paddingTop: 12,
                                }}>
                                    <TouchableOpacity 
                                        onPress={() => handlePlayAudio(item.id, item.audioUrl)}
                                        disabled={!item.audioUrl}
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            backgroundColor: item.audioUrl ? 'rgba(33, 150, 243, 0.1)' : '#f0f0f0',
                                            paddingHorizontal: 12,
                                            paddingVertical: 6,
                                            borderRadius: 20,
                                        }}
                                    >
                                        <Icon 
                                            name={currentlyPlaying === item.id ? "pause-circle" : "play-circle-outline"} 
                                            size={24} 
                                            color={item.audioUrl ? "#2196F3" : "#888"} 
                                        />
                                        <SmallThemedSubtitle 
                                            dimension={dimension}
                                            text="Play Recording"
                                            style={{ marginLeft: 4, textAlign: 'left' }}
                                            color={item.audioUrl ? "#2196F3" : "#888"}
                                        />
                                    </TouchableOpacity>

                                    <View style={{
                                        backgroundColor: '#f8f9fa',
                                        paddingHorizontal: 12,
                                        paddingVertical: 6,
                                        borderRadius: 20,
                                    }}>
                                        <SmallThemedSubtitle 
                                            dimension={dimension}
                                            text={`Cost: $${item.cost.toFixed(4)}`}
                                            color="#666"
                                        />
                                    </View>
                                </View>
                            </View>
                        )}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={['#2196F3']}
                                tintColor="#2196F3"
                            />
                        }
                        onEndReached={loadMore}
                        onEndReachedThreshold={0.5}
                        ListEmptyComponent={
                            !loading && !refreshing ? (
                                <View style={{ 
                                    alignItems: 'center', 
                                    marginTop: 40,
                                    padding: 20,
                                }}>
                                    <Icon name="document-text-outline" size={48} color="#888" />
                                    <SmallThemedSubtitle 
                                        dimension={dimension}
                                        text="No journal entries found"
                                        color="#888"
                                        style={{ marginTop: 12 }}
                                    />
                                </View>
                            ) : null
                        }
                        ListFooterComponent={
                            hasMore && !initialLoad ? (
                                <View style={{ padding: 20, alignItems: 'center' }}>
                                    <ActivityIndicator size="small" color="#2196F3" />
                                </View>
                            ) : null
                        }
                    />
                )}
            </LinearGradient>
        </Container>
    );
};

export default Records;