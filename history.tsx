import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, Alert, Image, Share } from 'react-native';
import { Search, Calendar, Sliders, ChevronRight, Share2, Trash2, Sparkles, Filter } from 'lucide-react-native';
import { useNutrition } from '../context/NutritionContext';
import { FoodAnalysis } from '../services/apiClient';

export default function HistoryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { historyLogs, clearAllLogs } = useNutrition();

  const filteredLogs = historyLogs.filter(log => 
    log.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleShareMealCard = async (meal: FoodAnalysis) => {
    try {
      const message = ` 🔥Tracked my calorie telemetry on Nutri Snap!\n🍽️ Meal: ${meal.name}\n⚡ Calories: ${meal.calories} kcal\n💪 Protein: ${meal.protein}g | Carbs: ${meal.carbs}g | Fats: ${meal.fats}g\n📈 Snap Score: ${meal.snapScore}\n🎯 Track smarter with Nutri Snap AI!`;
      await Share.share({ message });
    } catch (error) {
      Alert.alert("Sharing Failed", "Could not generate viral sharing card standard protocols.");
    }
  };

  const triggerPurge = () => {
    Alert.alert(
      "Secure Vault Purge",
      "This will permanently delete all logged plates and reset progress metrics.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Purge All Data", 
          style: "destructive", 
          onPress: () => {
            clearAllLogs();
            Alert.alert("Purged", "Secure telemetry stores empty.");
          } 
        }
      ]
    );
  };

  return ( 
    <View style={styles.container}>
      {/* Storage vault diagnostic info */}
      <View style={styles.vaultHeader}>
        <View style={styles.vaultTitleCol}>
          <Calendar size={16} color="#10b981" />
          <Text style={styles.vaultTitle}>Ingestion Storage Vault</Text>
        </View>
        <TouchableOpacity style={styles.clearBadge} onPress={triggerPurge}>
          <Trash2 size={12} color="#ef4444" style={{ marginRight: 4 }} />
          <Text style={styles.clearBadgeText}>WIPE ALL</Text>
        </TouchableOpacity>
      </View>

      {/* High performance search filter bar */}
      <View style={styles.searchRow}>
        <Search size={16} color="#4b5563" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search timeline database..."
          placeholderTextColor="#4b5563"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.filterChip}>
          <Filter size={14} color="#10b981" />
        </TouchableOpacity>
      </View>

      {/* FlatList rendering historical meal telemetry */}
      <FlatList
        data={filteredLogs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.mealCard}>
            <View style={styles.cardHeader}>
              <Image source={{ uri: item.imageUrl }} style={styles.mealThumbnail} />
              <View style={styles.cardMetaCol}>
                <Text style={styles.mealName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.mealTimeText}>Logged Today at {item.timestamp} • {item.servingSize}</Text>
              </View>
              <Text style={styles.kcalText}>{item.calories} kCal</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.macroSplitRow}>
              <Text style={styles.macroText}>P: <Text style={{color: '#f9fafb'}}>{item.protein}g</Text></Text>
              <Text style={styles.macroText}>C: <Text style={{color: '#f9fafb'}}>{item.carbs}g</Text></Text>
              <Text style={styles.macroText}>F: <Text style={{color: '#f9fafb'}}>{item.fats}g</Text></Text>
              <View style={styles.healthTag}>
                <Text style={styles.healthTagText}>{item.healthScore}/10 Health</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.shareRow}>
              <View style={styles.secureBanner}>
                <Sparkles size={11} color="#10b981" />
                <Text style={styles.secureText}>Snap Score +{item.snapScore}</Text>
              </View>
              <TouchableOpacity 
                style={styles.shareButton} 
                onPress={() => handleShareMealCard(item)}
              >
                <Share2 size={12} color="#030712" style={{ marginRight: 4 }} />
                <Text style={styles.shareButtonText}>SHARE CARD</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>Zero Telemetry Records Found</Text>
            <Text style={styles.emptyDesc}>Try capturing a food image or lower your filters to view logs.</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
    padding: 16, 
  },
  vaultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  vaultTitleCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vaultTitle: {
    fontSize: 13,
    fontWeight: '850',
    color: '#f3f4f6',
    marginLeft: 6,
  },
  clearBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  clearBadgeText: {
    fontSize: 9,
    color: '#ef4444',
    fontWeight: '900',
  },
  searchRow: {
    flexDirection: 'row',
    backgroundColor: '#111827',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1f2937',
    paddingHorizontal: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    color: '#f9fafb',
    fontSize: 13,
    height: 44,
  },
  filterChip: {
    padding: 6,
  },
  mealCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealThumbnail: {
    width: 44,
    height: 44,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#1f2937',
  },
  cardMetaCol: {
    flex: 1,
    paddingRight: 6,
  },
  mealName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#f9fafb',
  },
  mealTimeText: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 1,
  },
  kcalText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#10b981',
  },
  divider: {
    height: 1,
    backgroundColor: '#1f2937',
    marginVertical: 10,
  },
  macroSplitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  macroText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9ca3af',
  },
  healthTag: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  healthTagText: {
    fontSize: 9,
    color: '#3b82f6',
    fontWeight: '700',
  },
  shareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  secureBanner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  secureText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10b981',
    marginLeft: 4,
  },
  shareButton: {
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },
  shareButtonText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#030712',
  },
  emptyWrap: {
    padding: 40,
    alignItems: 'center', 
  },
  emptyTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#9ca3af',
    marginBottom: 4,
  },
  emptyDesc: {
    fontSize: 11,
    color: '#4b5563',
    textAlign: 'center',
  }
});