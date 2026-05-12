import { useThemedStyles } from "@/hooks/useThemedStyles";

import { ThemedText } from "@/shared/core/ThemedText";
import Header from "@/shared/Header";
import { useI18n } from "@/shared/localization";
import View from "@/shared/View";
import { AppLanguage, setLanguage, SUPPORTED_LANGUAGES } from "@/store/slices/localizationSlice";
import { RootState } from "@/store/store";
import { Pressable, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const Settings = () => {
  const styles = useThemedStyles((c) => ({

  content: {
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  label: {
    marginBottom: 20,
    color: c.text,
  },
  languageOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: c.inactive,
  },
  languageOptionActive: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderColor: c.primary,
  },
  languageText: {
    fontSize: 16,
    color: c.text,
  },
  languageTextActive: {
    color: c.primary,
    fontWeight: "600",
  },
  checkmark: {
    fontSize: 20,
    color: c.primary,
    fontWeight: "bold",
  },

}));

  const dispatch = useDispatch();
  const { t } = useI18n();
  const selectedLanguage = useSelector(
    (state: RootState) => state.localization.language
  );
  const languageLabelKey: Record<AppLanguage, "settings.language.ru" | "settings.language.be" | "settings.language.en"> = {
    ru: "settings.language.ru",
    be: "settings.language.be",
    en: "settings.language.en",
  };

  return (
    <View>
      <Header title={t("settings.title")} />
      <View style={styles.content}>
        <ThemedText type="small" style={styles.label}>
          {t("settings.selectLanguage")}
        </ThemedText>
        {SUPPORTED_LANGUAGES.map((languageCode) => {
          const isActive = selectedLanguage === languageCode;
          return (
            <Pressable
              key={languageCode}
              style={[
                styles.languageOption,
                isActive ? styles.languageOptionActive : null,
              ]}
              onPress={() => dispatch(setLanguage(languageCode))}
            >
              <ThemedText
                style={[
                  styles.languageText,
                  isActive ? styles.languageTextActive : null,
                ]}
              >
                {t(languageLabelKey[languageCode])}
              </ThemedText>
              {isActive ? <ThemedText style={styles.checkmark}>✓</ThemedText> : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default Settings;
