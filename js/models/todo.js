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
    if (this.month !== 'Month' && this.year !== 'Year') {
      this.dueDate = 'No Due Date'
    } else {
      this.dueDate = this.month + '/' + this.year.slice(2);
    }
  },
  initialize: function() {
    this.on('change:month change:year', this.createDueDate);
  }
});