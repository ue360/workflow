(function($) {
	'use strict';
	
	if (typeof alertify != 'undefined') {
		$.extend(alertify.defaults, {
			glossary: {
				title: '确认操作',
				ok: '确 定',
				cancel: '取 消',
				acccpt: '接 受',
				deny: '否 决',
				confirm: '确 认',
				decline: '拒 绝',
				close: '关 闭',
				maximize: '最大化',
				restore: '恢复',
			},
			notifier: {
				position: 'top-center',
				closeButton: true
			}
		})

		alertify.defaults.notifier.closeButton = true

		var defaultOptions = {
			buttons: [{
				text: alertify.defaults.glossary.ok,
				key: 13,
				className: alertify.defaults.theme.ok,
			}, {
				text: alertify.defaults.glossary.cancel,
				key: 27,
				invokeOnClose: true,
				className: alertify.defaults.theme.cancel,
			}],
			focus: {
				element: 0,
				select: false
			},
			options: {
				maximizable: true,
				resizable: false,
				moveBounded: true/*,
				onclose: function() {
					var me = this;
					setTimeout(function() {
						me.destroy()
					}, 500)
				}*/
			}
		};
		var defaultConfig = {
			main: function(cfg) {
				this.set('title', cfg.title);
				this.set('html', cfg.html);
				this.set('onok', cfg.onok);
				this.set('oncancel', cfg.oncancel);
				this.set('onshow', cfg.onshow);
				this.set('onclose', function() {
					cfg.onclose && cfg.onclose.apply(this, arguments)
					var me = this;
					setTimeout(function() {
						me.destroy()
					}, 500)
				});
				return this;
			},
			setup: function() {
				return defaultOptions;
			},
			build: function() {},
			prepare: function() {},
			setHtml: function(html) {
				this.setContent(html);
			},
			settings: {
				width: null,
				height: null,
				html: null,
				labels: null,
				onok: null,
				oncancel: null,
				onshow: null,
				onclose: null
			},
			settingUpdated: function(key, oldValue, newValue) {
				switch (key) {
					case 'html':
						this.setHtml(newValue);
						break;
					case 'center':
						this.elements.root.className += ' ajs-centered'
						break;
					case 'width':
						this.elements.dialog.style.width = typeof newValue === 'number' ? (newValue + 'px') : newValue
					case 'height':
						this.elements.content.style.height = typeof newValue === 'number' ? (newValue + 'px') : newValue
						break;
				}
			},
            callback: function (closeEvent) {
                if (typeof this.get('onok') === 'function') {
                    var returnValue = this.get('onok').call(this, closeEvent);
                    if (typeof returnValue !== 'undefined') {
                        closeEvent.cancel = !returnValue;
                    }
                }
            }
		};
		alertify.dialog('model', function() {
			return $.extend(true, {}, defaultConfig, {
				settings: {
					center: null
				}
			})
		}, true);
		alertify.dialog('drawer', function() {
			return $.extend(true, {}, defaultConfig, {
				setup: function() {
					return $.extend(true, {}, defaultOptions, {
						options: {
							maximizable: false,
							resizable: false,
							movable: false,
							transition: 'drawer'
						}
					})
				},
				hooks: {
					onshow: function() {
						clearTimeout(this.__internal.timerIn)
					},
					onclose: function() {
						clearTimeout(this.__internal.timerOut)
					}
				}
			})
		}, true);
	}

	if (!String.prototype.trim) {
		String.prototype.trim = function() {
			var re = /^\s+|\s+$/g;
			return function() {
				return this.replace(re, "");
			};
		}();
	}
	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function(o) {
			for (var i = 0, len = this.length; i < len; i++) {
				if (this[i] == o) return i;
			}
			return -1;
		}
	}
	if (typeof Array.prototype.forEach != "function") {
		Array.prototype.forEach = function(fn, context) {
			for (var k = 0, length = this.length; k < length; k++) {
				if (typeof fn === "function" && Object.prototype.hasOwnProperty.call(this, k)) {
					fn.call(context, this[k], k, this);
				}
			}
		};
	}
	if (typeof Array.prototype.map != "function") {
		Array.prototype.map = function(fn, context) {
			var result = [];
			if (typeof fn === "function") {
				for (var i = 0, length = this.length; i < length; i++) {
					result.push(fn.call(context, this[i], i, this));
				}
			}
			return result;
		};
	}

	if (!Array.prototype.filter) {
		Array.prototype.filter = function(fn) {
			var result = [];
			if (typeof fn === "function") {
				for (var i = 0, length = this.length; i < length; i++) {
					if (fn(this[i], i)) {
						result.push(this[i])
					}
				}
			}
			return result;
		}
	}

	if (typeof Array.prototype.reduce != "function") {
		Array.prototype.reduce = function(callback, initialValue) {
			var previous = initialValue,
				k = 0,
				length = this.length;
			if (typeof initialValue === "undefined") {
				previous = this[0];
				k = 1;
			}

			if (typeof callback === "function") {
				for (k; k < length; k++) {
					this.hasOwnProperty(k) && (previous = callback(previous, this[k], k, this));
				}
			}
			return previous;
		};
	}

	Math.accAdd = function(v1, v2) {
		var r1, r2, m;
		try {
			r1 = v1.toString().split('.')[1].length;
		} catch (e) {
			r1 = 0;
		}
		try {
			r2 = v2.toString().split(".")[1].length;
		} catch (e) {
			r2 = 0;
		}
		m = Math.pow(10, Math.max(r1, r2));
		return Math.round(v1 * m + v2 * m) / m;
	}
	Math.accSub = function(v1, v2) {
		return Math.accAdd(v1, -v2);
	}
	// 乘法
	Math.accMul = function(v1, v2) {
		var m = 0,
			s1 = v1.toString(),
			s2 = v2.toString();
		try {
			m += s1.split(".")[1].length;
		} catch (e) {}
		try {
			m += s2.split(".")[1].length;
		} catch (e) {}
		return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
	}
	// 除法
	Math.accDiv = function(v1, v2) {
		var t1 = 0,
			t2 = 0,
			r1, r2;
		try {
			t1 = v1.toString().split(".")[1].length;
		} catch (e) {}
		try {
			t2 = v2.toString().split(".")[1].length;
		} catch (e) {}

		r1 = Number(v1.toString().replace(".", ""));
		r2 = Number(v2.toString().replace(".", ""));
		return (r1 / r2) * Math.pow(10, t2 - t1);
	}

	if (typeof template != 'undefined') {
		template.helper('format', function(date, format) {
			date = new Date(date); //新建日期对象
			/*日期字典*/
			var map = {
				"M": date.getMonth() + 1, //月份 
				"d": date.getDate(), //日 
				"h": date.getHours(), //小时 
				"m": date.getMinutes(), //分 
				"s": date.getSeconds(), //秒 
				"q": Math.floor((date.getMonth() + 3) / 3), //季度 
				"S": date.getMilliseconds() //毫秒 
			};

			/*正则替换*/
			format = format.replace(/([yMdhmsqS])+/g, function(all, t) {
				var v = map[t];
				if (v !== undefined) {
					if (all.length > 1) {
						v = '0' + v;
						v = v.substr(v.length - 2);
					}
					return v;
				} else if (t === 'y') {
					return (date.getFullYear() + '').substr(4 - all.length);
				}
				return all;
			});

			/*返回自身*/
			return format;
		});
	}

	function _getValue(value, name) {
		var m;
		if (m = name.match(/^([\da-z]+)\[(\d+)\]$/i)) {
			var obj = value[m[1]];
			var list = [].concat(obj);
			var index = m[2];
			value = list[index];
		} else {
			value = value[name];
		}
		return value;
	}

	function getValue(data, name) {
		var names = name.split('.'),
			i = 0,
			// value = data[names[i]];
			value = _getValue(data, names[i]);
		i++;
		for (var l = names.length; i < l; i++) {
			var _name = names[i];
			if (value == null) {
				break;
			}
			value = _getValue(value, _name);
		}
		return value;
	}

	function _setValue(data, name) {
		if (m = name.match(/^([\da-z]+)\[(\d+)\]$/i)) {
			name = m[1];
			if (!$.isArray(data[name])) {
				data[name] = [];
			}
			var index = m[2];
			data[name][index] = data[name][index] || {};
			return data[name][index];
		} else {
			data[name] = data[name] || {};
			return data[name];
		}
	}

	function formatArray(value) {
		// return $.isArray(value) ? value.join(',') : value;
		return value;
	}

	function setValue(data, name, value) {
		var names = name.split('.');
		if (names.length === 1) {
			data[name] = formatArray(value);
			return;
		}

		var i = 0,
			obj = _setValue(data, names[i]);


		i++;
		for (var l = names.length - 1; i < l; i++) {
			var _name = names[i];

			obj = _setValue(obj, _name);
		}
		obj[names[names.length - 1]] = formatArray(value);
	}

	if (!$.fn.setData) {
		var r20 = /%20/g,
			rbracket = /\[\]$/,
			rCRLF = /\r?\n/g,
			rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
			rsubmittable = /^(?:input|select|textarea|keygen)/i,
			rcheckableType = (/^(?:checkbox|radio)$/i);
		$.fn.setData = function(data) {
			var cached = {};
			this.map(function() {
					var elements = $.prop(this, "elements");
					return elements ? $.makeArray(elements) : this;
				})
				.filter(function() {
					var type = this.type;
					return this.name &&
						rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type);
				})
				.each(function() {
					var type = this.type;
					var ischeckable = rcheckableType.test(type);
					var val = getValue(data, this.name);
					if (val == null) return true;

					if (!ischeckable) {
						$(this).val(val);
					} else if (/^(?:radio)$/i.test(type) && !cached[this.name]) {
						var $form = $(this.form);
						var selector = ':radio[name="' + this.name + '"][value="' + val + '"]';
						$form.find(selector).prop("checked", true);
						cached[this.name] = true;
					} else if (!cached[this.name]) {
						var $form = $(this.form);
						var selector = ':checkbox[name="' + this.name + '"]';
						$form.find(selector).each(function() {
							var $ipt = $(this);
							var _val = $ipt.val().toString();
							if (typeof val == 'string') {
								val = val.split(',');
							}
							if (val.indexOf(_val) > -1) {
								$ipt.prop('checked', true);
							}
						});
						cached[this.name] = true;
					}
				});
		}
	}

	if (!$.fn.serializeJson) {
		$.fn.serializeJson = function() {
			var json = {};
			var array = this.serializeArray();
			$.each(array, function() {
				var val = getValue(json, this.name);
				if (val) {
					if ($.isArray(val)) {
						val.push(this.value.trim());
					} else {
						setValue(json, this.name, [val, this.value.trim()]);
					}
				} else {
					setValue(json, this.name, this.value.trim());
				}
			});
			return json;
		};
	}
})(jQuery);

