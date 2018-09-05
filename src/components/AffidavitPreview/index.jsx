import React from 'react';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';


const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];


function AffidavitPreview({ classes, name, occupants, date, completed = 0 }) {
  return (
    <Card>
      <CardActionArea className={classes.button}>
        <CardContent>
          <Typography gutterBottom variant="headline" component="h2">
            {name}
          </Typography>
          <Typography component="p">
            Total of {occupants} occupants
          </Typography>
          <Typography component="p">
            {completed}% completed
          </Typography>
          <Typography component="p">
            Created on {date.getDate()} {monthNames[date.getMonth()]} {date.getFullYear()}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}


export default withStyles({ button: { width: '100%' }})(AffidavitPreview)