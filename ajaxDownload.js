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

        //是否在cors中启用cookie
        self.withCredentials = !!option.credentials;
        self._successFn = option.success;
        self._errorFn = option.error;
        self._progressFn = option.progress;
        self._loadstartFn = option.loadstart;
        
        var xhr = self.xhr = new XMLHttpRequest();
        xhr.open(option.type ? option.type.toUpperCase() : 'GET', option.url, true);
        xhr.responseType = 'blob';

        xhr.onloadstart = function () {
            typeof self._loadstartFn == 'function' && self._loadstartFn();
        }

        xhr.onload = function () {
            if (this.status == 200) {
                var blob = new Blob([this.response], {type: this.response.type});
                var downloadUrl = URL.createObjectURL(blob);
                var a = document.createElement("a");
                a.setAttribute("target","_blank");
                a.href = downloadUrl;
                document.body.appendChild(a);
                a.click();
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