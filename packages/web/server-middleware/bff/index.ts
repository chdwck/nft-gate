import express from 'express'
import axios from 'axios'

const app = express();

app.all('/v1/*', (req, res) => {
    const url = `${process.env.API_V1_URL}${req.url}`;
    axios(url, {
        method: req.method,
        headers: req.headers,
        data: req.body,
    }).then(response => {
        res.status(response.status).send(response.data);
    });
});

export default app;