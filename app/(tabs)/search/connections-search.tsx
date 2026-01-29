import { useAddFriendMutation, useSearchProfilesQuery } from "@/api/authApi";
import Header from "@/shared/Header";
import AddFriendConfirmationModal from "@/shared/Modals/AddFriendConfirmationModal";
import SearchInput from "@/shared/SearchInput";
import ActivityIndicator from "@/shared/ui/ActivityIndicator";
import View from "@/shared/View";
import ConnectionsList, { Connection } from "@/widgets/profile/Screens/Connections/components/ConnectionsList";
import { useState } from "react";

const ConnectionsSearch = () => {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<Connection | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  const searchProfiles = useSearchProfilesQuery(search, {
    skip: !search,
  });
  
  const [addFriend, { isLoading }] = useAddFriendMutation();

  const handleUserPress = (user: Connection) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleConfirm = async () => {
    if (selectedUser) {
      try {
        await addFriend({ profileId: selectedUser.id }).unwrap();
        setShowModal(false);
        setSelectedUser(null);
      } catch (error) {
        console.error("Failed to add friend:", error);
      }
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  return (
    <View>
      <Header title="Connections Search" />
      <SearchInput value={search} onChange={setSearch} />
      {isLoading && <ActivityIndicator />}
      <ConnectionsList 
        data={searchProfiles.data || []} 
        onPressItem={handleUserPress} 
      />
      <AddFriendConfirmationModal
        isVisible={showModal}
        userName={selectedUser?.firstName}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </View>
  );
};

export default ConnectionsSearch;