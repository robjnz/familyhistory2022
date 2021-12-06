var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[Object.keys(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// node_modules/@sveltejs/kit/dist/install-fetch.js
function dataUriToBuffer(uri) {
  if (!/^data:/i.test(uri)) {
    throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
  }
  uri = uri.replace(/\r?\n/g, "");
  const firstComma = uri.indexOf(",");
  if (firstComma === -1 || firstComma <= 4) {
    throw new TypeError("malformed data: URI");
  }
  const meta = uri.substring(5, firstComma).split(";");
  let charset = "";
  let base64 = false;
  const type = meta[0] || "text/plain";
  let typeFull = type;
  for (let i = 1; i < meta.length; i++) {
    if (meta[i] === "base64") {
      base64 = true;
    } else {
      typeFull += `;${meta[i]}`;
      if (meta[i].indexOf("charset=") === 0) {
        charset = meta[i].substring(8);
      }
    }
  }
  if (!meta[0] && !charset.length) {
    typeFull += ";charset=US-ASCII";
    charset = "US-ASCII";
  }
  const encoding = base64 ? "base64" : "ascii";
  const data = unescape(uri.substring(firstComma + 1));
  const buffer = Buffer.from(data, encoding);
  buffer.type = type;
  buffer.typeFull = typeFull;
  buffer.charset = charset;
  return buffer;
}
async function* toIterator(parts, clone2 = true) {
  for (const part of parts) {
    if ("stream" in part) {
      yield* part.stream();
    } else if (ArrayBuffer.isView(part)) {
      if (clone2) {
        let position = part.byteOffset;
        const end = part.byteOffset + part.byteLength;
        while (position !== end) {
          const size = Math.min(end - position, POOL_SIZE);
          const chunk = part.buffer.slice(position, position + size);
          position += chunk.byteLength;
          yield new Uint8Array(chunk);
        }
      } else {
        yield part;
      }
    } else {
      let position = 0;
      while (position !== part.size) {
        const chunk = part.slice(position, Math.min(part.size, position + POOL_SIZE));
        const buffer = await chunk.arrayBuffer();
        position += buffer.byteLength;
        yield new Uint8Array(buffer);
      }
    }
  }
}
function isFormData(object) {
  return typeof object === "object" && typeof object.append === "function" && typeof object.set === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.delete === "function" && typeof object.keys === "function" && typeof object.values === "function" && typeof object.entries === "function" && typeof object.constructor === "function" && object[NAME] === "FormData";
}
function getHeader(boundary, name, field) {
  let header = "";
  header += `${dashes}${boundary}${carriage}`;
  header += `Content-Disposition: form-data; name="${name}"`;
  if (isBlob(field)) {
    header += `; filename="${field.name}"${carriage}`;
    header += `Content-Type: ${field.type || "application/octet-stream"}`;
  }
  return `${header}${carriage.repeat(2)}`;
}
async function* formDataIterator(form, boundary) {
  for (const [name, value] of form) {
    yield getHeader(boundary, name, value);
    if (isBlob(value)) {
      yield* value.stream();
    } else {
      yield value;
    }
    yield carriage;
  }
  yield getFooter(boundary);
}
function getFormDataLength(form, boundary) {
  let length = 0;
  for (const [name, value] of form) {
    length += Buffer.byteLength(getHeader(boundary, name, value));
    length += isBlob(value) ? value.size : Buffer.byteLength(String(value));
    length += carriageLength;
  }
  length += Buffer.byteLength(getFooter(boundary));
  return length;
}
async function consumeBody(data) {
  if (data[INTERNALS$2].disturbed) {
    throw new TypeError(`body used already for: ${data.url}`);
  }
  data[INTERNALS$2].disturbed = true;
  if (data[INTERNALS$2].error) {
    throw data[INTERNALS$2].error;
  }
  let { body } = data;
  if (body === null) {
    return Buffer.alloc(0);
  }
  if (isBlob(body)) {
    body = import_stream.default.Readable.from(body.stream());
  }
  if (Buffer.isBuffer(body)) {
    return body;
  }
  if (!(body instanceof import_stream.default)) {
    return Buffer.alloc(0);
  }
  const accum = [];
  let accumBytes = 0;
  try {
    for await (const chunk of body) {
      if (data.size > 0 && accumBytes + chunk.length > data.size) {
        const error2 = new FetchError(`content size at ${data.url} over limit: ${data.size}`, "max-size");
        body.destroy(error2);
        throw error2;
      }
      accumBytes += chunk.length;
      accum.push(chunk);
    }
  } catch (error2) {
    const error_ = error2 instanceof FetchBaseError ? error2 : new FetchError(`Invalid response body while trying to fetch ${data.url}: ${error2.message}`, "system", error2);
    throw error_;
  }
  if (body.readableEnded === true || body._readableState.ended === true) {
    try {
      if (accum.every((c) => typeof c === "string")) {
        return Buffer.from(accum.join(""));
      }
      return Buffer.concat(accum, accumBytes);
    } catch (error2) {
      throw new FetchError(`Could not create Buffer from response body for ${data.url}: ${error2.message}`, "system", error2);
    }
  } else {
    throw new FetchError(`Premature close of server response while trying to fetch ${data.url}`);
  }
}
function fromRawHeaders(headers = []) {
  return new Headers(headers.reduce((result, value, index, array) => {
    if (index % 2 === 0) {
      result.push(array.slice(index, index + 2));
    }
    return result;
  }, []).filter(([name, value]) => {
    try {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return true;
    } catch {
      return false;
    }
  }));
}
async function fetch(url, options_) {
  return new Promise((resolve2, reject) => {
    const request = new Request(url, options_);
    const options2 = getNodeRequestOptions(request);
    if (!supportedSchemas.has(options2.protocol)) {
      throw new TypeError(`node-fetch cannot load ${url}. URL scheme "${options2.protocol.replace(/:$/, "")}" is not supported.`);
    }
    if (options2.protocol === "data:") {
      const data = dataUriToBuffer$1(request.url);
      const response2 = new Response(data, { headers: { "Content-Type": data.typeFull } });
      resolve2(response2);
      return;
    }
    const send = (options2.protocol === "https:" ? import_https.default : import_http.default).request;
    const { signal } = request;
    let response = null;
    const abort = () => {
      const error2 = new AbortError("The operation was aborted.");
      reject(error2);
      if (request.body && request.body instanceof import_stream.default.Readable) {
        request.body.destroy(error2);
      }
      if (!response || !response.body) {
        return;
      }
      response.body.emit("error", error2);
    };
    if (signal && signal.aborted) {
      abort();
      return;
    }
    const abortAndFinalize = () => {
      abort();
      finalize();
    };
    const request_ = send(options2);
    if (signal) {
      signal.addEventListener("abort", abortAndFinalize);
    }
    const finalize = () => {
      request_.abort();
      if (signal) {
        signal.removeEventListener("abort", abortAndFinalize);
      }
    };
    request_.on("error", (error2) => {
      reject(new FetchError(`request to ${request.url} failed, reason: ${error2.message}`, "system", error2));
      finalize();
    });
    fixResponseChunkedTransferBadEnding(request_, (error2) => {
      response.body.destroy(error2);
    });
    if (process.version < "v14") {
      request_.on("socket", (s2) => {
        let endedWithEventsCount;
        s2.prependListener("end", () => {
          endedWithEventsCount = s2._eventsCount;
        });
        s2.prependListener("close", (hadError) => {
          if (response && endedWithEventsCount < s2._eventsCount && !hadError) {
            const error2 = new Error("Premature close");
            error2.code = "ERR_STREAM_PREMATURE_CLOSE";
            response.body.emit("error", error2);
          }
        });
      });
    }
    request_.on("response", (response_) => {
      request_.setTimeout(0);
      const headers = fromRawHeaders(response_.rawHeaders);
      if (isRedirect(response_.statusCode)) {
        const location = headers.get("Location");
        const locationURL = location === null ? null : new URL(location, request.url);
        switch (request.redirect) {
          case "error":
            reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
            finalize();
            return;
          case "manual":
            if (locationURL !== null) {
              headers.set("Location", locationURL);
            }
            break;
          case "follow": {
            if (locationURL === null) {
              break;
            }
            if (request.counter >= request.follow) {
              reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
              finalize();
              return;
            }
            const requestOptions = {
              headers: new Headers(request.headers),
              follow: request.follow,
              counter: request.counter + 1,
              agent: request.agent,
              compress: request.compress,
              method: request.method,
              body: request.body,
              signal: request.signal,
              size: request.size
            };
            if (response_.statusCode !== 303 && request.body && options_.body instanceof import_stream.default.Readable) {
              reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
              finalize();
              return;
            }
            if (response_.statusCode === 303 || (response_.statusCode === 301 || response_.statusCode === 302) && request.method === "POST") {
              requestOptions.method = "GET";
              requestOptions.body = void 0;
              requestOptions.headers.delete("content-length");
            }
            resolve2(fetch(new Request(locationURL, requestOptions)));
            finalize();
            return;
          }
          default:
            return reject(new TypeError(`Redirect option '${request.redirect}' is not a valid value of RequestRedirect`));
        }
      }
      if (signal) {
        response_.once("end", () => {
          signal.removeEventListener("abort", abortAndFinalize);
        });
      }
      let body = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), reject);
      if (process.version < "v12.10") {
        response_.on("aborted", abortAndFinalize);
      }
      const responseOptions = {
        url: request.url,
        status: response_.statusCode,
        statusText: response_.statusMessage,
        headers,
        size: request.size,
        counter: request.counter,
        highWaterMark: request.highWaterMark
      };
      const codings = headers.get("Content-Encoding");
      if (!request.compress || request.method === "HEAD" || codings === null || response_.statusCode === 204 || response_.statusCode === 304) {
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      const zlibOptions = {
        flush: import_zlib.default.Z_SYNC_FLUSH,
        finishFlush: import_zlib.default.Z_SYNC_FLUSH
      };
      if (codings === "gzip" || codings === "x-gzip") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createGunzip(zlibOptions), reject);
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      if (codings === "deflate" || codings === "x-deflate") {
        const raw = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), reject);
        raw.once("data", (chunk) => {
          body = (chunk[0] & 15) === 8 ? (0, import_stream.pipeline)(body, import_zlib.default.createInflate(), reject) : (0, import_stream.pipeline)(body, import_zlib.default.createInflateRaw(), reject);
          response = new Response(body, responseOptions);
          resolve2(response);
        });
        return;
      }
      if (codings === "br") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createBrotliDecompress(), reject);
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      response = new Response(body, responseOptions);
      resolve2(response);
    });
    writeToStream(request_, request);
  });
}
function fixResponseChunkedTransferBadEnding(request, errorCallback) {
  const LAST_CHUNK = Buffer.from("0\r\n\r\n");
  let isChunkedTransfer = false;
  let properLastChunkReceived = false;
  let previousChunk;
  request.on("response", (response) => {
    const { headers } = response;
    isChunkedTransfer = headers["transfer-encoding"] === "chunked" && !headers["content-length"];
  });
  request.on("socket", (socket) => {
    const onSocketClose = () => {
      if (isChunkedTransfer && !properLastChunkReceived) {
        const error2 = new Error("Premature close");
        error2.code = "ERR_STREAM_PREMATURE_CLOSE";
        errorCallback(error2);
      }
    };
    socket.prependListener("close", onSocketClose);
    request.on("abort", () => {
      socket.removeListener("close", onSocketClose);
    });
    socket.on("data", (buf) => {
      properLastChunkReceived = Buffer.compare(buf.slice(-5), LAST_CHUNK) === 0;
      if (!properLastChunkReceived && previousChunk) {
        properLastChunkReceived = Buffer.compare(previousChunk.slice(-3), LAST_CHUNK.slice(0, 3)) === 0 && Buffer.compare(buf.slice(-2), LAST_CHUNK.slice(3)) === 0;
      }
      previousChunk = buf;
    });
  });
}
var import_http, import_https, import_zlib, import_stream, import_util, import_crypto, import_url, commonjsGlobal, src, dataUriToBuffer$1, ponyfill_es2018, POOL_SIZE$1, POOL_SIZE, _Blob, Blob2, Blob$1, FetchBaseError, FetchError, NAME, isURLSearchParameters, isBlob, isAbortSignal, carriage, dashes, carriageLength, getFooter, getBoundary, INTERNALS$2, Body, clone, extractContentType, getTotalBytes, writeToStream, validateHeaderName, validateHeaderValue, Headers, redirectStatus, isRedirect, INTERNALS$1, Response, getSearch, INTERNALS, isRequest, Request, getNodeRequestOptions, AbortError, supportedSchemas;
var init_install_fetch = __esm({
  "node_modules/@sveltejs/kit/dist/install-fetch.js"() {
    init_shims();
    import_http = __toModule(require("http"));
    import_https = __toModule(require("https"));
    import_zlib = __toModule(require("zlib"));
    import_stream = __toModule(require("stream"));
    import_util = __toModule(require("util"));
    import_crypto = __toModule(require("crypto"));
    import_url = __toModule(require("url"));
    commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
    src = dataUriToBuffer;
    dataUriToBuffer$1 = src;
    ponyfill_es2018 = { exports: {} };
    (function(module2, exports) {
      (function(global2, factory) {
        factory(exports);
      })(commonjsGlobal, function(exports2) {
        const SymbolPolyfill = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? Symbol : (description) => `Symbol(${description})`;
        function noop2() {
          return void 0;
        }
        function getGlobals() {
          if (typeof self !== "undefined") {
            return self;
          } else if (typeof window !== "undefined") {
            return window;
          } else if (typeof commonjsGlobal !== "undefined") {
            return commonjsGlobal;
          }
          return void 0;
        }
        const globals = getGlobals();
        function typeIsObject(x) {
          return typeof x === "object" && x !== null || typeof x === "function";
        }
        const rethrowAssertionErrorRejection = noop2;
        const originalPromise = Promise;
        const originalPromiseThen = Promise.prototype.then;
        const originalPromiseResolve = Promise.resolve.bind(originalPromise);
        const originalPromiseReject = Promise.reject.bind(originalPromise);
        function newPromise(executor) {
          return new originalPromise(executor);
        }
        function promiseResolvedWith(value) {
          return originalPromiseResolve(value);
        }
        function promiseRejectedWith(reason) {
          return originalPromiseReject(reason);
        }
        function PerformPromiseThen(promise, onFulfilled, onRejected) {
          return originalPromiseThen.call(promise, onFulfilled, onRejected);
        }
        function uponPromise(promise, onFulfilled, onRejected) {
          PerformPromiseThen(PerformPromiseThen(promise, onFulfilled, onRejected), void 0, rethrowAssertionErrorRejection);
        }
        function uponFulfillment(promise, onFulfilled) {
          uponPromise(promise, onFulfilled);
        }
        function uponRejection(promise, onRejected) {
          uponPromise(promise, void 0, onRejected);
        }
        function transformPromiseWith(promise, fulfillmentHandler, rejectionHandler) {
          return PerformPromiseThen(promise, fulfillmentHandler, rejectionHandler);
        }
        function setPromiseIsHandledToTrue(promise) {
          PerformPromiseThen(promise, void 0, rethrowAssertionErrorRejection);
        }
        const queueMicrotask = (() => {
          const globalQueueMicrotask = globals && globals.queueMicrotask;
          if (typeof globalQueueMicrotask === "function") {
            return globalQueueMicrotask;
          }
          const resolvedPromise = promiseResolvedWith(void 0);
          return (fn) => PerformPromiseThen(resolvedPromise, fn);
        })();
        function reflectCall(F, V, args) {
          if (typeof F !== "function") {
            throw new TypeError("Argument is not a function");
          }
          return Function.prototype.apply.call(F, V, args);
        }
        function promiseCall(F, V, args) {
          try {
            return promiseResolvedWith(reflectCall(F, V, args));
          } catch (value) {
            return promiseRejectedWith(value);
          }
        }
        const QUEUE_MAX_ARRAY_SIZE = 16384;
        class SimpleQueue {
          constructor() {
            this._cursor = 0;
            this._size = 0;
            this._front = {
              _elements: [],
              _next: void 0
            };
            this._back = this._front;
            this._cursor = 0;
            this._size = 0;
          }
          get length() {
            return this._size;
          }
          push(element) {
            const oldBack = this._back;
            let newBack = oldBack;
            if (oldBack._elements.length === QUEUE_MAX_ARRAY_SIZE - 1) {
              newBack = {
                _elements: [],
                _next: void 0
              };
            }
            oldBack._elements.push(element);
            if (newBack !== oldBack) {
              this._back = newBack;
              oldBack._next = newBack;
            }
            ++this._size;
          }
          shift() {
            const oldFront = this._front;
            let newFront = oldFront;
            const oldCursor = this._cursor;
            let newCursor = oldCursor + 1;
            const elements = oldFront._elements;
            const element = elements[oldCursor];
            if (newCursor === QUEUE_MAX_ARRAY_SIZE) {
              newFront = oldFront._next;
              newCursor = 0;
            }
            --this._size;
            this._cursor = newCursor;
            if (oldFront !== newFront) {
              this._front = newFront;
            }
            elements[oldCursor] = void 0;
            return element;
          }
          forEach(callback) {
            let i = this._cursor;
            let node = this._front;
            let elements = node._elements;
            while (i !== elements.length || node._next !== void 0) {
              if (i === elements.length) {
                node = node._next;
                elements = node._elements;
                i = 0;
                if (elements.length === 0) {
                  break;
                }
              }
              callback(elements[i]);
              ++i;
            }
          }
          peek() {
            const front = this._front;
            const cursor = this._cursor;
            return front._elements[cursor];
          }
        }
        function ReadableStreamReaderGenericInitialize(reader, stream) {
          reader._ownerReadableStream = stream;
          stream._reader = reader;
          if (stream._state === "readable") {
            defaultReaderClosedPromiseInitialize(reader);
          } else if (stream._state === "closed") {
            defaultReaderClosedPromiseInitializeAsResolved(reader);
          } else {
            defaultReaderClosedPromiseInitializeAsRejected(reader, stream._storedError);
          }
        }
        function ReadableStreamReaderGenericCancel(reader, reason) {
          const stream = reader._ownerReadableStream;
          return ReadableStreamCancel(stream, reason);
        }
        function ReadableStreamReaderGenericRelease(reader) {
          if (reader._ownerReadableStream._state === "readable") {
            defaultReaderClosedPromiseReject(reader, new TypeError(`Reader was released and can no longer be used to monitor the stream's closedness`));
          } else {
            defaultReaderClosedPromiseResetToRejected(reader, new TypeError(`Reader was released and can no longer be used to monitor the stream's closedness`));
          }
          reader._ownerReadableStream._reader = void 0;
          reader._ownerReadableStream = void 0;
        }
        function readerLockException(name) {
          return new TypeError("Cannot " + name + " a stream using a released reader");
        }
        function defaultReaderClosedPromiseInitialize(reader) {
          reader._closedPromise = newPromise((resolve2, reject) => {
            reader._closedPromise_resolve = resolve2;
            reader._closedPromise_reject = reject;
          });
        }
        function defaultReaderClosedPromiseInitializeAsRejected(reader, reason) {
          defaultReaderClosedPromiseInitialize(reader);
          defaultReaderClosedPromiseReject(reader, reason);
        }
        function defaultReaderClosedPromiseInitializeAsResolved(reader) {
          defaultReaderClosedPromiseInitialize(reader);
          defaultReaderClosedPromiseResolve(reader);
        }
        function defaultReaderClosedPromiseReject(reader, reason) {
          if (reader._closedPromise_reject === void 0) {
            return;
          }
          setPromiseIsHandledToTrue(reader._closedPromise);
          reader._closedPromise_reject(reason);
          reader._closedPromise_resolve = void 0;
          reader._closedPromise_reject = void 0;
        }
        function defaultReaderClosedPromiseResetToRejected(reader, reason) {
          defaultReaderClosedPromiseInitializeAsRejected(reader, reason);
        }
        function defaultReaderClosedPromiseResolve(reader) {
          if (reader._closedPromise_resolve === void 0) {
            return;
          }
          reader._closedPromise_resolve(void 0);
          reader._closedPromise_resolve = void 0;
          reader._closedPromise_reject = void 0;
        }
        const AbortSteps = SymbolPolyfill("[[AbortSteps]]");
        const ErrorSteps = SymbolPolyfill("[[ErrorSteps]]");
        const CancelSteps = SymbolPolyfill("[[CancelSteps]]");
        const PullSteps = SymbolPolyfill("[[PullSteps]]");
        const NumberIsFinite = Number.isFinite || function(x) {
          return typeof x === "number" && isFinite(x);
        };
        const MathTrunc = Math.trunc || function(v) {
          return v < 0 ? Math.ceil(v) : Math.floor(v);
        };
        function isDictionary(x) {
          return typeof x === "object" || typeof x === "function";
        }
        function assertDictionary(obj, context) {
          if (obj !== void 0 && !isDictionary(obj)) {
            throw new TypeError(`${context} is not an object.`);
          }
        }
        function assertFunction(x, context) {
          if (typeof x !== "function") {
            throw new TypeError(`${context} is not a function.`);
          }
        }
        function isObject(x) {
          return typeof x === "object" && x !== null || typeof x === "function";
        }
        function assertObject(x, context) {
          if (!isObject(x)) {
            throw new TypeError(`${context} is not an object.`);
          }
        }
        function assertRequiredArgument(x, position, context) {
          if (x === void 0) {
            throw new TypeError(`Parameter ${position} is required in '${context}'.`);
          }
        }
        function assertRequiredField(x, field, context) {
          if (x === void 0) {
            throw new TypeError(`${field} is required in '${context}'.`);
          }
        }
        function convertUnrestrictedDouble(value) {
          return Number(value);
        }
        function censorNegativeZero(x) {
          return x === 0 ? 0 : x;
        }
        function integerPart(x) {
          return censorNegativeZero(MathTrunc(x));
        }
        function convertUnsignedLongLongWithEnforceRange(value, context) {
          const lowerBound = 0;
          const upperBound = Number.MAX_SAFE_INTEGER;
          let x = Number(value);
          x = censorNegativeZero(x);
          if (!NumberIsFinite(x)) {
            throw new TypeError(`${context} is not a finite number`);
          }
          x = integerPart(x);
          if (x < lowerBound || x > upperBound) {
            throw new TypeError(`${context} is outside the accepted range of ${lowerBound} to ${upperBound}, inclusive`);
          }
          if (!NumberIsFinite(x) || x === 0) {
            return 0;
          }
          return x;
        }
        function assertReadableStream(x, context) {
          if (!IsReadableStream(x)) {
            throw new TypeError(`${context} is not a ReadableStream.`);
          }
        }
        function AcquireReadableStreamDefaultReader(stream) {
          return new ReadableStreamDefaultReader(stream);
        }
        function ReadableStreamAddReadRequest(stream, readRequest) {
          stream._reader._readRequests.push(readRequest);
        }
        function ReadableStreamFulfillReadRequest(stream, chunk, done) {
          const reader = stream._reader;
          const readRequest = reader._readRequests.shift();
          if (done) {
            readRequest._closeSteps();
          } else {
            readRequest._chunkSteps(chunk);
          }
        }
        function ReadableStreamGetNumReadRequests(stream) {
          return stream._reader._readRequests.length;
        }
        function ReadableStreamHasDefaultReader(stream) {
          const reader = stream._reader;
          if (reader === void 0) {
            return false;
          }
          if (!IsReadableStreamDefaultReader(reader)) {
            return false;
          }
          return true;
        }
        class ReadableStreamDefaultReader {
          constructor(stream) {
            assertRequiredArgument(stream, 1, "ReadableStreamDefaultReader");
            assertReadableStream(stream, "First parameter");
            if (IsReadableStreamLocked(stream)) {
              throw new TypeError("This stream has already been locked for exclusive reading by another reader");
            }
            ReadableStreamReaderGenericInitialize(this, stream);
            this._readRequests = new SimpleQueue();
          }
          get closed() {
            if (!IsReadableStreamDefaultReader(this)) {
              return promiseRejectedWith(defaultReaderBrandCheckException("closed"));
            }
            return this._closedPromise;
          }
          cancel(reason = void 0) {
            if (!IsReadableStreamDefaultReader(this)) {
              return promiseRejectedWith(defaultReaderBrandCheckException("cancel"));
            }
            if (this._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("cancel"));
            }
            return ReadableStreamReaderGenericCancel(this, reason);
          }
          read() {
            if (!IsReadableStreamDefaultReader(this)) {
              return promiseRejectedWith(defaultReaderBrandCheckException("read"));
            }
            if (this._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("read from"));
            }
            let resolvePromise;
            let rejectPromise;
            const promise = newPromise((resolve2, reject) => {
              resolvePromise = resolve2;
              rejectPromise = reject;
            });
            const readRequest = {
              _chunkSteps: (chunk) => resolvePromise({ value: chunk, done: false }),
              _closeSteps: () => resolvePromise({ value: void 0, done: true }),
              _errorSteps: (e) => rejectPromise(e)
            };
            ReadableStreamDefaultReaderRead(this, readRequest);
            return promise;
          }
          releaseLock() {
            if (!IsReadableStreamDefaultReader(this)) {
              throw defaultReaderBrandCheckException("releaseLock");
            }
            if (this._ownerReadableStream === void 0) {
              return;
            }
            if (this._readRequests.length > 0) {
              throw new TypeError("Tried to release a reader lock when that reader has pending read() calls un-settled");
            }
            ReadableStreamReaderGenericRelease(this);
          }
        }
        Object.defineProperties(ReadableStreamDefaultReader.prototype, {
          cancel: { enumerable: true },
          read: { enumerable: true },
          releaseLock: { enumerable: true },
          closed: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStreamDefaultReader.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStreamDefaultReader",
            configurable: true
          });
        }
        function IsReadableStreamDefaultReader(x) {
          if (!typeIsObject(x)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x, "_readRequests")) {
            return false;
          }
          return x instanceof ReadableStreamDefaultReader;
        }
        function ReadableStreamDefaultReaderRead(reader, readRequest) {
          const stream = reader._ownerReadableStream;
          stream._disturbed = true;
          if (stream._state === "closed") {
            readRequest._closeSteps();
          } else if (stream._state === "errored") {
            readRequest._errorSteps(stream._storedError);
          } else {
            stream._readableStreamController[PullSteps](readRequest);
          }
        }
        function defaultReaderBrandCheckException(name) {
          return new TypeError(`ReadableStreamDefaultReader.prototype.${name} can only be used on a ReadableStreamDefaultReader`);
        }
        const AsyncIteratorPrototype = Object.getPrototypeOf(Object.getPrototypeOf(async function* () {
        }).prototype);
        class ReadableStreamAsyncIteratorImpl {
          constructor(reader, preventCancel) {
            this._ongoingPromise = void 0;
            this._isFinished = false;
            this._reader = reader;
            this._preventCancel = preventCancel;
          }
          next() {
            const nextSteps = () => this._nextSteps();
            this._ongoingPromise = this._ongoingPromise ? transformPromiseWith(this._ongoingPromise, nextSteps, nextSteps) : nextSteps();
            return this._ongoingPromise;
          }
          return(value) {
            const returnSteps = () => this._returnSteps(value);
            return this._ongoingPromise ? transformPromiseWith(this._ongoingPromise, returnSteps, returnSteps) : returnSteps();
          }
          _nextSteps() {
            if (this._isFinished) {
              return Promise.resolve({ value: void 0, done: true });
            }
            const reader = this._reader;
            if (reader._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("iterate"));
            }
            let resolvePromise;
            let rejectPromise;
            const promise = newPromise((resolve2, reject) => {
              resolvePromise = resolve2;
              rejectPromise = reject;
            });
            const readRequest = {
              _chunkSteps: (chunk) => {
                this._ongoingPromise = void 0;
                queueMicrotask(() => resolvePromise({ value: chunk, done: false }));
              },
              _closeSteps: () => {
                this._ongoingPromise = void 0;
                this._isFinished = true;
                ReadableStreamReaderGenericRelease(reader);
                resolvePromise({ value: void 0, done: true });
              },
              _errorSteps: (reason) => {
                this._ongoingPromise = void 0;
                this._isFinished = true;
                ReadableStreamReaderGenericRelease(reader);
                rejectPromise(reason);
              }
            };
            ReadableStreamDefaultReaderRead(reader, readRequest);
            return promise;
          }
          _returnSteps(value) {
            if (this._isFinished) {
              return Promise.resolve({ value, done: true });
            }
            this._isFinished = true;
            const reader = this._reader;
            if (reader._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("finish iterating"));
            }
            if (!this._preventCancel) {
              const result = ReadableStreamReaderGenericCancel(reader, value);
              ReadableStreamReaderGenericRelease(reader);
              return transformPromiseWith(result, () => ({ value, done: true }));
            }
            ReadableStreamReaderGenericRelease(reader);
            return promiseResolvedWith({ value, done: true });
          }
        }
        const ReadableStreamAsyncIteratorPrototype = {
          next() {
            if (!IsReadableStreamAsyncIterator(this)) {
              return promiseRejectedWith(streamAsyncIteratorBrandCheckException("next"));
            }
            return this._asyncIteratorImpl.next();
          },
          return(value) {
            if (!IsReadableStreamAsyncIterator(this)) {
              return promiseRejectedWith(streamAsyncIteratorBrandCheckException("return"));
            }
            return this._asyncIteratorImpl.return(value);
          }
        };
        if (AsyncIteratorPrototype !== void 0) {
          Object.setPrototypeOf(ReadableStreamAsyncIteratorPrototype, AsyncIteratorPrototype);
        }
        function AcquireReadableStreamAsyncIterator(stream, preventCancel) {
          const reader = AcquireReadableStreamDefaultReader(stream);
          const impl = new ReadableStreamAsyncIteratorImpl(reader, preventCancel);
          const iterator = Object.create(ReadableStreamAsyncIteratorPrototype);
          iterator._asyncIteratorImpl = impl;
          return iterator;
        }
        function IsReadableStreamAsyncIterator(x) {
          if (!typeIsObject(x)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x, "_asyncIteratorImpl")) {
            return false;
          }
          try {
            return x._asyncIteratorImpl instanceof ReadableStreamAsyncIteratorImpl;
          } catch (_a) {
            return false;
          }
        }
        function streamAsyncIteratorBrandCheckException(name) {
          return new TypeError(`ReadableStreamAsyncIterator.${name} can only be used on a ReadableSteamAsyncIterator`);
        }
        const NumberIsNaN = Number.isNaN || function(x) {
          return x !== x;
        };
        function CreateArrayFromList(elements) {
          return elements.slice();
        }
        function CopyDataBlockBytes(dest, destOffset, src2, srcOffset, n) {
          new Uint8Array(dest).set(new Uint8Array(src2, srcOffset, n), destOffset);
        }
        function TransferArrayBuffer(O) {
          return O;
        }
        function IsDetachedBuffer(O) {
          return false;
        }
        function ArrayBufferSlice(buffer, begin, end) {
          if (buffer.slice) {
            return buffer.slice(begin, end);
          }
          const length = end - begin;
          const slice = new ArrayBuffer(length);
          CopyDataBlockBytes(slice, 0, buffer, begin, length);
          return slice;
        }
        function IsNonNegativeNumber(v) {
          if (typeof v !== "number") {
            return false;
          }
          if (NumberIsNaN(v)) {
            return false;
          }
          if (v < 0) {
            return false;
          }
          return true;
        }
        function CloneAsUint8Array(O) {
          const buffer = ArrayBufferSlice(O.buffer, O.byteOffset, O.byteOffset + O.byteLength);
          return new Uint8Array(buffer);
        }
        function DequeueValue(container) {
          const pair = container._queue.shift();
          container._queueTotalSize -= pair.size;
          if (container._queueTotalSize < 0) {
            container._queueTotalSize = 0;
          }
          return pair.value;
        }
        function EnqueueValueWithSize(container, value, size) {
          if (!IsNonNegativeNumber(size) || size === Infinity) {
            throw new RangeError("Size must be a finite, non-NaN, non-negative number.");
          }
          container._queue.push({ value, size });
          container._queueTotalSize += size;
        }
        function PeekQueueValue(container) {
          const pair = container._queue.peek();
          return pair.value;
        }
        function ResetQueue(container) {
          container._queue = new SimpleQueue();
          container._queueTotalSize = 0;
        }
        class ReadableStreamBYOBRequest {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get view() {
            if (!IsReadableStreamBYOBRequest(this)) {
              throw byobRequestBrandCheckException("view");
            }
            return this._view;
          }
          respond(bytesWritten) {
            if (!IsReadableStreamBYOBRequest(this)) {
              throw byobRequestBrandCheckException("respond");
            }
            assertRequiredArgument(bytesWritten, 1, "respond");
            bytesWritten = convertUnsignedLongLongWithEnforceRange(bytesWritten, "First parameter");
            if (this._associatedReadableByteStreamController === void 0) {
              throw new TypeError("This BYOB request has been invalidated");
            }
            if (IsDetachedBuffer(this._view.buffer))
              ;
            ReadableByteStreamControllerRespond(this._associatedReadableByteStreamController, bytesWritten);
          }
          respondWithNewView(view) {
            if (!IsReadableStreamBYOBRequest(this)) {
              throw byobRequestBrandCheckException("respondWithNewView");
            }
            assertRequiredArgument(view, 1, "respondWithNewView");
            if (!ArrayBuffer.isView(view)) {
              throw new TypeError("You can only respond with array buffer views");
            }
            if (this._associatedReadableByteStreamController === void 0) {
              throw new TypeError("This BYOB request has been invalidated");
            }
            if (IsDetachedBuffer(view.buffer))
              ;
            ReadableByteStreamControllerRespondWithNewView(this._associatedReadableByteStreamController, view);
          }
        }
        Object.defineProperties(ReadableStreamBYOBRequest.prototype, {
          respond: { enumerable: true },
          respondWithNewView: { enumerable: true },
          view: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStreamBYOBRequest.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStreamBYOBRequest",
            configurable: true
          });
        }
        class ReadableByteStreamController {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get byobRequest() {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("byobRequest");
            }
            return ReadableByteStreamControllerGetBYOBRequest(this);
          }
          get desiredSize() {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("desiredSize");
            }
            return ReadableByteStreamControllerGetDesiredSize(this);
          }
          close() {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("close");
            }
            if (this._closeRequested) {
              throw new TypeError("The stream has already been closed; do not close it again!");
            }
            const state = this._controlledReadableByteStream._state;
            if (state !== "readable") {
              throw new TypeError(`The stream (in ${state} state) is not in the readable state and cannot be closed`);
            }
            ReadableByteStreamControllerClose(this);
          }
          enqueue(chunk) {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("enqueue");
            }
            assertRequiredArgument(chunk, 1, "enqueue");
            if (!ArrayBuffer.isView(chunk)) {
              throw new TypeError("chunk must be an array buffer view");
            }
            if (chunk.byteLength === 0) {
              throw new TypeError("chunk must have non-zero byteLength");
            }
            if (chunk.buffer.byteLength === 0) {
              throw new TypeError(`chunk's buffer must have non-zero byteLength`);
            }
            if (this._closeRequested) {
              throw new TypeError("stream is closed or draining");
            }
            const state = this._controlledReadableByteStream._state;
            if (state !== "readable") {
              throw new TypeError(`The stream (in ${state} state) is not in the readable state and cannot be enqueued to`);
            }
            ReadableByteStreamControllerEnqueue(this, chunk);
          }
          error(e = void 0) {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("error");
            }
            ReadableByteStreamControllerError(this, e);
          }
          [CancelSteps](reason) {
            ReadableByteStreamControllerClearPendingPullIntos(this);
            ResetQueue(this);
            const result = this._cancelAlgorithm(reason);
            ReadableByteStreamControllerClearAlgorithms(this);
            return result;
          }
          [PullSteps](readRequest) {
            const stream = this._controlledReadableByteStream;
            if (this._queueTotalSize > 0) {
              const entry = this._queue.shift();
              this._queueTotalSize -= entry.byteLength;
              ReadableByteStreamControllerHandleQueueDrain(this);
              const view = new Uint8Array(entry.buffer, entry.byteOffset, entry.byteLength);
              readRequest._chunkSteps(view);
              return;
            }
            const autoAllocateChunkSize = this._autoAllocateChunkSize;
            if (autoAllocateChunkSize !== void 0) {
              let buffer;
              try {
                buffer = new ArrayBuffer(autoAllocateChunkSize);
              } catch (bufferE) {
                readRequest._errorSteps(bufferE);
                return;
              }
              const pullIntoDescriptor = {
                buffer,
                bufferByteLength: autoAllocateChunkSize,
                byteOffset: 0,
                byteLength: autoAllocateChunkSize,
                bytesFilled: 0,
                elementSize: 1,
                viewConstructor: Uint8Array,
                readerType: "default"
              };
              this._pendingPullIntos.push(pullIntoDescriptor);
            }
            ReadableStreamAddReadRequest(stream, readRequest);
            ReadableByteStreamControllerCallPullIfNeeded(this);
          }
        }
        Object.defineProperties(ReadableByteStreamController.prototype, {
          close: { enumerable: true },
          enqueue: { enumerable: true },
          error: { enumerable: true },
          byobRequest: { enumerable: true },
          desiredSize: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableByteStreamController.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableByteStreamController",
            configurable: true
          });
        }
        function IsReadableByteStreamController(x) {
          if (!typeIsObject(x)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x, "_controlledReadableByteStream")) {
            return false;
          }
          return x instanceof ReadableByteStreamController;
        }
        function IsReadableStreamBYOBRequest(x) {
          if (!typeIsObject(x)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x, "_associatedReadableByteStreamController")) {
            return false;
          }
          return x instanceof ReadableStreamBYOBRequest;
        }
        function ReadableByteStreamControllerCallPullIfNeeded(controller) {
          const shouldPull = ReadableByteStreamControllerShouldCallPull(controller);
          if (!shouldPull) {
            return;
          }
          if (controller._pulling) {
            controller._pullAgain = true;
            return;
          }
          controller._pulling = true;
          const pullPromise = controller._pullAlgorithm();
          uponPromise(pullPromise, () => {
            controller._pulling = false;
            if (controller._pullAgain) {
              controller._pullAgain = false;
              ReadableByteStreamControllerCallPullIfNeeded(controller);
            }
          }, (e) => {
            ReadableByteStreamControllerError(controller, e);
          });
        }
        function ReadableByteStreamControllerClearPendingPullIntos(controller) {
          ReadableByteStreamControllerInvalidateBYOBRequest(controller);
          controller._pendingPullIntos = new SimpleQueue();
        }
        function ReadableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor) {
          let done = false;
          if (stream._state === "closed") {
            done = true;
          }
          const filledView = ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
          if (pullIntoDescriptor.readerType === "default") {
            ReadableStreamFulfillReadRequest(stream, filledView, done);
          } else {
            ReadableStreamFulfillReadIntoRequest(stream, filledView, done);
          }
        }
        function ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor) {
          const bytesFilled = pullIntoDescriptor.bytesFilled;
          const elementSize = pullIntoDescriptor.elementSize;
          return new pullIntoDescriptor.viewConstructor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, bytesFilled / elementSize);
        }
        function ReadableByteStreamControllerEnqueueChunkToQueue(controller, buffer, byteOffset, byteLength) {
          controller._queue.push({ buffer, byteOffset, byteLength });
          controller._queueTotalSize += byteLength;
        }
        function ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor) {
          const elementSize = pullIntoDescriptor.elementSize;
          const currentAlignedBytes = pullIntoDescriptor.bytesFilled - pullIntoDescriptor.bytesFilled % elementSize;
          const maxBytesToCopy = Math.min(controller._queueTotalSize, pullIntoDescriptor.byteLength - pullIntoDescriptor.bytesFilled);
          const maxBytesFilled = pullIntoDescriptor.bytesFilled + maxBytesToCopy;
          const maxAlignedBytes = maxBytesFilled - maxBytesFilled % elementSize;
          let totalBytesToCopyRemaining = maxBytesToCopy;
          let ready = false;
          if (maxAlignedBytes > currentAlignedBytes) {
            totalBytesToCopyRemaining = maxAlignedBytes - pullIntoDescriptor.bytesFilled;
            ready = true;
          }
          const queue = controller._queue;
          while (totalBytesToCopyRemaining > 0) {
            const headOfQueue = queue.peek();
            const bytesToCopy = Math.min(totalBytesToCopyRemaining, headOfQueue.byteLength);
            const destStart = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
            CopyDataBlockBytes(pullIntoDescriptor.buffer, destStart, headOfQueue.buffer, headOfQueue.byteOffset, bytesToCopy);
            if (headOfQueue.byteLength === bytesToCopy) {
              queue.shift();
            } else {
              headOfQueue.byteOffset += bytesToCopy;
              headOfQueue.byteLength -= bytesToCopy;
            }
            controller._queueTotalSize -= bytesToCopy;
            ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesToCopy, pullIntoDescriptor);
            totalBytesToCopyRemaining -= bytesToCopy;
          }
          return ready;
        }
        function ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, size, pullIntoDescriptor) {
          pullIntoDescriptor.bytesFilled += size;
        }
        function ReadableByteStreamControllerHandleQueueDrain(controller) {
          if (controller._queueTotalSize === 0 && controller._closeRequested) {
            ReadableByteStreamControllerClearAlgorithms(controller);
            ReadableStreamClose(controller._controlledReadableByteStream);
          } else {
            ReadableByteStreamControllerCallPullIfNeeded(controller);
          }
        }
        function ReadableByteStreamControllerInvalidateBYOBRequest(controller) {
          if (controller._byobRequest === null) {
            return;
          }
          controller._byobRequest._associatedReadableByteStreamController = void 0;
          controller._byobRequest._view = null;
          controller._byobRequest = null;
        }
        function ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller) {
          while (controller._pendingPullIntos.length > 0) {
            if (controller._queueTotalSize === 0) {
              return;
            }
            const pullIntoDescriptor = controller._pendingPullIntos.peek();
            if (ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor)) {
              ReadableByteStreamControllerShiftPendingPullInto(controller);
              ReadableByteStreamControllerCommitPullIntoDescriptor(controller._controlledReadableByteStream, pullIntoDescriptor);
            }
          }
        }
        function ReadableByteStreamControllerPullInto(controller, view, readIntoRequest) {
          const stream = controller._controlledReadableByteStream;
          let elementSize = 1;
          if (view.constructor !== DataView) {
            elementSize = view.constructor.BYTES_PER_ELEMENT;
          }
          const ctor = view.constructor;
          const buffer = TransferArrayBuffer(view.buffer);
          const pullIntoDescriptor = {
            buffer,
            bufferByteLength: buffer.byteLength,
            byteOffset: view.byteOffset,
            byteLength: view.byteLength,
            bytesFilled: 0,
            elementSize,
            viewConstructor: ctor,
            readerType: "byob"
          };
          if (controller._pendingPullIntos.length > 0) {
            controller._pendingPullIntos.push(pullIntoDescriptor);
            ReadableStreamAddReadIntoRequest(stream, readIntoRequest);
            return;
          }
          if (stream._state === "closed") {
            const emptyView = new ctor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, 0);
            readIntoRequest._closeSteps(emptyView);
            return;
          }
          if (controller._queueTotalSize > 0) {
            if (ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor)) {
              const filledView = ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
              ReadableByteStreamControllerHandleQueueDrain(controller);
              readIntoRequest._chunkSteps(filledView);
              return;
            }
            if (controller._closeRequested) {
              const e = new TypeError("Insufficient bytes to fill elements in the given buffer");
              ReadableByteStreamControllerError(controller, e);
              readIntoRequest._errorSteps(e);
              return;
            }
          }
          controller._pendingPullIntos.push(pullIntoDescriptor);
          ReadableStreamAddReadIntoRequest(stream, readIntoRequest);
          ReadableByteStreamControllerCallPullIfNeeded(controller);
        }
        function ReadableByteStreamControllerRespondInClosedState(controller, firstDescriptor) {
          const stream = controller._controlledReadableByteStream;
          if (ReadableStreamHasBYOBReader(stream)) {
            while (ReadableStreamGetNumReadIntoRequests(stream) > 0) {
              const pullIntoDescriptor = ReadableByteStreamControllerShiftPendingPullInto(controller);
              ReadableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor);
            }
          }
        }
        function ReadableByteStreamControllerRespondInReadableState(controller, bytesWritten, pullIntoDescriptor) {
          ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesWritten, pullIntoDescriptor);
          if (pullIntoDescriptor.bytesFilled < pullIntoDescriptor.elementSize) {
            return;
          }
          ReadableByteStreamControllerShiftPendingPullInto(controller);
          const remainderSize = pullIntoDescriptor.bytesFilled % pullIntoDescriptor.elementSize;
          if (remainderSize > 0) {
            const end = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
            const remainder = ArrayBufferSlice(pullIntoDescriptor.buffer, end - remainderSize, end);
            ReadableByteStreamControllerEnqueueChunkToQueue(controller, remainder, 0, remainder.byteLength);
          }
          pullIntoDescriptor.bytesFilled -= remainderSize;
          ReadableByteStreamControllerCommitPullIntoDescriptor(controller._controlledReadableByteStream, pullIntoDescriptor);
          ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
        }
        function ReadableByteStreamControllerRespondInternal(controller, bytesWritten) {
          const firstDescriptor = controller._pendingPullIntos.peek();
          ReadableByteStreamControllerInvalidateBYOBRequest(controller);
          const state = controller._controlledReadableByteStream._state;
          if (state === "closed") {
            ReadableByteStreamControllerRespondInClosedState(controller);
          } else {
            ReadableByteStreamControllerRespondInReadableState(controller, bytesWritten, firstDescriptor);
          }
          ReadableByteStreamControllerCallPullIfNeeded(controller);
        }
        function ReadableByteStreamControllerShiftPendingPullInto(controller) {
          const descriptor = controller._pendingPullIntos.shift();
          return descriptor;
        }
        function ReadableByteStreamControllerShouldCallPull(controller) {
          const stream = controller._controlledReadableByteStream;
          if (stream._state !== "readable") {
            return false;
          }
          if (controller._closeRequested) {
            return false;
          }
          if (!controller._started) {
            return false;
          }
          if (ReadableStreamHasDefaultReader(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
            return true;
          }
          if (ReadableStreamHasBYOBReader(stream) && ReadableStreamGetNumReadIntoRequests(stream) > 0) {
            return true;
          }
          const desiredSize = ReadableByteStreamControllerGetDesiredSize(controller);
          if (desiredSize > 0) {
            return true;
          }
          return false;
        }
        function ReadableByteStreamControllerClearAlgorithms(controller) {
          controller._pullAlgorithm = void 0;
          controller._cancelAlgorithm = void 0;
        }
        function ReadableByteStreamControllerClose(controller) {
          const stream = controller._controlledReadableByteStream;
          if (controller._closeRequested || stream._state !== "readable") {
            return;
          }
          if (controller._queueTotalSize > 0) {
            controller._closeRequested = true;
            return;
          }
          if (controller._pendingPullIntos.length > 0) {
            const firstPendingPullInto = controller._pendingPullIntos.peek();
            if (firstPendingPullInto.bytesFilled > 0) {
              const e = new TypeError("Insufficient bytes to fill elements in the given buffer");
              ReadableByteStreamControllerError(controller, e);
              throw e;
            }
          }
          ReadableByteStreamControllerClearAlgorithms(controller);
          ReadableStreamClose(stream);
        }
        function ReadableByteStreamControllerEnqueue(controller, chunk) {
          const stream = controller._controlledReadableByteStream;
          if (controller._closeRequested || stream._state !== "readable") {
            return;
          }
          const buffer = chunk.buffer;
          const byteOffset = chunk.byteOffset;
          const byteLength = chunk.byteLength;
          const transferredBuffer = TransferArrayBuffer(buffer);
          if (controller._pendingPullIntos.length > 0) {
            const firstPendingPullInto = controller._pendingPullIntos.peek();
            if (IsDetachedBuffer(firstPendingPullInto.buffer))
              ;
            firstPendingPullInto.buffer = TransferArrayBuffer(firstPendingPullInto.buffer);
          }
          ReadableByteStreamControllerInvalidateBYOBRequest(controller);
          if (ReadableStreamHasDefaultReader(stream)) {
            if (ReadableStreamGetNumReadRequests(stream) === 0) {
              ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
            } else {
              const transferredView = new Uint8Array(transferredBuffer, byteOffset, byteLength);
              ReadableStreamFulfillReadRequest(stream, transferredView, false);
            }
          } else if (ReadableStreamHasBYOBReader(stream)) {
            ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
            ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
          } else {
            ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
          }
          ReadableByteStreamControllerCallPullIfNeeded(controller);
        }
        function ReadableByteStreamControllerError(controller, e) {
          const stream = controller._controlledReadableByteStream;
          if (stream._state !== "readable") {
            return;
          }
          ReadableByteStreamControllerClearPendingPullIntos(controller);
          ResetQueue(controller);
          ReadableByteStreamControllerClearAlgorithms(controller);
          ReadableStreamError(stream, e);
        }
        function ReadableByteStreamControllerGetBYOBRequest(controller) {
          if (controller._byobRequest === null && controller._pendingPullIntos.length > 0) {
            const firstDescriptor = controller._pendingPullIntos.peek();
            const view = new Uint8Array(firstDescriptor.buffer, firstDescriptor.byteOffset + firstDescriptor.bytesFilled, firstDescriptor.byteLength - firstDescriptor.bytesFilled);
            const byobRequest = Object.create(ReadableStreamBYOBRequest.prototype);
            SetUpReadableStreamBYOBRequest(byobRequest, controller, view);
            controller._byobRequest = byobRequest;
          }
          return controller._byobRequest;
        }
        function ReadableByteStreamControllerGetDesiredSize(controller) {
          const state = controller._controlledReadableByteStream._state;
          if (state === "errored") {
            return null;
          }
          if (state === "closed") {
            return 0;
          }
          return controller._strategyHWM - controller._queueTotalSize;
        }
        function ReadableByteStreamControllerRespond(controller, bytesWritten) {
          const firstDescriptor = controller._pendingPullIntos.peek();
          const state = controller._controlledReadableByteStream._state;
          if (state === "closed") {
            if (bytesWritten !== 0) {
              throw new TypeError("bytesWritten must be 0 when calling respond() on a closed stream");
            }
          } else {
            if (bytesWritten === 0) {
              throw new TypeError("bytesWritten must be greater than 0 when calling respond() on a readable stream");
            }
            if (firstDescriptor.bytesFilled + bytesWritten > firstDescriptor.byteLength) {
              throw new RangeError("bytesWritten out of range");
            }
          }
          firstDescriptor.buffer = TransferArrayBuffer(firstDescriptor.buffer);
          ReadableByteStreamControllerRespondInternal(controller, bytesWritten);
        }
        function ReadableByteStreamControllerRespondWithNewView(controller, view) {
          const firstDescriptor = controller._pendingPullIntos.peek();
          const state = controller._controlledReadableByteStream._state;
          if (state === "closed") {
            if (view.byteLength !== 0) {
              throw new TypeError("The view's length must be 0 when calling respondWithNewView() on a closed stream");
            }
          } else {
            if (view.byteLength === 0) {
              throw new TypeError("The view's length must be greater than 0 when calling respondWithNewView() on a readable stream");
            }
          }
          if (firstDescriptor.byteOffset + firstDescriptor.bytesFilled !== view.byteOffset) {
            throw new RangeError("The region specified by view does not match byobRequest");
          }
          if (firstDescriptor.bufferByteLength !== view.buffer.byteLength) {
            throw new RangeError("The buffer of view has different capacity than byobRequest");
          }
          if (firstDescriptor.bytesFilled + view.byteLength > firstDescriptor.byteLength) {
            throw new RangeError("The region specified by view is larger than byobRequest");
          }
          firstDescriptor.buffer = TransferArrayBuffer(view.buffer);
          ReadableByteStreamControllerRespondInternal(controller, view.byteLength);
        }
        function SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, autoAllocateChunkSize) {
          controller._controlledReadableByteStream = stream;
          controller._pullAgain = false;
          controller._pulling = false;
          controller._byobRequest = null;
          controller._queue = controller._queueTotalSize = void 0;
          ResetQueue(controller);
          controller._closeRequested = false;
          controller._started = false;
          controller._strategyHWM = highWaterMark;
          controller._pullAlgorithm = pullAlgorithm;
          controller._cancelAlgorithm = cancelAlgorithm;
          controller._autoAllocateChunkSize = autoAllocateChunkSize;
          controller._pendingPullIntos = new SimpleQueue();
          stream._readableStreamController = controller;
          const startResult = startAlgorithm();
          uponPromise(promiseResolvedWith(startResult), () => {
            controller._started = true;
            ReadableByteStreamControllerCallPullIfNeeded(controller);
          }, (r) => {
            ReadableByteStreamControllerError(controller, r);
          });
        }
        function SetUpReadableByteStreamControllerFromUnderlyingSource(stream, underlyingByteSource, highWaterMark) {
          const controller = Object.create(ReadableByteStreamController.prototype);
          let startAlgorithm = () => void 0;
          let pullAlgorithm = () => promiseResolvedWith(void 0);
          let cancelAlgorithm = () => promiseResolvedWith(void 0);
          if (underlyingByteSource.start !== void 0) {
            startAlgorithm = () => underlyingByteSource.start(controller);
          }
          if (underlyingByteSource.pull !== void 0) {
            pullAlgorithm = () => underlyingByteSource.pull(controller);
          }
          if (underlyingByteSource.cancel !== void 0) {
            cancelAlgorithm = (reason) => underlyingByteSource.cancel(reason);
          }
          const autoAllocateChunkSize = underlyingByteSource.autoAllocateChunkSize;
          if (autoAllocateChunkSize === 0) {
            throw new TypeError("autoAllocateChunkSize must be greater than 0");
          }
          SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, autoAllocateChunkSize);
        }
        function SetUpReadableStreamBYOBRequest(request, controller, view) {
          request._associatedReadableByteStreamController = controller;
          request._view = view;
        }
        function byobRequestBrandCheckException(name) {
          return new TypeError(`ReadableStreamBYOBRequest.prototype.${name} can only be used on a ReadableStreamBYOBRequest`);
        }
        function byteStreamControllerBrandCheckException(name) {
          return new TypeError(`ReadableByteStreamController.prototype.${name} can only be used on a ReadableByteStreamController`);
        }
        function AcquireReadableStreamBYOBReader(stream) {
          return new ReadableStreamBYOBReader(stream);
        }
        function ReadableStreamAddReadIntoRequest(stream, readIntoRequest) {
          stream._reader._readIntoRequests.push(readIntoRequest);
        }
        function ReadableStreamFulfillReadIntoRequest(stream, chunk, done) {
          const reader = stream._reader;
          const readIntoRequest = reader._readIntoRequests.shift();
          if (done) {
            readIntoRequest._closeSteps(chunk);
          } else {
            readIntoRequest._chunkSteps(chunk);
          }
        }
        function ReadableStreamGetNumReadIntoRequests(stream) {
          return stream._reader._readIntoRequests.length;
        }
        function ReadableStreamHasBYOBReader(stream) {
          const reader = stream._reader;
          if (reader === void 0) {
            return false;
          }
          if (!IsReadableStreamBYOBReader(reader)) {
            return false;
          }
          return true;
        }
        class ReadableStreamBYOBReader {
          constructor(stream) {
            assertRequiredArgument(stream, 1, "ReadableStreamBYOBReader");
            assertReadableStream(stream, "First parameter");
            if (IsReadableStreamLocked(stream)) {
              throw new TypeError("This stream has already been locked for exclusive reading by another reader");
            }
            if (!IsReadableByteStreamController(stream._readableStreamController)) {
              throw new TypeError("Cannot construct a ReadableStreamBYOBReader for a stream not constructed with a byte source");
            }
            ReadableStreamReaderGenericInitialize(this, stream);
            this._readIntoRequests = new SimpleQueue();
          }
          get closed() {
            if (!IsReadableStreamBYOBReader(this)) {
              return promiseRejectedWith(byobReaderBrandCheckException("closed"));
            }
            return this._closedPromise;
          }
          cancel(reason = void 0) {
            if (!IsReadableStreamBYOBReader(this)) {
              return promiseRejectedWith(byobReaderBrandCheckException("cancel"));
            }
            if (this._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("cancel"));
            }
            return ReadableStreamReaderGenericCancel(this, reason);
          }
          read(view) {
            if (!IsReadableStreamBYOBReader(this)) {
              return promiseRejectedWith(byobReaderBrandCheckException("read"));
            }
            if (!ArrayBuffer.isView(view)) {
              return promiseRejectedWith(new TypeError("view must be an array buffer view"));
            }
            if (view.byteLength === 0) {
              return promiseRejectedWith(new TypeError("view must have non-zero byteLength"));
            }
            if (view.buffer.byteLength === 0) {
              return promiseRejectedWith(new TypeError(`view's buffer must have non-zero byteLength`));
            }
            if (IsDetachedBuffer(view.buffer))
              ;
            if (this._ownerReadableStream === void 0) {
              return promiseRejectedWith(readerLockException("read from"));
            }
            let resolvePromise;
            let rejectPromise;
            const promise = newPromise((resolve2, reject) => {
              resolvePromise = resolve2;
              rejectPromise = reject;
            });
            const readIntoRequest = {
              _chunkSteps: (chunk) => resolvePromise({ value: chunk, done: false }),
              _closeSteps: (chunk) => resolvePromise({ value: chunk, done: true }),
              _errorSteps: (e) => rejectPromise(e)
            };
            ReadableStreamBYOBReaderRead(this, view, readIntoRequest);
            return promise;
          }
          releaseLock() {
            if (!IsReadableStreamBYOBReader(this)) {
              throw byobReaderBrandCheckException("releaseLock");
            }
            if (this._ownerReadableStream === void 0) {
              return;
            }
            if (this._readIntoRequests.length > 0) {
              throw new TypeError("Tried to release a reader lock when that reader has pending read() calls un-settled");
            }
            ReadableStreamReaderGenericRelease(this);
          }
        }
        Object.defineProperties(ReadableStreamBYOBReader.prototype, {
          cancel: { enumerable: true },
          read: { enumerable: true },
          releaseLock: { enumerable: true },
          closed: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStreamBYOBReader.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStreamBYOBReader",
            configurable: true
          });
        }
        function IsReadableStreamBYOBReader(x) {
          if (!typeIsObject(x)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x, "_readIntoRequests")) {
            return false;
          }
          return x instanceof ReadableStreamBYOBReader;
        }
        function ReadableStreamBYOBReaderRead(reader, view, readIntoRequest) {
          const stream = reader._ownerReadableStream;
          stream._disturbed = true;
          if (stream._state === "errored") {
            readIntoRequest._errorSteps(stream._storedError);
          } else {
            ReadableByteStreamControllerPullInto(stream._readableStreamController, view, readIntoRequest);
          }
        }
        function byobReaderBrandCheckException(name) {
          return new TypeError(`ReadableStreamBYOBReader.prototype.${name} can only be used on a ReadableStreamBYOBReader`);
        }
        function ExtractHighWaterMark(strategy, defaultHWM) {
          const { highWaterMark } = strategy;
          if (highWaterMark === void 0) {
            return defaultHWM;
          }
          if (NumberIsNaN(highWaterMark) || highWaterMark < 0) {
            throw new RangeError("Invalid highWaterMark");
          }
          return highWaterMark;
        }
        function ExtractSizeAlgorithm(strategy) {
          const { size } = strategy;
          if (!size) {
            return () => 1;
          }
          return size;
        }
        function convertQueuingStrategy(init2, context) {
          assertDictionary(init2, context);
          const highWaterMark = init2 === null || init2 === void 0 ? void 0 : init2.highWaterMark;
          const size = init2 === null || init2 === void 0 ? void 0 : init2.size;
          return {
            highWaterMark: highWaterMark === void 0 ? void 0 : convertUnrestrictedDouble(highWaterMark),
            size: size === void 0 ? void 0 : convertQueuingStrategySize(size, `${context} has member 'size' that`)
          };
        }
        function convertQueuingStrategySize(fn, context) {
          assertFunction(fn, context);
          return (chunk) => convertUnrestrictedDouble(fn(chunk));
        }
        function convertUnderlyingSink(original, context) {
          assertDictionary(original, context);
          const abort = original === null || original === void 0 ? void 0 : original.abort;
          const close = original === null || original === void 0 ? void 0 : original.close;
          const start = original === null || original === void 0 ? void 0 : original.start;
          const type = original === null || original === void 0 ? void 0 : original.type;
          const write = original === null || original === void 0 ? void 0 : original.write;
          return {
            abort: abort === void 0 ? void 0 : convertUnderlyingSinkAbortCallback(abort, original, `${context} has member 'abort' that`),
            close: close === void 0 ? void 0 : convertUnderlyingSinkCloseCallback(close, original, `${context} has member 'close' that`),
            start: start === void 0 ? void 0 : convertUnderlyingSinkStartCallback(start, original, `${context} has member 'start' that`),
            write: write === void 0 ? void 0 : convertUnderlyingSinkWriteCallback(write, original, `${context} has member 'write' that`),
            type
          };
        }
        function convertUnderlyingSinkAbortCallback(fn, original, context) {
          assertFunction(fn, context);
          return (reason) => promiseCall(fn, original, [reason]);
        }
        function convertUnderlyingSinkCloseCallback(fn, original, context) {
          assertFunction(fn, context);
          return () => promiseCall(fn, original, []);
        }
        function convertUnderlyingSinkStartCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => reflectCall(fn, original, [controller]);
        }
        function convertUnderlyingSinkWriteCallback(fn, original, context) {
          assertFunction(fn, context);
          return (chunk, controller) => promiseCall(fn, original, [chunk, controller]);
        }
        function assertWritableStream(x, context) {
          if (!IsWritableStream(x)) {
            throw new TypeError(`${context} is not a WritableStream.`);
          }
        }
        function isAbortSignal2(value) {
          if (typeof value !== "object" || value === null) {
            return false;
          }
          try {
            return typeof value.aborted === "boolean";
          } catch (_a) {
            return false;
          }
        }
        const supportsAbortController = typeof AbortController === "function";
        function createAbortController() {
          if (supportsAbortController) {
            return new AbortController();
          }
          return void 0;
        }
        class WritableStream {
          constructor(rawUnderlyingSink = {}, rawStrategy = {}) {
            if (rawUnderlyingSink === void 0) {
              rawUnderlyingSink = null;
            } else {
              assertObject(rawUnderlyingSink, "First parameter");
            }
            const strategy = convertQueuingStrategy(rawStrategy, "Second parameter");
            const underlyingSink = convertUnderlyingSink(rawUnderlyingSink, "First parameter");
            InitializeWritableStream(this);
            const type = underlyingSink.type;
            if (type !== void 0) {
              throw new RangeError("Invalid type is specified");
            }
            const sizeAlgorithm = ExtractSizeAlgorithm(strategy);
            const highWaterMark = ExtractHighWaterMark(strategy, 1);
            SetUpWritableStreamDefaultControllerFromUnderlyingSink(this, underlyingSink, highWaterMark, sizeAlgorithm);
          }
          get locked() {
            if (!IsWritableStream(this)) {
              throw streamBrandCheckException$2("locked");
            }
            return IsWritableStreamLocked(this);
          }
          abort(reason = void 0) {
            if (!IsWritableStream(this)) {
              return promiseRejectedWith(streamBrandCheckException$2("abort"));
            }
            if (IsWritableStreamLocked(this)) {
              return promiseRejectedWith(new TypeError("Cannot abort a stream that already has a writer"));
            }
            return WritableStreamAbort(this, reason);
          }
          close() {
            if (!IsWritableStream(this)) {
              return promiseRejectedWith(streamBrandCheckException$2("close"));
            }
            if (IsWritableStreamLocked(this)) {
              return promiseRejectedWith(new TypeError("Cannot close a stream that already has a writer"));
            }
            if (WritableStreamCloseQueuedOrInFlight(this)) {
              return promiseRejectedWith(new TypeError("Cannot close an already-closing stream"));
            }
            return WritableStreamClose(this);
          }
          getWriter() {
            if (!IsWritableStream(this)) {
              throw streamBrandCheckException$2("getWriter");
            }
            return AcquireWritableStreamDefaultWriter(this);
          }
        }
        Object.defineProperties(WritableStream.prototype, {
          abort: { enumerable: true },
          close: { enumerable: true },
          getWriter: { enumerable: true },
          locked: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(WritableStream.prototype, SymbolPolyfill.toStringTag, {
            value: "WritableStream",
            configurable: true
          });
        }
        function AcquireWritableStreamDefaultWriter(stream) {
          return new WritableStreamDefaultWriter(stream);
        }
        function CreateWritableStream(startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark = 1, sizeAlgorithm = () => 1) {
          const stream = Object.create(WritableStream.prototype);
          InitializeWritableStream(stream);
          const controller = Object.create(WritableStreamDefaultController.prototype);
          SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm);
          return stream;
        }
        function InitializeWritableStream(stream) {
          stream._state = "writable";
          stream._storedError = void 0;
          stream._writer = void 0;
          stream._writableStreamController = void 0;
          stream._writeRequests = new SimpleQueue();
          stream._inFlightWriteRequest = void 0;
          stream._closeRequest = void 0;
          stream._inFlightCloseRequest = void 0;
          stream._pendingAbortRequest = void 0;
          stream._backpressure = false;
        }
        function IsWritableStream(x) {
          if (!typeIsObject(x)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x, "_writableStreamController")) {
            return false;
          }
          return x instanceof WritableStream;
        }
        function IsWritableStreamLocked(stream) {
          if (stream._writer === void 0) {
            return false;
          }
          return true;
        }
        function WritableStreamAbort(stream, reason) {
          var _a;
          if (stream._state === "closed" || stream._state === "errored") {
            return promiseResolvedWith(void 0);
          }
          stream._writableStreamController._abortReason = reason;
          (_a = stream._writableStreamController._abortController) === null || _a === void 0 ? void 0 : _a.abort();
          const state = stream._state;
          if (state === "closed" || state === "errored") {
            return promiseResolvedWith(void 0);
          }
          if (stream._pendingAbortRequest !== void 0) {
            return stream._pendingAbortRequest._promise;
          }
          let wasAlreadyErroring = false;
          if (state === "erroring") {
            wasAlreadyErroring = true;
            reason = void 0;
          }
          const promise = newPromise((resolve2, reject) => {
            stream._pendingAbortRequest = {
              _promise: void 0,
              _resolve: resolve2,
              _reject: reject,
              _reason: reason,
              _wasAlreadyErroring: wasAlreadyErroring
            };
          });
          stream._pendingAbortRequest._promise = promise;
          if (!wasAlreadyErroring) {
            WritableStreamStartErroring(stream, reason);
          }
          return promise;
        }
        function WritableStreamClose(stream) {
          const state = stream._state;
          if (state === "closed" || state === "errored") {
            return promiseRejectedWith(new TypeError(`The stream (in ${state} state) is not in the writable state and cannot be closed`));
          }
          const promise = newPromise((resolve2, reject) => {
            const closeRequest = {
              _resolve: resolve2,
              _reject: reject
            };
            stream._closeRequest = closeRequest;
          });
          const writer = stream._writer;
          if (writer !== void 0 && stream._backpressure && state === "writable") {
            defaultWriterReadyPromiseResolve(writer);
          }
          WritableStreamDefaultControllerClose(stream._writableStreamController);
          return promise;
        }
        function WritableStreamAddWriteRequest(stream) {
          const promise = newPromise((resolve2, reject) => {
            const writeRequest = {
              _resolve: resolve2,
              _reject: reject
            };
            stream._writeRequests.push(writeRequest);
          });
          return promise;
        }
        function WritableStreamDealWithRejection(stream, error2) {
          const state = stream._state;
          if (state === "writable") {
            WritableStreamStartErroring(stream, error2);
            return;
          }
          WritableStreamFinishErroring(stream);
        }
        function WritableStreamStartErroring(stream, reason) {
          const controller = stream._writableStreamController;
          stream._state = "erroring";
          stream._storedError = reason;
          const writer = stream._writer;
          if (writer !== void 0) {
            WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, reason);
          }
          if (!WritableStreamHasOperationMarkedInFlight(stream) && controller._started) {
            WritableStreamFinishErroring(stream);
          }
        }
        function WritableStreamFinishErroring(stream) {
          stream._state = "errored";
          stream._writableStreamController[ErrorSteps]();
          const storedError = stream._storedError;
          stream._writeRequests.forEach((writeRequest) => {
            writeRequest._reject(storedError);
          });
          stream._writeRequests = new SimpleQueue();
          if (stream._pendingAbortRequest === void 0) {
            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
            return;
          }
          const abortRequest = stream._pendingAbortRequest;
          stream._pendingAbortRequest = void 0;
          if (abortRequest._wasAlreadyErroring) {
            abortRequest._reject(storedError);
            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
            return;
          }
          const promise = stream._writableStreamController[AbortSteps](abortRequest._reason);
          uponPromise(promise, () => {
            abortRequest._resolve();
            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
          }, (reason) => {
            abortRequest._reject(reason);
            WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
          });
        }
        function WritableStreamFinishInFlightWrite(stream) {
          stream._inFlightWriteRequest._resolve(void 0);
          stream._inFlightWriteRequest = void 0;
        }
        function WritableStreamFinishInFlightWriteWithError(stream, error2) {
          stream._inFlightWriteRequest._reject(error2);
          stream._inFlightWriteRequest = void 0;
          WritableStreamDealWithRejection(stream, error2);
        }
        function WritableStreamFinishInFlightClose(stream) {
          stream._inFlightCloseRequest._resolve(void 0);
          stream._inFlightCloseRequest = void 0;
          const state = stream._state;
          if (state === "erroring") {
            stream._storedError = void 0;
            if (stream._pendingAbortRequest !== void 0) {
              stream._pendingAbortRequest._resolve();
              stream._pendingAbortRequest = void 0;
            }
          }
          stream._state = "closed";
          const writer = stream._writer;
          if (writer !== void 0) {
            defaultWriterClosedPromiseResolve(writer);
          }
        }
        function WritableStreamFinishInFlightCloseWithError(stream, error2) {
          stream._inFlightCloseRequest._reject(error2);
          stream._inFlightCloseRequest = void 0;
          if (stream._pendingAbortRequest !== void 0) {
            stream._pendingAbortRequest._reject(error2);
            stream._pendingAbortRequest = void 0;
          }
          WritableStreamDealWithRejection(stream, error2);
        }
        function WritableStreamCloseQueuedOrInFlight(stream) {
          if (stream._closeRequest === void 0 && stream._inFlightCloseRequest === void 0) {
            return false;
          }
          return true;
        }
        function WritableStreamHasOperationMarkedInFlight(stream) {
          if (stream._inFlightWriteRequest === void 0 && stream._inFlightCloseRequest === void 0) {
            return false;
          }
          return true;
        }
        function WritableStreamMarkCloseRequestInFlight(stream) {
          stream._inFlightCloseRequest = stream._closeRequest;
          stream._closeRequest = void 0;
        }
        function WritableStreamMarkFirstWriteRequestInFlight(stream) {
          stream._inFlightWriteRequest = stream._writeRequests.shift();
        }
        function WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream) {
          if (stream._closeRequest !== void 0) {
            stream._closeRequest._reject(stream._storedError);
            stream._closeRequest = void 0;
          }
          const writer = stream._writer;
          if (writer !== void 0) {
            defaultWriterClosedPromiseReject(writer, stream._storedError);
          }
        }
        function WritableStreamUpdateBackpressure(stream, backpressure) {
          const writer = stream._writer;
          if (writer !== void 0 && backpressure !== stream._backpressure) {
            if (backpressure) {
              defaultWriterReadyPromiseReset(writer);
            } else {
              defaultWriterReadyPromiseResolve(writer);
            }
          }
          stream._backpressure = backpressure;
        }
        class WritableStreamDefaultWriter {
          constructor(stream) {
            assertRequiredArgument(stream, 1, "WritableStreamDefaultWriter");
            assertWritableStream(stream, "First parameter");
            if (IsWritableStreamLocked(stream)) {
              throw new TypeError("This stream has already been locked for exclusive writing by another writer");
            }
            this._ownerWritableStream = stream;
            stream._writer = this;
            const state = stream._state;
            if (state === "writable") {
              if (!WritableStreamCloseQueuedOrInFlight(stream) && stream._backpressure) {
                defaultWriterReadyPromiseInitialize(this);
              } else {
                defaultWriterReadyPromiseInitializeAsResolved(this);
              }
              defaultWriterClosedPromiseInitialize(this);
            } else if (state === "erroring") {
              defaultWriterReadyPromiseInitializeAsRejected(this, stream._storedError);
              defaultWriterClosedPromiseInitialize(this);
            } else if (state === "closed") {
              defaultWriterReadyPromiseInitializeAsResolved(this);
              defaultWriterClosedPromiseInitializeAsResolved(this);
            } else {
              const storedError = stream._storedError;
              defaultWriterReadyPromiseInitializeAsRejected(this, storedError);
              defaultWriterClosedPromiseInitializeAsRejected(this, storedError);
            }
          }
          get closed() {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("closed"));
            }
            return this._closedPromise;
          }
          get desiredSize() {
            if (!IsWritableStreamDefaultWriter(this)) {
              throw defaultWriterBrandCheckException("desiredSize");
            }
            if (this._ownerWritableStream === void 0) {
              throw defaultWriterLockException("desiredSize");
            }
            return WritableStreamDefaultWriterGetDesiredSize(this);
          }
          get ready() {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("ready"));
            }
            return this._readyPromise;
          }
          abort(reason = void 0) {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("abort"));
            }
            if (this._ownerWritableStream === void 0) {
              return promiseRejectedWith(defaultWriterLockException("abort"));
            }
            return WritableStreamDefaultWriterAbort(this, reason);
          }
          close() {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("close"));
            }
            const stream = this._ownerWritableStream;
            if (stream === void 0) {
              return promiseRejectedWith(defaultWriterLockException("close"));
            }
            if (WritableStreamCloseQueuedOrInFlight(stream)) {
              return promiseRejectedWith(new TypeError("Cannot close an already-closing stream"));
            }
            return WritableStreamDefaultWriterClose(this);
          }
          releaseLock() {
            if (!IsWritableStreamDefaultWriter(this)) {
              throw defaultWriterBrandCheckException("releaseLock");
            }
            const stream = this._ownerWritableStream;
            if (stream === void 0) {
              return;
            }
            WritableStreamDefaultWriterRelease(this);
          }
          write(chunk = void 0) {
            if (!IsWritableStreamDefaultWriter(this)) {
              return promiseRejectedWith(defaultWriterBrandCheckException("write"));
            }
            if (this._ownerWritableStream === void 0) {
              return promiseRejectedWith(defaultWriterLockException("write to"));
            }
            return WritableStreamDefaultWriterWrite(this, chunk);
          }
        }
        Object.defineProperties(WritableStreamDefaultWriter.prototype, {
          abort: { enumerable: true },
          close: { enumerable: true },
          releaseLock: { enumerable: true },
          write: { enumerable: true },
          closed: { enumerable: true },
          desiredSize: { enumerable: true },
          ready: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(WritableStreamDefaultWriter.prototype, SymbolPolyfill.toStringTag, {
            value: "WritableStreamDefaultWriter",
            configurable: true
          });
        }
        function IsWritableStreamDefaultWriter(x) {
          if (!typeIsObject(x)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x, "_ownerWritableStream")) {
            return false;
          }
          return x instanceof WritableStreamDefaultWriter;
        }
        function WritableStreamDefaultWriterAbort(writer, reason) {
          const stream = writer._ownerWritableStream;
          return WritableStreamAbort(stream, reason);
        }
        function WritableStreamDefaultWriterClose(writer) {
          const stream = writer._ownerWritableStream;
          return WritableStreamClose(stream);
        }
        function WritableStreamDefaultWriterCloseWithErrorPropagation(writer) {
          const stream = writer._ownerWritableStream;
          const state = stream._state;
          if (WritableStreamCloseQueuedOrInFlight(stream) || state === "closed") {
            return promiseResolvedWith(void 0);
          }
          if (state === "errored") {
            return promiseRejectedWith(stream._storedError);
          }
          return WritableStreamDefaultWriterClose(writer);
        }
        function WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, error2) {
          if (writer._closedPromiseState === "pending") {
            defaultWriterClosedPromiseReject(writer, error2);
          } else {
            defaultWriterClosedPromiseResetToRejected(writer, error2);
          }
        }
        function WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, error2) {
          if (writer._readyPromiseState === "pending") {
            defaultWriterReadyPromiseReject(writer, error2);
          } else {
            defaultWriterReadyPromiseResetToRejected(writer, error2);
          }
        }
        function WritableStreamDefaultWriterGetDesiredSize(writer) {
          const stream = writer._ownerWritableStream;
          const state = stream._state;
          if (state === "errored" || state === "erroring") {
            return null;
          }
          if (state === "closed") {
            return 0;
          }
          return WritableStreamDefaultControllerGetDesiredSize(stream._writableStreamController);
        }
        function WritableStreamDefaultWriterRelease(writer) {
          const stream = writer._ownerWritableStream;
          const releasedError = new TypeError(`Writer was released and can no longer be used to monitor the stream's closedness`);
          WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, releasedError);
          WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, releasedError);
          stream._writer = void 0;
          writer._ownerWritableStream = void 0;
        }
        function WritableStreamDefaultWriterWrite(writer, chunk) {
          const stream = writer._ownerWritableStream;
          const controller = stream._writableStreamController;
          const chunkSize = WritableStreamDefaultControllerGetChunkSize(controller, chunk);
          if (stream !== writer._ownerWritableStream) {
            return promiseRejectedWith(defaultWriterLockException("write to"));
          }
          const state = stream._state;
          if (state === "errored") {
            return promiseRejectedWith(stream._storedError);
          }
          if (WritableStreamCloseQueuedOrInFlight(stream) || state === "closed") {
            return promiseRejectedWith(new TypeError("The stream is closing or closed and cannot be written to"));
          }
          if (state === "erroring") {
            return promiseRejectedWith(stream._storedError);
          }
          const promise = WritableStreamAddWriteRequest(stream);
          WritableStreamDefaultControllerWrite(controller, chunk, chunkSize);
          return promise;
        }
        const closeSentinel = {};
        class WritableStreamDefaultController {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get abortReason() {
            if (!IsWritableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$2("abortReason");
            }
            return this._abortReason;
          }
          get signal() {
            if (!IsWritableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$2("signal");
            }
            if (this._abortController === void 0) {
              throw new TypeError("WritableStreamDefaultController.prototype.signal is not supported");
            }
            return this._abortController.signal;
          }
          error(e = void 0) {
            if (!IsWritableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$2("error");
            }
            const state = this._controlledWritableStream._state;
            if (state !== "writable") {
              return;
            }
            WritableStreamDefaultControllerError(this, e);
          }
          [AbortSteps](reason) {
            const result = this._abortAlgorithm(reason);
            WritableStreamDefaultControllerClearAlgorithms(this);
            return result;
          }
          [ErrorSteps]() {
            ResetQueue(this);
          }
        }
        Object.defineProperties(WritableStreamDefaultController.prototype, {
          error: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(WritableStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
            value: "WritableStreamDefaultController",
            configurable: true
          });
        }
        function IsWritableStreamDefaultController(x) {
          if (!typeIsObject(x)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x, "_controlledWritableStream")) {
            return false;
          }
          return x instanceof WritableStreamDefaultController;
        }
        function SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm) {
          controller._controlledWritableStream = stream;
          stream._writableStreamController = controller;
          controller._queue = void 0;
          controller._queueTotalSize = void 0;
          ResetQueue(controller);
          controller._abortReason = void 0;
          controller._abortController = createAbortController();
          controller._started = false;
          controller._strategySizeAlgorithm = sizeAlgorithm;
          controller._strategyHWM = highWaterMark;
          controller._writeAlgorithm = writeAlgorithm;
          controller._closeAlgorithm = closeAlgorithm;
          controller._abortAlgorithm = abortAlgorithm;
          const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
          WritableStreamUpdateBackpressure(stream, backpressure);
          const startResult = startAlgorithm();
          const startPromise = promiseResolvedWith(startResult);
          uponPromise(startPromise, () => {
            controller._started = true;
            WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
          }, (r) => {
            controller._started = true;
            WritableStreamDealWithRejection(stream, r);
          });
        }
        function SetUpWritableStreamDefaultControllerFromUnderlyingSink(stream, underlyingSink, highWaterMark, sizeAlgorithm) {
          const controller = Object.create(WritableStreamDefaultController.prototype);
          let startAlgorithm = () => void 0;
          let writeAlgorithm = () => promiseResolvedWith(void 0);
          let closeAlgorithm = () => promiseResolvedWith(void 0);
          let abortAlgorithm = () => promiseResolvedWith(void 0);
          if (underlyingSink.start !== void 0) {
            startAlgorithm = () => underlyingSink.start(controller);
          }
          if (underlyingSink.write !== void 0) {
            writeAlgorithm = (chunk) => underlyingSink.write(chunk, controller);
          }
          if (underlyingSink.close !== void 0) {
            closeAlgorithm = () => underlyingSink.close();
          }
          if (underlyingSink.abort !== void 0) {
            abortAlgorithm = (reason) => underlyingSink.abort(reason);
          }
          SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm);
        }
        function WritableStreamDefaultControllerClearAlgorithms(controller) {
          controller._writeAlgorithm = void 0;
          controller._closeAlgorithm = void 0;
          controller._abortAlgorithm = void 0;
          controller._strategySizeAlgorithm = void 0;
        }
        function WritableStreamDefaultControllerClose(controller) {
          EnqueueValueWithSize(controller, closeSentinel, 0);
          WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
        }
        function WritableStreamDefaultControllerGetChunkSize(controller, chunk) {
          try {
            return controller._strategySizeAlgorithm(chunk);
          } catch (chunkSizeE) {
            WritableStreamDefaultControllerErrorIfNeeded(controller, chunkSizeE);
            return 1;
          }
        }
        function WritableStreamDefaultControllerGetDesiredSize(controller) {
          return controller._strategyHWM - controller._queueTotalSize;
        }
        function WritableStreamDefaultControllerWrite(controller, chunk, chunkSize) {
          try {
            EnqueueValueWithSize(controller, chunk, chunkSize);
          } catch (enqueueE) {
            WritableStreamDefaultControllerErrorIfNeeded(controller, enqueueE);
            return;
          }
          const stream = controller._controlledWritableStream;
          if (!WritableStreamCloseQueuedOrInFlight(stream) && stream._state === "writable") {
            const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
            WritableStreamUpdateBackpressure(stream, backpressure);
          }
          WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
        }
        function WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller) {
          const stream = controller._controlledWritableStream;
          if (!controller._started) {
            return;
          }
          if (stream._inFlightWriteRequest !== void 0) {
            return;
          }
          const state = stream._state;
          if (state === "erroring") {
            WritableStreamFinishErroring(stream);
            return;
          }
          if (controller._queue.length === 0) {
            return;
          }
          const value = PeekQueueValue(controller);
          if (value === closeSentinel) {
            WritableStreamDefaultControllerProcessClose(controller);
          } else {
            WritableStreamDefaultControllerProcessWrite(controller, value);
          }
        }
        function WritableStreamDefaultControllerErrorIfNeeded(controller, error2) {
          if (controller._controlledWritableStream._state === "writable") {
            WritableStreamDefaultControllerError(controller, error2);
          }
        }
        function WritableStreamDefaultControllerProcessClose(controller) {
          const stream = controller._controlledWritableStream;
          WritableStreamMarkCloseRequestInFlight(stream);
          DequeueValue(controller);
          const sinkClosePromise = controller._closeAlgorithm();
          WritableStreamDefaultControllerClearAlgorithms(controller);
          uponPromise(sinkClosePromise, () => {
            WritableStreamFinishInFlightClose(stream);
          }, (reason) => {
            WritableStreamFinishInFlightCloseWithError(stream, reason);
          });
        }
        function WritableStreamDefaultControllerProcessWrite(controller, chunk) {
          const stream = controller._controlledWritableStream;
          WritableStreamMarkFirstWriteRequestInFlight(stream);
          const sinkWritePromise = controller._writeAlgorithm(chunk);
          uponPromise(sinkWritePromise, () => {
            WritableStreamFinishInFlightWrite(stream);
            const state = stream._state;
            DequeueValue(controller);
            if (!WritableStreamCloseQueuedOrInFlight(stream) && state === "writable") {
              const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
              WritableStreamUpdateBackpressure(stream, backpressure);
            }
            WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
          }, (reason) => {
            if (stream._state === "writable") {
              WritableStreamDefaultControllerClearAlgorithms(controller);
            }
            WritableStreamFinishInFlightWriteWithError(stream, reason);
          });
        }
        function WritableStreamDefaultControllerGetBackpressure(controller) {
          const desiredSize = WritableStreamDefaultControllerGetDesiredSize(controller);
          return desiredSize <= 0;
        }
        function WritableStreamDefaultControllerError(controller, error2) {
          const stream = controller._controlledWritableStream;
          WritableStreamDefaultControllerClearAlgorithms(controller);
          WritableStreamStartErroring(stream, error2);
        }
        function streamBrandCheckException$2(name) {
          return new TypeError(`WritableStream.prototype.${name} can only be used on a WritableStream`);
        }
        function defaultControllerBrandCheckException$2(name) {
          return new TypeError(`WritableStreamDefaultController.prototype.${name} can only be used on a WritableStreamDefaultController`);
        }
        function defaultWriterBrandCheckException(name) {
          return new TypeError(`WritableStreamDefaultWriter.prototype.${name} can only be used on a WritableStreamDefaultWriter`);
        }
        function defaultWriterLockException(name) {
          return new TypeError("Cannot " + name + " a stream using a released writer");
        }
        function defaultWriterClosedPromiseInitialize(writer) {
          writer._closedPromise = newPromise((resolve2, reject) => {
            writer._closedPromise_resolve = resolve2;
            writer._closedPromise_reject = reject;
            writer._closedPromiseState = "pending";
          });
        }
        function defaultWriterClosedPromiseInitializeAsRejected(writer, reason) {
          defaultWriterClosedPromiseInitialize(writer);
          defaultWriterClosedPromiseReject(writer, reason);
        }
        function defaultWriterClosedPromiseInitializeAsResolved(writer) {
          defaultWriterClosedPromiseInitialize(writer);
          defaultWriterClosedPromiseResolve(writer);
        }
        function defaultWriterClosedPromiseReject(writer, reason) {
          if (writer._closedPromise_reject === void 0) {
            return;
          }
          setPromiseIsHandledToTrue(writer._closedPromise);
          writer._closedPromise_reject(reason);
          writer._closedPromise_resolve = void 0;
          writer._closedPromise_reject = void 0;
          writer._closedPromiseState = "rejected";
        }
        function defaultWriterClosedPromiseResetToRejected(writer, reason) {
          defaultWriterClosedPromiseInitializeAsRejected(writer, reason);
        }
        function defaultWriterClosedPromiseResolve(writer) {
          if (writer._closedPromise_resolve === void 0) {
            return;
          }
          writer._closedPromise_resolve(void 0);
          writer._closedPromise_resolve = void 0;
          writer._closedPromise_reject = void 0;
          writer._closedPromiseState = "resolved";
        }
        function defaultWriterReadyPromiseInitialize(writer) {
          writer._readyPromise = newPromise((resolve2, reject) => {
            writer._readyPromise_resolve = resolve2;
            writer._readyPromise_reject = reject;
          });
          writer._readyPromiseState = "pending";
        }
        function defaultWriterReadyPromiseInitializeAsRejected(writer, reason) {
          defaultWriterReadyPromiseInitialize(writer);
          defaultWriterReadyPromiseReject(writer, reason);
        }
        function defaultWriterReadyPromiseInitializeAsResolved(writer) {
          defaultWriterReadyPromiseInitialize(writer);
          defaultWriterReadyPromiseResolve(writer);
        }
        function defaultWriterReadyPromiseReject(writer, reason) {
          if (writer._readyPromise_reject === void 0) {
            return;
          }
          setPromiseIsHandledToTrue(writer._readyPromise);
          writer._readyPromise_reject(reason);
          writer._readyPromise_resolve = void 0;
          writer._readyPromise_reject = void 0;
          writer._readyPromiseState = "rejected";
        }
        function defaultWriterReadyPromiseReset(writer) {
          defaultWriterReadyPromiseInitialize(writer);
        }
        function defaultWriterReadyPromiseResetToRejected(writer, reason) {
          defaultWriterReadyPromiseInitializeAsRejected(writer, reason);
        }
        function defaultWriterReadyPromiseResolve(writer) {
          if (writer._readyPromise_resolve === void 0) {
            return;
          }
          writer._readyPromise_resolve(void 0);
          writer._readyPromise_resolve = void 0;
          writer._readyPromise_reject = void 0;
          writer._readyPromiseState = "fulfilled";
        }
        const NativeDOMException = typeof DOMException !== "undefined" ? DOMException : void 0;
        function isDOMExceptionConstructor(ctor) {
          if (!(typeof ctor === "function" || typeof ctor === "object")) {
            return false;
          }
          try {
            new ctor();
            return true;
          } catch (_a) {
            return false;
          }
        }
        function createDOMExceptionPolyfill() {
          const ctor = function DOMException2(message, name) {
            this.message = message || "";
            this.name = name || "Error";
            if (Error.captureStackTrace) {
              Error.captureStackTrace(this, this.constructor);
            }
          };
          ctor.prototype = Object.create(Error.prototype);
          Object.defineProperty(ctor.prototype, "constructor", { value: ctor, writable: true, configurable: true });
          return ctor;
        }
        const DOMException$1 = isDOMExceptionConstructor(NativeDOMException) ? NativeDOMException : createDOMExceptionPolyfill();
        function ReadableStreamPipeTo(source, dest, preventClose, preventAbort, preventCancel, signal) {
          const reader = AcquireReadableStreamDefaultReader(source);
          const writer = AcquireWritableStreamDefaultWriter(dest);
          source._disturbed = true;
          let shuttingDown = false;
          let currentWrite = promiseResolvedWith(void 0);
          return newPromise((resolve2, reject) => {
            let abortAlgorithm;
            if (signal !== void 0) {
              abortAlgorithm = () => {
                const error2 = new DOMException$1("Aborted", "AbortError");
                const actions = [];
                if (!preventAbort) {
                  actions.push(() => {
                    if (dest._state === "writable") {
                      return WritableStreamAbort(dest, error2);
                    }
                    return promiseResolvedWith(void 0);
                  });
                }
                if (!preventCancel) {
                  actions.push(() => {
                    if (source._state === "readable") {
                      return ReadableStreamCancel(source, error2);
                    }
                    return promiseResolvedWith(void 0);
                  });
                }
                shutdownWithAction(() => Promise.all(actions.map((action) => action())), true, error2);
              };
              if (signal.aborted) {
                abortAlgorithm();
                return;
              }
              signal.addEventListener("abort", abortAlgorithm);
            }
            function pipeLoop() {
              return newPromise((resolveLoop, rejectLoop) => {
                function next(done) {
                  if (done) {
                    resolveLoop();
                  } else {
                    PerformPromiseThen(pipeStep(), next, rejectLoop);
                  }
                }
                next(false);
              });
            }
            function pipeStep() {
              if (shuttingDown) {
                return promiseResolvedWith(true);
              }
              return PerformPromiseThen(writer._readyPromise, () => {
                return newPromise((resolveRead, rejectRead) => {
                  ReadableStreamDefaultReaderRead(reader, {
                    _chunkSteps: (chunk) => {
                      currentWrite = PerformPromiseThen(WritableStreamDefaultWriterWrite(writer, chunk), void 0, noop2);
                      resolveRead(false);
                    },
                    _closeSteps: () => resolveRead(true),
                    _errorSteps: rejectRead
                  });
                });
              });
            }
            isOrBecomesErrored(source, reader._closedPromise, (storedError) => {
              if (!preventAbort) {
                shutdownWithAction(() => WritableStreamAbort(dest, storedError), true, storedError);
              } else {
                shutdown(true, storedError);
              }
            });
            isOrBecomesErrored(dest, writer._closedPromise, (storedError) => {
              if (!preventCancel) {
                shutdownWithAction(() => ReadableStreamCancel(source, storedError), true, storedError);
              } else {
                shutdown(true, storedError);
              }
            });
            isOrBecomesClosed(source, reader._closedPromise, () => {
              if (!preventClose) {
                shutdownWithAction(() => WritableStreamDefaultWriterCloseWithErrorPropagation(writer));
              } else {
                shutdown();
              }
            });
            if (WritableStreamCloseQueuedOrInFlight(dest) || dest._state === "closed") {
              const destClosed = new TypeError("the destination writable stream closed before all data could be piped to it");
              if (!preventCancel) {
                shutdownWithAction(() => ReadableStreamCancel(source, destClosed), true, destClosed);
              } else {
                shutdown(true, destClosed);
              }
            }
            setPromiseIsHandledToTrue(pipeLoop());
            function waitForWritesToFinish() {
              const oldCurrentWrite = currentWrite;
              return PerformPromiseThen(currentWrite, () => oldCurrentWrite !== currentWrite ? waitForWritesToFinish() : void 0);
            }
            function isOrBecomesErrored(stream, promise, action) {
              if (stream._state === "errored") {
                action(stream._storedError);
              } else {
                uponRejection(promise, action);
              }
            }
            function isOrBecomesClosed(stream, promise, action) {
              if (stream._state === "closed") {
                action();
              } else {
                uponFulfillment(promise, action);
              }
            }
            function shutdownWithAction(action, originalIsError, originalError) {
              if (shuttingDown) {
                return;
              }
              shuttingDown = true;
              if (dest._state === "writable" && !WritableStreamCloseQueuedOrInFlight(dest)) {
                uponFulfillment(waitForWritesToFinish(), doTheRest);
              } else {
                doTheRest();
              }
              function doTheRest() {
                uponPromise(action(), () => finalize(originalIsError, originalError), (newError) => finalize(true, newError));
              }
            }
            function shutdown(isError, error2) {
              if (shuttingDown) {
                return;
              }
              shuttingDown = true;
              if (dest._state === "writable" && !WritableStreamCloseQueuedOrInFlight(dest)) {
                uponFulfillment(waitForWritesToFinish(), () => finalize(isError, error2));
              } else {
                finalize(isError, error2);
              }
            }
            function finalize(isError, error2) {
              WritableStreamDefaultWriterRelease(writer);
              ReadableStreamReaderGenericRelease(reader);
              if (signal !== void 0) {
                signal.removeEventListener("abort", abortAlgorithm);
              }
              if (isError) {
                reject(error2);
              } else {
                resolve2(void 0);
              }
            }
          });
        }
        class ReadableStreamDefaultController {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get desiredSize() {
            if (!IsReadableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$1("desiredSize");
            }
            return ReadableStreamDefaultControllerGetDesiredSize(this);
          }
          close() {
            if (!IsReadableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$1("close");
            }
            if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(this)) {
              throw new TypeError("The stream is not in a state that permits close");
            }
            ReadableStreamDefaultControllerClose(this);
          }
          enqueue(chunk = void 0) {
            if (!IsReadableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$1("enqueue");
            }
            if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(this)) {
              throw new TypeError("The stream is not in a state that permits enqueue");
            }
            return ReadableStreamDefaultControllerEnqueue(this, chunk);
          }
          error(e = void 0) {
            if (!IsReadableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$1("error");
            }
            ReadableStreamDefaultControllerError(this, e);
          }
          [CancelSteps](reason) {
            ResetQueue(this);
            const result = this._cancelAlgorithm(reason);
            ReadableStreamDefaultControllerClearAlgorithms(this);
            return result;
          }
          [PullSteps](readRequest) {
            const stream = this._controlledReadableStream;
            if (this._queue.length > 0) {
              const chunk = DequeueValue(this);
              if (this._closeRequested && this._queue.length === 0) {
                ReadableStreamDefaultControllerClearAlgorithms(this);
                ReadableStreamClose(stream);
              } else {
                ReadableStreamDefaultControllerCallPullIfNeeded(this);
              }
              readRequest._chunkSteps(chunk);
            } else {
              ReadableStreamAddReadRequest(stream, readRequest);
              ReadableStreamDefaultControllerCallPullIfNeeded(this);
            }
          }
        }
        Object.defineProperties(ReadableStreamDefaultController.prototype, {
          close: { enumerable: true },
          enqueue: { enumerable: true },
          error: { enumerable: true },
          desiredSize: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStreamDefaultController",
            configurable: true
          });
        }
        function IsReadableStreamDefaultController(x) {
          if (!typeIsObject(x)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x, "_controlledReadableStream")) {
            return false;
          }
          return x instanceof ReadableStreamDefaultController;
        }
        function ReadableStreamDefaultControllerCallPullIfNeeded(controller) {
          const shouldPull = ReadableStreamDefaultControllerShouldCallPull(controller);
          if (!shouldPull) {
            return;
          }
          if (controller._pulling) {
            controller._pullAgain = true;
            return;
          }
          controller._pulling = true;
          const pullPromise = controller._pullAlgorithm();
          uponPromise(pullPromise, () => {
            controller._pulling = false;
            if (controller._pullAgain) {
              controller._pullAgain = false;
              ReadableStreamDefaultControllerCallPullIfNeeded(controller);
            }
          }, (e) => {
            ReadableStreamDefaultControllerError(controller, e);
          });
        }
        function ReadableStreamDefaultControllerShouldCallPull(controller) {
          const stream = controller._controlledReadableStream;
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
            return false;
          }
          if (!controller._started) {
            return false;
          }
          if (IsReadableStreamLocked(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
            return true;
          }
          const desiredSize = ReadableStreamDefaultControllerGetDesiredSize(controller);
          if (desiredSize > 0) {
            return true;
          }
          return false;
        }
        function ReadableStreamDefaultControllerClearAlgorithms(controller) {
          controller._pullAlgorithm = void 0;
          controller._cancelAlgorithm = void 0;
          controller._strategySizeAlgorithm = void 0;
        }
        function ReadableStreamDefaultControllerClose(controller) {
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
            return;
          }
          const stream = controller._controlledReadableStream;
          controller._closeRequested = true;
          if (controller._queue.length === 0) {
            ReadableStreamDefaultControllerClearAlgorithms(controller);
            ReadableStreamClose(stream);
          }
        }
        function ReadableStreamDefaultControllerEnqueue(controller, chunk) {
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
            return;
          }
          const stream = controller._controlledReadableStream;
          if (IsReadableStreamLocked(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
            ReadableStreamFulfillReadRequest(stream, chunk, false);
          } else {
            let chunkSize;
            try {
              chunkSize = controller._strategySizeAlgorithm(chunk);
            } catch (chunkSizeE) {
              ReadableStreamDefaultControllerError(controller, chunkSizeE);
              throw chunkSizeE;
            }
            try {
              EnqueueValueWithSize(controller, chunk, chunkSize);
            } catch (enqueueE) {
              ReadableStreamDefaultControllerError(controller, enqueueE);
              throw enqueueE;
            }
          }
          ReadableStreamDefaultControllerCallPullIfNeeded(controller);
        }
        function ReadableStreamDefaultControllerError(controller, e) {
          const stream = controller._controlledReadableStream;
          if (stream._state !== "readable") {
            return;
          }
          ResetQueue(controller);
          ReadableStreamDefaultControllerClearAlgorithms(controller);
          ReadableStreamError(stream, e);
        }
        function ReadableStreamDefaultControllerGetDesiredSize(controller) {
          const state = controller._controlledReadableStream._state;
          if (state === "errored") {
            return null;
          }
          if (state === "closed") {
            return 0;
          }
          return controller._strategyHWM - controller._queueTotalSize;
        }
        function ReadableStreamDefaultControllerHasBackpressure(controller) {
          if (ReadableStreamDefaultControllerShouldCallPull(controller)) {
            return false;
          }
          return true;
        }
        function ReadableStreamDefaultControllerCanCloseOrEnqueue(controller) {
          const state = controller._controlledReadableStream._state;
          if (!controller._closeRequested && state === "readable") {
            return true;
          }
          return false;
        }
        function SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm) {
          controller._controlledReadableStream = stream;
          controller._queue = void 0;
          controller._queueTotalSize = void 0;
          ResetQueue(controller);
          controller._started = false;
          controller._closeRequested = false;
          controller._pullAgain = false;
          controller._pulling = false;
          controller._strategySizeAlgorithm = sizeAlgorithm;
          controller._strategyHWM = highWaterMark;
          controller._pullAlgorithm = pullAlgorithm;
          controller._cancelAlgorithm = cancelAlgorithm;
          stream._readableStreamController = controller;
          const startResult = startAlgorithm();
          uponPromise(promiseResolvedWith(startResult), () => {
            controller._started = true;
            ReadableStreamDefaultControllerCallPullIfNeeded(controller);
          }, (r) => {
            ReadableStreamDefaultControllerError(controller, r);
          });
        }
        function SetUpReadableStreamDefaultControllerFromUnderlyingSource(stream, underlyingSource, highWaterMark, sizeAlgorithm) {
          const controller = Object.create(ReadableStreamDefaultController.prototype);
          let startAlgorithm = () => void 0;
          let pullAlgorithm = () => promiseResolvedWith(void 0);
          let cancelAlgorithm = () => promiseResolvedWith(void 0);
          if (underlyingSource.start !== void 0) {
            startAlgorithm = () => underlyingSource.start(controller);
          }
          if (underlyingSource.pull !== void 0) {
            pullAlgorithm = () => underlyingSource.pull(controller);
          }
          if (underlyingSource.cancel !== void 0) {
            cancelAlgorithm = (reason) => underlyingSource.cancel(reason);
          }
          SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm);
        }
        function defaultControllerBrandCheckException$1(name) {
          return new TypeError(`ReadableStreamDefaultController.prototype.${name} can only be used on a ReadableStreamDefaultController`);
        }
        function ReadableStreamTee(stream, cloneForBranch2) {
          if (IsReadableByteStreamController(stream._readableStreamController)) {
            return ReadableByteStreamTee(stream);
          }
          return ReadableStreamDefaultTee(stream);
        }
        function ReadableStreamDefaultTee(stream, cloneForBranch2) {
          const reader = AcquireReadableStreamDefaultReader(stream);
          let reading = false;
          let canceled1 = false;
          let canceled2 = false;
          let reason1;
          let reason2;
          let branch1;
          let branch2;
          let resolveCancelPromise;
          const cancelPromise = newPromise((resolve2) => {
            resolveCancelPromise = resolve2;
          });
          function pullAlgorithm() {
            if (reading) {
              return promiseResolvedWith(void 0);
            }
            reading = true;
            const readRequest = {
              _chunkSteps: (chunk) => {
                queueMicrotask(() => {
                  reading = false;
                  const chunk1 = chunk;
                  const chunk2 = chunk;
                  if (!canceled1) {
                    ReadableStreamDefaultControllerEnqueue(branch1._readableStreamController, chunk1);
                  }
                  if (!canceled2) {
                    ReadableStreamDefaultControllerEnqueue(branch2._readableStreamController, chunk2);
                  }
                });
              },
              _closeSteps: () => {
                reading = false;
                if (!canceled1) {
                  ReadableStreamDefaultControllerClose(branch1._readableStreamController);
                }
                if (!canceled2) {
                  ReadableStreamDefaultControllerClose(branch2._readableStreamController);
                }
                if (!canceled1 || !canceled2) {
                  resolveCancelPromise(void 0);
                }
              },
              _errorSteps: () => {
                reading = false;
              }
            };
            ReadableStreamDefaultReaderRead(reader, readRequest);
            return promiseResolvedWith(void 0);
          }
          function cancel1Algorithm(reason) {
            canceled1 = true;
            reason1 = reason;
            if (canceled2) {
              const compositeReason = CreateArrayFromList([reason1, reason2]);
              const cancelResult = ReadableStreamCancel(stream, compositeReason);
              resolveCancelPromise(cancelResult);
            }
            return cancelPromise;
          }
          function cancel2Algorithm(reason) {
            canceled2 = true;
            reason2 = reason;
            if (canceled1) {
              const compositeReason = CreateArrayFromList([reason1, reason2]);
              const cancelResult = ReadableStreamCancel(stream, compositeReason);
              resolveCancelPromise(cancelResult);
            }
            return cancelPromise;
          }
          function startAlgorithm() {
          }
          branch1 = CreateReadableStream(startAlgorithm, pullAlgorithm, cancel1Algorithm);
          branch2 = CreateReadableStream(startAlgorithm, pullAlgorithm, cancel2Algorithm);
          uponRejection(reader._closedPromise, (r) => {
            ReadableStreamDefaultControllerError(branch1._readableStreamController, r);
            ReadableStreamDefaultControllerError(branch2._readableStreamController, r);
            if (!canceled1 || !canceled2) {
              resolveCancelPromise(void 0);
            }
          });
          return [branch1, branch2];
        }
        function ReadableByteStreamTee(stream) {
          let reader = AcquireReadableStreamDefaultReader(stream);
          let reading = false;
          let canceled1 = false;
          let canceled2 = false;
          let reason1;
          let reason2;
          let branch1;
          let branch2;
          let resolveCancelPromise;
          const cancelPromise = newPromise((resolve2) => {
            resolveCancelPromise = resolve2;
          });
          function forwardReaderError(thisReader) {
            uponRejection(thisReader._closedPromise, (r) => {
              if (thisReader !== reader) {
                return;
              }
              ReadableByteStreamControllerError(branch1._readableStreamController, r);
              ReadableByteStreamControllerError(branch2._readableStreamController, r);
              if (!canceled1 || !canceled2) {
                resolveCancelPromise(void 0);
              }
            });
          }
          function pullWithDefaultReader() {
            if (IsReadableStreamBYOBReader(reader)) {
              ReadableStreamReaderGenericRelease(reader);
              reader = AcquireReadableStreamDefaultReader(stream);
              forwardReaderError(reader);
            }
            const readRequest = {
              _chunkSteps: (chunk) => {
                queueMicrotask(() => {
                  reading = false;
                  const chunk1 = chunk;
                  let chunk2 = chunk;
                  if (!canceled1 && !canceled2) {
                    try {
                      chunk2 = CloneAsUint8Array(chunk);
                    } catch (cloneE) {
                      ReadableByteStreamControllerError(branch1._readableStreamController, cloneE);
                      ReadableByteStreamControllerError(branch2._readableStreamController, cloneE);
                      resolveCancelPromise(ReadableStreamCancel(stream, cloneE));
                      return;
                    }
                  }
                  if (!canceled1) {
                    ReadableByteStreamControllerEnqueue(branch1._readableStreamController, chunk1);
                  }
                  if (!canceled2) {
                    ReadableByteStreamControllerEnqueue(branch2._readableStreamController, chunk2);
                  }
                });
              },
              _closeSteps: () => {
                reading = false;
                if (!canceled1) {
                  ReadableByteStreamControllerClose(branch1._readableStreamController);
                }
                if (!canceled2) {
                  ReadableByteStreamControllerClose(branch2._readableStreamController);
                }
                if (branch1._readableStreamController._pendingPullIntos.length > 0) {
                  ReadableByteStreamControllerRespond(branch1._readableStreamController, 0);
                }
                if (branch2._readableStreamController._pendingPullIntos.length > 0) {
                  ReadableByteStreamControllerRespond(branch2._readableStreamController, 0);
                }
                if (!canceled1 || !canceled2) {
                  resolveCancelPromise(void 0);
                }
              },
              _errorSteps: () => {
                reading = false;
              }
            };
            ReadableStreamDefaultReaderRead(reader, readRequest);
          }
          function pullWithBYOBReader(view, forBranch2) {
            if (IsReadableStreamDefaultReader(reader)) {
              ReadableStreamReaderGenericRelease(reader);
              reader = AcquireReadableStreamBYOBReader(stream);
              forwardReaderError(reader);
            }
            const byobBranch = forBranch2 ? branch2 : branch1;
            const otherBranch = forBranch2 ? branch1 : branch2;
            const readIntoRequest = {
              _chunkSteps: (chunk) => {
                queueMicrotask(() => {
                  reading = false;
                  const byobCanceled = forBranch2 ? canceled2 : canceled1;
                  const otherCanceled = forBranch2 ? canceled1 : canceled2;
                  if (!otherCanceled) {
                    let clonedChunk;
                    try {
                      clonedChunk = CloneAsUint8Array(chunk);
                    } catch (cloneE) {
                      ReadableByteStreamControllerError(byobBranch._readableStreamController, cloneE);
                      ReadableByteStreamControllerError(otherBranch._readableStreamController, cloneE);
                      resolveCancelPromise(ReadableStreamCancel(stream, cloneE));
                      return;
                    }
                    if (!byobCanceled) {
                      ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                    }
                    ReadableByteStreamControllerEnqueue(otherBranch._readableStreamController, clonedChunk);
                  } else if (!byobCanceled) {
                    ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                  }
                });
              },
              _closeSteps: (chunk) => {
                reading = false;
                const byobCanceled = forBranch2 ? canceled2 : canceled1;
                const otherCanceled = forBranch2 ? canceled1 : canceled2;
                if (!byobCanceled) {
                  ReadableByteStreamControllerClose(byobBranch._readableStreamController);
                }
                if (!otherCanceled) {
                  ReadableByteStreamControllerClose(otherBranch._readableStreamController);
                }
                if (chunk !== void 0) {
                  if (!byobCanceled) {
                    ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                  }
                  if (!otherCanceled && otherBranch._readableStreamController._pendingPullIntos.length > 0) {
                    ReadableByteStreamControllerRespond(otherBranch._readableStreamController, 0);
                  }
                }
                if (!byobCanceled || !otherCanceled) {
                  resolveCancelPromise(void 0);
                }
              },
              _errorSteps: () => {
                reading = false;
              }
            };
            ReadableStreamBYOBReaderRead(reader, view, readIntoRequest);
          }
          function pull1Algorithm() {
            if (reading) {
              return promiseResolvedWith(void 0);
            }
            reading = true;
            const byobRequest = ReadableByteStreamControllerGetBYOBRequest(branch1._readableStreamController);
            if (byobRequest === null) {
              pullWithDefaultReader();
            } else {
              pullWithBYOBReader(byobRequest._view, false);
            }
            return promiseResolvedWith(void 0);
          }
          function pull2Algorithm() {
            if (reading) {
              return promiseResolvedWith(void 0);
            }
            reading = true;
            const byobRequest = ReadableByteStreamControllerGetBYOBRequest(branch2._readableStreamController);
            if (byobRequest === null) {
              pullWithDefaultReader();
            } else {
              pullWithBYOBReader(byobRequest._view, true);
            }
            return promiseResolvedWith(void 0);
          }
          function cancel1Algorithm(reason) {
            canceled1 = true;
            reason1 = reason;
            if (canceled2) {
              const compositeReason = CreateArrayFromList([reason1, reason2]);
              const cancelResult = ReadableStreamCancel(stream, compositeReason);
              resolveCancelPromise(cancelResult);
            }
            return cancelPromise;
          }
          function cancel2Algorithm(reason) {
            canceled2 = true;
            reason2 = reason;
            if (canceled1) {
              const compositeReason = CreateArrayFromList([reason1, reason2]);
              const cancelResult = ReadableStreamCancel(stream, compositeReason);
              resolveCancelPromise(cancelResult);
            }
            return cancelPromise;
          }
          function startAlgorithm() {
            return;
          }
          branch1 = CreateReadableByteStream(startAlgorithm, pull1Algorithm, cancel1Algorithm);
          branch2 = CreateReadableByteStream(startAlgorithm, pull2Algorithm, cancel2Algorithm);
          forwardReaderError(reader);
          return [branch1, branch2];
        }
        function convertUnderlyingDefaultOrByteSource(source, context) {
          assertDictionary(source, context);
          const original = source;
          const autoAllocateChunkSize = original === null || original === void 0 ? void 0 : original.autoAllocateChunkSize;
          const cancel = original === null || original === void 0 ? void 0 : original.cancel;
          const pull = original === null || original === void 0 ? void 0 : original.pull;
          const start = original === null || original === void 0 ? void 0 : original.start;
          const type = original === null || original === void 0 ? void 0 : original.type;
          return {
            autoAllocateChunkSize: autoAllocateChunkSize === void 0 ? void 0 : convertUnsignedLongLongWithEnforceRange(autoAllocateChunkSize, `${context} has member 'autoAllocateChunkSize' that`),
            cancel: cancel === void 0 ? void 0 : convertUnderlyingSourceCancelCallback(cancel, original, `${context} has member 'cancel' that`),
            pull: pull === void 0 ? void 0 : convertUnderlyingSourcePullCallback(pull, original, `${context} has member 'pull' that`),
            start: start === void 0 ? void 0 : convertUnderlyingSourceStartCallback(start, original, `${context} has member 'start' that`),
            type: type === void 0 ? void 0 : convertReadableStreamType(type, `${context} has member 'type' that`)
          };
        }
        function convertUnderlyingSourceCancelCallback(fn, original, context) {
          assertFunction(fn, context);
          return (reason) => promiseCall(fn, original, [reason]);
        }
        function convertUnderlyingSourcePullCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => promiseCall(fn, original, [controller]);
        }
        function convertUnderlyingSourceStartCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => reflectCall(fn, original, [controller]);
        }
        function convertReadableStreamType(type, context) {
          type = `${type}`;
          if (type !== "bytes") {
            throw new TypeError(`${context} '${type}' is not a valid enumeration value for ReadableStreamType`);
          }
          return type;
        }
        function convertReaderOptions(options2, context) {
          assertDictionary(options2, context);
          const mode = options2 === null || options2 === void 0 ? void 0 : options2.mode;
          return {
            mode: mode === void 0 ? void 0 : convertReadableStreamReaderMode(mode, `${context} has member 'mode' that`)
          };
        }
        function convertReadableStreamReaderMode(mode, context) {
          mode = `${mode}`;
          if (mode !== "byob") {
            throw new TypeError(`${context} '${mode}' is not a valid enumeration value for ReadableStreamReaderMode`);
          }
          return mode;
        }
        function convertIteratorOptions(options2, context) {
          assertDictionary(options2, context);
          const preventCancel = options2 === null || options2 === void 0 ? void 0 : options2.preventCancel;
          return { preventCancel: Boolean(preventCancel) };
        }
        function convertPipeOptions(options2, context) {
          assertDictionary(options2, context);
          const preventAbort = options2 === null || options2 === void 0 ? void 0 : options2.preventAbort;
          const preventCancel = options2 === null || options2 === void 0 ? void 0 : options2.preventCancel;
          const preventClose = options2 === null || options2 === void 0 ? void 0 : options2.preventClose;
          const signal = options2 === null || options2 === void 0 ? void 0 : options2.signal;
          if (signal !== void 0) {
            assertAbortSignal(signal, `${context} has member 'signal' that`);
          }
          return {
            preventAbort: Boolean(preventAbort),
            preventCancel: Boolean(preventCancel),
            preventClose: Boolean(preventClose),
            signal
          };
        }
        function assertAbortSignal(signal, context) {
          if (!isAbortSignal2(signal)) {
            throw new TypeError(`${context} is not an AbortSignal.`);
          }
        }
        function convertReadableWritablePair(pair, context) {
          assertDictionary(pair, context);
          const readable = pair === null || pair === void 0 ? void 0 : pair.readable;
          assertRequiredField(readable, "readable", "ReadableWritablePair");
          assertReadableStream(readable, `${context} has member 'readable' that`);
          const writable2 = pair === null || pair === void 0 ? void 0 : pair.writable;
          assertRequiredField(writable2, "writable", "ReadableWritablePair");
          assertWritableStream(writable2, `${context} has member 'writable' that`);
          return { readable, writable: writable2 };
        }
        class ReadableStream2 {
          constructor(rawUnderlyingSource = {}, rawStrategy = {}) {
            if (rawUnderlyingSource === void 0) {
              rawUnderlyingSource = null;
            } else {
              assertObject(rawUnderlyingSource, "First parameter");
            }
            const strategy = convertQueuingStrategy(rawStrategy, "Second parameter");
            const underlyingSource = convertUnderlyingDefaultOrByteSource(rawUnderlyingSource, "First parameter");
            InitializeReadableStream(this);
            if (underlyingSource.type === "bytes") {
              if (strategy.size !== void 0) {
                throw new RangeError("The strategy for a byte stream cannot have a size function");
              }
              const highWaterMark = ExtractHighWaterMark(strategy, 0);
              SetUpReadableByteStreamControllerFromUnderlyingSource(this, underlyingSource, highWaterMark);
            } else {
              const sizeAlgorithm = ExtractSizeAlgorithm(strategy);
              const highWaterMark = ExtractHighWaterMark(strategy, 1);
              SetUpReadableStreamDefaultControllerFromUnderlyingSource(this, underlyingSource, highWaterMark, sizeAlgorithm);
            }
          }
          get locked() {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("locked");
            }
            return IsReadableStreamLocked(this);
          }
          cancel(reason = void 0) {
            if (!IsReadableStream(this)) {
              return promiseRejectedWith(streamBrandCheckException$1("cancel"));
            }
            if (IsReadableStreamLocked(this)) {
              return promiseRejectedWith(new TypeError("Cannot cancel a stream that already has a reader"));
            }
            return ReadableStreamCancel(this, reason);
          }
          getReader(rawOptions = void 0) {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("getReader");
            }
            const options2 = convertReaderOptions(rawOptions, "First parameter");
            if (options2.mode === void 0) {
              return AcquireReadableStreamDefaultReader(this);
            }
            return AcquireReadableStreamBYOBReader(this);
          }
          pipeThrough(rawTransform, rawOptions = {}) {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("pipeThrough");
            }
            assertRequiredArgument(rawTransform, 1, "pipeThrough");
            const transform = convertReadableWritablePair(rawTransform, "First parameter");
            const options2 = convertPipeOptions(rawOptions, "Second parameter");
            if (IsReadableStreamLocked(this)) {
              throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked ReadableStream");
            }
            if (IsWritableStreamLocked(transform.writable)) {
              throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked WritableStream");
            }
            const promise = ReadableStreamPipeTo(this, transform.writable, options2.preventClose, options2.preventAbort, options2.preventCancel, options2.signal);
            setPromiseIsHandledToTrue(promise);
            return transform.readable;
          }
          pipeTo(destination, rawOptions = {}) {
            if (!IsReadableStream(this)) {
              return promiseRejectedWith(streamBrandCheckException$1("pipeTo"));
            }
            if (destination === void 0) {
              return promiseRejectedWith(`Parameter 1 is required in 'pipeTo'.`);
            }
            if (!IsWritableStream(destination)) {
              return promiseRejectedWith(new TypeError(`ReadableStream.prototype.pipeTo's first argument must be a WritableStream`));
            }
            let options2;
            try {
              options2 = convertPipeOptions(rawOptions, "Second parameter");
            } catch (e) {
              return promiseRejectedWith(e);
            }
            if (IsReadableStreamLocked(this)) {
              return promiseRejectedWith(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked ReadableStream"));
            }
            if (IsWritableStreamLocked(destination)) {
              return promiseRejectedWith(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked WritableStream"));
            }
            return ReadableStreamPipeTo(this, destination, options2.preventClose, options2.preventAbort, options2.preventCancel, options2.signal);
          }
          tee() {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("tee");
            }
            const branches = ReadableStreamTee(this);
            return CreateArrayFromList(branches);
          }
          values(rawOptions = void 0) {
            if (!IsReadableStream(this)) {
              throw streamBrandCheckException$1("values");
            }
            const options2 = convertIteratorOptions(rawOptions, "First parameter");
            return AcquireReadableStreamAsyncIterator(this, options2.preventCancel);
          }
        }
        Object.defineProperties(ReadableStream2.prototype, {
          cancel: { enumerable: true },
          getReader: { enumerable: true },
          pipeThrough: { enumerable: true },
          pipeTo: { enumerable: true },
          tee: { enumerable: true },
          values: { enumerable: true },
          locked: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ReadableStream2.prototype, SymbolPolyfill.toStringTag, {
            value: "ReadableStream",
            configurable: true
          });
        }
        if (typeof SymbolPolyfill.asyncIterator === "symbol") {
          Object.defineProperty(ReadableStream2.prototype, SymbolPolyfill.asyncIterator, {
            value: ReadableStream2.prototype.values,
            writable: true,
            configurable: true
          });
        }
        function CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark = 1, sizeAlgorithm = () => 1) {
          const stream = Object.create(ReadableStream2.prototype);
          InitializeReadableStream(stream);
          const controller = Object.create(ReadableStreamDefaultController.prototype);
          SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm);
          return stream;
        }
        function CreateReadableByteStream(startAlgorithm, pullAlgorithm, cancelAlgorithm) {
          const stream = Object.create(ReadableStream2.prototype);
          InitializeReadableStream(stream);
          const controller = Object.create(ReadableByteStreamController.prototype);
          SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, 0, void 0);
          return stream;
        }
        function InitializeReadableStream(stream) {
          stream._state = "readable";
          stream._reader = void 0;
          stream._storedError = void 0;
          stream._disturbed = false;
        }
        function IsReadableStream(x) {
          if (!typeIsObject(x)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x, "_readableStreamController")) {
            return false;
          }
          return x instanceof ReadableStream2;
        }
        function IsReadableStreamLocked(stream) {
          if (stream._reader === void 0) {
            return false;
          }
          return true;
        }
        function ReadableStreamCancel(stream, reason) {
          stream._disturbed = true;
          if (stream._state === "closed") {
            return promiseResolvedWith(void 0);
          }
          if (stream._state === "errored") {
            return promiseRejectedWith(stream._storedError);
          }
          ReadableStreamClose(stream);
          const reader = stream._reader;
          if (reader !== void 0 && IsReadableStreamBYOBReader(reader)) {
            reader._readIntoRequests.forEach((readIntoRequest) => {
              readIntoRequest._closeSteps(void 0);
            });
            reader._readIntoRequests = new SimpleQueue();
          }
          const sourceCancelPromise = stream._readableStreamController[CancelSteps](reason);
          return transformPromiseWith(sourceCancelPromise, noop2);
        }
        function ReadableStreamClose(stream) {
          stream._state = "closed";
          const reader = stream._reader;
          if (reader === void 0) {
            return;
          }
          defaultReaderClosedPromiseResolve(reader);
          if (IsReadableStreamDefaultReader(reader)) {
            reader._readRequests.forEach((readRequest) => {
              readRequest._closeSteps();
            });
            reader._readRequests = new SimpleQueue();
          }
        }
        function ReadableStreamError(stream, e) {
          stream._state = "errored";
          stream._storedError = e;
          const reader = stream._reader;
          if (reader === void 0) {
            return;
          }
          defaultReaderClosedPromiseReject(reader, e);
          if (IsReadableStreamDefaultReader(reader)) {
            reader._readRequests.forEach((readRequest) => {
              readRequest._errorSteps(e);
            });
            reader._readRequests = new SimpleQueue();
          } else {
            reader._readIntoRequests.forEach((readIntoRequest) => {
              readIntoRequest._errorSteps(e);
            });
            reader._readIntoRequests = new SimpleQueue();
          }
        }
        function streamBrandCheckException$1(name) {
          return new TypeError(`ReadableStream.prototype.${name} can only be used on a ReadableStream`);
        }
        function convertQueuingStrategyInit(init2, context) {
          assertDictionary(init2, context);
          const highWaterMark = init2 === null || init2 === void 0 ? void 0 : init2.highWaterMark;
          assertRequiredField(highWaterMark, "highWaterMark", "QueuingStrategyInit");
          return {
            highWaterMark: convertUnrestrictedDouble(highWaterMark)
          };
        }
        const byteLengthSizeFunction = (chunk) => {
          return chunk.byteLength;
        };
        Object.defineProperty(byteLengthSizeFunction, "name", {
          value: "size",
          configurable: true
        });
        class ByteLengthQueuingStrategy {
          constructor(options2) {
            assertRequiredArgument(options2, 1, "ByteLengthQueuingStrategy");
            options2 = convertQueuingStrategyInit(options2, "First parameter");
            this._byteLengthQueuingStrategyHighWaterMark = options2.highWaterMark;
          }
          get highWaterMark() {
            if (!IsByteLengthQueuingStrategy(this)) {
              throw byteLengthBrandCheckException("highWaterMark");
            }
            return this._byteLengthQueuingStrategyHighWaterMark;
          }
          get size() {
            if (!IsByteLengthQueuingStrategy(this)) {
              throw byteLengthBrandCheckException("size");
            }
            return byteLengthSizeFunction;
          }
        }
        Object.defineProperties(ByteLengthQueuingStrategy.prototype, {
          highWaterMark: { enumerable: true },
          size: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(ByteLengthQueuingStrategy.prototype, SymbolPolyfill.toStringTag, {
            value: "ByteLengthQueuingStrategy",
            configurable: true
          });
        }
        function byteLengthBrandCheckException(name) {
          return new TypeError(`ByteLengthQueuingStrategy.prototype.${name} can only be used on a ByteLengthQueuingStrategy`);
        }
        function IsByteLengthQueuingStrategy(x) {
          if (!typeIsObject(x)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x, "_byteLengthQueuingStrategyHighWaterMark")) {
            return false;
          }
          return x instanceof ByteLengthQueuingStrategy;
        }
        const countSizeFunction = () => {
          return 1;
        };
        Object.defineProperty(countSizeFunction, "name", {
          value: "size",
          configurable: true
        });
        class CountQueuingStrategy {
          constructor(options2) {
            assertRequiredArgument(options2, 1, "CountQueuingStrategy");
            options2 = convertQueuingStrategyInit(options2, "First parameter");
            this._countQueuingStrategyHighWaterMark = options2.highWaterMark;
          }
          get highWaterMark() {
            if (!IsCountQueuingStrategy(this)) {
              throw countBrandCheckException("highWaterMark");
            }
            return this._countQueuingStrategyHighWaterMark;
          }
          get size() {
            if (!IsCountQueuingStrategy(this)) {
              throw countBrandCheckException("size");
            }
            return countSizeFunction;
          }
        }
        Object.defineProperties(CountQueuingStrategy.prototype, {
          highWaterMark: { enumerable: true },
          size: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(CountQueuingStrategy.prototype, SymbolPolyfill.toStringTag, {
            value: "CountQueuingStrategy",
            configurable: true
          });
        }
        function countBrandCheckException(name) {
          return new TypeError(`CountQueuingStrategy.prototype.${name} can only be used on a CountQueuingStrategy`);
        }
        function IsCountQueuingStrategy(x) {
          if (!typeIsObject(x)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x, "_countQueuingStrategyHighWaterMark")) {
            return false;
          }
          return x instanceof CountQueuingStrategy;
        }
        function convertTransformer(original, context) {
          assertDictionary(original, context);
          const flush = original === null || original === void 0 ? void 0 : original.flush;
          const readableType = original === null || original === void 0 ? void 0 : original.readableType;
          const start = original === null || original === void 0 ? void 0 : original.start;
          const transform = original === null || original === void 0 ? void 0 : original.transform;
          const writableType = original === null || original === void 0 ? void 0 : original.writableType;
          return {
            flush: flush === void 0 ? void 0 : convertTransformerFlushCallback(flush, original, `${context} has member 'flush' that`),
            readableType,
            start: start === void 0 ? void 0 : convertTransformerStartCallback(start, original, `${context} has member 'start' that`),
            transform: transform === void 0 ? void 0 : convertTransformerTransformCallback(transform, original, `${context} has member 'transform' that`),
            writableType
          };
        }
        function convertTransformerFlushCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => promiseCall(fn, original, [controller]);
        }
        function convertTransformerStartCallback(fn, original, context) {
          assertFunction(fn, context);
          return (controller) => reflectCall(fn, original, [controller]);
        }
        function convertTransformerTransformCallback(fn, original, context) {
          assertFunction(fn, context);
          return (chunk, controller) => promiseCall(fn, original, [chunk, controller]);
        }
        class TransformStream {
          constructor(rawTransformer = {}, rawWritableStrategy = {}, rawReadableStrategy = {}) {
            if (rawTransformer === void 0) {
              rawTransformer = null;
            }
            const writableStrategy = convertQueuingStrategy(rawWritableStrategy, "Second parameter");
            const readableStrategy = convertQueuingStrategy(rawReadableStrategy, "Third parameter");
            const transformer = convertTransformer(rawTransformer, "First parameter");
            if (transformer.readableType !== void 0) {
              throw new RangeError("Invalid readableType specified");
            }
            if (transformer.writableType !== void 0) {
              throw new RangeError("Invalid writableType specified");
            }
            const readableHighWaterMark = ExtractHighWaterMark(readableStrategy, 0);
            const readableSizeAlgorithm = ExtractSizeAlgorithm(readableStrategy);
            const writableHighWaterMark = ExtractHighWaterMark(writableStrategy, 1);
            const writableSizeAlgorithm = ExtractSizeAlgorithm(writableStrategy);
            let startPromise_resolve;
            const startPromise = newPromise((resolve2) => {
              startPromise_resolve = resolve2;
            });
            InitializeTransformStream(this, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm);
            SetUpTransformStreamDefaultControllerFromTransformer(this, transformer);
            if (transformer.start !== void 0) {
              startPromise_resolve(transformer.start(this._transformStreamController));
            } else {
              startPromise_resolve(void 0);
            }
          }
          get readable() {
            if (!IsTransformStream(this)) {
              throw streamBrandCheckException("readable");
            }
            return this._readable;
          }
          get writable() {
            if (!IsTransformStream(this)) {
              throw streamBrandCheckException("writable");
            }
            return this._writable;
          }
        }
        Object.defineProperties(TransformStream.prototype, {
          readable: { enumerable: true },
          writable: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(TransformStream.prototype, SymbolPolyfill.toStringTag, {
            value: "TransformStream",
            configurable: true
          });
        }
        function InitializeTransformStream(stream, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm) {
          function startAlgorithm() {
            return startPromise;
          }
          function writeAlgorithm(chunk) {
            return TransformStreamDefaultSinkWriteAlgorithm(stream, chunk);
          }
          function abortAlgorithm(reason) {
            return TransformStreamDefaultSinkAbortAlgorithm(stream, reason);
          }
          function closeAlgorithm() {
            return TransformStreamDefaultSinkCloseAlgorithm(stream);
          }
          stream._writable = CreateWritableStream(startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, writableHighWaterMark, writableSizeAlgorithm);
          function pullAlgorithm() {
            return TransformStreamDefaultSourcePullAlgorithm(stream);
          }
          function cancelAlgorithm(reason) {
            TransformStreamErrorWritableAndUnblockWrite(stream, reason);
            return promiseResolvedWith(void 0);
          }
          stream._readable = CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, readableHighWaterMark, readableSizeAlgorithm);
          stream._backpressure = void 0;
          stream._backpressureChangePromise = void 0;
          stream._backpressureChangePromise_resolve = void 0;
          TransformStreamSetBackpressure(stream, true);
          stream._transformStreamController = void 0;
        }
        function IsTransformStream(x) {
          if (!typeIsObject(x)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x, "_transformStreamController")) {
            return false;
          }
          return x instanceof TransformStream;
        }
        function TransformStreamError(stream, e) {
          ReadableStreamDefaultControllerError(stream._readable._readableStreamController, e);
          TransformStreamErrorWritableAndUnblockWrite(stream, e);
        }
        function TransformStreamErrorWritableAndUnblockWrite(stream, e) {
          TransformStreamDefaultControllerClearAlgorithms(stream._transformStreamController);
          WritableStreamDefaultControllerErrorIfNeeded(stream._writable._writableStreamController, e);
          if (stream._backpressure) {
            TransformStreamSetBackpressure(stream, false);
          }
        }
        function TransformStreamSetBackpressure(stream, backpressure) {
          if (stream._backpressureChangePromise !== void 0) {
            stream._backpressureChangePromise_resolve();
          }
          stream._backpressureChangePromise = newPromise((resolve2) => {
            stream._backpressureChangePromise_resolve = resolve2;
          });
          stream._backpressure = backpressure;
        }
        class TransformStreamDefaultController {
          constructor() {
            throw new TypeError("Illegal constructor");
          }
          get desiredSize() {
            if (!IsTransformStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException("desiredSize");
            }
            const readableController = this._controlledTransformStream._readable._readableStreamController;
            return ReadableStreamDefaultControllerGetDesiredSize(readableController);
          }
          enqueue(chunk = void 0) {
            if (!IsTransformStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException("enqueue");
            }
            TransformStreamDefaultControllerEnqueue(this, chunk);
          }
          error(reason = void 0) {
            if (!IsTransformStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException("error");
            }
            TransformStreamDefaultControllerError(this, reason);
          }
          terminate() {
            if (!IsTransformStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException("terminate");
            }
            TransformStreamDefaultControllerTerminate(this);
          }
        }
        Object.defineProperties(TransformStreamDefaultController.prototype, {
          enqueue: { enumerable: true },
          error: { enumerable: true },
          terminate: { enumerable: true },
          desiredSize: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(TransformStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
            value: "TransformStreamDefaultController",
            configurable: true
          });
        }
        function IsTransformStreamDefaultController(x) {
          if (!typeIsObject(x)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x, "_controlledTransformStream")) {
            return false;
          }
          return x instanceof TransformStreamDefaultController;
        }
        function SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm) {
          controller._controlledTransformStream = stream;
          stream._transformStreamController = controller;
          controller._transformAlgorithm = transformAlgorithm;
          controller._flushAlgorithm = flushAlgorithm;
        }
        function SetUpTransformStreamDefaultControllerFromTransformer(stream, transformer) {
          const controller = Object.create(TransformStreamDefaultController.prototype);
          let transformAlgorithm = (chunk) => {
            try {
              TransformStreamDefaultControllerEnqueue(controller, chunk);
              return promiseResolvedWith(void 0);
            } catch (transformResultE) {
              return promiseRejectedWith(transformResultE);
            }
          };
          let flushAlgorithm = () => promiseResolvedWith(void 0);
          if (transformer.transform !== void 0) {
            transformAlgorithm = (chunk) => transformer.transform(chunk, controller);
          }
          if (transformer.flush !== void 0) {
            flushAlgorithm = () => transformer.flush(controller);
          }
          SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm);
        }
        function TransformStreamDefaultControllerClearAlgorithms(controller) {
          controller._transformAlgorithm = void 0;
          controller._flushAlgorithm = void 0;
        }
        function TransformStreamDefaultControllerEnqueue(controller, chunk) {
          const stream = controller._controlledTransformStream;
          const readableController = stream._readable._readableStreamController;
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(readableController)) {
            throw new TypeError("Readable side is not in a state that permits enqueue");
          }
          try {
            ReadableStreamDefaultControllerEnqueue(readableController, chunk);
          } catch (e) {
            TransformStreamErrorWritableAndUnblockWrite(stream, e);
            throw stream._readable._storedError;
          }
          const backpressure = ReadableStreamDefaultControllerHasBackpressure(readableController);
          if (backpressure !== stream._backpressure) {
            TransformStreamSetBackpressure(stream, true);
          }
        }
        function TransformStreamDefaultControllerError(controller, e) {
          TransformStreamError(controller._controlledTransformStream, e);
        }
        function TransformStreamDefaultControllerPerformTransform(controller, chunk) {
          const transformPromise = controller._transformAlgorithm(chunk);
          return transformPromiseWith(transformPromise, void 0, (r) => {
            TransformStreamError(controller._controlledTransformStream, r);
            throw r;
          });
        }
        function TransformStreamDefaultControllerTerminate(controller) {
          const stream = controller._controlledTransformStream;
          const readableController = stream._readable._readableStreamController;
          ReadableStreamDefaultControllerClose(readableController);
          const error2 = new TypeError("TransformStream terminated");
          TransformStreamErrorWritableAndUnblockWrite(stream, error2);
        }
        function TransformStreamDefaultSinkWriteAlgorithm(stream, chunk) {
          const controller = stream._transformStreamController;
          if (stream._backpressure) {
            const backpressureChangePromise = stream._backpressureChangePromise;
            return transformPromiseWith(backpressureChangePromise, () => {
              const writable2 = stream._writable;
              const state = writable2._state;
              if (state === "erroring") {
                throw writable2._storedError;
              }
              return TransformStreamDefaultControllerPerformTransform(controller, chunk);
            });
          }
          return TransformStreamDefaultControllerPerformTransform(controller, chunk);
        }
        function TransformStreamDefaultSinkAbortAlgorithm(stream, reason) {
          TransformStreamError(stream, reason);
          return promiseResolvedWith(void 0);
        }
        function TransformStreamDefaultSinkCloseAlgorithm(stream) {
          const readable = stream._readable;
          const controller = stream._transformStreamController;
          const flushPromise = controller._flushAlgorithm();
          TransformStreamDefaultControllerClearAlgorithms(controller);
          return transformPromiseWith(flushPromise, () => {
            if (readable._state === "errored") {
              throw readable._storedError;
            }
            ReadableStreamDefaultControllerClose(readable._readableStreamController);
          }, (r) => {
            TransformStreamError(stream, r);
            throw readable._storedError;
          });
        }
        function TransformStreamDefaultSourcePullAlgorithm(stream) {
          TransformStreamSetBackpressure(stream, false);
          return stream._backpressureChangePromise;
        }
        function defaultControllerBrandCheckException(name) {
          return new TypeError(`TransformStreamDefaultController.prototype.${name} can only be used on a TransformStreamDefaultController`);
        }
        function streamBrandCheckException(name) {
          return new TypeError(`TransformStream.prototype.${name} can only be used on a TransformStream`);
        }
        exports2.ByteLengthQueuingStrategy = ByteLengthQueuingStrategy;
        exports2.CountQueuingStrategy = CountQueuingStrategy;
        exports2.ReadableByteStreamController = ReadableByteStreamController;
        exports2.ReadableStream = ReadableStream2;
        exports2.ReadableStreamBYOBReader = ReadableStreamBYOBReader;
        exports2.ReadableStreamBYOBRequest = ReadableStreamBYOBRequest;
        exports2.ReadableStreamDefaultController = ReadableStreamDefaultController;
        exports2.ReadableStreamDefaultReader = ReadableStreamDefaultReader;
        exports2.TransformStream = TransformStream;
        exports2.TransformStreamDefaultController = TransformStreamDefaultController;
        exports2.WritableStream = WritableStream;
        exports2.WritableStreamDefaultController = WritableStreamDefaultController;
        exports2.WritableStreamDefaultWriter = WritableStreamDefaultWriter;
        Object.defineProperty(exports2, "__esModule", { value: true });
      });
    })(ponyfill_es2018, ponyfill_es2018.exports);
    POOL_SIZE$1 = 65536;
    if (!globalThis.ReadableStream) {
      try {
        const process2 = require("node:process");
        const { emitWarning } = process2;
        try {
          process2.emitWarning = () => {
          };
          Object.assign(globalThis, require("node:stream/web"));
          process2.emitWarning = emitWarning;
        } catch (error2) {
          process2.emitWarning = emitWarning;
          throw error2;
        }
      } catch (error2) {
        Object.assign(globalThis, ponyfill_es2018.exports);
      }
    }
    try {
      const { Blob: Blob3 } = require("buffer");
      if (Blob3 && !Blob3.prototype.stream) {
        Blob3.prototype.stream = function name(params) {
          let position = 0;
          const blob = this;
          return new ReadableStream({
            type: "bytes",
            async pull(ctrl) {
              const chunk = blob.slice(position, Math.min(blob.size, position + POOL_SIZE$1));
              const buffer = await chunk.arrayBuffer();
              position += buffer.byteLength;
              ctrl.enqueue(new Uint8Array(buffer));
              if (position === blob.size) {
                ctrl.close();
              }
            }
          });
        };
      }
    } catch (error2) {
    }
    POOL_SIZE = 65536;
    _Blob = class Blob {
      #parts = [];
      #type = "";
      #size = 0;
      constructor(blobParts = [], options2 = {}) {
        if (typeof blobParts !== "object" || blobParts === null) {
          throw new TypeError("Failed to construct 'Blob': The provided value cannot be converted to a sequence.");
        }
        if (typeof blobParts[Symbol.iterator] !== "function") {
          throw new TypeError("Failed to construct 'Blob': The object must have a callable @@iterator property.");
        }
        if (typeof options2 !== "object" && typeof options2 !== "function") {
          throw new TypeError("Failed to construct 'Blob': parameter 2 cannot convert to dictionary.");
        }
        if (options2 === null)
          options2 = {};
        const encoder = new TextEncoder();
        for (const element of blobParts) {
          let part;
          if (ArrayBuffer.isView(element)) {
            part = new Uint8Array(element.buffer.slice(element.byteOffset, element.byteOffset + element.byteLength));
          } else if (element instanceof ArrayBuffer) {
            part = new Uint8Array(element.slice(0));
          } else if (element instanceof Blob) {
            part = element;
          } else {
            part = encoder.encode(element);
          }
          this.#size += ArrayBuffer.isView(part) ? part.byteLength : part.size;
          this.#parts.push(part);
        }
        const type = options2.type === void 0 ? "" : String(options2.type);
        this.#type = /^[\x20-\x7E]*$/.test(type) ? type : "";
      }
      get size() {
        return this.#size;
      }
      get type() {
        return this.#type;
      }
      async text() {
        const decoder = new TextDecoder();
        let str = "";
        for await (const part of toIterator(this.#parts, false)) {
          str += decoder.decode(part, { stream: true });
        }
        str += decoder.decode();
        return str;
      }
      async arrayBuffer() {
        const data = new Uint8Array(this.size);
        let offset = 0;
        for await (const chunk of toIterator(this.#parts, false)) {
          data.set(chunk, offset);
          offset += chunk.length;
        }
        return data.buffer;
      }
      stream() {
        const it = toIterator(this.#parts, true);
        return new globalThis.ReadableStream({
          type: "bytes",
          async pull(ctrl) {
            const chunk = await it.next();
            chunk.done ? ctrl.close() : ctrl.enqueue(chunk.value);
          },
          async cancel() {
            await it.return();
          }
        });
      }
      slice(start = 0, end = this.size, type = "") {
        const { size } = this;
        let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
        let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
        const span = Math.max(relativeEnd - relativeStart, 0);
        const parts = this.#parts;
        const blobParts = [];
        let added = 0;
        for (const part of parts) {
          if (added >= span) {
            break;
          }
          const size2 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
          if (relativeStart && size2 <= relativeStart) {
            relativeStart -= size2;
            relativeEnd -= size2;
          } else {
            let chunk;
            if (ArrayBuffer.isView(part)) {
              chunk = part.subarray(relativeStart, Math.min(size2, relativeEnd));
              added += chunk.byteLength;
            } else {
              chunk = part.slice(relativeStart, Math.min(size2, relativeEnd));
              added += chunk.size;
            }
            relativeEnd -= size2;
            blobParts.push(chunk);
            relativeStart = 0;
          }
        }
        const blob = new Blob([], { type: String(type).toLowerCase() });
        blob.#size = span;
        blob.#parts = blobParts;
        return blob;
      }
      get [Symbol.toStringTag]() {
        return "Blob";
      }
      static [Symbol.hasInstance](object) {
        return object && typeof object === "object" && typeof object.constructor === "function" && (typeof object.stream === "function" || typeof object.arrayBuffer === "function") && /^(Blob|File)$/.test(object[Symbol.toStringTag]);
      }
    };
    Object.defineProperties(_Blob.prototype, {
      size: { enumerable: true },
      type: { enumerable: true },
      slice: { enumerable: true }
    });
    Blob2 = _Blob;
    Blob$1 = Blob2;
    FetchBaseError = class extends Error {
      constructor(message, type) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.type = type;
      }
      get name() {
        return this.constructor.name;
      }
      get [Symbol.toStringTag]() {
        return this.constructor.name;
      }
    };
    FetchError = class extends FetchBaseError {
      constructor(message, type, systemError) {
        super(message, type);
        if (systemError) {
          this.code = this.errno = systemError.code;
          this.erroredSysCall = systemError.syscall;
        }
      }
    };
    NAME = Symbol.toStringTag;
    isURLSearchParameters = (object) => {
      return typeof object === "object" && typeof object.append === "function" && typeof object.delete === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.has === "function" && typeof object.set === "function" && typeof object.sort === "function" && object[NAME] === "URLSearchParams";
    };
    isBlob = (object) => {
      return typeof object === "object" && typeof object.arrayBuffer === "function" && typeof object.type === "string" && typeof object.stream === "function" && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[NAME]);
    };
    isAbortSignal = (object) => {
      return typeof object === "object" && (object[NAME] === "AbortSignal" || object[NAME] === "EventTarget");
    };
    carriage = "\r\n";
    dashes = "-".repeat(2);
    carriageLength = Buffer.byteLength(carriage);
    getFooter = (boundary) => `${dashes}${boundary}${dashes}${carriage.repeat(2)}`;
    getBoundary = () => (0, import_crypto.randomBytes)(8).toString("hex");
    INTERNALS$2 = Symbol("Body internals");
    Body = class {
      constructor(body, {
        size = 0
      } = {}) {
        let boundary = null;
        if (body === null) {
          body = null;
        } else if (isURLSearchParameters(body)) {
          body = Buffer.from(body.toString());
        } else if (isBlob(body))
          ;
        else if (Buffer.isBuffer(body))
          ;
        else if (import_util.types.isAnyArrayBuffer(body)) {
          body = Buffer.from(body);
        } else if (ArrayBuffer.isView(body)) {
          body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
        } else if (body instanceof import_stream.default)
          ;
        else if (isFormData(body)) {
          boundary = `NodeFetchFormDataBoundary${getBoundary()}`;
          body = import_stream.default.Readable.from(formDataIterator(body, boundary));
        } else {
          body = Buffer.from(String(body));
        }
        this[INTERNALS$2] = {
          body,
          boundary,
          disturbed: false,
          error: null
        };
        this.size = size;
        if (body instanceof import_stream.default) {
          body.on("error", (error_) => {
            const error2 = error_ instanceof FetchBaseError ? error_ : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${error_.message}`, "system", error_);
            this[INTERNALS$2].error = error2;
          });
        }
      }
      get body() {
        return this[INTERNALS$2].body;
      }
      get bodyUsed() {
        return this[INTERNALS$2].disturbed;
      }
      async arrayBuffer() {
        const { buffer, byteOffset, byteLength } = await consumeBody(this);
        return buffer.slice(byteOffset, byteOffset + byteLength);
      }
      async blob() {
        const ct = this.headers && this.headers.get("content-type") || this[INTERNALS$2].body && this[INTERNALS$2].body.type || "";
        const buf = await this.buffer();
        return new Blob$1([buf], {
          type: ct
        });
      }
      async json() {
        const buffer = await consumeBody(this);
        return JSON.parse(buffer.toString());
      }
      async text() {
        const buffer = await consumeBody(this);
        return buffer.toString();
      }
      buffer() {
        return consumeBody(this);
      }
    };
    Object.defineProperties(Body.prototype, {
      body: { enumerable: true },
      bodyUsed: { enumerable: true },
      arrayBuffer: { enumerable: true },
      blob: { enumerable: true },
      json: { enumerable: true },
      text: { enumerable: true }
    });
    clone = (instance, highWaterMark) => {
      let p1;
      let p2;
      let { body } = instance;
      if (instance.bodyUsed) {
        throw new Error("cannot clone body after it is used");
      }
      if (body instanceof import_stream.default && typeof body.getBoundary !== "function") {
        p1 = new import_stream.PassThrough({ highWaterMark });
        p2 = new import_stream.PassThrough({ highWaterMark });
        body.pipe(p1);
        body.pipe(p2);
        instance[INTERNALS$2].body = p1;
        body = p2;
      }
      return body;
    };
    extractContentType = (body, request) => {
      if (body === null) {
        return null;
      }
      if (typeof body === "string") {
        return "text/plain;charset=UTF-8";
      }
      if (isURLSearchParameters(body)) {
        return "application/x-www-form-urlencoded;charset=UTF-8";
      }
      if (isBlob(body)) {
        return body.type || null;
      }
      if (Buffer.isBuffer(body) || import_util.types.isAnyArrayBuffer(body) || ArrayBuffer.isView(body)) {
        return null;
      }
      if (body && typeof body.getBoundary === "function") {
        return `multipart/form-data;boundary=${body.getBoundary()}`;
      }
      if (isFormData(body)) {
        return `multipart/form-data; boundary=${request[INTERNALS$2].boundary}`;
      }
      if (body instanceof import_stream.default) {
        return null;
      }
      return "text/plain;charset=UTF-8";
    };
    getTotalBytes = (request) => {
      const { body } = request;
      if (body === null) {
        return 0;
      }
      if (isBlob(body)) {
        return body.size;
      }
      if (Buffer.isBuffer(body)) {
        return body.length;
      }
      if (body && typeof body.getLengthSync === "function") {
        return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null;
      }
      if (isFormData(body)) {
        return getFormDataLength(request[INTERNALS$2].boundary);
      }
      return null;
    };
    writeToStream = (dest, { body }) => {
      if (body === null) {
        dest.end();
      } else if (isBlob(body)) {
        import_stream.default.Readable.from(body.stream()).pipe(dest);
      } else if (Buffer.isBuffer(body)) {
        dest.write(body);
        dest.end();
      } else {
        body.pipe(dest);
      }
    };
    validateHeaderName = typeof import_http.default.validateHeaderName === "function" ? import_http.default.validateHeaderName : (name) => {
      if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
        const error2 = new TypeError(`Header name must be a valid HTTP token [${name}]`);
        Object.defineProperty(error2, "code", { value: "ERR_INVALID_HTTP_TOKEN" });
        throw error2;
      }
    };
    validateHeaderValue = typeof import_http.default.validateHeaderValue === "function" ? import_http.default.validateHeaderValue : (name, value) => {
      if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
        const error2 = new TypeError(`Invalid character in header content ["${name}"]`);
        Object.defineProperty(error2, "code", { value: "ERR_INVALID_CHAR" });
        throw error2;
      }
    };
    Headers = class extends URLSearchParams {
      constructor(init2) {
        let result = [];
        if (init2 instanceof Headers) {
          const raw = init2.raw();
          for (const [name, values] of Object.entries(raw)) {
            result.push(...values.map((value) => [name, value]));
          }
        } else if (init2 == null)
          ;
        else if (typeof init2 === "object" && !import_util.types.isBoxedPrimitive(init2)) {
          const method = init2[Symbol.iterator];
          if (method == null) {
            result.push(...Object.entries(init2));
          } else {
            if (typeof method !== "function") {
              throw new TypeError("Header pairs must be iterable");
            }
            result = [...init2].map((pair) => {
              if (typeof pair !== "object" || import_util.types.isBoxedPrimitive(pair)) {
                throw new TypeError("Each header pair must be an iterable object");
              }
              return [...pair];
            }).map((pair) => {
              if (pair.length !== 2) {
                throw new TypeError("Each header pair must be a name/value tuple");
              }
              return [...pair];
            });
          }
        } else {
          throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
        }
        result = result.length > 0 ? result.map(([name, value]) => {
          validateHeaderName(name);
          validateHeaderValue(name, String(value));
          return [String(name).toLowerCase(), String(value)];
        }) : void 0;
        super(result);
        return new Proxy(this, {
          get(target, p, receiver) {
            switch (p) {
              case "append":
              case "set":
                return (name, value) => {
                  validateHeaderName(name);
                  validateHeaderValue(name, String(value));
                  return URLSearchParams.prototype[p].call(target, String(name).toLowerCase(), String(value));
                };
              case "delete":
              case "has":
              case "getAll":
                return (name) => {
                  validateHeaderName(name);
                  return URLSearchParams.prototype[p].call(target, String(name).toLowerCase());
                };
              case "keys":
                return () => {
                  target.sort();
                  return new Set(URLSearchParams.prototype.keys.call(target)).keys();
                };
              default:
                return Reflect.get(target, p, receiver);
            }
          }
        });
      }
      get [Symbol.toStringTag]() {
        return this.constructor.name;
      }
      toString() {
        return Object.prototype.toString.call(this);
      }
      get(name) {
        const values = this.getAll(name);
        if (values.length === 0) {
          return null;
        }
        let value = values.join(", ");
        if (/^content-encoding$/i.test(name)) {
          value = value.toLowerCase();
        }
        return value;
      }
      forEach(callback, thisArg = void 0) {
        for (const name of this.keys()) {
          Reflect.apply(callback, thisArg, [this.get(name), name, this]);
        }
      }
      *values() {
        for (const name of this.keys()) {
          yield this.get(name);
        }
      }
      *entries() {
        for (const name of this.keys()) {
          yield [name, this.get(name)];
        }
      }
      [Symbol.iterator]() {
        return this.entries();
      }
      raw() {
        return [...this.keys()].reduce((result, key) => {
          result[key] = this.getAll(key);
          return result;
        }, {});
      }
      [Symbol.for("nodejs.util.inspect.custom")]() {
        return [...this.keys()].reduce((result, key) => {
          const values = this.getAll(key);
          if (key === "host") {
            result[key] = values[0];
          } else {
            result[key] = values.length > 1 ? values : values[0];
          }
          return result;
        }, {});
      }
    };
    Object.defineProperties(Headers.prototype, ["get", "entries", "forEach", "values"].reduce((result, property) => {
      result[property] = { enumerable: true };
      return result;
    }, {}));
    redirectStatus = new Set([301, 302, 303, 307, 308]);
    isRedirect = (code) => {
      return redirectStatus.has(code);
    };
    INTERNALS$1 = Symbol("Response internals");
    Response = class extends Body {
      constructor(body = null, options2 = {}) {
        super(body, options2);
        const status = options2.status != null ? options2.status : 200;
        const headers = new Headers(options2.headers);
        if (body !== null && !headers.has("Content-Type")) {
          const contentType = extractContentType(body);
          if (contentType) {
            headers.append("Content-Type", contentType);
          }
        }
        this[INTERNALS$1] = {
          type: "default",
          url: options2.url,
          status,
          statusText: options2.statusText || "",
          headers,
          counter: options2.counter,
          highWaterMark: options2.highWaterMark
        };
      }
      get type() {
        return this[INTERNALS$1].type;
      }
      get url() {
        return this[INTERNALS$1].url || "";
      }
      get status() {
        return this[INTERNALS$1].status;
      }
      get ok() {
        return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
      }
      get redirected() {
        return this[INTERNALS$1].counter > 0;
      }
      get statusText() {
        return this[INTERNALS$1].statusText;
      }
      get headers() {
        return this[INTERNALS$1].headers;
      }
      get highWaterMark() {
        return this[INTERNALS$1].highWaterMark;
      }
      clone() {
        return new Response(clone(this, this.highWaterMark), {
          type: this.type,
          url: this.url,
          status: this.status,
          statusText: this.statusText,
          headers: this.headers,
          ok: this.ok,
          redirected: this.redirected,
          size: this.size
        });
      }
      static redirect(url, status = 302) {
        if (!isRedirect(status)) {
          throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
        }
        return new Response(null, {
          headers: {
            location: new URL(url).toString()
          },
          status
        });
      }
      static error() {
        const response = new Response(null, { status: 0, statusText: "" });
        response[INTERNALS$1].type = "error";
        return response;
      }
      get [Symbol.toStringTag]() {
        return "Response";
      }
    };
    Object.defineProperties(Response.prototype, {
      type: { enumerable: true },
      url: { enumerable: true },
      status: { enumerable: true },
      ok: { enumerable: true },
      redirected: { enumerable: true },
      statusText: { enumerable: true },
      headers: { enumerable: true },
      clone: { enumerable: true }
    });
    getSearch = (parsedURL) => {
      if (parsedURL.search) {
        return parsedURL.search;
      }
      const lastOffset = parsedURL.href.length - 1;
      const hash2 = parsedURL.hash || (parsedURL.href[lastOffset] === "#" ? "#" : "");
      return parsedURL.href[lastOffset - hash2.length] === "?" ? "?" : "";
    };
    INTERNALS = Symbol("Request internals");
    isRequest = (object) => {
      return typeof object === "object" && typeof object[INTERNALS] === "object";
    };
    Request = class extends Body {
      constructor(input, init2 = {}) {
        let parsedURL;
        if (isRequest(input)) {
          parsedURL = new URL(input.url);
        } else {
          parsedURL = new URL(input);
          input = {};
        }
        let method = init2.method || input.method || "GET";
        method = method.toUpperCase();
        if ((init2.body != null || isRequest(input)) && input.body !== null && (method === "GET" || method === "HEAD")) {
          throw new TypeError("Request with GET/HEAD method cannot have body");
        }
        const inputBody = init2.body ? init2.body : isRequest(input) && input.body !== null ? clone(input) : null;
        super(inputBody, {
          size: init2.size || input.size || 0
        });
        const headers = new Headers(init2.headers || input.headers || {});
        if (inputBody !== null && !headers.has("Content-Type")) {
          const contentType = extractContentType(inputBody, this);
          if (contentType) {
            headers.append("Content-Type", contentType);
          }
        }
        let signal = isRequest(input) ? input.signal : null;
        if ("signal" in init2) {
          signal = init2.signal;
        }
        if (signal != null && !isAbortSignal(signal)) {
          throw new TypeError("Expected signal to be an instanceof AbortSignal or EventTarget");
        }
        this[INTERNALS] = {
          method,
          redirect: init2.redirect || input.redirect || "follow",
          headers,
          parsedURL,
          signal
        };
        this.follow = init2.follow === void 0 ? input.follow === void 0 ? 20 : input.follow : init2.follow;
        this.compress = init2.compress === void 0 ? input.compress === void 0 ? true : input.compress : init2.compress;
        this.counter = init2.counter || input.counter || 0;
        this.agent = init2.agent || input.agent;
        this.highWaterMark = init2.highWaterMark || input.highWaterMark || 16384;
        this.insecureHTTPParser = init2.insecureHTTPParser || input.insecureHTTPParser || false;
      }
      get method() {
        return this[INTERNALS].method;
      }
      get url() {
        return (0, import_url.format)(this[INTERNALS].parsedURL);
      }
      get headers() {
        return this[INTERNALS].headers;
      }
      get redirect() {
        return this[INTERNALS].redirect;
      }
      get signal() {
        return this[INTERNALS].signal;
      }
      clone() {
        return new Request(this);
      }
      get [Symbol.toStringTag]() {
        return "Request";
      }
    };
    Object.defineProperties(Request.prototype, {
      method: { enumerable: true },
      url: { enumerable: true },
      headers: { enumerable: true },
      redirect: { enumerable: true },
      clone: { enumerable: true },
      signal: { enumerable: true }
    });
    getNodeRequestOptions = (request) => {
      const { parsedURL } = request[INTERNALS];
      const headers = new Headers(request[INTERNALS].headers);
      if (!headers.has("Accept")) {
        headers.set("Accept", "*/*");
      }
      let contentLengthValue = null;
      if (request.body === null && /^(post|put)$/i.test(request.method)) {
        contentLengthValue = "0";
      }
      if (request.body !== null) {
        const totalBytes = getTotalBytes(request);
        if (typeof totalBytes === "number" && !Number.isNaN(totalBytes)) {
          contentLengthValue = String(totalBytes);
        }
      }
      if (contentLengthValue) {
        headers.set("Content-Length", contentLengthValue);
      }
      if (!headers.has("User-Agent")) {
        headers.set("User-Agent", "node-fetch");
      }
      if (request.compress && !headers.has("Accept-Encoding")) {
        headers.set("Accept-Encoding", "gzip,deflate,br");
      }
      let { agent } = request;
      if (typeof agent === "function") {
        agent = agent(parsedURL);
      }
      if (!headers.has("Connection") && !agent) {
        headers.set("Connection", "close");
      }
      const search = getSearch(parsedURL);
      const requestOptions = {
        path: parsedURL.pathname + search,
        pathname: parsedURL.pathname,
        hostname: parsedURL.hostname,
        protocol: parsedURL.protocol,
        port: parsedURL.port,
        hash: parsedURL.hash,
        search: parsedURL.search,
        query: parsedURL.query,
        href: parsedURL.href,
        method: request.method,
        headers: headers[Symbol.for("nodejs.util.inspect.custom")](),
        insecureHTTPParser: request.insecureHTTPParser,
        agent
      };
      return requestOptions;
    };
    AbortError = class extends FetchBaseError {
      constructor(message, type = "aborted") {
        super(message, type);
      }
    };
    supportedSchemas = new Set(["data:", "http:", "https:"]);
  }
});

// node_modules/@sveltejs/adapter-netlify/files/shims.js
var init_shims = __esm({
  "node_modules/@sveltejs/adapter-netlify/files/shims.js"() {
    init_install_fetch();
  }
});

// .svelte-kit/output/server/chunks/__layout-db7eea6e.js
var layout_db7eea6e_exports = {};
__export(layout_db7eea6e_exports, {
  default: () => _layout
});
var css$a, Nav, css$9, TheFooter, css$8, Australasia, css$7, Caribbean, css$6, Europe, css$5, Jewish, css$4, Northamerica, css$3, Blog, css$2, General, css$1, Dropdown, css, _layout;
var init_layout_db7eea6e = __esm({
  ".svelte-kit/output/server/chunks/__layout-db7eea6e.js"() {
    init_shims();
    init_app_6a68fa8d();
    css$a = {
      code: ".bg-teal-500.svelte-j03ddw{--tw-bg-opacity:1;background-color:rgba(20, 184, 166, var(--tw-bg-opacity))}.grid.svelte-j03ddw{display:-ms-grid;display:grid}.h-10.svelte-j03ddw{height:2.5rem}.text-4xl.svelte-j03ddw{font-size:2.25rem;line-height:2.5rem}.m-2.svelte-j03ddw{margin:0.5rem}.p-4.svelte-j03ddw{padding:1rem}.text-gray-200.svelte-j03ddw{--tw-text-opacity:1;color:rgba(229, 231, 235, var(--tw-text-opacity))}.gap-4.svelte-j03ddw{grid-gap:1rem;gap:1rem}.grid-cols-3.svelte-j03ddw{grid-template-columns:repeat(3, minmax(0, 1fr))}",
      map: null
    };
    Nav = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$a);
      return `<nav class="${"text-4xl bg-teal-500 text-gray-200 p-4 svelte-j03ddw"}"><div class="${"grid grid-cols-3 gap-4 svelte-j03ddw"}"><div><a href="${"/"}"><img class="${"h-10 m-2 svelte-j03ddw"}" src="${"/images/logo.png"}" alt="${"logo"}"></a></div>
		<div>Family History Tips</div>
		<div></div></div>
</nav>`;
    });
    css$9 = {
      code: ".bg-teal-500.svelte-oqpr3a{--tw-bg-opacity:1;background-color:rgba(20, 184, 166, var(--tw-bg-opacity))}.inline-flex.svelte-oqpr3a{display:-webkit-inline-box;display:-ms-inline-flexbox;display:-webkit-inline-flex;display:inline-flex}.h-8.svelte-oqpr3a{height:2rem}.text-xl.svelte-oqpr3a{font-size:1.25rem;line-height:1.75rem}.m-2.svelte-oqpr3a{margin:0.5rem}.mt-16.svelte-oqpr3a{margin-top:4rem}.p-4.svelte-oqpr3a{padding:1rem}.text-left.svelte-oqpr3a{text-align:left}.text-gray-700.svelte-oqpr3a{--tw-text-opacity:1;color:rgba(55, 65, 81, var(--tw-text-opacity))}",
      map: null
    };
    TheFooter = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$9);
      return `<footer class="${"text-left bg-teal-500 p-4 mt-16 svelte-oqpr3a"}"><div class="${"inline-flex svelte-oqpr3a"}"><h3 class="${"text-left text-gray-700 text-xl svelte-oqpr3a"}">\xA9 2021 Family History</h3>

		<a href="${"http://bit.ly/3nS0tUP"}" target="${"_blank"}"><img class="${"h-8 m-2 svelte-oqpr3a"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/v1608989313/youtube_k4uh6z.jpg"}" alt="${"youtube"}"></a>

		<a href="${"https://bit.ly/3qdBL54"}" target="${"_blank"}"><img class="${"h-8 m-2 svelte-oqpr3a"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_50,w_50/v1636300864/facebook_logo_nhdipi.jpg"}" alt="${"facebook"}"></a></div>
</footer>`;
    });
    css$8 = {
      code: "li>button.svelte-agkwle svg.svelte-agkwle{transform:rotate(-90deg)}li:hover>button.svelte-agkwle svg.svelte-agkwle{transform:rotate(-270deg)}.group.svelte-agkwle:hover .group-hover\\:scale-100.svelte-agkwle{transform:scale(1)}.group.svelte-agkwle:hover .group-hover\\:-rotate-180.svelte-agkwle{transform:rotate(180deg)}.scale-0.svelte-agkwle.svelte-agkwle{transform:scale(0)}.min-w-32.svelte-agkwle.svelte-agkwle{min-width:8rem}.bg-white.svelte-agkwle.svelte-agkwle{--tw-bg-opacity:1;background-color:rgba(255, 255, 255, var(--tw-bg-opacity))}.hover\\:bg-gray-100.svelte-agkwle.svelte-agkwle:hover{--tw-bg-opacity:1;background-color:rgba(243, 244, 246, var(--tw-bg-opacity))}.rounded-sm.svelte-agkwle.svelte-agkwle{border-radius:0.125rem}.border.svelte-agkwle.svelte-agkwle{border-width:1px}.inline-block.svelte-agkwle.svelte-agkwle{display:inline-block}.flex.svelte-agkwle.svelte-agkwle{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}.items-center.svelte-agkwle.svelte-agkwle{-webkit-box-align:center;-ms-flex-align:center;-webkit-align-items:center;align-items:center}.flex-1.svelte-agkwle.svelte-agkwle{-webkit-box-flex:1;-ms-flex:1 1 0%;-webkit-flex:1 1 0%;flex:1 1 0%}.font-semibold.svelte-agkwle.svelte-agkwle{font-weight:600}.h-4.svelte-agkwle.svelte-agkwle{height:1rem}.min-w-32.svelte-agkwle.svelte-agkwle{min-width:8rem}.outline-none.svelte-agkwle.svelte-agkwle{outline:2px solid transparent;outline-offset:2px}.focus\\:outline-none.svelte-agkwle.svelte-agkwle:focus{outline:2px solid transparent;outline-offset:2px}.px-3.svelte-agkwle.svelte-agkwle{padding-left:0.75rem;padding-right:0.75rem}.py-1.svelte-agkwle.svelte-agkwle{padding-top:0.25rem;padding-bottom:0.25rem}.pr-1.svelte-agkwle.svelte-agkwle{padding-right:0.25rem}.absolute.svelte-agkwle.svelte-agkwle{position:absolute}.fill-current.svelte-agkwle.svelte-agkwle{fill:currentColor}.text-gray-900.svelte-agkwle.svelte-agkwle{--tw-text-opacity:1;color:rgba(17, 24, 39, var(--tw-text-opacity))}.hover\\:text-yellow-600.svelte-agkwle.svelte-agkwle:hover{--tw-text-opacity:1;color:rgba(217, 119, 6, var(--tw-text-opacity))}.w-4.svelte-agkwle.svelte-agkwle{width:1rem}.transform.svelte-agkwle.svelte-agkwle{--tw-rotate:0;--tw-rotate-x:0;--tw-rotate-y:0;--tw-rotate-z:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scale-z:1;--tw-skew-x:0;--tw-skew-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-translate-z:0;-webkit-transform:rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z));-ms-transform:rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z));transform:rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z))}.origin-top.svelte-agkwle.svelte-agkwle{-webkit-transform-origin:top;-ms-transform-origin:top;transform-origin:top}.scale-0.svelte-agkwle.svelte-agkwle{--tw-scale-x:0;--tw-scale-y:0;--tw-scale-z:0}.group.svelte-agkwle:hover .group-hover\\:scale-100.svelte-agkwle{--tw-scale-x:1;--tw-scale-y:1;--tw-scale-z:1}.group.svelte-agkwle:hover .group-hover\\:-rotate-180.svelte-agkwle{--tw-rotate:-180deg}.transition.svelte-agkwle.svelte-agkwle{-webkit-transition-property:background-color, border-color, color, fill, stroke, opacity, -webkit-box-shadow, -webkit-transform, filter, backdrop-filter;-o-transition-property:background-color, border-color, color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;transition-property:background-color, border-color, color, fill, stroke, opacity, box-shadow, -webkit-box-shadow, transform, -webkit-transform, filter, backdrop-filter;-webkit-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-o-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-webkit-transition-duration:150ms;-o-transition-duration:150ms;transition-duration:150ms}.ease-in-out.svelte-agkwle.svelte-agkwle{-webkit-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-o-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1)}.duration-150.svelte-agkwle.svelte-agkwle{-webkit-transition-duration:150ms;-o-transition-duration:150ms;transition-duration:150ms}",
      map: null
    };
    Australasia = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$8);
      return `<div class="${"group inline-block svelte-agkwle"}"><button class="${"outline-none focus:outline-none border px-3 py-1 bg-white rounded-sm flex items-center min-w-32 svelte-agkwle"}"><span class="${"pr-1 font-semibold flex-1 svelte-agkwle"}">Australasia</span>
		<span><svg class="${"fill-current h-4 w-4 transform group-hover:-rotate-180 transition duration-150 ease-in-out svelte-agkwle"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 20 20"}"><path d="${"M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"}"></path></svg></span></button>
	<ul class="${"bg-white border rounded-sm transform scale-0 group-hover:scale-100 absolute transition duration-150 ease-in-out origin-top min-w-32 svelte-agkwle"}"><li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-agkwle"}"><a class="${"text-gray-900 hover:text-yellow-600 svelte-agkwle"}" href="${"/australia"}">Australia</a></li>

		<li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-agkwle"}"><a class="${"text-gray-900 hover:text-yellow-600 svelte-agkwle"}" href="${"/newzealand"}">New Zealand</a></li></ul>
</div>`;
    });
    css$7 = {
      code: "li>button.svelte-1mste6j svg.svelte-1mste6j{transform:rotate(-90deg)}li:hover>button.svelte-1mste6j svg.svelte-1mste6j{transform:rotate(-270deg)}.group.svelte-1mste6j:hover .group-hover\\:scale-100.svelte-1mste6j{transform:scale(1)}.group.svelte-1mste6j:hover .group-hover\\:-rotate-180.svelte-1mste6j{transform:rotate(180deg)}.scale-0.svelte-1mste6j.svelte-1mste6j{transform:scale(0)}.min-w-32.svelte-1mste6j.svelte-1mste6j{min-width:8rem}.bg-white.svelte-1mste6j.svelte-1mste6j{--tw-bg-opacity:1;background-color:rgba(255, 255, 255, var(--tw-bg-opacity))}.hover\\:bg-gray-100.svelte-1mste6j.svelte-1mste6j:hover{--tw-bg-opacity:1;background-color:rgba(243, 244, 246, var(--tw-bg-opacity))}.rounded-sm.svelte-1mste6j.svelte-1mste6j{border-radius:0.125rem}.border.svelte-1mste6j.svelte-1mste6j{border-width:1px}.inline-block.svelte-1mste6j.svelte-1mste6j{display:inline-block}.flex.svelte-1mste6j.svelte-1mste6j{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}.items-center.svelte-1mste6j.svelte-1mste6j{-webkit-box-align:center;-ms-flex-align:center;-webkit-align-items:center;align-items:center}.flex-1.svelte-1mste6j.svelte-1mste6j{-webkit-box-flex:1;-ms-flex:1 1 0%;-webkit-flex:1 1 0%;flex:1 1 0%}.font-semibold.svelte-1mste6j.svelte-1mste6j{font-weight:600}.h-4.svelte-1mste6j.svelte-1mste6j{height:1rem}.min-w-32.svelte-1mste6j.svelte-1mste6j{min-width:8rem}.outline-none.svelte-1mste6j.svelte-1mste6j{outline:2px solid transparent;outline-offset:2px}.focus\\:outline-none.svelte-1mste6j.svelte-1mste6j:focus{outline:2px solid transparent;outline-offset:2px}.px-3.svelte-1mste6j.svelte-1mste6j{padding-left:0.75rem;padding-right:0.75rem}.py-1.svelte-1mste6j.svelte-1mste6j{padding-top:0.25rem;padding-bottom:0.25rem}.pr-1.svelte-1mste6j.svelte-1mste6j{padding-right:0.25rem}.absolute.svelte-1mste6j.svelte-1mste6j{position:absolute}.fill-current.svelte-1mste6j.svelte-1mste6j{fill:currentColor}.text-emerald-600.svelte-1mste6j.svelte-1mste6j{--tw-text-opacity:1;color:rgba(5, 150, 105, var(--tw-text-opacity))}.hover\\:text-yellow-600.svelte-1mste6j.svelte-1mste6j:hover{--tw-text-opacity:1;color:rgba(217, 119, 6, var(--tw-text-opacity))}.w-4.svelte-1mste6j.svelte-1mste6j{width:1rem}.transform.svelte-1mste6j.svelte-1mste6j{--tw-rotate:0;--tw-rotate-x:0;--tw-rotate-y:0;--tw-rotate-z:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scale-z:1;--tw-skew-x:0;--tw-skew-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-translate-z:0;-webkit-transform:rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z));-ms-transform:rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z));transform:rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z))}.origin-top.svelte-1mste6j.svelte-1mste6j{-webkit-transform-origin:top;-ms-transform-origin:top;transform-origin:top}.scale-0.svelte-1mste6j.svelte-1mste6j{--tw-scale-x:0;--tw-scale-y:0;--tw-scale-z:0}.group.svelte-1mste6j:hover .group-hover\\:scale-100.svelte-1mste6j{--tw-scale-x:1;--tw-scale-y:1;--tw-scale-z:1}.group.svelte-1mste6j:hover .group-hover\\:-rotate-180.svelte-1mste6j{--tw-rotate:-180deg}.transition.svelte-1mste6j.svelte-1mste6j{-webkit-transition-property:background-color, border-color, color, fill, stroke, opacity, -webkit-box-shadow, -webkit-transform, filter, backdrop-filter;-o-transition-property:background-color, border-color, color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;transition-property:background-color, border-color, color, fill, stroke, opacity, box-shadow, -webkit-box-shadow, transform, -webkit-transform, filter, backdrop-filter;-webkit-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-o-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-webkit-transition-duration:150ms;-o-transition-duration:150ms;transition-duration:150ms}.ease-in-out.svelte-1mste6j.svelte-1mste6j{-webkit-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-o-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1)}.duration-150.svelte-1mste6j.svelte-1mste6j{-webkit-transition-duration:150ms;-o-transition-duration:150ms;transition-duration:150ms}",
      map: null
    };
    Caribbean = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$7);
      return `<div class="${"group inline-block svelte-1mste6j"}"><button class="${"outline-none focus:outline-none border px-3 py-1 bg-white rounded-sm flex items-center min-w-32 svelte-1mste6j"}"><span class="${"pr-1 font-semibold flex-1 svelte-1mste6j"}">Caribbean</span>
		<span><svg class="${"fill-current h-4 w-4 transform group-hover:-rotate-180 transition duration-150 ease-in-out svelte-1mste6j"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 20 20"}"><path d="${"M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"}"></path></svg></span></button>
	<ul class="${"bg-white border rounded-sm transform scale-0 group-hover:scale-100 absolute transition duration-150 ease-in-out origin-top min-w-32 svelte-1mste6j"}"><li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-1mste6j"}"><a class="${"text-emerald-600 hover:text-yellow-600 svelte-1mste6j"}" href="${"/barbados"}">Barbados</a></li>

		<li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-1mste6j"}"><a class="${"text-emerald-600 hover:text-yellow-600 svelte-1mste6j"}" href="${"/bermuda"}">Bermuda</a></li></ul>
</div>`;
    });
    css$6 = {
      code: "li>button.svelte-nt5tq9 svg.svelte-nt5tq9{transform:rotate(-90deg)}li:hover>button.svelte-nt5tq9 svg.svelte-nt5tq9{transform:rotate(-270deg)}.group.svelte-nt5tq9:hover .group-hover\\:scale-100.svelte-nt5tq9{transform:scale(1)}.group.svelte-nt5tq9:hover .group-hover\\:-rotate-180.svelte-nt5tq9{transform:rotate(180deg)}.scale-0.svelte-nt5tq9.svelte-nt5tq9{transform:scale(0)}.min-w-32.svelte-nt5tq9.svelte-nt5tq9{min-width:8rem}.bg-white.svelte-nt5tq9.svelte-nt5tq9{--tw-bg-opacity:1;background-color:rgba(255, 255, 255, var(--tw-bg-opacity))}.hover\\:bg-gray-100.svelte-nt5tq9.svelte-nt5tq9:hover{--tw-bg-opacity:1;background-color:rgba(243, 244, 246, var(--tw-bg-opacity))}.rounded-sm.svelte-nt5tq9.svelte-nt5tq9{border-radius:0.125rem}.border.svelte-nt5tq9.svelte-nt5tq9{border-width:1px}.inline-block.svelte-nt5tq9.svelte-nt5tq9{display:inline-block}.flex.svelte-nt5tq9.svelte-nt5tq9{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}.items-center.svelte-nt5tq9.svelte-nt5tq9{-webkit-box-align:center;-ms-flex-align:center;-webkit-align-items:center;align-items:center}.flex-1.svelte-nt5tq9.svelte-nt5tq9{-webkit-box-flex:1;-ms-flex:1 1 0%;-webkit-flex:1 1 0%;flex:1 1 0%}.font-semibold.svelte-nt5tq9.svelte-nt5tq9{font-weight:600}.h-4.svelte-nt5tq9.svelte-nt5tq9{height:1rem}.min-w-32.svelte-nt5tq9.svelte-nt5tq9{min-width:8rem}.outline-none.svelte-nt5tq9.svelte-nt5tq9{outline:2px solid transparent;outline-offset:2px}.focus\\:outline-none.svelte-nt5tq9.svelte-nt5tq9:focus{outline:2px solid transparent;outline-offset:2px}.px-3.svelte-nt5tq9.svelte-nt5tq9{padding-left:0.75rem;padding-right:0.75rem}.py-1.svelte-nt5tq9.svelte-nt5tq9{padding-top:0.25rem;padding-bottom:0.25rem}.pr-1.svelte-nt5tq9.svelte-nt5tq9{padding-right:0.25rem}.absolute.svelte-nt5tq9.svelte-nt5tq9{position:absolute}.fill-current.svelte-nt5tq9.svelte-nt5tq9{fill:currentColor}.text-red-600.svelte-nt5tq9.svelte-nt5tq9{--tw-text-opacity:1;color:rgba(220, 38, 38, var(--tw-text-opacity))}.hover\\:text-yellow-600.svelte-nt5tq9.svelte-nt5tq9:hover{--tw-text-opacity:1;color:rgba(217, 119, 6, var(--tw-text-opacity))}.w-4.svelte-nt5tq9.svelte-nt5tq9{width:1rem}.transform.svelte-nt5tq9.svelte-nt5tq9{--tw-rotate:0;--tw-rotate-x:0;--tw-rotate-y:0;--tw-rotate-z:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scale-z:1;--tw-skew-x:0;--tw-skew-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-translate-z:0;-webkit-transform:rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z));-ms-transform:rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z));transform:rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z))}.origin-top.svelte-nt5tq9.svelte-nt5tq9{-webkit-transform-origin:top;-ms-transform-origin:top;transform-origin:top}.scale-0.svelte-nt5tq9.svelte-nt5tq9{--tw-scale-x:0;--tw-scale-y:0;--tw-scale-z:0}.group.svelte-nt5tq9:hover .group-hover\\:scale-100.svelte-nt5tq9{--tw-scale-x:1;--tw-scale-y:1;--tw-scale-z:1}.group.svelte-nt5tq9:hover .group-hover\\:-rotate-180.svelte-nt5tq9{--tw-rotate:-180deg}.transition.svelte-nt5tq9.svelte-nt5tq9{-webkit-transition-property:background-color, border-color, color, fill, stroke, opacity, -webkit-box-shadow, -webkit-transform, filter, backdrop-filter;-o-transition-property:background-color, border-color, color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;transition-property:background-color, border-color, color, fill, stroke, opacity, box-shadow, -webkit-box-shadow, transform, -webkit-transform, filter, backdrop-filter;-webkit-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-o-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-webkit-transition-duration:150ms;-o-transition-duration:150ms;transition-duration:150ms}.ease-in-out.svelte-nt5tq9.svelte-nt5tq9{-webkit-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-o-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1)}.duration-150.svelte-nt5tq9.svelte-nt5tq9{-webkit-transition-duration:150ms;-o-transition-duration:150ms;transition-duration:150ms}",
      map: null
    };
    Europe = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$6);
      return `<div class="${"group inline-block svelte-nt5tq9"}"><button class="${"outline-none focus:outline-none border px-3 py-1 bg-white rounded-sm flex items-center min-w-32 svelte-nt5tq9"}"><span class="${"pr-1 font-semibold flex-1 svelte-nt5tq9"}">Europe</span>
      <span><svg class="${"fill-current h-4 w-4 transform group-hover:-rotate-180 transition duration-150 ease-in-out svelte-nt5tq9"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 20 20"}"><path d="${"M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"}"></path></svg></span></button>
    <ul class="${"bg-white border rounded-sm transform scale-0 group-hover:scale-100 absolute transition duration-150 ease-in-out origin-top min-w-32 svelte-nt5tq9"}"><li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-nt5tq9"}"><a class="${"text-red-600 hover:text-yellow-600 svelte-nt5tq9"}" href="${"/austrian"}">Austrian</a></li>

     <li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-nt5tq9"}"><a class="${"text-red-600 hover:text-yellow-600 svelte-nt5tq9"}" href="${"/belarus"}">Belarus</a></li>

    <li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-nt5tq9"}"><a class="${"text-red-600 hover:text-yellow-600 svelte-nt5tq9"}" href="${"/belgium"}">Belgium</a></li>

    <li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-nt5tq9"}"><a class="${"text-red-600 hover:text-yellow-600 svelte-nt5tq9"}" href="${"/british"}">British</a></li>

      

       




        <li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-nt5tq9"}"><g-link class="${"text-red-600 hover:text-yellow-600 svelte-nt5tq9"}" to="${"/europe/frenchgeneral"}">French</g-link></li>
     

      <li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-nt5tq9"}"><g-link class="${"text-red-600 hover:text-yellow-600 svelte-nt5tq9"}" to="${"/Europe/irelandgeneral"}">Ireland</g-link></li>

      <li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-nt5tq9"}"><g-link class="${"text-red-600 hover:text-yellow-600 svelte-nt5tq9"}" to="${"/Europe/netherlandsgeneral"}">Netherlands</g-link></li>

      <li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-nt5tq9"}"><g-link class="${"text-red-600 hover:text-yellow-600 svelte-nt5tq9"}" to="${"/Europe/russiangeneral"}">Russian</g-link></li>

      <li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-nt5tq9"}"><g-link class="${"text-red-600 hover:text-yellow-600 svelte-nt5tq9"}" to="${"/Europe/ukrainegeneral"}">Ukraine</g-link></li></ul>
  </div>`;
    });
    css$5 = {
      code: "li>button.svelte-1bxymtq svg.svelte-1bxymtq{transform:rotate(-90deg)}li:hover>button.svelte-1bxymtq svg.svelte-1bxymtq{transform:rotate(-270deg)}.group.svelte-1bxymtq:hover .group-hover\\:scale-100.svelte-1bxymtq{transform:scale(1)}.group.svelte-1bxymtq:hover .group-hover\\:-rotate-180.svelte-1bxymtq{transform:rotate(180deg)}.scale-0.svelte-1bxymtq.svelte-1bxymtq{transform:scale(0)}.min-w-32.svelte-1bxymtq.svelte-1bxymtq{min-width:8rem}.bg-white.svelte-1bxymtq.svelte-1bxymtq{--tw-bg-opacity:1;background-color:rgba(255, 255, 255, var(--tw-bg-opacity))}.hover\\:bg-gray-100.svelte-1bxymtq.svelte-1bxymtq:hover{--tw-bg-opacity:1;background-color:rgba(243, 244, 246, var(--tw-bg-opacity))}.rounded-sm.svelte-1bxymtq.svelte-1bxymtq{border-radius:0.125rem}.border.svelte-1bxymtq.svelte-1bxymtq{border-width:1px}.inline-block.svelte-1bxymtq.svelte-1bxymtq{display:inline-block}.flex.svelte-1bxymtq.svelte-1bxymtq{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}.items-center.svelte-1bxymtq.svelte-1bxymtq{-webkit-box-align:center;-ms-flex-align:center;-webkit-align-items:center;align-items:center}.flex-1.svelte-1bxymtq.svelte-1bxymtq{-webkit-box-flex:1;-ms-flex:1 1 0%;-webkit-flex:1 1 0%;flex:1 1 0%}.font-semibold.svelte-1bxymtq.svelte-1bxymtq{font-weight:600}.h-4.svelte-1bxymtq.svelte-1bxymtq{height:1rem}.min-w-32.svelte-1bxymtq.svelte-1bxymtq{min-width:8rem}.outline-none.svelte-1bxymtq.svelte-1bxymtq{outline:2px solid transparent;outline-offset:2px}.focus\\:outline-none.svelte-1bxymtq.svelte-1bxymtq:focus{outline:2px solid transparent;outline-offset:2px}.px-3.svelte-1bxymtq.svelte-1bxymtq{padding-left:0.75rem;padding-right:0.75rem}.py-1.svelte-1bxymtq.svelte-1bxymtq{padding-top:0.25rem;padding-bottom:0.25rem}.pr-1.svelte-1bxymtq.svelte-1bxymtq{padding-right:0.25rem}.absolute.svelte-1bxymtq.svelte-1bxymtq{position:absolute}.fill-current.svelte-1bxymtq.svelte-1bxymtq{fill:currentColor}.text-blue-600.svelte-1bxymtq.svelte-1bxymtq{--tw-text-opacity:1;color:rgba(37, 99, 235, var(--tw-text-opacity))}.hover\\:text-yellow-600.svelte-1bxymtq.svelte-1bxymtq:hover{--tw-text-opacity:1;color:rgba(217, 119, 6, var(--tw-text-opacity))}.w-4.svelte-1bxymtq.svelte-1bxymtq{width:1rem}.transform.svelte-1bxymtq.svelte-1bxymtq{--tw-rotate:0;--tw-rotate-x:0;--tw-rotate-y:0;--tw-rotate-z:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scale-z:1;--tw-skew-x:0;--tw-skew-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-translate-z:0;-webkit-transform:rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z));-ms-transform:rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z));transform:rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z))}.origin-top.svelte-1bxymtq.svelte-1bxymtq{-webkit-transform-origin:top;-ms-transform-origin:top;transform-origin:top}.scale-0.svelte-1bxymtq.svelte-1bxymtq{--tw-scale-x:0;--tw-scale-y:0;--tw-scale-z:0}.group.svelte-1bxymtq:hover .group-hover\\:scale-100.svelte-1bxymtq{--tw-scale-x:1;--tw-scale-y:1;--tw-scale-z:1}.group.svelte-1bxymtq:hover .group-hover\\:-rotate-180.svelte-1bxymtq{--tw-rotate:-180deg}.transition.svelte-1bxymtq.svelte-1bxymtq{-webkit-transition-property:background-color, border-color, color, fill, stroke, opacity, -webkit-box-shadow, -webkit-transform, filter, backdrop-filter;-o-transition-property:background-color, border-color, color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;transition-property:background-color, border-color, color, fill, stroke, opacity, box-shadow, -webkit-box-shadow, transform, -webkit-transform, filter, backdrop-filter;-webkit-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-o-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-webkit-transition-duration:150ms;-o-transition-duration:150ms;transition-duration:150ms}.ease-in-out.svelte-1bxymtq.svelte-1bxymtq{-webkit-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-o-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1)}.duration-150.svelte-1bxymtq.svelte-1bxymtq{-webkit-transition-duration:150ms;-o-transition-duration:150ms;transition-duration:150ms}",
      map: null
    };
    Jewish = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$5);
      return `<div class="${"group inline-block svelte-1bxymtq"}"><button class="${"outline-none focus:outline-none border px-3 py-1 bg-white rounded-sm flex items-center min-w-32 svelte-1bxymtq"}"><span class="${"pr-1 font-semibold flex-1 svelte-1bxymtq"}">Jewish</span>
      <span><svg class="${"fill-current h-4 w-4 transform group-hover:-rotate-180 transition duration-150 ease-in-out svelte-1bxymtq"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 20 20"}"><path d="${"M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"}"></path></svg></span></button>
    <ul class="${"bg-white border rounded-sm transform scale-0 group-hover:scale-100 absolute transition duration-150 ease-in-out origin-top min-w-32 svelte-1bxymtq"}"><li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-1bxymtq"}"><g-link class="${"text-blue-600 hover:text-yellow-600 svelte-1bxymtq"}" to="${"/Jewish/australia"}">Australia</g-link></li>

      <li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-1bxymtq"}"><g-link class="${"text-blue-600 hover:text-yellow-600 svelte-1bxymtq"}" to="${"/Jewish/austria"}">Austrian</g-link></li>

      <li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-1bxymtq"}"><g-link class="${"text-blue-600 hover:text-yellow-600 svelte-1bxymtq"}" to="${"/Jewish/belarus"}">Belarus</g-link></li>

      <li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-1bxymtq"}"><g-link class="${"text-blue-600 hover:text-yellow-600 svelte-1bxymtq"}" to="${"/Jewish/british"}">British</g-link></li>

       <li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-1bxymtq"}"><g-link class="${"text-blue-600 hover:text-yellow-600 svelte-1bxymtq"}" to="${"/Jewish/canada"}">Canada</g-link></li>

      <li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-1bxymtq"}"><g-link class="${"text-blue-600 hover:text-yellow-600 svelte-1bxymtq"}" to="${"/Jewish/ireland"}">Ireland</g-link></li>
      <li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-1bxymtq"}"><g-link class="${"text-blue-600 hover:text-yellow-600 svelte-1bxymtq"}" to="${"/Jewish/italian"}">Italian</g-link></li>

      <li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-1bxymtq"}"><g-link class="${"text-blue-600 hover:text-yellow-600 svelte-1bxymtq"}" to="${"/Jewish/netherlands"}">Netherlands</g-link></li>

      <li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-1bxymtq"}"><g-link class="${"text-blue-600 hover:text-yellow-600 svelte-1bxymtq"}" to="${"/Jewish/russia"}">Russian</g-link></li>

      <li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-1bxymtq"}"><g-link class="${"text-blue-600 hover:text-yellow-600 svelte-1bxymtq"}" to="${"/Jewish/ukraine"}">Ukraine</g-link></li>

      <li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-1bxymtq"}"><g-link class="${"text-blue-600 hover:text-yellow-600 svelte-1bxymtq"}" to="${"/Jewish/america"}">USA</g-link></li>

       <li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-1bxymtq"}"><g-link class="${"text-blue-600 hover:text-yellow-600 svelte-1bxymtq"}" to="${"/shoah"}">shoah</g-link></li></ul>
  </div>`;
    });
    css$4 = {
      code: "li>button.svelte-agkwle svg.svelte-agkwle{transform:rotate(-90deg)}li:hover>button.svelte-agkwle svg.svelte-agkwle{transform:rotate(-270deg)}.group.svelte-agkwle:hover .group-hover\\:scale-100.svelte-agkwle{transform:scale(1)}.group.svelte-agkwle:hover .group-hover\\:-rotate-180.svelte-agkwle{transform:rotate(180deg)}.scale-0.svelte-agkwle.svelte-agkwle{transform:scale(0)}.min-w-32.svelte-agkwle.svelte-agkwle{min-width:8rem}.bg-white.svelte-agkwle.svelte-agkwle{--tw-bg-opacity:1;background-color:rgba(255, 255, 255, var(--tw-bg-opacity))}.hover\\:bg-gray-100.svelte-agkwle.svelte-agkwle:hover{--tw-bg-opacity:1;background-color:rgba(243, 244, 246, var(--tw-bg-opacity))}.rounded-sm.svelte-agkwle.svelte-agkwle{border-radius:0.125rem}.border.svelte-agkwle.svelte-agkwle{border-width:1px}.inline-block.svelte-agkwle.svelte-agkwle{display:inline-block}.flex.svelte-agkwle.svelte-agkwle{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}.items-center.svelte-agkwle.svelte-agkwle{-webkit-box-align:center;-ms-flex-align:center;-webkit-align-items:center;align-items:center}.flex-1.svelte-agkwle.svelte-agkwle{-webkit-box-flex:1;-ms-flex:1 1 0%;-webkit-flex:1 1 0%;flex:1 1 0%}.font-semibold.svelte-agkwle.svelte-agkwle{font-weight:600}.h-4.svelte-agkwle.svelte-agkwle{height:1rem}.min-w-32.svelte-agkwle.svelte-agkwle{min-width:8rem}.outline-none.svelte-agkwle.svelte-agkwle{outline:2px solid transparent;outline-offset:2px}.focus\\:outline-none.svelte-agkwle.svelte-agkwle:focus{outline:2px solid transparent;outline-offset:2px}.px-3.svelte-agkwle.svelte-agkwle{padding-left:0.75rem;padding-right:0.75rem}.py-1.svelte-agkwle.svelte-agkwle{padding-top:0.25rem;padding-bottom:0.25rem}.pr-1.svelte-agkwle.svelte-agkwle{padding-right:0.25rem}.absolute.svelte-agkwle.svelte-agkwle{position:absolute}.fill-current.svelte-agkwle.svelte-agkwle{fill:currentColor}.text-gray-900.svelte-agkwle.svelte-agkwle{--tw-text-opacity:1;color:rgba(17, 24, 39, var(--tw-text-opacity))}.hover\\:text-yellow-600.svelte-agkwle.svelte-agkwle:hover{--tw-text-opacity:1;color:rgba(217, 119, 6, var(--tw-text-opacity))}.w-4.svelte-agkwle.svelte-agkwle{width:1rem}.transform.svelte-agkwle.svelte-agkwle{--tw-rotate:0;--tw-rotate-x:0;--tw-rotate-y:0;--tw-rotate-z:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scale-z:1;--tw-skew-x:0;--tw-skew-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-translate-z:0;-webkit-transform:rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z));-ms-transform:rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z));transform:rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z))}.origin-top.svelte-agkwle.svelte-agkwle{-webkit-transform-origin:top;-ms-transform-origin:top;transform-origin:top}.scale-0.svelte-agkwle.svelte-agkwle{--tw-scale-x:0;--tw-scale-y:0;--tw-scale-z:0}.group.svelte-agkwle:hover .group-hover\\:scale-100.svelte-agkwle{--tw-scale-x:1;--tw-scale-y:1;--tw-scale-z:1}.group.svelte-agkwle:hover .group-hover\\:-rotate-180.svelte-agkwle{--tw-rotate:-180deg}.transition.svelte-agkwle.svelte-agkwle{-webkit-transition-property:background-color, border-color, color, fill, stroke, opacity, -webkit-box-shadow, -webkit-transform, filter, backdrop-filter;-o-transition-property:background-color, border-color, color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;transition-property:background-color, border-color, color, fill, stroke, opacity, box-shadow, -webkit-box-shadow, transform, -webkit-transform, filter, backdrop-filter;-webkit-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-o-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-webkit-transition-duration:150ms;-o-transition-duration:150ms;transition-duration:150ms}.ease-in-out.svelte-agkwle.svelte-agkwle{-webkit-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-o-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1)}.duration-150.svelte-agkwle.svelte-agkwle{-webkit-transition-duration:150ms;-o-transition-duration:150ms;transition-duration:150ms}",
      map: null
    };
    Northamerica = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$4);
      return `<div class="${"group inline-block svelte-agkwle"}"><button class="${"outline-none focus:outline-none border px-3 py-1 bg-white rounded-sm flex items-center min-w-32 svelte-agkwle"}"><span class="${"pr-1 font-semibold flex-1 svelte-agkwle"}">North America</span>
		<span><svg class="${"fill-current h-4 w-4 transform group-hover:-rotate-180 transition duration-150 ease-in-out svelte-agkwle"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 20 20"}"><path d="${"M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"}"></path></svg></span></button>
	<ul class="${"bg-white border rounded-sm transform scale-0 group-hover:scale-100 absolute transition duration-150 ease-in-out origin-top min-w-32 svelte-agkwle"}"><li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-agkwle"}"><g-link class="${"text-gray-900 hover:text-yellow-600 svelte-agkwle"}" to="${"/Northamerica/canadageneral"}">Canada</g-link></li>

		<li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-agkwle"}"><g-link class="${"text-gray-900 hover:text-yellow-600 svelte-agkwle"}" to="${"/Northamerica/americangeneral"}">USA</g-link></li></ul>
</div>`;
    });
    css$3 = {
      code: "li>button.svelte-168x2ez svg.svelte-168x2ez{transform:rotate(-90deg)}li:hover>button.svelte-168x2ez svg.svelte-168x2ez{transform:rotate(-270deg)}.group.svelte-168x2ez:hover .group-hover\\:scale-100.svelte-168x2ez{transform:scale(1)}.group.svelte-168x2ez:hover .group-hover\\:-rotate-180.svelte-168x2ez{transform:rotate(180deg)}.scale-0.svelte-168x2ez.svelte-168x2ez{transform:scale(0)}.min-w-32.svelte-168x2ez.svelte-168x2ez{min-width:8rem}.bg-white.svelte-168x2ez.svelte-168x2ez{--tw-bg-opacity:1;background-color:rgba(255, 255, 255, var(--tw-bg-opacity))}.hover\\:bg-gray-100.svelte-168x2ez.svelte-168x2ez:hover{--tw-bg-opacity:1;background-color:rgba(243, 244, 246, var(--tw-bg-opacity))}.rounded-sm.svelte-168x2ez.svelte-168x2ez{border-radius:0.125rem}.border.svelte-168x2ez.svelte-168x2ez{border-width:1px}.inline-block.svelte-168x2ez.svelte-168x2ez{display:inline-block}.flex.svelte-168x2ez.svelte-168x2ez{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}.items-center.svelte-168x2ez.svelte-168x2ez{-webkit-box-align:center;-ms-flex-align:center;-webkit-align-items:center;align-items:center}.flex-1.svelte-168x2ez.svelte-168x2ez{-webkit-box-flex:1;-ms-flex:1 1 0%;-webkit-flex:1 1 0%;flex:1 1 0%}.font-semibold.svelte-168x2ez.svelte-168x2ez{font-weight:600}.h-4.svelte-168x2ez.svelte-168x2ez{height:1rem}.min-w-32.svelte-168x2ez.svelte-168x2ez{min-width:8rem}.outline-none.svelte-168x2ez.svelte-168x2ez{outline:2px solid transparent;outline-offset:2px}.focus\\:outline-none.svelte-168x2ez.svelte-168x2ez:focus{outline:2px solid transparent;outline-offset:2px}.px-3.svelte-168x2ez.svelte-168x2ez{padding-left:0.75rem;padding-right:0.75rem}.py-1.svelte-168x2ez.svelte-168x2ez{padding-top:0.25rem;padding-bottom:0.25rem}.pr-1.svelte-168x2ez.svelte-168x2ez{padding-right:0.25rem}.absolute.svelte-168x2ez.svelte-168x2ez{position:absolute}.fill-current.svelte-168x2ez.svelte-168x2ez{fill:currentColor}.text-cyan-900.svelte-168x2ez.svelte-168x2ez{--tw-text-opacity:1;color:rgba(22, 78, 99, var(--tw-text-opacity))}.hover\\:text-orange-500.svelte-168x2ez.svelte-168x2ez:hover{--tw-text-opacity:1;color:rgba(249, 115, 22, var(--tw-text-opacity))}.w-4.svelte-168x2ez.svelte-168x2ez{width:1rem}.transform.svelte-168x2ez.svelte-168x2ez{--tw-rotate:0;--tw-rotate-x:0;--tw-rotate-y:0;--tw-rotate-z:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scale-z:1;--tw-skew-x:0;--tw-skew-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-translate-z:0;-webkit-transform:rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z));-ms-transform:rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z));transform:rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z))}.origin-top.svelte-168x2ez.svelte-168x2ez{-webkit-transform-origin:top;-ms-transform-origin:top;transform-origin:top}.scale-0.svelte-168x2ez.svelte-168x2ez{--tw-scale-x:0;--tw-scale-y:0;--tw-scale-z:0}.group.svelte-168x2ez:hover .group-hover\\:scale-100.svelte-168x2ez{--tw-scale-x:1;--tw-scale-y:1;--tw-scale-z:1}.group.svelte-168x2ez:hover .group-hover\\:-rotate-180.svelte-168x2ez{--tw-rotate:-180deg}.transition.svelte-168x2ez.svelte-168x2ez{-webkit-transition-property:background-color, border-color, color, fill, stroke, opacity, -webkit-box-shadow, -webkit-transform, filter, backdrop-filter;-o-transition-property:background-color, border-color, color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;transition-property:background-color, border-color, color, fill, stroke, opacity, box-shadow, -webkit-box-shadow, transform, -webkit-transform, filter, backdrop-filter;-webkit-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-o-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-webkit-transition-duration:150ms;-o-transition-duration:150ms;transition-duration:150ms}.ease-in-out.svelte-168x2ez.svelte-168x2ez{-webkit-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-o-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1)}.duration-150.svelte-168x2ez.svelte-168x2ez{-webkit-transition-duration:150ms;-o-transition-duration:150ms;transition-duration:150ms}",
      map: null
    };
    Blog = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$3);
      return `<div class="${"group inline-block svelte-168x2ez"}"><button class="${"outline-none focus:outline-none border px-3 py-1 bg-white rounded-sm flex items-center min-w-32 svelte-168x2ez"}"><span class="${"pr-1 font-semibold flex-1 svelte-168x2ez"}">Blog Posts </span>
		<span><svg class="${"fill-current h-4 w-4 transform group-hover:-rotate-180 transition duration-150 ease-in-out svelte-168x2ez"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 20 20"}"><path d="${"M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"}"></path></svg></span></button>
	<ul class="${"bg-white border rounded-sm transform scale-0 group-hover:scale-100 absolute transition duration-150 ease-in-out origin-top min-w-32 svelte-168x2ez"}"><li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-168x2ez"}"><g-link class="${"text-cyan-900 hover:text-orange-500 svelte-168x2ez"}" to="${"/blog/how-to-a-find-a-record-of-births-online-in-england-and-wales/"}">Birth Records UK</g-link></li>
		<li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-168x2ez"}"><g-link class="${"text-cyan-900 hover:text-orange-500 svelte-168x2ez"}" to="${"/blog/how-to-use-companies-house-records-for-family-history-research"}">Companies House Records</g-link></li>

		<li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-168x2ez"}"><g-link class="${"text-cyan-900 hover:text-orange-500 svelte-168x2ez"}" to="${"/blog/how-to-find-a-person-on-the-electorial-register-in-the-uk/"}">Electorial Register</g-link></li>
		<li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-168x2ez"}"><g-link class="${"text-cyan-900 hover:text-orange-500 svelte-168x2ez"}" to="${"/blog/how-to-find-where-a-jewish-person-is-buried-in-london-uk/"}">Jewish Burial Records</g-link></li>
		<li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-168x2ez"}"><g-link class="${"text-cyan-900 hover:text-orange-500 svelte-168x2ez"}" to="${"/blog/how-to-a-find-a-jewish-record-of-marriage-online-in-england-and-wales/"}">Jewish Marriage Records</g-link></li>
		<li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-168x2ez"}"><g-link class="${"text-cyan-900 hover:text-orange-500 svelte-168x2ez"}" to="${"/blog/how-to-a-find-a-record-of-marriage-online-in-england-and-wales/"}">Marrage Records UK</g-link></li>
		<li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-168x2ez"}"><g-link class="${"text-cyan-900 hover:text-orange-500 svelte-168x2ez"}" to="${"/blog/how-to-a-find-a-naturalization-certificate-online-in-britain/"}">Naturalization UK</g-link></li>

		<li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-168x2ez"}"><g-link class="${"text-cyan-900 hover:text-orange-500 svelte-168x2ez"}" to="${"/blog/how-to-a-find-a-record-of-births-of-siblings-online-in-england-and-wales/"}">Siblings Records UK</g-link></li></ul>
