
/**
 * invoke method on generic super class without using actual widget class name
 */
var invokeWidgetMethod = function(methodName, widgetElem) {
    var $widgetElem = $(widgetElem),
        widgetData = $widgetElem.data(),
        dataName=null,
        dataObject=null;

    for(dataName in widgetData) {
        dataObject = widgetData[dataName];
        if ($.isFunction(dataObject[methodName])) {
        	return dataObject[methodName].apply(dataObject,Array.prototype.slice.call(arguments, 2));
        	//break;
        }
    }
};
var invokeWidgetMethodHasargument = function(methodName, widgetElem,element) {
    var $widgetElem = $(widgetElem),
        widgetData = $widgetElem.data(),
        dataName=null,
        dataObject=null;
    for(dataName in widgetData) {
        dataObject = widgetData[dataName];
        if ($.isFunction(dataObject[methodName])) {
        	return dataObject[methodName].apply(dataObject,Array.prototype.slice.call(arguments, 2));
        	//break;
        }
    }
};
function SBKey(type,id) {
	this.type=type;
	this.id=id;
};
SBKey.statickeys={};
SBKey.prototype.toString = function() {
	return this.type+':'+this.id;
};
SBKey.formString = function(type,id) {
	return type+':'+id;
};
SBKey.parseString = function(str) {
	var key=null;
	if (str!=null) {
		var parts=str.split(':');
		if (parts.length==2) {
			key=SBKey.getKey(parts[0],parts[1]);
		}
	}
	return key;
};
SBKey.getKey = function(type,id) {
	var newkey=null;
	
	if (type==null || id==null) {
		return null;
	}
	newkey=new SBKey(type,id);

	var key=SBKey.statickeys[newkey];
	if (key==undefined) {
		SBKey.statickeys[newkey]=newkey;
		key=newkey;
	}
	return key;
};
SBKey.prototype.equals=function(key) {
	if (key!=null && key.id==this.id && key.type==this.type) {
		return true;
	}
	return false;
};

function SBVal(val,type) {
	this.type=type;
	this.setValue(val);
};

SBVal.prototype.reset=function() {
	this.val=undefined;
};

SBVal.prototype.getValue=function() {
	return this.val;
};

SBVal.prototype.setValue=function(v) {
	if (this.type=='bool') {
		this.val=DataUtil.parseBoolean(v);
	}else if (this.type=='number') {
		this.val=DataUtil.parseNumber(v);
	}else if (this.type=='string') {
		this.val=DataUtil.parseString(v);
	}else if (v instanceof SBVal) {
		this.val=v.val;
		this.type=v.type;
	}else{
		this.val=v;		
	}
};

SBVal.prototype.setStringValue=function(v) {
	this.setValue(DataUtil.parseString(v));
};

SBVal.prototype.truncate=function(v,precision) {
	var o=v;
	if ($.isNumeric(o)) {
		o=Math.round(v*Math.pow(10,precision))/Math.pow(10,precision);
	}
	return o;
};

SBVal.prototype.equalsTo=function(v) {
	var ret=false;
	var thatval=undefined;
	if (v instanceof SBVal) {
		thatval=v.getValue();
		ret=thatval==this.val;
	}else {
		if (DataUtil.parseString(v)==DataUtil.parseString(this.val)) {
			ret=true;
		}
	}
	return ret;
};

SBVal.prototype.equalsToStrict=function(v) {
	var ret=false;
	var thatval=undefined;
	if (v instanceof SBVal) {
		thatval=v.getValue();
		ret=thatval==this.val;
	}else {
		if (DataUtil.parseString(v)==DataUtil.parseString(this.val)) {
			ret=true;
		}
	}
	return ret;
};

SBVal.prototype.greaterThan=function(v) {
	var ok=false;
	var o=v;
	if (v instanceof SBVal) {
		o=v.getValue();
	}
	if ($.isNumeric(this.val) && $.isNumeric(v)) {
		ok=this.val>DataUtil.parseNumber(o);
	}else {
		ok=this.val>o;		
	}
	return ok;
};

SBVal.prototype.lessThan=function(v) {
	var ok=false;
	var o=v;
	if (v instanceof SBVal) {
		o=v.getValue();
	}
	if ($.isNumeric(this.val) && $.isNumeric(v)) {
		ok=this.val<DataUtil.parseNumber(o);
	}else {
		ok=this.val<o;		
	}
	return ok;
};

SBVal.prototype.atLeast=function(v) {
	var ok=false;
	var o=v;
	if (v instanceof SBVal) {
		o=v.getValue();
	}
	if ($.isNumeric(this.val) && $.isNumeric(v)) {
		ok=this.val>=DataUtil.parseNumber(o);
	}else {
		ok=this.val>=o;		
	}
	return ok;
};

SBVal.prototype.atMost=function(v) {
	var ok=false;
	var o=v;
	if (v instanceof SBVal) {
		o=v.getValue();
	}
	if ($.isNumeric(this.val) && $.isNumeric(v)) {
		ok=this.val<=DataUtil.parseNumber(o);
	}else {
		ok=this.val<=o;		
	}
	return ok;
};

