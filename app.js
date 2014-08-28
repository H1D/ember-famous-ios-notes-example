App = null
define( 'main', function(require){
  App = Ember.Application.create();
  App.ApplicationAdapter = DS.FixtureAdapter.extend();

  App.Router.map(function() {
    this.resource('notes', {path: '/notes/'}, function(){
      this.resource('note', {path: '/:note_id'});
    });
  });

  // go away from empty page
  App.IndexRoute = Ember.Route.extend({
    redirect: function () {
      this.transitionTo('notes');
    }
  });

  App.NotesRoute = Ember.Route.extend({
    model: function () {
      return this.store.find('note');
    }
  });

  App.NotesController = Ember.ArrayController.extend({
    filter: null,
    queryParams: ['filter'],

    filtered_notes: function(){
      var self = this;
      return this.get('model').filter(function(note){
        var text = note.get('text') || '';
        var filter = self.get('filter') || '';
        return text.toLowerCase().indexOf(filter.toLowerCase()) != -1
      });
    }.property('filter', 'model.@each.text')
  });

  App.NoteController = Ember.ObjectController.extend({
    actions: {
      addNote: function(){
        var note = this.get('store').createRecord('note');
        this.transitionToRoute('note', note);
      },
      removeNote: function(){
        this.transitionToRoute('notes');
        this.get('model').deleteRecord();
      }
    }
  });

  App.Note = DS.Model.extend({
    updated: DS.attr('date'),
    text: DS.attr('string'),

    title: function(){
      return this.get('text').substring(0, 11) + '…';
    }.property('text')
  });

  App.Note.FIXTURES = [
    {
      id: 1,
      updated: new Date(1352654520000),
      text: 'A template, written in the Handlebars templating language, describes the user interface of your application. Each template is backed by a model, and the template automatically updates itself if the model changes.'
    },
    {
      id: 2,
      updated: new Date(1336039380000),
      text: 'The router translates a URL into a series of nested templates, each backed by a model. As the templates or models being shown to the user change, Ember automatically keeps the URL in the browser\'s address bar up-to-date.'
    },
    {
      id: 3,
      updated: new Date(1357303260000),
      text: 'A component is a custom HTML tag whose behavior you implement using JavaScript and whose appearance you describe using Handlebars templates. They allow you to create reusable controls that can simplify your application\'s templates.'
    }
  ];

  App.FormatDateComponent = Em.Component.extend({
    formated_date:function() {
      var date = this.get('date');
      var format = this.get('format');
      var moment = require('moment');

      return moment(date).format(format);
    }.property('date', 'format')
  });
});
