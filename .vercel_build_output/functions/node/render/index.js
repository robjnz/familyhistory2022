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

// node_modules/@sveltejs/kit/dist/chunks/multipart-parser.js
var multipart_parser_exports = {};
__export(multipart_parser_exports, {
  toFormData: () => toFormData
});
function _fileName(headerValue) {
  const m2 = headerValue.match(/\bfilename=("(.*?)"|([^()<>@,;:\\"/[\]?={}\s\t]+))($|;\s)/i);
  if (!m2) {
    return;
  }
  const match = m2[2] || m2[3] || "";
  let filename = match.slice(match.lastIndexOf("\\") + 1);
  filename = filename.replace(/%22/g, '"');
  filename = filename.replace(/&#(\d{4});/g, (m3, code) => {
    return String.fromCharCode(code);
  });
  return filename;
}
async function toFormData(Body2, ct) {
  if (!/multipart/i.test(ct)) {
    throw new TypeError("Failed to fetch");
  }
  const m2 = ct.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  if (!m2) {
    throw new TypeError("no or bad content-type header, no multipart boundary");
  }
  const parser = new MultipartParser(m2[1] || m2[2]);
  let headerField;
  let headerValue;
  let entryValue;
  let entryName;
  let contentType;
  let filename;
  const entryChunks = [];
  const formData = new FormData();
  const onPartData = (ui8a) => {
    entryValue += decoder.decode(ui8a, { stream: true });
  };
  const appendToFile = (ui8a) => {
    entryChunks.push(ui8a);
  };
  const appendFileToFormData = () => {
    const file = new File(entryChunks, filename, { type: contentType });
    formData.append(entryName, file);
  };
  const appendEntryToFormData = () => {
    formData.append(entryName, entryValue);
  };
  const decoder = new TextDecoder("utf-8");
  decoder.decode();
  parser.onPartBegin = function() {
    parser.onPartData = onPartData;
    parser.onPartEnd = appendEntryToFormData;
    headerField = "";
    headerValue = "";
    entryValue = "";
    entryName = "";
    contentType = "";
    filename = null;
    entryChunks.length = 0;
  };
  parser.onHeaderField = function(ui8a) {
    headerField += decoder.decode(ui8a, { stream: true });
  };
  parser.onHeaderValue = function(ui8a) {
    headerValue += decoder.decode(ui8a, { stream: true });
  };
  parser.onHeaderEnd = function() {
    headerValue += decoder.decode();
    headerField = headerField.toLowerCase();
    if (headerField === "content-disposition") {
      const m3 = headerValue.match(/\bname=("([^"]*)"|([^()<>@,;:\\"/[\]?={}\s\t]+))/i);
      if (m3) {
        entryName = m3[2] || m3[3] || "";
      }
      filename = _fileName(headerValue);
      if (filename) {
        parser.onPartData = appendToFile;
        parser.onPartEnd = appendFileToFormData;
      }
    } else if (headerField === "content-type") {
      contentType = headerValue;
    }
    headerValue = "";
    headerField = "";
  };
  for await (const chunk of Body2) {
    parser.write(chunk);
  }
  parser.end();
  return formData;
}
var import_node_fs, import_node_path, import_node_worker_threads, import_node_http, import_node_https, import_node_zlib, import_node_stream, import_node_util, import_node_url, import_net, s, S, f, F, LF, CR, SPACE, HYPHEN, COLON, A, Z, lower, noop, MultipartParser;
var init_multipart_parser = __esm({
  "node_modules/@sveltejs/kit/dist/chunks/multipart-parser.js"() {
    init_shims();
    import_node_fs = __toModule(require("node:fs"));
    import_node_path = __toModule(require("node:path"));
    import_node_worker_threads = __toModule(require("node:worker_threads"));
    init_install_fetch();
    import_node_http = __toModule(require("node:http"));
    import_node_https = __toModule(require("node:https"));
    import_node_zlib = __toModule(require("node:zlib"));
    import_node_stream = __toModule(require("node:stream"));
    import_node_util = __toModule(require("node:util"));
    import_node_url = __toModule(require("node:url"));
    import_net = __toModule(require("net"));
    globalThis.DOMException || (() => {
      const port = new import_node_worker_threads.MessageChannel().port1;
      const ab = new ArrayBuffer(0);
      try {
        port.postMessage(ab, [ab, ab]);
      } catch (err) {
        return err.constructor;
      }
    })();
    s = 0;
    S = {
      START_BOUNDARY: s++,
      HEADER_FIELD_START: s++,
      HEADER_FIELD: s++,
      HEADER_VALUE_START: s++,
      HEADER_VALUE: s++,
      HEADER_VALUE_ALMOST_DONE: s++,
      HEADERS_ALMOST_DONE: s++,
      PART_DATA_START: s++,
      PART_DATA: s++,
      END: s++
    };
    f = 1;
    F = {
      PART_BOUNDARY: f,
      LAST_BOUNDARY: f *= 2
    };
    LF = 10;
    CR = 13;
    SPACE = 32;
    HYPHEN = 45;
    COLON = 58;
    A = 97;
    Z = 122;
    lower = (c) => c | 32;
    noop = () => {
    };
    MultipartParser = class {
      constructor(boundary) {
        this.index = 0;
        this.flags = 0;
        this.onHeaderEnd = noop;
        this.onHeaderField = noop;
        this.onHeadersEnd = noop;
        this.onHeaderValue = noop;
        this.onPartBegin = noop;
        this.onPartData = noop;
        this.onPartEnd = noop;
        this.boundaryChars = {};
        boundary = "\r\n--" + boundary;
        const ui8a = new Uint8Array(boundary.length);
        for (let i2 = 0; i2 < boundary.length; i2++) {
          ui8a[i2] = boundary.charCodeAt(i2);
          this.boundaryChars[ui8a[i2]] = true;
        }
        this.boundary = ui8a;
        this.lookbehind = new Uint8Array(this.boundary.length + 8);
        this.state = S.START_BOUNDARY;
      }
      write(data) {
        let i2 = 0;
        const length_ = data.length;
        let previousIndex = this.index;
        let { lookbehind, boundary, boundaryChars, index, state, flags } = this;
        const boundaryLength = this.boundary.length;
        const boundaryEnd = boundaryLength - 1;
        const bufferLength = data.length;
        let c;
        let cl;
        const mark = (name) => {
          this[name + "Mark"] = i2;
        };
        const clear = (name) => {
          delete this[name + "Mark"];
        };
        const callback = (callbackSymbol, start, end, ui8a) => {
          if (start === void 0 || start !== end) {
            this[callbackSymbol](ui8a && ui8a.subarray(start, end));
          }
        };
        const dataCallback = (name, clear2) => {
          const markSymbol = name + "Mark";
          if (!(markSymbol in this)) {
            return;
          }
          if (clear2) {
            callback(name, this[markSymbol], i2, data);
            delete this[markSymbol];
          } else {
            callback(name, this[markSymbol], data.length, data);
            this[markSymbol] = 0;
          }
        };
        for (i2 = 0; i2 < length_; i2++) {
          c = data[i2];
          switch (state) {
            case S.START_BOUNDARY:
              if (index === boundary.length - 2) {
                if (c === HYPHEN) {
                  flags |= F.LAST_BOUNDARY;
                } else if (c !== CR) {
                  return;
                }
                index++;
                break;
              } else if (index - 1 === boundary.length - 2) {
                if (flags & F.LAST_BOUNDARY && c === HYPHEN) {
                  state = S.END;
                  flags = 0;
                } else if (!(flags & F.LAST_BOUNDARY) && c === LF) {
                  index = 0;
                  callback("onPartBegin");
                  state = S.HEADER_FIELD_START;
                } else {
                  return;
                }
                break;
              }
              if (c !== boundary[index + 2]) {
                index = -2;
              }
              if (c === boundary[index + 2]) {
                index++;
              }
              break;
            case S.HEADER_FIELD_START:
              state = S.HEADER_FIELD;
              mark("onHeaderField");
              index = 0;
            case S.HEADER_FIELD:
              if (c === CR) {
                clear("onHeaderField");
                state = S.HEADERS_ALMOST_DONE;
                break;
              }
              index++;
              if (c === HYPHEN) {
                break;
              }
              if (c === COLON) {
                if (index === 1) {
                  return;
                }
                dataCallback("onHeaderField", true);
                state = S.HEADER_VALUE_START;
                break;
              }
              cl = lower(c);
              if (cl < A || cl > Z) {
                return;
              }
              break;
            case S.HEADER_VALUE_START:
              if (c === SPACE) {
                break;
              }
              mark("onHeaderValue");
              state = S.HEADER_VALUE;
            case S.HEADER_VALUE:
              if (c === CR) {
                dataCallback("onHeaderValue", true);
                callback("onHeaderEnd");
                state = S.HEADER_VALUE_ALMOST_DONE;
              }
              break;
            case S.HEADER_VALUE_ALMOST_DONE:
              if (c !== LF) {
                return;
              }
              state = S.HEADER_FIELD_START;
              break;
            case S.HEADERS_ALMOST_DONE:
              if (c !== LF) {
                return;
              }
              callback("onHeadersEnd");
              state = S.PART_DATA_START;
              break;
            case S.PART_DATA_START:
              state = S.PART_DATA;
              mark("onPartData");
            case S.PART_DATA:
              previousIndex = index;
              if (index === 0) {
                i2 += boundaryEnd;
                while (i2 < bufferLength && !(data[i2] in boundaryChars)) {
                  i2 += boundaryLength;
                }
                i2 -= boundaryEnd;
                c = data[i2];
              }
              if (index < boundary.length) {
                if (boundary[index] === c) {
                  if (index === 0) {
                    dataCallback("onPartData", true);
                  }
                  index++;
                } else {
                  index = 0;
                }
              } else if (index === boundary.length) {
                index++;
                if (c === CR) {
                  flags |= F.PART_BOUNDARY;
                } else if (c === HYPHEN) {
                  flags |= F.LAST_BOUNDARY;
                } else {
                  index = 0;
                }
              } else if (index - 1 === boundary.length) {
                if (flags & F.PART_BOUNDARY) {
                  index = 0;
                  if (c === LF) {
                    flags &= ~F.PART_BOUNDARY;
                    callback("onPartEnd");
                    callback("onPartBegin");
                    state = S.HEADER_FIELD_START;
                    break;
                  }
                } else if (flags & F.LAST_BOUNDARY) {
                  if (c === HYPHEN) {
                    callback("onPartEnd");
                    state = S.END;
                    flags = 0;
                  } else {
                    index = 0;
                  }
                } else {
                  index = 0;
                }
              }
              if (index > 0) {
                lookbehind[index - 1] = c;
              } else if (previousIndex > 0) {
                const _lookbehind = new Uint8Array(lookbehind.buffer, lookbehind.byteOffset, lookbehind.byteLength);
                callback("onPartData", 0, previousIndex, _lookbehind);
                previousIndex = 0;
                mark("onPartData");
                i2--;
              }
              break;
            case S.END:
              break;
            default:
              throw new Error(`Unexpected state entered: ${state}`);
          }
        }
        dataCallback("onHeaderField");
        dataCallback("onHeaderValue");
        dataCallback("onPartData");
        this.index = index;
        this.state = state;
        this.flags = flags;
      }
      end() {
        if (this.state === S.HEADER_FIELD_START && this.index === 0 || this.state === S.PART_DATA && this.index === this.boundary.length) {
          this.onPartEnd();
        } else if (this.state !== S.END) {
          throw new Error("MultipartParser.end(): stream ended unexpectedly");
        }
      }
    };
  }
});

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
  for (let i2 = 1; i2 < meta.length; i2++) {
    if (meta[i2] === "base64") {
      base64 = true;
    } else {
      typeFull += `;${meta[i2]}`;
      if (meta[i2].indexOf("charset=") === 0) {
        charset = meta[i2].substring(8);
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
function formDataToBlob(F2, B = Blob$1) {
  var b = `${r()}${r()}`.replace(/\./g, "").slice(-28).padStart(32, "-"), c = [], p = `--${b}\r
Content-Disposition: form-data; name="`;
  F2.forEach((v, n) => typeof v == "string" ? c.push(p + e(n) + `"\r
\r
${v.replace(/\r(?!\n)|(?<!\r)\n/g, "\r\n")}\r
`) : c.push(p + e(n) + `"; filename="${e(v.name, 1)}"\r
Content-Type: ${v.type || "application/octet-stream"}\r
\r
`, v, "\r\n"));
  c.push(`--${b}--`);
  return new B(c, { type: "multipart/form-data; boundary=" + b });
}
async function consumeBody(data) {
  if (data[INTERNALS$2].disturbed) {
    throw new TypeError(`body used already for: ${data.url}`);
  }
  data[INTERNALS$2].disturbed = true;
  if (data[INTERNALS$2].error) {
    throw data[INTERNALS$2].error;
  }
  const { body } = data;
  if (body === null) {
    return Buffer.alloc(0);
  }
  if (!(body instanceof import_node_stream2.default)) {
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
function stripURLForUseAsAReferrer(url, originOnly = false) {
  if (url == null) {
    return "no-referrer";
  }
  url = new URL(url);
  if (/^(about|blob|data):$/.test(url.protocol)) {
    return "no-referrer";
  }
  url.username = "";
  url.password = "";
  url.hash = "";
  if (originOnly) {
    url.pathname = "";
    url.search = "";
  }
  return url;
}
function validateReferrerPolicy(referrerPolicy) {
  if (!ReferrerPolicy.has(referrerPolicy)) {
    throw new TypeError(`Invalid referrerPolicy: ${referrerPolicy}`);
  }
  return referrerPolicy;
}
function isOriginPotentiallyTrustworthy(url) {
  if (/^(http|ws)s:$/.test(url.protocol)) {
    return true;
  }
  const hostIp = url.host.replace(/(^\[)|(]$)/g, "");
  const hostIPVersion = (0, import_net2.isIP)(hostIp);
  if (hostIPVersion === 4 && /^127\./.test(hostIp)) {
    return true;
  }
  if (hostIPVersion === 6 && /^(((0+:){7})|(::(0+:){0,6}))0*1$/.test(hostIp)) {
    return true;
  }
  if (/^(.+\.)*localhost$/.test(url.host)) {
    return false;
  }
  if (url.protocol === "file:") {
    return true;
  }
  return false;
}
function isUrlPotentiallyTrustworthy(url) {
  if (/^about:(blank|srcdoc)$/.test(url)) {
    return true;
  }
  if (url.protocol === "data:") {
    return true;
  }
  if (/^(blob|filesystem):$/.test(url.protocol)) {
    return true;
  }
  return isOriginPotentiallyTrustworthy(url);
}
function determineRequestsReferrer(request, { referrerURLCallback, referrerOriginCallback } = {}) {
  if (request.referrer === "no-referrer" || request.referrerPolicy === "") {
    return null;
  }
  const policy = request.referrerPolicy;
  if (request.referrer === "about:client") {
    return "no-referrer";
  }
  const referrerSource = request.referrer;
  let referrerURL = stripURLForUseAsAReferrer(referrerSource);
  let referrerOrigin = stripURLForUseAsAReferrer(referrerSource, true);
  if (referrerURL.toString().length > 4096) {
    referrerURL = referrerOrigin;
  }
  if (referrerURLCallback) {
    referrerURL = referrerURLCallback(referrerURL);
  }
  if (referrerOriginCallback) {
    referrerOrigin = referrerOriginCallback(referrerOrigin);
  }
  const currentURL = new URL(request.url);
  switch (policy) {
    case "no-referrer":
      return "no-referrer";
    case "origin":
      return referrerOrigin;
    case "unsafe-url":
      return referrerURL;
    case "strict-origin":
      if (isUrlPotentiallyTrustworthy(referrerURL) && !isUrlPotentiallyTrustworthy(currentURL)) {
        return "no-referrer";
      }
      return referrerOrigin.toString();
    case "strict-origin-when-cross-origin":
      if (referrerURL.origin === currentURL.origin) {
        return referrerURL;
      }
      if (isUrlPotentiallyTrustworthy(referrerURL) && !isUrlPotentiallyTrustworthy(currentURL)) {
        return "no-referrer";
      }
      return referrerOrigin;
    case "same-origin":
      if (referrerURL.origin === currentURL.origin) {
        return referrerURL;
      }
      return "no-referrer";
    case "origin-when-cross-origin":
      if (referrerURL.origin === currentURL.origin) {
        return referrerURL;
      }
      return referrerOrigin;
    case "no-referrer-when-downgrade":
      if (isUrlPotentiallyTrustworthy(referrerURL) && !isUrlPotentiallyTrustworthy(currentURL)) {
        return "no-referrer";
      }
      return referrerURL;
    default:
      throw new TypeError(`Invalid referrerPolicy: ${policy}`);
  }
}
function parseReferrerPolicyFromHeader(headers) {
  const policyTokens = (headers.get("referrer-policy") || "").split(/[,\s]+/);
  let policy = "";
  for (const token of policyTokens) {
    if (token && ReferrerPolicy.has(token)) {
      policy = token;
    }
  }
  return policy;
}
async function fetch(url, options_) {
  return new Promise((resolve2, reject) => {
    const request = new Request(url, options_);
    const { parsedURL, options: options2 } = getNodeRequestOptions(request);
    if (!supportedSchemas.has(parsedURL.protocol)) {
      throw new TypeError(`node-fetch cannot load ${url}. URL scheme "${parsedURL.protocol.replace(/:$/, "")}" is not supported.`);
    }
    if (parsedURL.protocol === "data:") {
      const data = dataUriToBuffer(request.url);
      const response2 = new Response(data, { headers: { "Content-Type": data.typeFull } });
      resolve2(response2);
      return;
    }
    const send = (parsedURL.protocol === "https:" ? import_node_https2.default : import_node_http2.default).request;
    const { signal } = request;
    let response = null;
    const abort = () => {
      const error2 = new AbortError("The operation was aborted.");
      reject(error2);
      if (request.body && request.body instanceof import_node_stream2.default.Readable) {
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
    const request_ = send(parsedURL, options2);
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
      request_.on("socket", (s3) => {
        let endedWithEventsCount;
        s3.prependListener("end", () => {
          endedWithEventsCount = s3._eventsCount;
        });
        s3.prependListener("close", (hadError) => {
          if (response && endedWithEventsCount < s3._eventsCount && !hadError) {
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
              body: clone(request),
              signal: request.signal,
              size: request.size,
              referrer: request.referrer,
              referrerPolicy: request.referrerPolicy
            };
            if (response_.statusCode !== 303 && request.body && options_.body instanceof import_node_stream2.default.Readable) {
              reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
              finalize();
              return;
            }
            if (response_.statusCode === 303 || (response_.statusCode === 301 || response_.statusCode === 302) && request.method === "POST") {
              requestOptions.method = "GET";
              requestOptions.body = void 0;
              requestOptions.headers.delete("content-length");
            }
            const responseReferrerPolicy = parseReferrerPolicyFromHeader(headers);
            if (responseReferrerPolicy) {
              requestOptions.referrerPolicy = responseReferrerPolicy;
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
      let body = (0, import_node_stream2.pipeline)(response_, new import_node_stream2.PassThrough(), reject);
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
        flush: import_node_zlib2.default.Z_SYNC_FLUSH,
        finishFlush: import_node_zlib2.default.Z_SYNC_FLUSH
      };
      if (codings === "gzip" || codings === "x-gzip") {
        body = (0, import_node_stream2.pipeline)(body, import_node_zlib2.default.createGunzip(zlibOptions), reject);
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      if (codings === "deflate" || codings === "x-deflate") {
        const raw = (0, import_node_stream2.pipeline)(response_, new import_node_stream2.PassThrough(), reject);
        raw.once("data", (chunk) => {
          body = (chunk[0] & 15) === 8 ? (0, import_node_stream2.pipeline)(body, import_node_zlib2.default.createInflate(), reject) : (0, import_node_stream2.pipeline)(body, import_node_zlib2.default.createInflateRaw(), reject);
          response = new Response(body, responseOptions);
          resolve2(response);
        });
        return;
      }
      if (codings === "br") {
        body = (0, import_node_stream2.pipeline)(body, import_node_zlib2.default.createBrotliDecompress(), reject);
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
var import_node_http2, import_node_https2, import_node_zlib2, import_node_stream2, import_node_util2, import_node_url2, import_net2, commonjsGlobal, ponyfill_es2018, POOL_SIZE$1, POOL_SIZE, _Blob, Blob2, Blob$1, _File, File, t, i, h, r, m, f2, e, x, FormData, FetchBaseError, FetchError, NAME, isURLSearchParameters, isBlob, isAbortSignal, INTERNALS$2, Body, clone, getNonSpecFormDataBoundary, extractContentType, getTotalBytes, writeToStream, validateHeaderName, validateHeaderValue, Headers, redirectStatus, isRedirect, INTERNALS$1, Response, getSearch, ReferrerPolicy, DEFAULT_REFERRER_POLICY, INTERNALS, isRequest, Request, getNodeRequestOptions, AbortError, supportedSchemas;
var init_install_fetch = __esm({
  "node_modules/@sveltejs/kit/dist/install-fetch.js"() {
    init_shims();
    import_node_http2 = __toModule(require("node:http"));
    import_node_https2 = __toModule(require("node:https"));
    import_node_zlib2 = __toModule(require("node:zlib"));
    import_node_stream2 = __toModule(require("node:stream"));
    import_node_util2 = __toModule(require("node:util"));
    import_node_url2 = __toModule(require("node:url"));
    import_net2 = __toModule(require("net"));
    commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
    ponyfill_es2018 = { exports: {} };
    (function(module2, exports) {
      (function(global2, factory) {
        factory(exports);
      })(commonjsGlobal, function(exports2) {
        const SymbolPolyfill = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? Symbol : (description) => `Symbol(${description})`;
        function noop3() {
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
        function typeIsObject(x2) {
          return typeof x2 === "object" && x2 !== null || typeof x2 === "function";
        }
        const rethrowAssertionErrorRejection = noop3;
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
        function reflectCall(F2, V, args) {
          if (typeof F2 !== "function") {
            throw new TypeError("Argument is not a function");
          }
          return Function.prototype.apply.call(F2, V, args);
        }
        function promiseCall(F2, V, args) {
          try {
            return promiseResolvedWith(reflectCall(F2, V, args));
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
            let i2 = this._cursor;
            let node = this._front;
            let elements = node._elements;
            while (i2 !== elements.length || node._next !== void 0) {
              if (i2 === elements.length) {
                node = node._next;
                elements = node._elements;
                i2 = 0;
                if (elements.length === 0) {
                  break;
                }
              }
              callback(elements[i2]);
              ++i2;
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
        const NumberIsFinite = Number.isFinite || function(x2) {
          return typeof x2 === "number" && isFinite(x2);
        };
        const MathTrunc = Math.trunc || function(v) {
          return v < 0 ? Math.ceil(v) : Math.floor(v);
        };
        function isDictionary(x2) {
          return typeof x2 === "object" || typeof x2 === "function";
        }
        function assertDictionary(obj, context) {
          if (obj !== void 0 && !isDictionary(obj)) {
            throw new TypeError(`${context} is not an object.`);
          }
        }
        function assertFunction(x2, context) {
          if (typeof x2 !== "function") {
            throw new TypeError(`${context} is not a function.`);
          }
        }
        function isObject(x2) {
          return typeof x2 === "object" && x2 !== null || typeof x2 === "function";
        }
        function assertObject(x2, context) {
          if (!isObject(x2)) {
            throw new TypeError(`${context} is not an object.`);
          }
        }
        function assertRequiredArgument(x2, position, context) {
          if (x2 === void 0) {
            throw new TypeError(`Parameter ${position} is required in '${context}'.`);
          }
        }
        function assertRequiredField(x2, field, context) {
          if (x2 === void 0) {
            throw new TypeError(`${field} is required in '${context}'.`);
          }
        }
        function convertUnrestrictedDouble(value) {
          return Number(value);
        }
        function censorNegativeZero(x2) {
          return x2 === 0 ? 0 : x2;
        }
        function integerPart(x2) {
          return censorNegativeZero(MathTrunc(x2));
        }
        function convertUnsignedLongLongWithEnforceRange(value, context) {
          const lowerBound = 0;
          const upperBound = Number.MAX_SAFE_INTEGER;
          let x2 = Number(value);
          x2 = censorNegativeZero(x2);
          if (!NumberIsFinite(x2)) {
            throw new TypeError(`${context} is not a finite number`);
          }
          x2 = integerPart(x2);
          if (x2 < lowerBound || x2 > upperBound) {
            throw new TypeError(`${context} is outside the accepted range of ${lowerBound} to ${upperBound}, inclusive`);
          }
          if (!NumberIsFinite(x2) || x2 === 0) {
            return 0;
          }
          return x2;
        }
        function assertReadableStream(x2, context) {
          if (!IsReadableStream(x2)) {
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
              _errorSteps: (e2) => rejectPromise(e2)
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
        function IsReadableStreamDefaultReader(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_readRequests")) {
            return false;
          }
          return x2 instanceof ReadableStreamDefaultReader;
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
        function IsReadableStreamAsyncIterator(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_asyncIteratorImpl")) {
            return false;
          }
          try {
            return x2._asyncIteratorImpl instanceof ReadableStreamAsyncIteratorImpl;
          } catch (_a) {
            return false;
          }
        }
        function streamAsyncIteratorBrandCheckException(name) {
          return new TypeError(`ReadableStreamAsyncIterator.${name} can only be used on a ReadableSteamAsyncIterator`);
        }
        const NumberIsNaN = Number.isNaN || function(x2) {
          return x2 !== x2;
        };
        function CreateArrayFromList(elements) {
          return elements.slice();
        }
        function CopyDataBlockBytes(dest, destOffset, src, srcOffset, n) {
          new Uint8Array(dest).set(new Uint8Array(src, srcOffset, n), destOffset);
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
          error(e2 = void 0) {
            if (!IsReadableByteStreamController(this)) {
              throw byteStreamControllerBrandCheckException("error");
            }
            ReadableByteStreamControllerError(this, e2);
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
        function IsReadableByteStreamController(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_controlledReadableByteStream")) {
            return false;
          }
          return x2 instanceof ReadableByteStreamController;
        }
        function IsReadableStreamBYOBRequest(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_associatedReadableByteStreamController")) {
            return false;
          }
          return x2 instanceof ReadableStreamBYOBRequest;
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
          }, (e2) => {
            ReadableByteStreamControllerError(controller, e2);
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
              const e2 = new TypeError("Insufficient bytes to fill elements in the given buffer");
              ReadableByteStreamControllerError(controller, e2);
              readIntoRequest._errorSteps(e2);
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
              const e2 = new TypeError("Insufficient bytes to fill elements in the given buffer");
              ReadableByteStreamControllerError(controller, e2);
              throw e2;
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
              if (controller._pendingPullIntos.length > 0) {
                ReadableByteStreamControllerShiftPendingPullInto(controller);
              }
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
        function ReadableByteStreamControllerError(controller, e2) {
          const stream = controller._controlledReadableByteStream;
          if (stream._state !== "readable") {
            return;
          }
          ReadableByteStreamControllerClearPendingPullIntos(controller);
          ResetQueue(controller);
          ReadableByteStreamControllerClearAlgorithms(controller);
          ReadableStreamError(stream, e2);
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
          const viewByteLength = view.byteLength;
          firstDescriptor.buffer = TransferArrayBuffer(view.buffer);
          ReadableByteStreamControllerRespondInternal(controller, viewByteLength);
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
          }, (r2) => {
            ReadableByteStreamControllerError(controller, r2);
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
              _errorSteps: (e2) => rejectPromise(e2)
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
        function IsReadableStreamBYOBReader(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_readIntoRequests")) {
            return false;
          }
          return x2 instanceof ReadableStreamBYOBReader;
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
        function assertWritableStream(x2, context) {
          if (!IsWritableStream(x2)) {
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
        function IsWritableStream(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_writableStreamController")) {
            return false;
          }
          return x2 instanceof WritableStream;
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
        function IsWritableStreamDefaultWriter(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_ownerWritableStream")) {
            return false;
          }
          return x2 instanceof WritableStreamDefaultWriter;
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
          error(e2 = void 0) {
            if (!IsWritableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$2("error");
            }
            const state = this._controlledWritableStream._state;
            if (state !== "writable") {
              return;
            }
            WritableStreamDefaultControllerError(this, e2);
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
          abortReason: { enumerable: true },
          signal: { enumerable: true },
          error: { enumerable: true }
        });
        if (typeof SymbolPolyfill.toStringTag === "symbol") {
          Object.defineProperty(WritableStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
            value: "WritableStreamDefaultController",
            configurable: true
          });
        }
        function IsWritableStreamDefaultController(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_controlledWritableStream")) {
            return false;
          }
          return x2 instanceof WritableStreamDefaultController;
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
          }, (r2) => {
            controller._started = true;
            WritableStreamDealWithRejection(stream, r2);
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
                      currentWrite = PerformPromiseThen(WritableStreamDefaultWriterWrite(writer, chunk), void 0, noop3);
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
          error(e2 = void 0) {
            if (!IsReadableStreamDefaultController(this)) {
              throw defaultControllerBrandCheckException$1("error");
            }
            ReadableStreamDefaultControllerError(this, e2);
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
        function IsReadableStreamDefaultController(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_controlledReadableStream")) {
            return false;
          }
          return x2 instanceof ReadableStreamDefaultController;
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
          }, (e2) => {
            ReadableStreamDefaultControllerError(controller, e2);
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
        function ReadableStreamDefaultControllerError(controller, e2) {
          const stream = controller._controlledReadableStream;
          if (stream._state !== "readable") {
            return;
          }
          ResetQueue(controller);
          ReadableStreamDefaultControllerClearAlgorithms(controller);
          ReadableStreamError(stream, e2);
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
          }, (r2) => {
            ReadableStreamDefaultControllerError(controller, r2);
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
          let readAgain = false;
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
              readAgain = true;
              return promiseResolvedWith(void 0);
            }
            reading = true;
            const readRequest = {
              _chunkSteps: (chunk) => {
                queueMicrotask(() => {
                  readAgain = false;
                  const chunk1 = chunk;
                  const chunk2 = chunk;
                  if (!canceled1) {
                    ReadableStreamDefaultControllerEnqueue(branch1._readableStreamController, chunk1);
                  }
                  if (!canceled2) {
                    ReadableStreamDefaultControllerEnqueue(branch2._readableStreamController, chunk2);
                  }
                  reading = false;
                  if (readAgain) {
                    pullAlgorithm();
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
          uponRejection(reader._closedPromise, (r2) => {
            ReadableStreamDefaultControllerError(branch1._readableStreamController, r2);
            ReadableStreamDefaultControllerError(branch2._readableStreamController, r2);
            if (!canceled1 || !canceled2) {
              resolveCancelPromise(void 0);
            }
          });
          return [branch1, branch2];
        }
        function ReadableByteStreamTee(stream) {
          let reader = AcquireReadableStreamDefaultReader(stream);
          let reading = false;
          let readAgainForBranch1 = false;
          let readAgainForBranch2 = false;
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
            uponRejection(thisReader._closedPromise, (r2) => {
              if (thisReader !== reader) {
                return;
              }
              ReadableByteStreamControllerError(branch1._readableStreamController, r2);
              ReadableByteStreamControllerError(branch2._readableStreamController, r2);
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
                  readAgainForBranch1 = false;
                  readAgainForBranch2 = false;
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
                  reading = false;
                  if (readAgainForBranch1) {
                    pull1Algorithm();
                  } else if (readAgainForBranch2) {
                    pull2Algorithm();
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
                  readAgainForBranch1 = false;
                  readAgainForBranch2 = false;
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
                  reading = false;
                  if (readAgainForBranch1) {
                    pull1Algorithm();
                  } else if (readAgainForBranch2) {
                    pull2Algorithm();
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
              readAgainForBranch1 = true;
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
              readAgainForBranch2 = true;
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
            } catch (e2) {
              return promiseRejectedWith(e2);
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
        function IsReadableStream(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_readableStreamController")) {
            return false;
          }
          return x2 instanceof ReadableStream2;
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
          return transformPromiseWith(sourceCancelPromise, noop3);
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
        function ReadableStreamError(stream, e2) {
          stream._state = "errored";
          stream._storedError = e2;
          const reader = stream._reader;
          if (reader === void 0) {
            return;
          }
          defaultReaderClosedPromiseReject(reader, e2);
          if (IsReadableStreamDefaultReader(reader)) {
            reader._readRequests.forEach((readRequest) => {
              readRequest._errorSteps(e2);
            });
            reader._readRequests = new SimpleQueue();
          } else {
            reader._readIntoRequests.forEach((readIntoRequest) => {
              readIntoRequest._errorSteps(e2);
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
        function IsByteLengthQueuingStrategy(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_byteLengthQueuingStrategyHighWaterMark")) {
            return false;
          }
          return x2 instanceof ByteLengthQueuingStrategy;
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
        function IsCountQueuingStrategy(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_countQueuingStrategyHighWaterMark")) {
            return false;
          }
          return x2 instanceof CountQueuingStrategy;
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
        function IsTransformStream(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_transformStreamController")) {
            return false;
          }
          return x2 instanceof TransformStream;
        }
        function TransformStreamError(stream, e2) {
          ReadableStreamDefaultControllerError(stream._readable._readableStreamController, e2);
          TransformStreamErrorWritableAndUnblockWrite(stream, e2);
        }
        function TransformStreamErrorWritableAndUnblockWrite(stream, e2) {
          TransformStreamDefaultControllerClearAlgorithms(stream._transformStreamController);
          WritableStreamDefaultControllerErrorIfNeeded(stream._writable._writableStreamController, e2);
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
        function IsTransformStreamDefaultController(x2) {
          if (!typeIsObject(x2)) {
            return false;
          }
          if (!Object.prototype.hasOwnProperty.call(x2, "_controlledTransformStream")) {
            return false;
          }
          return x2 instanceof TransformStreamDefaultController;
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
          } catch (e2) {
            TransformStreamErrorWritableAndUnblockWrite(stream, e2);
            throw stream._readable._storedError;
          }
          const backpressure = ReadableStreamDefaultControllerHasBackpressure(readableController);
          if (backpressure !== stream._backpressure) {
            TransformStreamSetBackpressure(stream, true);
          }
        }
        function TransformStreamDefaultControllerError(controller, e2) {
          TransformStreamError(controller._controlledTransformStream, e2);
        }
        function TransformStreamDefaultControllerPerformTransform(controller, chunk) {
          const transformPromise = controller._transformAlgorithm(chunk);
          return transformPromiseWith(transformPromise, void 0, (r2) => {
            TransformStreamError(controller._controlledTransformStream, r2);
            throw r2;
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
          }, (r2) => {
            TransformStreamError(stream, r2);
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
    _File = class File2 extends Blob$1 {
      #lastModified = 0;
      #name = "";
      constructor(fileBits, fileName, options2 = {}) {
        if (arguments.length < 2) {
          throw new TypeError(`Failed to construct 'File': 2 arguments required, but only ${arguments.length} present.`);
        }
        super(fileBits, options2);
        if (options2 === null)
          options2 = {};
        const lastModified = options2.lastModified === void 0 ? Date.now() : Number(options2.lastModified);
        if (!Number.isNaN(lastModified)) {
          this.#lastModified = lastModified;
        }
        this.#name = String(fileName);
      }
      get name() {
        return this.#name;
      }
      get lastModified() {
        return this.#lastModified;
      }
      get [Symbol.toStringTag]() {
        return "File";
      }
    };
    File = _File;
    ({ toStringTag: t, iterator: i, hasInstance: h } = Symbol);
    r = Math.random;
    m = "append,set,get,getAll,delete,keys,values,entries,forEach,constructor".split(",");
    f2 = (a, b, c) => (a += "", /^(Blob|File)$/.test(b && b[t]) ? [(c = c !== void 0 ? c + "" : b[t] == "File" ? b.name : "blob", a), b.name !== c || b[t] == "blob" ? new File([b], c, b) : b] : [a, b + ""]);
    e = (c, f3) => (f3 ? c : c.replace(/\r?\n|\r/g, "\r\n")).replace(/\n/g, "%0A").replace(/\r/g, "%0D").replace(/"/g, "%22");
    x = (n, a, e2) => {
      if (a.length < e2) {
        throw new TypeError(`Failed to execute '${n}' on 'FormData': ${e2} arguments required, but only ${a.length} present.`);
      }
    };
    FormData = class FormData2 {
      #d = [];
      constructor(...a) {
        if (a.length)
          throw new TypeError(`Failed to construct 'FormData': parameter 1 is not of type 'HTMLFormElement'.`);
      }
      get [t]() {
        return "FormData";
      }
      [i]() {
        return this.entries();
      }
      static [h](o) {
        return o && typeof o === "object" && o[t] === "FormData" && !m.some((m2) => typeof o[m2] != "function");
      }
      append(...a) {
        x("append", arguments, 2);
        this.#d.push(f2(...a));
      }
      delete(a) {
        x("delete", arguments, 1);
        a += "";
        this.#d = this.#d.filter(([b]) => b !== a);
      }
      get(a) {
        x("get", arguments, 1);
        a += "";
        for (var b = this.#d, l = b.length, c = 0; c < l; c++)
          if (b[c][0] === a)
            return b[c][1];
        return null;
      }
      getAll(a, b) {
        x("getAll", arguments, 1);
        b = [];
        a += "";
        this.#d.forEach((c) => c[0] === a && b.push(c[1]));
        return b;
      }
      has(a) {
        x("has", arguments, 1);
        a += "";
        return this.#d.some((b) => b[0] === a);
      }
      forEach(a, b) {
        x("forEach", arguments, 1);
        for (var [c, d] of this)
          a.call(b, d, c, this);
      }
      set(...a) {
        x("set", arguments, 2);
        var b = [], c = true;
        a = f2(...a);
        this.#d.forEach((d) => {
          d[0] === a[0] ? c && (c = !b.push(a)) : b.push(d);
        });
        c && b.push(a);
        this.#d = b;
      }
      *entries() {
        yield* this.#d;
      }
      *keys() {
        for (var [a] of this)
          yield a;
      }
      *values() {
        for (var [, a] of this)
          yield a;
      }
    };
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
      return object && typeof object === "object" && typeof object.arrayBuffer === "function" && typeof object.type === "string" && typeof object.stream === "function" && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[NAME]);
    };
    isAbortSignal = (object) => {
      return typeof object === "object" && (object[NAME] === "AbortSignal" || object[NAME] === "EventTarget");
    };
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
        else if (import_node_util2.types.isAnyArrayBuffer(body)) {
          body = Buffer.from(body);
        } else if (ArrayBuffer.isView(body)) {
          body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
        } else if (body instanceof import_node_stream2.default)
          ;
        else if (body instanceof FormData) {
          body = formDataToBlob(body);
          boundary = body.type.split("=")[1];
        } else {
          body = Buffer.from(String(body));
        }
        let stream = body;
        if (Buffer.isBuffer(body)) {
          stream = import_node_stream2.default.Readable.from(body);
        } else if (isBlob(body)) {
          stream = import_node_stream2.default.Readable.from(body.stream());
        }
        this[INTERNALS$2] = {
          body,
          stream,
          boundary,
          disturbed: false,
          error: null
        };
        this.size = size;
        if (body instanceof import_node_stream2.default) {
          body.on("error", (error_) => {
            const error2 = error_ instanceof FetchBaseError ? error_ : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${error_.message}`, "system", error_);
            this[INTERNALS$2].error = error2;
          });
        }
      }
      get body() {
        return this[INTERNALS$2].stream;
      }
      get bodyUsed() {
        return this[INTERNALS$2].disturbed;
      }
      async arrayBuffer() {
        const { buffer, byteOffset, byteLength } = await consumeBody(this);
        return buffer.slice(byteOffset, byteOffset + byteLength);
      }
      async formData() {
        const ct = this.headers.get("content-type");
        if (ct.startsWith("application/x-www-form-urlencoded")) {
          const formData = new FormData();
          const parameters = new URLSearchParams(await this.text());
          for (const [name, value] of parameters) {
            formData.append(name, value);
          }
          return formData;
        }
        const { toFormData: toFormData2 } = await Promise.resolve().then(() => (init_multipart_parser(), multipart_parser_exports));
        return toFormData2(this.body, ct);
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
    Body.prototype.buffer = (0, import_node_util2.deprecate)(Body.prototype.buffer, "Please use 'response.arrayBuffer()' instead of 'response.buffer()'", "node-fetch#buffer");
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
      let { body } = instance[INTERNALS$2];
      if (instance.bodyUsed) {
        throw new Error("cannot clone body after it is used");
      }
      if (body instanceof import_node_stream2.default && typeof body.getBoundary !== "function") {
        p1 = new import_node_stream2.PassThrough({ highWaterMark });
        p2 = new import_node_stream2.PassThrough({ highWaterMark });
        body.pipe(p1);
        body.pipe(p2);
        instance[INTERNALS$2].stream = p1;
        body = p2;
      }
      return body;
    };
    getNonSpecFormDataBoundary = (0, import_node_util2.deprecate)((body) => body.getBoundary(), "form-data doesn't follow the spec and requires special treatment. Use alternative package", "https://github.com/node-fetch/node-fetch/issues/1167");
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
      if (Buffer.isBuffer(body) || import_node_util2.types.isAnyArrayBuffer(body) || ArrayBuffer.isView(body)) {
        return null;
      }
      if (body instanceof FormData) {
        return `multipart/form-data; boundary=${request[INTERNALS$2].boundary}`;
      }
      if (body && typeof body.getBoundary === "function") {
        return `multipart/form-data;boundary=${getNonSpecFormDataBoundary(body)}`;
      }
      if (body instanceof import_node_stream2.default) {
        return null;
      }
      return "text/plain;charset=UTF-8";
    };
    getTotalBytes = (request) => {
      const { body } = request[INTERNALS$2];
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
      return null;
    };
    writeToStream = (dest, { body }) => {
      if (body === null) {
        dest.end();
      } else {
        body.pipe(dest);
      }
    };
    validateHeaderName = typeof import_node_http2.default.validateHeaderName === "function" ? import_node_http2.default.validateHeaderName : (name) => {
      if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
        const error2 = new TypeError(`Header name must be a valid HTTP token [${name}]`);
        Object.defineProperty(error2, "code", { value: "ERR_INVALID_HTTP_TOKEN" });
        throw error2;
      }
    };
    validateHeaderValue = typeof import_node_http2.default.validateHeaderValue === "function" ? import_node_http2.default.validateHeaderValue : (name, value) => {
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
        else if (typeof init2 === "object" && !import_node_util2.types.isBoxedPrimitive(init2)) {
          const method = init2[Symbol.iterator];
          if (method == null) {
            result.push(...Object.entries(init2));
          } else {
            if (typeof method !== "function") {
              throw new TypeError("Header pairs must be iterable");
            }
            result = [...init2].map((pair) => {
              if (typeof pair !== "object" || import_node_util2.types.isBoxedPrimitive(pair)) {
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
          const contentType = extractContentType(body, this);
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
          size: this.size,
          highWaterMark: this.highWaterMark
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
    ReferrerPolicy = new Set([
      "",
      "no-referrer",
      "no-referrer-when-downgrade",
      "same-origin",
      "origin",
      "strict-origin",
      "origin-when-cross-origin",
      "strict-origin-when-cross-origin",
      "unsafe-url"
    ]);
    DEFAULT_REFERRER_POLICY = "strict-origin-when-cross-origin";
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
        if (parsedURL.username !== "" || parsedURL.password !== "") {
          throw new TypeError(`${parsedURL} is an url with embedded credentails.`);
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
            headers.set("Content-Type", contentType);
          }
        }
        let signal = isRequest(input) ? input.signal : null;
        if ("signal" in init2) {
          signal = init2.signal;
        }
        if (signal != null && !isAbortSignal(signal)) {
          throw new TypeError("Expected signal to be an instanceof AbortSignal or EventTarget");
        }
        let referrer = init2.referrer == null ? input.referrer : init2.referrer;
        if (referrer === "") {
          referrer = "no-referrer";
        } else if (referrer) {
          const parsedReferrer = new URL(referrer);
          referrer = /^about:(\/\/)?client$/.test(parsedReferrer) ? "client" : parsedReferrer;
        } else {
          referrer = void 0;
        }
        this[INTERNALS] = {
          method,
          redirect: init2.redirect || input.redirect || "follow",
          headers,
          parsedURL,
          signal,
          referrer
        };
        this.follow = init2.follow === void 0 ? input.follow === void 0 ? 20 : input.follow : init2.follow;
        this.compress = init2.compress === void 0 ? input.compress === void 0 ? true : input.compress : init2.compress;
        this.counter = init2.counter || input.counter || 0;
        this.agent = init2.agent || input.agent;
        this.highWaterMark = init2.highWaterMark || input.highWaterMark || 16384;
        this.insecureHTTPParser = init2.insecureHTTPParser || input.insecureHTTPParser || false;
        this.referrerPolicy = init2.referrerPolicy || input.referrerPolicy || "";
      }
      get method() {
        return this[INTERNALS].method;
      }
      get url() {
        return (0, import_node_url2.format)(this[INTERNALS].parsedURL);
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
      get referrer() {
        if (this[INTERNALS].referrer === "no-referrer") {
          return "";
        }
        if (this[INTERNALS].referrer === "client") {
          return "about:client";
        }
        if (this[INTERNALS].referrer) {
          return this[INTERNALS].referrer.toString();
        }
        return void 0;
      }
      get referrerPolicy() {
        return this[INTERNALS].referrerPolicy;
      }
      set referrerPolicy(referrerPolicy) {
        this[INTERNALS].referrerPolicy = validateReferrerPolicy(referrerPolicy);
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
      signal: { enumerable: true },
      referrer: { enumerable: true },
      referrerPolicy: { enumerable: true }
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
      if (request.referrerPolicy === "") {
        request.referrerPolicy = DEFAULT_REFERRER_POLICY;
      }
      if (request.referrer && request.referrer !== "no-referrer") {
        request[INTERNALS].referrer = determineRequestsReferrer(request);
      } else {
        request[INTERNALS].referrer = "no-referrer";
      }
      if (request[INTERNALS].referrer instanceof URL) {
        headers.set("Referer", request.referrer);
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
      const options2 = {
        path: parsedURL.pathname + search,
        method: request.method,
        headers: headers[Symbol.for("nodejs.util.inspect.custom")](),
        insecureHTTPParser: request.insecureHTTPParser,
        agent
      };
      return {
        parsedURL,
        options: options2
      };
    };
    AbortError = class extends FetchBaseError {
      constructor(message, type = "aborted") {
        super(message, type);
      }
    };
    supportedSchemas = new Set(["data:", "http:", "https:"]);
  }
});

// node_modules/@sveltejs/adapter-vercel/files/shims.js
var init_shims = __esm({
  "node_modules/@sveltejs/adapter-vercel/files/shims.js"() {
    init_install_fetch();
  }
});

// node_modules/@sveltejs/kit/dist/chunks/url.js
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
  for (let i2 = 0; i2 < pathparts.length; i2 += 1) {
    const part = pathparts[i2];
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
var absolute, scheme;
var init_url = __esm({
  "node_modules/@sveltejs/kit/dist/chunks/url.js"() {
    init_shims();
    absolute = /^([a-z]+:)?\/?\//;
    scheme = /^[a-z]+:/;
  }
});

// node_modules/@sveltejs/kit/dist/chunks/error.js
function coalesce_to_error(err) {
  return err instanceof Error || err && err.name && err.message ? err : new Error(JSON.stringify(err));
}
var init_error = __esm({
  "node_modules/@sveltejs/kit/dist/chunks/error.js"() {
    init_shims();
  }
});

// node_modules/@sveltejs/kit/dist/ssr.js
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
function is_string(s3) {
  return typeof s3 === "string" || s3 instanceof String;
}
function is_content_type_textual(content_type) {
  if (!content_type)
    return true;
  const [type] = content_type.split(";");
  return type === "text/plain" || type === "application/json" || type === "application/x-www-form-urlencoded" || type === "multipart/form-data";
}
async function render_endpoint(request, route, match) {
  const mod = await route.load();
  const handler = mod[request.method.toLowerCase().replace("delete", "del")];
  if (!handler) {
    return;
  }
  const params = route.params(match);
  const response = await handler({ ...request, params });
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
  }).forEach(function(entry, i2) {
    names.set(entry[0], getName(i2));
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
        var members = thing.map(function(v, i2) {
          return i2 in thing ? stringify(v) : "";
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
          thing.forEach(function(v, i2) {
            statements_1.push(name + "[" + i2 + "]=" + stringify(v));
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
  return escaped[c] || c;
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
  for (var i2 = 0; i2 < str.length; i2 += 1) {
    var char = str.charAt(i2);
    var code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped) {
      result += escaped[char];
    } else if (code >= 55296 && code <= 57343) {
      var next = str.charCodeAt(i2 + 1);
      if (code <= 56319 && (next >= 56320 && next <= 57343)) {
        result += char + str[++i2];
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
function noop2() {
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
function writable(value, start = noop2) {
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
          for (let i2 = 0; i2 < subscriber_queue.length; i2 += 2) {
            subscriber_queue[i2][0](subscriber_queue[i2 + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe(run2, invalidate = noop2) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop2;
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
  let i2 = value.length;
  if (typeof value === "string") {
    while (i2)
      hash2 = hash2 * 33 ^ value.charCodeAt(--i2);
  } else {
    while (i2)
      hash2 = hash2 * 33 ^ value[--i2];
  }
  return (hash2 >>> 0).toString(36);
}
function escape_json_string_in_html(str) {
  return escape(str, escape_json_string_in_html_dict, (code) => `\\u${code.toString(16).toUpperCase()}`);
}
function escape_html_attr(str) {
  return '"' + escape(str, escape_html_attr_dict, (code) => `&#${code};`) + '"';
}
function escape(str, dict, unicode_encoder) {
  let result = "";
  for (let i2 = 0; i2 < str.length; i2 += 1) {
    const char = str.charAt(i2);
    const code = char.charCodeAt(0);
    if (char in dict) {
      result += dict[char];
    } else if (code >= 55296 && code <= 57343) {
      const next = str.charCodeAt(i2 + 1);
      if (code <= 56319 && next >= 56320 && next <= 57343) {
        result += char + str[++i2];
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
  const css36 = new Set(options2.entry.css);
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
        node.css.forEach((url) => css36.add(url));
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
    for (let i2 = 0; i2 < branch.length; i2 += 1) {
      props[`props_${i2}`] = await branch[i2].loaded.props;
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
    ...Array.from(css36).map((dep) => `<link rel="stylesheet" href="${dep}">`)
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
                    json: `{"status":${response2.status},"statusText":${s2(response2.statusText)},"headers":${s2(headers)},"body":"${escape_json_string_in_html(body)}"}`
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
      for (let i2 = 0; i2 < nodes.length; i2 += 1) {
        const node = nodes[i2];
        let loaded;
        if (node) {
          try {
            loaded = await load_node({
              ...opts,
              node,
              stuff,
              prerender_enabled: is_prerender_enabled(options2, node, state),
              is_leaf: i2 === nodes.length - 1,
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
            const e2 = coalesce_to_error(err);
            options2.handle_error(e2, request);
            status = 500;
            error2 = e2;
          }
          if (loaded && !error2) {
            branch.push(loaded);
          }
          if (error2) {
            while (i2--) {
              if (route.b[i2]) {
                const error_node = await options2.load_component(route.b[i2]);
                let node_loaded;
                let j = i2;
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
                  const e2 = coalesce_to_error(err);
                  options2.handle_error(e2, request);
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
    const e2 = coalesce_to_error(err);
    options2.handle_error(e2, request);
    return {
      status: 500,
      headers: {},
      body: options2.dev ? e2.stack : e2.message
    };
  }
}
var chars, unsafeChars, reserved, escaped, objectProtoOwnPropertyNames, subscriber_queue, escape_json_string_in_html_dict, escape_html_attr_dict, s$1, s2, ReadOnlyFormData;
var init_ssr = __esm({
  "node_modules/@sveltejs/kit/dist/ssr.js"() {
    init_shims();
    init_url();
    init_error();
    chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
    unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
    reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
    escaped = {
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
    s2 = JSON.stringify;
    ReadOnlyFormData = class {
      #map;
      constructor(map) {
        this.#map = map;
      }
      get(key) {
        const value = this.#map.get(key);
        return value && value[0];
      }
      getAll(key) {
        return this.#map.get(key);
      }
      has(key) {
        return this.#map.has(key);
      }
      *[Symbol.iterator]() {
        for (const [key, value] of this.#map) {
          for (let i2 = 0; i2 < value.length; i2 += 1) {
            yield [key, value[i2]];
          }
        }
      }
      *entries() {
        for (const [key, value] of this.#map) {
          for (let i2 = 0; i2 < value.length; i2 += 1) {
            yield [key, value[i2]];
          }
        }
      }
      *keys() {
        for (const [key] of this.#map)
          yield key;
      }
      *values() {
        for (const [, value] of this.#map) {
          for (let i2 = 0; i2 < value.length; i2 += 1) {
            yield value[i2];
          }
        }
      }
    };
  }
});

// .svelte-kit/output/server/chunks/__layout-312b2647.js
var layout_312b2647_exports = {};
__export(layout_312b2647_exports, {
  default: () => _layout
});
var css$9, Nav, css$8, TheFooter, css$7, Australasia, css$6, Caribbean, css$5, Europe, css$4, Jewish, css$3, Northamerica, css$2, General, css$1, Dropdown, Googletag, css, _layout;
var init_layout_312b2647 = __esm({
  ".svelte-kit/output/server/chunks/__layout-312b2647.js"() {
    init_shims();
    init_app_412ff39b();
    init_ssr();
    css$9 = {
      code: ".bg-teal-500.svelte-j03ddw{--tw-bg-opacity:1;background-color:rgba(20, 184, 166, var(--tw-bg-opacity))}.grid.svelte-j03ddw{display:-ms-grid;display:grid}.h-10.svelte-j03ddw{height:2.5rem}.text-4xl.svelte-j03ddw{font-size:2.25rem;line-height:2.5rem}.m-2.svelte-j03ddw{margin:0.5rem}.p-4.svelte-j03ddw{padding:1rem}.text-gray-200.svelte-j03ddw{--tw-text-opacity:1;color:rgba(229, 231, 235, var(--tw-text-opacity))}.gap-4.svelte-j03ddw{grid-gap:1rem;gap:1rem}.grid-cols-3.svelte-j03ddw{grid-template-columns:repeat(3, minmax(0, 1fr))}",
      map: null
    };
    Nav = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$9);
      return `<nav class="${"text-4xl bg-teal-500 text-gray-200 p-4 svelte-j03ddw"}"><div class="${"grid grid-cols-3 gap-4 svelte-j03ddw"}"><div><a href="${"/"}"><img class="${"h-10 m-2 svelte-j03ddw"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/v1638876068/webp/logo.webp"}" alt="${"logo"}"></a></div>
		<div>Family History Tips</div>
		<div></div></div>
</nav>`;
    });
    css$8 = {
      code: ".bg-teal-500.svelte-oqpr3a{--tw-bg-opacity:1;background-color:rgba(20, 184, 166, var(--tw-bg-opacity))}.inline-flex.svelte-oqpr3a{display:-webkit-inline-box;display:-ms-inline-flexbox;display:-webkit-inline-flex;display:inline-flex}.h-8.svelte-oqpr3a{height:2rem}.text-xl.svelte-oqpr3a{font-size:1.25rem;line-height:1.75rem}.m-2.svelte-oqpr3a{margin:0.5rem}.mt-16.svelte-oqpr3a{margin-top:4rem}.p-4.svelte-oqpr3a{padding:1rem}.text-left.svelte-oqpr3a{text-align:left}.text-gray-700.svelte-oqpr3a{--tw-text-opacity:1;color:rgba(55, 65, 81, var(--tw-text-opacity))}",
      map: null
    };
    TheFooter = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$8);
      return `<footer class="${"text-left bg-teal-500 p-4 mt-16 svelte-oqpr3a"}"><div class="${"inline-flex svelte-oqpr3a"}"><h3 class="${"text-left text-gray-700 text-xl svelte-oqpr3a"}">\xA9 2021 Family History</h3>

		<a href="${"http://bit.ly/3nS0tUP"}" target="${"_blank"}"><img class="${"h-8 m-2 svelte-oqpr3a"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_200/v1638876618/webp/youtube.webp"}" alt="${"youtube"}"></a>

		<a href="${"https://bit.ly/3qdBL54"}" target="${"_blank"}"><img class="${"h-8 m-2 svelte-oqpr3a"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_200/v1638876319/webp/facebook.webp"}" alt="${"facebook"}"></a></div>
</footer>`;
    });
    css$7 = {
      code: "li>button.svelte-o01mag svg.svelte-o01mag{transform:rotate(-90deg)}li:hover>button.svelte-o01mag svg.svelte-o01mag{transform:rotate(-270deg)}.group.svelte-o01mag:hover .group-hover\\:scale-100.svelte-o01mag{transform:scale(1)}.group.svelte-o01mag:hover .group-hover\\:-rotate-180.svelte-o01mag{transform:rotate(180deg)}.scale-0.svelte-o01mag.svelte-o01mag{transform:scale(0)}.min-w-32.svelte-o01mag.svelte-o01mag{min-width:8rem}.bg-white.svelte-o01mag.svelte-o01mag{--tw-bg-opacity:1;background-color:rgba(255, 255, 255, var(--tw-bg-opacity))}.hover\\:bg-gray-100.svelte-o01mag.svelte-o01mag:hover{--tw-bg-opacity:1;background-color:rgba(243, 244, 246, var(--tw-bg-opacity))}.rounded-sm.svelte-o01mag.svelte-o01mag{border-radius:0.125rem}.border.svelte-o01mag.svelte-o01mag{border-width:1px}.inline-block.svelte-o01mag.svelte-o01mag{display:inline-block}.flex.svelte-o01mag.svelte-o01mag{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}.items-center.svelte-o01mag.svelte-o01mag{-webkit-box-align:center;-ms-flex-align:center;-webkit-align-items:center;align-items:center}.flex-1.svelte-o01mag.svelte-o01mag{-webkit-box-flex:1;-ms-flex:1 1 0%;-webkit-flex:1 1 0%;flex:1 1 0%}.font-semibold.svelte-o01mag.svelte-o01mag{font-weight:600}.h-4.svelte-o01mag.svelte-o01mag{height:1rem}.min-w-32.svelte-o01mag.svelte-o01mag{min-width:8rem}.outline-none.svelte-o01mag.svelte-o01mag{outline:2px solid transparent;outline-offset:2px}.focus\\:outline-none.svelte-o01mag.svelte-o01mag:focus{outline:2px solid transparent;outline-offset:2px}.px-3.svelte-o01mag.svelte-o01mag{padding-left:0.75rem;padding-right:0.75rem}.py-1.svelte-o01mag.svelte-o01mag{padding-top:0.25rem;padding-bottom:0.25rem}.pr-1.svelte-o01mag.svelte-o01mag{padding-right:0.25rem}.absolute.svelte-o01mag.svelte-o01mag{position:absolute}.fill-current.svelte-o01mag.svelte-o01mag{fill:currentColor}.text-gray-700.svelte-o01mag.svelte-o01mag{--tw-text-opacity:1;color:rgba(55, 65, 81, var(--tw-text-opacity))}.text-gray-900.svelte-o01mag.svelte-o01mag{--tw-text-opacity:1;color:rgba(17, 24, 39, var(--tw-text-opacity))}.hover\\:text-yellow-600.svelte-o01mag.svelte-o01mag:hover{--tw-text-opacity:1;color:rgba(217, 119, 6, var(--tw-text-opacity))}.w-4.svelte-o01mag.svelte-o01mag{width:1rem}.transform.svelte-o01mag.svelte-o01mag{--tw-rotate:0;--tw-rotate-x:0;--tw-rotate-y:0;--tw-rotate-z:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scale-z:1;--tw-skew-x:0;--tw-skew-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-translate-z:0;-webkit-transform:rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z));-ms-transform:rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z));transform:rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z))}.origin-top.svelte-o01mag.svelte-o01mag{-webkit-transform-origin:top;-ms-transform-origin:top;transform-origin:top}.scale-0.svelte-o01mag.svelte-o01mag{--tw-scale-x:0;--tw-scale-y:0;--tw-scale-z:0}.group.svelte-o01mag:hover .group-hover\\:scale-100.svelte-o01mag{--tw-scale-x:1;--tw-scale-y:1;--tw-scale-z:1}.group.svelte-o01mag:hover .group-hover\\:-rotate-180.svelte-o01mag{--tw-rotate:-180deg}.transition.svelte-o01mag.svelte-o01mag{-webkit-transition-property:background-color, border-color, color, fill, stroke, opacity, -webkit-box-shadow, -webkit-transform, filter, backdrop-filter;-o-transition-property:background-color, border-color, color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;transition-property:background-color, border-color, color, fill, stroke, opacity, box-shadow, -webkit-box-shadow, transform, -webkit-transform, filter, backdrop-filter;-webkit-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-o-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-webkit-transition-duration:150ms;-o-transition-duration:150ms;transition-duration:150ms}.ease-in-out.svelte-o01mag.svelte-o01mag{-webkit-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-o-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1)}.duration-150.svelte-o01mag.svelte-o01mag{-webkit-transition-duration:150ms;-o-transition-duration:150ms;transition-duration:150ms}",
      map: null
    };
    Australasia = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$7);
      return `<div class="${"group inline-block svelte-o01mag"}"><button class="${"outline-none focus:outline-none border px-3 py-1 bg-white text-gray-700 rounded-sm flex items-center min-w-32 svelte-o01mag"}"><span class="${"pr-1 font-semibold flex-1 svelte-o01mag"}">Australasia</span>
		<span><svg class="${"fill-current h-4 w-4 transform group-hover:-rotate-180 transition duration-150 ease-in-out svelte-o01mag"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 20 20"}"><path d="${"M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"}"></path></svg></span></button>
	<ul class="${"bg-white border rounded-sm transform scale-0 group-hover:scale-100 absolute transition duration-150 ease-in-out origin-top min-w-32 svelte-o01mag"}"><li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-o01mag"}"><a class="${"text-gray-900 hover:text-yellow-600 svelte-o01mag"}" href="${"/australia"}">Australia</a></li>

		<li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-o01mag"}"><a class="${"text-gray-900 hover:text-yellow-600 svelte-o01mag"}" href="${"/newzealand"}">New Zealand</a></li></ul>
</div>`;
    });
    css$6 = {
      code: "li>button.svelte-xrj6y5 svg.svelte-xrj6y5{transform:rotate(-90deg)}li:hover>button.svelte-xrj6y5 svg.svelte-xrj6y5{transform:rotate(-270deg)}.group.svelte-xrj6y5:hover .group-hover\\:scale-100.svelte-xrj6y5{transform:scale(1)}.group.svelte-xrj6y5:hover .group-hover\\:-rotate-180.svelte-xrj6y5{transform:rotate(180deg)}.scale-0.svelte-xrj6y5.svelte-xrj6y5{transform:scale(0)}.min-w-32.svelte-xrj6y5.svelte-xrj6y5{min-width:8rem}.bg-white.svelte-xrj6y5.svelte-xrj6y5{--tw-bg-opacity:1;background-color:rgba(255, 255, 255, var(--tw-bg-opacity))}.hover\\:bg-gray-100.svelte-xrj6y5.svelte-xrj6y5:hover{--tw-bg-opacity:1;background-color:rgba(243, 244, 246, var(--tw-bg-opacity))}.rounded-sm.svelte-xrj6y5.svelte-xrj6y5{border-radius:0.125rem}.border.svelte-xrj6y5.svelte-xrj6y5{border-width:1px}.inline-block.svelte-xrj6y5.svelte-xrj6y5{display:inline-block}.flex.svelte-xrj6y5.svelte-xrj6y5{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}.items-center.svelte-xrj6y5.svelte-xrj6y5{-webkit-box-align:center;-ms-flex-align:center;-webkit-align-items:center;align-items:center}.flex-1.svelte-xrj6y5.svelte-xrj6y5{-webkit-box-flex:1;-ms-flex:1 1 0%;-webkit-flex:1 1 0%;flex:1 1 0%}.font-semibold.svelte-xrj6y5.svelte-xrj6y5{font-weight:600}.h-4.svelte-xrj6y5.svelte-xrj6y5{height:1rem}.min-w-32.svelte-xrj6y5.svelte-xrj6y5{min-width:8rem}.outline-none.svelte-xrj6y5.svelte-xrj6y5{outline:2px solid transparent;outline-offset:2px}.focus\\:outline-none.svelte-xrj6y5.svelte-xrj6y5:focus{outline:2px solid transparent;outline-offset:2px}.px-3.svelte-xrj6y5.svelte-xrj6y5{padding-left:0.75rem;padding-right:0.75rem}.py-1.svelte-xrj6y5.svelte-xrj6y5{padding-top:0.25rem;padding-bottom:0.25rem}.pr-1.svelte-xrj6y5.svelte-xrj6y5{padding-right:0.25rem}.absolute.svelte-xrj6y5.svelte-xrj6y5{position:absolute}.fill-current.svelte-xrj6y5.svelte-xrj6y5{fill:currentColor}.text-gray-700.svelte-xrj6y5.svelte-xrj6y5{--tw-text-opacity:1;color:rgba(55, 65, 81, var(--tw-text-opacity))}.text-emerald-600.svelte-xrj6y5.svelte-xrj6y5{--tw-text-opacity:1;color:rgba(5, 150, 105, var(--tw-text-opacity))}.hover\\:text-yellow-600.svelte-xrj6y5.svelte-xrj6y5:hover{--tw-text-opacity:1;color:rgba(217, 119, 6, var(--tw-text-opacity))}.w-4.svelte-xrj6y5.svelte-xrj6y5{width:1rem}.transform.svelte-xrj6y5.svelte-xrj6y5{--tw-rotate:0;--tw-rotate-x:0;--tw-rotate-y:0;--tw-rotate-z:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scale-z:1;--tw-skew-x:0;--tw-skew-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-translate-z:0;-webkit-transform:rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z));-ms-transform:rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z));transform:rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z))}.origin-top.svelte-xrj6y5.svelte-xrj6y5{-webkit-transform-origin:top;-ms-transform-origin:top;transform-origin:top}.scale-0.svelte-xrj6y5.svelte-xrj6y5{--tw-scale-x:0;--tw-scale-y:0;--tw-scale-z:0}.group.svelte-xrj6y5:hover .group-hover\\:scale-100.svelte-xrj6y5{--tw-scale-x:1;--tw-scale-y:1;--tw-scale-z:1}.group.svelte-xrj6y5:hover .group-hover\\:-rotate-180.svelte-xrj6y5{--tw-rotate:-180deg}.transition.svelte-xrj6y5.svelte-xrj6y5{-webkit-transition-property:background-color, border-color, color, fill, stroke, opacity, -webkit-box-shadow, -webkit-transform, filter, backdrop-filter;-o-transition-property:background-color, border-color, color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;transition-property:background-color, border-color, color, fill, stroke, opacity, box-shadow, -webkit-box-shadow, transform, -webkit-transform, filter, backdrop-filter;-webkit-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-o-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-webkit-transition-duration:150ms;-o-transition-duration:150ms;transition-duration:150ms}.ease-in-out.svelte-xrj6y5.svelte-xrj6y5{-webkit-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-o-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1)}.duration-150.svelte-xrj6y5.svelte-xrj6y5{-webkit-transition-duration:150ms;-o-transition-duration:150ms;transition-duration:150ms}",
      map: null
    };
    Caribbean = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$6);
      return `<div class="${"group inline-block svelte-xrj6y5"}"><button class="${"outline-none focus:outline-none border px-3 py-1 bg-white text-gray-700 rounded-sm flex items-center min-w-32 svelte-xrj6y5"}"><span class="${"pr-1 font-semibold flex-1 svelte-xrj6y5"}">Caribbean</span>
		<span><svg class="${"fill-current h-4 w-4 transform group-hover:-rotate-180 transition duration-150 ease-in-out svelte-xrj6y5"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 20 20"}"><path d="${"M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"}"></path></svg></span></button>
	<ul class="${"bg-white border rounded-sm transform scale-0 group-hover:scale-100 absolute transition duration-150 ease-in-out origin-top min-w-32 svelte-xrj6y5"}"><li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-xrj6y5"}"><a class="${"text-emerald-600 hover:text-yellow-600 svelte-xrj6y5"}" href="${"/barbados"}">Barbados</a></li>

		<li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-xrj6y5"}"><a class="${"text-emerald-600 hover:text-yellow-600 svelte-xrj6y5"}" href="${"/bermuda"}">Bermuda</a></li></ul>
</div>`;
    });
    css$5 = {
      code: "li>button.svelte-1y6yaqn svg.svelte-1y6yaqn{transform:rotate(-90deg)}li:hover>button.svelte-1y6yaqn svg.svelte-1y6yaqn{transform:rotate(-270deg)}.group.svelte-1y6yaqn:hover .group-hover\\:scale-100.svelte-1y6yaqn{transform:scale(1)}.group.svelte-1y6yaqn:hover .group-hover\\:-rotate-180.svelte-1y6yaqn{transform:rotate(180deg)}.scale-0.svelte-1y6yaqn.svelte-1y6yaqn{transform:scale(0)}.min-w-32.svelte-1y6yaqn.svelte-1y6yaqn{min-width:8rem}.bg-white.svelte-1y6yaqn.svelte-1y6yaqn{--tw-bg-opacity:1;background-color:rgba(255, 255, 255, var(--tw-bg-opacity))}.hover\\:bg-gray-100.svelte-1y6yaqn.svelte-1y6yaqn:hover{--tw-bg-opacity:1;background-color:rgba(243, 244, 246, var(--tw-bg-opacity))}.rounded-sm.svelte-1y6yaqn.svelte-1y6yaqn{border-radius:0.125rem}.border.svelte-1y6yaqn.svelte-1y6yaqn{border-width:1px}.inline-block.svelte-1y6yaqn.svelte-1y6yaqn{display:inline-block}.flex.svelte-1y6yaqn.svelte-1y6yaqn{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}.items-center.svelte-1y6yaqn.svelte-1y6yaqn{-webkit-box-align:center;-ms-flex-align:center;-webkit-align-items:center;align-items:center}.flex-1.svelte-1y6yaqn.svelte-1y6yaqn{-webkit-box-flex:1;-ms-flex:1 1 0%;-webkit-flex:1 1 0%;flex:1 1 0%}.font-semibold.svelte-1y6yaqn.svelte-1y6yaqn{font-weight:600}.h-4.svelte-1y6yaqn.svelte-1y6yaqn{height:1rem}.min-w-32.svelte-1y6yaqn.svelte-1y6yaqn{min-width:8rem}.outline-none.svelte-1y6yaqn.svelte-1y6yaqn{outline:2px solid transparent;outline-offset:2px}.focus\\:outline-none.svelte-1y6yaqn.svelte-1y6yaqn:focus{outline:2px solid transparent;outline-offset:2px}.px-3.svelte-1y6yaqn.svelte-1y6yaqn{padding-left:0.75rem;padding-right:0.75rem}.py-1.svelte-1y6yaqn.svelte-1y6yaqn{padding-top:0.25rem;padding-bottom:0.25rem}.pr-1.svelte-1y6yaqn.svelte-1y6yaqn{padding-right:0.25rem}.absolute.svelte-1y6yaqn.svelte-1y6yaqn{position:absolute}.fill-current.svelte-1y6yaqn.svelte-1y6yaqn{fill:currentColor}.text-gray-700.svelte-1y6yaqn.svelte-1y6yaqn{--tw-text-opacity:1;color:rgba(55, 65, 81, var(--tw-text-opacity))}.text-red-600.svelte-1y6yaqn.svelte-1y6yaqn{--tw-text-opacity:1;color:rgba(220, 38, 38, var(--tw-text-opacity))}.hover\\:text-yellow-600.svelte-1y6yaqn.svelte-1y6yaqn:hover{--tw-text-opacity:1;color:rgba(217, 119, 6, var(--tw-text-opacity))}.w-4.svelte-1y6yaqn.svelte-1y6yaqn{width:1rem}.transform.svelte-1y6yaqn.svelte-1y6yaqn{--tw-rotate:0;--tw-rotate-x:0;--tw-rotate-y:0;--tw-rotate-z:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scale-z:1;--tw-skew-x:0;--tw-skew-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-translate-z:0;-webkit-transform:rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z));-ms-transform:rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z));transform:rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z))}.origin-top.svelte-1y6yaqn.svelte-1y6yaqn{-webkit-transform-origin:top;-ms-transform-origin:top;transform-origin:top}.scale-0.svelte-1y6yaqn.svelte-1y6yaqn{--tw-scale-x:0;--tw-scale-y:0;--tw-scale-z:0}.group.svelte-1y6yaqn:hover .group-hover\\:scale-100.svelte-1y6yaqn{--tw-scale-x:1;--tw-scale-y:1;--tw-scale-z:1}.group.svelte-1y6yaqn:hover .group-hover\\:-rotate-180.svelte-1y6yaqn{--tw-rotate:-180deg}.transition.svelte-1y6yaqn.svelte-1y6yaqn{-webkit-transition-property:background-color, border-color, color, fill, stroke, opacity, -webkit-box-shadow, -webkit-transform, filter, backdrop-filter;-o-transition-property:background-color, border-color, color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;transition-property:background-color, border-color, color, fill, stroke, opacity, box-shadow, -webkit-box-shadow, transform, -webkit-transform, filter, backdrop-filter;-webkit-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-o-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-webkit-transition-duration:150ms;-o-transition-duration:150ms;transition-duration:150ms}.ease-in-out.svelte-1y6yaqn.svelte-1y6yaqn{-webkit-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-o-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1)}.duration-150.svelte-1y6yaqn.svelte-1y6yaqn{-webkit-transition-duration:150ms;-o-transition-duration:150ms;transition-duration:150ms}",
      map: null
    };
    Europe = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$5);
      return `<div class="${"group inline-block svelte-1y6yaqn"}"><button class="${"outline-none focus:outline-none border px-3 py-1 bg-white text-gray-700 rounded-sm flex items-center min-w-32 svelte-1y6yaqn"}"><span class="${"pr-1 font-semibold flex-1 svelte-1y6yaqn"}">Europe</span>
      <span><svg class="${"fill-current h-4 w-4 transform group-hover:-rotate-180 transition duration-150 ease-in-out svelte-1y6yaqn"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 20 20"}"><path d="${"M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"}"></path></svg></span></button>
    <ul class="${"bg-white border rounded-sm transform scale-0 group-hover:scale-100 absolute transition duration-150 ease-in-out origin-top min-w-32 svelte-1y6yaqn"}"><li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-1y6yaqn"}"><a class="${"text-red-600 hover:text-yellow-600 svelte-1y6yaqn"}" href="${"/austrian"}">Austrian</a></li>

     <li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-1y6yaqn"}"><a class="${"text-red-600 hover:text-yellow-600 svelte-1y6yaqn"}" href="${"/belarus"}">Belarus</a></li>

    <li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-1y6yaqn"}"><a class="${"text-red-600 hover:text-yellow-600 svelte-1y6yaqn"}" href="${"/belgium"}">Belgium</a></li>

    <li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-1y6yaqn"}"><a class="${"text-red-600 hover:text-yellow-600 svelte-1y6yaqn"}" href="${"/british"}">British</a></li>

    <li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-1y6yaqn"}"><a class="${"text-red-600 hover:text-yellow-600 svelte-1y6yaqn"}" href="${"/french"}">French</a></li>

    <li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-1y6yaqn"}"><a class="${"text-red-600 hover:text-yellow-600 svelte-1y6yaqn"}" href="${"/ireland"}">Ireland</a></li>

     <li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-1y6yaqn"}"><a class="${"text-red-600 hover:text-yellow-600 svelte-1y6yaqn"}" href="${"/netherlands"}">Netherlands</a></li>

     <li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-1y6yaqn"}"><a class="${"text-red-600 hover:text-yellow-600 svelte-1y6yaqn"}" href="${"/russian"}">Russian</a></li>

     <li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-1y6yaqn"}"><a class="${"text-red-600 hover:text-yellow-600 svelte-1y6yaqn"}" href="${"/ukraine"}">Ukraine</a></li></ul>
  </div>`;
    });
    css$4 = {
      code: "li>button.svelte-1a7qfvw svg.svelte-1a7qfvw{transform:rotate(-90deg)}li:hover>button.svelte-1a7qfvw svg.svelte-1a7qfvw{transform:rotate(-270deg)}.group.svelte-1a7qfvw:hover .group-hover\\:scale-100.svelte-1a7qfvw{transform:scale(1)}.group.svelte-1a7qfvw:hover .group-hover\\:-rotate-180.svelte-1a7qfvw{transform:rotate(180deg)}.scale-0.svelte-1a7qfvw.svelte-1a7qfvw{transform:scale(0)}.min-w-32.svelte-1a7qfvw.svelte-1a7qfvw{min-width:8rem}.bg-white.svelte-1a7qfvw.svelte-1a7qfvw{--tw-bg-opacity:1;background-color:rgba(255, 255, 255, var(--tw-bg-opacity))}.hover\\:bg-gray-100.svelte-1a7qfvw.svelte-1a7qfvw:hover{--tw-bg-opacity:1;background-color:rgba(243, 244, 246, var(--tw-bg-opacity))}.rounded-sm.svelte-1a7qfvw.svelte-1a7qfvw{border-radius:0.125rem}.border.svelte-1a7qfvw.svelte-1a7qfvw{border-width:1px}.inline-block.svelte-1a7qfvw.svelte-1a7qfvw{display:inline-block}.flex.svelte-1a7qfvw.svelte-1a7qfvw{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}.items-center.svelte-1a7qfvw.svelte-1a7qfvw{-webkit-box-align:center;-ms-flex-align:center;-webkit-align-items:center;align-items:center}.flex-1.svelte-1a7qfvw.svelte-1a7qfvw{-webkit-box-flex:1;-ms-flex:1 1 0%;-webkit-flex:1 1 0%;flex:1 1 0%}.font-semibold.svelte-1a7qfvw.svelte-1a7qfvw{font-weight:600}.h-4.svelte-1a7qfvw.svelte-1a7qfvw{height:1rem}.min-w-32.svelte-1a7qfvw.svelte-1a7qfvw{min-width:8rem}.outline-none.svelte-1a7qfvw.svelte-1a7qfvw{outline:2px solid transparent;outline-offset:2px}.focus\\:outline-none.svelte-1a7qfvw.svelte-1a7qfvw:focus{outline:2px solid transparent;outline-offset:2px}.px-3.svelte-1a7qfvw.svelte-1a7qfvw{padding-left:0.75rem;padding-right:0.75rem}.py-1.svelte-1a7qfvw.svelte-1a7qfvw{padding-top:0.25rem;padding-bottom:0.25rem}.pr-1.svelte-1a7qfvw.svelte-1a7qfvw{padding-right:0.25rem}.absolute.svelte-1a7qfvw.svelte-1a7qfvw{position:absolute}.fill-current.svelte-1a7qfvw.svelte-1a7qfvw{fill:currentColor}.text-gray-700.svelte-1a7qfvw.svelte-1a7qfvw{--tw-text-opacity:1;color:rgba(55, 65, 81, var(--tw-text-opacity))}.text-blue-600.svelte-1a7qfvw.svelte-1a7qfvw{--tw-text-opacity:1;color:rgba(37, 99, 235, var(--tw-text-opacity))}.hover\\:text-yellow-600.svelte-1a7qfvw.svelte-1a7qfvw:hover{--tw-text-opacity:1;color:rgba(217, 119, 6, var(--tw-text-opacity))}.w-4.svelte-1a7qfvw.svelte-1a7qfvw{width:1rem}.transform.svelte-1a7qfvw.svelte-1a7qfvw{--tw-rotate:0;--tw-rotate-x:0;--tw-rotate-y:0;--tw-rotate-z:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scale-z:1;--tw-skew-x:0;--tw-skew-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-translate-z:0;-webkit-transform:rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z));-ms-transform:rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z));transform:rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z))}.origin-top.svelte-1a7qfvw.svelte-1a7qfvw{-webkit-transform-origin:top;-ms-transform-origin:top;transform-origin:top}.scale-0.svelte-1a7qfvw.svelte-1a7qfvw{--tw-scale-x:0;--tw-scale-y:0;--tw-scale-z:0}.group.svelte-1a7qfvw:hover .group-hover\\:scale-100.svelte-1a7qfvw{--tw-scale-x:1;--tw-scale-y:1;--tw-scale-z:1}.group.svelte-1a7qfvw:hover .group-hover\\:-rotate-180.svelte-1a7qfvw{--tw-rotate:-180deg}.transition.svelte-1a7qfvw.svelte-1a7qfvw{-webkit-transition-property:background-color, border-color, color, fill, stroke, opacity, -webkit-box-shadow, -webkit-transform, filter, backdrop-filter;-o-transition-property:background-color, border-color, color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;transition-property:background-color, border-color, color, fill, stroke, opacity, box-shadow, -webkit-box-shadow, transform, -webkit-transform, filter, backdrop-filter;-webkit-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-o-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-webkit-transition-duration:150ms;-o-transition-duration:150ms;transition-duration:150ms}.ease-in-out.svelte-1a7qfvw.svelte-1a7qfvw{-webkit-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-o-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1)}.duration-150.svelte-1a7qfvw.svelte-1a7qfvw{-webkit-transition-duration:150ms;-o-transition-duration:150ms;transition-duration:150ms}",
      map: null
    };
    Jewish = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$4);
      return `<div class="${"group inline-block svelte-1a7qfvw"}"><button class="${"outline-none focus:outline-none border px-3 py-1 bg-white text-gray-700 rounded-sm flex items-center min-w-32 svelte-1a7qfvw"}"><span class="${"pr-1 font-semibold flex-1 svelte-1a7qfvw"}">Jewish</span>
      <span><svg class="${"fill-current h-4 w-4 transform group-hover:-rotate-180 transition duration-150 ease-in-out svelte-1a7qfvw"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 20 20"}"><path d="${"M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"}"></path></svg></span></button>
    <ul class="${"bg-white border rounded-sm transform scale-0 group-hover:scale-100 absolute transition duration-150 ease-in-out origin-top min-w-32 svelte-1a7qfvw"}"><li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-1a7qfvw"}"><a class="${"text-blue-600 hover:text-yellow-600 svelte-1a7qfvw"}" href="${"/australia-j"}">Australia</a></li>

    <li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-1a7qfvw"}"><a class="${"text-blue-600 hover:text-yellow-600 svelte-1a7qfvw"}" href="${"/austrian-j"}">Austrian</a></li>

    <li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-1a7qfvw"}"><a class="${"text-blue-600 hover:text-yellow-600 svelte-1a7qfvw"}" href="${"/belarus-j"}">Belarus</a></li>

    <li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-1a7qfvw"}"><a class="${"text-blue-600 hover:text-yellow-600 svelte-1a7qfvw"}" href="${"/british-j"}">British</a></li>

    <li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-1a7qfvw"}"><a class="${"text-blue-600 hover:text-yellow-600 svelte-1a7qfvw"}" href="${"/canada-j"}">Canada</a></li>

    <li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-1a7qfvw"}"><a class="${"text-blue-600 hover:text-yellow-600 svelte-1a7qfvw"}" href="${"/ireland-j"}">Ireland</a></li>

    <li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-1a7qfvw"}"><a class="${"text-blue-600 hover:text-yellow-600 svelte-1a7qfvw"}" href="${"/italian-j"}">Italian</a></li>

      <li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-1a7qfvw"}"><a class="${"text-blue-600 hover:text-yellow-600 svelte-1a7qfvw"}" href="${"/netherlands-j"}">Netherlands</a></li>

    <li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-1a7qfvw"}"><a class="${"text-blue-600 hover:text-yellow-600 svelte-1a7qfvw"}" href="${"/russian-j"}">Russian</a></li>

       <li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-1a7qfvw"}"><a class="${"text-blue-600 hover:text-yellow-600 svelte-1a7qfvw"}" href="${"/ukraine-j"}">Ukraine</a></li>

     <li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-1a7qfvw"}"><a class="${"text-blue-600 hover:text-yellow-600 svelte-1a7qfvw"}" href="${"/usa-j"}">USA</a></li>
      
      <li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-1a7qfvw"}"><a class="${"text-blue-600 hover:text-yellow-600 svelte-1a7qfvw"}" href="${"/shoah"}">Shoah</a></li></ul>
  </div>`;
    });
    css$3 = {
      code: "li>button.svelte-o01mag svg.svelte-o01mag{transform:rotate(-90deg)}li:hover>button.svelte-o01mag svg.svelte-o01mag{transform:rotate(-270deg)}.group.svelte-o01mag:hover .group-hover\\:scale-100.svelte-o01mag{transform:scale(1)}.group.svelte-o01mag:hover .group-hover\\:-rotate-180.svelte-o01mag{transform:rotate(180deg)}.scale-0.svelte-o01mag.svelte-o01mag{transform:scale(0)}.min-w-32.svelte-o01mag.svelte-o01mag{min-width:8rem}.bg-white.svelte-o01mag.svelte-o01mag{--tw-bg-opacity:1;background-color:rgba(255, 255, 255, var(--tw-bg-opacity))}.hover\\:bg-gray-100.svelte-o01mag.svelte-o01mag:hover{--tw-bg-opacity:1;background-color:rgba(243, 244, 246, var(--tw-bg-opacity))}.rounded-sm.svelte-o01mag.svelte-o01mag{border-radius:0.125rem}.border.svelte-o01mag.svelte-o01mag{border-width:1px}.inline-block.svelte-o01mag.svelte-o01mag{display:inline-block}.flex.svelte-o01mag.svelte-o01mag{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}.items-center.svelte-o01mag.svelte-o01mag{-webkit-box-align:center;-ms-flex-align:center;-webkit-align-items:center;align-items:center}.flex-1.svelte-o01mag.svelte-o01mag{-webkit-box-flex:1;-ms-flex:1 1 0%;-webkit-flex:1 1 0%;flex:1 1 0%}.font-semibold.svelte-o01mag.svelte-o01mag{font-weight:600}.h-4.svelte-o01mag.svelte-o01mag{height:1rem}.min-w-32.svelte-o01mag.svelte-o01mag{min-width:8rem}.outline-none.svelte-o01mag.svelte-o01mag{outline:2px solid transparent;outline-offset:2px}.focus\\:outline-none.svelte-o01mag.svelte-o01mag:focus{outline:2px solid transparent;outline-offset:2px}.px-3.svelte-o01mag.svelte-o01mag{padding-left:0.75rem;padding-right:0.75rem}.py-1.svelte-o01mag.svelte-o01mag{padding-top:0.25rem;padding-bottom:0.25rem}.pr-1.svelte-o01mag.svelte-o01mag{padding-right:0.25rem}.absolute.svelte-o01mag.svelte-o01mag{position:absolute}.fill-current.svelte-o01mag.svelte-o01mag{fill:currentColor}.text-gray-700.svelte-o01mag.svelte-o01mag{--tw-text-opacity:1;color:rgba(55, 65, 81, var(--tw-text-opacity))}.text-gray-900.svelte-o01mag.svelte-o01mag{--tw-text-opacity:1;color:rgba(17, 24, 39, var(--tw-text-opacity))}.hover\\:text-yellow-600.svelte-o01mag.svelte-o01mag:hover{--tw-text-opacity:1;color:rgba(217, 119, 6, var(--tw-text-opacity))}.w-4.svelte-o01mag.svelte-o01mag{width:1rem}.transform.svelte-o01mag.svelte-o01mag{--tw-rotate:0;--tw-rotate-x:0;--tw-rotate-y:0;--tw-rotate-z:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scale-z:1;--tw-skew-x:0;--tw-skew-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-translate-z:0;-webkit-transform:rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z));-ms-transform:rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z));transform:rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z))}.origin-top.svelte-o01mag.svelte-o01mag{-webkit-transform-origin:top;-ms-transform-origin:top;transform-origin:top}.scale-0.svelte-o01mag.svelte-o01mag{--tw-scale-x:0;--tw-scale-y:0;--tw-scale-z:0}.group.svelte-o01mag:hover .group-hover\\:scale-100.svelte-o01mag{--tw-scale-x:1;--tw-scale-y:1;--tw-scale-z:1}.group.svelte-o01mag:hover .group-hover\\:-rotate-180.svelte-o01mag{--tw-rotate:-180deg}.transition.svelte-o01mag.svelte-o01mag{-webkit-transition-property:background-color, border-color, color, fill, stroke, opacity, -webkit-box-shadow, -webkit-transform, filter, backdrop-filter;-o-transition-property:background-color, border-color, color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;transition-property:background-color, border-color, color, fill, stroke, opacity, box-shadow, -webkit-box-shadow, transform, -webkit-transform, filter, backdrop-filter;-webkit-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-o-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-webkit-transition-duration:150ms;-o-transition-duration:150ms;transition-duration:150ms}.ease-in-out.svelte-o01mag.svelte-o01mag{-webkit-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-o-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1)}.duration-150.svelte-o01mag.svelte-o01mag{-webkit-transition-duration:150ms;-o-transition-duration:150ms;transition-duration:150ms}",
      map: null
    };
    Northamerica = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$3);
      return `<div class="${"group inline-block svelte-o01mag"}"><button class="${"outline-none focus:outline-none border px-3 py-1 bg-white text-gray-700 rounded-sm flex items-center min-w-32 svelte-o01mag"}"><span class="${"pr-1 font-semibold flex-1 svelte-o01mag"}">North America</span>
		<span><svg class="${"fill-current h-4 w-4 transform group-hover:-rotate-180 transition duration-150 ease-in-out svelte-o01mag"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 20 20"}"><path d="${"M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"}"></path></svg></span></button>
	<ul class="${"bg-white border rounded-sm transform scale-0 group-hover:scale-100 absolute transition duration-150 ease-in-out origin-top min-w-32 svelte-o01mag"}"><li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-o01mag"}"><a class="${"text-gray-900 hover:text-yellow-600 svelte-o01mag"}" href="${"/canada"}">Canada</a></li>

		<li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-o01mag"}"><a class="${"text-gray-900 hover:text-yellow-600 svelte-o01mag"}" href="${"/usa"}">USA</a></li></ul>
</div>`;
    });
    css$2 = {
      code: "li>button.svelte-1mhoczo svg.svelte-1mhoczo{transform:rotate(-90deg)}li:hover>button.svelte-1mhoczo svg.svelte-1mhoczo{transform:rotate(-270deg)}.group.svelte-1mhoczo:hover .group-hover\\:scale-100.svelte-1mhoczo{transform:scale(1)}.group.svelte-1mhoczo:hover .group-hover\\:-rotate-180.svelte-1mhoczo{transform:rotate(180deg)}.scale-0.svelte-1mhoczo.svelte-1mhoczo{transform:scale(0)}.min-w-32.svelte-1mhoczo.svelte-1mhoczo{min-width:8rem}.bg-white.svelte-1mhoczo.svelte-1mhoczo{--tw-bg-opacity:1;background-color:rgba(255, 255, 255, var(--tw-bg-opacity))}.hover\\:bg-gray-100.svelte-1mhoczo.svelte-1mhoczo:hover{--tw-bg-opacity:1;background-color:rgba(243, 244, 246, var(--tw-bg-opacity))}.rounded-sm.svelte-1mhoczo.svelte-1mhoczo{border-radius:0.125rem}.border.svelte-1mhoczo.svelte-1mhoczo{border-width:1px}.inline-block.svelte-1mhoczo.svelte-1mhoczo{display:inline-block}.flex.svelte-1mhoczo.svelte-1mhoczo{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}.items-center.svelte-1mhoczo.svelte-1mhoczo{-webkit-box-align:center;-ms-flex-align:center;-webkit-align-items:center;align-items:center}.flex-1.svelte-1mhoczo.svelte-1mhoczo{-webkit-box-flex:1;-ms-flex:1 1 0%;-webkit-flex:1 1 0%;flex:1 1 0%}.font-semibold.svelte-1mhoczo.svelte-1mhoczo{font-weight:600}.h-4.svelte-1mhoczo.svelte-1mhoczo{height:1rem}.min-w-32.svelte-1mhoczo.svelte-1mhoczo{min-width:8rem}.outline-none.svelte-1mhoczo.svelte-1mhoczo{outline:2px solid transparent;outline-offset:2px}.focus\\:outline-none.svelte-1mhoczo.svelte-1mhoczo:focus{outline:2px solid transparent;outline-offset:2px}.px-3.svelte-1mhoczo.svelte-1mhoczo{padding-left:0.75rem;padding-right:0.75rem}.py-1.svelte-1mhoczo.svelte-1mhoczo{padding-top:0.25rem;padding-bottom:0.25rem}.pr-1.svelte-1mhoczo.svelte-1mhoczo{padding-right:0.25rem}.absolute.svelte-1mhoczo.svelte-1mhoczo{position:absolute}.fill-current.svelte-1mhoczo.svelte-1mhoczo{fill:currentColor}.text-gray-700.svelte-1mhoczo.svelte-1mhoczo{--tw-text-opacity:1;color:rgba(55, 65, 81, var(--tw-text-opacity))}.text-rose-500.svelte-1mhoczo.svelte-1mhoczo{--tw-text-opacity:1;color:rgba(244, 63, 94, var(--tw-text-opacity))}.hover\\:text-yellow-600.svelte-1mhoczo.svelte-1mhoczo:hover{--tw-text-opacity:1;color:rgba(217, 119, 6, var(--tw-text-opacity))}.w-4.svelte-1mhoczo.svelte-1mhoczo{width:1rem}.transform.svelte-1mhoczo.svelte-1mhoczo{--tw-rotate:0;--tw-rotate-x:0;--tw-rotate-y:0;--tw-rotate-z:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scale-z:1;--tw-skew-x:0;--tw-skew-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-translate-z:0;-webkit-transform:rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z));-ms-transform:rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z));transform:rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z))}.origin-top.svelte-1mhoczo.svelte-1mhoczo{-webkit-transform-origin:top;-ms-transform-origin:top;transform-origin:top}.scale-0.svelte-1mhoczo.svelte-1mhoczo{--tw-scale-x:0;--tw-scale-y:0;--tw-scale-z:0}.group.svelte-1mhoczo:hover .group-hover\\:scale-100.svelte-1mhoczo{--tw-scale-x:1;--tw-scale-y:1;--tw-scale-z:1}.group.svelte-1mhoczo:hover .group-hover\\:-rotate-180.svelte-1mhoczo{--tw-rotate:-180deg}.transition.svelte-1mhoczo.svelte-1mhoczo{-webkit-transition-property:background-color, border-color, color, fill, stroke, opacity, -webkit-box-shadow, -webkit-transform, filter, backdrop-filter;-o-transition-property:background-color, border-color, color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;transition-property:background-color, border-color, color, fill, stroke, opacity, box-shadow, -webkit-box-shadow, transform, -webkit-transform, filter, backdrop-filter;-webkit-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-o-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-webkit-transition-duration:150ms;-o-transition-duration:150ms;transition-duration:150ms}.ease-in-out.svelte-1mhoczo.svelte-1mhoczo{-webkit-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-o-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1)}.duration-150.svelte-1mhoczo.svelte-1mhoczo{-webkit-transition-duration:150ms;-o-transition-duration:150ms;transition-duration:150ms}",
      map: null
    };
    General = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$2);
      return `<div class="${"group inline-block svelte-1mhoczo"}"><button class="${"outline-none focus:outline-none border px-3 py-1 bg-white text-gray-700 rounded-sm flex items-center min-w-32 svelte-1mhoczo"}"><span class="${"pr-1 font-semibold flex-1 svelte-1mhoczo"}">General </span>
		<span><svg class="${"fill-current h-4 w-4 transform group-hover:-rotate-180 transition duration-150 ease-in-out svelte-1mhoczo"}" xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 20 20"}"><path d="${"M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"}"></path></svg></span></button>
	<ul class="${"bg-white border rounded-sm transform scale-0 group-hover:scale-100 absolute transition duration-150 ease-in-out origin-top min-w-32 svelte-1mhoczo"}"><li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-1mhoczo"}"><a class="${"text-rose-500 hover:text-yellow-600 svelte-1mhoczo"}" href="${"/general"}">General</a></li>

		<li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-1mhoczo"}"><a class="${"text-rose-500 hover:text-yellow-600 svelte-1mhoczo"}" href="${"/dna"}">DNA</a></li>

		<li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-1mhoczo"}"><a class="${"text-rose-500 hover:text-yellow-600 svelte-1mhoczo"}" href="${"/video"}">Video&#39;s</a></li>

		<li class="${"rounded-sm px-3 py-1 hover:bg-gray-100 svelte-1mhoczo"}"><a class="${"text-rose-500 hover:text-yellow-600 svelte-1mhoczo"}" href="${"/contact"}">Contact&#39;s</a></li></ul>
</div>`;
    });
    css$1 = {
      code: ".border-gray-200.svelte-1w1hv5w{--tw-border-opacity:1;border-color:rgba(229, 231, 235, var(--tw-border-opacity))}.border-b-4.svelte-1w1hv5w{border-bottom-width:4px}.mb-72.svelte-1w1hv5w{margin-bottom:18rem}.text-gray-700.svelte-1w1hv5w{--tw-text-opacity:1;color:rgba(55, 65, 81, var(--tw-text-opacity))}.text-red-600.svelte-1w1hv5w{--tw-text-opacity:1;color:rgba(220, 38, 38, var(--tw-text-opacity))}.hover\\:text-yellow-600.svelte-1w1hv5w:hover{--tw-text-opacity:1;color:rgba(217, 119, 6, var(--tw-text-opacity))}",
      map: null
    };
    Dropdown = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$1);
      return `<div class="${"one mb-72 svelte-1w1hv5w"}"><br>
	<div class="${"border-b-4 border-gray-200 svelte-1w1hv5w"}"></div>
	<br>

	<br>
	<p>${validate_component(Australasia, "Australasia").$$render($$result, {}, {}, {})}
		${validate_component(Caribbean, "Caribbean").$$render($$result, {}, {}, {})}
		${validate_component(Europe, "Europe").$$render($$result, {}, {}, {})}
		${validate_component(Jewish, "Jewish").$$render($$result, {}, {}, {})}
		${validate_component(Northamerica, "Northamerica").$$render($$result, {}, {}, {})}
		${validate_component(General, "General").$$render($$result, {}, {}, {})}</p>

	<p class="${"text-gray-700 svelte-1w1hv5w"}"><br>
		Add

		<a class="${"text-red-600 hover:text-yellow-600 svelte-1w1hv5w"}" href="${"http://bit.ly/2SxWdgt"}" target="${"_blank"}">google translate
		</a>
		to your browser extensions, to view foreign language web sites.
	</p>
    
</div>`;
    });
    Googletag = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return `<noscript><iframe src="${"https://www.googletagmanager.com/ns.html?id=GTM-PJS56TL"}" height="${"0"}" width="${"0"}" style="${"display:none;visibility:hidden"}"></iframe></noscript>`;
    });
    css = {
      code: `*,::before,::after{-webkit-box-sizing:border-box;box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}*{--tw-ring-inset:var(--tw-empty,/*!*/ /*!*/);--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59, 130, 246, 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000}:root{-moz-tab-size:4;-o-tab-size:4;tab-size:4}:-moz-focusring{outline:1px dotted ButtonText}:-moz-ui-invalid{box-shadow:none}::moz-focus-inner{border-style:none;padding:0}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}[type='search']{-webkit-appearance:textfield;outline-offset:-2px}abbr[title]{-webkit-text-decoration:underline dotted;text-decoration:underline dotted}body{margin:0;font-family:inherit;line-height:inherit}html{-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";line-height:1.5}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:1.15;margin:0;padding:0;line-height:inherit;color:inherit}button,select{text-transform:none}button,[type='button'],[type='reset'],[type='submit']{-webkit-appearance:button}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}button{background-color:transparent;background-image:none}button:focus{outline:1px dotted;outline:5px auto -webkit-focus-ring-color}button,[role="button"]{cursor:pointer}code,kbd,samp,pre{font-size:1em}fieldset{margin:0;padding:0}hr{height:0;color:inherit;border-top-width:1px}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}img{border-style:solid}input::placeholder{opacity:1;color:#9ca3af}input::webkit-input-placeholder{opacity:1;color:#9ca3af}input::-moz-placeholder{opacity:1;color:#9ca3af}input:-ms-input-placeholder{opacity:1;color:#9ca3af}input::-ms-input-placeholder{opacity:1;color:#9ca3af}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}legend{padding:0}ol,ul{list-style:none;margin:0;padding:0}progress{vertical-align:baseline}pre,code,kbd,samp{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-0.25em}sup{top:-0.5em}summary{display:list-item}table{text-indent:0;border-color:inherit;border-collapse:collapse}textarea{resize:vertical}textarea::placeholder{opacity:1;color:#9ca3af}textarea::webkit-input-placeholder{opacity:1;color:#9ca3af}textarea::-moz-placeholder{opacity:1;color:#9ca3af}textarea:-ms-input-placeholder{opacity:1;color:#9ca3af}textarea::-ms-input-placeholder{opacity:1;color:#9ca3af}`,
      map: null
    };
    _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css);
      return `${validate_component(Googletag, "Googletag").$$render($$result, {}, {}, {})}
${validate_component(Nav, "Nav").$$render($$result, {}, {}, {})}

${slots.default ? slots.default({}) : ``}
${validate_component(Dropdown, "Dropdown").$$render($$result, {}, {}, {})}
${validate_component(TheFooter, "TheFooter").$$render($$result, {}, {}, {})}`;
    });
  }
});

// .svelte-kit/output/server/chunks/error-54b317dd.js
var error_54b317dd_exports = {};
__export(error_54b317dd_exports, {
  default: () => Error2,
  load: () => load
});
function load({ error: error2, status }) {
  return { props: { error: error2, status } };
}
var Error2;
var init_error_54b317dd = __esm({
  ".svelte-kit/output/server/chunks/error-54b317dd.js"() {
    init_shims();
    init_app_412ff39b();
    init_ssr();
    Error2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let { status } = $$props;
      let { error: error2 } = $$props;
      if ($$props.status === void 0 && $$bindings.status && status !== void 0)
        $$bindings.status(status);
      if ($$props.error === void 0 && $$bindings.error && error2 !== void 0)
        $$bindings.error(error2);
      return `<h1>${escape2(status)}</h1>

<pre>${escape2(error2.message)}</pre>



${error2.frame ? `<pre>${escape2(error2.frame)}</pre>` : ``}
${error2.stack ? `<pre>${escape2(error2.stack)}</pre>` : ``}`;
    });
  }
});

// .svelte-kit/output/server/chunks/index-a56c0cab.js
var index_a56c0cab_exports = {};
__export(index_a56c0cab_exports, {
  default: () => Routes,
  prerender: () => prerender
});
var css2, prerender, Routes;
var init_index_a56c0cab = __esm({
  ".svelte-kit/output/server/chunks/index-a56c0cab.js"() {
    init_shims();
    init_app_412ff39b();
    init_ssr();
    css2 = {
      code: ".one.svelte-f3km4q{text-align:center;margin-top:50px;margin-left:100px;margin-right:100px}.h-96.svelte-f3km4q{height:24rem}.text-6xl.svelte-f3km4q{font-size:3.75rem;line-height:1}.text-3xl.svelte-f3km4q{font-size:1.875rem;line-height:2.25rem}.text-xl.svelte-f3km4q{font-size:1.25rem;line-height:1.75rem}.object-fill.svelte-f3km4q{-o-object-fit:fill;object-fit:fill}.p-4.svelte-f3km4q{padding:1rem}.text-left.svelte-f3km4q{text-align:left}.text-center.svelte-f3km4q{text-align:center}.text-purple-500.svelte-f3km4q{--tw-text-opacity:1;color:rgba(139, 92, 246, var(--tw-text-opacity))}.text-purple-400.svelte-f3km4q{--tw-text-opacity:1;color:rgba(167, 139, 250, var(--tw-text-opacity))}.text-gray-600.svelte-f3km4q{--tw-text-opacity:1;color:rgba(75, 85, 99, var(--tw-text-opacity))}.w-full.svelte-f3km4q{width:100%}.gap-4.svelte-f3km4q{grid-gap:1rem;gap:1rem}.grid-cols-2.svelte-f3km4q{grid-template-columns:repeat(2, minmax(0, 1fr))}@media(min-width: 640px){.sm\\:grid.svelte-f3km4q{display:-ms-grid;display:grid}}@media(min-width: 768px){.md\\:grid.svelte-f3km4q{display:-ms-grid;display:grid}}",
      map: null
    };
    prerender = true;
    Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css2);
      return `${$$result.head += `${$$result.title = `<title>Family History</title>`, ""}`, ""}

<section class="${"one svelte-f3km4q"}"><h1 class="${"text-center text-purple-500 text-font-sans text-6xl svelte-f3km4q"}">Welcome to Family History Tips
	</h1>
	<p class="${"text-center text-purple-400 text-font-sans text-3xl svelte-f3km4q"}">Informing you on what information is available and where to find them.
	</p>
	<br>

	<div class="${"sm:grid cols-1 md:grid grid-cols-2 gap-4 svelte-f3km4q"}"><div><img class="${"h-96 w-full object-fill p-4 svelte-f3km4q"}" src="${"/images/logotreerobin.svg"}" alt="${"logo"}"></div>
		<div><ul class="${"text-left text-gray-600 text-font-sans text-xl p-4 svelte-f3km4q"}"><li>Births records</li>
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

// .svelte-kit/output/server/chunks/netherlands-j-94f7c340.js
var netherlands_j_94f7c340_exports = {};
__export(netherlands_j_94f7c340_exports, {
  default: () => Netherlands_j,
  prerender: () => prerender2
});
var css$52, Sephardic99, css$42, Joods99, css$32, Cemeteries99, css$22, Amst99, css$12, Akevoth99, css3, prerender2, Netherlands_j;
var init_netherlands_j_94f7c340 = __esm({
  ".svelte-kit/output/server/chunks/netherlands-j-94f7c340.js"() {
    init_shims();
    init_app_412ff39b();
    init_ssr();
    css$52 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Sephardic99 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$52);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Sephardic Gen</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639135750/webp/star.webp"}" alt="${"image star of david"}">
		<br>
		<p>Sephardic <br>Netherlands resources.</p>
		<br>
		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2EV62gi"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$42 = {
      code: ".rounded-lg.svelte-1r9rxbf{border-radius:0.5rem}.h-full.svelte-1r9rxbf{height:100%}.text-2xl.svelte-1r9rxbf{font-size:1.5rem;line-height:2rem}.m-4.svelte-1r9rxbf{margin:1rem}.object-fill.svelte-1r9rxbf{-o-object-fit:fill;object-fit:fill}.p-4.svelte-1r9rxbf{padding:1rem}.p-6.svelte-1r9rxbf{padding:1.5rem}.shadow-2xl.svelte-1r9rxbf{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-1r9rxbf{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-1r9rxbf:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-1r9rxbf{width:auto}.w-50.svelte-1r9rxbf{width:12.5rem}",
      map: null
    };
    Joods99 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$42);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-1r9rxbf"}"><div class="${"p-6 svelte-1r9rxbf"}"><h1 class="${"text-2xl text-white svelte-1r9rxbf"}">Joods Monument</h1>

		<iframe class="${"h-full w-50 object-fill svelte-1r9rxbf"}" title="${"candle flame"}" src="${"https://giphy.com/embed/j7N0GKEWqZxNC"}" frameborder="${"0"}" allow="${"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"}" allowfullscreen></iframe>

		<br>
		<p>Search The Holocaust <br>Victims Momorial.</p>
		<br>
		<a class="${"text-white hover:text-yellow-500 svelte-1r9rxbf"}" href="${"http://bit.ly/2Sr3Chj"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$32 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Cemeteries99 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$32);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Cemeteries</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639050305/webp/jewish-graves.webp"}" alt="${"image of a jewish grave yard"}">
		<br>
		<p>Ashkenazi<br> Cemetery Records.</p>
		<br>
		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/2I6tf3L"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$22 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Amst99 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$22);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Amsterdam</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638859747/webp/database.webp"}" alt="${"image of a database"}">
		<br>
		<p>Amsterdam <br>Resident Records<br> 1852-1853.</p>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/2XuWgMi"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$12 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Akevoth99 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$12);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Akevoth</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638859747/webp/database.webp"}" alt="${"image of a database"}">
		<br>
		<p>Dutch Jewry<br>
			Searchable Database.
		</p>
		<br>
		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/2UYxAKC"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css3 = {
      code: ".inline-block.svelte-g219g3{display:inline-block}.grid.svelte-g219g3{display:-ms-grid;display:grid}.h-10.svelte-g219g3{height:2.5rem}.text-4xl.svelte-g219g3{font-size:2.25rem;line-height:2.5rem}.ml-8.svelte-g219g3{margin-left:2rem}.mt-3.svelte-g219g3{margin-top:0.75rem}.mt-20.svelte-g219g3{margin-top:5rem}.mt-8.svelte-g219g3{margin-top:2rem}.text-center.svelte-g219g3{text-align:center}.text-purple-500.svelte-g219g3{--tw-text-opacity:1;color:rgba(139, 92, 246, var(--tw-text-opacity))}.w-14.svelte-g219g3{width:3.5rem}.gap-4.svelte-g219g3{grid-gap:1rem;gap:1rem}@media(min-width: 640px){.sm\\:flex.svelte-g219g3{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}}",
      map: null
    };
    prerender2 = true;
    Netherlands_j = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css3);
      return `${$$result.head += `${$$result.title = `<title>Netherlands Jewish</title>`, ""}`, ""}
<section class="${"one"}"><h1 class="${"ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl svelte-g219g3"}"><div class="${"h-10 w-14 inline-block svelte-g219g3"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638904035/webp/netherlands-flag.webp"}" alt="${"image of netherlands flag"}"></div>
		<div class="${"h-10 w-14 inline-block svelte-g219g3"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639135750/webp/star.webp"}" alt="${"image of star of david"}"></div>
		Netherlands Jewish Family History Resourses
	</h1>
	<br>
	<section class="${"one"}"><div class="${"grid sm:flex gap-4 mt-20  svelte-g219g3"}">${validate_component(Akevoth99, "Akevoth99").$$render($$result, {}, {}, {})}
			${validate_component(Amst99, "Amst99").$$render($$result, {}, {}, {})}
			${validate_component(Cemeteries99, "Cemeteries99").$$render($$result, {}, {}, {})}</div>

		<div class="${"grid sm:flex gap-4 mt-8  svelte-g219g3"}">${validate_component(Joods99, "Joods99").$$render($$result, {}, {}, {})}
            ${validate_component(Sephardic99, "Sephardic99").$$render($$result, {}, {}, {})}</div></section>
</section>`;
    });
  }
});

// .svelte-kit/output/server/chunks/australia-j-c4485f82.js
var australia_j_c4485f82_exports = {};
__export(australia_j_c4485f82_exports, {
  default: () => Australia_j,
  prerender: () => prerender3
});
var css$23, Society99, css$13, Historical99, css4, prerender3, Australia_j;
var init_australia_j_c4485f82 = __esm({
  ".svelte-kit/output/server/chunks/australia-j-c4485f82.js"() {
    init_shims();
    init_app_412ff39b();
    init_ssr();
    css$23 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Society99 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$23);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Genealogical Society</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638861228/webp/family-tree.webp"}" alt="${"image of a family tree"}">
		<br>
		<p>Jewish Genealogical<br> Society<br> New South Wales, <br>Northern Territory<br> and Queensland.
		</p>
		<br>
		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2rjNUpk"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$13 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Historical99 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$13);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Historical Society</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638859747/webp/database.webp"}" alt="${"image of a database"}">
		<br>
		<p>Search Jewish <br>Genealogical records</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3q93Ecm"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css4 = {
      code: ".inline-block.svelte-aztiwm{display:inline-block}.grid.svelte-aztiwm{display:-ms-grid;display:grid}.h-10.svelte-aztiwm{height:2.5rem}.text-4xl.svelte-aztiwm{font-size:2.25rem;line-height:2.5rem}.ml-8.svelte-aztiwm{margin-left:2rem}.mt-3.svelte-aztiwm{margin-top:0.75rem}.mt-20.svelte-aztiwm{margin-top:5rem}.text-center.svelte-aztiwm{text-align:center}.text-purple-500.svelte-aztiwm{--tw-text-opacity:1;color:rgba(139, 92, 246, var(--tw-text-opacity))}.w-14.svelte-aztiwm{width:3.5rem}.gap-4.svelte-aztiwm{grid-gap:1rem;gap:1rem}@media(min-width: 640px){.sm\\:flex.svelte-aztiwm{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}}",
      map: null
    };
    prerender3 = true;
    Australia_j = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css4);
      return `${$$result.head += `${$$result.title = `<title>Australia Jewish</title>`, ""}`, ""}

<section class="${"one"}"><h1 class="${"ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl svelte-aztiwm"}"><div class="${"h-10 w-14 inline-block svelte-aztiwm"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638860154/webp/australia-flag.webp"}" alt="${"image of australian flag"}"></div>
		<div class="${"h-10 w-14 inline-block svelte-aztiwm"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639135750/webp/star.webp"}" alt="${"image of star of david"}"></div>
		Australian Jewish Family History Resourses
	</h1>
	<br>
	<section class="${"one"}"><div class="${"grid sm:flex gap-4 mt-20 svelte-aztiwm"}">${validate_component(Society99, "Society99").$$render($$result, {}, {}, {})}
			${validate_component(Historical99, "Historical99").$$render($$result, {}, {}, {})}</div></section>
</section>`;
    });
  }
});

// .svelte-kit/output/server/chunks/netherlands-ee254b2a.js
var netherlands_ee254b2a_exports = {};
__export(netherlands_ee254b2a_exports, {
  default: () => Netherlands,
  prerender: () => prerender4
});
var css$43, Wie, css$33, Open, css$24, Roots, css$14, Amsterdam, css5, prerender4, Netherlands;
var init_netherlands_ee254b2a = __esm({
  ".svelte-kit/output/server/chunks/netherlands-ee254b2a.js"() {
    init_shims();
    init_app_412ff39b();
    init_ssr();
    css$43 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Wie = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$43);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Wie Was Wie</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638859747/webp/database.webp"}" alt="${"archive photo"}">
		<br>
		<p>Database contains over<br> 205 million people</p>
		<br>
		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2sc4OL3"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$33 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Open = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$33);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Open Archives</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1618762256/archives_nndpbn.jpg"}" alt="${"archive photo"}">
		<br>
		<p>Search Dutch <br>&amp; Belgian archives</p>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3et9OP4"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$24 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Roots = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$24);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Dutch Roots</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638861228/webp/family-tree.webp"}" alt="${"family tree photo"}">
		<br>
		<p>Dutch genealogy guide.</p>
		<br>
		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2SrGK17"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$14 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Amsterdam = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$14);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Amsterdam</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638904959/webp/amsterdam.webp"}" alt="${"Amsterdam photo town hall"}">
		<br>
		<p>Amsterdam city archives</p>
		<br>
		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3eweJi3"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css5 = {
      code: ".inline-block.svelte-g219g3{display:inline-block}.grid.svelte-g219g3{display:-ms-grid;display:grid}.h-10.svelte-g219g3{height:2.5rem}.text-4xl.svelte-g219g3{font-size:2.25rem;line-height:2.5rem}.ml-8.svelte-g219g3{margin-left:2rem}.mt-3.svelte-g219g3{margin-top:0.75rem}.mt-20.svelte-g219g3{margin-top:5rem}.mt-8.svelte-g219g3{margin-top:2rem}.text-center.svelte-g219g3{text-align:center}.text-purple-500.svelte-g219g3{--tw-text-opacity:1;color:rgba(139, 92, 246, var(--tw-text-opacity))}.w-14.svelte-g219g3{width:3.5rem}.gap-4.svelte-g219g3{grid-gap:1rem;gap:1rem}@media(min-width: 640px){.sm\\:flex.svelte-g219g3{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}}",
      map: null
    };
    prerender4 = true;
    Netherlands = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css5);
      return `${$$result.head += `${$$result.title = `<title>Netherlands</title>`, ""}`, ""}

<section class="${"one"}"><h1 class="${"ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl svelte-g219g3"}"><div class="${"h-10 w-14 inline-block svelte-g219g3"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638904035/webp/netherlands-flag.webp"}" alt="${"image of netherlands flag"}"></div>

		Netherlands Family History Resourses
	</h1>
	<br>
	<section class="${"one"}"><div class="${"grid sm:flex gap-4 mt-20 svelte-g219g3"}">${validate_component(Amsterdam, "Amsterdam").$$render($$result, {}, {}, {})}
			${validate_component(Roots, "Roots").$$render($$result, {}, {}, {})}
			${validate_component(Open, "Open").$$render($$result, {}, {}, {})}</div>

		<div class="${"grid sm:flex gap-4 mt-8 svelte-g219g3"}">${validate_component(Wie, "Wie").$$render($$result, {}, {}, {})}</div></section>
</section>`;
    });
  }
});

// .svelte-kit/output/server/chunks/austrian-j-711f7827.js
var austrian_j_711f7827_exports = {};
__export(austrian_j_711f7827_exports, {
  default: () => Austrian_j,
  prerender: () => prerender5
});
var css$44, Community99, css$34, Buried99, css$25, Weddings99, css$15, Birth99, css6, prerender5, Austrian_j;
var init_austrian_j_711f7827 = __esm({
  ".svelte-kit/output/server/chunks/austrian-j-711f7827.js"() {
    init_shims();
    init_app_412ff39b();
    init_ssr();
    css$44 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Community99 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$44);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Turkish</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638859747/webp/database.webp"}" alt="${"image of a database"}">
		<br>
		<p>Search the Vienna<br>
			Turkish Community<br> of Vienna<br>1788-1818
		</p>
		<br>
		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3ybOZS2"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$34 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Buried99 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$34);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Vienna Cemetery</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639050305/webp/jewish-graves.webp"}" alt="${"image of jewish cemetary"}">
		<br>
		<p>Search the Vienna<br> cemetery database</p>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3pN78l4"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$25 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Weddings99 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$25);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Vienna Weddings</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639077916/webp/wedding.webp"}" alt="${"images of jewish wedding"}">
		<br>
		<p>Search the Vienna <br>Turkish community
			<br>1845-1938 <br>Weddings Register
		</p>
		<br>
		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/34OVZaa"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$15 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Birth99 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$15);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Vienna Birth</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639077195/webp/britmila.webp"}" alt="${"austria flag"}">
		<br>
		<p>Search the Vienna <br>Turkish community
			<br>1845-1938 <br>Births Register
		</p>
		<br>
		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/34OVZaa"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css6 = {
      code: ".inline-block.svelte-g219g3{display:inline-block}.grid.svelte-g219g3{display:-ms-grid;display:grid}.h-10.svelte-g219g3{height:2.5rem}.text-4xl.svelte-g219g3{font-size:2.25rem;line-height:2.5rem}.ml-8.svelte-g219g3{margin-left:2rem}.mt-3.svelte-g219g3{margin-top:0.75rem}.mt-20.svelte-g219g3{margin-top:5rem}.mt-8.svelte-g219g3{margin-top:2rem}.text-center.svelte-g219g3{text-align:center}.text-purple-500.svelte-g219g3{--tw-text-opacity:1;color:rgba(139, 92, 246, var(--tw-text-opacity))}.w-14.svelte-g219g3{width:3.5rem}.gap-4.svelte-g219g3{grid-gap:1rem;gap:1rem}@media(min-width: 640px){.sm\\:flex.svelte-g219g3{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}}",
      map: null
    };
    prerender5 = true;
    Austrian_j = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css6);
      return `${$$result.head += `${$$result.title = `<title>Austrian Jewish</title>`, ""}`, ""}

<section class="${"one"}"><h1 class="${"ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl svelte-g219g3"}"><div class="${"h-10 w-14 inline-block svelte-g219g3"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638876704/webp/austria-flag.webp"}" alt="${"image of Austrian flag"}"></div>
		<div class="${"h-10 w-14 inline-block svelte-g219g3"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639135750/webp/star.webp"}" alt="${"image of star of david"}"></div>

		Austrian Jewish Family History Resourses
	</h1>
	<br>
	<section class="${"one"}"><div class="${"grid sm:flex gap-4 mt-20 svelte-g219g3"}">${validate_component(Birth99, "Birth99").$$render($$result, {}, {}, {})}
			${validate_component(Weddings99, "Weddings99").$$render($$result, {}, {}, {})}
			${validate_component(Buried99, "Buried99").$$render($$result, {}, {}, {})}</div>

		<div class="${"grid sm:flex gap-4 mt-8 svelte-g219g3"}">${validate_component(Community99, "Community99").$$render($$result, {}, {}, {})}</div></section>
</section>`;
    });
  }
});

// .svelte-kit/output/server/chunks/newzealand-e201bb48.js
var newzealand_e201bb48_exports = {};
__export(newzealand_e201bb48_exports, {
  default: () => Newzealand,
  prerender: () => prerender6
});
var css$53, State, css$45, Historical, css$35, Gazette, css$26, Companies, css$16, Auckland, css7, prerender6, Newzealand;
var init_newzealand_e201bb48 = __esm({
  ".svelte-kit/output/server/chunks/newzealand-e201bb48.js"() {
    init_shims();
    init_app_412ff39b();
    init_ssr();
    css$53 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    State = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$53);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">State Archives</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638860017/webp/archives.webp"}" alt="${"image of archives"}">
		<br>
		<p>New Zealand <br>State archives.</p>
		<br><br>
		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2xItUAd"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$45 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Historical = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$45);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Historical Records</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638866306/webp/nz-birth-cert_sq0auz.webp"}" alt="${"image of newzealand birth cerificates"}">
		<br>
		<ul><li>Births over 100 year&#39;s</li>
			<li>Marriages over 80 year&#39;s</li>
			<li>Deaths over 50 year&#39;s</li></ul>

		<br>
		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2I57AYi"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$35 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Gazette = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$35);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Gazette</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638866148/webp/nz-gazette_hsw9oq.webp"}" alt="${"image of new zealand gazette logo"}">
		<br>
		<p>Search the The official<br> Government newspaper<br> published since 1841</p>
		<br>
		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2Kvu3vP"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$26 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Companies = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$26);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Companies Register
      </h1>

      <img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638865999/webp/business.webp"}" alt="${"image of a business man"}">
      <br>
     <p>Search companies and<br> director&#39;s information</p>

      <br><br>
      <a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2FAOF2j"}" target="${"_blank"}">Go to The Website
      </a></div>
  </div>`;
    });
    css$16 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Auckland = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$16);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Auckland</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638865899/webp/graves_tu2we0.webp"}" alt="${"image of graves"}">
		<br>
		<p>Auckland burial and <br>cremation records.</p>
		<br><br>
		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3fvRLYO"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css7 = {
      code: ".one.svelte-1nupwvf{text-align:center;margin-top:50px;margin-left:100px;margin-right:100px}.inline-block.svelte-1nupwvf{display:inline-block}.grid.svelte-1nupwvf{display:-ms-grid;display:grid}.h-10.svelte-1nupwvf{height:2.5rem}.text-4xl.svelte-1nupwvf{font-size:2.25rem;line-height:2.5rem}.ml-8.svelte-1nupwvf{margin-left:2rem}.mt-3.svelte-1nupwvf{margin-top:0.75rem}.mt-20.svelte-1nupwvf{margin-top:5rem}.mt-8.svelte-1nupwvf{margin-top:2rem}.text-center.svelte-1nupwvf{text-align:center}.text-purple-500.svelte-1nupwvf{--tw-text-opacity:1;color:rgba(139, 92, 246, var(--tw-text-opacity))}.w-14.svelte-1nupwvf{width:3.5rem}.gap-4.svelte-1nupwvf{grid-gap:1rem;gap:1rem}@media(min-width: 640px){.sm\\:flex.svelte-1nupwvf{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}}",
      map: null
    };
    prerender6 = true;
    Newzealand = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css7);
      return `${$$result.head += `${$$result.title = `<title>New Zealand</title>`, ""}`, ""}

<section class="${"one svelte-1nupwvf"}"><h1 class="${"ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl svelte-1nupwvf"}"><div class="${"h-10 w-14 inline-block svelte-1nupwvf"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638865677/webp/newzealand-flag.webp"}" alt="${"image of new zealand flag"}"></div>
		
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

// .svelte-kit/output/server/chunks/australia-fc37a15f.js
var australia_fc37a15f_exports = {};
__export(australia_fc37a15f_exports, {
  default: () => Australia,
  prerender: () => prerender7
});
var css$27, Ausstate, css$17, Gen, css8, prerender7, Australia;
var init_australia_fc37a15f = __esm({
  ".svelte-kit/output/server/chunks/australia-fc37a15f.js"() {
    init_shims();
    init_app_412ff39b();
    init_ssr();
    css$27 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Ausstate = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$27);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">State Archives</h1>
		<div><img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638860017/webp/archives.webp"}" alt="${"australia archives"}"></div>
		<br>
		<p>Australian State Archives</p>
		<br><br><br>
		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3fpAQHh"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$17 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Gen = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$17);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Genealogy SA</h1>
		<div><img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638859747/webp/database.webp"}" alt="${"image of database"}"></div>
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
    css8 = {
      code: ".one.svelte-10wioxk{text-align:center;margin-top:50px;margin-left:100px;margin-right:100px}.inline-block.svelte-10wioxk{display:inline-block}.grid.svelte-10wioxk{display:-ms-grid;display:grid}.h-10.svelte-10wioxk{height:2.5rem}.text-4xl.svelte-10wioxk{font-size:2.25rem;line-height:2.5rem}.ml-8.svelte-10wioxk{margin-left:2rem}.mt-3.svelte-10wioxk{margin-top:0.75rem}.mt-20.svelte-10wioxk{margin-top:5rem}.text-center.svelte-10wioxk{text-align:center}.text-purple-500.svelte-10wioxk{--tw-text-opacity:1;color:rgba(139, 92, 246, var(--tw-text-opacity))}.w-14.svelte-10wioxk{width:3.5rem}.gap-4.svelte-10wioxk{grid-gap:1rem;gap:1rem}@media(min-width: 640px){.sm\\:flex.svelte-10wioxk{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}}",
      map: null
    };
    prerender7 = true;
    Australia = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css8);
      return `${$$result.head += `${$$result.title = `<title>Australia</title>`, ""}`, ""}

<section class="${"one svelte-10wioxk"}"><h1 class="${"ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl svelte-10wioxk"}"><div class="${"h-10 w-14 inline-block svelte-10wioxk"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638860154/webp/australia-flag.webp"}" alt="${"image of australian flag"}"></div>
		Australian Family History Resourses
	</h1>
	<br>

	<div class="${"grid sm:flex gap-4 mt-20 one svelte-10wioxk"}">${validate_component(Gen, "Gen").$$render($$result, {}, {}, {})}
		${validate_component(Ausstate, "Ausstate").$$render($$result, {}, {}, {})}</div>
</section>`;
    });
  }
});

// .svelte-kit/output/server/chunks/belarus-j-119830d5.js
var belarus_j_119830d5_exports = {};
__export(belarus_j_119830d5_exports, {
  default: () => Belarus_j,
  prerender: () => prerender8
});
var css$46, Mogilev99, css$36, Resources99, css$28, Sig99, css$18, Weiner99, css9, prerender8, Belarus_j;
var init_belarus_j_119830d5 = __esm({
  ".svelte-kit/output/server/chunks/belarus-j-119830d5.js"() {
    init_shims();
    init_app_412ff39b();
    init_ssr();
    css$46 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Mogilev99 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$46);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Mogilev Gubernia</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639150268/webp/mogilev_arms.webp"}" alt="${"image of mogilev coat of arms"}">
		<br>
		<p>Search the records<br> Mogilev Gubernia
		</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/38hQT7K"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$36 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Resources99 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$36);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Jewish Belarus</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639135750/webp/star.webp"}" alt="${"image of star of david"}">
		<br>
		<p>Links to Belarus<br> jewish resources.</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2KximVD"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$28 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Sig99 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$28);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Belarus SIG</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639149225/webp/belarus-map.webp"}" alt="${"belarus map"}">
		<br>
		<p>Belarus<br>
			Jewish communities.
		</p>
		<br>
		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3859S6a"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$18 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Weiner99 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$18);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Miriam Weiner</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638859747/webp/database.webp"}" alt="${"image of a database"}">
		<br>
		<p>Search free<br> the Belarus database</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2KvCmrA"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css9 = {
      code: ".inline-block.svelte-g219g3{display:inline-block}.grid.svelte-g219g3{display:-ms-grid;display:grid}.h-10.svelte-g219g3{height:2.5rem}.text-4xl.svelte-g219g3{font-size:2.25rem;line-height:2.5rem}.ml-8.svelte-g219g3{margin-left:2rem}.mt-3.svelte-g219g3{margin-top:0.75rem}.mt-20.svelte-g219g3{margin-top:5rem}.mt-8.svelte-g219g3{margin-top:2rem}.text-center.svelte-g219g3{text-align:center}.text-purple-500.svelte-g219g3{--tw-text-opacity:1;color:rgba(139, 92, 246, var(--tw-text-opacity))}.w-14.svelte-g219g3{width:3.5rem}.gap-4.svelte-g219g3{grid-gap:1rem;gap:1rem}@media(min-width: 640px){.sm\\:flex.svelte-g219g3{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}}",
      map: null
    };
    prerender8 = true;
    Belarus_j = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css9);
      return `${$$result.head += `${$$result.title = `<title>Belarus Jewish</title>`, ""}`, ""}
<section class="${"one"}"><h1 class="${"ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl svelte-g219g3"}"><div class="${"h-10 w-14 inline-block svelte-g219g3"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638877031/webp/belarus-flag.webp"}" alt="${"image of Belarus flag"}"></div>
		<div class="${"h-10 w-14 inline-block svelte-g219g3"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639135750/webp/star.webp"}" alt="${"image of star of david"}"></div>
		Belarus Jewish Family History Resourses
	</h1>
	<br>
	<section class="${"one"}"><div class="${"grid sm:flex gap-4 mt-20 one svelte-g219g3"}">${validate_component(Weiner99, "Weiner99").$$render($$result, {}, {}, {})}
			${validate_component(Sig99, "Sig99").$$render($$result, {}, {}, {})}
			${validate_component(Resources99, "Resources99").$$render($$result, {}, {}, {})}</div>

		<div class="${"grid sm:flex gap-4 mt-8 one svelte-g219g3"}">${validate_component(Mogilev99, "Mogilev99").$$render($$result, {}, {}, {})}</div></section>
</section>`;
    });
  }
});

// .svelte-kit/output/server/chunks/british-j-fbd600ff.js
var british_j_fbd600ff_exports = {};
__export(british_j_fbd600ff_exports, {
  default: () => British_j,
  prerender: () => prerender9
});
var css$l, Western, css$k, United, css$j, Liberal, css$i, Federation, css$h, Adath, css$g, Glasgow99, css$f, Scotland99, css$e, Gilroes99, css$d, Eighteenfiftyone99, css$c, Fifty, css$b, Synagogue99, css$a, Scribes99, css$92, Honour99, css$82, Jraf99, css$72, Marriage99, css$62, War99, css$54, Roots99, css$47, School99, css$37, Jcr99, css$29, Chronicle99, css$19, Commercial99, css10, prerender9, British_j;
var init_british_j_fbd600ff = __esm({
  ".svelte-kit/output/server/chunks/british-j-fbd600ff.js"() {
    init_shims();
    init_app_412ff39b();
    init_ssr();
    css$l = {
      code: ".bg-gray-100.svelte-6g40xv{--tw-bg-opacity:1;background-color:rgba(243, 244, 246, var(--tw-bg-opacity))}.rounded-lg.svelte-6g40xv{border-radius:0.5rem}.border.svelte-6g40xv{border-width:1px}.m-4.svelte-6g40xv{margin:1rem}.overflow-auto.svelte-6g40xv{overflow:auto}.p-4.svelte-6g40xv{padding:1rem}.px-4.svelte-6g40xv{padding-left:1rem;padding-right:1rem}.py-2.svelte-6g40xv{padding-top:0.5rem;padding-bottom:0.5rem}.shadow-2xl.svelte-6g40xv{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.table-auto.svelte-6g40xv{table-layout:auto}.text-left.svelte-6g40xv{text-align:left}.text-white.svelte-6g40xv{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-6g40xv:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-6g40xv{width:auto}",
      map: null
    };
    Western = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$l);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl overflow-auto svelte-6g40xv"}"><table class="${"table-auto overflow-auto text-left svelte-6g40xv"}"><thead><a class="${"text-white hover:text-yellow-500 svelte-6g40xv"}" href="${"https://bit.ly/3nxSFXO"}" target="${"_blank"}">Western
			</a>

			<br>
			<a class="${"text-white hover:text-yellow-500 svelte-6g40xv"}" href="${"https://bit.ly/38PegH1"}" target="${"_blank"}">Burial Records
			</a>

			<tr><th class="${"px-4 py-2 svelte-6g40xv"}">Cemetery</th>
				<th class="${"px-4 py-2 svelte-6g40xv"}">Address</th>
				<th class="${"px-4 py-2 svelte-6g40xv"}">Year Opened</th></tr></thead>
		<tbody><tr><td class="${"border px-4 py-2 svelte-6g40xv"}">Cheshunt</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">Bullscross Ride</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">1968</td></tr>
			<tr class="${"bg-gray-100 svelte-6g40xv"}"><td class="${"border px-4 py-2 svelte-6g40xv"}">Edmonton</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">Montague Road</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">1889</td></tr>
			<tr><td class="${"border px-4 py-2 svelte-6g40xv"}">Fulham</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">Fulham Road</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">1815</td></tr>

			<tr class="${"bg-gray-100 svelte-6g40xv"}"><td class="${"border px-4 py-2 svelte-6g40xv"}">Streatham</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">Rowan Road</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">1915</td></tr></tbody></table>
</div>`;
    });
    css$k = {
      code: ".bg-gray-100.svelte-6g40xv{--tw-bg-opacity:1;background-color:rgba(243, 244, 246, var(--tw-bg-opacity))}.rounded-lg.svelte-6g40xv{border-radius:0.5rem}.border.svelte-6g40xv{border-width:1px}.m-4.svelte-6g40xv{margin:1rem}.overflow-auto.svelte-6g40xv{overflow:auto}.p-4.svelte-6g40xv{padding:1rem}.px-4.svelte-6g40xv{padding-left:1rem;padding-right:1rem}.py-2.svelte-6g40xv{padding-top:0.5rem;padding-bottom:0.5rem}.shadow-2xl.svelte-6g40xv{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.table-auto.svelte-6g40xv{table-layout:auto}.text-left.svelte-6g40xv{text-align:left}.text-white.svelte-6g40xv{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-6g40xv:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-6g40xv{width:auto}",
      map: null
    };
    United = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$k);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl overflow-auto svelte-6g40xv"}"><table class="${"table-auto overflow-auto text-left svelte-6g40xv"}"><thead><a class="${"text-white hover:text-yellow-500 svelte-6g40xv"}" href="${"http://bit.ly/32festd"}" target="${"_blank"}">United
			</a>

			<br>

			<a class="${"text-white hover:text-yellow-500 svelte-6g40xv"}" href="${"http://bit.ly/2JfWwHn"}" target="${"_blank"}">Burial Records
			</a>

			<tr><th class="${"px-4 py-2 svelte-6g40xv"}">Cemetery</th>
				<th class="${"px-4 py-2 svelte-6g40xv"}">Address</th>
				<th class="${"px-4 py-2 svelte-6g40xv"}">Year Opened</th></tr></thead>
		<tbody><tr><td class="${"border px-4 py-2 svelte-6g40xv"}">Alderney</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">Alderny Road</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">1697</td></tr>
			<tr class="${"bg-gray-100 svelte-6g40xv"}"><td class="${"border px-4 py-2 svelte-6g40xv"}">Aldershot</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">Redan Road</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">1864</td></tr>
			<tr><td class="${"border px-4 py-2 svelte-6g40xv"}">Brady</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">Brady Street</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">1761</td></tr>

			<tr class="${"bg-gray-100 svelte-6g40xv"}"><td class="${"border px-4 py-2 svelte-6g40xv"}">Bushey</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">Little Bushey Lane</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">1947</td></tr>
			<tr><td class="${"border px-4 py-2 svelte-6g40xv"}">Dover</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">Old Charlton Road</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">1868</td></tr>

			<tr class="${"bg-gray-100 svelte-6g40xv"}"><td class="${"border px-4 py-2 svelte-6g40xv"}">East Ham</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">Marlow Road</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">1919</td></tr>
			<tr><td class="${"border px-4 py-2 svelte-6g40xv"}">Eretz Hachaim</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">Jerusalem</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}"></td></tr>

			<tr class="${"bg-gray-100 svelte-6g40xv"}"><td class="${"border px-4 py-2 svelte-6g40xv"}">Hackney</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">Lauriston Road</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">1788</td></tr>
			<tr><td class="${"border px-4 py-2 svelte-6g40xv"}">Plashet</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">High Street North</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">1896</td></tr>

			<tr class="${"bg-gray-100 svelte-6g40xv"}"><td class="${"border px-4 py-2 svelte-6g40xv"}">Sheffield</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">Colley Road</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">1931</td></tr>
			<tr><td class="${"border px-4 py-2 svelte-6g40xv"}">Waltham Abbey</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">Skillet Hill Honey Lane</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">1960</td></tr>

			<tr class="${"bg-gray-100 svelte-6g40xv"}"><td class="${"border px-4 py-2 svelte-6g40xv"}">West Ham</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">Buckingham Road</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">1857</td></tr>
			<tr><td class="${"border px-4 py-2 svelte-6g40xv"}">Willesden</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">Beaconsfield Road</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">1873</td></tr></tbody></table>
</div>`;
    });
    css$j = {
      code: ".bg-gray-100.svelte-6g40xv{--tw-bg-opacity:1;background-color:rgba(243, 244, 246, var(--tw-bg-opacity))}.rounded-lg.svelte-6g40xv{border-radius:0.5rem}.border.svelte-6g40xv{border-width:1px}.m-4.svelte-6g40xv{margin:1rem}.overflow-auto.svelte-6g40xv{overflow:auto}.p-4.svelte-6g40xv{padding:1rem}.px-4.svelte-6g40xv{padding-left:1rem;padding-right:1rem}.py-2.svelte-6g40xv{padding-top:0.5rem;padding-bottom:0.5rem}.shadow-2xl.svelte-6g40xv{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.table-auto.svelte-6g40xv{table-layout:auto}.text-left.svelte-6g40xv{text-align:left}.text-white.svelte-6g40xv{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-6g40xv:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-6g40xv{width:auto}",
      map: null
    };
    Liberal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$j);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl overflow-auto svelte-6g40xv"}"><table class="${"table-auto overflow-auto text-left svelte-6g40xv"}"><thead><a class="${"text-white hover:text-yellow-500 svelte-6g40xv"}" href="${"http://bit.ly/2XNH7GE"}" target="${"_blank"}">Liberal
			</a>
			<a class="${"text-white hover:text-yellow-500 svelte-6g40xv"}" href="${"http://bit.ly/2L4my2E"}" target="${"_blank"}">Progressive
			</a>

			<a class="${"text-white hover:text-yellow-500 svelte-6g40xv"}" href="${"http://bit.ly/2NC57sb"}" target="${"_blank"}">Reform
			</a>

			<br>

			<a class="${"text-white hover:text-yellow-500 svelte-6g40xv"}" href="${"http://bit.ly/2JvmRAc"}" target="${"_blank"}">Burial Records
			</a>

			<tr><th class="${"px-4 py-2 svelte-6g40xv"}">Cemetery</th>
				<th class="${"px-4 py-2 svelte-6g40xv"}">Address</th>
				<th class="${"px-4 py-2 svelte-6g40xv"}">Year Opened</th></tr></thead>
		<tbody><tr><td class="${"border px-4 py-2 svelte-6g40xv"}">Edgwarebury</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">Edgwarebury Lane</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">1972</td></tr>

			<tr class="${"bg-gray-100 svelte-6g40xv"}"><td class="${"border px-4 py-2 svelte-6g40xv"}">Golders Green</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">Hoop Lane</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">1897</td></tr>

			<tr><td class="${"border px-4 py-2 svelte-6g40xv"}">Willesden</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">Pound Lane</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">1914</td></tr></tbody></table>
</div>`;
    });
    css$i = {
      code: ".bg-gray-100.svelte-6g40xv{--tw-bg-opacity:1;background-color:rgba(243, 244, 246, var(--tw-bg-opacity))}.rounded-lg.svelte-6g40xv{border-radius:0.5rem}.border.svelte-6g40xv{border-width:1px}.m-4.svelte-6g40xv{margin:1rem}.overflow-auto.svelte-6g40xv{overflow:auto}.p-4.svelte-6g40xv{padding:1rem}.px-4.svelte-6g40xv{padding-left:1rem;padding-right:1rem}.py-2.svelte-6g40xv{padding-top:0.5rem;padding-bottom:0.5rem}.shadow-2xl.svelte-6g40xv{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.table-auto.svelte-6g40xv{table-layout:auto}.text-left.svelte-6g40xv{text-align:left}.text-white.svelte-6g40xv{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-6g40xv:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-6g40xv{width:auto}",
      map: null
    };
    Federation = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$i);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl overflow-auto svelte-6g40xv"}"><table class="${"table-auto overflow-auto text-left svelte-6g40xv"}"><thead><a class="${"text-white hover:text-yellow-500 svelte-6g40xv"}" href="${"http://bit.ly/2YzvgsJ"}" target="${"_blank"}">Federation
			</a>
			<br>

			<a class="${"text-white hover:text-yellow-500 svelte-6g40xv"}" href="${"http://bit.ly/2xv58mW"}" target="${"_blank"}">Burial Records
			</a>

			<tr><th class="${"px-4 py-2 svelte-6g40xv"}">Cemetery</th>
				<th class="${"px-4 py-2 svelte-6g40xv"}">Address</th>
				<th class="${"px-4 py-2 svelte-6g40xv"}">Year Opened</th></tr></thead>
		<tbody><tr><td class="${"border px-4 py-2 svelte-6g40xv"}">Edgware</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">Edgwarebury Lane</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">under construction</td></tr>
			<tr class="${"bg-gray-100 svelte-6g40xv"}"><td class="${"border px-4 py-2 svelte-6g40xv"}">Edmonton</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">Montague Road</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">1890</td></tr>
			<tr><td class="${"border px-4 py-2 svelte-6g40xv"}">Rainham</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">Upminster Road North</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">1938</td></tr></tbody></table>
</div>`;
    });
    css$h = {
      code: ".bg-gray-100.svelte-6g40xv{--tw-bg-opacity:1;background-color:rgba(243, 244, 246, var(--tw-bg-opacity))}.rounded-lg.svelte-6g40xv{border-radius:0.5rem}.border.svelte-6g40xv{border-width:1px}.m-4.svelte-6g40xv{margin:1rem}.overflow-auto.svelte-6g40xv{overflow:auto}.p-4.svelte-6g40xv{padding:1rem}.px-4.svelte-6g40xv{padding-left:1rem;padding-right:1rem}.py-2.svelte-6g40xv{padding-top:0.5rem;padding-bottom:0.5rem}.shadow-2xl.svelte-6g40xv{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.table-auto.svelte-6g40xv{table-layout:auto}.text-left.svelte-6g40xv{text-align:left}.text-white.svelte-6g40xv{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-6g40xv:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-6g40xv{width:auto}",
      map: null
    };
    Adath = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$h);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl overflow-auto svelte-6g40xv"}"><table class="${"table-auto overflow-auto text-left svelte-6g40xv"}"><thead><a class="${"text-white hover:text-yellow-500 svelte-6g40xv"}" href="${"https://bit.ly/3kzte6h"}" target="${"_blank"}">Adath Yisroel
			</a>

			<br>
			<a class="${"text-white hover:text-yellow-500 svelte-6g40xv"}" href="${"http://bit.ly/2xv1ycu"}" target="${"_blank"}">Burial Records
			</a>

			<tr><th class="${"px-4 py-2 svelte-6g40xv"}">Cemetery</th>
				<th class="${"px-4 py-2 svelte-6g40xv"}">Address</th>
				<th class="${"px-4 py-2 svelte-6g40xv"}">Year Opened</th></tr></thead>
		<tbody><tr><td class="${"border px-4 py-2 svelte-6g40xv"}">Cheshunt</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">Silver Street</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">1964</td></tr>
			<tr class="${"bg-gray-100 svelte-6g40xv"}"><td class="${"border px-4 py-2 svelte-6g40xv"}">Enfield</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">Carterhatch Lane</td>
				<td class="${"border px-4 py-2 svelte-6g40xv"}">1927</td></tr></tbody></table>
</div>`;
    });
    css$g = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Glasgow99 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$g);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Burial Society</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639050305/webp/jewish-graves.webp"}" alt="${"image of jewish cemetary"}">
		<br>
		<p>Search Scotlands <br>Jewish burial records.</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3dj94xt"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$f = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Scotland99 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$f);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Jewish Scotland</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638878880/webp/scotish-flag.webp"}" alt="${"image of scottish flag"}">
		<br>
		<p>Jewish Scottish <br>family history.</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3d0EUyK"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$e = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Gilroes99 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$e);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Gilroes Cemetery</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1607355658/jewish-graves_rvakmw.jpg"}" alt="${"image of a cemetery"}">
		<br>
		<p>Search the burial records<br> Gilroes Cemetery Leicester</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/2Wx3H7B"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$d = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Eighteenfiftyone99 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$d);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">1851 Community
      </h1>

      <img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/v1607248969/database_l8siob.jpg"}" alt="${"image of a database"}">
      <br>
      <p>1851 <br>Anglo Jewry database
      </p>
      <br>
      
      <a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3f0oGUE"}" target="${"_blank"}">Go to The Website
		</a></div>
  </div>`;
    });
    css$c = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Fifty = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$c);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Pre 1850 Community
      </h1>

      <img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638859747/webp/database.webp"}" alt="${"image of a database"}">
      <br>
      <p>The London Jewish <br>database pre 1850
      </p>
      <br>
      

      <a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/2KBFjIq"}" target="${"_blank"}">Go to The Website
		</a></div>
  </div>`;
    });
    css$b = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Synagogue99 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$b);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Synagogue</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639221423/webp/greatsyn.webp"}" alt="${"image of graves"}">
		<br>
		<p>Search the database<br> of Ashkenazi <br>Synagogue records<br> 1791 to 1860.
		</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/2L20OFC"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$a = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Scribes99 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$a);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Scribes</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639050305/webp/jewish-graves.webp"}">
		<br>
		<p>Search the database of <br>headstone inscriptions<br> from Jewish cemeteries<br> throughout
			the UK.
		</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2WLa4AD"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$92 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Honour99 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$92);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Roll Of Honour
      </h1>

      	<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639216582/webp/first.webp"}" alt="${"image of Jewish regiment"}">
      <br>
      <p>Jewish book of <br>Honour list all <br>Jews who served<br> during the first world war.
      </p>
      <br>
     
      <a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/320z8W1"}" target="${"_blank"}">Go to The Website
		</a></div>
  </div>`;
    });
    css$82 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Jraf99 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$82);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Second world war</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639218046/webp/jewish-raf.webp"}" alt="${"jewish r.a.f"}">
		<br>

		<p>Remembering The<br> Jews who died<br> in the second world war</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3EdYmmK"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$72 = {
      code: ".rounded-lg.svelte-lvu80t{border-radius:0.5rem}.h-32.svelte-lvu80t{height:8rem}.text-2xl.svelte-lvu80t{font-size:1.5rem;line-height:2rem}.m-4.svelte-lvu80t{margin:1rem}.object-fill.svelte-lvu80t{-o-object-fit:fill;object-fit:fill}.p-4.svelte-lvu80t{padding:1rem}.p-6.svelte-lvu80t{padding:1.5rem}.shadow-2xl.svelte-lvu80t{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-lvu80t{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-lvu80t:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-lvu80t{width:auto}.w-full.svelte-lvu80t{width:100%}.w-52.svelte-lvu80t{width:13rem}",
      map: null
    };
    Marriage99 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$72);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-lvu80t"}"><div class="${"p-6 svelte-lvu80t"}"><h1 class="${"text-2xl text-white svelte-lvu80t"}">Marriage</h1>

		<img class="${"h-32 w-full object-fill svelte-lvu80t"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639217074/webp/ketubot.webp"}" alt="${"image of jewish ketubot marriage certificate"}">
		<br>
		<p>Marriage Authorisation <br>Records 1880 to 1922.
		</p>
		<br>
		<iframe class="${"h-32 w-52 object-fill svelte-lvu80t"}" title="${"companies house records"}" src="${"https://www.youtube.com/embed/690fZvaE0Ek"}" frameborder="${"0"}" allow="${"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"}" allowfullscreen></iframe>

		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-lvu80t"}" href="${"http://bit.ly/2wC1AS8"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$62 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    War99 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$62);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">First World War</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639216582/webp/first.webp"}" alt="${"image of Jewish regiment"}">
		<br>
		<p>British Jews in the<br> first world war.
		</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3nE0A5A"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$54 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Roots99 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$54);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Roots</h1>
		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639163996/webp/bevismarks.webp"}" alt="${"image of bevismarks shul"}">

		<br>

		<p>Sephardic Jewish<br> family history.
		</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/2YPZDjz"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$47 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    School99 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$47);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">JFS</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639163504/webp/jfs.webp"}" alt="${"image of a Classroom at Jewish Free School in Bell Lane 1890s"}">
		<br>
		<p>Search Jewish <br>Free School<br> database <br>1856 to 1907.</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/2KBEaAC"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$37 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Jcr99 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$37);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">J.C.R</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638859747/webp/database.webp"}" alt="${"image of a database"}">
		<br>
		<p>Database of <br>Jewish record&#39;s <br>in the United Kingdom.</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2GflEtg"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$29 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Chronicle99 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$29);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Chronicle</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639162743/webp/jc.webp"}" alt="${"image of a front page od jewish chronical"}">
		<br>
		<p>Search original version<br> of the JC from <br> 1841 to present day.</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3Gy8NSx"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$19 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Commercial99 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$19);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Directory</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639162361/webp/directory.webp"}" alt="${"image of Commercial Directory 1894"}">
		<br>
		<p>Commercial Directory <br>of Jewish business<br>United Kingdom 1894
		</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3rO9eBW"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css10 = {
      code: ".inline-block.svelte-18ph97w{display:inline-block}.grid.svelte-18ph97w{display:-ms-grid;display:grid}.h-10.svelte-18ph97w{height:2.5rem}.text-4xl.svelte-18ph97w{font-size:2.25rem;line-height:2.5rem}.ml-8.svelte-18ph97w{margin-left:2rem}.mt-3.svelte-18ph97w{margin-top:0.75rem}.mt-20.svelte-18ph97w{margin-top:5rem}.mt-8.svelte-18ph97w{margin-top:2rem}.text-center.svelte-18ph97w{text-align:center}.text-purple-500.svelte-18ph97w{--tw-text-opacity:1;color:rgba(139, 92, 246, var(--tw-text-opacity))}.w-14.svelte-18ph97w{width:3.5rem}.gap-4.svelte-18ph97w{grid-gap:1rem;gap:1rem}.grid-cols-2.svelte-18ph97w{grid-template-columns:repeat(2, minmax(0, 1fr))}@media(min-width: 640px){.sm\\:flex.svelte-18ph97w{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}}",
      map: null
    };
    prerender9 = true;
    British_j = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css10);
      return `${$$result.head += `${$$result.title = `<title>British Jewish</title>`, ""}`, ""}
