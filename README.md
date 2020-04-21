AgileDownloader
============

This plugin is originally based on the fileSaver npm package. More info AgileDownloader.js below.
This was specifically adapted for including cordova functionality and within a Meteor packaged application based on the Agile Consulting boilerplate.

install: Meteor npm install agile-downloader@https://github.com/skwerlzu/AgileDownloader.git

This version defaults to the browser based FileSaver.js methods if Meteor.isCordova returns false.

If cordova is detected it downloads via xHttp and uses the <a href="https://github.com/apache/cordova-plugin-file" target="_blank">cordova-plugin-file</a> plugin to store the file and the <a href="https://github.com/pwlin/cordova-plugin-file-opener2" target="_blank">cordova-plugin-file-opener2</a> plugin to open the downloaded file.

For more info on using cordova in the Agile Consulting Boilerplate see: <a href="https://github.com/informedecommerce/Meteor-MobileConfig" target="_blank">https://github.com/informedecommerce/Meteor-MobileConfig</a>

Current version:
Cordova usage has a callback handler to report download progress

```js
dlTest(url = null, file_name = null, storage_location = null, callback = null){
         AgileDownloader.saveAs(url, file_name, (response) =>{
            console.warn('Download callback')
            console.log(response)
            this.DL_PROGRESS = response.progress //set reactive var to display or use the progress
         })
        }
```

When a download is complete, the response will return the file attributes in an object
```js
   {
                                              file: fileEntry,
                                              progress: 100,
                                              file_name: file_name,
                                              url: url,
                                              storage_location: storage_location
                                           }
   response.file will contain downloaded file details.
```

FileSaver.js
============
<a href="https://github.com/eligrey/FileSaver.js">https://github.com/eligrey/FileSaver.js</a>
FileSaver.js is the solution to saving files on the client-side, and is perfect for
web apps that generates files on the client, However if the file is coming from the
server we recommend you to first try to use [Content-Disposition][8] attachment response header as it has more cross-browser compatiblity.

Looking for `canvas.toBlob()` for saving canvases? Check out
[canvas-toBlob.js][2] for a cross-browser implementation.

Supported Browsers
------------------

| Browser        | Constructs as | Filenames    | Max Blob Size | Dependencies |
| -------------- | ------------- | ------------ | ------------- | ------------ |
| Firefox 20+    | Blob          | Yes          | 800 MiB       | None         |
| Firefox < 20   | data: URI     | No           | n/a           | [Blob.js](https://github.com/eligrey/Blob.js) |
| Chrome         | Blob          | Yes          | [2GB][3]      | None         |
| Chrome for Android | Blob      | Yes          | [RAM/5][3]    | None         |
| Edge           | Blob          | Yes          | ?             | None         |
| IE 10+         | Blob          | Yes          | 600 MiB       | None         |
| Opera 15+      | Blob          | Yes          | 500 MiB       | None         |
| Opera < 15     | data: URI     | No           | n/a           | [Blob.js](https://github.com/eligrey/Blob.js) |
| Safari 6.1+*   | Blob          | No           | ?             | None         |
| Safari < 6     | data: URI     | No           | n/a           | [Blob.js](https://github.com/eligrey/Blob.js) |
| Safari 10.1+   | Blob          | Yes          | n/a           | None         |

Feature detection is possible:

```js
try {
    var isAgileDownloaderSupported = !!new Blob;
} catch (e) {}
```

### IE < 10

It is possible to save text files in IE < 10 without Flash-based polyfills.
See [ChenWenBrian and koffsyrup's `saveTextAs()`](https://github.com/koffsyrup/AgileDownloader.js#examples) for more details.

### Safari 6.1+

Blobs may be opened instead of saved sometimes—you may have to direct your Safari users to manually
press <kbd>⌘</kbd>+<kbd>S</kbd> to save the file after it is opened. Using the `application/octet-stream` MIME type to force downloads [can cause issues in Safari](https://github.com/eligrey/AgileDownloader.js/issues/12#issuecomment-47247096).

### iOS

saveAs must be run within a user interaction event such as onTouchDown or onClick; setTimeout will prevent saveAs from triggering. Due to restrictions in iOS saveAs opens in a new window instead of downloading, if you want this fixed please [tell Apple how this WebKit bug is affecting you](https://bugs.webkit.org/show_bug.cgi?id=167341).

Syntax
------
### Import `saveAs()` from agile-downloader
```js
import { saveAs } from 'agile-downloader';
```

```js
AgileDownloader saveAs(Blob/File/Url, optional DOMString filename, optional Object { autoBom })
```

Pass `{ autoBom: true }` if you want AgileDownloader.js to automatically provide Unicode text encoding hints (see: [byte order mark](https://en.wikipedia.org/wiki/Byte_order_mark)). Note that this is only done if your blob type has `charset=utf-8` set.

Examples
--------

### Saving text using `require()`
```js
var AgileDownloader = require('agile-downloader');
var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
AgileDownloader.saveAs(blob, "hello world.txt");
```

### Saving text

```js
var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
AgileDownloader.saveAs(blob, "hello world.txt");
```

### Saving URLs

```js
AgileDownloader.saveAs("https://httpbin.org/image", "image.jpg");
```
Using URLs within the same origin will just use `a[download]`.
Otherwise, it will first check if it supports cors header with a synchronous head request.
If it does, it will download the data and save using blob URLs. 
If not, it will try to download it using `a[download]`.

The standard W3C File API [`Blob`][4] interface is not available in all browsers.
[Blob.js][5] is a cross-browser `Blob` implementation that solves this.

### Saving a canvas
```js
var canvas = document.getElementById("my-canvas");
canvas.toBlob(function(blob) {
    saveAs(blob, "pretty image.png");
});
```

Note: The standard HTML5 `canvas.toBlob()` method is not available in all browsers.
[canvas-toBlob.js][6] is a cross-browser `canvas.toBlob()` that polyfills this.

### Saving File

You can save a File constructor without specifying a filename. If the
file itself already contains a name, there is a hand full of ways to get a file
instance (from storage, file input, new constructor, clipboard event). 
If you still want to change the name, then you can change it in the 2nd argument.

```js
// Note: Ie and Edge don't support the new File constructor,
// so it's better to construct blobs and use saveAs(blob, filename)
var file = new File(["Hello, world!"], "hello world.txt", {type: "text/plain;charset=utf-8"});
AgileDownloader.saveAs(file);
```



![Tracking image](https://in.getclicky.com/212712ns.gif)

  [1]: http://eligrey.com/demos/AgileDownloader.js/
  [2]: https://github.com/eligrey/canvas-toBlob.js
  [3]: https://bugs.chromium.org/p/chromium/issues/detail?id=375297#c107
  [4]: https://developer.mozilla.org/en-US/docs/DOM/Blob
  [5]: https://github.com/eligrey/Blob.js
  [6]: https://github.com/eligrey/canvas-toBlob.js
  [7]: https://github.com/jimmywarting/StreamSaver.js
  [8]: https://github.com/eligrey/AgileDownloader.js/wiki/Saving-a-remote-file#using-http-header

Installation
------------------

```bash
# Basic Node.JS installation
npm install agile-downloader --save
bower install agile-downloader
```

Additionally, TypeScript definitions can be installed via:

```bash
# Additional typescript definitions
npm install @types/agile-downloader --save-dev
```
