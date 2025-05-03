import { Avatar, Box, Button, Typography } from '@mui/material';

type SuggestionProfile = {
    fullName: string;
    headline: string;
    profilePicture: string;
    profileURL: string;
    username: string;
};

type SuggestionCardProperties = {
    profile: SuggestionProfile;
    onViewRoadmap: () => void;
};

export const SuggestionCard = ({ profile, onViewRoadmap }: SuggestionCardProperties) => (
    <Box
        component="a"
        href={profile.profileURL}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
            width: 220,
            height: 220,
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.10)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'inherit',
            p: 2,
            transition: 'all 0.25s ease',
            '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.28)',
            },
        }}
    >
        <Avatar
            src={profile.profilePicture}
            alt={profile.fullName}
            sx={{ width: 58, height: 58, mt: 1 }}
        />

        <Box textAlign="center" px={1}>
            <Typography fontWeight="bold" fontSize="0.9rem">
                {profile.fullName}
            </Typography>
            <Typography fontSize="0.75rem" color="text.secondary">
                {profile.headline}
            </Typography>
        </Box>

        <Button
            variant="contained"
            size="small"
            onClick={(event) => {
                event.preventDefault();
                onViewRoadmap();
            }}
            sx={{
                mb: 1,
                borderRadius: 999,
                px: 2,
                py: 0.3,
                fontSize: '0.75rem',
                fontWeight: 'bold',
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: '#fff',
                backdropFilter: 'blur(3px)',
                textTransform: 'none',
                '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.3)',
                },
            }}
        >
            View Roadmap
        </Button>
    </Box>
);