<section class="${"one"}"><h1 class="${"ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl svelte-18ph97w"}"><div class="${"h-10 w-14 inline-block svelte-18ph97w"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638864273/webp/uk-flag.webp"}" alt="${"image of British flag"}"></div>
		<div class="${"h-10 w-14 inline-block svelte-18ph97w"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639135750/webp/star.webp"}" alt="${"image of star of david"}"></div>
		British Jewish Family History Resourses
	</h1>
	<br>
	<section class="${"one"}"><div class="${"grid sm:flex gap-4 mt-20 svelte-18ph97w"}">${validate_component(Chronicle99, "Chronicle99").$$render($$result, {}, {}, {})}
			${validate_component(Commercial99, "Commercial99").$$render($$result, {}, {}, {})}
			${validate_component(Jcr99, "Jcr99").$$render($$result, {}, {}, {})}</div>

		<div class="${"grid sm:flex gap-4 mt-8 svelte-18ph97w"}">${validate_component(School99, "School99").$$render($$result, {}, {}, {})}
			${validate_component(Marriage99, "Marriage99").$$render($$result, {}, {}, {})}
			${validate_component(Honour99, "Honour99").$$render($$result, {}, {}, {})}</div>

		<div class="${"grid sm:flex gap-4 mt-8 svelte-18ph97w"}">${validate_component(Roots99, "Roots99").$$render($$result, {}, {}, {})}
			${validate_component(War99, "War99").$$render($$result, {}, {}, {})}
			${validate_component(Scribes99, "Scribes99").$$render($$result, {}, {}, {})}</div>
		<div class="${"grid sm:flex gap-4 mt-8 svelte-18ph97w"}">${validate_component(Jraf99, "Jraf99").$$render($$result, {}, {}, {})}
			${validate_component(Synagogue99, "Synagogue99").$$render($$result, {}, {}, {})}
			${validate_component(Fifty, "Fifty").$$render($$result, {}, {}, {})}</div>

		<div class="${"grid sm:flex gap-4 mt-8 svelte-18ph97w"}">${validate_component(Eighteenfiftyone99, "Eighteenfiftyone99").$$render($$result, {}, {}, {})}</div>

		<h2 class="${"ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl svelte-18ph97w"}"><div>Leicester Jewish Family History Resourses</div></h2>
		<br>
		<div class="${"grid sm:flex gap-4 mt-8 svelte-18ph97w"}">${validate_component(Gilroes99, "Gilroes99").$$render($$result, {}, {}, {})}</div>

		<h1 class="${"ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl svelte-18ph97w"}"><div class="${"h-10 w-14 inline-block svelte-18ph97w"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638878880/webp/scotish-flag.webp"}" alt="${"image of Scottish flag"}"></div>
			<div class="${"h-10 w-14 inline-block svelte-18ph97w"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639135750/webp/star.webp"}" alt="${"image of star of david"}"></div>
			Scottish Jewish Family History Resourses
		</h1>
		<br>
		<div class="${"grid sm:flex gap-4 mt-8 svelte-18ph97w"}">${validate_component(Scotland99, "Scotland99").$$render($$result, {}, {}, {})}
			${validate_component(Glasgow99, "Glasgow99").$$render($$result, {}, {}, {})}</div>

		<h2 class="${"ml-8 mt-3 text-center text-purple-500 text-font-sans text-4xl svelte-18ph97w"}">London Jewish Cemeteries burial records</h2>
		<br></section>
	<section class="${"two"}"></section>
	<div class="${"grid grid-cols-2 gap-4 svelte-18ph97w"}">${validate_component(Adath, "Adath").$$render($$result, {}, {}, {})}
		${validate_component(Federation, "Federation").$$render($$result, {}, {}, {})}
		${validate_component(Liberal, "Liberal").$$render($$result, {}, {}, {})}
		${validate_component(Western, "Western").$$render($$result, {}, {}, {})}
		${validate_component(United, "United").$$render($$result, {}, {}, {})}</div>
