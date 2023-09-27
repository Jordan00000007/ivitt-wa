import KeyboardArrowLeftSharpIcon from '@mui/icons-material/KeyboardArrowLeftSharp';
import styled from 'styled-components';


type ArrowIconProps = {
  hovered: string;
  direction: string
};

export const SliderArrow = styled(KeyboardArrowLeftSharpIcon) <{ direction: string, hovered: string }> `
  stroke-width: 0.3;
  stroke: ${props => props.theme.color.base_3};
  color:${({ hovered, ...props }) => (hovered === "true" ? props.theme.color.onColor_1 : props.theme.color.onColor_2)};
  transform: ${({ direction }) => (direction === "right" ? "rotate(180deg)" : "")};
`;


const ArrowIcon = (props: ArrowIconProps) => {
  const { hovered, direction } = props;


  return (
    <SliderArrow direction={direction} hovered={hovered} />
  );
};

export default ArrowIcon;  
