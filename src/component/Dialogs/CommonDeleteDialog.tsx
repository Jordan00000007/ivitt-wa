import Dialog, { DialogProps } from '../Dialogs/Dialog';
import { safeRunFunction } from '../../utils/utils';
import { Title, ActionContainer, StyledButton, StyledButtonRed, TipText } from './commonDialogsStyle';
import { deleteIterationAPI, deleteProjectAPI } from '../../constant/API';


type APITypes = 'project' | 'iteration';

type Attribute = {
  id: string;
  name: string;
};

const APISwitch = (type: APITypes, attribute: Attribute) => {
  switch (type) {
    case 'project':
      return deleteProjectAPI(attribute.id);
    case 'iteration':
      return deleteIterationAPI(attribute.id, {
        data: {
          iteration: attribute.name
        }
      });
    default:
      break;
  }
};

type DeleteDialogProps = DialogProps & {
  APIAttribute: Attribute;
  type: APITypes;
  handleDeleteSuccess?: () => void;
  handleDeleteFail: (err: any) => void;
  handleDeleteStart?: () => void;
  handleDeleteFinally?: () => void;
};

const CommonDeleteDialog = (props: DeleteDialogProps) => {
  const { open, APIAttribute, type, handleClose, handleDeleteSuccess, handleDeleteFail,
    handleDeleteStart, handleDeleteFinally, ...restProps } = props;

  const handleCancel = () => {
    handleClose();
  };

  const handleDelete = () => {
    const apiCaller = APISwitch(type, APIAttribute);
    safeRunFunction(handleDeleteStart);
    if (apiCaller) {
      apiCaller
        .then(() => {
          safeRunFunction(handleDeleteSuccess);
        })
        .catch((err) => {
          safeRunFunction(handleDeleteFail(err));
        })
        .finally(() => {
          safeRunFunction(handleDeleteFinally);
        });
    } else {
      safeRunFunction(handleDeleteFail);
      safeRunFunction(handleDeleteFinally);
    }

    handleCancel();
  };

  return (
    <Dialog open={open} handleClose={handleClose} {...restProps}>
      <Title>{'Are you sure ?'} </Title>
      <TipText>The {APIAttribute.name} will be deleted.</TipText>
      <ActionContainer>
        <StyledButton onClick={handleCancel}>
          {'Cancel'}
        </StyledButton>
        <StyledButtonRed onClick={handleDelete}>
          {'Delete'}
        </StyledButtonRed>
      </ActionContainer>
    </Dialog>
  );
};

export default CommonDeleteDialog;
