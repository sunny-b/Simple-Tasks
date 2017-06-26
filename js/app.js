function cacheTemplates() {
  var templates = {};

  $('[type*=handlebars]').each(function() {
    templates[$(this).attr('id')] = Handlebars.compile($(this).html());
  });

  $('[data-type=partial]').each(function() {
    Handlebars.registerPartial($(this).attr('id'), $(this).html());
  });

  return templates;
}

var App = {
  $sidebar: $('.sidebar'),
  $main: $('main'),
  templates: cacheTemplates(),
  renderPage: function() {
    this.todos = new Todos(JSON.parse(localStorage['todos'] || '[]'));

    new SidebarView({ collection: this.todos });
    new MainView({ collection: this.todos });
  },
  renderModal: function(model) {
    this.modal = new ModalView({ model: model });
  },
  hideModal: function() {

    this.modal.hide();
  },
  updateTodos: function($e) {
    this.todos.update($e);
  },
  bindEvents: function() {
    _.extend(this, Backbone.Events);
    this.on('showModal', this.renderModal.bind(this));
    this.on('hideModal', this.hideModal.bind(this));
    this.on('updateTodos', this.updateTodos.bind(this));
  },
  init: function() {
    this.renderPage();
    this.bindEvents();
  }
};