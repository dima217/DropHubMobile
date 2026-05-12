import {
  getStorageItemNote,
  setStorageItemNote,
} from "@/services/storageItemNotes";
import { useCallback, useEffect, useRef, useState } from "react";

const DEBOUNCE_MS = 400;

export function useDebouncedStorageItemNote(itemId: string | null | undefined) {
  const [note, setNote] = useState("");
  const [loaded, setLoaded] = useState(false);
  const skipNextSave = useRef(true);
  const noteRef = useRef(note);
  noteRef.current = note;

  useEffect(() => {
    let cancelled = false;
    skipNextSave.current = true;
    setLoaded(false);
    if (!itemId) {
      setNote("");
      setLoaded(true);
      return;
    }
    void (async () => {
      const v = await getStorageItemNote(itemId);
      if (!cancelled) {
        setNote(v);
        setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [itemId]);

  useEffect(() => {
    if (!itemId || !loaded) return;
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    const t = setTimeout(() => {
      void setStorageItemNote(itemId, noteRef.current);
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [note, itemId, loaded]);

  const flush = useCallback(async () => {
    if (!itemId) return;
    await setStorageItemNote(itemId, noteRef.current);
  }, [itemId]);

  return { note, setNote, loaded, flush };
}
