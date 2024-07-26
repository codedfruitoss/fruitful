import { NormalText } from '@/components/ui/StyledText';
import { Pressable, View, StyleSheet, Modal } from 'react-native';
import { useState } from 'react';
import AddEditLabel from '@/components/settings/AddEditLabel';
import { Ionicons } from '@expo/vector-icons';
import { lablesListAtom } from '@/store/label';
import { Feather } from '@expo/vector-icons';
import { useAtomValue } from 'jotai';
import { FontAwesome } from '@expo/vector-icons';

export default function Analysis() {
  const [openLabelsModal, setOpenLabelModal] = useState({
    open: false,
    labelName: '',
    color: '',
  });
  const labelsList = useAtomValue(lablesListAtom);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'black',
        marginTop: 30,
        padding: 20,
        gap: 20,
      }}
    >
      <NormalText>Labels</NormalText>
      <View style={styles.menuItem}>
        <Pressable
          onPress={() => {
            setOpenLabelModal({ open: true, labelName: '', color: '' });
          }}
        >
          <View style={{ flexDirection: 'row', gap: 5 }}>
            <Ionicons name="add-circle-outline" size={25} color="white" />
            <NormalText>Add Label</NormalText>
          </View>
        </Pressable>
      </View>
      <View style={{ flexDirection: 'row', gap: 20, flexWrap: 'wrap' }}>
        {labelsList?.map((item) => (
          <Pressable
            key={`edit-${item.name.toLowerCase()}-label`}
            onPress={() => {
              setOpenLabelModal({
                open: true,
                labelName: item.name,
                color: item.color,
              });
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                gap: 5,
              }}
            >
              <FontAwesome name="circle" size={24} color={item.color} />
              <NormalText>{item.name}</NormalText>
              <Feather name="edit-2" size={24} color="white" />
            </View>
          </Pressable>
        ))}
      </View>

      <Modal
        animationType="slide"
        transparent={false}
        visible={openLabelsModal.open}
        onRequestClose={() => {
          setOpenLabelModal({
            open: !openLabelsModal.open,
            labelName: '',
            color: '',
          });
        }}
      >
        <AddEditLabel
          openModal={openLabelsModal}
          setOpenModal={setOpenLabelModal}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    gap: 10,
  },
  sectionContainer: {
    marginTop: 70,
    paddingHorizontal: 24,
  },
});
