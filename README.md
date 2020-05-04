# the-fake-backend

![build](https://github.com/rhberro/the-fake-backend/workflows/build/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/rhberro/the-fake-backend/badge.svg?branch=master)](https://coveralls.io/github/rhberro/the-fake-backend?branch=master)
[![NPM Version](https://img.shields.io/npm/v/the-fake-backend.svg?style=flat)](https://www.npmjs.com/package/the-fake-backend)
[![NPM Downloads](https://img.shields.io/npm/dm/the-fake-backend.svg?style=flat)](https://npmcharts.com/compare/the-fake-backend?minimal=true)
[![Publish Size](https://badgen.net/packagephobia/publish/the-fake-backend)](https://packagephobia.now.sh/result?p=the-fake-backend)

Build a fake backend by providing the content of files or JavaScript objects through configurable routes. This service allows the developer to work on a new feature or an existing one using fake data while the real service is in development.

- [**Installing**](#installing)
- [**Getting Started**](#getting-started)
  - [**Files**](#files)
- [**Properties**](#properties)
  - [**Server**](#server)
  - [**Pagination**](#pagination)
  - [**Routes**](#routes)
  - [**Methods**](#methods)
  - [**Search**](#search)
  - [**Overrides**](#overrides)
- [**Guides**](#guides)
  - [**Overriding responses**](#overriding-responses)
  - [**Searching**](#searching)
  - [**Paginating**](#paginating)
  - [**Dynamic params requests**](#dynamic-params-requests)

## Installing

Start by adding the service as a development dependency.

```
yarn add --dev the-fake-backend
```

or

```
npm install --save-dev the-fake-backend
```

## Getting Started

After installing, create a new file that will be responsible for configuring and starting the service.

```javascript
const { createServer } = require('the-fake-backend');

const server = createServer();

server.routes([
  {
    path: '/example',
    methods: [
      {
        type: 'get', // or MethodType.GET with Typescript
        data: 'your-response-data-here',
        // data: (req) => 'your-response-data-here-based-in-request'
      },
    ],
  },
]);

server.listen(8080);
```

This will create the http://localhost:8080/example endpoint.

### Files

You can also use files content as response instead of using the `data` property.

```javascript
const { createServer } = require('the-fake-backend');

const server = createServer();

server.routes([
  {
    path: '/cats',
    methods: [
      {
        type: 'get', // or MethodType.GET with Typescript
      },
    ],
  },
  {
    path: '/dogs',
    methods: [
      {
        type: 'get', // or MethodType.GET with Typescript
        file: 'data/my/custom/path/to/dogs.txt',
      },
    ],
  },
]);

server.listen(8080);
```

The script above generates the following two endpoints.

| Method | Path                       | Response                                            |
| ------ | -------------------------- | --------------------------------------------------- |
| GET    | http://localhost:8080/cats | The `data/cats.json` file content.                  |
| GET    | http://localhost:8080/dogs | The `data/my/custom/path/to/dogs.txt` file content. |

## Properties

### Server

| Property    | Required | Description                                                                                                            |
| ----------- | -------- | ---------------------------------------------------------------------------------------------------------------------- |
| middlewares | no       | An array of functions compatible with [express's middlewares](https://expressjs.com/en/guide/writing-middleware.html). |
| proxies     | no       | The server proxies.                                                                                                    |
| throttlings | no       | The server throttlings.                                                                                                |
| pagination  | no       | The server pagination setup.                                                                                           |

### Pagination

Pagination attributes/parameters names. Response attributes may be printed in response payload (wrapping the given fixture) or headers. Request parameters are read from URL query string.

| Property        | Required | Default    | type               | Description                                            |
| --------------- | -------- | ---------- | ------------------ | ------------------------------------------------------ |
| count           | No       | `'count'`  | Response attribute | Current page items count                               |
| data            | No       | `'data'`   | Response attribute | Current page data                                      |
| empty           | No       | `'empty'`  | Response attribute | Whether if current page is empty                       |
| first           | No       | `'first'`  | Response attribute | Whether if current page is the first one               |
| headers         | No       | `false`    | Configuration      | Whether response attributes will be present in headers |
| last            | No       | `'last'`   | Response attribute | Whether if current page is the last one                |
| next            | No       | `'next'`   | Response attribute | Whether if there is a next page                        |
| offsetParameter | No       | `'offset'` | Request parameter  | Requested offset                                       |
| page            | No       | `'page'`   | Response attribute | Current page                                           |
| pageParameter   | No       | `'page'`   | Request parameter  | Requested page                                         |
| pages           | No       | `'pages'`  | Response attribute | Pages count                                            |
| sizeParameter   | No       | `'size'`   | Request parameter  | Requested page size                                    |
| total           | No       | `'total'`  | Response attribute | Total items count                                      |

### Routes

| Property                     | Required | Description                                                   |
| ---------------------------- | -------- | ------------------------------------------------------------- |
| routes[].path                | yes      | The endpoint address (URI).                                   |
| [routes[].methods](#methods) | yes      | The route methods, check the method's properties table below. |

### Methods

| Property                            | Required | Default | Description                                                       |
| ----------------------------------- | -------- | ------- | ----------------------------------------------------------------- |
| methods[].type                      | yes      |         | HTTP request type                                                 |
| methods[].code                      | no       | `200`   | HTTP response status code                                         |
| methods[].data                      | no       |         | HTTP response data. May be a function with request or arguments   |
| methods[].file                      | no       |         | HTTP response data fixture file (when data is not given)          |
| methods[].headers                   | no       |         | HTTP response headers                                             |
| methods[].delay                     | no       |         | HTTP response delay/timeout                                       |
| [methods[].search](#search)         | no       |         | Search parameters                                                 |
| [methods[].pagination](#pagination) | no       | `false` | Whether data is paginated or not. May also be a pagination object |
| [methods[].overrides](#overrides)   | no       |         | Custom response scenarios (switchable in CLI)                     |

### Search

| Property   | Required | Default | Description                                |
| ---------- | -------- | ------- | ------------------------------------------ |
| parameter  | yes      |         | Query string parameter name                |
| properties | yes      |         | An array of properties to apply the search |

### Overrides

The same [methods](#methods) properties but requires a `name` and does not have `type` and `overrides` properties.

| Property               | Required | Default | Description     |
| ---------------------- | -------- | ------- | --------------- |
| overrides[].name       | yes      |         | Scenario name   |
| overrides[].code       | no       | `200`   | Described above |
| overrides[].data       | no       |         | Described above |
| overrides[].file       | no       |         | Described above |
| overrides[].headers    | no       |         | Described above |
| overrides[].delay      | no       |         | Described above |
| overrides[].search     | no       |         | Described above |
| overrides[].pagination | no       | `false` | Described above |
| overrides[].selected   | no       | `false` | Described above |

This property allows you to create an array of options that will override the current `method` option.

## Guides

### Overriding responses

When a request is made the server will check if the `method` object contains the `overrides` property and if there is one `override` selected through the property `selected`. If there is an `override` selected it will be merged with the `method` object.

#### Example

```javascript
const server = createServer({ ... })

server.routes([
  {
    path: '/user',
    methods: [
      {
        type: 'get', // or MethodType.GET with Typescript
        file: 'data/my/custom/path/to/client-user.json',
        overrides: [
          {
            name: 'Staff',
            file: 'data/my/custom/path/to/staff-user.json'
          },
          {
            name: 'Super Admin',
            file: 'data/my/custom/path/to/super-admin-user.json'
          },
          {
            name: 'Error 500',
            code: 500
          }
        ]
      }
    ]
  }
]);

// curl -XGET http://localhost:8080/user
// Returns `data/my/custom/path/to/client-user.json` file content.

Press 'o' on terminal and change the URL '/user' with method 'get' with override 'Super Admin'

// curl -XGET http://localhost:8080/user
// Returns `data/my/custom/path/to/super-admin-user.json` file content.
```

### Searching

You can make an endpoint searchable by declaring the search property in a route.

#### Example

```json
// /data/dogs.json
[
  { "id": 1, "name": "Doogo" },
  { "id": 2, "name": "Dogger" },
  { "id": 3, "name": "Dog" },
  { "id": 4, "name": "Doggernaut" },
  { "id": 5, "name": "Dogging" }
]
```

```javascript
const { createServer } = require('the-fake-backend');

const server = createServer();

server.routes([
  {
    path: '/dogs',
    methods: [
      {
        type: 'get', // or MethodType.GET with Typescript
        search: {
          parameter: 'search',
          properties: ['name'],
        },
      },
    ],
  },
]);

server.listen(8080);
```

You can now make requests to the `http://localhost:8080/dogs?search=dogg` endpoint. The response will be the `data/dogs.json` file content filtered.

```json
[
  { "id": 2, "name": "Dogger" },
  { "id": 4, "name": "Doggernaut" },
  { "id": 5, "name": "Dogging" }
]
```

### Paginating

You can make an endpoint paginated by declaring the pagination options in the server (just in case of overriding default values), adding pagination parameter in a route and visiting it with pagination query string parameters.

Route pagination parameter may be a boolean (true) to use global pagination options, or [pagination](#pagination) object parts to override global ones.

#### Example

```json
// /data/dogs.json
[
  { "id": 1, "name": "Doogo" },
  { "id": 2, "name": "Dogger" },
  { "id": 3, "name": "Dog" },
  { "id": 4, "name": "Doggernaut" },
  { "id": 5, "name": "Dogging" }
];
```

```javascript
const { createServer } = require('the-fake-backend');

const server = createServer(); // if pagination isn't given, default values will be applied

server.routes([
  {
    path: '/dogs',
    methods: [
      {
        type: 'get', // or MethodType.GET with Typescript
        pagination: true,
        // pagination: { headers: true } // only this request will have pagination parameters in response headers
      },
    ],
  },
]);

server.listen(8080);
```

Then, given a `http://localhost:8080/dogs?page=1&size=2` request, the following payload will be returned:

```json
{
  "count": 2,
  "empty": false,
  "first": true,
  "last": false,
  "next": true,
  "page": 0,
  "pages": 3, // Doogo,Dogger | Dog,Doggernaut | Dogging
  "total": 5,
  "data": [
    { "id": 3, "name": "Dog" },
    { "id": 4, "name": "Doggernaut" }
  ] // first page content
}
```

> Note: given `http://localhost:8080/dogs?offset=2&size=2` the payload would be the same. Offset attribute has precedence over page.

If headers attribute was set to true in server options (or route pagination options):

```javascript
const server = createServer({
  pagination: {
    headers: true,
  },
});
```

Then the metadata attributes would be printed in response headers and the response payload would be the following:

```json
[
  { "id": 3, "name": "Dog" },
  { "id": 4, "name": "Doggernaut" }
]
```

### Dynamic params requests

Just like in Express, route requests may have dynamic params:

```javascript
const { createServer } = require('the-fake-backend');

const server = createServer();

server.routes([
  {
    path: '/dogs/:id/details',
    methods: [
      {
        type: 'get', // or MethodType.GET with Typescript
      },
    ],
  },
]);
```

Given a matching HTTP request, e.g. `http://localhost:8080/dogs/3/details`, the server will search the following fixtures, sorted by precedence:

1. `data/dogs/3/details.json`
2. `data/dogs/:id/details.json`

If the request has multiple dynamic params, the precedence is the same, searching the fullly specific fixture, and the fully generic one otherwise.
