import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ProgressBarProps {
  progress: number; // 0 to 1
  color?: string;
  height?: number;
  showLabel?: boolean;
  labelSuffix?: string;
}

export default function ProgressBar({
  progress,
  color = '#10b981',
  height = 10,
  showLabel = false,
  labelSuffix = ''
}: ProgressBarProps) {
  const clamped = Math.min(Math.max(progress, 0), 1);
  const percentageStr = `${Math.round(clamped * 100)}%`;

  return (
    <View style={styles.outerContainer}>
      {showLabel && (
        <View style={styles.labelRow}>
          <Text style={styles.pctText}>{percentageStr} Consumed</Text>
          {labelSuffix !== '' && <Text style={styles.suffixText}>{labelSuffix}</Text>}
        </View>
      )}
      <View style={[styles.background, { height, borderRadius: height / 2 }]}>
        <View 
          style={[
            styles.fill,
            {
              width: `${clamped * 100}%`,
              backgroundColor: color,
              borderRadius: height / 2,
            }
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    marginVertical: 4,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  pctText: {
    fontSize: 12,
    color: '#f3f4f6',
    fontWeight: '700',
  },
  suffixText: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  background: {
    backgroundColor: '#1f2937',
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  }
});