<?php

/**
 * Change the order of custom fields (created by plugins) on edit pages
 */
add_filter( 'acf/input/meta_box_priority', 'acf_priority_change' );
function acf_priority_change () {
  return 'high';
}
  
/**
 * Find part of an image object from the ACF Plugin
 *  @return
 *  To return the part found (as a variable) use get_image_field()
 *  To echo it straight to the page use the_image_field()
 *
 * $post_id and $properties parameters are interchangeable
 * and can be specified in any order
 *
 * @param  $field @type string 
 *    The field name you want to get values from
 *
 * @param  $post_id @type integer @optional 
 *    The post ID to find values for. If omitted, the current post ID is used
 *
 * @param  $properties @type string @optional 
 *    A list of the properties you want to return, separated by a forward slash, e.g. 'sizes/thumbnail' or 'url'
 *    If omitted, the image URL will be returned
 */
function get_image_field($field, $post_id = 0, $properties = '') {
  // Reset variables if the order is muddled
  if (is_string($post_id) && $properties === '') {
    // $post_id has not been passed and only properties has
    $properties = $post_id;
    $post_id = 0;
  } else if (is_string($post_id) ) {
    // $post_id has been passed as the properties field and vice versa, swap their order
    list($post_id, $properties) = array($properties, $post_id);
  }

  global $post; // Get current post ID, if not passed
  $post_id = ($post_id === 0 ? $post->ID : $post_id);

  // If $field is a key, retrieve it. If it is already an ACF Image object assign it.
  if ( is_string( $field ) ) {
    $imageObj = get_field( $field, $post_id );
  } else {
    $imageObj = $field;
  }

  if ($properties === '') {
    return $imageObj['url'];
  }
  $tempObj = $imageObj;
  $properties = explode('/', $properties);
  foreach ($properties as $property) {
    if ( !isset( $tempObj[ $property ] ) ) {
      $tempObj = "$property doesn't exist on the image object";
      break;
    }
    $tempObj = $tempObj[$property];
  }
  return $tempObj;
}

function the_image_field($field, $post_id = 0, $properties = '') {
  echo get_image_field($field, $post_id, $properties);
}


/**
 * Find part of an image object from the ACF Plugin
 *  @return
 *  To return the part found (as a variable) use get_sub_image_field()
 *  To echo it straight to the page use the_sub_image_field()
 *
 * @param  $field @type string 
 *    The field name you want to get values from.
 *
 * @param  $properties @type string @optional 
 *    A list of the properties you want to return, separated by a forward slash, e.g. 'sizes/thumbnail' or 'url'
 *    If omitted, the image URL will be returned
 */
function get_sub_image_field( $field, $properties = '' ) {
  
  // If $field is a key, retrieve it. If it is already an ACF Image object assign it.
  if ( is_string( $field ) ) {
    $imageObj = get_sub_field( $field );
  } else {
    $imageObj = $field;
  }

  if ($properties === '') {
    return $imageObj['url'];
  }
  $tempObj = $imageObj;
  $properties = explode('/', $properties);
  foreach ($properties as $property) {
    if ( !isset( $tempObj[ $property ] ) ) {
      $tempObj = "$property doesn't exist on the image object";
      break;
    }
    $tempObj = $tempObj[$property];
  }
  return $tempObj;
}

function the_sub_image_field( $field, $properties = '' ) {
  echo get_sub_image_field( $field, $properties );
}


/**
* Add a custom location rule to ACF
*/

add_filter('acf/location/rule_types', 'acf_add_location_rules_types', 10, 1);
function acf_add_location_rules_types( $choices ) {
    $choices['Post']['has_post_parent'] = 'Has Post Parent';

    return $choices;
}

/**
  * Add more operators if needed
  */ 
// add_filter('acf/location/rule_operators', 'acf_add_location_rules_operators');
// function acf_add_location_rules_operators( $choices ) {
//     $choices['<'] = 'is less than';
//     $choices['>'] = 'is greater than';

//     return $choices;
// }

add_filter('acf/location/rule_values/has_post_parent', 'acf_add_location_rules_values_has_post_parent', 10, 1);
function acf_add_location_rules_values_has_post_parent( $choices ) {
  $choices['true'] = 'True';
  $choices['false'] = 'False';

  return $choices;
}

add_filter('acf/location/rule_match/has_post_parent', 'acf_add_location_rules_match_has_post_parent', 10, 3);
function acf_add_location_rules_match_has_post_parent( $match, $rule, $options ) {
  $current_post = get_post( $options['post_id'] );

  if ( !$current_post ) {
    return false;
  }

  $post_parent = $current_post->post_parent;
  $selected_option = ( 'true' == $rule['value'] ) ? true : false;

  if ( $rule['operator'] == "==" ) {
    // Has Post Parent is equal to

    if ( $selected_option ) {
      // Has Post Parent is equal to true
        $match = ( 0 != $post_parent );
      
    } else {
      // Has Post Parent is equal to false
        $match = ( 0 == $post_parent );

    }
    
  } elseif ( $rule['operator'] == "!=" ) {
    // Has Post Parent is NOT equal to

    if ( $selected_option ) {
    // Has Post Parent is NOT equal to true
      $match = ( 0 == $post_parent );
      
    } else {
      // Has Post Parent is NOT equal to false
        $match = ( 0 != $post_parent );

    }

  }

  return $match;
}