SBVal.prototype.plus=function(v) {
	var o=v;
	if (v instanceof SBVal) {
		o=v.getValue();
	}
	if ($.isNumeric(this.val) && $.isNumeric(v)) {
		this.val=DataUtil.parseNumber(this.val)+DataUtil.parseNumber(o);
	}
};
SBVal.prototype.minus=function(v) {
	var o=v;
	if (v instanceof SBVal) {
		o=v.getValue();
	}
	if ($.isNumeric(this.val) && $.isNumeric(v)) {
		this.val=DataUtil.parseNumber(this.val)-DataUtil.parseNumber(o);
	}
};
SBVal.prototype.multiply=function(v) {
	var o=v;
	if (v instanceof SBVal) {
		o=v.getValue();
	}
	if ($.isNumeric(this.val) && $.isNumeric(v)) {
		this.val=DataUtil.parseNumber(this.val)*DataUtil.parseNumber(o);
	}
};
SBVal.prototype.divide=function(v) {
	var o=v;
	if (v instanceof SBVal) {
		o=v.getValue();
	}
	if ($.isNumeric(this.val) && $.isNumeric(v)) {
		this.val=DataUtil.parseNumber(DataUtil.parseNumber(this.val)/DataUtil.parseNumber(o));
	}
};
SBVal.prototype.round=function() {
	if ($.isNumeric(this.val)) {
		this.val=Math.round(this.val);
	}
};
SBVal.prototype.ceil=function() {
	if ($.isNumeric(this.val)) {
		this.val=Math.ceil(this.val);
	}
};
SBVal.prototype.floor=function() {
	if ($.isNumeric(this.val)) {
		this.val=Math.floor(this.val);
	}
};


SBVal.prototype.notEqualsTo=function(v) {
	return !this.equalsTo(v);
};

SBVal.prototype.toString=function() {
	var ret=this.getValue();
	return DataUtil.parseString(ret);
};

SBVal.prototype.toStringValue=function() {
	return this.toString();
};


SBVal.prototype.getUpperCase=function(v) {
	return this.toString().toUpperCase();
};

SBVal.prototype.getLowerCase=function(v) {
	return this.toString().toLowerCase();
};

SBVal.prototype.append=function() {
	for ( var i=0;i<arguments.length;i++) {
		if (arguments[i]!=undefined) {
			this.val=this.val+DataUtil.parseString(arguments[i]);
		}
	}
	return this.val;
};
SBVal.prototype.appendOnNewLine=function() {
	for ( var i=0;i<arguments.length;i++) {
		if (arguments[i]!=undefined) {
			this.val=this.val+'\n'+DataUtil.parseString(arguments[i]);
		}
	}
	return this.val;
};

SBVal.prototype.getLength=function() {
	return this.toString().length;
};

SBVal.prototype.contains=function(s) {
	if (s==undefined) return false;
	return this.toString().toLowerCase().indexOf(s.toLowerCase())>=0;
};

SBVal.prototype.endsWith=function(s) {
	var v=this.toString();
	return v.lastIndexOf(s)==(v.length-s.length);
};
SBVal.prototype.startsWith=function(s) {
	var v=this.toString();
	return v.indexOf(s)==0;
};

function ObjContext(extctx) {
	this.extctx=extctx;
	this.map={};
};
ObjContext.prototype.lookup = function(o) {
	var ret=this.map[o];
	if (ret==undefined && this.extctx!=null) {
		ret=this.extctx.lookup(o);
	}
	return ret;
};
ObjContext.prototype.addObj = function(key,o) {
	return this.map[key]=o;
};
ObjContext.isWidget=function(o) {
	var ok=false;
	if (o!=null && o.widgetName!=null) {
		if (o.widgetName.indexOf('sb')==0) ok=true;
	}
	return ok;
};
ObjContext.isWidgetDiv=function(o) {
	var ok=false;
	if (o!=null && !(o instanceof SBVal) && $.isFunction(o.sbobj)) {
		ok=true;
	}
	return ok;
};
ObjContext.getWidgetName=function(o) {
	var name=undefined;
	var data=$(o).data();
	for (var a in data) {
		if (a.indexOf('sb')==0 && data[a].widgetName!=null) {
			name=data[a].widgetName;
			break;
		}
	}
	return name;
};
ObjContext.getWidgetClass=function(o){
	var name="";
	var cl=o.attr("class");
	var arraycl=cl.split(" ");
	for(var i=0;i<arraycl.length;i++){
		if(arraycl[i]!="widget"&&arraycl[i]!="stage"&&arraycl[i]!="sbobj"){
			name="sb"+arraycl[i];
		}
	}
	return name;
	
};
/**
 * SBEngineA Expr & Instructor
 * TODO: JIT instructor 
 * TODO: function/block call w/ params 
 * TODO: LoopExpr support 
 */
function Expr(type,id) {
	this.id = id;
	this.type=type;
};
Expr.prototype.getValue = function() {
	return null;
};
Expr.prototype.getId = function() {
	return this.id;
};
Expr.prototype.setId = function(id) {
	this.id = id;
};

function TriggerExpr(src, eventname) {
	this.src = src;
	this.eventname = eventname;
};
TriggerExpr.prototype = new Expr('Trigger');

function FuncExpr(f,expr,r,desc,cond) {
	this.f=f;
	this.expr=expr;
	this.desc=desc;
	this.cond=cond;
	this.r=true;
	if (DataUtil.isFalse(r)) {
		this.r=false;
	}
};
FuncExpr.prototype = new Expr('Func');

function FirstExpr(id,exprs,b) {
	this.exprs = exprs;
	Expr.apply(this, ['First',id]);
};
FirstExpr.prototype = new Expr('First');

function EvalExpr(object, method, params) {
	this.object = object;
	this.method = method;
	this.params = params;
};
EvalExpr.prototype = new Expr('Eval');

function BlockExpr(id) {
	this.exprlist = [];
	Expr.apply(this, ['Block',id]);
};
BlockExpr.prototype = new Expr('Block');
BlockExpr.prototype.addExpr = function(expr) {
	if (expr!=null) {
		this.exprlist.push(expr);
	}
};


function IfExpr(condexpr, trueexpr, falseexpr) {
	this.condexpr = condexpr;
	this.trueexpr = trueexpr;
	this.falseexpr = falseexpr;
};
IfExpr.prototype = new Expr('If');

