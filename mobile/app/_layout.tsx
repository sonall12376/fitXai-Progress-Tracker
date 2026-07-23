import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../src/theme';

export default function Layout() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Slot />
      
      {/* Floating Tab Bar Overlay */}
      <View style={styles.tabBarContainer}>
        <View style={styles.tabBar}>
          <TouchableOpacity style={styles.tabItem}>
            <Ionicons name="home-outline" size={24} color={colors.textSec} />
            <Text style={styles.tabText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem}>
            <Ionicons name="barbell-outline" size={24} color={colors.textSec} />
            <Text style={styles.tabText}>Workout</Text>
          </TouchableOpacity>
          
          <View style={styles.fabContainer}>
            <TouchableOpacity style={styles.fab}>
              <Ionicons name="add" size={32} color="#000" />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.tabItem}>
            <Ionicons name="stats-chart" size={24} color={colors.yellow} />
            <Text style={[styles.tabText, { color: colors.yellow }]}>Analytics</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem}>
            <Ionicons name="person-outline" size={24} color={colors.textSec} />
            <Text style={styles.tabText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: 24,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#151515',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    borderWidth: 1,
    borderColor: '#27272A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  tabText: {
    fontSize: 10,
    marginTop: 4,
    color: colors.textSec,
  },
  fabContainer: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    top: -24,
    position: 'absolute',
    shadowColor: colors.yellow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  }
});
