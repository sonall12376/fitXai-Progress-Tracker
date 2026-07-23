import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from './theme';

export const SegmentToggle = ({ options, active, onChange }: { options: string[], active: string, onChange: (val: string) => void }) => (
  <View style={styles.segmentContainer}>
    {options.map(opt => {
      const isActive = active === opt;
      return (
        <TouchableOpacity 
          key={opt} 
          style={[styles.segmentButton, isActive && styles.segmentActive]} 
          onPress={() => onChange(opt)}
        >
          <Text style={[styles.segmentText, isActive && styles.segmentTextActive]}>{opt}</Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderColor: colors.borderBase,
    borderWidth: 1,
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
    width: '100%',
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 10,
  },
  segmentActive: {
    backgroundColor: colors.yellow,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSec,
  },
  segmentTextActive: {
    color: '#000',
  },
});
