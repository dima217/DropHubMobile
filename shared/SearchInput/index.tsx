import SearchIcon from "@/assets/images/Search.svg";
import TextInput from "@/shared/TextInput";
import React from "react";

interface SearchInputProps {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
}

const SearchInput = ({ value, onChange, placeholder = "Search connections" }: SearchInputProps) => {
  return (
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChange}
      autoCapitalize="none"
      autoCorrect={false}
      left={<SearchIcon />}
    />
  );
};

export default SearchInput;
