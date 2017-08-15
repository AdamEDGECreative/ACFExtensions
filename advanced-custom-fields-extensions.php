<?php

/**
 * Main plugin file.
 *
 * @package    Advanced Custom Fields Extensions
 * @license    GPL2
 * @author     Adam Taylor @ EDGE Creative <adam@edge-creative.com>
 */

/**
 * Plugin Name: Advanced Custom Fields Extensions
 * Description: Extends functionality for the Advanced Custom Fields (ACF) plugin.
 * Version: 2.0.0
 * Author: Adam Taylor @ EDGE Creative <adam@edge-creative.com>
 * Author URI: https://www.edge-creative.com
 * License: GPL2
 */

/*  Copyright 2017  Adam Taylor @ EDGE Creative  (email : adam@edge-creative.com)

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License, version 2, as 
    published by the Free Software Foundation.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

include plugin_dir_path( __FILE__ ) . 'includes/functions.php';

if ( !class_exists( 'ACF_Extensions' ) ) {
  
  class ACF_Extensions {

    /**
     * The path to the directory that contains the JavaScript for this plugin.
     * @var string
     */
    private $_js_directory;

    function __construct() {
      $this->_js_directory = plugin_dir_url( __FILE__ ) . 'js/';
      
      /**
       * Load the main JS assets.
       */
      add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_main_scripts' ), 100 );

      /**
       * Load the final JS assets.
       * These should always be loaded last so priority is set high.
       */
      add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_final_scripts' ), 999 );
    }

    public function enqueue_main_scripts() {
      
      wp_register_script( "acf_validate_invalid", $this->_js_directory . "main.js", false, false, true );
      wp_enqueue_script( "acf_validate_invalid" );

      wp_register_script( "acf_validate_number", $this->_js_directory . "validate_number.js", false, false, true );
      wp_enqueue_script( "acf_validate_number" );

    }

    public function enqueue_final_scripts() {
      
      wp_register_script( "acf_scroll_to_error", $this->_js_directory . "scroll_to_error.js", false, false, true );
      wp_enqueue_script( "acf_scroll_to_error" );

    }

  }

  /**
   * This is inside the class_exists() check as 
   * if it already exists the previous version 
   * should instantiate it.
   */
  $ACF_Extensions = new ACF_Extensions();

}
