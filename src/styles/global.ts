import { Platform, StyleSheet } from "react-native";

export const colors = {
    background: '#1a1a2e',
    header: '#242444',
    surface: '#2a2a4a',
    primary: '#4fc3f7',
    text: '#ffffff',
    textSecondary: '#a0a0b0',
    alert: '#ff5252',
};

export const globalStyles = StyleSheet.create( {
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: Platform.OS === 'ios' ? 60 : 20,
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    innerContainer: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.text,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textSecondary,
        marginTop: 30,
        marginBottom: 16,
    },
    empty: {
        color: colors.textSecondary,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    date: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 4,
        marginBottom: 30,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginTop: 20,
  },
} );