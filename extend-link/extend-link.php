<?php
/**
 * Plugin Name: Extend Link
 * Plugin URI: https://wp-time.com/how-to-add-link-attributes-in-wordpress/
 * Description: Allows you to add classes, IDs, titles, rel attributes, and file download options to links directly from the "Extend Link" dialog in the Classic Editor and Classic Block in Gutenberg. It also provides H1–H6 support, so you can, for example, add an ID or classes to a heading. A lightweight, professional plugin, free and always will remain free!
 * Version: 2.0.2
 * Author: Alobaidi
 * Author URI: https://wp-time.com/how-to-add-link-attributes-in-wordpress/
 * Text Domain: extend-link
 * Requires at least: 5.8
 * Requires PHP: 7.4
 * License: GPLv2 or later
 * License URI: https://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 *
 * This program is free software; you can redistribute it and/or modify it under the terms of the GNU
 * General Public License version 2, as published by the Free Software Foundation. You may NOT assume
 * that you can use any other version of the GPL.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 */

// Prevent direct access
if ( !defined('ABSPATH') ) {
    exit;
}

if ( !class_exists('Extend_Link_TinyMCE') ) {

    class Extend_Link_TinyMCE {
        private static $instance = null;
        
        /**
         * Retrieves the singleton instance of this class
         * Creates a new instance if one doesn't exist yet
         * 
         * @return Extend_Link_TinyMCE The single instance of this class
         */
        public static function get_instance() {
            if (null === self::$instance) {
                self::$instance = new self();
            }
            return self::$instance;
        }

        /**
         * constructor - intentionally empty
         * Initialization happens in the init() method instead for better control
         */
        public function __construct() {
            // No initialization here.
        }
        
        /**
         * Initialize plugin
         */
        public function init() {
            add_filter('plugin_row_meta', array($this, 'plugin_row_meta_custom'), 10, 2);
            add_action('admin_enqueue_scripts', array($this, 'enqueue_translations'));
            add_filter('mce_buttons', array($this, 'add_tinymce_button'));
            add_filter('mce_external_plugins', array($this, 'add_tinymce_plugin'));
            add_action('wp_ajax_extend_link_plu_check_link', array($this, 'check_link_status'));
        }

        /**
        * Adds custom links to plugin's meta information row
        */
        public function plugin_row_meta_custom($links, $file) {
            $plugin_file = plugin_basename(__FILE__);

            if ( $file == $plugin_file ) {

                $custom_links = array(
                    '<a style="font-weight:bold;" href="https://wp-time.com/how-to-add-link-attributes-in-wordpress/" target="_blank">' . esc_html__('Plugin Reference', 'extend-link') . '</a>',
                    '<a style="font-weight:bold;color:#4f9915;" href="https://wp-time.com/video-popup-plugin-for-wordpress/#live-demo" target="_blank">' . esc_html__('Video Popup Plugin', 'extend-link') . '</a>',
                    '<a style="font-weight:bold;color:#ce7825;" href="https://wp-time.com/wordpress-preloader/#preloader-for-wp" target="_blank">' . esc_html__('Preloader Plugin', 'extend-link') . '</a>'
                );
                
                $links = array_merge($links, $custom_links);
            }
            return $links;
        }
        
        /**
         * Add TinyMCE plugin script
         */
        public function add_tinymce_button($buttons) {
            array_push($buttons, 'extend_link');
            return $buttons;
        }

        public function add_tinymce_plugin($plugin_array) {
            $version = '2.0.1';
            $plugin_array['extend_link'] = plugins_url('/js/tinymce-button.js?ver='.$version, __FILE__);
            return $plugin_array;
        }
        
        /**
         * Enqueue translations for JavaScript
         */
        public function enqueue_translations($hook) {
            // Only load on post/page editor screens
            if ( !in_array($hook, array('post.php', 'post-new.php')) ) {
                return;
            }

            wp_enqueue_style(
                'extend_link_tinymce-button-style',
                plugins_url('/css/tinymce-button-style.css', __FILE__),
                array(),
                '2.0.1'
            );
            
            // Prepare translations array
            $translations = array(
                'plugin_name' => __('Extend Link', 'extend-link'),
                'dialog_btn_tooltip' => __('Allows you to add classes, IDs, titles, rel attributes, and file download options to links. It also allows adding an ID or classes to a heading.', 'extend-link'),
                'dialog_title' => __('Insert/Edit Link or Add an ID or Classes to a Heading', 'extend-link'),
                'link' => __('Link', 'extend-link'),
                'url' => __('URL', 'extend-link'),
                'link_text' => __('Link Text', 'extend-link'),
                'link_text_placeholder' => __('Click here', 'extend-link'),
                'title' => __('Title (tooltip)', 'extend-link'),
                'title_placeholder' => __('Link description', 'extend-link'),
                'id' => __('ID', 'extend-link'),
                'id_placeholder' => __('link-id', 'extend-link'),
                'classes' => __('Class(es)', 'extend-link'),
                'classes_placeholder' => __('class-1 class-2', 'extend-link'),
                'open_new_tab' => __('Open in new tab', 'extend-link'),
                'add_nofollow' => __('Add rel="nofollow"', 'extend-link'),
                'add_noreferrer' => __('Add rel="noreferrer"', 'extend-link'),
                'add_noopener' => __('Add rel="noopener"', 'extend-link'),
                'download_file' => __('Download file (instead of opening)', 'extend-link'),
                'cancel' => __('Cancel', 'extend-link'),
                'save' => __('Save', 'extend-link'),
                'error_text_required' => __('Please enter link text', 'extend-link'),

                'url_tooltip' => __('Enter a link.', 'extend-link'),
                'link_text_tooltip' => __('Enter the text that will appear for the link.', 'extend-link'),
                'title_tooltip' => __('Optional tooltip text shown on hover.', 'extend-link'),
                'id_tooltip' => __('A single unique ID for the link (only only allowed).', 'extend-link'),
                'classes_tooltip' => __('Add one or more CSS classes separated by spaces.', 'extend-link'),

                'open_new_tab_tooltip' => __('Open the link in a new browser tab.', 'extend-link'),
                'add_nofollow_tooltip' => __('Prevent search engines from following this link.', 'extend-link'),
                'add_noreferrer_tooltip' => __('Hide the referrer information when the link is clicked.', 'extend-link'),
                'add_noopener_tooltip' => __('Improve security by preventing the new page from accessing the opener.', 'extend-link'),
                'download_file_tooltip' => __('Force the browser to download the file instead of opening it. Use this only with a direct file URL (e.g., https://example.com/video.mp4). Note: This option may not work in some browsers.', 'extend-link'),

                'check_btn_text'     => __('Check', 'extend-link'),
                'check_btn_label'    => __('Check Link Status', 'extend-link'),
                'check_btn_tooltip'  => __('Check whether the link is working or broken. Useful for SEO.', 'extend-link'),
                'check_btn_no_url'   => __('Please enter a URL first to check its status.', 'extend-link'),
                'check_btn_disabled' => __('Please wait...', 'extend-link'),
                'check_btn_working_link' => __('Link is working!', 'extend-link'),
                'check_btn_broken_link'  => __('Link is broken!', 'extend-link'),
                'check_btn_error'        => __('Error checking link. Please try again after a few seconds.', 'extend-link'),

                'plugin_ref_btn_text' => __('Plugin Reference', 'extend-link'),
                'plugin_ref_btn_tooltip' => __('Everything related to the plugin can be found on this page.', 'extend-link'),
                'plugin_support_btn_text' => __('Support', 'extend-link'),
                'plugin_support_btn_tooltip' => __('The Extend Link plugin is free and will always remain free. Contact us if you have any questions or feature suggestions to help improve the plugin.', 'extend-link'),
                'plugin_rate_btn_text' => __('Rate Plugin', 'extend-link'),
                'plugin_rate_btn_tooltip' => __('Rate this plugin to support its development.', 'extend-link'),
                'plugin_label_note' => __('This plugin is completely free and will remain free, even as we add more features. So, suggestions for our other plugins, like Preloader and Video Popup, help us continue development.', 'extend-link'),

                'vp_plugin_btn_text' => __('Video Popup Plugin', 'extend-link'),
                'vp_plugin_btn_tooltip' => __('From our plugins: The ultimate Video Popup plugin for WordPress. Smart, flexible, and made for easy control. Create unlimited, on-brand, and elegant responsive popups for YouTube, Vimeo, MP4 & WebM videos on click or On-Page Load.', 'extend-link'),
                'preloader_plugin_btn_text' => __('Preloader Plugin', 'extend-link'),
                'preloader_plugin_btn_tooltip' => __('From our plugins: The ultimate Preloader plugin for WordPress. Add a preloader to your website easily in only 3 steps. Simple, fast, and compatible with all major browsers.', 'extend-link')
            );
            
            // Add translations to page as inline script
            wp_add_inline_script(
                'wp-tinymce',
                'window.extendLinkI18n = ' . wp_json_encode($translations) . ';',
                'before'
            );

            wp_add_inline_script(
                'wp-tinymce',
                'var extendLinkAjax = ' . json_encode(array(
                    'ajaxurl' => admin_url('admin-ajax.php'),
                    'nonce'   => wp_create_nonce('extend_link_check_status_nonce')
                )) . ';',
                'before'
            );
        }

        /**
         * Enhanced security check for URLs
         * Validates that the URL is safe to check and not pointing to internal resources
         * 
         * @param string $url The URL to validate
         * @return bool True if URL is safe, false otherwise
         */
        public function is_safe_url($url) {
            $parsed = wp_parse_url($url);
            
            if (!$parsed || !isset($parsed['host'])) {
                return false;
            }
            
            $host = $parsed['host'];
            
            // Block common localhost and internal addresses
            $blocked_hosts = array(
                'localhost',
                '127.0.0.1',
                '0.0.0.0',
                '::1',
                '[::1]'
            );
            
            if (in_array(strtolower($host), $blocked_hosts)) {
                return false;
            }
            
            // Check for private/reserved IP ranges
            if (filter_var($host, FILTER_VALIDATE_IP)) {
                if (!filter_var($host, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                    return false;
                }
            }
            
            // Only allow HTTP and HTTPS protocols
            if (!in_array($parsed['scheme'], array('http', 'https'))) {
                return false;
            }
            
            return true;
        }

        /**
         * AJAX handler to check link status
         * Uses wp_safe_remote_head() for enhanced security against SSRF attacks
         */
        public function check_link_status() {
            // Verify user capabilities
            if (!current_user_can('edit_posts')) {
                wp_send_json_error(['message' => __('You do not have permission to perform this action.', 'extend-link')]);
            }

            // Verify nonce for CSRF protection
            if (!isset($_POST['nonce']) || empty($_POST['nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['nonce'])), 'extend_link_check_status_nonce')) {
                wp_send_json_error(['message' => __('Security check failed. Please refresh the page and try again.', 'extend-link')]);
            }

            // Sanitize and validate URL
            $url = isset($_POST['url']) ? sanitize_url(wp_unslash($_POST['url'])) : '';
            $url = !empty(trim($url)) ? esc_url_raw($url) : '';
            
            if (empty($url)) {
                wp_send_json_error(['message' => __('Please enter a URL first to check its status.', 'extend-link')]);
            }

            if (!filter_var($url, FILTER_VALIDATE_URL)) {
                wp_send_json_error(['message' => __('Please enter a valid URL.', 'extend-link')]);
            }
            
            // Additional security check for internal addresses
            if (!$this->is_safe_url($url)) {
                wp_send_json_error(['message' => __('This URL is not allowed for security reasons.', 'extend-link')]);
            }
            
            $response = wp_safe_remote_head($url, array(
                'timeout' => 10,
                'sslverify' => true,
                'redirection' => 3,
                'user-agent' => 'WordPress/' . get_bloginfo('version') . '; ' . get_bloginfo('url'),
                'httpversion' => '1.1'
            ));
            
            if (is_wp_error($response)) {
                wp_send_json_error(['message' => __('There is an error. Please try again after a few seconds.', 'extend-link')]);
            }
            
            $status = wp_remote_retrieve_response_code($response);
            
            if ($status >= 200 && $status < 400) {
                wp_send_json_success([
                    'message' => sprintf(
                        // translators: %s will be replaced with the HTTP status code of the working link.
                        __('Link is working (Status: %s)', 'extend-link'),
                        $status
                    )
                ]);
            } else {
                wp_send_json_error([
                    'message' => sprintf(
                        // translators: %s will be replaced with the HTTP status code of the broken link.
                        __('Link is broken (Status: %s)', 'extend-link'),
                        $status
                    )
                ]);
            }
        }
    }

    // Initialize plugin
    $Extend_Link_TinyMCE = Extend_Link_TinyMCE::get_instance();
    $Extend_Link_TinyMCE->init();
}