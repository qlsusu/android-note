

function mw_syntaxhighlighter(textareaid) {
	if(textareaid == 'fastpost') {
		var code = $('fastpostcode');
		if(code) {
			code.onclick = function() {
				syntaxhighlighter_code_box('fastpost');
			};
		}
	} else if(textareaid == 'newthread') {
		var code = $(editorid + '_code');
		if(code) {
			code.onmouseup = function() {
				code.onclick = function() {
					
				};
				syntaxhighlighter_code_box('newthread');
			}
		}
	} else if(textareaid == 'post') {
		var code = $('postcode');
		if(code) {
			code.onclick = function() {
				syntaxhighlighter_code_box('post');
			};
		}
	}
}

function syntaxhighlighter_code_box(editortype) {
	mw_syntaxhighlighter_show_editor_codebox(editortype);
}