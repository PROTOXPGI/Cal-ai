import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { useNutrition } from '../context/NutritionContext';
import { ApiClient } from '../services/apiClient';
import { ShieldAlert, Check, Star, Sparkles, CreditCard, Lock } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function PaywallScreen() {
  const { isPremium, setSubscriptionState } = useNutrition();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');

  const handleStripeUpgrade = async () => {
    setLoading(true);
    try {
      const session = await ApiClient.initializeStripeSession(selectedPlan);
      if (session.success) {
        setSubscriptionState(true);
        Alert.alert(
          "Subscription Unlocked ✓",
          `Successfully simulated Stripe webhook integration. Welcome to Nutri Snap Pro!`
        );
      }
    } catch (e) {
      Alert.alert("Payment Error", "Stripe subsystem communication timed out.");
    } finally {
      setLoading(false);
    }
  };

  const handleDowngrade = () => {
    setSubscriptionState(false);
    Alert.alert("Downgraded", "Your account tier was successfully modified to Free level.");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.glowOverlay} />
      
      {/* Substantial Premium Pitch Header */}
      <View style={styles.headerArea}>
        <View style={styles.goldPill}>
          <Star size={12} color="#eab308" fill="#eab308" />
          <Text style={styles.goldPillText}>CALO-TRACK PRO ACCESS</Text>
        </View>
        <Text style={styles.title}>Unlock Infinite AI Vision</Text>
        <Text style={styles.subtitle}>
          Upgrade to bypass search filters, gain unconstrained molecular food scans, and unlock tailored macro guidance from advanced model parameters.
        </Text>
      </View>

      {/* Grid of Pro Features compared to standard tier */}
      <View style={styles.featuresList}>
        <View style={styles.featureItem}>
          <Check size={18} color="#10b981" style={styles.checkIcon} />
          <View style={{ flex: 1 }}>
            <Text style={styles.featureTitle}>Infinite Snap Captures</Text>
            <Text style={styles.featureDesc}>Unlimited camera analysis with zero cooling periods.</Text>
          </View>
        </View>
        
        <View style={styles.featureItem}>
          <Check size={18} color="#10b981" style={styles.checkIcon} />
          <View style={{ flex: 1 }}>
            <Text style={styles.featureTitle}>Gemini Vision Classifier</Text>
            <Text style={styles.featureDesc}>Finer ingredient categorization, density multipliers, and health ranking score overlay.</Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <Check size={18} color="#10b981" style={styles.checkIcon} />
          <View style={{ flex: 1 }}>
            <Text style={styles.featureTitle}>Stripe Native Checkout Sandbox</Text>
            <Text style={styles.featureDesc}>Secure, automated payment flow linked directly to Supabase triggers.</Text>
          </View>
        </View>
      </View>

      {/* Stripe payment plans selectors */}
      <View style={styles.plansContainer}>
        <TouchableOpacity 
          style={[styles.planCard, selectedPlan === 'monthly' && styles.selectedPlanCard]}
          onPress={() => setSelectedPlan('monthly')}
        >
          <View style={styles.planBadgeRow}>
            <Text style={styles.planTitle}>Monthly Elite</Text>
            <Text style={styles.planPrice}>$9.99/mo</Text>
          </View>
          <Text style={styles.planDesc}>Best for short term high fitness validation cycles.</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.planCard, selectedPlan === 'yearly' && styles.selectedPlanCard]}
          onPress={() => setSelectedPlan('yearly')}
        >
          <View style={styles.planBadgeRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.planTitle}>Yearly Champion</Text>
              <View style={styles.hotPill}><Text style={styles.hotText}>SAVE 50%</Text></View>
            </View>
            <Text style={styles.planPrice}>$4.99/mo</Text>
          </View>
          <Text style={styles.planDesc}>Billed annually ($59.99). Our most  premium blueprint choice we advise you to choose.</Text>
        </TouchableOpacity>
      </View>

      {/* Call to action */}
      {isPremium ? (
        <View style={styles.premiumActiveState}>
          <Text style={styles.activeLabel}>✓ YOU ARE CURRENTLY AN ELITE PRO MEMBER</Text>
          <TouchableOpacity style={styles.downgradeButton} onPress={handleDowngrade}>
            <Text style={styles.downgradeText}>Cancel subscription simulation safely</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.ctaButton} 
          onPress={handleStripeUpgrade}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#030712" />
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <CreditCard size={18} color="#030712" style={{ marginRight: 8 }} />
              <Text style={styles.ctaBtnText}>SECURE CHECKOUT WITH STRIPE</Text>
            </View>
          )}
        </TouchableOpacity>
      )}

      <View style={styles.encryptionRow}>
        <Lock size={12} color="#4b5563" style={{ marginRight: 6 }} />
        <Text style={styles.encryptionText}>Stripe AES-256 secure encrypted payment tokens.</Text>
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
    padding: 24,
    paddingBottom: 40,
  },
  glowOverlay: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: (width * 0.7) / 2,
    backgroundColor: 'rgba(234, 179, 8, 0.05)',
  },
  headerArea: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 24,
  },
  goldPill: {
    flexDirection: 'row',
    backgroundColor: 'rgba(234, 179, 8, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(234, 179, 8, 0.4)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 14,
  },
  goldPillText: {
    color: '#eab308',
    fontSize: 9,
    fontWeight: '900',
    marginLeft: 6,
    letterSpacing: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#f9fafb',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center', 
    marginTop: 8,
    lineHeight: 18,
  },
  featuresList: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  checkIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#f9fafb',
  },
  featureDesc: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
  },
  plansContainer: {
    marginBottom: 24,
  },
  planCard: {
    backgroundColor: '#070b19',
    borderWidth: 1.5,
    borderColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  selectedPlanCard: {
    borderColor: '#eab308',
    backgroundColor: 'rgba(234, 179, 8, 0.05)',
  },
  planBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', 
    marginBottom: 4,
  },
  planTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#f3f4f6',
  },
  planPrice: {
    fontSize: 14,
    fontWeight: '950',
    color: '#eab308',
  },
  planDesc: {
    fontSize: 11,
    color: '#6b7280',
  },
  hotPill: {
    backgroundColor: '#eab308',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  hotText: {
    fontSize: 8,
    fontWeight: '950',
    color: '#030712',
  },
  ctaButton: {
    backgroundColor: '#eab308',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  ctaBtnText: {
    color: '#030712',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  premiumActiveState: {
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: '#10b981',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  activeLabel: {
    color: '#10b981',
    fontWeight: '900',
    fontSize: 12,
  },
  downgradeButton: {
    marginTop: 10,
    paddingVertical: 4,
  },
  downgradeText: {
    fontSize: 11,
    color: '#ef4444',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  encryptionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  encryptionText: {
    color: '#4b5563',
    fontSize: 10,
  }
});