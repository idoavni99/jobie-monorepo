import { Avatar, Box, Typography } from '@mui/material';
import { useAuth } from '../../../hooks/use-auth';

export const UserProfileCard = () => {
    const { user } = useAuth();
    if (!user) return;

    const fullName = user.linkedinFullName || `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
    const headline = user.linkedinHeadline ?? '';

    return (
        <Box
            sx={{
                width: 260,
                height: 260,
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.22)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 2,
                textAlign: 'center',
            }}
        >
            <Avatar
                src={user.linkedinProfilePictureUrl}
                alt={fullName}
                sx={{ width: 64, height: 64, mb: 1 }}
            />

            <Typography fontWeight="bold" fontSize="1rem" mb={0.5}>
                {fullName}
            </Typography>

            <Typography fontSize="0.75rem" color="text.secondary" px={2}>
                {headline}
            </Typography>
        </Box>
    );
};
