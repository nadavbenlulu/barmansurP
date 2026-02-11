const http=require('http');
const app=require('./app');// ייבוא האפליקציה שיצרנו בקובץ app.js
const port=3000;
const srv=http.createServer(app);
srv.listen(port,()=>{
    console.log(`Server is listening on port ${port}...`);
});