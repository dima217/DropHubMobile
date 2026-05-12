import { useCreateChatChannelMutation } from "@/api/chatChannelsApi";
import { useThemeColors } from "@/hooks/useThemeColors";
import React, { useMemo, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { USERS } from "../lib/users";

interface Props {
  currentUserId: string
  onClose: () => void
  onCreated: (channelId: string) => void
}

export function CreateChannelModal({ currentUserId, onClose, onCreated }: Props) {
  const [name, setName] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [type, setType] = useState<'group' | 'direct'>('group')
  const [error, setError] = useState('')
  const [createChatChannel, { isLoading: creating }] = useCreateChatChannelMutation()
  const colors = useThemeColors()
  const s = useMemo(
    () =>
      StyleSheet.create({
        overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)" },
        modal: { flex: 1, justifyContent: "center", padding: 16 },
        content: {
          backgroundColor: colors.background,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.border,
          maxHeight: "90%",
        },
        header: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        title: { fontSize: 18, fontWeight: "600", color: colors.brightText },
        close: { fontSize: 28, color: colors.text },
        tabs: { flexDirection: "row", gap: 8, margin: 20, marginBottom: 16 },
        tab: {
          flex: 1,
          paddingVertical: 8,
          borderRadius: 8,
          backgroundColor: colors.cardBackground,
          alignItems: "center",
        },
        tabActive: { backgroundColor: colors.primary },
        tabText: { fontSize: 14, fontWeight: "500", color: colors.text },
        tabTextActive: { color: colors.brightText },
        field: { marginHorizontal: 20, marginBottom: 16 },
        label: { fontSize: 14, color: colors.text, marginBottom: 8 },
        input: {
          backgroundColor: colors.cardBackground,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 10,
          fontSize: 14,
          color: colors.brightText,
        },
        userList: { maxHeight: 200 },
        user: {
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          borderRadius: 8,
          backgroundColor: colors.cardBackground,
          borderWidth: 1,
          borderColor: colors.border,
          marginBottom: 4,
        },
        userSelected: { backgroundColor: colors.inactive, borderColor: colors.primary },
        userAvatar: {
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: colors.inactive,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
        },
        userAvatarSelected: { backgroundColor: colors.primary },
        userAvatarText: { fontSize: 12, fontWeight: "bold", color: colors.brightText },
        userInfo: { flex: 1, minWidth: 0 },
        userName: { fontSize: 14, fontWeight: "500", color: colors.brightText },
        userEmail: { fontSize: 12, color: colors.secondary },
        check: { color: colors.primary, fontSize: 14 },
        error: {
          marginHorizontal: 20,
          marginBottom: 16,
          padding: 12,
          backgroundColor: "rgba(255,74,117,0.15)",
          borderRadius: 8,
          borderWidth: 1,
          borderColor: colors.reject,
        },
        errorText: { fontSize: 14, color: colors.reject },
        buttons: { flexDirection: "row", gap: 8, margin: 20, marginTop: 0 },
        cancelBtn: {
          flex: 1,
          paddingVertical: 10,
          borderRadius: 8,
          backgroundColor: colors.cardBackground,
          alignItems: "center",
        },
        cancelText: { fontSize: 14, fontWeight: "500", color: colors.text },
        submitBtn: {
          flex: 1,
          paddingVertical: 10,
          borderRadius: 8,
          backgroundColor: colors.primary,
          alignItems: "center",
        },
        submitBtnDisabled: { backgroundColor: colors.grey },
        submitText: { fontSize: 14, fontWeight: "500", color: colors.brightText },
        submitTextDisabled: { color: colors.secondary },
      }),
    [colors]
  )

  const otherUsers = USERS.filter((u) => u.id !== currentUserId);

  const toggleUser = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else {
        if (type === "direct") next.clear();
        next.add(id);
      }
      return next;
    });
  };

  const handleSubmit = async () => {
    setError('')
    const ids = Array.from(selectedIds)
    if (ids.length === 0) {
      setError('Select at least one member')
      return
    }
    try {
      const res = await createChatChannel({
        name: type === 'group' ? name : '',
        type,
        member_ids: ids,
      }).unwrap()
      onCreated(res.channel_id)
      onClose()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed')
    }
  }

  return (
    <Modal visible transparent animationType="fade">
      <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={onClose} />
      <View style={s.modal}>
        <View style={s.content}>
          <View style={s.header}>
            <Text style={s.title}>Create Channel</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={s.close}>×</Text>
            </TouchableOpacity>
          </View>

          <View style={s.tabs}>
            <TouchableOpacity
              style={[s.tab, type === 'group' && s.tabActive]}
              onPress={() => { setType('group'); setSelectedIds(new Set()) }}
            >
              <Text style={[s.tabText, type === 'group' && s.tabTextActive]}>Group</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.tab, type === 'direct' && s.tabActive]}
              onPress={() => { setType('direct'); setSelectedIds(new Set()) }}
            >
              <Text style={[s.tabText, type === 'direct' && s.tabTextActive]}>Direct</Text>
            </TouchableOpacity>
          </View>

          {type === 'group' && (
            <View style={s.field}>
              <Text style={s.label}>Channel Name</Text>
              <TextInput
                style={s.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g. Project Chat"
                placeholderTextColor={colors.secondary}
              />
            </View>
          )}

          <View style={s.field}>
            <Text style={s.label}>{type === 'direct' ? 'Select user' : 'Select members'}</Text>
            <ScrollView style={s.userList}>
              {otherUsers.map(u => (
                <TouchableOpacity
                  key={u.id}
                  style={[s.user, selectedIds.has(u.id) && s.userSelected]}
                  onPress={() => toggleUser(u.id)}
                >
                  <View style={[s.userAvatar, selectedIds.has(u.id) && s.userAvatarSelected]}>
                    <Text style={s.userAvatarText}>{u.name.charAt(0)}</Text>
                  </View>
                  <View style={s.userInfo}>
                    <Text style={s.userName}>{u.name}</Text>
                    <Text style={s.userEmail} numberOfLines={1}>{u.email}</Text>
                  </View>
                  {selectedIds.has(u.id) && <Text style={s.check}>✓</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {error ? (
            <View style={s.error}>
              <Text style={s.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={s.buttons}>
            <TouchableOpacity style={s.cancelBtn} onPress={onClose}>
              <Text style={s.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.submitBtn, (creating || selectedIds.size === 0) && s.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={creating || selectedIds.size === 0}
            >
              <Text style={[s.submitText, (creating || selectedIds.size === 0) && s.submitTextDisabled]}>
                {creating ? 'Creating...' : 'Create'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}
