/*plugin nstCehck*/
(function($) {
    $.existsN = function(nabir) {
        return (nabir.length > 0);
    };
    var nS = "nstcheck",
            methods = {
                init: function(options) {
                    if ($.existsN(this)) {
                        var settings = $.extend({
                            wrapper: $("label:has(.niceCheck)"),
                            elCheckWrap: '.niceCheck',
                            evCond: false,
                            classRemove: 'b_n',
                            before: function() {
                            },
                            after: function() {
                            }
                        }, options);
                        var frameChecks = $(this),
                                wrapper = settings.wrapper,
                                elCheckWrap = settings.elCheckWrap,
                                evCond = settings.evCond,
                                classRemove = settings.classRemove,
                                after = settings.after;
                        
                        //init event click on wrapper change state
                        frameChecks.find(wrapper).off('click.' + nS).on('click.' + nS, function(e) {
                            var $this = $(this),
                                    $thisD = $this.is('.disabled'),
                                    nstcheck = $this.find(elCheckWrap);
                            if (nstcheck.length === 0)
                                nstcheck = $this;
                            if (!$thisD) {
                                if (!evCond) {
                                    methods.changeCheck(nstcheck);
                                    after(frameChecks, $this, nstcheck, e);
                                }
                                else {
                                    settings.before(frameChecks, $this, nstcheck, e);
                                }
                            }
                            return false;
                        });
                        
                        //init event reset
                        var form = frameChecks.closest('form');
                        form.each(function() {
                            var $this = $(this),
                                    checked = $([]);
                            $this.find('input:checked').each(function() {
                                checked = checked.add($(this).parent());
                            });
                            $this.find('[type="reset"]').off('click.' + nS).on('click.' + nS, function() {
                                methods.checkAllReset($this.find(elCheckWrap).not(checked));
                                return false;
                            });
                        });
                        
                        //init events input
                        wrapper.find('input').off('mousedown.' + nS).on('mousedown.' + nS, function(e) {
                            e.stopPropagation();
                            if (e.button == 0)
                                $(this).closest(wrapper).trigger('click.' + nS);
                            return false;
                        }).off('click.' + nS).on('click.' + nS, function(e) {
                            e.stopPropagation();
                        }).off('keyup.' + nS).on('keyup.' + nS, function(e) {
                            if (e.keyCode === 32)
                                $(this).closest(wrapper).trigger('click.' + nS);
                        }).off('focus.' + nS).on('focus.' + nS, function(e) {
                            var $this = $(this);
                            $this.closest(wrapper).add($this.closest(elCheckWrap)).addClass('focus');
                        }).off('blur.' + nS).on('blur.' + nS, function(e) {
                            var $this = $(this);
                            $this.closest(wrapper).add($this.closest(elCheckWrap)).removeClass('focus');
                        }).off('change.' + nS).on('change.' + nS, function() {
                            return false;
                        });
                        
                        //init states of checkboxes
                        frameChecks.find(elCheckWrap).each(function() {
                            var $this = $(this).removeClass(classRemove).addClass(nS),
                                    input = $this.find('input');
                                    
                            methods._changeCheckStart($this);
                            if (input.is(':focus'))
                                input.trigger('focus.' + nS);
                            if (input.is(':disabled'))
                                methods.checkAllDisabled($this);
                            else
                                methods.checkAllEnabled($this);
                        });
                    }
                },
                _changeCheckStart: function(el) {
                    if (el === undefined)
                        el = this;
                    var input = el.find("input");
                    if (input.attr("checked") !== undefined) {
                        methods.checkChecked(el);
                    }
                    else {
                        methods.checkUnChecked(el);
                    }
                },
                checkChecked: function(el) {
                    if (el === undefined)
                        el = this;
                    var input = el.find("input");
                    if (input === undefined)
                        input = $(this).find("input");
                    el.addClass('active').parent().addClass('active');
                    input.attr("checked", 'checked');
                    $(document).trigger({
                        'type': nS + '.cc',
                        'el': el,
                        'input': input
                    });
                },
                checkUnChecked: function(el) {
                    if (el === undefined)
                        el = this;
                    var input = el.find("input");
                    if (input === undefined)
                        input = $(this).find("input");
                    el.removeClass('active').parent().removeClass('active');
                    input.removeAttr("checked");
                    $(document).trigger({
                        'type': nS + '.cuc',
                        'el': el,
                        'input': input
                    });
                },
                changeCheck: function(el)
                {
                    if (el === undefined)
                        el = this;
                    var input = el.find("input");
                    if (input.attr("checked") === undefined) {
                        methods.checkChecked(el);
                    }
                    else {
                        methods.checkUnChecked(el);
                    }
                },
                checkAllChecks: function(el)
                {
                    if (el === undefined)
                        el = this;
                    el.each(function() {
                        methods.checkChecked($(this));
                    });
                },
                checkAllReset: function(el)
                {
                    if (el === undefined)
                        el = this;
                    el.each(function() {
                        methods.checkUnChecked($(this));
                    });
                },
                checkAllDisabled: function(el)
                {
                    var el = el;
                    if (el === undefined)
                        el = this;
                    el.each(function() {
                        var input = el.find("input");
                        el.addClass('disabled').parent().addClass('disabled');
                        input.attr('disabled', 'disabled');
                        $(document).trigger({
                            'type': nS + '.ad',
                            'el': el,
                            'input': input
                        });
                    });
                },
                checkAllEnabled: function(el)
                {
                    if (el === undefined)
                        el = this;
                    el.each(function() {
                        var input = el.find("input");
                        el.removeClass('disabled').parent().removeClass('disabled');
                        input.removeAttr('disabled');
                        $(document).trigger({
                            'type': nS + '.ae',
                            'el': el,
                            'input': input
                        });
                    });
                }
            };
    $.fn.nStCheck = function(method) {
        if (methods[method]) {
            return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on $.nStCheck');
        }
    };
    $.nStCheck = function(m) {
        return methods[m];
    };
})(jQuery);
/*plugin nstCehck end*/