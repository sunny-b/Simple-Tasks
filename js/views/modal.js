var ModalView = Backbone.View.extend({
  tagName: 'form',
  id: 'modalForm',
  template: App.templates.modal,
  render: function() {
    this.$el.html($(this.template(this.model.toJSON())))
    $('.modal').html(this.$el);
    $('.modal_layer, .modal').fadeIn();
  },
  hide: function() {
    $('.modal, .modal_layer').fadeOut();
  },
  initialize: function(options) {
    this.$el.attr('data-id', options.model.get('id'));
    this.render();
  }
});