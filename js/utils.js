/**
 * Created by wzgong on 12/1/14.
 */
function DataUtil() {
};
DataUtil.parseHTML5String=function(s){
	s=s.replace(new RegExp('&','g'),"&amp;");
	s=s.replace(new RegExp('  ','g')," &nbsp;");
	s=s.replace(new RegExp('>','g'),"&gt;");
	s=s.replace(new RegExp('<','g'),"&lt;");
	s=s.replace(new RegExp('\r','g'),"<br/>");
	return s;
};
DataUtil.createArray = function(name,v){
	var val = [];
		val.push({
		src : 'audios/common/' + name+'sound' + v+'.mp3',
		type : 'audio/mp3'
		});
	val.push({
		src : 'audios/common/' + name+'sound' + v+'.ogg',
		type : 'audio/ogg'
	});
	return val;
};
DataUtil.parseNumber = function(o) {
	var val = 0;
	if ($.isNumeric(o) === true) {
		val = parseFloat(o);
	}
	if (isNaN(val)) {
		val = 0;
	}
	return val;
};
DataUtil.parseString = function(o) {
	var val = '';
	if (o!=undefined && o!=null) {
		val=o.toString();
	}
	return val;
};
DataUtil.parseBoolean = function(o) {
	return DataUtil.isTrue(o);
};
DataUtil.getMediaSrc=function(arr){
	var video=[];
	for(var i=0;i<arr.length;i++){
		var str=arr[i].split(".");
		if(str[str.length-1].toLowerCase()=="mp4"||str[str.length-1].toLowerCase()=="ogg"){
			var media={};
			media['src']=arr[i];
			media['type']="video/"+str[str.length-1].toLowerCase();
			video.push(media);
		}
	}
	if(video.length==0){
		video=undefined;
	}
	return video;
};
DataUtil.valueEquals = function(o1, o2) {
	var val = false;

	if (o1==undefined && o2==undefined) {

	}else if (o1==o2) {
		val=true;
	} if ($.isArray(o1) || $.isArray(o2) || typeof(o1)=='object' || typeof(o2)=='object') {
		val=JSON.stringify(o1)==JSON.stringify(o2);
	}else if ($.isNumeric(o1) && $.isNumeric(o2)) {
		val=parseFloat(o1)==parseFloat(o2);
	}else {
		try {
			val=o1.toString()==o2.toString();
		}catch (e) {
		}
	}
	return val;
};
DataUtil.isTrue = function(o) {
	if (o==true || o=='true' || o=='TRUE' || o==1) {
		return true;
	}
	return false;
};
DataUtil.isFalse = function(o) {
	if (o==false || o=='false' || o=='FALSE' || o==0) {
		return true;
	}
	return false;
};

DataUtil.getInt=function (i,dval) {
	if ($.isNumeric(i)===true) {
		return parseInt(i);
	}
	if (dval==undefined) dval=0;
	return dval;
};
DataUtil.getDefaultString=function(s,defaultstr) {
	if (s==null || s==undefined || s=="undefined" || s=="null") {
		s=defaultstr;
	}
	return s;
};
DataUtil.getPositiveInt=function(i) {
	i=i+"";
	var r = /^\d+$/;
	return r.test(i.trim());
};
//DataUtil.isDefined=function(v) {
//	return  !(typeof v === 'undefined');
//};
DataUtil.parseColor=function(o,format) {
	var color=null;
	try{
		color=$.colors(o);
		color.get();
	}catch(e){
		color=null;
	}

	if(color==null && o.length==6){
		o="#"+o;
		try{
			color=$.colors(o);
			color.get();
		}catch(e){
			color=null;
		}
	}
	if(format=="hex"&&color!=null){
		color=color.toString('hex');
	}

	return color;
};
DataUtil.changeFontFamily=function(font){
	return font;
	//return '"'+font+'",Arial,Serif';
};
DataUtil.collectTextNodes=function(element, texts) {
    for (var child= element.firstChild; child!==null; child= child.nextSibling) {
        if (child.nodeType===3)
            texts.push(child);
        else if (child.nodeType===1)
            collectTextNodes(child, texts);
    }
};
DataUtil.getText=function (element) {
    var texts= [];
    DataUtil.collectTextNodes(element, texts);
    for (var i= texts.length; i-->0;)
        texts[i]= texts[i].data;
    return texts.join('\n');
};

