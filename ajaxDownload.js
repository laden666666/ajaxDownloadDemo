/**
 * Created by njz on 17/2/18.
 */
(function () {

    var AjaxDownload = window.AjaxDownload = function(option) {
        if(typeof option === 'string'){
            option = {url: option};
        }
        if(!option || !option.url){
            throw new Error('URL cannot be empty');
        }
        var self = this;

        self._successFn = option.success;
        self._errorFn = option.error;
        self._progressFn = option.progress;
        self._loadstartFn = option.loadstart;
        
        var xhr = self.xhr = new XMLHttpRequest();
        xhr.open(option.type ? option.type.toUpperCase() : 'GET', option.url, true);
        //是否在cors中启用cookie
        xhr.withCredentials = !!option.credentials;
        xhr.responseType = 'blob';

        xhr.onloadstart = function () {
            typeof self._loadstartFn == 'function' && self._loadstartFn();
        }

        xhr.onload = function () {
<<<<<<< HEAD
            if (this.status < 400 || this.status >= 200) {
=======
            //对于重定向的文件不予理会
            if (this.status >= 200 && this.status < 300) {
                //如果给定了附件名称,优先取给定的名称,否则取http协议中的,如果也没有使用url最后一个字段
                var fileName = option.fileName || (this.getAllResponseHeaders().indexOf('filename=') > -1
                        ? this.getAllResponseHeaders().split("filename=")[0].split("\n")[0].split(";")[0]
                        : option.url.split("#")[0].split("/").pop());
>>>>>>> b4af4206619e51f65f9a8e256c85475455091459
                var blob = new Blob([this.response], {type: this.response.type});

                //ie的下载
                if (window.navigator.msSaveOrOpenBlob) {
                    navigator.msSaveBlob(blob, fileName);
                } else {
                    //非ie的下载
                    var link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = fileName;
                    link.click();
                    window.URL.revokeObjectURL(link.href);
                }
                typeof self._successFn == 'function' && self._successFn(blob);
            } else {
                typeof self._errorFn == 'function' && self._errorFn();
            }
        }

        xhr.onprogress = function(evt){
        	if(this.state != 4){
        		//evt.loaded;  //已经上传大小情况
	            //evt.total; 附件总大小
	            var loaded = evt.loaded;
	            var tot = evt.total;
	            typeof self._progressFn == 'function' && self._progressFn({
	                total: tot,
	                loaded: loaded,
	                percent: Math.floor(100*loaded/tot),
	            });
        	}
            
        }
    }
    
    AjaxDownload.prototype = {
    	get state (){
	        return this.xhr.readyState;
	    },
	    send : function () {
	        this.xhr.send('');
	    },
	    abort : function () {
	        this.xhr.abort();
	    }
    }

})(window)

