import path from "path";
import { promises as fs } from "fs";
//Path
global["__dirname"] = path.dirname(new URL(import.meta.url).pathname);

export default (async (req, res) => {
    let { url, method } = req;
    console.log(`📣 CLIENT-REQUEST: ${req.url} ${req.method}`);

    switch (url) {
        case '/':
            const indexPath = path.join(__dirname, "./views/index.html");
            console.log(indexPath);
            try {
                console.log("Antes del await")
                const data = await fs.readFile('C:/Users/lower/Desktop/FirstServer/views/index.html');
                console.log("Despues del await")
                res.writeHead(200, { 'Content-Type': 'text/html' });
                console.log(`📣 Respondiendo: 200 ${req.url} ${req.method}`);
                res.statusCode = 200;
                res.end(data);
            } catch (err) {
                console.log("Ya entro en error")
                console.log("Error 404");
                console.error(err);
            }
            break;

        //Peticion Autor
        case '/author':
            const PathAuthor = path.join(__dirname, "./views/author.html");
            console.log(PathAuthor);
            try {
                const data = await fs.readFile("C:/Users/lower/Desktop/FirstServer/views/author.html");
                res.writeHead(200, { 'Content-Type': 'text/html' });
                console.log(`📣 Respondiendo: 200 ${req.url} ${req.method}`);
                res.statusCode = 200;
                res.end(data);
            }
            catch (err) {
                console.log("Error 404");
                console.error(err);
            }
            break;

        case "/favicon.ico":
            const faviconPath = path.join(__dirname, 'favicon.ico');
            console.log(faviconPath);
            try {
                const data = await fs.readFile("C:/Users/lower/Desktop/FirstServer/views/favicon.ico");
                res.writeHead(200, { 'Content-Type': 'image/x-icon' });
                res.end(data);
            } catch (err) {
                const error500Path = path.join(__dirname,'./views/500.html');
                console.log(error500Path);
                try
                {
                    const data = await fs.readFile("C:/Users/lower/Desktop/FirstServer/views/500.html");
                    res.writeHead(500,{ 'Content-Type': 'text/html' });
                    console.log(`📣 Respondiendo: 500 ${req.url} ${req.method}`);
                    res.statusCode = 500;
                    res.end(data);
                }
                catch(err)
                {
                    console.log("Error 404");
                    console.error(err);
                }
            }
            break;

        case "/message":
            if (method === "POST") {
                let body = "";
                req.on("data", (data => {
                    body += data;
                    if (body.length > 1e6) return req.socket.destroy();
                }));
                req.on("end", () => {
                    const params = new URLSearchParams(body);
                    const parsedParams = Object.fromEntries(params);
                    fs.writeFile('message.txt', parsedParams.message);
                });
                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end();
            }
            else {
                res.statusCode = 404;
                res.write("404: Endpoint no encontrado")
                res.end();
            }
            break;

        default:
            const defaultPath = path.join(__dirname, "./views/404.html");
            console.log(defaultPath);
            try {
                const data = await fs.readFile("C:/Users/lower/Desktop/FirstServer/views/404.html");
                res.writeHead(200, { 'Content-Type': 'text/html' });
                console.log(`📣 Respondiendo: 404 ${req.url} ${req.method}`);
                res.statusCode = 404;
                res.end(data);
            }
            catch (err) {
                console.log("Error 404");
                console.error(err);
            }
            break;
    }
});