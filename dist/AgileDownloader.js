//import { Meteor } from 'meteor/meteor'
/*
* AgileDownloader.js
* A saveAs() AgileDownloader implementation.
*
* By Agile Consulting, http://agileconsulting.info
*
* License : https://github.com/skwerlzu/AgileDownloader/blob/master/LICENSE.md (MIT)
* source  : https://github.com/skwerlzu/AgileDownloader
*/

// The one and only way of getting global scope in all environments
// https://stackoverflow.com/q/3277182/1008999
var _global = typeof window === 'object' && window.window === window
  ? window : typeof self === 'object' && self.self === self
  ? self : typeof global === 'object' && global.global === global
  ? global
  : this


console.log('AgileDownloader')
console.log('isCordova: ' + Meteor.isCordova)

function bom (blob, opts) {
  if (typeof opts === 'undefined') opts = { autoBom: false }
  else if (typeof opts !== 'object') {
    console.warn('Deprecated: Expected third argument to be a object')
    opts = { autoBom: !opts }
  }

  // prepend BOM for UTF-8 XML and text/* types (including HTML)
  // note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
  if (opts.autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
    return new Blob([String.fromCharCode(0xFEFF), blob], { type: blob.type })
  }
  return blob
}

function download (url, name, opts) {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', url)
  xhr.responseType = 'blob'
  xhr.onload = function () {
    saveAs(xhr.response, name, opts)
  }
  xhr.onerror = function () {
    console.error('could not download file')
  }
  xhr.send()
}

function corsEnabled (url) {
  var xhr = new XMLHttpRequest()
  // use sync to avoid popup blocker
  xhr.open('HEAD', url, false)
  try {
    xhr.send()
  } catch (e) {}
  return xhr.status >= 200 && xhr.status <= 299
}

// `a.click()` doesn't work for all browsers (#465)
function click (node) {
  try {
    node.dispatchEvent(new MouseEvent('click'))
  } catch (e) {
    var evt = document.createEvent('MouseEvents')
    evt.initMouseEvent('click', true, true, window, 0, 0, 0, 80,
                          20, false, false, false, false, 0, null)
    node.dispatchEvent(evt)
  }
}

var saveAs = function(){
    console.log('Agile-Downloader Initiating....')
    return false
};

