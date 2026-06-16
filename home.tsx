import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, TextInput, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import ProgressBar from '../components/ProgressBar';
import StatRing from '../components/StatRing';
import { useNutrition } from '../context/NutritionContext';
import { Flame, Award, Zap, Camera, Plus, Sparkles, Droplet, Check } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const {
    calories,
    protein,
    carbs,
    fats,
    goalCalories,
    goalProtein,
    goalCarbs,
    goalFats,
    waterTotalMl,
    waterLogs,
    addWater,
    historyLogs,
    streakCount,
    snapScoreTotal,
    username,
    isPremium,
    addMealMock
  } = useNutrition();

  const [quickMealName, setQuickMealName] = useState('');
  const [quickMealKcal, setQuickMealKcal] = useState('');

  const handleInjectQuickMeal = () => {
    if (!quickMealName || !quickMealKcal) {
      Alert.alert("Missing Information", "Please enter name and calories.");
      return;
    }
    const calValue = parseInt(quickMealKcal);
    if (isNaN(calValue)) return;
    
    // Calculate estimated standard macro split for simplicity
    const p = Math.round(calValue * 0.12);
    const c = Math.round(calValue * 0.08);
    const f = Math.round(calValue * 0.03);

    addMealMock(quickMealName, calValue, p, c, f);
    setQuickMealName('');
    setQuickMealKcal('');
    Alert.alert("Success", "Quick plate added and registered to timeline database.");
  };

  const remainingCalories = goalCalories - calories;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Premium Badge & Global Performance Panel */}
      <View style={styles.heroBanner}>
        <View>
          <Text style={styles.greeting}>SYSTEM OPERATIONAL</Text>
          <Text style={styles.username}>{username}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.tierBadge, isPremium ? styles.premiumAccent : styles.freeAccent]} 
          onPress={() => router.push('/paywall')}
        >
          <Award size={14} color={isPremium ? '#030712' : '#eab308'} />
          <Text style={[styles.tierText, { color: isPremium ? '#030712' : '#eab308' }]}>
            {isPremium ? "GOLD PRO MEMBER" : "FREE TRIAL"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Viral Streak & Snap Score micro-cards */}
      <View style={styles.gamifiedRow}>
        <View style={styles.gamifiedCard}>
          <Flame size={18} color="#ef4444" />
          <View style={styles.gamifiedMeta}>
            <Text style={styles.gamifiedVal}>{streakCount} Days</Text>
            <Text style={styles.gamifiedLabel}>Active Streak</Text>
          </View>
        </View>
        <View style={styles.gamifiedCard}>
          <Sparkles size={18} color="#eab308" />
          <View style={styles.gamifiedMeta}>
            <Text style={styles.gamifiedVal}>{snapScoreTotal}</Text>
            <Text style={styles.gamifiedLabel}>Snap Score</Text>
          </View>
        </View>
      </View>

      {/* Main Glassmorphic Calorie Ring Console */}
      <View style={styles.mainConsole}>
        <View style={styles.consoleHeader}>
          <Text style={styles.consoleLabel}>CALORIE TELEMETRY BUDGET</Text>
          <View style={styles.statusIndicator}>
            <View style={styles.activeDot} />
            <Text style={styles.activeText}>LIVE SYNC</Text>
          </View>
        </View>

        <View style={styles.budgetRow}>
          <View>
            <Text style={styles.consumedKcal}>{calories} kcal</Text>
            <Text style={styles.budgetTarget}>Limit: {goalCalories} kcal</Text>
            <Text style={[styles.remainingStatus, remainingCalories >= 0 ? styles.positiveStatus : styles.negativeStatus]}>
              {remainingCalories >= 0 
                ? `${remainingCalories} kcal left until limit` 
                : `Surplus of ${Math.abs(remainingCalories)} kcal`}
            </Text>
          </View>
          <View style={styles.pctRing}>
            <Text style={styles.pctNum}>{Math.round((calories / goalCalories) * 100)}%</Text>
          </View>
        </View>

        <ProgressBar 
          progress={calories / goalCalories} 
          color="#10b981" 
          height={14} 
        />
      </View>

      {/* Macronutrient Circles */}
      <Text style={styles.sectionTitle}>REAL-TIME ALLOCATIONS</Text>
      <View style={styles.macroBlock}>
        <StatRing label="Protein" value={protein} target={goalProtein} color="#3b82f6" unit="g" />
        <StatRing label="Carbs" value={carbs} target={goalCarbs} color="#eab308" unit="g" />
        <StatRing label="Fats" value={fats} target={goalFats} color="#ef4444" unit="g" />
      </View>

      {/* Interactive Water Tracker Section */}
      <View style={styles.waterBox}>
        <View style={styles.waterHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Droplet size={18} color="#3b82f6" />
            <Text style={styles.waterTitle}>H2O Hydration Tracker</Text>
          </View>
          <Text style={styles.waterGoal}>{waterTotalMl} / 2500 ml</Text>
        </View>
        
        <View style={styles.waterQuickRow}>
          <TouchableOpacity style={styles.waterBtn} onPress={() => addWater(250)}>
            <Text style={styles.waterBtnText}>+250ml Glass</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.waterBtn} onPress={() => addWater(500)}>
            <Text style={styles.waterBtnText}>+500ml Bottle</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.waterBtn} onPress={() => addWater(750)}>
            <Text style={styles.waterBtnText}>+750ml Thermos</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Direct AI Action Link */}
      <TouchableOpacity style={styles.scanLauncher} onPress={() => router.push('/explore')}>
        <View style={styles.scanBtnLeft}>
          <Camera size={22} color="#030712" style={{ marginRight: 8 }} />
          <Text style={styles.scanBtnText}>ACTIVATE AI CAMERA SCAN</Text>
        </View>
        <Zap size={18} color="#030712" />
      </TouchableOpacity>

      {/* Dynamic Meal Logs list */}
      <View style={styles.historyListTitleRow}>
        <Text style={styles.sectionTitle}>TODAY'S INGESTION TIMELINE</Text>
        <TouchableOpacity onPress={() => router.push('/history')}>
          <Text style={styles.viewAllBtn}>View Timeline ({historyLogs.length})</Text>
        </TouchableOpacity>
      </View>

      {historyLogs.slice(0, 2).map((item) => (
        <View key={item.id} style={styles.mealListItem}>
          <View style={styles.mealIndicatorRow}>
            <View style={styles.greenTickCircle}>
              <Check size={12} color="#10b981" />
            </View>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={styles.mealNameText} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.mealMetaText}>{item.timestamp} • {item.servingSize} • Accuracy {item.confidence}%</Text>
            </View>
            <Text style={styles.mealKcalVal}>{item.calories} kcal</Text>
          </View>
        </View>
      ))}

      {historyLogs.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No snap detections today. Aim your lens at some nutrition!</Text>
        </View>
      )}

      {/* Manual Sandboxed Quick Injector (Perfect for physical device validation) */}
      <View style={styles.quickForm}>
        <Text style={styles.quickFormTitle}>SANDBOX QUICK LOG MODULATOR</Text>
        <Text style={styles.quickFormDesc}>Directly adjust state targets offline to verify UI telemetry components</Text>
        
        <View style={styles.inputsRow}>
          <TextInput
            style={styles.formInput}
            placeholder="Plate name (e.g., Berry Shake)"
            placeholderTextColor="#4b5563"
            value={quickMealName}
            onChangeText={setQuickMealName}
          />
          <TextInput
            style={[styles.formInput, { width: 90 }]}
            placeholder="Calories"
            placeholderTextColor="#4b5563"
            keyboardType="numeric"
            value={quickMealKcal}
            onChangeText={setQuickMealKcal}
          />
          <TouchableOpacity style={styles.quickFormBtn} onPress={handleInjectQuickMeal}>
            <Plus size={16} color="#10b981" />
          </TouchableOpacity>
        </View>
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
  heroBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  greeting: { 
    fontSize: 10, 
    color: '#10b981', 
    fontWeight: '800', 
    letterSpacing: 1.5 
  },
  username: { 
    fontSize: 22, 
    fontWeight: '900', 
    color: '#f9fafb' 
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  premiumAccent: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  freeAccent: {
    backgroundColor: 'rgba(234, 179, 8, 0.1)',
    borderColor: 'rgba(234, 179, 8, 0.3)',
  },
  tierText: {
    fontSize: 9,
    fontWeight: '900',
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  gamifiedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  gamifiedCard: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  gamifiedMeta: {
    marginLeft: 10,
  },
  gamifiedVal: {
    fontSize: 15,
    fontWeight: '900',
    color: '#f9fafb',
  },
  gamifiedLabel: {
    fontSize: 10,
    color: '#6b7280',
  },
  mainConsole: {
    backgroundColor: 'rgba(17, 24, 39, 0.95)',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#1f2937',
    marginBottom: 20,
  },
  consoleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  consoleLabel: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '800',
    letterSpacing: 1,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
    marginRight: 6,
  },
  activeText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#10b981',
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', 
    marginBottom: 14,
  },
  consumedKcal: {
    fontSize: 34,
    fontWeight: '900',
    color: '#10b981',
    letterSpacing: -1,
  },
  budgetTarget: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '600',
    marginTop: -2,
  },
  remainingStatus: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 6,
  },
  positiveStatus: {
    color: '#3b82f6',
  },
  negativeStatus: {
    color: '#ef4444',
  },
  pctRing: {
    backgroundColor: '#1f2937',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#374151',
  },
  pctNum: {
    fontSize: 14,
    fontWeight: '800',
    color: '#f9fafb',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6b7280',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  macroBlock: {
    flexDirection: 'row',
    backgroundColor: '#070b19',
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 20,
  },
  waterBox: {
    backgroundColor: '#111827',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1f2937',
    marginBottom: 20,
  },
  waterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  waterTitle: {
    fontSize: 13,
    fontWeight: '800', 
    color: '#f3f4f6',
    marginLeft: 6,
  },
  waterGoal: {
    fontSize: 12,
    fontWeight: '700', 
    color: '#3b82f6',
  },
  waterQuickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  waterBtn: {
    flex: 1,
    backgroundColor: '#1f2937',
    paddingVertical: 10,
    marginHorizontal: 3,
    borderRadius: 8,
    alignItems: 'center',
  },
  waterBtnText: {
    fontSize: 11,
    color: '#cbd5e1',
    fontWeight: '700',
  },
  scanLauncher: {
    backgroundColor: '#10b981',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    marginBottom: 24,
  },
  scanBtnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scanBtnText: {
    color: '#030712',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  historyListTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  viewAllBtn: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '700',
  },
  mealListItem: {
    backgroundColor: '#111827',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  mealIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greenTickCircle: {
    width: 24, 
    height: 24, 
    borderRadius: 12, 
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  mealNameText: {
    fontSize: 13, 
    fontWeight: '800', 
    color: '#f9fafb'
  },
  mealMetaText: {
    fontSize: 10, 
    color: '#4b5563', 
    marginTop: 2 
  },
  mealKcalVal: {
    fontSize: 14,
    fontWeight: '900', 
    color: '#10b981'
  },
  emptyContainer: {
    padding: 24,
    backgroundColor: '#111827',
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
  },
  quickForm: {
    backgroundColor: '#070c14',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
  },
  quickFormTitle: {
    fontSize: 9,
    fontWeight: '900',
    color: '#eab308',
    letterSpacing: 1,
  },
  quickFormDesc: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 8,
  },
  inputsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  formInput: {
    flex: 1,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    color: '#f9fafb',
    height: 40,
    borderRadius: 6,
    paddingHorizontal: 8,
    fontSize: 12,
    marginRight: 6,
  },
  quickFormBtn: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  }
});