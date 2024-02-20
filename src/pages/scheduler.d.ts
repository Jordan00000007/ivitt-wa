import { FunctionComponent } from 'react';
import PropTypes, { InferProps } from 'prop-types';
import { GetAllProjectsType } from '../../constant/API';

export type DatasetPropsType = {
    handleInitData: PropTypes.func,
    datasetInfoApiCallback:  PropTypes.func,
    getIterListCallback:  PropTypes.func,
  };
 
type AutoLabelProps = InferProps<typeof DatasetPropsType>
 
const Scheduler: FunctionComponent<AutoLabelProps>;
 
export default Scheduler;