/*!
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
/* eslint-env browser */

/*  jQuery Nice Select - v1.1.0
    https://github.com/hernansartorio/jquery-nice-select
    Made by Hernán Sartorio  */
 
    (function($) {

      $.fn.niceSelect = function(method) {
        
        // Methods
        if (typeof method == 'string') {      
          if (method == 'update') {
            this.each(function() {
              var $select = $(this);
              var $dropdown = $(this).next('.nice-select');
              var open = $dropdown.hasClass('open');
              
              if ($dropdown.length) {
                $dropdown.remove();
                create_nice_select($select);
                
                if (open) {
                  $select.next().trigger('click');
                }
              }
            });
          } else if (method == 'destroy') {
            this.each(function() {
              var $select = $(this);
              var $dropdown = $(this).next('.nice-select');
              
              if ($dropdown.length) {
                $dropdown.remove();
                $select.css('display', '');
              }
            });
            if ($('.nice-select').length == 0) {
              $(document).off('.nice_select');
            }
          } else {
            console.log('Method "' + method + '" does not exist.')
          }
          return this;
        }
          
        // Hide native select
        this.hide();
        
        // Create custom markup
        this.each(function() {
          var $select = $(this);
          
          if (!$select.next().hasClass('nice-select')) {
            create_nice_select($select);
          }
        });
        
        function create_nice_select($select) {
          $select.after($('<div></div>')
            .addClass('nice-select')
            .addClass($select.attr('class') || '')
            .addClass($select.attr('disabled') ? 'disabled' : '')
            .attr('tabindex', $select.attr('disabled') ? null : '0')
            .html('<span class="current"></span><ul class="list"></ul>')
          );
            
          var $dropdown = $select.next();
          var $options = $select.find('option');
          var $selected = $select.find('option:selected');
          
          $dropdown.find('.current').html($selected.data('display') || $selected.text());
          
          $options.each(function(i) {
            var $option = $(this);
            var display = $option.data('display');
    
            $dropdown.find('ul').append($('<li></li>')
              .attr('data-value', $option.val())
              .attr('data-display', (display || null))
              .addClass('option' +
                ($option.is(':selected') ? ' selected' : '') +
                ($option.is(':disabled') ? ' disabled' : ''))
              .html($option.text())
            );
          });
        }
        
        /* Event listeners */
        
        // Unbind existing events in case that the plugin has been initialized before
        $(document).off('.nice_select');
        
        // Open/close
        $(document).on('click.nice_select', '.nice-select', function(event) {
          var $dropdown = $(this);
          
          $('.nice-select').not($dropdown).removeClass('open');
          $dropdown.toggleClass('open');
          
          if ($dropdown.hasClass('open')) {
            $dropdown.find('.option');  
            $dropdown.find('.focus').removeClass('focus');
            $dropdown.find('.selected').addClass('focus');
          } else {
            $dropdown.focus();
          }
        });
        
        // Close when clicking outside
        $(document).on('click.nice_select', function(event) {
          if ($(event.target).closest('.nice-select').length === 0) {
            $('.nice-select').removeClass('open').find('.option');  
          }
        });
        
        // Option click
        $(document).on('click.nice_select', '.nice-select .option:not(.disabled)', function(event) {
          var $option = $(this);
          var $dropdown = $option.closest('.nice-select');
          
          $dropdown.find('.selected').removeClass('selected');
          $option.addClass('selected');
          
          var text = $option.data('display') || $option.text();
          $dropdown.find('.current').text(text);
          
          $dropdown.prev('select').val($option.data('value')).trigger('change');
        });
    
        // Keyboard events
        $(document).on('keydown.nice_select', '.nice-select', function(event) {    
          var $dropdown = $(this);
          var $focused_option = $($dropdown.find('.focus') || $dropdown.find('.list .option.selected'));
          
          // Space or Enter
          if (event.keyCode == 32 || event.keyCode == 13) {
            if ($dropdown.hasClass('open')) {
              $focused_option.trigger('click');
            } else {
              $dropdown.trigger('click');
            }
            return false;
          // Down
          } else if (event.keyCode == 40) {
            if (!$dropdown.hasClass('open')) {
              $dropdown.trigger('click');
            } else {
              var $next = $focused_option.nextAll('.option:not(.disabled)').first();
              if ($next.length > 0) {
                $dropdown.find('.focus').removeClass('focus');
                $next.addClass('focus');
              }
            }
            return false;
          // Up
          } else if (event.keyCode == 38) {
            if (!$dropdown.hasClass('open')) {
              $dropdown.trigger('click');
            } else {
              var $prev = $focused_option.prevAll('.option:not(.disabled)').first();
              if ($prev.length > 0) {
                $dropdown.find('.focus').removeClass('focus');
                $prev.addClass('focus');
              }
            }
            return false;
          // Esc
          } else if (event.keyCode == 27) {
            if ($dropdown.hasClass('open')) {
              $dropdown.trigger('click');
            }
          // Tab
          } else if (event.keyCode == 9) {
            if ($dropdown.hasClass('open')) {
              return false;
            }
          }
        });
    
        // Detect CSS pointer-events support, for IE <= 10. From Modernizr.
        var style = document.createElement('a').style;
        style.cssText = 'pointer-events:auto';
        if (style.pointerEvents !== 'auto') {
          $('html').addClass('no-csspointerevents');
        }
        
        return this;
    
      };
    
  var defaultOptions = {
    tagClass: function(item) {
      return 'badge badge-info';
    },
    focusClass: 'focus',
    itemValue: function(item) {
      return item ? item.toString() : item;
    },
    itemText: function(item) {
      return this.itemValue(item);
    },
    itemTitle: function(item) {
      return null;
    },
    freeInput: true,
    addOnBlur: true,
    maxTags: undefined,
    maxChars: undefined,
    confirmKeys: [13, 44],
    delimiter: ',',
    delimiterRegex: null,
    cancelConfirmKeysOnEmpty: false,
    onTagExists: function(item, $tag) {
      $tag.hide().fadeIn();
    },
    trimValue: false,
    allowDuplicates: false,
    triggerChange: true,
    editOnBackspace: false
  };

  /**
   * Constructor function
   */
  function TagsInput(element, options) {
    this.isInit = true;
    this.itemsArray = [];

    this.$element = $(element);
    this.$element.addClass('sr-only');

    this.isSelect = (element.tagName === 'SELECT');
    this.multiple = (this.isSelect && element.hasAttribute('multiple'));
    this.objectItems = options && options.itemValue;
    this.placeholderText = element.hasAttribute('placeholder') ? this.$element.attr('placeholder') : '';
    this.inputSize = Math.max(1, this.placeholderText.length);

    this.$container = $('<div class="bootstrap-tagsinput"></div>');
    this.$input = $('<input type="text" placeholder="' + this.placeholderText + '"/>').appendTo(this.$container);

    this.$element.before(this.$container);

    this.build(options);
    this.isInit = false;
  }

  TagsInput.prototype = {
    constructor: TagsInput,

    /**
     * Adds the given item as a new tag. Pass true to dontPushVal to prevent
     * updating the elements val()
     */
    add: function(item, dontPushVal, options) {
      var self = this;

      if (self.options.maxTags && self.itemsArray.length >= self.options.maxTags)
        return;

      // Ignore falsey values, except false
      if (item !== false && !item)
        return;

      // Trim value
      if (typeof item === "string" && self.options.trimValue) {
        item = $.trim(item);
      }

      // Throw an error when trying to add an object while the itemValue option was not set
      if (typeof item === "object" && !self.objectItems)
        throw("Can't add objects when itemValue option is not set");

      // Ignore strings only containg whitespace
      if (item.toString().match(/^\s*$/))
        return;

      // If SELECT but not multiple, remove current tag
      if (self.isSelect && !self.multiple && self.itemsArray.length > 0)
        self.remove(self.itemsArray[0]);

      if (typeof item === "string" && this.$element[0].tagName === 'INPUT') {
        var delimiter = (self.options.delimiterRegex) ? self.options.delimiterRegex : self.options.delimiter;
        var items = item.split(delimiter);
        if (items.length > 1) {
          for (var i = 0; i < items.length; i++) {
            this.add(items[i], true);
          }

          if (!dontPushVal)
            self.pushVal(self.options.triggerChange);
          return;
        }
      }

      var itemValue = self.options.itemValue(item),
          itemText = self.options.itemText(item),
          tagClass = self.options.tagClass(item),
          itemTitle = self.options.itemTitle(item);

      // Ignore items allready added
      var existing = $.grep(self.itemsArray, function(item) { return self.options.itemValue(item) === itemValue; } )[0];
      if (existing && !self.options.allowDuplicates) {
        // Invoke onTagExists
        if (self.options.onTagExists) {
          var $existingTag = $(".badge", self.$container).filter(function() { return $(this).data("item") === existing; });
          self.options.onTagExists(item, $existingTag);
        }
        return;
      }

      // if length greater than limit
      if (self.items().toString().length + item.length + 1 > self.options.maxInputLength)
        return;

      // raise beforeItemAdd arg
      var beforeItemAddEvent = $.Event('beforeItemAdd', { item: item, cancel: false, options: options});
      self.$element.trigger(beforeItemAddEvent);
      if (beforeItemAddEvent.cancel)
        return;

      // register item in internal array and map
      self.itemsArray.push(item);

      // add a tag element

      var $tag = $('<span class="' + htmlEncode(tagClass) + (itemTitle !== null ? ('" title="' + itemTitle) : '') + '">' + htmlEncode(itemText) + '<span data-role="remove"></span></span>');
      $tag.data('item', item);
      self.findInputWrapper().before($tag);

      // Check to see if the tag exists in its raw or uri-encoded form
      var optionExists = (
        $('option[value="' + encodeURIComponent(itemValue).replace(/"/g, '\\"') + '"]', self.$element).length ||
        $('option[value="' + htmlEncode(itemValue).replace(/"/g, '\\"') + '"]', self.$element).length
      );

      // add <option /> if item represents a value not present in one of the <select />'s options
      if (self.isSelect && !optionExists) {
        var $option = $('<option selected>' + htmlEncode(itemText) + '</option>');
        $option.data('item', item);
        $option.attr('value', itemValue);
        self.$element.append($option);
      }

      if (!dontPushVal)
        self.pushVal(self.options.triggerChange);

      // Add class when reached maxTags
      if (self.options.maxTags === self.itemsArray.length || self.items().toString().length === self.options.maxInputLength)
        self.$container.addClass('bootstrap-tagsinput-max');

      // If using typeahead, once the tag has been added, clear the typeahead value so it does not stick around in the input.
      if ($('.typeahead, .twitter-typeahead', self.$container).length) {
        self.$input.typeahead('val', '');
      }

      if (this.isInit) {
        self.$element.trigger($.Event('itemAddedOnInit', { item: item, options: options }));
      } else {
        self.$element.trigger($.Event('itemAdded', { item: item, options: options }));
      }
    },

    /**
     * Removes the given item. Pass true to dontPushVal to prevent updating the
     * elements val()
     */
    remove: function(item, dontPushVal, options) {
      var self = this;

      if (self.objectItems) {
        if (typeof item === "object")
          item = $.grep(self.itemsArray, function(other) { return self.options.itemValue(other) ==  self.options.itemValue(item); } );
        else
          item = $.grep(self.itemsArray, function(other) { return self.options.itemValue(other) ==  item; } );

        item = item[item.length-1];
      }

      if (item) {
        var beforeItemRemoveEvent = $.Event('beforeItemRemove', { item: item, cancel: false, options: options });
        self.$element.trigger(beforeItemRemoveEvent);
        if (beforeItemRemoveEvent.cancel)
          return;

        $('.badge', self.$container).filter(function() { return $(this).data('item') === item; }).remove();
        $('option', self.$element).filter(function() { return $(this).data('item') === item; }).remove();
        if($.inArray(item, self.itemsArray) !== -1)
          self.itemsArray.splice($.inArray(item, self.itemsArray), 1);
      }

      if (!dontPushVal)
        self.pushVal(self.options.triggerChange);

      // Remove class when reached maxTags
      if (self.options.maxTags > self.itemsArray.length)
        self.$container.removeClass('bootstrap-tagsinput-max');

      self.$element.trigger($.Event('itemRemoved',  { item: item, options: options }));
    },

    /**
     * Removes all items
     */
    removeAll: function() {
      var self = this;

      $('.badge', self.$container).remove();
      $('option', self.$element).remove();

      while(self.itemsArray.length > 0)
        self.itemsArray.pop();

      self.pushVal(self.options.triggerChange);
    },

    /**
     * Refreshes the tags so they match the text/value of their corresponding
     * item.
     */
    refresh: function() {
      var self = this;
      $('.badge', self.$container).each(function() {
        var $tag = $(this),
            item = $tag.data('item'),
            itemValue = self.options.itemValue(item),
            itemText = self.options.itemText(item),
            tagClass = self.options.tagClass(item);

          // Update tag's class and inner text
          $tag.attr('class', null);
          $tag.addClass('badge ' + htmlEncode(tagClass));
          $tag.contents().filter(function() {
            return this.nodeType == 3;
          })[0].nodeValue = htmlEncode(itemText);

          if (self.isSelect) {
            var option = $('option', self.$element).filter(function() { return $(this).data('item') === item; });
            option.attr('value', itemValue);
          }
      });
    },

    /**
     * Returns the items added as tags
     */
    items: function() {
      return this.itemsArray;
    },

    /**
     * Assembly value by retrieving the value of each item, and set it on the
     * element.
     */
    pushVal: function() {
      var self = this,
          val = $.map(self.items(), function(item) {
            return self.options.itemValue(item).toString();
          });

      self.$element.val( val.join(self.options.delimiter) );

      if (self.options.triggerChange)
        self.$element.trigger('change');
    },

    /**
     * Initializes the tags input behaviour on the element
     */
    build: function(options) {
      var self = this;

      self.options = $.extend({}, defaultOptions, options);
      // When itemValue is set, freeInput should always be false
      if (self.objectItems)
        self.options.freeInput = false;

      makeOptionItemFunction(self.options, 'itemValue');
      makeOptionItemFunction(self.options, 'itemText');
      makeOptionFunction(self.options, 'tagClass');

      // Typeahead Bootstrap version 2.3.2
      if (self.options.typeahead) {
        var typeahead = self.options.typeahead || {};

        makeOptionFunction(typeahead, 'source');

        self.$input.typeahead($.extend({}, typeahead, {
          source: function (query, process) {
            function processItems(items) {
              var texts = [];

              for (var i = 0; i < items.length; i++) {
                var text = self.options.itemText(items[i]);
                map[text] = items[i];
                texts.push(text);
              }
              process(texts);
            }

            this.map = {};
            var map = this.map,
                data = typeahead.source(query);

            if ($.isFunction(data.success)) {
              // support for Angular callbacks
              data.success(processItems);
            } else if ($.isFunction(data.then)) {
              // support for Angular promises
              data.then(processItems);
            } else {
              // support for functions and jquery promises
              $.when(data)
               .then(processItems);
            }
          },
          updater: function (text) {
            self.add(this.map[text]);
            return this.map[text];
          },
          matcher: function (text) {
            return (text.toLowerCase().indexOf(this.query.trim().toLowerCase()) !== -1);
          },
          sorter: function (texts) {
            return texts.sort();
          },
          highlighter: function (text) {
            var regex = new RegExp( '(' + this.query + ')', 'gi' );
            return text.replace( regex, "<strong>$1</strong>" );
          }
        }));
      }

      // typeahead.js
      if (self.options.typeaheadjs) {
        // Determine if main configurations were passed or simply a dataset
        var typeaheadjs = self.options.typeaheadjs;
        if (!$.isArray(typeaheadjs)) {
            typeaheadjs = [null, typeaheadjs];
        }

        $.fn.typeahead.apply(self.$input, typeaheadjs).on('typeahead:selected', $.proxy(function (obj, datum, name) {
          var index = 0;
          typeaheadjs.some(function(dataset, _index) {
            if (dataset.name === name) {
              index = _index;
              return true;
            }
            return false;
          });

          // @TODO Dep: https://github.com/corejavascript/typeahead.js/issues/89
          if (typeaheadjs[index].valueKey) {
            self.add(datum[typeaheadjs[index].valueKey]);
          } else {
            self.add(datum);
          }

          self.$input.typeahead('val', '');
        }, self));
      }

      self.$container.on('click', $.proxy(function(event) {
        if (! self.$element.attr('disabled')) {
          self.$input.removeAttr('disabled');
        }
        self.$input.focus();
      }, self));

        if (self.options.addOnBlur && self.options.freeInput) {
          self.$input.on('focusout', $.proxy(function(event) {
              // HACK: only process on focusout when no typeahead opened, to
              //       avoid adding the typeahead text as tag
              if ($('.typeahead, .twitter-typeahead', self.$container).length === 0) {
                self.add(self.$input.val());
                self.$input.val('');
              }
          }, self));
        }

      // Toggle the 'focus' css class on the container when it has focus
      self.$container.on({
        focusin: function() {
          self.$container.addClass(self.options.focusClass);
        },
        focusout: function() {
          self.$container.removeClass(self.options.focusClass);
        },
      });

      self.$container.on('keydown', 'input', $.proxy(function(event) {
        var $input = $(event.target),
            $inputWrapper = self.findInputWrapper();

        if (self.$element.attr('disabled')) {
          self.$input.attr('disabled', 'disabled');
          return;
        }

        switch (event.which) {
          // BACKSPACE
          case 8:
            if (doGetCaretPosition($input[0]) === 0) {
              var prev = $inputWrapper.prev();
              if (prev.length) {
                if (self.options.editOnBackspace === true) {
                  $input.val(prev.data('item'));
                }
                self.remove(prev.data('item'));
              }
            }
            break;

          // DELETE
          case 46:
            if (doGetCaretPosition($input[0]) === 0) {
              var next = $inputWrapper.next();
              if (next.length) {
                self.remove(next.data('item'));
              }
            }
            break;

          // LEFT ARROW
          case 37:
            // Try to move the input before the previous tag
            var $prevTag = $inputWrapper.prev();
            if ($input.val().length === 0 && $prevTag[0]) {
              $prevTag.before($inputWrapper);
              $input.focus();
            }
            break;
          // RIGHT ARROW
          case 39:
            // Try to move the input after the next tag
            var $nextTag = $inputWrapper.next();
            if ($input.val().length === 0 && $nextTag[0]) {
              $nextTag.after($inputWrapper);
              $input.focus();
            }
            break;
         default:
             // ignore
         }

        // Reset internal input's size
        var textLength = $input.val().length,
            wordSpace = Math.ceil(textLength / 5),
            size = textLength + wordSpace + 1;
        $input.attr('size', Math.max(this.inputSize, size));
      }, self));

      self.$container.on('keypress', 'input', $.proxy(function(event) {
         var $input = $(event.target);

         if (self.$element.attr('disabled')) {
            self.$input.attr('disabled', 'disabled');
            return;
         }

         var text = $input.val(),
         maxLengthReached = self.options.maxChars && text.length >= self.options.maxChars;
         if (self.options.freeInput && (keyCombinationInList(event, self.options.confirmKeys) || maxLengthReached)) {
            // Only attempt to add a tag if there is data in the field
            if (text.length !== 0) {
               self.add(maxLengthReached ? text.substr(0, self.options.maxChars) : text);
               $input.val('');
            }

            // If the field is empty, let the event triggered fire as usual
            if (self.options.cancelConfirmKeysOnEmpty === false) {
                event.preventDefault();
            }
         }

         // Reset internal input's size
         var textLength = $input.val().length,
            wordSpace = Math.ceil(textLength / 5),
            size = textLength + wordSpace + 1;
         $input.attr('size', Math.max(this.inputSize, size));
      }, self));

      // Remove icon clicked
      self.$container.on('click', '[data-role=remove]', $.proxy(function(event) {
        if (self.$element.attr('disabled')) {
          return;
        }
        self.remove($(event.target).closest('.badge').data('item'));
      }, self));

      // Only add existing value as tags when using strings as tags
      if (self.options.itemValue === defaultOptions.itemValue) {
        if (self.$element[0].tagName === 'INPUT') {
            self.add(self.$element.val());
        } else {
          $('option', self.$element).each(function() {
            self.add($(this).attr('value'), true);
          });
        }
      }
    },

    /**
     * Removes all tagsinput behaviour and unregsiter all event handlers
     */
    destroy: function() {
      var self = this;

      // Unbind events
      self.$container.off('keypress', 'input');
      self.$container.off('click', '[role=remove]');

      self.$container.remove();
      self.$element.removeData('tagsinput');
      self.$element.show();
    },

    /**
     * Sets focus on the tagsinput
     */
    focus: function() {
      this.$input.focus();
    },

    /**
     * Returns the internal input element
     */
    input: function() {
      return this.$input;
    },

    /**
     * Returns the element which is wrapped around the internal input. This
     * is normally the $container, but typeahead.js moves the $input element.
     */
    findInputWrapper: function() {
      var elt = this.$input[0],
          container = this.$container[0];
      while(elt && elt.parentNode !== container)
        elt = elt.parentNode;

      return $(elt);
    }
  };

  /**
   * Register JQuery plugin
   */
  $.fn.tagsinput = function(arg1, arg2, arg3) {
    var results = [];

    this.each(function() {
      var tagsinput = $(this).data('tagsinput');
      // Initialize a new tags input
      if (!tagsinput) {
          tagsinput = new TagsInput(this, arg1);
          $(this).data('tagsinput', tagsinput);
          results.push(tagsinput);

          if (this.tagName === 'SELECT') {
              $('option', $(this)).attr('selected', 'selected');
          }

          // Init tags from $(this).val()
          $(this).val($(this).val());
      } else if (!arg1 && !arg2) {
          // tagsinput already exists
          // no function, trying to init
          results.push(tagsinput);
      } else if(tagsinput[arg1] !== undefined) {
          // Invoke function on existing tags input
            if(tagsinput[arg1].length === 3 && arg3 !== undefined){
               var retVal = tagsinput[arg1](arg2, null, arg3);
            }else{
               var retVal = tagsinput[arg1](arg2);
            }
          if (retVal !== undefined)
              results.push(retVal);
      }
    });

    if ( typeof arg1 == 'string') {
      // Return the results from the invoked function calls
      return results.length > 1 ? results : results[0];
    } else {
      return results;
    }
  };

  $.fn.tagsinput.Constructor = TagsInput;

  /**
   * Most options support both a string or number as well as a function as
   * option value. This function makes sure that the option with the given
   * key in the given options is wrapped in a function
   */
  function makeOptionItemFunction(options, key) {
    if (typeof options[key] !== 'function') {
      var propertyName = options[key];
      options[key] = function(item) { return item[propertyName]; };
    }
  }
  function makeOptionFunction(options, key) {
    if (typeof options[key] !== 'function') {
      var value = options[key];
      options[key] = function() { return value; };
    }
  }
  /**
   * HtmlEncodes the given value
   */
  var htmlEncodeContainer = $('<div />');
  function htmlEncode(value) {
    if (value) {
      return htmlEncodeContainer.text(value).html();
    } else {
      return '';
    }
  }

  /**
   * Returns the position of the caret in the given input field
   * http://flightschool.acylt.com/devnotes/caret-position-woes/
   */
  function doGetCaretPosition(oField) {
    var iCaretPos = 0;
    if (document.selection) {
      oField.focus ();
      var oSel = document.selection.createRange();
      oSel.moveStart ('character', -oField.value.length);
      iCaretPos = oSel.text.length;
    } else if (oField.selectionStart || oField.selectionStart == '0') {
      iCaretPos = oField.selectionStart;
    }
    return (iCaretPos);
  }

  /**
    * Returns boolean indicates whether user has pressed an expected key combination.
    * @param object keyPressEvent: JavaScript event object, refer
    *     http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
    * @param object lookupList: expected key combinations, as in:
    *     [13, {which: 188, shiftKey: true}]
    */
  function keyCombinationInList(keyPressEvent, lookupList) {
      var found = false;
      $.each(lookupList, function (index, keyCombination) {
          if (typeof (keyCombination) === 'number' && keyPressEvent.which === keyCombination) {
              found = true;
              return false;
          }

          if (keyPressEvent.which === keyCombination.which) {
              var alt = !keyCombination.hasOwnProperty('altKey') || keyPressEvent.altKey === keyCombination.altKey,
                  shift = !keyCombination.hasOwnProperty('shiftKey') || keyPressEvent.shiftKey === keyCombination.shiftKey,
                  ctrl = !keyCombination.hasOwnProperty('ctrlKey') || keyPressEvent.ctrlKey === keyCombination.ctrlKey;
              if (alt && shift && ctrl) {
                  found = true;
                  return false;
              }
          }
      });

      return found;
  }

  /**
   * Initialize tagsinput behaviour on inputs and selects which have
   * data-role=tagsinput
   */
  $(function() {
    $("input[data-role=tagsinput], select[multiple][data-role=tagsinput]").tagsinput();
  });
    }(jQuery));
    (function ($) {
      'use strict';
    
      $.fn.loadMoreResults = function (options) {
    
        var defaults = {
          tag: {
            name: 'div',
            'class': 'item'
          },
          displayedItems: 5,
          showItems: 5,
          button: {
            'class': 'btn-load-more',
            text: 'Load More'
          }
        };
    
        var opts = $.extend(true, {}, defaults, options);
    
        var alphaNumRE = /^[A-Za-z][-_A-Za-z0-9]+$/;
        var numRE = /^[0-9]+$/;
    
        $.each(opts, function validateOptions(key, val) {
          if (key === 'tag') {
            formatCheck(key, val, 'name', 'string');
            formatCheck(key, val, 'class', 'string');
          }
          if (key === 'displayedItems') {
            formatCheck(key, val, null, 'number');
          }
          if (key === 'showItems') {
            formatCheck(key, val, null, 'number');
          }
          if (key === 'button') {
            formatCheck(key, val, 'class', 'string');
          }
        });
    
        function formatCheck(key, val, prop, typ) {
          if (prop !== null && typeof prop !== 'object') {
            if (typeof val[prop] !== typ || String(val[prop]).match(typ == 'string' ? alphaNumRE : numRE) === null) {
              opts[key][prop] = defaults[key][prop];
            }
          } else {
            if (typeof val !== typ || String(val).match(typ == 'string' ? alphaNumRE : numRE) === null) {
              opts[key] = defaults[key];
            }
          }
        };
    
        return this.each(function (index, element) {
          var $list = $(element),
              lc = $list.find(' > ' + opts.tag.name + '.' + opts.tag.class).length,
              dc = parseInt(opts.displayedItems),
              sc = parseInt(opts.showItems);
          
          $list.find(' > ' + opts.tag.name + '.' + opts.tag.class + ':lt(' + dc + ')').css("display", "inline-block");
          $list.find(' > ' + opts.tag.name + '.' + opts.tag.class + ':gt(' + (dc - 1) + ')').css("display", "none");
    
          $list.parent().append('<button class="btn-view ' + opts.button.class + '">' + opts.button.text + '</button>');
          $list.parent().on("click", ".btn-view", function (e) {
            e.preventDefault();
            dc = (dc + sc <= lc) ? dc + sc : lc;
            
            $list.find(' > ' + opts.tag.name + '.' + opts.tag.class + ':lt(' + dc + ')').fadeIn();
            if (dc == lc) {
              $(this).hide();
            }
          });
        });
    
      };
    })(jQuery);
/*
 * International Telephone Input v15.1.0
 * https://github.com/jackocnr/intl-tel-input.git
 * Licensed under the MIT license
 */

!function(a){"object"==typeof module&&module.exports?module.exports=a(require("jquery"),window,document):"function"==typeof define&&define.amd?define(["jquery"],function(b){a(b,window,document)}):a(jQuery,window,document)}(function(a,b,c,d){"use strict";function e(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function f(a,b){for(var c=0;c<b.length;c++){var d=b[c];d.enumerable=d.enumerable||!1,d.configurable=!0,"value"in d&&(d.writable=!0),Object.defineProperty(a,d.key,d)}}function g(a,b,c){return b&&f(a.prototype,b),c&&f(a,c),a}for(var h=[["Afghanistan (‫افغانستان‬‎)","af","93"],["Albania (Shqipëri)","al","355"],["Algeria (‫الجزائر‬‎)","dz","213"],["American Samoa","as","1684"],["Andorra","ad","376"],["Angola","ao","244"],["Anguilla","ai","1264"],["Antigua and Barbuda","ag","1268"],["Argentina","ar","54"],["Armenia (Հայաստան)","am","374"],["Aruba","aw","297"],["Australia","au","61",0],["Austria (Österreich)","at","43"],["Azerbaijan (Azərbaycan)","az","994"],["Bahamas","bs","1242"],["Bahrain (‫البحرين‬‎)","bh","973"],["Bangladesh (বাংলাদেশ)","bd","880"],["Barbados","bb","1246"],["Belarus (Беларусь)","by","375"],["Belgium (België)","be","32"],["Belize","bz","501"],["Benin (Bénin)","bj","229"],["Bermuda","bm","1441"],["Bhutan (འབྲུག)","bt","975"],["Bolivia","bo","591"],["Bosnia and Herzegovina (Босна и Херцеговина)","ba","387"],["Botswana","bw","267"],["Brazil (Brasil)","br","55"],["British Indian Ocean Territory","io","246"],["British Virgin Islands","vg","1284"],["Brunei","bn","673"],["Bulgaria (България)","bg","359"],["Burkina Faso","bf","226"],["Burundi (Uburundi)","bi","257"],["Cambodia (កម្ពុជា)","kh","855"],["Cameroon (Cameroun)","cm","237"],["Canada","ca","1",1,["204","226","236","249","250","289","306","343","365","387","403","416","418","431","437","438","450","506","514","519","548","579","581","587","604","613","639","647","672","705","709","742","778","780","782","807","819","825","867","873","902","905"]],["Cape Verde (Kabu Verdi)","cv","238"],["Caribbean Netherlands","bq","599",1],["Cayman Islands","ky","1345"],["Central African Republic (République centrafricaine)","cf","236"],["Chad (Tchad)","td","235"],["Chile","cl","56"],["China (中国)","cn","86"],["Christmas Island","cx","61",2],["Cocos (Keeling) Islands","cc","61",1],["Colombia","co","57"],["Comoros (‫جزر القمر‬‎)","km","269"],["Congo (DRC) (Jamhuri ya Kidemokrasia ya Kongo)","cd","243"],["Congo (Republic) (Congo-Brazzaville)","cg","242"],["Cook Islands","ck","682"],["Costa Rica","cr","506"],["Côte d’Ivoire","ci","225"],["Croatia (Hrvatska)","hr","385"],["Cuba","cu","53"],["Curaçao","cw","599",0],["Cyprus (Κύπρος)","cy","357"],["Czech Republic (Česká republika)","cz","420"],["Denmark (Danmark)","dk","45"],["Djibouti","dj","253"],["Dominica","dm","1767"],["Dominican Republic (República Dominicana)","do","1",2,["809","829","849"]],["Ecuador","ec","593"],["Egypt (‫مصر‬‎)","eg","20"],["El Salvador","sv","503"],["Equatorial Guinea (Guinea Ecuatorial)","gq","240"],["Eritrea","er","291"],["Estonia (Eesti)","ee","372"],["Ethiopia","et","251"],["Falkland Islands (Islas Malvinas)","fk","500"],["Faroe Islands (Føroyar)","fo","298"],["Fiji","fj","679"],["Finland (Suomi)","fi","358",0],["France","fr","33"],["French Guiana (Guyane française)","gf","594"],["French Polynesia (Polynésie française)","pf","689"],["Gabon","ga","241"],["Gambia","gm","220"],["Georgia (საქართველო)","ge","995"],["Germany (Deutschland)","de","49"],["Ghana (Gaana)","gh","233"],["Gibraltar","gi","350"],["Greece (Ελλάδα)","gr","30"],["Greenland (Kalaallit Nunaat)","gl","299"],["Grenada","gd","1473"],["Guadeloupe","gp","590",0],["Guam","gu","1671"],["Guatemala","gt","502"],["Guernsey","gg","44",1],["Guinea (Guinée)","gn","224"],["Guinea-Bissau (Guiné Bissau)","gw","245"],["Guyana","gy","592"],["Haiti","ht","509"],["Honduras","hn","504"],["Hong Kong (香港)","hk","852"],["Hungary (Magyarország)","hu","36"],["Iceland (Ísland)","is","354"],["India (भारत)","in","91"],["Indonesia","id","62"],["Iran (‫ایران‬‎)","ir","98"],["Iraq (‫العراق‬‎)","iq","964"],["Ireland","ie","353"],["Isle of Man","im","44",2],["Israel (‫ישראל‬‎)","il","972"],["Italy (Italia)","it","39",0],["Jamaica","jm","1",4,["876","658"]],["Japan (日本)","jp","81"],["Jersey","je","44",3],["Jordan (‫الأردن‬‎)","jo","962"],["Kazakhstan (Казахстан)","kz","7",1],["Kenya","ke","254"],["Kiribati","ki","686"],["Kosovo","xk","383"],["Kuwait (‫الكويت‬‎)","kw","965"],["Kyrgyzstan (Кыргызстан)","kg","996"],["Laos (ລາວ)","la","856"],["Latvia (Latvija)","lv","371"],["Lebanon (‫لبنان‬‎)","lb","961"],["Lesotho","ls","266"],["Liberia","lr","231"],["Libya (‫ليبيا‬‎)","ly","218"],["Liechtenstein","li","423"],["Lithuania (Lietuva)","lt","370"],["Luxembourg","lu","352"],["Macau (澳門)","mo","853"],["Macedonia (FYROM) (Македонија)","mk","389"],["Madagascar (Madagasikara)","mg","261"],["Malawi","mw","265"],["Malaysia","my","60"],["Maldives","mv","960"],["Mali","ml","223"],["Malta","mt","356"],["Marshall Islands","mh","692"],["Martinique","mq","596"],["Mauritania (‫موريتانيا‬‎)","mr","222"],["Mauritius (Moris)","mu","230"],["Mayotte","yt","262",1],["Mexico (México)","mx","52"],["Micronesia","fm","691"],["Moldova (Republica Moldova)","md","373"],["Monaco","mc","377"],["Mongolia (Монгол)","mn","976"],["Montenegro (Crna Gora)","me","382"],["Montserrat","ms","1664"],["Morocco (‫المغرب‬‎)","ma","212",0],["Mozambique (Moçambique)","mz","258"],["Myanmar (Burma) (မြန်မာ)","mm","95"],["Namibia (Namibië)","na","264"],["Nauru","nr","674"],["Nepal (नेपाल)","np","977"],["Netherlands (Nederland)","nl","31"],["New Caledonia (Nouvelle-Calédonie)","nc","687"],["New Zealand","nz","64"],["Nicaragua","ni","505"],["Niger (Nijar)","ne","227"],["Nigeria","ng","234"],["Niue","nu","683"],["Norfolk Island","nf","672"],["North Korea (조선 민주주의 인민 공화국)","kp","850"],["Northern Mariana Islands","mp","1670"],["Norway (Norge)","no","47",0],["Oman (‫عُمان‬‎)","om","968"],["Pakistan (‫پاکستان‬‎)","pk","92"],["Palau","pw","680"],["Palestine (‫فلسطين‬‎)","ps","970"],["Panama (Panamá)","pa","507"],["Papua New Guinea","pg","675"],["Paraguay","py","595"],["Peru (Perú)","pe","51"],["Philippines","ph","63"],["Poland (Polska)","pl","48"],["Portugal","pt","351"],["Puerto Rico","pr","1",3,["787","939"]],["Qatar (‫قطر‬‎)","qa","974"],["Réunion (La Réunion)","re","262",0],["Romania (România)","ro","40"],["Russia (Россия)","ru","7",0],["Rwanda","rw","250"],["Saint Barthélemy","bl","590",1],["Saint Helena","sh","290"],["Saint Kitts and Nevis","kn","1869"],["Saint Lucia","lc","1758"],["Saint Martin (Saint-Martin (partie française))","mf","590",2],["Saint Pierre and Miquelon (Saint-Pierre-et-Miquelon)","pm","508"],["Saint Vincent and the Grenadines","vc","1784"],["Samoa","ws","685"],["San Marino","sm","378"],["São Tomé and Príncipe (São Tomé e Príncipe)","st","239"],["Saudi Arabia (‫المملكة العربية السعودية‬‎)","sa","966"],["Senegal (Sénégal)","sn","221"],["Serbia (Србија)","rs","381"],["Seychelles","sc","248"],["Sierra Leone","sl","232"],["Singapore","sg","65"],["Sint Maarten","sx","1721"],["Slovakia (Slovensko)","sk","421"],["Slovenia (Slovenija)","si","386"],["Solomon Islands","sb","677"],["Somalia (Soomaaliya)","so","252"],["South Africa","za","27"],["South Korea (대한민국)","kr","82"],["South Sudan (‫جنوب السودان‬‎)","ss","211"],["Spain (España)","es","34"],["Sri Lanka (ශ්‍රී ලංකාව)","lk","94"],["Sudan (‫السودان‬‎)","sd","249"],["Suriname","sr","597"],["Svalbard and Jan Mayen","sj","47",1],["Swaziland","sz","268"],["Sweden (Sverige)","se","46"],["Switzerland (Schweiz)","ch","41"],["Syria (‫سوريا‬‎)","sy","963"],["Taiwan (台灣)","tw","886"],["Tajikistan","tj","992"],["Tanzania","tz","255"],["Thailand (ไทย)","th","66"],["Timor-Leste","tl","670"],["Togo","tg","228"],["Tokelau","tk","690"],["Tonga","to","676"],["Trinidad and Tobago","tt","1868"],["Tunisia (‫تونس‬‎)","tn","216"],["Turkey (Türkiye)","tr","90"],["Turkmenistan","tm","993"],["Turks and Caicos Islands","tc","1649"],["Tuvalu","tv","688"],["U.S. Virgin Islands","vi","1340"],["Uganda","ug","256"],["Ukraine (Україна)","ua","380"],["United Arab Emirates (‫الإمارات العربية المتحدة‬‎)","ae","971"],["United Kingdom","gb","44",0],["United States","us","1",0],["Uruguay","uy","598"],["Uzbekistan (Oʻzbekiston)","uz","998"],["Vanuatu","vu","678"],["Vatican City (Città del Vaticano)","va","39",1],["Venezuela","ve","58"],["Vietnam (Việt Nam)","vn","84"],["Wallis and Futuna (Wallis-et-Futuna)","wf","681"],["Western Sahara (‫الصحراء الغربية‬‎)","eh","212",1],["Yemen (‫اليمن‬‎)","ye","967"],["Zambia","zm","260"],["Zimbabwe","zw","263"],["Åland Islands","ax","358",1]],i=0;i<h.length;i++){var j=h[i];h[i]={name:j[0],iso2:j[1],dialCode:j[2],priority:j[3]||0,areaCodes:j[4]||null}}b.intlTelInputGlobals={getInstance:function(a){var c=a.getAttribute("data-intl-tel-input-id");return b.intlTelInputGlobals.instances[c]},instances:{}};var k=0,l={allowDropdown:!0,autoHideDialCode:!0,autoPlaceholder:"polite",customContainer:"",customPlaceholder:null,dropdownContainer:null,excludeCountries:[],formatOnDisplay:!0,geoIpLookup:null,hiddenInput:"",initialCountry:"",localizedCountries:null,nationalMode:!0,onlyCountries:[],placeholderNumberType:"MOBILE",preferredCountries:["us","gb"],separateDialCode:!1,utilsScript:""},m=["800","822","833","844","855","866","877","880","881","882","883","884","885","886","887","888","889"];b.addEventListener("load",function(){b.intlTelInputGlobals.windowLoaded=!0});var n=function(a,b){for(var c=Object.keys(a),d=0;d<c.length;d++)b(c[d],a[c[d]])},o=function(a){n(b.intlTelInputGlobals.instances,function(c){b.intlTelInputGlobals.instances[c][a]()})},p=function(){function a(b,c){var d=this;e(this,a),this.id=k++,this.a=b,this.b=null,this.c=null;var f=c||{};this.d={},n(l,function(a,b){d.d[a]=f.hasOwnProperty(a)?f[a]:b}),this.e=Boolean(b.getAttribute("placeholder"))}return g(a,[{key:"_init",value:function(){var a=this;if(this.d.nationalMode&&(this.d.autoHideDialCode=!1),this.d.separateDialCode&&(this.d.autoHideDialCode=this.d.nationalMode=!1),this.g=/Android.+Mobile|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),this.g&&(c.body.classList.add("iti-mobile"),this.d.dropdownContainer||(this.d.dropdownContainer=c.body)),"undefined"!=typeof Promise){var b=new Promise(function(b,c){a.h=b,a.i=c}),d=new Promise(function(b,c){a.i0=b,a.i1=c});this.promise=Promise.all([b,d])}else this.h=this.i=function(){},this.i0=this.i1=function(){};this.s={},this._b(),this._f(),this._h(),this._i(),this._i3()}},{key:"_b",value:function(){this._d(),this._d2(),this._e(),this.d.localizedCountries&&this._d0(),(this.d.onlyCountries.length||this.d.localizedCountries)&&this.p.sort(this._d1)}},{key:"_c",value:function(a,b,c){this.q.hasOwnProperty(b)||(this.q[b]=[]);var d=c||0;this.q[b][d]=a}},{key:"_d",value:function(){if(this.d.onlyCountries.length){var a=this.d.onlyCountries.map(function(a){return a.toLowerCase()});this.p=h.filter(function(b){return a.indexOf(b.iso2)>-1})}else if(this.d.excludeCountries.length){var b=this.d.excludeCountries.map(function(a){return a.toLowerCase()});this.p=h.filter(function(a){return-1===b.indexOf(a.iso2)})}else this.p=h}},{key:"_d0",value:function(){for(var a=0;a<this.p.length;a++){var b=this.p[a].iso2.toLowerCase();this.d.localizedCountries.hasOwnProperty(b)&&(this.p[a].name=this.d.localizedCountries[b])}}},{key:"_d1",value:function(a,b){return a.name.localeCompare(b.name)}},{key:"_d2",value:function(){this.q={};for(var a=0;a<this.p.length;a++){var b=this.p[a];if(this._c(b.iso2,b.dialCode,b.priority),b.areaCodes)for(var c=0;c<b.areaCodes.length;c++)this._c(b.iso2,b.dialCode+b.areaCodes[c])}}},{key:"_e",value:function(){this.preferredCountries=[];for(var a=0;a<this.d.preferredCountries.length;a++){var b=this.d.preferredCountries[a].toLowerCase(),c=this._y(b,!1,!0);c&&this.preferredCountries.push(c)}}},{key:"_e2",value:function(a,b,d){var e=c.createElement(a);return b&&n(b,function(a,b){return e.setAttribute(a,b)}),d&&d.appendChild(e),e}},{key:"_f",value:function(){this.a.setAttribute("autocomplete","off");var a="intl-tel-input";this.d.allowDropdown&&(a+=" allow-dropdown"),this.d.separateDialCode&&(a+=" separate-dial-code"),this.d.customContainer&&(a+=" ",a+=this.d.customContainer);var b=this._e2("div",{"class":a});if(this.a.parentNode.insertBefore(b,this.a),this.k=this._e2("div",{"class":"flag-container"},b),b.appendChild(this.a),this.selectedFlag=this._e2("div",{"class":"selected-flag",role:"combobox","aria-owns":"country-listbox"},this.k),this.l=this._e2("div",{"class":"iti-flag"},this.selectedFlag),this.d.separateDialCode&&(this.t=this._e2("div",{"class":"selected-dial-code"},this.selectedFlag)),this.d.allowDropdown&&(this.selectedFlag.setAttribute("tabindex","0"),this.u=this._e2("div",{"class":"iti-arrow"},this.selectedFlag),this.m=this._e2("ul",{"class":"country-list hide",id:"country-listbox","aria-expanded":"false",role:"listbox"}),this.preferredCountries.length&&(this._g(this.preferredCountries,"preferred"),this._e2("li",{"class":"divider",role:"separator","aria-disabled":"true"},this.m)),this._g(this.p,"standard"),this.d.dropdownContainer?(this.dropdown=this._e2("div",{"class":"intl-tel-input iti-container"}),this.dropdown.appendChild(this.m)):this.k.appendChild(this.m)),this.d.hiddenInput){var c=this.d.hiddenInput,d=this.a.getAttribute("name");if(d){var e=d.lastIndexOf("[");-1!==e&&(c="".concat(d.substr(0,e),"[").concat(c,"]"))}this.hiddenInput=this._e2("input",{type:"hidden",name:c}),b.appendChild(this.hiddenInput)}}},{key:"_g",value:function(a,b){for(var c="",d=0;d<a.length;d++){var e=a[d];c+="<li class='country ".concat(b,"' tabIndex='-1' id='iti-item-").concat(e.iso2,"' role='option' data-dial-code='").concat(e.dialCode,"' data-country-code='").concat(e.iso2,"'>"),c+="<div class='flag-box'><div class='iti-flag ".concat(e.iso2,"'></div></div>"),c+="<span class='country-name'>".concat(e.name,"</span>"),c+="<span class='dial-code'>+".concat(e.dialCode,"</span>"),c+="</li>"}this.m.insertAdjacentHTML("beforeend",c)}},{key:"_h",value:function(){var a=this.a.value,b=this._5(a),c=this._w(a),d=this.d,e=d.initialCountry,f=d.nationalMode,g=d.autoHideDialCode,h=d.separateDialCode;b&&!c?this._v(a):"auto"!==e&&(e?this._z(e.toLowerCase()):b&&c?this._z("us"):(this.j=this.preferredCountries.length?this.preferredCountries[0].iso2:this.p[0].iso2,a||this._z(this.j)),a||f||g||h||(this.a.value="+".concat(this.s.dialCode))),a&&this._u(a)}},{key:"_i",value:function(){this._j(),this.d.autoHideDialCode&&this._l(),this.d.allowDropdown&&this._i2(),this.hiddenInput&&this._i0()}},{key:"_i0",value:function(){var a=this;this._a14=function(){a.hiddenInput.value=a.getNumber()},this.a.form&&this.a.form.addEventListener("submit",this._a14)}},{key:"_i1",value:function(){for(var a=this.a;a&&"LABEL"!==a.tagName;)a=a.parentNode;return a}},{key:"_i2",value:function(){var a=this;this._a9=function(b){a.m.classList.contains("hide")?a.a.focus():b.preventDefault()};var b=this._i1();b&&b.addEventListener("click",this._a9),this._a10=function(){!a.m.classList.contains("hide")||a.a.disabled||a.a.readOnly||a._n()},this.selectedFlag.addEventListener("click",this._a10),this._a11=function(b){a.m.classList.contains("hide")&&-1!==["ArrowUp","ArrowDown"," ","Enter"].indexOf(b.key)&&(b.preventDefault(),b.stopPropagation(),a._n()),"Tab"===b.key&&a._2()},this.k.addEventListener("keydown",this._a11)}},{key:"_i3",value:function(){var a=this;this.d.utilsScript&&!b.intlTelInputUtils?b.intlTelInputGlobals.windowLoaded?b.intlTelInputGlobals.loadUtils(this.d.utilsScript):b.addEventListener("load",function(){b.intlTelInputGlobals.loadUtils(a.d.utilsScript)}):this.i0(),"auto"===this.d.initialCountry?this._i4():this.h()}},{key:"_i4",value:function(){b.intlTelInputGlobals.autoCountry?this.handleAutoCountry():b.intlTelInputGlobals.startedLoadingAutoCountry||(b.intlTelInputGlobals.startedLoadingAutoCountry=!0,"function"==typeof this.d.geoIpLookup&&this.d.geoIpLookup(function(a){b.intlTelInputGlobals.autoCountry=a.toLowerCase(),setTimeout(function(){return o("handleAutoCountry")})},function(){return o("rejectAutoCountryPromise")}))}},{key:"_j",value:function(){var a=this;this._a12=function(){a._v(a.a.value)&&a._8()},this.a.addEventListener("keyup",this._a12),this._a13=function(){setTimeout(a._a12)},this.a.addEventListener("cut",this._a13),this.a.addEventListener("paste",this._a13)}},{key:"_j2",value:function(a){var b=this.a.getAttribute("maxlength");return b&&a.length>b?a.substr(0,b):a}},{key:"_l",value:function(){var a=this;this._a8=function(){a._l2()},this.a.form&&this.a.form.addEventListener("submit",this._a8),this.a.addEventListener("blur",this._a8)}},{key:"_l2",value:function(){if("+"===this.a.value.charAt(0)){var a=this._m(this.a.value);a&&this.s.dialCode!==a||(this.a.value="")}}},{key:"_m",value:function(a){return a.replace(/\D/g,"")}},{key:"_m2",value:function(a){var b=c.createEvent("Event");b.initEvent(a,!0,!0),this.a.dispatchEvent(b)}},{key:"_n",value:function(){this.m.classList.remove("hide"),this.m.setAttribute("aria-expanded","true"),this._o(),this.b&&(this._x(this.b,!1),this._3(this.b,!0)),this._p(),this.u.classList.add("up"),this._m2("open:countrydropdown")}},{key:"_n2",value:function(a,b,c){c&&!a.classList.contains(b)?a.classList.add(b):!c&&a.classList.contains(b)&&a.classList.remove(b)}},{key:"_o",value:function(){var a=this;if(this.d.dropdownContainer&&this.d.dropdownContainer.appendChild(this.dropdown),!this.g){var d=this.a.getBoundingClientRect(),e=b.pageYOffset||c.documentElement.scrollTop,f=d.top+e,g=this.m.offsetHeight,h=f+this.a.offsetHeight+g<e+b.innerHeight,i=f-g>e;if(this._n2(this.m,"dropup",!h&&i),this.d.dropdownContainer){var j=!h&&i?0:this.a.offsetHeight;this.dropdown.style.top="".concat(f+j,"px"),this.dropdown.style.left="".concat(d.left+c.body.scrollLeft,"px"),this._a4=function(){return a._2()},b.addEventListener("scroll",this._a4)}}}},{key:"_o2",value:function(a){for(var b=a;b&&b!==this.m&&!b.classList.contains("country");)b=b.parentNode;return b===this.m?null:b}},{key:"_p",value:function(){var a=this;this._a0=function(b){var c=a._o2(b.target);c&&a._x(c,!1)},this.m.addEventListener("mouseover",this._a0),this._a1=function(b){var c=a._o2(b.target);c&&a._1(c)},this.m.addEventListener("click",this._a1);var b=!0;this._a2=function(){b||a._2(),b=!1},c.documentElement.addEventListener("click",this._a2);var d="",e=null;this._a3=function(b){b.preventDefault(),"ArrowUp"===b.key||"ArrowDown"===b.key?a._q(b.key):"Enter"===b.key?a._r():"Escape"===b.key?a._2():/^[a-zA-ZÀ-ÿ ]$/.test(b.key)&&(e&&clearTimeout(e),d+=b.key.toLowerCase(),a._s(d),e=setTimeout(function(){d=""},1e3))},c.addEventListener("keydown",this._a3)}},{key:"_q",value:function(a){var b="ArrowUp"===a?this.c.previousElementSibling:this.c.nextElementSibling;b&&(b.classList.contains("divider")&&(b="ArrowUp"===a?b.previousElementSibling:b.nextElementSibling),this._x(b,!0))}},{key:"_r",value:function(){this.c&&this._1(this.c)}},{key:"_s",value:function(a){for(var b=0;b<this.p.length;b++)if(this._t(this.p[b].name,a)){var c=this.m.querySelector("#iti-item-".concat(this.p[b].iso2));this._x(c,!1),this._3(c,!0);break}}},{key:"_t",value:function(a,b){return a.substr(0,b.length).toLowerCase()===b}},{key:"_u",value:function(a){var c=a;if(this.d.formatOnDisplay&&b.intlTelInputUtils&&this.s){var d=!this.d.separateDialCode&&(this.d.nationalMode||"+"!==c.charAt(0)),e=intlTelInputUtils.numberFormat,f=e.NATIONAL,g=e.INTERNATIONAL,h=d?f:g;c=intlTelInputUtils.formatNumber(c,this.s.iso2,h)}c=this._7(c),this.a.value=c}},{key:"_v",value:function(a){var b=a,c="1"===this.s.dialCode;b&&this.d.nationalMode&&c&&"+"!==b.charAt(0)&&("1"!==b.charAt(0)&&(b="1".concat(b)),b="+".concat(b));var d=this._5(b),e=this._m(b),f=null;if(d){var g=this.q[this._m(d)],h=-1!==g.indexOf(this.s.iso2),i="+1"===d&&e.length>=4;if(!("1"===this.s.dialCode&&this._w(e))&&(!h||i))for(var j=0;j<g.length;j++)if(g[j]){f=g[j];break}}else"+"===b.charAt(0)&&e.length?f="":b&&"+"!==b||(f=this.j);return null!==f&&this._z(f)}},{key:"_w",value:function(a){var b=this._m(a);if("1"===b.charAt(0)){var c=b.substr(1,3);return-1!==m.indexOf(c)}return!1}},{key:"_x",value:function(a,b){var c=this.c;c&&c.classList.remove("highlight"),this.c=a,this.c.classList.add("highlight"),b&&this.c.focus()}},{key:"_y",value:function(a,b,c){for(var d=b?h:this.p,e=0;e<d.length;e++)if(d[e].iso2===a)return d[e];if(c)return null;throw new Error("No country data for '".concat(a,"'"))}},{key:"_z",value:function(a){var b=this.s.iso2?this.s:{};this.s=a?this._y(a,!1,!1):{},this.s.iso2&&(this.j=this.s.iso2),this.l.setAttribute("class","iti-flag ".concat(a));var c=a?"".concat(this.s.name,": +").concat(this.s.dialCode):"Unknown";if(this.selectedFlag.setAttribute("title",c),this.d.separateDialCode){var d=this.s.dialCode?"+".concat(this.s.dialCode):"";this.t.innerHTML=d,this.a.style.paddingLeft="".concat(this.selectedFlag.offsetWidth+6,"px")}if(this._0(),this.d.allowDropdown){var e=this.b;if(e&&(e.classList.remove("active"),e.setAttribute("aria-selected","false")),a){var f=this.m.querySelector("#iti-item-".concat(a));f.setAttribute("aria-selected","true"),f.classList.add("active"),this.b=f,this.m.setAttribute("aria-activedescendant",f.getAttribute("id"))}}return b.iso2!==a}},{key:"_0",value:function(){var a="aggressive"===this.d.autoPlaceholder||!this.e&&"polite"===this.d.autoPlaceholder;if(b.intlTelInputUtils&&a){var c=intlTelInputUtils.numberType[this.d.placeholderNumberType],d=this.s.iso2?intlTelInputUtils.getExampleNumber(this.s.iso2,this.d.nationalMode,c):"";d=this._7(d),"function"==typeof this.d.customPlaceholder&&(d=this.d.customPlaceholder(d,this.s)),this.a.setAttribute("placeholder",d)}}},{key:"_1",value:function(a){var b=this._z(a.getAttribute("data-country-code"));this._2(),this._4(a.getAttribute("data-dial-code"),!0),this.a.focus();var c=this.a.value.length;this.a.setSelectionRange(c,c),b&&this._8()}},{key:"_2",value:function(){this.m.classList.add("hide"),this.m.setAttribute("aria-expanded","false"),this.u.classList.remove("up"),c.removeEventListener("keydown",this._a3),c.documentElement.removeEventListener("click",this._a2),this.m.removeEventListener("mouseover",this._a0),this.m.removeEventListener("click",this._a1),this.d.dropdownContainer&&(this.g||b.removeEventListener("scroll",this._a4),this.dropdown.parentNode&&this.dropdown.parentNode.removeChild(this.dropdown)),this._m2("close:countrydropdown")}},{key:"_3",value:function(a,d){var e=this.m,f=b.pageYOffset||c.documentElement.scrollTop,g=e.offsetHeight,h=e.getBoundingClientRect().top+f,i=h+g,j=a.offsetHeight,k=a.getBoundingClientRect().top+f,l=k+j,m=k-h+e.scrollTop,n=g/2-j/2;if(k<h)d&&(m-=n),e.scrollTop=m;else if(l>i){d&&(m+=n);var o=g-j;e.scrollTop=m-o}}},{key:"_4",value:function(a,b){var c,d=this.a.value,e="+".concat(a);if("+"===d.charAt(0)){var f=this._5(d);c=f?d.replace(f,e):e}else{if(this.d.nationalMode||this.d.separateDialCode)return;if(d)c=e+d;else{if(!b&&this.d.autoHideDialCode)return;c=e}}this.a.value=c}},{key:"_5",value:function(a){var b="";if("+"===a.charAt(0))for(var c="",d=0;d<a.length;d++){var e=a.charAt(d);if(!isNaN(parseInt(e,10))&&(c+=e,this.q[c]&&(b=a.substr(0,d+1)),4===c.length))break}return b}},{key:"_6",value:function(){var a=this.a.value.trim(),b=this.s.dialCode,c=this._m(a),d="1"===c.charAt(0)?c:"1".concat(c);return(this.d.separateDialCode&&"+"!==a.charAt(0)?"+".concat(b):a&&"+"!==a.charAt(0)&&"1"!==a.charAt(0)&&b&&"1"===b.charAt(0)&&4===b.length&&b!==d.substr(0,4)?b.substr(1):"")+a}},{key:"_7",value:function(a){var b=a;if(this.d.separateDialCode){var c=this._5(b);if(c){null!==this.s.areaCodes&&(c="+".concat(this.s.dialCode));var d=" "===b[c.length]||"-"===b[c.length]?c.length+1:c.length;b=b.substr(d)}}return this._j2(b)}},{key:"_8",value:function(){this._m2("countrychange")}},{key:"handleAutoCountry",value:function(){"auto"===this.d.initialCountry&&(this.j=b.intlTelInputGlobals.autoCountry,this.a.value||this.setCountry(this.j),this.h())}},{key:"handleUtils",value:function(){b.intlTelInputUtils&&(this.a.value&&this._u(this.a.value),this._0()),this.i0()}},{key:"destroy",value:function(){var a=this.a.form;if(this.d.allowDropdown){this._2(),this.selectedFlag.removeEventListener("click",this._a10),this.k.removeEventListener("keydown",this._a11);var c=this._i1();c&&c.removeEventListener("click",this._a9)}this.hiddenInput&&a&&a.removeEventListener("submit",this._a14),this.d.autoHideDialCode&&(a&&a.removeEventListener("submit",this._a8),this.a.removeEventListener("blur",this._a8)),this.a.removeEventListener("keyup",this._a12),this.a.removeEventListener("cut",this._a13),this.a.removeEventListener("paste",this._a13),this.a.removeAttribute("data-intl-tel-input-id");var d=this.a.parentNode;d.parentNode.insertBefore(this.a,d),d.parentNode.removeChild(d),delete b.intlTelInputGlobals.instances[this.id]}},{key:"getExtension",value:function(){return b.intlTelInputUtils?intlTelInputUtils.getExtension(this._6(),this.s.iso2):""}},{key:"getNumber",value:function(a){if(b.intlTelInputUtils){var c=this.s.iso2;return intlTelInputUtils.formatNumber(this._6(),c,a)}return""}},{key:"getNumberType",value:function(){return b.intlTelInputUtils?intlTelInputUtils.getNumberType(this._6(),this.s.iso2):-99}},{key:"getSelectedCountryData",value:function(){return this.s}},{key:"getValidationError",value:function(){if(b.intlTelInputUtils){var a=this.s.iso2;return intlTelInputUtils.getValidationError(this._6(),a)}return-99}},{key:"isValidNumber",value:function(){var a=this._6().trim(),c=this.d.nationalMode?this.s.iso2:"";return b.intlTelInputUtils?intlTelInputUtils.isValidNumber(a,c):null}},{key:"setCountry",value:function(a){var b=a.toLowerCase();this.l.classList.contains(b)||(this._z(b),this._4(this.s.dialCode,!1),this._8())}},{key:"setNumber",value:function(a){var b=this._v(a);this._u(a),b&&this._8()}},{key:"setPlaceholderNumberType",value:function(a){this.d.placeholderNumberType=a,this._0()}}]),a}();b.intlTelInputGlobals.getCountryData=function(){return h};var q=function(a,b,d){var e=c.createElement("script");e.onload=function(){o("handleUtils"),b&&b()},e.onerror=function(){o("rejectUtilsScriptPromise"),d&&d()},e.className="iti-load-utils",e.async=!0,e.src=a,c.body.appendChild(e)};b.intlTelInputGlobals.loadUtils=function(a){if(!b.intlTelInputUtils&&!b.intlTelInputGlobals.startedLoadingUtilsScript){if(b.intlTelInputGlobals.startedLoadingUtilsScript=!0,"undefined"!=typeof Promise)return new Promise(function(b,c){return q(a,b,c)});q(a)}return null},b.intlTelInputGlobals.defaults=l,b.intlTelInputGlobals.version="15.1.0";a.fn.intlTelInput=function(c){var e=arguments;if(c===d||"object"==typeof c)return this.each(function(){if(!a.data(this,"plugin_intlTelInput")){var d=new p(this,c);d._init(),b.intlTelInputGlobals.instances[d.id]=d,a.data(this,"plugin_intlTelInput",d)}});if("string"==typeof c&&"_"!==c[0]){var f
  ;return this.each(function(){var b=a.data(this,"plugin_intlTelInput");b instanceof p&&"function"==typeof b[c]&&(f=b[c].apply(b,Array.prototype.slice.call(e,1))),"destroy"===c&&a.data(this,"plugin_intlTelInput",null)}),f!==d?f:this}}});


(function() {
  'use strict';

  // Check to make sure service workers are supported in the current browser,
  // and that the current page is accessed from a secure origin. Using a
  // service worker from an insecure origin will trigger JS console errors. See
  // http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features
  var isLocalhost = Boolean(window.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === '[::1]' ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
    );

  if ('serviceWorker' in navigator &&
      (window.location.protocol === 'https:' || isLocalhost)) {
    navigator.serviceWorker.register('service-worker.js')
    .then(function(registration) {
      // updatefound is fired if service-worker.js changes.
      registration.onupdatefound = function() {
        // updatefound is also fired the very first time the SW is installed,
        // and there's no need to prompt for a reload at that point.
        // So check here to see if the page is already controlled,
        // i.e. whether there's an existing service worker.
        if (navigator.serviceWorker.controller) {
          // The updatefound event implies that registration.installing is set:
          // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
          var installingWorker = registration.installing;

          installingWorker.onstatechange = function() {
            switch (installingWorker.state) {
              case 'installed':
                // At this point, the old content will have been purged and the
                // fresh content will have been added to the cache.
                // It's the perfect time to display a "New content is
                // available; please refresh." message in the page's interface.
                break;

              case 'redundant':
                throw new Error('The installing ' +
                                'service worker became redundant.');

              default:
                // Ignore
            }
          };
        }
      };
    }).catch(function(e) {
      console.error('Error during service worker registration:', e);
    });
  }



  // Your custom JavaScript goes here
  $(document).ready(function(){

    $('select').niceSelect();

    $("#phone, input[name='phone']").intlTelInput();


    if($('.rich-editor').length > 0){
      var quill = new Quill('.rich-editor', {
        theme: 'snow'
      });
    }

    $('.category-link').click(function(){
      var currentCategory = $('#'+$(this).attr('data-id'));
      currentCategory.toggleClass('open');
      $('.category-dropdown').not(currentCategory).removeClass('open');
      $(this).parent().addClass('active');
      $('.categories-list-main>li').not($(this).parent()).removeClass('active');
    });
    $('.category-dropdown').mouseup(function(e){
        var targetDiv = $(".category-dropdown .mdl-grid");
        if (!targetDiv.is(e.target) && targetDiv.has(e.target).length === 0)
        {
          $('.category-dropdown').removeClass('open');
        }
    });

    $('.all-toggler input[type="checkbox"]').change(function(){
      if ($(this).is(':checked')){
        $(this).closest('.filter-box').find('.checkbox-label input[type="checkbox"]').prop('checked', true);
      }else{
        $(this).closest('.filter-box').find('.checkbox-label input[type="checkbox"]').prop('checked', false);
      }
    });
    $('.filter-box .checkbox-label input[type="checkbox"]').change(function(){
      var ltSubCk = $(this).closest('.filter-box').find('.checkbox-label input[type="checkbox"]:checked').length;
      var ltSub = $(this).closest('.filter-box').find('.checkbox-label input[type="checkbox"]').length;
      if(ltSubCk == ltSub){
        $(this).closest('.filter-box').find('.all-toggler input[type="checkbox"]').prop('checked', true);

      }else{
        $(this).closest('.filter-box').find('.all-toggler input[type="checkbox"]').prop('checked', false);
      }
    });

    $('.btn-check-row input[type="checkbox"]').change(function(){
      if ($(this).is(':checked')){
        $(this).closest('.table-list').addClass('on-select-row');
        $(this).closest('.table-list').find('td .label-check input[type="checkbox"]').prop('checked', true);

        var ltSubCk = $(this).closest('.table-list').find('td .label-check input[type="checkbox"]:checked').length;
        $(this).siblings('span').text(ltSubCk + ' selected');
      }else{
        $(this).closest('.table-list').removeClass('on-select-row');
        $(this).closest('.table-list').find('td .label-check input[type="checkbox"]').prop('checked', false);
      }
    });

    $('td .label-check input[type="checkbox"]').change(function(){
      var ltSubCk = $(this).closest('.table-list').find('td .label-check input[type="checkbox"]:checked').length;
      var ltSub = $(this).closest('.table-list').find('td .label-check input[type="checkbox"]').length;

      $('.btn-check-row span').text(ltSubCk + ' selected');
      if(ltSubCk == ltSub){
        $(this).closest('.table-list').find('.btn-check-row input[type="checkbox"]').prop('checked', true);

      }else{
        $(this).closest('.table-list').find('.btn-check-row input[type="checkbox"]').prop('checked', false);
      }

      if(ltSubCk > 0){
        $(this).closest('.table-list').addClass('on-select-row');
      }
      else{
        $(this).closest('.table-list').removeClass('on-select-row');
      }
    });

    $('.btn-clear-check').click(function(e){
      e.preventDefault();
      $('.table-list').find('td .label-check input[type="checkbox"], .btn-check-row input[type="checkbox"]').prop('checked', false);
      $(this).closest('.table-list').removeClass('on-select-row');
    });

    $('.menu-expander>a').click(function(){
      $('.sidemenu-wrapper').addClass('open');
    });
    $('.sidemenu-wrapper .btn-close').click(function(){
      $('.sidemenu-wrapper').removeClass('open');
    });
    $('.sidemenu-wrapper').mouseup(function(e){
      var targetDiv = $(".sidemenu");
      if (!targetDiv.is(e.target) && targetDiv.has(e.target).length === 0)
      {
        $('.sidemenu-wrapper').removeClass('open');
      }
    });

    $('.filter-tag .btn-close').click(function(){
      $(this).closest('.filter-tag').hide();
    });
    $('.btn-love').click(function(){
      $(this).toggleClass('loved');
    });

    $('.btn-toggle').click(function(){
      var toShow = $('#'+$(this).attr('to-show'));
      toShow.addClass('open');
      $('.toggled-item').not(toShow).removeClass('open');
      $(this).addClass('active');
      $('.btn-toggle').not(this).removeClass('active');
    });

    $('.hero-product').slick({
      dots: true,
      autoplaySpeed: 2000,
      arrows: false,
      infinite: false,
      autoplay: true
    });

    $('.product-mini-slider').slick({
      infinite: true,
      slidesToShow: 5,
      slidesToScroll: 1
    });

    $('.img-brand-slide').slick({
      infinite: true,
      slidesToShow: 1,
      arrows: false,
      dots: true,
    });


    $('.btn-slick-prev').click(function(){
      $(this).closest('.products-group').find('.slick-prev').trigger('click');
    });
    $('.btn-slick-next').click(function(){
      $(this).closest('.products-group').find('.slick-next').trigger('click');
    });

    $('.expandable-list .toggler').click(function(){
      $(this).closest('.expandable-list').toggleClass('open');
    });
    $('.filter-box .toggler').click(function(){
      $(this).closest('.filter-box').toggleClass('collapsed');
    });

    $('.field-toggler').change(function(){
      var fieldCtrl = $('field-group[data-control='+ $(this).attr('id') +']');
      fieldCtrl.toggleClass('disabled');
      fieldCtrl.find('input').trigger('click');
    });

    $('.code-option-toggle').click(function(){
      $(this).toggleClass('up');
      $('.code-option').toggleClass('open');
    });

    $('.close-cookies').click(function(){
      $('.cookies-wrap').fadeOut();
    });

    $('.alphabet-wrapper a').click(function(e){
      e.preventDefault();
      var scrollTarget = $('#'+$(this).attr('alphabet-id'));
			$('html, body').animate({
				scrollTop: scrollTarget.offset().top
			}, 1500);
    });

    // $('.btn-tracking').click(function(){
    //   var trackingDetail = $(this).attr('show-for');
    //   $('#'+trackingDetail).toggleClass('show');
    //   $('.h-dropdown').not(trackingDetail).removeClass('show');

    //   var textBtn = $(this).text();
    //    $(this).text(textBtn == "Hide tracking Details" ? "Show tracking details" : "Hide tracking Details");
    // });

    $('button[show-for], a[show-for]').click(function(e){
      e.preventDefault();
      var targetId = $(this).attr('show-for');
      $('#'+ targetId).toggleClass('show');
    });
    $('button[tooltip-for], a[tooltip-for]').click(function(e){
      e.preventDefault();
      var targetId = $(this).attr('tooltip-for');
      $('#'+ targetId).toggleClass('tooltip');
    });
    $('button[toggle-for], a[toggle-for]').click(function(e){
      e.preventDefault();
      var targetId = $(this).attr('toggle-for');
      $('#'+ targetId).toggleClass('show');
    });

    $('.btn-link.expand-more').click(function(e){
      e.preventDefault();
      $('.table-tracking').toggleClass('expand');
      $(this).hide();
    });

    $('body').mouseup(function(e)
    {
        var targetDiv = $(".h-dropdown");
        if (!targetDiv.is(e.target) && targetDiv.has(e.target).length === 0)
        {
          targetDiv.removeClass('show');
        }
    });

    $('.category-options>li').click(function(){
      $(this).toggleClass('checked');
      var currentCheckbox = $(this).find('input[type="checkbox"]');
      $('#btn-choose-category').addClass('btn-solid').text('Done');
      if ($(this).hasClass('checked')){
        currentCheckbox.prop('checked', true);
      }
      else{
        currentCheckbox.prop('checked', false);
      }

      var ltSubCk = $(this).closest('.category-options').find('input[type="checkbox"]:checked').length;
      if(ltSubCk > 0){
        $('#btn-choose-category').addClass('btn-solid').text('Done');
      }else{
        $('#btn-choose-category').removeClass('btn-solid').text('Pick one or more');
      }
    });
    $('.category-options-radio>li').click(function(){
      $('.category-options-radio>li').removeClass('checked');
      $(this).addClass('checked');
      var currentRadiobox = $(this).find('input[type="radio"]');
      if ($(this).hasClass('checked')){
        currentRadiobox.prop('checked', true);
      }
      else{
        currentRadiobox.prop('checked', false);
      }
    });

    $('#btn-filter-country').click(function(e){
      e.preventDefault();
      $('#filter-country, #btn-filter-country-clear').show('fast');
      $('#filter-country-default').hide('fast');
      $('select').niceSelect();
    });
    $('#btn-filter-country-clear').click(function(e){
      e.preventDefault();
      $('#filter-country, #btn-filter-country-clear').hide('fast');
      $('#filter-country-default').show('fast');
    });

    $('.btn-dialog').click(function(e){
      e.preventDefault();
      var currentDialog = $('#'+ $(this).attr('show-dialog'));
      currentDialog.addClass('open');
      // $('.mdl-dialog-wrap').not(currentDialog).removeClass('open');
    });
    $('.btn-close').click(function(){
      $(this).closest('.mdl-dialog-wrap').removeClass('open');
    });
    // $(document).mouseup(function(e) {
    //   var container = $(".mdl-dialog-wrap dialog");
    //   if (!container.is(e.target) && container.has(e.target).length === 0) {
    //     container.closest('.mdl-dialog-wrap').removeClass('open');
    //   }
    // });

    $('.btn-step').click(function(){
      var currentStep = $(this).attr('goto-step');
      $('.steps-wrapper').attr('current-step', currentStep);
      $('#'+currentStep).addClass('open');
      $('.signup-step').not('#'+currentStep).removeClass('open');
      var indicatorStep = $('.step-indicator>li[step-for="'+ currentStep +'"]');
      indicatorStep.addClass('complete');
      $('.step-indicator>li').not(indicatorStep).removeClass('complete');
    });

    $(".field-range").change(function(){
      var range1 = $('#min-range').val();
      var range2 = $('#max-range').val();
      // Neither slider will clip the other, so make sure we determine which is larger
      if( range1 > range2 ){ var tmp = range2; range2 = range1; range1 = tmp; }
      $(".range-values .min").text("$ " + range1);
      $(".range-values .max").text("$ " + range2);
    });

    $('.rating').click(function(){
      $(this).addClass('active');
      $('.rating').not(this).removeClass('active');
      var currentStar = $(this).find('input[type="radio"]');
      if($(this).hasClass('active')){
        currentStar.prop('checked', true);
      }
      else{
        currentStar.prop('checked', false);
      }
    });

    $('.select-rating label.star input[type="radio"]').change(function(){
      if ($(this).is(':checked')){
        $(this).siblings('.icon-star').addClass('yellow');
        $('.select-rating label.star .icon-star').not($(this).siblings('.icon-star')).removeClass('yellow');
      }
      else{
        $(this).siblings('.icon-star').removeClass('yellow');
      }
      var labelID = $(this).parent('label').index();
      $('.select-rating label.star').each(function(){
        var curIndex = $(this).index();
        if(curIndex < labelID){
          $(this).find('.icon-star').addClass('yellow');
        }
        else{}
      });
    });

    $('.radio-label-box').click(function(){
      $(this).find('input[type="radio"]').prop('checked', true);
    });
    $('.radio-label[show-item]').click(function(){
      var radioDiv = $('#'+$(this).attr('show-item'));
      radioDiv.addClass('open');
      $('.radio-target').not(radioDiv).removeClass('open');
    });
    $('.field-group label.star input[type="radio"]').change(function(){
      if ($(this).is(':checked')){
        $(this).siblings('.icon-star').addClass('yellow');
        $('.field-group label.star .icon-star').not($(this).siblings('.icon-star')).removeClass('yellow');
      }
      else{
        $(this).siblings('.icon-star').removeClass('yellow');
      }
      var labelID = $(this).parent('label').index();
      $('.field-group label.star').each(function(){
        var curIndex = $(this).index();
        if(curIndex < labelID){
          $(this).find('.icon-star').addClass('yellow');
        }
        else{}
      });
    });

    $('.checkout-step>h5').click(function(){
      $(this).closest('.checkout-step').toggleClass('open');
    });
    $('.checkout-step .btn-step').click(function(){
      var currentStep = $('#'+ $(this).attr('checkout-step') );
      currentStep.addClass('open');
      $('.checkout-step').not(currentStep).removeClass('open');
      $(this).closest('.checkout-step').addClass('complete');
    });
    $('.btn-edit-preview').click(function(e){
      e.preventDefault();
      $(this).closest('.checkout-step').removeClass('complete').addClass('open');
    });

    $('.btn-change-photo').click(function(){

    });

    $('.product-preview-main').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      fade: true,
      asNavFor: '.product-preview-thumbnail'
    });
    $('.product-preview-thumbnail').slick({
      infinite: false,
      slidesToShow: 4,
      slidesToScroll: 1,
      asNavFor: '.product-preview-main',
      dots: false,
      centerMode: false,
      focusOnSelect: true,
      prevArrow:"<button type='button' class='slick-prev'><i class='icon icon-chevron-left'></i></button>",
			nextArrow:"<button type='button' class='slick-next'><i class='icon icon-chevron-right'></i></button>",
    });

    $('.brands-slider').slick({
      slidesToShow: 8,
      slidesToScroll: 2,
      arrows: true,
      dots: false,
      variableWidth: true,
      prevArrow:"<button type='button' class='slick-prev'><i class='icon icon-chevron-left'></i></button>",
			nextArrow:"<button type='button' class='slick-next'><i class='icon icon-chevron-right'></i></button>"
    });

    function photoUpload( file ) {
      if( file.type === 'image/png'  ||
          file.type === 'image/jpg'  ||
          file.type === 'image/jpeg' ||
          file.type === 'image/gif'  ||
          file.type === 'image/bmp'  ){
        var reader = new FileReader(),
            image = new Image();
        reader.readAsDataURL( file );
        reader.onload = function( _file ){
          $('#photo-preview').attr('src', _file.target.result);
        } // END reader.onload()
      } // END test if file.type === image
    }
    function coverUpload( file ) {
      if( file.type === 'image/png'  ||
          file.type === 'image/jpg'  ||
          file.type === 'image/jpeg' ||
          file.type === 'image/gif'  ||
          file.type === 'image/bmp'  ){
        var reader = new FileReader(),
            image = new Image();
        reader.readAsDataURL( file );
        reader.onload = function( _file ){
          $('#cover-preview').attr('src', _file.target.result);
        }
      }
    }
    $('#photo-file').change(function(e){
      // var fileName = e.target.files[0].name;
      // $('.photo-name>small').text(fileName);
      photoUpload( this.files[0] );
    });
    $('#cover-file').change(function(e){
      coverUpload( this.files[0] );
    });

    $('.btn-photo').mouseenter(function(){
      $(this).addClass('show');
    });
    $('.btn-photo').mouseleave(function(){
      if(! $(this).siblings('.img-preview').attr('src')){
        $(this).addClass('show');
        $('.img-preview').css('opacity', '1');
      }
      else{
        $(this).removeClass('show');
      }
    });
    $('.btn-photo').click(function(){
      $(this).siblings('.photo-file').trigger('click');
    });


    $('.price-box .onsale').change( function(){
      var wrapDiscount = $(this).closest('.price-boxes').find('.priceonsale');
      wrapDiscount.toggleClass('disabled');
      if (wrapDiscount.hasClass('disabled')){
       wrapDiscount.find('.priceonsale-input').prop( "disabled", true );
      }else{
        wrapDiscount.find('.priceonsale-input').prop( "disabled", false ).focus();
      }
      if (wrapDiscount.hasClass('disabled')){
       wrapDiscount.find('.hasDatepicker').prop( "disabled", true );
      }else{
        wrapDiscount.find('.hasDatepicker').prop( "disabled", false );
      }
      $('.date-sale').toggleClass('show');
    });

    $('.promogrid').hide();
    $('.promocode').change(function(){
      $('.promogrid').toggle();
    })

    $('.time-end').change(function(){
      $('.date-end-col').addClass('show');
    });

    $('#sale-start-date').click(function(e){
      e.preventDefault();
      $('.sale-start-action').hide();
      $('.on-start-date').addClass('show');
    });


    function productUpload( file ) {
      if( file.type === 'image/png'  ||
          file.type === 'image/jpg'  ||
          file.type === 'image/jpeg' ||
          file.type === 'image/gif'  ||
          file.type === 'image/bmp'  ||
          file.type === 'image/mp4'  ||
          file.type === 'image/mp3'  ||
          file.type === 'image/wav'  ){
        var reader = new FileReader(),
            image = new Image();
        reader.readAsDataURL( file );
        reader.onload = function( _file ){
          var itemProduct = '<div class="photo-wrapper">'+
            '<img class="img-preview product-preview" src="'+ _file.target.result +'">'+
            '<a href="#" class="btn-remove-img"><i class="icon icon-close-o"></i></a>'+
          '</div>';
          $('.product-photos').append(itemProduct);

          $('.btn-remove-img').click(function(e){
            e.preventDefault();
            $(this).closest('.photo-wrapper').remove();
          });

          $('.product-photos').siblings('.photo-wrapper').remove();
        }
      }
    }

    $('#product-file').change(function(e){
      productUpload( this.files[0] );
    });

    function productUploadpre( file ) {
      if( file.type === 'image/png'  ||
          file.type === 'image/jpg'  ||
          file.type === 'image/jpeg' ||
          file.type === 'image/gif'  ||
          file.type === 'image/bmp'  ||
          file.type === 'image/mp4'  ||
          file.type === 'image/mp3'  ||
          file.type === 'image/wav'  ){
        var reader = new FileReader(),
            image = new Image();
        reader.readAsDataURL( file );
        reader.onload = function( _file ){
          var itemProduct = '<li class="variant-new-photo">'+
            '<input type="radio" name="pp-product">'+
            '<div class="overlay">'+
              ' <i class="fa fa-check"></i>'+
            '</div>'+
            '<img src="'+_file.target.result+'">'+
           '</li>';
          $(itemProduct).insertBefore('.photo-wrapper-up');

          $('.category-options-radio>li').click(function(){
            $('.category-options-radio>li').removeClass('checked');
            $(this).addClass('checked');
            var currentRadiobox = $(this).find('input[type="radio"]');
            if ($(this).hasClass('checked')){
              currentRadiobox.prop('checked', true);
            }
            else{
              currentRadiobox.prop('checked', false);
            }
          });

          $('.btn-remove-img').click(function(e){
            e.preventDefault();
            $(this).closest('.variant-new-photo').remove();
          });

          $('.category-options-radio').siblings('.variant-new-photo').remove();
        }
      }
    }
    $('#product-file-variant').change(function(e){
      productUploadpre( this.files[0] );
    });

    $('.btn-remove-img').click(function(e){
      e.preventDefault();
      $(this).closest('.photo-wrapper').remove();
    });

    function removeRow(){
      $('.btn-remove').click(function(e){
        e.preventDefault();
        $(this).closest('tr').remove();
      });
    }
    removeRow();

    $('.inventory-contain .inventory-check').change(function(){
      var codeBox = $(this).closest('.inventory-contain').find('.field-inventory');
      codeBox.toggleClass('disabled');
      if (codeBox.hasClass('disabled')){
       codeBox.find('.sku-input').prop( "disabled", true );
       codeBox.find('.barcode-input').prop( "disabled", true );
      }else{
        codeBox.find('.sku-input').prop( "disabled", false );
        codeBox.find('.barcode-input').prop( "disabled", false );
      }
      var variationTable = $('.variation-wrapper').find('.field-table');
      variationTable.toggleClass('show');
    });


    //Add product variations
    $('#v-add-variation').click(function(e){
      e.preventDefault();

      if($('input.inventory-check').is(':checked')){
        var show = "show";
      }

      if(!$('.variation-wrapper').is(':visible'))
      {
        $('.variation-wrapper').show('fast');
        $('#more-variation-btn').addClass('show');
      }
      else{
        var newVariation = '<tr>'+
        '<td><div class="img-wrap"><img src="./assets/images/img-default.svg"></div></td>'+
        '<td>'+
            '<select>'+
                '<optgroup label="Offer multiple variations" data-i="1">'+
                    '<option>Unspecified</option>'+
                    '<option>I offer more than one</option>'+
                '</optgroup>'+
                '<optgroup label="Select a size" data-i="2">'+
                    '<option>XXXS</option>'+
                    '<option>XXS</option>'+
                    '<option>XS</option>'+
                    '<option>S</option>'+
                    '<option>M</option>'+
                    '<option>L</option>'+
                    '<option>XL</option>'+
                    '<option>XXL</option>'+
                    '<option>XXXL</option>'+
                '</optgroup>'+
            '</select>'+
        '</td>'+
        '<td>'+
            '<select>'+
                '<optgroup label="Offer multiple variations" data-i="1">'+
                    '<option>Unspecified</option>'+
                    '<option>I offer more than one</option>'+
                '</optgroup>'+
                '<optgroup label="Select a color" data-i="2">'+
                    '<option>Black</option>'+
                    '<option>Blue</option>'+
                    '<option>Brown</option>'+
                    '<option>Cream</option>'+
                    '<option>Green</option>'+
                    '<option>Grey</option>'+
                    '<option>Multicolor</option>'+
                    '<option>Orange</option>'+
                    '<option>Pink</option>'+
                    '<option>Purple</option>'+
                    '<option>Red</option>'+
                    '<option>White</option>'+
                    '<option>Yellow</option>'+
                '</optgroup>'+
            '</select>'+
        '</td>'+
        '<td><input type="number" placeholder="Unlimited"></td>'+
        '<td class="field-table '+ show +'">a</td>' +
        '<td class="field-table '+ show +'">aa</td>' +
        '<td class="col-price">'+
            '<a href="#" class="btn-link btn-add-price btn-dialog" show-dialog="dialog-variation">Add price</a>'+
        '</td>'+
        '<td>'+
            '<a href="#" class="btn-remove" onclick="removeLine()"><i class="icon icon-close-o"></i></a>'+
        '</td>'+
    '</tr>';

        $('.variation-wrapper table').append(newVariation);

        //Recall function after appended
        $('select').niceSelect();
        removeRow();
        $('.btn-dialog').click(function(e){
          e.preventDefault();
          var currentDialog = $('#'+ $(this).attr('show-dialog'));
          currentDialog.addClass('open');
          $('.mdl-dialog-wrap').not(currentDialog).removeClass('open');
        });
        $('.btn-close').click(function(){
          $(this).closest('.mdl-dialog-wrap').removeClass('open');
        });
      }
    });
    $('#v-add-option').click(function(e){
      e.preventDefault();
      var newOption = '<td><input type="text" placeholder="Unspecified"></td>';
      var newOptionTh = '<th>Option</th>';
      $(newOption).insertBefore('.variation-wrapper table tbody tr td.col-price');
      $(newOptionTh).insertBefore('.variation-wrapper table thead tr th.col-price');
    });

    $('#v-add-option-row').click(function(e){
      e.preventDefault();
      var indexOption = $('#table-option-row tbody tr').index();
      for (var i=0; i<10; i++){
        indexOption = indexOption + 1;
      }

      var newOption = '<tr>'+
      '<td>'+
          '<label>Option #'+ indexOption +'</label>'+
          '<select>'+
              '<option>Custom</option>'+
              '<option>Option 1</option>'+
              '<option>Option 2</option>'+
          '</select>'+
      '</td>'+
      '<td>'+
          '<label>&nbsp;</label>'+
          '<input type="text" placeholder="Option">'+
      '</td>'+
      '<td>'+
          '<label>&nbsp;</label>'+
          '<a href="#" class="btn-remove"><i class="icon icon-close-o"></i></a>'+
      '</td>'+
    '</tr>';

      $(newOption).appendTo('#table-option-row tbody');
      //Recall function after appended
      $('select').niceSelect();
      removeRow();
    });



    $('#btn-saledate').click(function(){
      $(this).hide();
      $(this).siblings('p').hide();
      $('.saledate-wrap').show('fast');
    });
    $('#dialog-variation .dialog-btns button').click( function(){
      setTimeout(function(){
        $('#btn-saledate').show();
        $('#btn-saledate').siblings('p').show();
        $('.saledate-wrap').hide();
      }, 150);
    });
    $('#pricing-toggle').click(function(e){
      e.preventDefault();
      $(this).text($(this).text() == 'Add Pricing' ? 'Turn off pricing' : 'Add Pricing');
      $('.btn-add-price').toggleClass('show');
    });

    function clickSubNav(){
      $( "table.sortable tr *" ).click(function(){
        var thisRow = $(this).closest('tr');
        var thisRowFor = $('#'+thisRow.attr('nav-for'));
        thisRow
        .addClass('active')
        .find('input[type="text"]').focus();
        thisRowFor.addClass('show');
        $('table.sortable tr').not(thisRow).removeClass('active');
        $('.navigation-wrapper-sub').not(thisRowFor).removeClass('show');

        var subNavTitle = thisRow.find('input[type="text"]').val();
        $('#mainmenu-title').text(subNavTitle);
      });
      $( "table.sortable tr input[type='text']" ).on('change keyup', function(){
        $('#mainmenu-title').text($(this).val());
      });
    }
    clickSubNav();

    // function changeNavCheckbox(){
    //   $( "table.sortable tr input[type='checkbox']" ).change(function(){
    //     var thisRow = $(this).closest('tr');
    //     var thisRowFor = $('#'+thisRow.attr('nav-for'));
    //     if($(this).is(':checked')){
    //     thisRow.addClass('active');
    //     thisRowFor.addClass('show');
    //     $('.navigation-wrapper-sub').not(thisRowFor).removeClass('show');
    //     }else{
    //       thisRow.removeClass('active');
    //       thisRowFor.removeClass('show');
    //     }
    //   });
    // }
    // changeNavCheckbox();

    function sortableRow(){
    $( "table.sortable tbody" ).sortable( {
      update: function( event, ui ) {
        $(this).find('tr').each(function(index) {
          $(this).find('tr').last().html(index + 1);
          $('select').niceSelect();
        });
      }
    });
    }
    sortableRow();

    var rowNum = $('.navigation-wrapper table tr').length +1;
    var rowSubNum = $('.navigation-wrapper table tr').length +1;
    $('#add-navigation').click(function(e){
      e.preventDefault();

      var newNavigation = '<tr nav-for="sub-nav'+rowNum+'">'+
          '<td>'+
              '<div class="field-agreement ml-1">'+
                  '<label class="label-check">'+
                      '<input type="checkbox" name="menu_state">'+
                  '</label>'+
              '</div>'+
          '</td>'+
          '<td><input type="text" placeholder="Menu Title" class="field-editable"></td>'+
          '<td>'+
              '<a href="#" class="btn-remove"><i class="icon icon-close-o"></i></a>'+
          '</td>'+
        '</tr>';
        $('.navigation-wrapper table').append(newNavigation);

      var newSubNavigation = '<div class="field-group navigation-wrapper-sub" id="sub-nav'+rowSubNum+'">'+
          '<table class="sortable">'+
              '<tbody>'+
              '</tbody>'+
          '</table>'+
          '<br>'+
          '<a href="#" class="btn-link with-border add-navigation-sub">+ Add submenu item</a><br>'+
      '</div>';
      $('#sub-navigation-groups').append(newSubNavigation);

        rowNum++;
        rowSubNum++;
        //Recall function after appended
        $('select').niceSelect();
        removeRow();
        clickSubNav();
        addSubNavItem();
        sortableRow();
    });

    function addSubNavItem(){
    $('.add-navigation-sub').click(function(e){
      e.preventDefault();
      var newItemNavigation = '<tr>'+
          '<td>'+
              '<div class="field-agreement ml-1">'+
                  '<label class="label-check">'+
                      '<input type="checkbox" name="menu_state">'+
                  '</label>'+
              '</div>'+
          '</td>'+
          '<td><input type="text" placeholder="Submenu Title" class="field-editable"></td>'+
          '<td>'+
              '<a href="#" class="btn-remove"><i class="icon icon-close-o"></i></a>'+
          '</td>'+
        '</tr>';
        $(this).closest('.navigation-wrapper-sub').find('table').append(newItemNavigation);

        removeRow();
        sortableRow();
    });
    }
    addSubNavItem();

    $('.select-for-sub').change(function(){
      if($(this).value != 0){
        $(this).closest('.select-with-sub').toggleClass('open-sub');
      }
    });


    $('.category-1').change(function(){
      if($(this).value != 0){
        $('.category-2-content').addClass('category-sub-2');
      }
    });

    $('.category-2').change(function(){
      if($(this).value != 0){
        $('.category-3-content').addClass('category-sub-3');
        $('.category-1-content').addClass('col-cat--3');
        $('.category-2-content').addClass('col-cat--3');

      }
    });

    $('.category-3').change(function(){
      if($(this).value != 0){
        $('.category-4-content').addClass('category-sub-4');
        $('.category-1-content').addClass('col-cat--2');
        $('.category-2-content').addClass('col-cat--2');
        $('.category-3-content').addClass('col-cat--2');
      }
    });

    $('#account-type #account_business').change(function(){
      $('#abn-details').addClass('show');
      $('#personal-details').removeClass('show');
    });
    $('#account-type #account_personal').change(function(){
      $('#abn-details').removeClass('show');
      $('#personal-details').addClass('show');
    });

    $('#abn-type #abn_number').change(function(){
      $('#abn').addClass('show');
      $('#acn').removeClass('show');
    });
    $('#abn-type #acn_number').change(function(){
      $('#abn').removeClass('show');
      $('#acn').addClass('show');
    });

    $('#search-main').on('input keyup', function(){
      $('#dialog-search').addClass('open');
      if($(this).val()==""){
        $('#dialog-search').removeClass('open');

     
      }
    });
    $('.package-option').change(function(){
      if($(this).val()=="AutoPost Satchel" || $(this).val()=="AutoPost Box"){
        $('.package-size').css('display', 'block');
      }else{
        $('.package-size').css('display', 'none');
      }
    });

    var li = $('.suggest-list');
    var suggestSelect;
    $(window).keydown(function(e){
        if(e.which === 40){
            if(suggestSelect){
                suggestSelect.removeClass('selected');
                var next = suggestSelect.next();
                if(next.length > 0){
                    suggestSelect = next.addClass('selected');
                }else{
                    suggestSelect = li.eq(0).addClass('selected');
                }
            }else{
                suggestSelect = li.eq(0).addClass('selected');
            }
        }else if(e.which === 38){
            if(suggestSelect){
                suggestSelect.removeClass('selected');
                var next = suggestSelect.prev();
                if(next.length > 0){
                    suggestSelect = next.addClass('selected');
                }else{
                    suggestSelect = li.last().addClass('selected');
                }
            }else{
                suggestSelect = li.last().addClass('selected');
            }
        }
        // selectOption()
    });

    // function selectOption() {
    //   $("#search-main").val($(".suggest-list.selected a").text());
    // }
    // function searchTag(){
    //   var resultTag = $('.field-search #search-auto-tag').val();
    //   var searchTag = $( "<span class='search-tag'>" + resultTag +" <a href='#' class='btn-close'><i class='icon icon-close-o'></i></a></span>" );
    //   $('.result-tags').append(searchTag);
    // }
    $('.field-search .btn-plus').click(function(){
      searchTag();
    });
    $('.search-tag .btn-close').click(function(){
      $(this).closest('.search-tag').remove();
    });

    $('.close-btn').click(function(){
      $(this).closest('.close-wrap').hide();
    });

    $('.btn-file').click(function(){
      $(this).siblings('.input-file').trigger('click');
    });
    function fileUpload( file ) {
      if( file.type === 'image/png'  ||
          file.type === 'image/jpg'  ||
          file.type === 'image/jpeg' ||
          file.type === 'image/gif'  ||
          file.type === 'image/bmp'  ){
        var reader = new FileReader(),
            image = new Image();
        reader.readAsDataURL( file );
      }
    }
    $('.input-file').change(function(e){
      var fileName = e.target.files[0].name;
      $(this).siblings('.btn-file').text(fileName).css('background', 'transparent');
      fileUpload( this.files[0] );
    });

    if ($('.chart-wrapper').length){
      var optionChart = {
        responsive: true,
        maintainAspectRatio: false,
        showLines: true,
        scales: {
          yAxes: [{
              ticks: {
                  min: 0,
              },
              ticks: {
                // Include a dollar sign in the ticks
                  callback: function(value, index, values) {
                    if(value > 999){    
                      var temp = value.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1.');
                      var divide = value / 1000;
                      if(divide < 1000 && divide >= 1){
                          return divide+"K";
                      }else{
                        return divide+"K";
                      }
                    }else{
                      return value;
                  }
                }
              }
          }],
          xAxes:[{
              gridLines: {
                display:false,
                color: "rgba(0,0,0,0)"
              },
              ticks: {
                  autoSkip: true,
                  maxTicksLimit: 5,
                  maxRotation: 0
              }
          }]
        },
        legend: {
          display: false
        },
        tooltips: {
					intersect: false,
					mode: 'index',
					callbacks: {
						label: function(tooltipItem, myData) {
							var label = myData.datasets[tooltipItem.datasetIndex].label || '';
							if (label) {
								label += ': ';
							}
							label += parseFloat(tooltipItem.value).toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1.');
							return label;
						}
					}
				}
      }
      var ctImpressions = $("#chart-impressions");
      var impressionsDate1 = {
          labels: ["29 Jan", "1 Feb", "2 Feb", "3 Feb", "4 Feb", "5 Feb", "6 Feb"],
          datasets: [{
            data: [100, 2000, 3000, 4012, 3211, 3212, 3212],
            label: "Impressions",
            borderColor: "#D2A542",
            borderWidth: 1.5,
            backgroundColor: "#ffe6af",
            pointBackgroundColor: "#D2A542",
            pointRadius: 0,
            fill: true,
            lineTension: 0
          }],
      };
      var impressionsDate2 = {
          labels: ["6 Jan", "7 Jan", "8 Jan", "9 Jan", "10 Jan", "11 Jan", "12 Jan", "13 Jan", "14 Jan", "15 Jan", "16 Jan", "17 Jan", "18 Jan", "19 Jan", "20 Jan", "21 Jan", "22 Jan", "23 Jan", "24 Jan", 
          "25 Jan", "26 Jan", "27 Jan", "28 Jan", "29 Jan", "1 Feb", "2 Feb", "3 Feb", "4 Feb", "5 Feb", "6 Feb"],
          datasets: [{
            data: [20000, 10092, 23020, 75002, 50190, 300390, 102910, 201233, 101231, 203123, 751231, 501231, 302221, 1053221,
              20000, 10092, 23020, 75002, 50190, 300390, 102910, 201233, 101231, 203123, 751231, 501231, 302221, 1053221, 201233, 101231],
            label: "Impressions",
            borderColor: "#D2A542",
            borderWidth: 1.5,
            backgroundColor: "#ffe6af",
            pointBackgroundColor: "#D2A542",
            pointRadius: 0,
            fill: true,
            lineTension: 0
          }],
      };
      var impressionsDate3 = {
          labels: [  "7 Des", "8 Des", "9 Des", "10 Des", "11 Des", "12 Des", "13 Des", "14 Des", "15 Des", "16 Des", "17 Des", "18 Des", "19 Des", "20 Des", "21 Des", "22 Des", "23 Des", "24 Des", 
            "25 Des", "26 Des", "27 Des", "28 Des", "29 Des", "30 Des", "31 Des", "1 Jan", "2 Jan", "3 Jan", "4 Jan", "5 Jan",
            "6 Jan", "7 Jan", "8 Jan", "9 Jan", "10 Jan", "11 Jan", "12 Jan", "13 Jan", "14 Jan", "15 Jan", "16 Jan", "17 Jan", "18 Jan", "19 Jan", "20 Jan", "21 Jan", "22 Jan", "23 Jan", "24 Jan", 
            "25 Jan", "26 Jan", "27 Jan", "28 Jan", "29 Jan", "1 Feb", "2 Feb", "3 Feb", "4 Feb", "5 Feb", "6 Feb"],
          datasets: [{
            data: [20000, 10092, 23020, 75002, 50190, 300390, 102910, 201233, 101231, 203123, 751231, 501231, 302221, 1053221,
              20000, 10092, 23020, 75002, 50190, 300390, 102910, 201233, 101231, 203123, 751231, 501231, 302221, 1053221, 201233, 101231,
              20000, 10092, 23020, 75002, 50190, 300390, 102910, 201233, 101231, 203123, 751231, 501231, 302221, 1053221,
              20000, 10092, 23020, 75002, 50190, 300390, 102910, 201233, 101231, 203123, 751231, 501231, 302221, 1053221, 201233, 101231
            ],
            label: "Impressions",
            borderColor: "#D2A542",
            borderWidth: 1.5,
            backgroundColor: "#ffe6af",
            pointBackgroundColor: "#D2A542",
            pointRadius: 0,
            fill: true,
            lineTension: 0
          }],
      };
      var impressionsDate4 = {
        labels: ['Jan','Feb','Mar','Apr','Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Nov', 'Des'],
        datasets: [{
          data: [20000, 10092, 23020, 75002, 50190, 123123, 123112, 12311, 23123, 123121, 56271, 17282],
            label: "Impressions",
            borderColor: "#D2A542",
            borderWidth: 1.5,
            backgroundColor: "#ffe6af",
            pointBackgroundColor: "#D2A542",
            pointRadius: 0,
            fill: true,
            lineTension: 0
          }],
      };
      var impressionsTime2 = {
        labels: ["06 AM", "07 AM", "08 AM", "09 AM", "10 AM", "11 AM", "12 AM", "01 PM", "02 PM", "03 PM", "04 PM", "05 PM", "06 PM" ],
        datasets: [{
          data: [10, 30, 10, 39, 22, 41, 12, 90, 50, 20, 30, 40, 20 ],
          label: "Impressions",
          borderColor: "#D2A542",
          borderWidth: 1.5,
          backgroundColor: "#ffe6af",
          pointBackgroundColor: "#D2A542",
          pointRadius: 0,
          fill: true,
          lineTension: 0
        }],
      };
    
      var chartImpressions = new Chart(ctImpressions, {
        type: 'line',
        data: impressionsDate1,
        options: optionChart
      });


      var ctViews = $("#chart-views");
      var dtviewDate1 = {
          labels: ["29 Jan", "1 Feb", "2 Feb", "3 Feb", "4 Feb", "5 Feb", "6 Feb"],
          datasets: [{
            data: [20000, 10092, 23020, 75002, 50190, 300390, 102910],
            label: "Impressions",
            borderColor: "#D2A542",
            borderWidth: 1.5,
            backgroundColor: "#ffe6af",
            pointBackgroundColor: "#D2A542",
            pointRadius: 0,
            fill: true,
            lineTension: 0
          }],
      };
      var dtviewDate2 = {
          labels: ["6 Jan", "7 Jan", "8 Jan", "9 Jan", "10 Jan", "11 Jan", "12 Jan", "13 Jan", "14 Jan", "15 Jan", "16 Jan", "17 Jan", "18 Jan", "19 Jan", "20 Jan", "21 Jan", "22 Jan", "23 Jan", "24 Jan", 
          "25 Jan", "26 Jan", "27 Jan", "28 Jan", "29 Jan", "1 Feb", "2 Feb", "3 Feb", "4 Feb", "5 Feb", "6 Feb"],
          datasets: [{
            data: [20000, 10092, 23020, 75002, 50190, 300390, 102910, 201233, 101231, 203123, 751231, 501231, 302221, 1053221,
              20000, 10092, 23020, 75002, 50190, 300390, 102910, 201233, 101231, 203123, 751231, 501231, 302221, 1053221, 201233, 101231],
            label: "Impressions",
            borderColor: "#D2A542",
            borderWidth: 1.5,
            backgroundColor: "#ffe6af",
            pointBackgroundColor: "#D2A542",
            pointRadius: 0,
            fill: true,
            lineTension: 0
          }],
      };
      var dtviewDate3 = {
          labels: [  "7 Des", "8 Des", "9 Des", "10 Des", "11 Des", "12 Des", "13 Des", "14 Des", "15 Des", "16 Des", "17 Des", "18 Des", "19 Des", "20 Des", "21 Des", "22 Des", "23 Des", "24 Des", 
            "25 Des", "26 Des", "27 Des", "28 Des", "29 Des", "30 Des", "31 Des", "1 Jan", "2 Jan", "3 Jan", "4 Jan", "5 Jan",
            "6 Jan", "7 Jan", "8 Jan", "9 Jan", "10 Jan", "11 Jan", "12 Jan", "13 Jan", "14 Jan", "15 Jan", "16 Jan", "17 Jan", "18 Jan", "19 Jan", "20 Jan", "21 Jan", "22 Jan", "23 Jan", "24 Jan", 
            "25 Jan", "26 Jan", "27 Jan", "28 Jan", "29 Jan", "1 Feb", "2 Feb", "3 Feb", "4 Feb", "5 Feb", "6 Feb"],
          datasets: [{
            data: [20000, 10092, 23020, 75002, 50190, 300390, 102910, 201233, 101231, 203123, 751231, 501231, 302221, 1053221,
              20000, 10092, 23020, 75002, 50190, 300390, 102910, 201233, 101231, 203123, 751231, 501231, 302221, 1053221, 201233, 101231,
              20000, 10092, 23020, 75002, 50190, 300390, 102910, 201233, 101231, 203123, 751231, 501231, 302221, 1053221,
              20000, 10092, 23020, 75002, 50190, 300390, 102910, 201233, 101231, 203123, 751231, 501231, 302221, 1053221, 201233, 101231
            ],
            label: "Impressions",
            borderColor: "#D2A542",
            borderWidth: 1.5,
            backgroundColor: "#ffe6af",
            pointBackgroundColor: "#D2A542",
            pointRadius: 0,
            fill: true,
            lineTension: 0
          }],
      };
      var dtviewDate4 = {
          labels: ['Jan','Feb','Mar','Apr','Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Nov', 'Des'],
          datasets: [{
            data: [20000, 10092, 23020, 75002, 50190, 123123, 123112, 12311, 23123, 123121, 56271, 17282],
            label: "Impressions",
            borderColor: "#D2A542",
            borderWidth: 1.5,
            backgroundColor: "#ffe6af",
            pointBackgroundColor: "#D2A542",
            pointRadius: 0,
            fill: true,
            lineTension: 0
          }],
      };
      var dtviewTime = {
        labels: ["06 AM", "07 AM", "08 AM", "09 AM", "10 AM", "11 AM", "12 AM", "01 PM", "02 PM", "03 PM", "04 PM", "05 PM", "06 PM" ],
        datasets: [{
          data: [10, 30, 10, 39, 22, 41, 12, 90, 50, 20, 30, 40, 20 ],
          label: "Impressions",
          borderColor: "#D2A542",
          borderWidth: 1.5,
          backgroundColor: "#ffe6af",
          pointBackgroundColor: "#D2A542",
          pointRadius: 0,
          fill: true,
          lineTension: 0
        }],
      };
      var chartViews = new Chart(ctViews, {
        type: 'line',
        data: dtviewDate1,
        options: optionChart
      });

      var ctUsers = $("#chart-users");
      var dtUser = {
        labels: ["29 Jan", "1 Feb", "2 Feb", "3 Feb", "4 Feb", "5 Feb", "6 Feb"],
        datasets: [{
          data: [20000, 10092, 23020, 75002, 50190, 300390, 102910],
          label: "Views",
          borderColor: "#D2A542",
          borderWidth: 1.5,
          backgroundColor: "#ffe6af",
          pointBackgroundColor: "#D2A542",
          pointRadius: 0,
          fill: true,
          lineTension: 0

        }],
      }
      var chartUsers = new Chart(ctUsers, {
        type: 'line',
        data: dtUser,
        options: optionChart
      });

      var ctOrders = $("#chart-orders");
      var dtOrder = {
        labels: ["29 Jan", "1 Feb", "2 Feb", "3 Feb", "4 Feb", "5 Feb", "6 Feb"],
          datasets: [{
            data: [20000, 10092, 23020, 75002, 50190, 300390, 102910],
          label: "Views",
          borderColor: "#D2A542",
          borderWidth: 1.5,
          backgroundColor: "#ffe6af",
          pointBackgroundColor: "#D2A542",
          pointRadius: 0,
          fill: true,
          lineTension: 0

        }],
      }
      var chartOrders = new Chart(ctOrders, {
        type: 'line',
        data: dtOrder,
        options: optionChart
      });

      var ctRevenue = $("#chart-revenue");
      var dtRevenue = {
        labels: ["29 Jan", "1 Feb", "2 Feb", "3 Feb", "4 Feb", "5 Feb", "6 Feb"],
          datasets: [{
            data: [20000, 10092, 23020, 75002, 50190, 300390, 102910],
          label: "Views",
          borderColor: "#D2A542",
          borderWidth: 1.5,
          backgroundColor: "#ffe6af",
          pointBackgroundColor: "#D2A542",
          pointRadius: 0,
          fill: true,
          lineTension: 0
        }],
      }
      var chartRevenue = new Chart(ctRevenue, {
        type: 'line',
        data: dtRevenue,
        options: optionChart
      });

    }

    $('.select-day').change(function(){
      if($(this).val() == 0){
       var ctImpressions2 = $("#chart-impressions");
       var chartImpressions2 = new Chart(ctImpressions2, {
         data: impressionsTime2,
         type: 'line',
         options: optionChart
       });
       var ctViews2 = $("#chart-views");
       var chartViews2 = new Chart(ctViews2, {
         type: 'line',
         data: impressionsTime2,
         options: optionChart
       });
       
       var ctUsers2 = $("#chart-users");
       var chartUsers2 = new Chart(ctUsers2, {
         type: 'line',
         data: impressionsTime2,
         options: optionChart
       });
       
       var ctOrders2 = $("#chart-orders");
       var chartOrders2 = new Chart(ctOrders2, {
         type: 'line',
         data: impressionsTime2,
         options: optionChart
       });
       
       var ctRevenue2 = $("#chart-revenue");
       var chartRevenue2 = new Chart(ctRevenue2, {
         type: 'line',
         data: impressionsTime2,
         options: optionChart
       });
      }else if($(this).val() == 1){
       var ctImpressions1 = $("#chart-impressions");
       var chartImpressions1 = new Chart(ctImpressions1, {
         data: impressionsDate1,
         type: 'line',
         options: optionChart
       });
       var ctViews1 = $("#chart-views");
       var chartViews1 = new Chart(ctViews1, {
         type: 'line',
         data: dtviewDate1,
         options: optionChart
       });
       var ctUsers1 = $("#chart-users");
       var chartUsers1 = new Chart(ctUsers1, {
         type: 'line',
         data: dtUser,
         options: optionChart
       });
       
       var ctOrders1 = $("#chart-orders");
       var chartOrders1 = new Chart(ctOrders1, {
         type: 'line',
         data: dtOrder,
         options: optionChart
       });
       
       var ctRevenue1 = $("#chart-revenue");
       var chartRevenue1 = new Chart(ctRevenue1, {
         type: 'line',
         data: dtRevenue,
         options: optionChart
       });
      }else if($(this).val() == 2){
       var ctImpressions3= $("#chart-impressions");
       var chartImpressions3 = new Chart(ctImpressions3, {
         data: impressionsDate2,
         type: 'line',
         options: optionChart
       });
       var ctViews1 = $("#chart-views");
       var chartViews1 = new Chart(ctViews1, {
         type: 'line',
         data: dtviewDate2,
         options: optionChart
       });
       var ctUsers1 = $("#chart-users");
       var chartUsers1 = new Chart(ctUsers1, {
         type: 'line',
         data: dtviewDate2,
         options: optionChart
       });
       
       var ctOrders1 = $("#chart-orders");
       var chartOrders1 = new Chart(ctOrders1, {
         type: 'line',
         data: dtviewDate2,
         options: optionChart
       });
       
       var ctRevenue1 = $("#chart-revenue");
       var chartRevenue1 = new Chart(ctRevenue1, {
         type: 'line',
         data: dtviewDate2,
         options: optionChart
       });
      }else if($(this).val() == 3){
       var ctImpressions3= $("#chart-impressions");
       var chartImpressions3 = new Chart(ctImpressions3, {
         data: impressionsDate3,
         type: 'line',
         options: optionChart
       });
       var ctViews1 = $("#chart-views");
       var chartViews1 = new Chart(ctViews1, {
         type: 'line',
         data: dtviewDate3,
         options: optionChart
       });
       var ctUsers1 = $("#chart-users");
       var chartUsers1 = new Chart(ctUsers1, {
         type: 'line',
         data: dtviewDate3,
         options: optionChart
       });
       
       var ctOrders1 = $("#chart-orders");
       var chartOrders1 = new Chart(ctOrders1, {
         type: 'line',
         data: dtviewDate3,
         options: optionChart
       });
       
       var ctRevenue1 = $("#chart-revenue");
       var chartRevenue1 = new Chart(ctRevenue1, {
         type: 'line',
         data: dtviewDate3,
         options: optionChart
       });
      }else{
       var ctImpressions3= $("#chart-impressions");
       var chartImpressions3 = new Chart(ctImpressions3, {
         data: impressionsDate4,
         type: 'line',
         options: optionChart
       });
       var ctViews1 = $("#chart-views");
       var chartViews1 = new Chart(ctViews1, {
         type: 'line',
         data: dtviewDate4,
         options: optionChart
       });
       var ctUsers1 = $("#chart-users");
       var chartUsers1 = new Chart(ctUsers1, {
         type: 'line',
         data: dtviewDate4,
         options: optionChart
       });
       
       var ctOrders1 = $("#chart-orders");
       var chartOrders1 = new Chart(ctOrders1, {
         type: 'line',
         data: dtviewDate4,
         options: optionChart
       });
       
       var ctRevenue1 = $("#chart-revenue");
       var chartRevenue1 = new Chart(ctRevenue1, {
         type: 'line',
         data: dtviewDate4,
         options: optionChart
       });
      }
    });

    // Datepicker start //
    $('#ui-datepicker-div').find('a').click(function(){
      $(this).closest('.ui-datepicker').hide();
    });

    var headerHtml = $(".ui-datepicker-material-header");

    var changeMaterialHeader = function(header, date) {
      var year   = date.format('YYYY');
      var month  = date.format('MMM');
      var dayNum = date.format('D');
      var isoDay = date.isoWeekday();

      var weekday = new Array(7);
      weekday[1] = "Monday";
      weekday[2] = "Tuesday";
      weekday[3] = "Wednesday";
      weekday[4] = "Thursday";
      weekday[5] = "Friday";
      weekday[6] = "Saturday";
      weekday[7]=  "Sunday";

      $('.ui-datepicker-material-day', header).text(weekday[isoDay]);
      $('.ui-datepicker-material-year', header).text(year);
      $('.ui-datepicker-material-month', header).text(month);
      $('.ui-datepicker-material-day-num', header).text(dayNum);
    };

    $.datepicker._selectDateOverload = $.datepicker._selectDate;
    $.datepicker._selectDate = function(id, dateStr) {
      var target = $(id);
      var inst = this._getInst(target[0]);
      inst.inline = true;
      $.datepicker._selectDateOverload(id, dateStr);
      inst.inline = false;
      this._updateDatepicker(inst);

      headerHtml.remove();
      $(".ui-datepicker").prepend(headerHtml);
      $('#ui-datepicker-div').hide();
    };

    $("input[data-type='date']").on("focus", function() {
      //var date;
      //if (this.value == "") {
      //  date = moment();
      //} else {
      //  date = moment(this.value, 'MM/DD/YYYY');
      //}

      $(".ui-datepicker").prepend(headerHtml);
      //$(this).datepicker._selectDate(this, date);
    });

    $("input[data-type='date']").datepicker({
      showButtonPanel: true,
      closeText: 'OK',
      onSelect: function(date, inst) {
        changeMaterialHeader(headerHtml, moment(date, 'MM/DD/YYYY'));
      },
    });

    $('.btn-calendar').click(function(){
      $(this).siblings('.field-calendar').focus();
      var reset = '<div class="resetBtn"><a href="#" class="reset">Reset</a></div>';
      $('.ui-datepicker-buttonpane').append(reset);
    });


    $('#ui-datepicker-div').on('click','.reset', function (e) {
      e.preventDefault();
        $(this).closest('.ui-datepicker-buttonpane').parents('#ui-datepicker-div').find('.ui-state-default').removeClass('ui-state-active');
        // $(this).closest('.ui-datepicker-buttonpane').parents('#ui-datepicker-div').hide();
    });

    $('.btn-print-page').click(function(e){
      e.preventDefault();
      window.print();
    });

    $('#percent-off').change(function(){
      $('#amount-sign').text('%');
    });
    $('#money-off').change(function(){
      $('#amount-sign').text('$');
    });

    $('.btn-apply-promo').click(function(){
      $('.msg-success').show();
    });

    changeMaterialHeader(headerHtml, moment());
    $('input[type="date"]').datepicker('show');
    // Datepicker end //

    $('a[href^="#"]').on('click', function(event) {

      var target = $( $(this).attr('href') );

      if( target.length ) {
          event.preventDefault();
          $('html, body').animate({
              scrollTop: target.offset().top
          }, 1500);
      }

    });

    $(".decimal").on("input", function(evt) {
      var self = $(this);
      self.val(self.val().replace(/[^0-9\.]/g, ''));
      if ((evt.which != 46 || self.val().indexOf('.') != -1) && (evt.which < 48 || evt.which > 57))
      {
        evt.preventDefault();
      }
    });

    $("input[data-type='currency']").on({
      keyup: function() {
        formatCurrency($(this));
      },
      blur: function() {
        formatCurrency($(this), "blur");
      }
    });
    function formatNumber(n) {
    // format number 1000000 to 1,234,567
    return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
    function formatCurrency(input, blur) {
    // appends $ to value, validates decimal side
    // and puts cursor back in right position.

    // get input value
    var input_val = input.val();

    // don't validate empty input
    if (input_val === "") { return; }

    // original length
    var original_len = input_val.length;

    // initial caret position
    var caret_pos = input.prop("selectionStart");

    // check for decimal
    if (input_val.indexOf(".") >= 0) {

      // get position of first decimal
      // this prevents multiple decimals from
      // being entered
      var decimal_pos = input_val.indexOf(".");

      // split number by decimal point
      var left_side = input_val.substring(0, decimal_pos);
      var right_side = input_val.substring(decimal_pos);

      // add commas to left side of number
      left_side = formatNumber(left_side);

      // validate right side
      right_side = formatNumber(right_side);

      // On blur make sure 2 numbers after decimal
      if (blur === "blur") {
        right_side += "00";
      }

      // Limit decimal to only 2 digits
      right_side = right_side.substring(0, 2);

      // join number by .
      input_val =  left_side + "." + right_side;

    } else {
      // no decimal entered
      // add commas to number
      // remove all non-digits
      input_val = formatNumber(input_val);
      input_val =  input_val;

      // final formatting
      if (blur === "blur") {
        input_val += ".00";
      }
    }

    // send updated string to input
    input.val(input_val);

    // put caret back in the right position
    var updated_len = input_val.length;
    caret_pos = updated_len - original_len + caret_pos;
    input[0].setSelectionRange(caret_pos, caret_pos);
    }


    $('.drop-photo').sortable();

    $(".drop-photo").dropzone({
      url: "/file/post",
      items:'.dz-preview',
      cursor: 'move',
      opacity: 0.5,
      containment: '.drop-photo',
      distance: 20,
      tolerance: 'pointer'
    });

  });

  $('.product-tag').select2({
    tags: true,
  });

  var txt= $('.product-name').text();
  if(txt.length > 25)
  $('.product-name').text(txt.substring(0, 24) + '...');

  $('.tab-pane').click(function(){
		var tab_id = $(this).attr('data-tab');

		$('.tab-content').removeClass('is-active');

		$(this).addClass('is-active');
		$("#"+tab_id).addClass('is-active');
	})

  var animateFixHead = 539;
  $(window).scroll(function() {
    var scroll = onScroll();
      if ( scroll >= animateFixHead ) {
          $(".shop-bar").addClass("shrink");
          $(".preview-list").addClass("shop-bar-space");
        }
        else {
            $(".shop-bar").removeClass("shrink");
            $(".preview-list").removeClass("shop-bar-space");

        }
    });
    function onScroll() {
        return window.pageYOffset || document.documentElement.scrollTop;
    }

    $('#textcount').on('keyup',function(){
      var charCount = $(this).val().length;
      $('.result-count').text(150-charCount);
   });

  var initialValue = 1;

  var sliderTooltip = function(event, ui) {
      var curValue = ui.value || initialValue;
      var tooltip = '<div class="tooltip"><div class="tooltip-inner">' + curValue+'/10' + '</div></div>';
      $('.ui-slider-handle').html(tooltip);
      $("#amount").val(curValue).trigger("change");
      if(curValue === 1){
        $('#result-quality').text('Branded')
      }else if(curValue === 2){
        $('#result-quality').text('Good')
      }else if(curValue === 3){
        $('#result-quality').text('Second')
      }else if(curValue === 4){
        $('#result-quality').text('Great')
      }else if(curValue === 5){
        $('#result-quality').text('Nice')
      }else if(curValue === 6){
        $('#result-quality').text('Great')
      }else if(curValue === 7){
        $('#result-quality').text('Second')
      }else if(curValue === 8){
        $('#result-quality').text('Like New')
      }else if(curValue === 9){
        $('#result-quality').text('New')
      }else if(curValue === 10){
        $('#result-quality').text('Original')
      }
  }

  $( "#quality" ).slider({
      range: "min",
      value: 1,
      min: 1,
      max: 10,
      create: sliderTooltip,
      slide: sliderTooltip
  });

  $('.notes').on('click', '.add-notes', function(e){
    e.preventDefault();
    var months    = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var dt = new Date();
    dt.setHours(dt.getHours()+2);
    var isPM = dt.getHours() >= 12;
    var isMidday = dt.getHours() == 12;
    var times = [dt.getHours() - (isPM && !isMidday ? 12 : 0), 
                dt.getMinutes()].join(':') +
                (isPM ? ' PM' : 'AM');
    var time = months[dt.getMonth()] + ' ' + dt.getDate() + ' , '+ dt.getFullYear() + ' , ' + times;
    var textNotes = $('.notearea').val();
    console.log(textNotes);
    $(this).closest('.notes').find('.note-list').addClass('active');
    var newRow = $("<tr>");
    var cols = "";
    cols += '<td style="width: 380px;">'+ time +'</td>';
    cols += '<td>'+ textNotes +'</td>';
    newRow.append(cols);
    $(".note-list table").append(newRow);
    $('.notearea').val('');   
  })

  $('.products-special .product-mini').loadMoreResults({
    tag: {
      name: 'div',
      'class': 'product-item'
    },
    displayedItems: 20,
    showItems: 20,
    button: {
      'class': 'product-load-more',
      text: 'Load More'
    }
  });
})();

