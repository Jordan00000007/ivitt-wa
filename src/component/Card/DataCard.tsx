import styled from 'styled-components';

const Card = styled.div`
  width: 119px;
  height: 70px;
  border: 1px solid ${props => props.theme.color.dataCardBorder};
  margin-top: 6px;
  border-radius: 4px;
  padding: 6px 10px; 
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const DataCardTitle = styled.div`
  font-size: ${props => props.theme.typography.caption};
  color: ${props => props.theme.color.onColor_2};
`;

const Data = styled.div`
  display: flex;
  justify-content: center;
  font-size: ${props => props.theme.typography.h3};
  color: ${props => props.theme.color.onColor_1};
  font-weight: 500;
`;


type DataCardProps = {
  title: string;
  singleNumber: boolean;
  dataset1?: number | string;
  dataset2?: number | string;
  model?: number;
};

const DataCard = (props: DataCardProps) => {

  const { title, singleNumber, dataset1, dataset2, model } = props;
  return (
    <>
      <Card>
        <DataCardTitle>{title}</DataCardTitle>
        {
          singleNumber ? <Data>{model}</Data> : <Data>{dataset1}/{dataset2}</Data>
        }
      </Card>
    </>
  );
};

export default DataCard;