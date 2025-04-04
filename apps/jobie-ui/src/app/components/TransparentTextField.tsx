import { styled, TextField } from '@mui/material';

export const TransparentTextField = styled(TextField)(() => ({
  '& input': {
    padding: '0.75rem 1rem',
    color: '#ffffff',
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '0.875rem',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255,255,255,0.2)',
  },
  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#6D8CFF',
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: '13px',
  },
}));
