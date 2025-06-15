import { type SimilarProfile } from '@jobie/linkedin/types';
import { RoadmapMilestone, TRoadmap } from '@jobie/roadmap/types';
import {
  Box,
  Button,
  CircularProgress,
  Modal,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { roadmapCalibrationApi } from '../../../api/roadmap-calibration.api';

type RoadmapModalProperties = {
  open: boolean;
  onClose: () => void;
  profile: SimilarProfile; // one suggestion
  onSelect: (selectedRoadmap?: TRoadmap) => void;
};

export const RoadmapModal = ({
  open,
  onClose,
  profile,
  onSelect,
}: RoadmapModalProperties) => {
  const [loading, setLoading] = useState(false);
  const [motivationLine, setMotivationLine] = useState<string>();
  const [roadmap, setRoadmap] = useState<TRoadmap>();

  useEffect(() => {
    const loadRoadmap = async () => {
      if (!profile) return;

      try {
        setLoading(true);
        const { data } = await roadmapCalibrationApi.post(
          '/generate-with-target',
          {
            targetUrl: profile.profileURL,
          }
        );

        const normalized = (data.roadmap?.milestones ?? []).map(
          (m: Omit<RoadmapMilestone, '_id' | 'status'>) => ({
            _id: crypto.randomUUID(),
            milestoneName: m.milestoneName,
            skills: m.skills ?? [],
            status: 'summary',
          })
        );

        const motivation = data.motivationLine;
        setMotivationLine(motivation);
        setRoadmap({ ...data, milestones: normalized });
      } catch (error) {
        console.error('Failed to load roadmap', error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      loadRoadmap();
    }
  }, [open, profile]);

  if (!profile) return;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          p: 4,
          maxWidth: 600,
          bgcolor: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(8px)',
          mx: 'auto',
          my: 8,
          borderRadius: 4,
          boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          outline: 'none',
        }}
      >
        <Typography variant="h6" fontWeight="bold" mb={3}>
          {profile.fullName}'s Roadmap
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : (
          <Stack
            gap={2}
            width="100%"
            alignItems="center"
            maxHeight="60vh"
            overflow="auto"
          >
            {motivationLine && (
              <Typography
                mb={2}
                px={2}
                fontStyle="italic"
                textAlign="center"
                fontSize="0.95rem"
                color="text.secondary"
              >
                {motivationLine}
              </Typography>
            )}

            {roadmap?.milestones?.map((step, index) => (
              <Box
                key={index}
                p={2}
                bgcolor="rgba(0,0,0,0.03)"
                borderRadius={3}
                width="100%"
                textAlign="center"
              >
                <Typography fontWeight="bold">{step.milestoneName}</Typography>
                <Typography fontSize="0.85rem" color="textSecondary" mt={0.5}>
                  {step.skills.join(', ')}
                </Typography>
              </Box>
            ))}
          </Stack>
        )}

        <Button
          variant="contained"
          sx={{
            mt: 4,
            borderRadius: 999,
            fontWeight: 'bold',
            backgroundColor: '#222',
            '&:hover': {
              backgroundColor: '#000',
            },
          }}
          onClick={() => onSelect(roadmap)}
        >
          Select This Roadmap
        </Button>
      </Box>
    </Modal>
  );
};
