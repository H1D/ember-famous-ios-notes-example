define( 'fm-view', function(require){ 
  var Surface = require('famous/core/Surface');
  var Transform = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');

  return Em.View.extend({
    initialOrign: [.5, .5],
    initialTransform: Transform.translate(0, 0, 0),
    surfaceProperties: {},
    render: function(buffer) {
      if (!App.get('mainContext')) {
        mainContext = Engine.createContext($('.famous-root').get(0));
        mainContext.setPerspective(200)
        App.set('mainContext', mainContext);
      }
      if (!this.fmSurface) {
        this.fmSurface = new Surface(this.surfaceProperties);

        // should be a better way to map events =)
        this.fmSurface.on('click', (function(_this) {
          return function(e) {
            // remap click is tricky =(
            Em.run.next(function(){
              e.stopPropagation();
              e.target.click();
            });
          };
        })(this));
        this.fmSurface.on('touchmove', (function(_this) {
          return function(e) {
            _this.trigger('touchmove', e);
          };
        })(this));
        this.fmSurface.on('touchstart', (function(_this) {
          return function(e) {
            _this.trigger('touchstart', e);
          };
        })(this));
        this.fmSurface.on('touchend', (function(_this) {
          return function(e) {
            _this.trigger('touchend', e);
          };
        })(this));
        this.fmStateModifier = new StateModifier({
          origin: this.initialOrign,
          transform: this.initialTransform
        });
        App.get('mainContext').add(this.fmStateModifier).add(this.fmSurface);
      }
      this.fmSurface.setContent(buffer._element);
      return this._super.apply(this, arguments);
    },
    destroy: function() {
      // a bit hacky 
      // seems like there is no legit way to remove surfaces
      // https://github.com/Famous/famous/pull/153
      try {
        this.fmSurface.content.remove();
      } catch(e) {}
      this._super.apply(this, arguments);
    }
  });
});
