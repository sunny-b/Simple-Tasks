var Todos = Backbone.Collection.extend({
  model: Todo,
  comparator: 'completed',
  currentID: JSON.parse(localStorage['id'] || '1'),
  currentSection: {},
  completed: function() {
    return _(this.toJSON()).where({'completed': true});
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

    this.sort();

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

    return filteredTodos;
  },
  delete: function($e) {
    var todo = this.getTodo($e);
    this.remove(todo);
    this.save();
  },
  update: function($e) {
    var formInfo = $e.serializeArray();
    var todo = this.getTodo($e);
    var isNew = todo.get('id') === this.currentID;

    if (isNew) {
      this.currentID = this.currentID + 1;
      this.updateCurrentSection();
    }

    this.merge(todo, formInfo);
    this.trigger('updateTodos')
    this.save();
  },
  merge: function(todo, formInfo) {
    formInfo.forEach(function(field) { todo.set(field.name, field.value); });
    this.add(todo, {merge: true});
  },
  save: function() {
    localStorage['todos'] = JSON.stringify(this.toJSON());
    localStorage['id'] = JSON.stringify(this.currentID);
  },
  getTodo: function($e) {
    var id = +$e.closest('[data-id]').data('id');
    var todo = this.findWhere({ id: id });

    return todo ? todo : new Todo({ id: this.currentID });
  },
  groupTodos: function(todosGroup) {
    var seen = [];

    return todosGroup.sort(this.compareDueDates).reduce(function(arr, todo) {
      if (seen.includes(todo.dueDate)) {
        arr.filter(function(obj) {
          return obj.dueDate === todo.dueDate;
        })[0].total += 1;
      } else {
        seen.push(todo.dueDate);
        arr.push({ dueDate: todo.dueDate,
                   total: 1,
                   data: todo.dueDate.replace(/[\s]/g, '') });
      }

      return arr;
    }, []);
  },
  compareDueDates: function(todo1, todo2) {
    if (todo1.year === 'Year' || +todo1.year < +todo2.year) {
        return -1
    } else if (todo2.year === 'Year' || +todo1.year > +todo2.year) {
      return 1
    } else {
      if (todo1.month === 'Month' +todo1.month < +todo2.month) {
          return -1
      } else if (todo2.month === 'Month' || +todo1.month > +todo2.month) {
        return 1
      } else {
        return 0
      }
    }
  },
  sortedTodos: function() {
    return this.groupTodos(this.all());
  },
  sortedDoneTodos: function() {
    return this.groupTodos(this.completed());
  },
  toggle: function($e) {
    var todo = this.getTodo($e);

    todo.set('completed', !(todo.get('completed')));
    this.trigger('toggleComplete');
    this.save();
  },
  initialize: function() {
    this.updateCurrentSection();
  }
});