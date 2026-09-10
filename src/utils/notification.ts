import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler( {
    handleNotification: async () => ( {
        shouldShowAlert: true,
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    } ),
} );

export const requestPermissions = async (): Promise<boolean> => {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
};

export const scheduleMealReminders = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync( {
        content: {
            title: 'd3r3al Track',
            body: "Don't forget to log your lunch!",
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: 12,
            minute: 0,
        },
    } );

    await Notifications.scheduleNotificationAsync( {
        content: {
            title: "NutriTrack",
            body: "Time to log your dinner!",
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: 18,
            minute: 0,
        },
    } );

    await Notifications.scheduleNotificationAsync( {
        content: {
            title: "d3r3al Track",
            body: "Time to log your breakfast!",
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: 8,
            minute: 30,
        },
    } );
};

export const cancelMealReminders = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
}