import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import Link from 'gatsby-link';


const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];


const actionItem = (title, cb) => (
  <Button size="small" color="primary" onClick={cb}>
    {title}
  </Button>
);

function AffidavitPreview(props) {
  const {
    name,
    occupants,
    created,
    completed = 0,
    deleteCb,
    sendCb,
    editUrl,
  } = props;

  return (
    <Card>
      <CardContent>
        <Typography gutterBottom variant="headline" component="h2">
          {name}
        </Typography>

        <Typography component="p" color="textSecondary">
          Total of {occupants} occupant{occupants > 1 && 's'}
        </Typography>
        <Typography component="p" color="textSecondary">
          Created on {created.getDate()} {monthNames[created.getMonth()]} {created.getFullYear()}
        </Typography>

        <Typography component="p" color="primary" style={{ marginTop: '2rem' }}>
          {completed}
          <span>% completed</span>
        </Typography>
        <LinearProgress variant="determinate" value={completed} />
      </CardContent>
      <CardActions>
        <Link to={editUrl} style={{ textDecoration: 'none' }}>
          <Button size="small" color="primary">
            Edit
          </Button>
        </Link>
        {deleteCb && actionItem('Delete', deleteCb)}
        {sendCb && actionItem('Send', sendCb)}
      </CardActions>
    </Card>
  );
}


export default AffidavitPreview;
