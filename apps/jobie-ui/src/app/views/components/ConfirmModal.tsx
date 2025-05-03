import { Box, Button, CircularProgress, Modal, Stack, Typography } from '@mui/material';
import { useState } from 'react';

type ConfirmModalProperties = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
};

export const ConfirmModal = ({ open, onClose, onConfirm }: ConfirmModalProperties) => {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        try {
            setLoading(true);
            await onConfirm();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={loading ? undefined : onClose}>
            <Box
                sx={{
                    p: 4,
                    maxWidth: 400,
                    bgcolor: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(8px)',
                    mx: 'auto',
                    my: 16,
                    borderRadius: 4,
                    boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    outline: 'none',
                }}
            >
                <Typography variant="h6" fontWeight="bold" mb={2}>
                    Are you sure?
                </Typography>

                <Typography fontSize="0.9rem" textAlign="center" mb={4}>
                    Once you pick this roadmap, you cannot change it later.
                </Typography>

                <Stack direction="row" spacing={2}>
                    <Button
                        variant="contained"
                        sx={{ borderRadius: 999, minWidth: 140 }}
                        onClick={handleConfirm}
                        disabled={loading}
                    >
                        {loading ? (
                            <CircularProgress size={20} color="inherit" />
                        ) : (
                            'Yes, Select'
                        )}
                    </Button>
                    <Button
                        variant="outlined"
                        sx={{ borderRadius: 999 }}
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                </Stack>
            </Box>
        </Modal>
    );
};
