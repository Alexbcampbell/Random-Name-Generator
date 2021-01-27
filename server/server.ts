import express from 'express';
import bodyParser from 'body-parser';
import sessionMiddleware from './modules/session-middleware';
// import passport from './strategies/user.strategy';
import userRouter from './routes/user.router';
// import eventRouter from './routes/event.router';
// import notesRouter from './routes/notes.router';
// import dropdownRouter from './routes/dropdown.router';
// import timeslotRouter from './routes/timeslot.router';
// import adminRouter from './routes/admin.router';
// import imageRouter from './routes/image.router';
// import demographicsRouter from './routes/demographics.router';

import * as dotenv from 'dotenv';
dotenv.config();

const app: any = express();

const UploaderS3Router = require('react-dropzone-s3-uploader/s3router');

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport Session Configuration //
app.use(sessionMiddleware);

// start up passport sessions
// app.use(passport.initialize());
// app.use(passport.session());

/* Routes */
app.use('/api/user', userRouter);
// app.use('/api/event', eventRouter);
// app.use('/api/notes', notesRouter);
// app.use('/api/dropdown', dropdownRouter);
// app.use('/api/timeslot', timeslotRouter);
// app.use('/api/admin', adminRouter);
// app.use('/api/image', imageRouter);
// app.use('/api/demographics', demographicsRouter);

app.use(
  '/s3',
  UploaderS3Router({
    bucket: 'wecodekc', // required
    region: 'us-east-2', // optional
    headers: { 'Access-Control-Allow-Origin': '*' }, // optional
    ACL: 'public-read', // this is the default - set to `public-read` to let anyone view uploads
  })
);

app.get('/test', function (req: any, res: any) {
  res.send(`${process.env.AWS_ACCESS_KEY_ID}`);
});

// Serve static files
app.use(express.static('build'));

// App Set //
const PORT: number | string = process.env.PORT || 5000;

/** Listen * */
app.listen(PORT, (): void => {
  console.log(`So awesome. Much wow. Listening on port: ${PORT}`);
});

export default app;
