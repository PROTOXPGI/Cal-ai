import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatRingProps {
  label: string;
  value: number;
  target: number;
  color: string;
  unit: string;
}

export default function StatRing({ label, value, target, color, unit }: StatRingProps) {
  const pct = target > 0 ? Math.round((value / target) * 100) : 0;

  return (
    <View style={styles.container}>
      <View style={[styles.indicatorBorder, { borderColor: color }]}>
        <Text style={[styles.valText, { color }]}>{value}</Text>
        <Text style={styles.unitText}>{unit}</Text>
      </View>
      <Text style={styles.labelText}>{label}</Text>
      <Text style={[styles.targetText, { color }]}>{pct}% target</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  indicatorBorder: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    marginBottom: 8,
  },
  valText: {
    fontSize: 14,
    fontWeight: '800',
  },
  unitText: {
    fontSize: 9,
    color: '#9ca3af',
    marginTop: -2,
    textTransform: 'uppercase'
  },
  labelText: { 
    fontSize: 12,
    color: '#f9fafb',
    fontWeight: '700',
  },
  targetText: {
    fontSize: 9,
    fontWeight: '600',
    marginTop: 2
  }
});