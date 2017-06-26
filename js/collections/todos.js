var Todos = Backbone.Collection.extend({
  model: Todo,
  lastID: 0,
  comparator: 'completed',
  currentSection: {},
  completed: function() {
    return _(this.toJSON).where({'completed': true});
  },
  all: function() {
    return this.toJSON();
  },
  updateCurrentSection: function(category, isComplete, data) {
    this.currentSection.category = category ? category : 'All Todos';
    this.currentSection.isComplete = isComplete ? isComplete : false;
    this.currentSection.data = data ? data : 'all';

    this.trigger('updateSection');
  },
  filterBySection: function() {
    var category = this.currentSection.category;
    var isComplete = this.currentSection.isComplete;
    var filteredTodos;

    if (category === 'All Todos') {
      filteredTodos = this.all();
    } else if (category === 'Completed') {
      filteredTodos = this.completed();
    } else {
      if (isComplete) {
        filteredTodos = this.completed().filter(function(todo) {
          return todo.dueDate === category;
        });
      } else {
        filteredTodos = this.all().filter(function(todo) {
          return todo.dueDate === category;
        });
      }
    }

    return filteredTodos.sort();
  },
  update: function($e) {
    var formInfo = $e.serializeArray();
    var todo = this.getTodo($e);
    var isNew = todo.get('id') === this.lastID;

    if (isNew) {
      this.lastID++;
      this.updateCurrentSection();
    }

    formInfo.forEach(function(field) { todo.set(field.name, field.value); });
    this.add(todo, {merge: true});
    localStorage['todos'] = JSON.stringify(this.toJSON());
  },
  getTodo: function($e) {
    var id = +$e.closest('[data-id]').data('id');
    var todo = this.findWhere({ id: id });

    return todo ? todo : new Todo({ id: this.lastID + 1 });
  },
  initialize: function() {
    this.updateCurrentSection();
  }
});