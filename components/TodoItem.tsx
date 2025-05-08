import { View } from "react-native"
import { Checkbox } from "react-native-paper"
import { SmallThemedHeader, SmallThemedSubtitle } from "./ThemedText"
import { ScreenSize } from "@/utils/getWindowDimens"
import theme from "@/constants/Theme"

interface TodoItemProps {
  id: string
  text: string
  completed: boolean
  dueDate?: string
  priority: 'low' | 'medium' | 'high'
  dimension: ScreenSize
  onToggle: (id: string) => void
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return theme.colors.error
    case 'medium':
      return theme.colors.tertiary
    case 'low':
      return theme.colors.primary
    default:
      return theme.colors.primary
  }
}

const TodoItem = ({
  id,
  text,
  completed,
  dueDate,
  priority,
  dimension,
  onToggle
}: TodoItemProps) => {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#f9f9f9",
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: "center"
      }}
    >
      <Checkbox
        status={completed ? "checked" : "unchecked"}
        onPress={() => onToggle(id)}
      />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <SmallThemedHeader
          dimension={dimension}
          text={text}
          color={completed ? "#888" : undefined}
        />
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <SmallThemedSubtitle
            dimension={dimension}
            text={dueDate || "No due date"}
            color="#888"
          />
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: getPriorityColor(priority),
              marginLeft: 8
            }}
          />
        </View>
      </View>
    </View>
  )
}

export default TodoItem 