</div>`;
    });
    css$2 = {
      code: "li>button.svelte-ntina8 svg.svelte-ntina8{transform:rotate(-90deg)}li:hover>button.svelte-ntina8 svg.svelte-ntina8{transform:rotate(-270deg)}.group.svelte-ntina8:hover .group-hover\\:scale-100.svelte-ntina8{transform:scale(1)}.group.svelte-ntina8:hover .group-hover\\:-rotate-180.svelte-ntina8{transform:rotate(180deg)}.scale-0.svelte-ntina8.svelte-ntina8{transform:scale(0)}.min-w-32.svelte-ntina8.svelte-ntina8{min-width:8rem}.bg-white.svelte-ntina8.svelte-ntina8{--tw-bg-opacity:1;background-color:rgba(255, 255, 255, var(--tw-bg-opacity))}.hover\\:bg-gray-100.svelte-ntina8.svelte-ntina8:hover{--tw-bg-opacity:1;background-color:rgba(243, 244, 246, var(--tw-bg-opacity))}.rounded-sm.svelte-ntina8.svelte-ntina8{border-radius:0.125rem}.border.svelte-ntina8.svelte-ntina8{border-width:1px}.inline-block.svelte-ntina8.svelte-ntina8{display:inline-block}.flex.svelte-ntina8.svelte-ntina8{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}.items-center.svelte-ntina8.svelte-ntina8{-webkit-box-align:center;-ms-flex-align:center;-webkit-align-items:center;align-items:center}.flex-1.svelte-ntina8.svelte-ntina8{-webkit-box-flex:1;-ms-flex:1 1 0%;-webkit-flex:1 1 0%;flex:1 1 0%}.font-semibold.svelte-ntina8.svelte-ntina8{font-weight:600}.h-4.svelte-ntina8.svelte-ntina8{height:1rem}.min-w-32.svelte-ntina8.svelte-ntina8{min-width:8rem}.outline-none.svelte-ntina8.svelte-ntina8{outline:2px solid transparent;outline-offset:2px}.focus\\:outline-none.svelte-ntina8.svelte-ntina8:focus{outline:2px solid transparent;outline-offset:2px}.px-3.svelte-ntina8.svelte-ntina8{padding-left:0.75rem;padding-right:0.75rem}.py-1.svelte-ntina8.svelte-ntina8{padding-top:0.25rem;padding-bottom:0.25rem}.pr-1.svelte-ntina8.svelte-ntina8{padding-right:0.25rem}.absolute.svelte-ntina8.svelte-ntina8{position:absolute}.fill-current.svelte-ntina8.svelte-ntina8{fill:currentColor}.text-rose-500.svelte-ntina8.svelte-ntina8{--tw-text-opacity:1;color:rgba(244, 63, 94, var(--tw-text-opacity))}.hover\\:text-orange-500.svelte-ntina8.svelte-ntina8:hover{--tw-text-opacity:1;color:rgba(249, 115, 22, var(--tw-text-opacity))}.w-4.svelte-ntina8.svelte-ntina8{width:1rem}.transform.svelte-ntina8.svelte-ntina8{--tw-rotate:0;--tw-rotate-x:0;--tw-rotate-y:0;--tw-rotate-z:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scale-z:1;--tw-skew-x:0;--tw-skew-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-translate-z:0;-webkit-transform:rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z));-ms-transform:rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z));transform:rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z))}.origin-top.svelte-ntina8.svelte-ntina8{-webkit-transform-origin:top;-ms-transform-origin:top;transform-origin:top}.scale-0.svelte-ntina8.svelte-ntina8{--tw-scale-x:0;--tw-scale-y:0;--tw-scale-z:0}.group.svelte-ntina8:hover .group-hover\\:scale-100.svelte-ntina8{--tw-scale-x:1;--tw-scale-y:1;--tw-scale-z:1}.group.svelte-ntina8:hover .group-hover\\:-rotate-180.svelte-ntina8{--tw-rotate:-180deg}.transition.svelte-ntina8.svelte-ntina8{-webkit-transition-property:background-color, border-color, color, fill, stroke, opacity, -webkit-box-shadow, -webkit-transform, filter, backdrop-filter;-o-transition-property:background-color, border-color, color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;transition-property:background-color, border-color, color, fill, stroke, opacity, box-shadow, -webkit-box-shadow, transform, -webkit-transform, filter, backdrop-filter;-webkit-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-o-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-webkit-transition-duration:150ms;-o-transition-duration:150ms;transition-duration:150ms}.ease-in-out.svelte-ntina8.svelte-ntina8{-webkit-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-o-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1)}.duration-150.svelte-ntina8.svelte-ntina8{-webkit-transition-duration:150ms;-o-transition-duration:150ms;transition-duration:150ms}",
      map: null
    };
    General = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$2);
      return `<div class="${"group inline-block svelte-ntina8"}"><button class="${"outline-none focus:outline-none border px-3 py-1 bg-white rounded-sm flex items-center min-w-32 svelte-ntina8"}"><span class="${"pr-1 font-semibold flex-1 svelte-ntina8"}">General </span>
		<span><svg class="${"fill-current h-4 w-4 transform group-hover:-rotate-180 transition duration-150 ease-in-out svelte-ntina8"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 20 20"}"><path d="${"M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"}"></path></svg></span></button>
	<ul class="${"bg-white border rounded-sm transform scale-0 group-hover:scale-100 absolute transition duration-150 ease-in-out origin-top min-w-32 svelte-ntina8"}"><li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-ntina8"}"><g-link class="${"text-rose-500 hover:text-orange-500 svelte-ntina8"}" to="${"/general"}">General</g-link></li>

		<li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-ntina8"}"><g-link class="${"text-rose-500 hover:text-orange-500 svelte-ntina8"}" to="${"/dna"}">DNA</g-link></li>

		<li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-ntina8"}"><g-link class="${"text-rose-500 hover:text-orange-500 svelte-ntina8"}" to="${"/video"}">Video</g-link></li>

		<li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-ntina8"}"><g-link class="${"text-rose-500 hover:text-orange-500 svelte-ntina8"}" to="${"/contact"}">Contact</g-link></li></ul>