function BasicExpr(op, expr1, expr2) {
	this.expr1 = expr1;
	this.expr2 = expr2;
	this.op=op;
	if (op == undefined) {
		this.op = BasicExpr.OP_NOOP;
	}
};
BasicExpr.prototype = new Expr('Basic');
BasicExpr.OP_NOOP = "NOOP";
BasicExpr.OP_AND = "AND";
BasicExpr.OP_OR = "OR";
BasicExpr.OP_PLUS = "PLU";
BasicExpr.OP_MINUS = "MIN";
BasicExpr.OP_MULTI = "MUL";
BasicExpr.OP_MOD = "MOD";
BasicExpr.OP_DIV = "DIV";
BasicExpr.OP_GT = "GT";
BasicExpr.OP_LT = "LT";
BasicExpr.OP_EQ = "EQ";
BasicExpr.OP_NEQ = "NEQ";
BasicExpr.OP_GTE = "GTE";
BasicExpr.OP_LTE = "LTE";

// BasicExpr.OP_JOIN = "JO";
// BasicExpr.OP_IN = "IN";
// BasicExpr.OP_OUT = "OUT";
// BasicExpr.OP_ASSIGN = "ASS";

function ExprInstructor(engine, debug) {
	this.engine = engine;
	this.debug = debug;
};
ExprInstructor.prototype.parseExpr = function(expr, deferred) {
	if (this.debug  && expr!=null) {
		logIt('parseExpr',expr.type==undefined?'CONST':expr.type,expr);
	}
	if (expr == null || !(expr instanceof Expr)) {
		deferred = deferred.pipe(function() {
			return expr;
		});
	} else {
		if (this.debug) {
			deferred.pipe(function(e) {
				logIt('executing',expr.type,expr);
				return e;
			});
		}
		if (expr instanceof EvalExpr) {
			deferred = this.parseEvalExpr(expr, deferred);
		} else if (expr instanceof BasicExpr) {
			deferred = this.parseBasicExpr(expr, deferred);
		} else if (expr instanceof BlockExpr) {
			deferred = this.parseBlockExpr(expr, deferred);
		} else if (expr instanceof IfExpr) {
			deferred = this.parseIfExpr(expr, deferred);
		} else if (expr instanceof FirstExpr) {
			deferred = this.parseFirstExpr(expr, deferred);
		} else if (expr instanceof FuncExpr) {
			deferred = this.parseFuncExpr(expr, deferred);
		} 
	if (this.debug) {
		deferred.pipe(function(e) {
			logIt('executed',expr.type,expr,e);
			return e;
		});
	}
	}
	return deferred;
};
ExprInstructor.prototype.parseEvalExpr = function(expr, deferred) {
	var params = expr.params;
	if (params == undefined)
		params = [];
	var paramresult = [];

	for ( var i = 0; i < params.length; i++) {
		deferred = this.parseExpr(params[i], deferred);
		deferred = deferred.pipe(function(e) {
			return paramresult.push(e);
		});
	}
	deferred = deferred.pipe(function(e) {
		return [ paramresult ];
	});

	deferred = deferred.pipe(function(e) {
		e.unshift(expr.method);
		return e;
	});

	if (typeof (expr.object) == 'string' || expr.object instanceof SBKey) {
		var thatengine=this.engine;
		deferred = deferred.pipe(function(e) {
			e.unshift(thatengine.getObj(expr.object.toString()));
			return e;
		});
	}

	deferred = deferred.pipe(function(e) {
		var resultdeferred = $.Deferred();
		var callparams=e;
		if (e.length>=3 && ObjContext.isWidgetDiv(e[0])) {
			callparams=[];
			callparams.push(e[0]);
			callparams.push(ObjContext.getWidgetName(e[0]));
			callparams.push($.merge([e[1]],e[2]));
		}
		var v = ClassUtil.invoke(callparams[0], callparams[1], callparams[2]);
		//if a method is async, it should return a deferred obj
		if (v != undefined && $.isFunction(v.promise)) {
			return v;
		} else {
			resultdeferred.resolve(v);
			return resultdeferred;
		}
	});

	return deferred;
};

ExprInstructor.prototype.parseBlockExpr = function(expr, deferred) {
	var exprlist = expr.exprlist;
	// var d=$.Deferred();
	if (exprlist == undefined) {
		deferred = deferred.pipe(function() {
			return undefined;
		});
	} else {
		for ( var i = 0; i < exprlist.length; i++) {
			deferred = this.parseExpr(exprlist[i], deferred);
		}
	}
	return deferred;
};

ExprInstructor.prototype.parseIfExpr = function(expr, deferred) {
	var condexpr = expr.condexpr;
	if (condexpr == undefined) {
		deferred = this.parseExpr(expr.falseexpr, deferred);
	} else {
		deferred = this.parseExpr(condexpr, deferred);
		var trued = $.Deferred();
		this.parseExpr(expr.trueexpr, trued);
		var falsed = $.Deferred();
		this.parseExpr(expr.falseexpr, falsed);
		deferred.pipe(function(cond) {
			if (this.debug)
				logIt('if result', cond);
			if (DataUtil.isTrue(cond)) {
				trued.resolve();
				return trued;
			} else {
				falsed.resolve();
				return falsed;
			}
		});
	}
	return deferred;
};

ExprInstructor.prototype.parseFuncExpr = function(expr, deferred) {

	var d = $.Deferred();
	if (expr.expr!=null) {
		this.parseExpr(expr.expr, d);
	}
	
	deferred=deferred.pipe(function(v) {
		var ret=true;
		if (expr.cond!=null) {
			ret=expr.cond();
		}
		if (DataUtil.isTrue(ret)) {
			d.resolve();
			return d;
		}
	});
	
	if (expr.f!=undefined) {
		deferred=deferred.pipe(function(v) {
			var ret=expr.f();
			if (expr.r==true) {
				return ret;
			}else {
			return v;
			}
		});
	}

	return deferred;
};


