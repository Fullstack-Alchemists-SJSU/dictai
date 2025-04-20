import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import { Ionicons } from "@expo/vector-icons";
import { Action, logoutUser } from "@/redux/user/userSlice";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.user);

  const router = useRouter();

  useEffect(() => {
    if (user.status.action === Action.LOGOUT && user.status.code === 200) {
      router.replace("/login")
    }
  }, [user.status])

  const handleLogout = () => {
    dispatch(logoutUser(user.AuthenticationResult.AccessToken));
  };

  const InfoCard = ({ 
    icon, 
    title, 
    value 
  }: { 
    icon: keyof typeof Ionicons.glyphMap; 
    title: string; 
    value: string 
  }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name={icon} size={24} color="#4a90e2" />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <Text style={styles.cardValue}>{value || "Not provided"}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user.Attributes.given_name?.[0]}{user.Attributes.family_name?.[0]}
          </Text>
        </View>
        <Text style={styles.name}>
          {user.Attributes.given_name} {user.Attributes.family_name}
        </Text>
        <Text style={styles.email}>{user.Attributes.email}</Text>
      </View>

      <View style={styles.cardsContainer}>
        <InfoCard
          icon="call-outline"
          title="Phone Number"
          value={user.Attributes.phone_number}
        />
        <InfoCard
          icon="male-female-outline"
          title="Gender"
          value={user.Attributes.gender}
        />
        <InfoCard
          icon="calendar-outline"
          title="Date of Birth"
          value={user.Attributes.birthdate}
        />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="white" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#4a90e2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 40,
    color: "white",
    fontWeight: "bold",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#666",
  },
  cardsContainer: {
    padding: 15,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 10,
  },
  cardValue: {
    fontSize: 18,
    color: "#666",
    marginLeft: 34, // Align with the icon
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff4444",
    padding: 15,
    margin: 20,
    borderRadius: 10,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
}); 