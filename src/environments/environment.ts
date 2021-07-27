// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  url: 'http://movilsoluciones_pos.test:8090/api',
  urlImagenes: 'http://movilsoluciones_pos.test:8090',
  urlApi: 'https://vindecoder.p.rapidapi.com/v1.1/decode_vin?vin=',
  pusher_ID: '1238729',
  pusher_KEY: '8d755b2ccdef5cfd6a7b',
  pusher_SECRET: '50fdab06517eca9a7812',
  pusher_HOST: 'movilsoluciones_pos.test:8090',
  pusher_PORT: 6001,
  pusher_CLUSTER: 'us2',
  // url: 'http://mbs.movilsoluciones.com.do/api',
  // urlImagenes: 'http://mbs.movilsoluciones.com.do',
  min: 180000,
  max: 600000
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
