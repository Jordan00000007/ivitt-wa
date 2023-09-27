import styled, { CSSProperties } from 'styled-components';


const Tag = styled.div`
  display: inline-block;
  width: fit-content;
  min-width: 36px;
  height: 24px;
  padding: 0px 12px;
  margin-right: 10px;
  border-radius: 4px;
  text-align: center;

  &.blue {
    color: ${props => props.theme.color.vivid_1};
    border: 1px solid ${props => props.theme.color.vivid_1};
    background: #57B8FF14;
 
  }

  &.green {
    color: ${props => props.theme.color.vivid_3};
    border: 1px solid ${props => props.theme.color.vivid_3};
    background: #21D59B14;
  }

`;

const Text = styled.div`
  font-size: ${props => props.theme.typography.body2};
`

type TagProps = {
  text: string;
  className: string;
  style?: CSSProperties;
};

const ProjectTag = (props: TagProps) => {
  const { className, text, style } = props;
  return (
    <Tag className={className} style={style}>
      <Text>{text}</Text>
    </Tag>
  );
};

export default ProjectTag;