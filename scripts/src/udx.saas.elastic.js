/**
 * Client Elastic
 *
 * @version 0.1.0
 * @returns {Object}
 */
define( 'udx.saas.elastic', [ 'udx.utility', 'elastic.client' ], function() {
  console.debug( 'udx.saas.elastic', 'loaded' );

  var _local = window.ejs;

  window.ejs = null;

  //console.log( '_local', _local );

  function Elastic( options ) {
    console.debug( 'udx.saas.elastic', 'created' );

    _local.client = {
      get: function() {
        console.log( 'get', arguments );
      },
      set: function() {
        console.log( 'set', arguments );
      }
    };

    return _local;

    //return this;

  }

  /**
   * Elastic Instance Properties.
   *
   */
  Object.defineProperties( Elastic.prototype, {
    setItem: {
      value: function setItem( key, value ) {
        return this.get( key, value );
      },
      enumerable: true,
      configurable: true,
      writable: true
    }
  });

  /**
   * Elastic Constructor Properties.
   *
   */
  Object.defineProperties( Elastic, {
    create: {
      /**
       *
       * @param name {String|Null}
       * @param options {Object|Null}
       * @returns {settings.Elastic}
       */
      value: function create( name, options ) {
        return new Elastic( name, options )
      },
      enumerable: true,
      configurable: true,
      writable: true
    },
    version: {
      value: '1.0.1',
      enumerable: false,
      writable: false
    }
  });

  return Elastic;

});