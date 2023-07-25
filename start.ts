import app from "./app";

app.use(onError);
const PORT = process.env.PORT || 5000;
const start = async () => {
    console.log(app.routes);
    try {
        app.listen(PORT, () => console.log('server started on port ' + PORT));
    }
    catch(e) {
        console.dir(e);
    }
}
function onError(req, res) {
    res.status(404);
    res.json({ error: 'Not found' });
}
start();