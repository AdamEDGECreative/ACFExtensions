( function( $, window, document, undefined ) {

	/**
	 * Add an error message to an ACF field.
	 * @param {jQuery} $field  A jQuery element that the error will be placed before. 
	 * @param {string} message The error string to show.
	 */
	function addFieldErrorMessage( $field, message ) {
		var containerHTML = '<div id="message" class="error"><p>' + message + '</p></div>';

		// Remove existing
		$field.siblings('#message').remove();
    $field.before( containerHTML );
	}

	/**
	 * Remove an error message from an ACF field.
	 * @param {jQuery} $field  A jQuery element with an error next to it.
	 */
	function removeFieldErrorMessage( $field ) {
		$field.siblings('#message').remove();
	}

	// Expose method on the acf object
	acf.validation.addErrorMessage = addFieldErrorMessage;
	acf.validation.removeErrorMessage = removeFieldErrorMessage;
	
	/*
	*  On submit of WordPress form (if HTML5 validation returns an error)
	*  At the moment we are only handling errors for
	*  <input type="number"> controls, so we are only handling 
	*  invalid events from these elements.
	*
	*  Run ACF validation and return true|false accordingly
	*
	*  @type	function
	*  @date	13/06/2017
	*
	*  @param	N/A
	*  @return	N/A
	*/
	$('#post input[type="number"]').on('invalid', function( event ){
		
		// If disabled, bail early on the validation check
		if( acf.validation.disabled )
		{
			return true;
		}
		
		
		// do validation
		acf.validation.run();
			
			
		if( ! acf.validation.status ) {
			
			// vars
			var $this = $(this),
					$form = $(this).closest( 'form#post' );
			
			
			// show message
			$form.siblings('#message').remove();
			$form.before('<div id="message" class="error"><p>' + acf.l10n.validation.error + '</p></div>');
			
			
			// hide ajax stuff on submit button
			if( $('#submitdiv').exists() ) {
				
				// remove disabled classes
				$('#submitdiv').find('.disabled').removeClass('disabled');
				$('#submitdiv').find('.button-disabled').removeClass('button-disabled');
				$('#submitdiv').find('.button-primary-disabled').removeClass('button-primary-disabled');
				
				
				// remove spinner
				acf.validation.hide_spinner( $('#submitdiv .spinner') );
				
			}
			
			event.preventDefault();
			return false;
		}

	} );

} )( jQuery, window, document );
