(function($) {
	$.fn.LocalizationEditor = function(options) {
		
		var localizerForm = this,
			localizerMenu = $('#nav');
		
		var methods = {
		
			preventEscape: function() {
				//window.onbeforeunload = function() { return "Are you sure you want to leave?"; }
			},
		
			lookupFile: function() {
				// 'localizeParts_test.json'
				$('#lookupFile').click(function() {
					var input = $('#fileUrl');
					var url = $.trim(input.val());
					if (url != "") {
						$('#fileRetriever').hide().after('<div class="loader">Retrieving file information...</div>');
						methods.createHTML(url,function() {
							methods.styleRows();
							methods.createEvents();
							methods.removeLoaders();
						});
					}
				});
			},
		
			createHTML: function(file,callback) {
				
				var url = file,
					formHTML = '<form id="localizerForm" name="localizer" action="./" method="post">',
					menuHTML = '<ul class="menu localizerFormMenu clearfix">';
				
				var protocol = window.location.protocol,
					proxy = protocol+'//www.kinteratools.com/local/proxy.php';
				
				url = protocol+'//'+url.replace('http://','').replace('https://','');
				
				$.post(proxy,{url:url},function(json) {
				
					$.each(json.localizer, function() {
					
						if (this.parts) {
							
							var partName, partSelector, partTerms;
							
							menuHTML += '<li><a href="#parts" class="selected">Parts</a><ul class="localizerFormSubmenu">';
							formHTML += '<div id="parts" class="localizerFormContainer" style="display:block;"><h2>Parts</h2>';
							
							$.each(this.parts, function(i) {
								
								partName = this.part;
								partSelector = this.selector.replace(/["']/g,'');
								partTerms = this.terms;
								
								menuHTML += '<li><a href="#part-'+i+'">'+partName+'</a></li>';
								
								formHTML += '<div class="localizerFieldset">';
								formHTML += '<h4 id="part-' + i + '"><span>' + partName + '</span> <a class="topLink" href="#top">^ Back to top</a></h4>';
								formHTML += '<div class="localizerFormSelector"><label>Container CSS Selector (ID or class):</label><input type="text" value="' + partSelector + '" /></div>';
								formHTML += '<div class="localizerFormTerms">';
								formHTML += '<table cellspacing="0" cellpadding="0">';
								formHTML += '<tr class="heading"><th>Element (tag, class, or ID)</th><th>English</th><th>French</th><th>Spanish</th><th></th></tr>';
								var element,english,french,spanish,rowClass;
								$.each(partTerms,function(i) {
									
									element = this["Element"].replace(/["']/g,'');
									english = this["English"].replace('&','&amp;');
									french = this["French"].replace('&','&amp;');
									spanish = this["Spanish"].replace('&','&amp;');
									
									formHTML += '<tr><td><input type="text" value="'+element+'" /></td>';
									formHTML += '<td><input type="text" value="'+english+'" /></td>';
									formHTML += '<td><input type="text" value="'+french+'" /></td>';
									formHTML += '<td><input type="text" value="'+spanish+'" /></td>';
									formHTML += '<td class="actions"><a class="addAbove" href="#" title="Insert a row above">Add Row Above</a> <a class="addBelow" href="#" title="Insert a row below">Add Row Below</a> <a class="deleteRow" href="#" title="Delete this row.">Delete Row</a></td></tr>';
									
								});
								formHTML += '</table>';
								formHTML += '</div>';
								formHTML += '</div>';
							});
							
							menuHTML += '</ul></li>';
							formHTML += '</div>';
						}
					
						else if (this.dates) {
						
							var type, english, french, spanish;
							
							menuHTML += '<li><a href="#dates">Dates</a></li>';
							formHTML += '<div id="dates" class="localizerFormContainer"><h2>Dates</h2>';
							formHTML += '<div class="localizerFormTerms">';
							formHTML += '<table cellspacing="0" cellpadding="0">';
							formHTML += '<tr class="heading"><th>Element (tag, class, or ID)</th><th>English</th><th>French</th><th>Spanish</th><th></th></tr>';
								
							$.each(this.dates, function(i) {
								
								element = this["Element"].replace(/["']/g,'');
								english = this["English"].replace('&','&amp;');
								french = this["French"].replace('&','&amp;');
								spanish = this["Spanish"].replace('&','&amp;');
								
								formHTML += '<tr><td><input type="text" value="'+element+'" /></td>';
								formHTML += '<td><input type="text" value="'+english+'" /></td>';
								formHTML += '<td><input type="text" value="'+french+'" /></td>';
								formHTML += '<td><input type="text" value="'+spanish+'" /></td>';
								formHTML += '<td class="actions"><a class="addAbove" href="#" title="Insert a row above">Add Row Above</a> <a class="addBelow" href="#" title="Insert a row below">Add Row Below</a> <a class="deleteRow" href="#" title="Delete this row.">Delete Row</a></td></tr>';
								
							});
							
							formHTML += '</table>';
							formHTML += '</div>';
							formHTML += '</div>';
							
						} 
						
						else if (this.buttons) {
						
							var type, english, french, spanish;
						
							menuHTML += '<li><a href="#buttons">Form Buttons</a></li>';
							formHTML += '<div id="buttons" class="localizerFormContainer"><h2>Form Buttons</h2>';
							formHTML += '<div class="localizerFormTerms">';
							formHTML += '<table cellspacing="0" cellpadding="0">';
							formHTML += '<tr class="heading"><th>Element (must be "input")</th><th>English</th><th>French</th><th>Spanish</th><th></th></tr>';
							
							$.each(this.buttons, function(i) {
								
								element = this["Element"].replace(/["']/g,'');
								english = this["English"].replace('&','&amp;');
								french = this["French"].replace('&','&amp;');
								spanish = this["Spanish"].replace('&','&amp;');
								
								formHTML += '<tr><td><input type="text" value="'+element+'" /></td>';
								formHTML += '<td><input type="text" value="'+english+'" /></td>';
								formHTML += '<td><input type="text" value="'+french+'" /></td>';
								formHTML += '<td><input type="text" value="'+spanish+'" /></td>';
								formHTML += '<td class="actions"><a class="addAbove" href="#" title="Insert a row above">Add Row Above</a> <a class="addBelow" href="#" title="Insert a row below">Add Row Below</a> <a class="deleteRow" href="#" title="Delete this row.">Delete Row</a></td></tr>';
								
							});
							
							formHTML += '</table>';
							formHTML += '</div>';
							formHTML += '</div>';
							
						} 
						
					});
					
					menuHTML += '<li class="jsonLink"><a href="#json">Download the File &#155;</a></li>';
					formHTML += '<div id="json" class="localizerFormContainer"><h2>Generate Localization File</h2><h3>Ready to save your changes?</h3><ol><li>Click the green button below to generate the localization code</li><li>Once the code has been generated, click the download button to save it to your computer</li><li>Login to your NetCommunity website and go to the Documents part that houses the older version of the translation file</li><li>Next to the translation file, click on the "Edit" link and upload your new file</li><li>Refresh your NetCommunity page to see the translation changes</li></ol><div class="localizerFormsButtons clearfix"><a href="#" class="button button-generate" id="createJSON">Generate Code</a><a id="download" class="button button-download" href="#">Download File</a></div><textarea class="localizerFormTextarea" id="formattedJSON" wrap="off"></textarea></div>';
					formHTML += '</form>';
					menuHTML += '</ul>';
					$(localizerMenu).append(menuHTML).show();
					$(localizerForm).append(formHTML);
					callback();
				
				},'json');
				
			},
			
			styleRows: function() {
				$('div.localizerFormTerms tr:not(".heading")').each(function(i) {
					//var rowClass = (i%2) ? 'even' : 'odd';
					//$(this).removeClass('even').removeClass('odd').addClass(rowClass);
					$(this).removeClass('needed').removeAttr('title').find('input[value*="***"]').addClass('needed').attr('title','Translation needed');
				});
			},
			
			createEvents: function() {
			
				$(document).ready(function(){
			
					// tabs
					$('ul.localizerFormMenu > li > a').click(function() {
						$('.localizerFormContainer').hide();
						$('#'+$(this).attr('href').replace('#','')).fadeIn();
						$(this).closest('ul').find('a').removeClass('selected');
						$(this).addClass('selected');
						$('textarea#formattedJSON').val('');
						return false;
					});
					
					// tabs submenu
					$('ul.localizerFormMenu li li > a').click(function() {
						$('.localizerFormContainer').hide();
						$('#'+$(this).closest('ul.localizerFormMenu').find('> li > a').attr('href').replace('#','')).fadeIn();
						location.hash = $(this).attr('href').replace('#','');
						return false;
					});
					
					// Part row actions
					$('div.localizerFormTerms').click(function (e) {
						var link = $(e.target);
						var linkClass = link.attr('class');
						var actions = link.closest('tr').find('td.actions');
						var rowHTML = '<tr><td><div style="display:none;"><input type="text" class="needed" /></div></td><td><div style="display:none;"><input type="text" class="needed" /></div></td><td><div style="display:none;"><input type="text" class="needed" /></div></td><td><div style="display:none;"><input type="text" class="needed" /></div></td><td class="actions"><div style="display:none;"><a class="addAbove" href="#">Add Row Above</a> <a class="addBelow" href="#">Add Row Below</a> <a class="deleteRow" href="#">Delete Row</a></div></td></tr>';
						switch (linkClass) {
							case "addAbove":
								link.closest('tr').before(rowHTML);
								link.closest('tr').prev().find('div').delay(500).fadeIn();
								methods.styleRows();
								break;
							case "addBelow":
								link.closest('tr').after(rowHTML);
								link.closest('tr').next().find('div').delay(500).fadeIn();
								methods.styleRows();
								break;
							case "deleteRow":
								link.closest('tr').addClass('deleted').find('.errors').removeClass('errors');
								actions.find('a').hide();
								actions.append('<a href="#" class="undoDelete">Undo Delete</a>');
								break;
							case "undoDelete":
								link.closest('tr').removeClass('deleted');
								actions.find('a.undoDelete').remove();
								actions.find('a').show();
								break;
						}
						return false;
					});
					
					// Create JSON
					$('a#createJSON').click(function() {
					
						var noneEmpty = true,
							errors = '',
							pageName,
							textarea,
							form = $('#localizerForm'),
							button = $(this);
					
						methods.removeLoaders();
						button.hide().after('<div class="loader">Please wait...</div>');
						$('#download').hide();
						
						setTimeout(function() {
							form.find('div.message').remove();
							form.find('td div').removeClass('errors');
							textarea = $('textarea#formattedJSON').val('');
							
						
							// first check if fields are not blank:
							form.find('div.localizerFormSelector input, div.localizerFormContainer tr:not(".deleted") input').each(function() {
								if ($.trim($(this).val()) == "") {
									$(this).parent().addClass('errors');
									pageName = $(this).closest('.localizerFormContainer').find('h2').text();
									if (errors.indexOf(pageName)==-1) {
										errors += 'Empty fields found on the '+pageName+' page.<br />';
									}
									noneEmpty = false;
								}
							});
							
							if (noneEmpty) {
								window.scrollTo(0, 0);
								var formattedJSON = '{ "localizer": [\n';
								
								form.find('div.localizerFormContainer').each(function(i) {
									switch (i) {
										case 0:
											formattedJSON += '\t{ "parts": [\n';
											var name,selector,comma;
											var partContainers = $(this).find('.localizerFieldset');
											partContainers.each(function(k) {
												name = $(this).find('h4 span').text();
												selector = $(this).find('div.localizerFormSelector input').val();
												formattedJSON += '\t\t{\n';
												formattedJSON += '\t\t\t"part": "'+name+'",\n';
												formattedJSON += '\t\t\t"selector": "'+selector+'",\n';
												formattedJSON += '\t\t\t"terms": [\n';
												
												var element,english,french,spanish,
													parts = $(this).find('div.localizerFormTerms tr:not(".heading"):not(".deleted")');
													
												parts.each(function(i) {
													element = $(this).find('td:eq(0) input').val();
													english = $(this).find('td:eq(1) input').val();
													french = $(this).find('td:eq(2) input').val();
													spanish = $(this).find('td:eq(3) input').val();
													comma = (parts.length-1 == i) ? '' : ',';
													formattedJSON += '\t\t\t\t{"Element": "'+element+'", "English": "'+english+'", "French": "'+french+'", "Spanish": "'+spanish+'"}'+comma+'\n';
												});
												
												comma = (partContainers.length-1 == k) ? '' : ',';
												
												formattedJSON += '\t\t\t]\n';
												formattedJSON += '\t\t}'+comma+'\n\n';
											});
											formattedJSON += '\t]},\n\n';
											break;
										case 1:
											formattedJSON += '\t{ "dates": [\n';
											
											var element,english,french,spanish,
													parts = $(this).find('div.localizerFormTerms tr:not(".heading"):not(".deleted")');
													
											parts.each(function(i) {
												element = $(this).find('td:eq(0) input').val();
												english = $(this).find('td:eq(1) input').val();
												french = $(this).find('td:eq(2) input').val();
												spanish = $(this).find('td:eq(3) input').val();
												comma = (parts.length-1 == i) ? '' : ',';
												formattedJSON += '\t\t{"Element": "'+element+'", "English": "'+english+'", "French": "'+french+'", "Spanish": "'+spanish+'"}'+comma+'\n';
											});
											
											formattedJSON += '\t]},\n\n';
											break;
										case 2:
											formattedJSON += '\t{ "buttons": [\n';
											
											var element,english,french,spanish,
													parts = $(this).find('div.localizerFormTerms tr:not(".heading"):not(".deleted")');
													
											parts.each(function(i) {
												element = $(this).find('td:eq(0) input').val();
												english = $(this).find('td:eq(1) input').val();
												french = $(this).find('td:eq(2) input').val();
												spanish = $(this).find('td:eq(3) input').val();
												comma = (parts.length-1 == i) ? '' : ',';
												formattedJSON += '\t\t{"Element": "'+element+'", "English": "'+english+'", "French": "'+french+'", "Spanish": "'+spanish+'"}'+comma+'\n';
											});
											
											formattedJSON += '\t]}\n\n';
											break;
									}
								});
								formattedJSON += ']}';
								textarea.val(formattedJSON);
								$('#download').show();
							} else {
								textarea.before('<div class="message">'+errors+'</div>');
							}
							button.show();
							methods.removeLoaders();
						}, 1000);
						
					});
					
					// Download JSON
					$('#download').click(function() {
						$.generateFile({
							filename	: 'localizeParts.json',
							content		: $('#formattedJSON').val(),
							script		: 'download-json.php'
						});
						return false;
					});
				
				});
				
			},
			
			removeLoaders: function() {
				localizerForm.find('.loader').remove();
			}
			
		};
		
		return this.each(function() {
			methods.preventEscape();
			methods.lookupFile();
			/*
			methods.createHTML(function() {
				methods.styleRows();
				methods.createEvents();
				methods.removeLoaders();
			});
			*/
		});
		
	};
})(jQuery);