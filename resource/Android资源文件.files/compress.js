if(typeof(Control)=='undefined')
Control={};
Control.TextArea=Class.create();
Object.extend(Control.TextArea.prototype,{
onChangeTimeoutLength:500,
element:false,
onChangeTimeout:false,
initialize:function(textarea){
this.element=$(textarea);
$(this.element).observe('keyup',this.doOnChange.bindAsEventListener(this));
$(this.element).observe('paste',this.doOnChange.bindAsEventListener(this));
$(this.element).observe('input',this.doOnChange.bindAsEventListener(this));
},
doOnChange:function(event){
if(this.onChangeTimeout)
window.clearTimeout(this.onChangeTimeout);
this.onChangeTimeout=window.setTimeout(function(){
if(this.notify)
this.notify('change',this.getValue());
}.bind(this),this.onChangeTimeoutLength);
},
getValue:function(){
return this.element.value;
},
getSelection:function(){
if(!!document.selection)
return document.selection.createRange().text;
else if(!!this.element.setSelectionRange)
return this.element.value.substring(this.element.selectionStart,this.element.selectionEnd);
else
return false;
},
replaceSelection:function(text){
var scrollTop=this.element.scrollTop;
if(!!document.selection){
this.element.focus();
var old=document.selection.createRange().text;
var range=document.selection.createRange();
range.text=text;
range-=old.length-text.length;
}else if(!!this.element.setSelectionRange){
var selection_start=this.element.selectionStart;
this.element.value=this.element.value.substring(0,selection_start)+text+this.element.value.substring(this.element.selectionEnd);
this.element.setSelectionRange(selection_start+text.length,selection_start+text.length);
}
this.doOnChange();
this.element.focus();
this.element.scrollTop=scrollTop;
},
wrapSelection:function(before,after){
this.replaceSelection(before+this.getSelection()+after);
},
insertBeforeSelection:function(text){
this.replaceSelection(text+this.getSelection());
},
insertAfterSelection:function(text){
this.replaceSelection(this.getSelection()+text);
},
injectEachSelectedLine:function(callback,before,after){
this.replaceSelection((before||'')+$A(this.getSelection().split("\n")).inject([],callback).join("\n")+(after||''));
},
insertBeforeEachSelectedLine:function(text,before,after){
this.injectEachSelectedLine(function(lines,line){
lines.push(text+line);
return lines;
},before,after);
}
});
if(typeof(Object.Event)!='undefined')
Object.Event.extend(Control.TextArea);Control.TextArea.BBCode=Class.create();
Object.extend(Control.TextArea.BBCode.prototype,{
textarea:false,
tooltip:false,
toolbar:false,
emotions:false,
wrapper:false,
controllers:false,
initialize:function(textarea){
this.textarea=new Control.TextArea(textarea);
this._initLayout();
this._initEmotions();
this._initToolbar();
},
hide:function(){
this.wrapper.parentNode.appendChild(this.textarea.element.remove());
this.wrapper.hide();
},
show:function(){
this.controllers.appendChild(this.textarea.element.remove());
this.wrapper.show();
},
_initLayout:function(){
this.wrapper=$(document.createElement('div'));
this.wrapper.id="editor_wrapper";
this.wrapper.className="clearfix";
this.textarea.element.parentNode.insertBefore(this.wrapper,this.textarea.element);
this.emotions=$(document.createElement('div'));
this.emotions.id="bbcode_emotions";
this.emotions.innerHTML="<h5>表情图标</h5>";
this.wrapper.appendChild(this.emotions);
this.controllers=$(document.createElement('div'));
this.controllers.id="bbcode_controllers";
this.wrapper.appendChild(this.controllers);
this.toolbar=$(document.createElement('div'));
this.toolbar.id="bbcode_toolbar";
this.controllers.appendChild(this.toolbar);
this.tooltip=$(document.createElement('div'));
this.tooltip.id="bbcode_tooltip";
this.tooltip.innerHTML="提示：选择您需要装饰的文字, 按上列按钮即可添加上相应的标签";
this.controllers.appendChild(this.tooltip);
this.controllers.appendChild(this.textarea.element.remove());
},
_initEmotions:function(){
this._addEmotion("biggrin",function(){this.insertAfterSelection(" :D ");});
this._addEmotion("smile",function(){this.insertAfterSelection(" :) ");});
this._addEmotion("sad",function(){this.insertAfterSelection(" :( ");});
this._addEmotion("surprised",function(){this.insertAfterSelection(" :o ");});
this._addEmotion("eek",function(){this.insertAfterSelection(" :shock: ");});
this._addEmotion("confused",function(){this.insertAfterSelection(" :? ");});
this._addEmotion("cool",function(){this.insertAfterSelection(" 8) ");});
this._addEmotion("lol",function(){this.insertAfterSelection(" :lol: ");});
this._addEmotion("mad",function(){this.insertAfterSelection(" :x ");});
this._addEmotion("razz",function(){this.insertAfterSelection(" :P ");});
this._addEmotion("redface",function(){this.insertAfterSelection(" :oops: ");});
this._addEmotion("cry",function(){this.insertAfterSelection(" :cry: ");});
this._addEmotion("evil",function(){this.insertAfterSelection(" :evil: ");});
this._addEmotion("twisted",function(){this.insertAfterSelection(" :twisted: ");});
this._addEmotion("rolleyes",function(){this.insertAfterSelection(" :roll: ");});
this._addEmotion("wink",function(){this.insertAfterSelection(" :wink: ");});
this._addEmotion("exclaim",function(){this.insertAfterSelection(" :!: ");});
this._addEmotion("question",function(){this.insertAfterSelection(" :?: ");});
this._addEmotion("idea",function(){this.insertAfterSelection(" :idea: ");});
this._addEmotion("arrow",function(){this.insertAfterSelection(" :arrow: ");});
},
_addEmotion:function(icon,callback){
var img=$(document.createElement('img'));
img.src="http://www.javaeye.com/images/smiles/icon_"+icon+".gif";
img.observe('click',callback.bindAsEventListener(this.textarea));
this.emotions.appendChild(img);
},
_initToolbar:function(){
this._addButton("B",function(){this.wrapSelection('[b]','[/b]');},function(){this.innerHTML='粗体: [b]文字[/b] (alt+b)';},{id:'button_bold'});
this._addButton("I",function(){this.wrapSelection('[i]','[/i]');},function(){this.innerHTML='斜体: [i]文字[/i] (alt+i)';},{id:'button_italic'});
this._addButton("U",function(){this.wrapSelection('[u]','[/u]');},function(){this.innerHTML='下划线: [u]文字[/u] (alt+u)';},{id:'button_underline'});
this._addButton("Quote",function(){this.wrapSelection('[quote]','[/quote]');},function(){this.innerHTML='引用文字: [quote]文字[/quote] 或者 [quote="javaeye"]文字[/quote]  (alt+q)';});
this._addButton("Code",function(){this.wrapSelection('[code="java"]','[/code]');},function(){this.innerHTML='代码: [code="ruby"]...[/code] (支持java, ruby, js, xml, html, php, python, c, c++, c#, sql)';});
this._addButton("List",function(){this.insertBeforeEachSelectedLine('[*]','[list]\n','\n[/list]')},function(){this.innerHTML='列表: [list] [*]文字 [*]文字 [/list] 或者 顺序列表: [list=1] [*]文字 [*]文字 [/list]';});
this._addButton("Img",function(){this.wrapSelection('[img]','[/img]');},function(){this.innerHTML='插入图像: [img]http://image_url[/img]  (alt+p)';});
this._addButton("URL",function(){this.wrapSelection('[url]','[/url]');},function(){this.innerHTML='插入URL: [url]http://url[/url] 或 [url=http://url]URL文字[/url]  (alt+w)';});
this._addButton("Flash",function(){this.wrapSelection('[flash=200,200]','[/flash]');},function(){this.innerHTML='插入Flash: [flash=宽,高]http://your_flash.swf[/flash]';});
this._addButton("Table",function(){this.injectEachSelectedLine(function(lines,line){lines.push("|"+line+"|");return lines;},'[table]\n','\n[/table]');},function(){this.innerHTML='插入表格: [table]用换行和|来编辑格子[/table]';});
var color_select=[
"<br />字体颜色: ",
"<select id='select_color'>",
"<option value='black' style='color: black;'>标准</option>",
"<option value='darkred' style='color: darkred;'>深红</option>",
"<option value='red' style='color: red;'>红色</option>",
"<option value='orange' style='color: orange;'>橙色</option>",
"<option value='brown' style='color: brown;'>棕色</option>",
"<option value='yellow' style='color: yellow;'>黄色</option>",
"<option value='green' style='color: green;'>绿色</option>",
"<option value='olive' style='color: olive;'>橄榄</option>",
"<option value='cyan' style='color: cyan;'>青色</option>",
"<option value='blue' style='color: blue;'>蓝色</option>",
"<option value='darkblue' style='color: darkblue;'>深蓝</option>",
"<option value='indigo' style='color: indigo;'>靛蓝</option>",
"<option value='violet' style='color: violet;'>紫色</option>",
"<option value='gray' style='color: gray;'>灰色</option>",
"<option value='white' style='color: white;'>白色</option>",
"<option value='black' style='color: black;'>黑色</option>",
"</select>"
];
this.toolbar.insert(color_select.join(""));
$('select_color').observe('change',this._change_color.bindAsEventListener(this.textarea));
$('select_color').observe('mouseover',function(){$("bbcode_tooltip").innerHTML="字体颜色: [color=red]文字[/color]  提示：您可以使用 color=#FF0000";});
var font_select=[
"&nbsp;字体大小: ",
"<select id='select_font'>",
"<option value='0'>标准</option>",
"<option value='xx-small'>1 (xx-small)</option>",
"<option value='x-small'>2 (x-small)</option>",
"<option value='small'>3 (small)</option>",
"<option value='medium'>4 (medium)</option>",
"<option value='large'>5 (large)</option>",
"<option value='x-large'>6 (x-large)</option>",
"<option value='xx-large'>7 (xx-large)</option>",
"</select>"
];
this.toolbar.insert(font_select.join(""));
$('select_font').observe('change',this._change_font.bindAsEventListener(this.textarea));
$('select_font').observe('mouseover',function(){$("bbcode_tooltip").innerHTML="字体大小: [size=x-small]小字体文字[/size]";});
var align_select=[
"&nbsp;对齐: ",
"<select id='select_align'>",
"<option value='0'>标准</option>",
"<option value='left'>居左</option>",
"<option value='center'>居中</option>",
"<option value='right'>居右</option>",
"</select>"
]
this.toolbar.insert(align_select.join(""));
$('select_align').observe('change',this._change_align.bindAsEventListener(this.textarea));
$('select_align').observe('mouseover',function(){$("bbcode_tooltip").innerHTML="对齐: [align=center]文字[/align]";});
},
_addButton:function(value,callback,tooltip,attrs){
var input=$(document.createElement('input'));
input.type="button";
input.value=value;
input.observe('click',callback.bindAsEventListener(this.textarea));
input.observe('mouseover',tooltip.bindAsEventListener(this.tooltip));
Object.extend(input,attrs||{});
this.toolbar.appendChild(input);
},
_change_color:function(){
this.wrapSelection('[color='+$F('select_color')+']','[/color]');
$('select_color').selectedIndex=0;
},
_change_font:function(){
this.wrapSelection('[size='+$F('select_font')+']','[/size]');
$('select_font').selectedIndex=0;
},
_change_align:function(){
this.wrapSelection('[align='+$F('select_align')+']','[/align]');
$('select_align').selectedIndex=0;
}
});if(typeof(tinyMCE)!='undefined'){
tinyMCE.init({
plugins:"javaeye,media,table,emotions,contextmenu,fullscreen,inlinepopups",
mode:"none",
language:"zh",
theme:"advanced",
theme_advanced_buttons1:"formatselect,fontselect,fontsizeselect,separator,forecolor,backcolor,separator,bold,italic,underline,strikethrough,separator,bullist,numlist",
theme_advanced_buttons2:"undo,redo,cut,copy,paste,separator,justifyleft,justifycenter,justifyright,separator,outdent,indent,separator,link,unlink,image,media,emotions,table,separator,quote,code,separator,fullscreen",
theme_advanced_buttons3:"",
theme_advanced_toolbar_location:"top",
theme_advanced_toolbar_align:"left",
theme_advanced_fonts:"宋体=宋体;黑体=黑体;仿宋=仿宋;楷体=楷体;隶书=隶书;幼圆=幼圆;Arial=arial,helvetica,sans-serif;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Tahoma=tahoma,arial,helvetica,sans-serif;Times New Roman=times new roman,times;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings,zapf dingbats",
convert_fonts_to_spans:true,
remove_trailing_nbsp:true,
remove_linebreaks:false,
width:"100%",
extended_valid_elements:"pre[name|class],object[classid|codebase|width|height|align],param[name|value],embed[quality|type|pluginspage|width|height|src|align|wmode]",
relative_urls:false,
content_css:"/javascripts/tinymce/plugins/javaeye/css/content.css",
save_callback:"removeBRInPre"
});
}
function removeBRInPre(element_id,html,body){
return html.replace(/<pre([^>]*)>((?:.|\n)*?)<\/pre>/gi,function(a,b,c){
c=c.replace(/<br\s*\/?>\n*/gi,'\n');
return'<pre'+b+'>'+c+'</pre>';
});
}
Control.TextArea.Editor=Class.create();
Object.extend(Control.TextArea.Editor.prototype,{
bbcode_editor:false,
rich_editor:false,
mode:false,
in_preview:false,
initialize:function(textarea,mode,autosave){
this.editor_bbcode_flag=$("editor_bbcode_flag");
this.textarea=textarea;
this.switchMode(mode);
if(autosave)this._initAutosave();
},
switchMode:function(mode,convert){
if(this.in_preview&&this.mode==mode){
$("editor_tab_bbcode").removeClassName("activetab");
$("editor_tab_rich").removeClassName("activetab");
$("editor_tab_preview").removeClassName("activetab");
$("editor_tab_"+mode).addClassName("activetab");
$("editor_preview").hide();
$("editor_main").show();
this.in_preview=false;
return;
}
if(this.mode==mode)return;
if(convert){
var old_text=this.getValue();
if(old_text!=""){
if(!confirm("切换编辑器模式可能导致格式和内容丢失,你确定吗?"))return;
$('editor_switch_spinner').show();
}
}
this.mode=mode;
if($("editor_switch")){
$("editor_tab_bbcode").removeClassName("activetab");
$("editor_tab_rich").removeClassName("activetab");
$("editor_tab_preview").removeClassName("activetab");
$("editor_tab_"+mode).addClassName("activetab");
$("editor_preview").hide();
$("editor_main").show();
this.in_preview=false;
}
if(this.mode=="rich"){
this.editor_bbcode_flag.value="false";
if(this.bbcode_editor)this.bbcode_editor.hide();
this.rich_editor=true;
tinyMCE.execCommand('mceAddControl',false,this.textarea);
}else{
this.editor_bbcode_flag.value="true";
if(this.rich_editor)tinyMCE.execCommand('mceRemoveControl',false,this.textarea);
this.bbcode_editor?this.bbcode_editor.show():this.bbcode_editor=new Control.TextArea.BBCode(this.textarea);
}
if(convert&&old_text!=""){
new Ajax.Request(this.mode=="rich"?'/editor/bbcode2html':'/editor/html2bbcode',{
method:'post',
parameters:{text:old_text},
asynchronous:true,
onSuccess:function(transport){this.setValue(transport.responseText);$('editor_switch_spinner').hide();}.bind(this)
});
}
},
getValue:function(){
return this.mode=="bbcode"?this.bbcode_editor.textarea.element.value:tinyMCE.activeEditor.getContent();
},
setValue:function(value){
if(this.mode=="bbcode"){
this.bbcode_editor.textarea.element.value=value;
}else{
tinyMCE.get(this.textarea).setContent(value);
}
},
preview:function(){
this.in_preview=true;
$('editor_switch_spinner').show();
$("editor_preview").show();
$("editor_main").hide();
$("editor_tab_bbcode").removeClassName("activetab");
$("editor_tab_rich").removeClassName("activetab");
$("editor_tab_preview").addClassName("activetab");
new Ajax.Updater("editor_preview","/editor/preview",{
parameters:{text:this.getValue(),mode:this.mode},
evalScripts:true,
onSuccess:function(){$('editor_switch_spinner').hide();}
});
},
insertImage:function(url){
if(this.mode=="bbcode"){
this.bbcode_editor.textarea.insertAfterSelection("\n[img]"+url+"[/img]\n");
}else{
tinyMCE.execCommand("mceInsertContent", false, "<br/><img src='"+url+"'/><br/>&nbsp;");
}
},
_initAutosave:function(){
this.autosave_url=window.location.href;
new Ajax.Request('/editor/check_autosave',{
method:'post',
parameters:{url:this.autosave_url},
asynchronous:true,
onSuccess:this._loadAutosave.bind(this)
});
setInterval(this._autosave.bind(this),90*1000);
},
_loadAutosave:function(transport){
var text=transport.responseText;
if(text!="nil"){
eval("this.auto_save = "+text);
$('editor_auto_save_update').update('<span style="color:red">您有一份自动保存于'+this.auto_save.updated_at+'的草稿，<a href="#" onclick=\'editor._setAutosave();return false;\'>恢复</a>还是<a href="#" onclick=\'editor._discardAutosave();return false;\'>丢弃</a>呢？</span>');
}
},
_setAutosave:function(){
$("editor_auto_save_id").value=this.auto_save.id;
$('editor_auto_save_update').update("");
this.auto_save.bbcode?this.switchMode("bbcode"):this.switchMode("rich");
this.setValue(this.auto_save.body);
},
_discardAutosave:function(){
$("editor_auto_save_id").value=this.auto_save.id;
$('editor_auto_save_update').update("");
},
_autosave:function(){
var body=this.getValue();
if(body.length<100)return;
new Ajax.Request('/editor/autosave',{
method:'post',
parameters:{
url:this.autosave_url,
body:body,
bbcode:this.mode=="bbcode"
},
asynchronous:true,
onSuccess:function(transport){
$('editor_auto_save_id').value=transport.responseText;
$('editor_auto_save_update').update('<span style="color:red">JavaEye编辑器帮您自动保存草稿于：'+new Date().toLocaleString()+'</span>');
}
});
}
});