import Tooltip, { TooltipProps } from '@mui/material/Tooltip';
import styled from 'styled-components';


type StyledTooltipType = {
  place: "bottom-end" | "bottom-start" | "bottom" | "left-end" | "left-start" | "left" | "right-end" | "right-start" | "right" | "top-end" | "top-start" | "top";
} & TooltipProps;

const CustomTooltip = styled((props: TooltipProps) => <Tooltip classes={{ popper: props.className }} {...props} />)`
  /* text-transform: capitalize; */
  & .MuiTooltip-tooltip {
    background-color: #16272ECC;
    font-size:16px;
    font-weight: 300;
    font-family: roboto;
    padding: 10px 15px 10px 15px;
  }
  & .MuiTooltip-arrow {
    color:  #16272ECC;
  }
`;

const CardStyledTooltip = (props: StyledTooltipType) => {
  const { place, ...restProps } = props;
  return <CustomTooltip placement={place} arrow {...restProps} />
};

export default CardStyledTooltip;

// MUI官網改法 https://mui.com/material-ui/react-tooltip/#CustomizedTooltips.tsx
// const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
//   <Tooltip arrow PopperProps={{ disablePortal: true }} classes={{ popper: className }} {...props} />
// ))({
//   [`& .${tooltipClasses.arrow}`]: {
//     color: palette.base.divider3,
//   },
//   [`& .${tooltipClasses.tooltip}`]: {
//     backgroundColor: palette.base.divider3,
//   },
// });

// 期望優化為由外部參數控制顏色
//type StyleToolTipProps = TooltipProps & {
//   arrowColor: string;
//   toolTipBackgroundColor: string;
//   popperClassName?: string; !!把className改掉會無法控制顏色
// };