</section>`;
    });
  }
});

// .svelte-kit/output/server/chunks/ireland-j-ced719d3.js
var ireland_j_ced719d3_exports = {};
__export(ireland_j_ced719d3_exports, {
  default: () => Ireland_j,
  prerender: () => prerender10
});
var css$110, Gensociety99, css11, prerender10, Ireland_j;
var init_ireland_j_ced719d3 = __esm({
  ".svelte-kit/output/server/chunks/ireland-j-ced719d3.js"() {
    init_shims();
    init_app_412ff39b();
    init_ssr();
    css$110 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Gensociety99 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$110);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Genealogical Society</h1>
		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638859747/webp/database.webp"}" alt="${"image of a database"}">
		<br>
		<p>Irish Jewish <br>database contains<br> info on people <br>from the 1700.</p>
		<br>
		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2Daukln"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css11 = {
      code: ".inline-block.svelte-aztiwm{display:inline-block}.grid.svelte-aztiwm{display:-ms-grid;display:grid}.h-10.svelte-aztiwm{height:2.5rem}.text-4xl.svelte-aztiwm{font-size:2.25rem;line-height:2.5rem}.ml-8.svelte-aztiwm{margin-left:2rem}.mt-3.svelte-aztiwm{margin-top:0.75rem}.mt-20.svelte-aztiwm{margin-top:5rem}.text-center.svelte-aztiwm{text-align:center}.text-purple-500.svelte-aztiwm{--tw-text-opacity:1;color:rgba(139, 92, 246, var(--tw-text-opacity))}.w-14.svelte-aztiwm{width:3.5rem}.gap-4.svelte-aztiwm{grid-gap:1rem;gap:1rem}@media(min-width: 640px){.sm\\:flex.svelte-aztiwm{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}}",
      map: null
    };
    prerender10 = true;
    Ireland_j = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css11);
      return `${$$result.head += `${$$result.title = `<title>Irish Jewish</title>`, ""}`, ""}