;(function($) {
	$.ux = $.ux || {}

	// var uid = ['0', '0', '0', '0'];

	// function uuid(prefix) {
	// 	var index = uid.length;
	// 	var digit;
	// 	prefix = prefix || ''

	// 	while (index) {
	// 		index--;
	// 		digit = uid[index].charCodeAt(0);
	// 		if (digit === 57 /*'9'*/ ) {
	// 			uid[index] = 'A';
	// 			return prefix + uid.join('');
	// 		}
	// 		if (digit === 90 /*'Z'*/ ) {
	// 			uid[index] = '0';
	// 		} else {
	// 			uid[index] = String.fromCharCode(digit + 1);
	// 			return prefix + uid.join('');
	// 		}
	// 	}
	// 	uid.unshift('0');

	// 	return prefix + uid.join('');
	// }
	
	function uuid(len, radix) {
		var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
		var uuid = [],
			i;
		radix = radix || chars.length;

		if (len) {
			// Compact form
			for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
		} else {
			// rfc4122, version 4 form
			var r;

			// rfc4122 requires these characters
			uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
			uuid[14] = '4';

			// Fill in random data.  At i==19 set the high bits of clock sequence as
			// per rfc4122, sec. 4.1.5
			for (i = 0; i < 36; i++) {
				if (!uuid[i]) {
					r = 0 | Math.random() * 16;
					uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
				}
			}
		}

		return uuid.join('');
	}

	function guid() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0,
				v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}

	function _model(type, icon) {
		return function() {
			var args = Array.prototype.slice.call(arguments, 0)
			if (document.body) {
				alertify[type]().set({
					closableByDimmer: false,
					moveBounded: true,
					onshow: function() {
						var root = this.elements.root;
						root.className += ' ajs-' + icon + ' ajs-centered';
					}
				});
				return alertify[type].apply(this, args)
				// var name = 'ux' + type
				// if (!alertify[name]) {
				// 	alertify.dialog(name, function factory() {
				// 		return {
				// 			// setup: function() {
				// 			// 	return {
				// 			// 		options: {
				// 			// 			closableByDimmer: false,
				// 			// 			moveBounded: true
				// 			// 		}
				// 			// 	}
				// 			// },
				// 			build: function() {
				// 				this.elements.root.className += ' ajs-' + icon + ' ajs-centered';
				// 			}
				// 		};
				// 	}, false, type);
				// }
				// return alertify[name].apply(this, args).set('closableByDimmer', false).set('moveBounded', true)
			} else {
				$(document).ready(function() {
					$.ux[type].apply(this, args)
				})
			}
		}
	}

	$.extend($.ux, {
		// id: uuid,
		id: function() {
			return uuid(7)
		},
		tips: function(el, options) {
			if (arguments.length === 1) {
				options = el
				el = options.el
				options.el = null
				delete options.el
			}
			
			return tippy(el, $.extend({
					trigger: 'click',
					// appendTo: $('.fc-design').get(0),
					arrow: true,
					placement: 'right-start',
					theme: 'light'
				}, options))
		},
		alert: _model('alert', 'error'),
		confirm: _model('confirm', 'warning'),
		prompt: _model('prompt', 'warning'),
		dialog: alertify.model,
		drawer: alertify.drawer,
		notify: alertify.notify,
		template: function(id, data) {
			if (!document.getElementById(id)) {
				throw '模版未定义：' + id;
			}
			return template(id, data || {})
		}
	})
})(jQuery)

