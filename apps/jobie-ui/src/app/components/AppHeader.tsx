import { Stack, Typography, TypographyProps } from '@mui/material';

export type AppHeaderProperties = {
  title?: string;
  titleProps?: TypographyProps;
  subTitle: string;
  subTitleProps?: TypographyProps;
};
export const AppHeader = ({
  title = 'Jobie',
  titleProps: titleProperties = {},
  subTitle,
  subTitleProps: subTitleProperties = {},
}: AppHeaderProperties) => {
  return (
    <Stack justifyContent="center" alignItems="center" gap={2}>
      <Typography variant="h1" {...titleProperties}>
        {title}
      </Typography>
      <Typography variant="h3" {...subTitleProperties}>
        {subTitle}
      </Typography>
    </Stack>
  );
};
