import { connect } from 'react-redux';

import App from '../../components/App/AppRouter';
import { getUserData_ } from '../../store/actionCreators/authActions';

const mapStateToProps = state => {
  return {
    userDataStatus: state.authReducer.userDataStatus,
    toastOpen: state.appServiceReducer.toast.open
  };
};

export default connect(
  mapStateToProps,
  {
    getUserData: () => getUserData_()
  }
)(App);
