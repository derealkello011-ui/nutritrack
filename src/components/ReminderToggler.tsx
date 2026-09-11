import { useTheme } from '@/theme/ThemeProvider';
import { cancelMealReminders, requestPermissions, scheduleMealReminders } from '@/utils/notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

const REMINDERS_KEY = 'remindersEnabled';

type ReminderToggleProps = {
    compact?: boolean;
};

export default function ReminderToggle({ compact = false }: ReminderToggleProps) {
    const { colors } = useTheme();
    const [enabled, setEnabled] = useState( false );

    useEffect( () => {
        AsyncStorage.getItem( REMINDERS_KEY ).then( (value) => setEnabled( value === 'true' ) );
    }, [] );

    const toggle = async (value: boolean) => {
        if ( value ) {
            const granted = await requestPermissions();
            if ( !granted ) return;
            await scheduleMealReminders();
        } else {
            await cancelMealReminders();
        }
        setEnabled( value );
        await AsyncStorage.setItem( REMINDERS_KEY, value.toString() );
    };

    return (
        <View style={[styles.container, compact && styles.compact]}>
            {!compact && <Text style={[styles.label, { color: colors.text }]}>Meal Reminders</Text>}
            <Switch
                value={enabled}
                onValueChange={toggle}
                trackColor={{ false: colors.surface, true: colors.primary }}
            />
        </View>
    );
}

const styles = StyleSheet.create( {
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
    },
    compact: {
        marginTop: 0,
    },
    label: {
        fontSize: 16,
    },
} );
