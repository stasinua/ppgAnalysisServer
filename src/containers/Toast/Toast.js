import { connect } from 'react-redux';

import Toast from '../../components/Toast/Toast';

import { closeToast_ } from '../../store/actionCreators/appServiceActions';
import {
  goToPage_,
  goToPageWithId_
} from '../../store/actionCreators/routeActions';

const mapStateToProps = state => {
  return {
    open: state.appServiceReducer.toast.open,
    keepOpen: state.appServiceReducer.toast.keepOpen,
    message: state.appServiceReducer.toast.message,
    type: state.appServiceReducer.toast.type,
    withLink: state.appServiceReducer.toast.withLink,
    withButton: state.appServiceReducer.toast.withButton,
    withIcon: state.appServiceReducer.toast.withIcon
  };
};

export default connect(
  mapStateToProps,
  {
    closeToast: () => closeToast_()
  }
)(Toast);
