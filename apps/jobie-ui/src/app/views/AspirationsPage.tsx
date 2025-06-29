import { SimilarProfile } from '@jobie/linkedin/types';
import { RoadmapMilestone, TRoadmap } from '@jobie/roadmap/types';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { milestoneMangementApi } from '../../api/milestone-management.api';
import { roadmapCalibrationApi } from '../../api/roadmap-calibration.api';
import { useAuthStore } from '../auth/store/auth.store';
import { useIsMobile } from '../hooks/use-is-mobile';
import { ConfirmModal } from './components/ConfirmModal';
import { RoadmapModal } from './components/RoadmapModal';
import { SuggestionCard } from './components/SuggestionCard';
import { UserProfileCard } from './components/UserProfileCard';

export const AspirationsPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user, refreshUserData } = useAuthStore();

  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedProfile, setSelectedProfile] = useState<SimilarProfile>();
  const [selectedRoadmap, setSelectedRoadmap] = useState<TRoadmap>();
  const [openRoadmapModal, setOpenRoadmapModal] = useState(false);

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedTargetUrl, setSelectedTargetUrl] = useState<
    string | undefined
  >();

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        const { data } = await roadmapCalibrationApi.post(
          '/suggest-aspirations',
          {
            maxResults: 4,
          }
        );
        setSuggestions(Array.isArray(data?.profiles) ? data.profiles : []);
      } catch (error) {
        console.error('Fallback fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [user?.aspirationalLinkedinUrl]);

  if (loading) {
    return <CircularProgress />;
  } else if (!suggestions?.length) {
    return <Typography>Missing suggestions. Please restart setup.</Typography>;
  }

  const handleViewRoadmap = (profile: SimilarProfile) => {
    setSelectedProfile(profile);
    setOpenRoadmapModal(true);
  };

  const handleSelectRoadmap = (selectedRoadmap?: TRoadmap) => {
    if (selectedProfile && selectedRoadmap) {
      setSelectedTargetUrl(selectedProfile.profileURL);
      setSelectedRoadmap(selectedRoadmap);
      setConfirmModalOpen(true);
    }
  };

  const handleConfirmSelection = async () => {
    if (!selectedRoadmap) return;

    const fullRoadmap = {
      goalJob: selectedProfile?.headline || '',
      milestones: selectedRoadmap.milestones.map(
        (m: RoadmapMilestone, index: number) => ({
          _id: crypto.randomUUID(),
          milestoneName: m.milestoneName,
          skills: m.skills ?? [],
          status: index < 3 ? 'active' : 'summary',
        })
      ),
    };

    try {
      await Promise.all([
        roadmapCalibrationApi.post('/select', {
          roadmap: fullRoadmap,
          aspirationalLinkedinUrl: selectedTargetUrl,
        }),
        milestoneMangementApi.post(
          '/initial-generate',
          fullRoadmap.milestones.slice(0, 3)
        ),
      ]);

      await refreshUserData();

      navigate('/roadmap');
    } catch (error) {
      console.error('Failed to confirm and save roadmap', error);
    }
  };

  return (
    <Box
      p={4}
      width="100%"
      height={isMobile ? '90dvh' : '100%'}
      overflow="auto"
    >
      <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
        We found people similar to your dream role...
      </Typography>

      {!isMobile && (
        <Stack mb={6} justifyContent="center" alignItems="center">
          <UserProfileCard />
        </Stack>
      )}

      <Stack
        flexWrap="wrap"
        direction={isMobile ? 'column' : 'row'}
        gap={4}
        alignItems="center"
        justifyContent="center"
      >
        {isMobile && <UserProfileCard />}
        {suggestions.map((profile: SimilarProfile, index: number) => (
          <SuggestionCard
            key={index}
            profile={profile}
            isTargetRole={index === 0} //  Only first one
            onViewRoadmap={() => handleViewRoadmap(profile)}
          />
        ))}
      </Stack>

      {selectedProfile && (
        <RoadmapModal
          open={openRoadmapModal}
          onClose={() => setOpenRoadmapModal(false)}
          profile={selectedProfile}
          onSelect={handleSelectRoadmap}
        />
      )}

      <ConfirmModal
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmSelection}
      />
    </Box>
  );
};
