var MainView = Backbone.View.extend({
  template: App.templates.todos,
  el: App.$main.get(0),
  events: {
    'click .add-todo, .edit': 'showModal',
    'click .modal_layer': 'hideModal',
    'submit .modal': 'updateTodos',
    'click .trash-container': 'deleteTodo',
    'click .todo-container, .check': 'toggleComplete',
    'click button': 'markTodo'
  },
  render: function() {
    var collection = this.collection;
    var currentSection = collection.currentSection;
    var filteredTodos = collection.filterBySection();
    
    this.$el.html($(this.template({ category: currentSection.category,
                                    total: filteredTodos.length,
                                    todoTasks: filteredTodos,
                                    currentId: collection.currentID })));
  },
  showModal: function(e) {
    e.preventDefault();
    e.stopPropagation();

    var $e = $(e.target);
    var todo = this.collection.getTodo($e);
    
    App.trigger('showModal', todo);
  },
  hideModal: function(e) {
    e.preventDefault();

    App.trigger('hideModal');
  },
  updateTodos: function(e) {
    e.preventDefault();
    var $e = $(e.target);

    this.collection.update($e);
  },
  deleteTodo: function(e) {
    e.preventDefault();
    var $e = $(e.target);

    this.collection.delete($e);
  },
  toggleComplete: function(e) {
    e.preventDefault();
    e.stopPropagation();
    var $e = $(e.target);

    this.toggleTodo($e);
  },
  toggleTodo: function($e) {
    this.collection.toggle($e);
  },
  markTodo: function(e) {
    e.preventDefault();
    var $e = $(e.target);
    var id = $e.closest('[data-id]').data('id');

    if (id === this.collection.currentID) {
      alert('Cannot be marked as complete since it has not been created yet!');
    } else {
      this.toggleTodo($e);
    }
  },
  initialize: function() {
    this.render();
    this.listenTo(this.collection, 'updateSection updateTodos remove toggleComplete', this.render);
  }
});