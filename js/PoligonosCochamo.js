var sheetsUrlPolygons = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT1mbr5C2zf4xzQ7kjS8YasY7sFkzmm5AMurZKKt3rAQHFNQ1PLRXCf867gBnFztD-ipkpj28SiaDdQ/pub?gid=0&single=true&output=csv";

function addPolygons(data) {

	var polygonCoordinates = JSON.parse(data.geometry);

	const photoList = [data.foto, data.foto2, data.foto3, data.foto4, data.foto5]

	const videoList = [{video: data.video, minVid: data.minVid}, {video: data.video2, minVid: data.minVid2}, {video: data.video3, minVid: data.minVid3}, {video: data.video4, minVid: data.minVid4}, {video: data.video5, minVid: data.minVid5}]

	var filteredVideoList = videoList.map((videoObj) => {
		if (videoObj.video !== undefined && videoObj.video !== ' ' && videoObj.video !== '') {
			videoObj.minVid ? videoObj.minVid : videoObj.minVid ='images/ytlogo.png'
			return videoObj
		}
	})

	const videoObjEntries = Object.entries(filteredVideoList)
	const videoObjNotUndefined = videoObjEntries.filter(([key,val]) => val !== undefined)
	const videoObjOutput = Object.fromEntries(videoObjNotUndefined)
	filteredVideoList = Object.values(videoObjOutput)

	const filteredPhotoList = photoList.filter(foto => {
		return foto
	})

	// console.log('PHOTO LIST', filteredPhotoList)
	// console.log('VIDEO LIST', filteredVideoList)

	var polygons = {
		"type": "FeatureCollection",
		"features": []
	}

	var PolygonsGeologico = {
		"color": "#1f140f",
		"weight": 2,
		"opacity": 1,
		"fillColor": "#ff0000",
		"fillOpacity": 0.9,
		"pane": "PolygonsPane"
	}

	var PolygonsEcologico = {
		"color": "#1f140f",
		"weight": 2,
		"opacity": 1,
		"fillColor": "#79e83d",
		"fillOpacity": 0.9,
		"pane": "PolygonsPane"
	}

	var PolygonsBiologico = {
		"color": "#1f140f",
		"weight": 2,
		"opacity": 1,
		"fillColor": "#f3bb3b",
		"fillOpacity": 0.9,
		"pane": "PolygonsPane"
	}

	var PolygonsHidrologico = {
		"color": "#1f140f",
		"weight": 2,
		"opacity": 1,
		"fillColor": "#0084a8",
		"fillOpacity": 0.9,
		"pane": "PolygonsPane"
	}

	const featureObject = {
		"type": "Feature",
		"geometry": {
			"type": "MultiPolygon",
			"coordinates": polygonCoordinates
		},
		"properties": {
			"Elemento": data.elemento,
			"Categoria": data.categoria,
			"Subcategoria": data.subcategoria,
			"Ubicacion": data.ubicacion,
			"Descripcion": data.descripcion,
			"Significacion": data.significacion,
			"Referencias": data.referencias,
			"Registro": data.registro,
			"Hipervinculo": data.hipervinculo
		}
	}

	if (filteredPhotoList.length >= 1) {
		featureObject.properties["Foto"] = filteredPhotoList
		polygons.features.push(featureObject);
	} else {
		featureObject.properties["Video"] = filteredVideoList
		polygons.features.push(featureObject);
	}

	PolygonMarkers = L.geoJSON(polygons, {

		style: function (Feature) {
			switch (Feature.properties.Subcategoria) {
				case "Geológico": return PolygonsGeologico;
				case "Ecológico": return PolygonsEcologico;
				case "Biológico": return PolygonsBiologico;
				case "Hidrológico": return PolygonsHidrologico;
			}
		},

		onEachFeature: function (Feature, layer) {

			layer.bindPopup("<b>" + Feature.properties.Elemento + "</b>");
			layer.bindTooltip("<b>" + Feature.properties.Elemento + "</b>", { sticky: true });

			if (Feature.properties.Foto) {
				layer.on({ click: openSidebarWithPhoto });
				function openSidebarWithPhoto(e) {
					var photoContent = ''
					Feature.properties.Foto.forEach(photo => { photoContent += '<li class=splide__slide><img src=' + photo + ' alt=""></li>' })

					const polygonPhotoContent = '<h3>' +
						'<a href=' + Feature.properties.Hipervinculo +
						' target=_blank>' + Feature.properties.Elemento +
						'</a></h3>' + '<section id="image-carousel" class="splide" aria-label="Beautiful Images">' +
						'<div class="splide__track">' + '<ul class="splide__list">' + photoContent +
						'</ul>' + '</div>' + '</section>' + '<p>' + Feature.properties.Descripcion +
						'</p>' + '<ul>' + '<li><b>Ubicaci&oacute;n:&nbsp;</b>' +
						Feature.properties.Ubicacion + '</li>' +
						'<li><b>Significaci&oacute;n cultural:&nbsp;</b>' +
						Feature.properties.Significacion + '</li>' +
						'<li><b>Referencias Bibliogr&aacute;ficas:&nbsp;</b>' +
						Feature.properties.Referencias + '<li><b>Registro:&nbsp;</b>' +
						Feature.properties.Registro + '</li>' + '</ul>'

					sidebar.show();
					{
						sidebar.setContent(polygonPhotoContent)
						new Splide('#image-carousel').mount();
					}
				};
			} else if (Feature.properties.Video) {
				layer.on({ click: openSidebarWithVideo });
				function openSidebarWithVideo(e) {
					var videoContent = ''
					Feature.properties.Video.forEach(videoObject => { videoContent += '<li class="splide__slide" data-splide-youtube="' + videoObject.video + '">' + '<img src=' + videoObject.minVid + '>' + '</li>' })

					const polygonVideoContent = '<h3>' +
						'<a href=' + Feature.properties.Hipervinculo +
						' target=_blank>' + Feature.properties.Elemento +
						'</a></h3>' + '<div class="splide">' + '<div class="splide__track">' +
						'<ul class="splide__list">' + videoContent +
						'</ul>' + '</div>' + '</div>' + '<p>' + Feature.properties.Descripcion +
						'</p>' + '<ul>' + '<li><b>Ubicaci&oacute;n:&nbsp;</b>' +
						Feature.properties.Ubicacion + '</li>' +
						'<li><b>Significaci&oacute;n cultural:&nbsp;</b>' +
						Feature.properties.Significacion + '</li>' +
						'<li><b>Referencias Bibliogr&aacute;ficas:&nbsp;</b>' +
						Feature.properties.Referencias + '<li><b>Registro:&nbsp;</b>' +
						Feature.properties.Registro + '</li>' + '</ul>'

					sidebar.show();
					{
						sidebar.setContent(polygonVideoContent)
						new Splide('.splide').mount( window.splide.Extensions );
					}
				};
			}

			switch (Feature.properties.Subcategoria) {
				case "Geológico": return GeologicoGroup.addLayer(layer);
				case "Ecológico": return EcologicoGroup.addLayer(layer);
				case "Biológico": return BiologicoGroup.addLayer(layer);
				case "Hidrológico": return HidrologicoGroup.addLayer(layer);
			}
		}
	});
}


function init() {
	Papa.parse(sheetsUrlPolygons, {
		download: true,
		header: true,
		skipEmptyLines: true,
		complete: function (polygonsResults) {
			var polygonsData = polygonsResults.data

			polygonsData.map((data, index) => {
				data.geometry ? addPolygons(data) : polygonsData.splice(index, 1)
			})
		}
	})
}

window.addEventListener('DOMContentLoaded', init)
