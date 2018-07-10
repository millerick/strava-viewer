import * as express from 'express';
import * as path from 'path';

const CLIENT_DIR = path.join(__dirname, '../build/dist');
console.log(CLIENT_DIR);

const app = express();

app.get('/assets/:fileName', (req, res) => res.sendFile(path.join(CLIENT_DIR, req.params.fileName)));

app.get('*', (req, res) => res.sendFile(path.join(CLIENT_DIR, 'index.html')));

app.listen(3000, () => console.log('App listening on port 3000!'));