ExprInstructor.prototype.parseFirstExpr = function(expr, deferred) {
	var exprs = expr.exprs;
	if (exprs == undefined || exprs.length==0) {
		deferred = this.parseExpr(-1, deferred);
	} else {
		var ds=[];
		for ( var i = 0; i < exprs.length; i++) {
			var next = $.Deferred();
			ds.push(this.parseExpr(exprs[i], next));
		}
		var thatidx=-1;
		var counter=-1;
		deferred.pipe(function(v) {
			if (thatidx>=0) {
				return thatidx;
			}
			if (counter>=0 && v==true) {
				thatidx=counter;
			}
			counter++;
			if (counter==ds.length) {
				return -1;
			}
			ds[counter].resolve();
			return ds[counter];
		});
	}
	return deferred;
};

ExprInstructor.prototype.parseBasicExpr = function(expr, deferred) {
	var op = expr.op;
	var engine = this.engine;
	if (op == undefined || op == BasicExpr.OP_NOOP) {
		deferred = deferred.pipe(function(e) {
			if (this.engine != undefined) {
				var noopd = $.Deferred();
				setTimeout(function() {
					noopd.resolve(e);
				}, engine.tick);
				return noopd;
			} else {
				return e;
			}
		});
	} else {
		var results = [];
		var d1 = $.Deferred();
		var d1chain=this.parseExpr(expr.expr1, d1);
		var d2 = $.Deferred();
		var d2chain=this.parseExpr(expr.expr2, d2);
		deferred = deferred.pipe(function(e) {
			d1.resolve();
			return d1chain;
		}).pipe(function(e) {
			results.push(e);
			return e;
		});

		if (op == BasicExpr.OP_OR) {
			deferred = deferred.pipe(function(e) {
				if (!DataUtil.isTrue(e)) {
					d2.resolve();
					return d2chain;
				} else {
					return true;
				}
			}).pipe(function(e) {
				results.push(e);
				return e;
			});
		} else {
			deferred = deferred.pipe(function(e) {
				d2.resolve();
				return d2chain;
			}).pipe(function(e) {
				results.push(e);
				return e;
			});
		}

		deferred=deferred.pipe(function(e) {
			if (op == BasicExpr.OP_AND) {
				return DataUtil.isTrue(results[0])
						&& DataUtil.isTrue(results[1]);
			} else if (op == BasicExpr.OP_OR) {
				return DataUtil.isTrue(results[0])
				|| DataUtil.isTrue(results[1]);
			} else if (op == BasicExpr.OP_PLUS) {
				return DataUtil.parseNumber(results[0])
						+ DataUtil.parseNumber(results[1]);
			} else if (op == BasicExpr.OP_MIN) {
				return DataUtil.parseNumber(results[0])
						- DataUtil.parseNumber(results[1]);
			} else if (op == BasicExpr.OP_MUL) {
				return DataUtil.parseNumber(results[0])
						* DataUtil.parseNumber(results[1]);
			} else if (op == BasicExpr.OP_MOD) {
				var v = DataUtil.parseNumber(results[0])
						% DataUtil.parseNumber(results[1]);
				return DataUtil.parseNumber(v);
			} else if (op == BasicExpr.OP_DIV) {
				var v = DataUtil.parseNumber(results[0])
						/ DataUtil.parseNumber(results[1]);
				return DataUtil.parseNumber(v);
			} else if (op == BasicExpr.OP_GT) {
				return DataUtil.parseNumber(results[0]) > DataUtil
						.parseNumber(results[1]);
			} else if (op == BasicExpr.OP_LT) {
				return DataUtil.parseNumber(results[0]) < DataUtil
						.parseNumber(results[1]);
			} else if (op == BasicExpr.OP_EQ) {
				return DataUtil.valueEquals(results[0], results[1]);
			} else if (op == BasicExpr.OP_NEQ) {
				return !DataUtil.valueEquals(results[0], results[1]);
			} else if (op == BasicExpr.OP_GTE) {
				return DataUtil.parseNumber(results[0]) >= DataUtil
						.parseNumber(results[1]);
			} else if (op == BasicExpr.OP_LTE) {
				return DataUtil.parseNumber(results[0]) <= DataUtil
						.parseNumber(results[1]);
			}
		});
	}

	return deferred;
};

SB3Flow=function(data,factory) {
	this.factory=factory;
	this.data=$(data);
	var proot=this.data.children('pageflow').eq(0);
 
	this.fctxcue=[];
	this.fdata=proot.children('flow').eq(0);
	this.fctxcue.push(this.fdata);
	var sfdata=$('sharedflows > flow, pageflow > flow',proot);
	this.sharedflows={};
	$.each(sfdata,$.proxy(function(idx,f) {
		var el_f=$(f);
		var fkey=SBKey.getKey(el_f.attr('type'),el_f.attr('id'));
		this.sharedflows[fkey]=el_f;
	},this));
 
	this.key=SBKey.getKey('page','');//SBKey.getKey(this.fdata.attr('type'),this.fdata.attr('id'));
	this.current=this.fdata;
	this.nodemap={};
	
	$.each(proot.find('flow[flowtype="1"]'), $.proxy(function(idx, f) { 
		  var el=$(f);
		  this.nodemap[el.attr('flowid')]=el;
	},this));
	this.cobj={};
	this.cobj[this.key]='start';
	this.pending=false;
};