<section class="${"one"}"><h1 class="${"ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl svelte-aztiwm"}"><div class="${"h-10 w-14 inline-block svelte-aztiwm"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638893914/webp/ireland-flag.webp"}" alt="${"image of irish flag"}"></div>
		<div class="${"h-10 w-14 inline-block svelte-aztiwm"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639135750/webp/star.webp"}" alt="${"image of star of david"}"></div>
		Irish Jewish Family History Resourses
	</h1>
	<br>
	<section class="${"one"}"><div class="${"grid sm:flex gap-4 mt-20  svelte-aztiwm"}">${validate_component(Gensociety99, "Gensociety99").$$render($$result, {}, {}, {})}</div></section>
</section>`;
    });
  }
});

// .svelte-kit/output/server/chunks/italian-j-b3a6984f.js
var italian_j_b3a6984f_exports = {};
__export(italian_j_b3a6984f_exports, {
  default: () => Italian_j,
  prerender: () => prerender11
});
var css$210, Sicily99, css$111, Italygen99, css12, prerender11, Italian_j;
var init_italian_j_b3a6984f = __esm({
  ".svelte-kit/output/server/chunks/italian-j-b3a6984f.js"() {
    init_shims();
    init_app_412ff39b();
    init_ssr();
    css$210 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Sicily99 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$210);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Sicily</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1636708807/sicily_flag_afn3mu.png"}" alt="${"sicily flag"}">
		<br>
		<p>Jewish genealogy in Sicily</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3c5nU8P"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$111 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Italygen99 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$111);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Italian</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639306292/webp/italian_jewish.webp"}" alt="${"Italian jewish flag"}">
		<br>
		<p>Italian Jewish genealogy</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3DhayCw"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css12 = {
      code: ".inline-block.svelte-aztiwm{display:inline-block}.grid.svelte-aztiwm{display:-ms-grid;display:grid}.h-10.svelte-aztiwm{height:2.5rem}.text-4xl.svelte-aztiwm{font-size:2.25rem;line-height:2.5rem}.ml-8.svelte-aztiwm{margin-left:2rem}.mt-3.svelte-aztiwm{margin-top:0.75rem}.mt-20.svelte-aztiwm{margin-top:5rem}.text-center.svelte-aztiwm{text-align:center}.text-purple-500.svelte-aztiwm{--tw-text-opacity:1;color:rgba(139, 92, 246, var(--tw-text-opacity))}.w-14.svelte-aztiwm{width:3.5rem}.gap-4.svelte-aztiwm{grid-gap:1rem;gap:1rem}@media(min-width: 640px){.sm\\:flex.svelte-aztiwm{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}}",
      map: null
    };
    prerender11 = true;
    Italian_j = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css12);
      return `${$$result.head += `${$$result.title = `<title>Italian Jewish</title>`, ""}`, ""}
