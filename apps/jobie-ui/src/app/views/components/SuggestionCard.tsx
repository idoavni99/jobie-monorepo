import { SimilarProfile } from '@jobie/linkedin/types';
import { Avatar, Box, Button, Typography } from '@mui/material';

type SuggestionCardProperties = {
  profile: SimilarProfile;
  onViewRoadmap: () => void;
  isTargetRole?: boolean;
};

export const SuggestionCard = ({
  profile,
  onViewRoadmap,
  isTargetRole,
}: SuggestionCardProperties) => (
  <Box
    component="a"
    href={profile.profileURL}
    target="_blank"
    rel="noopener noreferrer"
    sx={{
      position: 'relative',
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
    {/* Circular Arc Label */}
    {isTargetRole && (
      <svg
        width="220"
        height="220"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <defs>
          <path id="target-arc" d="M20,110 A90,90 0 0,1 200,110" fill="none" />
        </defs>
        <text
          fill="#cccccc"
          fontSize="12"
          fontWeight="bold"
          letterSpacing="1px"
          style={{
            textTransform: 'uppercase',
            filter: 'drop-shadow(0 0 1px #ffffff88)',
          }}
        >
          <textPath href="#target-arc" startOffset="50%" textAnchor="middle">
            TARGET ROLE
          </textPath>
        </text>
      </svg>
    )}

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