</div>`;
    });
    css$1 = {
      code: ".border-gray-200.svelte-hyc5qa{--tw-border-opacity:1;border-color:rgba(229, 231, 235, var(--tw-border-opacity))}.border-b-4.svelte-hyc5qa{border-bottom-width:4px}.mb-72.svelte-hyc5qa{margin-bottom:18rem}.text-red-600.svelte-hyc5qa{--tw-text-opacity:1;color:rgba(220, 38, 38, var(--tw-text-opacity))}.hover\\:text-yellow-600.svelte-hyc5qa:hover{--tw-text-opacity:1;color:rgba(217, 119, 6, var(--tw-text-opacity))}",
      map: null
    };
    Dropdown = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$1);
      return `<div class="${"one mb-72 svelte-hyc5qa"}"><br>
	<div class="${"border-b-4 border-gray-200 svelte-hyc5qa"}"></div>
	<br>

	<br>
	<p>${validate_component(Australasia, "Australasia").$$render($$result, {}, {}, {})}
		${validate_component(Caribbean, "Caribbean").$$render($$result, {}, {}, {})}
		${validate_component(Europe, "Europe").$$render($$result, {}, {}, {})}
		${validate_component(Jewish, "Jewish").$$render($$result, {}, {}, {})}
		${validate_component(Northamerica, "Northamerica").$$render($$result, {}, {}, {})}
		${validate_component(Blog, "Blog").$$render($$result, {}, {}, {})}
		${validate_component(General, "General").$$render($$result, {}, {}, {})}</p>

	<p><br>
		Add

		<a class="${"text-red-600 hover:text-yellow-600 svelte-hyc5qa"}" href="${"http://bit.ly/2SxWdgt"}" target="${"_blank"}">google translate
		</a>
		to your browser extensions, to view foreign language web sites.
	</p>
    
