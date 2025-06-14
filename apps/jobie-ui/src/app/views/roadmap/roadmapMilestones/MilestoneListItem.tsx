import {
  Box,
  CircularProgress,
  keyframes,
  Stack,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { RoutesPaths } from '../../../enums/routes.enum';
type Properties = {
  _id: string;
  milestoneName: string;
  skills: string[];
  status: string;
  progress: number;
};

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

export const MilestoneListItem = ({
  milestoneName,
  skills,
  _id,
  status,
  progress,
}: Properties) => {
  const navigate = useNavigate();
  return (
    <Stack
      alignItems="center"
      gap={3}
      onClick={() => {
        navigate(RoutesPaths.MILESTONE.replace(':milestoneId', _id));
      }}
    >
      <Stack
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        width={240}
        height={240}
        borderRadius="50%"
        sx={{
          animation: `${fadeInUp} 0.6s ease-out`,
          animationFillMode: 'forwards',
          opacity: 0,
          backgroundColor: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(6px)',
          border: '2px solid rgba(255,255,255,0.5)',
          boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: `scale(1.1)`,
            boxShadow: '0 10px 24px rgba(0,0,0,0.25)',
          },
        }}
      >
        <CircularProgress
          variant="determinate"
          value={progress}
          size={260}
          thickness={3.5}
          sx={{
            position: 'absolute',
            color: status === 'completed' ? '#4caf50' : '#1976d2',
            opacity: 0.3,
          }}
        />
        <Typography
          fontWeight="bold"
          fontSize="1.1rem"
          color="#222"
          whiteSpace="pre-wrap"
          mb={1}
          px={2}
        >
          {milestoneName}
        </Typography>

        <Box
          display="flex"
          flexWrap="wrap"
          justifyContent="center"
          gap={1}
          px={2}
          maxWidth="90%"
        >
          {skills.map((skill, index_) => (
            <Box
              key={index_}
              px={1.2}
              py={0.3}
              fontSize="0.65rem"
              borderRadius="999px"
              bgcolor="rgba(0,0,0,0.05)"
              color="#444"
              sx={{
                lineHeight: 1.3,
                whiteSpace: 'nowrap',
              }}
            >
              {skill}
            </Box>
          ))}
        </Box>
      </Stack>
      <Box
        sx={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: '#ffffff66',
          boxShadow: '0 0 6px rgba(255,255,255,0.4)',
          zIndex: 5,
        }}
      />
    </Stack>
  );
};
