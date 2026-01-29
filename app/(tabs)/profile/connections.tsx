// screens/Connections.tsx
import { ThemedText } from "@/shared/core/ThemedText";
import GradientButton from "@/shared/GradientButton";
import Header from "@/shared/Header";
import SearchInput from "@/shared/SearchInput";
import View from "@/shared/View";
import ConnectionsList, { Connection } from "@/widgets/profile/Screens/Connections/components/ConnectionsList";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { View as RNView, StyleSheet } from "react-native";

const MOCK_CONNECTIONS: Connection[] = [
  { id: 1, firstName: "Alex" },
  { id: 2, firstName: "John" },
  { id: 3, firstName: "Maria" },
  { id: 4, firstName: "Kate" },
  { id: 5, firstName: "Max" },
];

const Connections = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const filteredConnections = useMemo(() => {
    return MOCK_CONNECTIONS.filter((item) =>
      item.firstName.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  return (
    <View>
      <Header title="Connections" />

      <RNView style={styles.topRow}>
        <ThemedText type="link" style={styles.connectionsText}>
          Connections ({MOCK_CONNECTIONS.length})
        </ThemedText>
        <GradientButton style={styles.addButton} title="New Connection" onPress={() => router.push("/search/connections-search")} />
      </RNView>

      <SearchInput value={search} onChange={setSearch} />

      <ConnectionsList
        data={filteredConnections}
        onPressItem={(item) => {
          console.log("Pressed connection:", item);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  topRow: {
    marginTop: "12%",
    gap: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  addButton: {
    width: "40%",
  },
  connectionsText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Connections;
