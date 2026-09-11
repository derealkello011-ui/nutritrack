import { deleteMeal } from '@/storage/meals';
import { useTheme } from '@/theme/ThemeProvider';
import * as Haptics from 'expo-haptics';
import React, { memo, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

export type MealItemProps = {
    id: string,
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    onDelete: () => void;
};

const MealItem = ( {
    id,
    name,
    calories,
    protein,
    carbs,
    fat,
    onDelete,
}: MealItemProps ) => {
    const { colors: themeColors } = useTheme();
    const translateX = useSharedValue( 0 );

    const handleDelete = useCallback( async () => {
        await deleteMeal( id );
        Haptics.notificationAsync( Haptics.NotificationFeedbackType.Success );
        onDelete();
    }, [id, onDelete]);

    const gesture = Gesture.Pan()
        .activeOffsetX( [-10, 10] )
        .failOffsetY( [-10, 10] )
        .onUpdate( (event) => {
            translateX.value = Math.min( 0, event.translationX );
        } )
        .onEnd( () => {
            if ( translateX.value < -110 ) {
                translateX.value = withTiming( -420, { duration: 180 }, (finished) => {
                    if ( finished ) runOnJS( handleDelete )();
                } );
            } else {
                translateX.value = withSpring( 0 );
            }
        } );

    const animatedStyle = useAnimatedStyle( () => ({
        transform: [{ translateX: translateX.value }],
    }) );

    return (
        <View style={styles.swipeContainer}>
            <View style={[styles.deleteBackground, { backgroundColor: themeColors.alert }]}>
                <Text style={[styles.deleteText, { color: themeColors.text }]}>Delete</Text>
            </View>
            <GestureDetector gesture={gesture}>
                <Animated.View style={animatedStyle}>
                    <View style={[styles.container, { backgroundColor: themeColors.surface }]}>
                        <Text style={[styles.name, { color: themeColors.text }]}>{name}</Text>
                        <Text style={[styles.macros, { color: themeColors.textSecondary }]}>
                            {calories} cal ° {protein}g P ° {carbs}g C ° {fat}g F
                        </Text>
                    </View>
                </Animated.View>
            </GestureDetector>
        </View>
    );
};

export default memo( MealItem );

const styles = StyleSheet.create( {
    swipeContainer: {
        borderRadius: 10,
        marginBottom: 10,
        overflow: 'hidden',
    },
    deleteBackground: {
        alignItems: 'flex-end',
        backgroundColor: '#ff5252',
        bottom: 0,
        justifyContent: 'center',
        paddingHorizontal: 20,
        position: 'absolute',
        top: 0,
        width: '100%',
    },
    deleteText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '700',
    },
    container: {
        backgroundColor: '#16213e',
        borderRadius: 10,
        padding: 16,
    },
    name: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    macros: {
        color: '#a0a0b0',
        fontSize: 13,
        marginTop: 4,
    },
} );
