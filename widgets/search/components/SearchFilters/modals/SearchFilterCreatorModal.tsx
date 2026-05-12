import { useGetFriendsQuery } from "@/api/friendApi";
import { Friend } from "@/api/types/friend";
import { useThemeColors } from "@/hooks/useThemeColors";
import { ThemedText } from "@/shared/core/ThemedText";
import ActivityIndicator from "@/shared/ui/ActivityIndicator";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface SearchFilterCreatorModalProps {
  visible: boolean;
  selectedCreatorId: number | undefined;
  onSelect: (id: number | undefined) => void;
  onClose: () => void;
}

const filterFriends = (friends: Friend[], query: string): Friend[] => {
  const q = query.trim().toLowerCase();
  if (!q) return friends;
  return friends.filter((f) =>
    f.friendProfile.firstName.toLowerCase().includes(q)
  );
};

export const SearchFilterCreatorModal: React.FC<SearchFilterCreatorModalProps> = ({
  visible,
  selectedCreatorId,
  onSelect,
  onClose,
}) => {
  const { data: friends = [], isLoading } = useGetFriendsQuery(undefined, {
    skip: !visible,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const colors = useThemeColors();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        overlay: {
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "flex-end",
        },
        sheet: {
          backgroundColor: colors.background,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingHorizontal: 20,
          paddingBottom: 32,
          maxHeight: "70%",
        },
        header: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        title: {
          fontSize: 18,
          fontWeight: "600",
          color: colors.brightText,
        },
        closeBtn: {
          padding: 4,
        },
        searchWrap: {
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.cardBackground,
          borderRadius: 12,
          marginTop: 12,
          paddingHorizontal: 12,
          borderWidth: 1,
          borderColor: colors.border,
        },
        searchIcon: {
          marginRight: 8,
        },
        searchInput: {
          flex: 1,
          paddingVertical: 12,
          fontSize: 16,
          color: colors.brightText,
        },
        clearSearch: {
          padding: 4,
        },
        clearButton: {
          marginTop: 10,
          paddingVertical: 8,
        },
        clearButtonText: {
          fontSize: 14,
          color: colors.primary,
        },
        center: {
          paddingVertical: 40,
          alignItems: "center",
        },
        list: {
          maxHeight: 280,
        },
        listContent: {
          paddingTop: 8,
          paddingBottom: 16,
        },
        row: {
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
          gap: 12,
        },
        rowSelected: {
          borderRadius: 12,
          marginHorizontal: -4,
          paddingHorizontal: 4,
        },
        avatar: {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: colors.inactive,
        },
        name: {
          flex: 1,
          fontSize: 16,
          color: colors.text,
        },
        nameActive: {
          color: colors.brightText,
          fontWeight: "500",
        },
        empty: {
          paddingVertical: 32,
          alignItems: "center",
        },
        emptyText: {
          fontSize: 14,
          color: colors.secondary,
        },
      }),
    [colors]
  );

  const filtered = useMemo(
    () => filterFriends(friends, searchQuery),
    [friends, searchQuery]
  );

  const handleSelect = (id: number) => {
    onSelect(selectedCreatorId === id ? undefined : id);
    onClose();
  };

  const handleClear = () => {
    onSelect(undefined);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.sheet} onStartShouldSetResponder={() => true}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>Автор</ThemedText>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Feather name="x" size={24} color={colors.brightText} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchWrap}>
            <Feather
              name="search"
              size={18}
              color={colors.secondary}
              style={styles.searchIcon}
            />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Поиск по имени..."
              placeholderTextColor={colors.secondary}
              style={styles.searchInput}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery("")}
                style={styles.clearSearch}
              >
                <Feather name="x-circle" size={18} color={colors.secondary} />
              </TouchableOpacity>
            )}
          </View>

          {selectedCreatorId != null && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClear}
            >
              <ThemedText style={styles.clearButtonText}>Сбросить выбор</ThemedText>
            </TouchableOpacity>
          )}

          {isLoading ? (
            <View style={styles.center}>
              <ActivityIndicator />
            </View>
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={(item) => item.friendshipId.toString()}
              renderItem={({ item }) => {
                const id = item.friendProfile.id;
                const isSelected = selectedCreatorId === id;
                return (
                  <TouchableOpacity
                    style={[styles.row, isSelected && styles.rowSelected]}
                    onPress={() => handleSelect(id)}
                    activeOpacity={0.7}
                  >
                    <Image
                      source={{ uri: item.friendProfile.avatarUrl }}
                      style={styles.avatar}
                      contentFit="cover"
                    />
                    <ThemedText
                      style={[styles.name, isSelected && styles.nameActive]}
                      numberOfLines={1}
                    >
                      {item.friendProfile.firstName}
                    </ThemedText>
                    {isSelected && (
                      <Feather
                        name="check-circle"
                        size={22}
                        color={colors.primary}
                      />
                    )}
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <View style={styles.empty}>
                  <ThemedText style={styles.emptyText}>
                    {searchQuery.trim()
                      ? "Никого не найдено"
                      : "У вас пока нет друзей"}
                  </ThemedText>
                </View>
              }
              contentContainerStyle={styles.listContent}
              style={styles.list}
            />
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