</div>`;
    });
    css = {
      code: `*,::before,::after{-webkit-box-sizing:border-box;box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}*{--tw-ring-inset:var(--tw-empty,/*!*/ /*!*/);--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59, 130, 246, 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000}:root{-moz-tab-size:4;-o-tab-size:4;tab-size:4}:-moz-focusring{outline:1px dotted ButtonText}:-moz-ui-invalid{box-shadow:none}::moz-focus-inner{border-style:none;padding:0}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}[type='search']{-webkit-appearance:textfield;outline-offset:-2px}abbr[title]{-webkit-text-decoration:underline dotted;text-decoration:underline dotted}body{margin:0;font-family:inherit;line-height:inherit}html{-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";line-height:1.5}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:1.15;margin:0;padding:0;line-height:inherit;color:inherit}button,select{text-transform:none}button,[type='button'],[type='reset'],[type='submit']{-webkit-appearance:button}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}button{background-color:transparent;background-image:none}button:focus{outline:1px dotted;outline:5px auto -webkit-focus-ring-color}button,[role="button"]{cursor:pointer}code,kbd,samp,pre{font-size:1em}fieldset{margin:0;padding:0}hr{height:0;color:inherit;border-top-width:1px}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}img{border-style:solid}input::placeholder{opacity:1;color:#9ca3af}input::webkit-input-placeholder{opacity:1;color:#9ca3af}input::-moz-placeholder{opacity:1;color:#9ca3af}input:-ms-input-placeholder{opacity:1;color:#9ca3af}input::-ms-input-placeholder{opacity:1;color:#9ca3af}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}legend{padding:0}ol,ul{list-style:none;margin:0;padding:0}progress{vertical-align:baseline}pre,code,kbd,samp{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-0.25em}sup{top:-0.5em}summary{display:list-item}table{text-indent:0;border-color:inherit;border-collapse:collapse}textarea{resize:vertical}textarea::placeholder{opacity:1;color:#9ca3af}textarea::webkit-input-placeholder{opacity:1;color:#9ca3af}textarea::-moz-placeholder{opacity:1;color:#9ca3af}textarea:-ms-input-placeholder{opacity:1;color:#9ca3af}textarea::-ms-input-placeholder{opacity:1;color:#9ca3af}`,
      map: null
    };
    _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css);
      return `${validate_component(Nav, "Nav").$$render($$result, {}, {}, {})}

${slots.default ? slots.default({}) : ``}
${validate_component(Dropdown, "Dropdown").$$render($$result, {}, {}, {})}
${validate_component(TheFooter, "TheFooter").$$render($$result, {}, {}, {})}`;
    });
  }
});