DataUtil.serializeXML=function(xmlData) {
	var xmlString = undefined;
    if (window.ActiveXObject){
        xmlString = xmlData[0].xml;
    }
    if (xmlString === undefined)
    {
        var oSerializer = new XMLSerializer();
        xmlString = oSerializer.serializeToString(xmlData[0]);
    }
    return xmlString;
};

DataUtil.getLabelformatCSS=function (option,attr){
	var table={};
	if(attr==null||attr.length==0){
		if(DataUtil.parseNumber(option["lineHeight"])!=0){
			table["lineHeight"]=DataUtil.parseNumber(option["lineHeight"])+"px";
		}
		if(DataUtil.parseNumber(option["textIndent"])!=0){
			table["textIndent"]=DataUtil.parseNumber(option["textIndent"])+"px";
		}
		if(DataUtil.parseNumber(option["rightMargin"])!=0){
			table["marginRight"]=DataUtil.parseNumber(option["rightMargin"])+"px";
		}
		if(DataUtil.parseNumber(option["leftMargin"])!=0){
			table["marginLeft"]=DataUtil.parseNumber(option["leftMargin"])+"px";
		}
		if(DataUtil.parseNumber(option["fontSize"])!=0){
			table["fontSize"]=DataUtil.parseNumber(option["fontSize"])+"px";
		}
		if(DataUtil.getDefaultString(option["fontFamily"],"")!=""){
			table["fontFamily"]=DataUtil.changeFontFamily(option["fontFamily"]);
		}
		if(DataUtil.getDefaultString(option["fontWeight"],"")!=""){
			table["fontWeight"]=option["fontWeight"];
		}
		if(DataUtil.getDefaultString(option["fontStyle"],"")!=""){
			table["fontStyle"]=option["fontStyle"];
		}
		if(DataUtil.getDefaultString(option["color"],"")!=""){
			table["color"]=option["color"];
		}
		if(DataUtil.getDefaultString(option["textDecoration"],"")!=""){
			table["textDecoration"]=option["textDecoration"];
		}
		if(DataUtil.getDefaultString(option["textAlign"],"")!=""){
			table["textAlign"]=option["textAlign"];
		}
	}else{
		for(var i=0;i<attr.length;i++){
			if(attr[i]=="lineHeight"||attr[i]=="textIndent"||attr[i]=="rightMargin"||attr[i]=="leftMargin"||attr[i]=="fontSize"){
				if(DataUtil.parseNumber(option[attr[i]])!=0){
					table[attr[i]]=DataUtil.parseNumber(option[attr[i]])+"px";
				}
			}
			if(attr[i]=="fontWeight"||attr[i]=="fontStyle"||attr[i]=="color"||attr[i]=="textDecoration"||attr[i]=="textAlign"){
				if(DataUtil.getDefaultString(option[attr[i]],"")!=""){
					table[attr[i]]=option[attr[i]];
				}
			}
			if(attr[i]=="fontFamily"){
				if(DataUtil.getDefaultString(option[attr[i]],"")!=""){
					table[attr[i]]=DataUtil.changeFontFamily(option[attr[i]]);
				}
			}
		}
	}
	return table;
};




