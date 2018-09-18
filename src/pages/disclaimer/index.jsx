import React from 'react';
import { connect } from 'react-redux';
import { navigateTo } from 'gatsby-link';
import Typography from '@material-ui/core/Typography';
import { addAffidavit as addAffidavitAction} from './../../redux/actions';

import BasicPage from './../../components/BasicPage';;
import withRoot from '../../material-ui/withRoot';
import AnimateButton from '../../components/AnimateButton';


/**
 * Presentational component for affidavit about page
 */
function DisclaimerPage({ addAffidavit }) {
  const fireEvent = () => {
    const id = addAffidavit();
    navigateTo(`/edit?id=${id}`);
  }

  return (
    <BasicPage
      heading="Very important!"
      back="/affidavits"
      expanded="Affidavits"
      selected="View all affidavits"
    >
      <div>
        <Typography component="p">
          <strong>IMPORTANT: This information will NOT be used against you or given to anyone else</strong>
        </Typography>
        <Typography component="p" style={{ marginTop: '1rem' }}>
        It is VERY important that you are honest when answering the questions. Please answer the questions to the best of your knowledge and with as much detail as possible.  
        </Typography>
        <Typography component="p" style={{ marginTop: '1rem' }}>
        If you leave important questions out because you are shy or embarrassed or say something that you know is not true, it makes it difficult for the lawyer to help you. For example, if you owe money to your landlord you must be honest by saying so and explaining why.
        </Typography>
        <Typography component="p" style={{ marginTop: '1rem' }}>
        If your lawyer gets to court and puts false information in front of the judge, it will hurt your case.  
        </Typography>
        <div onClick={fireEvent}  style={{ marginTop: '3rem' }}>
          <AnimateButton variant="contained" color="primary" fullWidth size="large" text="I understand" />
        </div>
      </div>
    </BasicPage>
  )
}


const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
});


const mapDispatchToProps = (dispatch, ownProps) => ({
  ...ownProps,
  addAffidavit: () => dispatch(addAffidavitAction()),
});


export default connect(mapStateToProps, mapDispatchToProps)(withRoot(DisclaimerPage));