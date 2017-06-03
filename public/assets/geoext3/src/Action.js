/**
	ThongNT
*/
Ext.define('GeoExt.Action', {
    extend: 'Ext.Action',
    alias : 'widget.gx_action',
    control: null,
    activateOnEnable: false,
    deactivateOnDisable: false,
    map: null,
    uScope: null,
    uHandler: null,
    uToggleHandler: null,
    uCheckHandler: null,
    constructor: function(config){
    	// store the user scope and handlers
        this.uScope = config.scope;
        this.uHandler = config.handler;
        this.uToggleHandler = config.toggleHandler;
        this.uCheckHandler = config.checkHandler;
        this.map = config.map;

        config.scope = this;
        config.handler = this.pHandler;
        config.toggleHandler = this.pToggleHandler;
        config.checkHandler = this.pCheckHandler;

        // set control in the instance, the Ext.Action
        // constructor won't do it for us

        this.control = config.control;
        var ctrl = this.control;
        delete config.control;

        this.activateOnEnable = !!config.activateOnEnable;
        delete config.activateOnEnable;
        this.deactivateOnDisable = !!config.deactivateOnDisable;
        delete config.deactivateOnDisable;

        // register "activate" and "deactivate" listeners
        // on the control
        if (ctrl) {
            // If map is provided in config, add control to map.
            if (config.map) {
                //config.map.addControl(ctrl);
                config.map.addInteraction(ctrl);
                delete config.map;
            }
            if((config.pressed || config.checked) && ctrl.map) {
                ctrl.activate();
            }else{
                //console.log("here");
                this.control.setActive(false);
            }
            if (ctrl.active) {
                config.pressed = true;
                config.checked = true;
            }
            ctrl.set('activate', this.onCtrlActivate);
            ctrl.set('deactivate', this.onCtrlDeactivate);
            /*ctrl.events.on({
                activate: this.onCtrlActivate,
                deactivate: this.onCtrlDeactivate,
                scope: this
            });*/
        }

    	this.callParent(arguments);
    },
    /**
     * The private handler.
     *
     * @param {Ext.Component} The component that triggers the handler.
     * @private
     */
    pHandler: function(cmp){
        var ctrl = this.control;
        /*if (ctrl &&
        ctrl.type == OpenLayers.Control.TYPE_BUTTON) {
            ctrl.trigger();
        }
        if (this.uHandler) {
            this.uHandler.apply(this.uScope, arguments);
        }*/
    },

    /**
     * The private toggle handler.
     *
     * @param {Ext.Component} cmp The component that triggers the toggle 
     *     handler.
     * @param {Boolean} state The state of the toggle.
     * @private
     */
    pToggleHandler: function(cmp, state){
        this.changeControlState(state);
        if (this.uToggleHandler) {
            this.uToggleHandler.apply(this.uScope, arguments);
        }
    },

    /**
     * The private check handler.
     *
     * @param {Ext.Component} cmp The component that triggers the check handler.
     * @param {Boolean} state The state of the toggle.
     * @private
     */
    pCheckHandler: function(cmp, state){
        this.changeControlState(state);
        if (this.uCheckHandler) {
            this.uCheckHandler.apply(this.uScope, arguments);
        }
    },

    /**
     * Change the control state depending on the state boolean.
     *
     * @param {Boolean} state The state of the toggle.
     * @private
     */
    changeControlState: function(state){
        var map = this.map;
        //console.log(this.control);
        if(state) {
            if(!this._activating) {
              
                this._activating = true;
                //this.control.activate();
                if(this.control != null){
                    this.control.setActive(true);
                }
                //map.addControl(this.control);

                // update initialConfig for next component created from this action
                this.initialConfig.pressed = true;
                this.initialConfig.checked = true;
                this._activating = false;
            }
        } else {
            if(!this._deactivating) {
               
                this._deactivating = true;
                //this.control.deactivate();
                if(this.control != null){
                    this.control.setActive(false);
                }

                // update initialConfig for next component created from this action
                this.initialConfig.pressed = false;
                this.initialConfig.checked = false;
                this._deactivating = false;
            }
        }
    },

    /**
     * Called when this action's control is activated.
     *
     * @private
     */
    onCtrlActivate: function(){
        var ctrl = this.control;
      
       /* if(ctrl.type == OpenLayers.Control.TYPE_BUTTON) {
            this.enable();
        } else {
            // deal with buttons
            this.safeCallEach("toggle", [true]);
            // deal with check items
            this.safeCallEach("setChecked", [true]);
        }*/
    },

    /**
     * Called when this action's control is deactivated.
     *
     * @private
     */
    onCtrlDeactivate: function(){
        var ctrl = this.control;
        /*if(ctrl.type == OpenLayers.Control.TYPE_BUTTON) {
            this.disable();
        } else {
            // deal with buttons
            this.safeCallEach("toggle", [false]);
            // deal with check items
            this.safeCallEach("setChecked", [false]);
        }*/
    },

   /**
    * Called when the control which should get toggled
    * is not of type OpenLayers.Control.TYPE_BUTTON
    *
    * @private
    */
   safeCallEach: function(fnName, args) {
       var cs = this.items;
       for(var i = 0, len = cs.length; i < len; i++){
           if(cs[i][fnName]) {
               cs[i].rendered ?
                   cs[i][fnName].apply(cs[i], args) :
                   cs[i].on({
                       "render": Ext.Function.bind(cs[i][fnName], cs[i], args),
                       single: true
                   });
           }
       }
   },

   /**
    * Override method on super to optionally deactivate controls on disable.
    *
    * @param {Boolean} v Disable the action's components.
    * @private
    */
   setDisabled : function(v) {
       if (!v && this.activateOnEnable && this.control && !this.control.active) {
           this.control.activate();
       }
       if (v && this.deactivateOnDisable && this.control && this.control.active) {
           this.control.deactivate();
       }
       return GeoExt.Action.superclass.setDisabled.apply(this, arguments);
   }
});