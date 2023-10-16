import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import StyledTextField from './StyledTextField';
import { createTheme, ThemeProvider } from '@mui/material';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedClass } from '../../redux/store/slice/selectedClass';
import { useCallback, useEffect, useRef } from 'react';
import { useAddNewClass } from '../../pages/label/hook/useLabelPage';
import { editImgClassAPI, ResGetImgLabelType } from '../../constant/API';
import { createAlertMessage } from '../../redux/store/slice/alertMessage';
import { customAlertMessage } from '../../utils/utils';
import { closeLoading, openLoading } from '../../redux/store/slice/loading';
import { selectIdTitle } from '../../redux/store/slice/currentTitle';
import { selectLastColorId, setLastColorIdAction } from '../../redux/store/slice/lastColorId';
import { selectColorBar } from '../../redux/store/slice/colorBar';

const StyledLabel = styled.label`
  font-size: ${props => props.theme.typography.body2};
  color: ${props => props.theme.color.onColor_2};

  &.hide{
    display: none;
    visibility: hidden;
  }
`

const theme = createTheme({
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
});

const filter = createFilterOptions<ClassListType>();

declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary'];
  }

  // allow configuration using `createTheme`
  interface PaletteOptions {
    neutral?: PaletteOptions['primary'];
  }
}

// Update the Button's color prop options
declare module '@mui/material/TextField' {
  interface TextFieldPropsColorOverrides {
    neutral: true;
  }
}

export type ClassListType = {
  name: string;
  color_id?: string;
  class_id?: string;
  inputValue?: string;
  isCreate?: boolean;
  color_hex?: string;
  counts?: number;
}

type UpdateType = {
  [key: string]: string[];
};

export type CreateSearchSelectType = {
  classList: ClassListType[];
  id: string;
  dataType?: string;
  searchValue: ClassListType | null;
  setSearchValue: (value: ClassListType | null) => void;
  hideLabel?: boolean;
  labelPage?: boolean;
  hasUploadFile?: boolean;
  annotationList?: ResGetImgLabelType;
  imgName?: string;
  datasetInfoApiCallback?: (datasetId: string, isLabelPage?: boolean) => void;
  getImgLabelAPICallback?: () => void;
  setImgDataList?: (data: string[]) => void;
  setAnnotationList?: (data: ResGetImgLabelType) => void;
  imgDataList?: string[];
  currIndex?: number;
}

