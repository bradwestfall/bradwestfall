$(function() {

    /**
     * Convert hero images to backgrounds
     */
    $('.hero').each(function() {
        $img = $(this).find('img')
        if (!$img.length) return
        $(this).css({
            'background-image': 'url("' + $img.attr('src') + '")'
        })
    });

    /**
     * Format Time Elements
     */
    $('time').each(function() {
        var date = new Date($(this).text())
        var formatedDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear()
        $(this).text(formatedDate)
    });

})
