import {
  useAddChatChannelMembersMutation,
  useGetChatChannelMembersQuery,
  useRemoveChatChannelMemberMutation,
} from "@/api/chatChannelsApi";
import type { ChatChannelMemberRow } from "@/api/types/chatChannels";
import { useThemeColors } from "@/hooks/useThemeColors";
import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from "react-native";
import { USERS, getUserName } from "../lib/users";

interface Props {
  channelId: string
  currentUserId: string
  onClose: () => void
  onRefresh: () => void
}

export function MembersPanel({ channelId, currentUserId, onClose, onRefresh }: Props) {
  const { data, isLoading: loading, refetch } = useGetChatChannelMembersQuery({
    channelId,
  })
  const [addMembers] = useAddChatChannelMembersMutation()
  const [removeMember] = useRemoveChatChannelMemberMutation()
  const members: ChatChannelMemberRow[] = data?.items ?? []
  const [showAddPicker, setShowAddPicker] = useState(false)
  const [message, setMessage] = useState('')
  const colors = useThemeColors()
  const s = useMemo(
    () =>
      StyleSheet.create({
        container: {
          width: 260,
          borderLeftWidth: 1,
          borderLeftColor: colors.border,
          backgroundColor: colors.listBackground,
        },
        header: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 12,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        title: { fontSize: 14, fontWeight: "600", color: colors.text },
        close: { fontSize: 24, color: colors.text },
        section: { padding: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
        addBtn: {
          paddingVertical: 8,
          backgroundColor: colors.cardBackground,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: colors.border,
          alignItems: "center",
        },
        addBtnText: { fontSize: 12, fontWeight: "500", color: colors.text },
        picker: { marginTop: 8, maxHeight: 120 },
        pickerItem: { flexDirection: "row", alignItems: "center", padding: 6, borderRadius: 4 },
        pickerAvatar: {
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: colors.gradientPrimary,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 8,
        },
        pickerAvatarText: { fontSize: 10, fontWeight: "bold", color: colors.brightText },
        pickerName: { fontSize: 12, fontWeight: "500", color: colors.brightText },
        pickerEmail: { fontSize: 10, color: colors.secondary },
        empty: { fontSize: 11, color: colors.secondary, padding: 4, textAlign: "center" },
        message: { fontSize: 11, color: colors.text, marginTop: 6 },
        list: { flex: 1, padding: 12 },
        loading: { fontSize: 12, color: colors.secondary, textAlign: "center", padding: 16 },
        member: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
        memberAvatar: {
          width: 28,
          height: 28,
          borderRadius: 14,
          backgroundColor: colors.gradientPrimary,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 8,
        },
        memberAvatarMe: { backgroundColor: colors.primary },
        memberAvatarText: { fontSize: 10, fontWeight: "bold", color: colors.brightText },
        memberInfo: { flex: 1, minWidth: 0 },
        memberName: { fontSize: 12, fontWeight: "500", color: colors.brightText },
        memberEmail: { fontSize: 10, color: colors.secondary },
        owner: { fontSize: 9, color: "#FFD700" },
        footer: { padding: 12, borderTopWidth: 1, borderTopColor: colors.border },
        leaveBtn: {
          paddingVertical: 8,
          backgroundColor: "rgba(255,74,117,0.15)",
          borderRadius: 8,
          borderWidth: 1,
          borderColor: colors.reject,
          alignItems: "center",
        },
        leaveText: { fontSize: 12, fontWeight: "500", color: colors.reject },
      }),
    [colors]
  )

  const handleAdd = async (sub: string) => {
    setMessage('')
    try {
      const res = await addMembers({ channelId, memberIds: [sub] }).unwrap()
      if (res.added.length > 0) {
        setMessage(`Added ${getUserName(sub)}`)
      } else {
        setMessage('Already a member')
      }
      await refetch()
      onRefresh()
    } catch (e: unknown) {
      setMessage(e instanceof Error ? e.message : 'Failed')
    }
    setShowAddPicker(false)
  }

  const handleLeave = () => {
    Alert.alert('Leave Channel', 'Leave this channel?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Leave',
        style: 'destructive',
        onPress: async () => {
          try {
            await removeMember({ channelId }).unwrap()
            onRefresh()
            onClose()
          } catch (e: unknown) {
            setMessage(e instanceof Error ? e.message : 'Failed')
          }
        },
      },
    ])
  }

  const memberIds = new Set(members.map(m => m.user_id))
  const nonMembers = USERS.filter((u) => !memberIds.has(u.id));

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>Members ({members.length})</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={s.close}>×</Text>
        </TouchableOpacity>
      </View>

      <View style={s.section}>
        <TouchableOpacity style={s.addBtn} onPress={() => setShowAddPicker(!showAddPicker)}>
          <Text style={s.addBtnText}>+ Add Member</Text>
        </TouchableOpacity>
        {showAddPicker && (
          <ScrollView style={s.picker}>
            {nonMembers.length === 0 ? (
              <Text style={s.empty}>Everyone is already a member</Text>
            ) : (
              nonMembers.map(u => (
                <TouchableOpacity key={u.id} style={s.pickerItem} onPress={() => handleAdd(u.id)}>
                  <View style={s.pickerAvatar}>
                    <Text style={s.pickerAvatarText}>{u.name.charAt(0)}</Text>
                  </View>
                  <View>
                    <Text style={s.pickerName}>{u.name}</Text>
                    <Text style={s.pickerEmail} numberOfLines={1}>{u.email}</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        )}
        {message ? <Text style={s.message}>{message}</Text> : null}
      </View>

      <ScrollView style={s.list}>
        {loading ? (
          <Text style={s.loading}>Loading...</Text>
        ) : (
          members.map(m => {
            const known = USERS.find((u) => u.id === m.user_id);
            const isMe = m.user_id === currentUserId
            return (
              <View key={m.user_id} style={s.member}>
                <View style={[s.memberAvatar, isMe && s.memberAvatarMe]}>
                  <Text style={s.memberAvatarText}>
                    {m.member_type === 'bot' ? '🤖' : (known?.name || m.user_id).charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={s.memberInfo}>
                  <Text style={s.memberName}>{known?.name || m.user_id.slice(0, 8)}{isMe ? ' (you)' : ''}</Text>
                  {known ? <Text style={s.memberEmail} numberOfLines={1}>{known.email}</Text> : null}
                </View>
                {m.role === 'owner' ? <Text style={s.owner}>owner</Text> : null}
              </View>
            )
          })
        )}
      </ScrollView>

      <View style={s.footer}>
        <TouchableOpacity style={s.leaveBtn} onPress={handleLeave}>
          <Text style={s.leaveText}>Leave Channel</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
