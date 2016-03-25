$(function() {

    /**
     * Convert hero images to backgrounds
     */
    $('.hero').each(function() {
        $img = $(this).find('img');
        if (!$img.length) return;
        $(this).css({
            'background-image': 'url("' + $img.attr('src') + '")'
        });
    });

})
