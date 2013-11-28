/*plugin nstCehck*/
(function($) {
    $.existsN = function(nabir) {
        return (nabir.length > 0);
    };
    var aC = 'active',
    dC = 'disabled',
    fC = 'focus',
    nS = "nstcheck",
    methods = {
        init: function(options) {
            if ($.existsN(this)) {
                var settings = $.extend({
                    wrapper: $("label:has(.niceCheck)"),
                    elCheckWrap: '.niceCheck',
                    evCond: false,
                    classRemove: 'b_n',
                    trigger: function() {
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
                frameChecks.find(wrapper).removeClass(dC+' '+aC+' '+fC).off('click.' + nS).on('click.' + nS, function(e) {
                    var $this = $(this),
                    $thisD = $this.hasClass(dC),
                    nstcheck = $this.find(elCheckWrap).removeClass(dC+' '+aC+' '+fC);
                    if (nstcheck.length === 0)
                        nstcheck = $this;
                    if (!$thisD) {
                        if (!evCond) {
                            methods.changeCheck(nstcheck);
                            after(frameChecks, $this, nstcheck, e);
                        }
                        else {
                            settings.trigger(frameChecks, $this, nstcheck, e);
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
                        var wrap = $this.find(elCheckWrap);
                        methods.checkAllReset(wrap.not(checked));
                        methods.checkAllChecks(wrap.not('.'+aC).filter(checked));
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
                    return false;
                }).off('keyup.' + nS).on('keyup.' + nS, function(e) {
                    if (e.keyCode === 32)
                        $(this).closest(wrapper).trigger('click.' + nS);
                }).off('focus.' + nS).on('focus.' + nS, function(e) {
                    var $this = $(this);
                    $this.closest(wrapper).add($this.closest(elCheckWrap)).addClass(fC);
                }).off('blur.' + nS).on('blur.' + nS, function(e) {
                    var $this = $(this);
                    $this.closest(wrapper).add($this.closest(elCheckWrap)).removeClass(fC);
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
            el.addClass(aC).parent().addClass(aC);
            input.attr("checked", 'checked');
            input.trigger({
                'type': nS + '.cc',
                'el': el
            });
        },
        checkUnChecked: function(el) {
            if (el === undefined)
                el = this;
            var input = el.find("input");
            el.removeClass(aC).parent().removeClass(aC);
            input.removeAttr("checked");
            input.trigger({
                'type': nS + '.cuc',
                'el': el
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
            if (el === undefined)
                el = this;
            el.each(function() {
                var $this = $(this),
                input = $this.find("input");
                $this.addClass(dC).parent().addClass(dC);
                input.attr('disabled', 'disabled');
                input.trigger({
                    'type': nS + '.ad',
                    'el': $this
                });
            });
        },
        checkAllEnabled: function(el)
        {
            if (el === undefined)
                el = this;
            el.each(function() {
                var $this = $(this),
                input = $this.find("input");
                $this.removeClass(dC).parent().removeClass(dC);
                input.removeAttr('disabled');
                input.trigger({
                    'type': nS + '.ae',
                    'el': $this
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