SB3Flow.prototype.onEvent=function(engine,objkey,eventname, opts) {
	if (this.pending!=true && this.cobj!=null && eventname!=null && eventname==this.cobj[objkey]) {
		this.pending=true;
		engine.trace('','FLOW: event '+objkey+', '+eventname,2);
		var current=this.current;
		this.cobj=null;
		this.bidx=-1;
		var thatobj=this;
 
		var fkey=SBKey.getKey(current.attr('type'),current.attr('id'));
		var fsetting=current.children('flowsetting').eq(0);
		var smode=fsetting.attr('submitmode');
		if ((smode=='4' || smode=='0') && DataUtil.isTrue(fsetting.attr('hideafteruse'))) {
			engine.trace('FLOW: hide after use',objkey,1);
			engine.requestNativeAction(this.key,[new EvalExpr(objkey,'hide',[])]);
		}
		engine.onEvent(fkey,'onSubmit');
 
		var branches=current.children('branch');
		function selectBranch(flow,branches) {
			var fid=current.attr('flowid');
			var selblock=new BlockExpr();
			for (var i=0;i<branches.length;i++) {
				var br=$(branches[i]);
				var bid=br.attr('id');
				var r=thatobj.data.children('action[type="fact"][id="'+fid+'.'+bid+'"]');
				if (r.length>0) {
					var ifexpr=thatobj.factory._sb3_buildAction(r.eq(0))['expr'];
					var bexpr=new BlockExpr();
					bexpr.addExpr(ifexpr.trueexpr);
					var bexprfalse=null;
					if (ifexpr.falseexpr!=null) {
						bexprfalse=new BlockExpr();
						bexprfalse.addExpr(ifexpr.falseexpr);
					}
					var f=(function(myidx) {
						return function() {
							thatobj.onTrueBranch(myidx);
						};
					})(i);
					
					var c=(function() {
							return thatobj.bidx<0;
					});					
					//bexpr.addExpr(new FuncExpr(f,ifexpr.trueexpr,false,'select flow branch '+bid+'-'+i,c));
					//ifexpr.trueexpr=new FuncExpr(f,ifexpr.trueexpr,false,'select flow branch '+bid+'-'+i,c); //bexpr;
					var newif=new IfExpr();
					newif.condexpr=new BasicExpr(BasicExpr.OP_AND,new FuncExpr(c,null,true,''),ifexpr.condexpr);
					bexpr.addExpr(new FuncExpr(f,null,false,'select flow branch '+bid+'-'+i));
					newif.trueexpr=bexpr;
					newif.falseexpr=bexprfalse;
					selblock.addExpr(newif);
				}else {
					var f=(function(myidx) {
						return function() {
							thatobj.onTrueBranch(myidx);
						};
					})(i);
					selblock.addExpr(new FuncExpr(f,null,false,'select empty flow branch '+bid+'-'+i));
				}
			}
			
			var sexpr=new FuncExpr(function() {
				thatobj.onContinue(engine);
			},selblock,false);
			engine.requestNativeAction(this.key,[sexpr]);
		};
 
		selectBranch(current,branches);
	}
};

SB3Flow.prototype.onTrueBranch=function(bidx) {
	logIt('Flow: onTrueBranch',bidx,this.bidx);
	if (this.bidx<0) {
	this.bidx=bidx;
	}
};