if(Meteor.isCordova){

       console.log('Agile-Downloader: Device Ready')
       console.log(cordova.file);
      
    if(!resolveLocalFileSystemURL){
      console.error('Agile Downloader requires the cordova-plugin-file plugin for native download and storage.')
      console.error('<a href="https://github.com/apache/cordova-plugin-file">https://github.com/apache/cordova-plugin-file</a>')
      console.error('meteor add cordova:cordova-plugin-file@6.0.2')
   }
   
   //If cordova switch to native file transfering and local storage
   //required: cordova file plugin and cordova openfile2 plugin
   saveAs = function saveAs (url, file_name = null, opts = null, cb = null){
     
      var self = this;
     var storage_location = null
      //if function is passed in the file_name or opts var, set callback to the passed function
          if(Object.prototype.toString.call(file_name) == '[object Function]' || typeof file_name === "function"){
             cb = file_name
          }
      
          if(Object.prototype.toString.call(opts) == '[object Function]' || typeof opts === "function"){
             cb = opts
          }
          
          if(!file_name || !Object.prototype.toString.call(file_name) == '[object Function]' || !typeof file_name === "function"){
             file_name = url.split('/').pop()
          }
      
      if(!storage_location || Object.prototype.toString.call(storage_location) == '[object Function]' || typeof storage_location === "function"){
            switch (device.platform) {
              case "Android":
                storage_location = cordova.file.externalDataDirectory;
                break;

              case "iOS":
                storage_location = cordova.file.documentsDirectory;
                break;
            }
         }

      
             
             
             
          resolveLocalFileSystemURL(
            storage_location
             , function (fs) {
                console.log('file system open: ' + fs.name);
                fs.getFile(file_name, { create: true, exclusive: false }, function (fileEntry) {
                   
                    console.log('fileEntry is file? ' + fileEntry.isFile.toString());
                    var oReq = new XMLHttpRequest();
                    // Make sure you add the domain name to the Content-Security-Policy <meta> element.
                    oReq.open("GET", url, true);
                    // Define how you want the XHR data to come back
                    oReq.responseType = "blob";
                   
                     oReq.addEventListener('readystatechange', function(e) {
                        if(oReq.readyState == 2 && oReq.status == 200) {
                           console.log('Download is being started')
                        }
                        else if(oReq.readyState == 3) {
                           console.log('Download is in progress')
                        }
                        else if(oReq.readyState == 4) {
                           console.log('Downloading has finished')

                           self.DL_OBJECT = oReq.response;

                                                   
                           console.log(oReq)
                           
                           // Set href as a local object URL
                           self.DL_PATH = self.DL_OBJECT; 

                           // Set name of download
                           //document.querySelector('#save-file').setAttribute('download', 'img.jpeg');
                           self.DL_NAME = file_name

                           var blob = oReq.response; // Note: not oReq.responseText
                        if (blob) {
                           fileEntry.createWriter(
                            function (fileWriter) {
                               fileWriter.write(blob);

                               var mimeType = fileEntry.file.type
                               console.log('mimetype: '+ mimeType)
                                 fileWriter.onwriteend = function () {
                                   var url = fileEntry.toURL();

                                    
                                    
                                    if(!cordova.plugins.fileOpener2){
                                       if(!resolveLocalFileSystemURL){
                                          console.warn('Agile Downloader requires the cordova-plugin-file-opener2 plugin to automatically open files <a href="https://github.com/pwlin/cordova-plugin-file-opener2">https://github.com/pwlin/cordova-plugin-file-opener2</a>')
                                          console.error('meteor add cordova:cordova-plugin-file-opener2@3.0.0')
                                       }
                                    }else{
                                       cordova.plugins.fileOpener2.open(url, mimeType, {
                                        error: function error(err) {
                                          console.error(err);
                                          //alert("Unable to download");
                                           cb({
                                              file: fileEntry,
                                              progress: 100,
                                              file_name: file_name,
                                              url: url,
                                              storage_location: storage_location
                                           })
                                        },
                                        success: function success() {
                                          //console.log("success with opening the file");
                                          try{
                                           cb({
                                              file: fileEntry,
                                              progress: 100,
                                              file_name: file_name,
                                              url: url,
                                              storage_location: storage_location
                                           })
                                        }catch(err){
                                            console.error(err)
                                        }
                                        }
                                        
                                      });
                                    }
                                 };

                                 fileWriter.onerror = function (err) {
                                   alert("Unable to download");
                                   console.error(err);
                                 };
                            }
                         )
                           
                           /*writeFile(reader.result, null);
                            // Or read the data with a FileReader
                            var reader = new FileReader();
                            reader.addEventListener("loadend", function(e) {
                               // reader.result contains the contents of blob as text
                               console.log('File Downloaded')
                               console.log(reader)
                            });
                           
                            console.log(reader.readAsText(blob));
                            */
                        } else console.error('we didnt get an XHR response!');
                           
                           // Recommended : Revoke the object URL after some time to free up resources
                           // There is no way to find out whether user finished downloading
                           setTimeout(function() {
                              window.URL.revokeObjectURL(self.DL_OBJECT);
                           }, 60*1000);
                        }
                      });

                      oReq.addEventListener('progress', function(e) {
                         if(cb){
                            cb({
                               progress: (e.loaded / e.total)*100,
                               file_name: file_name,
                               url: url,
                               storage_location: storage_location
                            })
                         }
                      });
                   
                   
                    oReq.send(null);
                }, function (err) { console.error('error getting file! ' + err); });
            }, function (err) { console.error('error getting persistent fs! ' + err); });
          } 
   
  
   
   
}else{

   saveAs = _global.saveAs || (
     // probably in some web worker
     (typeof window !== 'object' || window !== _global)
       ? function saveAs () { /* noop */ }

     // Use download attribute first if possible (#193 Lumia mobile)
     : 'download' in HTMLAnchorElement.prototype
     ? function saveAs (blob, file_name = null, opts = null, cb = null) {
         //if function is passed in the file_name or opts var, set callback to the passed function
        if(Object.prototype.toString.call(opts) == '[object Function]' || typeof opts === "function"){
             cb = opts
          }
        if(Object.prototype.toString.call(file_name) == '[object Function]' || typeof file_name === "function"){
             cb = file_name
          }
          
        
        
       var URL = _global.URL || _global.webkitURL
       var a = document.createElement('a')
       file_name = file_name || blob.name 
        if(!file_name || !Object.prototype.toString.call(file_name) == '[object Function]' || !typeof file_name === "function"){
           try{
             file_name = blob.split('/').pop()
           }catch(err){
              console.error(err)
              file_name = 'download'
           }
          }
        
       a.download = file_name
       a.rel = 'noopener' // tabnabbing

       // TODO: detect chrome extensions & packaged apps
       // a.target = '_blank'

       if (typeof blob === 'string') {
         // Support regular links
         a.href = blob
         if (a.origin !== location.origin) {
           corsEnabled(a.href)
             ? download(blob, file_name, opts)
             : click(a, a.target = '_blank')
         } else {
           click(a)
         }
       } else {
         // Support blobs
         a.href = URL.createObjectURL(blob)
         setTimeout(function () { URL.revokeObjectURL(a.href) }, 4E4) // 40s
         setTimeout(function () { click(a) }, 0)
       }
     }

     // Use msSaveOrOpenBlob as a second approach
     : 'msSaveOrOpenBlob' in navigator
     ? function saveAs (blob, file_name = null, opts = null, cb = null) {
        
        //if function is passed in the file_name or opts var, set callback to the passed function
        if(Object.prototype.toString.call(opts) == '[object Function]' || typeof opts === "function"){
             cb = opts
          }
        if(Object.prototype.toString.call(file_name) == '[object Function]' || typeof file_name === "function"){
             cb = file_name
          }
        
       file_name = file_name || blob.name 
        if(!file_name || !Object.prototype.toString.call(file_name) == '[object Function]' || !typeof file_name === "function"){
           try{
             file_name = blob.split('/').pop()
           }catch(err){
              console.error(err)
              file_name = 'download'
           }
          }

       if (typeof blob === 'string') {
         if (corsEnabled(blob)) {
           download(blob, file_name, opts)
         } else {
           var a = document.createElement('a')
           a.href = blob
           a.target = '_blank'
           setTimeout(function () { click(a) })
         }
       } else {
         navigator.msSaveOrOpenBlob(bom(blob, opts), file_name)
       }
     }

     // Fallback to using FileReader and a popup
     : function saveAs (blob, file_name, opts, popup) {
       // Open a popup immediately do go around popup blocker
       // Mostly only available on user interaction and the fileReader is async so...
       popup = popup || open('', '_blank')
       if (popup) {
         popup.document.title =
         popup.document.body.innerText = 'downloading...'
       }

        //if function is passed in the file_name or opts var, set callback to the passed function
        if(Object.prototype.toString.call(opts) == '[object Function]' || typeof opts === "function"){
             cb = opts
          }
        if(Object.prototype.toString.call(file_name) == '[object Function]' || typeof file_name === "function"){
             cb = file_name
          }
        
        file_name = file_name || blob.name 
        if(!file_name || !Object.prototype.toString.call(file_name) == '[object Function]' || !typeof file_name === "function"){
           try{
             file_name = blob.split('/').pop()
           }catch(err){
              console.error(err)
              file_name = 'download'
           }
          }
        
       if (typeof blob === 'string') return download(blob, file_name, opts)

       var force = blob.type === 'application/octet-stream'
       var isSafari = /constructor/i.test(_global.HTMLElement) || _global.safari
       var isChromeIOS = /CriOS\/[\d]+/.test(navigator.userAgent)

       if ((isChromeIOS || (force && isSafari)) && typeof FileReader === 'object') {
         // Safari doesn't allow downloading of blob URLs
         var reader = new FileReader()
         reader.onloadend = function () {
           var url = reader.result
           url = isChromeIOS ? url : url.replace(/^data:[^;]*;/, 'data:attachment/file;')
           if (popup) popup.location.href = url
           else location = url
           popup = null // reverse-tabnabbing #460
         }
         reader.readAsDataURL(blob)
       } else {
         var URL = _global.URL || _global.webkitURL
         var url = URL.createObjectURL(blob)
         if (popup) popup.location = url
         else location.href = url
         popup = null // reverse-tabnabbing #460
         setTimeout(function () { URL.revokeObjectURL(url) }, 4E4) // 40s
       }
     }
   )
}

_global.saveAs = saveAs.saveAs = saveAs

if (typeof module !== 'undefined') {
  module.exports = saveAs;
}

