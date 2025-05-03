import { Box, Button, CircularProgress, Modal, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { roadmapCalibrationApi } from '../../../api/roadmap-calibration.api';

type RoadmapModalProperties = {
    open: boolean;
    onClose: () => void;
    profile: any; // one suggestion
    roadmapsCache: Record<string, any>;
    setRoadmapsCache: (cache: Record<string, any>) => void;
    onSelect: () => void;
};

export const RoadmapModal = ({ open, onClose, profile, roadmapsCache, setRoadmapsCache, onSelect, }: RoadmapModalProperties) => {
    const [loading, setLoading] = useState(false);
    const [milestones, setMilestones] = useState<any[] | undefined>();

    useEffect(() => {
        const loadRoadmap = async () => {
            if (!profile) return;

            const cached = roadmapsCache[profile.profileURL];
            if (cached) {
                setMilestones(cached);
                return;
            }

            try {
                setLoading(true);
                const { data } = await roadmapCalibrationApi.post('/generate-with-target', {
                    targetUrl: profile.profileURL,
                });
                setMilestones(data.milestonesWithSkills);
                setRoadmapsCache({
                    ...roadmapsCache,
                    [profile.profileURL]: data.milestonesWithSkills,
                });
            } catch (error) {
                console.error('Failed to load roadmap', error);
            } finally {
                setLoading(false);
            }
        };

        if (open) {
            loadRoadmap();
        }
    }, [open, profile, roadmapsCache, setRoadmapsCache]);

    if (!profile) {
        return;
    }

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
                    <Stack gap={2} width="100%" alignItems="center" maxHeight="60vh" overflow="auto">
                        {milestones?.map((step, index) => (
                            <Box
                                key={index}
                                p={2}
                                bgcolor="rgba(0,0,0,0.03)"
                                borderRadius={3}
                                width="100%"
                                textAlign="center"
                            >
                                <Typography fontWeight="bold">{step.milestone_name}</Typography>
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
                    onClick={onSelect}
                >
                    Select This Roadmap
                </Button>
            </Box>
        </Modal>
    );
};