<section class="${"one"}"><h1 class="${"ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl svelte-aztiwm"}"><div class="${"h-10 w-14 inline-block svelte-aztiwm"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639305963/webp/italian_flag.webp"}" alt="${"image of Italian flag"}"></div>
		<div class="${"h-10 w-14 inline-block svelte-aztiwm"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639135750/webp/star.webp"}" alt="${"image of star of david"}"></div>
		Italian Jewish Family History Resourses
	</h1>
	<br>
	<section class="${"one"}"><div class="${"grid sm:flex gap-4 mt-20  svelte-aztiwm"}">${validate_component(Italygen99, "Italygen99").$$render($$result, {}, {}, {})}
			${validate_component(Sicily99, "Sicily99").$$render($$result, {}, {}, {})}</div></section>
</section>`;
    });
  }
});

// .svelte-kit/output/server/chunks/russian-j-5a22b37a.js
var russian_j_5a22b37a_exports = {};
__export(russian_j_5a22b37a_exports, {
  default: () => Russian_j,
  prerender: () => prerender12
});
var css$38, Hiborim99, css$211, Soldier99, css$112, Lipes99, css13, prerender12, Russian_j;
var init_russian_j_5a22b37a = __esm({
  ".svelte-kit/output/server/chunks/russian-j-5a22b37a.js"() {
    init_shims();
    init_app_412ff39b();
    init_ssr();
    css$38 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Hiborim99 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$38);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Hiborim</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638963974/webp/soviet-map.webp"}" alt="${"soviet map photo"}">
		<br>
		<p>Russian Jews who <br>fought in World War II</p>
		<br>
		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2R6rG8s"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$211 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Soldier99 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$211);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Soldier&#39;s</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638963974/webp/soviet-map.webp"}" alt="${"soviet map photo"}">
		<br>
		<p>List of Russian<br> Jewish fallen <br>soldiers of <br>World War I</p>
		<br>
		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/34ypn28"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$112 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Lipes99 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$112);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Lipes</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638859747/webp/database.webp"}" alt="${"image of a database"}">
		<br>
		<p>Search the 1897 <br>Jewish Russian census
		</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3bOUFXd"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css13 = {
      code: ".inline-block.svelte-aztiwm{display:inline-block}.grid.svelte-aztiwm{display:-ms-grid;display:grid}.h-10.svelte-aztiwm{height:2.5rem}.text-4xl.svelte-aztiwm{font-size:2.25rem;line-height:2.5rem}.ml-8.svelte-aztiwm{margin-left:2rem}.mt-3.svelte-aztiwm{margin-top:0.75rem}.mt-20.svelte-aztiwm{margin-top:5rem}.text-center.svelte-aztiwm{text-align:center}.text-purple-500.svelte-aztiwm{--tw-text-opacity:1;color:rgba(139, 92, 246, var(--tw-text-opacity))}.w-14.svelte-aztiwm{width:3.5rem}.gap-4.svelte-aztiwm{grid-gap:1rem;gap:1rem}@media(min-width: 640px){.sm\\:flex.svelte-aztiwm{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}}",
      map: null
    };
    prerender12 = true;
    Russian_j = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css13);
      return `${$$result.head += `${$$result.title = `<title>Russian Jewish</title>`, ""}`, ""}
<section class="${"one"}"><h1 class="${"ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl svelte-aztiwm"}"><div class="${"h-10 w-14 inline-block svelte-aztiwm"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638945399/webp/russian-flag.webp"}" alt="${"image of Russian flag"}"></div>
		<div class="${"h-10 w-14 inline-block svelte-aztiwm"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639135750/webp/star.webp"}" alt="${"image of star of david"}"></div>
		Russian Jewish Family History Resourses
	</h1>
	<br>
	<section class="${"one"}"><div class="${"grid sm:flex gap-4 mt-20  svelte-aztiwm"}">${validate_component(Lipes99, "Lipes99").$$render($$result, {}, {}, {})}
			${validate_component(Hiborim99, "Hiborim99").$$render($$result, {}, {}, {})}
			${validate_component(Soldier99, "Soldier99").$$render($$result, {}, {}, {})}</div></section>
</section>`;
    });
  }
});

// .svelte-kit/output/server/chunks/ukraine-j-419a732b.js
var ukraine_j_419a732b_exports = {};
__export(ukraine_j_419a732b_exports, {
  default: () => Ukraine_j,
  prerender: () => prerender13
});
var css$93, Kehilalinks99, css$83, Skala99, css$73, Odessa99, css$63, Mohyliv99, css$55, Yar99, css$48, Moved, css$39, Dnipro99, css$212, Memorial99, css$113, Dnipropetrovsk99, css14, prerender13, Ukraine_j;
var init_ukraine_j_419a732b = __esm({
  ".svelte-kit/output/server/chunks/ukraine-j-419a732b.js"() {
    init_shims();
    init_app_412ff39b();
    init_ssr();
    css$93 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Kehilalinks99 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$93);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Kehilalinks</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639057319/webp/shtetle.webp"}" alt="${"database photo"}">
		<br>
		<p>Jewish<br>Ukraine town<br> resourses.</p>
		<br><br><br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/32UCZ9d"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$83 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Skala99 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$83);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Skala-Podilska</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639056286/webp/skala.webp"}" alt="${" skala coat of arms"}">
		<br>
		<p>Jewish community <br>of Skala-Podilska.</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/34s9FW4"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$73 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Odessa99 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$73);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Odessa Rabbinate</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639056093/webp/odessa.webp"}" alt="${"odessa coat of arms"}">
		<br>
		<p>Odessa <br>birth and death records</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/396tK91"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$63 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Mohyliv99 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$63);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Mohyliv-Podilskyy</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639055649/webp/mohyliv_arms.webp"}" alt="${" mohyliv coat of arms"}">
		<br>
		<p>Jewish community of <br>Mohyliv-Podilskyy</p>
		<br><br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2FOm2P0"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$55 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Yar99 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$55);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Drobytsky Yar</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1615712228/drobytsky_joofur.jpg"}" alt="${"database photo"}">
		<br>

		<p>Database of<br>Jewish residents<br> killed in December 1941<br>at Drobytsky Yar</p>
		<br><br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3eJFf9E"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$48 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Moved = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$48);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Dnipropetrovsk</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639054714/webp/relocation.webp"}" alt="${" relocation people photo"}">
		<br>
		<p>List of Jews <br>resettled from <br>Raseinai to<br> Dnipropetrovsk<br> (Ekaterinoslav)
			in 1847
		</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2FNmH3v"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$39 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Dnipro99 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$39);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Dnepropetrovsk</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639050305/webp/jewish-graves.webp"}" alt="${" jewish graves photo"}">
		<br>
		<p>Database<br>Jewish cemetery</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/35nLMSB"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$212 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Memorial99 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$212);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Dnipropetrovsk</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639049981/webp/synagogue.webp"}" alt="${" Ekaterinoslav synagogue photo"}">
		<br>
		<p>Dnepropetrovsk<br> Memorial Book</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2KGvGar"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$113 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Dnipropetrovsk99 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$113);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Dnipropetrovsk</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639049361/webp/dnipropetrovsk_arms.webp"}" alt="${" dnipropetrovsk coat of arms"}">
		<br>
		<p>Dnipropetrovsk Gubernia<br> Resoursespreviously<br> known as Ekaterinoslav</p>

		<br>
		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2KHpyyE"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css14 = {
      code: ".inline-block.svelte-g219g3{display:inline-block}.grid.svelte-g219g3{display:-ms-grid;display:grid}.h-10.svelte-g219g3{height:2.5rem}.text-4xl.svelte-g219g3{font-size:2.25rem;line-height:2.5rem}.ml-8.svelte-g219g3{margin-left:2rem}.mt-3.svelte-g219g3{margin-top:0.75rem}.mt-20.svelte-g219g3{margin-top:5rem}.mt-8.svelte-g219g3{margin-top:2rem}.text-center.svelte-g219g3{text-align:center}.text-purple-500.svelte-g219g3{--tw-text-opacity:1;color:rgba(139, 92, 246, var(--tw-text-opacity))}.w-14.svelte-g219g3{width:3.5rem}.gap-4.svelte-g219g3{grid-gap:1rem;gap:1rem}@media(min-width: 640px){.sm\\:flex.svelte-g219g3{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}}",
      map: null
    };
    prerender13 = true;
    Ukraine_j = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css14);
      return `${$$result.head += `${$$result.title = `<title>Ukraine Jewish</title>`, ""}`, ""}

<section class="${"one"}"><h1 class="${"ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl svelte-g219g3"}"><div class="${"h-10 w-14 inline-block svelte-g219g3"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638978523/webp/ukraine-flag.webp"}" alt="${"image of Ukraine flag"}"></div>

		Ukraine Jewish Family History Resourses
	</h1>
	<br>
	<section class="${"one"}"><div class="${"grid sm:flex gap-4 mt-20 svelte-g219g3"}">${validate_component(Dnipropetrovsk99, "Dnipropetrovsk99").$$render($$result, {}, {}, {})}
			${validate_component(Memorial99, "Memorial99").$$render($$result, {}, {}, {})}
			${validate_component(Dnipro99, "Dnipro99").$$render($$result, {}, {}, {})}</div>
		<div class="${"grid sm:flex gap-4 mt-8 svelte-g219g3"}">${validate_component(Moved, "Moved").$$render($$result, {}, {}, {})}
			${validate_component(Yar99, "Yar99").$$render($$result, {}, {}, {})}
			${validate_component(Kehilalinks99, "Kehilalinks99").$$render($$result, {}, {}, {})}</div>

		<div class="${"grid sm:flex gap-4 mt-8 svelte-g219g3"}">${validate_component(Mohyliv99, "Mohyliv99").$$render($$result, {}, {}, {})}
			${validate_component(Odessa99, "Odessa99").$$render($$result, {}, {}, {})}
			${validate_component(Skala99, "Skala99").$$render($$result, {}, {}, {})}</div></section>
</section>`;
    });
  }
});

// .svelte-kit/output/server/chunks/austrian-d3ae3912.js
var austrian_d3ae3912_exports = {};
__export(austrian_d3ae3912_exports, {
  default: () => Austrian,
  prerender: () => prerender14
});
var css$213, Vienna, css$114, Auststate, css15, prerender14, Austrian;
var init_austrian_d3ae3912 = __esm({
  ".svelte-kit/output/server/chunks/austrian-d3ae3912.js"() {
    init_shims();
    init_app_412ff39b();
    init_ssr();
    css$213 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Vienna = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$213);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Vienna</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638876911/webp/viennaparlament.webp"}" alt="${"vienna parlement photo"}">
		<br>
		<p>Vienna Archives</p>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2SrGLCq"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$114 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Auststate = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$114);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">State Archives</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638860017/webp/archives.webp"}" alt="${"image of archives"}">
		<br>
		<p>Austrian State Archives</p>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/34MKe49"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css15 = {
      code: ".inline-block.svelte-aztiwm{display:inline-block}.grid.svelte-aztiwm{display:-ms-grid;display:grid}.h-10.svelte-aztiwm{height:2.5rem}.text-4xl.svelte-aztiwm{font-size:2.25rem;line-height:2.5rem}.ml-8.svelte-aztiwm{margin-left:2rem}.mt-3.svelte-aztiwm{margin-top:0.75rem}.mt-20.svelte-aztiwm{margin-top:5rem}.text-center.svelte-aztiwm{text-align:center}.text-purple-500.svelte-aztiwm{--tw-text-opacity:1;color:rgba(139, 92, 246, var(--tw-text-opacity))}.w-14.svelte-aztiwm{width:3.5rem}.gap-4.svelte-aztiwm{grid-gap:1rem;gap:1rem}@media(min-width: 640px){.sm\\:flex.svelte-aztiwm{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}}",
      map: null
    };
    prerender14 = true;
    Austrian = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css15);
      return `${$$result.head += `${$$result.title = `<title>Austrian</title>`, ""}`, ""}

<section class="${"one"}"><h1 class="${"ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl svelte-aztiwm"}"><div class="${"h-10 w-14 inline-block svelte-aztiwm"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638876704/webp/austria-flag.webp"}" alt="${"image of Austrian flag"}"></div>

		Austrian Family History Resourses
	</h1>
	<br>

	<div class="${"grid sm:flex gap-4 mt-20 one svelte-aztiwm"}">${validate_component(Auststate, "Auststate").$$render($$result, {}, {}, {})}
		${validate_component(Vienna, "Vienna").$$render($$result, {}, {}, {})}</div>
</section>`;
    });
  }
});

// .svelte-kit/output/server/chunks/barbados-1caae89d.js
var barbados_1caae89d_exports = {};
__export(barbados_1caae89d_exports, {
  default: () => Barbados,
  prerender: () => prerender15
});
var css$310, Barbstate, css$214, Family, css$115, Genbarb, css16, prerender15, Barbados;
var init_barbados_1caae89d = __esm({
  ".svelte-kit/output/server/chunks/barbados-1caae89d.js"() {
    init_shims();
    init_app_412ff39b();
    init_ssr();
    css$310 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Barbstate = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$310);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">State Archives</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638860017/webp/archives.webp"}" alt="${"image of archives"}">
		<br>
		<p>Barbados State Archives</p>
		<br><br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2WusbL4"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$214 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Family = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$214);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Family History</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638861228/webp/family-tree.webp"}" alt="${"image of a family tree"}">
		<br>
		<p>Information about <br>Barbados family history</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2PggG63"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$115 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Genbarb = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$115);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Barbados</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638859747/webp/database.webp"}" alt="${"image of a database"}">
		<br>
		<p>Search Barbados <br>Genealogical Records</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2Ls7SZP"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css16 = {
      code: ".inline-block.svelte-aztiwm{display:inline-block}.grid.svelte-aztiwm{display:-ms-grid;display:grid}.h-10.svelte-aztiwm{height:2.5rem}.text-4xl.svelte-aztiwm{font-size:2.25rem;line-height:2.5rem}.ml-8.svelte-aztiwm{margin-left:2rem}.mt-3.svelte-aztiwm{margin-top:0.75rem}.mt-20.svelte-aztiwm{margin-top:5rem}.text-center.svelte-aztiwm{text-align:center}.text-purple-500.svelte-aztiwm{--tw-text-opacity:1;color:rgba(139, 92, 246, var(--tw-text-opacity))}.w-14.svelte-aztiwm{width:3.5rem}.gap-4.svelte-aztiwm{grid-gap:1rem;gap:1rem}@media(min-width: 640px){.sm\\:flex.svelte-aztiwm{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}}",
      map: null
    };
    prerender15 = true;
    Barbados = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css16);
      return `${$$result.head += `${$$result.title = `<title>Barbados</title>`, ""}`, ""}

<section class="${"one"}"><h1 class="${"ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl svelte-aztiwm"}"><div class="${"h-10 w-14 inline-block svelte-aztiwm"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638866632/webp/barbados-flag_mngc34.webp"}" alt="${"image of Barbados flag"}"></div>

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

// .svelte-kit/output/server/chunks/canada-j-f187c6bd.js
var canada_j_f187c6bd_exports = {};
__export(canada_j_f187c6bd_exports, {
  default: () => Canada_j,
  prerender: () => prerender16
});
var css$116, Network, css17, prerender16, Canada_j;
var init_canada_j_f187c6bd = __esm({
  ".svelte-kit/output/server/chunks/canada-j-f187c6bd.js"() {
    init_shims();
    init_app_412ff39b();
    init_ssr();
    css$116 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Network = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$116);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Network</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638859747/webp/database.webp"}" alt="${"image of a database"}">
		<br>
		<p>Searchable Database<br>The Canadian<br> Jewish Heritage<br> Network</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3fVzRij"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css17 = {
      code: ".inline-block.svelte-aztiwm{display:inline-block}.grid.svelte-aztiwm{display:-ms-grid;display:grid}.h-10.svelte-aztiwm{height:2.5rem}.text-4xl.svelte-aztiwm{font-size:2.25rem;line-height:2.5rem}.ml-8.svelte-aztiwm{margin-left:2rem}.mt-3.svelte-aztiwm{margin-top:0.75rem}.mt-20.svelte-aztiwm{margin-top:5rem}.text-center.svelte-aztiwm{text-align:center}.text-purple-500.svelte-aztiwm{--tw-text-opacity:1;color:rgba(139, 92, 246, var(--tw-text-opacity))}.w-14.svelte-aztiwm{width:3.5rem}.gap-4.svelte-aztiwm{grid-gap:1rem;gap:1rem}@media(min-width: 640px){.sm\\:flex.svelte-aztiwm{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}}",
      map: null
    };
    prerender16 = true;
    Canada_j = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css17);
      return `${$$result.head += `${$$result.title = `<title>Canada Jewish</title>`, ""}`, ""}
<section class="${"one"}"><h1 class="${"ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl svelte-aztiwm"}"><div class="${"h-10 w-14 inline-block svelte-aztiwm"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639243547/webp/canada-flag.webp"}" alt="${"image of Canadian flag"}"></div>
		<div class="${"h-10 w-14 inline-block svelte-aztiwm"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639135750/webp/star.webp"}" alt="${"image of star of david"}"></div>
		Canadian Jewish Family History Resourses
	</h1>
	<br>
	<section class="${"one"}"><div class="${"grid sm:flex gap-4 mt-20  svelte-aztiwm"}">${validate_component(Network, "Network").$$render($$result, {}, {}, {})}</div></section>
</section>`;
    });
  }
});

// .svelte-kit/output/server/chunks/belarus-b9d0de3f.js
var belarus_b9d0de3f_exports = {};
__export(belarus_b9d0de3f_exports, {
  default: () => Belarus,
  prerender: () => prerender17
});
var css$215, Mogilev, css$117, Belstate, css18, prerender17, Belarus;
var init_belarus_b9d0de3f = __esm({
  ".svelte-kit/output/server/chunks/belarus-b9d0de3f.js"() {
    init_shims();
    init_app_412ff39b();
    init_ssr();
    css$215 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Mogilev = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$215);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Mogilev Region</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638860017/webp/archives.webp"}" alt="${"archive photo"}">
		<br>
		<p>State Archives</p>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3qa4ntC"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$117 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Belstate = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$117);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">State Archives</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638860017/webp/archives.webp"}" alt="${"archive photo"}">
		<br>
		<p>Belarus State Archives</p>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3fMLiZD"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css18 = {
      code: ".inline-block.svelte-aztiwm{display:inline-block}.grid.svelte-aztiwm{display:-ms-grid;display:grid}.h-10.svelte-aztiwm{height:2.5rem}.text-4xl.svelte-aztiwm{font-size:2.25rem;line-height:2.5rem}.ml-8.svelte-aztiwm{margin-left:2rem}.mt-3.svelte-aztiwm{margin-top:0.75rem}.mt-20.svelte-aztiwm{margin-top:5rem}.text-center.svelte-aztiwm{text-align:center}.text-purple-500.svelte-aztiwm{--tw-text-opacity:1;color:rgba(139, 92, 246, var(--tw-text-opacity))}.w-14.svelte-aztiwm{width:3.5rem}.gap-4.svelte-aztiwm{grid-gap:1rem;gap:1rem}@media(min-width: 640px){.sm\\:flex.svelte-aztiwm{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}}",
      map: null
    };
    prerender17 = true;
    Belarus = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css18);
      return `${$$result.head += `${$$result.title = `<title>Belarus</title>`, ""}`, ""}
<section class="${"one"}"><h1 class="${"ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl svelte-aztiwm"}"><div class="${"h-10 w-14 inline-block svelte-aztiwm"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638877031/webp/belarus-flag.webp"}" alt="${"image of Belarus flag"}"></div>

		Belarus Family History Resourses
	</h1>
	<br>

	<div class="${"grid sm:flex gap-4 mt-20 one svelte-aztiwm"}">${validate_component(Belstate, "Belstate").$$render($$result, {}, {}, {})}
		${validate_component(Mogilev, "Mogilev").$$render($$result, {}, {}, {})}</div>
</section>`;
    });
  }
});

// .svelte-kit/output/server/chunks/belgium-d80da3f4.js
var belgium_d80da3f4_exports = {};
__export(belgium_d80da3f4_exports, {
  default: () => Belgium,
  prerender: () => prerender18
});
var css$311, Genealogy, css$216, Ancestry, css$118, Belgstate, css19, prerender18, Belgium;
var init_belgium_d80da3f4 = __esm({
  ".svelte-kit/output/server/chunks/belgium-d80da3f4.js"() {
    init_shims();
    init_app_412ff39b();
    init_ssr();
    css$311 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Genealogy = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$311);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Genealogy</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638861228/webp/family-tree.webp"}" alt="${"family tree photo"}">
		<br>
		<p>Belgium genealogy links</p>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2Mx0ZH1"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$216 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Ancestry = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$216);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Ancestry</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638861228/webp/family-tree.webp"}" alt="${"archive photo"}">
		<br>
		<p>Belgium genealogy links</p>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2ZAAYfv"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$118 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Belgstate = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$118);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">State Archives</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638860017/webp/archives.webp"}" alt="${"archive photo"}">
		<br>
		<p>Belgium State Archives</p>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/37aGuHZ"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css19 = {
      code: ".inline-block.svelte-aztiwm{display:inline-block}.grid.svelte-aztiwm{display:-ms-grid;display:grid}.h-10.svelte-aztiwm{height:2.5rem}.text-4xl.svelte-aztiwm{font-size:2.25rem;line-height:2.5rem}.ml-8.svelte-aztiwm{margin-left:2rem}.mt-3.svelte-aztiwm{margin-top:0.75rem}.mt-20.svelte-aztiwm{margin-top:5rem}.text-center.svelte-aztiwm{text-align:center}.text-purple-500.svelte-aztiwm{--tw-text-opacity:1;color:rgba(139, 92, 246, var(--tw-text-opacity))}.w-14.svelte-aztiwm{width:3.5rem}.gap-4.svelte-aztiwm{grid-gap:1rem;gap:1rem}@media(min-width: 640px){.sm\\:flex.svelte-aztiwm{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}}",
      map: null
    };
    prerender18 = true;
    Belgium = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css19);
      return `${$$result.head += `${$$result.title = `<title>Belgium</title>`, ""}`, ""}
<section class="${"one"}"><h1 class="${"ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl svelte-aztiwm"}"><div class="${"h-10 w-14 inline-block svelte-aztiwm"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638877222/webp/belgium-flag.webp"}" alt="${"image of Belgium flag"}"></div>

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

// .svelte-kit/output/server/chunks/bermuda-4dd6e03a.js
var bermuda_4dd6e03a_exports = {};
__export(bermuda_4dd6e03a_exports, {
  default: () => Bermuda,
  prerender: () => prerender19
});
var css$312, Berstate, css$217, National, css$119, Berfamily, css20, prerender19, Bermuda;
var init_bermuda_4dd6e03a = __esm({
  ".svelte-kit/output/server/chunks/bermuda-4dd6e03a.js"() {
    init_shims();
    init_app_412ff39b();
    init_ssr();
    css$312 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Berstate = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$312);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">State Archives</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638860017/webp/archives.webp"}" alt="${"image of archives"}">
		<br>
		<p>Bermuda State Archives</p>
		<br><br><br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/3mGxeTt"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$217 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    National = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$217);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">National Museum</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638859747/webp/database.webp"}" alt="${"image of database"}">
		<br>
		<p>Search the archives of<br>national museum <br>of Bermuda</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2KHv4FP"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$119 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Berfamily = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$119);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Bermuda</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638859747/webp/database.webp"}" alt="${"image of a database"}">
		<br>
		<p>Search Burmuda <br>Genealogical Records</p>
		<br><br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2PeNSLm"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css20 = {
      code: ".inline-block.svelte-aztiwm{display:inline-block}.grid.svelte-aztiwm{display:-ms-grid;display:grid}.h-10.svelte-aztiwm{height:2.5rem}.text-4xl.svelte-aztiwm{font-size:2.25rem;line-height:2.5rem}.ml-8.svelte-aztiwm{margin-left:2rem}.mt-3.svelte-aztiwm{margin-top:0.75rem}.mt-20.svelte-aztiwm{margin-top:5rem}.text-center.svelte-aztiwm{text-align:center}.text-purple-500.svelte-aztiwm{--tw-text-opacity:1;color:rgba(139, 92, 246, var(--tw-text-opacity))}.w-14.svelte-aztiwm{width:3.5rem}.gap-4.svelte-aztiwm{grid-gap:1rem;gap:1rem}@media(min-width: 640px){.sm\\:flex.svelte-aztiwm{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}}",
      map: null
    };
    prerender19 = true;
    Bermuda = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css20);
      return `${$$result.head += `${$$result.title = `<title>Bermuda</title>`, ""}`, ""}

<section class="${"one"}"><h1 class="${"ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl svelte-aztiwm"}"><div class="${"h-10 w-14 inline-block svelte-aztiwm"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638866804/webp/bermuda-flag_rgvbdd.webp"}" alt="${"image of Bermuda flag"}"></div>

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

