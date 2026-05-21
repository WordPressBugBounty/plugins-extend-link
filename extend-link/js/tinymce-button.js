/**
 * Extended Link Plugin for TinyMCE
 * Adds enhanced link dialog with additional attributes and options
 * @author   Alobaidi
 * @since    2.0.0
 */

(function() {
    'use strict';

    var lang = window.extendLinkI18n || {};
    
    /**
     * Gets translated text string from language object
     * Falls back to key name if translation not available
     * 
     * @param {string} key Text identifier
     * @return {string} Translated text or original key
     */
    function __extendLinkLang(key) {
        return lang[key] || key;
    }

    /**
     * Registers the Extended Link plugin with TinyMCE
     * Adds custom button with dialog for link configuration
     * 
     * @param {object} editor TinyMCE editor instance
     * @param {string} url Plugin base URL
     */
    tinymce.PluginManager.add('extend_link', function(editor, url) {

        /**
         * Adds custom button to TinyMCE toolbar
         * Configures icon, tooltip and click behavior
         */
        editor.addButton('extend_link', {

            text: __extendLinkLang('plugin_name'),

            tooltip: __extendLinkLang('dialog_btn_tooltip'),

            icon: 'extendlink-mce-new-icon',

            /**
             * Button click handler that opens configuration dialog
             * Processes selected text and existing link attributes
             */
            onclick: function() {
                var selection = editor.selection;
                var selectedNode = selection.getNode();
                var anchorElement = editor.dom.getParent(selectedNode, 'a[href]');
                var selectedText = selection.getContent({format: 'text'});
                
                // Check if selected node is a heading
                var isHeading = /^H[1-6]$/.test(selectedNode.nodeName);
                var headingElement = isHeading ? selectedNode : editor.dom.getParent(selectedNode, 'h1,h2,h3,h4,h5,h6');
                var isEditingHeading = !!headingElement;
                
                // Check if we have a link inside a heading (h2 > a)
                var hasLinkInHeading = isEditingHeading && anchorElement;

                // Get existing attributes
                var existingUrl = anchorElement ? editor.dom.getAttrib(anchorElement, 'href') : '';
                var existingText = '';
                var existingTitle = '';
                var existingId = '';
                var existingClasses = '';
                var existingTarget = false;
                var existingDownload = false;
                
                if (hasLinkInHeading) {
                    // Link inside heading: get text from link, id/class from heading
                    existingText = anchorElement.textContent || anchorElement.innerText;
                    existingTitle = editor.dom.getAttrib(anchorElement, 'title');
                    existingId = editor.dom.getAttrib(headingElement, 'id');
                    existingClasses = editor.dom.getAttrib(headingElement, 'class');
                    existingTarget = editor.dom.getAttrib(anchorElement, 'target') === '_blank';
                    existingDownload = editor.dom.getAttrib(anchorElement, 'download') !== '';
                } else if (anchorElement) {
                    // Normal link: get everything from link
                    existingText = anchorElement.textContent || anchorElement.innerText;
                    existingTitle = editor.dom.getAttrib(anchorElement, 'title');
                    existingId = editor.dom.getAttrib(anchorElement, 'id');
                    existingClasses = editor.dom.getAttrib(anchorElement, 'class');
                    existingTarget = editor.dom.getAttrib(anchorElement, 'target') === '_blank';
                    existingDownload = editor.dom.getAttrib(anchorElement, 'download') !== '';
                } else if (isEditingHeading) {
                    // Heading only: get text and attributes from heading
                    existingText = selectedText || (headingElement.textContent || headingElement.innerText);
                    existingId = editor.dom.getAttrib(headingElement, 'id');
                    existingClasses = editor.dom.getAttrib(headingElement, 'class');
                } else {
                    // New link: just get selected text
                    existingText = selectedText;
                }

                // Parse rel attribute
                var existingRel = anchorElement ? editor.dom.getAttrib(anchorElement, 'rel') : '';
                var relValues = existingRel ? existingRel.split(' ') : [];
                var existingNofollow = relValues.indexOf('nofollow') !== -1;
                var existingNoreferrer = relValues.indexOf('noreferrer') !== -1;
                var existingNoopener = relValues.indexOf('noopener') !== -1;
                
                // Disable checkboxes only for heading without link
                var shouldDisableCheckboxes = isEditingHeading && !anchorElement;

                /**
                 * Creates and opens dialog window with all link settings
                 * Pre-populates fields when editing existing link
                 */
                editor.windowManager.open({
                    title: __extendLinkLang('dialog_title'),
                    classes: 'extend-link-tinymce-dialog custom-extendlink-dialog',
                    id: 'extend-link-dialog',
                    body: [
                        {
                            type: 'textbox',
                            name: 'url',
                            label: __extendLinkLang('url'),
                            value: existingUrl ? String(existingUrl).trim() : '',
                            maxWidth: 960,
                            tooltip: __extendLinkLang('url_tooltip')
                        },
                        {
                            type: 'button',
                            text: __extendLinkLang('check_btn_text'),
                            label: __extendLinkLang('check_btn_label'),
                            tooltip: __extendLinkLang('check_btn_tooltip'),
                            maxWidth: 100,
                            onclick: function() {
                                var dialog = this.parent().parent();
                                var url = dialog.find('#url')[0].value().trim();
                                var button = this;
                                
                                if (!url) {
                                    alert( __extendLinkLang('check_btn_no_url') );
                                    return;
                                }
                                
                                button.text(__extendLinkLang('check_btn_disabled'));
                                button.disabled(true);
                                
                                var formData = new FormData();
                                formData.append('action', 'extend_link_plu_check_link');
                                formData.append('url', url);
                                formData.append('nonce', extendLinkAjax.nonce);
                                
                                fetch(extendLinkAjax.ajaxurl, {
                                    method: 'POST',
                                    body: formData
                                })
                                .then(response => response.json())
                                .then(data => {
                                    button.text(__extendLinkLang('check_btn_text'));
                                    button.disabled(false);
                                    
                                    if (data.success) {
                                        alert(data.data.message || __extendLinkLang('check_btn_working_link'));
                                    } else {
                                        alert(data.data.message || __extendLinkLang('check_btn_broken_link'));
                                    }
                                })
                                .catch(error => {
                                    button.text(__extendLinkLang('check_btn_text'));
                                    button.disabled(false);
                                    alert( __extendLinkLang('check_btn_error') );
                                });
                            }
                        },
                        {
                            type: 'textbox',
                            name: 'text',
                            label: __extendLinkLang('link_text'),
                            value: existingText ? String(existingText).trim() : '',
                            maxWidth: 480,
                            tooltip: __extendLinkLang('link_text_tooltip')
                        },
                        {
                            type: 'textbox',
                            name: 'title',
                            label: __extendLinkLang('title'),
                            value: existingTitle ? String(existingTitle).trim() : '',
                            maxWidth: 480,
                            tooltip: __extendLinkLang('title_tooltip')
                        },
                        {
                            type: 'textbox',
                            name: 'classes',
                            label: __extendLinkLang('classes'),
                            value: existingClasses ? String(existingClasses).trim() : '',
                            maxWidth: 480,
                            tooltip: __extendLinkLang('classes_tooltip')
                        },
                        {
                            type: 'textbox',
                            name: 'id',
                            label: __extendLinkLang('id'),
                            value: existingId ? String(existingId).trim() : '',
                            maxWidth: 280,
                            tooltip: __extendLinkLang('id_tooltip')
                        },
                        {
                            type: 'checkbox',
                            name: 'target',
                            label: __extendLinkLang('open_new_tab'),
                            checked: existingTarget,
                            disabled: shouldDisableCheckboxes,
                            tooltip: __extendLinkLang('open_new_tab_tooltip')
                        },
                        {
                            type: 'checkbox',
                            name: 'nofollow',
                            label: __extendLinkLang('add_nofollow'),
                            checked: existingNofollow,
                            disabled: shouldDisableCheckboxes,
                            tooltip: __extendLinkLang('add_nofollow_tooltip')
                        },
                        {
                            type: 'checkbox',
                            name: 'noreferrer',
                            label: __extendLinkLang('add_noreferrer'),
                            checked: existingNoreferrer,
                            disabled: shouldDisableCheckboxes,
                            tooltip: __extendLinkLang('add_noreferrer_tooltip')
                        },
                        {
                            type: 'checkbox',
                            name: 'noopener',
                            label: __extendLinkLang('add_noopener'),
                            checked: existingNoopener,
                            disabled: shouldDisableCheckboxes,
                            tooltip: __extendLinkLang('add_noopener_tooltip')
                        },
                        {
                            type: 'checkbox',
                            name: 'download',
                            label: __extendLinkLang('download_file'),
                            checked: existingDownload,
                            disabled: shouldDisableCheckboxes,
                            tooltip: __extendLinkLang('download_file_tooltip')
                        },
                        {
                            type: 'container',
                            layout: 'flex',
                            direction: 'row',
                            align: 'center',
                            spacing: 10,
                            classes: 'extend-link-btns-wrap',
                            items: [
                                {
                                    type: 'button',
                                    text: __extendLinkLang('plugin_ref_btn_text'),
                                    tooltip: __extendLinkLang('plugin_ref_btn_tooltip'),
                                    classes: 'etxndl-general-style-btn etxndl-g-s-btn',
                                    onclick: function() {
                                        window.open('https://wp-time.com/how-to-add-link-attributes-in-wordpress/', '_blank');
                                    }
                                },
                                {
                                    type: 'button',
                                    text: __extendLinkLang('plugin_rate_btn_text'),
                                    tooltip: __extendLinkLang('plugin_rate_btn_tooltip'),
                                    classes: 'etxndl-general-style-btn etxndl-g-s-btn etxndl-rate-s-btn',
                                    onclick: function() {
                                        window.open('https://wordpress.org/support/plugin/extend-link/reviews/?filter=5', '_blank');
                                    }
                                },
                                {
                                    type: 'button',
                                    text: __extendLinkLang('plugin_support_btn_text'),
                                    tooltip: __extendLinkLang('plugin_support_btn_tooltip'),
                                    classes: 'etxndl-general-style-btn etxndl-g-s-btn etxndl-h-s-btn',
                                    onclick: function() {
                                        window.open('https://wp-time.com/contact/', '_blank');
                                    }
                                },
                                {
                                    type: 'button',
                                    text: __extendLinkLang('vp_plugin_btn_text'),
                                    tooltip: __extendLinkLang('vp_plugin_btn_tooltip'),
                                    classes: 'etxndl-general-style-btn etxndl-vp-s-btn',
                                    onclick: function() {
                                        window.open('https://wp-time.com/video-popup-plugin-for-wordpress/#live-demo', '_blank');
                                    }
                                },
                                {
                                    type: 'button',
                                    text: __extendLinkLang('preloader_plugin_btn_text'),
                                    tooltip: __extendLinkLang('preloader_plugin_btn_tooltip'),
                                    classes: 'etxndl-general-style-btn etxndl-pre-s-btn',
                                    onclick: function() {
                                        window.open('https://wp-time.com/wordpress-preloader/#preloader-for-wp', '_blank');
                                    }
                                }
                            ]
                        },
                        {
                            type: 'container',
                            layout: 'flex',
                            direction: 'column',
                            spacing: 12,
                            items: [
                                {
                                    type: 'label',
                                    text: __extendLinkLang('plugin_label_note'),
                                    classes: 'etxndl-note-label',
                                }
                            ]
                        }
                    ],

                    /**
                     * Form submission handler with extensive validation
                     * Creates properly formatted link with all attributes
                     * 
                     * @param {object} e Form submission event
                     */
                    onsubmit: function(e) {
                        var data = e.data;

                        // Trim text field values
                        if (data.url) data.url = data.url.trim();
                        if (data.text) data.text = String(data.text).trim();
                        if (data.title) data.title = String(data.title).trim();
                        if (data.id) data.id = String(data.id).trim();
                        if (data.classes) data.classes = String(data.classes).trim();

                        // Case 1: Heading without link (no URL provided)
                        if (isEditingHeading && !data.url) {
                            // Just update heading attributes
                            if (data.id) {
                                editor.dom.setAttrib(headingElement, 'id', data.id);
                            } else {
                                editor.dom.setAttrib(headingElement, 'id', null);
                            }
                            
                            if (data.classes) {
                                editor.dom.setAttrib(headingElement, 'class', data.classes);
                            } else {
                                editor.dom.setAttrib(headingElement, 'class', null);
                            }
                            
                            // Update heading text if changed
                            if (data.text) {
                                headingElement.textContent = data.text;
                            }
                            
                            return;
                        }

                        // Validate URL for links
                        if (!data.url) {
                            data.url = '#';
                        }

                        // Validate link text
                        if (!data.text) {
                            alert(__extendLinkLang('error_text_required'));
                            e.preventDefault();
                            return;
                        }

                        // Case 2: Link inside heading (h2 > a)
                        if (isEditingHeading && data.url) {
                            // Build link attributes (href, title, target, rel, download)
                            var linkAttrs = {
                                href: data.url
                            };
                            
                            if (data.title) linkAttrs.title = data.title;
                            if (data.target) linkAttrs.target = '_blank';
                            
                            // Build rel attribute
                            var relArray = [];
                            if (data.nofollow) relArray.push('nofollow');
                            if (data.noreferrer) relArray.push('noreferrer');
                            if (data.noopener) relArray.push('noopener');
                            if (relArray.length > 0) {
                                linkAttrs.rel = relArray.join(' ');
                            }
                            
                            if (data.download) linkAttrs.download = '1';
                            
                            // Build link HTML
                            var linkAttrString = '';
                            for (var attr in linkAttrs) {
                                linkAttrString += ' ' + attr + '="' + linkAttrs[attr] + '"';
                            }
                            var linkHtml = '<a' + linkAttrString + '>' + data.text + '</a>';
                            
                            // Set id and class on the heading element
                            if (data.id) {
                                editor.dom.setAttrib(headingElement, 'id', data.id);
                            } else {
                                editor.dom.setAttrib(headingElement, 'id', null);
                            }
                            
                            if (data.classes) {
                                editor.dom.setAttrib(headingElement, 'class', data.classes);
                            } else {
                                editor.dom.setAttrib(headingElement, 'class', null);
                            }
                            
                            // Replace heading content with link
                            var range = editor.dom.createRng();
                            range.selectNodeContents(headingElement);
                            editor.selection.setRng(range);
                            editor.selection.setContent(linkHtml);
                            
                            return;
                        }

                        // Case 3: Normal link (not in heading)
                        var attributes = {
                            href: data.url
                        };

                        if (data.title) attributes.title = data.title;
                        if (data.id) attributes.id = data.id;
                        if (data.classes) attributes.class = data.classes;
                        if (data.target) attributes.target = '_blank';

                        // Build rel attribute
                        var relArray = [];
                        if (data.nofollow) relArray.push('nofollow');
                        if (data.noreferrer) relArray.push('noreferrer');
                        if (data.noopener) relArray.push('noopener');
                        
                        if (relArray.length > 0) {
                            attributes.rel = relArray.join(' ');
                        }

                        if (data.download) attributes.download = '1';

                        // Build HTML string
                        var attrString = '';
                        for (var attr in attributes) {
                            attrString += ' ' + attr + '="' + attributes[attr] + '"';
                        }

                        var html = '<a' + attrString + '>' + data.text + '</a>';

                        // Insert or replace link
                        if (anchorElement) {
                            editor.selection.select(anchorElement);
                            editor.selection.setContent(html);
                        } else {
                            editor.insertContent(html);
                        }
                    }
                });
            }
        });

    });
})();