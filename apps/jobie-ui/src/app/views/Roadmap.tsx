import { keyframes } from '@emotion/react';
import {
    Box,
    Button,
    CircularProgress,
    Stack,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { profileEnrichmentApi } from '../../api/profile-enrichment.api';

type RoadmapStep = {
    milestone_name: string;
    skills: string[];
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

export const Roadmap = () => {
    const [milestones, setMilestones] = useState<RoadmapStep[]>([]);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const fetchRoadmap = async () => {
        setLoading(true);
        try {
            const { data } = await profileEnrichmentApi.get('/roadmap');
            setMilestones(data?.milestonesWithSkills || []);
        } catch (error) {
            console.error('Failed to fetch roadmap', error);
        } finally {
            setLoading(false);
        }
    };

    const regenerate = async () => {
        try {
            await profileEnrichmentApi.post('/roadmap/generate');
            fetchRoadmap();
        } catch (error) {
            console.error('Failed to regenerate roadmap', error);
        }
    };

    useEffect(() => {
        fetchRoadmap();
    }, []);

    const getTransform = (index: number) => {
        if (!containerRef.current) return {};
        const container = containerRef.current;
        const child = container.children[index] as HTMLElement;
        const containerMid = container.offsetWidth / 2;
        const childMid =
            child.offsetLeft + child.offsetWidth / 2 - container.scrollLeft;

        const distance = Math.abs(containerMid - childMid);
        const maxDistance = container.offsetWidth / 2;

        const scale = 1 + (1 - distance / maxDistance) * 0.2;
        const opacity = 0.4 + (1 - distance / maxDistance) * 0.6;

        return {
            transform: `scale(${scale})`,
            opacity,
        };
    };

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
                        ref={containerRef}
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
                        {milestones.map((step, index) => {
                            const { transform, opacity } = getTransform(index) as {
                                transform: string;
                                opacity: number;
                            };

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
                                        transform,
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
                                        {step.skills.map((skill, i) => (
                                            <Box
                                                key={i}
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
