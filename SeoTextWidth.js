(function ($, window, document) {
  'use strict';

  var settings = window.config && window.config.SeoTextWidth ? window.config.SeoTextWidth : null;
  if (!settings || !Array.isArray(settings.fields) || !settings.fields.length) {
    return;
  }

  var messages = $.extend({
    empty: 'Start typing to measure SEO width.',
    tooShort: 'Too short',
    good: 'Good length',
    tooLong: 'Too long',
    pixels: 'px',
    characters: 'characters',
    recommended: 'Recommended'
  }, settings.messages || {});

  var languageSeparator = '_' + '_';

  function textWidth(text, font) {
    var canvas = textWidth.canvas || (textWidth.canvas = document.createElement('canvas'));
    var context = canvas.getContext('2d');
    context.font = [font.weight || '400', font.size || '16px', font.family || 'Arial, sans-serif'].join(' ');
    return Math.ceil(context.measureText(text || '').width);
  }

  function inputLabel($input, field) {
    var id = $input.attr('id');
    var label = id ? $('label[for="' + id.replace(/"/g, '\\"') + '"]').first().text().trim() : '';
    var lang = '';
    var name = String($input.attr('name') || '');
    var languageMatch = name.match(new RegExp(languageSeparator + '(\\d+)$'));

    if (languageMatch) {
      var $languageContainer = $input.closest('[data-language], .LanguageSupport, .InputfieldLanguage');
      lang = $languageContainer.attr('data-language') || $languageContainer.find('.langTab, .LanguageSupportLabel, .InputfieldHeader').first().text().trim();
    }

    label = label || field.label || field.name;
    return lang ? label + ' - ' + lang : label;
  }

  function statusFor(width, value, field) {
    if (!value.length) {
      return { state: 'empty', label: messages.empty };
    }
    if (width < field.minWidth) {
      return { state: 'short', label: messages.tooShort };
    }
    if (width > field.maxWidth) {
      return { state: 'long', label: messages.tooLong };
    }
    return { state: 'good', label: messages.good };
  }

  function meterPercent(width, field) {
    var max = Math.max(1, field.maxWidth);
    return Math.max(0, Math.min(120, Math.round((width / max) * 100)));
  }

  function buildPanel($input, field) {
    var panelId = 'seo-text-width-' + ($input.attr('id') || Math.random().toString(36).slice(2));
    var $existing = $('#' + panelId);
    if ($existing.length) {
      return $existing;
    }

    var $panel = $('<div/>', {
      id: panelId,
      class: 'seo-text-width-panel',
      'data-seo-text-width-kind': field.kind
    });

    $panel.html(
      '<div class="seo-text-width-panel_head">' +
        '<span class="seo-text-width-panel_eyebrow"></span>' +
        '<strong class="seo-text-width-panel_status"></strong>' +
      '</div>' +
      '<div class="seo-text-width-panel_meter" aria-hidden="true">' +
        '<span class="seo-text-width-panel_fill"></span>' +
      '</div>' +
      '<div class="seo-text-width-panel_meta"></div>'
    );

    $panel.find('.seo-text-width-panel_eyebrow').text(inputLabel($input, field));
    $panel.insertAfter($input);
    return $panel;
  }

  function updatePanel($input, $panel, field) {
    var value = String($input.val() || '').replace(/\s+/g, ' ').trim();
    var width = textWidth(value, field.font || {});
    var status = statusFor(width, value, field);
    var percent = meterPercent(width, field);

    $panel
      .removeClass('is-empty is-short is-good is-long')
      .addClass('is-' + status.state);

    $panel.find('.seo-text-width-panel_status').text(status.label);
    $panel.find('.seo-text-width-panel_fill').css('width', percent + '%');
    $panel.find('.seo-text-width-panel_meta').text(
      width + ' ' + messages.pixels +
      ' / ' + messages.recommended + ' ' + field.minWidth + '-' + field.maxWidth + ' ' + messages.pixels +
      ' - ' + value.length + ' ' + messages.characters
    );
  }

  function candidateInputs(fieldName) {
    var $wrapper = $('#Inputfield_' + fieldName);
    var selectors = [
      '#Inputfield_' + fieldName + ' input[type="text"]',
      '#Inputfield_' + fieldName + ' textarea',
      '#Inputfield_' + fieldName + languageSeparator + 'wrap input[type="text"]',
      '#Inputfield_' + fieldName + languageSeparator + 'wrap textarea',
      'input[name="' + fieldName + '"]',
      'textarea[name="' + fieldName + '"]',
      'input[name^="' + fieldName + languageSeparator + '"]',
      'textarea[name^="' + fieldName + languageSeparator + '"]'
    ];

    var $inputs = $(selectors.join(',')).filter(function () {
      var type = String(this.type || '').toLowerCase();
      return type !== 'hidden' && !this.disabled && !$(this).hasClass('seo-text-width-ignore');
    });

    if ($wrapper.length) {
      $inputs = $inputs.add($wrapper.find('input[type="text"], textarea').filter(function () {
        var type = String(this.type || '').toLowerCase();
        return type !== 'hidden' && !this.disabled;
      }));
    }

    return $inputs;
  }

  function attach(field) {
    var $inputs = candidateInputs(field.name);
    if (!$inputs.length) {
      return;
    }

    $inputs.each(function () {
      var $input = $(this);
      if ($input.data('seoTextWidthAttached')) {
        return;
      }
      $input.data('seoTextWidthAttached', true);

      var $panel = buildPanel($input, field);
      var refresh = function () {
        updatePanel($input, $panel, field);
      };

      $input.on('input keyup change paste', refresh);
      refresh();
      setTimeout(refresh, 100);
    });
  }

  $(function () {
    settings.fields.forEach(attach);

    $(document).on('click', '.langTab, .LanguageSupportTab, .InputfieldHeader', function () {
      setTimeout(function () {
        settings.fields.forEach(function (field) {
          candidateInputs(field.name).each(function () {
            var $input = $(this);
            var $panel = $('#seo-text-width-' + ($input.attr('id') || ''));
            if ($panel.length) {
              updatePanel($input, $panel, field);
            }
          });
        });
      }, 100);
    });
  });
})(jQuery, window, document);
