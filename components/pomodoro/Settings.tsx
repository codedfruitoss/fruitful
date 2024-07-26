import { AntDesign } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { View, Pressable } from 'react-native';
export default function Settings() {
  return (
    <View
      style={{
        justifyContent: 'center',
      }}
    >
      <Link href="/settings" asChild>
        <Pressable>
          <AntDesign name="setting" size={24} color="white" />
        </Pressable>
      </Link>
    </View>
  );
}
