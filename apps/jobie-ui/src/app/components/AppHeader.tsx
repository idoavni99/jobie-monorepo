import { keyframes } from '@emotion/react';
import { Typography, TypographyProps } from '@mui/material';

export type AppHeaderProperties = {
  title?: string;
  titleProps?: TypographyProps;
  subTitle?: string;
  subTitleProps?: TypographyProps;
};

const fadeRise = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const AppHeader = ({
  title = 'Jobie',
  titleProps: titleProperties = {},
}: AppHeaderProperties) => {
  return (
    <Typography
      variant="h1"
      {...titleProperties}
      sx={{
        fontWeight: 750,
        color: '#f5f5f5',
        textShadow: '0 4px 14px rgba(0,0,0,0.4)',
        animation: `${fadeRise} 1s ease forwards`,
        ...titleProperties.sx,
      }}
    >
      {title}
    </Typography>
  );
};
