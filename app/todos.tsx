import { useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { SmallThemedSubtitle } from '@/components/ThemedText';
import { ScreenHeader } from '@/components/ScreenHeader';
import Container from '@/components/Container';
import Icon from 'react-native-vector-icons/Ionicons';
import getWindowDimens from '@/utils/getWindowDimens';
import { LinearGradient } from 'expo-linear-gradient';
import { toggleTodo } from '@/redux/todos/todosSlice';

const TodosScreen = () => {
    const dimension = getWindowDimens();
    const dispatch = useAppDispatch();
    const { items: todos, loading, error } = useAppSelector(state => state.todos);

    const handleToggleTodo = (id: string) => {
        dispatch(toggleTodo(id));
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return '#d32f2f';
            case 'medium':
                return '#f57c00';
            case 'low':
                return '#388e3c';
            default:
                return '#666';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <Container>
            <LinearGradient
                colors={['#f8f9fa', '#ffffff']}
                style={{ flex: 1 }}
            >
                <ScreenHeader title="All Todos" />

                <FlatList
                    data={todos}
                    keyExtractor={(item) => 'id' in item ? item.id : ''}
                    contentContainerStyle={styles.listContainer}
                    renderItem={({ item }) => {
                        if ('message' in item) return null;
                        
                        return (
                            <TouchableOpacity 
                                style={styles.todoItem}
                                onPress={() => handleToggleTodo(item.id)}
                            >
                                <View style={styles.todoHeader}>
                                    <View style={styles.titleContainer}>
                                        <Icon 
                                            name={item.completed ? "checkmark-circle" : "ellipse-outline"} 
                                            size={24} 
                                            color={item.completed ? "#4CAF50" : "#666"} 
                                        />
                                        <SmallThemedSubtitle
                                            dimension={dimension}
                                            text={item.text}
                                            style={[
                                                styles.todoText,
                                                item.completed && styles.completedText
                                            ]}
                                        />
                                    </View>
                                    <View style={[
                                        styles.priorityBadge,
                                        { backgroundColor: `${getPriorityColor(item.priority)}20` }
                                    ]}>
                                        <SmallThemedSubtitle
                                            dimension={dimension}
                                            text={item.priority}
                                            color={getPriorityColor(item.priority)}
                                            style={{ textTransform: 'capitalize' }}
                                        />
                                    </View>
                                </View>

                                <View style={styles.todoFooter}>
                                    <View style={styles.dateContainer}>
                                        <Icon name="calendar-outline" size={16} color="#666" />
                                        <SmallThemedSubtitle
                                            dimension={dimension}
                                            text={`Created: ${formatDate(item.createdAt)}`}
                                            color="#666"
                                            style={styles.dateText}
                                        />
                                    </View>
                                    {item.dueDate && (
                                        <View style={styles.dateContainer}>
                                            <Icon name="time-outline" size={16} color="#666" />
                                            <SmallThemedSubtitle
                                                dimension={dimension}
                                                text={`Due: ${formatDate(item.dueDate)}`}
                                                color="#666"
                                                style={styles.dateText}
                                            />
                                        </View>
                                    )}
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                    ListEmptyComponent={
                        !loading ? (
                            <View style={styles.emptyContainer}>
                                <Icon name="list-outline" size={48} color="#888" />
                                <SmallThemedSubtitle
                                    dimension={dimension}
                                    text="No todos found"
                                    color="#888"
                                    style={styles.emptyText}
                                />
                            </View>
                        ) : null
                    }
                />
            </LinearGradient>
        </Container>
    );
};

const styles = StyleSheet.create({
    listContainer: {
        padding: 16,
    },
    todoItem: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    todoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    titleContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    todoText: {
        flex: 1,
        fontSize: 16,
        textAlign: 'left',
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: '#888',
    },
    priorityBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    todoFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 12,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    dateText: {
        fontSize: 12,
    },
    errorContainer: {
        margin: 16,
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
    emptyText: {
        marginTop: 12,
    },
});

export default TodosScreen; 