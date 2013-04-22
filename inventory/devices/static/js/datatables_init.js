// Generated by CoffeeScript 1.4.0
(function() {
  var change_td, checkin_selected, checkout_selected, get_selected_id, get_selected_ids, get_td, initialize_table;

  initialize_table = function() {
    /*
        Initialize jQuery Datatables
    */
    return $('#id_devices_table').dataTable({
      "sDom": "<'row-fluid'<'span6'T><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
      "oTableTools": {
        "sSwfPath": '/static/libs/datatables/extras/TableTools/media/swf/copy_csv_xls.swf',
        'sRowSelect': 'single',
        "aButtons": [
          {
            'sExtends': 'text',
            'sButtonClass': 'btn btn-large btn-primary btn-checkout',
            'sButtonText': '<i class="icon-signout"></i> Check OUT',
            'fnClick': function(nButton, oConfig, oFlash) {
              var ret;
              if (oTT.fnGetSelected(oTable).length === 0) {
                return alert('Please select a device');
              } else {
                ret = prompt("Check OUT - Enter a subject ID or user's e-mail address: ", "");
                if (ret) {
                  return checkout_selected(ret);
                }
              }
            }
          }, {
            'sExtends': 'text',
            'sButtonClass': 'btn btn-large btn-warning btn-checkin',
            'sButtonText': '<i class="icon-signin"></i> Check IN',
            "fnClick": function(nButton, oConfig, oFlash) {
              var pk, selected;
              selected = oTT.fnGetSelected(oTable);
              pk = get_selected_id(selected);
              if (selected < 1) {
                return alert('Please select a device');
              } else if (get_td("Status", parseInt(pk)) === "Checked in") {
                return alert("Device is already checked in");
              } else {
                return checkin_selected();
              }
            }
          }, {
            'sExtends': 'text',
            'sButtonClass': 'btn btn-large btn-info btn-edit-device',
            'sButtonText': '<i class="icon-pencil"></i> Edit device',
            'fnClick': function(nButton, oConfig, oFlash) {
              var pk, selected;
              selected = oTT.fnGetSelected(oTable);
              if (selected.length < 1) {
                return alert("Please select a device.");
              } else {
                pk = get_selected_id(selected);
                return window.location = "/devices/" + pk + "/edit/";
              }
            }
          }, {
            'sExtends': 'csv',
            'sButtonClass': 'btn btn-large btn-default btn-export',
            'sButtonText': '<i class="icon-file"></i> Export'
          }
        ]
      }
    });
  };

  $(function() {
    window.oTable = initialize_table();
    return window.oTT = TableTools.fnGetInstance('id_devices_table');
  });

  checkout_selected = function(lendee) {
    var pk, selected;
    selected = oTT.fnGetSelected(oTable);
    pk = get_selected_id(selected);
    return $.ajax({
      url: "/devices/" + pk + "/checkout/",
      type: 'POST',
      data: {
        "lendee": lendee
      },
      success: function(data) {
        var confirmed;
        if (data.error) {
          return alert(data.error);
        } else {
          confirmed = confirm("Confirm check out to " + data.name + "?");
          if (confirmed) {
            return $.ajax({
              url: "/devices/" + pk + "/checkout/confirm",
              type: 'POST',
              data: {
                'lendee': lendee
              },
              success: function(data) {
                return window.location = "/devices";
              }
            });
          }
        }
      }
    });
  };

  checkin_selected = function() {
    var pk, selected;
    selected = oTT.fnGetSelected(oTable);
    pk = get_selected_id(selected);
    return window.location = "/devices/" + pk + "/checkin";
  };

  $("#id_delete_btn").click(function(e) {
    var confirmed, pk, selected;
    e.preventDefault();
    selected = oTT.fnGetSelected(oTable);
    if (selected.length < 1) {
      return alert("No device selected.");
    } else {
      confirmed = confirm("Are you sure you want to delete this device?\nWARNING: This action is irreversible.");
      pk = get_selected_id(selected);
      if (confirmed) {
        return $.ajax({
          url: "/devices/" + pk + "/delete/",
          type: "POST",
          success: function(data) {
            return window.location = "/devices/";
          }
        });
      }
    }
  });

  change_td = function(column_name, pk, new_text) {
    /*
        Changes the text of the cell at the column that contains
        text column_name and the row of the device with a given pk.
    */

    var col_idx;
    col_idx = $("th:contains('" + column_name + "')").index();
    return $("tr[data-id='" + pk + "']").find('td').eq(col_idx).html(new_text);
  };

  get_td = function(column_name, pk) {
    /*
        Get the text of a table cell at the column that contains the
        text column_name and the row of the device with a given pk.
    */

    var col_idx;
    col_idx = $("th:contains('" + column_name + "')").index();
    return $("tr[data-id='" + pk + "']").find('td').eq(col_idx).text();
  };

  get_selected_id = function(selected) {
    /*
        Returns the id of a selected device as an integer.
    */
    return $(selected).data('id');
  };

  get_selected_ids = function(selected) {
    /*
        Returns an array of ids for the selected devices.
    */
    return $.map(selected, function(element) {
      return $(element).data('id');
    });
  };

}).call(this);
