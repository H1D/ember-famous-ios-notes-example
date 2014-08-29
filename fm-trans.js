define( 'fm-trans', function(require){ 
  return Em.Mixin.create({
    fmTransform: function(transform, method, immediate) {
      if (immediate == null) {
        immediate = false;
      }
      if (immediate) {
        this.fmStateModifier.halt();
      }
      return new Em.RSVP.Promise((function(_this) {
        return function(resolve, reject) {
          return _this.fmStateModifier.setTransform(transform, method, function() {
            return resolve(_this);
          });
        };
      })(this));
    }
  });
});
