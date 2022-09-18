# Serve-spa

Serve-spa allows you to serve static files through HTTP, with two notable features:

* Support for client-side routing -- serves `index.html` for non-static file paths.
* Integrated reverse-proxy to forward requests to backend server listening on different port.

These features make it ideal for serving Single Page Applications (SPAs).

## Examples

* Using the defaults -- serve current directory on port 3000, set backend to port 3001

`$ serve-spa -x`

* Serve `./website` on port 9000, reverse-proxy not enabled

`$ serve-spa -p 9000 ./website`

* Serve `./frontend` on port 9000, forwarding requests to `/api/v2/*` to a backend on port 3000

`$ serve-spa -p 9000 ./frontend -x -b 3000 -a "/api/v2/"`

## Manual

```
Usage: serve-spa [OPTION]... [DOCROOT]
Serve static files in DOCROOT (the current directory by default).

  -a PATH	Set the backend API URL prefix to PATH ("/api/" by default).
  -b PORT	Set the backend server PORT (3001 by default).
  -p PORT	Listen for requests on PORT (3000 by default).

  -x 	Enable reverse-proxy for backend requests.
  -h 	Show this help and exit.
  -v 	Show version and copyright information.
```

## Copyright

serve-spa Copyright (c) 2022 Hassan El anabi (al-annabi.tech)

License GPLv3+: GNU GPL version 3 or later <https://gnu.org/licenses/gpl.html>.

This is free software: you are free to change and redistribute it.

There is NO WARRANTY, to the extent permitted by law.
