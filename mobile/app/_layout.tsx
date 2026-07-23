import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Slot } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';
import { C, cardShadow } from '../src/theme/Theme';

export default function Layout() {
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <Slot />
      
      {/* Bottom Nav */}
      <View style={s.bottomnav}>
        {/* Home */}
        <TouchableOpacity style={s.navitem} activeOpacity={0.8}>
          <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <Path d="M3 11l9-8 9 8M5 10v10h14V10" />
          </Svg>
          <Text style={s.navtext}>Home</Text>
        </TouchableOpacity>

        {/* Workout */}
        <TouchableOpacity style={s.navitem} activeOpacity={0.8}>
          <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <Path d="M6.5 6.5l11 11M2 8l3-3m14 14l3-3M7 17l-3 3M17 7l3-3" />
            <Circle cx="6" cy="6" r="2" />
            <Circle cx="18" cy="18" r="2" />
          </Svg>
          <Text style={s.navtext}>Workout</Text>
        </TouchableOpacity>

        {/* FAB */}
        <TouchableOpacity style={s.fab} activeOpacity={0.9}>
          <LinearGradient colors={[C.purple, C.pink]} style={s.fabGradient}>
            <Svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
              <Path d="M12 5v14M5 12h14" />
            </Svg>
          </LinearGradient>
        </TouchableOpacity>

        {/* Analytics (Active) */}
        <TouchableOpacity style={[s.navitem, s.activeItem]} activeOpacity={0.8}>
          <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.purple} strokeWidth="2">
            <Path d="M3 3v18h18M7 15l4-4 3 3 5-6" />
          </Svg>
          <Text style={[s.navtext, s.activeText]}>Analytics</Text>
        </TouchableOpacity>

        {/* Profile */}
        <TouchableOpacity style={s.navitem} activeOpacity={0.8}>
          <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <Circle cx="12" cy="8" r="4" />
            <Path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
          </Svg>
          <Text style={s.navtext}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  bottomnav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(10,10,10,0.95)',
    borderTopWidth: 1,
    borderTopColor: C.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    paddingBottom: 10, // safe area adjustment
  },
  navitem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  activeItem: {
    backgroundColor: 'rgba(245,196,0,.12)',
  },
  navtext: {
    color: C.text2,
    fontSize: 10,
    fontWeight: '600',
  },
  activeText: {
    color: C.purple,
  },
  fab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginTop: -24, // Break out of tab bar
    ...cardShadow,
    shadowColor: 'rgba(245,196,0,.6)',
  },
  fabGradient: {
    flex: 1,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
