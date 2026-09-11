import { UserProfile } from '@/types/settings';
import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

type ProfileAvatarProps = {
    profile: UserProfile;
    size?: number;
};

const ProfileAvatar = ({ profile, size = 38 }: ProfileAvatarProps) => {
    const { colors } = useTheme();
    const initials = profile.name
        .split( /\s+/ )
        .filter( Boolean )
        .slice( 0, 2 )
        .map( (part) => part[0] )
        .join( '' )
        .toUpperCase() || 'N';

    return (
        <View style={[
            styles.avatar,
            { backgroundColor: colors.primary, height: size, width: size, borderRadius: size / 2 },
        ]}>
            <Text style={[styles.initials, { color: colors.background, fontSize: size * 0.38 }]}>
                {initials}
            </Text>
        </View>
    );
};

export default memo( ProfileAvatar );

const styles = StyleSheet.create( {
    avatar: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    initials: {
        fontWeight: '800',
    },
} );
