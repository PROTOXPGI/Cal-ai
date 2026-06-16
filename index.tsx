import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles, Camera, Flame, Share2, ArrowRight, ShieldCheck } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const ONBOARDING_PAGES = [
  {
    title: "Snap. Track. Transform.",
    subtitle: "No more typing, guessing, or weighing. Take a beautiful photo of any plate and watch Gemini Vision parse ingredients & macros inside 2 seconds.",
    pill: "CAL AI ENGINE v2.5",
    icon: <Camera size={44} color="#10b981" />,
    gradient: '#047857'
  },
  {
    title: "Macro Telemetry Engine",
    subtitle: "Keep daily proteins, carbs, water, and fats optimized. Get real-time score overlays inspired by clean high-performance iOS aesthetics.",
    pill: "GLASSMORPHISM CHARTS",
    icon: <Flame size={44} color="#3b82f6" />,
    gradient: '#1d4ed8'
  },
  {
    title: "Go Viral with Snap Scores",
    subtitle: "Export beautiful, customizable high-fidelity calorie breakdown cards to Instagram and TikTok. Challenge friends and maintain your daily logging streak.",
    pill: "VIRAL SYSTEM",
    icon: <Share2 size={44} color="#eab308" />,
    gradient: '#b45309'
  }
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);

  const handleNext = () => {
    if (currentPage < ONBOARDING_PAGES.length - 1) {
      setCurrentPage(prev => prev + 1);
    } else {
      router.push('/home');
    }
  };

  const activeData = ONBOARDING_PAGES[currentPage];

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
      <View style={styles.glowOverlay} />
      
      {/* Top Header Row with Logo */}
      <View style={styles.headerRow}>
        <Sparkles size={20} color="#10b981" />
        <Text style={styles.brandTitle}>NUTRI <Text style={styles.boldBrand}>SNAP</Text></Text>
      </View>

      {/* Onboarding card wrapper (Glassmorphism inspired) */}
      <View style={styles.onboardGlassCard}>
        <View style={styles.badgeRow}>
          <View style={styles.badgePill}>
            <Text style={styles.badgeText}>{activeData.pill}</Text>
          </View>
          <View style={styles.stepBadge}>
            <Text style={styles.stepText}>{currentPage + 1}/{ONBOARDING_PAGES.length}</Text>
          </View>
        </View>

        <View style={styles.iconContainer}>
          {activeData.icon}
        </View>

        <Text style={styles.cardTitle}>{activeData.title}</Text>
        <Text style={styles.cardSubtitle}>{activeData.subtitle}</Text>

        {/* Progress Dots Indicator */}
        <View style={styles.dotsRow}>
          {ONBOARDING_PAGES.map((_, i) => (
            <View 
              key={i} 
              style={[
                styles.dot, 
                i === currentPage ? styles.dotActive : styles.dotInactive
              ]} 
            />
          ))}
        </View>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {currentPage === ONBOARDING_PAGES.length - 1 ? "ENTER ATHLETE WORKSPACE" : "CONTINUE NEXT"}
          </Text>
          <ArrowRight size={16} color="#030712" style={{ marginLeft: 6 }} />
        </TouchableOpacity>

        {currentPage < ONBOARDING_PAGES.length - 1 && (
          <TouchableOpacity style={styles.skipButton} onPress={() => router.push('/home')}>
            <Text style={styles.skipText}>Sandbox Developer Bypass</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.securitySeal}>
        <ShieldCheck size={12} color="#4b5563" />
        <Text style={styles.sealText}>Cloud Firestore & Supabase SSL Certified Setup</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#030712',
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 40,
    justifyContent: 'center',
    minHeight: '100%',
  },
  glowOverlay: {
    position: 'absolute',
    top: -100,
    left: width / 6,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: (width * 0.8) / 2,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '400',
    color: '#e5e7eb',
    marginLeft: 6,
    letterSpacing: 2,
  },
  boldBrand: {
    color: '#10b981',
    fontWeight: '900',
  },
  onboardGlassCard: {
    backgroundColor: 'rgba(17, 24, 39, 0.85)',
    borderWidth: 1.5,
    borderColor: '#1f2937',
    borderRadius: 24,
    padding: 24,
    marginVertical: 15,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  badgePill: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    color: '#10b981',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  stepBadge: {
    backgroundColor: '#1f2937',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  stepText: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '700',
  },
  iconContainer: {
    alignSelf: 'center',
    backgroundColor: '#0b1329',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#f9fafb',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
    marginBottom: 24,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 4,
  },
  dotActive: {
    width: 20,
    backgroundColor: '#10b981',
  },
  dotInactive: {
    width: 6,
    backgroundColor: '#374151',
  },
  actionContainer: {
    marginTop: 20,
    width: '100%',
  },
  primaryButton: {
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
  },
  buttonText: {
    color: '#030712',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 8,
  },
  skipText: {
    fontSize: 13,
    color: '#4b5563',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  securitySeal: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  sealText: {
    color: '#4b5563',
    fontSize: 10,
    marginLeft: 4,
    fontWeight: '500',
  }
});