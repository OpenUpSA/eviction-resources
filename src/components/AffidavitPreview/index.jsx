import React from 'react';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];


function AffidavitPreview({ name, occupants, date, completed = 0 }) {
  return (
    <Card>
      <CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="headline" component="h2">
            {name}
          </Typography>
          <Typography component="p">
            Total of {occupants} occupant{occupants > 1 && 's'}
          </Typography>
          <Typography component="p">
            {completed}% completed
          </Typography>
          <LinearProgress variant="determinate" value={completed} />
          <Typography component="p">
            Created on {date.getDate()} {monthNames[date.getMonth()]} {date.getFullYear()}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}


export default AffidavitPreview;