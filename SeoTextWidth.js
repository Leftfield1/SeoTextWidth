$(document).ready(function() {
    // Configuration (Adjust max widths as needed)
    const fields = {
        seo: {
            maxWidth: 512, 
            font: { size: '20px', weight: 'normal', family: 'arial, sans-serif' } 
        },
        desc: {
            maxWidth: 920, 
            font: { size: '13px', weight: 'normal', family: 'arial, sans-serif' }
        }
    };

    const seoInput = $('#Inputfield_seo');  
    const descInput = $('#Inputfield_desc'); 

    // Text width calculation (reusable function)
    function calculateTextWidth(text, font) {
        const canvas = calculateTextWidth.canvas || (calculateTextWidth.canvas = document.createElement("canvas"));
        const context = canvas.getContext("2d");
        context.font = `${font.weight} ${font.size} ${font.family}`;
        const metrics = context.measureText(text);
        return metrics.actualBoundingBoxRight + metrics.actualBoundingBoxLeft;
    }

    // Text length checking and warning (updated)
    function checkTextLength(input, fieldConfig) {
        const span = $('<span class="detail"></span>').insertAfter(input);

        input.keyup(function() {
            const text = $(this).val();
            const width = calculateTextWidth(text, fieldConfig.font);

            if (width > fieldConfig.maxWidth) {
                span.html(`<i class="fa fa-exclamation-circle"></i> <span class="text-danger">Warning:</span> Text exceeds max width (${fieldConfig.maxWidth}px).`);
                span.addClass('text-danger');
            } else {
                span.text(`Estimated Width: ${width}px`);
                span.removeClass('text-danger');
            }
        });
    }

    // Check if input fields were found before proceeding
    if (seoInput.length > 0) {
        checkTextLength(seoInput, fields.seo);
    } else {
        console.warn('SEO title input field not found.');
    }

    if (descInput.length > 0) {
        checkTextLength(descInput, fields.desc);
    } else {
        console.warn('SEO description input field not found.');
    }
});