// .svelte-kit/output/server/chunks/error-0d79fb5a.js
var error_0d79fb5a_exports = {};
__export(error_0d79fb5a_exports, {
  default: () => Error2,
  load: () => load
});
function load({ error: error2, status }) {
  return { props: { error: error2, status } };
}
var Error2;
var init_error_0d79fb5a = __esm({
  ".svelte-kit/output/server/chunks/error-0d79fb5a.js"() {
    init_shims();
    init_app_6a68fa8d();
    Error2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { status } = $$props;
      let { error: error2 } = $$props;
      if ($$props.status === void 0 && $$bindings.status && status !== void 0)
        $$bindings.status(status);
      if ($$props.error === void 0 && $$bindings.error && error2 !== void 0)
        $$bindings.error(error2);
      return `<h1>${escape(status)}</h1>

<pre>${escape(error2.message)}</pre>



${error2.frame ? `<pre>${escape(error2.frame)}</pre>` : ``}
${error2.stack ? `<pre>${escape(error2.stack)}</pre>` : ``}`;
    });
  }
});

// .svelte-kit/output/server/chunks/index-7a25200d.js
var index_7a25200d_exports = {};
__export(index_7a25200d_exports, {
  default: () => Routes,
  prerender: () => prerender
});
var css2, prerender, Routes;
var init_index_7a25200d = __esm({
  ".svelte-kit/output/server/chunks/index-7a25200d.js"() {
    init_shims();
    init_app_6a68fa8d();
    css2 = {
      code: ".one.svelte-1quiifg{text-align:center;margin-top:50px;margin-left:100px;margin-right:100px}.grid.svelte-1quiifg{display:-ms-grid;display:grid}.h-96.svelte-1quiifg{height:24rem}.text-6xl.svelte-1quiifg{font-size:3.75rem;line-height:1}.text-3xl.svelte-1quiifg{font-size:1.875rem;line-height:2.25rem}.text-xl.svelte-1quiifg{font-size:1.25rem;line-height:1.75rem}.object-fill.svelte-1quiifg{-o-object-fit:fill;object-fit:fill}.p-4.svelte-1quiifg{padding:1rem}.text-left.svelte-1quiifg{text-align:left}.text-center.svelte-1quiifg{text-align:center}.text-purple-500.svelte-1quiifg{--tw-text-opacity:1;color:rgba(139, 92, 246, var(--tw-text-opacity))}.text-purple-400.svelte-1quiifg{--tw-text-opacity:1;color:rgba(167, 139, 250, var(--tw-text-opacity))}.text-gray-600.svelte-1quiifg{--tw-text-opacity:1;color:rgba(75, 85, 99, var(--tw-text-opacity))}.w-full.svelte-1quiifg{width:100%}.gap-4.svelte-1quiifg{grid-gap:1rem;gap:1rem}.grid-cols-2.svelte-1quiifg{grid-template-columns:repeat(2, minmax(0, 1fr))}",
      map: null
    };
    prerender = true;
    Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css2);
      return `${$$result.head += `${$$result.title = `<title>Home</title>`, ""}`, ""}

<section class="${"one svelte-1quiifg"}"><h1 class="${"text-center text-purple-500 text-font-sans text-6xl svelte-1quiifg"}">Welcome to Family History Tips
	</h1>
	<p class="${"text-center text-purple-400 text-font-sans text-3xl svelte-1quiifg"}">Informing you on what information is available and where to find them.
	</p>
	<br>

	<div class="${"grid grid-cols-2 gap-4 svelte-1quiifg"}"><div><img class="${"h-96 w-full object-fill p-4 svelte-1quiifg"}" src="${"/images/logotreerobin.svg"}" alt="${"logo"}"></div>
		<div><ul class="${"text-left text-gray-600 text-font-sans text-xl p-4 svelte-1quiifg"}"><li>Births records</li>
				<li>School records</li>
				<li>Marriage records</li>
				<li>Death records</li>
				<li>Burial records</li>
				<li>Will and Probate records</li>
				<li>Census records</li>
				<li>Electoral roll</li>
				<li>Military records</li>
				<li>Immigration &amp; Travel records</li>
				<li>Naturalisation records</li>
				<li>Trade Directories</li></ul></div></div>
</section>`;
    });
  }
});