SB3Flow.prototype.onContinue=function(engine) {
	engine.trace('Flow:onContinue',this.bidx);

	var current=this.current;
	var branch=null;		
	var branches=this.current.children('branch');
	var fkey=SBKey.getKey(current.attr('type'),current.attr('id'));

	if (this.bidx>=0 && this.bidx<branches.length) {
		branch=branches.eq(this.bidx);
	}
	
	var k=null;
	if (branch!=null) {
		engine.trace('','next flow selected '+k,3);
		if (fkey.type=='qgroup') {
			var qkey=SBKey.getKey(this.fdata.attr('type'),this.fdata.attr('id'));
			var qbankobj=engine.getObj(qkey);
			var passed=false;
			if (DataUtil.isTrue($(branch).attr('correct'))) {
				passed=true;
			}
			engine.trace('Flow: setting question result',fkey,passed);
			qbankobj.sbqset('submitQuestionResult',passed);
		}

		var next=$(branch).children('flow').eq(0);
		if (next.length==0) {
			var o=this.fctxcue.pop();
			while (o!=null) {
				if (o.attr('type')=='qbank') {
					k=SBKey.getKey(o.attr('type'),o.attr('id'));
					var qbankobj=engine.getObj(k);
					if (qbankobj.sbqset('hasNext')) {
						break;
					}
				}
				o=this.fctxcue.pop();
			}
			if (o==null) {
				engine.trace('Flow:END');
				return;
			}else {
				this.fdata=o;
				next=o;
			}
		}
		k=SBKey.getKey(next.attr('type'),next.attr('id'));
		var fk=SBKey.getKey(next.attr('flowtype'),next.attr('flowid'));
		if (fk!=null && fk.type=='2') {
			next=this.nodemap[fk.id];
			engine.trace('','Flow: jump detected'+fk);
			if (k==null) k=SBKey.getKey(next.attr('type'),next.attr('id'));
		}
		if (k!=null && k.type=='qbank') {
			logIt('Flow: processing Q set',k);
			var qbank=this.sharedflows[k];
			this.fctxcue.push(qbank);
			var qbankobj=engine.getObj(k);
			//qset may be missing, a dead flow node
			if (qbankobj!=null) {
			if (qbank!=this.fdata) {
				this.fdata=qbank;
				engine.trace('Flow:start Q',qbank);
				qbankobj.sbqset('start');
			}

			var i=qbankobj.sbqset('nextQuestion');
			engine.trace('Flow: nextQuestion',i);
			if (i!=null) {
				var br=qbank.children('branch').eq(i-1);
				next=br.children('flow').eq(0);
			}else {
				engine.trace('Flow:END, unexpected q idx',i);
				return;
			}
			}
		}
		
		k=SBKey.getKey(next.attr('type'),next.attr('id'));
		//if (k!=null) {
		//	engine.requestNativeAction(this.key,[new EvalExpr(k,'resetRT',[])]);
		//	engine.requestNativeAction(this.key,[new EvalExpr(k,'show',[])]);
		//}
		this.current=next;
	}

	var fsetting=this.current.children('flowsetting').eq(0);
	engine.trace('Flow: new display [key,setting]',[k,fsetting]);
	if (DataUtil.isTrue(fsetting.attr('hideprev'))) {
		engine.requestNativeAction(this.key,[new EvalExpr(fkey,'hide',[])]);
	}
	if (k!=null) { //after hide  is done so that immediate corrective feedback won't be hiding question after it is shown
		engine.requestNativeAction(this.key,[new EvalExpr(k,'resetRT',[])]);
		engine.requestNativeAction(this.key,[new EvalExpr(k,'show',[])]);
	}
	var smode=fsetting.attr('submitmode');
	
	try {
	if (k!=null && k.type!='page' && k.type!='masterpage') { 
		this.cobj={};
		this.cobj[k]='_PASS';
		if (smode=='0') {
			var obj=engine.getObj(k);
			var subkeys=obj.sbsubset('getSubKeys');
			for (var i=0;i<subkeys.length;i++) {
				if (subkeys[i].type=='button') {
					this.cobj[subkeys[i]]='onClick';	
					if (DataUtil.isTrue(fsetting.attr('showwhenshown'))) {
						engine.requestNativeAction(this.key,[new EvalExpr(subkeys[i],'show',[])]);
					}			
					break;
				}
			}
		}else if (smode=='4') {
			var ts=fsetting.children('trigger');
			var b=false;
			$.each(ts,$.proxy(function(idx,o) {
				var obj=$(o);
				var tk=SBKey.getKey(obj.attr('type'),obj.attr('id'));
				if (engine.getObj(tk)!=null) { //may not exist
					this.cobj[tk]=obj.attr('eventname');
					if (DataUtil.isTrue(fsetting.attr('showwhenshown'))) {
							engine.requestNativeAction(this.key,[new EvalExpr(tk,'show',[])]);
					}
					b=true;
					//this.cobj[tk]=obj.attr('eventname');
				};
			},this));
			if (b==false) {
				var obj=engine.getObj(k);
				var subkeys=obj.sbsubset('getSubKeys');
				for (var i=0;i<subkeys.length;i++) {
					if (subkeys[i].type=='button') {
						this.cobj[subkeys[i]]='onClick';				
						if (DataUtil.isTrue(fsetting.attr('showwhenshown'))) {
							engine.requestNativeAction(this.key,[new EvalExpr(subkeys[i],'show',[])]);
						}
						break;
					}
				}	
			}
		}else if (smode=='3') {
				
		}else if (smode=='2') {
			var obj=engine.getObj(k);
			var subkeys=obj.sbsubset('getSubKeys');
			for (var i=0;i<subkeys.length;i++) {
				this.cobj[subkeys[i]]='onValueChange';				
			}			
		}else if (smode=='1') {
			var t=DataUtil.getInt(fsetting.attr('duration'))*1000;
			var obj=engine.getObj(k);
			setTimeout(function() {
				engine.trace('flow timeout continue',obj);
				obj.sbsubset('fireEvent','_PASS');
			},t);
		}else {
			logIt('unknown flow submit mode',this.current);
		}	
	}
	}catch (e) {
		engine.trace('Flow: error (ignored) ',e);
	}
	engine.trace('Flow: listening',this.cobj);
	this.pending=false;
};



/**
 * SBEngineBridge
 */
SBBridge=function() {
};
SBBridge.prototype.addEngine=function(engine) {
};
SBBridge.prototype.removeEngine=function(engine) {
};
SBBridge.prototype.onEvent=function(engine,source,eventname, opts) {
	return true;
};

SB3Bridge=function(lodiv) {
	this.engines=[];
	this.flows={};
	this.lodiv=lodiv;
};
SB3Bridge.prototype.addEngine=function(engine) {
	engine.evtlisteners.push(this);
	if (this.engines.length>0) {
		this.engines[1]=engine;
		this.engines[0].getObj('pagenav:pagenav_mc').sbpagenav('option','idx',engine.id);
	}else {
		this.engines.push(engine);
	}

	if (this.flows[engine.id]==null) {
	var factory=$(this.lodiv).data('factory');
	var adata=factory.data.children[engine.id].attrtable['pageaction'];
	//var xmlDoc = $.parseXML(adata);
    var xmlobj =  adata;
	var proot=$(xmlobj).children('pageaction').eq(0);
	this.flows[engine.id]=new SB3Flow(proot,factory);
	}
};
SB3Bridge.prototype.onStart=function(engine) {
};
SB3Bridge.prototype.onStartComplete=function(engine) {
	if (engine.id==-1) {
		var mpage=$(this.lodiv).children('div .page:first');
		var page=$(this.lodiv).children('div .page').eq(1);
		mpage.sbpage('onReady');
		page.sbpage('onReady');
		$("div.ui-draggable").addTouch();
		mpage.sbpage('setStageVisible',true);
		page.sbpage('setStageVisible',true);
		this.flows[this.engines[0].id].onEvent(this.engines[0],SBKey.getKey('page',''),'start');
		this.flows[this.engines[1].id].onEvent(this.engines[1],SBKey.getKey('page',''),'start');
	}
};

SB3Bridge.prototype.removeEngine=function(engine) {
	for(var i=0; i<this.engines.length; i++) {
        if(this.engines[i] == engine) {
        	delete this.flows[engine.id];
        	delete this.engines[1];
        	this.engines.splice(i, 1);
            break;
        }
	}
};

