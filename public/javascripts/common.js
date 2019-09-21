$(document).ready(function () {
    $('.ui.menu .ui.dropdown').dropdown({
        on: 'hover'
    });
    $('.ui.menu a.item').on('click', function () {
        $(this).addClass('active').siblings().removeClass('active');
    });
    $('#btn-show').click(function () {
        $('.sidecustommenu.sidebar').sidebar('toggle');
    });
    $('#resetpasswordconfirm').click(function(ev){
        ev.preventDefault();
        if(confirm("Are sure you want to remove this account?")){
            window.location = $(this).attr('href');
        }
    });
    $('.deleteconfirm').click(function(ev){
        ev.preventDefault();
        if(confirm("Are sure you want to Delete?")){
            window.location = $(this).attr('href');
        }
    });
});