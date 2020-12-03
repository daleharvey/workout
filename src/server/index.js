import Koa from "koa";
import serveStatic from "koa-static";

let app = new Koa();

const WEBROOT = "www";

app.use(serveStatic(WEBROOT));

app.listen(process.env.PORT || 3000);