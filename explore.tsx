import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Image } from 'react-native';
import { ApiClient, FoodAnalysis } from '../services/apiClient';
import { useNutrition } from '../context/NutritionContext';
import { Camera, Zap, Eye, ShieldCheck, Heart, Info, ArrowUpRight, Share2 } from 'lucide-react-native';

export default function ExploreScreen() {
  const [scanning, setScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<FoodAnalysis | null>(null);
  const [isLogged, setIsLogged] = useState(false);
  const { addMealDirect, isPremium } = useNutrition();

  // Simulated selection of sample photo URLs
  const SAMPLE_MEAL_URI = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600';

  const handleCaptureSimulation = async () => {
    setScanning(true);
    setScannedResult(null);
    setIsLogged(false);
    try {
      const result = await ApiClient.analyzePlateImage(SAMPLE_MEAL_URI, isPremium);
      setScannedResult(result);
    } catch (e) {
      Alert.alert("Computer Vision Alert", "Could not access local scanner stream safely.");
    } finally {
      setScanning(false);
    }
  };

  const handleSaveToVault = () => {
    if (scannedResult) {
      addMealDirect(scannedResult);
      setIsLogged(true);
      Alert.alert(
        "Nutrition Tracked",
        `${scannedResult.name} was successfully encrypted & committed to your timeline database.`
      );
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Top informational header banner */}
      <View style={styles.guidanceBanner}>
        <Info size={14} color="#10b981" />
        <Text style={styles.guidanceText}>
          {!isPremium 
            ? "Free Tier active: 3 smart scans left today. Upgrade to bypass limits." 
            : "PRO active: Unlimited scans with deep molecular ingredients classification."}
        </Text>
      </View>

      {/* Viewfinder Frame simulator with visual status overlay */}
      <View style={styles.cameraFrame}>
        <Image 
          source={{ uri: SAMPLE_MEAL_URI }} 
          style={styles.backgroundImage}
          resizeMode="cover"
        />

        {/* UI corners mimicking a high-end physical camera scanner system */}
        <View style={styles.cornerTL} />
        <View style={styles.cornerTR} />
        <View style={styles.cornerBL} />
        <View style={styles.cornerBR} />
        <View style={styles.gridLineH} />
        <View style={styles.gridLineV} />

        {scanning ? ( 
          <View style={styles.scanningOverlay}>
            <ActivityIndicator size="large" color="#10b981" />
            <Text style={styles.pulseText}>DECOMPOSING ATOMS WITH GEMINI PRO...</Text>
          </View>
        ) : scannedResult ? (
          <View style={styles.successScreen}>
            <ShieldCheck size={38} color="#10b981" />
            <Text style={styles.visionPass}>GEMINI ANALYSIS CONCLUDED</Text>
            <Text style={styles.visionMatch} numberOfLines={1}>{scannedResult.name}</Text>
            <Text style={styles.accuracyText}>{scannedResult.confidence}% confidence score</Text>
          </View>
        ) : (
          <View style={styles.idleFrameContent}>
            <Camera size={44} color="#fff" style={{ opacity: 0.8 }} />
            <Text style={styles.viewfinderInstructions}>ALIGN FOOD WITHIN FRAME</Text>
          </View>
        )}
      </View>

      {/* Scan execution buttons */}
      <TouchableOpacity 
        style={styles.actionBtn}
        onPress={handleCaptureSimulation}
        disabled={scanning}
      >
        <Zap size={20} color="#030712" style={{ marginRight: 6 }} />
        <Text style={styles.actionBtnText}>
          {scanning ? "SCANNING METRIC SPLITS..." : "TRIGGER PLATE INTEL SHOT"}
        </Text>
      </TouchableOpacity>

      {/* Detailed Analysis Output Panel */}
      {scannedResult && (
        <View style={styles.resultsPanel}>
          <View style={styles.resultsHeader}>
            <Eye size={16} color="#10b981" />
            <Text style={styles.panelTitle}>AI SPECTRAL MACRO BREAKDOWN</Text>
          </View>

          <Text style={styles.scannedFoodTitle}>{scannedResult.name}</Text>
          <Text style={styles.detectedTime}>Serving Size: {scannedResult.servingSize}</Text>

          {/* Macro block breakdown layout */}
          <View style={styles.macroBlockRow}>
            <View style={styles.macroPill}>
              <Text style={styles.macroPillVal}>{scannedResult.calories}</Text>
              <Text style={styles.macroPillLabel}>kCal</Text>
            </View>
            <View style={styles.macroPill}>
              <Text style={[styles.macroPillVal, {color: '#3b82f6'}]}>{scannedResult.protein}g</Text>
              <Text style={styles.macroPillLabel}>Protein</Text>
            </View>
            <View style={styles.macroPill}>
              <Text style={[styles.macroPillVal, {color: '#eab308'}]}>{scannedResult.carbs}g</Text>
              <Text style={styles.macroPillLabel}>Carbs</Text>
            </View>
            <View style={styles.macroPill}>
              <Text style={[styles.macroPillVal, {color: '#ef4444'}]}>{scannedResult.fats}g</Text>
              <Text style={styles.macroPillLabel}>Fats</Text>
            </View>
          </View>

          {/* Smart micro-scores (Viral features) */}
          <View style={styles.extraStatsRow}>
            <View style={styles.statSquare}>
              <Heart size={16} color="#ef4444" style={{ marginBottom: 4 }} />
              <Text style={styles.statSquareVal}>{scannedResult.healthScore}/10</Text>
              <Text style={styles.statSquareLabel}>Health Index</Text>
            </View>
            <View style={styles.statSquare}>
              <ArrowUpRight size={16} color="#eab308" style={{ marginBottom: 4 }} />
              <Text style={styles.statSquareVal}>+{scannedResult.snapScore}</Text>
              <Text style={styles.statSquareLabel}>Snap Score</Text>
            </View>
          </View>

          <Text style={styles.ingredientsSubheader}>CLASSIFIED INGREDIENTS</Text>
          <View style={styles.ingredientsContainer}>
            {scannedResult.matchedIngredients.map((ing, i) => (
              <View key={i} style={styles.ingChip}>
                <Text style={styles.ingText}>{ing}</Text>
              </View>
            ))} 
          </View>

          {/* Interaction controls */}
          <TouchableOpacity
            style={[styles.saveBtn, isLogged && styles.saveBtnLogged]}
            onPress={handleSaveToVault}
            disabled={isLogged}
          >
            {isLogged ? (
              <Text style={styles.saveBtnTextLogged}>LOCKED TO TIMELINE VAULT ✓</Text>
            ) : (
              <Text style={styles.saveBtnText}>COMMIT DETECTED METRICS TO TODAY</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
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
  guidanceBanner: {
    flexDirection: 'row',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: 'center',
  },
  guidanceText: {
    fontSize: 11,
    color: '#e5e7eb',
    marginLeft: 8,
    flex: 1,
    fontWeight: '500',
  },
  cameraFrame: {
    height: 240,
    backgroundColor: '#070b19',
    borderWidth: 1.5,
    borderColor: '#1f2937',
    borderRadius: 16,
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.35,
  },
  cornerTL: { position: 'absolute', top: 12, left: 12, width: 24, height: 24, borderLeftWidth: 3, borderTopWidth: 3, borderColor: '#10b981' },
  cornerTR: { position: 'absolute', top: 12, right: 12, width: 24, height: 24, borderRightWidth: 3, borderTopWidth: 3, borderColor: '#10b981' },
  cornerBL: { position: 'absolute', bottom: 12, left: 12, width: 24, height: 24, borderLeftWidth: 3, borderBottomWidth: 3, borderColor: '#10b981' },
  cornerBR: { position: 'absolute', bottom: 12, right: 12, width: 24, height: 24, borderRightWidth: 3, borderBottomWidth: 3, borderColor: '#10b981' },
  gridLineH: { position: 'absolute', top: '50%', left: 0, right: 0, height: 1, backgroundColor: 'rgba(16, 185, 129, 0.15)' },
  gridLineV: { position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(16, 185, 129, 0.15)' },
  scanningOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(3, 7, 18, 0.8)',
    ...StyleSheet.absoluteFillObject,
  },
  pulseText: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: '900',
    marginTop: 12,
    letterSpacing: 1,
  },
  successScreen: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(3, 7, 18, 0.8)',
    ...StyleSheet.absoluteFillObject,
  },
  visionPass: {
    fontSize: 10,
    color: '#10b981',
    fontWeight: '950',
    letterSpacing: 2,
    marginTop: 8,
  },
  visionMatch: { 
    fontSize: 18, 
    fontWeight: '900', 
    color: '#f3f4f6', 
    marginTop: 4, 
    textAlign: 'center'
  },
  accuracyText: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 2,
  },
  idleFrameContent: {
    alignItems: 'center',
  },
  viewfinderInstructions: {
    color: '#f3f4f6',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: 10,
  },
  actionBtn: {
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  actionBtnText: {
    color: '#030712',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  resultsPanel: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#10b981',
    letterSpacing: 1,
    marginLeft: 6,
  },
  scannedFoodTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#f9fafb',
  },
  detectedTime: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 14,
  },
  macroBlockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  macroPill: {
    flex: 1,
    backgroundColor: '#1f2937',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: '#374151',
  },
  macroPillVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#f9fafb',
  },
  macroPillLabel: {
    fontSize: 9,
    color: '#9ca3af',
    marginTop: 1,
  },
  extraStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  statSquare: {
    flex: 1,
    backgroundColor: '#070b19',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginHorizontal: 3,
  },
  statSquareVal: {
    fontSize: 14,
    fontWeight: '900',
    color: '#cbd5e1',
  },
  statSquareLabel: {
    fontSize: 9,
    color: '#6b7280',
    textTransform: 'uppercase',
  },
  ingredientsSubheader: {
    fontSize: 10,
    fontWeight: '800',
    color: '#9ca3af',
    letterSpacing: 1,
    marginBottom: 8,
  },
  ingredientsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  ingChip: {
    backgroundColor: '#1f2937',
    borderWidth: 0.5,
    borderColor: '#374151',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    marginRight: 4,
    marginBottom: 4,
  },
  ingText: {
    fontSize: 10,
    color: '#d1d5db',
  },
  saveBtn: {
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  saveBtnLogged: {
    backgroundColor: '#111827',
    borderWidth: 1.5,
    borderColor: '#10b981',
  },
  saveBtnText: {
    color: '#030712',
    fontSize: 12,
    fontWeight: '900',
  },
  saveBtnTextLogged: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '900',
  }
});