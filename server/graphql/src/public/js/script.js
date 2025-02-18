$(document).ready(function () {
  const checked = [];
  $('.slots').each(function (index) {
    $(this).on('change', function () {
      if ($(this).is(':checked') === true) {
        checked.push($(this).val());
      } else {
        checked.splice(0, 1);
      }

      if (!checked.length) {
        $(':input[type="submit"]')
          .removeClass('fullButton')
          .removeClass('btnSend')
          .addClass('btnSendDisabled')
          .attr('disabled', true);
      } else {
        $(':input[type="submit"]')
          .addClass('fullButton')
          .addClass('btnSend')
          .removeClass('btnSendDisabled')
          .attr('disabled', false);
      }
    });
  });
});