// .svelte-kit/output/server/chunks/british-b44848e7.js
var british_b44848e7_exports = {};
__export(british_b44848e7_exports, {
  default: () => British,
  prerender: () => prerender20
});
var css$g2, Scotland, css$f2, Thirtynine, css$e2, Workhouse, css$d2, Wills, css$c2, Graves, css$b2, Britstate, css$a2, Navy, css$94, Raf, css$84, Newspaper, css$74, Gazette2, css$64, Industral, css$56, Directories, css$49, Electoral, css$313, Companies2, css$218, Children, css$120, Bmd, css21, prerender20, British;
var init_british_b44848e7 = __esm({
  ".svelte-kit/output/server/chunks/british-b44848e7.js"() {
    init_shims();
    init_app_412ff39b();
    init_ssr();
    css$g2 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Scotland = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$g2);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Scotland</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638878880/webp/scotish-flag.webp"}" alt="${"image of scotish flag"}">
		<br>
		<p>Scottish family<br> history records.</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2Z9K2Iz"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$f2 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Thirtynine = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$f2);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">1939 Register</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638878467/webp/1939c.webp"}" alt="${"image of 1939 census form"}">

		<br>
		<p>Search the 1939 <br>pre war census register <br>also avaliable on Ancestry.
		</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2IjAKzA"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$e2 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Workhouse = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$e2);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Workhouse</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638878129/webp/workhouse.webp"}" alt="${"image of workhouse wikiwand"}">
		<br>
		<p>The history of <br>the workhouse<br> and resourses.
		</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/2UIsK3g"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$d2 = {
      code: ".rounded-lg.svelte-lvu80t{border-radius:0.5rem}.h-32.svelte-lvu80t{height:8rem}.text-2xl.svelte-lvu80t{font-size:1.5rem;line-height:2rem}.m-4.svelte-lvu80t{margin:1rem}.object-fill.svelte-lvu80t{-o-object-fit:fill;object-fit:fill}.p-4.svelte-lvu80t{padding:1rem}.p-6.svelte-lvu80t{padding:1.5rem}.shadow-2xl.svelte-lvu80t{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-lvu80t{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-lvu80t:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-lvu80t{width:auto}.w-full.svelte-lvu80t{width:100%}.w-52.svelte-lvu80t{width:13rem}",
      map: null
    };
    Wills = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$d2);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-lvu80t"}"><div class="${"p-6 svelte-lvu80t"}"><h1 class="${"text-2xl text-white svelte-lvu80t"}">Wills &amp; Probate</h1>

		<img class="${"h-32 w-full object-fill svelte-lvu80t"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638877765/webp/wills.webp"}" alt="${"image of a will"}">
		<br>
		<p>Will and Probate <br>records from<br> 1858 to present Day.</p>
		<br>

		<iframe class="${"h-32 w-52 object-fill svelte-lvu80t"}" title="${"companies house records"}" src="${"https://www.youtube.com/embed/LOFKGhsCyHg"}" frameborder="${"0"}" allow="${"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"}" allowfullscreen></iframe>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-lvu80t"}" href="${"http://bit.ly/2GfeWTV"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$c2 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Graves = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$c2);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">War Graves</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638865557/webp/loos_asmvi6.webp"}" alt="${"image of loos war cemetary"}">
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
    css$b2 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Britstate = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$b2);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">State Archives
      </h1>

      <img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638860017/webp/archives.webp"}" alt="${"archive photo"}">
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

		<img class="${"h-32 w-full object-fill svelte-lvu80t"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638865308/webp/HMS_Dreadnought_gdupqt.webp"}" alt="${"royal navy hns drednought photo"}">
		<br>
		<p>First world war<br> lives at sea<br>search the sailors<br> war records.</p>
		<br>
		<iframe class="${"h-32 w-52 object-fill svelte-lvu80t"}" title="${"Royal Navy & RAF"}" src="${"https://www.youtube.com/embed/MGLHGV2LP2I"}" frameborder="${"0"}" allow="${"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"}" allowfullscreen></iframe>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-lvu80t"}" href="${"https://bit.ly/32Krtjv"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$94 = {
      code: ".rounded-lg.svelte-lvu80t{border-radius:0.5rem}.h-32.svelte-lvu80t{height:8rem}.text-2xl.svelte-lvu80t{font-size:1.5rem;line-height:2rem}.m-4.svelte-lvu80t{margin:1rem}.object-fill.svelte-lvu80t{-o-object-fit:fill;object-fit:fill}.p-4.svelte-lvu80t{padding:1rem}.p-6.svelte-lvu80t{padding:1.5rem}.shadow-2xl.svelte-lvu80t{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-lvu80t{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-lvu80t:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-lvu80t{width:auto}.w-full.svelte-lvu80t{width:100%}.w-52.svelte-lvu80t{width:13rem}",
      map: null
    };
    Raf = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$94);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-lvu80t"}"><div class="${"p-6 svelte-lvu80t"}"><h1 class="${"text-2xl text-white svelte-lvu80t"}">R.A.F</h1>

		<img class="${"h-32 w-full object-fill svelte-lvu80t"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638865061/webp/raf.webp"}" alt="${"royal airforce plane 1918 photo"}">
		<br>
		<p>first world war<br>Casualty Cards <br>&amp; Muster Roll</p>
		<br>
		<iframe class="${"h-32 w-52 object-fill svelte-lvu80t"}" title="${"Royal Navy & RAF"}" src="${"https://www.youtube.com/embed/MGLHGV2LP2I"}" frameborder="${"0"}" allow="${"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"}" allowfullscreen></iframe>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-lvu80t"}" href="${"http://bit.ly/2rGVfQJ"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$84 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Newspaper = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$84);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Newspapers</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638864967/webp/newspaper.webp"}" alt="${"newspaper logo photo"}">
		<br>
		<p>British newspaper <br>archive<br>
			from the 1700s.
		</p>
		<br><br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2IeM6t0"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$74 = {
      code: ".rounded-lg.svelte-lvu80t{border-radius:0.5rem}.h-32.svelte-lvu80t{height:8rem}.text-2xl.svelte-lvu80t{font-size:1.5rem;line-height:2rem}.m-4.svelte-lvu80t{margin:1rem}.object-fill.svelte-lvu80t{-o-object-fit:fill;object-fit:fill}.p-4.svelte-lvu80t{padding:1rem}.p-6.svelte-lvu80t{padding:1.5rem}.shadow-2xl.svelte-lvu80t{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-lvu80t{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-lvu80t:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-lvu80t{width:auto}.w-full.svelte-lvu80t{width:100%}.w-52.svelte-lvu80t{width:13rem}",
      map: null
    };
    Gazette2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$74);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-lvu80t"}"><div class="${"p-6 svelte-lvu80t"}"><h1 class="${"text-2xl text-white svelte-lvu80t"}">London Gazette</h1>

		<img class="${"h-32 w-full object-fill svelte-lvu80t"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638864884/webp/gazette.webp"}" alt="${"london gazettte newspaper photo"}">
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
    css$64 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Industral = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$64);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Industral Schools</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638864797/webp/industral.webp"}" alt="${"image of an industral school"}">
		<br>
		<p>The history of <br>Industral schools<br> and resourses.
		</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3pJKcTe"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$56 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Directories = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$56);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Directories</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638864710/webp/trade.webp"}" alt="${"image of trade directories"}">
		<br>
		<p>Trade and local <br>directories<br> for England and Wales</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/3dWL43l"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$49 = {
      code: ".rounded-lg.svelte-lvu80t{border-radius:0.5rem}.h-32.svelte-lvu80t{height:8rem}.text-2xl.svelte-lvu80t{font-size:1.5rem;line-height:2rem}.m-4.svelte-lvu80t{margin:1rem}.object-fill.svelte-lvu80t{-o-object-fit:fill;object-fit:fill}.p-4.svelte-lvu80t{padding:1rem}.p-6.svelte-lvu80t{padding:1.5rem}.shadow-2xl.svelte-lvu80t{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-lvu80t{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-lvu80t:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-lvu80t{width:auto}.w-full.svelte-lvu80t{width:100%}.w-52.svelte-lvu80t{width:13rem}",
      map: null
    };
    Electoral = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$49);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-lvu80t"}"><div class="${"p-6 svelte-lvu80t"}"><h1 class="${"text-2xl text-white svelte-lvu80t"}">Electoral Register</h1>

		<img class="${"h-32 w-full object-fill svelte-lvu80t"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638864628/webp/roll.webp"}" alt="${"image of electorial roll"}">

		<br>

		<iframe class="${"h-32 w-52 object-fill svelte-lvu80t"}" title="${"Electorial roll uk"}" src="${"https://www.youtube.com/embed/by1hNIjuKWM"}" frameborder="${"0"}" allow="${"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"}" allowfullscreen></iframe>

		<br>
		<p>Current <br>Electoral Register.</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-lvu80t"}" href="${"http://bit.ly/2FPDJAN"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$313 = {
      code: ".rounded-lg.svelte-lvu80t{border-radius:0.5rem}.h-32.svelte-lvu80t{height:8rem}.text-2xl.svelte-lvu80t{font-size:1.5rem;line-height:2rem}.m-4.svelte-lvu80t{margin:1rem}.object-fill.svelte-lvu80t{-o-object-fit:fill;object-fit:fill}.p-4.svelte-lvu80t{padding:1rem}.p-6.svelte-lvu80t{padding:1.5rem}.shadow-2xl.svelte-lvu80t{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-lvu80t{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-lvu80t:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-lvu80t{width:auto}.w-full.svelte-lvu80t{width:100%}.w-52.svelte-lvu80t{width:13rem}",
      map: null
    };
    Companies2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$313);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-lvu80t"}"><div class="${"p-6 svelte-lvu80t"}"><h1 class="${"text-2xl text-white svelte-lvu80t"}">Companies House</h1>

		<img class="${"h-32 w-full object-fill svelte-lvu80t"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638864541/webp/companies.webp"}" alt="${"companies house logo photo"}">
		<br>
		<p>Free search the<br> register of Companies<br> and directors.</p>
		<br>
		<iframe class="${"h-32 w-52 object-fill svelte-lvu80t"}" title="${"companies house records"}" src="${"https://www.youtube.com/embed/-zFJZrOScuM"}" frameborder="${"0"}" allow="${"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"}" allowfullscreen></iframe>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-lvu80t"}" href="${"https://bit.ly/3poS64b"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$218 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Children = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$218);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Children&#39;s Homes</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638864457/webp/home.webp"}" alt="${"image of dr barnardo's home barkingside"}">
		<br>
		<p>The history of the<br> childrens homes <br>and resourses.
		</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/2UIsK3g"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$120 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Bmd = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$120);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">B.M.D</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638859747/webp/database.webp"}" alt="${"database photo"}">
		<br>
		<p>Free birth marriages<br> and
			death index<br> from 1837 to 1992.
		</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2IguCfJ"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css21 = {
      code: ".inline-block.svelte-g219g3{display:inline-block}.grid.svelte-g219g3{display:-ms-grid;display:grid}.h-10.svelte-g219g3{height:2.5rem}.text-4xl.svelte-g219g3{font-size:2.25rem;line-height:2.5rem}.ml-8.svelte-g219g3{margin-left:2rem}.mt-3.svelte-g219g3{margin-top:0.75rem}.mt-20.svelte-g219g3{margin-top:5rem}.mt-8.svelte-g219g3{margin-top:2rem}.text-center.svelte-g219g3{text-align:center}.text-purple-500.svelte-g219g3{--tw-text-opacity:1;color:rgba(139, 92, 246, var(--tw-text-opacity))}.w-14.svelte-g219g3{width:3.5rem}.gap-4.svelte-g219g3{grid-gap:1rem;gap:1rem}@media(min-width: 640px){.sm\\:flex.svelte-g219g3{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}}",
      map: null
    };
    prerender20 = true;
    British = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css21);
      return `${$$result.head += `${$$result.title = `<title>British</title>`, ""}`, ""}
<section class="${"one"}"><h1 class="${"ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl svelte-g219g3"}"><div class="${"h-10 w-14 inline-block svelte-g219g3"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638864273/webp/uk-flag.webp"}" alt="${"image of British flag"}"></div>

		British Family History Resourses
	</h1>
	<br>
	<section class="${"one"}"><div class="${"grid sm:flex gap-4 mt-20 svelte-g219g3"}">${validate_component(Bmd, "Bmd").$$render($$result, {}, {}, {})}
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
			${validate_component(Graves, "Graves").$$render($$result, {}, {}, {})}</div>
		<div class="${"grid sm:flex gap-4 mt-8 svelte-g219g3"}">${validate_component(Wills, "Wills").$$render($$result, {}, {}, {})}
			${validate_component(Workhouse, "Workhouse").$$render($$result, {}, {}, {})}
			${validate_component(Thirtynine, "Thirtynine").$$render($$result, {}, {}, {})}</div>
		<br>

<h2 class="${"ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl svelte-g219g3"}"><div class="${"h-10 w-14 inline-block svelte-g219g3"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638878880/webp/scotish-flag.webp"}" alt="${"image of Scottish flag"}"></div>

		Scottish Family History Resourses
	</h2>

		<div class="${"grid sm:flex gap-4 mt-8 svelte-g219g3"}">${validate_component(Scotland, "Scotland").$$render($$result, {}, {}, {})}</div></section>
</section>`;
    });
  }
});

// .svelte-kit/output/server/chunks/contact-dd424990.js
var contact_dd424990_exports = {};
__export(contact_dd424990_exports, {
  default: () => Contact
});
var css22, Contact;
var init_contact_dd424990 = __esm({
  ".svelte-kit/output/server/chunks/contact-dd424990.js"() {
    init_shims();
    init_app_412ff39b();
    init_ssr();
    css22 = {
      code: ".container.svelte-1m8e9dq{width:100%}@media(min-width: 640px){.container.svelte-1m8e9dq{max-width:640px}}@media(min-width: 768px){.container.svelte-1m8e9dq{max-width:768px}}@media(min-width: 1024px){.container.svelte-1m8e9dq{max-width:1024px}}@media(min-width: 1280px){.container.svelte-1m8e9dq{max-width:1280px}}@media(min-width: 1536px){.container.svelte-1m8e9dq{max-width:1536px}}.rounded-lg.svelte-1m8e9dq{border-radius:0.5rem}.text-4xl.svelte-1m8e9dq{font-size:2.25rem;line-height:2.5rem}.m-auto.svelte-1m8e9dq{margin:auto}.m-4.svelte-1m8e9dq{margin:1rem}.focus\\:outline-none.svelte-1m8e9dq:focus{outline:2px solid transparent;outline-offset:2px}.p-4.svelte-1m8e9dq{padding:1rem}.shadow-2xl.svelte-1m8e9dq{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.focus\\:ring-4.svelte-1m8e9dq:focus{--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(4px + var(--tw-ring-offset-width)) var(--tw-ring-color);-webkit-box-shadow:var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);box-shadow:var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)}.focus\\:ring-purple-900.svelte-1m8e9dq:focus{--tw-ring-opacity:1;--tw-ring-color:rgba(76, 29, 149, var(--tw-ring-opacity))}.focus\\:ring-opacity-80.svelte-1m8e9dq:focus{--tw-ring-opacity:0.8}.text-blue-300.svelte-1m8e9dq{--tw-text-opacity:1;color:rgba(147, 197, 253, var(--tw-text-opacity))}.text-purple-900.svelte-1m8e9dq{--tw-text-opacity:1;color:rgba(76, 29, 149, var(--tw-text-opacity))}.text-black.svelte-1m8e9dq{--tw-text-opacity:1;color:rgba(0, 0, 0, var(--tw-text-opacity))}.hover\\:text-red-500.svelte-1m8e9dq:hover{--tw-text-opacity:1;color:rgba(239, 68, 68, var(--tw-text-opacity))}.w-auto.svelte-1m8e9dq{width:auto}",
      map: null
    };
    Contact = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css22);
      return `<section class="${"container m-auto text-4xl text-blue-300 two svelte-1m8e9dq"}"><div id="${"blog-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-1m8e9dq"}"><br>
		<form action="${"https://usebasin.com/f/d3817e926c9d"}" method="${"POST"}"><p><label class="${"text-purple-900 svelte-1m8e9dq"}">Name: <input class="${"text-black focus:outline-none focus:ring-4 focus:ring-purple-900 focus:ring-opacity-80 svelte-1m8e9dq"}" type="${"text"}" name="${"name"}"></label></p>
			<br>
			<p><label class="${"text-purple-900 svelte-1m8e9dq"}">Email: <input class="${"text-black focus:ring-4 focus:ring-purple-900 focus:ring-opacity-80 svelte-1m8e9dq"}" type="${"email"}" name="${"email"}"></label></p>
			<br>
			<p><label class="${"text-purple-900 svelte-1m8e9dq"}">Message: <textarea class="${"text-black focus:ring-4 focus:ring-purple-900 focus:ring-opacity-80 svelte-1m8e9dq"}" name="${"message"}"></textarea></label></p>
			<br>
			<p><input type="${"hidden"}" name="${"workmailaddress"}" value="${""}"></p>
			<p><button class="${"text-purple-900 hover:text-red-500 svelte-1m8e9dq"}" type="${"submit"}">Send </button></p></form>
		<br><br><br><br><br></div>
</section>`;
    });
  }
});

// .svelte-kit/output/server/chunks/general-23d75e28.js
var general_23d75e28_exports = {};
__export(general_23d75e28_exports, {
  default: () => General2,
  prerender: () => prerender21
});
var css$k2, Transkribus, css$j2, Shtetl, css$i2, Hebrew, css$h2, Convert, css$g3, Ahnenblatt, css$f3, Mate, css$e3, Simcha, css$d3, Roots2, css$c3, Jri, css$b3, JewishGen, css$a3, Gems, css$95, Cemeteries, css$85, Prisoners, css$75, Heritage, css$65, Geneanet, css$57, Past, css$410, Find, css$314, Mormons, css$219, Graves2, css$121, Ancestry2, css23, prerender21, General2;
var init_general_23d75e28 = __esm({
  ".svelte-kit/output/server/chunks/general-23d75e28.js"() {
    init_shims();
    init_app_412ff39b();
    init_ssr();
    css$k2 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Transkribus = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$k2);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Transkribus</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639579357/webp/handwriting.webp"}" alt="${"image of an old document"}">
		<br>
		<p>Handwritting<br> recognition software</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3pMHs7H"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$j2 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Shtetl = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$j2);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Shtetl</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639578978/webp/shtetel.webp"}" alt="${"image of jewish market town"}">
		<br>
		<p>Information about towns<br> in the pale of Settlemens</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2QyNd9R"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$i2 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Hebrew = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$i2);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Hebrew</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639569082/webp/hebrew.webp"}" alt="${"image of a hebrew alphabet"}">
		<br>
		<p>Translate <br>Hebrew to English.</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2rn3G3j"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$h2 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Convert = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$h2);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Convert Date</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1620813185/hebrew_calendar_eccuiw.jpg"}" alt="${"image of a calender"}">
		<br>
		<p>Convert the date<br> from Gregorian to <br> Hebrew date.</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3y7d9g4"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$g3 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Ahnenblatt = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$g3);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Ahnenblatt</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638861228/webp/family-tree.webp"}" alt="${"image of a family tree"}">
		<br>
		<p>Genealogy software.</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3lV1E4S"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$f3 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Mate = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$f3);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">View Mate</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1630567213/upload-documents-icon-43250_d7bg3k.jpg"}" alt="${"image of upload icon"}">
		<br>
		<p>Get help with documents <br>and photos translated<br>on Jewishgen forum</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/2Ybem8q"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$e3 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Simcha = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$e3);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Simcha Spot</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1632494275/simcha_zumupb.jpg"}" alt="${"image of simcha logo"}">
		<br>
		<p>Search simcha <br>announcement in the<br> orthodox comunity</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3zEYcBs"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$d3 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Roots2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$d3);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Routes To Roots</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639508993/webp/mag-glass.webp"}" alt="${"image of magnifying glass"}">
		<br>
		<p>Guide to what<br> Jewish civil records<br> are avaiable<br> in eastern europe</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3pQHvPL"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$c3 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Jri = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$c3);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Jri Poland</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639567104/webp/jripoland.webp"}" alt="${"image of jri logo"}">
		<br>
		<p>Free Jewish Genealogy <br>Records &amp; Resourses.</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3paTOpZ"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$b3 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    JewishGen = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$b3);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">JewishGen</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639551623/webp/gen.webp"}" alt="${"image of jewish star of david"}">
		<br>
		<p>Free Search <br>Jewish Genealogy <br>Resourses.</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2KxoBbV"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$a3 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Gems = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$a3);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Jewish Gem&#39;s</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639135750/webp/star.webp"}" alt="${"image of jewish star of david"}">
		<br>
		<p>Jewish <br>geaneology blogger.</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2pwUJXv"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$95 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Cemeteries = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$95);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Cemeteries</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639050305/webp/jewish-graves.webp"}" alt="${"image of a Jewish cemetery"}">
		<br>
		<p>search the <br> database for <br>Jewish cemeteries <br>in Poland.</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/330R55R"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$85 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Prisoners = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$85);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Prisoners of War</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639550605/webp/prisoner.webp"}" alt="${"german prisoner of war photo"}">
		<br>
		<p>Search the first world war<br> prisoners of War archives <br>1914 - 1918.
		</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/3tiMV6S"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$75 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Heritage = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$75);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">My Heritage</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639550255/webp/heritage.webp"}" alt="${"image of My Heritage logo"}">
		<br>
		<p>Search the <br>genealogy database.</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3lmFlUl"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$65 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Geneanet = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$65);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Geneanet</h1>

	<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639508993/webp/mag-glass.webp"}" alt="${"image of magnifying glass"}">
		<br>
		<p>Search the<br> genealogy database.</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/2KtHa5o"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$57 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Past = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$57);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Find My Past</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639508993/webp/mag-glass.webp"}" alt="${"image of magnifying glass"}">
		<br>
		<p>Search the <br>genealogy database.</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2IaI3wT"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$410 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Find = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$410);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Find A Grave</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639508495/webp/graves.webp"}" alt="${"image of a cemetery "}">
		<br>
		<p>Search cemetery <br>records around<br> the world.</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2I5p6M2"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$314 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Mormons = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$314);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Family Search</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639508993/webp/mag-glass.webp"}" alt="${"image of magnifying glass"}">
		<br>
		<p>Free access to <br>family records held<br> by the Mormons.</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/3442Qd1"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$219 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Graves2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$219);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Billion Graves</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639508495/webp/graves.webp"}" alt="${"image of a cemetery "}">
		<br>
		<p>Search cemetery <br>records around<br> the world.</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2I6KSPz"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$121 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Ancestry2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$121);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Ancestry</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639498358/webp/ancestry.webp"}" alt="${"image of ancestry logo"}">
		<br>
		<p>Largest genealogy<br> website Sometimes <br>available free in<br> local libraries.</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/2P0U8GJ"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css23 = {
      code: ".inline-block.svelte-g219g3{display:inline-block}.grid.svelte-g219g3{display:-ms-grid;display:grid}.h-10.svelte-g219g3{height:2.5rem}.text-4xl.svelte-g219g3{font-size:2.25rem;line-height:2.5rem}.ml-8.svelte-g219g3{margin-left:2rem}.mt-3.svelte-g219g3{margin-top:0.75rem}.mt-20.svelte-g219g3{margin-top:5rem}.mt-8.svelte-g219g3{margin-top:2rem}.text-center.svelte-g219g3{text-align:center}.text-purple-500.svelte-g219g3{--tw-text-opacity:1;color:rgba(139, 92, 246, var(--tw-text-opacity))}.w-14.svelte-g219g3{width:3.5rem}.gap-4.svelte-g219g3{grid-gap:1rem;gap:1rem}@media(min-width: 640px){.sm\\:flex.svelte-g219g3{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}}",
      map: null
    };
    prerender21 = true;
    General2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css23);
      return `${$$result.head += `${$$result.title = `<title>General</title>`, ""}`, ""}
<section class="${"one"}"><h1 class="${"ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl svelte-g219g3"}"><div class="${"h-10 w-14 inline-block svelte-g219g3"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639481977/webp/search.webp"}" alt="${"image of man searching"}"></div>

		General Family History Resourses
	</h1>
	<br>
	<section class="${"one"}"><div class="${"grid sm:flex gap-4 mt-20 svelte-g219g3"}">${validate_component(Ancestry2, "Ancestry").$$render($$result, {}, {}, {})}
			${validate_component(Graves2, "Graves").$$render($$result, {}, {}, {})}
			${validate_component(Mormons, "Mormons").$$render($$result, {}, {}, {})}</div>

		<div class="${"grid sm:flex gap-4 mt-8 svelte-g219g3"}">${validate_component(Find, "Find").$$render($$result, {}, {}, {})}
			${validate_component(Past, "Past").$$render($$result, {}, {}, {})}
			${validate_component(Geneanet, "Geneanet").$$render($$result, {}, {}, {})}</div>

		<div class="${"grid sm:flex gap-4 mt-8 svelte-g219g3"}">${validate_component(Heritage, "Heritage").$$render($$result, {}, {}, {})}
			${validate_component(Prisoners, "Prisoners").$$render($$result, {}, {}, {})}</div>

		<h2 class="${"ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl svelte-g219g3"}">General Jewish Family History Resourses
		</h2>
		<br>
		<div class="${"grid sm:flex gap-4 mt-8 svelte-g219g3"}">${validate_component(Cemeteries, "Cemeteries").$$render($$result, {}, {}, {})}
			${validate_component(Convert, "Convert").$$render($$result, {}, {}, {})}
			${validate_component(Gems, "Gems").$$render($$result, {}, {}, {})}</div>

		<div class="${"grid sm:flex gap-4 mt-8 svelte-g219g3"}">${validate_component(JewishGen, "JewishGen").$$render($$result, {}, {}, {})}
			${validate_component(Jri, "Jri").$$render($$result, {}, {}, {})}
			${validate_component(Hebrew, "Hebrew").$$render($$result, {}, {}, {})}</div>

		<div class="${"grid sm:flex gap-4 mt-8 svelte-g219g3"}">${validate_component(Roots2, "Roots").$$render($$result, {}, {}, {})}
			${validate_component(Shtetl, "Shtetl").$$render($$result, {}, {}, {})}
			${validate_component(Simcha, "Simcha").$$render($$result, {}, {}, {})}</div>

		<div class="${"grid sm:flex gap-4 mt-8 svelte-g219g3"}">${validate_component(Mate, "Mate").$$render($$result, {}, {}, {})}</div>

		<h2 class="${"ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl svelte-g219g3"}">General Family History Resourses
		</h2>
		<br>
		<div class="${"grid sm:flex gap-4 mt-8 svelte-g219g3"}">${validate_component(Ahnenblatt, "Ahnenblatt").$$render($$result, {}, {}, {})}
			${validate_component(Transkribus, "Transkribus").$$render($$result, {}, {}, {})}</div></section>
</section>`;
    });
  }
});

// .svelte-kit/output/server/chunks/ireland-f5131930.js
var ireland_f5131930_exports = {};
__export(ireland_f5131930_exports, {
  default: () => Ireland,
  prerender: () => prerender22
});
var css$315, Toolkit, css$220, Genealogy2, css$122, Census, css24, prerender22, Ireland;
var init_ireland_f5131930 = __esm({
  ".svelte-kit/output/server/chunks/ireland-f5131930.js"() {
    init_shims();
    init_app_412ff39b();
    init_ssr();
    css$315 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Toolkit = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$315);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Toolkit</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638894653/webp/shamrock.webp"}" alt="${"shamrock photo"}">
		<br>
		<p>Guide to finding<br> Irish ancestors.</p>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3mTgSHr"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$220 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Genealogy2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$220);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Genealogy</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638861228/webp/family-tree.webp"}" alt="${"family tree photo"}">
		<br>
		<p>Search Irish <br>family history records.</p>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2pDizAW"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$122 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Census = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$122);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Census</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638894153/webp/censusireland.webp"}" alt="${"census photo"}">
		<br>
		<p>Ireland census<br> 1901 &amp; 1911</p>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2QEr9dP"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css24 = {
      code: ".inline-block.svelte-aztiwm{display:inline-block}.grid.svelte-aztiwm{display:-ms-grid;display:grid}.h-10.svelte-aztiwm{height:2.5rem}.text-4xl.svelte-aztiwm{font-size:2.25rem;line-height:2.5rem}.ml-8.svelte-aztiwm{margin-left:2rem}.mt-3.svelte-aztiwm{margin-top:0.75rem}.mt-20.svelte-aztiwm{margin-top:5rem}.text-center.svelte-aztiwm{text-align:center}.text-purple-500.svelte-aztiwm{--tw-text-opacity:1;color:rgba(139, 92, 246, var(--tw-text-opacity))}.w-14.svelte-aztiwm{width:3.5rem}.gap-4.svelte-aztiwm{grid-gap:1rem;gap:1rem}@media(min-width: 640px){.sm\\:flex.svelte-aztiwm{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}}",
      map: null
    };
    prerender22 = true;
    Ireland = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css24);
      return `${$$result.head += `${$$result.title = `<title>Ireland</title>`, ""}`, ""}

<section class="${"one"}"><h1 class="${"ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl svelte-aztiwm"}"><div class="${"h-10 w-14 inline-block svelte-aztiwm"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638893914/webp/ireland-flag.webp"}" alt="${"image of irish flag"}"></div>

		Irish Family History Resourses
	</h1>
	<br>
	<section class="${"one"}"><div class="${"grid sm:flex gap-4 mt-20 svelte-aztiwm"}">${validate_component(Census, "Census").$$render($$result, {}, {}, {})}
			${validate_component(Genealogy2, "Genealogy").$$render($$result, {}, {}, {})}
            ${validate_component(Toolkit, "Toolkit").$$render($$result, {}, {}, {})}</div></section>
</section>`;
    });
  }
});

// .svelte-kit/output/server/chunks/Lost-2750191e.js
var css25, Lost;
var init_Lost_2750191e = __esm({
  ".svelte-kit/output/server/chunks/Lost-2750191e.js"() {
    init_shims();
    init_app_412ff39b();
    css25 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Lost = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css25);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Russian &amp; Ukraine</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638861228/webp/family-tree.webp"}" alt="${"family tree photo"}">
		<br>
		<p>Where to find <br>Ruusian &amp; Ukraine<br> records.</p>
		<br>
		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3pdqA9N"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
  }
});

// .svelte-kit/output/server/chunks/russian-ae88d6bd.js
var russian_ae88d6bd_exports = {};
__export(russian_ae88d6bd_exports, {
  default: () => Russian,
  prerender: () => prerender23
});
var css$b4, First, css$a4, Stalingrad, css$96, Soviet, css$86, Memorial, css$76, Awards, css$66, Leningrad, css$58, War, css$411, Forebears, css$316, Family2, css$221, Cursive, css$123, Latin, css26, prerender23, Russian;
var init_russian_ae88d6bd = __esm({
  ".svelte-kit/output/server/chunks/russian-ae88d6bd.js"() {
    init_shims();
    init_app_412ff39b();
    init_Lost_2750191e();
    init_ssr();
    css$b4 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    First = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$b4);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Soldiers</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638976351/webp/russian_soldiers.webp"}" alt="${"image of a database"}">
		<br>
		<p>Database<br>
			first world war<br> Russian soldiers.
		</p>
		<br><br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/3bomxTg"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$a4 = {
      code: ".bg-indigo-700.svelte-13tzqgo{--tw-bg-opacity:1;background-color:rgba(67, 56, 202, var(--tw-bg-opacity))}.hover\\:bg-indigo-800.svelte-13tzqgo:hover{--tw-bg-opacity:1;background-color:rgba(55, 48, 163, var(--tw-bg-opacity))}.rounded-lg.svelte-13tzqgo{border-radius:0.5rem}.h-32.svelte-13tzqgo{height:8rem}.h-8.svelte-13tzqgo{height:2rem}.text-2xl.svelte-13tzqgo{font-size:1.5rem;line-height:2rem}.text-sm.svelte-13tzqgo{font-size:0.875rem;line-height:1.25rem}.m-4.svelte-13tzqgo{margin:1rem}.m-2.svelte-13tzqgo{margin:0.5rem}.object-fill.svelte-13tzqgo{-o-object-fit:fill;object-fit:fill}.p-4.svelte-13tzqgo{padding:1rem}.p-6.svelte-13tzqgo{padding:1.5rem}.px-4.svelte-13tzqgo{padding-left:1rem;padding-right:1rem}.shadow-2xl.svelte-13tzqgo{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-right.svelte-13tzqgo{text-align:right}.text-white.svelte-13tzqgo{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-13tzqgo:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.text-indigo-100.svelte-13tzqgo{--tw-text-opacity:1;color:rgba(224, 231, 255, var(--tw-text-opacity))}.w-auto.svelte-13tzqgo{width:auto}.w-full.svelte-13tzqgo{width:100%}.transition-colors.svelte-13tzqgo{-webkit-transition-property:background-color, border-color, color, fill, stroke;-o-transition-property:background-color, border-color, color, fill, stroke;transition-property:background-color, border-color, color, fill, stroke;-webkit-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-o-transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);-webkit-transition-duration:150ms;-o-transition-duration:150ms;transition-duration:150ms}.duration-150.svelte-13tzqgo{-webkit-transition-duration:150ms;-o-transition-duration:150ms;transition-duration:150ms}",
      map: null
    };
    Stalingrad = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$a4);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-13tzqgo"}"><div class="${"p-6 svelte-13tzqgo"}"><h1 class="${"text-2xl text-white svelte-13tzqgo"}">Stalingrad</h1>

		<img class="${"h-32 w-full object-fill svelte-13tzqgo"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638974961/webp/Stalingrad.webp"}" alt="${"battle of stalingrad photo"}">
		<br>
		<p>Database of <br>military and civilians <br>who were at the<br> battle of Stalingrad.<br>23 August 1942<br> to 2 February 1943
		</p>
		<br>
		<a class="${"text-white hover:text-yellow-500 svelte-13tzqgo"}" href="${"https://bit.ly/3rJiGso"}" target="${"_blank"}">Go to The Website
		</a></div>
	<div class="${"text-right svelte-13tzqgo"}"><button class="${"h-8 px-4 m-2 text-sm text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800 svelte-13tzqgo"}">New</button></div>
</div>`;
    });
    css$96 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Soviet = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$96);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Soviet Union</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638963974/webp/soviet-map.webp"}" alt="${"soviet map photo"}">
		<br>
		<p>Database of <br> people who <br>received awards <br>1939 to 1990.
		</p>
		<br>
		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/36okbzQ"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$86 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Memorial = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$86);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Military Memorial</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638963768/webp/war.webp"}" alt="${"russain war memorial photo"}">
		<br>
		<p>Russian military<br> database of <br>war dead.</p>
		<br>
		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2IcNoUv"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$76 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Awards = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$76);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Military Awards</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638963374/webp/soviet-medals.webp"}" alt="${"soviet medals photo"}">
		<br>
		<p>Russian military <br>database of<br> military awards.</p>
		<br>
		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2HRv8Rh"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$66 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Leningrad = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$66);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Leningrad</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638947447/webp/lenigrad.webp"}" alt="${"photo of Leningrad Siege"}">
		<br>
		<p>Database<br>of the<br>
			dead and evacuated<br> residents<br> of Leningrad.
		</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3ttN3Rv"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$58 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    War = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$58);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">War</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638859747/webp/database.webp"}" alt="${"database photo"}">
		<br>
		<p>Database <br>Russian Soldier&#39;s</p>
		<br>
		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3kh2cAp"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$411 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Forebears = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$411);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Forebears</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638859747/webp/database.webp"}" alt="${"database photo"}">
		<br>
		<p>Russian <br>genealogical records.</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2OA2V33"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$316 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Family2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$316);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Family</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638861228/webp/family-tree.webp"}" alt="${"family tree photo"}">
		<br>
		<p>Russian <br>surname search.</p>
		<br>
		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2Dz1o6Q"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$221 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Cursive = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$221);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Print &amp; Cursive</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638945685/webp/cyrillic.webp"}" alt="${"cyrillic alphabet photo"}">
		<br>
		<p>Converting between<br> Russian<br> Print and Cursive.</p>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2KByKnY"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$123 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Latin = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$123);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Cyrillic to Latin</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638945685/webp/cyrillic.webp"}" alt="${"cyrillic alphabet photo"}">
		<br>
		<p>Convert Cyrillic<br>to Latin.</p>
		<br>
		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2we7uZz"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css26 = {
      code: ".inline-block.svelte-g219g3{display:inline-block}.grid.svelte-g219g3{display:-ms-grid;display:grid}.h-10.svelte-g219g3{height:2.5rem}.text-4xl.svelte-g219g3{font-size:2.25rem;line-height:2.5rem}.ml-8.svelte-g219g3{margin-left:2rem}.mt-3.svelte-g219g3{margin-top:0.75rem}.mt-20.svelte-g219g3{margin-top:5rem}.mt-8.svelte-g219g3{margin-top:2rem}.text-center.svelte-g219g3{text-align:center}.text-purple-500.svelte-g219g3{--tw-text-opacity:1;color:rgba(139, 92, 246, var(--tw-text-opacity))}.w-14.svelte-g219g3{width:3.5rem}.gap-4.svelte-g219g3{grid-gap:1rem;gap:1rem}@media(min-width: 640px){.sm\\:flex.svelte-g219g3{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}}",
      map: null
    };
    prerender23 = true;
    Russian = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css26);
      return `${$$result.head += `${$$result.title = `<title>Russian</title>`, ""}`, ""}

<section class="${"one"}"><h1 class="${"ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl svelte-g219g3"}"><div class="${"h-10 w-14 inline-block svelte-g219g3"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638945399/webp/russian-flag.webp"}" alt="${"image of Russian flag"}"></div>

		Russian Family History Resourses
	</h1>
	<br>
	<section class="${"one"}"><div class="${"grid sm:flex gap-4 mt-20 svelte-g219g3"}">${validate_component(Latin, "Latin").$$render($$result, {}, {}, {})}
			${validate_component(Cursive, "Cursive").$$render($$result, {}, {}, {})}
			${validate_component(Family2, "Family").$$render($$result, {}, {}, {})}</div>

		<div class="${"grid sm:flex gap-4 mt-8 svelte-g219g3"}">${validate_component(Forebears, "Forebears").$$render($$result, {}, {}, {})}
			${validate_component(War, "War").$$render($$result, {}, {}, {})}
			${validate_component(Leningrad, "Leningrad").$$render($$result, {}, {}, {})}</div>

		<div class="${"grid sm:flex gap-4 mt-8 svelte-g219g3"}">${validate_component(Lost, "Lost").$$render($$result, {}, {}, {})}
			${validate_component(Awards, "Awards").$$render($$result, {}, {}, {})}
			${validate_component(Memorial, "Memorial").$$render($$result, {}, {}, {})}</div>

		<div class="${"grid sm:flex gap-4 mt-8 svelte-g219g3"}">${validate_component(First, "First").$$render($$result, {}, {}, {})}
			${validate_component(Soviet, "Soviet").$$render($$result, {}, {}, {})}
			${validate_component(Stalingrad, "Stalingrad").$$render($$result, {}, {}, {})}</div></section>
</section>`;
    });
  }
});

// .svelte-kit/output/server/chunks/ukraine-f0853eac.js
var ukraine_f0853eac_exports = {};
__export(ukraine_f0853eac_exports, {
  default: () => Ukraine,
  prerender: () => prerender24
});
var css$317, Ukstate, css$222, Residents, css$124, Dnipropetrovsk, css27, prerender24, Ukraine;
var init_ukraine_f0853eac = __esm({
  ".svelte-kit/output/server/chunks/ukraine-f0853eac.js"() {
    init_shims();
    init_app_412ff39b();
    init_Lost_2750191e();
    init_ssr();
    css$317 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Ukstate = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$317);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">State Archives</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638860017/webp/archives.webp"}" alt="${"image of archive"}">
		<br>
		<p>Ukraine <br>State Archives</p>
		<br>
		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/35ljvvG"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$222 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Residents = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$222);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Residents</h1>
		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638859747/webp/database.webp"}" alt="${"image of a archives"}">

		<br>
		<p>Database of<br>Ukrainian residents born <br>between 1650 and 1920</p>
		<br>
		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/33c5lJh"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$124 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Dnipropetrovsk = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$124);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Dnipropetrovsk</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638860017/webp/archives.webp"}" alt="${"image of a archives"}">
		<br>
		<p>State Archives.</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/35SEKp5"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css27 = {
      code: ".inline-block.svelte-g219g3{display:inline-block}.grid.svelte-g219g3{display:-ms-grid;display:grid}.h-10.svelte-g219g3{height:2.5rem}.text-4xl.svelte-g219g3{font-size:2.25rem;line-height:2.5rem}.ml-8.svelte-g219g3{margin-left:2rem}.mt-3.svelte-g219g3{margin-top:0.75rem}.mt-20.svelte-g219g3{margin-top:5rem}.mt-8.svelte-g219g3{margin-top:2rem}.text-center.svelte-g219g3{text-align:center}.text-purple-500.svelte-g219g3{--tw-text-opacity:1;color:rgba(139, 92, 246, var(--tw-text-opacity))}.w-14.svelte-g219g3{width:3.5rem}.gap-4.svelte-g219g3{grid-gap:1rem;gap:1rem}@media(min-width: 640px){.sm\\:flex.svelte-g219g3{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}}",
      map: null
    };
    prerender24 = true;
    Ukraine = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css27);
      return `${$$result.head += `${$$result.title = `<title>Ukraine</title>`, ""}`, ""}

<section class="${"one"}"><h1 class="${"ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl svelte-g219g3"}"><div class="${"h-10 w-14 inline-block svelte-g219g3"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638978523/webp/ukraine-flag.webp"}" alt="${"image of Ukraine flag"}"></div>

		Ukraine Family History Resourses
	</h1>
	<br>
	<section class="${"one"}"><div class="${"grid sm:flex gap-4 mt-20 svelte-g219g3"}">${validate_component(Dnipropetrovsk, "Dnipropetrovsk").$$render($$result, {}, {}, {})}
			${validate_component(Residents, "Residents").$$render($$result, {}, {}, {})}
			${validate_component(Lost, "Lost").$$render($$result, {}, {}, {})}</div>

		<div class="${"grid sm:flex gap-4 mt-8 svelte-g219g3"}">${validate_component(Ukstate, "Ukstate").$$render($$result, {}, {}, {})}</div></section>
</section>`;
    });
  }
});

// .svelte-kit/output/server/chunks/canada-381d4639.js
var canada_381d4639_exports = {};
__export(canada_381d4639_exports, {
  default: () => Canada,
  prerender: () => prerender25
});
var css$125, Canstate, css28, prerender25, Canada;
var init_canada_381d4639 = __esm({
  ".svelte-kit/output/server/chunks/canada-381d4639.js"() {
    init_shims();
    init_app_412ff39b();
    init_ssr();
    css$125 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Canstate = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$125);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">State Archives</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638860017/webp/archives.webp"}" alt="${"archive photo"}">
		<br>
		<p>Canadian<br> State Archives</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3qgHapG"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css28 = {
      code: ".inline-block.svelte-aztiwm{display:inline-block}.grid.svelte-aztiwm{display:-ms-grid;display:grid}.h-10.svelte-aztiwm{height:2.5rem}.text-4xl.svelte-aztiwm{font-size:2.25rem;line-height:2.5rem}.ml-8.svelte-aztiwm{margin-left:2rem}.mt-3.svelte-aztiwm{margin-top:0.75rem}.mt-20.svelte-aztiwm{margin-top:5rem}.text-center.svelte-aztiwm{text-align:center}.text-purple-500.svelte-aztiwm{--tw-text-opacity:1;color:rgba(139, 92, 246, var(--tw-text-opacity))}.w-14.svelte-aztiwm{width:3.5rem}.gap-4.svelte-aztiwm{grid-gap:1rem;gap:1rem}@media(min-width: 640px){.sm\\:flex.svelte-aztiwm{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}}",
      map: null
    };
    prerender25 = true;
    Canada = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css28);
      return `${$$result.head += `${$$result.title = `<title>Canada</title>`, ""}`, ""}
