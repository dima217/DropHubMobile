import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "drophub:storageItemNotes:v1";

type NotesMap = Record<string, string>;

async function readMap(): Promise<NotesMap> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as NotesMap;
    }
  } catch {
    // ignore corrupt storage
  }
  return {};
}

async function writeMap(map: NotesMap): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export async function getStorageItemNote(itemId: string): Promise<string> {
  const map = await readMap();
  return map[itemId] ?? "";
}

export async function setStorageItemNote(
  itemId: string,
  text: string
): Promise<void> {
  const map = await readMap();
  const trimmed = text.trim();
  if (trimmed === "") {
    delete map[itemId];
  } else {
    map[itemId] = text;
  }
  await writeMap(map);
}
