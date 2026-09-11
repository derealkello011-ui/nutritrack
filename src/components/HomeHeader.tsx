import { addDays, formatDateKey, formatDateLabel, isSameCalendarDate } from '@/utils/date';
import { globalStyles } from '@/styles/global';
import { useTheme } from '@/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type HomeHeaderProps = {
    selectedDate: Date;
    onDateChange: (date: Date) => void;
};

const HomeHeader = ({ selectedDate, onDateChange }: HomeHeaderProps) => {
    const { colors } = useTheme();
    const today = new Date();
    const isToday = isSameCalendarDate( selectedDate, today );

  return (
      <View style={styles.container}>
          <View style={globalStyles.header}>
              <TouchableOpacity
                  accessibilityLabel="Previous day"
                  onPress={() => onDateChange( addDays( selectedDate, -1 ) )}
                  style={styles.arrowButton}
              >
                  <Ionicons name="chevron-back" size={22} color={colors.primary} />
              </TouchableOpacity>
              <Text style={[globalStyles.date, { color: colors.textSecondary }]}>{formatDateLabel( selectedDate, today )}</Text>
              <TouchableOpacity
                  accessibilityLabel="Next day"
                  onPress={() => onDateChange( addDays( selectedDate, 1 ) )}
                  style={styles.arrowButton}
              >
                  <Ionicons name="chevron-forward" size={22} color={colors.primary} />
              </TouchableOpacity>
          </View>
          {!isToday && (
              <TouchableOpacity onPress={() => onDateChange( today )}>
                  <Text style={[styles.todayButton, { color: colors.primary }]}>Back to Today</Text>
              </TouchableOpacity>
          )}
          <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push({
                  pathname: '/add-meal',
                  params: { date: formatDateKey( selectedDate ) },
              })}
          >
              <Ionicons name="add-circle-outline" size={18} color={colors.primary} />
              <Text style={[styles.addButtonText, { color: colors.primary }]}>
                  Add meal for {formatDateLabel( selectedDate, today ).toLowerCase()}
              </Text>
          </TouchableOpacity>
    </View>
  )
}

export default HomeHeader

const styles = StyleSheet.create( {
    container: {
        marginTop: 4,
    },
    arrowButton: {
        padding: 6,
    },
    todayButton: {
        alignSelf: 'center',
        fontSize: 13,
        marginTop: -18,
    },
    addButton: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 6,
        marginTop: 4,
    },
    addButtonText: {
        fontSize: 14,
    },
} );