import { useTheme } from '@/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import React, { PropsWithChildren, useCallback, useMemo, useState } from 'react';
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export type AppAlertType = 'error' | 'success' | 'warning' | 'info';

export type AppAlertButton = {
    text: string;
    variant?: 'cancel' | 'default' | 'destructive';
    onPress?: () => void | Promise<void>;
};

export type AppAlertOptions = {
    type?: AppAlertType;
    buttons?: AppAlertButton[];
};

type AlertState = {
    title: string;
    message: string;
    type: AppAlertType;
    buttons: AppAlertButton[];
} | null;

type AppAlertContextValue = {
    showAlert: (
        title: string,
        message: string,
        options?: AppAlertOptions,
    ) => void;
    dismissAlert: () => void;
};

const AppAlertContext = React.createContext<AppAlertContextValue | null>( null );

const iconByType: Record<AppAlertType, keyof typeof Ionicons.glyphMap> = {
    error: 'close-circle-outline',
    success: 'checkmark-circle-outline',
    warning: 'warning-outline',
    info: 'information-circle-outline',
};

export const AppAlertProvider = ({ children }: PropsWithChildren) => {
    const { colors } = useTheme();
    const [alert, setAlert] = useState<AlertState>( null );

    const dismissAlert = useCallback( () => setAlert( null ), [] );

    const showAlert = useCallback( (
        title: string,
        message: string,
        options: AppAlertOptions = {},
    ) => {
        setAlert( {
            title,
            message,
            type: options.type ?? 'error',
            buttons: options.buttons?.length
                ? options.buttons
                : [{ text: 'OK', variant: 'default' }],
        } );
    }, [] );

    const contextValue = useMemo(
        () => ({ showAlert, dismissAlert }),
        [dismissAlert, showAlert],
    );

    const handleButtonPress = async (button: AppAlertButton) => {
        dismissAlert();
        await button.onPress?.();
    };

    const iconColor = alert?.type === 'error'
        ? colors.alert
        : alert?.type === 'success'
            ? '#2ecc71'
            : alert?.type === 'warning'
                ? '#f5a623'
                : colors.primary;

    return (
        <AppAlertContext.Provider value={contextValue}>
            {children}
            <Modal
                visible={alert !== null}
                transparent
                animationType="fade"
                onRequestClose={dismissAlert}
            >
                {alert && (
                    <View style={styles.overlay}>
                        <View style={[styles.dialog, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <Ionicons
                                name={iconByType[alert.type]}
                                size={38}
                                color={iconColor}
                                style={styles.icon}
                            />
                            <Text style={[styles.title, { color: colors.text }]}>{alert.title}</Text>
                            <Text style={[styles.message, { color: colors.textSecondary }]}>{alert.message}</Text>
                            <View style={styles.buttons}>
                                {alert.buttons.map((button, index) => {
                                    const destructive = button.variant === 'destructive';
                                    const cancel = button.variant === 'cancel';
                                    return (
                                        <Pressable
                                            key={`${button.text}-${index}`}
                                            accessibilityRole="button"
                                            onPress={() => handleButtonPress(button)}
                                            style={[
                                                styles.button,
                                                {
                                                    backgroundColor: destructive
                                                        ? colors.alert
                                                        : cancel
                                                            ? colors.background
                                                            : colors.primary,
                                                    borderColor: colors.border,
                                                },
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.buttonText,
                                                    {
                                                        color: cancel
                                                            ? colors.textSecondary
                                                            : colors.background,
                                                    },
                                                ]}
                                            >
                                                {button.text}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        </View>
                    </View>
                )}
            </Modal>
        </AppAlertContext.Provider>
    );
};

export const useAppAlert = (): AppAlertContextValue => {
    const value = React.useContext( AppAlertContext );
    if ( !value ) throw new Error( 'useAppAlert must be used within AppAlertProvider' );
    return value;
};

const styles = StyleSheet.create( {
    overlay: {
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.68)',
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    dialog: {
        borderRadius: 18,
        borderWidth: 1,
        maxWidth: 360,
        padding: 22,
        width: '100%',
    },
    icon: {
        alignSelf: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        textAlign: 'center',
    },
    message: {
        fontSize: 15,
        lineHeight: 21,
        marginTop: 9,
        textAlign: 'center',
    },
    buttons: {
        gap: 10,
        marginTop: 22,
    },
    button: {
        alignItems: 'center',
        borderRadius: 11,
        borderWidth: 1,
        minHeight: 46,
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    buttonText: {
        fontSize: 15,
        fontWeight: '700',
    },
} );
