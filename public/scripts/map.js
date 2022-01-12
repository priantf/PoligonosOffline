
(() => {
	'use strict'
	// SERVICEWORKER
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js').then(registration => {
                console.log('ServiceWorker registrado com sucesso: ', registration.scope);
            }, function (err) {
                console.error('Sem suporte para ServiceWorker: ', err);
            });
        })
    }
	
	async function getData(url){
		return fetch(url, {
			method: 'GET'
		})
		.then(function(response){
			return response.json()
		})
		.then(function(data){
			return JSON.stringify(data);
		})
		.catch(function(err) {
			console.log(`Error: ${err}`)
		});
	};

	async function getLayer(map){
		
		if(navigator.onLine && !localStorage.hasOwnProperty('features')){

			let jsonFeature = await getData('/node/projeto/getGeomData');
			
			let request = window.indexedDB.open("Poligonos", 1);
			request.onerror = function (event) {
				console.error("Erro ao abrir o banco de dados", event);
			}
			request.onupgradeneeded = function (event) {
                console.log("Atualizando");
                let db = event.target.result;
                var objectStore = db.createObjectStore("poligonos", { keyPath: "id" });
            };
			request.onsuccess = function (event) {
				console.log("Banco de dados aberto com sucesso");
				let db = event.target.result;

				var transaction = db.transaction(["poligonos"], "readwrite");
				var objectStore = transaction.objectStore("poligonos");

				objectStore.delete(0);
				objectStore.add({id: 0, jsonFeature: JSON.parse(jsonFeature)});

				localStorage.setItem('features', true);
			}

			let geoJSONLayer = JSON.parse(jsonFeature);

			let vectorLayer = new ol.layer.Vector({
				source: new ol.source.Vector({
					features: new ol.format.GeoJSON().readFeatures(geoJSONLayer)
				})
			});

			map.addLayer(vectorLayer);

		}else{
			if(localStorage.hasOwnProperty('features')){
				
				let vectorLayer;
				let request = window.indexedDB.open("Poligonos", 1);
				request.onerror = function (event) {
					console.error("Erro ao abrir o banco de dados", event);
				}
				request.onupgradeneeded = function (event) {
					console.log("Atualizando");
					let db = event.target.result;
					var objectStore = db.createObjectStore("poligonos", { keyPath: "id" });
				};
				request.onsuccess = function (event) {
					console.log("Banco de dados aberto com sucesso");
					let db = event.target.result;

					var transaction = db.transaction(["poligonos"], "readwrite");
					var objectStore = transaction.objectStore("poligonos");

					objectStore.openCursor().onsuccess = function(event) {
						var cursor = event.target.result;
						if (cursor) {
							let geoJSONLayer = cursor.value.jsonFeature
	
							vectorLayer = new ol.layer.Vector({
								source: new ol.source.Vector({
									features: new ol.format.GeoJSON().readFeatures(geoJSONLayer)
								})
							});

							map.addLayer(vectorLayer);
							cursor.continue();
						}
					}
				}
			}else{
				console.log('Nenhum dado encontrado.');
			}
		}
	};


	async function createMap(){
		
		let mapSource = new ol.layer.Tile({
			source: new ol.source.OSM()
		});
	
		let layers =  [
			mapSource
		];
		
		proj4.defs(
			'EPSG:4326',
			'+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees'
		);
	
		ol.proj.proj4.register(proj4);

		let view;

		view = new ol.View({
			center: [-48.57317,-22.30890], 
			zoom: 12,
			projection: 'EPSG:4326'
		});
	

		const map = new ol.Map({
			target: 'map',
			layers: layers,
			view: view
		});

		await getLayer(map);
	};

	window.addEventListener('load', async () => {
		
		if (!window.indexedDB) {
			console.error("Sem suporte para IndexedDB");
		}

		await createMap();
		
	});
	
})();