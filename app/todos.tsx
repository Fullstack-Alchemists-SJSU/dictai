import { useState } from "react";
import Container from "@/components/Container";
import { View, FlatList } from "react-native";
import { ScreenHeader } from "@/components/ScreenHeader";
import getWindowDimens from "@/utils/getWindowDimens";
import { IconButton } from "react-native-paper";
import Spacer from "@/components/Spacer";
import ThemedInput from "@/components/ThemedInput";
import TodoItem from "@/components/TodoItem";

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
}

const mockTodos: TodoItem[] = [
  {
    id: "1",
    text: "Complete the AI voice journaling feature",
    completed: false,
    createdAt: "2024-04-19",
    dueDate: "2024-04-25",
    priority: "high"
  },
  {
    id: "2",
    text: "Review the transcription accuracy",
    completed: false,
    createdAt: "2024-04-19",
    dueDate: "2024-04-22",
    priority: "medium"
  },
  {
    id: "3",
    text: "Add voice recording controls",
    completed: true,
    createdAt: "2024-04-18",
    dueDate: "2024-04-20",
    priority: "low"
  }
];

const Todos = () => {
  const dimension = getWindowDimens();
  const [todos, setTodos] = useState<TodoItem[]>(mockTodos);
  const [newTodo, setNewTodo] = useState("");

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const addTodo = () => {
    if (newTodo.trim()) {
      const newTodoItem: TodoItem = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date().toISOString().split('T')[0],
        priority: 'medium'
      };
      setTodos([...todos, newTodoItem]);
      setNewTodo("");
    }
  };

  return (
    <Container>
      <ScreenHeader title="To-Do List" />
      
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <ThemedInput
            value={newTodo}
            onChangeText={setNewTodo}
            label="Add a new task"
            mode="outlined"
            returnKeyType="done"
            onSubmitEditing={addTodo}
          />
        </View>
        <IconButton
          icon="plus"
          size={24}
          onPress={addTodo}
        />
      </View>

      <Spacer direction="vertical" size={16} />

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TodoItem
            id={item.id}
            text={item.text}
            completed={item.completed}
            dueDate={item.dueDate}
            priority={item.priority}
            dimension={dimension}
            onToggle={toggleTodo}
          />
        )}
      />
    </Container>
  );
};

export default Todos; 