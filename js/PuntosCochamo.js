var sheetsUrlPoints = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTXfUOg9pNPNi2EQiw-iyrLCt8ywM7FhZJaZ3EWpu4rtU4ZmzIajonwZdt-_m1EuLq0d0J0iUIgiuvq/pub?gid=0&single=true&output=csv"

function addPoints(data) {

	var pointsCoordinates = JSON.parse(data.geometry)

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


	var points = {
		"type": "FeatureCollection",
		"features": []
	}

	const featureObject = {
		"type": "Feature",
		"geometry": {
			"type": "MultiPoint",
			"coordinates": pointsCoordinates
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
		points.features.push(featureObject);
	} else {
		featureObject.properties["Video"] = filteredVideoList
		points.features.push(featureObject);
	}

	PointMarkers = L.geoJSON(points, {

		pointToLayer: function (Feature, pointsCoordinates) {
			switch (Feature.properties.Subcategoria) {
				case "Geológico": return L.circleMarker(pointsCoordinates, {
					color: "#1f140f",
					weight: 2,
					radius: 6,
					fillOpacity: 0.9,
					fillColor: "#ff0000",
					pane: "PointsPane"
				});
				case "Ecológico": return L.circleMarker(pointsCoordinates, {
					color: "#1f140f",
					weight: 2,
					radius: 6,
					fillOpacity: 0.9,
					fillColor: "#79e83d",
					pane: "PointsPane"
				});
				case "Biológico": return L.circleMarker(pointsCoordinates, {
					color: "#1f140f",
					weight: 2,
					radius: 6,
					fillOpacity: 0.9,
					fillColor: "#f3bb3b",
					pane: "PointsPane"
				});
				case "Hidrológico": return L.circleMarker(pointsCoordinates, {
					color: "#1f140f",
					weight: 2,
					radius: 6,
					fillOpacity: 0.9,
					fillColor: "#0084a8",
					pane: "PointsPane"
				});
			}
		},

		onEachFeature: function (Feature, layer) {

			layer.bindPopup("<b>" + Feature.properties.Elemento + "</b>");
			layer.bindTooltip("<b>" + Feature.properties.Elemento + "</b>", {sticky: true});
			if (Feature.properties.Foto) {
				layer.on({ click: openSidebarWithPhoto });
				function openSidebarWithPhoto(e) {
					var photoContent = ''
					Feature.properties.Foto.forEach(photo => { photoContent += '<li class=splide__slide><img src=' + photo + ' alt=""></li>' })

					const pointsPhotoContent = '<h3>' +
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
						Feature.properties.Referencias +
						'<li><b>Registro:&nbsp;</b>' + Feature.properties.Registro +
						'</li>' + '</ul>'


					sidebar.show();
					{
						sidebar.setContent(pointsPhotoContent)
						new Splide('#image-carousel').mount();
					}
				}
			} else if (Feature.properties.Video) {
				layer.on({ click: openSidebarWithVideo });
				function openSidebarWithVideo(e) {
					var videoContent = ''
					Feature.properties.Video.forEach(videoObject => { videoContent += '<li class="splide__slide" data-splide-youtube="' + videoObject.video + '">' + '<img src=' + videoObject.minVid + '>' + '</li>' })

					const pointsVideoContent = '<h3>' +
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
						Feature.properties.Referencias +
						'<li><b>Registro:&nbsp;</b>' + Feature.properties.Registro +
						'</li>' + '</ul>'

					sidebar.show();
					{
						sidebar.setContent(pointsVideoContent)
						new Splide('.splide').mount(window.splide.Extensions);
					}
				};
			}
			
			switch (Feature.properties.Subcategoria) {
					case "Geológico": return GeologicoGroup.addLayer(layer);
					case "Ecológico": return EcologicoGroup.addLayer(layer);
					case "Biológico": return BiologicoGroup.addLayer(layer);
					case "Hidrológico": return HidrologicoGroup.addLayer(layer);
			};
		}
	});
}


function init() {
	Papa.parse(sheetsUrlPoints, {
		download: true,
		header: true,
		skipEmptyLines: true,
		complete: function (pointsResults) {
			var pointsData = pointsResults.data

			pointsData.map((data, index) => {
				data.geometry ? addPoints(data) : pointsData.splice(index, 1)
			})
		}
	})
}

window.addEventListener('DOMContentLoaded', init)
