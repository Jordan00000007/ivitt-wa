import { CSSProperties, InputHTMLAttributes, ReactElement, ReactNode } from 'react';
import styled from 'styled-components';
import StyledTooltip from '../Tooltip';

export const InfoIconDiv = styled.div <{ isTooltip: boolean }>`
  display: inline-block;
  width:18px;
  height:18px;
  color: ${props => props.theme.color.divider};
  margin-left: 4px;
  cursor: ${props => props.isTooltip ? 'pointer' : 'default'};
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: relative;
`;

const StyledLabel = styled.label`
  font-size: ${props => props.theme.typography.body2};
  color: ${props => props.theme.color.onColor_2};
`;

const StyledInput = styled.input<{ error: boolean }>`
  font-size: ${props => props.theme.typography.body1};
  color: ${props => props.theme.color.onColor_1};
  width: 100%;
  height: 52px;
  border-radius: 6px;
  background-color: ${props => props.theme.color.base_1};
  padding: 16px;
  outline: none;
  border: 1px solid ${(props) => (props.error ? '#B00020' : '#979CB580')};

  &:focus-within {
    border: 1px solid ${(props) => (props.error ? '#B00020' : props.theme.color.onColor_2)};
  }

  &:disabled {
    color: ${props => props.theme.color.onColor_2};
  }

  &:focus::placeholder {
    color: #cccdd3;
  }

  &::placeholder {
    letter-spacing: 0;
    font-family: inherit;
    -webkit-text-fill-color: #cccdd3;
  }
`;


type InputProps = {
  error?: boolean;
  startElement?: ReactNode;
  endElement?: ReactNode;
  inputStyle?: CSSProperties;
  labelName?: string;
  labelTooltipText?: string;
  labelIcon?: ReactElement;
} & InputHTMLAttributes<HTMLInputElement>;



const InputTextField = (props: InputProps) => {
  const { labelName, style, className, error = false, startElement, endElement, inputStyle, labelTooltipText, labelIcon, ...otherProps } = props;

  const checkLabelStyle = () => {
    if (labelIcon !== undefined) {
      return (
        <InfoIconDiv isTooltip={true}>
          <StyledTooltip place='right' title={labelTooltipText ? labelTooltipText : ''}>
            {labelIcon}
          </StyledTooltip>
        </InfoIconDiv>
      )
    }
  }



  return (
    <InputWrapper style={style}>
      <>
        <StyledLabel htmlFor="explicit-label-name">{labelName}
          {checkLabelStyle()}
        </StyledLabel>
        {startElement}
        <StyledInput style={inputStyle} type="code" id="explicit-label-name" name="name" autoComplete="off" error={error} {...otherProps} />
        {endElement}
      </>
    </InputWrapper>

  );
};

export default InputTextField;          
