import { useGetProfileUploadUrlQuery, useUpdateProfileMutation } from "@/api";
import { setUser } from "@/store/slices/authSlice";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";

import { createUploader, UploadProvider } from "@/services/upload/UploaderFactory";
import Button from "@/shared/Button";
import { ThemedText } from "@/shared/core/ThemedText";
import MediaUploader from "@/shared/MediaUploader/components/MediaUploader";
import TextInput from "@/shared/TextInput";

interface EditProfileData {
  username: string;
  avatarUrl: string;
}

const EditProfileForm = () => {
  const { data: urlData } = useGetProfileUploadUrlQuery();

  const { handleSubmit, control } = useForm<EditProfileData>({
    defaultValues: {
      username: "",
      avatarUrl: "",
    },
  });

  const router = useRouter();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const dispatch = useDispatch();
  const [apiError, setApiError] = useState<string | null>(null);
  const uploader = createUploader(UploadProvider.MINIO);

  const onSubmit = async (userData: EditProfileData) => {
    setApiError(null);

    if (!urlData) {
      setApiError("Failed to get upload URL");
      return;
    }

    await uploader.upload(
        urlData.uploadUrl ?? "",
        userData.avatarUrl
    );

    try {
      const result = await updateProfile({
        firstName: userData.username,
        avatarUrl: urlData.publicUrl,
      }).unwrap();

      console.log(`result: ${result}`);

      dispatch(
        setUser({
          avatarUrl: result.avatarUrl ?? undefined,
          firstName: result.firstName ?? undefined,
        })
      );

      router.replace("/(tabs)/profile");
    } catch (error: any) {
      let errorMessage = "Profile update failed!";

      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.error) {
        errorMessage = error.error;
      }
      setApiError(errorMessage);
    }
  };

  return (
    <View style={styles.container}>
    <Controller
        control={control}
        name="avatarUrl"
        render={({ field: { value, onChange } }) => (
          <MediaUploader
            value={value}
            onChange={onChange}
            type="image"
          />
        )}
      />
    <Controller
        control={control}
        name="username"
        rules={{
          required: "Username is required",
        }}
        render={({ field: { value, onChange }, fieldState }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            errorMessage={fieldState.error?.message}
            placeholder="Username"
          />
        )}
      />

      {apiError && (
        <ThemedText type="error" style={styles.apiErrorText}>
          {apiError}
        </ThemedText>
      )}

      <Button
        title="Save"
        loading={isLoading}
        style={styles.button}
        onPress={handleSubmit(onSubmit)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    gap: 10,
    marginTop: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  resetTextContainer: {
    marginRight: 20,
  },
  button: {
    marginTop: "20%",
  },
  errorText: {
    alignSelf: "flex-start",
    marginLeft: 20,
    fontSize: 12,
  },
  apiErrorText: {
    color: "red",
    marginVertical: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default EditProfileForm;
