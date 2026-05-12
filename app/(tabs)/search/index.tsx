import { useSearchQuery } from "@/api/searchApi";
import { SearchResourceType } from "@/api/types/search";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useThemeColors } from "@/hooks/useThemeColors";

import Header from "@/shared/Header";
import SearchInput from "@/shared/SearchInput";
import View from "@/shared/View";
import { SearchFilters } from "@/widgets/search/components/SearchFilters";
import { SearchHistory } from "@/widgets/search/components/SearchHistory";
import { SearchResults } from "@/widgets/search/components/SearchResults";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  View as RNView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const SEARCH_HISTORY_KEY = "@search_history";

const GlobalSearchScreen = () => {
  const themeColors = useThemeColors();
  const styles = useThemedStyles((c) => ({

  container: {
    gap: 16,
  },
  filtersContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 8,
  },
  filtersExpand: {
    flex: 1,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: c.primary,
    justifyContent: "center",
    alignItems: "center",
  },

}));

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResourceType, setSelectedResourceType] =
    useState<SearchResourceType>(SearchResourceType.ALL);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedMimeTypes, setSelectedMimeTypes] = useState<string[]>([]);
  const [selectedCreatorId, setSelectedCreatorId] = useState<number | undefined>();
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const { data: searchResults, isLoading } = useSearchQuery(
    {
      query: searchQuery,
      resourceType: selectedResourceType,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      mimeTypes: selectedMimeTypes.length > 0 ? selectedMimeTypes : undefined,
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
        <RNView style={styles.filtersExpand}>
          <SearchFilters
            selectedResourceType={selectedResourceType}
            onResourceTypeChange={setSelectedResourceType}
            selectedMimeTypes={selectedMimeTypes}
            onMimeTypesChange={setSelectedMimeTypes}
            selectedCreatorId={selectedCreatorId}
            onCreatorIdChange={setSelectedCreatorId}
            selectedTags={selectedTags}
            onTagToggle={toggleTag}
          />
        </RNView>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Feather name="search" size={20} color={themeColors.brightText} />
        </TouchableOpacity>
      </RNView>

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
        resourceType={selectedResourceType}
      />
    </View>
  );
};

export default GlobalSearchScreen;
