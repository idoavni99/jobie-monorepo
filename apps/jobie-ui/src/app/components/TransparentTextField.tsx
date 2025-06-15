import { styled, TextField } from '@mui/material';

export const TransparentTextField = styled(TextField)(() => ({
  '& input': {
    padding: '0.75rem 1rem',
    color: '#ffffff',
  },
  '& .MuiInputLabel-root': {
    color: 'rgb(29, 46, 105)',
    fontSize: '0.875rem',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255,255,255,0.2)',
  },
  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgb(60, 81, 156)',
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: '13px',
  },
}));
