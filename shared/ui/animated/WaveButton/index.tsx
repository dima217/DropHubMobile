import { Feather } from "@expo/vector-icons";
import { useThemeColors } from "@/hooks/useThemeColors";
import { MotiView } from "moti";
import * as React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Easing } from "react-native-reanimated";

interface WaveButtonProps {
    onPress: () => void;
    color: string;
    icon: keyof typeof Feather.glyphMap;
    size: number;
}

export default function WaveButton({
  onPress,
  color,
  icon,
  size,
}: WaveButtonProps) {
  const colors = useThemeColors();
    return (
        <View style={[styles.container, { width: size * 4, height: size * 3 }]}>
            <TouchableOpacity style={[{ width: size,
                 height: size, borderRadius: size, backgroundColor: color, }, styles.center]} onPress={onPress}>
                {[...Array(3).keys()].map(index => {
                    return (
                        <MotiView 
                            from={{ opacity: 0.7, scale: 1 }} 
                            animate={{ opacity: 0, scale: 4 }} 
                            transition={{ type: "timing", duration: 2000, easing: Easing.out(Easing.ease), delay: index * 400, loop: true, repeatReverse: false }} 
                            key={index} 
                            style={[StyleSheet.absoluteFillObject, 
                            {width: size, height: size, borderRadius: size, backgroundColor: color}]}/>
                        )
                    })}
                <Feather name={icon as keyof typeof Feather.glyphMap} size={size / 2} color={colors.brightText} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
    },
    center: {
        alignItems: "center",
        justifyContent: "center",
    },
});