<section class="${"one"}"><h1 class="${"ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl svelte-aztiwm"}"><div class="${"h-10 w-14 inline-block svelte-aztiwm"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639243547/webp/canada-flag.webp"}" alt="${"image of Canadian flag"}"></div>

		Canadian Family History Resourses
	</h1>
	<br>
	<section class="${"one"}"><div class="${"grid sm:flex gap-4 mt-20  svelte-aztiwm"}">${validate_component(Canstate, "Canstate").$$render($$result, {}, {}, {})}</div></section>
</section>`;
    });
  }
});

// .svelte-kit/output/server/chunks/french-086eb74d.js
var french_086eb74d_exports = {};
__export(french_086eb74d_exports, {
  default: () => French,
  prerender: () => prerender26
});
var css$223, Fstate, css$126, Naturalisation, css29, prerender26, French;
var init_french_086eb74d = __esm({
  ".svelte-kit/output/server/chunks/french-086eb74d.js"() {
    init_shims();
    init_app_412ff39b();
    init_ssr();
    css$223 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Fstate = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$223);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">State Archives</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638860017/webp/archives.webp"}" alt="${"archive photo"}">
		<br>
		<p>French State Archives</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3lQG01v"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$126 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Naturalisation = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$126);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Naturalisation</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638860017/webp/archives.webp"}" alt="${"archive photo"}">
		<br>
		<p>naturalisation lists <br>published in the<br> newspapers 1883-1948</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3nFXfDd"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css29 = {
      code: ".inline-block.svelte-aztiwm{display:inline-block}.grid.svelte-aztiwm{display:-ms-grid;display:grid}.h-10.svelte-aztiwm{height:2.5rem}.text-4xl.svelte-aztiwm{font-size:2.25rem;line-height:2.5rem}.ml-8.svelte-aztiwm{margin-left:2rem}.mt-3.svelte-aztiwm{margin-top:0.75rem}.mt-20.svelte-aztiwm{margin-top:5rem}.text-center.svelte-aztiwm{text-align:center}.text-purple-500.svelte-aztiwm{--tw-text-opacity:1;color:rgba(139, 92, 246, var(--tw-text-opacity))}.w-14.svelte-aztiwm{width:3.5rem}.gap-4.svelte-aztiwm{grid-gap:1rem;gap:1rem}@media(min-width: 640px){.sm\\:flex.svelte-aztiwm{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}}",
      map: null
    };
    prerender26 = true;
    French = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css29);
      return `${$$result.head += `${$$result.title = `<title>French</title>`, ""}`, ""}

<section class="${"one"}"><h1 class="${"ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl svelte-aztiwm"}"><div class="${"h-10 w-14 inline-block svelte-aztiwm"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638892550/webp/french-flag.webp"}" alt="${"image of French flag"}"></div>

		French Family History Resourses
	</h1>
	<br>
	<section class="${"one"}"><div class="${"grid sm:flex gap-4 mt-20 svelte-aztiwm"}">${validate_component(Naturalisation, "Naturalisation").$$render($$result, {}, {}, {})}
			${validate_component(Fstate, "Fstate").$$render($$result, {}, {}, {})}</div></section>
</section>`;
    });
  }
});

// .svelte-kit/output/server/chunks/shoah-a60ba7be.js
var shoah_a60ba7be_exports = {};
__export(shoah_a60ba7be_exports, {
  default: () => Shoah,
  prerender: () => prerender27
});
var css$97, Yad, css$87, Ushmm, css$77, Records, css$67, Holocaust, css$59, French2, css$412, Camps, css$318, Galisian, css$224, Auschwitz, css$127, Arolsen, css30, prerender27, Shoah;
var init_shoah_a60ba7be = __esm({
  ".svelte-kit/output/server/chunks/shoah-a60ba7be.js"() {
    init_shims();
    init_app_412ff39b();
    init_ssr();
    css$97 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Yad = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$97);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Yad Vashem</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639405281/webp/flame.webp"}" alt="${"image of hall of memorial flame"}">
		<br>
		<p>The central database <br>of shoah victims.</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2Jm04Iw"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$87 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Ushmm = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$87);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Ushmm</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638859747/webp/database.webp"}" alt="${"image of a database"}">
		<br>
		<p>Holocaust Survivors<br> and Victims Database.</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2JLIKd0"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$77 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Records = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$77);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Holocaust records</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639404803/webp/remember.webp"}" alt="${"image ancestry remember project"}">
		<br>
		<p>Free search ancestry <br>holocaust records.</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3jjfQWx"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$67 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Holocaust = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$67);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Holocaust Database</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638859747/webp/database.webp"}" alt="${"image of a database"}">
		<br>
		<p>Search JewishGen <br>holocaust database.</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2rcyjaR"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$59 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    French2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$59);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Deportations</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639404240/webp/memorial-de-la-shoah.webp"}" alt="${"image of Memorial de la shoah"}">
		<br>
		<p>Search Memorial <br>de la shoah<br>deportation records.</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3fjLI8E"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$412 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Camps = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$412);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Camps</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639403955/webp/camps.webp"}" alt="${"image of concentration Camps roll call"}">
		<br>
		<p>List of camps</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2Jv5v6D"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$318 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Galisian = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$318);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Austrian &amp; Galisian</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638859747/webp/database.webp"}" alt="${"image of a database"}">
		<br>
		<p>Search<br> Austrian &amp; Galisian<br> Victims of the Holocaust.</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3q9eE9x"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$224 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Auschwitz = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$224);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Auschwitz</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639403387/webp/gate.webp"}" alt="${"image of Auchwits front gate"}">
		<br>
		<p>Search Auschwitz <br>prisoners database.</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2JIO7ts"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$127 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Arolsen = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$127);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Arolsen</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638859747/webp/database.webp"}" alt="${"image of a database"}">
		<br>
		<p>International tracing<br> Service database.</p>
		<br>
		

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/2VdA3QJ"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css30 = {
      code: ".inline-block.svelte-cilmxy{display:inline-block}.grid.svelte-cilmxy{display:-ms-grid;display:grid}.h-10.svelte-cilmxy{height:2.5rem}.h-full.svelte-cilmxy{height:100%}.text-4xl.svelte-cilmxy{font-size:2.25rem;line-height:2.5rem}.ml-8.svelte-cilmxy{margin-left:2rem}.mt-3.svelte-cilmxy{margin-top:0.75rem}.mr-20.svelte-cilmxy{margin-right:5rem}.mt-20.svelte-cilmxy{margin-top:5rem}.mt-8.svelte-cilmxy{margin-top:2rem}.object-fill.svelte-cilmxy{-o-object-fit:fill;object-fit:fill}.text-center.svelte-cilmxy{text-align:center}.text-purple-500.svelte-cilmxy{--tw-text-opacity:1;color:rgba(139, 92, 246, var(--tw-text-opacity))}.w-14.svelte-cilmxy{width:3.5rem}.w-50.svelte-cilmxy{width:12.5rem}.gap-4.svelte-cilmxy{grid-gap:1rem;gap:1rem}@media(min-width: 640px){.sm\\:flex.svelte-cilmxy{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}}",
      map: null
    };
    prerender27 = true;
    Shoah = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css30);
      return `${$$result.head += `${$$result.title = `<title>Shoah</title>`, ""}`, ""}
<section class="${"one"}"><h1 class="${"ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl svelte-cilmxy"}"><div class="${"h-10 w-14 inline-block mr-20 svelte-cilmxy"}"><iframe class="${"h-full w-50 object-fill svelte-cilmxy"}" title="${"candle flame"}" src="${"https://giphy.com/embed/j7N0GKEWqZxNC"}" frameborder="${"0"}" allow="${"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"}" allowfullscreen></iframe></div>

		Shoah Resourses
	</h1>
	<br>
	<section class="${"one"}"><div class="${"grid sm:flex gap-4 mt-20 svelte-cilmxy"}">${validate_component(Arolsen, "Arolsen").$$render($$result, {}, {}, {})}
			${validate_component(Auschwitz, "Auschwitz").$$render($$result, {}, {}, {})}
			${validate_component(Galisian, "Galisian").$$render($$result, {}, {}, {})}</div>
		<div class="${"grid sm:flex gap-4 mt-8 svelte-cilmxy"}">${validate_component(Camps, "Camps").$$render($$result, {}, {}, {})}
			${validate_component(French2, "French").$$render($$result, {}, {}, {})}
			${validate_component(Holocaust, "Holocaust").$$render($$result, {}, {}, {})}</div>

		<div class="${"grid sm:flex gap-4 mt-8 svelte-cilmxy"}">${validate_component(Records, "Records").$$render($$result, {}, {}, {})}
			${validate_component(Ushmm, "Ushmm").$$render($$result, {}, {}, {})}
			${validate_component(Yad, "Yad").$$render($$result, {}, {}, {})}</div></section>
</section>`;
    });
  }
});

// .svelte-kit/output/server/chunks/usa-j-66d6eaa3.js
var usa_j_66d6eaa3_exports = {};
__export(usa_j_66d6eaa3_exports, {
  default: () => Usa_j,
  prerender: () => prerender28
});
var css$225, Cemny99, css$128, Society992, css31, prerender28, Usa_j;
var init_usa_j_66d6eaa3 = __esm({
  ".svelte-kit/output/server/chunks/usa-j-66d6eaa3.js"() {
    init_shims();
    init_app_412ff39b();
    init_ssr();
    css$225 = {
      code: ".bg-gray-50.svelte-1wwpskm{--tw-bg-opacity:1;background-color:rgba(249, 250, 251, var(--tw-bg-opacity))}.rounded-lg.svelte-1wwpskm{border-radius:0.5rem}.border.svelte-1wwpskm{border-width:1px}.m-4.svelte-1wwpskm{margin:1rem}.overflow-auto.svelte-1wwpskm{overflow:auto}.p-4.svelte-1wwpskm{padding:1rem}.px-4.svelte-1wwpskm{padding-left:1rem;padding-right:1rem}.py-2.svelte-1wwpskm{padding-top:0.5rem;padding-bottom:0.5rem}.shadow-2xl.svelte-1wwpskm{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.table-auto.svelte-1wwpskm{table-layout:auto}.text-left.svelte-1wwpskm{text-align:left}.text-white.svelte-1wwpskm{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-1wwpskm:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.text-gray-700.svelte-1wwpskm{--tw-text-opacity:1;color:rgba(55, 65, 81, var(--tw-text-opacity))}.w-auto.svelte-1wwpskm{width:auto}",
      map: null
    };
    Cemny99 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$225);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl overflow-auto svelte-1wwpskm"}"><div class="${"two"}"><table class="${"table-auto overflow-auto text-left svelte-1wwpskm"}"><thead><tr><th class="${"px-4 py-2 svelte-1wwpskm"}">Cemetery</th>
				<th class="${"px-4 py-2 svelte-1wwpskm"}">Address</th>
				<th class="${"px-4 py-2 svelte-1wwpskm"}">Year Opened</th></tr></thead>
		<tbody><tr><td class="${"border px-4 py-2 svelte-1wwpskm"}"><a class="${"text-white hover:text-yellow-500 svelte-1wwpskm"}" href="${"http://bit.ly/2IoEfZC"}" target="${"_blank"}">Montefiore
					</a></td>
				<td class="${"border px-4 py-2 svelte-1wwpskm"}">121-83 Springfield Boulevard Springfield Gardens Queens NY 11413t
				</td>
				<td class="${"border px-4 py-2 svelte-1wwpskm"}">1908</td></tr>

			<tr class="${"bg-gray-50 svelte-1wwpskm"}"><td class="${"border px-4 py-2 svelte-1wwpskm"}"><a class="${"text-gray-700 hover:text-yellow-500 svelte-1wwpskm"}" href="${"http://bit.ly/2IjNtGN"}" target="${"_blank"}">Mount Ararat
					</a></td>
				<td class="${"border px-4 py-2 svelte-1wwpskm"}">1165 Route 109 (NY-109) Lindenhurst NY 11757 </td>
				<td class="${"border px-4 py-2 svelte-1wwpskm"}">1931</td></tr>
			<td class="${"border px-4 py-2 svelte-1wwpskm"}"><a class="${"text-white hover:text-yellow-500 svelte-1wwpskm"}" href="${"http://bit.ly/2INXmvX"}" target="${"_blank"}">Mount Carmel
				</a></td>
			<td class="${"border px-4 py-2 svelte-1wwpskm"}">83-45 Cypress Hills Street Glendale NY 11385 </td>
			<td class="${"border px-4 py-2 svelte-1wwpskm"}">1906</td>

			<tr class="${"bg-gray-50 svelte-1wwpskm"}"><td class="${"border px-4 py-2 svelte-1wwpskm"}"><a class="${"text-gray-700 hover:text-yellow-500 svelte-1wwpskm"}" href="${"http://bit.ly/3p0g2tB"}" target="${"_blank"}">Mount Hebron
					</a></td>
				<td class="${"border px-4 py-2 svelte-1wwpskm"}">130-04 Horace Harding Expressway Flushing, NY 11367 </td>
				<td class="${"border px-4 py-2 svelte-1wwpskm"}">1909</td></tr>

			<tr><td class="${"border px-4 py-2 svelte-1wwpskm"}"><a class="${"text-white hover:text-yellow-500 svelte-1wwpskm"}" href="${"http://bit.ly/2rKL3qf"}" target="${"_blank"}">Mount Judah
					</a></td>
				<td class="${"border px-4 py-2 svelte-1wwpskm"}">81-14 Cypress Avenue Ridgewood NY 11385 </td>
				<td class="${"border px-4 py-2 svelte-1wwpskm"}">1912</td></tr>

			<tr class="${"bg-gray-50 svelte-1wwpskm"}"><td class="${"border px-4 py-2 svelte-1wwpskm"}"><a class="${"text-gray-700 hover:text-yellow-500 svelte-1wwpskm"}" href="${"http://bit.ly/2s5VQhJ"}" target="${"_blank"}">Mount Lebanon
					</a></td>
				<td class="${"border px-4 py-2 svelte-1wwpskm"}">7800 Myrtle Avenue Glendale NY 11385 </td>
				<td class="${"border px-4 py-2 svelte-1wwpskm"}">1915</td></tr>

			<tr><td class="${"border px-4 py-2 svelte-1wwpskm"}">Mount Moriah </td>
				<td class="${"border px-4 py-2 svelte-1wwpskm"}">685 Fairview Ave Fairview NJ 07022 </td>
				<td class="${"border px-4 py-2 svelte-1wwpskm"}">1910</td></tr>

			<tr class="${"bg-gray-50 svelte-1wwpskm"}"><td class="${"border px-4 py-2 svelte-1wwpskm"}"><a class="${"text-gray-700 hover:text-yellow-500 svelte-1wwpskm"}" href="${"http://bit.ly/2GokRGq"}" target="${"_blank"}">Mount Zion
					</a></td>
				<td class="${"border px-4 py-2 svelte-1wwpskm"}">59-63 54th Avenue Maspeth NY 11378 </td>
				<td class="${"border px-4 py-2 svelte-1wwpskm"}">1893</td></tr>

			<tr><td class="${"border px-4 py-2 svelte-1wwpskm"}"><a class="${"text-gray-700 hover:text-yellow-500 svelte-1wwpskm"}" href="${"http://bit.ly/2ImWQ4d"}" target="${"_blank"}">New Montefiore
					</a></td>
				<td class="${"border px-4 py-2 svelte-1wwpskm"}">1180 Wellwood Ave West Babylon NY 11704 </td>
				<td class="${"border px-4 py-2 svelte-1wwpskm"}">1928</td></tr></tbody></table></div>
</div>`;
    });
    css$128 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Society992 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$128);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Family History</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639135750/webp/star.webp"}" alt="${"image of star of david"}">
		<br>
		<p>Search the <br>New York records.</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2rO6cis"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css31 = {
      code: ".inline-block.svelte-wxn5xt{display:inline-block}.grid.svelte-wxn5xt{display:-ms-grid;display:grid}.h-10.svelte-wxn5xt{height:2.5rem}.text-4xl.svelte-wxn5xt{font-size:2.25rem;line-height:2.5rem}.ml-8.svelte-wxn5xt{margin-left:2rem}.mt-3.svelte-wxn5xt{margin-top:0.75rem}.mt-20.svelte-wxn5xt{margin-top:5rem}.text-center.svelte-wxn5xt{text-align:center}.text-purple-500.svelte-wxn5xt{--tw-text-opacity:1;color:rgba(139, 92, 246, var(--tw-text-opacity))}.w-14.svelte-wxn5xt{width:3.5rem}.gap-4.svelte-wxn5xt{grid-gap:1rem;gap:1rem}.grid-cols-1.svelte-wxn5xt{grid-template-columns:repeat(1, minmax(0, 1fr))}@media(min-width: 640px){.sm\\:flex.svelte-wxn5xt{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}}",
      map: null
    };
    prerender28 = true;
    Usa_j = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css31);
      return `${$$result.head += `${$$result.title = `<title>USA Jewish</title>`, ""}`, ""}
<section class="${"one"}"><h1 class="${"ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl svelte-wxn5xt"}"><div class="${"h-10 w-14 inline-block svelte-wxn5xt"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639389123/webp/american-flag.webp"}" alt="${"image of USA flag"}"></div>
		<div class="${"h-10 w-14 inline-block svelte-wxn5xt"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639135750/webp/star.webp"}" alt="${"image of star of david"}"></div>
		USA Jewish Family History Resourses
	</h1>
	<br>
	<section class="${"one"}"><div class="${"grid sm:flex gap-4 mt-20  svelte-wxn5xt"}">${validate_component(Society992, "Society99").$$render($$result, {}, {}, {})}</div>
		<h2 class="${"text-purple-500 text-font-sans text-4xl svelte-wxn5xt"}">Jewish Cemeteries New York</h2></section>

	<section class="${"two"}"></section>
	<div class="${"grid grid-cols-1 gap-4 svelte-wxn5xt"}">${validate_component(Cemny99, "Cemny99").$$render($$result, {}, {}, {})}
		<div></div></div>
</section>`;
    });
  }
});

// .svelte-kit/output/server/chunks/video-779ebba2.js
var video_779ebba2_exports = {};
__export(video_779ebba2_exports, {
  default: () => Video,
  prerender: () => prerender29
});
var css$88, Probate, css$78, Raf2, css$68, Marriage, css$510, Nat, css$413, Electorial, css$319, Companies3, css$226, Name, css$129, Buried, css32, prerender29, Video;
var init_video_779ebba2 = __esm({
  ".svelte-kit/output/server/chunks/video-779ebba2.js"() {
    init_shims();
    init_app_412ff39b();
    init_ssr();
    css$88 = {
      code: ".rounded-lg.svelte-e4hyfh{border-radius:0.5rem}.h-32.svelte-e4hyfh{height:8rem}.text-2xl.svelte-e4hyfh{font-size:1.5rem;line-height:2rem}.m-4.svelte-e4hyfh{margin:1rem}.object-fill.svelte-e4hyfh{-o-object-fit:fill;object-fit:fill}.p-4.svelte-e4hyfh{padding:1rem}.p-6.svelte-e4hyfh{padding:1.5rem}.shadow-2xl.svelte-e4hyfh{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-e4hyfh{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.w-auto.svelte-e4hyfh{width:auto}.w-full.svelte-e4hyfh{width:100%}",
      map: null
    };
    Probate = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$88);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-e4hyfh"}"><div class="${"p-6 svelte-e4hyfh"}"><h1 class="${"text-2xl text-white svelte-e4hyfh"}">How to get a <br>copy of a Uk will <br>and letter of probate.
		</h1>
		<br>
		<iframe class="${"h-32 w-full object-fill svelte-e4hyfh"}" title="${"burial jewish London uk"}" src="${"https://www.youtube.com/embed/LOFKGhsCyHg"}" frameborder="${"0"}" allow="${"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"}" allowfullscreen></iframe>
		<br></div>
</div>`;
    });
    css$78 = {
      code: ".rounded-lg.svelte-e4hyfh{border-radius:0.5rem}.h-32.svelte-e4hyfh{height:8rem}.text-2xl.svelte-e4hyfh{font-size:1.5rem;line-height:2rem}.m-4.svelte-e4hyfh{margin:1rem}.object-fill.svelte-e4hyfh{-o-object-fit:fill;object-fit:fill}.p-4.svelte-e4hyfh{padding:1rem}.p-6.svelte-e4hyfh{padding:1.5rem}.shadow-2xl.svelte-e4hyfh{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-e4hyfh{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.w-auto.svelte-e4hyfh{width:auto}.w-full.svelte-e4hyfh{width:100%}",
      map: null
    };
    Raf2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$78);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-e4hyfh"}"><div class="${"p-6 svelte-e4hyfh"}"><h1 class="${"text-2xl text-white svelte-e4hyfh"}">How to find a<br>
			First world war <br>service record,<br>
			Royal Navy, <br>Royal flying Corp<br> &amp; RAF
		</h1>
		<br>
		<iframe class="${"h-32 w-full object-fill svelte-e4hyfh"}" title="${"burial jewish London uk"}" src="${"https://www.youtube.com/embed/MGLHGV2LP2I"}" frameborder="${"0"}" allow="${"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"}" allowfullscreen></iframe>
		<br></div>
</div>`;
    });
    css$68 = {
      code: ".rounded-lg.svelte-e4hyfh{border-radius:0.5rem}.h-32.svelte-e4hyfh{height:8rem}.text-2xl.svelte-e4hyfh{font-size:1.5rem;line-height:2rem}.m-4.svelte-e4hyfh{margin:1rem}.object-fill.svelte-e4hyfh{-o-object-fit:fill;object-fit:fill}.p-4.svelte-e4hyfh{padding:1rem}.p-6.svelte-e4hyfh{padding:1.5rem}.shadow-2xl.svelte-e4hyfh{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-e4hyfh{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.w-auto.svelte-e4hyfh{width:auto}.w-full.svelte-e4hyfh{width:100%}",
      map: null
    };
    Marriage = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$68);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-e4hyfh"}"><div class="${"p-6 svelte-e4hyfh"}"><h1 class="${"text-2xl text-white svelte-e4hyfh"}">How to find a <br>
			Jewish marriage<br> authorisation document uk
		</h1>
		<br>
		<iframe class="${"h-32 w-full object-fill svelte-e4hyfh"}" title="${"Marriage authorisation uk"}" src="${"https://www.youtube.com/embed/690fZvaE0Ek"}" frameborder="${"0"}" allow="${"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"}" allowfullscreen></iframe>
		<br></div>
</div>`;
    });
    css$510 = {
      code: ".rounded-lg.svelte-e4hyfh{border-radius:0.5rem}.h-32.svelte-e4hyfh{height:8rem}.text-2xl.svelte-e4hyfh{font-size:1.5rem;line-height:2rem}.m-4.svelte-e4hyfh{margin:1rem}.object-fill.svelte-e4hyfh{-o-object-fit:fill;object-fit:fill}.p-4.svelte-e4hyfh{padding:1rem}.p-6.svelte-e4hyfh{padding:1.5rem}.shadow-2xl.svelte-e4hyfh{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-e4hyfh{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.w-auto.svelte-e4hyfh{width:auto}.w-full.svelte-e4hyfh{width:100%}",
      map: null
    };
    Nat = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$510);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-e4hyfh"}"><div class="${"p-6 svelte-e4hyfh"}"><h1 class="${"text-2xl text-white svelte-e4hyfh"}">How to find a <br>naturalization certificate<br>
			uk
		</h1>
		<br>
		<iframe class="${"h-32 w-full object-fill svelte-e4hyfh"}" title="${"Marriage authorisation uk"}" src="${"https://www.youtube.com/embed/vzGMUXkeDD4"}" frameborder="${"0"}" allow="${"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"}" allowfullscreen></iframe>
		<br></div>
</div>`;
    });
    css$413 = {
      code: ".rounded-lg.svelte-e4hyfh{border-radius:0.5rem}.h-32.svelte-e4hyfh{height:8rem}.text-2xl.svelte-e4hyfh{font-size:1.5rem;line-height:2rem}.m-4.svelte-e4hyfh{margin:1rem}.object-fill.svelte-e4hyfh{-o-object-fit:fill;object-fit:fill}.p-4.svelte-e4hyfh{padding:1rem}.p-6.svelte-e4hyfh{padding:1.5rem}.shadow-2xl.svelte-e4hyfh{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-e4hyfh{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.w-auto.svelte-e4hyfh{width:auto}.w-full.svelte-e4hyfh{width:100%}",
      map: null
    };
    Electorial = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$413);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-e4hyfh"}"><div class="${"p-6 svelte-e4hyfh"}"><h1 class="${"text-2xl text-white svelte-e4hyfh"}">How to find a <br>person on the<br>
			electorial roll in the uk
		</h1>
		<br>
		<iframe class="${"h-32 w-full object-fill svelte-e4hyfh"}" title="${"Electorial roll uk"}" src="${"https://www.youtube.com/embed/by1hNIjuKWM"}" frameborder="${"0"}" allow="${"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"}" allowfullscreen></iframe>
		<br></div>
</div>`;
    });
    css$319 = {
      code: ".rounded-lg.svelte-e4hyfh{border-radius:0.5rem}.h-32.svelte-e4hyfh{height:8rem}.text-2xl.svelte-e4hyfh{font-size:1.5rem;line-height:2rem}.m-4.svelte-e4hyfh{margin:1rem}.object-fill.svelte-e4hyfh{-o-object-fit:fill;object-fit:fill}.p-4.svelte-e4hyfh{padding:1rem}.p-6.svelte-e4hyfh{padding:1.5rem}.shadow-2xl.svelte-e4hyfh{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-e4hyfh{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.w-auto.svelte-e4hyfh{width:auto}.w-full.svelte-e4hyfh{width:100%}",
      map: null
    };
    Companies3 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$319);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-e4hyfh"}"><div class="${"p-6 svelte-e4hyfh"}"><h1 class="${"text-2xl text-white svelte-e4hyfh"}">How to use <br>companies house records<br> for family history research
		</h1>
		<br>
		<iframe class="${"h-32 w-full object-fill svelte-e4hyfh"}" title="${"How to use companies house records for family history research"}" src="${"https://www.youtube.com/embed/-zFJZrOScuM"}" frameborder="${"0"}" allow="${"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"}" allowfullscreen></iframe>
		<br></div>
</div>`;
    });
    css$226 = {
      code: ".rounded-lg.svelte-e4hyfh{border-radius:0.5rem}.h-32.svelte-e4hyfh{height:8rem}.text-2xl.svelte-e4hyfh{font-size:1.5rem;line-height:2rem}.m-4.svelte-e4hyfh{margin:1rem}.object-fill.svelte-e4hyfh{-o-object-fit:fill;object-fit:fill}.p-4.svelte-e4hyfh{padding:1rem}.p-6.svelte-e4hyfh{padding:1.5rem}.shadow-2xl.svelte-e4hyfh{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-e4hyfh{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.w-auto.svelte-e4hyfh{width:auto}.w-full.svelte-e4hyfh{width:100%}",
      map: null
    };
    Name = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$226);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-e4hyfh"}"><div class="${"p-6 svelte-e4hyfh"}"><h1 class="${"text-2xl text-white svelte-e4hyfh"}">How to find someone<br> who has changed <br>their name in the UK
		</h1>
		<br>
		<iframe class="${"h-32 w-full object-fill svelte-e4hyfh"}" title="${"Marriage authorisation uk"}" src="${"https://www.youtube.com/embed/8KpE5f4kXdk"}" frameborder="${"0"}" allow="${"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"}" allowfullscreen></iframe>
		<br></div>
</div>`;
    });
    css$129 = {
      code: ".rounded-lg.svelte-e4hyfh{border-radius:0.5rem}.h-32.svelte-e4hyfh{height:8rem}.text-2xl.svelte-e4hyfh{font-size:1.5rem;line-height:2rem}.m-4.svelte-e4hyfh{margin:1rem}.object-fill.svelte-e4hyfh{-o-object-fit:fill;object-fit:fill}.p-4.svelte-e4hyfh{padding:1rem}.p-6.svelte-e4hyfh{padding:1.5rem}.shadow-2xl.svelte-e4hyfh{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-e4hyfh{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.w-auto.svelte-e4hyfh{width:auto}.w-full.svelte-e4hyfh{width:100%}",
      map: null
    };
    Buried = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$129);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-e4hyfh"}"><div class="${"p-6 svelte-e4hyfh"}"><h1 class="${"text-2xl text-white svelte-e4hyfh"}">How to find <br> where a Jewish person<br> is buried in London
		</h1>
		<br>
		<iframe class="${"h-32 w-full object-fill svelte-e4hyfh"}" title="${"burial jewish London uk"}" src="${"https://www.youtube.com/embed/w5skmEm843c"}" frameborder="${"0"}" allow="${"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"}" allowfullscreen></iframe>
		<br></div>
</div>`;
    });
    css32 = {
      code: ".inline-block.svelte-g219g3{display:inline-block}.grid.svelte-g219g3{display:-ms-grid;display:grid}.h-10.svelte-g219g3{height:2.5rem}.text-4xl.svelte-g219g3{font-size:2.25rem;line-height:2.5rem}.ml-8.svelte-g219g3{margin-left:2rem}.mt-3.svelte-g219g3{margin-top:0.75rem}.mt-20.svelte-g219g3{margin-top:5rem}.mt-8.svelte-g219g3{margin-top:2rem}.text-center.svelte-g219g3{text-align:center}.text-purple-500.svelte-g219g3{--tw-text-opacity:1;color:rgba(139, 92, 246, var(--tw-text-opacity))}.w-14.svelte-g219g3{width:3.5rem}.gap-4.svelte-g219g3{grid-gap:1rem;gap:1rem}@media(min-width: 640px){.sm\\:flex.svelte-g219g3{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}}",
      map: null
    };
    prerender29 = true;
    Video = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css32);
      return `${$$result.head += `${$$result.title = `<title>Video&#39;s</title>`, ""}`, ""}
<section class="${"one"}"><h1 class="${"ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl svelte-g219g3"}"><div class="${"h-10 w-14 inline-block svelte-g219g3"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639596218/webp/video_icon.webp"}" alt="${"image of video icon"}"></div>

		Family History Youtube video&#39;s
	</h1>
	<br>
	<section class="${"one"}"><div class="${"grid sm:flex gap-4 mt-20 svelte-g219g3"}">${validate_component(Buried, "Buried").$$render($$result, {}, {}, {})}
			${validate_component(Name, "Name").$$render($$result, {}, {}, {})}
			${validate_component(Companies3, "Companies").$$render($$result, {}, {}, {})}</div>

		<div class="${"grid sm:flex gap-4 mt-8 svelte-g219g3"}">${validate_component(Electorial, "Electorial").$$render($$result, {}, {}, {})}
			${validate_component(Nat, "Nat").$$render($$result, {}, {}, {})}
			${validate_component(Marriage, "Marriage").$$render($$result, {}, {}, {})}</div>

		<div class="${"grid sm:flex gap-4 mt-8 svelte-g219g3"}">${validate_component(Raf2, "Raf").$$render($$result, {}, {}, {})}
			${validate_component(Probate, "Probate").$$render($$result, {}, {}, {})}</div></section>
</section>`;
    });
  }
});

// .svelte-kit/output/server/chunks/dna-22147009.js
var dna_22147009_exports = {};
__export(dna_22147009_exports, {
  default: () => Dna,
  prerender: () => prerender30
});
var css$89, Medna, css$79, Myheritage, css$69, Illatrative, css$511, Living, css$414, GedMatch, css$320, Familydna, css$227, Painter, css$130, Ancestrydna, css33, prerender30, Dna;
var init_dna_22147009 = __esm({
  ".svelte-kit/output/server/chunks/dna-22147009.js"() {
    init_shims();
    init_app_412ff39b();
    init_ssr();
    css$89 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Medna = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$89);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">23 And Me</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639595672/webp/dname.webp"}" alt="${"image of 23 and me dna logo"}">
		<br>
		<p>23 and Me <br>DNA Kits.</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/2WstXQ1"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$79 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Myheritage = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$79);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Myheritage</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1629970539/myheritage_jwdzde.jpg"}" alt="${"image of myheritage dna logo"}">
		<br>
		<p>Myheritage <br>DNA Kits.</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3DjLWJr"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$69 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Illatrative = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$69);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Illatrative</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1634290491/dna_ill_sooklg.png"}" alt="${"image of dna Illatative"}">
		<br>
		<p>Interpret your <br>dna results</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3lIYcwD"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$511 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Living = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$511);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Living</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1629971073/dnaliving_t6eozb.jpg"}" alt="${"image of ancestry dna logo"}">
		<br>
		<p>Living <br>DNA Kits.</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3gzrrio"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$414 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    GedMatch = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$414);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">GedMatch</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639582185/webp/gematch.webp"}" alt="${"image of a family tree"}">
		<br>
		<p>Comparing <br>DNA to find<br>family matches.</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3FsIPA9"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$320 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Familydna = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$320);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Family Tree</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639581730/webp/familytreedna.webp"}" alt="${"image of family tree dna logo"}">
		<br>
		<p>Family Tree <br>DNA Kits.</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/38hwD62"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$227 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Painter = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$227);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">DNA Painter</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639581299/webp/paintrer.webp"}" alt="${"image of dna painter"}">
		<br>
		<p>Interpret your <br>DNA genealogy <br>results</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/30corDh"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$130 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Ancestrydna = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$130);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Ancestry</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639580625/webp/ancestrydna.webp"}" alt="${"image of ancestry dna logo"}">
		<br>
		<p>Ancestry <br>DNA Kits.</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3zhhBJm"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css33 = {
      code: ".inline-block.svelte-g219g3{display:inline-block}.grid.svelte-g219g3{display:-ms-grid;display:grid}.h-10.svelte-g219g3{height:2.5rem}.text-4xl.svelte-g219g3{font-size:2.25rem;line-height:2.5rem}.ml-8.svelte-g219g3{margin-left:2rem}.mt-3.svelte-g219g3{margin-top:0.75rem}.mt-20.svelte-g219g3{margin-top:5rem}.mt-8.svelte-g219g3{margin-top:2rem}.text-center.svelte-g219g3{text-align:center}.text-purple-500.svelte-g219g3{--tw-text-opacity:1;color:rgba(139, 92, 246, var(--tw-text-opacity))}.w-14.svelte-g219g3{width:3.5rem}.gap-4.svelte-g219g3{grid-gap:1rem;gap:1rem}@media(min-width: 640px){.sm\\:flex.svelte-g219g3{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}}",
      map: null
    };
    prerender30 = true;
    Dna = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css33);
      return `${$$result.head += `${$$result.title = `<title>DNA</title>`, ""}`, ""}
<section class="${"one"}"><h1 class="${"ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl svelte-g219g3"}"><div class="${"h-10 w-14 inline-block svelte-g219g3"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639580261/webp/dna_icon1.webp"}" alt="${"image of dna icon"}"></div>

		DNA Testing
	</h1>
	<br>
	<section class="${"one"}"><div class="${"grid sm:flex gap-4 mt-20 svelte-g219g3"}">${validate_component(Ancestrydna, "Ancestrydna").$$render($$result, {}, {}, {})}
			${validate_component(Painter, "Painter").$$render($$result, {}, {}, {})}
			${validate_component(Familydna, "Familydna").$$render($$result, {}, {}, {})}</div>

		<div class="${"grid sm:flex gap-4 mt-8 svelte-g219g3"}">${validate_component(GedMatch, "GedMatch").$$render($$result, {}, {}, {})}
			${validate_component(Living, "Living").$$render($$result, {}, {}, {})}
			${validate_component(Illatrative, "Illatrative").$$render($$result, {}, {}, {})}</div>

		<div class="${"grid sm:flex gap-4 mt-8 svelte-g219g3"}">${validate_component(Myheritage, "Myheritage").$$render($$result, {}, {}, {})}
			${validate_component(Medna, "Medna").$$render($$result, {}, {}, {})}</div></section>
</section>`;
    });
  }
});

