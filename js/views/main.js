var MainView = Backbone.View.extend({
  template: App.templates.todos,
  el: App.$main.get(0),
  events: {
    'click .add-todo, .edit': 'showModal',
    'click .modal_layer': 'hideModal',
    'submit #modalForm': 'updateTodos',

  },
  render: function() {
    var collection = this.collection;
    var currentSection = collection.currentSection;
    var filteredTodos = collection.filterBySection();

    this.$el.html($(this.template({ category: currentSection.category,
                                    total: filteredTodos.length,
                                    todoTasks: filteredTodos,
                                    currentId: collection.lastID })));
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
  initialize: function() {
    this.render();
    this.listenTo(this.collection, 'updateSection add remove', this.render);
  }
});