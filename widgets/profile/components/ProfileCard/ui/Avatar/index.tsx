import { Avatar as RNAvatar } from "react-native-elements";
import { styles } from "./styles";

interface AvatarProps {
  size?: "small" | "medium" | "large" | number;
  uri?: string;
  title?: string;
}

const Avatar = ({ size, uri, title }: AvatarProps) => {
  if (uri) {
    return <RNAvatar rounded source={{ uri: uri }} size={size} />;
  }
  if (title) {
    return (
      <RNAvatar
        rounded
        title={title}
        size={size}
        overlayContainerStyle={styles.avatarBackground}
        titleStyle={styles.avatarText}
      />
    );
  }
};

export default Avatar;
