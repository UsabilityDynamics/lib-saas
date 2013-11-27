<?php
/**
 * Usability Dynamics RaaS Library
 *
 * @version 0.1.2
 * @module UsabilityDynamics
 */
namespace UsabilityDynamics\RaaS {

  if( !class_exists( 'UsabilityDynamics\RaaS\Job' ) ) {

    /**
     * RaaS Job
     *
     * @author team@UD
     * @version 0.1.2
     * @class RaaS
     * @module RaaS
     * @extends Utility
     */
    class Job extends \UsabilityDynamics\Utility\Job {

      /**
       * Job Instance Defaults.
       *
       * @property $defaults
       * @public
       * @type {Array}
       */
      public static $defaults = array(
        "type" => '_default',
        "post_status" => 'job-ready',
        "post_type" => '_ud_job'
      );

      /**
       * Job Instance ID.
       *
       * @property $_id
       * @private
       * @type {Integer}
       */
      private $_id = null;

      /**
       * Job Status.
       *
       * @property $_status
       * @private
       * @type {Integer}
       */
      private $_status = null;

      /**
       * Job Batches.
       *
       * @property $_batches
       * @private
       * @type {Array}
       */
      private $_batches = array();

      /**
       * Job Instance Settings.
       *
       * @property $_settings
       * @private
       * @type {Object}
       */
      private $_settings = stdClass;

      /**
       * Constructor for the Job class.
       *
       * @method __construct
       * @for Job
       * @constructor
       *
       * @param array|\UsabilityDynamics\object $settings array
       *
       * @return \UsabilityDynamics\RaaS\Job
       * @version 0.0.1
       * @since 0.0.1
       */
      public function __construct( $settings = array() ) {

        // Save Settings to Instance, applying defaults.
        $this->_settings = self::defaults( $settings, self::$defaults );

        // Register Job Post Type, if needed.
        $this->_register_post_type();

        // Load job if ID is set.
        if( $this->_settings->id ) {
          return $this->load( $this->_settings->id );
        }

        // Insert Job, get job ID.
        $this->_id = wp_insert_post( $this->_settings );

        // Handle creation error.
        if( $this->_id instanceof WP_Error ) {
          wp_die( $this->_id );
        }

        // Register Worker Callback.
        if( is_callable( $this->_settings->worker )) {
          update_post_meta( $this->_id, 'callback::worker', json_encode( $this->_settings->worker ) );
        }

        // Register Completion Callback.
        if( is_callable( $this->_settings->complete )) {
          update_post_meta( $this->_id, 'callback::complete', json_encode( $this->_settings->complete ) );
        }

        // Reference status.
        $this->_status = $this->_settings->status;

        // Worker.
        return $this;

      }

    }
  }

}