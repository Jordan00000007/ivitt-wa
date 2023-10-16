import { useContext } from 'react';
import styled from 'styled-components';
import DatasetSelectBtn from '../../../component/Buttons/DatasetSelectBtn';
import { MainContext } from '../../Main';
import { selectCardClassType } from '../Dataset';
import { useSelector } from 'react-redux';
import { selectDisableBtn } from '../../../redux/store/slice/disableBtn';


const SelectContainer = styled.div`
  width: 670px;
  margin-bottom: 4px;
  display: flex;
`;

type CountNumber = {
  total: number,
  unlabeled: number,
}

type NoSliderCardProps = {
  setImgDataList: (data: string[]) => void;
  currentClass: selectCardClassType;
  setCurrentClass: (data: selectCardClassType) => void;
  countNumber: CountNumber;
};


const NoSliderCard = (props: NoSliderCardProps) => {
  const { activeClassName, setActiveClassName } = useContext(MainContext);
  const disableBtn = useSelector(selectDisableBtn).disableBtn;
  const { countNumber, currentClass } = props;

  return (
    <SelectContainer>
      <DatasetSelectBtn
        isSlider={false}
        text={'All'}
        number={countNumber.total}
        active={activeClassName === 'All'}
        activeClassName={'All'}
        onClick={() => setActiveClassName('All')}
        disabled={activeClassName !== 'Unlabeled' && disableBtn}
      />
      {countNumber.unlabeled > 0 ?
        <DatasetSelectBtn
          isSlider={false}
          text={'Unlabeled'}
          number={countNumber.unlabeled}
          active={activeClassName === 'Unlabeled'}
          activeClassName={'Unlabeled'}
          onClick={() => setActiveClassName('Unlabeled')}
        /> : null
      }

      {Object.keys(currentClass).map((item, index) => (
        <DatasetSelectBtn
          isSlider={false}
          key={item + index}
          text={item}
          number={currentClass[item]}
          active={activeClassName === item}
          activeClassName={activeClassName}
          onClick={() => setActiveClassName(item)}
          disabled={disableBtn && activeClassName !== item}
        />
      ))}
    </SelectContainer>
  );
};

export default NoSliderCard;

