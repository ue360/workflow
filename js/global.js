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
				moveBounded: true,
				onclose: function() {
					var me = this;
					setTimeout(function() {
						me.destroy()
					}, 500)
				}
			}
		};
		var defaultConfig = {
			main: function(cfg) {
				this.set('title', cfg.title);
				this.set('message', cfg.message);
				this.set('onok', cfg.onok);
				this.set('oncancel', cfg.oncancel);
				return this;
			},
			setup: function() {
				return defaultOptions;
			},
			build: function() {},
			prepare: function() {},
			setMessage: function(message) {
				this.setContent(message);
			},
			settings: {
				width: null,
				message: null,
				labels: null,
				onok: null,
				oncancel: null
			},
			settingUpdated: function(key, oldValue, newValue) {
				switch (key) {
					case 'message':
						this.setMessage(newValue);
						break;
					case 'center':
						this.elements.root.className += ' ajs-centered'
						break;
					case 'width':
						this.elements.dialog.style.width = typeof newValue === 'number' ? (newValue + 'px') : newValue
						break;
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

	var uid = ['0', '0', '0', '0'];
	var uidPrefix = 'fc-uuid-';

	function uuid() {
		var index = uid.length;
		var digit;

		while (index) {
			index--;
			digit = uid[index].charCodeAt(0);
			if (digit === 57 /*'9'*/ ) {
				uid[index] = 'A';
				return uidPrefix + uid.join('');
			}
			if (digit === 90 /*'Z'*/ ) {
				uid[index] = '0';
			} else {
				uid[index] = String.fromCharCode(digit + 1);
				return uidPrefix + uid.join('');
			}
		}
		uid.unshift('0');

		return uidPrefix + uid.join('');
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
		notify: alertify.notify
	})
})(jQuery)

;(function($, window) {
	var menus = [{
			type: 'actor', // 节点类型：actor-角色节点、node-条件节点
			icon: 'user-o', // 图标，参考 fontasome
			text: '审批人',
			iconColor: 'orange', // 图标颜色定制，默认蓝色
			data: { // 可预定义初始化时占位文本
				title: '直接主管审批',
				text: '连续多级主管'
			},
			handler: function() {
				$.ux.drawer({
					title: '选择审批人',
					message: '请选择审批人'
				})
			}
		}, {
			type: 'actor',
			icon: 'send',
			color: 'green', // 定义不同色块(blue/green/orange)，也支持色值(#b99a01)
			text: '抄送人'
		}, {
			type: 'node',
			icon: 'sitemap',
			text: '条件分支',
			iconColor: 'green'
		}]
	function Workflow(options) {
		var data = {}
		var defaults = {
				menus: menus,
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
				classes: {
					zoom: '#zoom',
					zoomOut: '.fc-zoom-out',
					zoomIn: '.fc-zoom-in',
					zoomText: '> span',
					root: '#box-scale',
					menu: '.fc-menu-item',
					startNode: '.start-node',
					nodeAdd: '.add-node-btn .fc-btn',
					container: '.fc-tree-wrap',
					panel: '.fc-tree-panel',
					row: '.fc-tree-row',
					col: '.fc-tree-col',
					header: '.fc-node-header',
					colAdd: '.add-col-btn',
					remove: '.fc-btn-close',
					movePrev: '.to-left',
					moveNext: '.to-right'
				}
			}
		$.extend(defaults, options);
		var root
			zoomScore = 1,
			templates = defaults.templates, 
			classes = defaults.classes;

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
			if (!document.getElementById(id)) {
				throw '模版未定义：' + id;
			}
			return template(id, data || {})
		}
		
		/**
		 * 容器
		 * @param {jq} el
		 * @param {string} mode 插入方式，默认 插入el下方 appendTo/prependTo/insertAfter/...
		 */
		function addContainer(el, mode) {
			mode = mode || 'insertAfter'
			var $container = $(getTemplate(templates.container))[mode](el)
			bindMenuEvents($container)

			return $container
		}
		function addActor(el, options) {
			options = options || {}
			var $panel = el.find(classes.panel)
			var data = options.data
			var $actor = $(getTemplate(templates.actor, data)).prependTo($panel)
			var color = options.color
			if (color) {
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
			})
			.on('click', function(e) {
				if (options.handler) {
					options.handler.call(options, $actor, e)
				}
			})
			return $actor
		}
		function addNode(el, options) {
			options = options || {}
			var $panel = el.find(classes.panel)
			var data = options.data
			var $node = $(getTemplate(templates.node, data)).prependTo($panel)
			$node
			.on('click', classes.remove, function(e) {
				e.stopPropagation()
				var $col = el.closest(classes.col)
				// 判断当前是否只有两个条件
				if ($col.parent().find(classes.col).length <= 2) {
					$col.closest(classes.container).remove()
				} else {
					$col.remove()
				}
			})
			.on('click', classes.movePrev, function(e) {
				e.stopPropagation()
				var $col = el.closest(classes.col)
				$col.insertBefore($col.prev())
			})
			.on('click', classes.moveNext, function(e) {
				e.stopPropagation()
				var $col = el.closest(classes.col)
				$col.insertAfter($col.next())
			})
			.on('click', function(e) {
				if (options.handler) {
					options.handler.call(options, $node, e)
				}
			})
			return $node
		}
		/**
		 * 分支容器
		 */
		function addLayout(el) {
			var $container = addContainer(el)
			var $panel = $container.find(classes.panel)
			var $btn = $(getTemplate(templates.colAdd)).prependTo($panel)
			var $row = addRow($btn)

			$btn.on('click', function() {
				addNode(addContainer(addCol($row), 'prependTo'))
			})
			return $row
		}
		function addRow(el) {
			return $(getTemplate(templates.row)).insertAfter(el)
		}
		function addCol(el) {
			return $(getTemplate(templates.col)).appendTo(el)
		}
		
		function bindMenuEvents(parent) {
			var el = parent.find(classes.nodeAdd).get(0);
			$.ux.tips({
				el: el,
				content: getTemplate(templates.menu, {
					menus: defaults.menus
				}),
				onMount: function(instance) {
					var popper = instance.popper;

					$(popper).on('click.popper', classes.menu, function(e) {
						var index = $(this).index()
						var menu = (defaults.menus || [])[index];
						if (menu) {
							var type = menu.type;
							switch (type) {
								case 'actor':
									var actor = addActor(addContainer(parent), menu)
									if (menu.handler) {
										menu.handler.call(menu, actor, e)
									}
									break
								case 'node':
								default:
									var $row = addLayout(parent)
									addNode(addContainer(addCol($row), 'prependTo'), menu)
									addNode(addContainer(addCol($row), 'prependTo'), menu)
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
		function render() {
			root = $(classes.root).html(getTemplate(templates.root))
			var startNode = root.find(classes.startNode)
			bindMenuEvents(startNode)
		}
		function init() {
			if ($.isReady) {
				render()
			} else {
				$(document).ready(render)
			}
		}
		init()
		initEvents()
		
		// 对外 api
		return {
			/**
			 * 添加节点块
			 */
			addContainer: addContainer,
			/**
			 * 添加节点
			 */
			addActor: addActor,
			/**
			 * 分支容器
			 */
			addLayout: addLayout,
			/**
			 * 添加分支
			 */
			addCol: addCol
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