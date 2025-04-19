import { keyframes } from '@emotion/react';
import { TRoadmap } from '@jobie/roadmap/types';
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect } from 'react';
import { roadmapCalibrationApi } from '../../api/roadmap-calibration.api';
import { useDataFetch } from '../../hooks/use-data-fetch';
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

export const Roadmap = () => {
  const {
    loading,
    data: milestones,
    fetchData: fetchRoadmap,
  } = useDataFetch(() =>
    roadmapCalibrationApi
      .get<TRoadmap>('/')
      .then(({ data }) => data.milestonesWithSkills)
  );

  const regenerate = async () => {
    try {
      await roadmapCalibrationApi.post('/generate');
      fetchRoadmap();
    } catch (error) {
      console.error('Failed to regenerate roadmap', error);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, [fetchRoadmap]);

  return (
    <Box p={4} width="100%">
      <Typography variant="h4" mb={4} fontWeight="bold" textAlign="center">
        Your Career Roadmap
      </Typography>

      {loading ? (
        <Stack alignItems="center">
          <CircularProgress />
        </Stack>
      ) : (
        <Box position="relative" pb={12}>
          {/* Line ABOVE the scrollbar */}
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 90, // moved lower than scrollbar
              height: '2px',
              background: 'linear-gradient(to right, #ffffff33, #ffffff55)',
              zIndex: 1,
            }}
          />

          {/* Scrollable container */}
          <Box
            display="flex"
            flexDirection="row"
            overflow="auto"
            gap={6}
            px={4}
            py={5}
            sx={{
              scrollBehavior: 'smooth',
              pb: 6,
              '&::-webkit-scrollbar': {
                height: 3,
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(255,255,255,0.08)',
                borderRadius: 10,
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'transparent',
              },
            }}
          >
            {milestones?.map((step, index) => {
              return (
                <Box
                  key={index}
                  sx={{
                    animation: `${fadeInUp} 0.6s ease-out`,
                    animationDelay: `${index * 0.15}s`,
                    animationFillMode: 'forwards',
                    opacity: 0,
                    position: 'relative',
                    minWidth: 240,
                    width: 240,
                    height: 240,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.92)',
                    backdropFilter: 'blur(6px)',
                    border: '2px solid rgba(255,255,255,0.5)',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: `scale(1.1)`,
                      boxShadow: '0 10px 24px rgba(0,0,0,0.25)',
                    },
                  }}
                >
                  <Typography
                    fontWeight="bold"
                    fontSize="1.1rem"
                    color="#222"
                    mb={1}
                    px={2}
                  >
                    {step.milestone_name}
                  </Typography>

                  <Box
                    display="flex"
                    flexWrap="wrap"
                    justifyContent="center"
                    gap={1}
                    px={2}
                    maxWidth="90%"
                  >
                    {step.skills.map((skill, index_) => (
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

                  {/* Dot aligned with the line */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: -50,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: '#ffffff66',
                      boxShadow: '0 0 6px rgba(255,255,255,0.4)',
                      zIndex: 5,
                    }}
                  />
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      <Stack alignItems="center" mt={6}>
        <Button
          variant="outlined"
          onClick={regenerate}
          sx={{
            borderRadius: 999,
            px: 4,
            py: 1,
            fontWeight: 'bold',
            color: 'white',
            borderColor: 'white',
            backdropFilter: 'blur(6px)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)',
            },
          }}
        >
          Regenerate Roadmap
        </Button>
      </Stack>
    </Box>
  );
};
