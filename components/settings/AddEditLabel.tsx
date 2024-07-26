import { lablesListAtom, selectedLabelAtom } from '@/store/label';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { Text, StyleSheet, View, TextInput, Pressable } from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';

interface ownProps {
  openModal: { open: boolean; labelName: string; color: string };
  setOpenModal: (value: {
    open: boolean;
    labelName: string;
    color: string;
  }) => void;
}
export default function AddEditLabel({ openModal, setOpenModal }: ownProps) {
  const [textInputvalue, onChangeText] = useState(openModal.labelName);
  const [color, setColor] = useState(openModal.color);
  const [labelsList, setLabelsList] = useAtom(lablesListAtom);
  const [selectedLabel, setSelectedLabel] = useAtom(selectedLabelAtom);

  const onSave = () => {
    //edit label
    if (openModal.labelName) {
      if (!textInputvalue) {
        alert("Label can't be blank");
      } else {
        const updatedLablesList = labelsList.map((item) => {
          if (item.name === openModal.labelName) {
            return { ...item, name: textInputvalue.trim(), color };
          }
          return item;
        });

        if (openModal.labelName === selectedLabel.name) {
          setOpenModal({ labelName: textInputvalue, open: false, color });
          setLabelsList(updatedLablesList);
          setSelectedLabel({ name: textInputvalue, color });
        } else {
          setOpenModal({ ...openModal, open: false, color: color });
          setLabelsList(updatedLablesList);
        }
      }
    }
    //Add label
    else {
      const labelExists = labelsList.some(
        (item) => item.name.toLowerCase() === textInputvalue.toLowerCase()
      );
      if (labelExists) {
        alert('Label already exist');
      } else if (!textInputvalue) {
        alert("Label can't be blank");
      } else {
        setOpenModal({ ...openModal, open: false });
        setLabelsList([...labelsList, { name: textInputvalue.trim(), color }]);
      }
    }
  };

  return (
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <Text style={styles.modalText}>Add or Edit Label</Text>
        <TextInput
          editable
          numberOfLines={1}
          maxLength={50}
          onChangeText={(text) => {
            onChangeText(text);
          }}
          autoFocus
          value={textInputvalue}
          style={{
            backgroundColor: '#f2eff1',
            paddingVertical: 10,
            paddingHorizontal: 20,
          }}
        />

        <View
          style={{
            height: 350,
            padding: 10,
            margin: 0,
          }}
        >
          <ColorPicker
            color={color}
            onColorChange={(color) => setColor(color)}
            thumbSize={40}
            swatches
            gapSize={30}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            alignSelf: 'flex-end',
            gap: 6,
          }}
        >
          <Pressable
            style={styles.button}
            onPress={() =>
              setOpenModal({ open: false, labelName: '', color: '' })
            }
          >
            <Text>Cancel</Text>
          </Pressable>
          <Pressable
            style={{ ...styles.button, ...styles.buttonSave }}
            onPress={onSave}
          >
            <Text>Save</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  modalView: {
    gap: 5,
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
  button: {
    borderRadius: 15,
    padding: 10,
  },
  buttonSave: {
    backgroundColor: '#2196F3',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
