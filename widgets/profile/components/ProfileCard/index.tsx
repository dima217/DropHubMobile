import Button from "@/shared/Button";
import { ThemedText } from "@/shared/core/ThemedText";
import GradientView from "@/shared/Gradient";
import PatternBackground from "@/shared/ui/PatternBackground";
import RadialGradientBackground from "@/shared/ui/RadialGradientBackground";
import { RootState } from "@/store/store";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import Avatar from "./ui/Avatar";

const ProfileCard = () => {
  const profile = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();

  const getInitials = () => {
    if (!profile) return "?";
    const firstName = profile.firstName || "";
    if (firstName) return firstName[0].toUpperCase();
    if (profile.email) return profile.email[0].toUpperCase();
    return "?";
  };

  const getFullName = () => {
    if (!profile) return "";
    return profile.firstName || profile.email || "";
  };

  const connectionsCount = 5;

  const handleConnectionsPress = () => {
    Alert.alert("Connections clicked", "Здесь будет список друзей");
  };

  if (!profile) {
    return (
      <GradientView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </GradientView>
    );
  }

  return (
    <GradientView style={styles.container}>
      <PatternBackground style={styles.patternContainer} />
      <RadialGradientBackground style={styles.radialContainer} />

      <View style={styles.profileRow}>
        <Avatar size="medium" title={getInitials()} uri={`${profile.avatarUrl}?t=${Date.now()}`}key={profile.avatarUrl}  />
        <Button
          style={styles.button}
          textStyle={styles.buttonText}
          title="Edit"
          onPress={() => router.push("/(tabs)/profile/edit")}
        />
      </View>

      <View style={styles.profileInfoColumn}>
        <ThemedText type="title">{getFullName()}</ThemedText>
        <ThemedText type="subtitle">{profile.email}</ThemedText>

        <TouchableOpacity onPress={handleConnectionsPress}>
          <ThemedText type="link" style={styles.connectionsText}>
            {connectionsCount} connections
          </ThemedText>
        </TouchableOpacity>
      </View>
    </GradientView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 200,
    padding: 20,
    marginTop: 20,
    paddingBottom: 10,
    borderRadius: 20,
  },
  radialContainer: {
    borderRadius: 20,
    ...StyleSheet.absoluteFillObject,
  },
  patternContainer: {
    borderRadius: 20,
    height: 100,
    ...StyleSheet.absoluteFillObject,
  },
  profileRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  profileInfoColumn: {
    marginTop: 10,
    gap: 6,
  },
  button: {
    width: 64,
    height: 30,
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  buttonText: {
    fontSize: 12,
  },
  connectionsText: {
    color: "#1E90FF", 
    fontWeight: "bold",
    marginTop: 2,
  },
});

export default ProfileCard;
