#!/usr/bin/env node

/*
  Copyright (C) 2022 Hassan El anabi (al-annabi.tech)
  License GPLv3+: GNU GPL version 3 or later <https://gnu.org/licenses/gpl.html>.
*/

const express = require("express");
const http = require("http");
const parseArgs = require("minimist");
const path = require("path");
const proxyServer = require("http-proxy").createProxyServer({});

const argv = parseArgs(process.argv.slice(2), {
    string: "a",
    boolean: ["h", "v", "x"],
    default: {
	"a": "/api/",
	"b": 3001,
	"p": 3000
    }
});

if (argv.h) {
    console.log(`\
Usage: serve-spa [OPTION]... [DOCROOT]
Serve static files in DOCROOT (the current directory by default).

  -a PATH\tSet the backend API URL prefix to PATH ("/api/" by default).
  -b PORT\tSet the backend server PORT (3001 by default).
  -p PORT\tListen for requests on PORT (3000 by default).

  -x \tEnable reverse-proxy for backend requests.
  -h \tShow this help and exit.
  -v \tShow version and copyright information.`);
    return;
}

if (argv.v) {
    console.log(`\
serve-spa v0.1.0
Copyright (c) 2022 Hassan El anabi (al-annabi.tech)
License GPLv3+: GNU GPL version 3 or later <https://gnu.org/licenses/gpl.html>.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.`);
    return;
}	

function checkPort(n) {
    if (Number.isInteger(n)
	&& n > 0
	&& n < 2**16) {
	return n;
    } else {
	console.error(`Invalid port number: ${n}`);
	process.exit(1);
    }
}

const PORT = checkPort(argv.p);
const PROXY_PORT = checkPort(argv.b);
const API_PATH = argv.a;
const STATIC_DIR = argv._[0] || process.env.PWD;

function proxy(req, res, next) {
    if (req.url.startsWith(API_PATH)) {
	proxyServer.web(req, res, {
	    target: `${req.protocol}://${req.hostname}:${PROXY_PORT}`
	});
    } else next();
}

const app = express();

if (argv.x) {
    app.use(proxy);
}

app.use(express.static(STATIC_DIR));

app.get("/*", (req, res) => {
    res.sendFile(path.join(STATIC_DIR, "index.html"));
});

app.listen(PORT, () => {
    if (argv.x) {
	console.log(`Reverse-proxy enabled for requests to ${API_PATH}*`);
	console.log(`Backend server port is set to ${PROXY_PORT}`);
    }
    console.log(`Server listening on port ${PORT}...`);
});
