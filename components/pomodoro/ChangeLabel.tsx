import { lablesListAtom, selectedLabelAtom } from '@/store/label';
import { useAtom, useAtomValue } from 'jotai';
import React, { useState } from 'react';
import { NormalText } from '../ui/StyledText';
import { View, StyleSheet, Modal, Text, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function ChangeLabel() {
  const [selectedLabel, setSelectedLabel] = useAtom(selectedLabelAtom);
  const [modalVisible, setModalVisible] = useState(false);
  const labelList = useAtomValue(lablesListAtom);

  return (
    <View
      style={{
        justifyContent: 'center',
      }}
    >
      <View style={{ flexDirection: 'row', gap: 5 }}>
        <FontAwesome name="circle" size={24} color={selectedLabel.color} />
        <NormalText onPress={() => setModalVisible(true)}>
          {selectedLabel.name}
        </NormalText>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Select Label</Text>
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
              {labelList.map((item) => (
                <Pressable
                  style={styles.labelButton}
                  onPress={() => {
                    setSelectedLabel({ name: item.name, color: item.color });
                    setModalVisible(false);
                  }}
                  key={item.name.toLowerCase()}
                >
                  <FontAwesome name="circle" size={24} color={item.color} />
                  <Text style={styles.textStyle}>{item.name}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    gap: 10,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  labelButton: {
    borderRadius: 10,
    padding: 8,
    elevation: 2,
    backgroundColor: 'black',
    flexDirection: 'row',
    gap: 5,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
