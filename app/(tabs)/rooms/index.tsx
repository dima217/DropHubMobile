import Header from "@/shared/Header";
import WaveButton from "@/shared/ui/animated/WaveButton";
import View from "@/shared/View";

import { Colors } from "@/constants/design-tokens";

const Rooms = () => {
    return (
        <View>
            <Header title="Rooms" />
            <WaveButton onPress={() => {}} color={Colors.primary} icon="plus" size={100} />
        </View>
    );
};

export default Rooms;