export interface ImageSource {
  uri?: string;
}

export const isDefaultImage = (value: string | undefined | null): boolean => {
  if (!value) return false;

  if (!/^\d+$/.test(value)) return false;

  const index = parseInt(value, 10);
  return index >= 0 && index <= 5;
};

export const getImageSource = (
  value: string | undefined | null,
  defaultImages?: string[]
): ImageSource => {
  if (!value && !defaultImages) return {};

  if (isDefaultImage(value)) {
    const index = parseInt(value!, 10);
    return defaultImages && defaultImages[index]
      ? { uri: defaultImages[index] }
      : {};
  }
  return { uri: value! };
};
