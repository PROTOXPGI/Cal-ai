import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNutrition } from '../context/NutritionContext';
import { SUPABASE_SQL_SCHEMA } from '../services/apiClient';
import { Shield, Settings, CheckCircle2, CloudLightning, RefreshCw, Terminal, Info } from 'lucide-react-native';

export default function ProfileScreen() {
  const {
    goalCalories,
    goalProtein,
    goalCarbs,
    goalFats,
    username,
    updateDailyGoals,
    updateUsername
  } = useNutrition();

  const [nameVal, setNameVal] = useState(username);
  const [kcalVal, setKcalVal] = useState(String(goalCalories));
  const [pVal, setPVal] = useState(String(goalProtein));
  const [cVal, setCVal] = useState(String(goalCarbs));
  const [fVal, setFVal] = useState(String(goalFats));
  const [showSql, setShowSql] = useState(false);

  const handleSaveAll = () => {
    const cal = parseInt(kcalVal) || 2000;
    const p = parseInt(pVal) || 130;
    const c = parseInt(cVal) || 220;
    const f = parseInt(fVal) || 70;

    updateUsername(nameVal);
    updateDailyGoals(cal, p, c, f);
    Alert.alert("Profile Synchronized", "Daily target configurations saved & synced with local async cache.");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.sectionHeader}>
        <Settings size={18} color="#10b981" />
        <Text style={styles.sectionTitle}>ATHLETE IDENTITY SETTINGS</Text>
      </View>

      {/* Username Configuration field */}
      <View style={styles.inputCard}>
        <Text style={styles.inputLabel}>Athlete Display Name</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter name"
          placeholderTextColor="#4b5563"
          value={nameVal}
          onChangeText={setNameVal}
        />
      </View>

      <View style={styles.sectionHeader}>
        <CloudLightning size={18} color="#10b981" />
        <Text style={styles.sectionTitle}>DAILY BUDGET MODULATOR</Text>
      </View>

      {/* Calorie configuration inputs */}
      <View style={styles.inputCard}>
        <View style={styles.formRow}>
          <View style={styles.formCol}>
            <Text style={styles.inputLabel}>Calorie (kcal)</Text>
            <TextInput
              style={styles.numInput}
              keyboardType="numeric"
              value={kcalVal}
              onChangeText={setKcalVal}
            />
          </View>
          <View style={styles.formCol}>
            <Text style={styles.inputLabel}>Protein (g)</Text>
            <TextInput
              style={styles.numInput}
              keyboardType="numeric"
              value={pVal}
              onChangeText={setPVal}
            />
          </View>
        </View>

        <View style={[styles.formRow, { marginTop: 12 }]}>
          <View style={styles.formCol}>
            <Text style={styles.inputLabel}>Carbs (g)</Text>
            <TextInput
              style={styles.numInput}
              keyboardType="numeric"
              value={cVal}
              onChangeText={setCVal}
            />
          </View>
          <View style={styles.formCol}>
            <Text style={styles.inputLabel}>Fats (g)</Text>
            <TextInput
              style={styles.numInput}
              keyboardType="numeric"
              value={fVal}
              onChangeText={setFVal}
            />
          </View>
        </View>
      </View>

      {/* Save Trigger Button */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSaveAll}>
        <CheckCircle2 size={16} color="#030712" style={{ marginRight: 6 }} />
        <Text style={styles.saveBtnText}>COMMIT CHANGES TO STORAGE</Text>
      </TouchableOpacity>

      {/* Supabase SQL integration documentation view */}
      <View style={styles.sqlViewContainer}>
        <TouchableOpacity 
          style={styles.sqlHeaderButton} 
          onPress={() => setShowSql(!showSql)}
        >
          <Terminal size={14} color="#3b82f6" style={{ marginRight: 6 }} />
          <Text style={styles.sqlBtnText}>
            {showSql ? "Hide Supabase SQL Schema Setup" : "View Production Supabase SQL"}
          </Text>
        </TouchableOpacity>

        {showSql && (
          <View style={styles.sqlBox}>
            <View style={styles.infoBadgeRow}>
              <Info size={12} color="#eab308" style={{ marginRight: 4 }} />
              <Text style={styles.infoBadgeText}>EXECUTE IN SUPABASE SQL EDITOR DIRECTLY</Text>
            </View>
            <Text style={styles.sqlCodeText}>{SUPABASE_SQL_SCHEMA}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6b7280',
    letterSpacing: 1.5,
    marginLeft: 8,
  },
  inputCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '700',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#030712',
    borderWidth: 1,
    borderColor: '#1f2937',
    color: '#f9fafb',
    height: 44,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 13,
    fontWeight: '600',
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formCol: {
    flex: 1,
    marginHorizontal: 4,
  },
  numInput: {
    backgroundColor: '#030712',
    borderWidth: 1,
    borderColor: '#1f2937',
    color: '#f9fafb',
    height: 44,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
  saveBtn: {
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  saveBtnText: {
    color: '#030712',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  sqlViewContainer: {
    backgroundColor: '#0c1020',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 12,
    padding: 10,
  },
  sqlHeaderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  sqlBtnText: {
    fontSize: 11,
    color: '#3b82f6',
    fontWeight: '700',
  },
  sqlBox: {
    marginTop: 10,
    backgroundColor: '#030712',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  infoBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(234, 179, 8, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(234, 179, 8, 0.25)',
    padding: 6,
    borderRadius: 6,
    marginBottom: 8,
  },
  infoBadgeText: {
    fontSize: 8,
    color: '#eab308',
    fontWeight: '900',
  },
  sqlCodeText: {
    fontFamily: 'monospace',
    fontSize: 9,
    color: '#9ca3af',
    lineHeight: 14,
  }
});