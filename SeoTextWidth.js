$(document).ready(function() {
    
    // Source: https://www.screamingfrog.co.uk/page-title-meta-description-lengths-by-pixel-width/
    // 16px Arial
    // 512 px for Meta Title - desktop - Inputfield_seo
    // 920 px of Meta Description - desktop - Inputfield_desc
    // Inputfield_seo - this is what you have to change to your own field, so find the ID of the field and change it to Inputfield_seo_title or whatever.
    // Inputfield_desc - this is what you have to change to your own field, so find the ID of the field and change it to Inputfield_seo_description or whatever.

    // Function to calculate text width
    function calculateTextWidth(text) {
      const canvas = calculateTextWidth.canvas || (calculateTextWidth.canvas = document.createElement("canvas"));
      const context = canvas.getContext("2d");

      const fontWeight = 'normal';
      const fontSize = '16px';
      const fontFamily = 'arial, sans-serif';

      context.font = `${fontWeight} ${fontSize} ${fontFamily}`;
      const metrics = context.measureText(text);
      const textWidth = metrics.actualBoundingBoxRight + metrics.actualBoundingBoxLeft;
      return textWidth;
        
    }
    

    // Function to check and apply class based on width
    function checkTextLength(text, maxLength, fieldName, spanElement) {
        const width = calculateTextWidth(text);
        if (width > maxLength) {
            const warningIcon = '<i class="fa fa-exclamation-circle"></i>'; // Font Awesome warning icon
            spanElement.html(`${warningIcon} <span class="text-danger">Warning:</span> Text in field '${fieldName}' exceeds maximum width (${maxLength}px).`);
            spanElement.addClass('text-danger');
        } else {
            spanElement.text(`Estimated Width: ${width}px`);
            spanElement.removeClass('text-danger');
        }
    }

    // Handle Meta Title seo field
    // Change ID Inputfield_seo into Inputfield_YourFieldName
    const seoInput = $('#Inputfield_seo');
    const seoSpan = $('<span class="detail" id="seo-width"></span>');
    seoInput.keyup(function() {
    const seoText = $(this).val();
    checkTextLength(seoText, 512, 'Inputfield_seo', seoSpan);
    seoInput.after(seoSpan); // the span after the input
    });

    // Handle Meta Description desc field
    // Change ID Inputfield_desc into Inputfield_YourSecondFieldName
    const descInput = $('#Inputfield_desc');
    const descSpan = $('<span class="detail" id="desc-width"></span>');
    descInput.keyup(function() {
    const descText = $(this).val();
    checkTextLength(descText, 920, 'Inputfield_desc', descSpan);
    descInput.after(descSpan); // the span after the input
    });
});