SB3Bridge.prototype.onEvent=function(engine,srcobj,eventname, opts) {
	var ok=true;
	var sourcekey=null;
	if (typeof(srcobj)=='string') {
		sourcekey=SBKey.parseString(srcobj);
	}else if(srcobj instanceof SBKey) {
		sourcekey=srcobj;
	}else if (srcobj!=null){
		sourcekey=SBKey.getKey(srcobj.options['t'],srcobj.options['id']);
	}

	
	if (sourcekey!=null && sourcekey.id!=null && sourcekey.type !=null) {
		var onenavkey=SBKey.getKey('pagenav','pagenav_mc');
		var onenav=engine.getObj('pagenav:pagenav_mc');
		if (sourcekey.type=='page' && eventname=='onPageLoad') {
				if (this.engines[1].id==engine.id) {
				if (this.firstload==false) {
					this.engines[0].onEvent(onenavkey,'onPageChange');
				}else {
					this.firstload=false;
					this.engines[0].onEvent(onenavkey,'onPageLoad');
				}
				onenav.sbpagenav('fireEvent','onPageLoad');
				}
				ok=false;
		}else if (sourcekey.type.indexOf('pagenav')==0) {
			if (eventname=='onFireGotoPage') {
				this.loadPage(DataUtil.getInt(opts[0]),false);
				ok=false;
			}else if (eventname=='onFireReloadPage') {
				this.loadPage(DataUtil.getInt(this.engines[1].id),true);
				ok=false;
			}else if (eventname=='onFireGlobalEvent') {
				onenav.sbpagenav('setGlobalEvent',opts[0]);
				$.each(this.engines,function(idx,sub) {
					var thisnav=sub.getObj(onenavkey);
						//thisnav.sbpagenav('setGlobalEvent',opts[0]);
					thisnav.sbpagenav('fireEvent','onGlobalEvent');
				});
				ok=false;
			}
		}else {
			this.flows[engine.id].onEvent(engine,sourcekey,eventname, opts);
		}
	}
	return ok;
};
SB3Bridge.prototype.loadPage=function(idx,forcerefresh) {
	if (idx<=0) return;
	var factory=$(this.lodiv).data('factory');
	if (idx > factory.data.children.length-1) return;
	if (this.engines[1].id==idx && !forcerefresh) return;
    $.blockUI({ message: '<h1><img src="img/busy.png" /></h1>' }); 
    
    var thatobj=this;
    var d=$.Deferred();
    setTimeout(function () {
    	thatobj.engines[1].destroy();
    	thatobj.removeEngine(thatobj.engines[1]);
    	
    	var pagediv=$(thatobj.lodiv).children('div .page')[1];
    	$(pagediv).sbpage('onDestroy');
    	$(pagediv).remove();
    	pagediv=$("<div>", {}).appendTo(thatobj.lodiv);

    	var pagedata=factory.data.children[idx];
    	var pengine=factory.engine.createEngine(idx);
		var pctx=new ObjContext(factory.engine.objctx);
		pengine.setObjContext(pctx);
    	factory.createObject(pagedata,pagediv,true,pengine);
    	var nav=pengine.getObj('pagenavdelegate:pagenavdelegate_mc');
    	pengine.addObj('pagenav:pagenav_mc',nav);
    	$(pagediv).sbpage('onReady');
		$("div.ui-draggable",pagediv).addTouch();
    	d.resolve();
    	pengine.start();
    	$(pagediv).sbpage('setStageVisible',true);
		thatobj.flows[pengine.id].onEvent(pengine,SBKey.getKey('page',''),'start');
    },100);
    
    $.when(d).then(function(e) {
    	$.unblockUI();	
    });
    return;
};


