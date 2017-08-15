/**
 * Scroll to error module.
 * 
 * Scrolls to the first validation error found by ACF
 * when publishing or updating a window containing custom fields.
 */
( function( $, window, document, undefined ) {

  // Module properties list
  var 
    /**
     * True will block any scroll events from being triggered.
     * @type {Boolean}
     */
    blockScroll = false,

    /**
     * The amount, in pixels, to offset the scroll position by.
     * @type {Number}
     */
    scrollPadding = 15;

  /**
   * Returns a function, that, as long as it continues to be invoked, will not
   * be triggered. The function will be called after it stops being called for
   * N milliseconds. 
   * 
   * If `immediate` is passed, trigger the function on the
   * leading edge, instead of the trailing.
   * 
   * @param  {Function} func      The function to call after a period of inactivity.
   * @param  {Number} wait        The number of milliseconds to wait before calling `func`
   * @param  {Boolean} immediate  Pass true to call `func` on leading edge 
   *                              instead of trailing edge.
   * @return {Function}           The debounced function.
   */
  function debounce( func, wait, immediate ) {
    var timeout;
    return function() {
      var context = this, 
          args = arguments,
          later = function() {
            timeout = null;
            if ( !immediate ) {
              func.apply( context, args );
            }
          },
          callNow = immediate && !timeout;

      clearTimeout( timeout );
      timeout = setTimeout( later, wait );
      
      if ( callNow ) {
        func.apply( context, args );
      }
    };
  };
  
  /**
   * Scroll to a selector or jQuery element.
   * @param {jQuery|string} selector  The selector or element to scroll to.
   * @param {integer}       speed     Speed of the scroll animation in ms.
   * @param {integer}       y_offset  The amount to offset the scroll by.
   */
  function scroll_to ( selector, speed, y_offset ) {
    y_offset = y_offset || 0;

    $('html, body').animate({
      scrollTop: $( selector ).offset().top + y_offset
    }, speed);
  }

  /**
   * Get the amount that the scroll function 
   * should offset the y-axis by.
   *
   * This is based on the modules custom `scrollPadding`
   * and the fixed WordPress admin bar.
   *
   * If there is not a current ACF error message, one will
   * be added *after* this function is called
   * which will affect the offset. 
   * This is accounted for and the correct offset returned.
   * 
   * @return {Number} The y-axis offset.
   */
  function get_scroll_offset() {
    var $errorMessage = $('form#post').prev( '#message.error' ),
        // If $errorMessage exists don't need to adjust
        errorMessageOffset = $errorMessage.length ? 0 : -58;

    return scrollPadding + $('#wpadminbar').outerHeight() + errorMessageOffset;
  }

  /**
   * Scroll to the first field that triggers an error. 
   *
   * Error status is held in data-validation attribute:
   *   true === validated, no errors
   *   false === error in this field
   *
   * This event handler is namespaced to 'scroll_to_error'.
   * 
   * @param  {Event} event    An event object representing the event triggered.
   * @param  {jQuery} $field  A jQuery object representing the field in the DOM.
   */
  $(document).on( 'acf/validate_field.scroll_to_error', function( event, $field ) {
    
    if ( !blockScroll && !$field.data('validation') ) {

      // Block any further events from scrolling
      blockScroll = true;

      scroll_to( $field, 250, get_scroll_offset() * -1 );

    }

  } );

  /**
   * Reset the `blockScroll` global variable once 
   * the 'acf/validate_field' event stops being called.
   * I.e. once all fields in the window have been validated.
   * 
   * This event handler is namespaced to 'reset_scroll'.
   *
   * @param  {Event} event    An event object representing the event triggered.
   * @param  {jQuery} $field  A jQuery object representing the field in the DOM.
   */
  $(document).on( 'acf/validate_field.reset_scroll', debounce( function( event, $field ) {
    blockScroll = false;
  }, 100 ) );

} )( jQuery, window, document );
