import Header from "@/shared/Header";
import SearchButton from "@/shared/SearchButton";
import View from "@/shared/View";
import { SharedSection } from "@/widgets/shared/components/SharedSection";
import React from "react";

const SharedScreen = () => {
  return (
    <View>
      <Header title="Shared" rightAction={<SearchButton />} />
      <SharedSection />
    </View>
  );
};

export default SharedScreen;
