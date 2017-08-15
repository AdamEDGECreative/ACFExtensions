/**
 * Validate <input type="number"> fields module.
 * 
 * Checks the value of each input is within the
 * min, max and step attributes on the field.
 */
( function( $, window, document, undefined ) {

  /**
   * Calculate a remainder for float based values.
   * @param  {Number} value A number to find the remainder of.
   * @param  {Number} step  The modulus that `value` is divided by.
   * @return {Number}       The remainder of `value` when divided by `step`.
   */
  function floatSafeRemainder( value, step ) {
    var valueDecimalCount = ( value.toString().split('.')[1] || '' ).length,
        stepDecimalCount = ( step.toString().split('.')[1] || '' ).length,
        decimalCount = valueDecimalCount > stepDecimalCount ? valueDecimalCount : stepDecimalCount,
        valueInt = parseInt( value.toFixed( decimalCount ).replace( '.', '' ) ),
        stepInt = parseInt( step.toFixed( decimalCount ).replace( '.', '' ) );

    return ( valueInt % stepInt ) / Math.pow( 10, decimalCount );
  }

  function getNumberFieldError( value, min, max, step ) {

    var errorMessage = '';

    // Check value is a multiple of step
    if ( 0 !== floatSafeRemainder( value, step ) ) {
      errorMessage = 'Value must be a multiple of ' + step;
    }

    // Check value is outside of min max constraints
    if ( ( null !== min && value < min ) || ( null !== max && value > max ) ) {

      // Show an appropriate error message 
      // based on which attributes were defined
      if ( null !== min && null !== max ) {
        errorMessage = 'Value must be between ' + min + ' and ' + max;
      } else if ( null !== min && null === max ) {
        errorMessage = 'Value must be greater than or equal to ' + min;
      } else if( null === min && null !== max ) {
        errorMessage = 'Value must be less than or equal to ' + max;
      }

    }

    return errorMessage;

  }

  /**
   * Validate any <input type="number"> fields:
   *   - are greater than or equal to min attribute
   *   - are less than or equal to max attribute
   *   - the number leaves no remainder when divided by 
   *     it's step attribute, i.e. it is a valid step.
   *     
   * Error status is placed in data-validation attribute:
   *   true === validated, no errors
   *   false === error in this field
   *
   * This event handler is namespaced to 'validate_number'.
   * 
   * @param  {Event} event    An event object representing the event triggered.
   * @param  {jQuery} $field  A jQuery object representing the field in the DOM.
   */
  $(document).on( 'acf/validate_field.validate_number', function( event, $field ) {
    
    // Try to find a number input within the field
    var $number = $field.find( 'input[type="number"]' );

    // If this field has already failed, don't check again
    // If it is blank, there is no value we need to check
    if ( !$number.length || !$field.data('validation') || '' === $number.val() ) {
      return;
    }

    var min = $number.attr('min') ? parseFloat( $number.attr('min') ) : null,
        max = $number.attr('max') ? parseFloat( $number.attr('max') ) : null,
        step = $number.attr('step') ? parseFloat( $number.attr('step') ) : null,
        value = $number.val() ? parseFloat( $number.val() ) : null,
        valid = (
          ( null === min || min <= value ) &&
          ( null === max || max >= value ) &&
          ( null === step || 0 === floatSafeRemainder( value, step ) )
        );

    $field.data( 'validation', valid );

    // Add an appropriate error message alongside the input
    if ( !valid ) {
      acf.validation.addErrorMessage( $number, getNumberFieldError( value, min, max, step ) );
    }

  } );

  /*
  *  Events
  *
  *  Remove error message on focus
  *
  *  @type  function
  *  @date  1/03/2011
  *
  *  @param N/A
  *  @return  N/A
  */
  $(document).on('focus click', '.field.required input, .field.required textarea, .field.required select', function( e ){
  
    acf.validation.removeErrorMessage( $(this) );
    
  });

} )( jQuery, window, document );