// .svelte-kit/output/server/chunks/newzealand-fc4ee07e.js
var newzealand_fc4ee07e_exports = {};
__export(newzealand_fc4ee07e_exports, {
  default: () => Newzealand,
  prerender: () => prerender2
});
var css$52, State, css$42, Historical, css$32, Gazette, css$22, Companies, css$12, Auckland, css3, prerender2, Newzealand;
var init_newzealand_fc4ee07e = __esm({
  ".svelte-kit/output/server/chunks/newzealand-fc4ee07e.js"() {
    init_shims();
    init_app_6a68fa8d();
    css$52 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    State = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$52);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">State Archives</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1618762256/archives_nndpbn.jpg"}" alt="${"image of archives"}">
		<br>
		<p>New Zealand <br>State archives.</p>
		<br><br>
		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2xItUAd"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$42 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Historical = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$42);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Historical Records</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638704227/nz-birth-cert_sq0auz.jpg"}" alt="${"image of newzealand birth cerificates"}">
		<br>
		<ul><li>Births over 100 year&#39;s</li>
			<li>Marriages over 80 year&#39;s</li>
			<li>Deaths over 50 year&#39;s</li></ul>

		<br>
		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2I57AYi"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$32 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Gazette = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$32);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Gazette</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638703832/nz-gazette_hsw9oq.jpg"}" alt="${"image of new zealand gazette logo"}">
		<br>
		<p>Search the The official<br> Government newspaper<br> published since 1841</p>
		<br>
		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2Kvu3vP"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$22 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Companies = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$22);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Companies Register
      </h1>

      <img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638703494/business_ee6az1.jpg"}" alt="${"image of a business man"}">
      <br>
     <p>Search companies and<br> director&#39;s information</p>

      <br><br>
      <a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2FAOF2j"}" target="${"_blank"}">Go to The Website
      </a></div>
  </div>`;
    });
    css$12 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Auckland = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$12);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Auckland</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638702889/graves_tu2we0.jpg"}" alt="${"image of graves"}">
		<br>
		<p>Auckland burial and <br>cremation records.</p>
		<br><br>
		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3fvRLYO"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css3 = {
      code: ".one.svelte-1nupwvf{text-align:center;margin-top:50px;margin-left:100px;margin-right:100px}.inline-block.svelte-1nupwvf{display:inline-block}.grid.svelte-1nupwvf{display:-ms-grid;display:grid}.h-10.svelte-1nupwvf{height:2.5rem}.text-4xl.svelte-1nupwvf{font-size:2.25rem;line-height:2.5rem}.ml-8.svelte-1nupwvf{margin-left:2rem}.mt-3.svelte-1nupwvf{margin-top:0.75rem}.mt-20.svelte-1nupwvf{margin-top:5rem}.mt-8.svelte-1nupwvf{margin-top:2rem}.text-center.svelte-1nupwvf{text-align:center}.text-purple-500.svelte-1nupwvf{--tw-text-opacity:1;color:rgba(139, 92, 246, var(--tw-text-opacity))}.w-14.svelte-1nupwvf{width:3.5rem}.gap-4.svelte-1nupwvf{grid-gap:1rem;gap:1rem}@media(min-width: 640px){.sm\\:flex.svelte-1nupwvf{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}}",
      map: null
    };
    prerender2 = true;
    Newzealand = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css3);
      return `${$$result.head += `${$$result.title = `<title>New Zealand</title>`, ""}`, ""}

<section class="${"one svelte-1nupwvf"}"><h1 class="${"ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl svelte-1nupwvf"}"><div class="${"h-10 w-14 inline-block svelte-1nupwvf"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638702403/newzealand-flag_w7h9cg.jpg"}" alt="${"image of new zealand flag"}"></div>
		
		New Zealand Family History Resourses
	</h1>
	<br>

	<div class="${"grid sm:flex gap-4 mt-20 one svelte-1nupwvf"}">${validate_component(Auckland, "Auckland").$$render($$result, {}, {}, {})}
		${validate_component(Companies, "Companies").$$render($$result, {}, {}, {})}
		${validate_component(Gazette, "Gazette").$$render($$result, {}, {}, {})}</div>

	<div class="${"grid sm:flex gap-4 mt-8 one svelte-1nupwvf"}">${validate_component(Historical, "Historical").$$render($$result, {}, {}, {})}
		${validate_component(State, "State").$$render($$result, {}, {}, {})}</div>
</section>`;
    });
  }
});

// .svelte-kit/output/server/chunks/australia-5a838185.js
var australia_5a838185_exports = {};
__export(australia_5a838185_exports, {
  default: () => Australia,
  prerender: () => prerender3
});
var css$23, Ausstate, css$13, Gen, css4, prerender3, Australia;
var init_australia_5a838185 = __esm({
  ".svelte-kit/output/server/chunks/australia-5a838185.js"() {
    init_shims();
    init_app_6a68fa8d();
    css$23 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Ausstate = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$23);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">State Archives</h1>
		<div><img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1618762256/archives_nndpbn.jpg"}" alt="${"australia archives"}"></div>
		<br>
		<p>Australian State Archives</p>
		<br><br><br>
		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3fpAQHh"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$13 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Gen = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$13);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Genealogy SA</h1>
		<div><img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/v1607248969/database_l8siob.jpg"}" alt="${"image of database"}"></div>
		<br>
		<p>Search databases of
			<br>south Australian
			<br>family history
		</p>
		<br>
		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3nP4PM4"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css4 = {
      code: ".one.svelte-10wioxk{text-align:center;margin-top:50px;margin-left:100px;margin-right:100px}.inline-block.svelte-10wioxk{display:inline-block}.grid.svelte-10wioxk{display:-ms-grid;display:grid}.h-10.svelte-10wioxk{height:2.5rem}.text-4xl.svelte-10wioxk{font-size:2.25rem;line-height:2.5rem}.ml-8.svelte-10wioxk{margin-left:2rem}.mt-3.svelte-10wioxk{margin-top:0.75rem}.mt-20.svelte-10wioxk{margin-top:5rem}.text-center.svelte-10wioxk{text-align:center}.text-purple-500.svelte-10wioxk{--tw-text-opacity:1;color:rgba(139, 92, 246, var(--tw-text-opacity))}.w-14.svelte-10wioxk{width:3.5rem}.gap-4.svelte-10wioxk{grid-gap:1rem;gap:1rem}@media(min-width: 640px){.sm\\:flex.svelte-10wioxk{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}}",
      map: null
    };
    prerender3 = true;
    Australia = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css4);
      return `${$$result.head += `${$$result.title = `<title>Australia</title>`, ""}`, ""}

<section class="${"one svelte-10wioxk"}"><h1 class="${"ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl svelte-10wioxk"}"><div class="${"h-10 w-14 inline-block svelte-10wioxk"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638638952/australia-flag_zwelpx.jpg"}" alt="${"image of australian flag"}"></div>
		Australian Family History Resourses
	</h1>
	<br>

	<div class="${"grid sm:flex gap-4 mt-20 one svelte-10wioxk"}">${validate_component(Gen, "Gen").$$render($$result, {}, {}, {})}
		${validate_component(Ausstate, "Ausstate").$$render($$result, {}, {}, {})}</div>
</section>`;
    });
  }
});

// .svelte-kit/output/server/chunks/austrian-511c43fb.js
var austrian_511c43fb_exports = {};
__export(austrian_511c43fb_exports, {
  default: () => Austrian,
  prerender: () => prerender4
});
var css$24, Vienna, css$14, Auststate, css5, prerender4, Austrian;
var init_austrian_511c43fb = __esm({
  ".svelte-kit/output/server/chunks/austrian-511c43fb.js"() {
    init_shims();
    init_app_6a68fa8d();
    css$24 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Vienna = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$24);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Vienna</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638781367/viennaparlament_qn9rci.jpg"}" alt="${"vienna parlement photo"}">
		<br>
		<p>Vienna Archives</p>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2SrGLCq"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$14 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Auststate = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$14);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">State Archives</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1618762256/archives_nndpbn.jpg"}" alt="${"austria flag"}">
		<br>
		<p>Austrian State Archives</p>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/34MKe49"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css5 = {
      code: ".inline-block.svelte-aztiwm{display:inline-block}.grid.svelte-aztiwm{display:-ms-grid;display:grid}.h-10.svelte-aztiwm{height:2.5rem}.text-4xl.svelte-aztiwm{font-size:2.25rem;line-height:2.5rem}.ml-8.svelte-aztiwm{margin-left:2rem}.mt-3.svelte-aztiwm{margin-top:0.75rem}.mt-20.svelte-aztiwm{margin-top:5rem}.text-center.svelte-aztiwm{text-align:center}.text-purple-500.svelte-aztiwm{--tw-text-opacity:1;color:rgba(139, 92, 246, var(--tw-text-opacity))}.w-14.svelte-aztiwm{width:3.5rem}.gap-4.svelte-aztiwm{grid-gap:1rem;gap:1rem}@media(min-width: 640px){.sm\\:flex.svelte-aztiwm{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}}",
      map: null
    };
    prerender4 = true;
    Austrian = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css5);
      return `${$$result.head += `${$$result.title = `<title>Austrian</title>`, ""}`, ""}

<section class="${"one"}"><h1 class="${"ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl svelte-aztiwm"}"><div class="${"h-10 w-14 inline-block svelte-aztiwm"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638780727/austria-flag_yoeqvh.jpg"}" alt="${"image of Austrian flag"}"></div>

		Austrian Family History Resourses
	</h1>
	<br>

	<div class="${"grid sm:flex gap-4 mt-20 one svelte-aztiwm"}">${validate_component(Auststate, "Auststate").$$render($$result, {}, {}, {})}
		${validate_component(Vienna, "Vienna").$$render($$result, {}, {}, {})}</div>
</section>`;
    });
  }
});

// .svelte-kit/output/server/chunks/barbados-6c3c1f52.js
var barbados_6c3c1f52_exports = {};
__export(barbados_6c3c1f52_exports, {
  default: () => Barbados,
  prerender: () => prerender5
});
var css$33, Barbstate, css$25, Family, css$15, Genbarb, css6, prerender5, Barbados;
var init_barbados_6c3c1f52 = __esm({
  ".svelte-kit/output/server/chunks/barbados-6c3c1f52.js"() {
    init_shims();
    init_app_6a68fa8d();
    css$33 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Barbstate = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$33);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">State Archives</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1618762256/archives_nndpbn.jpg"}" alt="${"image of archives"}">
		<br>
		<p>Bermuda State Archives</p>
		<br><br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/3mGxeTt"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$25 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Family = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$25);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Family History</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1618760842/family-tree_qzej89.jpg"}" alt="${"image of a family tree"}">
		<br>
		<p>Information about <br>Barbados family history</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2PggG63"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$15 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Genbarb = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$15);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Barbados</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/v1607248969/database_l8siob.jpg"}" alt="${"image of a database"}">
		<br>
		<p>Search Barbados <br>Genealogical Records</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2Ls7SZP"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css6 = {
      code: ".inline-block.svelte-aztiwm{display:inline-block}.grid.svelte-aztiwm{display:-ms-grid;display:grid}.h-10.svelte-aztiwm{height:2.5rem}.text-4xl.svelte-aztiwm{font-size:2.25rem;line-height:2.5rem}.ml-8.svelte-aztiwm{margin-left:2rem}.mt-3.svelte-aztiwm{margin-top:0.75rem}.mt-20.svelte-aztiwm{margin-top:5rem}.text-center.svelte-aztiwm{text-align:center}.text-purple-500.svelte-aztiwm{--tw-text-opacity:1;color:rgba(139, 92, 246, var(--tw-text-opacity))}.w-14.svelte-aztiwm{width:3.5rem}.gap-4.svelte-aztiwm{grid-gap:1rem;gap:1rem}@media(min-width: 640px){.sm\\:flex.svelte-aztiwm{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}}",
      map: null
    };
    prerender5 = true;
    Barbados = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css6);
      return `${$$result.head += `${$$result.title = `<title>Barbados</title>`, ""}`, ""}

<section class="${"one"}"><h1 class="${"ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl svelte-aztiwm"}"><div class="${"h-10 w-14 inline-block svelte-aztiwm"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/v1608289948/barbados-flag_mngc34.png"}" alt="${"image of Barbados flag"}"></div>

		Barbados Family History Resourses
	</h1>
	<br>

	<div class="${"grid sm:flex gap-4 mt-20 one svelte-aztiwm"}">${validate_component(Genbarb, "Genbarb").$$render($$result, {}, {}, {})}
		${validate_component(Family, "Family").$$render($$result, {}, {}, {})}
        ${validate_component(Barbstate, "Barbstate").$$render($$result, {}, {}, {})}</div>
</section>`;
    });
  }
});

// .svelte-kit/output/server/chunks/belarus-c325c7f8.js
var belarus_c325c7f8_exports = {};
__export(belarus_c325c7f8_exports, {
  default: () => Belarus,
  prerender: () => prerender6
});
var css$26, Mogilev, css$16, Belstate, css7, prerender6, Belarus;
var init_belarus_c325c7f8 = __esm({
  ".svelte-kit/output/server/chunks/belarus-c325c7f8.js"() {
    init_shims();
    init_app_6a68fa8d();
    css$26 = {
      code: ".bg-indigo-700.svelte-13tzqgo{--tw-bg-opacity:1;background-color:rgba(67, 56, 202, var(--tw-bg-opacity))}.hover\\:bg-indigo-800.svelte-13tzqgo:hover{--tw-bg-opacity:1;background-color:rgba(55, 48, 163, var(--tw-bg-opacity))}.rounded-lg.svelte-13tzqgo{border-radius:0.5rem}.h-32.svelte-13tzqgo{height:8rem}.h-8.svelte-13tzqgo{height:2rem}.text-2xl.svelte-13tzqgo{font-size:1.5rem;line-height:2rem}.text-sm.svelte-13tzqgo{font-size:0.875rem;line-height:1.25rem}.m-4.svelte-13tzqgo{margin:1rem}.m-2.svelte-13tzqgo{margin:0.5rem}.object-fill.svelte-13tzqgo{-o-object-fit:fill;object-fit:fill}.p-4.svelte-13tzqgo{padding:1rem}.p-6.svelte-13tzqgo{padding:1.5rem}.px-4.svelte-13tzqgo{padding-left:1rem;padding-right:1rem}.shadow-2xl.svelte-13tzqgo{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-right.svelte-13tzqgo{text-align:right}.text-white.svelte-13tzqgo{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-13tzqgo:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.text-indigo-100.svelte-13tzqgo{--tw-text-opacity:1;color:rgba(224, 231, 255, var(--tw-text-opacity))}.w-auto.svelte-13tzqgo{width:auto}.w-full.svelte-13tzqgo{width:100%}.transition-colors.svelte-13tzqgo{-webkit-transition-property:background-color, border-color, color, fill, stroke;-o-transition-property:background-color, border-color, color, fill, stroke;transition-property:background-color, border-color, color, fill, stroke;-webkit-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-o-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-webkit-transition-duration:150ms;-o-transition-duration:150ms;transition-duration:150ms}.duration-150.svelte-13tzqgo{-webkit-transition-duration:150ms;-o-transition-duration:150ms;transition-duration:150ms}",
      map: null
    };
    Mogilev = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$26);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-13tzqgo"}"><div class="${"p-6 svelte-13tzqgo"}"><h1 class="${"text-2xl text-white svelte-13tzqgo"}">Mogilev Region</h1>

		<img class="${"h-32 w-full object-fill svelte-13tzqgo"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1618762256/archives_nndpbn.jpg"}" alt="${"archive photo"}">
		<br>
		<p>State Archives</p>

		<a class="${"text-white hover:text-yellow-500 svelte-13tzqgo"}" href="${"https://bit.ly/3qa4ntC"}" target="${"_blank"}">Go to The Website
		</a></div>
	<div class="${"text-right svelte-13tzqgo"}"><button class="${"h-8 px-4 m-2 text-sm text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800 svelte-13tzqgo"}">New</button></div>
</div>`;
    });
    css$16 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Belstate = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$16);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">State Archives</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1618762256/archives_nndpbn.jpg"}" alt="${"archive photo"}">
		<br>
		<p>Belarus State Archives</p>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3fMLiZD"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css7 = {
      code: ".inline-block.svelte-aztiwm{display:inline-block}.grid.svelte-aztiwm{display:-ms-grid;display:grid}.h-10.svelte-aztiwm{height:2.5rem}.text-4xl.svelte-aztiwm{font-size:2.25rem;line-height:2.5rem}.ml-8.svelte-aztiwm{margin-left:2rem}.mt-3.svelte-aztiwm{margin-top:0.75rem}.mt-20.svelte-aztiwm{margin-top:5rem}.text-center.svelte-aztiwm{text-align:center}.text-purple-500.svelte-aztiwm{--tw-text-opacity:1;color:rgba(139, 92, 246, var(--tw-text-opacity))}.w-14.svelte-aztiwm{width:3.5rem}.gap-4.svelte-aztiwm{grid-gap:1rem;gap:1rem}@media(min-width: 640px){.sm\\:flex.svelte-aztiwm{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}}",
      map: null
    };
    prerender6 = true;
    Belarus = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css7);
      return `${$$result.head += `${$$result.title = `<title>Belarus</title>`, ""}`, ""}
<section class="${"one"}"><h1 class="${"ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl svelte-aztiwm"}"><div class="${"h-10 w-14 inline-block svelte-aztiwm"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638784725/belarus-flag_ejcomp.jpg"}" alt="${"image of Austrian flag"}"></div>

		Belarus Family History Resourses
	</h1>
	<br>

	<div class="${"grid sm:flex gap-4 mt-20 one svelte-aztiwm"}">${validate_component(Belstate, "Belstate").$$render($$result, {}, {}, {})}
		${validate_component(Mogilev, "Mogilev").$$render($$result, {}, {}, {})}</div>
</section>`;
    });
  }
});