;(function($, window) {
	function Workflow(options) {
		var defaults = {
				menus: [],
				// 默认参数别名（可自定义）
				params: {
					prevId: 'prevId',
					nodeId: 'nodeId',
					type: 'type',
					name: 'name',
					properties: 'properties',
					childNode: 'childNode',
					conditionNodes: 'conditionNodes'
				},
				// 默认模版（id）
				templates: {
					root: 'tpl-root',
					menu: 'tpl-menu',
					container: 'tpl-container',
					row: 'tpl-row',
					col: 'tpl-col',
					nodeAdd: 'tpl-node-add',
					colAdd: 'tpl-col-add',
					remove: 'tpl-remove',
					actor: 'tpl-actor',
					node: 'tpl-node'
				},
				// 默认选择器（dom操作）
				classes: {
					zoom: '#zoom',
					zoomOut: '.fc-zoom-out',
					zoomIn: '.fc-zoom-in',
					zoomText: '> span',
					root: '#box-scale',
					menu: '.fc-menu-item',
					startNode: '.start-node',
					// actor: '.fc-tree-actor',
					// node: '.fc-tree-node',
					nodeAdd: '.add-node-btn .fc-btn',
					container: '.fc-tree-wrap',
					panel: '.fc-tree-panel',
					row: '.fc-tree-row',
					col: '.fc-tree-col',
					header: '.fc-node-header',
					name: '.fc-node-title',
					text: '.fc-node-text',
					colAdd: '.add-col-btn',
					remove: '.fc-btn-close',
					movePrev: '.to-left',
					moveNext: '.to-right'
				}
			}
		var config = $.extend(true, {}, defaults, options);

		// json数据
		var _data = config.data || {}
		var root
			zoomScore = 1,
			params = config.params,
			templates = config.templates, 
			classes = config.classes;

		var _errorClass = 'fc-node-error',
			_idProfix = 'fc-node-',
			_types = {
				route: 'route',
				condition: 'condition'
			}
		function _get(data, key) {
			return data[params[key] || key]
		}
		function _set(data, key, value) {
			if (arguments.length === 2) {
				for (var k in key) {
					if (key.hasOwnProperty(k)) {
						_set(data, k, key[k])
					}
				}
				return
			}
			data[params[key] || key] = value
		}
		function _remove(data, key) {
			data[params[key] || key] = null
			delete data[params[key] || key]
		}
		// function _clean(data) {
		// 	for (var key in data) {
		// 		if (data.hasOwnProperty(key)) {
		// 			_remove(data, key)
		// 		}
		// 	}
		// }
		function _isNew() {
			return Object.keys(_data).length === 0
		}
		var _maps = {}
		function _apply(el, data, prevId) {
			var nodeId = _get(data, 'nodeId')
			if (!nodeId) {
				nodeId = $.ux.id();
				_set(data, {
					nodeId: nodeId
				})
			}
			if (prevId) {
				_set(data, {
					prevId: prevId
				})
			}
			el.addClass(_idProfix + nodeId)
			_maps[nodeId] = data
			return nodeId;
		}
		function _getParent(data) {
			var prevId = _get(data, 'prevId');
			return _maps[prevId]
		}
		function _getId(el) {
			// var m = el.get(0).className.match(/\sfc-node-([0-9a-zA-Z]{0,4})\s*/)
			// var m = $(el).get(0).className.match(new RegExp("\\s" + _idProfix + "([0-9a-zA-Z]{0,4})\\s*"))
			var m = $(el).get(0).className.match(new RegExp("\\s" + _idProfix + "([0-9a-zA-Z]+)\\s*"))
			if (m) {
				return m[1]
			}
		}
		function swap(array, x, y) {
			array[x] = array.splice(y, 1, array[x])[0];
			return array;
		}
		function initEvents() {
			if ($.isReady) {
				var $zoom = $(classes.zoom)
				var zoomText = $zoom.find(classes.zoomText)
				$zoom
				.on('click', classes.zoomOut, function() {
					if (zoomScore <= .5) return;
					if (zoomScore == 3) {
						$zoom.find(classes.zoomIn).removeClass('disabled')
					}
					zoomScore = Math.accSub(zoomScore, .1)
					if (zoomScore === .5) {
						$(this).addClass('disabled')
					}
					root.css({
						'transform': 'scale(' + zoomScore + ')',
						'transform-origin': '50% 0px 0px'
					});
					zoomText.text(Math.accMul(zoomScore, 100) + '%')
				})
				.on('click', classes.zoomIn, function() {
					if (zoomScore >= 3) return;
					if (zoomScore == .5) {
						$zoom.find(classes.zoomOut).removeClass('disabled')
					}
					zoomScore = Math.accAdd(zoomScore, .1)
					if (zoomScore === 3) {
						$(this).addClass('disabled')
					}
					root.css({
						'transform': 'scale(' + zoomScore + ')',
						'transform-origin': '50% 0px 0px'
					});
					zoomText.text(Math.accMul(zoomScore, 100) + '%')
				})
			} else {
				$(document).ready(initEvents)
			}
		}
		function getTemplate(id, data) {
			return $.ux.template.apply(this, arguments)
		}
		
		/**
		 * 添加节点块
		 * @param {object} node 
		 * node: {
		 * 	el: el,
		 * 	data: data // 节点数据
		 * }
		 * @param {string} mode 插入方式，默认 插入el下方 appendTo/prependTo/insertAfter/...
		 */
		function addContainer(node, isNew, mode) {
			var el = node.el;
			var _data = node.data;
			mode = mode || 'insertAfter'
			var $container = $(getTemplate(templates.container))[mode](el)
			
			var type = _get(_data, '$$type'), newNode
			// 条件分支（增加列）时，data不需用增加childNode
			if (type === 'condition') {
				_remove(_data, '$$type')
				newNode = {
					el: $container,
					data: _data
				}
			} else {
				if (isNew) {
					// tree结构，最上面的嵌套在外层，下面的节点是childNode
					var _node = _get(_data, 'childNode')
					if (_node) {
						_set(_data, {
							childNode: {
								childNode: _node
							}
						})
					} else {
						_set(_data, {
							childNode: {}
						})
					}
				}
				var data = _get(_data, 'childNode')
				newNode = {
					el: $container,
					data: data
				}
			}
			var prevNode, prevId
			if (((prevNode = newNode.el.prev()) && prevNode.is(classes.container)) || ((prevNode = newNode.el.parent().closest(classes.container)) && prevNode.length) || (prevNode = getStartNode())) {
				prevId = _getId(prevNode)
			}
			// 绑定 节点唯一标识及父级标识
			var id = _apply(newNode.el, newNode.data, prevId)

			// 如果有 nextNode 需要更新它的 prevId 指向为当前节点的 nodeId
			var nextNode
			if ((nextNode = newNode.el.next()) && nextNode.is(classes.container)) {
				var nodeId = _getId(nextNode)
				_set(_maps[nodeId], 'prevId', id)
			}

			bindMenuEvents(newNode)

			return newNode
		}

		/**
		 * 添加节点（行为）
		 */
		function addActor(node, options, isNew) {
			var el = node.el;
			var _data = node.data;
			options = options || {}

			var $panel = el.find(classes.panel)
			var data = options.node || {}
			if (typeof data.text == 'function') {
				data.text = data.text.apply(data.properties)
			}
			var $actor = $(getTemplate(templates.actor, data)).prependTo($panel)

			if (isNew) {
				_set(_data, {
					type: options.type,
					properties: data.properties || {}
				})
			}

			var newNode = {
				el: $actor,
				data: _data
			}
			var color
			if (data && (color = data.color)) {
				if (color.charAt(0) === '#') {
					$actor.find(classes.header).css('background', color)
				} else {
					$actor.addClass(color)
				}
			}
			$actor
			.on('click', classes.remove, function(e) {
				e.stopPropagation()
				el.remove()
				
				/**
				 * 1、自上而下删除是摘除当前节点的父级对象中的 childNode 替换为当前 子级的 childNode
				 * 2、自下而上删除是直接摘除当前节点父级对象中的 childNode
				 * 重点在于：对当前父级对象的获取
				 */
				var _parent = _getParent(_data)

				// 判断当前节点是否含有childNode(即流转的下一节点)
				var _node = _get(_data, 'childNode')
				if (_node) {
					// 把子集childNode提升替换为当前节点childNode
					_remove(_maps, _get(_node, 'prevId'))
					_set(_node, 'prevId', _get(_parent, 'nodeId'))
					_set(_parent, 'childNode', _node)
				} else {
					_remove(_parent, 'childNode')
				}
			})
			.on('click', function(e) {
				if (options.handler) {
					options.handler.call(options, newNode, e)
				}
			})
			return newNode
		}
		/**
		 * 添加节点（条件）
		 */
		function addNode(node, options, isNew) {
			var el = node.el;
			var _data = node.data;

			options = options || {}
			var $panel = el.find(classes.panel)
			var data = options.node || {}
			if (typeof data.text == 'function') {
				data.text = data.text.apply(data.properties)
			}
			var $node = $(getTemplate(templates.node, data)).prependTo($panel)
			if (isNew) {
				_set(_data, {
					name: data.name || '未命名条件',
					type: options.type,
					properties: data.properties || {}
				})
			}
			var newNode = {
				el: $node,
				data: _data
			}
			$node
			.on('click', classes.remove, function(e) {
				e.stopPropagation()

				var _parent = _getParent(_getParent(_data))
				var _inner = _get(_parent, 'childNode')
				var _datas = _get(_inner, 'conditionNodes')
				var _count = _datas.length
				var index = _datas.indexOf(_data)

				var $col = el.closest(classes.col)
				// 判断当前是否只有两个条件
				// var count = $col.parent().find(classes.col).length
				if (_count <= 2) {
					// var index = $col.index()
					var _index = _count - index - 1;
					var $container = $col.closest(classes.container)
					if (_index !== index) {
						var _$col = _index > index ? $col.next() : $col.prev()
						
						// 筛选 子节点 （排除第一个条件节点及嵌套节点）
						var $nodes = _$col.find(classes.container).not(function(index) {
							return index === 0 || $.contains(_$col.get(0), $(this).parent().closest(classes.container).get(0))
						})
						.each(function() {
							$(this).insertBefore($container)
						})
					}
					$container.remove()
				} else {
					$col.remove()
				}

				if (index > -1) {
					_datas.splice(index, 1)
				}

				// 获取嵌套对象里最子集对象
				var getTreeNode = function(data) {
					var _data
					if (_get(data, 'childNode')) {
						return getTreeNode(_data)
					}
					return data
				}

				if (_count <= 2) {
					var data = _datas[0], 
						nextNode = _get(_inner, 'childNode'),
						actorNode = _get(data, 'childNode')

					/**
					 * 删除条件节点：当前要删除的（另一个保留的分支）
					 * 1、含有流转节点
					 * 	1)、条件节点含有下一流转节点（条件/节点）
					 * 	2)、没有下一流转节点
					 * 2、没有流转节点
					 * 	1)、条件节点含有下一流转节点
					 * 	2)、没有下一流转节点
					 */
					if (actorNode) {
						if (nextNode) {
							var innerNode = getTreeNode(actorNode)
							_remove(_maps, _get(nextNode, 'prevId'))
							_set(nextNode, 'prevId', _get(innerNode, 'nodeId'))
							_set(innerNode, 'childNode', nextNode)

							_remove(_maps, _get(actorNode, 'prevId'))
							_set(actorNode, 'prevId', _get(_parent, 'nodeId'))
							_set(_parent, 'childNode', actorNode)
						} else {
							_remove(_maps, _get(actorNode, 'prevId'))
							_set(actorNode, 'prevId', _get(_parent, 'nodeId'))
							_set(_parent, 'childNode', actorNode)
						}
					} else {
						if (nextNode) {
							_remove(_maps, _get(nextNode, 'prevId'))
							_set(nextNode, 'prevId', _get(_parent, 'nodeId'))
							_set(_parent, 'childNode', nextNode)
						} else {
							_remove(_maps, _get(_get(_parent, 'childNode'), 'prevId'))
							_remove(_parent, 'childNode')
						}
					}
				}
			})
			.on('click', classes.movePrev, function(e) {
				e.stopPropagation()
				var $col = el.closest(classes.col)
				$col.insertBefore($col.prev())
				
				var _parent = getParent(node.parent)
				var _inner = _get(_parent, 'childNode')
				var _datas = _get(_inner, 'conditionNodes')
				var index = _datas.indexOf(_data)
				if (index > 0) {
		          swap(_datas, index, index - 1);
		        }
			})
			.on('click', classes.moveNext, function(e) {
				e.stopPropagation()
				var $col = el.closest(classes.col)
				$col.insertAfter($col.next())

				var _parent = getParent(node.parent)
				var _inner = _get(_parent, 'childNode')
				var _datas = _get(_inner, 'conditionNodes')
				var index = _datas.indexOf(_data)
				if (index < _datas.length - 1) {
					swap(_datas, index, index + 1);
				}
			})
			.on('click', function(e) {
				if (options.handler) {
					options.handler.call(options, newNode, e)
				}
			})
			return newNode
		}
		/**
		 * 分支容器
		 */	
		function addLayout(node, options, isNew) {
			var _node = addContainer(node, isNew)
			var el = _node.el;
			var _data = _node.data;
			var $panel = el.find(classes.panel)
			var $btn = $(getTemplate(templates.colAdd)).prependTo($panel)
			var $row = addRow($btn)
			
			if (isNew) {
				_set(_data, {
					type: _types.route,
					properties: {},
					conditionNodes: []
				})
			}

			var newNode = {
				el: $row,
				container: el,
				data: _get(_data, 'conditionNodes')
			}

			$btn.on('click', function() {
				addNode(addContainer(addCol(newNode, true), true, 'prependTo'), options, true)
			})
			return newNode
		}
		function addRow(el) {
			return $(getTemplate(templates.row)).insertAfter(el)
		}

		/**
		 * 添加分支
		 */
		function addCol(node, isNew) {
			var el = node.el
			var _data = node.data;
			
			var data

			/**
			 * 新增列
			 * 1、手工录入：
			 * 2、数据装载：
			 *
			 * 内部填充条件节点，增加容器（addContainer），
			 * 用于区分子节点（childNode）控制，
			 * 判断后即删除（内部属性）
			 */
			if (isNew === true) {
				data = {
					$$type: 'condition'
				}
				_data.push(data)
				// data = _data[_data.length - 1]
			} else {
				data = isNew
				_set(data, {
					$$type: 'condition'
				})
			}

			return {
				el: $(getTemplate(templates.col)).appendTo(el),
				data: data
			}
		}
		
		function bindMenuEvents(node) {
			var el = node.el;
			$.ux.tips({
				el: el.find(classes.nodeAdd).get(0),
				content: getTemplate(templates.menu, {
					menus: config.menus
				}),
				onMount: function(instance) {
					var popper = instance.popper;

					$(popper).on('click.popper', classes.menu, function(e) {
						var index = $(this).index()
						var menu = (config.menus || [])[index];
						if (menu) {
							var type = menu.type;
							switch (type) {
								case _types.condition:
									var _node = addLayout(node, menu, true)
									addNode(addContainer(addCol(_node, true), true, 'prependTo'), menu, true)
									addNode(addContainer(addCol(_node, true), true, 'prependTo'), menu, true)
									break
								// case 'actor':
								default:
									var _node = addActor(addContainer(node, true), menu, true)
									if (menu.handler) {
										menu.handler.call(menu, _node, e)
									}
							}
						}
					})
				},
				onHidden: function(instance) {
					var popper = instance.popper;
					$(popper).off('.popper')
				}
			})
		}

		function addRoot(isNew) {
			root = $(classes.root).html(getTemplate(templates.root))

			if (isNew) {
				_set(_data, {
					type: 'start',
					properties: {}
				})
			}
			
			var el = root.find(classes.startNode)
			
			_apply(el, _data)

			bindMenuEvents({
				el: el,
				data: _data
			})

			return el
		}

		var _startNode
		function render() {
			if (_isNew()) {
				_startNode = addRoot(true)
			} else {
				_startNode = addRoot()
				load({
					el: _startNode,
					data: _data
				})
			}
		}
		function getStartNode() {
			return _startNode
		}

		function getMenuOptions(type, data) {
			var options = config.menus.filter(function(menu) {
					return menu.type === type
				})[0] || {}
			return $.extend(true, {}, options, {
				node: data
			})
		}
		function load(node) {
			var _data
			if (_data = _get(node.data, 'childNode')) {
				var _datas
				var $container
				if (_datas = _get(_data, 'conditionNodes')) {
					var options = getMenuOptions(_types.condition)
					var _node = addLayout(node, options)
					$container = _node.container

					_datas.forEach(function(data, index) {
						var prevNode = addContainer(addCol(_node, data), false, 'prependTo')
						addNode(prevNode, options)

						if (_get(data, 'childNode')) {
							load({
								el: prevNode.el,
								data: data
							})
						}
					})
				} else {
					var options = getMenuOptions(_data.type, _data)
					var _node = addContainer(node)
					$container = _node.el
					addActor(_node, options)
				}

				if (_get(_data, 'childNode')) {
					load({
						el: $container,
						data: _data
					})
				}
			}
		}
		function _ready(callback) {
			if ($.isReady) {
				callback()
			} else {
				$(document).ready(callback)
			}
		}
		function init() {
			_ready(render)
		}
		init()
		initEvents()
		
		// 排除掉 条件节点 的容器层
		function _filterNot(data) {
			return _get(data, 'type') !== _types.route
		}

		function _getValidRule(data) {
			var type = _get(data, 'type')
			var options = config.menus.filter(function(menu) {
					return menu.type === type
				})[0] || {}
			return options.valid
		}

		// 默认验证规则
		function _validRule(data) {
			var props = _get(data, 'properties')
			return !props || Object.keys(props).length === 0
		}
		
		// 对外 api
		return {
			/**
			 * 获取最终json（已做string转换）
			 */
			getJson: function() {
				return JSON.stringify(_data)
			},
			/**
			 * 设置对象扩展属性（支持链式操作）
			 * 同时对节点默认属性（params中参数名）做替换处理
			 * 
			 * .set(data, key, value)
			 * .set(data, {
			 * 		key1: value1,
			 * 		key2: value2,
			 * 		...
			 * })
			 */
			set: function() {
				_set.apply(this, arguments)
				return this;
			},
			/**
			 * 获取对象属性值
			 * 
			 * .get(data, key)
			 */
			get: _get,
			/**
			 * 设置节点name属性（简化api）
			 */
			setName: function(node, value) {
				var data = node.data
				this.set(this.get(data, 'name'), value)
				var el = node.el
				el.find(classes.name).html(value)
				return this;
			},
			/**
			 * 替换回显文本
			 */
			setText: function(el, text) {
				el.find(classes.text).html(text)
				return this;
			},
			/**
			 * 设置节点扩展属性（简化api）
			 */
			setProperties: function(data, properties) {
				this.set(this.get(data, 'properties'), properties)
				return this;
			},
			/**
			 * 节点非空验证规则
			 * 替换默认的全局验证规则
			 */
			rule: function(fn) {
				_validRule = fn
				return this;
			},
			/**
			 * 一次性全局校验
			 * fn[Function]：自定义校验规则
			 * 如果节点类型（menus）配置里有valid[Function]选项，则为当前节点类型的自定义验证规则
			 * 否则读取全局默认（或传入的自定义全局默认校验规则）
			 */
			validAll: function(fn) {
				fn = fn || _validRule
				var nodes = root.find(classes.container).filter(function() {
					var el = this
					var nodeId = _getId(el)
					var data = _maps[nodeId]
					var _fn = _getValidRule(data)
					return _filterNot(data) && (_fn ? _fn.call(this, data) : fn.call(this, data))
				})
				if (nodes.length) {
					nodes.addClass(_errorClass)
					return false
				}
				return true
			},
			/**
			 * 当前节点设置扩展属性后（警示或者销毁）验证提示
			 */
			valid: function(node, fn) {
				var data = node.data, 
					el = node.el.closest(classes.container)
				var _fn = _getValidRule(data)
				fn = fn || _fn || _validRule
				if (fn.call(el, data)) {
					el.addClass(_errorClass)
				} else {
					el.removeClass(_errorClass)
				}
				return this
			},
			/**
			 * 外部导入配置（数据）
			 */
			load: function(data) {
				_ready(function() {
					var el = getStartNode()
					_data = $.extend({}, _data, data)
					_maps[_get(_data, 'nodeId')] = _data
					load({
						el: el,
						data: _data
					})
				})
				return this
			}
		}
	}

	// CommonJS
    if ( typeof module === 'object' && typeof module.exports === 'object' ) {
        module.exports = Workflow;
    // AMD
    } else if ( typeof define === 'function' && define.amd) {
        define( [], function () {
            return Workflow;
        } );
    // window
    } else if ( !window.Workflow ) {
        window.Workflow = Workflow;
    }
})(jQuery, typeof window !== 'undefined' ? window : this)