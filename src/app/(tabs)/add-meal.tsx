import { addMeal } from '@/storage/meals';
import { colors, globalStyles } from '@/styles/global';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type AlertType = 'success' | 'error';

interface AlertConfig {
  title: string;
  message: string;
  type: AlertType;
  onConfirm?: () => void;
}

const AddMealScreen = () => {
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");

  // Reusable Dynamic Alert State
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    title: "",
    message: "",
    type: "error",
  });

  const showAlert = (
    title: string,
    message: string,
    type: AlertType = "error",
    onConfirm?: () => void
  ) => {
    setAlertConfig({ title, message, type, onConfirm });
    setAlertVisible(true);
  };

  const handleAlertClose = () => {
    setAlertVisible(false);
    if (alertConfig.onConfirm) {
      alertConfig.onConfirm();
    }
  };

  const handleAddMeal = async () => {
    if (name.trim() === "" || calories === "" || protein === "" || carbs === "" || fat === "") {
      showAlert(
        "Missing Information",
        "One or more of the items is missing. Please complete all fields.",
        "error"
      );
    } else {
      await addMeal({
        name,
        calories: Number(calories),
        protein: Number(protein) || 0,
        carbs: Number(carbs) || 0,
        fat: Number(fat) || 0,
      });

      // Clear form inputs
      setName('');
      setCalories('');
      setProtein('');
      setCarbs('');
      setFat('');

      // Show success alert and defer router navigation until the user taps 'OK'
      showAlert(
        "Meal Added",
        "Meal added successfully!",
        "success",
        () => {
          Haptics.notificationAsync( Haptics.NotificationFeedbackType.Success );
          router.push( '/' );
        }
      );
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Add Meal</Text>
      
      <TextInput
        style={[style.input, { marginTop: 20 }]}
        placeholder='Meal name'
        placeholderTextColor={colors.textSecondary}
        value={name}
        onChangeText={setName}
      />
      
      <TextInput
        style={style.input}
        placeholder='Calories'
        placeholderTextColor={colors.textSecondary}
        keyboardType='numeric'
        value={calories}
        onChangeText={setCalories}
      />
      
      <View style={style.row}>
        <TextInput
          style={[style.input, style.rowInput]}
          placeholder='Protein (g)'
          placeholderTextColor={colors.textSecondary}
          keyboardType='numeric'
          value={protein}
          onChangeText={setProtein}
        />
        
        <TextInput
          style={[style.input, style.rowInput]}
          placeholder='Carbs (g)'
          placeholderTextColor={colors.textSecondary}
          keyboardType='numeric'
          value={carbs}
          onChangeText={setCarbs}
        />
        
        <TextInput
          style={[style.input, style.rowInput]}
          placeholder='Fat (g)'
          placeholderTextColor={colors.textSecondary}
          keyboardType='numeric'
          value={fat}
          onChangeText={setFat}
        />
      </View>

      <TouchableOpacity
        style={style.button}
        onPress={handleAddMeal}
      >
        <Text style={style.buttonText}>
          Add Meal
        </Text>
      </TouchableOpacity>

      {/* Dynamic Alert Modal */}
      <Modal
        visible={alertVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleAlertClose}
      >
        <View style={style.modalOverlay}>
          <View style={style.alertBox}>
            <Text style={style.alertTitle}>{alertConfig.title}</Text>
            <Text style={style.alertMessage}>{alertConfig.message}</Text>
            
            <TouchableOpacity
              style={[
                style.alertButton,
                alertConfig.type === 'error' ? style.errorButton : style.successButton
              ]}
              onPress={handleAlertClose}
            >
              <Text style={style.alertButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
};

export default AddMealScreen;

const style = StyleSheet.create({
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginTop: 16,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  rowInput: {
    flex: 1,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20, 
  },
  
  /* Custom Alert Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  alertBox: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  alertMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  alertButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  errorButton: {
    backgroundColor: '#ff4d4d',
  },
  successButton: {
    backgroundColor: '#2ecc71',
  },
  alertButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});