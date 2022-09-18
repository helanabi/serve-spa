#!/usr/bin/env node

const argv = require("minimist")(process.argv.slice(2));
const express = require("express");
const http = require("http");
const path = require("path");
const proxyServer = require("http-proxy").createProxyServer({});

if ("h" in argv) {
    console.log(`\
Usage: serve-spa [OPTION]... [DOCROOT]
Serve static files in DOCROOT (the current directory by default).

  -a PATH\tProxy requests to PATH* to the backend server ("/api/" by default)
  -p PORT\tListen for requests on PORT (3000 by default).
  -x PORT\tSet the backend server PORT (3001 by default).

  -h Show this help and exit.
  -v Show version and copyright information.`);
    return;
}

if ("v" in argv) {
    console.log(`\
serve-spa v0.1.0
Copyright (c) 2022 Hassan El anabi (al-annabi.tech)
License GPLv3+: GNU GPL version 3 or later <https://gnu.org/licenses/gpl.html>.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.`);
    return;
}	

function getArg(opt, defaultValue, typeChecker=() => true) {
    const arg = argv[opt];
    if (!arg || arg === true) {
	return defaultValue;
    } else if (!typeChecker(arg)) {
	console.error(`Invalid value '${arg}' for option -${opt}. see -h for help`);
	process.exit(1);
    } else {
	return arg;
    }
}

const PORT = getArg("p", 3000, Number.isInteger);
const PROXY_PORT = getArg("x", 3001, Number.isInteger);
const API_PATH = getArg("a", "/api/");
const STATIC_DIR = argv._[0] || process.env.PWD;

function proxy(req, res, next) {
    if (req.url.startsWith(API_PATH)) {
	proxyServer.web(req, res, {
	    target: `${req.protocol}://${req.hostname}:${PROXY_PORT}`
	});
    } else next();
}

const app = express();

if ("x" in argv) {
    app.use(proxy);
}

app.use(express.static(STATIC_DIR));

app.get("/*", (req, res) => {
    res.sendFile(path.join(STATIC_DIR, "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
    if ("x" in argv) {
	console.log(`Proxy enabled for requests to ${API_PATH}*`);
	console.log(`Backend server port is set to ${PROXY_PORT}`);
    }
});
