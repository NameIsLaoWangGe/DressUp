function XMLReader(){}function parse(e,t,r,a,n){function c(e){var t=e.slice(1,-1);return t in r?r[t]:"#"===t.charAt(0)?function(e){if(e>65535){var t=55296+((e-=65536)>>10),r=56320+(1023&e);return String.fromCharCode(t,r)}return String.fromCharCode(e)}(parseInt(t.substr(1).replace("x","0x"))):(n.error("entity not found:"+e),e)}function i(t){if(t>d){var r=e.substring(d,t).replace(/&#?\w+;/g,c);_&&o(d),a.characters(r,0,t-d),d=t}}function o(t,r){for(;t>=u&&(r=l.exec(e));)s=r.index,u=s+r[0].length,_.lineNumber++;_.columnNumber=t-s+1}for(var s=0,u=0,l=/.*(?:\r\n?|\n)|.*$/g,_=a.locator,m=[{currentNSMap:t}],f={},d=0;;){try{var p=e.indexOf("<",d);if(0>p){if(!e.substr(d).match(/^\s*$/)){var T=a.doc,S=T.createTextNode(e.substr(d));T.appendChild(S),a.currentElement=S}return}switch(p>d&&i(p),e.charAt(p+1)){case"/":var h=e.indexOf(">",p+3),A=e.substring(p+2,h),g=m.pop();0>h?(A=e.substring(p+2).replace(/[\s<].*/,""),n.error("end tag name: "+A+" is not complete:"+g.tagName),h=p+1+A.length):A.match(/\s</)&&(A=A.replace(/[\s<].*/,""),n.error("end tag name: "+A+" maybe not complete"),h=p+1+A.length);var w=g.localNSMap,E=g.tagName==A;if(E||g.tagName&&g.tagName.toLowerCase()==A.toLowerCase()){if(a.endElement(g.uri,g.localName,A),w)for(var N in w)a.endPrefixMapping(N);E||n.fatalError("end tag name: "+A+" is not match the current start tagName:"+g.tagName)}else m.push(g);h++;break;case"?":_&&o(p),h=parseInstruction(e,p,a);break;case"!":_&&o(p),h=parseDCC(e,p,a,n);break;default:_&&o(p);var b=new ElementAttributes,x=m[m.length-1].currentNSMap,C=(h=parseElementStartPart(e,p,b,x,c,n),b.length);if(!b.closed&&fixSelfClosed(e,h,b.tagName,f)&&(b.closed=!0,r.nbsp||n.warning("unclosed xml attribute")),_&&C){for(var v=copyLocator(_,{}),R=0;C>R;R++){var O=b[R];o(O.offset),O.locator=copyLocator(_,{})}a.locator=v,appendElement(b,a,x)&&m.push(b),a.locator=_}else appendElement(b,a,x)&&m.push(b);"http://www.w3.org/1999/xhtml"!==b.uri||b.closed?h++:h=parseHtmlSpecialContent(e,h,b.tagName,c,a)}}catch(e){n.error("element parse error: "+e),h=-1}h>d?d=h:i(Math.max(p,d)+1)}}function copyLocator(e,t){return t.lineNumber=e.lineNumber,t.columnNumber=e.columnNumber,t}function parseElementStartPart(e,t,r,a,n,s){for(var c,i=++t,o=S_TAG;;){var u=e.charAt(i);switch(u){case"=":if(o===S_ATTR)c=e.slice(t,i),o=S_EQ;else{if(o!==S_ATTR_SPACE)throw new Error("attribute equal must after attrName");o=S_EQ}break;case"'":case'"':if(o===S_EQ||o===S_ATTR){if(o===S_ATTR&&(s.warning('attribute value must after "="'),c=e.slice(t,i)),t=i+1,!((i=e.indexOf(u,t))>0))throw new Error("attribute value no end '"+u+"' match");l=e.slice(t,i).replace(/&#?\w+;/g,n),r.add(c,l,t-1),o=S_ATTR_END}else{if(o!=S_ATTR_NOQUOT_VALUE)throw new Error('attribute value must after "="');l=e.slice(t,i).replace(/&#?\w+;/g,n),r.add(c,l,t),s.warning('attribute "'+c+'" missed start quot('+u+")!!"),t=i+1,o=S_ATTR_END}break;case"/":switch(o){case S_TAG:r.setTagName(e.slice(t,i));case S_ATTR_END:case S_TAG_SPACE:case S_TAG_CLOSE:o=S_TAG_CLOSE,r.closed=!0;case S_ATTR_NOQUOT_VALUE:case S_ATTR:case S_ATTR_SPACE:break;default:throw new Error("attribute invalid close char('/')")}break;case"":return s.error("unexpected end of input"),o==S_TAG&&r.setTagName(e.slice(t,i)),i;case">":switch(o){case S_TAG:r.setTagName(e.slice(t,i));case S_ATTR_END:case S_TAG_SPACE:case S_TAG_CLOSE:break;case S_ATTR_NOQUOT_VALUE:case S_ATTR:"/"===(l=e.slice(t,i)).slice(-1)&&(r.closed=!0,l=l.slice(0,-1));case S_ATTR_SPACE:o===S_ATTR_SPACE&&(l=c),o==S_ATTR_NOQUOT_VALUE?(s.warning('attribute "'+l+'" missed quot(")!!'),r.add(c,l.replace(/&#?\w+;/g,n),t)):("http://www.w3.org/1999/xhtml"===a[""]&&l.match(/^(?:disabled|checked|selected)$/i)||s.warning('attribute "'+l+'" missed value!! "'+l+'" instead!!'),r.add(l,l,t));break;case S_EQ:throw new Error("attribute value missed!!")}return i;case"":u=" ";default:if(" ">=u)switch(o){case S_TAG:r.setTagName(e.slice(t,i)),o=S_TAG_SPACE;break;case S_ATTR:c=e.slice(t,i),o=S_ATTR_SPACE;break;case S_ATTR_NOQUOT_VALUE:var l=e.slice(t,i).replace(/&#?\w+;/g,n);s.warning('attribute "'+l+'" missed quot(")!!'),r.add(c,l,t);case S_ATTR_END:o=S_TAG_SPACE}else switch(o){case S_ATTR_SPACE:r.tagName,"http://www.w3.org/1999/xhtml"===a[""]&&c.match(/^(?:disabled|checked|selected)$/i)||s.warning('attribute "'+c+'" missed value!! "'+c+'" instead2!!'),r.add(c,c,t),t=i,o=S_ATTR;break;case S_ATTR_END:s.warning('attribute space is required"'+c+'"!!');case S_TAG_SPACE:o=S_ATTR,t=i;break;case S_EQ:o=S_ATTR_NOQUOT_VALUE,t=i;break;case S_TAG_CLOSE:throw new Error("elements closed character '/' and '>' must be connected to")}}i++}}function appendElement(e,t,r){for(var a=e.tagName,n=null,s=e.length;s--;){var c=e[s],i=c.qName,o=c.value;if((m=i.indexOf(":"))>0)var u=c.prefix=i.slice(0,m),l=i.slice(m+1),_="xmlns"===u&&l;else l=i,u=null,_="xmlns"===i&&"";c.localName=l,!1!==_&&(null==n&&(n={},_copy(r,r={})),r[_]=n[_]=o,c.uri="http://www.w3.org/2000/xmlns/",t.startPrefixMapping(_,o))}for(s=e.length;s--;){(u=(c=e[s]).prefix)&&("xml"===u&&(c.uri="http://www.w3.org/XML/1998/namespace"),"xmlns"!==u&&(c.uri=r[u||""]))}var m;(m=a.indexOf(":"))>0?(u=e.prefix=a.slice(0,m),l=e.localName=a.slice(m+1)):(u=null,l=e.localName=a);var f=e.uri=r[u||""];if(t.startElement(f,l,a,e),!e.closed)return e.currentNSMap=r,e.localNSMap=n,!0;if(t.endElement(f,l,a),n)for(u in n)t.endPrefixMapping(u)}function parseHtmlSpecialContent(e,t,r,a,n){if(/^(?:script|textarea)$/i.test(r)){var s=e.indexOf("</"+r+">",t),c=e.substring(t+1,s);if(/[&<]/.test(c))return/^script$/i.test(r)?(n.characters(c,0,c.length),s):(c=c.replace(/&#?\w+;/g,a),n.characters(c,0,c.length),s)}return t+1}function fixSelfClosed(e,t,r,a){var n=a[r];return null==n&&(t>(n=e.lastIndexOf("</"+r+">"))&&(n=e.lastIndexOf("</"+r)),a[r]=n),t>n}function _copy(e,t){for(var r in e)t[r]=e[r]}function parseDCC(e,t,r,a){switch(e.charAt(t+2)){case"-":return"-"===e.charAt(t+3)?(n=e.indexOf("--\x3e",t+4))>t?(r.comment(e,t+4,n-t-4),n+3):(a.error("Unclosed comment"),-1):-1;default:if("CDATA["==e.substr(t+3,6)){var n=e.indexOf("]]>",t+9);return r.startCDATA(),r.characters(e,t+9,n-t-9),r.endCDATA(),n+3}var s=split(e,t),c=s.length;if(c>1&&/!doctype/i.test(s[0][0])){var i=s[1][0],o=c>3&&/^public$/i.test(s[2][0])&&s[3][0],u=c>4&&s[4][0],l=s[c-1];return r.startDTD(i,o&&o.replace(/^(['"])(.*?)\1$/,"$2"),u&&u.replace(/^(['"])(.*?)\1$/,"$2")),r.endDTD(),l.index+l[0].length}}return-1}function parseInstruction(e,t,r){var a=e.indexOf("?>",t);if(a){var n=e.substring(t,a).match(/^<\?(\S*)\s*([\s\S]*?)\s*$/);return n?(n[0].length,r.processingInstruction(n[1],n[2]),a+2):-1}return-1}function ElementAttributes(){}function _set_proto_(e,t){return e.__proto__=t,e}function split(e,t){var r,a=[],n=/'[^']+'|"[^"]+"|[^\s<>\/=]+=?|(\/?\s*>|<)/g;for(n.lastIndex=t,n.exec(e);r=n.exec(e);)if(a.push(r),r[1])return a}var nameStartChar=/[A-Z_a-z\xC0-\xD6\xD8-\xF6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/,nameChar=new RegExp("[\\-\\.0-9"+nameStartChar.source.slice(1,-1)+"\\u00B7\\u0300-\\u036F\\u203F-\\u2040]"),tagNamePattern=new RegExp("^"+nameStartChar.source+nameChar.source+"*(?::"+nameStartChar.source+nameChar.source+"*)?$"),S_TAG=0,S_ATTR=1,S_ATTR_SPACE=2,S_EQ=3,S_ATTR_NOQUOT_VALUE=4,S_ATTR_END=5,S_TAG_SPACE=6,S_TAG_CLOSE=7;XMLReader.prototype={parse:function(e,t,r){var a=this.domBuilder;a.startDocument(),_copy(t,t={}),parse(e,t,r,a,this.errorHandler),a.endDocument()}},ElementAttributes.prototype={setTagName:function(e){if(!tagNamePattern.test(e))throw new Error("invalid tagName:"+e);this.tagName=e},add:function(e,t,r){if(!tagNamePattern.test(e))throw new Error("invalid attribute:"+e);this[this.length++]={qName:e,value:t,offset:r}},length:0,getLocalName:function(e){return this[e].localName},getLocator:function(e){return this[e].locator},getQName:function(e){return this[e].qName},getURI:function(e){return this[e].uri},getValue:function(e){return this[e].value}},_set_proto_({},_set_proto_.prototype)instanceof _set_proto_||(_set_proto_=function(e,t){function r(){}for(t in r.prototype=t,r=new r,e)r[t]=e[t];return r}),exports.XMLReader=XMLReader;