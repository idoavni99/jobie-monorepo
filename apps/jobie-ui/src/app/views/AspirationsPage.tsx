import { TRoadmap } from '@jobie/roadmap/types';
import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { roadmapCalibrationApi } from '../../api/roadmap-calibration.api';
import { useAuthStore } from '../auth/store/auth.store';
import { ConfirmModal } from './components/ConfirmModal';
import { RoadmapModal } from './components/RoadmapModal';
import { SuggestionCard } from './components/SuggestionCard';
import { UserProfileCard } from './components/UserProfileCard';

export const AspirationsPage = () => {
  const navigate = useNavigate();
  const { user, refreshUserData } = useAuthStore(); // fallback to fetch from DB

  // const { suggestions: navSuggestions, aspirationalLinkedinUrl: navUrl } = location.state || {};

  const [suggestions, setSuggestions] = useState([]);
  const [aspirationalLinkedinUrl, setAspirationalLinkedinUrl] = useState<
    string | undefined
  >();
  const [loading, setLoading] = useState(false);

  const [selectedProfile, setSelectedProfile] = useState<any>();
  const [openRoadmapModal, setOpenRoadmapModal] = useState(false);
  const [roadmapsCache, setRoadmapsCache] = useState<Record<string, TRoadmap>>(
    {}
  );

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedTargetUrl, setSelectedTargetUrl] = useState<
    string | undefined
  >();
  useEffect(() => {
    const checkRoadmapExists = async () => {
      try {
        const { data } = await roadmapCalibrationApi.get('/');
        if (data?.isApproved) {
          navigate('/roadmap');
        }
      } catch (error) {
        console.error('Error checking existing roadmap:', error);
      }
    };

    checkRoadmapExists();
  }, [navigate]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (user?.aspirationalLinkedinUrl) {
        try {
          setLoading(true);
          const { data } = await roadmapCalibrationApi.post(
            '/suggest-aspirations',
            {
              targetUrl: user.aspirationalLinkedinUrl,
              maxResults: 4,
            }
          );
          setSuggestions(Array.isArray(data?.profiles) ? data.profiles : []);
          setAspirationalLinkedinUrl(user.aspirationalLinkedinUrl);
        } catch (error) {
          console.error('Fallback fetch failed:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSuggestions();
  }, [user?.aspirationalLinkedinUrl]);

  if (!suggestions || !aspirationalLinkedinUrl) {
    return loading ? (
      <Typography>Loading suggestions...</Typography>
    ) : (
      <Typography>Missing suggestions. Please restart setup.</Typography>
    );
  }

  const handleViewRoadmap = (profile: any) => {
    setSelectedProfile(profile);
    setOpenRoadmapModal(true);
  };

  const handleSelectRoadmap = () => {
    if (selectedProfile) {
      setSelectedTargetUrl(selectedProfile.profileURL);
      setConfirmModalOpen(true);
    }
  };

  const handleConfirmSelection = async () => {
    if (!selectedTargetUrl) return;

    const rawRoadmap = roadmapsCache[selectedTargetUrl];
    if (!rawRoadmap || !Array.isArray(rawRoadmap.milestones)) {
      console.error('No valid roadmap data found in cache for selected URL');
      return;
    }
    const fullRoadmap = {
      goalJob: selectedProfile?.headline || '',
      milestones: rawRoadmap.milestones.map((m: any, index: number) => ({
        /////changed this
        _id: crypto.randomUUID(),
        milestoneName: m.milestoneName,
        skills: m.skills ?? [],
        status: index < 3 ? 'active' : 'summary',
      })),
    };

    try {
      await roadmapCalibrationApi.post('/select', {
        roadmap: fullRoadmap,
        aspirationalLinkedinUrl: selectedTargetUrl,
      });

      await refreshUserData();

      navigate('/roadmap');
    } catch (error) {
      console.error('Failed to confirm and save roadmap', error);
    }
  };

  return (
    <Box p={4} width="100%">
      <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
        We found people similar to your dream role...
      </Typography>

      <Box display="flex" justifyContent="center" mb={6}>
        <UserProfileCard />
      </Box>

      <Box display="flex" flexWrap="wrap" gap={4} justifyContent="center">
        {suggestions.map((profile: any, index: number) => (
          <SuggestionCard
            key={index}
            profile={profile}
            isTargetRole={index === 0} //  Only first one
            onViewRoadmap={() => handleViewRoadmap(profile)}
          />
        ))}
      </Box>

      {selectedProfile && (
        <RoadmapModal
          open={openRoadmapModal}
          onClose={() => setOpenRoadmapModal(false)}
          profile={selectedProfile}
          roadmapsCache={roadmapsCache}
          setRoadmapsCache={setRoadmapsCache}
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
