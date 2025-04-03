import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gatewayApi } from '../../api/gateway.api';

type RoadmapStep = {
    milestone_name: string;
    skills: string[];
};

export const Roadmap = () => {
    const [milestones, setMilestones] = useState<RoadmapStep[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchRoadmap = async () => {
        setLoading(true);
        try {
            const { data } = await gatewayApi.get('/roadmap');
            const titles = data?.summarizedMilestones || [];

            // placeholder skills – תוכל להחליף את זה בהמשך בשדה אמיתי
            const fakeSteps: RoadmapStep[] = titles.map((title: string) => ({
                milestone_name: title,
                skills: ['Skill A', 'Skill B'],
            }));

            setMilestones(fakeSteps);
        } catch (error) {
            console.error('Failed to fetch roadmap', error);
        } finally {
            setLoading(false);
        }
    };

    const regenerate = async () => {
        try {
            await gatewayApi.post('/roadmap/generate');
            fetchRoadmap();
        } catch (error) {
            console.error('Failed to regenerate roadmap', error);
        }
    };

    useEffect(() => {
        fetchRoadmap();
    }, []);

    return (
        <Box p={4} width="100%">
            <Typography variant="h4" mb={3} fontWeight="bold" textAlign="center">
                Your Career Roadmap
            </Typography>

            {loading ? (
                <Stack alignItems="center">
                    <CircularProgress />
                </Stack>
            ) : (
                <Box
                    display="flex"
                    gap={4}
                    overflow="auto"
                    py={3}
                    px={1}
                    sx={{ whiteSpace: 'nowrap' }}
                >
                    {milestones.map((step, index) => (
                        <Box
                            key={index}
                            textAlign="center"
                            minWidth={160}
                            p={2}
                            border="2px solid white"
                            borderRadius="50%"
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            sx={{ background: 'rgba(255,255,255,0.05)' }}
                        >
                            <Typography fontWeight="bold">{step.milestone_name}</Typography>
                            <Typography variant="body2" mt={1}>
                                {step.skills.join(', ')}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            )}

            <Stack alignItems="center" mt={4}>
                <Button variant="outlined" onClick={regenerate}>
                    Regenerate Roadmap
                </Button>
            </Stack>
        </Box>
    );
};
