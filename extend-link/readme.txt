=== Extend Link ===
Contributors: Alobaidi
Tags: editor, link, class, seo, nofollow
Requires at least: 5.8
Tested up to: 6.9
Stable tag: 2.0.1
Requires PHP: 7.4
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Add classes, IDs, titles, rel attributes, and download options to links. Includes H1–H6 heading support and built-in link status checker for SEO.

== Description ==

### Extend Link – Link Options for Editor

The Extend Link plugin Allows you to add classes, IDs, titles, rel attributes, and file download options to links directly from the "Extend Link" dialog in the Classic Editor and Classic Block in Gutenberg. It also provides H1–H6 support, so you can, for example, add an ID or classes to a heading. A lightweight, professional plugin, free and always will remain free!

### Key Features

**Enhanced Link Attributes:**
* Add custom CSS classes to links.
* Assign unique IDs for precise targeting.
* Add title attributes (tooltips on hover).
* Set rel attributes: nofollow, noreferrer, noopener.
* Open links in new tabs (target="_blank").
* Enable file download instead of opening.
* Check link status in real-time.

**Heading Support (H1-H6):**
* Add IDs and classes directly to headings.
* Insert fully-attributed links inside headings.
* Edit existing heading attributes.
* Perfect for creating anchor links.

**Link Status Checker:**
* Verify if links are working or broken.
* See HTTP status codes (200, 404, etc.).
* Improve SEO by fixing dead links.
* Built-in tool - no external service needed.

**User Experience:**
* Seamless Classic Editor integration.
* Compatible with Gutenberg Classic Block.
* Intuitive dialog with helpful tooltips.
* Visual feedback for all actions.

**Professional & Lightweight:**
* All-in-one solution.
* No external dependencies.
* Optimized performance.
* Security-focused with nonce verification.
* Follows WordPress coding standards.
* Free forever - no premium version.

### How to Use

**Adding a Link:**
1. Open the Classic Editor or add a Classic Block in Gutenberg.
2. Select text or link.
3. Click the "Extend Link" button in the toolbar.
4. Configure your link options and save.

**Checking Link Status:**
1. Open the Extend Link dialog.
2. Enter or edit a URL.
3. Click the "Check" button.
4. See instant status feedback.

**Adding ID/Class to Headings:**
1. Select a heading (H1-H6).
2. Click "Extend Link" button.
3. Add ID and/or classes (leave URL empty).
4. Click "Save".

### Plugin Reference

Everything related to the plugin can be found on [this page](https://wp-time.com/extend-link-plugin-wordpress/).

### You May Also Like - From Our Plugins

[Video Popup Plugin](https://wordpress.org/plugins/video-popup/) - Create unlimited, elegant, and responsive popups for YouTube, Vimeo, MP4 & WebM videos on click or On-Page Load.

[Preloader Plugin](https://wordpress.org/plugins/the-preloader/) - Add a preloader to your website easily in only 3 steps. Simple, fast, and compatible with all major browsers.

== Installation ==

**Automatic Installation:**
1. Go to WordPress Admin → Plugins → Add New.
2. Search for "Extend Link".
3. Click "Install Now" then "Activate".
4. The plugin is ready to use!

**Manual Installation:**
1. Download the plugin zip file.
2. Upload 'extend-link' folder to '/wp-content/plugins/' directory.
3. Activate the plugin through the 'Plugins' menu.
4. Go to any post/page editor and start using the "Extend Link" button.

**Getting Started:**
1. Open the Classic Editor or add a Classic Block in Gutenberg.
2. Select text or link.
3. Click the "Extend Link" button in the toolbar.
4. Configure your link options and save.

[Plugin Reference](https://wp-time.com/extend-link-plugin-wordpress/)

== Frequently Asked Questions ==

= Does this work with Gutenberg? =
Yes! Use the Classic Block in Gutenberg, then access Extend Link from the block's toolbar.

= Can I add multiple CSS classes to one link? =
Absolutely! Just separate multiple classes with spaces (e.g., "btn btn-primary custom-class").

= What does the Link Status Checker do? =
It sends a request to the URL and checks the HTTP response. Working links return 200-399 status codes, while broken links return 400+ codes. This helps you maintain good SEO by identifying dead links.

= Does the download attribute work on all browsers? =
The download attribute works on most modern browsers, but some may ignore it for cross-origin URLs or certain file types for security reasons.

= How do I add an ID to a heading without creating a link? =
Select the heading, click "Extend Link", add your ID and/or classes, but leave the URL field empty. The plugin will apply the attributes to the heading itself.

= Is this plugin compatible with page builders? =
The plugin works with any editor that supports the Classic Editor or Classic Block. Compatibility with page builders depends on whether they use the WordPress Classic Editor.

= Is this plugin free? =
Yes! Extend Link is completely free and will always remain free with no premium version or hidden costs.

= Plugin Reference =
Everything related to the plugin can be found on [this page](https://wp-time.com/extend-link-plugin-wordpress/).

= How do I report a bug or suggest a feature? =
[Contact us](https://wp-time.com/contact/).

== Screenshots ==

1. Extend Link Button.
2. Extend Link Options.
3. Best Practices Compliant.

== Changelog ==

= 2.0.1 =

* Security: Enhanced URL validation in link checker feature.
* Improved: Added additional security checks for better protection.
* Fixed: Strengthened permission verification for AJAX requests.

Please update immediately.

= 2.0.0 =

Major update! New Link Status Checker feature helps improve your SEO. Enhanced heading support (H1-H6) with better attribute management. Improved performance and new user interface.

1. **New Feature:** Built-in Link Status Checker to verify working/broken links.
2. **New Feature:** Comprehensive H1-H6 heading support (add ID/classes to headings).
3. **New Feature:** Insert links inside headings with full attribute control.
6. **Enhancement:** Better User Interface with informative tooltips for all options.
8. **Enhancement:** Optimized code structure and performance.
9. **Fix:** Improved handling of heading elements and nested links.
10. **Fix:** Better attribute management for complex scenarios.

= 1.0.3 =

* Fixed: Corrected issue with inserting attributes to non-link text elements.
* Changed: Limited attribute insertion to links only for better stability.
* Note: This version removes the ability to add attributes to non-link elements (feature from 1.0.1) due to compatibility issues.

= 1.0.2 =

* Fixed: Element type detection improved.
* Note: Allowed inserting Classes, ID, and Title attributes to text elements (span, h1, h2, h3, etc.) except paragraph elements.
* Note: This feature was later removed in v1.0.3 due to issues.

= 1.0.1 =

* New Feature: Added ability to insert Classes, ID, and Title to text elements (span, headings, etc.).
* Note: This feature was later removed in v1.0.3 and reimplemented properly in v2.0.0.

= 1.0.0 =

* Initial release.
* Basic link attribute management.
* Classic Editor integration.
* Support for: Classes, ID, Title, Rel attributes, Target, Download.