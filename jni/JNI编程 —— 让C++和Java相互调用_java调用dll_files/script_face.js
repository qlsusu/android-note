//显示表情菜单
function showFace(showid, target) {
	var div = $('uchome_face_bg');
	if(div) {
		div.parentNode.removeChild(div);
	}
	div = document.createElement('div');
	div.id = 'uchome_face_bg';
	div.style.position = 'absolute';
	div.style.left = div.style.top = '0px';
	div.style.width = '100%';
	div.style.height = document.body.scrollHeight + 'px';
	div.style.backgroundColor = '#FFFFFF';
	div.style.zIndex = 10000;
	div.style.display = 'none';
	div.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=0,finishOpacity=100,style=0)';
	div.style.opacity = 0;
	div.onclick = function() {
		$(showid+'_menu').style.display = 'none';
		$('uchome_face_bg').style.display = 'none';
	}
	$('append_parent').appendChild(div);
	
	if($(showid + '_menu') != null) {
		$(showid+'_menu').style.display = '';
	} else {
		var faceDiv = document.createElement("div");
		faceDiv.id = showid+'_menu';
		faceDiv.className = 'facebox';
		faceDiv.style.position = 'absolute';
		var faceul = document.createElement("ul");
		for(i=1; i<31; i++) {
			var faceli = document.createElement("li");
 			faceli.innerHTML = '<img src="image/face/'+i+'.gif" onclick="insertFace(\''+showid+'\','+i+', \''+ target +'\')" style="cursor:pointer; position:relative;" />';
			faceul.appendChild(faceli);
		}
		faceDiv.appendChild(faceul);
		$('append_parent').appendChild(faceDiv)
	}
	//定位菜单
	setMenuPosition(showid, 0);
	div.style.display = '';
}
//插入表情
function insertFace(showid, id, target) {
	var faceText = '[em:'+id+':]';
	if($(target) != null) {
		insertContent(target, faceText);
	}
	$(showid+'_menu').style.display = 'none';
	$('uchome_face_bg').style.display = 'none';
	if(spdoing == 1){
		textCounter($('message'), 'maxlimit', 200);
	}
}
//插入表情
function bloginsertFace(showid ,id, target) {
	var faceText = '[em:'+id+':]';
	if($(target) != null) {
		insertContent(target, faceText);
	}
}
function textCounter(obj, showid, maxlimit) {
	var len = strLen(obj.value);
	var showobj = $(showid);
	if(len > maxlimit) {
		obj.value = getStrbylen(obj.value, maxlimit);
		showobj.innerHTML = '0';
	} else {
		showobj.innerHTML = maxlimit - len;
	}
	if(maxlimit - len > 0) {
		showobj.parentNode.style.color = "";
	} else {
		showobj.parentNode.style.color = "red";
	}
}
function getStrbylen(str, len) {
	var num = 0;
	var strlen = 0;
	var newstr = "";
	var obj_value_arr = str.split("");
	for(var i = 0; i < obj_value_arr.length; i ++) {
		if(i < len && num + byteLength(obj_value_arr[i]) <= len) {
			num += byteLength(obj_value_arr[i]);
			strlen = i + 1;
		}
	}
	if(str.length > strlen) {
		newstr = str.substr(0, strlen);
	} else {
		newstr = str;
	}
	return newstr;
}
function byteLength (sStr) {
	aMatch = sStr.match(/[^\x00-\x80]/g);
	return (sStr.length + (! aMatch ? 0 : aMatch.length));
}
function strLen(str) {
	var charset = document.charset; 
	var len = 0;
	for(var i = 0; i < str.length; i++) {
		len += str.charCodeAt(i) < 0 || str.charCodeAt(i) > 255 ? (charset == "utf-8" ? 3 : 2) : 1;
	}
	return len;
}