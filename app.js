App = null
define( 'main', function(require){
  // loading famo.us    
  Engine = require('famous/core/Engine')
  Transform = require('famous/core/Transform')
  StateModifier = require('famous/modifiers/StateModifier')
  Transitionable = require('famous/transitions/Transitionable')
  SpringTransition = require('famous/transitions/SpringTransition')

  // register spring transitions
  Transitionable.registerMethod('spring', SpringTransition)

  longSpring = {
      method: 'spring',
      period: 400,
      dampingRatio: 0.3
    }

  // ember App
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

  // App.NoteRoute = Ember.Route.extend({
  //   renderTemplate: function(controller, model) {
  //     this.render('note', {
  //       outlet: 'note',
  //       into: 'application'
  //     });
  //   }
  // });

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

  FmView = require('fm-view');
  FmTransitionable = require('fm-trans');
  // App.NotesView = FmView.extend(FmTransitionable, {
  //   renderNode: Em.computed.alias('App.mainContext'),
  // });
  App.NoteView = FmView.extend(FmTransitionable, {
    classNames: ['selected-note'],
    renderNode: Em.computed.alias('App.mainContext'),
    maxDrugDist: 200,
    surfaceProperties: {
      properties: {
        background: "url('img/handmadepaper.png') repeat"
      }
    },
    dragStart: function(e) {
      var touchobj;
      touchobj = e.changedTouches[0];
      this.set('dragStartPosition', touchobj.clientX);
    }.on('touchstart'),

    dragUpdate: function(e) {
      var touchobj;
      touchobj = e.changedTouches[0];
      App.set('dragPosition', touchobj.clientX - this.get('dragStartPosition'));
    }.on('touchmove'),

    finishDrag: function(){
      if (App.get('dragPosition') > this.get('maxDrugDist') / 2) {
        translate = Transform.translate(this.get('maxDrugDist'), 0, 0);
        rotate = Transform.rotate(0, -(3.14 / 12), 0);
        this.fmTransform( Transform.multiply( translate, rotate ), longSpring );
      } else {
        this.fmTransform( Transform.translate(0, 0, 0), longSpring);
      }
    }.on('touchend'),

    dragReact: function() {
      x =  App.get('dragPosition');
      a = (3.14 / 12) * ( x / this.get('maxDrugDist') )
      translate = Transform.translate(x, 0, 0);
      rotate = Transform.rotate(0, -a, 0);
      this.fmTransform( Transform.multiply( translate, rotate ) );
    }.observes('App.dragPosition')
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