var SBLog = {
//	debugOn:sbconfig._debug_log,
	debugOn:true,

	createLog:function() {
		var sblogger={};

		if (window.console==undefined) {//IE with dev tool closed
			SBLog.debugOn=false;
		}
		sblogger.debugOn=SBLog.debugOn;
		sblogger.log=function(){};
		sblogger.time=function() {};
		sblogger.timeEnd=function() {};

		if (SBLog.debugOn) {
			sblogger.log=SBLog._log;
			if (typeof window.console.time !== 'undefined') { //IE
				sblogger.time=SBLog._time;
				sblogger.timeEnd=SBLog._timeEnd;
			}
		};
		return sblogger;
	},

	_log: function (o) {
		if (this.debugOn==true) {
			if ((typeof console['log'].apply)!=='undefined') {
			console['log'].apply(console,Array.prototype.slice.call(arguments, 0));
			}else {//IE
				var s="";
				for (var a in arguments) {
					s+=arguments[a];
				}
				console.log(s);
			}
		}
	},

	_time:function(o) {
		if (this.debugOn) {
			console['time'].apply(console, Array.prototype.slice.call(arguments, 0));
		}
	},

	_timeEnd:function(o) {
		if (this.debugOn) {
			console['timeEnd'].apply(console, Array.prototype.slice.call(arguments, 0));
		}
	},
};

var sblogger=SBLog.createLog();
var logIt=function (o) {
	sblogger['log'].apply(sblogger,Array.prototype.slice.call(arguments, 0));
};


/**
 * ClassUtil
 */
function ClassUtil() {
};
ClassUtil.createBean = function(classname) {
	throw 'ClassUtil.createBean is not implemented';
	// return new window[classname];
};
ClassUtil.getBeanData = function(o, beanname) {
	var result = null;
	if (typeof (o[beanname]) != undefined) {
		result = o[beanname];
	} else if (typeof (o["get" + beanname.substring(0, 1).toUpperCase()
			+ beanname.substring(1)]) == 'function') {
		result = ClassUtil.invoke(o, "set"
				+ beanname.substring(0, 1).toUpperCase()
				+ beanname.substring(1), [ data ]);
	}
	return result;
};
ClassUtil.setBeanData = function(o, beanname, data) {
	var result = null;
	if (typeof (o[beanname]) != undefined) {
		o[beanname] = data;
	} else if (typeof (o["set" + beanname.substring(0, 1).toUpperCase()
			+ beanname.substring(1)]) == 'function') {
		result = ClassUtil.invoke(o, "set"
				+ beanname.substring(0, 1).toUpperCase()
				+ beanname.substring(1), [ data ]);
	}
	return result;
};
ClassUtil.invoke = function(o, methodName, args) {
	var result = null;
	try {
		logIt('ClassUtil invoking ',o,methodName,args);
		if (o!=undefined)
		result = o[methodName].apply(o, Array.prototype.slice.call(args, 0));
	} catch (e) {
		logIt(e);
	}
	return result;
};
ClassUtil.setBeanDataByPath = function(o, path, val) {
	var thispath = path;
	var idx = path.indexOf(".");

	if (idx == 0) {
		logIt("unexpected: property path starts with .");
		return;
	}

	var myobj = o;
	while (idx > 0) {
		var m = thispath.substring(0, idx);
		myobj = ClassUtil.getBeanData(o, m);
		thispath = thispath.substring(idx + 1);
		idx = thispath.indexOf(".");
	}

	ClassUtil.setBeanData(myobj, thispath, val);
};
ClassUtil.getBeanDataByPath = function(o, path) {
	var thispath = path;
	var idx = path.indexOf(".");

	if (idx == 0) {
		logIt("unexpected: property path starts with .");
		return null;
	}

	var myobj = o;
	while (idx > 0) {
		var m = thispath.substring(0, idx);
		myobj = getBeanData(o, m);
		thispath = thispath.substring(idx + 1);
		idx = thispath.indexOf(".");
	}

	return ClassUtil.getBeanData(myobj, thispath);
};
ClassUtil.invokeEval = function(eval) {
	 var o = eval.getObject();
	 var params = eval.getParams();
	 var ret = null;
	 try {
		 ret=ClassUtil.invoke(o,eval.getMethod(),params);
	 }catch (e) {
		 logIt("failed to execute: "+eval+"; "+e.getStackTrace());
	 }
	 return ret;
};
ClassUtil.traceObject = function(o) {
	 logIt(o);
};
ClassUtil.asyncCall = function(fn,interval) {
	var i=DataUtil.parseNumber(interval);
	setTimeout(fn, i);
};