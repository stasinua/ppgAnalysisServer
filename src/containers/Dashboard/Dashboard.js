import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import Dashboard from '../../components/Dashboard/Dashboard';
import { getUserScans_ } from '../../store/actionCreators/ppgDataActions';

const mapStateToProps = state => {
  return {
    userId: state.authReducer.user._id,
    userName: state.authReducer.user.name,
    uniqueIdentifier: state.authReducer.user.uniqueIdentifier,
    age: state.authReducer.user.age,
    biologicalSex: state.authReducer.user.biologicalSex,
    scans: state.ppgDataReducer.scans
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    {
      getUserScans: (userId) => getUserScans_(userId)
    }
  )(Dashboard)
);