export default function CreateSearchSelect(props: CreateSearchSelectType) {
  const { currIndex, setImgDataList, classList, id, searchValue, setSearchValue, hideLabel, labelPage, hasUploadFile, datasetInfoApiCallback, getImgLabelAPICallback, dataType, annotationList, imgName, setAnnotationList, imgDataList } = props;
  const dispatch = useDispatch();
  const lastColorId = useSelector(selectLastColorId).lastColorId;
  const colorBar = useSelector(selectColorBar).colorBar;
  const { addClassAPICallback, updateList } = useAddNewClass(id, classList);
  const allIdTitle = useSelector(selectIdTitle).idTitle;
  const createNewRef = useRef<any | null>(null);

  const countColorId = lastColorId === '' ? 0 : Number(lastColorId) + 1;

  const handelAddClass = useCallback((newClass: string) => {
    //是在labelPage才直接打addClass API+拉資料
    if (labelPage) {

      console.log('--- add class countColorId ---')
      console.log(countColorId)

      addClassAPICallback(newClass, countColorId)
        .then((res) => {
          if (res && datasetInfoApiCallback !== undefined) {
            console.log('--- add class ---')
            console.log(newClass)
            console.log('--- response ---')
            console.log(res)
            datasetInfoApiCallback(id, true);
            dispatch(setLastColorIdAction(String(countColorId)))
          }
        })
    } else {
      if (hasUploadFile) {
        console.log('--- hasUploadFile ---')
        console.log(newClass)
        console.log(Number(countColorId))
        addClassAPICallback(newClass, Number(countColorId))
        .then((res) => {
          if (res && datasetInfoApiCallback !== undefined) {
            console.log('--- add class ---')
            console.log(newClass)
            console.log('--- response ---')
            console.log(res)
            datasetInfoApiCallback(id, true);
            dispatch(setLastColorIdAction(String(countColorId)))
          }
        })

        //addClassAPICallback(newClass, Number(countColorId));
        dispatch(setLastColorIdAction(String(countColorId)))

      } else {

        addClassAPICallback(newClass, Number(countColorId))
        .then((res) => {
          if (res && datasetInfoApiCallback !== undefined) {
            console.log('--- add class ---')
            console.log(newClass)
            console.log('--- response ---')
            console.log(res)
            datasetInfoApiCallback(id, true);
            dispatch(setLastColorIdAction(String(countColorId)))
          }
        })

        dispatch(setLastColorIdAction(String(countColorId)))
        updateList(newClass, countColorId)
      }
    }
  }, [addClassAPICallback, countColorId, datasetInfoApiCallback, dispatch, hasUploadFile, id, labelPage, updateList])

  const renewData = useCallback((selectValue: string) => {
    if (datasetInfoApiCallback !== undefined && getImgLabelAPICallback !== undefined) {
      datasetInfoApiCallback(id, true);

      setTimeout((() => {
        //因為object的path不會變，可以直接重拉getImgLabelAPICallback
        if (dataType === 'object_detection') {
          getImgLabelAPICallback();
        }

        if (dataType === 'classification' && setAnnotationList && currIndex !== undefined && imgDataList && setImgDataList) {
          const tempLabel: ResGetImgLabelType = {};
          if (searchValue) {
            const pickColorId = searchValue.color_id ? Number(searchValue.color_id) : countColorId;
            tempLabel[selectValue] = {
              color_id: pickColorId,
              color_hex: colorBar[pickColorId],
              nums: 1
            }

            setAnnotationList(tempLabel)
          }
          const newImgList = imgDataList;
          newImgList.splice(currIndex, 1, `project/${allIdTitle[id]}/workspace/${selectValue}/${imgName}`);
          setImgDataList(newImgList)
        }
      }), 500)


    }
  }, [allIdTitle, colorBar, countColorId, currIndex, dataType, datasetInfoApiCallback, getImgLabelAPICallback, id, imgDataList, imgName, searchValue, setAnnotationList, setImgDataList])

  const handelAddImgClass = useCallback((cls: string, selectValue: string, imgName: string) => {
    const imgInfo: UpdateType = {};
    dispatch(openLoading());
    if (imgName !== undefined) {
      imgInfo[cls] = [imgName];
      const postData = {
        images_info: imgInfo,
        class_name: selectValue
      }
      editImgClassAPI(id, postData)
        .then(({ data }) => {
          renewData(selectValue);
        })
        .catch(({ response }) => {
          console.log('editImgClassAPI-Err', response);
          dispatch(closeLoading())
          setSearchValue(null)
          dispatch(createAlertMessage(customAlertMessage('error', 'Edit img class failed')))
        })
    }
  }, [dispatch, id, renewData, setSearchValue])


  useEffect(() => {
    if (dataType === 'object_detection' && labelPage === true && classList.length > 0 && createNewRef.current === null) {
      setSearchValue({
        class_id: classList[0].class_id,
        name: classList[0].name,
        color_id: classList[0].color_id
      })
    }

    return () => {
      //要清掉redux
      dispatch(setSelectedClass(''))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataType, labelPage, setSearchValue]);

  useEffect(() => {
    if (dataType === 'classification') setSearchValue(null);
  }, [currIndex, dataType, setSearchValue]);


  useEffect(() => {
    if (dataType !== 'classification' || !imgName || !annotationList) return;

    if (Object.keys(annotationList).length !== 0) {
      const annotationClass = Object.keys(annotationList)[0];
      if (searchValue?.name && searchValue?.name !== annotationClass) {
        handelAddImgClass(annotationClass, searchValue.name, imgName)
      }
    }

    if (Object.keys(annotationList).length === 0) {
      if (searchValue?.name) handelAddImgClass('Unlabeled', searchValue.name, imgName)
    }

  }, [annotationList, dataType, handelAddImgClass, imgName, searchValue?.name]);


  return (
    <div style={{ height: '77px', marginBottom: '16px' }}>
      <StyledLabel className={hideLabel ? 'hide' : ''} htmlFor="explicit-label-name">Assign class</StyledLabel>
      <Autocomplete
        value={searchValue}
        onChange={(event, newValue) => {

          if (typeof newValue === 'string') {
            // 需判斷typeof newValue而已
          } else if (newValue && newValue.isCreate && newValue.inputValue) {
            // Create a new value from the user input
            createNewRef.current = true;
            handelAddClass(newValue.inputValue)
            setSearchValue({
              name: newValue.inputValue,
              color_id: String(countColorId),
              color_hex: colorBar[countColorId],
              counts: 1
            });
          } else {
            //讓redux資料設為目前顯示的value
            dispatch(setSelectedClass(newValue?.name))
            setSearchValue(newValue);
          }

        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);
          const { inputValue } = params;

          // Suggest the creation of a new value
          const isExisting = options.some((option) => inputValue === option.name);
          if (inputValue !== '' && !isExisting) {
            const createdItem = ([{ inputValue, name: `${inputValue} `, isCreate: true }] as ClassListType[]).concat(classList);
            return createdItem;
          }
          return filtered;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        options={classList}
        getOptionLabel={(option) => {
          // Value selected with enter, right from the input
          if (typeof option === 'string') {
            return option;
          }
          // Add "xxx" option created dynamically
          if (option.inputValue) {
            return option.inputValue;
          }
          // Regular option
          return option.name;
        }}
        renderOption={(props, option) => {
          if (option.isCreate) {
            return <li style={{ display: 'block' }} {...props}>
              <div style={{ display: 'inline-block', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {option.name}
              </div>
              <span style={{ float: 'right', color: 'red', marginRight: '2%' }}>
                create
              </span>
            </li>;
          }
          return <li {...props}>{option.name}</li>;
        }}
        sx={{
          width: '100%', backgroundColor: '#fafafd'
        }}
        freeSolo
        forcePopupIcon
        renderInput={(params) => (
          <ThemeProvider theme={theme}>
            <StyledTextField placeholder="-- Please select or type --" {...params} label="" />
          </ThemeProvider>
        )}
      />
    </div>
  );
}

// 原資料範例Top 100 films
// export const top100Films: ClassListType[] = [
//   { name: 'The Godfather', year: 1972 },
//   { name: 'The Dark Knight', year: 2008 },
//   { name: '12 Angry Men', year: 1957 },
//   { name: "Schindler's List", year: 1993 },
//   { name: 'Pulp Fiction', year: 1994 },
// ];
