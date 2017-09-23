$(document).ready(function() {
  loadProducts();

  $('#Btn-Make-Purchase').click(function() {
    if ($('#input-Items').val() == "") {
      return false;
    }
    var itemNo = $('#input-Items').val();
    itemNo = parseInt(itemNo);
    getProduct(itemNo);
  });


  function getProduct(itemNo) {
    var money = 0.0;
    $('#errorMessages').empty();
    $.ajax({
      type: 'GET',
      url: 'http://localhost:8080/money/' + totalAmount + '/item/' + itemNo,
      success: function(data, status) {
        $('#Message').val('Thank you for your purchase');
        // $('.contentRows').html('Please take your change');
        quarter = data.quarters;
        dime = data.dimes;
        nickel = data.nickels;
        pennie = data.pennies;
        loadProducts();
        getChangeAmount(quarter, dime, nickel, pennie);
      },
      error: function(xhr, status, error) {
        jsonMessage = JSON.parse(xhr.responseText);
        $('#Message').val(jsonMessage.message);
      }
    });
  };

});
var totalAmount = 0;
var quarter = 0;
var dime = 0;
var nickel = 0;
var penny = 0;
var ReturnQuarter = 0;
var ReturnDime = 0;
var ReturnNickel = 0;
var ReturnPenny = 0;

function loadProducts() {
  var itemsRows = $('.contentRows');
  $.ajax({
    type: 'GET',
    url: 'http://localhost:8080/items',
    success: function(itemsArray) {
      $.each(itemsArray, function(index, item) {
        var itemId = item.id;
        var itemName = item.name;
        var price = item.price.toFixed(2);
        var quantity = item.quantity;

        var vendingItems = '<div class="content" style="border-style: inset;" id="NumOfItem' + itemId + '">';
        vendingItems += '<div class="form-group">'
        vendingItems += '<button type="button" class="btn btn-default ItemSelectionBtn" value="' + itemId + '">' + itemId + '</button>';
        vendingItems += '<p style="text-align:center;">' + itemName + '</p>';
        vendingItems += '<p style="text-align: center;" id="Price">$' + price + '</p>';
        vendingItems += '<br/>';
        vendingItems += '<br/>';
        vendingItems += '<p style="text-align:center;" id="quantity"> Remaining items: ' + quantity + '</p>';
        vendingItems += '</div>';
        vendingItems += '</div>'

        itemsRows.append(vendingItems);

      });
      $('.ItemSelectionBtn').unbind('click').bind('click', function() {
        var ItemId = $(this).attr('value');
        console.log('Clicked On ', ItemId);
        $('#input-Items').val(ItemId);
      });
    },
    error: function() {
      $('#errorMessages')
        .append($('<li>')
          .attr({
            class: 'list-group-item list-group-item-danger'
          })
          .text('Error calling web service. Please try again later.'));
    }
  });

};

$('#change-return-button').click(function(event) {
  var Quarters = 0;
  var Dimes = 0;
  var Nickels = 0;
  var Penny = 0;
  var CalcAmount = (ReturnQuarter * 0.25) + (ReturnDime * 0.10) + (ReturnNickel * 0.5) + ReturnPenny;
  $('#inputAmount').val(CalcAmount.toFixed(2));
  totalAmount = parseFloat(CalcAmount.toFixed(2));
  loadProducts();
  $('.amount-adding-btn').removeAttr('disabled');
  $('#Message').val('');
  $('#input-Items').val('');
  $('#input-changeAmount').val('');
  return;
  var customerMoneyInput = parseFloat($('#inputAmount').val());
  var mQuarter = parseFloat('0.25');
  var mDime = parseFloat('0.10');
  var mNickel = parseFloat('0.05');
  var mPenny = parseFloat('0.01');
  if (customerMoneyInput >= 0.25) {
    customerMoneyInput = customerMoneyInput - mQuarter;
    quarter++;
  } else if (customerMoneyInput >= 0.10) {
    customerMoneyInput = customerMoneyInput - mDime;
    dimes++;
  } else if (customerMoneyInput >= 0.05) {
    customerMoneyInput = customerMoneyInput - mNickel;
    nickels++;
  } else if (customerMoneyInput >= 0.01) {
    customerMoneyInput = customerMoneyInput - mPenny;
    pennies++;
  }
  getChangeAmount(quarter, dime, nickel, penny);
});

function getChangeAmount(quarters, dimes, nickels, penny) {
  $('.amount-adding-btn').attr('disabled', true);
  $('#inputAmount').val('0.0');
  totalAmount = parseFloat('0.00');
  money = parseFloat('0.00');
  ReturnQuarter = quarters;
  ReturnDime = dimes;
  ReturnNickel = nickels;
  ReturnPenny = penny;
  $('#input-changeAmount').val('q: ' + quarters + ' d: ' + dimes + ' n: ' + nickels + ' p: ' + penny);
}

function cashInput(money) {
  totalAmount = totalAmount + money;
  $('#inputAmount').val(totalAmount.toFixed(2));
}
$('#add-dollarAmount-button').click(function(event) {
  cashInput(1.00);
});
$('#add-quarterAmount-button').click(function(event) {
  cashInput(0.25);
});
$('#add-dimeAmount-button').click(function(event) {
  cashInput(0.1);
});
$('#add-nickelAmount-button').click(function(event) {
  cashInput(0.05);
});
