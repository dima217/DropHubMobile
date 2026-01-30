import { useSearchProfilesQuery } from "@/api/authApi";
import { useAddFriendMutation } from "@/api/friendApi";
import Header from "@/shared/Header";
import AddFriendConfirmationModal from "@/shared/Modals/AddFriendConfirmationModal";
import SearchInput from "@/shared/SearchInput";
import ActivityIndicator from "@/shared/ui/ActivityIndicator";
import View from "@/shared/View";
import { RootState } from "@/store/store";
import ConnectionsList, { Connection } from "@/widgets/profile/Screens/Connections/components/ConnectionsList";
import { useState } from "react";
import { useSelector } from "react-redux";

const ConnectionsSearch = () => {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<Connection | null>(null);
  const [showModal, setShowModal] = useState(false);

  const currentUser = useSelector((state: RootState) => state.auth.user);

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

  const filteredData = (searchProfiles.data || []).filter(
    (user) => user.firstName !== currentUser?.firstName
  );

  return (
    <View>
      <Header title="Connections Search" />
      <SearchInput value={search} onChange={setSearch} />
      {isLoading && <ActivityIndicator />}
      <ConnectionsList 
        data={filteredData} 
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
