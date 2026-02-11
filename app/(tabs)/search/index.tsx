import { useSearchQuery } from "@/api/searchApi";
import { SearchResourceType } from "@/api/types/search";
import { Colors } from "@/constants/design-tokens";
import Header from "@/shared/Header";
import SearchInput from "@/shared/SearchInput";
import View from "@/shared/View";
import { ThemedText } from "@/shared/core/ThemedText";
import { SearchFilters } from "@/widgets/search/components/SearchFilters";
import { SearchHistory } from "@/widgets/search/components/SearchHistory";
import { SearchResults } from "@/widgets/search/components/SearchResults";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useMemo, useState } from "react";
import {
  View as RNView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const SEARCH_HISTORY_KEY = "@search_history";

const GlobalSearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResourceType, setSelectedResourceType] =
    useState<SearchResourceType>(SearchResourceType.ALL);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedMimeType, setSelectedMimeType] = useState<string | undefined>();
  const [selectedCreatorId, setSelectedCreatorId] = useState<number | undefined>();
  const [showFilters, setShowFilters] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const { data: searchResults, isLoading } = useSearchQuery(
    {
      query: searchQuery,
      resourceType: selectedResourceType,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      mimeType: selectedMimeType,
      creatorId: selectedCreatorId,
    },
    { skip: !searchQuery.trim() }
  );

  useEffect(() => {
    AsyncStorage.getItem(SEARCH_HISTORY_KEY).then((history) => {
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    });
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const newHistory = [
        searchQuery.trim(),
        ...searchHistory.filter((h) => h !== searchQuery.trim()),
      ].slice(0, 10);
      setSearchHistory(newHistory);
      AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
    }
  };

  const mimeTypes = useMemo(() => {
    const types = new Set<string>();
    searchResults?.files?.forEach((file) => {
      if (file.mimeType) {
        const baseType = file.mimeType.split("/")[0];
        types.add(baseType);
      }
    });
    return Array.from(types);
  }, [searchResults]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Поиск" />
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Поиск файлов и папок..."
      />

      <RNView style={styles.filtersContainer}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Feather name="filter" size={20} color={Colors.primary} />
          <ThemedText style={styles.filterButtonText}>Фильтры</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Feather name="search" size={20} color={Colors.brightText} />
        </TouchableOpacity>
      </RNView>

      {showFilters && (
        <RNView style={styles.filtersContainer}>
        <SearchFilters
          selectedResourceType={selectedResourceType}
          onResourceTypeChange={setSelectedResourceType}
          selectedMimeType={selectedMimeType}
          onMimeTypeChange={setSelectedMimeType}
          selectedCreatorId={selectedCreatorId}
          onCreatorIdChange={setSelectedCreatorId}
          selectedTags={selectedTags}
          onTagToggle={toggleTag}
          mimeTypes={mimeTypes}
          />
        </RNView>
      )}

      {!searchQuery && (
        <SearchHistory
          history={searchHistory}
          onSelectQuery={setSearchQuery}
        />
      )}

      <SearchResults
        results={searchResults}
        isLoading={isLoading}
        searchQuery={searchQuery}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  filtersContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterButtonText: {
    color: Colors.primary,
    fontSize: 14,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default GlobalSearchScreen;
