var SidebarView = Backbone.View.extend({
  template: App.templates.sidebar,
  el: App.$sidebar.get(0),
  events: {
    'click .col, .sidebar-task': 'filterTodos'
  },
  render: function() {
    var allTodos = this.collection.all();
    var doneTodos = this.collection.completed();

    this.$el.html($(this.template({ allTasks: allTodos,
                                    totalAll: allTodos.length,
                                    completedTasks: doneTodos,
                                    totalCompleted: doneTodos.length })));
    this.setSelected();
  },
  setSelected: function() {
    var currentSection = this.collection.currentSection;

    $('.col, .sidebar-task').removeClass('selected');

    if (currentSection.isComplete) {
      $('.completed').find('[data-group="' + currentSection.data + '"]').addClass('selected');
    } else {
      $('.all_todos').find('[data-group="' + currentSection.data + '"]').addClass('selected');
    }
  },
  filterTodos: function(e) {
    e.preventDefault();
    var $e = $(e.target);
    var category = this.extractCategory($e);
    var data = $e.closest('.col, .sidebar-task').data('group');
    var isComplete = !!$e.closest('.completed')[0];

    this.collection.updateCurrentSection(category, isComplete, data);
  },
  extractCategory: function($e) {
    return $e.closest('.col, .sidebar-task').text().trim().split(/\s\s+/)[0];
  },
  initialize: function() {
    this.render();
    this.listenTo(this.collection, 'updateSection', this.setSelected);
    this.listenTo(this.collection, 'add remove', this.render);
  }
});