import { Injectable } from '@angular/core';
import  Pusher  from  'pusher-js';
    
   
    @Injectable()
    export class PusherService {
     pusher: any;

    constructor() {
      this.pusher = new Pusher('f42dd5274e96a0b23718', {
        cluster: 'ap2',
        forceTLS: true
      });
    }
    // any time it is needed we simply call this method
    getPusher() {
      return this.pusher;
    }

    
    
    }