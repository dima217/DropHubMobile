import SearchIcon from "@/assets/images/Search.svg";
import TextInput from "@/shared/TextInput";
import React from "react";

interface SearchInputProps {
  value: string;
  onChange: (text: string) => void;
}

const SearchInput = ({ value, onChange }: SearchInputProps) => {
  return (
    <TextInput
      placeholder="Search connections"
      value={value}
      onChangeText={onChange}
      autoCapitalize="none"
      autoCorrect={false}
      left={<SearchIcon />}
    />
  );
};

export default SearchInput;