// .svelte-kit/output/server/chunks/belgium-c450e4c4.js
var belgium_c450e4c4_exports = {};
__export(belgium_c450e4c4_exports, {
  default: () => Belgium,
  prerender: () => prerender7
});
var css$34, Genealogy, css$27, Ancestry, css$17, Belgstate, css8, prerender7, Belgium;
var init_belgium_c450e4c4 = __esm({
  ".svelte-kit/output/server/chunks/belgium-c450e4c4.js"() {
    init_shims();
    init_app_6a68fa8d();
    css$34 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Genealogy = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$34);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Genealogy</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1618760842/family-tree_qzej89.jpg"}" alt="${"archive photo"}">
		<br>
		<p>Belgium genealogy links</p>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2Mx0ZH1"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$27 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Ancestry = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$27);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Ancestry</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1618760842/family-tree_qzej89.jpg"}" alt="${"archive photo"}">
		<br>
		<p>Belgium genealogy links</p>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2ZAAYfv"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$17 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Belgstate = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$17);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">State Archives</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1618762256/archives_nndpbn.jpg"}" alt="${"archive photo"}">
		<br>
		<p>Belgium State Archives</p>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/37aGuHZ"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css8 = {
      code: ".inline-block.svelte-aztiwm{display:inline-block}.grid.svelte-aztiwm{display:-ms-grid;display:grid}.h-10.svelte-aztiwm{height:2.5rem}.text-4xl.svelte-aztiwm{font-size:2.25rem;line-height:2.5rem}.ml-8.svelte-aztiwm{margin-left:2rem}.mt-3.svelte-aztiwm{margin-top:0.75rem}.mt-20.svelte-aztiwm{margin-top:5rem}.text-center.svelte-aztiwm{text-align:center}.text-purple-500.svelte-aztiwm{--tw-text-opacity:1;color:rgba(139, 92, 246, var(--tw-text-opacity))}.w-14.svelte-aztiwm{width:3.5rem}.gap-4.svelte-aztiwm{grid-gap:1rem;gap:1rem}@media(min-width: 640px){.sm\\:flex.svelte-aztiwm{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}}",
      map: null
    };
    prerender7 = true;
    Belgium = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css8);
      return `${$$result.head += `${$$result.title = `<title>Belgium</title>`, ""}`, ""}
<section class="${"one"}"><h1 class="${"ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl svelte-aztiwm"}"><div class="${"h-10 w-14 inline-block svelte-aztiwm"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638802245/belgium-flag_ht5dyb.jpg"}" alt="${"image of Belgium flag"}"></div>

		Belgium Family History Resourses
	</h1>
	<br>

	<div class="${"grid sm:flex gap-4 mt-20 one svelte-aztiwm"}">${validate_component(Belgstate, "Belgstate").$$render($$result, {}, {}, {})}
		${validate_component(Ancestry, "Ancestry").$$render($$result, {}, {}, {})}
		${validate_component(Genealogy, "Genealogy").$$render($$result, {}, {}, {})}</div>
</section>`;
    });
  }
});

// .svelte-kit/output/server/chunks/bermuda-805e96af.js
var bermuda_805e96af_exports = {};
__export(bermuda_805e96af_exports, {
  default: () => Bermuda,
  prerender: () => prerender8
});
var css$35, Berstate, css$28, National, css$18, Berfamily, css9, prerender8, Bermuda;
var init_bermuda_805e96af = __esm({
  ".svelte-kit/output/server/chunks/bermuda-805e96af.js"() {
    init_shims();
    init_app_6a68fa8d();
    css$35 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Berstate = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$35);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">State Archives</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1618762256/archives_nndpbn.jpg"}" alt="${"image of archives"}">
		<br>
		<p>Bermuda State Archives</p>
		<br><br><br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/3mGxeTt"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$28 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    National = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$28);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">National Museum</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/v1607248969/database_l8siob.jpg"}" alt="${"image of a family tree"}">
		<br>
		<p>Search the archives of<br>national museum <br>of Bermuda</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2KHv4FP"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$18 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Berfamily = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$18);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Bermuda</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/v1607248969/database_l8siob.jpg"}" alt="${"image of a family tree"}">
		<br>
		<p>Search Burmuda <br>Genealogical Records</p>
		<br><br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2PeNSLm"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css9 = {
      code: ".inline-block.svelte-aztiwm{display:inline-block}.grid.svelte-aztiwm{display:-ms-grid;display:grid}.h-10.svelte-aztiwm{height:2.5rem}.text-4xl.svelte-aztiwm{font-size:2.25rem;line-height:2.5rem}.ml-8.svelte-aztiwm{margin-left:2rem}.mt-3.svelte-aztiwm{margin-top:0.75rem}.mt-20.svelte-aztiwm{margin-top:5rem}.text-center.svelte-aztiwm{text-align:center}.text-purple-500.svelte-aztiwm{--tw-text-opacity:1;color:rgba(139, 92, 246, var(--tw-text-opacity))}.w-14.svelte-aztiwm{width:3.5rem}.gap-4.svelte-aztiwm{grid-gap:1rem;gap:1rem}@media(min-width: 640px){.sm\\:flex.svelte-aztiwm{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}}",
      map: null
    };
    prerender8 = true;
    Bermuda = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css9);
      return `${$$result.head += `${$$result.title = `<title>Bermuda</title>`, ""}`, ""}

<section class="${"one"}"><h1 class="${"ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl svelte-aztiwm"}"><div class="${"h-10 w-14 inline-block svelte-aztiwm"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1608290955/bermuda-flag_rgvbdd.png"}" alt="${"image of Bermuda flag"}"></div>

		Bermuda Family History Resourses
	</h1>
	<br>

	<div class="${"grid sm:flex gap-4 mt-20 one svelte-aztiwm"}">${validate_component(Berfamily, "Berfamily").$$render($$result, {}, {}, {})}
		${validate_component(National, "National").$$render($$result, {}, {}, {})}
		${validate_component(Berstate, "Berstate").$$render($$result, {}, {}, {})}</div>
</section>`;
    });
  }
});

// .svelte-kit/output/server/chunks/british-28efe97c.js
var british_28efe97c_exports = {};
__export(british_28efe97c_exports, {
  default: () => British,
  prerender: () => prerender9
});
var css$c, Graves, css$b, Britstate, css$a2, Navy, css$92, Raf, css$82, Newspaper, css$72, Gazette2, css$62, Industral, css$53, Directories, css$43, Electoral, css$36, Companies2, css$29, Children, css$19, Birth, css10, prerender9, British;
var init_british_28efe97c = __esm({
  ".svelte-kit/output/server/chunks/british-28efe97c.js"() {
    init_shims();
    init_app_6a68fa8d();
    css$c = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Graves = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$c);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">War Graves</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638818218/loos_asmvi6.jpg"}" alt="${"image of loos war cemetary"}">
		<br>
		<p>Search the records of 1.7<br>
			men and women<br>
			who died in the First<br>
			and Second World Wars.
		</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2L2exrF"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$b = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Britstate = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$b);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">State Archives
      </h1>

      <img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1618762256/archives_nndpbn.jpg"}" alt="${"archive photo"}">
      <br>
      <p>British State Archives</p>
      <br><br>
      
      <a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2Xlfsx4"}" target="${"_blank"}">Go to The Website
		</a></div>
  </div>`;
    });
    css$a2 = {
      code: ".rounded-lg.svelte-lvu80t{border-radius:0.5rem}.h-32.svelte-lvu80t{height:8rem}.text-2xl.svelte-lvu80t{font-size:1.5rem;line-height:2rem}.m-4.svelte-lvu80t{margin:1rem}.object-fill.svelte-lvu80t{-o-object-fit:fill;object-fit:fill}.p-4.svelte-lvu80t{padding:1rem}.p-6.svelte-lvu80t{padding:1.5rem}.shadow-2xl.svelte-lvu80t{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-lvu80t{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-lvu80t:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-lvu80t{width:auto}.w-full.svelte-lvu80t{width:100%}.w-52.svelte-lvu80t{width:13rem}",
      map: null
    };
    Navy = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$a2);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-lvu80t"}"><div class="${"p-6 svelte-lvu80t"}"><h1 class="${"text-2xl text-white svelte-lvu80t"}">Royal Navy</h1>

		<img class="${"h-32 w-full object-fill svelte-lvu80t"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638113854/HMS_Dreadnought_gdupqt.jpg"}" alt="${"royal navy hns drednought photo"}">
		<br>
		<p>First world war<br> lives at sea<br>search the sailors<br> war records.</p>
		<br>
		<iframe class="${"h-32 w-52 object-fill svelte-lvu80t"}" title="${"Royal Navy & RAF"}" src="${"https://www.youtube.com/embed/MGLHGV2LP2I"}" frameborder="${"0"}" allow="${"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"}" allowfullscreen></iframe>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-lvu80t"}" href="${"https://bit.ly/32Krtjv"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$92 = {
      code: ".rounded-lg.svelte-lvu80t{border-radius:0.5rem}.h-32.svelte-lvu80t{height:8rem}.text-2xl.svelte-lvu80t{font-size:1.5rem;line-height:2rem}.m-4.svelte-lvu80t{margin:1rem}.object-fill.svelte-lvu80t{-o-object-fit:fill;object-fit:fill}.p-4.svelte-lvu80t{padding:1rem}.p-6.svelte-lvu80t{padding:1.5rem}.shadow-2xl.svelte-lvu80t{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-lvu80t{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-lvu80t:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-lvu80t{width:auto}.w-full.svelte-lvu80t{width:100%}.w-52.svelte-lvu80t{width:13rem}",
      map: null
    };
    Raf = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$92);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-lvu80t"}"><div class="${"p-6 svelte-lvu80t"}"><h1 class="${"text-2xl text-white svelte-lvu80t"}">R.A.F</h1>

		<img class="${"h-32 w-full object-fill svelte-lvu80t"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638816903/raf_omurhb.jpg"}" alt="${"royal airforce plane 1918 photo"}">
		<br>
		<p>first world war<br>Casualty Cards <br>&amp; Muster Roll</p>
		<br>
		<iframe class="${"h-32 w-52 object-fill svelte-lvu80t"}" title="${"Royal Navy & RAF"}" src="${"https://www.youtube.com/embed/MGLHGV2LP2I"}" frameborder="${"0"}" allow="${"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"}" allowfullscreen></iframe>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-lvu80t"}" href="${"http://bit.ly/2rGVfQJ"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$82 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Newspaper = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$82);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Newspapers</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638816670/newspaper_qw3g7r.jpg"}" alt="${"newspaper logo photo"}">
		<br>
		<p>British newspaper <br>archive<br>
			from the 1700s.
		</p>
		<br><br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2IeM6t0"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$72 = {
      code: ".rounded-lg.svelte-lvu80t{border-radius:0.5rem}.h-32.svelte-lvu80t{height:8rem}.text-2xl.svelte-lvu80t{font-size:1.5rem;line-height:2rem}.m-4.svelte-lvu80t{margin:1rem}.object-fill.svelte-lvu80t{-o-object-fit:fill;object-fit:fill}.p-4.svelte-lvu80t{padding:1rem}.p-6.svelte-lvu80t{padding:1.5rem}.shadow-2xl.svelte-lvu80t{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-lvu80t{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-lvu80t:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-lvu80t{width:auto}.w-full.svelte-lvu80t{width:100%}.w-52.svelte-lvu80t{width:13rem}",
      map: null
    };
    Gazette2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$72);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-lvu80t"}"><div class="${"p-6 svelte-lvu80t"}"><h1 class="${"text-2xl text-white svelte-lvu80t"}">London Gazette</h1>

		<img class="${"h-32 w-full object-fill svelte-lvu80t"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638816509/gazette_donijm.jpg"}" alt="${"london gazettte newspaper photo"}">
		<br>
		<p>The London Gazette <br>is the UK\u2019s official<br>
			public record of<br>
			announcement which <br>includes Naturalization<br> and name changes.
		</p>
		<br>
		<iframe class="${"h-32 w-52 object-fill svelte-lvu80t"}" title="${"companies house records"}" src="${"https://www.youtube.com/embed/8KpE5f4kXdk?list=PLGkUcTHzrGYZQxB7QRlMSh0hrmooeM2Gl"}" frameborder="${"0"}" allow="${"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"}" allowfullscreen></iframe>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-lvu80t"}" href="${"http://bit.ly/2Kio1On"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$62 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Industral = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$62);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Industral Schools</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638805714/industral_asmoic.jpg"}" alt="${"image of an industral school"}">
		<br>
		<p>The history of <br>Industral schools<br> and resourses.
		</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3pJKcTe"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$53 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Directories = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$53);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Directories</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638805484/trade_jis9a7.jpg"}" alt="${"image of trade directories"}">
		<br>
		<p>Trade and local <br>directories<br> for England and Wales</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/3dWL43l"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$43 = {
      code: ".rounded-lg.svelte-lvu80t{border-radius:0.5rem}.h-32.svelte-lvu80t{height:8rem}.text-2xl.svelte-lvu80t{font-size:1.5rem;line-height:2rem}.m-4.svelte-lvu80t{margin:1rem}.object-fill.svelte-lvu80t{-o-object-fit:fill;object-fit:fill}.p-4.svelte-lvu80t{padding:1rem}.p-6.svelte-lvu80t{padding:1.5rem}.shadow-2xl.svelte-lvu80t{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-lvu80t{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-lvu80t:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-lvu80t{width:auto}.w-full.svelte-lvu80t{width:100%}.w-52.svelte-lvu80t{width:13rem}",
      map: null
    };
    Electoral = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$43);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-lvu80t"}"><div class="${"p-6 svelte-lvu80t"}"><h1 class="${"text-2xl text-white svelte-lvu80t"}">Electoral Register</h1>

		<img class="${"h-32 w-full object-fill svelte-lvu80t"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638805205/roll_yxauou.jpg"}" alt="${"image of electorial roll"}">

		<br>

		<iframe class="${"h-32 w-52 object-fill svelte-lvu80t"}" title="${"Electorial roll uk"}" src="${"https://www.youtube.com/embed/by1hNIjuKWM"}" frameborder="${"0"}" allow="${"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"}" allowfullscreen></iframe>

		<br>
		<p>Current <br>Electoral Register.</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-lvu80t"}" href="${"http://bit.ly/2FPDJAN"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$36 = {
      code: ".rounded-lg.svelte-lvu80t{border-radius:0.5rem}.h-32.svelte-lvu80t{height:8rem}.text-2xl.svelte-lvu80t{font-size:1.5rem;line-height:2rem}.m-4.svelte-lvu80t{margin:1rem}.object-fill.svelte-lvu80t{-o-object-fit:fill;object-fit:fill}.p-4.svelte-lvu80t{padding:1rem}.p-6.svelte-lvu80t{padding:1.5rem}.shadow-2xl.svelte-lvu80t{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-lvu80t{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-lvu80t:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-lvu80t{width:auto}.w-full.svelte-lvu80t{width:100%}.w-52.svelte-lvu80t{width:13rem}",
      map: null
    };
    Companies2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$36);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-lvu80t"}"><div class="${"p-6 svelte-lvu80t"}"><h1 class="${"text-2xl text-white svelte-lvu80t"}">Companies House</h1>

		<img class="${"h-32 w-full object-fill svelte-lvu80t"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/v1627315634/companies_mryctb.jpg"}" alt="${"companies house logo photo"}">
		<br>
		<p>Free search the<br> register of Companies<br> and directors.</p>
		<br>
		<iframe class="${"h-32 w-52 object-fill svelte-lvu80t"}" title="${"companies house records"}" src="${"https://www.youtube.com/embed/-zFJZrOScuM"}" frameborder="${"0"}" allow="${"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"}" allowfullscreen></iframe>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-lvu80t"}" href="${"https://bit.ly/3poS64b"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$29 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Children = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$29);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Children&#39;s Homes</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638803987/home_monmfu.jpg"}" alt="${"image of dr barnardo's home barkingside"}">
		<br>
		<p>The history of the<br> childrens homes <br>and resourses.
		</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/2UIsK3g"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$19 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Birth = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$19);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">B.M.D</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/v1607248969/database_l8siob.jpg"}" alt="${"database photo"}">
		<br>
		<p>Free birth marriages<br> and
			death index<br> from 1837 to 1992.
		</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2IguCfJ"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css10 = {
      code: ".inline-block.svelte-g219g3{display:inline-block}.grid.svelte-g219g3{display:-ms-grid;display:grid}.h-10.svelte-g219g3{height:2.5rem}.text-4xl.svelte-g219g3{font-size:2.25rem;line-height:2.5rem}.ml-8.svelte-g219g3{margin-left:2rem}.mt-3.svelte-g219g3{margin-top:0.75rem}.mt-20.svelte-g219g3{margin-top:5rem}.mt-8.svelte-g219g3{margin-top:2rem}.text-center.svelte-g219g3{text-align:center}.text-purple-500.svelte-g219g3{--tw-text-opacity:1;color:rgba(139, 92, 246, var(--tw-text-opacity))}.w-14.svelte-g219g3{width:3.5rem}.gap-4.svelte-g219g3{grid-gap:1rem;gap:1rem}@media(min-width: 640px){.sm\\:flex.svelte-g219g3{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}}",
      map: null
    };
    prerender9 = true;
    British = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css10);
      return `${$$result.head += `${$$result.title = `<title>British</title>`, ""}`, ""}
<section class="${"one"}"><h1 class="${"ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl svelte-g219g3"}"><div class="${"h-10 w-14 inline-block svelte-g219g3"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638803290/uk-flag_f5im0i.jpg"}" alt="${"image of British flag"}"></div>

		British Family History Resourses
	</h1>
	<br>
	<section class="${"one"}"><div class="${"grid sm:flex gap-4 mt-20 svelte-g219g3"}">${validate_component(Birth, "Birth").$$render($$result, {}, {}, {})}
			${validate_component(Children, "Children").$$render($$result, {}, {}, {})}
			${validate_component(Companies2, "Companies").$$render($$result, {}, {}, {})}</div>

		<div class="${"grid sm:flex gap-4 mt-8 svelte-g219g3"}">${validate_component(Electoral, "Electoral").$$render($$result, {}, {}, {})}
			${validate_component(Directories, "Directories").$$render($$result, {}, {}, {})}
			${validate_component(Industral, "Industral").$$render($$result, {}, {}, {})}</div>

		<div class="${"grid sm:flex gap-4 mt-8 svelte-g219g3"}">${validate_component(Gazette2, "Gazette").$$render($$result, {}, {}, {})}
			${validate_component(Newspaper, "Newspaper").$$render($$result, {}, {}, {})}
			${validate_component(Raf, "Raf").$$render($$result, {}, {}, {})}</div>

		<div class="${"grid sm:flex gap-4 mt-8 svelte-g219g3"}">${validate_component(Navy, "Navy").$$render($$result, {}, {}, {})}
			${validate_component(Britstate, "Britstate").$$render($$result, {}, {}, {})}
			${validate_component(Graves, "Graves").$$render($$result, {}, {}, {})}</div></section>
