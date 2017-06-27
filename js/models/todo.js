var Todo = Backbone.Model.extend({
  defaults: {
    'completed': false,
    'title': '',
    'day': 'Day',
    'month': 'Month',
    'year': 'Year',
    'description': '',
    'dueDate': 'No Due Date'
  },
  createDueDate: function() {
    var newDate;

    if (this.get('month') === 'Month' || this.get('year') === 'Year') {
      newDate = 'No Due Date';
    } else {
      newDate = this.get('month') + '/' + this.get('year').slice(2);
    }

    this.set('dueDate', newDate);
  },
  initialize: function() {
    this.on('change:month change:year', this.createDueDate);
  }
});