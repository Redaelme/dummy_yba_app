/* eslint-disable no-new */
import bodyParser from 'body-parser';
import cors from 'cors';
import { createServer } from 'http';
import express from 'express';

const port = process.env.NODE_PORT || 4000;

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = createServer(app);
app.get('');
server.listen({ port }, () => {
  console.log(`🚀 Server ready at:  http://localhost:${port}`);
});