</section>`;
    });
  }
});

// .svelte-kit/output/server/chunks/app-6a68fa8d.js
function get_single_valued_header(headers, key) {
  const value = headers[key];
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return void 0;
    }
    if (value.length > 1) {
      throw new Error(`Multiple headers provided for ${key}. Multiple may be provided only for set-cookie`);
    }
    return value[0];
  }
  return value;
}
function resolve(base2, path) {
  if (scheme.test(path))
    return path;
  const base_match = absolute.exec(base2);
  const path_match = absolute.exec(path);
  if (!base_match) {
    throw new Error(`bad base path: "${base2}"`);
  }
  const baseparts = path_match ? [] : base2.slice(base_match[0].length).split("/");
  const pathparts = path_match ? path.slice(path_match[0].length).split("/") : path.split("/");
  baseparts.pop();
  for (let i = 0; i < pathparts.length; i += 1) {
    const part = pathparts[i];
    if (part === ".")
      continue;
    else if (part === "..")
      baseparts.pop();
    else
      baseparts.push(part);
  }
  const prefix = path_match && path_match[0] || base_match && base_match[0] || "";
  return `${prefix}${baseparts.join("/")}`;
}
function is_root_relative(path) {
  return path[0] === "/" && path[1] !== "/";
}
function coalesce_to_error(err) {
  return err instanceof Error || err && err.name && err.message ? err : new Error(JSON.stringify(err));
}
function lowercase_keys(obj) {
  const clone2 = {};
  for (const key in obj) {
    clone2[key.toLowerCase()] = obj[key];
  }
  return clone2;
}
function error(body) {
  return {
    status: 500,
    body,
    headers: {}
  };
}
function is_string(s2) {
  return typeof s2 === "string" || s2 instanceof String;
}
function is_content_type_textual(content_type) {
  if (!content_type)
    return true;
  const [type] = content_type.split(";");
  return type === "text/plain" || type === "application/json" || type === "application/x-www-form-urlencoded" || type === "multipart/form-data";
}
async function render_endpoint(request, route, match) {
  const mod = await route.load();
  const handler2 = mod[request.method.toLowerCase().replace("delete", "del")];
  if (!handler2) {
    return;
  }
  const params = route.params(match);
  const response = await handler2({ ...request, params });
  const preface = `Invalid response from route ${request.path}`;
  if (!response) {
    return;
  }
  if (typeof response !== "object") {
    return error(`${preface}: expected an object, got ${typeof response}`);
  }
  let { status = 200, body, headers = {} } = response;
  headers = lowercase_keys(headers);
  const type = get_single_valued_header(headers, "content-type");
  const is_type_textual = is_content_type_textual(type);
  if (!is_type_textual && !(body instanceof Uint8Array || is_string(body))) {
    return error(`${preface}: body must be an instance of string or Uint8Array if content-type is not a supported textual content-type`);
  }
  let normalized_body;
  if ((typeof body === "object" || typeof body === "undefined") && !(body instanceof Uint8Array) && (!type || type.startsWith("application/json"))) {
    headers = { ...headers, "content-type": "application/json; charset=utf-8" };
    normalized_body = JSON.stringify(typeof body === "undefined" ? {} : body);
  } else {
    normalized_body = body;
  }
  return { status, body: normalized_body, headers };
}
function devalue(value) {
  var counts = new Map();
  function walk(thing) {
    if (typeof thing === "function") {
      throw new Error("Cannot stringify a function");
    }
    if (counts.has(thing)) {
      counts.set(thing, counts.get(thing) + 1);
      return;
    }
    counts.set(thing, 1);
    if (!isPrimitive(thing)) {
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
          return;
        case "Array":
          thing.forEach(walk);
          break;
        case "Set":
        case "Map":
          Array.from(thing).forEach(walk);
          break;
        default:
          var proto = Object.getPrototypeOf(thing);
          if (proto !== Object.prototype && proto !== null && Object.getOwnPropertyNames(proto).sort().join("\0") !== objectProtoOwnPropertyNames) {
            throw new Error("Cannot stringify arbitrary non-POJOs");
          }
          if (Object.getOwnPropertySymbols(thing).length > 0) {
            throw new Error("Cannot stringify POJOs with symbolic keys");
          }
          Object.keys(thing).forEach(function(key) {
            return walk(thing[key]);
          });
      }
    }
  }
  walk(value);
  var names = new Map();
  Array.from(counts).filter(function(entry) {
    return entry[1] > 1;
  }).sort(function(a, b) {
    return b[1] - a[1];
  }).forEach(function(entry, i) {
    names.set(entry[0], getName(i));
  });
  function stringify(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (isPrimitive(thing)) {
      return stringifyPrimitive(thing);
    }
    var type = getType(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return "Object(" + stringify(thing.valueOf()) + ")";
      case "RegExp":
        return "new RegExp(" + stringifyString(thing.source) + ', "' + thing.flags + '")';
      case "Date":
        return "new Date(" + thing.getTime() + ")";
      case "Array":
        var members = thing.map(function(v, i) {
          return i in thing ? stringify(v) : "";
        });
        var tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return "[" + members.join(",") + tail + "]";
      case "Set":
      case "Map":
        return "new " + type + "([" + Array.from(thing).map(stringify).join(",") + "])";
      default:
        var obj = "{" + Object.keys(thing).map(function(key) {
          return safeKey(key) + ":" + stringify(thing[key]);
        }).join(",") + "}";
        var proto = Object.getPrototypeOf(thing);
        if (proto === null) {
          return Object.keys(thing).length > 0 ? "Object.assign(Object.create(null)," + obj + ")" : "Object.create(null)";
        }
        return obj;
    }
  }
  var str = stringify(value);
  if (names.size) {
    var params_1 = [];
    var statements_1 = [];
    var values_1 = [];
    names.forEach(function(name, thing) {
      params_1.push(name);
      if (isPrimitive(thing)) {
        values_1.push(stringifyPrimitive(thing));
        return;
      }
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values_1.push("Object(" + stringify(thing.valueOf()) + ")");
          break;
        case "RegExp":
          values_1.push(thing.toString());
          break;
        case "Date":
          values_1.push("new Date(" + thing.getTime() + ")");
          break;
        case "Array":
          values_1.push("Array(" + thing.length + ")");
          thing.forEach(function(v, i) {
            statements_1.push(name + "[" + i + "]=" + stringify(v));
          });
          break;
        case "Set":
          values_1.push("new Set");
          statements_1.push(name + "." + Array.from(thing).map(function(v) {
            return "add(" + stringify(v) + ")";
          }).join("."));
          break;
        case "Map":
          values_1.push("new Map");
          statements_1.push(name + "." + Array.from(thing).map(function(_a) {
            var k = _a[0], v = _a[1];
            return "set(" + stringify(k) + ", " + stringify(v) + ")";
          }).join("."));
          break;
        default:
          values_1.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
          Object.keys(thing).forEach(function(key) {
            statements_1.push("" + name + safeProp(key) + "=" + stringify(thing[key]));
          });
      }
    });
    statements_1.push("return " + str);
    return "(function(" + params_1.join(",") + "){" + statements_1.join(";") + "}(" + values_1.join(",") + "))";
  } else {
    return str;
  }
}
function getName(num) {
  var name = "";
  do {
    name = chars[num % chars.length] + name;
    num = ~~(num / chars.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? name + "_" : name;
}
function isPrimitive(thing) {
  return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
  if (typeof thing === "string")
    return stringifyString(thing);
  if (thing === void 0)
    return "void 0";
  if (thing === 0 && 1 / thing < 0)
    return "-0";
  var str = String(thing);
  if (typeof thing === "number")
    return str.replace(/^(-)?0\./, "$1.");
  return str;
}
function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
  return escaped$1[c] || c;
}
function escapeUnsafeChars(str) {
  return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
}
function safeProp(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? "." + key : "[" + escapeUnsafeChars(JSON.stringify(key)) + "]";
}
function stringifyString(str) {
  var result = '"';
  for (var i = 0; i < str.length; i += 1) {
    var char = str.charAt(i);
    var code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$1) {
      result += escaped$1[char];
    } else if (code >= 55296 && code <= 57343) {
      var next = str.charCodeAt(i + 1);
      if (code <= 56319 && (next >= 56320 && next <= 57343)) {
        result += char + str[++i];
      } else {
        result += "\\u" + code.toString(16).toUpperCase();
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
function noop() {
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
function writable(value, start = noop) {
  let stop;
  const subscribers = new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe };
}
function hash(value) {
  let hash2 = 5381;
  let i = value.length;
  if (typeof value === "string") {
    while (i)
      hash2 = hash2 * 33 ^ value.charCodeAt(--i);
  } else {
    while (i)
      hash2 = hash2 * 33 ^ value[--i];
  }
  return (hash2 >>> 0).toString(36);
}
function escape_json_string_in_html(str) {
  return escape$1(str, escape_json_string_in_html_dict, (code) => `\\u${code.toString(16).toUpperCase()}`);
}
function escape_html_attr(str) {
  return '"' + escape$1(str, escape_html_attr_dict, (code) => `&#${code};`) + '"';
}
function escape$1(str, dict, unicode_encoder) {
  let result = "";
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charAt(i);
    const code = char.charCodeAt(0);
    if (char in dict) {
      result += dict[char];
    } else if (code >= 55296 && code <= 57343) {
      const next = str.charCodeAt(i + 1);
      if (code <= 56319 && next >= 56320 && next <= 57343) {
        result += char + str[++i];
      } else {
        result += unicode_encoder(code);
      }
    } else {
      result += char;
    }
  }
  return result;
}
async function render_response({
  branch,
  options: options2,
  $session,
  page_config,
  status,
  error: error2,
  page
}) {
  const css22 = new Set(options2.entry.css);
  const js = new Set(options2.entry.js);
  const styles = new Set();
  const serialized_data = [];
  let rendered;
  let is_private = false;
  let maxage;
  if (error2) {
    error2.stack = options2.get_stack(error2);
  }
  if (page_config.ssr) {
    branch.forEach(({ node, loaded, fetched, uses_credentials }) => {
      if (node.css)
        node.css.forEach((url) => css22.add(url));
      if (node.js)
        node.js.forEach((url) => js.add(url));
      if (node.styles)
        node.styles.forEach((content) => styles.add(content));
      if (fetched && page_config.hydrate)
        serialized_data.push(...fetched);
      if (uses_credentials)
        is_private = true;
      maxage = loaded.maxage;
    });
    const session = writable($session);
    const props = {
      stores: {
        page: writable(null),
        navigating: writable(null),
        session
      },
      page,
      components: branch.map(({ node }) => node.module.default)
    };
    for (let i = 0; i < branch.length; i += 1) {
      props[`props_${i}`] = await branch[i].loaded.props;
    }
    let session_tracking_active = false;
    const unsubscribe = session.subscribe(() => {
      if (session_tracking_active)
        is_private = true;
    });
    session_tracking_active = true;
    try {
      rendered = options2.root.render(props);
    } finally {
      unsubscribe();
    }
  } else {
    rendered = { head: "", html: "", css: { code: "", map: null } };
  }
  const include_js = page_config.router || page_config.hydrate;
  if (!include_js)
    js.clear();
  const links = options2.amp ? styles.size > 0 || rendered.css.code.length > 0 ? `<style amp-custom>${Array.from(styles).concat(rendered.css.code).join("\n")}</style>` : "" : [
    ...Array.from(js).map((dep) => `<link rel="modulepreload" href="${dep}">`),
    ...Array.from(css22).map((dep) => `<link rel="stylesheet" href="${dep}">`)
  ].join("\n		");
  let init2 = "";
  if (options2.amp) {
    init2 = `
		<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
		<noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
		<script async src="https://cdn.ampproject.org/v0.js"><\/script>`;
    init2 += options2.service_worker ? '<script async custom-element="amp-install-serviceworker" src="https://cdn.ampproject.org/v0/amp-install-serviceworker-0.1.js"><\/script>' : "";
  } else if (include_js) {
    init2 = `<script type="module">
			import { start } from ${s$1(options2.entry.file)};
			start({
				target: ${options2.target ? `document.querySelector(${s$1(options2.target)})` : "document.body"},
				paths: ${s$1(options2.paths)},
				session: ${try_serialize($session, (error3) => {
      throw new Error(`Failed to serialize session data: ${error3.message}`);
    })},
				host: ${page && page.host ? s$1(page.host) : "location.host"},
				route: ${!!page_config.router},
				spa: ${!page_config.ssr},
				trailing_slash: ${s$1(options2.trailing_slash)},
				hydrate: ${page_config.ssr && page_config.hydrate ? `{
					status: ${status},
					error: ${serialize_error(error2)},
					nodes: [
						${(branch || []).map(({ node }) => `import(${s$1(node.entry)})`).join(",\n						")}
					],
					page: {
						host: ${page && page.host ? s$1(page.host) : "location.host"}, // TODO this is redundant
						path: ${page && page.path ? try_serialize(page.path, (error3) => {
      throw new Error(`Failed to serialize page.path: ${error3.message}`);
    }) : null},
						query: new URLSearchParams(${page && page.query ? s$1(page.query.toString()) : ""}),
						params: ${page && page.params ? try_serialize(page.params, (error3) => {
      throw new Error(`Failed to serialize page.params: ${error3.message}`);
    }) : null}
					}
				}` : "null"}
			});
		<\/script>`;
  }
  if (options2.service_worker) {
    init2 += options2.amp ? `<amp-install-serviceworker src="${options2.service_worker}" layout="nodisplay"></amp-install-serviceworker>` : `<script>
			if ('serviceWorker' in navigator) {
				navigator.serviceWorker.register('${options2.service_worker}');
			}
		<\/script>`;
  }
  const head = [
    rendered.head,
    styles.size && !options2.amp ? `<style data-svelte>${Array.from(styles).join("\n")}</style>` : "",
    links,
    init2
  ].join("\n\n		");
  const body = options2.amp ? rendered.html : `${rendered.html}

			${serialized_data.map(({ url, body: body2, json }) => {
    let attributes = `type="application/json" data-type="svelte-data" data-url=${escape_html_attr(url)}`;
    if (body2)
      attributes += ` data-body="${hash(body2)}"`;
    return `<script ${attributes}>${json}<\/script>`;
  }).join("\n\n	")}
		`;
  const headers = {
    "content-type": "text/html"
  };
  if (maxage) {
    headers["cache-control"] = `${is_private ? "private" : "public"}, max-age=${maxage}`;
  }
  if (!options2.floc) {
    headers["permissions-policy"] = "interest-cohort=()";
  }
  return {
    status,
    headers,
    body: options2.template({ head, body })
  };
}
function try_serialize(data, fail) {
  try {
    return devalue(data);
  } catch (err) {
    if (fail)
      fail(coalesce_to_error(err));
    return null;
  }
}
function serialize_error(error2) {
  if (!error2)
    return null;
  let serialized = try_serialize(error2);
  if (!serialized) {
    const { name, message, stack } = error2;
    serialized = try_serialize({ ...error2, name, message, stack });
  }
  if (!serialized) {
    serialized = "{}";
  }
  return serialized;
}
function normalize(loaded) {
  const has_error_status = loaded.status && loaded.status >= 400 && loaded.status <= 599 && !loaded.redirect;
  if (loaded.error || has_error_status) {
    const status = loaded.status;
    if (!loaded.error && has_error_status) {
      return {
        status: status || 500,
        error: new Error()
      };
    }
    const error2 = typeof loaded.error === "string" ? new Error(loaded.error) : loaded.error;
    if (!(error2 instanceof Error)) {
      return {
        status: 500,
        error: new Error(`"error" property returned from load() must be a string or instance of Error, received type "${typeof error2}"`)
      };
    }
    if (!status || status < 400 || status > 599) {
      console.warn('"error" returned from load() without a valid status code \u2014 defaulting to 500');
      return { status: 500, error: error2 };
    }
    return { status, error: error2 };
  }
  if (loaded.redirect) {
    if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be accompanied by a 3xx status code')
      };
    }
    if (typeof loaded.redirect !== "string") {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be a string')
      };
    }
  }
  if (loaded.context) {
    throw new Error('You are returning "context" from a load function. "context" was renamed to "stuff", please adjust your code accordingly.');
  }
  return loaded;
}
async function load_node({
  request,
  options: options2,
  state,
  route,
  page,
  node,
  $session,
  stuff,
  prerender_enabled,
  is_leaf,
  is_error,
  status,
  error: error2
}) {
  const { module: module2 } = node;
  let uses_credentials = false;
  const fetched = [];
  let set_cookie_headers = [];
  let loaded;
  const page_proxy = new Proxy(page, {
    get: (target, prop, receiver) => {
      if (prop === "query" && prerender_enabled) {
        throw new Error("Cannot access query on a page with prerendering enabled");
      }
      return Reflect.get(target, prop, receiver);
    }
  });
  if (module2.load) {
    const load_input = {
      page: page_proxy,
      get session() {
        uses_credentials = true;
        return $session;
      },
      fetch: async (resource, opts = {}) => {
        let url;
        if (typeof resource === "string") {
          url = resource;
        } else {
          url = resource.url;
          opts = {
            method: resource.method,
            headers: resource.headers,
            body: resource.body,
            mode: resource.mode,
            credentials: resource.credentials,
            cache: resource.cache,
            redirect: resource.redirect,
            referrer: resource.referrer,
            integrity: resource.integrity,
            ...opts
          };
        }
        const resolved = resolve(request.path, url.split("?")[0]);
        let response;
        const prefix = options2.paths.assets || options2.paths.base;
        const filename = (resolved.startsWith(prefix) ? resolved.slice(prefix.length) : resolved).slice(1);
        const filename_html = `${filename}/index.html`;
        const asset = options2.manifest.assets.find((d) => d.file === filename || d.file === filename_html);
        if (asset) {
          response = options2.read ? new Response(options2.read(asset.file), {
            headers: asset.type ? { "content-type": asset.type } : {}
          }) : await fetch(`http://${page.host}/${asset.file}`, opts);
        } else if (is_root_relative(resolved)) {
          const relative = resolved;
          const headers = {
            ...opts.headers
          };
          if (opts.credentials !== "omit") {
            uses_credentials = true;
            headers.cookie = request.headers.cookie;
            if (!headers.authorization) {
              headers.authorization = request.headers.authorization;
            }
          }
          if (opts.body && typeof opts.body !== "string") {
            throw new Error("Request body must be a string");
          }
          const search = url.includes("?") ? url.slice(url.indexOf("?") + 1) : "";
          const rendered = await respond({
            host: request.host,
            method: opts.method || "GET",
            headers,
            path: relative,
            rawBody: opts.body == null ? null : new TextEncoder().encode(opts.body),
            query: new URLSearchParams(search)
          }, options2, {
            fetched: url,
            initiator: route
          });
          if (rendered) {
            if (state.prerender) {
              state.prerender.dependencies.set(relative, rendered);
            }
            response = new Response(rendered.body, {
              status: rendered.status,
              headers: rendered.headers
            });
          }
        } else {
          if (resolved.startsWith("//")) {
            throw new Error(`Cannot request protocol-relative URL (${url}) in server-side fetch`);
          }
          if (typeof request.host !== "undefined") {
            const { hostname: fetch_hostname } = new URL(url);
            const [server_hostname] = request.host.split(":");
            if (`.${fetch_hostname}`.endsWith(`.${server_hostname}`) && opts.credentials !== "omit") {
              uses_credentials = true;
              opts.headers = {
                ...opts.headers,
                cookie: request.headers.cookie
              };
            }
          }
          const external_request = new Request(url, opts);
          response = await options2.hooks.externalFetch.call(null, external_request);
        }
        if (response) {
          const proxy = new Proxy(response, {
            get(response2, key, _receiver) {
              async function text() {
                const body = await response2.text();
                const headers = {};
                for (const [key2, value] of response2.headers) {
                  if (key2 === "set-cookie") {
                    set_cookie_headers = set_cookie_headers.concat(value);
                  } else if (key2 !== "etag") {
                    headers[key2] = value;
                  }
                }
                if (!opts.body || typeof opts.body === "string") {
                  fetched.push({
                    url,
                    body: opts.body,
                    json: `{"status":${response2.status},"statusText":${s(response2.statusText)},"headers":${s(headers)},"body":"${escape_json_string_in_html(body)}"}`
                  });
                }
                return body;
              }
              if (key === "text") {
                return text;
              }
              if (key === "json") {
                return async () => {
                  return JSON.parse(await text());
                };
              }
              return Reflect.get(response2, key, response2);
            }
          });
          return proxy;
        }
        return response || new Response("Not found", {
          status: 404
        });
      },
      stuff: { ...stuff }
    };
    if (is_error) {
      load_input.status = status;
      load_input.error = error2;
    }
    loaded = await module2.load.call(null, load_input);
  } else {
    loaded = {};
  }
  if (!loaded && is_leaf && !is_error)
    return;
  if (!loaded) {
    throw new Error(`${node.entry} - load must return a value except for page fall through`);
  }
  return {
    node,
    loaded: normalize(loaded),
    stuff: loaded.stuff || stuff,
    fetched,
    set_cookie_headers,
    uses_credentials
  };
}
async function respond_with_error({ request, options: options2, state, $session, status, error: error2 }) {
  const default_layout = await options2.load_component(options2.manifest.layout);
  const default_error = await options2.load_component(options2.manifest.error);
  const page = {
    host: request.host,
    path: request.path,
    query: request.query,
    params: {}
  };
  const loaded = await load_node({
    request,
    options: options2,
    state,
    route: null,
    page,
    node: default_layout,
    $session,
    stuff: {},
    prerender_enabled: is_prerender_enabled(options2, default_error, state),
    is_leaf: false,
    is_error: false
  });
  const branch = [
    loaded,
    await load_node({
      request,
      options: options2,
      state,
      route: null,
      page,
      node: default_error,
      $session,
      stuff: loaded ? loaded.stuff : {},
      prerender_enabled: is_prerender_enabled(options2, default_error, state),
      is_leaf: false,
      is_error: true,
      status,
      error: error2
    })
  ];
  try {
    return await render_response({
      options: options2,
      $session,
      page_config: {
        hydrate: options2.hydrate,
        router: options2.router,
        ssr: options2.ssr
      },
      status,
      error: error2,
      branch,
      page
    });
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return {
      status: 500,
      headers: {},
      body: error3.stack
    };
  }
}
function is_prerender_enabled(options2, node, state) {
  return options2.prerender && (!!node.module.prerender || !!state.prerender && state.prerender.all);
}
async function respond$1(opts) {
  const { request, options: options2, state, $session, route } = opts;
  let nodes;
  try {
    nodes = await Promise.all(route.a.map((id) => id ? options2.load_component(id) : void 0));
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 500,
      error: error3
    });
  }
  const leaf = nodes[nodes.length - 1].module;
  let page_config = get_page_config(leaf, options2);
  if (!leaf.prerender && state.prerender && !state.prerender.all) {
    return {
      status: 204,
      headers: {}
    };
  }
  let branch = [];
  let status = 200;
  let error2;
  let set_cookie_headers = [];
  ssr:
    if (page_config.ssr) {
      let stuff = {};
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        let loaded;
        if (node) {
          try {
            loaded = await load_node({
              ...opts,
              node,
              stuff,
              prerender_enabled: is_prerender_enabled(options2, node, state),
              is_leaf: i === nodes.length - 1,
              is_error: false
            });
            if (!loaded)
              return;
            set_cookie_headers = set_cookie_headers.concat(loaded.set_cookie_headers);
            if (loaded.loaded.redirect) {
              return with_cookies({
                status: loaded.loaded.status,
                headers: {
                  location: encodeURI(loaded.loaded.redirect)
                }
              }, set_cookie_headers);
            }
            if (loaded.loaded.error) {
              ({ status, error: error2 } = loaded.loaded);
            }
          } catch (err) {
            const e = coalesce_to_error(err);
            options2.handle_error(e, request);
            status = 500;
            error2 = e;
          }
          if (loaded && !error2) {
            branch.push(loaded);
          }
          if (error2) {
            while (i--) {
              if (route.b[i]) {
                const error_node = await options2.load_component(route.b[i]);
                let node_loaded;
                let j = i;
                while (!(node_loaded = branch[j])) {
                  j -= 1;
                }
                try {
                  const error_loaded = await load_node({
                    ...opts,
                    node: error_node,
                    stuff: node_loaded.stuff,
                    prerender_enabled: is_prerender_enabled(options2, error_node, state),
                    is_leaf: false,
                    is_error: true,
                    status,
                    error: error2
                  });
                  if (error_loaded.loaded.error) {
                    continue;
                  }
                  page_config = get_page_config(error_node.module, options2);
                  branch = branch.slice(0, j + 1).concat(error_loaded);
                  break ssr;
                } catch (err) {
                  const e = coalesce_to_error(err);
                  options2.handle_error(e, request);
                  continue;
                }
              }
            }
            return with_cookies(await respond_with_error({
              request,
              options: options2,
              state,
              $session,
              status,
              error: error2
            }), set_cookie_headers);
          }
        }
        if (loaded && loaded.loaded.stuff) {
          stuff = {
            ...stuff,
            ...loaded.loaded.stuff
          };
        }
      }
    }
  try {
    return with_cookies(await render_response({
      ...opts,
      page_config,
      status,
      error: error2,
      branch: branch.filter(Boolean)
    }), set_cookie_headers);
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return with_cookies(await respond_with_error({
      ...opts,
      status: 500,
      error: error3
    }), set_cookie_headers);
  }
}
function get_page_config(leaf, options2) {
  return {
    ssr: "ssr" in leaf ? !!leaf.ssr : options2.ssr,
    router: "router" in leaf ? !!leaf.router : options2.router,
    hydrate: "hydrate" in leaf ? !!leaf.hydrate : options2.hydrate
  };
}
function with_cookies(response, set_cookie_headers) {
  if (set_cookie_headers.length) {
    response.headers["set-cookie"] = set_cookie_headers;
  }
  return response;
}
async function render_page(request, route, match, options2, state) {
  if (state.initiator === route) {
    return {
      status: 404,
      headers: {},
      body: `Not found: ${request.path}`
    };
  }
  const params = route.params(match);
  const page = {
    host: request.host,
    path: request.path,
    query: request.query,
    params
  };
  const $session = await options2.hooks.getSession(request);
  const response = await respond$1({
    request,
    options: options2,
    state,
    $session,
    route,
    page
  });
  if (response) {
    return response;
  }
  if (state.fetched) {
    return {
      status: 500,
      headers: {},
      body: `Bad request in load function: failed to fetch ${state.fetched}`
    };
  }
}
function read_only_form_data() {
  const map = new Map();
  return {
    append(key, value) {
      if (map.has(key)) {
        (map.get(key) || []).push(value);
      } else {
        map.set(key, [value]);
      }
    },
    data: new ReadOnlyFormData(map)
  };
}
function parse_body(raw, headers) {
  if (!raw)
    return raw;
  const content_type = headers["content-type"];
  const [type, ...directives] = content_type ? content_type.split(/;\s*/) : [];
  const text = () => new TextDecoder(headers["content-encoding"] || "utf-8").decode(raw);
  switch (type) {
    case "text/plain":
      return text();
    case "application/json":
      return JSON.parse(text());
    case "application/x-www-form-urlencoded":
      return get_urlencoded(text());
    case "multipart/form-data": {
      const boundary = directives.find((directive) => directive.startsWith("boundary="));
      if (!boundary)
        throw new Error("Missing boundary");
      return get_multipart(text(), boundary.slice("boundary=".length));
    }
    default:
      return raw;
  }
}
function get_urlencoded(text) {
  const { data, append } = read_only_form_data();
  text.replace(/\+/g, " ").split("&").forEach((str) => {
    const [key, value] = str.split("=");
    append(decodeURIComponent(key), decodeURIComponent(value));
  });
  return data;
}
function get_multipart(text, boundary) {
  const parts = text.split(`--${boundary}`);
  if (parts[0] !== "" || parts[parts.length - 1].trim() !== "--") {
    throw new Error("Malformed form data");
  }
  const { data, append } = read_only_form_data();
  parts.slice(1, -1).forEach((part) => {
    const match = /\s*([\s\S]+?)\r\n\r\n([\s\S]*)\s*/.exec(part);
    if (!match) {
      throw new Error("Malformed form data");
    }
    const raw_headers = match[1];
    const body = match[2].trim();
    let key;
    const headers = {};
    raw_headers.split("\r\n").forEach((str) => {
      const [raw_header, ...raw_directives] = str.split("; ");
      let [name, value] = raw_header.split(": ");
      name = name.toLowerCase();
      headers[name] = value;
      const directives = {};
      raw_directives.forEach((raw_directive) => {
        const [name2, value2] = raw_directive.split("=");
        directives[name2] = JSON.parse(value2);
      });
      if (name === "content-disposition") {
        if (value !== "form-data")
          throw new Error("Malformed form data");
        if (directives.filename) {
          throw new Error("File upload is not yet implemented");
        }
        if (directives.name) {
          key = directives.name;
        }
      }
    });
    if (!key)
      throw new Error("Malformed form data");
    append(key, body);
  });
  return data;
}
async function respond(incoming, options2, state = {}) {
  if (incoming.path !== "/" && options2.trailing_slash !== "ignore") {
    const has_trailing_slash = incoming.path.endsWith("/");
    if (has_trailing_slash && options2.trailing_slash === "never" || !has_trailing_slash && options2.trailing_slash === "always" && !(incoming.path.split("/").pop() || "").includes(".")) {
      const path = has_trailing_slash ? incoming.path.slice(0, -1) : incoming.path + "/";
      const q = incoming.query.toString();
      return {
        status: 301,
        headers: {
          location: options2.paths.base + path + (q ? `?${q}` : "")
        }
      };
    }
  }
  const headers = lowercase_keys(incoming.headers);
  const request = {
    ...incoming,
    headers,
    body: parse_body(incoming.rawBody, headers),
    params: {},
    locals: {}
  };
  try {
    return await options2.hooks.handle({
      request,
      resolve: async (request2) => {
        if (state.prerender && state.prerender.fallback) {
          return await render_response({
            options: options2,
            $session: await options2.hooks.getSession(request2),
            page_config: { ssr: false, router: true, hydrate: true },
            status: 200,
            branch: []
          });
        }
        const decoded = decodeURI(request2.path);
        for (const route of options2.manifest.routes) {
          const match = route.pattern.exec(decoded);
          if (!match)
            continue;
          const response = route.type === "endpoint" ? await render_endpoint(request2, route, match) : await render_page(request2, route, match, options2, state);
          if (response) {
            if (response.status === 200) {
              const cache_control = get_single_valued_header(response.headers, "cache-control");
              if (!cache_control || !/(no-store|immutable)/.test(cache_control)) {
                let if_none_match_value = request2.headers["if-none-match"];
                if (if_none_match_value?.startsWith('W/"')) {
                  if_none_match_value = if_none_match_value.substring(2);
                }
                const etag = `"${hash(response.body || "")}"`;
                if (if_none_match_value === etag) {
                  return {
                    status: 304,
                    headers: {}
                  };
                }
                response.headers["etag"] = etag;
              }
            }
            return response;
          }
        }
        const $session = await options2.hooks.getSession(request2);
        return await respond_with_error({
          request: request2,
          options: options2,
          state,
          $session,
          status: 404,
          error: new Error(`Not found: ${request2.path}`)
        });
      }
    });
  } catch (err) {
    const e = coalesce_to_error(err);
    options2.handle_error(e, request);
    return {
      status: 500,
      headers: {},
      body: options2.dev ? e.stack : e.message
    };
  }
}
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
}
function escape(html) {
  return String(html).replace(/["'&<>]/g, (match) => escaped[match]);
}
function validate_component(component, name) {
  if (!component || !component.$$render) {
    if (name === "svelte:component")
      name += " this={...}";
    throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
  }
  return component;
}
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(context || (parent_component ? parent_component.$$.context : [])),
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({ $$ });
    const html = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, { $$slots = {}, context = new Map() } = {}) => {
      on_destroy = [];
      const result = { title: "", head: "", css: new Set() };
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css22) => css22.code).join("\n"),
          map: null
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function afterUpdate() {
}
function set_paths(paths) {
  base = paths.base;
  assets = paths.assets || base;
}
function set_prerendering(value) {
}
function init(settings = default_settings) {
  set_paths(settings.paths);
  set_prerendering(settings.prerendering || false);
  const hooks = get_hooks(user_hooks);
  options = {
    amp: false,
    dev: false,
    entry: {
      file: assets + "/_app/start-61244ab7.js",
      css: [assets + "/_app/assets/start-1f089c51.css"],
      js: [assets + "/_app/start-61244ab7.js", assets + "/_app/chunks/vendor-dad3c69f.js"]
    },
    fetched: void 0,
    floc: false,
    get_component_path: (id) => assets + "/_app/" + entry_lookup[id],
    get_stack: (error2) => String(error2),
    handle_error: (error2, request) => {
      hooks.handleError({ error: error2, request });
      error2.stack = options.get_stack(error2);
    },
    hooks,
    hydrate: true,
    initiator: void 0,
    load_component,
    manifest,
    paths: settings.paths,
    prerender: true,
    read: settings.read,
    root: Root,
    service_worker: null,
    router: true,
    ssr: true,
    target: "#svelte",
    template,
    trailing_slash: "never"
  };
}
async function load_component(file) {
  const { entry, css: css22, js, styles } = metadata_lookup[file];
  return {
    module: await module_lookup[file](),
    entry: assets + "/_app/" + entry,
    css: css22.map((dep) => assets + "/_app/" + dep),
    js: js.map((dep) => assets + "/_app/" + dep),
    styles
  };
}
function render(request, {
  prerender: prerender10
} = {}) {
  const host = request.headers["host"];
  return respond({ ...request, host }, options, { prerender: prerender10 });
}
var __accessCheck, __privateGet, __privateAdd, __privateSet, _map, absolute, scheme, chars, unsafeChars, reserved, escaped$1, objectProtoOwnPropertyNames, subscriber_queue, escape_json_string_in_html_dict, escape_html_attr_dict, s$1, s, ReadOnlyFormData, current_component, escaped, missing_component, on_destroy, css11, Root, base, assets, user_hooks, template, options, default_settings, empty, manifest, get_hooks, module_lookup, metadata_lookup;
var init_app_6a68fa8d = __esm({
  ".svelte-kit/output/server/chunks/app-6a68fa8d.js"() {
    init_shims();
    __accessCheck = (obj, member, msg) => {
      if (!member.has(obj))
        throw TypeError("Cannot " + msg);
    };
    __privateGet = (obj, member, getter) => {
      __accessCheck(obj, member, "read from private field");
      return getter ? getter.call(obj) : member.get(obj);
    };
    __privateAdd = (obj, member, value) => {
      if (member.has(obj))
        throw TypeError("Cannot add the same private member more than once");
      member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
    };
    __privateSet = (obj, member, value, setter) => {
      __accessCheck(obj, member, "write to private field");
      setter ? setter.call(obj, value) : member.set(obj, value);
      return value;
    };
    absolute = /^([a-z]+:)?\/?\//;
    scheme = /^[a-z]+:/;
    chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
    unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
    reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
    escaped$1 = {
      "<": "\\u003C",
      ">": "\\u003E",
      "/": "\\u002F",
      "\\": "\\\\",
      "\b": "\\b",
      "\f": "\\f",
      "\n": "\\n",
      "\r": "\\r",
      "	": "\\t",
      "\0": "\\0",
      "\u2028": "\\u2028",
      "\u2029": "\\u2029"
    };
    objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
    Promise.resolve();
    subscriber_queue = [];
    escape_json_string_in_html_dict = {
      '"': '\\"',
      "<": "\\u003C",
      ">": "\\u003E",
      "/": "\\u002F",
      "\\": "\\\\",
      "\b": "\\b",
      "\f": "\\f",
      "\n": "\\n",
      "\r": "\\r",
      "	": "\\t",
      "\0": "\\0",
      "\u2028": "\\u2028",
      "\u2029": "\\u2029"
    };
    escape_html_attr_dict = {
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;"
    };
    s$1 = JSON.stringify;
    s = JSON.stringify;
    ReadOnlyFormData = class {
      constructor(map) {
        __privateAdd(this, _map, void 0);
        __privateSet(this, _map, map);
      }
      get(key) {
        const value = __privateGet(this, _map).get(key);
        return value && value[0];
      }
      getAll(key) {
        return __privateGet(this, _map).get(key);
      }
      has(key) {
        return __privateGet(this, _map).has(key);
      }
      *[Symbol.iterator]() {
        for (const [key, value] of __privateGet(this, _map)) {
          for (let i = 0; i < value.length; i += 1) {
            yield [key, value[i]];
          }
        }
      }
      *entries() {
        for (const [key, value] of __privateGet(this, _map)) {
          for (let i = 0; i < value.length; i += 1) {
            yield [key, value[i]];
          }
        }
      }
      *keys() {
        for (const [key] of __privateGet(this, _map))
          yield key;
      }
      *values() {
        for (const [, value] of __privateGet(this, _map)) {
          for (let i = 0; i < value.length; i += 1) {
            yield value[i];
          }
        }
      }
    };
    _map = new WeakMap();
    Promise.resolve();
    escaped = {
      '"': "&quot;",
      "'": "&#39;",
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;"
    };
    missing_component = {
      $$render: () => ""
    };
    css11 = {
      code: "#svelte-announcer.svelte-1r92h5h{position:absolute;left:0;top:0;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px}",
      map: null
    };
    Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { stores } = $$props;
      let { page } = $$props;
      let { components } = $$props;
      let { props_0 = null } = $$props;
      let { props_1 = null } = $$props;
      let { props_2 = null } = $$props;
      setContext("__svelte__", stores);
      afterUpdate(stores.page.notify);
      if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
        $$bindings.stores(stores);
      if ($$props.page === void 0 && $$bindings.page && page !== void 0)
        $$bindings.page(page);
      if ($$props.components === void 0 && $$bindings.components && components !== void 0)
        $$bindings.components(components);
      if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
        $$bindings.props_0(props_0);
      if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
        $$bindings.props_1(props_1);
      if ($$props.props_2 === void 0 && $$bindings.props_2 && props_2 !== void 0)
        $$bindings.props_2(props_2);
      $$result.css.add(css11);
      {
        stores.page.set(page);
      }
      return `${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {
        default: () => `${components[1] ? `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {
          default: () => `${components[2] ? `${validate_component(components[2] || missing_component, "svelte:component").$$render($$result, Object.assign(props_2 || {}), {}, {})}` : ``}`
        })}` : ``}`
      })}

${``}`;
    });
    base = "";
    assets = "";
    user_hooks = /* @__PURE__ */ Object.freeze({
      __proto__: null,
      [Symbol.toStringTag]: "Module"
    });
    template = ({ head, body }) => '<!DOCTYPE html>\n<html lang="en">\n	<head>\n		<meta charset="utf-8" />\n		<meta name="description" content="" />\n		<link rel="icon" href="/favicon.png" />\n		<meta name="viewport" content="width=device-width, initial-scale=1" />\n		' + head + '\n	</head>\n	<body>\n		<div id="svelte">' + body + "</div>\n	</body>\n</html>\n";
    options = null;
    default_settings = { paths: { "base": "", "assets": "" } };
    empty = () => ({});
    manifest = {
      assets: [{ "file": "favicon1.png", "size": 1571, "type": "image/png" }, { "file": "favicon.png", "size": 200521, "type": "image/png" }, { "file": "images/logo youtube.jpg", "size": 485909, "type": "image/jpeg" }, { "file": "images/logo.png", "size": 311689, "type": "image/png" }, { "file": "images/logotree.png", "size": 109976, "type": "image/png" }, { "file": "images/logotree.svg", "size": 134165, "type": "image/svg+xml" }, { "file": "images/logotreerobin.png", "size": 329212, "type": "image/png" }, { "file": "images/logotreerobin.svg", "size": 1065244, "type": "image/svg+xml" }, { "file": "images/square.png", "size": 513, "type": "image/png" }, { "file": "images/europe/1939c.jpg", "size": 10018, "type": "image/jpeg" }, { "file": "images/europe/american-flag.jpg", "size": 7845, "type": "image/jpeg" }, { "file": "images/europe/ancestry.jpg", "size": 5902, "type": "image/jpeg" }, { "file": "images/europe/archives.jpg", "size": 29905, "type": "image/jpeg" }, { "file": "images/europe/australia-flag.jpg", "size": 6575, "type": "image/jpeg" }, { "file": "images/europe/austria-flag.jpg", "size": 5889, "type": "image/jpeg" }, { "file": "images/europe/belarus-flag.jpg", "size": 7604, "type": "image/jpeg" }, { "file": "images/europe/belarus-map.jpg", "size": 26169, "type": "image/jpeg" }, { "file": "images/europe/belgium-flag.jpg", "size": 3352, "type": "image/jpeg" }, { "file": "images/europe/britmila.jpg", "size": 18491, "type": "image/jpeg" }, { "file": "images/europe/business.jpg", "size": 3672, "type": "image/jpeg" }, { "file": "images/europe/camps.jpg", "size": 10826, "type": "image/jpeg" }, { "file": "images/europe/canada-flag.jpg", "size": 3747, "type": "image/jpeg" }, { "file": "images/europe/censusireland.jpg", "size": 31898, "type": "image/jpeg" }, { "file": "images/europe/church.jpg", "size": 13236, "type": "image/jpeg" }, { "file": "images/europe/companies.jpg", "size": 11526, "type": "image/jpeg" }, { "file": "images/europe/cyrillic.jpg", "size": 31702, "type": "image/jpeg" }, { "file": "images/europe/database.jpg", "size": 15716, "type": "image/jpeg" }, { "file": "images/europe/dnipropetrovsk_arms.jpg", "size": 26546, "type": "image/jpeg" }, { "file": "images/europe/family-tree.jpg", "size": 16455, "type": "image/jpeg" }, { "file": "images/europe/first.jpg", "size": 9946, "type": "image/jpeg" }, { "file": "images/europe/flame.jpg", "size": 8874, "type": "image/jpeg" }, { "file": "images/europe/french-flag.jpg", "size": 1472, "type": "image/jpeg" }, { "file": "images/europe/gate.jpg", "size": 16290, "type": "image/jpeg" }, { "file": "images/europe/gazette.jpg", "size": 22586, "type": "image/jpeg" }, { "file": "images/europe/gen.jpg", "size": 10614, "type": "image/jpeg" }, { "file": "images/europe/graves.jpg", "size": 26310, "type": "image/jpeg" }, { "file": "images/europe/handwriting.jpg", "size": 9750, "type": "image/jpeg" }, { "file": "images/europe/hebrew.jpg", "size": 13356, "type": "image/jpeg" }, { "file": "images/europe/heritage.jpg", "size": 5169, "type": "image/jpeg" }, { "file": "images/europe/home.jpg", "size": 12463, "type": "image/jpeg" }, { "file": "images/europe/industral.jpg", "size": 11774, "type": "image/jpeg" }, { "file": "images/europe/ireland-flag.jpg", "size": 3114, "type": "image/jpeg" }, { "file": "images/europe/jc.jpg", "size": 11984, "type": "image/jpeg" }, { "file": "images/europe/jewish-graves.jpg", "size": 26756, "type": "image/jpeg" }, { "file": "images/europe/jfs.jpg", "size": 13899, "type": "image/jpeg" }, { "file": "images/europe/ketubot.jpg", "size": 14052, "type": "image/jpeg" }, { "file": "images/europe/liberty.jpg", "size": 8593, "type": "image/jpeg" }, { "file": "images/europe/loos.jpg", "size": 10999, "type": "image/jpeg" }, { "file": "images/europe/mag-glass.jpg", "size": 10789, "type": "image/jpeg" }, { "file": "images/europe/memorial-de-la-shoah.jpg", "size": 9861, "type": "image/jpeg" }, { "file": "images/europe/mohylivska.jpg", "size": 14236, "type": "image/jpeg" }, { "file": "images/europe/mohyliv_arms.jpg", "size": 25639, "type": "image/jpeg" }, { "file": "images/europe/netherlands-flag.jpg", "size": 3693, "type": "image/jpeg" }, { "file": "images/europe/newspaper.jpg", "size": 17154, "type": "image/jpeg" }, { "file": "images/europe/newyork.jpg", "size": 14348, "type": "image/jpeg" }, { "file": "images/europe/newzealand-flag.jpg", "size": 5835, "type": "image/jpeg" }, { "file": "images/europe/nz-birth-cert.jpg", "size": 10065, "type": "image/jpeg" }, { "file": "images/europe/nz-gazette.jpg", "size": 8007, "type": "image/jpeg" }, { "file": "images/europe/passenger.jpg", "size": 12985, "type": "image/jpeg" }, { "file": "images/europe/raf.jpg", "size": 14417, "type": "image/jpeg" }, { "file": "images/europe/relocation.jpg", "size": 13880, "type": "image/jpeg" }, { "file": "images/europe/roll.jpg", "size": 8794, "type": "image/jpeg" }, { "file": "images/europe/russian-flag.jpg", "size": 3765, "type": "image/jpeg" }, { "file": "images/europe/shamrock.jpg", "size": 25965, "type": "image/jpeg" }, { "file": "images/europe/shtetel.jpg", "size": 12269, "type": "image/jpeg" }, { "file": "images/europe/skala.jpg", "size": 16845, "type": "image/jpeg" }, { "file": "images/europe/soviet-map.jpg", "size": 14532, "type": "image/jpeg" }, { "file": "images/europe/soviet-medals.jpg", "size": 58166, "type": "image/jpeg" }, { "file": "images/europe/star-jewish.jpg", "size": 19282, "type": "image/jpeg" }, { "file": "images/europe/synagogue.jpg", "size": 32079, "type": "image/jpeg" }, { "file": "images/europe/trade.jpg", "size": 11204, "type": "image/jpeg" }, { "file": "images/europe/uk-flag.jpg", "size": 12377, "type": "image/jpeg" }, { "file": "images/europe/ukraine-flag.jpg", "size": 3049, "type": "image/jpeg" }, { "file": "images/europe/viennaparlament.jpg", "size": 34613, "type": "image/jpeg" }, { "file": "images/europe/war-graves.jpg", "size": 15718, "type": "image/jpeg" }, { "file": "images/europe/war.jpg", "size": 18683, "type": "image/jpeg" }, { "file": "images/europe/wedding.jpg", "size": 14597, "type": "image/jpeg" }, { "file": "images/europe/wills.jpg", "size": 7357, "type": "image/jpeg" }, { "file": "images/europe/workhouse.jpg", "size": 9988, "type": "image/jpeg" }, { "file": "images/svg/bookreadingman.svg", "size": 97434, "type": "image/svg+xml" }, { "file": "images/svg/favicon.png", "size": 200521, "type": "image/png" }, { "file": "images/svg/favicon_io.zip", "size": 64172, "type": "application/zip" }, { "file": "images/svg/FX13_robin.svg", "size": 12944, "type": "image/svg+xml" }, { "file": "images/svg/logomanbook.png", "size": 66939, "type": "image/png" }, { "file": "images/svg/logomanrobin.png", "size": 66297, "type": "image/png" }, { "file": "images/svg/logotree.png", "size": 109976, "type": "image/png" }, { "file": "images/svg/logotree.svg", "size": 134165, "type": "image/svg+xml" }, { "file": "images/svg/logotreerobin.png", "size": 240048, "type": "image/png" }, { "file": "images/svg/logotreerobin.svg", "size": 1065244, "type": "image/svg+xml" }, { "file": "images/svg/oaktree.svg", "size": 73414, "type": "image/svg+xml" }, { "file": "images/svg/tree.svg", "size": 30168, "type": "image/svg+xml" }, { "file": "images/svg/tree1.png", "size": 321269, "type": "image/png" }, { "file": "images/svg/tree3.svg", "size": 1198878, "type": "image/svg+xml" }, { "file": "images/svg/favicon_io/android-chrome-192x192.png", "size": 8749, "type": "image/png" }, { "file": "images/svg/favicon_io/android-chrome-512x512.png", "size": 29725, "type": "image/png" }, { "file": "images/svg/favicon_io/apple-touch-icon.png", "size": 7805, "type": "image/png" }, { "file": "images/svg/favicon_io/favicon-16x16.png", "size": 448, "type": "image/png" }, { "file": "images/svg/favicon_io/favicon-32x32.png", "size": 956, "type": "image/png" }, { "file": "images/svg/favicon_io/favicon.ico", "size": 15406, "type": "image/vnd.microsoft.icon" }, { "file": "images/svg/favicon_io/site.webmanifest", "size": 263, "type": "application/manifest+json" }],
      layout: "src/routes/__layout.svelte",
      error: ".svelte-kit/build/components/error.svelte",
      routes: [
        {
          type: "page",
          pattern: /^\/$/,
          params: empty,
          a: ["src/routes/__layout.svelte", "src/routes/index.svelte"],
          b: [".svelte-kit/build/components/error.svelte"]
        },
        {
          type: "page",
          pattern: /^\/newzealand\/?$/,
          params: empty,
          a: ["src/routes/__layout.svelte", "src/routes/newzealand.svelte"],
          b: [".svelte-kit/build/components/error.svelte"]
        },
        {
          type: "page",
          pattern: /^\/australia\/?$/,
          params: empty,
          a: ["src/routes/__layout.svelte", "src/routes/australia.svelte"],
          b: [".svelte-kit/build/components/error.svelte"]
        },
        {
          type: "page",
          pattern: /^\/austrian\/?$/,
          params: empty,
          a: ["src/routes/__layout.svelte", "src/routes/austrian.svelte"],
          b: [".svelte-kit/build/components/error.svelte"]
        },
        {
          type: "page",
          pattern: /^\/barbados\/?$/,
          params: empty,
          a: ["src/routes/__layout.svelte", "src/routes/barbados.svelte"],
          b: [".svelte-kit/build/components/error.svelte"]
        },
        {
          type: "page",
          pattern: /^\/belarus\/?$/,
          params: empty,
          a: ["src/routes/__layout.svelte", "src/routes/belarus.svelte"],
          b: [".svelte-kit/build/components/error.svelte"]
        },
        {
          type: "page",
          pattern: /^\/belgium\/?$/,
          params: empty,
          a: ["src/routes/__layout.svelte", "src/routes/belgium.svelte"],
          b: [".svelte-kit/build/components/error.svelte"]
        },
        {
          type: "page",
          pattern: /^\/bermuda\/?$/,
          params: empty,
          a: ["src/routes/__layout.svelte", "src/routes/bermuda.svelte"],
          b: [".svelte-kit/build/components/error.svelte"]
        },
        {
          type: "page",
          pattern: /^\/british\/?$/,
          params: empty,
          a: ["src/routes/__layout.svelte", "src/routes/british.svelte"],
          b: [".svelte-kit/build/components/error.svelte"]
        }
      ]
    };
    get_hooks = (hooks) => ({
      getSession: hooks.getSession || (() => ({})),
      handle: hooks.handle || (({ request, resolve: resolve2 }) => resolve2(request)),
      handleError: hooks.handleError || (({ error: error2 }) => console.error(error2.stack)),
      externalFetch: hooks.externalFetch || fetch
    });
    module_lookup = {
      "src/routes/__layout.svelte": () => Promise.resolve().then(() => (init_layout_db7eea6e(), layout_db7eea6e_exports)),
      ".svelte-kit/build/components/error.svelte": () => Promise.resolve().then(() => (init_error_0d79fb5a(), error_0d79fb5a_exports)),
      "src/routes/index.svelte": () => Promise.resolve().then(() => (init_index_7a25200d(), index_7a25200d_exports)),
      "src/routes/newzealand.svelte": () => Promise.resolve().then(() => (init_newzealand_fc4ee07e(), newzealand_fc4ee07e_exports)),
      "src/routes/australia.svelte": () => Promise.resolve().then(() => (init_australia_5a838185(), australia_5a838185_exports)),
      "src/routes/austrian.svelte": () => Promise.resolve().then(() => (init_austrian_511c43fb(), austrian_511c43fb_exports)),
      "src/routes/barbados.svelte": () => Promise.resolve().then(() => (init_barbados_6c3c1f52(), barbados_6c3c1f52_exports)),
      "src/routes/belarus.svelte": () => Promise.resolve().then(() => (init_belarus_c325c7f8(), belarus_c325c7f8_exports)),
      "src/routes/belgium.svelte": () => Promise.resolve().then(() => (init_belgium_c450e4c4(), belgium_c450e4c4_exports)),
      "src/routes/bermuda.svelte": () => Promise.resolve().then(() => (init_bermuda_805e96af(), bermuda_805e96af_exports)),
      "src/routes/british.svelte": () => Promise.resolve().then(() => (init_british_28efe97c(), british_28efe97c_exports))
    };
    metadata_lookup = { "src/routes/__layout.svelte": { "entry": "pages/__layout.svelte-1800d970.js", "css": ["assets/pages/__layout.svelte-527e1b78.css"], "js": ["pages/__layout.svelte-1800d970.js", "chunks/vendor-dad3c69f.js"], "styles": [] }, ".svelte-kit/build/components/error.svelte": { "entry": "error.svelte-0eb0ae99.js", "css": [], "js": ["error.svelte-0eb0ae99.js", "chunks/vendor-dad3c69f.js"], "styles": [] }, "src/routes/index.svelte": { "entry": "pages/index.svelte-0f6dcdd5.js", "css": ["assets/pages/index.svelte-3b776db4.css"], "js": ["pages/index.svelte-0f6dcdd5.js", "chunks/vendor-dad3c69f.js"], "styles": [] }, "src/routes/newzealand.svelte": { "entry": "pages/newzealand.svelte-55e4c24e.js", "css": ["assets/pages/newzealand.svelte-4345acdd.css"], "js": ["pages/newzealand.svelte-55e4c24e.js", "chunks/vendor-dad3c69f.js"], "styles": [] }, "src/routes/australia.svelte": { "entry": "pages/australia.svelte-a93343f0.js", "css": ["assets/pages/australia.svelte-b349f3b9.css"], "js": ["pages/australia.svelte-a93343f0.js", "chunks/vendor-dad3c69f.js"], "styles": [] }, "src/routes/austrian.svelte": { "entry": "pages/austrian.svelte-9cffc3ae.js", "css": ["assets/pages/bermuda.svelte-e76c3c5b.css"], "js": ["pages/austrian.svelte-9cffc3ae.js", "chunks/vendor-dad3c69f.js"], "styles": [] }, "src/routes/barbados.svelte": { "entry": "pages/barbados.svelte-f6f292b5.js", "css": ["assets/pages/bermuda.svelte-e76c3c5b.css"], "js": ["pages/barbados.svelte-f6f292b5.js", "chunks/vendor-dad3c69f.js"], "styles": [] }, "src/routes/belarus.svelte": { "entry": "pages/belarus.svelte-e0a853d5.js", "css": ["assets/pages/belarus.svelte-af50c5fc.css"], "js": ["pages/belarus.svelte-e0a853d5.js", "chunks/vendor-dad3c69f.js"], "styles": [] }, "src/routes/belgium.svelte": { "entry": "pages/belgium.svelte-c6264256.js", "css": ["assets/pages/bermuda.svelte-e76c3c5b.css"], "js": ["pages/belgium.svelte-c6264256.js", "chunks/vendor-dad3c69f.js"], "styles": [] }, "src/routes/bermuda.svelte": { "entry": "pages/bermuda.svelte-be2f2254.js", "css": ["assets/pages/bermuda.svelte-e76c3c5b.css"], "js": ["pages/bermuda.svelte-be2f2254.js", "chunks/vendor-dad3c69f.js"], "styles": [] }, "src/routes/british.svelte": { "entry": "pages/british.svelte-78b76c88.js", "css": ["assets/pages/british.svelte-2a5d1767.css"], "js": ["pages/british.svelte-78b76c88.js", "chunks/vendor-dad3c69f.js"], "styles": [] } };
  }
});

// .svelte-kit/netlify/entry.js
__export(exports, {
  handler: () => handler
});
init_shims();

// .svelte-kit/output/server/app.js
init_shims();
init_app_6a68fa8d();

// .svelte-kit/netlify/entry.js
init();
async function handler(event) {
  const { path, httpMethod, headers, rawQuery, body, isBase64Encoded } = event;
  const query = new URLSearchParams(rawQuery);
  const encoding = isBase64Encoded ? "base64" : headers["content-encoding"] || "utf-8";
  const rawBody = typeof body === "string" ? Buffer.from(body, encoding) : body;
  const rendered = await render({
    method: httpMethod,
    headers,
    path,
    query,
    rawBody
  });
  if (!rendered) {
    return {
      statusCode: 404,
      body: "Not found"
    };
  }
  const partial_response = {
    statusCode: rendered.status,
    ...split_headers(rendered.headers)
  };
  if (rendered.body instanceof Uint8Array) {
    return {
      ...partial_response,
      isBase64Encoded: true,
      body: Buffer.from(rendered.body).toString("base64")
    };
  }
  return {
    ...partial_response,
    body: rendered.body
  };
}
function split_headers(headers) {
  const h = {};
  const m = {};
  for (const key in headers) {
    const value = headers[key];
    const target = Array.isArray(value) ? m : h;
    target[key] = value;
  }
  return {
    headers: h,
    multiValueHeaders: m
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
/*! fetch-blob. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
