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
    $('#resetpasswordconfirm').click(function (ev) {
        ev.preventDefault();
        if (confirm("Are sure you want to remove this account?")) {
            window.location = $(this).attr('href');
        }
    });
    $('.deleteconfirm').click(function (ev) {
        ev.preventDefault();
        if (confirm("Are sure you want to Delete?")) {
            window.location = $(this).attr('href');
        }
    });
    $('#myaccountupdatepassword').submit(function (ev) {
        if ($.trim($('#id_password').val()) == "") {
            ev.preventDefault();
            alert("Empty Password");
        } else if ($('#id_password').val() != $('#id_confirmpassword').val()) {
            ev.preventDefault();
            alert("Passwords do not match");
        }
    });
    $('#leavefrom').change(function () {
        $('#leaveto').val($('#leavefrom').val());
        $('#leaveto').attr('min', $('#leavefrom').val());
    });
    $('#leaveto').change(function () {
        if ($('#leaveto').val() < $('#leavefrom').val()) {
            $('#leaveto').val($('#leavefrom').val());
        }
    });
    $('.confirmaction').click(function (ev) {
        ev.preventDefault();
        if (confirm("Do you want to " + $.trim($(this).html()) + "?")) {
            window.location = $(this).attr('href');
        }
    });
});