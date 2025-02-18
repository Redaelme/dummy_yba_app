import express from 'express';
import RateLimit from 'express-rate-limit';
import {mainRouter} from './routes/main';
import favicon from 'serve-favicon';
import * as exphbs from 'express-handlebars';
import cors from 'cors';
import path from 'path';
import {authRouter} from "./routes/auth";
import {configurePassport} from "../configs/passportConfig";
import passport from 'passport';

const app: express.Application = express();

// @ts-ignore
const limiter = new RateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 2400, // 20 rps, these values should be adjusted for production use depending on your infrastructure and the volume of notifications you expect
});

const env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env === 'development';

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(favicon(path.join(__dirname, '..', 'public', 'images', 'favicon.ico')));

configurePassport();
app.use(passport.initialize());

app.use(cors());

app.use('/auth', authRouter);
app.use('/', mainRouter);
app.use(limiter);

const hbs = exphbs.create({
  helpers: require('./helpers/templateHelper.js').helpers,
  defaultLayout: 'layout',
  extname: '.hbs',
});
// app.set('views', path.join(__dirname, '..', 'views'));
export const setViewsDirectory = (language: string) => {
  app.set('views', path.join(__dirname, '..', 'views', language));
};
setViewsDirectory('fr');

app.engine('.hbs', hbs.engine);

app.set('view engine', 'hbs');

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  (err as any).status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    (res as any).status((err as any).status || 500);
    (res as any).render('error', {
      message: (err as any).message,
      error: err,
      title: 'error',
    });
  });
} else {
  // production error handler
  // no stack traces leaked to user
  app.use((err, req, res) => {
    (res as any).status((err as any).status || 500);
    (res as any).render('error', {
      message: (err as any).message,
      error: {},
      title: 'error',
    });
  });
}

export default app;