// .svelte-kit/output/server/chunks/usa-6b645b9e.js
var usa_6b645b9e_exports = {};
__export(usa_6b645b9e_exports, {
  default: () => Usa,
  prerender: () => prerender31
});
var css$98, Nyindex, css$810, York, css$710, Ellis, css$610, Nyarchives, css$512, Brooklyn, css$415, Wargraves, css$321, Usstate, css$228, Step99, css$131, Intelius99, css34, prerender31, Usa;
var init_usa_6b645b9e = __esm({
  ".svelte-kit/output/server/chunks/usa-6b645b9e.js"() {
    init_shims();
    init_app_412ff39b();
    init_ssr();
    css$98 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Nyindex = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$98);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Marriage Index</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638859747/webp/database.webp"}" alt="${"image of of a database"}">
		<br>
		<p>Search the databases <br>for New york <br>marriages records<br> 1950 to 2017 .</p>
		<br><br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2wOl8mA"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$810 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    York = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$810);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">New York</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638859747/webp/database.webp"}" alt="${"image of of a database"}">
		<br>
		<p>Search the databases <br>for New york records of <br>birth, marriages,<br> death and naturalization
		</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3oq8q3w"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$710 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Ellis = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$710);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Ellis Island</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639480528/webp/liberty.webp"}" alt="${"image of statue of liberty ellis island"}">
		<br>
		<p>Search the databases <br>Ellis Island records <br>1892 to 1957.</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/39FhwVE"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$610 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Nyarchives = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$610);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">N Y Archives</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638860017/webp/archives.webp"}" alt="${"archive photo"}">
		<br>
		<p>New York <br>State Archives</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/2JAlxAb"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$512 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Brooklyn = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$512);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Brooklyn</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638859747/webp/database.webp"}" alt="${"image of a database"}">
		<br>
		<p>Search the records.</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2wNjGkf"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$415 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Wargraves = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$415);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">War Graves</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639423110/webp/war-graves.webp"}" alt="${"image of usa war cemetery"}">
		<br>
		<p>Search <br>ABMC burials.</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2Ip6h3b"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$321 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Usstate = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$321);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">State Archives</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1638860017/webp/archives.webp"}" alt="${"archive photo"}">
		<br>
		<p>USA State Archives</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"http://bit.ly/2L79gPt"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$228 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Step99 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$228);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">One Step</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639422478/webp/step.webp"}" alt="${"image of a database"}">
		<br>
		<p>One Search<br> Usa records.</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/3sSeqVQ"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css$131 = {
      code: ".rounded-lg.svelte-uz66hb{border-radius:0.5rem}.h-32.svelte-uz66hb{height:8rem}.text-2xl.svelte-uz66hb{font-size:1.5rem;line-height:2rem}.m-4.svelte-uz66hb{margin:1rem}.object-fill.svelte-uz66hb{-o-object-fit:fill;object-fit:fill}.p-4.svelte-uz66hb{padding:1rem}.p-6.svelte-uz66hb{padding:1.5rem}.shadow-2xl.svelte-uz66hb{--tw-shadow-color:0, 0, 0;--tw-shadow:0 25px 50px -12px rgba(var(--tw-shadow-color), 0.25);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.text-white.svelte-uz66hb{--tw-text-opacity:1;color:rgba(255, 255, 255, var(--tw-text-opacity))}.hover\\:text-yellow-500.svelte-uz66hb:hover{--tw-text-opacity:1;color:rgba(245, 158, 11, var(--tw-text-opacity))}.w-auto.svelte-uz66hb{width:auto}.w-full.svelte-uz66hb{width:100%}",
      map: null
    };
    Intelius99 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$131);
      return `<div id="${"work-card"}" class="${"m-4 p-4 w-auto rounded-lg shadow-2xl svelte-uz66hb"}"><div class="${"p-6 svelte-uz66hb"}"><h1 class="${"text-2xl text-white svelte-uz66hb"}">Intelius</h1>

		<img class="${"h-32 w-full object-fill svelte-uz66hb"}" src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639422169/webp/finder.webp"}" alt="${"image of people finder"}">

		<br>

		<p>People finder<br> in the USA.</p>
		<br>

		<a class="${"text-white hover:text-yellow-500 svelte-uz66hb"}" href="${"https://bit.ly/368dd2r"}" target="${"_blank"}">Go to The Website
		</a></div>
</div>`;
    });
    css34 = {
      code: ".inline-block.svelte-g219g3{display:inline-block}.grid.svelte-g219g3{display:-ms-grid;display:grid}.h-10.svelte-g219g3{height:2.5rem}.text-4xl.svelte-g219g3{font-size:2.25rem;line-height:2.5rem}.ml-8.svelte-g219g3{margin-left:2rem}.mt-3.svelte-g219g3{margin-top:0.75rem}.mt-20.svelte-g219g3{margin-top:5rem}.mt-8.svelte-g219g3{margin-top:2rem}.text-center.svelte-g219g3{text-align:center}.text-purple-500.svelte-g219g3{--tw-text-opacity:1;color:rgba(139, 92, 246, var(--tw-text-opacity))}.w-14.svelte-g219g3{width:3.5rem}.gap-4.svelte-g219g3{grid-gap:1rem;gap:1rem}@media(min-width: 640px){.sm\\:flex.svelte-g219g3{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}}",
      map: null
    };
    prerender31 = true;
    Usa = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css34);
      return `${$$result.head += `${$$result.title = `<title>USA</title>`, ""}`, ""}
<section class="${"one"}"><h1 class="${"ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl svelte-g219g3"}"><div class="${"h-10 w-14 inline-block svelte-g219g3"}"><img src="${"https://res.cloudinary.com/dzhbfdfa5/image/upload/c_scale,h_200,w_300/v1639389123/webp/american-flag.webp"}" alt="${"image of USA flag"}"></div>

		USA Family History Resourses
	</h1>
	<br>
	<section class="${"one"}"><div class="${"grid sm:flex gap-4 mt-20 svelte-g219g3"}">${validate_component(Intelius99, "Intelius99").$$render($$result, {}, {}, {})}
			${validate_component(Step99, "Step99").$$render($$result, {}, {}, {})}
			${validate_component(Usstate, "Usstate").$$render($$result, {}, {}, {})}</div>

		<div class="${"grid sm:flex gap-4 mt-8 svelte-g219g3"}">${validate_component(Wargraves, "Wargraves").$$render($$result, {}, {}, {})}</div>
		<h2 class="${"ml-8 mt-3 inline-block text-center text-purple-500 text-font-sans text-4xl svelte-g219g3"}">New York
		</h2>

		<div class="${"grid sm:flex gap-4 mt-8 svelte-g219g3"}">${validate_component(Brooklyn, "Brooklyn").$$render($$result, {}, {}, {})}
			${validate_component(Nyarchives, "Nyarchives").$$render($$result, {}, {}, {})}
			${validate_component(Ellis, "Ellis").$$render($$result, {}, {}, {})}</div>

		<div class="${"grid sm:flex gap-4 mt-8 svelte-g219g3"}">${validate_component(York, "York").$$render($$result, {}, {}, {})}
			${validate_component(Nyindex, "Nyindex").$$render($$result, {}, {}, {})}</div></section>
</section>`;
    });
  }
});

// .svelte-kit/output/server/chunks/app-412ff39b.js
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
function escape2(html) {
  return String(html).replace(/["'&<>]/g, (match) => escaped2[match]);
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
          code: Array.from(result.css).map((css210) => css210.code).join("\n"),
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
      file: assets + "/_app/start-07268e32.js",
      css: [assets + "/_app/assets/start-1f089c51.css"],
      js: [assets + "/_app/start-07268e32.js", assets + "/_app/chunks/vendor-28470302.js"]
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
  const { entry, css: css210, js, styles } = metadata_lookup[file];
  return {
    module: await module_lookup[file](),
    entry: assets + "/_app/" + entry,
    css: css210.map((dep) => assets + "/_app/" + dep),
    js: js.map((dep) => assets + "/_app/" + dep),
    styles
  };
}
function render(request, {
  prerender: prerender32
} = {}) {
  const host = request.headers["host"];
  return respond({ ...request, host }, options, { prerender: prerender32 });
}
var current_component, escaped2, missing_component, on_destroy, css35, Root, base, assets, user_hooks, template, options, default_settings, empty, manifest, get_hooks, module_lookup, metadata_lookup;
var init_app_412ff39b = __esm({
  ".svelte-kit/output/server/chunks/app-412ff39b.js"() {
    init_shims();
    init_ssr();
    Promise.resolve();
    escaped2 = {
      '"': "&quot;",
      "'": "&#39;",
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;"
    };
    missing_component = {
      $$render: () => ""
    };
    css35 = {
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
      $$result.css.add(css35);
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
      assets: [{ "file": "favicon1.png", "size": 1571, "type": "image/png" }, { "file": "favicon.png", "size": 200521, "type": "image/png" }, { "file": "images/logo youtube.jpg", "size": 485909, "type": "image/jpeg" }, { "file": "images/logo.png", "size": 311689, "type": "image/png" }, { "file": "images/logotree.png", "size": 109976, "type": "image/png" }, { "file": "images/logotree.svg", "size": 134165, "type": "image/svg+xml" }, { "file": "images/logotreerobin.png", "size": 329212, "type": "image/png" }, { "file": "images/logotreerobin.svg", "size": 1065244, "type": "image/svg+xml" }, { "file": "images/square.png", "size": 513, "type": "image/png" }, { "file": "images/europe/1939c.jpg", "size": 10018, "type": "image/jpeg" }, { "file": "images/europe/american-flag.jpg", "size": 7845, "type": "image/jpeg" }, { "file": "images/europe/ancestry.jpg", "size": 5902, "type": "image/jpeg" }, { "file": "images/europe/archives.jpg", "size": 29905, "type": "image/jpeg" }, { "file": "images/europe/australia-flag.jpg", "size": 6575, "type": "image/jpeg" }, { "file": "images/europe/austria-flag.jpg", "size": 5889, "type": "image/jpeg" }, { "file": "images/europe/belarus-flag.jpg", "size": 7604, "type": "image/jpeg" }, { "file": "images/europe/belarus-map.jpg", "size": 26169, "type": "image/jpeg" }, { "file": "images/europe/belgium-flag.jpg", "size": 3352, "type": "image/jpeg" }, { "file": "images/europe/britmila.jpg", "size": 18491, "type": "image/jpeg" }, { "file": "images/europe/business.jpg", "size": 3672, "type": "image/jpeg" }, { "file": "images/europe/camps.jpg", "size": 10826, "type": "image/jpeg" }, { "file": "images/europe/canada-flag.jpg", "size": 3747, "type": "image/jpeg" }, { "file": "images/europe/censusireland.jpg", "size": 31898, "type": "image/jpeg" }, { "file": "images/europe/church.jpg", "size": 13236, "type": "image/jpeg" }, { "file": "images/europe/companies.jpg", "size": 11526, "type": "image/jpeg" }, { "file": "images/europe/cyrillic.jpg", "size": 31702, "type": "image/jpeg" }, { "file": "images/europe/database.jpg", "size": 15716, "type": "image/jpeg" }, { "file": "images/europe/dnipropetrovsk_arms.jpg", "size": 26546, "type": "image/jpeg" }, { "file": "images/europe/family-tree.jpg", "size": 16455, "type": "image/jpeg" }, { "file": "images/europe/first.jpg", "size": 9946, "type": "image/jpeg" }, { "file": "images/europe/flame.jpg", "size": 8874, "type": "image/jpeg" }, { "file": "images/europe/french-flag.jpg", "size": 1472, "type": "image/jpeg" }, { "file": "images/europe/gate.jpg", "size": 16290, "type": "image/jpeg" }, { "file": "images/europe/gazette.jpg", "size": 22586, "type": "image/jpeg" }, { "file": "images/europe/gen.jpg", "size": 10614, "type": "image/jpeg" }, { "file": "images/europe/graves.jpg", "size": 26310, "type": "image/jpeg" }, { "file": "images/europe/handwriting.jpg", "size": 9750, "type": "image/jpeg" }, { "file": "images/europe/hebrew.jpg", "size": 13356, "type": "image/jpeg" }, { "file": "images/europe/heritage.jpg", "size": 5169, "type": "image/jpeg" }, { "file": "images/europe/home.jpg", "size": 12463, "type": "image/jpeg" }, { "file": "images/europe/industral.jpg", "size": 11774, "type": "image/jpeg" }, { "file": "images/europe/ireland-flag.jpg", "size": 3114, "type": "image/jpeg" }, { "file": "images/europe/jc.jpg", "size": 11984, "type": "image/jpeg" }, { "file": "images/europe/jewish-graves.jpg", "size": 26756, "type": "image/jpeg" }, { "file": "images/europe/jfs.jpg", "size": 13899, "type": "image/jpeg" }, { "file": "images/europe/ketubot.jpg", "size": 14052, "type": "image/jpeg" }, { "file": "images/europe/liberty.jpg", "size": 8593, "type": "image/jpeg" }, { "file": "images/europe/loos.jpg", "size": 10999, "type": "image/jpeg" }, { "file": "images/europe/mag-glass.jpg", "size": 10789, "type": "image/jpeg" }, { "file": "images/europe/memorial-de-la-shoah.jpg", "size": 9861, "type": "image/jpeg" }, { "file": "images/europe/mohylivska.jpg", "size": 14236, "type": "image/jpeg" }, { "file": "images/europe/mohyliv_arms.jpg", "size": 25639, "type": "image/jpeg" }, { "file": "images/europe/netherlands-flag.jpg", "size": 3693, "type": "image/jpeg" }, { "file": "images/europe/newspaper.jpg", "size": 17154, "type": "image/jpeg" }, { "file": "images/europe/newyork.jpg", "size": 14348, "type": "image/jpeg" }, { "file": "images/europe/newzealand-flag.jpg", "size": 5835, "type": "image/jpeg" }, { "file": "images/europe/nz-birth-cert.jpg", "size": 10065, "type": "image/jpeg" }, { "file": "images/europe/nz-gazette.jpg", "size": 8007, "type": "image/jpeg" }, { "file": "images/europe/passenger.jpg", "size": 12985, "type": "image/jpeg" }, { "file": "images/europe/raf.jpg", "size": 14417, "type": "image/jpeg" }, { "file": "images/europe/relocation.jpg", "size": 13880, "type": "image/jpeg" }, { "file": "images/europe/roll.jpg", "size": 8794, "type": "image/jpeg" }, { "file": "images/europe/russian-flag.jpg", "size": 3765, "type": "image/jpeg" }, { "file": "images/europe/shamrock.jpg", "size": 25965, "type": "image/jpeg" }, { "file": "images/europe/shtetel.jpg", "size": 12269, "type": "image/jpeg" }, { "file": "images/europe/skala.jpg", "size": 16845, "type": "image/jpeg" }, { "file": "images/europe/soviet-map.jpg", "size": 14532, "type": "image/jpeg" }, { "file": "images/europe/soviet-medals.jpg", "size": 58166, "type": "image/jpeg" }, { "file": "images/europe/star-jewish.jpg", "size": 19282, "type": "image/jpeg" }, { "file": "images/europe/synagogue.jpg", "size": 32079, "type": "image/jpeg" }, { "file": "images/europe/trade.jpg", "size": 11204, "type": "image/jpeg" }, { "file": "images/europe/uk-flag.jpg", "size": 12377, "type": "image/jpeg" }, { "file": "images/europe/ukraine-flag.jpg", "size": 3049, "type": "image/jpeg" }, { "file": "images/europe/viennaparlament.jpg", "size": 34613, "type": "image/jpeg" }, { "file": "images/europe/war-graves.jpg", "size": 15718, "type": "image/jpeg" }, { "file": "images/europe/war.jpg", "size": 18683, "type": "image/jpeg" }, { "file": "images/europe/wedding.jpg", "size": 14597, "type": "image/jpeg" }, { "file": "images/europe/wills.jpg", "size": 7357, "type": "image/jpeg" }, { "file": "images/europe/workhouse.jpg", "size": 9988, "type": "image/jpeg" }, { "file": "images/europe/search.png", "size": 57114, "type": "image/png" }, { "file": "images/svg/bookreadingman.svg", "size": 97434, "type": "image/svg+xml" }, { "file": "images/svg/favicon.png", "size": 200521, "type": "image/png" }, { "file": "images/svg/favicon_io.zip", "size": 64172, "type": "application/zip" }, { "file": "images/svg/FX13_robin.svg", "size": 12944, "type": "image/svg+xml" }, { "file": "images/svg/logomanbook.png", "size": 66939, "type": "image/png" }, { "file": "images/svg/logomanrobin.png", "size": 66297, "type": "image/png" }, { "file": "images/svg/logotree.png", "size": 109976, "type": "image/png" }, { "file": "images/svg/logotree.svg", "size": 134165, "type": "image/svg+xml" }, { "file": "images/svg/logotreerobin.png", "size": 240048, "type": "image/png" }, { "file": "images/svg/logotreerobin.svg", "size": 1065244, "type": "image/svg+xml" }, { "file": "images/svg/oaktree.svg", "size": 73414, "type": "image/svg+xml" }, { "file": "images/svg/tree.svg", "size": 30168, "type": "image/svg+xml" }, { "file": "images/svg/tree1.png", "size": 321269, "type": "image/png" }, { "file": "images/svg/tree3.svg", "size": 1198878, "type": "image/svg+xml" }, { "file": "images/svg/favicon_io/android-chrome-192x192.png", "size": 8749, "type": "image/png" }, { "file": "images/svg/favicon_io/android-chrome-512x512.png", "size": 29725, "type": "image/png" }, { "file": "images/svg/favicon_io/apple-touch-icon.png", "size": 7805, "type": "image/png" }, { "file": "images/svg/favicon_io/favicon-16x16.png", "size": 448, "type": "image/png" }, { "file": "images/svg/favicon_io/favicon-32x32.png", "size": 956, "type": "image/png" }, { "file": "images/svg/favicon_io/favicon.ico", "size": 15406, "type": "image/vnd.microsoft.icon" }, { "file": "images/svg/favicon_io/site.webmanifest", "size": 263, "type": "application/manifest+json" }],
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
          pattern: /^\/netherlands-j\/?$/,
          params: empty,
          a: ["src/routes/__layout.svelte", "src/routes/netherlands-j.svelte"],
          b: [".svelte-kit/build/components/error.svelte"]
        },
        {
          type: "page",
          pattern: /^\/australia-j\/?$/,
          params: empty,
          a: ["src/routes/__layout.svelte", "src/routes/australia-j.svelte"],
          b: [".svelte-kit/build/components/error.svelte"]
        },
        {
          type: "page",
          pattern: /^\/netherlands\/?$/,
          params: empty,
          a: ["src/routes/__layout.svelte", "src/routes/netherlands.svelte"],
          b: [".svelte-kit/build/components/error.svelte"]
        },
        {
          type: "page",
          pattern: /^\/austrian-j\/?$/,
          params: empty,
          a: ["src/routes/__layout.svelte", "src/routes/austrian-j.svelte"],
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
          pattern: /^\/belarus-j\/?$/,
          params: empty,
          a: ["src/routes/__layout.svelte", "src/routes/belarus-j.svelte"],
          b: [".svelte-kit/build/components/error.svelte"]
        },
        {
          type: "page",
          pattern: /^\/british-j\/?$/,
          params: empty,
          a: ["src/routes/__layout.svelte", "src/routes/british-j.svelte"],
          b: [".svelte-kit/build/components/error.svelte"]
        },
        {
          type: "page",
          pattern: /^\/ireland-j\/?$/,
          params: empty,
          a: ["src/routes/__layout.svelte", "src/routes/ireland-j.svelte"],
          b: [".svelte-kit/build/components/error.svelte"]
        },
        {
          type: "page",
          pattern: /^\/italian-j\/?$/,
          params: empty,
          a: ["src/routes/__layout.svelte", "src/routes/italian-j.svelte"],
          b: [".svelte-kit/build/components/error.svelte"]
        },
        {
          type: "page",
          pattern: /^\/russian-j\/?$/,
          params: empty,
          a: ["src/routes/__layout.svelte", "src/routes/russian-j.svelte"],
          b: [".svelte-kit/build/components/error.svelte"]
        },
        {
          type: "page",
          pattern: /^\/ukraine-j\/?$/,
          params: empty,
          a: ["src/routes/__layout.svelte", "src/routes/ukraine-j.svelte"],
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
          pattern: /^\/canada-j\/?$/,
          params: empty,
          a: ["src/routes/__layout.svelte", "src/routes/canada-j.svelte"],
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
        },
        {
          type: "page",
          pattern: /^\/contact\/?$/,
          params: empty,
          a: ["src/routes/__layout.svelte", "src/routes/contact.svelte"],
          b: [".svelte-kit/build/components/error.svelte"]
        },
        {
          type: "page",
          pattern: /^\/general\/?$/,
          params: empty,
          a: ["src/routes/__layout.svelte", "src/routes/general.svelte"],
          b: [".svelte-kit/build/components/error.svelte"]
        },
        {
          type: "page",
          pattern: /^\/ireland\/?$/,
          params: empty,
          a: ["src/routes/__layout.svelte", "src/routes/ireland.svelte"],
          b: [".svelte-kit/build/components/error.svelte"]
        },
        {
          type: "page",
          pattern: /^\/russian\/?$/,
          params: empty,
          a: ["src/routes/__layout.svelte", "src/routes/russian.svelte"],
          b: [".svelte-kit/build/components/error.svelte"]
        },
        {
          type: "page",
          pattern: /^\/ukraine\/?$/,
          params: empty,
          a: ["src/routes/__layout.svelte", "src/routes/ukraine.svelte"],
          b: [".svelte-kit/build/components/error.svelte"]
        },
        {
          type: "page",
          pattern: /^\/canada\/?$/,
          params: empty,
          a: ["src/routes/__layout.svelte", "src/routes/canada.svelte"],
          b: [".svelte-kit/build/components/error.svelte"]
        },
        {
          type: "page",
          pattern: /^\/french\/?$/,
          params: empty,
          a: ["src/routes/__layout.svelte", "src/routes/french.svelte"],
          b: [".svelte-kit/build/components/error.svelte"]
        },
        {
          type: "page",
          pattern: /^\/shoah\/?$/,
          params: empty,
          a: ["src/routes/__layout.svelte", "src/routes/shoah.svelte"],
          b: [".svelte-kit/build/components/error.svelte"]
        },
        {
          type: "page",
          pattern: /^\/usa-j\/?$/,
          params: empty,
          a: ["src/routes/__layout.svelte", "src/routes/usa-j.svelte"],
          b: [".svelte-kit/build/components/error.svelte"]
        },
        {
          type: "page",
          pattern: /^\/video\/?$/,
          params: empty,
          a: ["src/routes/__layout.svelte", "src/routes/video.svelte"],
          b: [".svelte-kit/build/components/error.svelte"]
        },
        {
          type: "page",
          pattern: /^\/dna\/?$/,
          params: empty,
          a: ["src/routes/__layout.svelte", "src/routes/dna.svelte"],
          b: [".svelte-kit/build/components/error.svelte"]
        },
        {
          type: "page",
          pattern: /^\/usa\/?$/,
          params: empty,
          a: ["src/routes/__layout.svelte", "src/routes/usa.svelte"],
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
      "src/routes/__layout.svelte": () => Promise.resolve().then(() => (init_layout_312b2647(), layout_312b2647_exports)),
      ".svelte-kit/build/components/error.svelte": () => Promise.resolve().then(() => (init_error_54b317dd(), error_54b317dd_exports)),
      "src/routes/index.svelte": () => Promise.resolve().then(() => (init_index_a56c0cab(), index_a56c0cab_exports)),
      "src/routes/netherlands-j.svelte": () => Promise.resolve().then(() => (init_netherlands_j_94f7c340(), netherlands_j_94f7c340_exports)),
      "src/routes/australia-j.svelte": () => Promise.resolve().then(() => (init_australia_j_c4485f82(), australia_j_c4485f82_exports)),
      "src/routes/netherlands.svelte": () => Promise.resolve().then(() => (init_netherlands_ee254b2a(), netherlands_ee254b2a_exports)),
      "src/routes/austrian-j.svelte": () => Promise.resolve().then(() => (init_austrian_j_711f7827(), austrian_j_711f7827_exports)),
      "src/routes/newzealand.svelte": () => Promise.resolve().then(() => (init_newzealand_e201bb48(), newzealand_e201bb48_exports)),
      "src/routes/australia.svelte": () => Promise.resolve().then(() => (init_australia_fc37a15f(), australia_fc37a15f_exports)),
      "src/routes/belarus-j.svelte": () => Promise.resolve().then(() => (init_belarus_j_119830d5(), belarus_j_119830d5_exports)),
      "src/routes/british-j.svelte": () => Promise.resolve().then(() => (init_british_j_fbd600ff(), british_j_fbd600ff_exports)),
      "src/routes/ireland-j.svelte": () => Promise.resolve().then(() => (init_ireland_j_ced719d3(), ireland_j_ced719d3_exports)),
      "src/routes/italian-j.svelte": () => Promise.resolve().then(() => (init_italian_j_b3a6984f(), italian_j_b3a6984f_exports)),
      "src/routes/russian-j.svelte": () => Promise.resolve().then(() => (init_russian_j_5a22b37a(), russian_j_5a22b37a_exports)),
      "src/routes/ukraine-j.svelte": () => Promise.resolve().then(() => (init_ukraine_j_419a732b(), ukraine_j_419a732b_exports)),
      "src/routes/austrian.svelte": () => Promise.resolve().then(() => (init_austrian_d3ae3912(), austrian_d3ae3912_exports)),
      "src/routes/barbados.svelte": () => Promise.resolve().then(() => (init_barbados_1caae89d(), barbados_1caae89d_exports)),
      "src/routes/canada-j.svelte": () => Promise.resolve().then(() => (init_canada_j_f187c6bd(), canada_j_f187c6bd_exports)),
      "src/routes/belarus.svelte": () => Promise.resolve().then(() => (init_belarus_b9d0de3f(), belarus_b9d0de3f_exports)),
      "src/routes/belgium.svelte": () => Promise.resolve().then(() => (init_belgium_d80da3f4(), belgium_d80da3f4_exports)),
      "src/routes/bermuda.svelte": () => Promise.resolve().then(() => (init_bermuda_4dd6e03a(), bermuda_4dd6e03a_exports)),
      "src/routes/british.svelte": () => Promise.resolve().then(() => (init_british_b44848e7(), british_b44848e7_exports)),
      "src/routes/contact.svelte": () => Promise.resolve().then(() => (init_contact_dd424990(), contact_dd424990_exports)),
      "src/routes/general.svelte": () => Promise.resolve().then(() => (init_general_23d75e28(), general_23d75e28_exports)),
      "src/routes/ireland.svelte": () => Promise.resolve().then(() => (init_ireland_f5131930(), ireland_f5131930_exports)),
      "src/routes/russian.svelte": () => Promise.resolve().then(() => (init_russian_ae88d6bd(), russian_ae88d6bd_exports)),
      "src/routes/ukraine.svelte": () => Promise.resolve().then(() => (init_ukraine_f0853eac(), ukraine_f0853eac_exports)),
      "src/routes/canada.svelte": () => Promise.resolve().then(() => (init_canada_381d4639(), canada_381d4639_exports)),
      "src/routes/french.svelte": () => Promise.resolve().then(() => (init_french_086eb74d(), french_086eb74d_exports)),
      "src/routes/shoah.svelte": () => Promise.resolve().then(() => (init_shoah_a60ba7be(), shoah_a60ba7be_exports)),
      "src/routes/usa-j.svelte": () => Promise.resolve().then(() => (init_usa_j_66d6eaa3(), usa_j_66d6eaa3_exports)),
      "src/routes/video.svelte": () => Promise.resolve().then(() => (init_video_779ebba2(), video_779ebba2_exports)),
      "src/routes/dna.svelte": () => Promise.resolve().then(() => (init_dna_22147009(), dna_22147009_exports)),
      "src/routes/usa.svelte": () => Promise.resolve().then(() => (init_usa_6b645b9e(), usa_6b645b9e_exports))
    };
    metadata_lookup = { "src/routes/__layout.svelte": { "entry": "pages/__layout.svelte-968dbf8c.js", "css": ["assets/pages/__layout.svelte-f1ec1d30.css"], "js": ["pages/__layout.svelte-968dbf8c.js", "chunks/vendor-28470302.js"], "styles": [] }, ".svelte-kit/build/components/error.svelte": { "entry": "error.svelte-c6a9e04e.js", "css": [], "js": ["error.svelte-c6a9e04e.js", "chunks/vendor-28470302.js"], "styles": [] }, "src/routes/index.svelte": { "entry": "pages/index.svelte-e9ae1f8e.js", "css": ["assets/pages/index.svelte-30506a56.css"], "js": ["pages/index.svelte-e9ae1f8e.js", "chunks/vendor-28470302.js"], "styles": [] }, "src/routes/netherlands-j.svelte": { "entry": "pages/netherlands-j.svelte-2254cc33.js", "css": ["assets/pages/netherlands-j.svelte-4fe5128b.css"], "js": ["pages/netherlands-j.svelte-2254cc33.js", "chunks/vendor-28470302.js"], "styles": [] }, "src/routes/australia-j.svelte": { "entry": "pages/australia-j.svelte-29e88f67.js", "css": ["assets/pages/belarus.svelte-aad99b98.css"], "js": ["pages/australia-j.svelte-29e88f67.js", "chunks/vendor-28470302.js"], "styles": [] }, "src/routes/netherlands.svelte": { "entry": "pages/netherlands.svelte-e8adf022.js", "css": ["assets/pages/dna.svelte-3bf1a7bb.css"], "js": ["pages/netherlands.svelte-e8adf022.js", "chunks/vendor-28470302.js"], "styles": [] }, "src/routes/austrian-j.svelte": { "entry": "pages/austrian-j.svelte-ce7e9c86.js", "css": ["assets/pages/dna.svelte-3bf1a7bb.css"], "js": ["pages/austrian-j.svelte-ce7e9c86.js", "chunks/vendor-28470302.js"], "styles": [] }, "src/routes/newzealand.svelte": { "entry": "pages/newzealand.svelte-a6340444.js", "css": ["assets/pages/newzealand.svelte-4345acdd.css"], "js": ["pages/newzealand.svelte-a6340444.js", "chunks/vendor-28470302.js"], "styles": [] }, "src/routes/australia.svelte": { "entry": "pages/australia.svelte-efe693cf.js", "css": ["assets/pages/australia.svelte-b349f3b9.css"], "js": ["pages/australia.svelte-efe693cf.js", "chunks/vendor-28470302.js"], "styles": [] }, "src/routes/belarus-j.svelte": { "entry": "pages/belarus-j.svelte-5c5027af.js", "css": ["assets/pages/dna.svelte-3bf1a7bb.css"], "js": ["pages/belarus-j.svelte-5c5027af.js", "chunks/vendor-28470302.js"], "styles": [] }, "src/routes/british-j.svelte": { "entry": "pages/british-j.svelte-91119c0f.js", "css": ["assets/pages/british-j.svelte-e0eaffd3.css"], "js": ["pages/british-j.svelte-91119c0f.js", "chunks/vendor-28470302.js"], "styles": [] }, "src/routes/ireland-j.svelte": { "entry": "pages/ireland-j.svelte-ebb8d883.js", "css": ["assets/pages/belarus.svelte-aad99b98.css"], "js": ["pages/ireland-j.svelte-ebb8d883.js", "chunks/vendor-28470302.js"], "styles": [] }, "src/routes/italian-j.svelte": { "entry": "pages/italian-j.svelte-4580e726.js", "css": ["assets/pages/belarus.svelte-aad99b98.css"], "js": ["pages/italian-j.svelte-4580e726.js", "chunks/vendor-28470302.js"], "styles": [] }, "src/routes/russian-j.svelte": { "entry": "pages/russian-j.svelte-2aaaec63.js", "css": ["assets/pages/belarus.svelte-aad99b98.css"], "js": ["pages/russian-j.svelte-2aaaec63.js", "chunks/vendor-28470302.js"], "styles": [] }, "src/routes/ukraine-j.svelte": { "entry": "pages/ukraine-j.svelte-5838073a.js", "css": ["assets/pages/dna.svelte-3bf1a7bb.css"], "js": ["pages/ukraine-j.svelte-5838073a.js", "chunks/vendor-28470302.js"], "styles": [] }, "src/routes/austrian.svelte": { "entry": "pages/austrian.svelte-7525553a.js", "css": ["assets/pages/belarus.svelte-aad99b98.css"], "js": ["pages/austrian.svelte-7525553a.js", "chunks/vendor-28470302.js"], "styles": [] }, "src/routes/barbados.svelte": { "entry": "pages/barbados.svelte-61cab6cd.js", "css": ["assets/pages/belarus.svelte-aad99b98.css"], "js": ["pages/barbados.svelte-61cab6cd.js", "chunks/vendor-28470302.js"], "styles": [] }, "src/routes/canada-j.svelte": { "entry": "pages/canada-j.svelte-0808109f.js", "css": ["assets/pages/belarus.svelte-aad99b98.css"], "js": ["pages/canada-j.svelte-0808109f.js", "chunks/vendor-28470302.js"], "styles": [] }, "src/routes/belarus.svelte": { "entry": "pages/belarus.svelte-91089f05.js", "css": ["assets/pages/belarus.svelte-aad99b98.css"], "js": ["pages/belarus.svelte-91089f05.js", "chunks/vendor-28470302.js"], "styles": [] }, "src/routes/belgium.svelte": { "entry": "pages/belgium.svelte-db341932.js", "css": ["assets/pages/belarus.svelte-aad99b98.css"], "js": ["pages/belgium.svelte-db341932.js", "chunks/vendor-28470302.js"], "styles": [] }, "src/routes/bermuda.svelte": { "entry": "pages/bermuda.svelte-f6a8c99d.js", "css": ["assets/pages/belarus.svelte-aad99b98.css"], "js": ["pages/bermuda.svelte-f6a8c99d.js", "chunks/vendor-28470302.js"], "styles": [] }, "src/routes/british.svelte": { "entry": "pages/british.svelte-3d34b9ed.js", "css": ["assets/pages/british.svelte-2a5d1767.css"], "js": ["pages/british.svelte-3d34b9ed.js", "chunks/vendor-28470302.js"], "styles": [] }, "src/routes/contact.svelte": { "entry": "pages/contact.svelte-8d8ee4ea.js", "css": ["assets/pages/contact.svelte-08090ca1.css"], "js": ["pages/contact.svelte-8d8ee4ea.js", "chunks/vendor-28470302.js"], "styles": [] }, "src/routes/general.svelte": { "entry": "pages/general.svelte-95f487ae.js", "css": ["assets/pages/dna.svelte-3bf1a7bb.css"], "js": ["pages/general.svelte-95f487ae.js", "chunks/vendor-28470302.js"], "styles": [] }, "src/routes/ireland.svelte": { "entry": "pages/ireland.svelte-9911ebbc.js", "css": ["assets/pages/belarus.svelte-aad99b98.css"], "js": ["pages/ireland.svelte-9911ebbc.js", "chunks/vendor-28470302.js"], "styles": [] }, "src/routes/russian.svelte": { "entry": "pages/russian.svelte-12b264fa.js", "css": ["assets/pages/russian.svelte-4f0c37ac.css", "assets/Lost-ac4f0319.css"], "js": ["pages/russian.svelte-12b264fa.js", "chunks/vendor-28470302.js", "chunks/Lost-0fbf28cf.js"], "styles": [] }, "src/routes/ukraine.svelte": { "entry": "pages/ukraine.svelte-c002d62a.js", "css": ["assets/pages/dna.svelte-3bf1a7bb.css", "assets/Lost-ac4f0319.css"], "js": ["pages/ukraine.svelte-c002d62a.js", "chunks/vendor-28470302.js", "chunks/Lost-0fbf28cf.js"], "styles": [] }, "src/routes/canada.svelte": { "entry": "pages/canada.svelte-df8ac0d4.js", "css": ["assets/pages/belarus.svelte-aad99b98.css"], "js": ["pages/canada.svelte-df8ac0d4.js", "chunks/vendor-28470302.js"], "styles": [] }, "src/routes/french.svelte": { "entry": "pages/french.svelte-0329f84c.js", "css": ["assets/pages/belarus.svelte-aad99b98.css"], "js": ["pages/french.svelte-0329f84c.js", "chunks/vendor-28470302.js"], "styles": [] }, "src/routes/shoah.svelte": { "entry": "pages/shoah.svelte-5e40a083.js", "css": ["assets/pages/shoah.svelte-e173945f.css"], "js": ["pages/shoah.svelte-5e40a083.js", "chunks/vendor-28470302.js"], "styles": [] }, "src/routes/usa-j.svelte": { "entry": "pages/usa-j.svelte-251b2240.js", "css": ["assets/pages/usa-j.svelte-3bd1a4bc.css"], "js": ["pages/usa-j.svelte-251b2240.js", "chunks/vendor-28470302.js"], "styles": [] }, "src/routes/video.svelte": { "entry": "pages/video.svelte-b7f315ca.js", "css": ["assets/pages/video.svelte-87eed3f2.css"], "js": ["pages/video.svelte-b7f315ca.js", "chunks/vendor-28470302.js"], "styles": [] }, "src/routes/dna.svelte": { "entry": "pages/dna.svelte-8a94102c.js", "css": ["assets/pages/dna.svelte-3bf1a7bb.css"], "js": ["pages/dna.svelte-8a94102c.js", "chunks/vendor-28470302.js"], "styles": [] }, "src/routes/usa.svelte": { "entry": "pages/usa.svelte-80c20176.js", "css": ["assets/pages/dna.svelte-3bf1a7bb.css"], "js": ["pages/usa.svelte-80c20176.js", "chunks/vendor-28470302.js"], "styles": [] } };
  }
});

// .svelte-kit/vercel/entry.js
__export(exports, {
  default: () => entry_default
});
init_shims();

// node_modules/@sveltejs/kit/dist/node.js
init_shims();
function getRawBody(req) {
  return new Promise((fulfil, reject) => {
    const h2 = req.headers;
    if (!h2["content-type"]) {
      return fulfil(null);
    }
    req.on("error", reject);
    const length = Number(h2["content-length"]);
    if (isNaN(length) && h2["transfer-encoding"] == null) {
      return fulfil(null);
    }
    let data = new Uint8Array(length || 0);
    if (length > 0) {
      let offset = 0;
      req.on("data", (chunk) => {
        const new_len = offset + Buffer.byteLength(chunk);
        if (new_len > length) {
          return reject({
            status: 413,
            reason: 'Exceeded "Content-Length" limit'
          });
        }
        data.set(chunk, offset);
        offset = new_len;
      });
    } else {
      req.on("data", (chunk) => {
        const new_data = new Uint8Array(data.length + chunk.length);
        new_data.set(data, 0);
        new_data.set(chunk, data.length);
        data = new_data;
      });
    }
    req.on("end", () => {
      fulfil(data);
    });
  });
}

// .svelte-kit/output/server/app.js
init_shims();
init_ssr();
init_app_412ff39b();

// .svelte-kit/vercel/entry.js
init();
var entry_default = async (req, res) => {
  const { pathname, searchParams } = new URL(req.url || "", "http://localhost");
  let body;
  try {
    body = await getRawBody(req);
  } catch (err) {
    res.statusCode = err.status || 400;
    return res.end(err.reason || "Invalid request body");
  }
  const rendered = await render({
    method: req.method,
    headers: req.headers,
    path: pathname,
    query: searchParams,
    rawBody: body
  });
  if (rendered) {
    const { status, headers, body: body2 } = rendered;
    return res.writeHead(status, headers).end(body2);
  }
  return res.writeHead(404).end();
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
/*! fetch-blob. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
/*! formdata-polyfill. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