//SBEngineA
SBEngineA = function(id, tick, headfn, tailfn) {
	if (id==undefined) id='';
	this.id = id;
	this.timer = -1;
	this.tick = DataUtil.parseNumber(tick);
	this.tick <= 0 ? 50 : this.tick;
	this.headfn = headfn;
	this.tailfn = tailfn;
	this.debug=sbconfig._debug_engine;
	this.idlecount = 0;
	this.idlethresh = 20;
	this.burstload=10;
	this.debuglevel=1;
	this.status=SBEngineA.STATUS_IDLE;
	this.workcue = [];
	this.evtmap={};
	this.engines=[];
	this.evtcue=[];
	this.objctx=new ObjContext();
	this.inst=new ExprInstructor(this,true);
	this.bridge=undefined;
	this.evtlisteners=[];
	// this.workcuectx=[];
};
SBEngineA.STATUS_RUN='run';
SBEngineA.STATUS_SLEEP='sleep';
SBEngineA.STATUS_DEAD='dead';
SBEngineA.STATUS_IDLE='idle';
SBEngineA.STATUS_BUSY='busy';
SBEngineA.EVENT_NATIVE='__native';
SBEngineA.prototype.setObjContext = function(ctx) {
	this.objctx=ctx;
};
SBEngineA.prototype.getObj = function(o) {
	if (this.objctx==undefined) return null;
	return this.objctx.lookup(o);
};
SBEngineA.prototype.addObj = function(key,o) {
	if (this.objctx==undefined) return null;
	this.objctx.addObj(key,o);
};
SBEngineA.prototype.trace = function(msg,s,lvl) {
	if (this.debug) {
		if (lvl==undefined) lvl=1;
		if (this.debuglevel>=lvl) {
			logIt('engine '+this.id,msg,s);
		}
	}
};
SBEngineA.prototype.start = function() {
	this.trace('','start called',3);
	var oldstatus=this.status;
	if (oldstatus==SBEngineA.STATUS_DEAD || oldstatus==SBEngineA.STATUS_BUSY) return;
	this.status=SBEngineA.STATUS_RUN;
	this.idlecount = 0;
	if (this.timer >= 0)
		return;
	if (this.bridge!=null) this.bridge.onStart(this);
	var thatobj = this;
	this.timer = setInterval(function() {
		thatobj._work();
	}, this.tick);
	
	$.each(this.engines, function(index, sub) { 
		if (oldstatus==SBEngineA.STATUS_IDLE) sub.start();
	});
	if (this.bridge!=null) this.bridge.onStartComplete(this);
};
SBEngineA.prototype.stop = function(r) {
	if (r==undefined || r==true) {
	$.each(this.engines, function(index, sub) { 
		sub.stop(true);
	});
	}
	//this.status=SBEngineA.STATUS_IDLE;
	this.status=SBEngineA.STATUS_SLEEP;
	this.trace('goes into sleep (stop)');
	if (this.timer == -1)
		return;
	clearInterval(this.timer);
	this.timer = -1;
};
SBEngineA.prototype.destroy = function() {
	this.stop();
	this.status=SBEngineA.STATUS_DEAD;
	this.timer = undefined;
	this.tick = undefined;
	this.headfn = undefined;
	this.tailfn = undefined;
	this.evtmap=undefined;
	this.engines=undefined;
	this.inst=undefined;
};
SBEngineA.prototype._work = function() {
	if (this.status==SBEngineA.STATUS_DEAD) {
		this.trace('','is dead, ignoring _work tick',3);
		return;
	}
	if (this.status==SBEngineA.STATUS_BUSY) {
		this.trace('','is busy',3);
		return;
	}

	if (this.headfn != undefined)
		this.headfn();
	if (this.evtcue.length>0 && this.workcue.length==0) {
		var evt=this.evtcue.shift();
		var ok=true;
		for (var i=0;i<this.evtlisteners.length;i++) {
			if (this.evtlisteners[i]==undefined) continue;
			ok=this.evtlisteners[i].onEvent(this,evt[0],evt[1],evt[2]);
			if (ok==false) break;
		}
		var objevt=this.evtmap[evt[0]];
		if (ObjContext.isWidget(evt[0])) {
			var source=SBKey.formString(evt[0].options['t'],evt[0].options['id']);
			objevt=this.evtmap[source];
		}

		if (this.debug) this.trace('processing event (objevt,evt,bridge)',[objevt,evt,ok],2);
		if (ok && objevt!=null) {
			var workload=objevt[evt[1]];
			if (workload!=null) {
				if (this.debug) this.trace('processing registered event ',evt);
				for (var i=0;i<workload.length;i++) {
					this.workcue.push(workload[i]);
				}
				if (evt[1].indexOf(SBEngineA.EVENT_NATIVE)==0) {
					objevt[evt[1]]=undefined;
				}
			}
		}
	}
	if (this.evtcue.length==0 && this.workcue.length == 0) {
		this.idlecount++;
		if (this.idlecount == this.idlethresh) {
			this.stop(false); 
			// sleep, not forcing subs to sleep
		}
	} else {
		var burst=this.burstload;
		while (this.workcue.length > 0 && burst>0 && this.status!=SBEngineA.STATUS_BUSY) {
			burst--;
			this.idlecount = 0;
			this._processCue(this.workcue.shift());
		}
	}
	if (this.tailfn != undefined)
		this.tailfn();
};
SBEngineA.prototype._processCue = function(expr) {
	this.status=SBEngineA.STATUS_BUSY;	
	var engineobj=this;
	var d = $.Deferred();
	try {
		var chain=this.inst.parseExpr(expr, d);
		chain.pipe(function(e) {
			engineobj._processCueCallback(e);
			return e;
		});
		d.resolve();
	}catch (e) {
		throw e;
	}
};
SBEngineA.prototype._processCueCallback = function(d) {
	this.status=SBEngineA.STATUS_RUN;
};
SBEngineA.prototype.onEvent = function(source,eventname, opts) {
	this.evtcue.push([source,eventname,opts]);
	if (this.status==SBEngineA.STATUS_SLEEP) this.start();
	if (this.debug) {
		this.trace('SBEngineA.onEvent',[this.id,source,eventname,opts],3);
	}
};
SBEngineA.prototype.registerAction = function(triggers,exprlist) {
	for (var i=0;i<triggers.length;i++) {
		var subevtmap=this.evtmap[triggers[i].src];
		if (subevtmap==undefined) {
			subevtmap={};
			this.evtmap[triggers[i].src]=subevtmap;
		}
		var loadlist=subevtmap[triggers[i].eventname];
		if (loadlist==undefined) {
			loadlist=[];
			subevtmap[triggers[i].eventname]=loadlist;
		}
		if ($.isArray(exprlist)) {
			for (var j=0;j<exprlist.length;j++) {						
				loadlist.push(exprlist[j]);
			}
		}else {
			loadlist.push(exprlist);
		}
	}
};
SBEngineA.prototype.createEngine = function(id) {
	var newengine=new SBEngineA(id,this.tick*1.1);
	this.engines.push(newengine);
	if (this.bridge!=undefined) this.bridge.addEngine(newengine);
	return newengine;
};
SBEngineA.prototype.removeEngine = function(id) {
	var newengines=[];
	$.each(this.engines, function(index, sub) {
		if (sub.id==id) {
			sub.stop();
			if (this.bridge!=undefined) this.bridge.removeEngine(sub);
		}else {
			newengines.push(sub);
		}
	});
	this.engines=newengines;
};
SBEngineA.prototype.registerDragObj=function(fromkey,key,dragoptions) {
	
};
SBEngineA.prototype.unregisterDragObj=function(fromkey,key,dragoptions) {
	
};
SBEngineA.prototype.registerDropObj=function(fromkey,key,dropoptions) {
	
};
SBEngineA.prototype.unregisterDropObj=function(fromkey,key,dropoptions) {
	
};
SBEngineA.prototype.requestNativeAction=function(fromkey,exprlist) {
	var ttag =SBEngineA.EVENT_NATIVE+ new Date().getTime();
	if (this.debug) this.trace('adding native action request (from,tag) ',[fromkey,ttag],1);
	this.registerAction([new TriggerExpr(fromkey, ttag)],exprlist);
	this.onEvent(fromkey,ttag);
	return ttag;
};

