import { useWindowSize } from '@uidotdev/usehooks';
import { useIsMobile } from '../app/hooks/use-is-mobile';

export const NAV_DRAWER_WIDTH = 240;
export const NAV_DRAWER_PADDING = 120;

export const useNavDrawerSpacing = () => {
  const webContainerWidth = useWindowSize().width ?? globalThis.outerWidth;
  const isMobile = useIsMobile();

  const spaceFromWindow = isMobile
    ? '100%'
    : webContainerWidth - (NAV_DRAWER_WIDTH + NAV_DRAWER_PADDING);
  const spaceFromContainer = isMobile
    ? '100%'
    : `calc(100% - ${NAV_DRAWER_PADDING + NAV_DRAWER_WIDTH}px)`;
  const containerPadding = isMobile
    ? { paddingInline: `${NAV_DRAWER_PADDING / 2}px` }
    : { paddingInlineStart: `${NAV_DRAWER_PADDING}px` };

  return { spaceFromContainer, spaceFromWindow, containerPadding };
};
